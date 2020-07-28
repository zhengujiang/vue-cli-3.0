<template>
  <div id="changemobile" class="content">
    <div class="title"><span class="txt fc">更换密码</span></div>
    <div class="changeinfo">
      <!--<div class="info">你绑定的手机号码是：15021780462</div>-->
      <div class="space"></div>
      <v-input :id="'cgoldpwd'" :text="'原密码'" :regx="'password'" :errmsg="'密码6-20位'" v-model="oldpwd" ></v-input>
      <v-input :id="'cgpwd'" :text="'新密码'" :regx="'password'" :errmsg="'密码6-20位'" v-model="pwd" ></v-input>
      <v-input :id="'cgrepwd'" :text="'确认新密码'" :regx="'password'" :errmsg="'密码6-20位'" v-model="repwd"  :tip="repwdtip" @blur="reregblur"></v-input>
      <v-input :id="'cgimgcode'" :text="'验证码'" :regx="'imgcode'" :errmsg="'验证码错误'"  :maxlength="'4'" v-model="imgCode" ></v-input>
      <img class="imgcode" :src="imageUrl" alt="验证码" @click="getImageCode">
      <el-button class="changebtn"  type="primary" @click="modifyPwd">保 存</el-button>
    </div>

  </div>
</template>

<script>
  import input from '@/components/input'
  export default {
    data() {
      return {
        mobile: '',
        oldpwd: '',
        pwd: '',
        repwd: '',
        repwdtip: '',
        imgCode: '',
        smsCodeTip: '',
        imageUrl: ''
      }
    },
    // 使用其它组件
    components: {
      'v-input': input
    },
    // 方法
    computed: {},
    watch: {},
    methods: {
      // 获取图片验证码
      getImageCode () {
        this.imageUrl = this.$api.user.imageCode + '?time=' + new Date().getTime()
      },
      reregblur () {
        if (this.pwd !== this.repwd) {
          this.repwdtip = '两次输入不一致'
        } else {
          this.repwdtip = ''
        }
      },
      modifyPwd () {
        let oldpwd_regx = !this.$regx.password(this.oldpwd)
        if (oldpwd_regx) {
          document.querySelector('#cgoldpwd').focus()
          return false
        }
        let pwd_regx = !this.$regx.password(this.pwd)
        if (pwd_regx) {
          document.querySelector('#cgpwd').focus()
          return false
        }
        let repwd_regx = !this.$regx.password(this.repwd)
        if (repwd_regx) {
          document.querySelector('#cgrepwd').focus()
          return false
        }
        let imgcode_regx = !this.$regx.imgCode(this.imgCode)
        if (imgcode_regx) {
          document.querySelector('#cgimgcode').focus()
          return false
        }
        this.$db.dataUser.modifyloginpassword(this, this.oldpwd, this.pwd, this.imgCode)
          .then((res) => {
            if (res.data.returnCode === 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '密码修改成功'})
              this.$router.push('/manage/account')
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
              // this.bindSCodeTip = res.data.returnMsg
              this.getImageCode()
            }
          })
      }
    },
    beforeCreate() {
      if (!this.$cookie.islogin()) {
        this.$router.push('/login?redirect_url=' + location.href)
        this.$message({showClose: true, type: 'error', duration: 3000, message: '请先登录'})
      }
    },
    // 生命周期函数
    created() {
      this.getImageCode()
    },
    mounted() {

    }
  }
</script>

<style lang="scss">
  #changemobile {
    height: 560px !important;
    border: 1px solid #e3e3e3;
    padding: 0 30px;
    margin:30px auto !important;
    .changebtn {
      width:220px;
      height: 40px;
      margin: 50px 80px;
    }
    .title {
      height: 60px;
      line-height: 60px;
      border-bottom: 2px solid #e3e3e3;
      .txt {
        display: block;
        font-weight: 600;
        height: 59px;
        width:70px;
        text-align: center;
        border-bottom: 2px solid #ffb148;
      }
    }
    .info {
      margin-top: 60px;
    }
    .changeinfo {
      margin-left:380px;
      width:390px;
      .imgcode {
        color: #ffb148;
        display: block;
        float: right;
        position: relative;
        margin-top: -45px;
        cursor: pointer;
        width: 100px;
        height: 40px;
        border: 1px solid #e5e5e5;
        border-radius: 5px;
      }
    }
  }
</style>
