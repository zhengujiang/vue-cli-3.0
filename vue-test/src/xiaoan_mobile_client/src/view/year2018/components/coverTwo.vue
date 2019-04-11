<template>
  <div id="coverTwo">
    <div class="year-user-info">
      <img class="header-img" :src="userInfo.weixinAvatar"/>
      <div class="user">
        <p class="user-nick">{{userInfo.userName}}</p>
        <p class="user-code">{{companyName + ' ' + companyCode}}</p>
      </div>
    </div>
    <div class="title1">
      <img :src="$image.year2018.xinku"  class="animated y-swing"/>
    </div>
    <div class="title2">
      <img :src="$image.year2018.jide" class="animated y-fadeInUp delay-1s"/>
    </div>
    <div class="work">
      <img :src="$image.year2018.work" class="animated  y-zoomIn delay-2s"/>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: ['userInfo', 'companyCode', 'companyName', 'data'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      setTimeout(() => {
        // $('.animated').addClass('pulse');
      }, 5000)
    },
    mounted() {
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  #coverTwo {
    /*margin-top: 19px;*/
    .title1 {
      padding: 20px 37px 0 50px;
      img {
        width: 100%;
      }
    }
    .title2 {
      padding: 9px 57px 0 60px;
      img {
        width: 100%;
      }
    }
    .work {
      padding: 28px 48px 0 58px;
      img {
        width: 100%;
      }
    }
  }
</style>
