import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'My Notes',
  description: '个人知识库 / 笔记',

  themeConfig: {
    // 顶部导航
    nav: [
      { text: '首页', link: '/' },
      { text: '笔记', link: '/notes/' }
    ],

    // 侧边栏
    sidebar: {
      '/notes/': [
        { text: '关于我', link: '/notes/about-me' },
        {
          text: '📘 学习笔记',
          collapsed: false,
          items: [
            { text: '计算机网络', link: '/notes/computer-network' },
            { text: '操作系统', link: '/notes/operating-system' },
          ],
        },
        {
          text: '🛠 工具 / 环境',
          collapsed: true,
          items: [
            { text: 'Git 常用命令', link: '/notes/git-cheatsheet' },
            { text: 'Linux 笔记', link: '/notes/linux-notes' },
          ],
        },
        {
          text: '📝 编程语言',
          collapsed: true,
          items: [
            { text: 'TypeScript', link: '/notes/typescript' },
            { text: 'Rust', link: '/notes/rust' },
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
      { icon: 'github', link: 'https://github.com/JiaXinTang-xiang' },
    ],

    // 页面底部
    footer: {
      message: '基于 VitePress 构建',
      copyright: 'Copyright © 2026',
    },

    // 编辑链接
    editLink: {
      pattern: 'https://github.com/JiaXinTang-xiang/my_note/edit/main/docs/:path',
      text: '在 GitHub 上编辑此页',
    },

    // 上次更新时间
    lastUpdated: true,
  },

  // Markdown 配置
  markdown: {
    lineNumbers: true,
  },
})
