export type HandledomTemplate = (variables?: { [name: string]: any }) => HandledomTemplateInstance

export interface HandledomTemplateInstance {
  root: HTMLElement
  refs: {
    [ref: string]: HTMLElement | HTMLElement[]
  }
  update(variables: { [name: string]: any }): void
  ref<T = HTMLElement>(ref: string): T
}
