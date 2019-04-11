<template>
  <transition name="bounce">
    <div class="xiaoan-box law" id="law">
      <div class="law-scroll">
        <div class="logo"><img :src="bgImg" alt=""></div>
        <div class="search" @click="searchLaw">
          <div class="searchVal">搜索法规名称</div>
        </div>
        <div class="law-slo">
          <div>董秘智能移动工具，触手可及</div>
        </div>
        <ul class="link" ref="linkDom">
          <li class="linkitem" v-for="(list,index) in linkItem" @click="routerLink(index)" v-if="list.show">
            <div><img :src="list.icon" alt="">
              <p>{{list.name}}</p></div>
            <!-- <img v-show="list.new" :src="newIcon" alt="new" id="newTip"> -->
          </li>
        </ul>
        <div class="home-banner">
          <!--<a :href="advert.link">
            <img :src="advert.img" alt="">
          </a>-->
          <!--<img v-if="userInfo.enterpriseUser" class="bannerImg" src="/static/img/banner/lawIndex.jpg" alt="" @click.prevent ="bannerHandle">-->
          <!--<img v-else class="bannerImg" src="/static/img/law/law- .png" alt="" @click.prevent ="bannerHandle">-->
          <vxa-banner advType="law"></vxa-banner>
          <!--<img class="bannerImg" src="/static/img/banner/competition_b.png" alt="" @click.prevent="bannerHandle">-->
        </div>
      </div>
      <transition name="bounce">
        <div class="law-show" v-show="GuidePages">
          <div ref="guideIDom" class="GuidePages" :style="{top:guideStyle.top}">
            <div class="GuidePage">点击查看最新法规</div>
            <img :src="GuidePagesLow" alt=""/>
          </div>
          <button class="law-show-sh" @click="lawshowsh()">知道了</button>
        </div>
      </transition>
      <xiaoan-error v-show="error"></xiaoan-error>
      <xiaoan-warning v-show="warning.show" :message="warning.text" :imgSrc="warning.img" :isShowBtn="warning.isShowBtn"
                      @click="goFocus"></xiaoan-warning>

      <div class="simpleModal" v-transfer-dom>
        <x-dialog v-model="kaitongModal" class="dialog-demo">
          <div class="img-box" ref="imgBoxDom">
            <img :src="kaitongimg" class="imgShow"/>
            <div class="fan" @click="kaitongModal=false"><i class="icon iconfont icon-jia3"></i></div>
            <button type="button" class="kaitong-btn" @click="kaitongLink">立即开通</button>
          </div>
        </x-dialog>
      </div>
      <div id="simpleModal" class="simpleModal" v-transfer-dom>
        <x-dialog v-model="simpleModal" class="dialog-demo">
          <div class="img-box" ref="imgBoxDom">
            <img :src="bannerImgUrl" id="imgShow"/>
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
          </div>
        </x-dialog>
      </div>
      <div id="shareXh" v-transfer-dom>
        <x-dialog hide-on-blur v-model="shareShadow" mask-z-index="5000">
          <div class="share-box" @click.prevent="shareShadow = false">
            <img :src="$image.testing.fenxiangT" alt="">
          </div>
        </x-dialog>
      </div>
      <div id="canvasCode" style="display: none">
        <v-qrcode :text="enterpriseApplyUrl" v-if="enterpriseApplyUrl"></v-qrcode>
      </div>
    </div>
  </transition>
