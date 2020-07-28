<template>
  <div id="contentBox">
    <div id="profile-header">
      <div class="bg-img vxa-image-bg-affiche"></div>
      <div class="content">
        <div style="width: 100%;position: relative">
          <div class="avatar">
            <img v-if="userInfo.weixinAvatar" :src="userInfo.weixinAvatar">
            <img v-else src="https://oss.in-hope.cn/xiaoan/h5_static/personal/timg@2x.png" alt="">
          </div>
          <div class="info">
            <div class="info-top">
              <h4>{{userInfo.userName}} <span>| {{userInfo.synopsis?userInfo.synopsis:'乎者什么也没留下'}}</span></h4>
              <div class="right-label"><em>{{attentionCount}}</em>／我关注的人</div>
              <div class="right-label"><em>{{attentionedCount}}</em>／关注我的人</div>
            </div>
            <div class="info-bottom">
              <div class="info-left">
                <div class="privilege vxa-image-user-bg-person" v-if="!userInfo.enterpriseUser"></div>
                <div class="privilege vxa-image-bg-enterprise" v-if="userInfo.enterpriseUser"></div>
                <el-button type="text" class="pay-btn" v-if="!userInfo.enterpriseUser" @click="apply">立即试用企业版 &gt;
                </el-button>
              </div>
              <div class="info-right">
                <el-button size="mini" type="primary" @click="goEdit">编辑个人资料</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!---->
    <div class="content">
      <div class="nav">
        <el-row>
          <el-col v-for="(values, index) in tabs" class="item" :key="index" :class="{act:navIndex == index}"
                  @click.native="linkto(values.to)" :style="{'width':100/tabs.length+'%','flex':1}">
            {{values.item}}
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="mainbox content">
      <slot name="slotMain"></slot>
      <div style="clear:both"></div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        // userInfo: {},
        attentionCount: 0,
        attentionedCount: 0,
        tabs: [
          {item: '我的创作', to: '/works'},
          {item: '我的关注', to: '/follow'},
          {item: '我的收藏', to: '/favorite'},
          {item: '我的分享', to: '/share'},
          {item: '账号管理', to: '/manage'}
        ]
      }
    },
    props: {
      navIndex: {
        required: true
      }
    },
    watch: {
      navIndex: function (val) {
        console.log('navIndex', val);
      }
    },
    created() {
      if (this.$cookie.get('userId')) {
        // this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
        this.getAttentionUsers();
      }
    },
    computed: {
      userInfo: function () {
        return this.$store.state.userData
      }
    },
    methods: {
      getAttentionUsers() {
        this.$http({
          method: "GET",
          url: this.$api.xinhu.searchAttentionUser,
          params: {
            selectType: 0,
            userId: this.$cookie.get('userId'),
            pageNum: 1,
            pageSize: 9999
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.attentionCount = res.data.returnObject.length;
          }
        }).catch(err => {
        });
        this.$http({
          method: "GET",
          url: this.$api.xinhu.searchAttentionUser,
          params: {
            selectType: 1,
            userId: this.$cookie.get('userId'),
            pageNum: 1,
            pageSize: 9999
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.attentionedCount = res.data.returnObject.length;
          }
        }).catch(err => {
        });
      },
      linkto: function (url) {
        this.$router.push(url)
      },
      goEdit() {
        this.$router.push({path: '/manage/person'})
      },
      apply() {
        if (this.userInfo.applyEnterprise) {
          this.$message({
            type: 'warning',
            message: '已提交申请，请等候通知',
            showClose: true
          })
        } else {
          this.$router.push('/manage/purchaseApplication')
        }
      }
    },
    beforeCreate() {
      this.$auth.checkAuth(this)
    }
  }
</script>
<style lang="scss" scoped>
  #profile-header {
    background-color: #f6f6f6;
    height: 150px;
    position: relative;
    .bg-img {
      width: 100%;
      height: 85px;
    }
    .info {
      position: absolute;
      left: 0;
      bottom: -50px;
      padding-left: 120px;
      width: 100%;
      height: 100px;
      .info-top {
        display: flex;
        height: 50px;
        padding-bottom: 10px;
        align-items: flex-end;
        h4 {
          font-size: 20px;
          font-weight: 600;
        }
      }
      .info-bottom {
        padding: 10px 0;
        display: flex;
        align-items: flex-end;
        .info-left {
          display: flex;
          flex: 1;
          a {
            display: flex;
            align-items: flex-end;
          }
        }
        .pay-btn {
          padding: 0;
          margin: 0 0 4px 10px;
          border-bottom: solid 1px;
        }
      }
      .privilege {
        width: 96px;
        height: 29px;
        margin-right: 10px;
      }
      .right-label {
        font-size: 12px;
        padding-left: 40px;
        color: #8d8d8d;
        em {
          font-weight: 600;
          font-size: 16px;
        }
      }
      h4 {
        line-height: 1;
        font-size: 17px;
        margin: 0;
        flex: 1;
        span {
          color: #8d8d8d;
          font-size: 14px;
        }
      }
    }
    .avatar {
      position: absolute;
      bottom: -50px;
      left: 0;
      width: 100px;
      height: 100px;
      border: solid 2px #f3c27b;
      border-radius: 50%;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
  #contentBox {
    min-height: 500px;
    background-color: #f6f6f6;
    .nav {
      height: 50px;
      background-color: #fff;
      border: 1px solid #e3e3e3;
      border-radius: 2px;
      .item {
        /*width: 16%;*/
        position: relative;
        text-align: center;
        height: 50px;
        line-height: 50px;
        cursor: pointer;
        font-size: 16px;
        color: #323232;
        &:before {
          content: '';
          height: 20px;
          width: 1px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
          background-color: #e3e3e3;
        }
        &:last-child:before {
          background-color: rgba(255, 255, 255, 0);
        }
      }
      .act {
        color: #ffb148;
        font-weight: bold;
        &:after {
          content: '';
          height: 3px;
          width: 70px;
          position: absolute;
          bottom: 1px;
          left: 50%;
          margin-left: -35px;
          background-color: #ffb148;
        }
      }
    }
    .mainbox {
      margin-top: 15px;
      .left {
        float: left;
        width: 245px;
        min-height: 490px;
        margin-bottom: 20px;
        background-color: #fff;
        border: 1px solid #e3e3e3;
        border-radius: 2px;
        .item {
          height: 50px;
          line-height: 50px;
          text-align: left;
          padding-left: 70px;
          cursor: pointer;
          border-bottom: solid 1px #e3e3e3;
          .itemText {
            display: inline-block;
            margin-left: 5px;
          }
          img {
            position: relative;
            top: 2px;
          }
        }
        .act {
          color: #ffb148;
          background-color: #fff3e4;
        }
      }
      .right {
        float: right;
        width: 940px;
        min-height: 600px;
        margin-bottom: 20px;
        background-color: #fff;
        padding: 20px 15px;
        border: 1px solid #e3e3e3;
        .space {
          padding-right: 10px;
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
          color: rgba(255, 255, 255, 0)
        }
        .subBtn {
          width: 240px;
          height: 40px;
        }
      }
    }
  }
</style>
