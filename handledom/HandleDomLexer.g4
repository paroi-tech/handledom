lexer grammar HandleDomLexer;

HTML_COMMENT: '<!--' .*? '-->' -> skip;
WS: (' ' | '\t' | '\r'? '\n')+;

VAR_OPEN: '{{' -> pushMode(VAR);
TAG_OPEN: '<' -> pushMode(TAG_BEGIN);
END_TAG_OPEN: '</' -> pushMode(END_TAG_BEGIN);
TEXT_CONTENT: (~('<' | '{') | ('{' ~('<' | '{')))+;

mode TAG_BEGIN;

EMPTY_TAG_NAME:
  (
    [Aa] [Rr] [Ee] [Aa]
    | [Bb] [Aa] [Ss] [Ee]
    | [Bb] [Rr]
    | [Cc] [Oo] [Ll]
    | [Ee] [Mm] [Bb] [Ee] [Dd]
    | [Hh] [Rr]
    | [Ii] [Mm] [Gg]
    | [Ii] [Nn] [Pp] [Uu] [Tt]
    | [Ll] [Ii] [Nn] [Kk]
    | [Mm] [Ee] [Tt] [Aa]
    | [Pp] [Aa] [Rr] [Aa] [Mm]
    | [Ss] [Oo] [Uu] [Rr] [Cc] [Ee]
    | [Tt] [Rr] [Aa] [Cc] [Kk]
    | [Ww] [Bb] [Rr]
  ) -> popMode, pushMode(TAG);

TAG_NAME: ([a-zA-Z] [a-zA-Z0-9_\-]*) -> popMode, pushMode(TAG);

mode TAG;

TAG_HTML_COMMENT: '<!--' .*? '-->' -> skip;
TAG_WS: (' ' | '\t' | '\r'? '\n')+;

TAG_CLOSE: '>' -> popMode;
TAG_SLASH_CLOSE: '/>' -> popMode;
ATTR_NAME: [a-zA-Z:] [a-zA-Z0-9$_:\-]*;
ATTR_EQ: '=';
ATTR_STRING: '"' (~["])* '"';
ATTR_STRING_SINGLE_QUOTE: '\'' (~['])* '\'';
TAG_VAR_OPEN: '{{' -> pushMode(VAR);

mode END_TAG_BEGIN;

END_TAG_NAME: ([a-zA-Z] [a-zA-Z0-9_-]*);
END_TAG_CLOSE: '>' -> popMode;

mode VAR;
VAR_WS: (' ' | '\t' | '\r'? '\n')+;
VAR_CLOSE: '}}' -> popMode;
VAR_NAME: [a-zA-Z_$] [a-zA-Z0-9_$]*;
