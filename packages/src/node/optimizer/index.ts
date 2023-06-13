import path from 'path'
import { ResolvedConfig } from '../server'
import { scanImports } from './scan'
import { build } from 'esbuild'
import { normalizePath } from '../utils'

export async function initDepsOptimizer(config: ResolvedConfig) {
  // 第一步：3.4获取缓存
  const cachedMetadata = await loadCachedDepOptimizationMetadata(config);
  // 第二步：3.5没有缓存时进行依赖扫描
  const { deps } = await scanImports(config)
  // 第三步：3.6没有缓存时进行依赖扫描，然后进行依赖打包到node_modules/.vite
  const depsCacheDir = getDepsCacheDir(config);
  const entryPoints = Object.entries(deps).map(([_, value]) => value)
  await build({
    entryPoints,
    write: true,
    bundle: true, // 打包一个文件意味着将任何导入的依赖项内联到文件中
    format: "esm",
    splitting: true, // 在多个 entry 入口之间共享的代码，会被分成单独共享文件（chunk 文件）
    outdir: depsCacheDir,
  })
}


function getDepsCacheDir(config: ResolvedConfig) {
  return normalizePath(path.resolve(config.root, config.cacheDir, 'deps'))
}

function loadCachedDepOptimizationMetadata(config: ResolvedConfig) {
  // const depsCacheDir = normalizePath(path.resolve(config.cacheDir, 'deps'));
  // let cachedMetadata;
  // const cachedMetadataPath = path.join(depsCacheDir, '_metadata.json');
  // cachedMetadata = parseDepsOptimizerMetadata(await fsp.readFile(cachedMetadataPath, 'utf-8'), depsCacheDir);
  return false
} 


export function getDepsOptimizer() {
  // return depsOptimizerMap.get()
}