import type {
  PartialResolvedId,
  LoadResult,
} from "rollup"

import { resolvePlugins } from '../plugins'


export interface PluginContainer {
  resolveId(id: string, importer?: string): Promise<PartialResolvedId | null>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<{ code: string }>
}

export async function createPluginContainer(): Promise<PluginContainer> {
  class Context {
    async resolve(id: string, importer?: string | undefined) {
      let out = await container.resolveId(id, importer)
      if (typeof out === "string") out = { id: out }
      return out 
    }
  }

  const container: PluginContainer = {
    async resolveId(id) {
      console.log("resolveId", id)
      const plugins = await resolvePlugins()
      const ctx = new Context()
       for (const plugin of plugins) {
         if (plugin.resolveId) {
           const newId = await plugin.resolveId.call(ctx as any, id, importer)
           if (newId) {
             id = typeof newId === "string" ? newId : newId.id
             return { id }
           }
         }
       }
       return null
    },
    async load() {
      console.log("load")
      return {code: ''}
    },
    async transform(code, id) {
      console.log("transform")
      return {code: ''}
    }

  }
  return container
}