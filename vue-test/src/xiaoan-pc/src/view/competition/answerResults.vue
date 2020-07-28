<template>
  <div id="answerResults" class="content">
    <div class="contentLeft">
      <div class="one"></div>
      <div class="choose">
        <span></span><span>答题积分</span><span></span>
      </div>
      <div class="border">
        <p>您本次得分：</p>
        <p>85</p>
      </div>
      <p class="shareInner">邀请好友来参加，增加答题机会还能赢大奖！</p>
      <div class="button-box">
        <el-button type="primary" size="mini">返回首页</el-button>
        <el-button type="primary" size="mini" @click="invite = true">邀请好友</el-button>
      </div>
    </div>
    <div class="contentRight">
      <comp-banner></comp-banner>
      <div class="integration">
        <div class="title">我的积分</div>
        <div class="textInner">
          <div><p>188</p><p>总积分</p></div>
          <div><p>60</p><p>答题积分</p></div>
          <div><p>125</p><p>邀请积分</p></div>
        </div>
      </div>
      <div class="signIn">
        <span>每日签到</span><span>+1</span><el-button type="primary" size="mini">签到</el-button>
      </div>
      <div class="call">
        <span>邀请董秘打call</span><span>+30</span><el-button type="primary" size="mini">邀请</el-button>
      </div>
      <div class="share">
        <span>邀请好友</span><span>+5</span><el-button type="primary" size="mini">邀请</el-button>
      </div>
    </div>
    <div class="contentBottom">
      <div class="ranking">
        <ul>
          <li>积分总榜</li>
          <li><span class="color">26</span><img src="" alt=""><span class="color">这是本人</span><span class="color">125</span></li>
          <li><span>1</span><img src="" alt=""><span>这是用户昵称</span><span>125</span></li>
          <li><span>2</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>3</span><img src="" alt=""><span>这是本人</span><span>100.5</span></li>
          <li><span>4</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>5</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>6</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>7</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>8</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>9</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>10</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
        </ul>
      </div>
      <div class="ranking">
        <ul>
          <li>答题得分榜</li>
          <li><span class="color">26</span><img src="" alt=""><span class="color">这是本人</span><span class="color">125</span></li>
          <li><span>1</span><img src="" alt=""><span>这是用户昵称</span><span>125</span></li>
          <li><span>2</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>3</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>4</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>5</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>6</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>7</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>8</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>9</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>10</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
        </ul>
      </div>
      <div class="ranking">
        <ul>
          <li>邀请好友积分榜</li>
          <li><span class="color">26</span><img src="" alt=""><span class="color">这是本人</span><span class="color">125</span></li>
          <li><span>1</span><img src="" alt=""><span>这是用户昵称</span><span>125</span></li>
          <li><span>2</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>3</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>4</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>5</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>6</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>7</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>8</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>9</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
          <li><span>10</span><img src="" alt=""><span>这是本人</span><span>125</span></li>
        </ul>
      </div>
      <div class="ranking">
        <ul>
          <li>我的邀请</li>
          <li><span><img src="/static/img/competition/call.png" alt=""></span><img src="" alt=""><span>这是本人</span><span class="color">已打call</span><span class="color">+30</span></li>
          <li><span>1</span><img src="" alt=""><span>这是用户昵称</span><span>已参与</span><span>+5</span></li>
          <li><span>2</span><img src="" alt=""><span>这是用户昵称</span><span>已参与</span><span>+5</span></li>
          <li><span>3</span><img src="" alt=""><span>这是用户昵称</span><span>已参与</span><span>+5</span></li>
          <li><span>4</span><img src="" alt=""><span>这是用户昵称</span><span>已参与</span><span>+5</span></li>
          <li><span>5</span><img src="" alt=""><span>这是用户昵称</span><span>已参与</span><span>+5</span></li>
          <li><span>6</span><img src="" alt=""><span>这是用户昵称</span><span>未参与</span><span>+5</span></li>
          <li><span>7</span><img src="" alt=""><span>这是用户昵称</span><span>未参与</span><span>+0</span></li>
          <li><span>8</span><img src="" alt=""><span>这是用户昵称</span><span>未参与</span><span>+0</span></li>
          <li><span>9</span><img src="" alt=""><span>这是用户昵称</span><span>未参与</span><span>+0</span></li>
          <li><span>10</span><img src="" alt=""><span>这是用户昵称</span><span>未参与</span><span>+0</span></li>
        </ul>
      </div>
    </div>
    <el-dialog :visible.sync="invite" :show-close="false" custom-class="answerDialg">
      <div class="title">邀请好友</div>
      <div class="close-button" @click="invite=false"><img src="/static/img/competition/close.png" alt=""></div>
      <div class="dialogInner">
        <div class="code"><img src="/static/image/business/test/qrcode.png" alt=""><p>微信扫一扫</p></div>
        <div class="line"></div>
        <div class="href">
          <p>链接地址</p>
          <div class="address">https://xiaoan.in-hope.cn/busines...</div>
          <el-button type="primary" size="medium">复制链接</el-button>
        </div>
      </div>
      <div class="inner">复制链接或扫描二维码邀请朋友</div>
    </el-dialog>
  </div>
