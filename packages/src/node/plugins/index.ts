import { resolvePlugin } from './resolve'
import { buildPlugin } from './build'
// import { importAnalysisPlugin } from './importAnalysis'
import { ResolvedConfig } from '../server/index'

export async function resolvePlugins(config: ResolvedConfig) {
  return [resolvePlugin(config),  buildPlugin(),
    //  importAnalysisPlugin(config)
    ]
} 