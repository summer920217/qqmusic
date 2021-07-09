<template>
  <div class="player" v-if="getPlayList.length>0">
    <transition name="normal">
      <div class="normal-player" v-show="getFullScreen">
        <div class="background">
          <img :src="imgUrl" width="100%" height="100%" />
        </div>
        <!-- 返回按钮和歌曲信息 -->
        <div class="top" @click="toggle">
          <div class="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title">{{getCurrentSong.songname}}</h1>
          <h2 class="subtitle">{{getSingerInfo.fname}}</h2>
        </div>
        <!-- 中间播放的CD -->
        <div class="middle">
          <div class="middle-l">
            <div class="cd-wrapper">
              <div class="cd" :class="rotateCD">
                <img class="image" :src="imgUrl" alt />
              </div>
            </div>
          </div>
        </div>
        <!-- 底部的按钮 -->
        <div class="bottom">
          <!-- 切换的状态点 -->
          <div class="dot-wrapper"></div>
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <!-- 已经播放的时间 -->
            <div class="time time-l">{{formatCurrentTime}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @changePercent="changePercent" @updateTime="updateTime"></progress-bar>
            </div>
            <!-- 当前歌曲的总时间 -->
            <div class="time time-r">{{duration}}</div>
          </div>
          <!-- 播放的操作按钮 -->
          <div class="operators">
            <div class="icon i-left">
              <i :class="modeIcon" @click="toggleMode"></i>
            </div>
            <div class="icon i-left">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center">
              <i :class="toggleIcon" @click="togglePlay"></i>
            </div>
            <div class="icon i-right">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i :class="likeIcon" @click="toggleLikeIcon"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show="!getFullScreen" @click="toggle">
        <div class="icon">
          <img :src="imgUrl" width="40" height="40" />
        </div>
        <div class="text">
          <h2 class="name">{{getCurrentSong.songname}}</h2>
          <p class="desc">{{getSingerInfo.fname}}</p>
        </div>
        <div class="control">
          <i :class="toggleMiniIcon" @click.stop="togglePlay"></i> 
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <audio :src="getCurrentSong.url" @timeupdate="timeUpdate" @ended="playEnd"  ref="audio"></audio>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import tool from '../../api/player'
import {SEQUENCE,LOOP,RANDOM} from '../../common/js/mode'
import ProgressBar from '../../base/progress-bar/progress-bar.vue'

export default {
  data() {
    return {
      isLikeIcon:false,//是否喜欢
      currentTime:0,//当前播放的时间
    }
  },
  computed:{
    ...mapGetters([
      "getSingerInfo",
      "getPlayList",
      "getFullScreen",
      "getPlaying",
      "getCurrentSong",
      "getCurrentIndex",
      "getPlayMode",
      "getOrderList"
    ]),
    //根据playing的状态，返回对应的图标
    toggleIcon(){
      return this.getPlaying?"icon-pause":"icon-play";
    },
    //mini播放器的小图标
    toggleMiniIcon(){
      return this.getPlaying?"icon-pause-mini":"icon-play-mini";
    },

    //获取当前播放歌曲的专辑图片(CD图片)
    imgUrl(){
      //图片是根据歌曲的albummid值获取的
      return ` https://y.qq.com/music/photo_new/T002R300x300M000${this.getCurrentSong.albummid}_1.jpg?max_age=2592000`
    },
    //根据播放状态决定cd是否转动
    rotateCD(){
      return this.getPlaying?"play":"play pause"
    },
    //根据isLikeIcon返回对应的图标类名
    likeIcon(){
      return this.isLikeIcon?"icon-favorite":"icon-not-favorite"
    },
    //根据播放模式的值，返回对应的图标
    modeIcon(){
      let mode = this.getPlayMode;//播放模式
      return mode==SEQUENCE?"icon-sequence":mode==LOOP?"icon-loop":"icon-random";
    },
    //歌曲的总时间
    duration(){
      //获取歌曲的总秒数
      let interval = this.getCurrentSong.interval;
      let m = Math.floor(interval/60);
      let s = interval%60;
      m = m<10?'0'+m:m;
      s = s<10?'0'+s:s;
      return `${m}:${s}`;
    },
    //格式化当前时间
    formatCurrentTime(){
      let m = Math.floor(this.currentTime/60);
      let s = this.currentTime%60;
      m = m<10?'0'+m:m;
      s = s<10?'0'+s:s;
      return `${m}:${s}`;
    },
    //当前播放比例
    percent(){
      return this.currentTime / this.getCurrentSong.interval;
    }

  },
  methods: {
    ...mapMutations([
      "setFullScreen",
      "setPlaying",
      "setCurrentIndex",
      "setPlayMode",
      "setPlayList"
      ]),

    //大屏和小屏 模式切换
    toggle(){
      this.setFullScreen({
        fullScreen:!this.getFullScreen
      })
    },
    //播放暂停切换
    togglePlay(){
      //当前播放，点击就暂停
      //当前暂停，点击就播放
      this.setPlaying({
        playing:!this.getPlaying
      })
    },
    //切换是否喜欢
    toggleLikeIcon(){
      this.isLikeIcon = !this.isLikeIcon;
    },
    //上一首歌
    prev(){
      //实际上就是当前播放歌曲的下标-1
      let curIndex = this.getCurrentIndex;//获取当前歌曲下标
      let songs = this.getPlayList;//获取播放列表
      curIndex --;//下标-1
      //判断下标是否正确
      if(curIndex<0){
        //如果当前下标为-1(之前播放的是第一首歌，上一首就应该是整个播放里的最后一首歌)
        curIndex = songs.length - 1;
      }
      //获取新下标的歌曲的地址
      let songmid = songs[curIndex].songmid;
      tool.getPlayKey(songmid).then(url=>{
        console.log(url)
        //将url设置给当前歌曲
        this.$set(songs[curIndex],"url",url);
        //设置当前播放的下标
        this.setCurrentIndex({
          currentIndex:curIndex
        })
        
      }).catch(err=>{
        console.log(err);
        //获取上一首失败
        //先设置当前索引
        this.setCurrentIndex({
          currentIndex:curIndex
        });
        //自调
        this.prev();
      })
      
    },
    //下一首歌
    next(){
      //实际上就是当前播放歌曲的下标+1
      let curIndex = this.getCurrentIndex;//获取当前歌曲下标
      let songs = this.getPlayList;//获取播放列表
      curIndex ++;//下标-1
      //判断下标是否正确
      if(curIndex>=songs.length){
        curIndex = 0;
      }
      //获取新下标的歌曲的地址
      let songmid = songs[curIndex].songmid;
      tool.getPlayKey(songmid).then(url=>{
        console.log(url)
        //将url设置给当前歌曲
        this.$set(songs[curIndex],"url",url);
        //设置当前播放的下标
        this.setCurrentIndex({
          currentIndex:curIndex
        })
        
      }).catch(err=>{
        console.log(err);
        this.setCurrentIndex({
          currentIndex:curIndex
        });
        //自调
        this.next();
      })
    },
    //切换播放模式
    toggleMode(){
      let mode = this.getPlayMode;//获取当前模式
      mode = (mode+1) % 3 + 1;//模式增加改变
      //将新的mode值设置进playMode里
      this.setPlayMode({
        playMode:mode
      });

      let list = [];//最终保存到播放列表中的数据
      // 根据播放的模式修改播放的列表
      if(mode == SEQUENCE){//顺序播放，播放列表和顺序列表是一样的
        list = this.getOrderList;
      }else{ 
        //随机播放
        //将乱序后的播放列表赋值给list
        list = this._randomList(this.getOrderList);
      }
      //重置当前播放歌曲的下标
      this._resetCurrentIndex(list);

      //将排序后的歌曲列表重新放入播放列表中
      this.setPlayList({
        playList:list
      })

    },
    //乱序播放的顺序列表
    _randomList(list){
      //先复制一份新数组，以免修改了原数组
      let arr = [...list];
      for(let i=0;i<arr.length;i++){
        let r = Math.floor(Math.random()*arr.length);
        let temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
      }
      return arr;
    },
    //排序后重置歌曲列表中当前正在播放的歌曲的下标
    _resetCurrentIndex(list){
      //从排序后的list中找到当前正在播放的歌曲
      let song = this.getCurrentSong;
      let index = list.findIndex(val=>song ==val)
      // return index;
      //设置当前播放歌曲的新的下标
      this.setCurrentIndex({
        currentIndex:index
      })
    },
    //获取当前播放的时间
    timeUpdate(e){
      this.currentTime = Math.floor(e.target.currentTime);
    },
    //修改歌曲的播放进度
    changePercent(percent){
      //接收传递回来的进度百分比
      //根据百分比算出对应歌曲的播放时间
      //将歌曲的播放进度调整到对应的时间
      //同时，将播放状态修改为true
      // 当前的播放时间 = 百分比*歌曲的总时间
      let currentTime = percent * this.getCurrentSong.interval;
      //修改当前的播放时间
      this.$refs.audio.currentTime = currentTime;

      //设置播放状态
      this.setPlaying({
        playing:true
      });
    },
    //实时更新左侧的播放时间
    updateTime(percent){
      this.currentTime = Math.floor(percent*this.getCurrentSong.interval);
    },
    //播放结束后
    playEnd(){
      //如果是循环播放，则继续播放这一首歌
      if(this.getPlayMode == LOOP){
        //重置播放时间
        this.$refs.audio.currentTime = 0;//音乐播放的时间
        this.currentTime = 0;//自己定义的属性用来记录的播放时间
        //继续播放
        this.$refs.audio.play();
        return ;
      }
      //非循环模式，播放下一首
      this.next();
    }


  },
  
  watch:{
    //监听当前歌曲是否发生变化
    getCurrentSong(){
      //发生变化，重新设置播放的歌曲
      this.$nextTick(()=>{
        //获取audio对象 ，调用播放的方法
        this.$refs.audio.volume = 0.3;
        this.$refs.audio.play();
        //修改播放状态
        this.setPlaying({
          playing:true
        })
      })
    },
    //监听歌曲播放状态(播放还是暂停)
    getPlaying(){
      this.$nextTick(()=>{
        this.getPlaying ? this.$refs.audio.play() : this.$refs.audio.pause()
      })
    }
  },
  components:{
    ProgressBar
  }
}
</script>

<style scoped lang="stylus" >
@import '~@common/stylus/variable'
@import '~@common/stylus/mixin'
.player
  .normal-player
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 5
    background $color-background
    .background
      position absolute
      left 0
      top 0
      width 100%
      height 100%
      z-index -1
      opacity 0.9
      filter blur(40px)
    .top
      position relative
      margin-bottom 25px
      .back
        position absolute
        top 0
        left 6px
        z-index 50
        .icon-back
          display block
          padding 9px
          font-size $font-size-large-x
          color $color-theme
          transform rotate(-90deg)
      .title
        width 70%
        margin 0 auto
        line-height 40px
        text-align center
        no-wrap()
        font-size $font-size-large
        color #f2f2f2
      .subtitle
        line-height 20px
        text-align center
        font-size $font-size-medium
        color #f2f2f2
    .middle
      position fixed
      width 100%
      top 80px
      bottom 170px
      white-space nowrap
      font-size 0
      .middle-l
        display inline-block
        vertical-align top
        position relative
        width 100%
        height 0
        padding-top 80%
        .cd-wrapper
          position absolute
          left 10%
          top 0
          width 80%
          height 100%
          .cd
            width 100%
            height 100%
            box-sizing border-box
            border 10px solid rgba(255, 255, 255, 0.1)
            border-radius 50%
            &.play
              animation rotate 20s linear infinite
            &.pause
              animation-play-state paused
            .image
              position absolute
              left 0
              top 0
              width 100%
              height 100%
              border-radius 50%
        .playing-lyric-wrapper
          width 80%
          margin 30px auto 0 auto
          overflow hidden
          text-align center
          .playing-lyric
            height 20px
            line-height 20px
            font-size $font-size-medium
            color #f9f9f9
      .middle-r
        display inline-block
        vertical-align top
        width 100%
        height 100%
        overflow hidden
        .lyric-wrapper
          width 80%
          margin 0 auto
          overflow hidden
          text-align center
          .text
            line-height 32px
            color rgba(250, 250, 250, 0.7)
            font-size $font-size-medium-x
            &.current
              color #fff
    .bottom
      position absolute
      bottom 20px
      width 100%
      .dot-wrapper
        text-align center
        font-size 0
        .dot
          display inline-block
          vertical-align middle
          margin 0 4px
          width 8px
          height 8px
          border-radius 50%
          background $color-text-l
          &.active
            width 20px
            border-radius 5px
            background $color-text-ll
      .progress-wrapper
        display flex
        align-items center
        width 86%
        margin 0px auto
        padding 10px 0
        .time
          color #f2f2f2
          font-size $font-size-small
          flex 0 0 30px
          line-height 30px
          width 30px
          &.time-l
            text-align left
          &.time-r
            text-align right
        .progress-bar-wrapper
          flex 1
          margin 0 10px
      .operators
        display flex
        align-items center
        .icon
          flex 1
          color $color-theme
          &.disable
            color $color-theme-d
          i
            font-size 30px
        .i-left
          text-align right
        .i-center
          padding 0 20px
          text-align center
          i
            font-size 40px
        .i-right
          text-align left
        .icon-favorite
          color $color-sub-theme
    &.normal-enter-active, &.normal-leave-active
      transition all 0.4s
      .top, .bottom
        transition all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
    &.normal-enter, &.normal-leave-to
      opacity 0
      .top
        transform translate3d(0, -100px, 0)
      .bottom
        transform translate3d(0, 100px, 0)
  .mini-player
    display flex
    align-items center
    position fixed
    left 0
    bottom 0
    z-index 180
    width 100%
    height 60px
    background #fff
    box-shadow 0 -5px 10px rgba(0, 0, 0, 0.1)
    &.mini-enter-active, &.mini-leave-active
      transition all 0.4s
    &.mini-enter, &.mini-leave-to
      opacity 0
    .icon
      flex 0 0 40px
      width 40px
      padding 0 10px 0 20px
      img
        border-radius 50%
        &.play
          animation rotate 10s linear infinite
        &.pause
          animation-play-state paused
    .text
      display flex
      flex-direction column
      justify-content center
      flex 1
      line-height 20px
      overflow hidden
      .name
        margin-bottom 2px
        no-wrap()
        font-size $font-size-medium
        color $color-text
      .desc
        no-wrap()
        font-size $font-size-small
        color $color-text-d
    .control
      flex 0 0 30px
      width 30px
      padding 0 10px
      .icon-play-mini, .icon-pause-mini, .icon-playlist
        font-size 30px
        color #31c27c
      .icon-mini
        font-size 32px
        position absolute
        left 0
        top 0
@keyframes rotate
  0%
    transform rotate(0)
  100%
    transform rotate(360deg)
</style>