</template>

<script>
  import CompBanner from './components/banner.vue'
  export default {
    name: "answerResults",
    data() {
      return {
        invite: false
      }
    },
    components: {
      CompBanner
    }
  }
</script>

<style lang="scss">
  #answerResults {
    .contentLeft {
      height: 513px;
      .one {
        width: 425px;
        height: 175px;
      }
      .choose {
        color: #FFFFFF;
        font-size: 16px;
        width: 183px;
        text-align: center;
        margin: 0 auto 9px;
        clear: both;
        height: 25px;
        span {
          display: block;
          float: left;
          width: 95px;
          font-weight:600;
        }
        span:first-child, span:last-child {
          height: 2px;
          background: #F7CE35;
          width: 44px;
          margin-top: 10px;
        }
      }
      .border  {
        width: 269px;
        height: 100px;
        margin: 30px auto 5px;
        background: url(/static/img/competition/border.png) no-repeat;
        background-size: contain;
        p:first-child {
          padding: 10px 0 0 12px;
          font-size:12px;
          font-weight:400;
          color:rgba(204,204,204,1);
        }
        p:last-child {
          text-align: center;
          font-size:49px;
          font-weight:600;
          color:rgba(255,204,0,1);
        }
      }
      .shareInner {
        text-align: center;
        font-size:12px;
        font-weight:400;
        color:rgba(204,204,204,1);
      }
      .button-box {
        text-align: center;
        height: 24px;
        margin-top: 31px;
        .el-button {
          width:146px;
          background:rgba(254,205,4,1);
          border-radius:4px;
          span {
            font-size:14px;
            font-weight:400;
            color:rgba(34,32,39,1);
          }
        }
      }
    }
    .contentRight {
      .banner {
        height: 164px;
        border:1px solid rgba(84,84,84,1);
        border-radius:4px;
        background: url(/static/img/competition/newbar.jpg) no-repeat;
        background-size: contain;
        margin-bottom: 16px;
      }
      .integration {
        height:148px;
        border:1px solid rgba(84,84,84,1);
        border-radius:4px;
        padding: 0 17px;
        margin-bottom: 16px;
        .title {
          height: 45px;
          line-height: 45px;
          text-align: left;
          font-size:14px;
          font-weight:600;
          color:rgba(255,255,255,1);
          border-bottom: 1px solid #545454;
        }
        .textInner {
          display: flex;
          height: 102px;
          justify-content: center;
          align-items: center;
          div {
            width: 87px;
            height: 22px;
            text-align: center;
            border-right: 1px solid rgba(84,84,84,1);
            p {
              position: relative;
              top: -5px;
            }
            p:first-child {
              font-size:16px;
              font-weight:600;
              color:rgba(255,255,255,1);
              margin-bottom: 3px;
            }
            p:last-child {
              font-size:12px;
              font-weight:400;
              color:rgba(141,141,141,1);
            }
          }
          div:last-child {
            border: none;
          }
        }
      }
      .signIn, .call, .share {
        height:46px;
        margin-bottom: 16px;
        border:1px solid rgba(84,84,84,1);
        border-radius:4px;
        padding: 0 17px;
        line-height: 46px;
        span {
          display: block;
          float: left;
        }
        span:first-child {
          text-align: left;
          width: 95px;
          font-size:14px;
          font-weight:600;
          color:rgba(255,255,255,1);
        }
        span:nth-child(2) {
          font-size:14px;
          width: 85px;
          font-weight:600;
          text-align: center;
          color:rgba(254,205,4,1);
        }
        .el-button {
          float: right;
          width:72px;
          height: 24px;
          margin-top: 10px;
          background:rgba(254,205,4,1);
          border-radius:4px;
          position: relative;
          span {
            display: inline-block;
            position: absolute;
            left: 0;
            top: 0;
            height: 24px;
            width: 72px;
            line-height: 24px;
            text-align: center;
            font-size:14px;
            font-weight:400;
            color:rgba(34,32,39,1);
          }
        }
      }
    }
    .contentBottom {
      clear: both;
      display: flex;
      justify-content: space-between;
      height: 465px;
      margin-bottom: 50px;
      .ranking {
        width:286px;
        height:465px;
        border:1px solid rgba(84,84,84,1);
        border-radius:4px;
        padding: 0 14px;
        li:first-child {
          height: 45px;
          line-height: 45px;
          text-align: left;
          font-size:14px;
          font-weight:bold;
          color:rgba(255,255,255,1);
        }
        li {
          border-bottom: 1px solid #545454;
          height: 34px;
          span {
            font-size:12px;
            float: left;
            display: block;
            height: 34px;
            line-height: 34px;
            text-align: center;
            font-weight:bold;
            color:rgba(255,255,255,1);
          }
          span:first-child {
            width: 20px;
            img {
              width: 16px;
              height: 15px;
              margin-top: 9px;
            }
          }
          img {
            float: left;
            width: 32px;
            height: 32px;
            margin: 1px 17px 0 0;
          }
          span:last-child{
            float: right;
          }
        }
        .color {
          color:rgba(254,205,4,1);
        }
      }
      .ranking:last-child {
        li {
          span:nth-of-type(2) {
            width: 80px;
            text-align: left;
          }
          span:nth-of-type(3) {
            width: 60px;
            text-align: center;
          }
        }
      }
    }
    .answerDialg {
      width: 695px;
      height: 412px;
      background: url(/static/img/competition/slice.png) no-repeat;
      background-size: 100% 100%;
      padding: 0 54px;
      .close-button {
        position: absolute;
        top: 35px;
        right: 34px;
        img {
          width: 33px;
          height: 33px;
        }
      }
      .el-dialog__body {
        padding-top: 10px;
        .title {
          height: 45px;
          border-bottom: 1px solid rgba(84,84,84,1);
          text-align: center;
          line-height: 45px;
          font-size:16px;
          font-weight:600;
          color:rgba(255,201,1,1);
        }
      }
      .dialogInner {
        height: 230px;
        .code {
          float: left;
          text-align: center;
          margin-top: 30px;
          p {
            font-size:14px;
            font-weight:400;
            color:rgba(255,255,255,1);
          }
          img {
            width: 156px;
            height: 156px;
            border: none;
          }
        }
        .line {
          float: left;
          margin: 55px 30px 0;
          width:1px;
          height:109px;
          background:rgba(84,84,84,1);
        }
        .href {
          float: left;
          margin-top: 35px;
          margin-left: 10px;
          p {
            font-size:16px;
            font-weight:400;
            color:rgba(255,255,255,1);
          }
          .address {
            width: 280px;
            margin-top: 17px;
            height:32px;
            border:1px solid rgba(141,141,141,1);
            font-size:14px;
            font-weight:400;
            text-align: center;
            line-height: 32px;
            color:rgba(255,255,255,1);
          }
          .el-button {
            margin-top: 55px;
            width: 164px;
            height: 35px;
            background:rgba(251,203,5,1);
            border-radius:4px;
            span {
              font-size:16px;
              font-weight:400;
              color:rgba(50,50,50,1);
            }
          }
        }
      }
      .inner {
        text-align: center;
        width: 100%;
        font-size:14px;
        font-weight:400;
        color:rgba(141,141,141,1);
      }
    }
  }
</style>
