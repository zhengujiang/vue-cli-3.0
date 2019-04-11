<template>
  <div class="roadshow">
    <div id="iframe-box">
      <img :src="imgSrc" width="100%" height="100%" alt="">
      <div class="linkRoadShow" @click="application">{{ text }}</div>
    </div>
    <v-returnHome position="fixed" bottom="6%"></v-returnHome>
    <v-loading v-show="isloading"></v-loading>
  </div>

</template>

<script>
  import returnHome from "../../components/warning/returnHome.vue"
  import loading from "../../components/warning/loading.vue"

  export default {
    name: 'rulesDemo1',
    data() {
      return {
        url: '',
        isloading: true,
        code: '',
        imgSrc: this.$image.rules.roadShow,
        text: '注册参与'
      };
    },
    mounted() {
      var adverttitle = "信公小安×路演中";
      var sharelink2 = window.location.href;//分享链接
      var shareDesc = 'Top100上市公司IR旗舰店火热招募中';//描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
      this.$nextTick(() => {
        this.luyanzhong();
      })
    },
    components: {
      "v-returnHome": returnHome,
      "v-loading": loading
    },
    methods: {
      luyanzhong() {
        this.isloading = false;
      },
      application() {
        // 埋点勿删
        // MtaH5.clickStat('Vv55tXYlcJIhB0Xm', {'ro489h8oip0836c9': 'true'})
        this.$MTAmethod.mtaShare('Vv55tXYlcJIhB0Xm', {'ro489h8oip0836c9': 'true'})
        var user_id = this.$cookie.getCookie("userId");
        if (user_id !== '' && user_id !== undefined && user_id !== null) {
          //用户已登录可拿到相关信息
          /*this.$http ({
            method: "GET",
            url: this.$api.userHome.userhome,
            params: {},
          })*/
          this.$axios.userHome.userhome({}).then((res) => {
            if (res.data.returnCode == 1) {
              this.code = res.data.returnObject.companyCode ? res.data.returnObject.companyCode : "";
              console.log(this.code)
              var args = {
                stockCode: this.code,
              };
              var form = $("<form method='post'></form>"),
                input;
              form.attr({"action": "http://www.roadshowchina.cn/Wap/company/applyFlagshipStore.html?code=" + this.code});
              $.each(args, function (key, value) {
                input = $("<input type='hidden'>");
                input.attr({"name": key});
                input.val(value);
                form.append(input);
              });
              $(document.body).append(form);
              form.submit();
            } else {
              this.$toast({message: '用户信息获取失败', position: 'middle', duration: 1500});
            }
          }).catch((err) => {
            console.log(err);
            this.$toast({message: '网络错误', position: 'middle', duration: 1500});
          })
        } else {
          //用户未登录
          if (!window.sessionStorage) {
            return false;
          } else {
            this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
          }
        }
      }
    }
  }
</script>

<style>
  .roadshow {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  #iframe-box {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  .linkRoadShow {
    color: #8a4505;
    border: 0;
    background: #e0b864;
    background: -webkit-gradient(linear, left top, left bottom, color-stop(0, #ffdb8a), color-stop(1, #e0b864));
    background: -moz-linear-gradient(top, #e0b864, #ffdb8a);
    background: linear-gradient(top, #e0b864, #ffdb8a);
    position: absolute;
    bottom: 18%;
    height: 35px;
    line-height: 35px;
    text-align: center;
    width: 60%;
    font-size: 18px;
    margin: auto;
    left: 20%;
    font-family: '微软雅黑 Regular';
    border-radius: 5px;
    font-weight: 500;
  }
</style>
