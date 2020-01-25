import { generateCode } from "./js-generator/function-builder"
import { parseHandledom } from "./parser/parse-handledom"

export function compileHandledom(template: string): string {
  const ast = parseHandledom(template)
  return generateCode(ast)
}

export { parseHandledom }

