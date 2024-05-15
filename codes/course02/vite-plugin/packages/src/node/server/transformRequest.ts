/*
 * @Author: wusimin wusimin@kuaishou.com
 * @Date: 2024-05-14 15:19:44
 * @LastEditors: wusimin wusimin@kuaishou.com
 * @LastEditTime: 2024-05-14 15:22:29
 * @FilePath: /vue-ecology/codes/course02/vite-plugin/packages/src/node/server/transformRequest.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 文件转换
import { ViteDevServer } from './index'

export function transformRequest(url: string, server: ViteDevServer) {
  const request = doTransform(url, server)
  return request
}

async function doTransform(url: string, server: ViteDevServer) {

  const { pluginContainer } = server

  const id = (await pluginContainer.resolveId(url))?.id ?? url
  const result = loadAndTransform(id, url, server)
  return result
}

async function loadAndTransform(id: string, url: string, server: ViteDevServer) {
  let code: string | null = null
  const { pluginContainer } = server
  
  const loadResult = await pluginContainer.load(id)
  
  if (loadResult && typeof loadResult === 'object') {
    code = loadResult?.code
  } else {
    code = loadResult ?? ''
  }

  const transformResult = await pluginContainer.transform(code, id)

  code = transformResult.code
  
  return {
    code
  }
}