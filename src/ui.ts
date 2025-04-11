import { formatWiki } from "./formatting";

// This is all legacy code to render wiki-formatted code as HTML

export const htmlEscape = (unsafe: string): string => {
  let safe = String(unsafe);
  safe = safe
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return safe;
};

export const renderNoteTextHtml = (text: string): string => {
  // replace '[http' with '[rmhttp'
  const urlRegEx1 = /(\[http)/gi;
  text = text.replace(urlRegEx1, "[rmhttp");

  // put link in square brackets
  const urlRegEx2 =
    // eslint-disable-next-line no-useless-escape
    /(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;
  text = text.replace(urlRegEx2, "[$1]");

  // replace '[rmhttp' with '[http'
  const urlRegEx3 = /(\[rmhttp)/gi;
  text = text.replace(urlRegEx3, "[http");

  return formatWiki(text);
};
