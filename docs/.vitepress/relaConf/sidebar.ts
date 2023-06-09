import { DefaultTheme } from 'vitepress';
export const sidebar: DefaultTheme.Sidebar = {
  "/zh/vite-design": [
    {
      text: "第一章：开篇词",
      collapsed: false,
      items: [
        {
          text: "01 | 故事的开始",
          link: "/zh/vite-design/guide"
        },
        {
          text: "02 | vite的本质",
          link: "/zh/vite-design/nature"
        }
      ]
    },
    {
      text: "第二章：本地服务",
      collapsed: false,
      items: [
        {
          text: "03 | 开发环境搭建",
          link: "/zh/vite-design/server/node/create"
        },
        {
          text: "04 | 创建后台服务",
          link: "/zh/vite-design/server/node/server"
        },
        {
          text: "05 | 页面资源加载",
          link: "/zh/vite-design/server/node/static"
        },
      ]
    },
    {
      text: "第三章：插件体系",
      collapsed: false,
      items: [
        {
          text: "06 | 插件化架构",
          link: "/zh/vite-design/server/plugin/plugin"
        },
      ]
    },
    {
      text: "第四章：依赖预构建",
      collapsed: false,
      items: [
        {
          text: "06 | 介绍",
          link: "/zh/vite-design/server/optimizer/index"
        },
        {
          text: "07 | 依赖扫描",
          link: "/zh/vite-design/server/optimizer/scan"
        },
        {
          text: "08 | 依赖构建",
          link: "/zh/vite-design/server/optimizer/build"
        },
        {
          text: "07 | 依赖替换",
          link: "/zh/vite-design/server/optimizer/code"
        }
      ]
    },
    {
      text: "第五章：客户端client",
      collapsed: false,
      items: [
        
      ]
    },
    {
      text: "第六章：热更新",
      collapsed: false,
      items: []
    }
  ]
}
