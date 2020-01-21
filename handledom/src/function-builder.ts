import { AstElement, AstNode } from "../types/ast"

interface VariableInfo {
  varName: string
  parentVarName?: string
  node: AstNode
}

const encodeString = JSON.stringify

export function generateCode(root: AstElement) {
  const a = bfs(root)
  const refs = {}
  let updateMethod = false
  let fnBody = ``

  for (const info of a) {
    const { varName, parentVarName, node } = info

    if (typeof node === "string") {
      fnBody += `const ${varName}=document.createTextNode(${encodeString(node)});`
      fnBody += `${parentVarName}.appendChild(${varName});`
    } else if (node.nodeType === "variable") {
      updateMethod = true
      fnBody += `const ${varName}=document.createTextNode(variables["${node.variableName}"] || "");`
      fnBody += `${parentVarName}.appendChild(${varName});`
      fnBody += `getCbArray("${node.variableName}").push((v) => ${varName}.nodeValue = v);`
    } else {
      fnBody += `const ${varName}=document.createElement(${encodeString(node.nodeName)});`
      if (parentVarName)
        fnBody += `${parentVarName}.appendChild(${varName});`

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
        fnBody += chunks.join("")
    }
  }

  const refsCode = "{" + Object.entries(refs).map(
    ([k, v]) => `${k}:${Array.isArray(v) ? `[${v.join(",")}]` : v}`
  ).join(",") + "};"

  fnBody += `const refs=${refsCode};`

  let fnHead = `function(${updateMethod ? "variables" : ""}){`

  if (updateMethod) {
    fnHead += /* */ `const m=new Map();`
    fnHead += /* */ `const getCbArray=(key)=>{`
    fnHead += /*   */ `let value=m.get(key);`
    fnHead += /*   */ `if (!value){`
    fnHead += /*     */ `value=[];`
    fnHead += /*     */ `m.set(key,value);`
    fnHead += /*   */ `}`
    fnHead += /*   */ `return value;`
    fnHead += /* */ `};`
    fnBody += /* */ `const update=values=>{`
    fnBody += /*   */ `Object.entries(values).forEach(([k,v])=>{`
    fnBody += /*     */ `const cbArray=m.get(k);`
    fnBody += /*     */ `if(cbArray)`
    fnBody += /*       */ `cbArray.forEach(cb=>cb(v));`
    fnBody += /*   */ `})`
    fnBody += /* */ `};`
    fnBody += `return{root:el1,refs,update};`
  } else
    fnBody += `return{root:el1,refs};`

  fnBody += `}`
  return `${fnHead}${fnBody}` // Maybe, append: eslint-disable-line tslint:disable-line
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

function bfs(root: AstElement) {
  const q = [] as VariableInfo[]
  const a = [] as VariableInfo[]
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
