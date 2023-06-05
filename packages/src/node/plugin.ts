import { Plugin as RollupPlugin, PartialResolvedId, LoadResult, SourceDescription, ObjectHook } from 'rollup'
import { ViteDevServer } from './server/index'

export type ServerHook = (
  this: void,
  server: ViteDevServer,
) => (() => void) | void | Promise<(() => void) | void>


export interface Plugin extends RollupPlugin {
  name: string;
  resolveId?: (id: string, importer?: string) => Promise<PartialResolvedId | null>;
  load?: (id: string) => Promise<LoadResult | null>;
  transform?: (code: string, id: string) => Promise<SourceDescription | null> | SourceDescription | null;
  configureServer?: ObjectHook<ServerHook>
}