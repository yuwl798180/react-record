# learn react

`create-react-app` 构建的 demo，使用 `yarn start` 开始执行项目。其他参考 [CRA-README](./CRA-README.md)。

## 现代构建工具包括

1.  包管理工具 package manager: such as [yarn](https://yarnpkg.com/) or [npm](https://www.npmjs.com/)
1.  打包工具 bundler: such as [webpack](https://webpack.js.org/) or [browserify](http://browserify.org/)
1.  编译器 compiler: such as [babel](http://babeljs.io/)

## 一些参考命令

1.  git 命令：[git 官方书籍](https://git-scm.com/book/en/v2)
1.  npm 命令：[npm docs](https://docs.npmjs.com/)

1.  关于换行符，最好在 git config 添加两句命令：

```
#提交时转换为LF，检出时不转换
git config --global core.autocrlf input

#拒绝提交包含混合换行符的文件
git config --global core.safecrlf true
```

## 常用包

1.  [react-hot-loader](https://github.com/gaearon/react-hot-loader) 热加载不会刷新整个页面，只替换修改的代码，做到了页面的局部刷新。而 [webpack-dev-server](https://github.com/webpack/webpack-dev-server) 热加载是当修改代码后，代码经过打包，重新刷新了整个页面。
1.  [react-app-rewired](https://github.com/timarney/react-app-rewired) 扩展 `create-react-app` 的 webpack 配置。
1.  [raw-loader](https://github.com/webpack-contrib/raw-loader) 用来导入如 markdown、txt 文件。
1.  [react-markdown](https://github.com/rexxars/react-markdown) 渲染 markdown 组件。
1.  [gh-pages](https://github.com/tschaub/gh-pages) 提交 build 文件夹到 gh-pages 分支。注意要在 `package.json` 中添加 `"homepage": "."` 字段，这样 build 文件夹里引用的路径才正确。

## 一些知识点

1. [react knowledge](knowledge-react.md)
1. [redux knowledge](knowledge-redux.md)
