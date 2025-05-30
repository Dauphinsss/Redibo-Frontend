declare module 'leo-profanity' {
  export function getDictionary(lang: string): string[]
  export function add(words: string[]): void
  export function clean(text: string): string
} 