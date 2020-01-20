import { HandledomTemplate } from "./types/dom-types"

export * from "./types/dom-types"

export default function handledom(strings: TemplateStringsArray, ...expressions: string[]): HandledomTemplate
