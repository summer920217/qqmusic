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
### 7. 歌手页
#### 7.1 歌手列表的数据
```  
  1. 请求地址：/v8/fcg-bin/v8.fcg
  2. 请求参数:
    {
      g_tk:5381,
      format:'json',
      inCharset:'utf8',
      outCharset:'utf-8',
      notice:0,
      hostUin:0,
      needNewCode:0,
      platform:'yqq.json',
      page:'list',
      channel:'singer',
      key:'all_all_all',
      pagesize:100,
      pagenum:1
    }
  3. 使用axios发送请求获取数据(配置dev.js)
    解析数据
    [
      {
        hot:{
          title:'热门',
          singers:[{},{},{}]
        }
      },
      {
        A:{
          title:'A'
          singers:[{},{},{}]
        }
      },
      {
        B:{
          title:'B'
          singers:[{},{},{}]
        }
      }
    ]
  4. 将解析后的数据返回给singerView组件
    - 在singerView组件中的methods方法里定义获取数据的方法，然后在created中调用
    - api中定义singer.js 用于发送歌手页的相关请求，获取相关数据，最后将获取到的数据赋值给singerList属性，遍历渲染
  5. 字母导航部分
    - 使用computed过滤singerList数据，只返回singerList中的key(ABCD...)
    - 解析遍历key
    - 给每一个key添加一个单击事件，用于触发滚动到对应key的歌手位置
    - 通过调用scroll组件实例中的scrollToElement方法实现获取scroll实例，在scroll标签上添加ref属性
  

```
### 8. 歌手详情页
  点击某个歌手，页面显示对应歌手的详细信息（歌手图片，歌手的歌曲列表）
  在components下创建singerDetail组件
  1. 创建基础组件
    base/musicList/musicList.vue
    base/songList/songList.vue
  2. 配置/singer的子路由，对应就是singerDetail组件
  3. 点击singerView组件中的歌手名称派发一个select事件给父组件singer，singer组件执行派发的事件(路由跳转)
  路由跳转到singerDetail组件中，在该组件里获取singer相关的数据(可以使用路由参数进行传递)
  4. 使用状态管理
    在store.js中的state定义singerInfo属性，同时定义getters和mutations
  5. 点击singerView组件中某个歌手，组件派发事件给父组件（singer），同时传递参数singer歌手信息(名字，头像，id)给singer组件
  singer组件绑定派发的事件，在函数中将派发过来的数据singer通过mutation保存进状态管理中，然后使用编程式导航跳转路由
  同时在singer里设置router-view
  路由触发singerDetail组件，在该组件中，使用getters获取保存的数据singer，然后用singer中的fid发送请求获取歌手歌曲的数据
  - 请求地址：
    "/v8/fcg-bin/fcg_v8_singer_track_cp.fcg"
  - 请求参数：
    {
      g_tk:5381,
      format:'json',
      inCharset:'utf8',
      outCharset:'utf-8',
      notice:0,
      hostUin:0,
      needNewCode:0,
      platform:'yqq.json',
      order:'listen',
      begin:0,
      num:100,
      songstatus:1,
      singermid:id
    }









  - 获取到数据后开始解析数据，取其中有用的属性，将这些属性封装成一个单独的类class Song
  - 遍历数据通过new的方式创建若干个Song对象，最终将所有的歌曲信息songs绑定传递给musicList组件
  - 在musicList中解析接收到的数据，遍历显示，并引入SongList来帮助解析遍历所有的歌曲信息
  - 在SongList中接收musicList绑定传递过来的数据songs

### 9. 推荐页歌单的歌曲列表
  点击推荐页的歌单，在详情页中显示该歌单中的歌曲列表
  详情页依然使用musicList组件，所以只需要获取到对应数据，然后在调用musicList组件时将数据传递给musicList组件
  1. 新建recommend/recomDetail.vue
    - 配置相关路由：router.js
      · 在recommend.vue中设置router-view
      · 在recommend-list组件中给每一个li添加单击事件，处理选择某个歌单的操作，派发自定义事件select给父组件
      · 到recommend组件中调用recommendList组件的地方绑定自定义事件select
      · 处理select事件：设置状态（将子组件传递的数据保存进singerInfo里），路由跳转（跳转到recomDetail组件中）
  2. 在recomDetail中定义获取数据的方法，调用api中的recommend.js发送异步请求获取歌单歌曲列表，将数据在调用musicList组件时传递过去（title,avatar,songs）保证数据结构一致




### 10. 搜索页
  1. 新建
    api/search.js 用于获取搜索页的数据
    search/search.vue 搜索的根组件
    search/search-box.vue 搜索框
    search/suggest.vue 搜索结果
  2. 在search组件中引入search-box和suggest
    - 热门搜索：
    search中输入关键字时,会显示一部分关键字
    api中发送请求获取数据，取其中一部分数据返回给search解析，遍历显示
    - 搜索框：
    给input添加v-model，在data中定义对应的属性 query
    监听query值的变化（watch），实时向父组件派发事件queryChange，同时将数据传递给父组件
    父组件接收数据并调用api发送请求获取对应关键字搜索到的数据，解析数据，然后再将数据返回，绑定给suggest组件遍历解析
    -- 遗留问题:历史记录
### 11. 排行榜
  rank.vue , api/rank.js
  rank组件创建时发送请求获取数据
  rank.js使用axios发送请求(配置wepack.dev.js，域名与之前不一样，需要重新配置)
  获取到数据后，先查看数据结构，然后解析数据，取需要的数据返回
  rank.vue遍历数据(数据结构层次深，需要多次使用v-for)
  最后引入Scroll，实现滚动