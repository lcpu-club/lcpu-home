/// <reference types="vite/client" />

declare module 'virtual:category-list.json' {
  declare const categoryList: { routeBase: string; pages: PageData[] }[]
  export default categoryList
}
