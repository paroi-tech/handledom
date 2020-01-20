import { HandledomTemplate } from "../types/dom-types"
import { compileHandledom } from "./api.compiler"

export * from "./api.compiler"

export default function handledom(strings: TemplateStringsArray, ...expressions: string[]): HandledomTemplate {
  let template = strings[0]
  if (strings.length > 1) {
    const [, ...parts] = strings
    for (let i = 0; i < parts.length; ++i) {
      template += expressions[i]
      template += parts[i]
    }
  }
  const code = compileHandledom(template)
  // tslint:disable-next-line: no-eval
  return eval("(" + code + ")")
}
