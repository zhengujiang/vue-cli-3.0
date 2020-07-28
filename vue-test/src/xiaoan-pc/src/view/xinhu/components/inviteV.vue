<template>
  <el-card id="inviteV" class="box-card" shadow="never">
    <div slot="header" class="header">
      <div>
        <span class="fleft">你可以邀请以下用户来获得回答！</span>
      </div>
    </div>
    <div class="listBox" v-for="(item,index) in vInfo">
      <div class="item">
        <div class="headerImg">
          <img class="headerImg" :src="item.weixinAvatar" @click="link(item.id)" v-if="item.weixinAvatar">
          <img class="headerImg" :src="$image.xinhu.headerImg" v-else @click="link(item.id)">
        </div>
        <div class="info" @click="link(item.id)">
          <div class="name">{{item.userName}}</div>
          <div class="intro">{{item.synopsis}}</div>
        </div>
        <!---->
        <div class="attentBtn" v-show="!item.invited" @click="inviteForQuestion(item.id)">
          <img :src="$image.xinhu.add">邀请
        </div>
        <div class="attentYetBtn" v-show="item.invited">已邀请
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        userId: '',
        vInfo: []
      }
    },
    props: {
      questionId: String
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getRandomV()

    },
    mounted() {
      // this.unfollow()
    },
    // 方法
    methods: {
      link(id) {
        this.$router.push({path: '/xhMy', query: {selectUserId: id}});
      },
      // 获取大v信息
      getRandomV() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getRandomV,
          params: {
            vNumber: 5,
            questionId: this.questionId,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.vInfo = res.data.returnObject
            /* this.vInfo.forEach((item, index) => {
              item.isv = false
            }) */
          }
        })
      },
      // 邀请大V
      inviteForQuestion(id) {
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.inviteForQuestion,
          params: {
            questionId: this.questionId,
            invitedUserId: id,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '邀请成功'})
            this.vInfo.forEach((item, index) => {
              if (item.id == id) {
                item.invited = true
              }
            })
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '邀请失败，请重试'})
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #inviteV {
    width: 100%;
    height: 450px;
    padding: 0 12px 12px 12px;
    margin-bottom: 20px;
    .pointer {
      cursor: pointer;
    }
    .el-card__header {
      padding: 0;
    }
    .el-card__body {
      padding: 0;
      padding-top: 12px;
    }
    .header {
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .titleImg {
        width: 23px;
      }
      div {
        display: flex;
        align-items: center;
      }
      .fleft {
        display: inline-block;
        margin-left: 5px;
      }
      .fright {
        display: inline-block;
        margin-right: 5px;
        font-size: 14px;
        color: #8d8d8d;
      }
    }
    .listBox {
      padding: 10px 0;
      border-bottom: 1px solid #e3e3e3;
      .item {
        display: flex;
        align-items: center;
        height: 50px;
        .info {
          padding-left: 6px;
          width: 86%;
          .name {
            width: 172px;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #323232;
            font-size: 14px;
          }
          .intro {
            padding-top: 5px;
            width: 172px;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #aeaeae;
            font-size: 12px;
          }
        }
        .headerImg {
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .attent {
          /*width:71px;*/
          /*height: 30px;*/
        }
        .attentBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffb148;
          border: 1px solid #ffb148;
          border-radius: 5px;
          width: 70px;
          height: 30px;
          font-size: 14px;
          cursor: pointer;
          img {
            margin-right: 5px;
          }
        }
        .attentYetBtn {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #f0f1f5;
          color: #8d8d8d;
          border-radius: 5px;
          width: 70px;
          height: 30px;
          font-size: 14px;
          font-weight: 300;
          /*cursor: pointer;*/
        }
      }
    }
  }
</style>
