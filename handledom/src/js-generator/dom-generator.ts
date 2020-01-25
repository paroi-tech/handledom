import { AstElement } from "../../types/ast"
import { GeneratedVariable } from "./generated-variables"

const encodeString = JSON.stringify

export function generateDomCode(genVariables: GeneratedVariable[]) {
  const refs = {}
  let canBeUpdated = false
  const body: string[] = []

  for (const { varName, parentVarName, node } of genVariables) {
    if (typeof node === "string") {
      body.push(`const ${varName}=document.createTextNode(${encodeString(node)});`)
      body.push(`${parentVarName}.appendChild(${varName});`)
    } else if (node.nodeType === "variable") {
      canBeUpdated = true
      body.push(`const ${varName}=document.createTextNode("");`)
      body.push(`${parentVarName}.appendChild(${varName});`)
      body.push(`getCbArray("${node.variableName}").push(v=>${varName}.nodeValue=v);`)
    } else {
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

function generateElementContentCode(node: AstElement, varName: string, refs: object) {
  const content: string[] = []
  let canBeUpdated = false

  for (const attr of (node.attributes || [])) {
    if (attr.name === "h-ref") {
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
      content.push(
        `getCbArray("${property}").push(v=>${varName}.setAttribute(${encodeString(attr.name)},v));`
      )
      canBeUpdated = true
    }
  }

  return { content, canBeUpdated }
}

function updateRefs(refs: object, varName: string, ref: string) {
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
    throw new Error(`Missing value for 'h-ref' attribute on ${tagName} tag`)
  if (typeof value !== "string")
    throw new Error(`'h-ref' attribute cannot be a variable`)
  if (!/^[a-zA-z_$][\w$]*$/.test(value))
    throw new Error(`Invalid 'h-ref' attribute value: ${value}`)
}