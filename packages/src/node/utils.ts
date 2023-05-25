import path from "path"

// 获取根路由
const postfixRE = /[?#].*$/s
export function cleanUrl(url: string): string {
  return url.replace(postfixRE, "")
}

const knownJsSrcRE = /\.(?:[jt]sx?|vue)(?:$|\?)/
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
