import { compileHandledom, parseHandledom } from "./api"

export type HandledomTemplate = (variables?: { [name: string]: any }) => HandledomTemplateInstance

export interface HandledomTemplateInstance {
  root: HTMLElement
  refs: {
    [ref: string]: HTMLElement | HTMLElement[]
  }
  update?(variables: { [name: string]: any }): void
}

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

export { compileHandledom, parseHandledom }

