<template>
  <div id="banner-image">
      <el-dialog :visible.sync="event" :show-close="false" custom-class="bannerDialg" width="695px">
        <div class="dialogImage"></div>
        <div class="bannerInner">线下赛奖励</div>
        <div class="compare">区预赛-决赛</div>
        <ul>
            <li style="width:150px"><span></span>冠军奖金-<span>5<i style="font-size:16px">万元</i></span></li>
            <li style="width:180px"><span></span>决赛入围选手-<span>1<i style="font-size:16px">万元 /人</i></span></li>
        </ul>
        <div class="banner-button">
            <el-button type="primary" plain size="medium" @click="setJoinOffLine(false)">我不参加</el-button>
            <el-button type="primary" size="medium" @click="setJoinOffLine(true)">我要参加</el-button>
        </div>

        </el-dialog>
        <el-dialog :visible.sync="inviteDialog" :show-close="false" custom-class="inviteDialog" width="695px">
        <div class="dialogImage"></div>
        <div class="bannerInner">谢谢你</div>
        <div class="compare">期待和您线下见面！后续安排我们将及时通知您。<br/></div>
        <div class="button"><el-button type="primary" @click="inviteDialog=false;event=false" size="medium">关闭</el-button></div>
        </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      event: false,
      inviteDialog: false
    };
  },
  props: ['show', 'isClick'],
  created() {
    // if (JSON.parse(sessionStorage.getItem('socreTotal')) == 1 || this.isClick) {
    //   this.event = this.show;
    // } else {
    //   this.checkJoinOffLineSet();
    // }
    this.checkJoinOffLineSet();
    // sessionStorage.removeItem('socreTotal');
  },
  watch: {
    'event': function() {
      this.$emit('getShow', this.event)
    }
  },
  mounted() {},
  methods: {
    checkJoinOffLineSet() {
      let params = {
        userId: this.$cookie.get('userId')
      }
      this.$axios.mobApi.checkJoinOffLineSet(params).then((res) => {
        if (res.data.returnCode == 200) {
          if (!res.data.returnObject) {
            this.event = true;
          }
        }
      })
    },
    setJoinOffLine(type) {
      type ? this.inviteDialog = true : this.event = false;
      let params = {
        userId: this.$cookie.get('userId'),
        joinOffLine: type
      }
      this.$axios.mobApi.setJoinOffLine(params).then((res) => {
        if (!type) {
          this.$message({showClose: true, message: '谢谢您！我们已收到您的回复...', type: 'error'});
        }
      })
    }
  }
}
</script>
<style lang='scss'>
  #banner-image {
    height: 164px;
    margin-bottom: 16px;
    .comp-banner {
      height: 164px;
      border:1px solid rgba(84,84,84,1);
      border-radius:4px;
      background: url(/static/img/competition/lastbar.jpg) no-repeat;
      background-size: contain;
    }
    .bannerDialg {
      padding: 0;
      height: 529px;
      width: 695px;
      background: url(/static/img/competition/slice.png) no-repeat;
      background-size: 100% 100%;
      .dialogImage {
        width: 463px;
        height: 190px;
        margin: 0 auto;
        background: url(/static/img/competition/xinbei.png) no-repeat;
        background-size: contain;
      }
      .bannerInner {
        margin-top: 30px;
        text-align: center;
        font-size:20px;
        font-weight:600;
        color:rgba(255,255,255,1);
      }
      .compare {
        text-align: center;
        font-size:12px;
        font-weight:400;
        color:rgba(227,227,227,1);
      }
      ul {
        width: 340px;
        margin: 19px auto 19px;
        height: 50px;
        li {
          float: left;
          font-size: 16px;
          color: #FFFFFF;
          width: 170px;
          span:first-child {
            display: inline-block;
            background: #FFCC02;
            height: 5px;
            width: 5px;
            border-radius: 5px;
            margin-right: 5px;
          }
          span:last-child {
            font-size: 20px;
            color: #FFCC02;
          }
        }
      }
      .banner-button {
        text-align: center;
        .el-button {
          width: 164px;
          background:rgba(251,203,5,1);
          span {
            font-size:16px;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
        }
        .el-button:first-child {
          background: none;
          span {
            color: #ffffff;
          }
        }
      }
    }
    .inviteDialog {
      padding: 0;
      height: 529px;
      width: 695px;
      background: url(/static/img/competition/slice.png) no-repeat;
      background-size: 100% 100%;
      .dialogImage {
        width: 463px;
        height: 190px;
        margin: 0 auto;
        background: url(/static/img/competition/xinbei.png) no-repeat;
        background-size: contain;
      }
      .bannerInner {
        font-size:34px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        text-align: center;
        color:rgba(255,201,1,1);
        margin: 30px 0 12px;
      }
      .compare {
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(255,255,255,1);
        text-align: center;
        line-height: 25px;
      }
      .button {
        margin-top: 40px;
        text-align: center;
        .el-button {
          margin: 0 auto;
          width: 164px;
          background:rgba(251,203,5,1);
          span {
            font-size:16px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
        }
      }

    }
  }
</style>