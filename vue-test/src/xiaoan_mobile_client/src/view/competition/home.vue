<template>
  <div id="comp-home">
    <div class="one"></div>
    <flexbox class="bar-box" align="center" gutter="0" justify="center">
      <flexbox-item class="vux-1px-r">
        <p class="number" @click="$router.push({path:'/competition/details'})">{{competitionData.totalScore}}</p>
        <p class="title">总积分</p>
      </flexbox-item>
      <flexbox-item class="vux-1px-r">
        <p class="number">{{competitionData.testFinishScore}}</p>
        <p class="title">答题积分</p>
      </flexbox-item>
      <flexbox-item>
        <p class="number">{{competitionData.inviteScore}}</p>
        <p class="title">邀请积分</p>
      </flexbox-item>
    </flexbox>
    <div class="flex-box registration">
      <div class="col align-l">
        <div class="registration_back"></div>
      </div>
      <div class="col align-r">
        <x-button mini class="registration_btn" @click.native="registrationHandle" :disabled="isRegistration"
                  :class="{'btn-check': isRegistration}">{{isRegistration?`已签到`: `签到`}}
        </x-button>
      </div>
    </div>
    <div class="flex-box call">
      <div class="col align-l">
        <div class="call_back"></div>
      </div>
      <div class="col align-r">
        <x-button class="call_btn" @click.native="shareModalChange" :disabled="isSecretaries"
                  :class="{'btn-check':isSecretaries}">{{isSecretaries?'已打Call':'邀请'}}
        </x-button>
      </div>
    </div>
    <div class="flex-box select">
      <div class="select_question"></div>
    </div>
    <flexbox class="test-box" align="center" gutter="10" justify="center">
      <flexbox-item class="test-item" :class="{'itemChoose': item.selected}" v-for="(item, index) in testData"
                    :key="index" @click.native="onTestHandle(item)">
        <p class="test-name">{{item.name}}</p>
        <template v-if="item.maxScore">
          <p class="test-score">{{item.maxScore}}</p>
          <p class="open-time">当前试卷最高得分</p>
        </template>
        <template v-else>
          <img :src="$image.competition.home_icon_open" class="open" v-if="item.show">
          <img :src="$image.competition.home_icon_close" class="open" v-else>
          <p class="open-time" v-if="item.show">已开放</p>
          <p class="open-time" v-else>未开放</p>
        </template>
      </flexbox-item>
    </flexbox>
    <p class="answerChance">您还有<span>{{competitionData.chanceNum}}</span>次答题机会，邀请好友可增加答题机会哦！</p>
    <div class="goAnswer" @click="goAnswerHandle"></div>
    <div class="inviteFriends" @click="inviteFriendsCheck"></div>
    <div class="checkRankings" @click="$router.push({path:`/competition/ranking`})"></div>
    <div class="myInvite" v-if="mineInvite.length>0">
      <div class="cell">我的邀请</div>
      <x-table class="vxa-table vux-1px" :cell-bordered="false" style="background-color:transparent">
        <tbody>
        <tr v-for="(item, index) in mineInvite" :key="index">
          <td width="40px">
            <div class="cell justify" v-if="index ==0">
              <img v-if="item.inviteType == 2" :src="$image.competition.home_call"/>
              <template v-else>{{index+1}}</template>
            </div>
            <div class="cell justify" v-else>
              {{index+1}}
            </div>
          </td>
          <td width="34px">
            <div class="cell">
              <img class="user_head" :src="item.weixinAvatar"/>
            </div>
          </td>
          <td>
            <div class="cell"><span style="text-align:left;display: inline-block;max-width: 100px"
                                    class="vxa-ellipsis">{{item.userName}}</span>
            </div>
          </td>
          <td width="80">
            <div class="cell">{{inviteTypeObj[item.inviteType]}}</div>
            <!--<div class="cell" v-else>{{''}}</div>-->
          </td>
          <td width="40px" style="min-width: 40px">
            <div class="cell justify">{{item.inviteScore}}</div>
          </td>
        </tr>
        </tbody>
      </x-table>
    </div>
    <!---->
    <div class="simpleModal" v-transfer-dom>
      <x-dialog v-model="shareModal" class="dialog-demo">
        <div class="img-box" ref="imgBoxDom">
          <img :src="shareImg" id="imgShow"/>
          <canvas id="canvas_box" style="display: none"></canvas>
          <div class="fan" @click="shareModal = false"><i class="icon iconfont icon-jia3"></i></div>
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
    <!---->
    <div class="simpleModal" v-transfer-dom>
      <x-dialog v-model="inviteFriends" class="dialog-demo">
        <div class="img-box" ref="imgBoxDom">
          <img id="imgFriendShow" :src="inviteImg"/>
          <canvas id="canvas_friends_box" style="display: none"></canvas>
          <div class="fan" @click="inviteFriends = false"><i class="icon iconfont icon-jia3"></i></div>
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
    <!---->
    <div id="shareDialog" v-transfer-dom>
      <x-dialog hide-on-blur v-model="shareShadow" mask-z-index="5000">
        <div class="share-box" @click.prevent="shareShadow = false">
          <img :src="$image.competition.share" alt="">
        </div>
      </x-dialog>
    </div>
    <!---->
    <div v-transfer-dom class="vux-opacity-qrcode home">
      <qrcode v-model="homeUrl" type="img"></qrcode>
    </div>
    <!---->
    <div v-transfer-dom class="vux-opacity-qrcode call">
      <qrcode v-model="callUrl" type="img"></qrcode>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import {cutstr} from '../../common/utils.js'
  // import qrcode from "@/components/qrcode/qrcode"
  import {
    Qrcode,
    XButton,
    XTable,
    XDialog,
    TransferDomDirective as TransferDom,
    LoadMore,
    Flexbox,
    FlexboxItem
  } from 'vux'
  export default {
    name: "comp-home",
    components: {
      Flexbox,
      FlexboxItem,
      XTable,
      LoadMore,
      XButton,
      XDialog,
      Qrcode
    },
    directives: {
      TransferDom
    },
    data() {
      return {
        isCall: false,
        shareShadow: false,
        shareModal: false,
        isSecretaries: false,
        inviteFriends: false,
        shareImg: this.$image.competition.cell_call,
        inviteImg: this.$image.competition.friend_share,
        friendImg: this.$image.competition.friend_share,
        //
        isRegistration: false,
        testData: [
          {
            "id": "3473375fb9024229b7541d3944186bc6",
            "indexNo": 1,
            "name": "试卷一",
            "maxScore": null,
            "openTime": 1542816000000
          },
          {
            "id": "705ea3daea7e496fa03fbc36b26eb8d3",
            "indexNo": 2,
            "name": "试卷二",
            "maxScore": null,
            "openTime": 1543248000000
          },
          {
            "id": "f9cb9905e6044298843dce0150d04f89",
            "indexNo": 3,
            "name": "试卷三",
            "maxScore": null,
            "openTime": 1543680000000
          }
        ],
        competitionData: {
          "id": 13,
          "userId": "d9f91fdd9eba49bdbd874f5c7fdae190",
          "chanceNum": 0,
          "answerScore": 0,
          "signScore": 0,
          "inviteScore": 0,
          "supportScore": 0,
          "cardcaseImg": "http://oss.in-hope.cn/enterpriseApply/f79015a27621451abc0cd355c34e6a5b.png",
          "joinTime": 0,
          "inviteId": "",
          "inviteeTime": 0,
          "testFinishScore": 0,
          "totalScore": 0
        },
        selectTest: {},
        callUrl: '',
        homeUrl: '',
        inviteType: [
          {type: 'COMMON', id: 0},
          {type: 'COMMONINVITE', id: 1},
          {type: 'SECRETARY', id: 2}
        ],
        inviteTypeObj: {
          "0": "已参与",
          "1": "已参与",
          "2": "已打Call"
        },
        mineInvite: [],
        userInfo: {}
      }
    },
    created() {
      let set = Object.assign({}, this.$route.query, {isJoin: true})
      window.sessionStorage.setItem('competition_user', window.JSON.stringify(set));
      if (this.$cookie.isLogin()) {
        this.userInfo = this.$cookie.getUserInfo();
        // 从邀请董秘分享的 url
        this.homeUrl = `${this.$api.CURRENTIP.IP}#/competition/home?type=1&id=${this.userInfo.id}&source=friend`;
        this.callUrl = `${this.$api.CURRENTIP.IP}#/competition/call?type=2&id=${this.userInfo.id}&source=call&name=${this.userInfo.userName}`;
        console.log(this.callUrl, this.homeUrl);
        this.getUserCheckStatus();
        this.getAllTestPaper();
        this.getMineInvite();
        this.checkInviteSecretary();
        this.getNotFinishTest();
      } else {
        this.$storage.loginStatus(this, '知识竞赛', window.location.href);
      }
    },
    computed: {
      ...mapState({
        isCompetition: state => state.mutations.isCompetition
      })
    },
    watch: {
      isCompetition: function (val) {
        if (val) {
        } else {
          this.$router.replace({path: '/competition/enroll'})
        }
        console.log('3423423423===>111', this.isCompetition);
      },
      shareModal: function (val) {
        console.log(this.$store.state.mutations.competitionObject);
        if (val) {
          this.share('call');
        } else {
          this.share('friends');
        }
      }
    },
    mounted() {
      this.share('friends');
      this.$nextTick(() => {
        if (this.$route.query.id) {
          if (this.userInfo.id == this.$route.query.id) {
            setTimeout(_ => {
              if (this.$route.query.source == 'call') {
                this.shareModalChange();
              } else if (this.$route.query.source == 'friend') {
                this.inviteFriendsCheck();
              }
            }, 1500)
          }
        }
      })
    },
    destroyed() {
      console.log(123123);
      this.$vux.loading.hide();
    },
    methods: {
      getNotFinishTest() {
        let params = {};
        this.$axios.competition.getNotFinishTest(params).then(res => {
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.$router.replace({
                path: '/competition/testing',
                query: {id: res.data.returnObject.question.testPaperId}
              });
            }
          }
        }).catch(err => {
        })
      },
      //
      checkInviteSecretary() {
        this.$axios.competition.checkInviteSecretary().then(res => {
          // console.log(res);
          if (res.data.returnCode == 200) {
            this.isSecretaries = res.data.returnObject;
          }
        })
      },
      //
      share(type) {
        if (type == 'call') {
          let shareTitle = '董秘，请助我一臂之力！';
          let shareLink = decodeURI(`${this.$api.CURRENTIP.IP}#/competition/call?id=${this.userInfo.id}&type=2&source=call&name=${this.userInfo.userName}`); // 分享链接
          let shareDesc = "你不投我不投，你家证代何时能出头？"; // 描述
          this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
        } else {
          let shareTitle = '我正在参与答题，快来和我PK专业值';
          let shareLink = decodeURI(`${this.$api.CURRENTIP.IP}#/competition/home?id=${this.userInfo.id}&type=1&source=friend&name=${this.userInfo.userName}`); // 分享链接
          let shareDesc = "邀你参加“小安杯·董办知识竞赛”，赢取多重活动好礼！"; // 描述
          this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true, this.increaseAnswerNum);
          // 朋友圈
          let t2 = '一起来battle！测测您的董办“战斗力”！', d2 = '挑战董办专业题库，赢取多重活动好礼！';
          this.$weixin.shareTimeline(t2, d2, shareLink, this.$api.share.defaultImg, true, this.increaseAnswerNum);
        }
      },
      //
      inviteFriendsCheck() {
        this.$vux.loading.show({text: '加载中'});
        this.share('friends');
        let userName = cutstr(`${this.userInfo.userName}`, 5);
        this.drawQrcodeFriend(userName);
        setTimeout(() => {
          this.inviteFriends = true;
        }, 1000)
      },
      //
      inviteShare() {
        this.shareShadow = true;
      },
      //
      shareModalChange() {
        this.share('call');
        this.$vux.loading.show({text: '加载中'});
        let userName = cutstr(`${this.userInfo.userName}`, 5);
        this.drawQrcode(userName);
        setTimeout(() => {
          this.shareModal = true;
        }, 1000)
      },
      //
      onTestHandle(item) {
        console.log(item);
        if (!item.show) {
          this.$vux.toast.show({
            text: `开放日期${this.$const.format(item.openTime)}`,
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
          return false
        }
        this.selectTest = item;
        this.testData.forEach((e, i) => {
          e.selected = false;
          if (e.id == item.id) {
            e.selected = true;
          }
        });

      },
      // GET /competition/increaseAnswerNum
      increaseAnswerNum() {
        this.$axios.competition.increaseAnswerNum().then(res => {
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '分享成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.getAllTestPaper();
          }
        }).catch(err => {

        })
      },
      //
      goAnswerHandle() {
        if (this.competitionData.chanceNum <= 0) {
          this.$vux.toast.show({
            text: '您暂无答题次数，分享好友可以再次答题！',
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
        } else {
          this.$router.push({path: '/competition/testing', query: {id: this.selectTest.id}});
        }
      },
      // competition/getAllTestPaper
      getAllTestPaper() {
        this.$axios.competition.getAllTestPaper().then(res => {
          if (res.data.returnCode == 200) {
            this.$nextTick(() => {
              console.log(res);
              if (res.data.returnObject) {
                this.testData = res.data.returnObject.testPaperList;
                let format = new Date().getTime();
                this.testData.forEach((e, i) => {
                  this.$set(e, "show", false);
                  this.$set(e, "selected", false);
                  if (e.openTime < format) {
                    e.show = true;
                  }
                });
                if (this.testData.length > 0) {
                  this.testData[0].selected = true;
                  this.selectTest = this.testData[0];
                }
                this.competitionData = res.data.returnObject.competition;
              } else if (res.data.returnObject == false) {
                this.$router.replace({path: '/competition/enroll'})
              } else {

              }
            })
          }
        }).catch(err => {

        })
      },
      //
      registrationHandle() {
        this.checkIn();
      },
      //
      checkIn() {
        this.$axios.competition.checkIn().then(res => {
          if (res.data.returnCode == 200) {
            // console.log(res.data);
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
            this.getAllTestPaper();
            this.getUserCheckStatus();
          } else {

          }
        }).catch(err => {

        })
      },
      //
      getUserCheckStatus() {
        this.$axios.competition.getUserCheckStatus().then(res => {
          if (res.data.returnCode == 200) {
            this.isRegistration = res.data.returnObject;
          } else if (res.data.returnCode == 500) {
            this.isRegistration = res.data.returnObject;
          }
        }).catch(err => {

        })
      },
      //
      drawQrcode(name) {
        var _that = this;
        _that.$vux.loading.show({text: '加载中'});
        setTimeout(() => {
          _that.$vux.loading.hide()
        }, 5000)
        var nameText = name
        var textsStyle = {
          textAlign: 'left',
          font: '40px sans-serif',
          lineWidth: 1.0,
          fontWeight: "900",
          fillStyle: '#fff'
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
        // onload是异步加载，所以要等第一个onload 加载完毕再画第二张图片
        // 代言文字图片
        var _imagetext = new Image();
        _imagetext.src = _that.shareImg
        textsStyle.fillStyle = '#fff'
        // 第一次 执行 话 大图
        _imagetext.onload = function () {
          _context.save(); // 保存当前_context的状态
          _context.drawImage(_imagetext, 0, 0);
          _context.stroke();//
          _context.closePath();
          _context.save();
          // 保存当前_context的状态
          var codeImg = new Image();
          codeImg.src = document.querySelector('.vux-opacity-qrcode.call img').getAttribute('src');
          console.log(_that.callUrl);
          _context.save();
          // 保存当前_context的状态
          _context.drawImage(codeImg, 78, 1042.5, 175, 175);
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
          _context.fillText(nameText, 92.5, 500);
          // canvas 画完图 一定要生成图片流，作为img 的src属性值，同时隐藏canvas，只展示img 就ok了，在手机上试试长按保存功能吧
          var _imgSrc = _canvas.toDataURL("image/png", 1);
          _canvas.style.display = "none";
          var imgShow = document.getElementById('imgShow');
          imgShow.setAttribute('src', _imgSrc);
          _that.shareImg = _imgSrc;
          setTimeout(() => {
            _that.$vux.loading.hide()
          }, 1000)
          // console.log('324242', _imgSrc);
        }
      },
      //
      drawQrcodeFriend(name) {
        var _that = this;
        _that.$vux.loading.show({text: '加载中'});
        setTimeout(() => {
          _that.$vux.loading.hide()
        }, 5000)
        var nameText = name
        var textsStyle = {
          textAlign: 'left',
          font: '40px sans-serif',
          lineWidth: 1.0,
          fontWeight: "900",
          fillStyle: '#fff'
        };
        // 开始构造
        var nWidth = 375, // 屏幕可视区域 宽度
          nHeight = 667, // 屏幕可视区域 高度
          _canvasWidth = 750, // 画布 宽度
          _canvasHeight = 1334; // 画布 高度
        // 开始画图，获取上下文；
        var _canvas = document.getElementById("canvas_friends_box");
        _canvas.width = _canvasWidth;
        _canvas.height = _canvasHeight;
        var _context = _canvas.getContext('2d');
        // 背景
        _context.fillRect(0, 0, nWidth * 2, nHeight * 2);
        // 白色矩形部分
        _context.fill();
        _context.closePath();
        // onload是异步加载，所以要等第一个onload 加载完毕再画第二张图片
        //
        // 代言文字图片
        var _imagetext = new Image();
        _imagetext.src = _that.inviteImg
        textsStyle.fillStyle = '#fff'
        // 第一次 执行 话 大图
        _imagetext.onload = function () {
          _context.save(); // 保存当前_context的状态
          _context.drawImage(_imagetext, 0, 0);
          _context.stroke();//
          _context.closePath();
          _context.save();
          // 保存当前_context的状态
          var codeImg = new Image();
          codeImg.src = document.querySelector('.vux-opacity-qrcode.home img').getAttribute('src');
          console.log(_that.callUrl);
          _context.save();
          // 保存当前_context的状态
          _context.drawImage(codeImg, 57.5, 1061, 175, 175);
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
          _context.fillText(nameText, 42.5, 420);
          // canvas 画完图 一定要生成图片流，作为img 的src属性值，同时隐藏canvas，只展示img 就ok了，在手机上试试长按保存功能吧
          var _imgSrc = _canvas.toDataURL("image/png", 1);
          _canvas.style.display = "none";
          var imgShow = document.getElementById('imgFriendShow');
          imgShow.setAttribute('src', _imgSrc);
          _that.inviteImg = _imgSrc;
          setTimeout(() => {
            _that.$vux.loading.hide()
          }, 1000)
          // console.log('324242', _imgSrc);
        }
      },
      //
      getMineInvite() {
        this.$axios.competition.getMineInvite().then(res => {
          if (res.data.returnCode == 200) {
            this.mineInvite = res.data.returnObject;
            this.mineInvite = this.mineInvite.filter((e) => {
              return e.isSecretary == true;
            })
          }
        }).catch(err => {

        })
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/close';
</style>
<style lang="scss">
  #comp-home {
    .bar-box {
      padding-top: 10px;
      .vux-1px-r:after {
        height: 20px;
        top: 50%;
        transform: translateY(-50%) scaleX(0.5);
      }
      .number {
        text-align: center;
        font-size: 19px;
        font-family: PingFangSC-Semibold sans-serif;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
      }
      .title {
        text-align: center;
        font-size: 12px;
        font-weight: 400;
        color: rgba(204, 204, 204, 1);
      }
    }
    .flex-box {
      padding: 0 20px;
      align-items: center;
      &.registration {
        margin-top: 20px;
      }
      &.call {
        margin-top: 15px;
      }
      &.select {
        margin-top: 22px;
      }
      .registration_back {
        width: 102px;
        height: 15px;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/home_MR_QD.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
      .registration_btn {
        height: 30px;
        width: 73px;
        padding: 0;
        border-radius: 4px;
        color: #000000;
        font-size: 14px;
        font-weight: bold;
        background-color: #FFCC00;
        border-color: #FFCC00;
        transition: all .3s;
        &.btn-check {
          background-color: #fff;
          border-color: #fff;
          color: #161416;
        }
      }
      .call_back {
        width: 213.5px;
        height: 15.5px;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/home_DMCALL.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
      .call_btn {
        height: 30px;
        width: 73px;
        padding: 0;
        border-radius: 4px;
        font-size: 14px;
        color: #000000;
        font-weight: bold;
        background-color: #FFCC00;
        border-color: #FFCC00;
        display: inline-block;
        &.btn-check {
          background-color: #fff;
          border-color: #fff;
          color: #161416;
        }
      }
      .select_question {
        width: 78px;
        height: 15px;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/home_select_Q.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
    }
    .test-box {
      margin-top: 16px;
      padding: 0 20px;
      transition: all .2s;
      .test-item {
        width: 105px;
        height: 95px;
        text-align: center;
        border: 1px solid #CCCCCC;
        transition: all .2s;
        position: relative;
        .test-name {
          font-size: 15px;
          color: #CCCCCC;
          font-family: PingFangSC-Semibold;
          font-weight: 600;
          margin: 4px 0 12px;
          transition: all .2s;
        }
        .test-score {
          font-size: 30px;
          color: white;
          line-height: 1;
          transition: all .2s;
        }
        .open {
          height: 25px;
        }
        .close {
          height: 22px;
        }
        .open-time {
          font-size: 11px;
          color: #CCCCCC;
          margin-top: 8px;
          position: absolute;
          bottom: 3px;
          width: 100%;
          left: 0;
          right: 0;
          text-align: center;
          transition: all .2s;
        }
      }
      .itemChoose {
        border: 1px solid #FFCC00;
        .test-name {
          color: #FFCC00;
          transition: all .2s;
        }
        .test-score {
          color: #FFCC00;
          transition: all .2s;
        }
      }
    }
    .vxa-table {
      tbody {
        tr {
          td {
            .cell {
              display: flex;
              align-items: center;
              &.justify {
                justify-content: center;
              }
              .user_head {
                height: 33px;
                width: 33px;
                font-size: 0;
              }
            }
          }
        }
      }
    }
    .answerChance {
      text-align: center;
      margin: 11px 0 24px;
      color: #CCCCCC;
      font-size: 12px;
      span {
        font-size: 16px;
        color: #FFCC00;
        padding: 0 6px;
      }
    }
    .goAnswer {
      margin: 0 auto;
      width: 232px;
      height: 66px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/home_goAnswer.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .inviteFriends {
      margin: 21px auto 0;
      width: 135px;
      height: 20px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/home_inviteFriends.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .checkRankings {
      margin: 14px auto 36px;
      width: 158px;
      height: 20px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/home_checkRankings.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .myInvite {
      border-radius: 2px;
      width: 333px;
      margin: 0 auto;
      padding-bottom: 50px;
      .cell {
        background-color: transparent;
        color: #fff;
        font-weight: bold;
        font-size: 0.4rem;
        padding: 0 0.133333rem;
        height: 35px;
        line-height: 35px;
        text-align: center;
      }
    }
  }
</style>
