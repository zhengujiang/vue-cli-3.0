<template>
  <div id="year2018">
    <audio id="myMusic" :src="audioUrl" preload autoplay loop></audio>
    <div class="xiaoan-audio" @click="removeAudio">
      <img class="" :class="{circle: !circlePlay}" :src="$image.myYear.yinyue"/>
    </div>
    <div class="popupBox" v-show="popupVisible">
      <div class="popup-code">
        <div class="popup-code-title">获取我的董办2018数据</div>
        <div class="popup-code-form">
          <form action="" onsubmit="return false">
            <div class="form-box">
              <div class="input-box">
                <input type="text" v-model="code" placeholder="输入股票代码" @input="inputSearch" @focus="inputFocus()" @blur="inputBlur">
                <div class="code-box" v-show="codeList.length>0 && showCodeList">
                  <ul>
                    <li v-for="(item,index) in codeList" @click="selectSearch(item,index)">
                      <span class="code" v-html="highlight(code, item.code)">{{item.code}} </span>
                      <span class="name">{{item.name}}</span>
                    </li>
                  </ul>
                </div>

              </div>
              <div class="error-info" v-show="errorInfo">* 请输入正确的股票代码</div>
            </div>

            <button @click="addCode">提 交</button>
          </form>
        </div>
        <p class="input-tip">仅支持沪深两市上市公司</p>
      </div>
    </div>


    <div id="swiperContent" class="swiper-content">
      <swiper :options="swiperOption" ref="mySwiper">
        <swiper-slide class="pagebg">
          <cover-one class="vcenter pb30" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName" :data="yearSummary"></cover-one>
        </swiper-slide>
        <swiper-slide class="pagebg">
          <cover-two class="vcenter pb30" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"></cover-two>
        </swiper-slide>
        <swiper-slide class="pagebg">
          <xinpi-one class="vcenter" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"
                     :data="yearSummary.disclosure_data" v-if="yearSummary.disclosure_data"></xinpi-one>
        </swiper-slide>
        <swiper-slide class="pagebg">
          <xinpi-two class="vcenter" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"
                     :data="yearSummary.disclosure_data" v-if="yearSummary.disclosure_data"></xinpi-two>
        </swiper-slide>
        <swiper-slide class="pagebg">
          <shang-hui class="vcenter" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"
                     :data="yearSummary.meetingsAndInvestor_data" v-if="yearSummary.meetingsAndInvestor_data"></shang-hui>
        </swiper-slide>
        <swiper-slide class="pagebg">
          <han-qin class="vcenter" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"
                   :data="yearSummary.quotation_data" v-if="yearSummary.quotation_data"></han-qin>
        </swiper-slide>
        <swiper-slide class="pagebg" v-if="yearSummary.importantEvent_first_data.emptyStatus===0">
          <import-event class="vcenter" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"
                        :data="yearSummary.importantEvent_first_data"></import-event>
        </swiper-slide>
        <swiper-slide class="pagebg" v-if="yearSummary.importantEvent_second_data.emptyStatus===0">
          <import-event-two class="vcenter" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"
                            :data="yearSummary.importantEvent_second_data"></import-event-two>
        </swiper-slide>
        <swiper-slide class="pagebg" v-if="yearSummary.capital_operation_first_data.emptyStatus===0">
          <capital class="vcenter":userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"
                    :data="yearSummary.capital_operation_first_data"></capital>
        </swiper-slide>
        <swiper-slide class="pagebg" v-if="yearSummary.capital_operation_second_data.emptyStatus===0">
          <capital-two class="vcenter":userInfo="userInfo" :companyCode="companyCode" :companyName="companyName"
                  :data="yearSummary.capital_operation_second_data"></capital-two>
        </swiper-slide>
        <swiper-slide class="endbg">
          <cover-end class="vcenter pb30" :userInfo="userInfo" :companyCode="companyCode" :companyName="companyName" :data="yearSummary.animate_index" @showShare="showShare"></cover-end>
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
      </swiper>
    </div>

    <img class="next-icon" :src="$image.year2018.next"/>
    <div class="cover-share" v-show="coverShare" @click="hideShare"><div></div></div>
  </div>

</template>

