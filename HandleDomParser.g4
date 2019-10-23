parser grammar HandleDomParser;

options {
  tokenVocab = HandleDomLexer;
}

template: WS* (htmlEmptyElement | element) WS* EOF;

element:
  TAG_OPEN TAG_NAME attributes TAG_CLOSE WS* content? END_TAG_OPEN END_TAG_NAME END_TAG_CLOSE;

htmlEmptyElement: TAG_OPEN EMPTY_TAG_NAME attributes (TAG_CLOSE | TAG_SLASH_CLOSE);

content: contentUnit WS* (contentUnit WS*)*;

contentUnit: htmlEmptyElement | element | variable | textContent;

attributes: TAG_WS* (attribute (TAG_WS+ attribute)* TAG_WS*)?;

attribute:
  ATTR_NAME ATTR_EQ attributeValue
  | ATTR_NAME;

attributeValue: ATTR_STRING | ATTR_STRING_SINGLE_QUOTE | variable;

variable:
  (VAR_OPEN | TAG_VAR_OPEN) VAR_WS* VAR_NAME VAR_WS* VAR_CLOSE;

textContent: TEXT_CONTENT;
