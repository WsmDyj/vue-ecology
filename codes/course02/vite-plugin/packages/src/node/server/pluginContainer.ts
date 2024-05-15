import type {
  PartialResolvedId,
  LoadResult,
  SourceDescription,
} from "rollup"
import { ResolvedConfig } from "."
import { resolvePlugins } from "../plugin"
import { join } from "path"
export interface PluginContainer {
  name?: string
  resolveId(id: string, importer?: string): Promise<PartialResolvedId>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<SourceDescription>
}

// ======= 初始化所有plugins =======
export async function createPluginContainer(config: ResolvedConfig) {
  const plugins = await resolvePlugins(config)
  // 当前上下文环境
  class Context {
    async resolve(id: string, importer?: string | undefined) {
      let out = await container.resolveId(id, importer)
      if (typeof out === "string") {
        out = { id: out }
      }
      return out 
    }
  }
  const container: PluginContainer = {
    async resolveId(rawId, importer = join(config.root, 'index.html')) {
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
      // 调用不同类型的插件进行transform()处理
       const ctx = new Context()
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