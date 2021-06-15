import Vue from 'vue'
import VueRouter from 'vue-router'

import Rank from '@comp/rank/rank'
import Recommend from '@comp/recommend/recommend'
import Search from '@comp/search/search'
import Singer from '@comp/singer/singer'



Vue.use(VueRouter)

export default new VueRouter({
  mode:'history',
  routes:[
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path:'/recommend',
      component:Recommend
    },
    {
      path:'/singer',
      component:Singer
    },
    {
      path:'/rank',
      component:Rank
    },
    {
      path:'/search',
      component:Search
    },
  ]
})
