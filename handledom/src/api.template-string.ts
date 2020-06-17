import { HandledomTemplate } from "../types/dom-types"

export default function handledom(
  strings: TemplateStringsArray,
  ...expressions: string[]
): HandledomTemplate {
  throw new Error(`Configure the webpack loader or use "handledom/browser"`)
}
