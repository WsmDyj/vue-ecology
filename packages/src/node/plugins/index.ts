import { resolvePlugin } from './resolve'
import { buildPlugin } from './build'
import { importAnalysisPlugin } from './importAnalysis'

export async function resolvePlugins() {
  return [resolvePlugin(),  buildPlugin(), importAnalysisPlugin()]
} 