import {
  decodePathFileSystemFriendly,
  encodePathFileSystemFriendly,
} from "./util";

const TITLE_POSTFIX_SEPARATOR = "~~";

export const isMarkdownFile = (path: string) => {
  return path.endsWith(".md");
};

export const getTitleFromPath = (path: string) => {
  let title = "";
  if (path.endsWith(".txt")) {
    title = path.slice(0, -4);
  }
  if (path.endsWith(".md")) {
    title = path.slice(0, -3);
  }

  const separatorIndex = title.lastIndexOf(TITLE_POSTFIX_SEPARATOR);
  if (separatorIndex >= 0) {
    title = title.substring(0, separatorIndex);
  }

  title = decodePathFileSystemFriendly(title);

  return title;
};

// TODO: maybe split into 3 ones (no title, has title but no need to make unique, has title and needs to be unique)
export const generatePathFromTitleText = (
  title: string,
  ensureUniqie: boolean
) => {
  let postfix = "";
  if (ensureUniqie) {
    const date = new Date();
    const n = date.getTime();
    postfix = TITLE_POSTFIX_SEPARATOR + n;
  }
  return encodePathFileSystemFriendly(title) + postfix + ".txt";
};

// TODO: maybe split into 3 ones (no title, has title but no need to make unique, has title and needs to be unique)
export const generatePathFromTitleMd = (
  title: string,
  ensureUniqie: boolean
) => {
  let postfix = "";
  if (ensureUniqie) {
    const date = new Date();
    const n = date.getTime();
    postfix = TITLE_POSTFIX_SEPARATOR + n;
  }
  return encodePathFileSystemFriendly(title) + postfix + ".md";
};
