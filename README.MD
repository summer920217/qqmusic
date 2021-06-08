# 初始化
## 1. 创建src文件夹
## 2. npm init -y 初始化包管理
## 3. 复制day10->.babellrc webpack.base.js webpack.dev.js webpack.pro.js
## 4. 复制day04-> .gitignore
## 4.1 配置修改
## 5. 安装包：cnpm i --> node_modules
## 6. git管理
```
git init 
git add -A
git commit -m 'init qqmusic'
git remote add origin git@github.com:summer920217/qqmusic.git
git push -u origin master
```
##----------------------------
# qq音乐
## 项目搭建
### 1. 文件
```
- 新建package.json,.babellrc,.gitignore以及webpack配置文件；修改其中部分内容；安装相关的依赖
- 在项目根目录下新建public和src文件夹
- 在src下新建
  api/          封装请求数据接口的代码
  base/         通用的基础组件
  common/       静态资源文件(已提供)
  components/   各种组件
  router/       路由
  store/        状态管理
  App.vue       
  main.js
```
### 2. 在common文件夹内容复制进去，同时在common中新建js文件夹
### 3. 在main.js中引入各个模块，并创建vue实例对象；同时引入fastclick解决300ms延迟的问题
### 4. 










