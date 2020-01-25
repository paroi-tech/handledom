import { AstElement, AstNode } from "../../types/ast"

const encodeString = JSON.stringify

export function generateCode(root: AstElement) {
  const genVariables = toGeneratedVariables(root)
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

  const refsCode = "{" + Object.entries(refs).map(
    ([k, v]) => `${k}:${Array.isArray(v) ? `[${v.join(",")}]` : v}`
  ).join(",") + "};"

  body.push(`const refs=${refsCode};`)

  const before: string[] = []
  const after: string[] = []

  if (canBeUpdated) {
    before.push(/* */ `const m=new Map();`)
    before.push(/* */ `const getCbArray=(key)=>{`)
    before.push(/*   */ `let value=m.get(key);`)
    before.push(/*   */ `if (!value){`)
    before.push(/*     */ `value=[];`)
    before.push(/*     */ `m.set(key,value);`)
    before.push(/*   */ `}`)
    before.push(/*   */ `return value;`)
    before.push(/* */ `};`)
    after.push(/* */ `const update=values=>{`)
    after.push(/*   */ `Object.entries(values).forEach(([k,v])=>{`)
    after.push(/*     */ `const cbArray=m.get(k);`)
    after.push(/*     */ `if(cbArray)`)
    after.push(/*       */ `cbArray.forEach(cb=>cb(v));`)
    after.push(/*   */ `})`)
    after.push(/* */ `};`)
    after.push(/* */ `if(variables){update(variables);}`)
    after.push(/* */ `return{root:el1,refs,update};`)
  } else
    after.push(`return{root:el1,refs};`)

  return `function(${canBeUpdated ? "variables" : ""}){${before.join("")}${body.join("")}${after.join("")}}`
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

interface GeneratedVariable {
  varName: string
  parentVarName?: string
  node: AstNode
}

function toGeneratedVariables(root: AstElement): GeneratedVariable[] {
  const remaining: GeneratedVariable[] = []
  const result: GeneratedVariable[] = []
  let num = 0

  remaining.push({
    varName: `el${++num}`,
    node: root
  })

  while (remaining.length !== 0) {
    const current = remaining.shift()!
    const node = current.node
    if (typeof node !== "string" && node.nodeType === "element") {
      for (const child of (node.children ?? [])) {
        remaining.push({
          varName: `el${++num}`,
          node: child,
          parentVarName: current?.varName
        })
      }
    }
    result.push(current)
  }

  return result
}

function checkRefAttributeValue(value: any, tagName: string): asserts value is string {
  if (!value)
    throw new Error(`Missing value for 'h-ref' attribute on ${tagName} tag`)
  if (typeof value !== "string")
    throw new Error(`'h-ref' attribute cannot be a variable`)
  if (!/^[a-zA-z_$][\w$]*$/.test(value))
    throw new Error(`Invalid 'h-ref' attribute value: ${value}`)
}
