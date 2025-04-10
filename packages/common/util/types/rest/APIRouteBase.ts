export type APIRouteBase = (
  | {
      method: "GET";
      path: string;
      requestType?: never;
      request?: Record<string, string>;
    }
  | {
      method: "POST" | "PUT" | "DELETE" | "PATCH";
      path: string;
      requestType: "none" | "text" | "urlEncoded";
      request?: never;
    }
  | {
      method: "POST" | "PUT" | "DELETE" | "PATCH";
      path: string;
      requestType: "json";
      request: any;
    }
  | {
      method: "POST" | "PUT" | "DELETE" | "PATCH";
      path: string;
      requestType: "formData";
      request: Record<string, any>;
    }
) &
  (
    | {
        responseType: "arrayBuffer" | "blob" | "formData" | "text";
        response?: never;
      }
    | {
        responseType: "json";
        response: any;
      }
  );
