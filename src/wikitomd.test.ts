import { wiki2md } from "./wikitomd";

test("trivial formatting", () => {
  const text = "Hello *world*!";
  const expectedText = "Hello **world**!\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("basic formatting", () => {
  const text =
    "As a regular user, I want to be able to use basic formatting options to control how the text is rendered on the webpage.\n\n* *bold* is rendered as &lt;b&gt;bold&lt;/b&gt;\n* _italics_ is rendered as &lt;i&gt;italics&lt;/i&gt;\n* --deleted-- is rendered as &lt;del&gt;deleted&lt;/del&gt;\n* ++underline++ is rendered as &lt;u&gt;underline&lt;/u&gt;\n* ^superscript^ is rendered as &lt;sup&gt;superscript&lt;/sup&gt;\n* ~subscript~ is rendered as &lt;sub&gt;subscript&lt;/sub&gt;";
  const expectedText =
    "As a regular user, I want to be able to use basic formatting options to control how the text is rendered on the webpage.\n\n- **bold** is rendered as &lt;b&gt;bold&lt;/b&gt;\n- *italics* is rendered as &lt;i&gt;italics&lt;/i&gt;\n- ~~deleted~~ is rendered as &lt;del&gt;deleted&lt;/del&gt;\n- underline is rendered as &lt;u&gt;underline&lt;/u&gt;\n- ^superscript^ is rendered as &lt;sup&gt;superscript&lt;/sup&gt;\n- ~subscript~ is rendered as &lt;sub&gt;subscript&lt;/sub&gt;\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("bold formatting", () => {
  const text =
    "*bold* text at the beginning of the text\n*bold* text at the beginning of the line\nThis is a *bold* word in the middle of the text\nThis is a *long bold text* consisting of several words\nThis is a b*o*ld o letter in the middle of the text\nThis is a **bold** text, with a double-star\n* this is list item\nThis is not a * bold* text, because there is a whitespace after star\nThis is not a *bold text, because there is no second star on the same line";
  const expectedText =
    "**bold** text at the beginning of the text\n**bold** text at the beginning of the line\nThis is a **bold** word in the middle of the text\nThis is a **long bold text** consisting of several words\nThis is a b**o**ld o letter in the middle of the text\nThis is a ***bold*** text, with a double-star\n- this is list item\nThis is not a * bold* text, because there is a whitespace after star\nThis is not a *bold text, because there is no second star on the same line\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("italic formatting", () => {
  const text =
    "_italic_ text at the beginning of the text\n_italic_ text at the beginning of the line\nThis is an _italic_ word in the middle of the text\nThis is a _long italic text_ consisting of several words\nThis is a it_a_lic a letter in the middle of the text\nThis is an __italic__ text, with double-underscore\nThis is not an _ italic_ text, because there is a whitespace after underscore\nThis is not an _italic text, because there is no second underscore on the same line";
  const expectedText =
    "*italic* text at the beginning of the text\n*italic* text at the beginning of the line\nThis is an *italic* word in the middle of the text\nThis is a *long italic text* consisting of several words\nThis is a it*a*lic a letter in the middle of the text\nThis is an _*italic*_ text, with double-underscore\nThis is not an _ italic_ text, because there is a whitespace after underscore\nThis is not an _italic text, because there is no second underscore on the same line\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

// Misnested tags are handled badly now, but I am moving away from wiki formatting
test("bold and italic formatting", () => {
  const text =
    "This text is *bold* and this text is _italic_\nThis text is *_bold and italic_*\nThis text is also _*bold and italic*_, but the formatting is inverse\nThis text is *bold which is also partially _italic_*\nThis text is _italic which is also partially *bold* too_, it's possible\nThis formatting is wrong because *bold and _italic*_ are misnested\nMi*sn_es*te_d tags";
  const expectedText =
    "This text is **bold** and this text is *italic*\nThis text is ***bold and italic***\nThis text is also ***bold and italic***, but the formatting is inverse\nThis text is **bold which is also partially *italic***\nThis text is *italic which is also partially **bold** too*, it's possible\nThis formatting is wrong because **bold and *italic*** are misnested\nMi**sn*es***te**d tags\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("underscore", () => {
  const text = "This is ++part of the text++ that is ++underscored++";
  const expectedText = "This is part of the text that is underscored\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("strikethrough", () => {
  const text =
    "This is --part of the text-- that is --striken through-- and -this part- is not";
  const expectedText =
    "This is ~~part of the text~~ that is ~~striken through~~ and -this part- is not\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("cancel formatting", () => {
  const text =
    "This is *bold* and this is _italic_ formatting.\nThis is {&quot;no *bold* and _italic_ formatting&quot;}*and here there is*\nThis is a link [http://++notedok++.com]. Inside the link formatting doesn't apply\nImmediately after a link [http://notedok.com]*text is formatted*.\nThe {&quot;rest of \nthe _text_\nis not *formatted*";
  const expectedText =
    "This is **bold** and this is *italic* formatting.\nThis is no *bold* and _italic_ formatting**and here there is**\nThis is a link [http://++notedok++.com](http://++notedok++.com). Inside the link formatting doesn't apply\nImmediately after a link [http://notedok.com](http://notedok.com)**text is formatted**.\nThe rest of \nthe _text_\nis not *formatted*\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("links formatting", () => {
  const text =
    "This is an explicit link: [http://notedok.com]\nThe text that will render as link: [redui.net], although it doesn't really work";
  const expectedText =
    "This is an explicit link: [http://notedok.com](http://notedok.com)\nThe text that will render as link: [redui.net](redui.net), although it doesn't really work\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("lists formatting 1", () => {
  const text = "* item 1\n* item 2\n* item 3";
  const expectedText = "- item 1\n- item 2\n- item 3\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("lists formatting 2", () => {
  const text = "* item 1\n* item 2\nThis line breaks the list\n* item 3";
  const expectedText =
    "- item 1\n- item 2\nThis line breaks the list\n- item 3\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("lists formatting 3", () => {
  const text = "* item 1\n- item 2\n* item 3";
  const expectedText = "- item 1\n- item 2\n- item 3\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

// Inline code should in theory use ` and not ```
test("list item formatting", () => {
  const text =
    "List with formatting inside:\n* *Bold* item\n* Item _italic_\n* Item with {code}code{code} inside";
  const expectedText =
    "List with formatting inside:\n- **Bold** item\n- Item *italic*\n- Item with ```code``` inside\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("cancel list formatting", () => {
  const text =
    "Not a list:\n{&quot;\n* not an item\n* not an item either\n&quot;}";
  const expectedText = "Not a list:\n\n* not an item\n* not an item either\n\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("code block", () => {
  const text =
    "This is code block:\n\n{code}\nfunction tryAnchor(): void {\n	var nextChar = _text[_pos + 1];\n	// The link opening bracket is immediately followed by the link\n	if (nextChar !== &quot;[&quot; && !WHITESPACE.test(nextChar) && !NEWLINE.test(nextChar)) {\n		// There is a closing bracket\n		var closingBracketPos = _text.indexOf(&quot;]&quot;, _pos + 1);\n		if (closingBracketPos > 0 && _text.indexOf(&quot;\n&quot;, _pos + 1) > closingBracketPos) {\n			// The closing character is before &quot;<&quot; on the same line\n			if (_text.indexOf(&quot;<&quot;, _pos + 1) == -1 || _text.indexOf(&quot;<&quot;, _pos + 1) > closingBracketPos) {\n				var href = _text.substring(_pos + 1, closingBracketPos);\n				var link = &quot;<a href='&quot; + href + &quot;' target='_blank'>&quot; + href + &quot;</a>&quot;;\n				_text = _text.substring(0, _pos) + link + _text.substring(closingBracketPos + 1);\n				_pos = closingBracketPos + link.length - href.length - 2; // 1 removed char, 1 char back from the closing bracket\n			}\n		}\n	}\n}{code}";
  const expectedText =
    "This is code block:\n\n```\nfunction tryAnchor(): void {\n	var nextChar = _text[_pos + 1];\n	// The link opening bracket is immediately followed by the link\n	if (nextChar !== &quot;[&quot; && !WHITESPACE.test(nextChar) && !NEWLINE.test(nextChar)) {\n		// There is a closing bracket\n		var closingBracketPos = _text.indexOf(&quot;]&quot;, _pos + 1);\n		if (closingBracketPos > 0 && _text.indexOf(&quot;\n&quot;, _pos + 1) > closingBracketPos) {\n			// The closing character is before &quot;<&quot; on the same line\n			if (_text.indexOf(&quot;<&quot;, _pos + 1) == -1 || _text.indexOf(&quot;<&quot;, _pos + 1) > closingBracketPos) {\n				var href = _text.substring(_pos + 1, closingBracketPos);\n				var link = &quot;<a href='&quot; + href + &quot;' target='_blank'>&quot; + href + &quot;</a>&quot;;\n				_text = _text.substring(0, _pos) + link + _text.substring(closingBracketPos + 1);\n				_pos = closingBracketPos + link.length - href.length - 2; // 1 removed char, 1 char back from the closing bracket\n			}\n		}\n	}\n}```\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("headers 1", () => {
  const text =
    "! header 1\n\nThis is not a header!\n\n!! header 1.1\n\n ! Not a header\n\n!! header 1.2\n\n!Not a header neither";
  const expectedText =
    "# header 1\n\nThis is not a header!\n\n## header 1.1\n\n ! Not a header\n\n## header 1.2\n\n!Not a header neither\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});

test("headers 2", () => {
  const text =
    "h1. header 1\n\nThis is not a header h1.\n\nh2. header 1.1\n\n h2. Not a header\n\nh2. header 1.2\n\nh1.Not a header neither";
  const expectedText =
    "# header 1\n\nThis is not a header h1.\n\n## header 1.1\n\n h2. Not a header\n\n## header 1.2\n\nh1.Not a header neither\n";

  const formattedText = wiki2md(text);

  expect(formattedText).toBe(expectedText);
});
