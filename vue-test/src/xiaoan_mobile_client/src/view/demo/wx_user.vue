<template>
  <div id="wx_user">
    <x-button class="btn" :gradients="['#A644FF', '#FC5BC4']" @click.native="btnClick">点击获取ID</x-button>
    <div v-transfer-dom>
      <x-dialog v-model="showToast" class="dialog-demo">
        <div class="" style="height: 200px;">
          <!--{{wxuser}}-->
          <textarea
                    style="height: 100%; width: 100%;padding: 10px;border: 1px solid #aeaeae;">{{wxuser}}</textarea>
          <!--{"openId":"ofZMgwhdOCOC9btPD6WI7OOcJ5AQ","nickname":"Evans","sex":1,"country":"CN","province":"Shanghai","city":"Po","headImgUrl":"http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLXBvOntwXYsxGugvibFwKcvRf6KYOCzs4h0k4RLpl19YpKRpqveVUSAYhyKvAiad42ibPXT43oBRAJg/132","unionid":"ol83MwZnBK4fHoeq_2iZuxEN628k","privilegeList":null}-->

        </div>
        <x-button style="margin-top: 30px;" disabled>长按内容复制</x-button>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {XButton, XDialog, TransferDomDirective as TransferDom} from 'vux'

  export default {
    name: "wx_user",
    components: {
      XButton, XDialog
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        showToast: false,
        wxuser: ''
      }
    },
    created() {
      let code = this.$const.getQueryString('code');
      let state = this.$const.getQueryString('state');
      if (state == 'link') {
        this.wxOauthByCode(code, state);
      }
    },
    methods: {
      btnClick() {
        this.wxAuthRedirect(this, 'link');
      },
      wxAuthRedirect(Vue, state) {
        let redirect_uri = encodeURIComponent(Vue.$api.CURRENTIP.IP + '#/wx/user');
        let protocol = document.location.protocol == 'https:' ? 'https:' : 'http:';
        location.href = `${protocol}//open.weixin.qq.com/connect/oauth2/authorize?appid=${Vue.$api.appId}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${state}#wechat_redirect`
      },
      wxOauthByCode(code, state) {
        let params = {
          code: code
        }
        this.$axios.wxAuth.wxAuthByCode(params).then(res => {
          console.log('wxauth/wxAuthByCode', res);
          if (res.data.returnCode === 1) {
            this.wxuser = window.JSON.stringify(res.data.returnObject);
            setTimeout(_ => {
              this.showToast = true;
            }, 1000)
          }
        })
      },
    }
  }
</script>

<style lang="scss">
  #wx_user {
    height: 100%;
    width: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 15%;
    .btn {
    }
  }
</style>
