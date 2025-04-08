// const baseUrl = "https://notedok.artemkv.net:8100";
const baseUrl = "http://127.0.0.1:8100";

export class ApiError extends Error {
  statusCode: number;
  statusMessage: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(statusCode: number, statusMessage: string, ...params: any[]) {
    // Pass remaining arguments (including vendor specific ones) to parent constructor
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
  }
}

// TODO: here I am losing the error text, if any was sent in the body
function handleErrors(response: Response) {
  if (response.status < 400) {
    return response;
  }
  throw new ApiError(response.status, response.statusText, response.statusText);
}

interface StringMap {
  [index: string]: string;
}

interface Data {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

function toJson(response: Response) {
  return response.json();
}

function toText(response: Response) {
  return response.text();
}

function toData(json: Data) {
  return json.data;
}

const CONTENT_TYPE_JSON = "application/json";
const CONTENT_TYPE_TEXT = "text/plain; charset=utf-8";

function get(endpoint: string, session?: string) {
  const headers: StringMap = {};
  if (session) {
    headers["x-session"] = session;
  }

  return fetch(baseUrl + endpoint, {
    mode: "cors",
    headers,
  }).then(handleErrors);
}

function post(
  endpoint: string,
  content: Uint8Array | string,
  contentType: string,
  session?: string
) {
  const headers: StringMap = {
    "Content-Type": contentType,
  };
  if (session) {
    headers["x-session"] = session;
  }

  return fetch(baseUrl + endpoint, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    headers,
    body: content,
  }).then(handleErrors);
}

function put(
  endpoint: string,
  content: Uint8Array | string,
  contentType: string,
  session?: string
) {
  const headers: StringMap = {
    "Content-Type": contentType,
  };
  if (session) {
    headers["x-session"] = session;
  }

  return fetch(baseUrl + endpoint, {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    headers,
    body: content,
  }).then(handleErrors);
}

function deleteObject(endpoint: string, session?: string) {
  const headers: StringMap = {};
  if (session) {
    headers["x-session"] = session;
  }

  return fetch(baseUrl + endpoint, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    headers,
  }).then(handleErrors);
}

export const signIn = async (idToken: string) => {
  const body = { id_token: idToken };

  const response = await post(
    "/signin",
    JSON.stringify(body),
    CONTENT_TYPE_JSON
  );
  const json = await toJson(response);
  return toData(json);
};

export const getFiles = async (
  session: string,
  pageSize: number,
  continuationToken: string
) => {
  const response = await get(
    `/files?pageSize=${pageSize}&continuationToken=${continuationToken}`,
    session
  );
  const json = await toJson(response);
  return toData(json);
};

export const getFile = async (session: string, filename: string) => {
  const response = await get(`/files/${encodeURIComponent(filename)}`, session);
  const text = await toText(response);
  return text;
};

export const postFile = async (
  session: string,
  filename: string,
  content: Uint8Array
) => {
  const response = await post(
    `/files/${encodeURIComponent(filename)}`,
    content,
    CONTENT_TYPE_TEXT,
    session
  );
  const text = await toText(response);
  return text;
};

export const putFile = async (
  session: string,
  filename: string,
  content: Uint8Array
) => {
  const response = await put(
    `/files/${encodeURIComponent(filename)}`,
    content,
    CONTENT_TYPE_TEXT,
    session
  );
  const text = await toText(response);
  return text;
};

export const renameFile = async (
  session: string,
  filename: string,
  newFilename: string
) => {
  const body = {
    fileName: encodeURIComponent(filename),
    newFileName: encodeURIComponent(newFilename),
  };

  const response = await post(
    `/rename`,
    JSON.stringify(body),
    CONTENT_TYPE_JSON,
    session
  );
  return response;
};

export const deleteFile = async (session: string, filename: string) => {
  const response = await deleteObject(
    `/files/${encodeURIComponent(filename)}`,
    session
  );
  return response;
};
