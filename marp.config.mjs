import { defineConfig } from '@marp-team/marp-cli'

export default defineConfig({
  allowLocalFiles: true,
  html: true,
  themeSet: './themes',
  template: 'bespoke',
  browser: ['chrome', 'edge', 'firefox'],
  bespoke: {
    progress: true,
    transition: true,
  },
  pdfOutlines: {
    pages: true,
    headings: true,
  },
})
