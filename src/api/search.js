// 获取搜索页的数据
import axios from 'axios'

//获取热门关键字
function getHotKey(){
  let url = '/splcloud/fcgi-bin/gethotkey.fcg'
  let data = {
    "_": 1624951821385,
    cv: 4747474,
    ct: 24,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 1,
    uin: 0,
    g_tk_new_20200303: 5381,
    g_tk: 5381,
    hostUin: 0
  }
  return axios.get(url,{params:data})
  .then(res=>{
    // console.log(res)
    return Promise.resolve(res.data.data.hotkey.splice(0,15))
  })
  .catch(err=>{
    return Promise.resolve(err)
  })
}

//搜索关键字
function  searchKey(query){
  let url= '/splcloud/fcgi-bin/smartbox_new.fcg';
  let data = {
    '_': 1624953853266,
    cv: 4747474,
    ct: 24,
    format: 'json',
    inCharset: 'utf-8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 1,
    uin: 0,
    g_tk_new_20200303: 5381,
    g_tk: 5381,
    hostUin: 0,
    is_xml: 0,
    key: query
  }
  return axios.get(url,{params:data})
  .then(res=>{
    // console.log(res)
    let data = []
    let {singer,song} = res.data.data
    let singerList = singer.itemlist
    let songList = song.itemlist
    console.log(filter(songList,'song'))
    console.log(filter(singerList,'singer'))
    data = [
      ...filter(songList,'song'),
      ...filter(singerList,'singer')
    ]
    return Promise.resolve(data)
  }).catch(err=>{
    return Promise.reject(err)
  })

}



export {
  getHotKey,
  searchKey
}

/**
 *
 *
 * @param {Array} arr 过滤的数组
 * @param {String} type 类型 'singer'->表示歌手 'song'->表示歌曲
 */
function filter(arr,type){
  let result = []
  arr.forEach(val=>{
    if(type=='singer'){
      result.push({
        type:type,
        name:val.singer
      })
    }else{
      result.push({
        type:type,
        name:`${val.name}-${val.singer}`
      })
    }
  })
  return result;
}