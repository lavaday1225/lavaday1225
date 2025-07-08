import { defineConfig } from 'vitepress'
import {  withSidebar } from 'vitepress-sidebar';

const vitePressOptions = {
  title: "lavaday1225",
  description: "A playground in Vitepress",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
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
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/syuan-wei-kuo-0442b0174' }
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
