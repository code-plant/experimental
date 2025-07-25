import { createServer, IncomingMessage } from "node:http";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import cors from "cors";
import express, { json, Router } from "express";
import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import { graphqlUploadExpress } from "graphql-upload-ts";
import { Context } from "./types/Context";

declare global {
  namespace Express {
    interface Request {
      ctx: Context;
    }
  }
}

const IS_PRODUCTION = process.env["NODE_ENV"] !== "development";

async function main() {
  const app = express();
  const server = createServer(app);

  const apolloServer = new ApolloServer({
    schema: new GraphQLSchema({
      query: new GraphQLObjectType({
        name: "MyQuery",
        fields: {
          hello: {
            type: GraphQLString,
            resolve: (source, args, context, info) => (
              console.log({ source, args, context, info }),
              "world"
            ),
          },
        },
      }),
    }),
    introspection: !IS_PRODUCTION,
    includeStacktraceInErrorResponses: !IS_PRODUCTION,
    formatError: (error) => (console.log(error), error),
    plugins: [
      IS_PRODUCTION
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageLocalDefault({
            footer: false,
            embed: { endpointIsEditable: true },
          }),
    ],
  });
  await apolloServer.start();

  async function createContextFromRequest(
    req: IncomingMessage,
  ): Promise<Context> {
    const ip = "" + req.socket.remoteAddress;
    const token = req.headers.authorization;
    return { ip, token };
  }

  app.use("/api/v1", cors(), json(), async (req, res, next) => {
    const ctx = await createContextFromRequest(req);
    req.ctx = ctx;
    const v1Router = Router();
    v1Router.get("/hello", (_, res) => res.end("world"));
    v1Router(req, res, next);
  });

  app.use(
    "/api/graphql",
    cors(),
    json(),
    graphqlUploadExpress(),
    expressMiddleware(apolloServer, {
      context: ({ req }) => createContextFromRequest(req),
    }),
  );

  const port = Number(process.env.PORT) || 3000;
  await new Promise<void>((resolve) => server.listen(port, () => resolve()));

  console.log(`Server started on port ${port}`);
}

main();
