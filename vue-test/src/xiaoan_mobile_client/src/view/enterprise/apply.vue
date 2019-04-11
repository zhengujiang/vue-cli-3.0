<template>
  <div id="enterpriseApply">
    <div class="step-zero" v-show="step==0">
      <img class="bgimg" :src="$image.enterprise.bg"/>
      <div class="zeroBtn" @click="stepNext(1)">立即申请</div>
      <div class="tip">
        *本次活动最终解释权归信公小安所有
      </div>
    </div>
    <div class="step-one" v-show="step==1">
      <div class="topBox">
        <img v-if="weixinAvatar" class="headerImg" :src="weixinAvatar"/>
        <img v-else class="headerImg" :src="$image.personal.timg">
        <div class="name">{{userName}}</div>
      </div>
      <!--<div class="topBox">
        <img class="headerImg" src="/static/img/personal/timg@2x.png" alt="">
        <div class="name">请先登陆</div>
      </div>-->
      <div class="uploadbox">
        <div class="title">请上传个人名片</div>
        <img v-show="base64Info" class="loadImg upfile" :src="base64Info" @click.prevent="uploadfile()">
        <img v-show="!base64Info" class="loadImg" :src="$image.enterprise.uploadImg" @click.prevent="uploadfile()">
        <input id="upfile" accept="image/*" type="file" style="display: none" @change="selectFile">
      </div>
      <div class="codebox">
        邀请码：
        <input type="input" class="code" v-model="inviteFromCode" placeholder="若无邀请码无需填写">
      </div>
      <div class="q">
        为什么需要上传个人名片？
      </div>
      <div class="a">
        小安管理员将依据您提供的个人名片，核实您的个人信息。核实后开通小安企业版权限。
      </div>
      <div class="applyBtn" @click="stepNext(2)">下一步</div>
    </div>
    <div class="step-two" v-show="step==2">
      <div class="logobox">
        <img class="xiaoan-logo" :src="$image.enterprise.logo">
      </div>
      <div class="intro">
        信公小安是一款专为信息披露开发工作的智能移动工具，一站式法规检索、公告查询、合规知识学习，海量资本市场资讯信息，触手可及！
      </div>
      <div class="center"><a :href="gzhUrl">进入公众号关注小安 ></a></div>
      <div class="q">为什么需要关注该公众号？</div>
      <div class="a">您的审核信息将通过微信公众号通知的方式及时反馈给您。</div>
      <div class="applyBtn" @click="stepNext(3)">已关注，下一步</div>
    </div>
    <div class="step-three" v-show="step==3">
      <div class="login-loading">
        <img class="loading-img" :src="$image.personal.register" alt="">
        <p class="texttip">申请成功!</p>
        <p class="timetip">
          <span class="second">{{ timer }}秒</span>后将自动跳转至小安首页！
        </p>
      </div>
      <div class="intro">
        感谢您申请信公小安企业版试用账号，<br/>
        信公小安管理员会在1个工作日内审核相关信息的真实性，并为您开通企业版权限。<br/>
        联系电话：021-2074-0322<br/>
        联系邮箱：xiaoan_help@infaith.com.cn<br/>
        客服微信号：infaithjinjin<br/>
      </div>
    </div>
    <div class="step-four" v-show="step==4">
      <div class="login-loading">
        <img class="loading-img" :src="$image.personal.register" alt="">
        <p class="texttip">你已经是企业用户，无法再次申请!</p>
        <p class="timetip">
          <span class="second">{{ timer }}秒</span>后将自动跳转至小安首页！
        </p>
      </div>
    </div>
    <div class="step-four" v-show="step==5">
      <div class="login-loading">
        <img class="loading-img" :src="$image.personal.register" alt="">
        <p class="texttip">你已经申请，请等待审核!</p>
        <p class="timetip">
          <span class="second">{{ timer }}秒</span>后将自动跳转至小安首页！
        </p>
      </div>
    </div>
  </div>
</template>

