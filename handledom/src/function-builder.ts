import { AstElement, AstNode } from "../types/ast"

interface GeneratedVariable {
  varName: string
  parentVarName?: string
  node: AstNode
}

const encodeString = JSON.stringify

export function generateCode(root: AstElement) {
  const genVariables = toGeneratedVariables(root)
  const refs = {}
  let updateMethod = false
  const body: string[] = []

  for (const info of genVariables) {
    const { varName, parentVarName, node } = info

    if (typeof node === "string") {
      body.push(`const ${varName}=document.createTextNode(${encodeString(node)});`)
      body.push(`${parentVarName}.appendChild(${varName});`)
    } else if (node.nodeType === "variable") {
      updateMethod = true
      body.push(`const ${varName}=document.createTextNode(variables["${node.variableName}"] || "");`)
      body.push(`${parentVarName}.appendChild(${varName});`)
      body.push(`getCbArray("${node.variableName}").push((v) => ${varName}.nodeValue = v);`)
    } else {
      body.push(`const ${varName}=document.createElement(${encodeString(node.nodeName)});`)
      if (parentVarName)
        body.push(`${parentVarName}.appendChild(${varName});`)

      const chunks: string[] = []

      for (const attr of (node.attributes || [])) {
        if (attr.name === ":ref") {
          checkRefAttributeValue(attr.value, node.nodeName)
          updateRefs(refs, varName, attr.value as string)
        } else if (!attr.value || typeof attr.value === "string") {
          const p1 = encodeString(attr.name)
          const p2 = encodeString(attr.value || "")
          chunks.push(`${varName}.setAttribute(${p1}, ${p2});`)
        } else {
          const property = attr.value.variableName
          const cond = `"${property}" in variables`
          const statement = `${varName}.setAttribute(${encodeString(attr.name)}, variables["${property}"]);`
          chunks.push(`if(${cond}){${statement}}`)
          chunks.push(
            `getCbArray("${property}").push(v => ${varName}.setAttribute(${encodeString(attr.name)}, v));`
          )
          updateMethod = true
        }
      }

      if (chunks.length !== 0)
        body.push(chunks.join(""))
    }
  }

  const refsCode = "{" + Object.entries(refs).map(
    ([k, v]) => `${k}:${Array.isArray(v) ? `[${v.join(",")}]` : v}`
  ).join(",") + "};"

  body.push(`const refs=${refsCode};`)

  const before: string[] = []
  const after: string[] = []

  if (updateMethod) {
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
    after.push(`return{root:el1,refs,update};`)
  } else
    after.push(`return{root:el1,refs};`)

  return `function(${updateMethod ? "variables" : ""}){${before.join("")}${body.join("")}${after.join("")}}`
}

function updateRefs(refs, varName: string, ref: string) {
  const obj = refs[ref]
  if (!obj)
    refs[ref] = varName
  else if (Array.isArray(obj))
    obj.push(varName)
  else
    refs[ref] = [obj, varName]
}

function toGeneratedVariables(root: AstElement) {
  const q = [] as GeneratedVariable[]
  const a = [] as GeneratedVariable[]
  let j = 1

  q.push({
    varName: `el${j}`,
    node: root
  })
  j += 1

  while (q.length !== 0) {
    const current = q.shift()!
    const node = current.node
    if (typeof node !== "string" && node.nodeType === "element") {
      for (const child of (node.children || [])) {
        q.push({
          varName: `el${j}`,
          node: child,
          parentVarName: current?.varName
        })
        j += 1
      }
    }
    a.push(current)
  }

  return a
}

function checkRefAttributeValue(value: any, tagName: string) {
  if (!value)
    throw new Error(`Missing value for :ref attribute on ${tagName} tag`)
  if (typeof value !== "string")
    throw new Error(`:ref attribute cannot be a variable`)
  if (!/^[a-zA-z_$][\w$]*$/.test(value))
    throw new Error(`Invalid :ref attribute value: ${value}`)
}
