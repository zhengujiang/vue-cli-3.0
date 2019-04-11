<template>
  <div class="vxa-banner">
    <template v-if="advType == 'xinhu'">
      <img class="bannerImg" :src="advX" @click.prevent="bannerHandle">
      <!--<img v-if="userInfo.enterpriseUser" class="bannerImg" :src="enterpriseUrl" @click.prevent="bannerHandle">-->
      <!--<img v-else class="bannerImg" :src="notEnterpriseUrl" @click.prevent="bannerHandle">-->
    </template>
    <!---->
    <template v-else-if="advType == 'my'">
      <img class="bannerImg" :src="advM" @click.prevent="bannerHandle">
      <!--<img v-if="userInfo.enterpriseUser" class="bannerImg" :src="enterpriseUrl" @click.prevent="bannerHandle">-->
      <!--<img v-else class="bannerImg" :src="notEnterpriseUrl" @click.prevent="bannerHandle">-->
    </template>
    <!---->
    <template v-else-if="advType == 'law'">
      <img class="bannerImg" :src="advL" @click.prevent="bannerHandle">
      <!--<img v-if="userInfo.enterpriseUser" class="bannerImg" :src="enterpriseUrl" @click.prevent="bannerHandle">-->
      <!--<img v-else class="bannerImg" :src="notEnterpriseUrl" @click.prevent="bannerHandle">-->
    </template>
    <!---->
    <template v-else>
      <img class="bannerImg" :src="advL" @click.prevent="bannerHandle">
    </template>
    <!---->
    <div class="simpleModal" v-transfer-dom>
      <x-dialog v-model="kaitongModal" class="dialog-demo">
        <div class="img-box" ref="imgBoxDom">
          <img :src="kaitongimg" class="imgShow"/>
          <div class="fan" @click="kaitongModal=false"><i class="icon iconfont icon-jia3"></i></div>
          <button type="button" class="kaitong-btn" @click="kaitongLink">立即开通</button>
        </div>
      </x-dialog>
    </div>
    <div id="simpleModalInvite" class="simpleModal" v-transfer-dom>
      <x-dialog v-model="simpleModal" class="dialog-demo">
        <div class="img-box" ref="imgBoxDom">
          <img :src="inviteimg1" id="imgShow"/>
          <canvas id="canvas_box" style="display: none"></canvas>
          <div class="fan" @click="simpleModal=false"><i class="icon iconfont icon-jia3"></i></div>
          <div class="box-btns">
            <div class="btn-label left">
              <button type="button">长按图片保存</button>
            </div>
            <div class="btn-label right">
              <button type="button" @click="inviteShare">分享</button>
            </div>
          </div>
          <div id="canvasCodeInvite" style="display: none">
            <v-qrcode :text="enterpriseApplyUrl" :propId="'myQrCode'" v-if="enterpriseApplyUrl"></v-qrcode>
          </div>
        </div>
      </x-dialog>
    </div>
    <div id="shareXh" class="shareXh" v-transfer-dom>
      <x-dialog hide-on-blur v-model="shareShadow" mask-z-index="5000">
        <div class="share-box" @click.prevent="shareShadow = false">
          <img :src="$image.testing.fenxiangT" alt="">
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
  import qrcode from "@/components/qrcode/qrcode"
  import {TransferDomDirective as TransferDom, XDialog} from 'vux'
  export default {
    name: 'vxa-banner',
    data() {
      return {
        advX: this.$image.banner.cotrun_xh,
        advM: this.$image.banner.cotrun_home,
        advL: this.$image.banner.cotrun_rule,
        //
        enterpriseUrl: 'http://oss.in-hope.cn/enterpriseApply/d9f866b5468b4959a64a09ea11b55f65.jpg',
        notEnterpriseUrl: this.$image.law.banner,
        simpleModal: false,
        shareShadow: false,
        kaitongModal: false,
        kaitongimg: this.$image.law.kaitong,
        inviteimg1: this.$image.law.invite1,
        inviteimg2: this.$image.law.invite2,
        inviteimg3: this.$image.law.invite3,
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
      'v-qrcode': qrcode,
      XDialog
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      let userId = this.$cookie.getCookie("userId")
      if (userId) {
        this.isEnterpriseApply = localStorage.getItem("enterpriseApply") == userId
      }
      this.userhome()
    },
    mounted() {
    },
    // 方法
    methods: {
      getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
        // var num = GetRandomNum(1,3);
      },
      userhome() {
        let userId = this.$cookie.getCookie('userId')
        if (userId) {
          this.$http({
            method: 'GET',
            url: this.$api.userHome.userhome,
            params: {}
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.userInfo = res.data.returnObject
              if (this.userInfo.enterpriseCompanyCode) {
                // this.drawQrcode()
                this.enterpriseApplyUrl = this.$api.CURRENTIP.IP + '#/enterpriseApply?code=' + this.userInfo.enterpriseCompanyCode
              } else {
                // this.kaitongModal = true
              }
            }
          })
        } else {
          // this.kaitongModal = true
        }
      },
      // banner图片点击
      bannerHandle() {
        // let userId = this.$cookie.getCookie('userId')
        // if (userId) {
        //   if (this.userInfo.enterpriseCompanyCode) {
        //     this.drawQrcode()
        //   } else {
        //     this.kaitongShow()
        //   }
        // } else {
        //   this.kaitongShow()
        // }

        // location.href = 'https://wx.in-hope.cn/#/xhAnswerDetaile?questionId=44847663fc8f4941853e1329630a7c6f&answerId=0819f8522818479fb0b50cdf0076484b';

        // this.$router.push({path: '/enterpriseApply'})
        // location.href = 'https://wx.in-hope.cn/?from=singlemessage&isappinstalled=0#/topTenRules';

        // myYear2018
        // this.$router.push({path: '/year2018'})

        // cotrun
        this.$router.push({path: '/electron'})
        //
        // if (this.userInfo.enterpriseUser) {
        //   this.$router.push({path: '/company'})
        // } else {
        //   this.$router.push({path: '/enterpriseApply'})
        // }

      },
      kaitongLink() {
        this.kaitongModal = false
        this.$router.push({path: '/enterpriseApply'});
      },
      kaitongShow() {
        this.kaitongModal = true
      },
      inviteShare() {
        this.shareShadow = true
      },
      drawQrcode() {
        this.simpleModal = true
        this.enterpriseApplyUrl = this.$api.CURRENTIP.IP + '#/enterpriseApply?code=' + this.userInfo.enterpriseCompanyCode
        this.$weixin.wxshare(this.userInfo.enterpriseCompanyName + '正在使用信公小安企业版，邀您免费试用董办办公利器。', '那些信披考核A级的公司，都pick了TA作为董办装备，现在申请即可免费试用。', this.enterpriseApplyUrl, this.$api.share.defaultImg, true);
        var _that = this;

        var nameText = this.userInfo.enterpriseCompanyCode
        var textsStyle = {
          textAlign: 'left',
          font: '60px PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica',
          lineWidth: 1.0,
          fillStyle: '#ffb148'
        };
        // 开始构造
        var nWidth = 375, // 屏幕可视区域 宽度
          nHeight = 667, // 屏幕可视区域 高度
          _canvasWidth = 750, // 画布 宽度
          _canvasHeight = 1334; // 画布 高度
        // 开始画图，获取上下文；
        var _canvas = document.getElementById("canvas_box");
        _canvas.width = _canvasWidth;
        _canvas.height = _canvasHeight;
        var _context = _canvas.getContext('2d');
        // 背景
        _context.fillRect(0, 0, nWidth * 2, nHeight * 2);
        // 白色矩形部分
        _context.fill();
        _context.closePath();
        //
        // onload是异步加载，所以要等第一个onload 加载完毕再画第二张图片
        // 代言文字图片
        let num = this.getRandomNum(1, 3)
        var _imagetext = new Image();
        if (num == 1) {
          _imagetext.src = this.inviteimg1
          // textsStyle.fillStyle = '#3d388f'
          textsStyle.fillStyle = '#ffb148'
        } else if (num == 2) {
          _imagetext.src = this.inviteimg2
          textsStyle.fillStyle = '#ffb148'
        } else {
          _imagetext.src = this.inviteimg3
          textsStyle.fillStyle = '#e56566'
        }

        // 第一次 执行 话 大图
        _imagetext.onload = function () {
          _context.save(); // 保存当前_context的状态
          _context.drawImage(_imagetext, 0, 0);
          _context.stroke();//
          _context.closePath();

          // 保存当前_context的状态
          _context.save();

          var codeImg = new Image();
          codeImg.src = document.querySelector('#simpleModalInvite #canvasCodeInvite #myQrCode img').getAttribute('src')
          _context.save(); // 保存当前_context的状态
          _context.drawImage(codeImg, 480, 1040, 200, 200);
          _context.stroke();//
          _context.closePath();
          _context.save();

          // 头像下面的文字
          _context.beginPath();
          _context.textAlign = textsStyle.textAlign;
          // 设置字体
          _context.font = textsStyle.font;
          _context.lineWidth = textsStyle.lineWidth; //
          _context.fillStyle = textsStyle.fillStyle; // 字颜色
          _context.fillText(nameText, 280, 765);
          // canvas 画完图 一定要生成图片流，作为img 的src属性值，同时隐藏canvas，只展示img 就ok了，在手机上试试长按保存功能吧
          var _imgSrc = _canvas.toDataURL("image/png", 1);
          _canvas.style.display = "none";
          var imgShow = document.getElementById('imgShow');
          imgShow.setAttribute('src', _imgSrc);
          _that.inviteimg1 = _imgSrc
        }
      }
    }
  }
</script>

<style lang="scss">
  .vxa-banner {
    img {
      width: 100%;
      height: auto;
    }
  }
  .shareXh {
    .weui-dialog {
      position: absolute;
      background-color: transparent;
      z-index: 6000;
    }
    .weui-mask {background-color: rgba(0, 0, 0, 0.8)}
    .share-box {
      img {
        display: inherit;
        width: 100%;
        padding-left: 9%;
        padding-bottom: 92%;
      }
    }
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
