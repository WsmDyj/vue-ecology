import { ResolvedConfig } from '../server'
import { scanImports } from './scan'


export async function initDepsOptimizer(config: ResolvedConfig) {
  scanImports(config)
}