</template>
<script>
  import lawBaseSvg from "../../assets/icon/lawIcon"
  import warning from "@/components/warning/warning";
  import qrcode from "@/components/qrcode/qrcode"
  import {TransferDomDirective as TransferDom, XDialog} from 'vux'
  export default {
    name: "Law",
    directives: {
      TransferDom
    },
    data() {
      return {
        advert: {
          link: 'http://wx.in-hope.cn/?from=singlemessage&isappinstalled=0#/xhAnswerDetaile?questionId=3bc32907e4a5419b928509a2c14f072d&answerId=b980f812b31b416c87ffc5c4d26bf199',
          img: 'http://oss.in-hope.cn/enterpriseApply/e7f717022eb045ecaab0f99f3253544f.png'
        },
        advertisement: 'http://an-announcement.oss-cn-shanghai.aliyuncs.com/advertImage/main.jpg', //广告图
        warning: {
          show: false,
          text: '点击查看最新法规',
          img: this.$image.report.noReportInfo,
          isShowBtn: true
        },
        GuidePages: true,
        GuidePagesLow: this.$image.guidePage.guidepages,
        bgImg: lawBaseSvg.law[0].img,
        collectImg: lawBaseSvg.law[1].img,
        footImg: lawBaseSvg.law[3].img,
        roadShowImg: lawBaseSvg.law[7].img,
        yanbaoImg: lawBaseSvg.law[9].img,
        newIcon: lawBaseSvg.law[8].img,
        yuqinImg: lawBaseSvg.law[11].img,
        isOnload: true,
        file: "",
        error: false,
        disk: ['collect', 'track'],
        linkItem: [
          {id: 'collect', show: true, name: '新规', link: '/rule/new', icon: lawBaseSvg.law[2].img, new: false},
          {id: 'focus', show: true, name: '精选', link: '/ads', icon: lawBaseSvg.law[5].img, new: false},
          // {
          //   id: "calendar/calendarAll",
          //   show: true,
          //   name: "日历",
          //   link: 'calendar/calendarAll',
          //   icon: lawBaseSvg.law[12].img,
          //   new: false
          // },
          // {id: 'track', name: '模考', link: '/testing', icon: law_baseSvg.law[10].img, new: false},
          {
            id: 'publish',
            show: true,
            name: 'IPO',
            link: '/ipo/list',
            icon: this.$image.law.ipo,
            new: true
          },
          {
            id: 'opinion',
            show: true,
            name: '舆情',
            link: '/superviseList',
            icon: this.$image.law.yu,
            new: true
          },
          {id: 'xiaoetong', show: true, name: '学院', link: 'xiaoetong', icon: lawBaseSvg.law[6].img, new: false},
        ],
        guideStyle: {top: ''},
        simpleModal: false,
        shareShadow: false,
        kaitongModal: false,
        kaitongimg: this.$image.law.kaitong,
        // inviteimg1: '/static/img/law/invite1.jpg',
        // inviteimg2: '/static/img/law/invite2.jpg',
        // inviteimg3: '/static/img/law/invite3.jpg',
        inviteimg1: this.$image.banner.comp_1_b,
        inviteimg2: this.$image.banner.comp_2_b,
        enterpriseApplyUrl: '',
        userInfo: {},
        isEnterpriseApply: false,
        urlImgObject: {
          '2018-11-20': this.$image.banner.comp_2_b,
          '2018-11-21': this.$image.banner.comp_1_b,
          '2018-11-22': this.$image.banner.comp_3_b
        },
        urlImgO: this.$image.banner.com_all_b,
        urlImg1126: this.$image.banner.comp_1126_b,
        bannerImgUrl: ''
      }
    },
    watch: {},
    components: {
      'xiaoan-warning': warning,
      'v-qrcode': qrcode,
      XDialog
    },
    computed: {},
    // 对应getters.技术中的msg
    created() {
      let userId = this.$cookie.getCookie("userId")
      if (userId) {
        this.isEnterpriseApply = localStorage.getItem("enterpriseApply") == userId
      }
      // alert(document.cookie);
      // console.log('token====>', this.$cookie.getCookie('userId'));
      // this.enterpriseApplyUrl = this.$api.CURRENTIP.IP + '#/enterpriseApply'
      window.document.title = "信公小安";

      if (window.localStorage.getItem('lawGuidePages')) {
        this.GuidePages = false;
      } else {
        this.GuidePages = true;
      }
      //每次打开页面只执行一次。
      this.$nextTick(() => {
        let local = ['guizeIdStatus', 'value2', 'marketIdStatus', 'value0',
          'adsActive', 'fawenIdStatus', 'value1', 'titleIME', 'contentIME',
          'keyIME', 'colorBtn', 'BtnMany', 'DateStartEnd', 'timeIdStatus'];
        this.$storage.localStorageRemove(local);
      });
    },
    mounted() {
      // let time = new Date().getTime();
      // // this.userhome();
      // setTimeout(() => {
      //   if (localStorage.getItem('enterpriseAdvShow')) {
      //     let enterpriseAdvShow = JSON.parse(localStorage.getItem('enterpriseAdvShow'))
      //     if (enterpriseAdvShow.date == this.$const.getNewDate()) {
      //       if (enterpriseAdvShow.count < 3) {
      //         let count = enterpriseAdvShow.count + 1
      //         localStorage.setItem('enterpriseAdvShow', JSON.stringify({
      //           date: this.$const.getNewDate(),
      //           count: count
      //         }));
      //         if (this.urlImgObject[this.$const.getNewDate()]) {
      //           this.bannerImgUrl = this.urlImgObject[this.$const.getNewDate()];
      //         }
      //         if (time >= 1542902400000) {
      //           this.bannerImgUrl = this.urlImgO;
      //         }
      //         if (time >= 1543161600000) {
      //           this.bannerImgUrl = this.urlImg1126;
      //         }
      //         this.simpleModal = true;
      //       }
      //     } else {
      //       localStorage.setItem('enterpriseAdvShow', JSON.stringify({
      //         date: this.$const.getNewDate(),
      //         count: 1
      //       }))
      //     }
      //   } else {
      //     localStorage.setItem('enterpriseAdvShow', JSON.stringify({
      //       date: this.$const.getNewDate(),
      //       count: 1
      //     }))
      //     this.bannerImgUrl = this.urlImgObject[this.$const.getNewDate()]
      //     if (time >= 1542902400000) {
      //       this.bannerImgUrl = this.urlImgO;
      //     }
      //     this.simpleModal = true;
      //   }
      // }, 1500)
      this.$nextTick(() => {
        if (process.env.NODE_ENV === 'dev') {
          // this.$cookie.set('token', '9b7d472917f14403be891927da276a0a');
          // this.$cookie.set('userInfo', this.$cookie.getUserInfo());
          // // window.localStorage.setItem('token', '9b7d472917f14403be891927da276a0a'); // 小蔡
          // window.localStorage.setItem('token', '9b7d472917f14403be891927da276a0a'); // 小马
        }
        // console.log(this.$api.cookieHost);
      });
      //
      this.$weixin.wxshare('信公小安-董秘智能移动工具', '', '', this.$api.share.defaultImg, true);
    },
    methods: {
      goFocus() {
        console.log(123456);
      },
      //
      routerLink(index) {
        if (this.linkItem[index].id == 'xiaoetong') {
          window.location.href = this.$api.xiaoeknow;
        } else {
          this.$router.push({path: this.linkItem[index].link});
        }
      },
      // 点机首页下的banner跳转
      advertisementClick() {
        location.href = 'https://xiaoan.in-hope.cn';
      },
      //
      lawshowsh() {
        window.localStorage.setItem('lawGuidePages', false);
        this.GuidePages = false;
      },
      //
      searchLaw() {
        this.$router.push({path: '/rule/search'});
      },
      getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
        // var num = GetRandomNum(1,3);
      },
      userhome() {
        let qfrom = this.$route.query.from
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
                this.enterpriseApplyUrl = this.$api.CURRENTIP.IP + '#/enterpriseApply?code=' + this.userInfo.enterpriseCompanyCode
                setTimeout(() => {
                  if (localStorage.getItem('enterpriseAdvShow')) {
                    let enterpriseAdvShow = JSON.parse(localStorage.getItem('enterpriseAdvShow'))
                    if (enterpriseAdvShow.date == this.$const.getNewDate()) {
                      if (enterpriseAdvShow.count < 3) {
                        let count = enterpriseAdvShow.count + 1
                        localStorage.setItem('enterpriseAdvShow', JSON.stringify({
                          date: this.$const.getNewDate(),
                          count: count
                        }))
                        this.simpleModal = true
                        this.drawQrcode()
                      }
                    } else {
                      localStorage.setItem('enterpriseAdvShow', JSON.stringify({
                        date: this.$const.getNewDate(),
                        count: 1
                      }))
                      this.drawQrcode()
                    }
                  } else {
                    localStorage.setItem('enterpriseAdvShow', JSON.stringify({
                      date: this.$const.getNewDate(),
                      count: 1
                    }))
                    // this.drawQrcode()
                  }
                  /* setTimeout(() => {
                    this.simpleModal=false
                  }, 3000) */
                }, 500)

              } else {
                if (qfrom != 'apply') {
                  this.kaitongModal = true
                  setTimeout(() => {
                    this.kaitongModal = false
                  }, 3000)
                }
              }
            }
          })
        } else {
          if (qfrom != 'apply') {
            this.kaitongModal = true
            setTimeout(() => {
              this.kaitongModal = false
            }, 3000)
          }
        }
      },
      // banner图片点击
      kaitongLink() {
        this.kaitongModal = false
        this.$router.push({path: '/enterpriseApply'});
        localStorage.setItem('enterpriseAllAds', this.$const.getNewDate())
      },
      kaitongShow() {
        this.kaitongModal = true
      },
      kaitongHide() {
        this.kaitongModal = false
        localStorage.setItem('enterpriseAllAds', this.$const.getNewDate())
      },
      inviteShare() {
        this.shareShadow = true
      },
      drawQrcode() {
        this.simpleModal = true
        // this.enterpriseApplyUrl = this.$api.CURRENTIP.IP + '#/enterpriseApply?code=' + this.userInfo.enterpriseCompanyCode
        console.log('this.enterpriseApplyUrl' + this.enterpriseApplyUrl)
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
          codeImg.src = document.querySelector('#canvasCode #qrcode img').getAttribute('src')
          // console.log('codeImg.src:' + codeImg.src)
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
  #law {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding-bottom: 50px;
    position: relative;
    background-color: white;
    .law-scroll {
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      // padding-bottom: 50px;
      box-sizing: border-box;
      .logo {
        width: 100%;
        height: 235px;
        padding: 64px 0 25px 0;
        box-sizing: border-box;
        img {
          display: block;
          height: 100%;
          padding-left: 25px;
        }
      }
      .search {
        width: 100%;
        padding: 0 25px;
        box-sizing: border-box;
        position: relative;
        .searchVal {
          height: 43px;
          border: 1px solid #cbcbcb;
          color: #cbcbcb;
          border-radius: 2px;
          line-height: 43px;
          padding-left: 15px;
          font-size: 15px;
        }
      }
      .law-slo {
        font-size: 12px;
        color: #e3e3e3;
        font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
        padding: 0 24px;
        display: none;
      }

      .link {
        width: 80%;
        /*height: 100px;*/
        font-size: 0;
        margin: 0 auto;
        padding-top: 53px;
        box-sizing: border-box;
        display: flex;
        .linkitem {
          flex: 1; /* 精选栏目 */
          height: 100%;
          display: inline-block;
          text-decoration: none;
          position: relative;
          img, .aa img {
            display: block;
            height: 25px;
            margin: 0 auto 10px;
            overflow: hidden;
          }
          #newTip {
            height: 14px;
            position: absolute;
            top: -14px;
            right: 2px;
            width: auto;
          }
          p {
            margin: 0;
            width: 100%;
            font-size: 13px;
            color: #b1b1b1;
            text-align: center;
            line-height: 1;
          }
        }
        .adsCircle {
          width: 20px; /*20px diamond*/
          height: 20px;
          border-radius: 50%;
          position: absolute;
          left: 0;
          right: 0;
          margin: 0 auto;
          z-index: -4;
          top: 0;
        }
        .ads .adsCircle {
          -webkit-animation-name: orangellowPulse;
          /* -webkit-animation-duration: 4s;*/
          -webkit-animation-duration: 3s;
          -webkit-animation-iteration-count: infinite;
        }
        @-webkit-keyframes orangellowPulse {
          from {
            background-color: #fff;
            -webkit-box-shadow: 0 0 10px #ffff00;
            background-size: 150%
          }
          50% {
            background-color: #fff;
            -webkit-box-shadow: 0 0 40px #ffff00;
            background-size: 200%
          }
          to {
            background-color: #fff;
            -webkit-box-shadow: 0 0 10px #ffff00;
            background-size: 250%
          }
        }
      }
      .home-banner {
        width: 100%;
        padding: 15px;
        img {
          width: 100%;
          height: auto;
          display: inherit;
        }
      }
      .law-advertisement-img {
        width: 100%;
        box-sizing: border-box;
        padding: 10px 20px 0 20px;
        img {
          width: 100%;
          box-sizing: border-box;
        }
      }
    }
    .law-show {
      height: 100%;
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.75);
      z-index: 3200;
      .law-show-sh {
        height: 32.5px;
        width: 100px;
        background-color: rgba(0, 0, 0, 0.01);
        color: #ffb148;
        border-radius: 2px;
        font-size: 15px;
        position: absolute;
        bottom: 17%;
        left: 50%;
        margin-left: -50px;
        text-align: center;
        line-height: 32.5px;
        border: 1.5px dashed #ffb148;
      }
      .GuidePages {
        position: absolute;
        top: 26%;
        left: 10%;
        z-index: 2507;
      }
      .GuidePage {
        box-sizing: border-box;
        position: absolute;
        top: -27px;
        left: 32%;
        width: 358%;
        color: white;
        font-size: 18px;
      }
      .GuidePages img {
        height: 234px;
      }
    }
    .bannerImg {
      /*pointer-events: none;*/
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
        user-select: auto;
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
