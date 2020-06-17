// @ts-ignore
import { HandleDomLexer } from "../../antlr-parser/HandleDomLexer.js"
// @ts-ignore
import { HandleDomParser } from "../../antlr-parser/HandleDomParser.js"
import { AstElement } from "../../types/ast"
import AstExtractor from "./AstExtractor"
const { CommonTokenStream, InputStream, tree } = require("antlr4")

export function parseHandledom(source: string): AstElement {
  const chars = new InputStream(source)
  const lexer = new HandleDomLexer(chars)
  const tokens = new CommonTokenStream(lexer)
  const parser = new HandleDomParser(tokens)

  parser.buildParseTrees = true

  const errors: string[] = []
  const errorListener = {
    syntaxError(
      recognizer: unknown,
      offendingSymbol: unknown,
      line: number,
      column: number,
      msg: string,
      e: any
    ) {
      errors.push(`Syntax error at line ${line}:${column}, ${msg}`)
    }
  }
  lexer.removeErrorListeners()
  lexer.addErrorListener(errorListener)
  parser.removeErrorListeners()
  parser.addErrorListener(errorListener)

  const template = parser.template()

  if (errors.length > 0)
    throw new Error(errors.join("\n"))

  const extractor = new AstExtractor()
  tree.ParseTreeWalker.DEFAULT.walk(extractor, template)

  return extractor.root!
}
