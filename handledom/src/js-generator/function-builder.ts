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
  const after = [`const refs=${refsCode};`]

  if (canBeUpdated) {
    before.push(/* */ "const cur=Object.assign({}, variables);")
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
    after.push(/*   */ "Object.assign(cur, values);")
    after.push(/*   */ "Object.entries(values).forEach(([k,v])=>{")
    after.push(/*     */ "const list=m.get(k);")
    after.push(/*     */ "if(list)")
    after.push(/*       */ "list.forEach(cb=>cb(v));")
    after.push(/*   */ "})")
    after.push(/* */ "};")
    after.push(/* */ "if(variables){update(variables);}")
    after.push(/* */ "return{root,refs,update};")
  } else
    after.push("return{root,refs};")

  return `function(${canBeUpdated ? "variables" : ""}){${before.join("")}${body}${after.join("")}}`
}
