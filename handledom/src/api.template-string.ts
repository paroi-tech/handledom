import { HandledomTemplate } from "../types/dom-types"

export default function handledom(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  strings: TemplateStringsArray,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ...expressions: string[]
): HandledomTemplate {
  throw new Error("Configure the webpack loader or use \"handledom/browser\"")
}
