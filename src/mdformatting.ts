export const sanitizeMilkdownWeirdStuff = (text: string): string => {
  return text.replace("<br />\n", "");
};
