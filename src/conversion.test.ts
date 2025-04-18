import {
  generatePathFromTitleMd,
  generatePathFromTitleText,
  getTitleFromPath,
} from "./conversion";

// Title from text files
test("'my file.txt' -> my file", () => {
  const fileName = "my file.txt";
  const expectedTitle = "my file";

  const title = getTitleFromPath(fileName);

  expect(title).toBe(expectedTitle);
});

test("'new note~~1742552941835.txt' -> new note", () => {
  const fileName = "new note~~1742552941835.txt";
  const expectedTitle = "new note";

  const title = getTitleFromPath(fileName);

  expect(title).toBe(expectedTitle);
});

test("'my file (star).txt' -> my file *", () => {
  const fileName = "my file (star).txt";
  const expectedTitle = "my file *";

  const title = getTitleFromPath(fileName);

  expect(title).toBe(expectedTitle);
});

// Title from markdown files

test("'my file.md' -> my file", () => {
  const fileName = "my file.md";
  const expectedTitle = "my file";

  const title = getTitleFromPath(fileName);

  expect(title).toBe(expectedTitle);
});

test("'new note~~1742552941835.md' -> new note", () => {
  const fileName = "new note~~1742552941835.md";
  const expectedTitle = "new note";

  const title = getTitleFromPath(fileName);

  expect(title).toBe(expectedTitle);
});

test("'my file (star).md' -> my file *", () => {
  const fileName = "my file (star).md";
  const expectedTitle = "my file *";

  const title = getTitleFromPath(fileName);

  expect(title).toBe(expectedTitle);
});

// Path for text files

test("'my file' -> my file.txt", () => {
  const title = "my file";
  const expectedPath = "my file.txt";

  const path = generatePathFromTitleText(title, false);

  expect(path).toBe(expectedPath);
});

test("'my file' -> my file~~xxxx.txt", () => {
  const title = "my file";
  const expectedPathPrefix = "my file~~";
  const expectedPathSuffix = ".txt";

  const path = generatePathFromTitleText(title, true);

  expect(path.startsWith(expectedPathPrefix)).toBe(true);
  expect(path.endsWith(expectedPathSuffix)).toBe(true);
});

test("'my file *' -> my file (star).txt", () => {
  const title = "my file *";
  const expectedPath = "my file (star).txt";

  const path = generatePathFromTitleText(title, false);

  expect(path).toBe(expectedPath);
});

// Path for markdown files

test("'my file' -> my file.md", () => {
  const title = "my file";
  const expectedPath = "my file.md";

  const path = generatePathFromTitleMd(title, false);

  expect(path).toBe(expectedPath);
});

test("'my file' -> my file~~xxxx.md", () => {
  const title = "my file";
  const expectedPathPrefix = "my file~~";
  const expectedPathSuffix = ".md";

  const path = generatePathFromTitleMd(title, true);

  expect(path.startsWith(expectedPathPrefix)).toBe(true);
  expect(path.endsWith(expectedPathSuffix)).toBe(true);
});

test("'my file *' -> my file (star).md", () => {
  const title = "my file *";
  const expectedPath = "my file (star).md";

  const path = generatePathFromTitleMd(title, false);

  expect(path).toBe(expectedPath);
});
