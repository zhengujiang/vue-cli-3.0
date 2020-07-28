// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 不允许重复的case标签
    'no-duplicate-case': 1,
    // 不允许执行不到的return,throw,continue和break语句
    'no-unreachable': 1,
    // 禁止函数括号之前校验空格
    'space-before-function-paren': 0,
    // 禁止块之前校验空格
    'padded-blocks': 0,
    // 不允许扩展JS基本对象
    'no-extend-native': 0,
    'no-trailing-spaces': 0,
    'no-extra-boolean-cast': 0,
    'semi': 0,  //分号检查
    'handle-callback-err': 0,
    // 强制将变量一起声明或单独声明
    'one-var': 0,
    'no-new': 0,
    'no-useless-escape': 0,
    // 允许声明未赋值的变量
    'no-unused-vars': 0,
    'indent': 0,
    'quotes': 0,
    'camelcase': 0,
    'no-undef': 0,
    'object-property-newline': 0,
    'eqeqeq': 0,
    'key-spacing': 0,
    'operator-linebreak': 1,
    'no-caller': 0
  }
}
