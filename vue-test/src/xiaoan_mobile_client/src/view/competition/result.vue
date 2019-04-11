<template>
  <div id="comp-result">
    <div class="one"></div>
    <div class="score-box">
      <p class="title">您本次得分</p>
      <p class="score">{{score}}</p>
    </div>
    <p class="text">邀请好友来参加，增加答题机会还能赢大奖！</p>
    <div class="inviteFriends" @click="inviteFriendsCheck"></div>
    <div class="toBack" @click="$router.replace({path:'/competition/home'})"></div>
    <div class="totalScore" v-if="totalScoreRank.length >0">
      <div class="cell">总积分榜</div>
      <x-table class="vxa-table vux-1px" :cell-bordered="false" style="background-color:transparent">
        <tbody>
        <tr v-for="(item, index) in totalScoreRank" :key="index" :class="{'setColor': index == 0}">
          <td width="40px">
            <div class="cell justify">{{item.index}}</div>
          </td>
          <td width="34px">
            <div class="cell">
              <img class="user_head" :src="item.weixinAvatar"/>
            </div>
          </td>
          <td width="200px">
            <div class="cell"><span style="text-align:left;display: inline-block;max-width: 200px"
                                    class="vxa-ellipsis">{{item.userName}}</span>
            </div>
          </td>
          <td width="40px" style="min-width: 40px">
            <div class="cell justify" style="justify-content: flex-end">{{item.totalScore}}</div>
          </td>
        </tr>
        </tbody>
      </x-table>
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
    <div class="simpleModal activity" v-transfer-dom>
      <x-dialog hide-on-blur v-model="activity">
        <div class="share-box">
          <div class="border">
            <div class="ac_close" @click="activity = false"></div>
            <div class="activity_title"></div>
            <div class="activity_s"></div>
            <div class="check_b" @click="setJoinOffLine(true)"></div>
            <div class="check_b nocheck_b" @click="setJoinOffLine(false)"></div>
          </div>
        </div>
      </x-dialog>
    </div>
    <!---->
    <div class="simpleModal activityTrue" v-transfer-dom>
      <x-dialog hide-on-blur v-model="activityFalse">
        <div class="share-box">
          <div class="border">
            <div class="ac_close" @click="activityFalse = false"></div>
            <div class="isjoin"></div>
          </div>
        </div>
      </x-dialog>
    </div>
    <!---->
    <div class="simpleModal activityTrue" v-transfer-dom>
      <x-dialog hide-on-blur v-model="activityTrue">
        <div class="share-box">
          <div class="border">
            <div class="ac_close" @click="activityTrue = false"></div>
            <div class="nojoin"></div>
          </div>
        </div>
      </x-dialog>
    </div>
    <!---->
    <div v-transfer-dom class="vux-opacity-qrcode">
      <qrcode v-model="callUrl" type="img"></qrcode>
    </div>
  </div>
</template>

<script>
  import {Qrcode, XTable, XDialog, TransferDomDirective as TransferDom} from 'vux'
  import {cutstr} from '../../common/utils.js'
  export default {
    name: "comp-result",
    components: {
      XTable, XDialog, Qrcode
    },
    data() {
      return {
        answerScoreRank: [],
        inviteScoreRank: [],
        totalScoreRank: [],
        inviteFriends: false,
        mineInvite: [],
        shareShadow: false,
        inviteImg: this.$image.competition.friend_share,
        inviteTypeObj: {
          "0": "已参与",
          "1": "已参与",
          "2": "已打Call"
        },
        activity: false,
        activityTrue: false,
        activityFalse: false,
        callUrl: '',
        userInfo: {},
        isCall: false
      }
    },
    computed: {
      score: function () {
        if (this.$route.query.score) {
          return this.$route.query.score;
        } else {
          return 0
        }
      }
    },
    directives: {
      TransferDom
    },
    created() {
      this.userInfo = this.$cookie.getUserInfo();
      this.callUrl = `${this.$api.CURRENTIP.IP}#/competition/call?type=2&id=${this.userInfo.id}`;
      this.getRankingList();
      this.checkJoinOffLineSet();
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
      this.share();
    },
    methods: {
      //
      inviteShare() {
        this.shareShadow = true;
      },
      inviteFriendsCheck() {
        this.$vux.loading.show({text: '加载中'});
        this.share('friends');
        let userName = cutstr(`${this.userInfo.userName}`, 5);
        this.drawQrcodeFriend(userName);
        this.inviteFriends = true;
      },
      checkJoinOffLineSet() {
        this.$axios.competition.checkJoinOffLineSet().then(res => {
          if (res.data.returnCode == 200) {
            this.isCall = res.data.returnObject;
            if (this.isCall) {
              this.activity = false;
            } else {
              this.activity = true;
            }
          }
        })
      },
      //
      share(type) {
        this.$nextTick(() => {
          console.log(this.userInfo);
          let shareTitle = '我正在参与答题，快来和我PK专业值';
          let shareLink = decodeURI(`${this.$api.CURRENTIP.IP}#/competition/home?id=${this.userInfo.id}&type=1&source=friend`); // 分享链接
          let shareDesc = "邀你参加“小安杯·董办知识竞赛”，赢取多重活动好礼！"; // 描述
          this.$weixin.wxshare(shareTitle, shareDesc, shareLink, this.$api.share.defaultImg, true);
          // 朋友圈
          let t2 = '一起来battle！测测您的董办“战斗力”！', d2 = '挑战董办专业题库，赢取多重活动好礼！';
          this.$weixin.shareTimeline(t2, d2, shareLink, this.$api.share.defaultImg, true);
        })
      },
      drawQrcodeFriend(name) {
        var _that = this;
        this.$vux.loading.show({text: '加载中'});
        setTimeout(() => {
          _that.$vux.loading.hide();
        }, 1500)
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
          codeImg.src = document.querySelector('.vux-opacity-qrcode img').getAttribute('src');
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
          // console.log('324242', _imgSrc);
          _that.$vux.loading.hide();
        }
      },
      // GET /competition/setJoinOffLine
      setJoinOffLine(type) {
        this.activity = false
        let params = {
          joinOffLine: type
        };
        this.$axios.competition.setJoinOffLine(params).then(res => {
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              if (!!!type) {
                this.activityFalse = true;
              } else {
                this.activityTrue = true;
              }
            }
          }
        }).catch(err => {

        })
      },
      getRankingList() {
        this.$axios.competition.getRankingList().then(res => {
          if (res.data.returnCode == 200) {
            // console.log(res.data);
            let data = res.data.returnObject;
            //
            this.answerScoreRank = data.answerScoreRank;
            this.answerScoreRank.forEach((e, i) => {
              this.$set(e, 'index', i + 1);
            });
            this.answerScoreRank.unshift({
              weixinAvatar: this.userInfo.weixinAvatar,
              userName: this.userInfo.userName,
              answerScore: res.data.returnObject.answerScore,
              index: res.data.returnObject.answerScoreIndexNo
            });
            //
            this.inviteScoreRank = data.inviteScoreRank;
            this.inviteScoreRank.forEach((e, i) => {
              this.$set(e, 'index', i + 1);
              this.$set(e, 'friend', e.inviteScore + e.supportScore)
            });
            this.inviteScoreRank.unshift({
              weixinAvatar: this.userInfo.weixinAvatar,
              userName: this.userInfo.userName,
              friend: res.data.returnObject.inviteScore,
              index: res.data.returnObject.inviteScoreIndexNo
            });
            //
            this.totalScoreRank = data.totalScoreRank;
            this.totalScoreRank.forEach((e, i) => {
              this.$set(e, 'index', i + 1);
            });
            this.totalScoreRank.unshift({
              weixinAvatar: this.userInfo.weixinAvatar,
              userName: this.userInfo.userName,
              totalScore: res.data.returnObject.totalScore,
              index: res.data.returnObject.totalScoreIndexNo
            });
          }
        }).catch(err => {

        })
      }

    }
  }
