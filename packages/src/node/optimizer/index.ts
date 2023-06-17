import path from 'path'
import { ResolvedConfig } from '../server'
import { scanImports } from './scan'
import esbuild, { build } from 'esbuild'
import { normalizePath } from '../utils'
import { createHash } from 'crypto'
import fs from 'fs-extra'

// 将此项目的xxx.lock.json文件内容生成一个hash
//（作用是如果我的依赖发生变化那我的lock文件也会发生更改，将来我的依赖预构建程序会在hash值发生变化的时候重新执行预构建程序）
function getDepHash(config: ResolvedConfig) {
  // 读取xxx.lock.json文件的内容
  const content = lookupFile(config) || '';
  const cryptographicStr = createHash('sha256')
    .update(content)
    .digest('hex')
    .substring(0, 8);
  return cryptographicStr;
}

// 读取xxx.lock.json文件的内容
function lookupFile(config: ResolvedConfig) {
  const lockfileFormats = ['package-lock.json', 'yarn.lock', 'pnpm-lock.yaml'];
  let content = null;
  for (let index = 0; index < lockfileFormats.length; index++) {
    const lockPath = path.join(config.root, lockfileFormats[index]);
    const isExist = fs.existsSync(lockPath);
    if (isExist) {
      content = fs.readFileSync(lockPath);
      break;
    }
  }
  return content;
}

export async function initDepsOptimizer(config: ResolvedConfig) {
  // 第一步：3.4获取缓存
  const mainHash = getDepHash(config);
 const dataPath = getDepsCacheDir(config, '_metadata.json')
  const cachedMetadata = await loadCachedDepOptimizationMetadata(config, mainHash, dataPath)
  if (!cachedMetadata) {
    // 第二步：3.5没有缓存时进行依赖扫描
    const { deps } = await scanImports(config)
    // 第三步：3.6没有缓存时进行依赖扫描，然后进行依赖打包到node_modules/.vite
    const depsCacheDir = getDepsCacheDir(config, 'deps')
    const entryPoints = Object.entries(deps).map(([_, value]) => value)
    await build({
      absWorkingDir: process.cwd(),
      entryPoints,
      write: true,
      bundle: true, // 打包一个文件意味着将任何导入的依赖项内联到文件中
      format: "esm",
      sourcemap: true,
      splitting: true, // 在多个 entry 入口之间共享的代码，会被分成单独共享文件（chunk 文件）
      outdir: depsCacheDir
    })

    const data: any = {
      hash: mainHash,
      optimized: {}, // 依赖包的信息
    };
    for (const id in deps) {
      const entry = deps[id];
      const p = entry.slice(config.root.length).replace('/node_modules', depsCacheDir)
      data.optimized[id] = {
        src: normalizePath(entry),
        file: normalizePath(p),
        // fileHash: "5496c597",
      };
    }
    // 将数据写入_metadata.json
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
  }
}

export function getDepsCacheDir(config: ResolvedConfig, filePath?: string) {
  if (!filePath) filePath = 'deps'
  return normalizePath(path.resolve(config.root, config.cacheDir, filePath))
}

function loadCachedDepOptimizationMetadata(config: ResolvedConfig, mainHash: string, dataPath: string) {
  // 首先判断_metadata.json是否存在 如果存在则对下之前存储的hash值是否跟现在的hash一样，如果一样则依赖没有发生变化 不用执行预构建动作
  if (fs.existsSync(dataPath)) {
    const cachedMetadata = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    if (cachedMetadata && cachedMetadata.hash === mainHash) {
      return cachedMetadata
    }
  }
  return false
} 
