<template>
  <div class='singer-detail'>
    <MusicList :title="singer.fname" :avatar="singer.avatar" :songs="songs"></MusicList>
  </div>
</template>

<script>
import MusicList from '../../base/musicList/musicList.vue'
import {mapGetters} from 'vuex'
import {getSongList} from '../../api/singer'
import Song from '../../common/js/Song'

export default {
  data() {
    return {
      songs:[]
    }
  },
  methods: {
    _getSongList(){
      // console.log(this.singer.fid);
      getSongList(this.singer.fid)
      .then(list=>{
        // console.log(list)
        list.forEach(val => {
          // console.log(val)
          this.songs.push(new Song(val.musicData))
        });
      })
    }
  },
  created() {
    this._getSongList();
  },
  computed:{
    ...mapGetters(['getSingerInfo']),
    singer(){
      return this.getSingerInfo
    }
  },
  components:{
    MusicList
  }
}
</script>

<style scoped lang="stylus">
  @import "../../common/stylus/variable"
  .singer-detail
    position: fixed
    z-index: 100
    top: 0
    left: 0
    right: 0
    bottom: 0
    background: $color-background
</style>