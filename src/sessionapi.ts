import * as api from "./restapi";

const SESSION_KEY = "notedok_session";

let _idToken: string = "";

export const setIdToken = (idToken: string) => {
  _idToken = idToken;
};

export const cleanIdToken = () => {
  _idToken = "";
  killSession();
};

function hasToken(): boolean {
  return _idToken !== "";
}

function getSession(): string {
  let session = localStorage.getItem(SESSION_KEY);
  if (!session) {
    session = "";
  }
  return session;
}

function saveSession(session: string) {
  if (!session) {
    session = "";
  }
  localStorage.setItem(SESSION_KEY, session);
}

function killSession() {
  localStorage.removeItem(SESSION_KEY);
}

interface SessionContainer {
  session: string;
}

function handleSession(json: SessionContainer) {
  if (json.session) {
    saveSession(json.session);
  } else {
    killSession();
  }
  return json;
}

function signIn(idToken: string) {
  return api.signIn(idToken).then(handleSession);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function callApi(f: any) {
  return new Promise((resolve, reject) => {
    if (hasToken()) {
      return resolve(_idToken);
    } else {
      return reject(new Error("Id token not found"));
    }
  }).then((idToken) => {
    const session = getSession();
    if (session) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return f().catch((err: any) => {
        if (err.statusCode === 401) {
          return signIn(idToken as string).then(() => {
            return f();
          });
        }
        throw err;
      });
    }
    return signIn(idToken as string).then(() => {
      return f();
    });
  });
}

export const getFiles = (pageSize: number, continuationToken: string) => {
  return callApi(() => {
    return api.getFiles(getSession(), pageSize, continuationToken);
  });
};

export const getFile = (filename: string) => {
  return callApi(() => {
    return api.getFile(getSession(), filename);
  });
};

export const postFile = (filename: string, text: Uint8Array) => {
  return callApi(() => {
    return api.postFile(getSession(), filename, text);
  });
};

export const putFile = (filename: string, text: Uint8Array) => {
  return callApi(() => {
    return api.putFile(getSession(), filename, text);
  });
};

export const renameFile = (filename: string, newFilename: string) => {
  return callApi(() => {
    return api.renameFile(getSession(), filename, newFilename);
  });
};

export const deleteFile = (filename: string) => {
  return callApi(() => {
    return api.deleteFile(getSession(), filename);
  });
};
