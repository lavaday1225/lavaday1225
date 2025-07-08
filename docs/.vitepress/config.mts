import { defineConfig } from 'vitepress'
import {  withSidebar } from 'vitepress-sidebar';

const vitePressOptions = {
  base : '/lavaday1225/',
  title: "lavaday1225",
  description: "A playground in Vitepress",
  head: [
    ['link', { rel: 'icon', href: '/lavaday1225/public/favicon.ico' }]
  ],
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: '/logo.png',
    nav: [
      // About page
      { text: 'About', link: '/about' },
      // Add a 'Category' as pull down menu to switch between tech blogs and life blogs
      { text: 'Category', items: [
        { text: 'Tech Blogs', link: '/tech-blogs' },
        { text: 'Lifes', link: '/lifes' }
      ]}
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/lavaday1225' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/syuan-wei-kuo-0442b0174' },
      { icon: 'x', link: 'https://x.com/lavaday1225' },
      { icon: 'medium', link: 'https://lavaday1225.medium.com/' },
    ]
  }
}

const vitePressSidebarOptions = {
  documentRootPath: './docs',
  collapsed: true,
  capitalizeFirst: true,
}


// https://vitepress.dev/reference/site-config
export default defineConfig(withSidebar(vitePressOptions, vitePressSidebarOptions));
