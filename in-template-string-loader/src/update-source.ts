import { compileHandledom } from "handledom/compiler"
import { findHandledomTemplateStrings } from "./find-handledom-template-strings"

export function updateSource(source: string) {
  const templateStrings = findHandledomTemplateStrings(source)
  templateStrings.reverse()

  let result = source
  for (const templateString of templateStrings) {
    const handledomFunction = compileHandledom(templateString.value)

    // Replace with the compiled code
    result =
      result.substr(0, templateString.start) +
      handledomFunction +
      result.substr(templateString.end)
  }
  return result
}