<script>
  import { Loading } from 'vux'
  export default {
    data() {
      return {
        userId: '',
        step: 0,
        timer: 2,
        setTimeDown: '',
        base64Info: '',
        uploadImgUrl: '',
        createUserId: '',
        userName: '',
        weixinAvatar: '',
        enterprisePackageId: '', // 企业版套餐ID
        inviteFromCode: '',
        gzhUrl: 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI1MDc3NzY5NA==&scene=126#wechat_redirect'
      }
    },
    // 使用其它组件
    components: {
      Loading
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.getCookie("userId");
      if (!this.$cookie.isLogin()) {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      if (this.$route.query.code) {
        this.inviteFromCode = this.$route.query.code
        this.step = 0
      } else {
        this.step = 1
      }
      this.getEnterprisePackage()
      this.apiUserHome()
    },
    mounted() {
    },
    // 方法
    methods: {
      // 选择图片点击事件
      uploadfile () {
        document.querySelector('#upfile').click()
      },
      // 选择图片生成base64
      selectFile () {
        var file = document.querySelector('#upfile').files[0];
        var reader = new FileReader();
        if (file && file.type.match('image.*')) {
          reader.readAsDataURL(file);
        }
        reader.onloadend = () => {
          // img.setAttribute('src', reader.result);
          this.base64Info = reader.result
          let base64head = reader.result
          console.log(base64head)
          // this.uploadPicByBase64(this.uploadImgUrl)
        }
      },
      //上传图片
      uploadPicByBase64() {
        // 显示
        if (!this.base64Info) {
          this.$vux.toast.show({text: '请先上传名片！', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return false
        }
        this.$vux.loading.show({text: '正在上传名片'})
        /*this.$http ({
          method: 'POST',
          url: this.$api.enterprise.uploadPicByBase64,
          data: {
            base64: this.base64Info
          }
        })*/
        let params = { base64: this.base64Info }
        this.$axios.enterprise.uploadPicByBase64(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.step = 2
            this.uploadImgUrl = res.data.returnObject
            this.$vux.loading.hide()
            // this.$vux.toast.show({text: '上传成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$vux.toast.show({text: res.data.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      //获取套餐ID
      getEnterprisePackage() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.enterprise.getEnterprisePackage,
          params: {}
        })*/
        let params = {}
        this.$axios.enterprise.getEnterprisePackage(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.enterprisePackageId = res.data.returnObject[0].id
          }
        })
      },
      // 获取登录信息
      apiUserHome() {
        /* this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        }) */
        this.$axios.userHome.userhome({}).then((res) => {
          if (res.data.returnCode == 1) {
            this.selectUserId = res.data.returnObject.id
            this.weixinAvatar = res.data.returnObject.weixinAvatar
            this.userName = res.data.returnObject.userName
//            if (res.data.returnObject.enterpriseUser) {
//              this.step = 4
//              this.timeDown()
//            } else if (res.data.returnObject.applyEnterprise) {
//              this.step = 5
//              this.timeDown()
//            }
          }
        })
      },
      // 申请企业版
      applyEnterprise() {
        if (!this.selectUserId) {
          this.$vux.toast.show({text: '用户信息错误，请稍后再试！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
        if (!this.enterprisePackageId) {
          this.$vux.toast.show({text: '申请失败，请稍后再试！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
        /*this.$http ({
          method: 'POST',
          url: this.$api.enterprise.applyEnterprise,
          data: {
//            applyCompanyCode: "",
//            applyCompanyName: "",
//            applyUserMobile: "",
//            applyUserName: "",
//            free:true,
            createUserId: this.selectUserId,
            packageId: this.enterprisePackageId,
            voucherLink: this.uploadImgUrl,
            inviteFromCode: this.inviteFromCode
          }
        })*/
        let params = {
          createUserId: this.selectUserId,
          packageId: this.enterprisePackageId,
          voucherLink: this.uploadImgUrl,
          inviteFromCode: this.inviteFromCode
        }
        this.$axios.enterprise.applyEnterprise(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            localStorage.setItem('enterpriseApply', this.$cookie.getCookie("userId"))
            this.step = 3
            this.timeDown()
            // this.$vux.toast.show({text: '申请成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.$vux.toast.show({text: res.data.returnMsg, position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 步骤
      stepNext (value) {
        // alert(value)
        if (value == 1) {
          this.step = 1
        } else if (value == 2) {
          this.uploadPicByBase64()
        } else if (value == 3) {
          this.applyEnterprise()
        }
      },
      // 倒计时
      timeDown () {
        this.setTimeDown = setInterval(() => {
          if (this.timer > 0) {
            this.timer--
          } else {
            clearInterval(this.setTimeDown)
            this.$router.push({path: '/rule', query: {from: 'apply'}})
          }
        }, 1000)
      }
    }
  }
</script>

<style lang="scss">
  #enterpriseApply {
    height: 100%;
    .applyBtn {
      position: absolute;
      left:15px;
      bottom: 10px;
      font-size: 18px;
      background-color: #ffb148;
      color:#fff;
      height: 50px;
      line-height: 50px;
      text-align: center;
      width:345px;
      border-radius: 3px;
      /*margin-left: 15px;*/
      /*margin-top: 20px;*/
    }
    .step-zero {
      min-height: 100%;
      background-color: #f5f7ff;
      .bgimg {
        width:100%;
      }
      .tip {
        position: absolute;
        left:0;
        bottom: 20px;
        text-align: center;
        color: #3b3c54;
        opacity: .8;
        width: 100%;
      }
      .zeroBtn {
        position: absolute;
        left:15px;
        bottom: 70px;
        font-size: 18px;
        background-color: #6373ff;
        color:#fff;
        height: 50px;
        line-height: 50px;
        text-align: center;
        width:345px;
        border-radius: 3px;
      }
    }
    .step-one {
      height:100%;
      .topBox {
        background-color: #ffbc4e;
        height: 100px;
        text-align: center;
        .headerImg {
          margin-top: 15px;
          width:50px;
          height: 50px;
          border-radius: 50%;
        }
        .name {
          font-size: 15px;
          color:#fff;
          text-align: center;
        }
      }
      .uploadbox {
        height: 255px;
        padding: 15px 15px 0 15px;
        .title {
          font-size: 15px;
        }
        .loadImg {
          height: 205px;
          width: 345px;
          /*background-color: #f0f1f5;*/
          /*border: 1px dashed #e3e3e3;*/
          margin-top:5px;
          border-radius: 3px;
          -webkit-user-select: none;
          -moz-user-select: none;
          -webkit-user-select:none;
          -o-user-select:none;
          user-select:none;
        }
        .upfile {
          background-color: #f0f1f5;
          border: 1px dashed #e3e3e3;

        }
      }
      .codebox {
        padding: 0 15px 10px;
        color: #323232;
        font-size: 14px;
        .code {
          border: 1px solid #e3e3e3;
          height: 28px;
          padding: 0 5px;
          border-radius: 3px;
          font-size: 14px;
        }
      }
      .q {
        padding: 0 15px 10px;
        color: #323232;
        font-size: 14px;
      }
      .a {
        padding: 0 15px 10px;
        color: #8d8d8d;
        font-size: 14px;
      }
    }
    .step-two {
      padding: 15px 30px;
      .logobox {
        text-align: center;
        .xiaoan-logo {
          width:74px;
        }
      }
      .intro {
        margin-top:10px;
        border-top:1px solid #e3e3e3;
        padding: 10px 0;
        text-align: left;
        font-size: 13px;
      }
      a {
        color: #ffb148;
        text-decoration: underline;
        font-size: 15px;
        margin: 40px 0;
        display: inline-block;
      }
      .q {
        padding: 0 0 10px 0;
        color: #323232;
        font-size: 14px;
      }
      .a {
        padding: 0 0 10px 0;
        color: #8d8d8d;
        font-size: 14px;
      }
    }
    .step-three {
      .login-loading {
        padding-top: 100px;
        .loading-img {
          width: 63px;
          height: 63px;
          margin: 0 auto;
          display: block;
        }
        .texttip {
          margin-top:25px;
          color: #323232;
          font-size: 15px;
          font-weight: 600;
          text-align: center;
        }
        .timetip {
          color: #323232;
          font-size: 15px;
          text-align: center;
          padding: 10px 0 20px 0;
          .second {
            color: #ffb148;
          }
        }
      }
      .intro {
        font-size: 12px;
        color: #8d8d8d;
        line-height: 20px;
        text-align: center;
      }
    }
    .step-four {
      .login-loading {
        padding-top: 100px;
        .loading-img {
          width: 63px;
          height: 63px;
          margin: 0 auto;
          display: block;
        }
        .texttip {
          margin-top:25px;
          color: #323232;
          font-size: 15px;
          font-weight: 600;
          text-align: center;
        }
        .timetip {
          color: #323232;
          font-size: 15px;
          text-align: center;
          padding: 10px 0 20px 0;
          .second {
            color: #ffb148;
          }
        }
      }
      .intro {
        font-size: 12px;
        color: #8d8d8d;
        line-height: 20px;
        text-align: center;
      }
    }
  }
</style>
