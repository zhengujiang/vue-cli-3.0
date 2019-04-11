<template>
  <transition name="bounce">
    <div class="xhIndex">
      <!--缓存想要缓存的页面，实现后退不刷新-->
      <!--加上v-if的判断，可以自定义想要缓存的组件，自定义在router里面-->
      <router-view></router-view>
      <!--这里是其他的代码-->
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'xhIndex',
    data () {
      return {}
    }
  }
</script>

<style lang="scss">
  .xhIndex {
    width: 100%;
    height: 100%;
  }
</style>

