export * from "./bundle"

export type HandledomTemplate = (variables?: { [name: string]: any }) => HandledomTemplateInstance

export interface HandledomTemplateInstance {
  root: HTMLElement
  refs: {
    [ref: string]: HTMLElement | HTMLElement[]
  }
  update?(variables: { [name: string]: any }): void
}

export default function handledom(strings: TemplateStringsArray, ...expressions: string[]): HandledomTemplate