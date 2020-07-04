import { AstElement } from "../../types/ast"
import { generateDomCode } from "./dom-generator"
import { toGeneratedVariables } from "./generated-variables"

export function generateTemplateFunction(root: AstElement) {
  const genVariables = toGeneratedVariables(root)

  const { canBeUpdated, code: body, refs } = generateDomCode(genVariables)

  const refsCode = "{" + Object.entries(refs).map(
    ([k, v]) => `${k}:${Array.isArray(v) ? `[${v.join(",")}]` : v}`
  ).join(",") + "};"

  const before: string[] = []
  const after = [
    `const refs=${refsCode};`,
    "const ref=n=>{if(!refs[n])throw new Error(`Missing handle: '${n}'`);return refs[n]};"
  ]

  if (canBeUpdated) {
    // before.push(/* */ "const cur=Object.assign({}, variables);")
    before.push(/* */ "const m=new Map();")
    before.push(/* */ "const cbListOf=key=>{")
    before.push(/*   */ "let value=m.get(key);")
    before.push(/*   */ "if (!value){")
    before.push(/*     */ "value=[];")
    before.push(/*     */ "m.set(key,value);")
    before.push(/*   */ "}")
    before.push(/*   */ "return value;")
    before.push(/* */ "};")
    after.push(/* */ "const update=values=>{")
    // after.push(/*   */ "Object.assign(cur, values);")
    // after.push(/*   */ "Object.entries(values).forEach(([k,v])=>{")
    // after.push(/*     */ "const list=m.get(k);")
    // after.push(/*     */ "if(list)")
    // after.push(/*       */ "list.forEach(cb=>cb(v));")
    // after.push(/*   */ "})")
    after.push(/*   */ "for (const [k, list] of m.entries()) {")
    after.push(/*     */ "if (k in values)")
    after.push(/*       */ "list.forEach(cb=>cb(values[k]));")
    after.push(/*   */ "}")
    after.push(/* */ "};")
    after.push(/* */ "if(variables){update(variables);}")
    after.push(/* */ "return{root,refs,ref,update};")
  } else {
    after.push("const update=()=>{};")
    after.push("return{root,refs,ref,update};")
  }

  return `function(${canBeUpdated ? "variables" : ""}){${before.join("")}${body}${after.join("")}}`
}
