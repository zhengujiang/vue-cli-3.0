<template>
  <div id="coverEnd">
    <div class="year-user-info">
      <img class="header-img" :src="userInfo.weixinAvatar"/>
      <div class="user">
        <p class="user-nick">{{userInfo.userName}}</p>
        <p class="user-code">{{companyName + ' ' + companyCode}}</p>
      </div>
    </div>
    <div class="active">
        <img class="active-img" :src="$image.year2018.active_white"/>
        活跃指数:<span class="active-num y-scale-iteration">{{data}}</span>
    </div>
    <div class="end-logo">
      <img :src="$image.year2018.coverEnd_logo"  class="animated y-inLeft"/>
    </div>
    <div class="qrcode">
      <img :src="$image.year2018.qrCode"  class="animated y-zoomIn"/>
      <p>扫码关注信公小安</p>
    </div>
    <div class="btn-box">
      <div id="create-btn" class="cover-btn" v-if="isShare" @click="createMy">生成我的董办2018</div>
      <div id="share-btn" class="cover-btn" v-else @click="showShare">分享给好友</div>
    </div>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        isShare: false
      }
    },
    props: ['userInfo', 'companyCode', 'companyName', 'data'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      if (this.$route.query.code && this.$route.query.name) {
        this.isShare = true
      }
      setTimeout(() => {
        // $('.animated').addClass('pulse');
      }, 5000)
    },
    mounted() {
    },
    // 方法
    methods: {
      createMy() {
         location.href = '/#/year2018'
//        this.$router.push({path: 'xhRedirect', query:{'from': 'year2018'}})
      },
      showShare() {
        this.$emit('showShare')
      }
    }
  }
</script>

<style lang="scss">
  #coverEnd {
    .active {
      display: flex;
      align-items: center;
      justify-content: center;
      width:150px;
      height:27px;
      border:1px solid #fff;
      border-left: 0;
      border-radius:0 25px 25px 0;
      color: #fff;
      margin-top: 20px;
      .active-img {
        width:18px;
        height: 18px;
        margin-right: 5px;
      }
      .active-num {
        font-weight: 600;
        font-size: 16px;
        margin-left: 10px;
      }
    }
    .end-logo {
      padding: 22px 60px 0 60px;
      img {
        width: 100%;
      }
    }
    .qrcode {
      padding: 28px 0 0 0;
      text-align: center;
      img {
        width: 86px;
        height: 86px;
      }
      p {
        font-size: 12px;
        color:#fff;
        margin-top: 5px;
      }
    }
    .btn-box {
      text-align: center;
      padding-bottom: 50px;
      .cover-btn {
        display: inline-block;
        margin-top: 55px;
        width: 226px;
        height: 44px;
        text-align: center;
        line-height: 44px;
        border-radius: 44px;
        font-weight: 400;
        color: #fff;
        font-size: 15px;
        background-color: #ff6830;
      }
    }
  }
</style>
