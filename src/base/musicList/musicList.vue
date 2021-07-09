<template>
  <div class="music-list">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgImg" ref="bgImg">
      <div class="filter"></div>
    </div>
    <scroll class="list" ref="list">
      <div class="song-list-wrapper">
      <SongList :songs="songs" @chooseSong="choose"></SongList>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import SongList from '../songList/songList.vue'
import Scroll from '../scroll/Scroll.vue'
import ChapterList from '../../../../day06/novel/src/components/chapterList.vue'
import tool from '../../api/player'
import {mapActions} from 'vuex'


export default {
  methods: {
    ...mapActions(["setPlaySong"]),
    back(){//返回上一步
      this.$router.back()
    },
    choose(index){
      //接收被点击歌曲的下标 index 从而得到被点击歌曲的信息
      let song = this.songs[index];
      console.log(song)
      tool.getPlayKey(song.songmid)
      .then(songUrl=>{
        // songUrl 就是歌曲的资源地址
        // 将地址添加到当前歌曲的url属性中
        this.$set(song,"url",songUrl);
        // 设置歌曲为当前播放歌曲，还有播放列表
        this.setPlaySong({
          playList:this.songs,//当前播放的歌曲列表
          currentIndex:index//当前播放的下标
        })
        // console.log(song)
      }).catch(err=>{                     
        console.log(err)
      })
    }
  },
  props:{
    title:{//标题名称
      type:String,
      default:""
    },
    avatar:{//背景图地址
      type:String,
      default:""
    },
    songs:{//歌曲列表
      type:Array,
      default(){
        return []
      }
    }
  },
  computed:{
    bgImg(){
      return `background-image:url(${this.avatar})`
    }
  },
  mounted() {
    //设置挂载成功后的list的top
    // this.$refs.list.$el //ref对应的元素
    this.$refs.list.$el.style.top = this.$refs.bgImg.clientHeight+'px'
  },
  components:{
    SongList,
    Scroll,
    ChapterList
  }
}
</script>

<style scoped lang="stylus">
@import '~@common/stylus/variable'
@import '~@common/stylus/mixin'
.music-list
  position fixed
  z-index 100
  top 0
  left 0
  bottom 0
  right 0
  background $color-background
  .back
    position absolute
    top 0
    left 6px
    z-index 50
    .icon-back
      display block
      padding 10px
      font-size $font-size-large-x
      color $color-theme
  .title
    position absolute
    top 0
    left 10%
    z-index 40
    width 80%
    no-wrap()
    text-align center
    line-height 40px
    font-size $font-size-large
    color #fff
  .bg-image
    position relative
    z-index 2
    width 100%
    height 0
    padding-top 70%
    transform-origin top
    background-size cover
    .play-wrapper
      position absolute
      bottom 20px
      z-index 50
      width 100%
      .play
        box-sizing border-box
        width 135px
        padding 7px 0
        margin 0 auto
        text-align center
        border 1px solid $color-theme
        color $color-theme
        border-radius 100px
        font-size 0
        .icon-play
          display inline-block
          vertical-align middle
          margin-right 6px
          font-size $font-size-medium-x
        .text
          display inline-block
          vertical-align middle
          font-size $font-size-small
  .bg-layer
    position relative
    height 100%
    background #fff
  .list
    position fixed
    top 0
    bottom 0
    width 100%
    background #fff
    .song-list-wrapper
      padding 20px 30px
    .loading-container
      display flex
      align-items center
      justify-content center
      transform translateY(100%)
</style>