import type { PartialResolvedId, LoadResult } from "rollup"
export interface PluginContainerOptions {

}
export interface PluginContainer {
  resolveId(id: string, importer?: string): Promise<PartialResolvedId | null>
  load(id: string): Promise<LoadResult | null>
  transform(code: string, id: string): Promise<{ code: string }>
}

export async function createPluginContainer(): Promise<PluginContainer> {
  const container: PluginContainer = {
    async resolveId(id, importer) {
      return {id}
    },
    async load() {},
    async transform(code, id) {
      return {code: ''}
    }

  }
  return container
}