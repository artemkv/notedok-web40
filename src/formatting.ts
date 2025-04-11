// This is legacy code, I am not going to review it, as I am moving to md support
// This is not going to be used for any newly created notes
export const formatWiki = (wiki: string) => {
  const WHITESPACE = /^\s$/;
  const NEWLINE = /^\n$/;
  const QUOTE = "&quot;";

  let _char = "";
  let _text = "";
  let _pos = -1;

  let _listOpened = false;

  function tryWrap(
    formatingString: string,
    openingTag: string,
    closingTag: string
  ) {
    // Start of the formatting
    if (_text.substr(_pos, formatingString.length) === formatingString) {
      const nextChar = _text[_pos + formatingString.length];
      // The formatting string is immediately followed by the word
      if (
        nextChar !== formatingString[0] &&
        !WHITESPACE.test(nextChar) &&
        !NEWLINE.test(nextChar)
      ) {
        // There is a closing character
        const closingTagPos = _text.indexOf(formatingString, _pos + 1);
        if (
          closingTagPos > 0 &&
          _text.indexOf("\n", _pos + 1) > closingTagPos
        ) {
          // The closing character is before "<" on the same line
          if (
            _text.indexOf("<", _pos + 1) == -1 ||
            _text.indexOf("<", _pos + 1) > closingTagPos
          ) {
            _text =
              _text.substring(0, _pos) +
              openingTag +
              _text.substring(_pos + formatingString.length, closingTagPos) +
              closingTag +
              _text.substring(closingTagPos + formatingString.length);
            _pos = _pos + openingTag.length - formatingString.length;
          }
        }
      }
    }
  }

  function tryEscaped() {
    const openingEscapeTag = "{" + QUOTE;
    const closingEscapeTag = QUOTE + "}";

    // Start of the escaped formatting
    if (_text.substr(_pos, openingEscapeTag.length) === openingEscapeTag) {
      // End of escaping formatting
      let closingEscapeTagPos = _text.indexOf(closingEscapeTag, _pos + 1);
      if (closingEscapeTagPos < 0) {
        closingEscapeTagPos = _text.length;
      }
      _text =
        _text.substring(0, _pos) +
        _text.substring(_pos + openingEscapeTag.length, closingEscapeTagPos) +
        _text.substring(closingEscapeTagPos + closingEscapeTag.length);
      _pos = closingEscapeTagPos - openingEscapeTag.length - 1; //-1 char back from the removed closing tag
    }
  }

  function tryAnchor() {
    const nextChar = _text[_pos + 1];

    // The link opening bracket is immediately followed by the link
    if (
      nextChar !== "[" &&
      !WHITESPACE.test(nextChar) &&
      !NEWLINE.test(nextChar)
    ) {
      // There is a closing bracket
      const closingBracketPos = _text.indexOf("]", _pos + 1);
      if (
        closingBracketPos > 0 &&
        _text.indexOf("\n", _pos + 1) > closingBracketPos
      ) {
        // The closing character is before "<" on the same line
        if (
          _text.indexOf("<", _pos + 1) == -1 ||
          _text.indexOf("<", _pos + 1) > closingBracketPos
        ) {
          const href = _text.substring(_pos + 1, closingBracketPos);
          const link =
            "<a href='" + href + "' target='_blank'>" + href + "</a>";
          _text =
            _text.substring(0, _pos) +
            link +
            _text.substring(closingBracketPos + 1);
          _pos = closingBracketPos + link.length - href.length - 2; // 1 removed char, 1 char back from the closing bracket
        }
      }
    }
  }

  function tryCode() {
    const codeTag = "{code}";

    // Start of the code block
    if (_text.substr(_pos, codeTag.length) === codeTag) {
      // End of the code block
      let closingTagPos = _text.indexOf(codeTag, _pos + 1);
      if (closingTagPos < 0) {
        closingTagPos = _text.length;
      }
      const codeBlock = _text.substring(_pos + codeTag.length, closingTagPos);
      const codeBlockFormatted =
        "<pre class='codeblock'>" + codeBlock + "</pre>";
      _text =
        _text.substring(0, _pos) +
        codeBlockFormatted +
        _text.substring(closingTagPos + codeTag.length);
      _pos =
        closingTagPos +
        codeBlockFormatted.length -
        codeBlock.length -
        codeTag.length -
        1; // 1 char back from the removed closing tag
    }
  }

  function tryUl(formatingString: string) {
    const liTag = formatingString + " ";

    // Start of the text or the line
    if (_pos === 0 || _text[_pos - 1] === "\n") {
      // Start of the list item
      if (_text.substr(_pos, liTag.length) === liTag) {
        // End of escaping formatting
        let eolPos = _text.indexOf("\n", _pos + 1);
        if (eolPos < 0) {
          eolPos = _text.length;
        }

        const liText = _text.substring(_pos + 2, eolPos);
        let wrappedLiText = "<li>" + liText + "</li>";

        if (!_listOpened) {
          wrappedLiText = "<ul>" + wrappedLiText;
          _listOpened = true;
        }

        if (_text.substr(eolPos + 1, liTag.length) !== liTag) {
          wrappedLiText = wrappedLiText + "</ul>";
          _listOpened = false;
        }

        _text =
          _text.substring(0, _pos) + wrappedLiText + _text.substring(eolPos);
      }
    }
  }

  function tryHeader(formatingString: string) {
    let hTag = " ";
    for (let i = 0; i < 6; i++) {
      hTag = formatingString + hTag;

      // Start of the text or the line
      if (_pos === 0 || _text[_pos - 1] === "\n") {
        // Start of the header
        if (_text.substr(_pos, hTag.length) === hTag) {
          // End of escaping formatting
          let eolPos = _text.indexOf("\n", _pos + 1);
          if (eolPos < 0) {
            eolPos = _text.length;
          }

          const hText = _text.substring(_pos + hTag.length, eolPos);
          const wrappedHText =
            "<h" +
            (i + 1).toString() +
            ">" +
            hText +
            "</h" +
            (i + 1).toString() +
            ">";

          _text =
            _text.substring(0, _pos) + wrappedHText + _text.substring(eolPos);
        }
      }
    }
  }

  function tryNumberedHeader() {
    for (let i = 0; i < 6; i++) {
      const hTag = "h" + (i + 1).toString() + ". ";

      // Start of the text or the line
      if (_pos === 0 || _text[_pos - 1] === "\n") {
        // Start of the header
        if (_text.substr(_pos, hTag.length) === hTag) {
          // End of escaping formatting
          let eolPos = _text.indexOf("\n", _pos + 1);
          if (eolPos < 0) {
            eolPos = _text.length;
          }

          const hText = _text.substring(_pos + hTag.length, eolPos);
          const wrappedHText =
            "<h" +
            (i + 1).toString() +
            ">" +
            hText +
            "</h" +
            (i + 1).toString() +
            ">";

          _text =
            _text.substring(0, _pos) + wrappedHText + _text.substring(eolPos);
        }
      }
    }
  }

  // Normalize line ends
  const strings = wiki.split(/\r\n|\n|\r/gm);
  _text = strings.join("\n") + "\n";

  // Length has to be re-calculated every time, because it can change
  for (_pos = 0; _pos < _text.length; _pos++) {
    _char = _text[_pos];

    if (_char === "*") {
      tryWrap("*", "<b>", "</b>");
      tryUl("*");
    } else if (_char === "_") {
      tryWrap("_", "<i>", "</i>");
    } else if (_char === "-") {
      tryWrap("--", "<del>", "</del>");
      tryUl("-");
    } else if (_char === "+") {
      tryWrap("++", "<u>", "</u>");
    } else if (_char === "^") {
      tryWrap("^", "<sup>", "</sup>");
    } else if (_char === "~") {
      tryWrap("~", "<sub>", "</sub>");
    } else if (_char === "{") {
      tryEscaped();
      tryCode();
    } else if (_char === "[") {
      tryAnchor();
    } else if (_char === "!") {
      tryHeader("!");
    } else if (_char === "h") {
      tryNumberedHeader();
    }
  }

  return _text;
};
