<template>
  <div id="qrcodewxbox">
    <div class="qrcodeMain">
      <div id="qrcodewx" class="qrcodewx"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'qrcodewx',
    props: {
      redirecturl: {
        type: String,
        required: true
      }
    },
    data() {
      return {
      }
    },
    // 生命周期函数
    created() {
    },
    mounted() {
      this.qrCodeWx()
      this.reset()
    },
    // 方法
    methods: {
      reset () {
        // 每8小时重置二维码
        setTimeout(() => {
          this.qrCodeWx()
          this.reset()
        }, 3600000 * 8)
      },
      qrCodeWx() {
        let state = this.$common.uuid()
        let appid = this.$api.appid
        let redirect_uri = this.redirecturl
        let obj = new WxLogin({
          id: 'qrcodewx',
          appid: appid,
          scope: 'snsapi_login',
          redirect_uri: redirect_uri,
          state: state,
          style: 'black',
          href: '' // http://test.web.in-hope.com.cn/static/css/wxcss.css
        });
      }
    }
  }
</script>

<style lang="scss">
  #qrcodewxbox {
    width:100%;
    display: flex;justify-content: center;
    .qrcodeMain {
      width: 260px;
      height: 260px;
      box-shadow: 0 0 8px rgba(255, 177,72,0.3);
      overflow: hidden;
      .qrcodewx {
        margin-top: -67px;
        margin-left: -20px;
      }
    }

  }
</style>
