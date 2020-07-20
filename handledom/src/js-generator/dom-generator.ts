import { AstElement } from "../../types/ast"
import { GeneratedVariable } from "./generated-variables"

const encodeString = JSON.stringify

export function generateDomCode(genVariables: GeneratedVariable[]) {
  const refs = {}
  let canBeUpdated = false
  const body: string[] = []

  for (const { varName, parentVarName, node, parentNodeName } of genVariables) {
    if (typeof node === "string") {
      if (parentNodeName !== "textarea") {
        body.push(`const ${varName}=document.createTextNode(${encodeString(node)});`)
        body.push(`${parentVarName}.appendChild(${varName});`)
      } else {
        const arr = node.trim().split("\n").map(s => s.trim())
        const content = arr.join("\n")
        body.push(`${parentVarName}.value=${encodeString(content)};`)
      }
    } else if (node.nodeType === "variable") {
      canBeUpdated = true
      if (parentNodeName !== "textarea") {
        body.push(`const ${varName}=document.createTextNode("");`)
        body.push(`${parentVarName}.appendChild(${varName});`)
        body.push(`cbListOf("${node.variableName}").push(v=>${varName}.nodeValue=v);`)
      } else
        body.push(`cbListOf("${node.variableName}").push(v=>${parentVarName}.value=v);`)
    } else {
      if (node.nodeName === "textarea" && node.children && node.children.length !== 1)
        throw new Error(`Syntax for textarea is <textarea>{{ someVar }}</textarea> or <textarea>Some text</textarea>`)
      body.push(`const ${varName}=document.createElement(${encodeString(node.nodeName)});`)
      if (parentVarName)
        body.push(`${parentVarName}.appendChild(${varName});`)
      const { content, canBeUpdated: upd } = generateElementContentCode(node, varName, refs)
      if (upd)
        canBeUpdated = true
      if (content.length !== 0)
        body.push(content.join(""))
    }
  }

  return {
    canBeUpdated,
    refs,
    code: body.join("")
  }
}

function generateElementContentCode(node: AstElement, varName: string, refs: { [handle: string]: unknown }) {
  const content: string[] = []
  let canBeUpdated = false

  for (const attr of (node.attributes || [])) {
    if (attr.name === "h") {
      checkRefAttributeValue(attr.value, node.nodeName)
      updateRefs(refs, varName, attr.value)
    } else if (attr.name === "h-if") {
      // TODO
    } else if (!attr.value || typeof attr.value === "string") {
      const p1 = encodeString(attr.name)
      const p2 = encodeString(attr.value || "")
      content.push(`${varName}.setAttribute(${p1}, ${p2});`)
    } else {
      const property = attr.value.variableName
      if ((node.nodeName === "input" || node.nodeName === "select") && attr.name === "value") {
        content.push(
          `cbListOf("${property}").push(v=>{${varName}.value=v});`
        )
      } else {
        content.push(
          `cbListOf("${property}").push(v=>${varName}.setAttribute(${encodeString(attr.name)},v));`
        )
      }
      canBeUpdated = true
    }
  }

  return { content, canBeUpdated }
}

function updateRefs(refs: { [handle: string]: unknown }, varName: string, ref: string) {
  const obj = refs[ref]
  if (!obj)
    refs[ref] = varName
  else if (Array.isArray(obj))
    obj.push(varName)
  else
    refs[ref] = [obj, varName]
}

function checkRefAttributeValue(value: any, tagName: string): asserts value is string {
  if (!value)
    throw new Error(`Missing value for 'h' attribute on ${tagName} tag`)
  if (typeof value !== "string")
    throw new Error("'h' attribute cannot be a variable")
  if (!/^[a-zA-z_$][\w$]*$/.test(value))
    throw new Error(`Invalid 'h' attribute value: ${value}`)
}
