/// <reference types="vite/client" />

declare module 'virtual:pages.json' {
  declare const allPages: import('./src/data/pagedata').PageData[]
  export default allPages
}

declare module 'virtual:page-modules' {
  const pageModules: Record<string, () => Promise<import('./src/module').Module>>
  export default pageModules
}
