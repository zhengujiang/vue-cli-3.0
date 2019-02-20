module.exports = {
  pages: {
    home: {
      entry: 'src/pages/home/main.js',
      template: 'pulic/home.html',
      filename: 'dist/home.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'test-home',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
    index: {
      entry: 'src/pages/index/main.js',
      template: 'pulic/index.html',
      filename: 'dist/index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: 'test-index',
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  }
}