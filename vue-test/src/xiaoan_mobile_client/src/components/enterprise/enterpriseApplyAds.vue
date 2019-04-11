<template>
  <div id="enterpriseApplyAds">
    <div class="simpleModal" v-transfer-dom>
      <x-dialog v-model="kaitongModal" class="dialog-demo">
        <div class="img-box" ref="imgBoxDom">
          <img :src="kaitongimg" class="imgShow"/>
          <div class="fan" @click="kaitongHide"><i class="icon iconfont icon-jia3"></i></div>
          <button type="button" class="kaitong-btn" @click="kaitongLink">立即开通</button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import {TransferDomDirective as TransferDom, XDialog} from 'vux'
  export default {
    data() {
      return {
        kaitongModal: false,
        kaitongimg: this.$image.law.kaitong,
        enterpriseApplyUrl: '',
        userInfo: {},
        isEnterpriseApply: false
      }
    },
    props: {
      advType: String
    },
    directives: {
      TransferDom
    },
    // 使用其它组件
    components: {
      XDialog
    },
    computed: {},
    watch: {
      $route: function (to, form, next) {
        if (to.name != 'law' && to.name != 'enterpriseApply') {
          this.loadAds()
        }
      },
    },
    // 生命周期函数
    created() {
      let userId = this.$cookie.getCookie("userId")
      if (userId) {
        this.isEnterpriseApply = localStorage.getItem("enterpriseApply") == userId
      }
    },
    mounted() {
    },
    // 方法
    methods: {
      loadAds () {
        let isShow = localStorage.getItem('enterpriseAllAds') != this.$const.getNewDate()
        if (new Date() < new Date('2018-10-01') && isShow) {
          this.userhome()
        }
      },
      userhome () {
        let userId = this.$cookie.getCookie('userId')
        if (userId) {
          /*this.$http({
            method: 'GET',
            url: this.$api.userHome.userhome,
            params: {}
          })*/
          this.$axios.userHome.userhome().then((res) => {
            if (res.data.returnCode == 1) {
              this.userInfo = res.data.returnObject
              if (this.userInfo.enterpriseCompanyCode) {
                // this.drawQrcode()
                // this.enterpriseApplyUrl = this.$api.CURRENTIP.IP + '#/enterpriseApply?code=' + this.userInfo.enterpriseCompanyCode
              } else {
                this.kaitongModal = true
              }
            } else {
              this.kaitongModal = true
            }
          })
        } else {
          this.kaitongModal = true
        }
      },
      kaitongLink () {
        this.kaitongModal=false
        this.$router.push({path: '/enterpriseApply'});
        localStorage.setItem('enterpriseAllAds', this.$const.getNewDate())
      },
      kaitongHide () {
        this.kaitongModal = false
        localStorage.setItem('enterpriseAllAds', this.$const.getNewDate())
      },
      kaitongShow () {
        this.kaitongModal = true
      }
    }
  }
</script>

<style lang="scss">
  #enterpriseApplyAds {

  }
  .simpleModal {
    .weui-dialog {
      position: absolute;
      height: auto;
      width: 75%;
      max-width: 100%;
      max-height: 100%;
      background-color: transparent;
    }
    .img-box {
      height: 100%;
      width: 100%;
      /*.box-content {*/
      /*position: relative;*/
      #canvas_box {
        display: inherit;
        width: 100%;
      }
      #imgShow, .imgShow {
        -webkit-touch-callout: default;
        max-width: 100%;
        display: inherit;
        border-radius: 2px;
        user-select: default;
      }
      .fan {
        position: absolute;
        top: 0;
        right: 0;
        i {
          position: absolute;
          top: 5px;
          right: 5px;
          color: white;
          transform: rotate(45deg);
        }
      }
      .fan:before {
        content: '';
        position: absolute;
        top: -36px;
        right: -35px;
        width: 0;
        height: 0;
        border-radius: 35px;
        border-width: 35px;
        border-style: solid;
        border-color: transparent transparent transparent rgba(0, 0, 0, 0.4);
        transform: rotate(-45deg);
        line-height: 99em;
        overflow: hidden;
        cursor: pointer;
      }
      /*}*/
      .box-btns {
        margin-top: 5px;
        display: flex;
        .btn-label {
          flex: 1;
          button {
            border: 0;
            width: 98%;
            height: 40px;
            border-radius: 4px;
            color: #8d8d8d;
            background-color: white;
            &:active {
              background-color: #F5A44B;
              color: #323232;
            }
          }
        }
        .btn-label.left {
          text-align: left;
          button {
            background-color: #fff;
            color: #ffb148;
            font-size: 15px;
          }
        }
        .btn-label.right {
          text-align: right;
          button {
            background-color: #ffb148;
            color: #fff;
            font-size: 15px;
          }
        }
      }
      .kaitong-btn {
        position: absolute;
        bottom: 47px;
        left: 50%;
        transform: translateX(-50%);
        width: 50%;
        height: 30px;
        background-color: #ffb148;
        color: #fff;
        opacity: 0;
      }
    }
  }
</style>
