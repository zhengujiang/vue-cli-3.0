<template>
  <div id="person">
    <el-form :inline="true"  class="ruleForm" label-width="60px" >
      <el-form-item label="手机号">
        <el-input v-model="mobile" placeholder="手机号" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subBtn" type="primary" @click="HandleChange('changeMobile')">更换手机</el-button>
      </el-form-item>
    </el-form>

    <el-form :inline="true" class="ruleForm" label-width="60px" >
      <el-form-item label="邮　箱">
        <el-input v-model="email" placeholder="邮箱" disabled="disabled"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subBtn" type="primary" @click="HandleChange('changeEmail')">更换邮箱</el-button>
      </el-form-item>
    </el-form>

    <el-form :inline="true"  class="ruleForm" label-width="60px" >
      <el-form-item label="密　码">
        <el-input v-model="password" placeholder="密码" disabled="disabled" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="subBtn" type="primary" @click="HandleChange('changePassword')">更换密码</el-button>
      </el-form-item>
    </el-form>

    <hr class="hrline">
    <el-row class="wxinfo">
      <el-col :span="2" ><img class="wximg" :src="$image.user.weixinpng"></el-col>
      <el-col :span="2">
        <span v-if="weixinUnionId" class="sq grayColor">已授权</span>
        <span v-else class="sq">未授权</span>
      </el-col>
      <el-col :span="6">
        <span v-if="weixinUnionId" class="wxAccount grayColor">账号：{{weixinUsername}}</span>
        <span v-else class="wxAccount"></span>
      </el-col>
      <el-col :span="10">
        <el-button v-if="!weixinUnionId" class="subwxBtn" type="primary" @click="HandleChangeWeixin()">绑定微信</el-button>
        <el-button v-else class="subwxBtn" type="primary" @click="HandleChangeWeixin()">解绑微信</el-button>
      </el-col>
    </el-row>
    <el-dialog :title="title" :visible="showWxQrcode" width="320px" @close="showWxQrcode = false">
      <div class="qrcenter">
        <v-qrcodewx :redirecturl="wxScanRedirectUrl"></v-qrcodewx>
      </div>
    </el-dialog>
    <!-- <el-dialog title="提示信息" :visible="info" width="320px" @close="info = false">
      <div class="qrcenter">
        {{wxInfo}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="info = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <el-dialog class="authDialog" title="提示信息" :visible.sync="info" @close="info = false" width="355px" center top="28vh">
      <div class="message">
        {{wxInfo}}
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="info = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import qrcodewx from '@/components/qrcodewx'
  import ElCol from "element-ui/packages/col/src/col"
  export default {
    // 使用其它组件
    components: {
      ElCol,
      'v-qrcodewx': qrcodewx
    },
    data () {
      return {
        mobile: '',
        email: '',
        password: '',
        weixinUsername: '',
        showWxQrcode: false,
        wxScanRedirectUrl: '',
        weixinUnionId: '',
        title: '',
        wxInfo: '',
        info: false
      }
    },
    methods: {
      getUserInfo() {
        this.$db.dataUser.getUserInfo(this)
          .then((res) => {
              if (res.data.returnCode === 1) {
                let dataObj = res.data.returnObject
                this.mobile = dataObj.mobile
                this.email = dataObj.email
                this.password = '********'
                this.weixinUsername = dataObj.weixinUsername
                this.weixinUnionId = dataObj.weixinUnionId
                this.$store.commit('USERDATA', res.data.returnObject)
              }
          })
      },
      HandleChange(url) {
        this.$router.push('/' + url)
      },
      HandleChangeWeixin() {
        this.showWxQrcode = true
        if (this.weixinUnionId) {
          this.title = '解绑微信';
          this.wxScanRedirectUrl = this.$api.host + 'wxTransfer?bindWx=false'
          console.log(this.wxScanRedirectUrl)
        } else {
          this.title = '绑定微信';
          this.wxScanRedirectUrl = this.$api.host + 'wxTransfer?bindWx=true'
        }
      },
      loginbyqrcode() {
        let code = this.$route.query.code;
        let state = this.$route.query.state;
        let binding = this.$route.query.bindWx;
        if (code) {
          this.$http({
            method: 'POST',
            url: this.$api.user.qrBindWeixinByUser,
            message: 'none',
            params: {
              userId: this.$cookie.get('userId'),
              binding: binding,
              code: code,
              state: state
            }
          }).then((res) => {
            this.$route.query.code = '';
            if (res.data.returnCode === 200) {
              // 扫码登录成功
              this.info = true;
              this.wxInfo = res.data.returnMsg;
              this.getUserInfo()
            } else if (res.data.returnCode === 512) {
              this.info = true;
              this.wxInfo = '该用户code获取不到access或者openid，请重试！'
            } else if (res.data.returnCode === 524) {
              // 需要绑定的微信已绑定其他账号
              this.info = true;
              this.wxInfo = "该微信已绑定其他账号，故无法绑定";
            } else if (res.data.returnCode === 526) {
              // 解绑的不是该微信
              this.info = true;
              this.wxInfo = "您当前扫码的微信账号并非原来绑定的微信账号，故无法解绑";
            }
          })
        }
      }
    },
    // 生命周期函数
    created () {
      if (this.$cookie.islogin()) {
        this.getUserInfo()
      }
      let data = JSON.parse(sessionStorage.getItem('wxTransfer'));
      if (data) {
        if (data.returnCode === 200) {
          // 扫码登录成功
          this.info = true;
          this.wxInfo = data.returnMsg;
          this.getUserInfo()
        } else if (data.returnCode === 512) {
          this.info = true;
          this.wxInfo = '该用户code获取不到access或者openid，请重试！'
        } else if (data.returnCode === 524) {
          // 需要绑定的微信已绑定其他账号
          this.info = true;
          this.wxInfo = "该微信已绑定其他账号，故无法绑定";
        } else if (data.returnCode === 526) {
          // 解绑的不是该微信
          this.info = true;
          this.wxInfo = "您当前扫码的微信账号并非原来绑定的微信账号，故无法解绑";
        }
        sessionStorage.removeItem('wxTransfer')
      }
      // this.loginbyqrcode();
      // this.wxScanRedirectUrl = this.$api.host + 'changeWeixin'
    },
    mounted () {

    }
  }
</script>

<style lang="scss">
  .right #person {
    .authDialog {
      .el-dialog__header {
        border-bottom: 1px solid #e3e3e3;
        .el-dialog__title {
          color: #ffb148;
        }
        .el-dialog__body {
          padding: 25px;
        }
      }
      .message {
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
      .el-button {
        padding: 0;
        width: 100px;
        height: 35px;
        line-height: 35px;
        font-size: 16px;
      }
    }
    .ruleForm {
      width:600px;
    }
    .wximg {
      width: 50px;
      height: 50px;
      display: inline-block;
    }
    .imgright{
      text-align: center;
    }
    .hrline {
      margin: 10px 0;
      border-top: 1px dotted #e3e3e3;
      border-bottom: 0;
    }
    .wxinfo {
      height: 50px;
      line-height: 50px;
      .sq {
        display: inline-block;
        margin-left: -6px;
        height: 50px;
        line-height: 50px;
        color:#61ae48;
      }
      .grayColor {
        color: #8D8D8D;
      }
      .wxAccount {
        width:200px;
        display: inline-block;
        white-space:nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .space {
      padding-right:10px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item.is-required .el-form-item__label:before {
      margin-left: 4px;
      float: right;
      position: relative;
      top: 3px;
    }
    .line {
      text-align: center;
      color: rgba(255,255,255,0)
    }
    .subBtn {
      width:110px;
      height: 40px;
      font-size: 15px;
    }
    .subwxBtn {
      position: relative;
      width:110px;
      height: 40px;
      margin-left: -5px;
      background-color: #3CB135;
      border:0;
      font-size: 15px;
    }
    .el-input__inner {
      width:300px;
    }
    .el-input.is-disabled .el-input__inner {
      background-color: #fff;
      border-color: #e3e3e3;
      color: #8d8d8d
    }
  }


</style>
