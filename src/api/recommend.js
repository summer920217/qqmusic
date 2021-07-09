// 获取recommend推荐页的数据
import axios from 'axios'
// import reqData from '../common/js/myjsonp'

// 获取轮播图
function getSlider(){
  // 请求地址
  const url = "/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg";
  let data = {
    g_tk:5381,
    format:'json',
    inCharset:'utf-8',
    outCharset:'utf-8',
    notice:0,
    uin:0,
    platform:'h5',
    needNewCode:1
  }
  // 发送请求
  return axios.get(url)
  .then(data=>{
    return Promise.resolve(data.data.data.slider)
  }).catch(err=>{
    return Promise.reject(err)
  })
  /* reqData(url,{},{param:'callback'}).then(data=>{
    console.log(data.data.slider)
  }).catch(err=>{
    console.log(err)
  }) */


}

// 获取歌单列表
function getDiss(){
  let url = "/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg";
  let data = {
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
  return axios.get(url,{params:data})
  .then(res=>{  
    return Promise.resolve(res.data.data.list)
  }).catch(err=>{
    return Promise.reject(err)
  })
}

// 获取某个歌单里的歌曲列表
function getDissSongs(dissid){
  /* let url = '/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg';
  let data = {
    g_tk:5381,
    format:'json',
    inCharset:'utf-8',
    outCharset:'utf-8',
    notice:0,
    type:1,
    json:1,
    utf8:1,
    onlysong:0,
    new_format:1,
    dissid:dissid,
    g_tk_new_20200303:5381,
    platform:'yqq',
    needNewCode:0
  } */

  //中间件转发
  return axios.get('/getDiss',{
    params:{dissid}
  }).then(res=>{
    let list = res.data[0].songlist
    let data = []
    list.forEach(val => {
      let {
        album:{
          name:albumname,// 专辑名
          mid: albummid // 专辑mid
        },
        singer,
        name:songname,
        mid,
        interval,//歌曲总时间(秒数)
      } = val
      data.push({albumname,albummid,singer,songname,mid,interval})
    });
    return Promise.resolve(data)
  }).catch(err=>{
    return Promise.reject(err)
  })


  /* return axios.get(url,{params:data}).then(res=>{
    console.log(res)
  }).catch(err=>{
    console.log(err)
  }) */


}


export default{
  getSlider,
  getDiss,
  getDissSongs
}