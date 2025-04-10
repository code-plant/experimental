import {
  StringUnionToString,
  UnionToIntersection,
} from "@this-project/common-util-types";
import { APIRouteBase } from "@this-project/common-util-types/rest/APIRouteBase";
import { ExtractVariablesFromPath } from "@this-project/common-util-types/rest/ExtractVariablesFromPath";

export interface RestOptions {
  customFetch?: typeof fetch;
  headers?: Record<string, string>;
}

export async function rest<
  API extends APIRouteBase,
  TMethod extends APIRouteBase["method"],
  TPath extends [UnionToIntersection<TMethod>] extends [never]
    ? Extract<API, { method: TMethod }>["path"]
    : `Error: method must be one of ${StringUnionToString<
        APIRouteBase["method"]
      >}`
>(
  method: TMethod,
  path: TPath,
  pathVariables: Record<
    ExtractVariablesFromPath<
      Extract<API, { method: TMethod; path: TPath }>["path"]
    >,
    string | number
  >,
  requestType: RequestType<Extract<API, { method: TMethod; path: TPath }>>,
  request: Request<Extract<API, { method: TMethod; path: TPath }>>,
  responseType: Extract<API, { method: TMethod; path: TPath }>["responseType"],
  options: RestOptions = {}
): Promise<
  Extract<
    API,
    { method: TMethod; path: TPath }
  >["responseType"] extends "arrayBuffer"
    ? ArrayBuffer
    : Extract<
        API,
        { method: TMethod; path: TPath }
      >["responseType"] extends "blob"
    ? Blob
    : Extract<
        API,
        { method: TMethod; path: TPath }
      >["responseType"] extends "formData"
    ? FormData
    : Extract<
        API,
        { method: TMethod; path: TPath }
      >["responseType"] extends "text"
    ? string
    : Extract<
        API,
        { method: TMethod; path: TPath }
      >["responseType"] extends "json"
    ? Extract<API, { method: TMethod; path: TPath }> extends {
        response: infer I;
      }
      ? I
      : never
    : never
> {
  const pathWithVariables = path.replace(/:([a-zA-Z]+)/g, (_, key: string) =>
    encodeURIComponent(`${pathVariables[key as keyof typeof pathVariables]}`)
  );
  const queryString = method === "GET" && request && toQueryString(request);
  const response = await (options.customFetch ?? fetch)(
    `${pathWithVariables}${queryString ? "?" + queryString : ""}`,
    {
      method,
      headers: {
        ...options.headers,
        ...(requestTypeMap[requestType] && {
          "Content-Type": requestTypeMap[requestType],
        }),
      },
      body:
        method === "GET" ? undefined : requestFormatter[requestType](request),
    }
  );
  if (!response.ok) {
    throw new Error();
  }
  return (await response[responseType]()) as any;
}

type RequestType<T extends APIRouteBase> = T extends { requestType: infer I }
  ? I
  : "none";

type Request<T extends APIRouteBase> = T extends { requestType: infer I }
  ? I extends "none"
    ? null
    : I extends "text" | "urlEncoded"
    ? string
    : I extends "json" | "formData"
    ? T extends { request: infer J }
      ? J
      : never
    : never
  : null;

function toQueryString(input: any) {
  const query = input || {};
  const keys = Object.keys(query).filter(
    (key) => "undefined" !== typeof query[key]
  );
  return keys
    .map((key) =>
      Array.isArray(query[key])
        ? query[key]
            .map(
              (value) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
            )
            .join("&")
        : `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`
    )
    .join("&");
}

const requestTypeMap: Record<string, string> = {
  json: "application/json",
  urlEncoded: "application/x-www-form-urlencoded",
  text: "text/plain",
};

const requestFormatter = {
  none: () => undefined,
  text: (input: any) =>
    input !== null && typeof input !== "string" ? JSON.stringify(input) : input,
  urlEncoded: toQueryString,
  json: (input: any) => JSON.stringify(input),
  formData: (input: any) =>
    Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      formData.append(
        key,
        property instanceof Blob
          ? property
          : typeof property === "object" && property !== null
          ? JSON.stringify(property)
          : `${property}`
      );
      return formData;
    }, new FormData()),
} as const;
