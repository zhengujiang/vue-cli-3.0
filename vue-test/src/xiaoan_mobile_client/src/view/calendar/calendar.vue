<template>
  <div class="calendar-body-box">
    <transition :name="'vux-pop-' + (direction === 'forward' ? 'in' : 'out')">
      <keep-alive include="calendar-all,calendar-search">
        <router-view/>
      </keep-alive>
    </transition>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  export default {
    name: "calendar",
    data() {
      return {}
    },
    watch: {
      '$route': function (to, form, next) {
        if (this.$route.path.indexOf('calendar') > -1) {
          // 是日历的页面
          this.$vux.datetime.hide()
        } else {
          // 不是日历的页面
          this.$vux.datetime.hide()
        }
      },
    },
    computed: {
      ...mapState({
        direction: state => state.mutations.direction,
      })
    },
  }
</script>

<style lang="scss" scoped>
  .calendar-body-box {
    width: 100%;
    height: 100%;
    background-color: #fff;
    overflow: hidden;
  }
</style>
