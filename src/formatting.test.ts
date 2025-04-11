import { formatWiki } from "./formatting";

test("trivial formatting", () => {
  const text = "Hello *world*!";
  // for some reason adds the new line at the end, but I'm not going to review this
  const expectedText = "Hello <b>world</b>!\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("basic formatting", () => {
  const text =
    "As a regular user, I want to be able to use basic formatting options to control how the text is rendered on the webpage.\n\n* *bold* is rendered as &lt;b&gt;bold&lt;/b&gt;\n* _italics_ is rendered as &lt;i&gt;italics&lt;/i&gt;\n* --deleted-- is rendered as &lt;del&gt;deleted&lt;/del&gt;\n* ++underline++ is rendered as &lt;u&gt;underline&lt;/u&gt;\n* ^superscript^ is rendered as &lt;sup&gt;superscript&lt;/sup&gt;\n* ~subscript~ is rendered as &lt;sub&gt;subscript&lt;/sub&gt;";
  const expectedText =
    "As a regular user, I want to be able to use basic formatting options to control how the text is rendered on the webpage.\n\n<ul><li><b>bold</b> is rendered as &lt;b&gt;bold&lt;/b&gt;</li>\n<li><i>italics</i> is rendered as &lt;i&gt;italics&lt;/i&gt;</li>\n<li><del>deleted</del> is rendered as &lt;del&gt;deleted&lt;/del&gt;</li>\n<li><u>underline</u> is rendered as &lt;u&gt;underline&lt;/u&gt;</li>\n<li><sup>superscript</sup> is rendered as &lt;sup&gt;superscript&lt;/sup&gt;</li>\n<li><sub>subscript</sub> is rendered as &lt;sub&gt;subscript&lt;/sub&gt;</li></ul>\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("bold formatting", () => {
  const text =
    "*bold* text at the beginning of the text\n*bold* text at the beginning of the line\nThis is a *bold* word in the middle of the text\nThis is a *long bold text* consisting of several words\nThis is a b*o*ld o letter in the middle of the text\nThis is a **bold** text, with a double-star\n* this is list item\nThis is not a * bold* text, because there is a whitespace after star\nThis is not a *bold text, because there is no second star on the same line";
  const expectedText =
    "<b>bold</b> text at the beginning of the text\n<b>bold</b> text at the beginning of the line\nThis is a <b>bold</b> word in the middle of the text\nThis is a <b>long bold text</b> consisting of several words\nThis is a b<b>o</b>ld o letter in the middle of the text\nThis is a *<b>bold</b>* text, with a double-star\n<ul><li>this is list item</li></ul>\nThis is not a * bold* text, because there is a whitespace after star\nThis is not a *bold text, because there is no second star on the same line\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("italic formatting", () => {
  const text =
    "_italic_ text at the beginning of the text\n_italic_ text at the beginning of the line\nThis is an _italic_ word in the middle of the text\nThis is a _long italic text_ consisting of several words\nThis is a it_a_lic a letter in the middle of the text\nThis is an __italic__ text, with double-underscore\nThis is not an _ italic_ text, because there is a whitespace after underscore\nThis is not an _italic text, because there is no second underscore on the same line";
  const expectedText =
    "<i>italic</i> text at the beginning of the text\n<i>italic</i> text at the beginning of the line\nThis is an <i>italic</i> word in the middle of the text\nThis is a <i>long italic text</i> consisting of several words\nThis is a it<i>a</i>lic a letter in the middle of the text\nThis is an _<i>italic</i>_ text, with double-underscore\nThis is not an _ italic_ text, because there is a whitespace after underscore\nThis is not an _italic text, because there is no second underscore on the same line\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("bold and italic formatting", () => {
  const text =
    "This text is *bold* and this text is _italic_\nThis text is *_bold and italic_*\nThis text is also _*bold and italic*_, but the formatting is inverse\nThis text is *bold which is also partially _italic_*\nThis text is _italic which is also partially *bold* too_, it's possible\nThis formatting is wrong because *bold and _italic*_ are misnested\nMi*sn_es*te_d tags";
  const expectedText =
    "This text is <b>bold</b> and this text is <i>italic</i>\nThis text is <b><i>bold and italic</i></b>\nThis text is also <i><b>bold and italic</b></i>, but the formatting is inverse\nThis text is <b>bold which is also partially <i>italic</i></b>\nThis text is <i>italic which is also partially <b>bold</b> too</i>, it's possible\nThis formatting is wrong because <b>bold and _italic</b>_ are misnested\nMi<b>sn_es</b>te_d tags\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("underscore", () => {
  const text = "This is ++part of the text++ that is ++underscored++";
  const expectedText =
    "This is <u>part of the text</u> that is <u>underscored</u>\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("strikethrough", () => {
  const text =
    "This is --part of the text-- that is --striken through-- and -this part- is not";
  const expectedText =
    "This is <del>part of the text</del> that is <del>striken through</del> and -this part- is not\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("cancel formatting", () => {
  const text =
    "This is *bold* and this is _italic_ formatting.\nThis is {&quot;no *bold* and _italic_ formatting&quot;}*and here there is*\nThis is a link [http://++notedok++.com]. Inside the link formatting doesn't apply\nImmediately after a link [http://notedok.com]*text is formatted*.\nThe {&quot;rest of \nthe _text_\nis not *formatted*";
  const expectedText =
    "This is <b>bold</b> and this is <i>italic</i> formatting.\nThis is no *bold* and _italic_ formatting<b>and here there is</b>\nThis is a link <a href='http://++notedok++.com' target='_blank'>http://++notedok++.com</a>. Inside the link formatting doesn't apply\nImmediately after a link <a href='http://notedok.com' target='_blank'>http://notedok.com</a><b>text is formatted</b>.\nThe rest of \nthe _text_\nis not *formatted*\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("links formatting", () => {
  const text =
    "This is an explicit link: [http://notedok.com]\nThe text that will render as link: [redui.net], although it doesn't really work";
  const expectedText =
    "This is an explicit link: <a href='http://notedok.com' target='_blank'>http://notedok.com</a>\nThe text that will render as link: <a href='redui.net' target='_blank'>redui.net</a>, although it doesn't really work\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("lists formatting - stars", () => {
  const text = "* item 1\n* item 2\n* item 3";
  const expectedText =
    "<ul><li>item 1</li>\n<li>item 2</li>\n<li>item 3</li></ul>\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("lists formatting - 2 lists with dashes", () => {
  const text = "* item 1\n* item 2\nThis line breaks the list\n* item 3";
  const expectedText =
    "<ul><li>item 1</li>\n<li>item 2</li></ul>\nThis line breaks the list\n<ul><li>item 3</li></ul>\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("lists formatting - mixed", () => {
  const text = "* item 1\n- item 2\n* item 3";
  const expectedText =
    "<ul><li>item 1</li></ul>\n<ul><li>item 2</li></ul>\n<ul><li>item 3</li></ul>\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("lists formatting - item formatting", () => {
  const text =
    "List with formatting inside:\n* *Bold* item\n* Item _italic_\n* Item with {code}code{code} inside";
  const expectedText =
    "List with formatting inside:\n<ul><li><b>Bold</b> item</li>\n<li>Item <i>italic</i></li>\n<li>Item with <pre class='codeblock'>code</pre> inside</li></ul>\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("cancel lists formatting", () => {
  const text =
    "Not a list:\n{&quot;\n* not an item\n* not an item either\n&quot;}";
  const expectedText = "Not a list:\n\n* not an item\n* not an item either\n\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("code block", () => {
  const text =
    "This is code block:\n\n{code}\nfunction tryAnchor(): void {\n	var nextChar = _text[_pos + 1];\n	// The link opening bracket is immediately followed by the link\n	if (nextChar !== &quot;[&quot; && !WHITESPACE.test(nextChar) && !NEWLINE.test(nextChar)) {\n		// There is a closing bracket\n		var closingBracketPos = _text.indexOf(&quot;]&quot;, _pos + 1);\n		if (closingBracketPos > 0 && _text.indexOf(&quot;\n&quot;, _pos + 1) > closingBracketPos) {\n			// The closing character is before &quot;<&quot; on the same line\n			if (_text.indexOf(&quot;<&quot;, _pos + 1) == -1 || _text.indexOf(&quot;<&quot;, _pos + 1) > closingBracketPos) {\n				var href = _text.substring(_pos + 1, closingBracketPos);\n				var link = &quot;<a href='&quot; + href + &quot;' target='_blank'>&quot; + href + &quot;</a>&quot;;\n				_text = _text.substring(0, _pos) + link + _text.substring(closingBracketPos + 1);\n				_pos = closingBracketPos + link.length - href.length - 2; // 1 removed char, 1 char back from the closing bracket\n			}\n		}\n	}\n}{code}";
  const expectedText =
    "This is code block:\n\n<pre class='codeblock'>\nfunction tryAnchor(): void {\n	var nextChar = _text[_pos + 1];\n	// The link opening bracket is immediately followed by the link\n	if (nextChar !== &quot;[&quot; && !WHITESPACE.test(nextChar) && !NEWLINE.test(nextChar)) {\n		// There is a closing bracket\n		var closingBracketPos = _text.indexOf(&quot;]&quot;, _pos + 1);\n		if (closingBracketPos > 0 && _text.indexOf(&quot;\n&quot;, _pos + 1) > closingBracketPos) {\n			// The closing character is before &quot;<&quot; on the same line\n			if (_text.indexOf(&quot;<&quot;, _pos + 1) == -1 || _text.indexOf(&quot;<&quot;, _pos + 1) > closingBracketPos) {\n				var href = _text.substring(_pos + 1, closingBracketPos);\n				var link = &quot;<a href='&quot; + href + &quot;' target='_blank'>&quot; + href + &quot;</a>&quot;;\n				_text = _text.substring(0, _pos) + link + _text.substring(closingBracketPos + 1);\n				_pos = closingBracketPos + link.length - href.length - 2; // 1 removed char, 1 char back from the closing bracket\n			}\n		}\n	}\n}</pre>\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("headers", () => {
  const text =
    "! header 1\n\nThis is not a header!\n\n!! header 1.1\n\n ! Not a header\n\n!! header 1.2\n\n!Not a header neither";
  const expectedText =
    "<h1>header 1</h1>\n\nThis is not a header!\n\n<h2>header 1.1</h2>\n\n ! Not a header\n\n<h2>header 1.2</h2>\n\n!Not a header neither\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});

test("headers", () => {
  const text =
    "h1. header 1\n\nThis is not a header h1.\n\nh2. header 1.1\n\n h2. Not a header\n\nh2. header 1.2\n\nh1.Not a header neither";
  const expectedText =
    "<h1>header 1</h1>\n\nThis is not a header h1.\n\n<h2>header 1.1</h2>\n\n h2. Not a header\n\n<h2>header 1.2</h2>\n\nh1.Not a header neither\n";

  const formattedText = formatWiki(text);

  expect(formattedText).toBe(expectedText);
});
