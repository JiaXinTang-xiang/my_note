import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "JiaXin's notes",
  description: '个人知识库 / 笔记',

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
  ],

  themeConfig: {
    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' }
    ],

    // 侧边栏
    sidebar: {
      '/notes/': [
        { text: '关于我', link: '/notes/About_me' },
        {
          text: '📝 编程语言',
          collapsed: true,
          items: [
            { text: 'TypeScript', link: '/notes/编程语言/typescript' },
            { text: 'Rust', link: '/notes/编程语言/rust' },
          ],
        },
        {
          text: '💻 微处理器与接口技术',
          collapsed: false,
          items: [
            { text: '1-单片机基础与硬件', link: '/notes/微处理器与接口技术/1-单片机基础与硬件' },
            { text: '2-显示接口', link: '/notes/微处理器与接口技术/2-显示接口' },
            { text: '3-中断与定时器', link: '/notes/微处理器与接口技术/3-中断与定时器' },
            { text: '4-串行通信', link: '/notes/微处理器与接口技术/4-串行通信' },
            { text: '5-外设扩展-I2C-SPI', link: '/notes/微处理器与接口技术/5-外设扩展-I2C-SPI' },
          ],
        },
      ],
    },

    // 搜索
    search: {
      provider: 'local',
    },

    // 社交链接（右上角图标）
    socialLinks: [
      { icon: 'github', link: 'https://github.com/jiaxintang-xiang' },
    ],

    // 页面底部
    footer: {
      message: 'Copyright © 2026',
      copyright: '© 2026 Jaxon',
    },
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
  },
  lastUpdated: true,
})
