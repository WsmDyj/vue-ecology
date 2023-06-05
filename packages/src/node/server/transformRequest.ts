
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