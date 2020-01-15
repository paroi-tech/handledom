import { AstElement } from "./types/ast"
export * from "./types/ast"

export function compileHandledom(template: string): string
export function parseHandledom(source: string): AstElement