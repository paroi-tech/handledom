import { AstElement, AstNode } from "../../types/ast"

export interface GeneratedVariable {
  varName: string
  parentVarName?: string
  node: AstNode
}

export function toGeneratedVariables(root: AstElement): GeneratedVariable[] {
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