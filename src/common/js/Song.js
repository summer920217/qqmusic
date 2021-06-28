// 封装歌曲类
/*
  用到的数据：
  albummid    专辑的id
  albumname  专辑的名称
  songmid     歌曲id
  songname    歌曲名称
  strMediaMid 歌曲id
  singer      歌手
*/
export default class Song{
  constructor({albummid,albumname,songmid,songname,strMediaMid,singer}){
    this.albummid = albummid
    this.albumname = albumname
    this.songmid = songmid   
    this.songname = songname   
    this.strMediaMid = strMediaMid
    this.singer = singer
  }
}