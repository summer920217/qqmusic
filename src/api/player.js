//
import axios from 'axios'
// import params from '../common/js/'

/**
 *
 * 获取歌曲播放的地址
 * @param {String} songmid 歌曲的mid
 */
function getPlayKey(songmid){
  let url = '/cgi-bin/musicu.fcg'
  let query = {
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    "-": "getplaysongvkey9120510439364251",
    g_tk: 1594360937,
    hostUin: 0,
    platform: 'yqq.json',
    needNewCode: 0,
    data: {
      "req": {
        "module": "CDN.SrfCdnDispatchServer",
        "method": "GetCdnDispatch",
        "param": {
          "guid": "7695483805",
          "calltype": 0,
          "userip": ""
        }
      },
      "req_0": {
        "module": "vkey.GetVkeyServer",
        "method": "CgiGetVkey",
        "param": {
          "guid": "7695483805",
          "songmid": [songmid],
          "songtype": [0],
          "uin": "1105053841",
          "loginflag": 1,
          "platform": "20"
        }
      },
      "comm": {
        "uin": 1105053841,
        "format": "json",
        "ct": 24,
        "cv": 0
      }
    }
  }

  return axios.get(url,{params:query})
  .then(data=>{
    let purl = data.data.req_0.data.midurlinfo[0].purl
    console.log(data)
    console.log(purl)

    let songUrl = "http://dl.stream.qqmusic.qq.com/" + purl;
    return Promise.resolve(songUrl);
  })
  .catch(err=>{
    return Promise.reject(err)
  })
}


export default{
  getPlayKey
}