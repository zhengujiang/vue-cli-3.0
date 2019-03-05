let pageMethod = require('./utils/getPages.js');
pages = pageMethod.pages();

module.exports = {
  devServer: {
    port: 8888,
  },
  pages,
  // pages: {
  //   home: {
  //     entry: 'src/pages/home/main.js',
  //     // template: 'src/pages/home.html',
  //     // filename: 'dist/home.html',
  //     // // 当使用 title 选项时，
  //     // // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  //     filename: process.env.NODE_ENV === 'development'?`home.html`:`home/home.html`,
  //     title: 'test-home',
  //     chunks: ['chunk-vendors', 'chunk-common', 'home']
  //   },
  //   index: {
  //     entry: 'src/pages/index/main.js',
  //     // template: 'src/pages/index.html',
  //     // filename: 'dist/index.html',
  //     // // 当使用 title 选项时，
  //     // // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
  //     filename: process.env.NODE_ENV === 'development'?`index.html`:`index/index.html`,
  //     title: 'test-index',
  //     chunks: ['chunk-vendors', 'chunk-common', 'index']
  //   },
  // }
}