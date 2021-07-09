<template>
<div>
  <m-header></m-header>
  <tab></tab>
  <!-- 路由渲染出口 -->
  <router-view></router-view>
  <player></player>
</div>
</template>  

<script>
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'
import Player from './components/player/player.vue'

export default {
  components:{
    MHeader,
    Tab,
    Player
  }
}
</script>