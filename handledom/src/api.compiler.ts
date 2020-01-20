import { generateCode } from "./function-builder"
import { parseHandledom } from "./parse-handledom"

export function compileHandledom(template: string): string {
  const ast = parseHandledom(template)
  return generateCode(ast)
}

export { parseHandledom }

