import axios from "axios";
// import params from '../common/js/Params';

/**
 *
 * 根据歌曲的songmid获取对应的歌词
 * @param {String} songmid
 */
function getLyric(songmid){
  let url = "/lyric/fcgi-bin/fcg_query_lyric_new.fcg";
  let query = {
    "-": "MusicJsonCallback_lrc",
    pcachetime: new Date().getTime(),
    songmid: songmid,
    g_tk_new_20200303: 5381,
    g_tk: 5381,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  }
  return axios.get(url,{params:query})
  .then(data=>{
    return Promise.resolve(data.data.lyric)
  })
  .catch(err=>{
    return Promise.reject(err)
  })
}

export{
  getLyric
}