import { AstElement, AstNode } from "../../types/ast"

export interface GeneratedVariable {
  varName: string
  parentVarName?: string
  node: AstNode
  scope?: GeneratedScope
}

export interface GeneratedScope {
  children: GeneratedVariable[]
  insertBefore: GeneratedVariable[]
}

export function toGeneratedVariables(root: AstElement): GeneratedVariable[] {
  const remaining: GeneratedVariable[] = []
  const result: GeneratedVariable[] = []
  let num = 0

  remaining.push({
    varName: "root",
    node: root
  })

  let current: GeneratedVariable | undefined
  while (current = remaining.shift()) {
    if (isAstElement(current.node)) {
      if (isScopeElement(current.node)) {
        current.scope = {
          children: [],
          insertBefore: []
        }
      }
      for (const child of (current.node.children ?? [])) {
        remaining.push({
          varName: `el${++num}`,
          node: child,
          parentVarName: current.varName
        })
      }
    }
    result.push(current)
  }

  return result
}

function isAstElement(node: AstNode): node is AstElement {
  return typeof node !== "string" && node.nodeType === "element"
}

function isScopeElement(node: AstElement): boolean {
  return !!node.attributes?.find(attr => attr.name === "h-if")
}