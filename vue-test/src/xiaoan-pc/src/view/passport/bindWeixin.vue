<template>
  <div id="bindwx">
    <div class="content">
      <img class="adv" :src="$image.passport.logobg">
      <div class="bindwxbox">
        <v-qrcodewx class="bindwxqrcode" :redirecturl="wxScanRedirectUrl"></v-qrcodewx>
        <div class="bindtext">扫二维码绑定微信，便捷使用！</div>
      </div>
    </div>
  </div>
</template>

<script>
  import input from '@/components/input'
  import qrcodewx from '@/components/qrcodewx'
  export default {
    data() {
      return {
        wxScanRedirectUrl: ''
      }
    },
    // 使用其它组件
    components: {
      'v-input': input,
      'v-qrcodewx': qrcodewx
    },
    watch: {},
    methods: {
      bannerH() {
        this.windowH = document.body.clientHeight
        const that = this
        window.onresize = function temp() {
          that.windowH = document.body.clientHeight
        }
        var header = document.getElementById('header').clientHeight
        var footer = document.getElementById('footer').clientHeight
        var login = document.getElementById('bindwx')
        login.style.height = (this.windowH - footer - header) + 'px'
        login.style.minHeight = '580px'
      },
      qrcsanbinduserafterlogin() {
        let code = this.$route.query.code
        let state = this.$route.query.state
        if (code) {
          this.$http({
            method: 'POST',
            url: this.$api.user.qrcsanbinduserafterlogin,
            params: {
              code: code,
              state: state
            }
          }).then((res) => {
            if (res.data.returnCode === 1) {
              // 扫码登录成功
              // this.setStore(res.data.returnObject)
              this.$auth.setStore(this, res.data.returnObject)
              this.$message({message: '绑定成功', showClose: true, type: 'success', duration: 3000})
              this.$router.push('/index')
            } else if (res.data.returnCode === 523) {
              // 扫码登录失败，验证流程
              this.$message({showClose: true, type: 'error', duration: 3000, message: '系统异常，请重新扫码'})
            } else if (res.data.returnCode === 524) {
              // 扫码登录失败，验证流程
              this.$message({showClose: true, type: 'error', duration: 3000, message: '微信号已经绑定其它账号'})
            } else if (res.data.returnCode === 512) {
              // code失效，重新扫码
              this.$message({showClose: true, type: 'error', duration: 3000, message: 'code失效，请重新扫码'})
              location.href = '/bindWeixin'
            }
          })
        }
      }
    },
    beforeCreate() {
    },
    // 生命周期函数
    created() {
      this.wxScanRedirectUrl = this.$api.host + 'bindWeixin'
      this.qrcsanbinduserafterlogin()
    },
    mounted() {
      this.bannerH()
    }
  }
</script>

<style lang="scss">
  #bindwx {
    .ts {
      transition: all .3s;
    }
    a {
      color: #ffb148;
      transition: all .3s;
    }
    a:hover {
      color: lighten(#ffb148, 10%)
    }
    .content {
      height: 100%;
      .adv {
        float: left;
      }
      .bindwxbox {
        position: relative;
        width: 360px;
        height: 450px;
        float: right;
        margin: 60px 100px 0 0;
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        .bindwxqrcode {
          margin-top: 50px;
        }
        .bindtext {
          position: absolute;
          bottom: 0;
          width: 100%;
          color: #fff;
          text-align: center;
          height: 80px;
          line-height: 80px;
          background-color: #ffb148;
          font-size: 16px;
        }
      }
    }
  }

</style>