<script>
  import coverOne from './components/coverOne' // 封面1
  import coverTwo from './components/coverTwo' // 封面2
  import xinpiOne from './components/xinpiOne' // 信息披露1
  import xinpiTwo from './components/xinpiTwo' // 信息披露2
  import shangHui from './components/shanghui' // 三会运作
  import hanQin from './components/hanqin'     // 行情和交易
  import importEvent from './components/importEvent'       // 重大事项1
  import importEventTwo from './components/importEventTwo' // 重大事项2
  import capital from './components/capital'  // 资本运作-分红
  import capitalTwo from './components/capitalTwo'      // 资本运作-批文
  import coverEnd from './components/coverEnd'
  import { XDialog, TransferDomDirective as TransferDom } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        audioUrl:`https://oss.in-hope.cn/xiaoan/audio/year2018.mp3?${Math.random()}`,
        coverShare: false,
        userId: '',
        userInfo: {
          userName: '',
          weixinAvatar: '',
        },
        yearSummary: {
          importantEvent_first_data: {},
          importantEvent_second_data: {},
          capital_operation_first_data: {},
          capital_operation_second_data: {}
        },
        circlePlay: false,
        errorInfo: false,
        codeList: [],
        showCodeList: true,
        code: '',
        name: '',
        avatar: '',
        companyCode: '600001',
        companyName: '',
        popupVisible: true,
        cover: true,
        swiperOption: {
//        effect: 'flip',
//         effect: 'cube',
//          grabCursor: true,
          cubeEffect: {
            shadow: true,
            slideShadows: true,
            shadowOffset: 20,
            shadowScale: 0.94,
          },
          followFinger : false,
          direction: 'vertical',
          slidesPerView: 1,
          spaceBetween: 0,
          longSwipesMs: 1500,
          longSwipes: false,
          autoHeight: false,
          swIndex: 0,
          loop : false,
          onTransitionStart: (swiper) => {
            // this.swIndex = swiper.activeIndex;
          },
          on:{
            init:function(swiper){

            },
            transitionStart: function(){
              // console.log(this)
              $('.animated').css({'visibility': 'hidden'})
              setTimeout(() => {
//                let xtop = (document.body.clientHeight - document.querySelector('.swiper-slide-active .vcenter').clientHeight) / 2 + 5
//                document.querySelector('.xiaoan-audio').style.top = xtop + 'px'
                // animated y-inLeft
                $('.animated').css({'visibility': 'visible'})
                $('.y-inLeft').addClass('bounceInLeft')
                $('.y-zoomIn').addClass('zoomIn')
                $('.y-flash').addClass('flash')
                $('.y-fadeIn').addClass('fadeIn')
                $('.y-fadeInDown').addClass('fadeInDown')
                $('.y-fadeInUp').addClass('fadeInUp')
                $('.y-swing').addClass('swing')
                $('.y-scale').addClass('y-scale-ani')

                //rubberBand bounceIn bounceInLeft fadeInDown
              }, 500)
               if (this.isEnd) {
                $('.next-icon').attr('src', this.$image.year2018.last)
                 $('.next-icon').hide()
              } else {
                $('.next-icon').attr('src', this.$image.year2018.next)
                 $('.next-icon').show()
              }
            },
            transitionEnd: function() {
              $('.y-inLeft').removeClass('bounceInLeft');
              $('.y-zoomIn').removeClass('zoomIn')
              $('.y-flash').removeClass('flash')
              $('.y-fadeIn').removeClass('fadeIn')
              $('.y-fadeInDown').removeClass('fadeInDown')
              $('.y-fadeInUp').removeClass('fadeInUp')
              $('.y-swing').removeClass('swing')
              $('.y-scale').removeClass('y-scale-ani')
            }
          }
        }
      }
    },
    // 使用其它组件
    components: {
      coverOne,
      coverTwo,
      xinpiOne,
      xinpiTwo,
      shangHui,
      hanQin,
      importEvent,
      importEventTwo,
      capital,
      capitalTwo,
      coverEnd,
      XDialog
    },
    computed: {
      swiper() {
//        console.log(this.$refs.mySwiper)
        return this.$refs.mySwiper.swiper
      }
    },
    watch: {},
    destroyed() {
      this.circlePlay = true;
      this.musicPlay(!this.circlePlay);
    },
    // 生命周期函数
    created() {
      // this.get2018YearSummaryByCode()

      if (this.$route.query.code && this.$route.query.name && this.$route.query.uid) {
        // 分享入口
        this.userId = this.$route.query.uid
        this.userInfo.id = this.$route.query.uid
        this.code = decodeURI(this.$route.query.code)
        this.name = decodeURI(this.$route.query.name)
        // this.uname = decodeURI(this.$route.query.uname)
        // this.avatar = decodeURI(this.$route.query.avatar)
        this.companyCode = this.code
        this.companyName = this.name
//        this.userInfo = {
//          userName: decodeURI(this.$route.query.uname),
//          weixinAvatar: this.avatar
//        },
        // this.userId = this.$route.query.uid
        this.popupVisible = false
        this.userHome()
        this.get2018YearSummaryByCode()
      } else {
        this.userId = this.$cookie.getCookie("userId");
        if (this.userId) {
          this.userInfo = this.$cookie.getUserInfo();
//          this.userInfo.userName = userInfo.userName
//          this.userInfo.weixinAvatar = userInfo.weixinAvatar
          this.avatar = this.userInfo.weixinAvatar
          this.code = this.userInfo.enterpriseCompanyCode || this.userInfo.companyCode || '000002'
          if (this.userInfo.companyTypeTwo.indexOf('港') > -1) {
            this.code = '000002'
          }
        } else {
           this.$storage.loginStatus(this, '我在董办2018', window.location.href, 'number');
          /* this.userInfo = {
            userName: '信公小安',
            weixinAvatar: this.$api.share.defaultImg,
            id: ''
          }
          this.code = '000002'
          if (this.$route.query.code && this.$route.query.name) {
            this.code = decodeURI(this.$route.query.code)
            this.name = decodeURI(this.$route.query.name)
            this.companyCode = this.code
            this.companyName = this.name
            this.popupVisible = false
            this.get2018YearSummaryByCode()
          } */
        }
      }
    },
    mounted() {
      // document.querySelector('#swiperContent').style.height = document.body.clientHeight + 'px'
      this.audioAutoPlay("myMusic");
      //
      this.initWeiXin()
      $(document.body).dblclick(() => {
        console.log('aaaa')
      })

      /* this.$nextTick(() => {
        setTimeout(() => {
          let xtop = (document.body.clientHeight - document.querySelector('#coverOne').clientHeight) / 2
          $('.xiaoan-audio').css('top', xtop + 'px')
          $('.vcenter').css('top', xtop + 'px')
        }, 300)
      }) */
    },
    // 方法
    methods: {
      inputFocus() {
        document.body.scrollTop = 0
        $('.popup-code').css({'top': '5%', 'transform': 'translate(-50%,0)'})
      },
      inputBlur() {
        $('.popup-code').css({'top': '50%', 'transform': 'translate(-50%,-50%)'})
      },
      animateOne() {
        setTimeout(() => {
          $('#coverOne .animated').css({'visibility': 'visible'})
          $('#coverOne .y-zoomIn').addClass('zoomIn')
          $('#coverOne .y-fadeInDown').addClass('fadeInDown')
          $('#coverOne .y-fadeInUp').addClass('fadeInUp')
          $('#coverOne .y-flash').addClass('flash')
          $('#coverOne .y-swing').addClass('swing')
        }, 1000)
      },
      initWeiXin() {
        let adverttitle = '数据告诉你，2018年我在董办工作有多拼！';
//        let shareLink = encodeURI(this.$api.CURRENTIP.IP + '#/year2018?code=' + this.code + '&name=' + this.name
//          + '&uid=' + this.userInfo.id + '&uname=' + this.userInfo.userName + '&avatar=' + this.avatar); // 分享链接
        let shareLink = encodeURI(this.$api.CURRENTIP.IP + '#/year2018?code=' + this.code + '&name=' + this.name
          + '&uid=' + this.userInfo.id); // 分享链接
        // let shareDesc = "见证喧闹纷繁的2018年股市，我欠自己一份图文总结。"; // 描述
        let shareDesc = "信公小安与您一起见证2018董办的不平凡。"; // 描述

        this.$weixin.wxshare(adverttitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
      },
      audioAutoPlay(id) {
        let audio = document.getElementById(id),
          play = function () {
            audio.play();
            document.removeEventListener("touchstart", play, false);
          };
        audio.play();
        document.addEventListener("WeixinJSBridgeReady", function () { // 微信
          play();
        }, false);
        document.addEventListener("touchstart", play, false);
      },
      removeAudio() {
        this.circlePlay == true ? this.circlePlay = false : this.circlePlay = true;
        this.musicPlay(!this.circlePlay);
      },
      musicPlay(isPlay) {
        console.log('isPlay---', isPlay)
        let media = document.getElementById('myMusic');
        if (isPlay) {
          media.play();
        }
        if (!isPlay) {
          media.pause();
          console.log('media.pause')
        }
        document.addEventListener("WeixinJSBridgeReady", function () {
          if (isPlay && media.paused) {
            media.play();
          }
          if (!isPlay && !media.paused) {
            media.pause();
          }
        }, false);
      },
      mplay() {
        let media = document.getElementById('myMusic');
        if (media.paused) {
          this.circlePlay = true
          media.play()
        }
      },
      userHome() {
        let params = {
          userId: this.userId,
          token: ''
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {
            userId: this.userId,
            token: ''
          }
        })*/
        this.$axios.userHome.userhome(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            let data = res.data.returnObject
            this.avatar = data.weixinAvatar
            this.userInfo = {
              userName: data.userName,
              weixinAvatar: data.weixinAvatar
            }
          }
        })
      },
      addCode() {
//        $('.swiper-slide').css('height', document.body.clientHeight + 'px')
//        $('.swiper-slide').css('overflow', 'hidden')
        this.mplay()
        if (!this.code) {
          this.$toast({message: '请输入股票代码', position: 'center', duration: 1500});
        }
        if (!this.errorInfo && this.code) {
          this.showCodeList = false
          this.autoComplete().then((res) => {
             let hasCode = false
             if (this.codeList.length > 0) {
               this.codeList.forEach((item) => {
                 if (item.code == this.code || item.name == this.code) {
                   hasCode = true
                   this.companyCode = item.code
                   this.companyName = item.name
                   this.name = item.name
                 }
               })
             }
             if (hasCode) {
               // this.popupVisible = false
               this.get2018YearSummaryByCode()
               this.initWeiXin()
               // $('.animated').css({'visibility': 'hidden'})

             } else {
               this.errorInfo = true
             }
          })
        }

      },
      inputSearch() {
        setTimeout(() => {
          this.autoComplete().then(() => {})
        }, 500)
      },
      highlight(value, content) {
        return content.replace(value, '<span class="highlight">' + value + '</span>')
      },
      selectSearch(item, index) {
        this.code = item.code
        this.codeList = []
      },
      autoComplete() {
        return new Promise((resolve, reject) => {
          let params = {
            key: this.code,
          }
          this.$axios.common.autoComplete(params).then((res) => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.codeList = res.data.returnObject;
              this.errorInfo = false
              resolve(null)
            } else {
              this.codeList = []
              this.errorInfo = true
            }
          }).catch(err => {
            this.codeList = []
            this.errorInfo = true
            reject(err)
          })
        })
      },
      get2018YearSummaryByCode() {
        let params = {
          code: this.code,
          token: this.userId
        }
        this.$axios.common.get2018YearSummaryByCode(params).then((res) => {
          if ((res.data.returnCode == 200 || res.data.returnCode == 1) && res.data.returnObject) {
            this.popupVisible = false
            this.yearSummary = res.data.returnObject
            // console.log(this.yearSummary)
            // this.yearSummary.importantEvent_second_data.emptyStatus = 0
            this.animateOne()

            /* $('.active-num').html(this.yearSummary.animate_index)
            $('#share-btn').on('click', () => {
              this.showShare()
            })
            $('#create-btn').on('click', () => {
              location.href = '/#/year2018'
            }) */

          } else {
            this.popupVisible = true
            this.$toast({message: '暂无此股票数据', position: 'center', duration: 1500});
          }
        }).catch(err => {
          this.popupVisible = true
          this.$toast({message: '暂无此股票数据', position: 'center', duration: 1500});
        })
      },
      showShare() {
        this.coverShare = true
      },
      hideShare() {
        this.coverShare = false
      }
    }
  }
