type HandledomTemplate = (variables?: { [name: string]: any }) => HandledomTemplateInstance

interface HandledomTemplateInstance {
  root: HTMLElement
  refs: {
    [ref: string]: HTMLElement | HTMLElement[]
  }
  update?(variables: { [name: string]: any }): void
}

declare function handledom(strings: TemplateStringsArray, ...expressions: string[]): HandledomTemplate