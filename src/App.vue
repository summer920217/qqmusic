<template>
<div>
  <m-header></m-header>
  <tab></tab>
  <!-- 路由渲染出口 -->
  <router-view></router-view>
  
</div>
</template>  

<script>
import MHeader from './components/m-header/m-header.vue'
import Tab from './components/tab/tab.vue'
export default {
  components:{
    MHeader,
    Tab
  }
}
</script>