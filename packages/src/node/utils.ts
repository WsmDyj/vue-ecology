import path from "path"

// 获取根路由
const postfixRE = /[?#].*$/s
export function cleanUrl(url: string): string {
  return url.replace(postfixRE, "")
}

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