</script>

<style lang="scss">
  .simpleModal.activity {
    .weui-dialog {
      // width: 100%;
      width: 347px;
    }
    .share-box {
      display: table-cell;
      height: 485px;
      vertical-align: middle;
      .border {
        width: 321px;
        height: 462px;
        background-color: #000;
        border: 2px solid #FFD020;
        margin: auto;
        .activity_title {
          background-origin: padding-box;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_activity_title.png) no-repeat;
          width: 277px;
          height: 56px;
          background-size: contain;
          margin: 0 auto;
          margin-top: 28px;
        }
        .activity_s {
          background-origin: padding-box;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_activity_s.png) no-repeat;
          width: 301px;
          height: 176px;
          background-size: contain;
          margin: 0 auto;
          margin-top: 13px;
        }
        .ac_close {
          background-origin: padding-box;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_ac_close.png) no-repeat;
          width: 26px;
          height: 26px;
          background-size: contain;
          position: absolute;
          right: 0px;
          top: 0px;
        }
        .check_b {
          background-origin: padding-box;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_check_b.png) no-repeat;
          width: 231px;
          height: 66px;
          background-size: contain;
          margin: 0 auto;
          margin-top: 14px;
          &.nocheck_b {
            background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_nocheck_b.png) no-repeat;
            width: 231px;
            height: 66px;
            background-size: contain;
            margin: 0 auto;
            margin-top: 14px;
          }
        }
      }
    }
  }
  .simpleModal.activityTrue {
    .weui-dialog {
      width: 347px;
    }
    .share-box {
      display: table-cell;
      height: 186+26+26px;
      vertical-align: middle;
      .border {
        width: 321px;
        height: 186+26px;
        background-color: #000;
        border: 2px solid #FFD020;
        margin: auto;
        .isjoin {
          background-origin: padding-box;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_isjoin.png) no-repeat;
          width: 275px;
          height: 121px;
          background-size: contain;
          margin: auto;
          margin-top: 38px;
        }
        .nojoin {
          background-origin: padding-box;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_nojoin.png) no-repeat;
          width: 190px;
          height: 110px;
          background-size: contain;
          margin: auto;
          margin-top: 38px;
        }
        .ac_close {
          background-origin: padding-box;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_ac_close.png) no-repeat;
          width: 26px;
          height: 26px;
          background-size: contain;
          position: absolute;
          right: 0px;
          top: 0px;
        }
      }
    }
  }
  #comp-result {
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
    .score-box {
      margin: 49px auto 13px;
      width: 276px;
      height: 86px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_border.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
      color: #FFDA01;
      .title {
        font-size: 11px;
        font-weight: 400;
        padding: 11px 0 0 13px;
      }
      .score {
        font-size: 50px;
        font-weight: 600;
        text-align: center;
        line-height: 50px;
      }
    }
    .text {
      text-align: center;
      font-size: 12px;
      color: #cccccc;
      margin-bottom: 50px;
    }
    .inviteFriends {
      margin: 0 auto 13px;
      width: 232px;
      height: 66px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_inviteFriends.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .toBack {
      margin: 0 auto 55px;
      width: 232px;
      height: 66px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/result_toBack.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
    }
    .totalScore {
      // border: 1px solid #666666;
      border-radius: 2px;
      width: 333px;
      margin: 0 auto;
      padding-bottom: 30px;
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
