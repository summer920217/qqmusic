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
### 1. 配置文件
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
### 3. 在main.js中引入各个模块，并创建vue实例对象；同时引入fastclick解决300ms延迟的问题(main.js)
```
import fastclick from 'fastclick'
fastclick.attach(document.body)
```
### 4. 引入全局样式(main.js)
```
import './common/stylus/index.styl'
```
### 5. 首页
  - App.vue
```
  - 项目的根组件，其中包含3个部分：
    - header,tab,content
    - header 对应 m-header组件
    - tab 对应 tab 组件，里面包含4个路由
    - 第三部分为 router-view，表示4个路由对应组件的渲染出口
```
  - 在router.js中配置这4个路由
```
  routes:[
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path:'/recommend',
      component:Recommend
    },
    {
      path:'/singer',
      component:Singer
    },
    {
      path:'/rank',
      component:Rank
    },
    {
      path:'/search',
      component:Search
    },
  ]
```
### 6. 推荐页(导航1)
  #### 1) 轮播图
  ```
    step1:安装vant组件库
      cnpm i vant -S
      cnpm i babel-plugin-import -D
    step2:将.babelrc修改为babelrc.config.js 且 添加配置
      注意：webpack 1 无需设置libraryDirectory
      {
        "plugins": [
          ["import", {
            "libraryName": "vant",
            "libraryDirectory": "es",
            "style": true
          }]
        ]
      }
    
    step3: 在main.js中引入vant
      import {Swipe,SwipeItem} from 'vant'
      import 'vant/lib/index.css'
      Vue.use(Swipe)
      Vue.use(SwipeItem)

    step4: 新建base/slider/Slider.vue 

    step5: 在recommend.vue里设置
      import Slider from '../../base/slider/Slider.vue'
      export default{
        data(){
          return {
            slider:[1,2,3,4]
          }
        },
        components:{
          Slider
        }
      }
    
    step6: 获取数据
      在recommend组件创建成功时，发送Ajax请求获取数据
      - created中调用methods定义的获取数据的方法
      - methods中定义获取数据的方法，调用api里封装的发送请求的方法
      - 在api/新建recommend.js,用于发送推荐页数据的请求
        getSlider方法获取轮播图
        使用axios发送异步请求并返回promise对象
        但是产生跨域问题(使用proxy代理)
        在webpack.dev.js配置文件中的devServer选项中设置proxy选项
        proxy: [{
          context:[
            "/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg"
          ],
          target:"https://c.y.qq.com/",
          changeOrigin:true
        }] 

        修改后重启服务
    
    step7: 解析数据，返回轮播图数组，将其赋值给recommend.vue组件中的slider属性，在调用Slider.vue组件时将slider属性传递给轮播图组件
    recommend.vue:
    <Slider :pics="slider"></Slider>
    Slider.vue:
    <img :src="p.picUrl">
  ```
  #### 2) 热门歌曲推荐
  ```
    - 请求地址：
      https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg
    - 请求参数：
      {
        picmid:1,
        rnd:Math.random(),
        g_tk_new_20200303:5381,
        g_tk:5381,
        loginUin:0,
        hostUin:0,
        format:"json",
        inCharset:"utf-8",
        outCharset:"utf-8",
        notice:0,
        platform:"yqq.json",
        needNewCode:0,
        categoryId:10000000,
        sortId:5,
        sin:0,
        ein:19
      }
    - 跨域请求使用proxy代理的方式
      proxy:{
        context:[url,url,url,...],
        target:"https://c.y.qq.com/",
        changeOrigin:true,
        header:{
          referer:"https://c.y.qq.com",
          host:"c.y.qq.com"
        }
      }  
    - 在recommend.vue组件中调用 recommend-list.vue组件
    recommend-list组件创建成功后执行获取数据的方法，该方法在methods中定义，实际获取数据的请求由recommend.js发送
    获取到数据后将数据解析并赋值给recom-list组件中的数据
  ```
  #### 3) 滚动效果
  ```
    - 1.使用better-scroll(1.15.2版本)插件(目前使用)
      npm install better-scroll -S
    - 2.采用vant组件库中的List组件

    - 3.因为滚动效果在其他地方也会多次使用，所以将滚动效果单独封装成一个独立的通用基础组件
    - 4.新建文件：src/base/scroll/scroll.vue
      · 模板中只有一个插槽slot
      · 定义initScroll方法初始化scroll对象
        _initScroll(){
          //初始化scroll对象
          let div = this.$refs.wrapper;
          if(!div){
            // 没有该元素，则不创建
            return ;
          }
          this.scroll = new BScroll(div,{
            click:true,
            probeType:2
          })
        },
      · 在mounted中调用初始化方法(scroll对象必须在页面渲染成功后才可以创建，所以初始化方法需要写在this.$nextTick中以保证是在页面渲染结束后执行的)
        mounted() {
          this.$nextTick(()=>{
            this._initScroll()
          })
        },
  ```







