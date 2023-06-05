import type {
  PartialResolvedId,
  LoadResult,
  SourceDescription,
} from "rollup"
import { join } from 'node:path'
import { resolvePlugins } from '../plugins'
import { ResolvedConfig } from './index'
export interface PluginContainer {
  name?: string
  resolveId(id: string, importer?: string): Promise<PartialResolvedId>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<SourceDescription>
}

export async function createPluginContainer(config: ResolvedConfig): Promise<PluginContainer> {
  const { root } = config

  class Context {
    async resolve(id: string, importer?: string | undefined) {
      let out = await container.resolveId(id, importer)
      if (typeof out === "string") out = { id: out }
      return out 
    }
  }

  const container: PluginContainer = {
    async resolveId(rawId, importer = join(root, 'index.html')) {
      const plugins = await resolvePlugins()
      const ctx = new Context()
      let id: string | null = null
      const partial: Partial<PartialResolvedId> = {}
      for (const plugin of plugins) {
        if (!plugin.resolveId) continue
        const result = await plugin.resolveId.call(ctx, rawId, importer)
        if (!result) continue
        if (typeof result === 'string') {
          id = result
        } else {
          id = result.id
          Object.assign(partial, result)
        }
      }
      if (id) {
        partial.id = id
      }
      return partial as PartialResolvedId
    },

    async load(id) {
      const ctx = new Context()
      const plugins = await resolvePlugins()
      for (const plugin of plugins) {
        if (!plugin.load) continue
        const result = await plugin.load.call(ctx, id)
        if (result !== null) {
          return result
        }
      }
      return null
    },

    async transform(code, id) {
      const ctx = new Context()
      const plugins = await resolvePlugins()
      for (const plugin of plugins) {
        if (!plugin.transform) continue
        const result = await plugin.transform.call(ctx as any, code, id)
        if (!result) continue
        if (typeof result === "string") {
          code = result;
        } else if (result.code) {
          code = result.code;
        }
      }
     return { code }
    }

  }
  return container
}