import path from "node:path"
import os from 'node:os'

// 去除url的参数 /cac/test?query=da -> /cac/test
export function cleanUrl(url: string): string {
  return url.replace(/[?#].*$/s, "")
}

const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
const knownJsSrcRE = /\.(?:[jt]sx?|m[jt]s|vue|marko|svelte|astro|imba)(?:$|\?)/
const importQueryRE = /(\?|&)import=?(?:&|$)/

export const isImportRequest = (url: string): boolean => importQueryRE.test(url)

export const isJSRequest = (url: string): boolean => {
  url = cleanUrl(url)
  if (knownJsSrcRE.test(url)) {
    return true
  }
  if (!path.extname(url) && url[url.length - 1] !== '/') {
    return true
  }
  return false
}

export const isCSSRequest = (request: string): boolean => CSS_LANGS_RE.test(request)

export const isWindows = os.platform() === 'win32'

export function slash(p: string): string {
  return p.replace(/\\/g, '/')
}
// 路径兼容window
export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}
