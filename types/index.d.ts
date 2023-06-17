/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.ts';

declare module 'virtual:*' {
  const result: any;
  export default result;
}

type Nullable<T> = T | null
