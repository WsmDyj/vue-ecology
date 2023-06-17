import path from "path"
import os from 'node:os'

// 获取根路由
const postfixRE = /[?#].*$/s

export function cleanUrl(url: string): string {
  return url.replace(postfixRE, "")
}

export const bareImportRE = /^(?![a-zA-Z]:)[\w@](?!.*:\/\/)/
const knownJsSrcRE = /\.(?:[jt]sx?|vue)(?:$|\?)/
const importQueryRE = /(\?|&)import=?(?:&|$)/
const CSS_LANGS_RE = /\.(css|less|sass|scss|styl|stylus|pcss|postcss|sss)(?:$|\?)/
const htmlProxyRE = /\?html-proxy=?(?:&inline-css)?&index=(\d+)\.(js|css)$/

export const isJSRequest = (url: string): boolean => {
  url = cleanUrl(url)
  if (knownJsSrcRE.test(url)) {
    return true
  }
  if (!path.extname(url) && url[url.length - 1] !== "/") {
    return true
  }
  return false
}

export const isImportRequest = (url: string): boolean => importQueryRE.test(url)

export const isCSSRequest = (request: string): boolean => CSS_LANGS_RE.test(request)
export const isHTMLProxy = (id: string): boolean => htmlProxyRE.test(id)


export const isWindows = os.platform() === 'win32'

const windowsSlashRE = /\\/g

export function slash(p: string): string {
  return p.replace(windowsSlashRE, '/')
}

export function normalizePath(id: string): string {
  return path.posix.normalize(isWindows ? slash(id) : id)
}