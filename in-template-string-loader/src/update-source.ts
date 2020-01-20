import { compileHandledom } from "handledom/compiler"
import { findHandledomTemplateString } from "./find-handledom-template-string"

export function updateSource(source: string) {
  const templateString = findHandledomTemplateString(source)
  if (!templateString)
    return source

  const handledomFunction = compileHandledom(templateString.value)

  // Replace the template string by function
  let result = source
  result =
    result.substr(0, templateString.start) +
    handledomFunction +
    result.substr(templateString.end)

  return result
}