export type AstNode = string | AstElement | AstVariable

export interface AstElement {
  nodeType: "element"
  nodeName: string
  attributes?: AstAttribute[]
  children?: AstNode[]
  emptyTag?: boolean
}

export interface AstVariable {
  nodeType: "variable"
  variableName: string
}

export interface AstAttribute {
  name: string
  value?: string | AstVariable
}