</script>

<style lang="scss">
  body {
    overflow: hidden !important;
  }
  #year2018 {
    font-size: 14px;
    width: 100%;
    height: 100%;
    .pagebg {
      background: url('https://oss.in-hope.cn/xiaoan/h5_static/year2018/bg.png') no-repeat;
      background-size: 100% 100%;
    }
    .endbg {
      background: url('https://oss.in-hope.cn/xiaoan/h5_static/year2018/endbg.png') no-repeat;
      background-size: 100% 100%;
    }
    .pb30{
      padding-bottom: 30px;
    }
    .vcenter {
      position: absolute;
      top: 30px;
      width: 100%;
      /*<!--transform: translateY(-50%);-->*/
    }
    .highlight {
      color: #ffb148;
    }
    .logo {
      width: (207px/2);
      height: (83px/2);
    }
    .swiper-content,.swiper-container,.swiper-box{
      width: 100%;
      height: 100%;
    }
    .cover {
      position: absolute;
      top:0;
      left:0;
      width: 100%;
      height: 100%;
      opacity:.5;
    }

    .next-icon {
      position: absolute;
      bottom: 37px;
      width: 22px;
      height: 22px;
      left: 50%;
      margin-left: -11px;
      animation: arrow 1.5s infinite ease-in-out;
      z-index: 100;
    }
    @-webkit-keyframes arrow {
      0% {opacity: .9;bottom:37px;}
      100% {opacity:.3;bottom:33px;}
    }

    .year-user-info {
      display: flex;
      height: 40px;
      align-items: center;
      padding-left: 18px;
      .header-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 2px solid #FF6830;
      }
      .user {
        margin-left: 5px;
        .user-nick {
          font-size: 14px;
          color: #fff;
          max-width:250px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .user-code {
          font-size: 12px;
          color: #fff;
        }
      }
    }
    .xiaoan-audio {
      position: absolute;
      right: 20px;
      top: 30px;
      z-index: 1900;
      font-size: 0;
      img {
        height: 30px;
        width: 30px;
        border-radius: 50%;
        background-color: rgba(0, 0, 0, 0.1);
      }
      .circlePlay {
        -o-animation-play-state: paused !important;
        -moz-animation-play-state: paused !important;
        -webkit-animation-play-state: paused !important;
        animation-play-state: paused !important;
      }
      .circle {
        display: inline-block;
        -webkit-animation: circle 1.2s infinite linear; /*匀速 循环*/
        animation: circle 1.2s linear infinite;
        animation-play-state: running;
      }
      @-webkit-keyframes circle {
        100% {
          transform: rotate(1turn);
        }
      }
    }
    .cover-share {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      -webkit-overflow-scrolling: touch;
      background: rgba(0, 0, 0, 0.8);
      z-index: 3000;
      div {
        background: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/fenxiangT@3x.png");
        background-repeat: no-repeat;
        background-size: contain;
        width: 276.097px;
        height: 270px;
        margin: 35px auto 0 auto;
        margin-right: 25px;
      }
    }

    .y-scale-ani {
      animation: scaleanimation 1.5s ease-in-out;
      -webkit-animation-iteration-count: 3;
      animation-iteration-count: 3;
    }
    .y-scale-iteration {
      animation: scaleanimation 1.5s infinite ease-in-out;
    }
    @-webkit-keyframes scaleanimation {
      0% {transform: scale(1)}
      50% {transform: scale(1.1)}
      100% {transform: scale(1)}
    }
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
      .vcenter {
        position: absolute;
        top: 8%;
      }
      .xiaoan-audio {
        top: 8%;
      }
    }
  }
  .popupBox {
    z-index: 999;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.6);
    overflow: hidden;
  }
  .popup-code {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%,-50%);
    width: 294px;
    height: 245px;
    background: white;
    border-radius: 4px;
    .popup-code-title {
      text-align: center;
      width:100%;
      height:50px;
      background:#FFB148;
      font-weight: 600;
      font-size: 18px;
      color: #fff;
      line-height: 50px;
      border-radius: 4px 4px 0 0;
    }
    .popup-code-form {
      padding: 35px 25px 0 25px;
      form {
        width: 100%;
        height: 100%;
        text-align: center;
        .form-box {
          min-height: 64px;
          position: relative;
          .code-box {
            position: absolute;
            top: 50px;
            padding-top: 5px;
            width:178px;
            height:210px;
            background:rgba(255,255,255,1);
            box-shadow:0px 3px 18px 0px rgba(51,51,51,0.15);
            border-radius:8px;
            &:before {
              content: '';
              position: absolute;
              left: 50%;
              top: -7px;
              width:14px;
              height:14px;
              border:0;
              margin-left:-7px;
              border-left:1px solid #e3e3e3;
              border-top:1px solid #e3e3e3;
              transform: rotate(45deg);
              background-color: #fff;
            }
            ul {
              width: 100%;
              height: 100%;
              overflow-y: auto;
              li {
                height: 40px;
                line-height: 40px;
                width: 100%;
                color: #666666;
                padding: 0 8px;
                font-size: 14px;
                text-align: left;
                font-weight: 300;
                .code {
                  display: inline-block;
                  width: 70px;
                }
                .name {
                  /*margin-left: 10px;*/
                }
              }

            }
          }

        }
        div {
          input {
            width:245px;
            height:40px;
            background:rgba(238,238,238,1);
            border-radius:8px;
            font-size: 14px;
            padding: 0 10px;
          }
          input::placeholder {
            color: #999999;
          }
        }
        button {
          width:121px;
          height:40px;
          background:rgba(255,177,72,1);
          border-radius:40px;
          margin-top: 20px;
          font-size: 14px;
          color: #fff;
        }
      }
      .error-info {
        font-size: 11px;
        color: #fb5048;
        text-align: left;
        padding-top: 5px;
      }
    }
    .input-tip {
      font-size: 12px;
      color: #999999;
      text-align: center;
      width:100%;
      margin-top: 10px;
      padding-bottom: 10px;
    }

  }
</style>
