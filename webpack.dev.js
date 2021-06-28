// 开发环境
let {merge} = require('webpack-merge')
let base = require('./webpack.base')

module.exports = merge(base, {
  mode: "development",
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: __dirname+'/dis',
    host: 'localhost',
    port: 4001,
    open: true,
    overlay: {
      errors: true
    },
    historyApiFallback:true,
    hot: true,
    proxy: [
      {
        context:[
          "/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg",
          "/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg",
          "/v8/fcg-bin/v8.fcg",
          "/v8/fcg-bin/fcg_v8_singer_track_cp.fcg"
        ],
        target:"https://c.y.qq.com/",
        changeOrigin:true,
        headers:{//配置消息头
          referer:"https://c.y.qq.com",
          host:"c.y.qq.com"
        } 
      },
      {
        context:[
          "/cgi-bin/musics.fcg"
        ],
        target:"https://u.y.qq.com/",
        changeOrigin:true,
        headers:{//配置消息头
          referer:"https://u.y.qq.com",
          host:"u.y.qq.com"
        }
      }
    ],
    before(app){
      app.get('/singer/:id',(req,res)=>{
        res.redirect('/singer')
      })
    }                            
  }
})