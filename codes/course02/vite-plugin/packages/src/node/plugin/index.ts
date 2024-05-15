import { Plugin as RollupPlugin, PartialResolvedId, LoadResult, SourceDescription, ObjectHook } from 'rollup'
import { ResolvedConfig } from '../server';
import { resolvePlugin } from './rosolve';
import { importAnalysisPlugin } from './importAnalysis';
import { buildPlugin } from './build';

export interface Plugin extends RollupPlugin {
  name: string;
  resolveId?: (id: string, importer?: string) => Promise<PartialResolvedId | null>;
  load?: (id: string) => Promise<LoadResult | null>;
  transform?: (code: string, id: string) => Promise<SourceDescription | null> | SourceDescription | null;
}

export async function resolvePlugins(config: ResolvedConfig): Promise<Plugin[]> {
  return [
    resolvePlugin(config),
    importAnalysisPlugin(config),
    buildPlugin()
  ]
} 