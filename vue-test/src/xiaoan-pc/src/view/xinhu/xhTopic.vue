<template>
  <div id="xhTopic" class="content">
    <div class="top-content">
      <el-row type="flex" align="middle">
        <el-col :span="18">
          <el-row type="flex" align="middle">
            <el-col :span="4" style="width:120px;align-self: flex-start;">
              <img class="topicImage" :src="topicDetailData.topicImage">
            </el-col>
            <el-col :span="20">
              <div class="topicName">{{topicDetailData.topicName}}</div>
              <div class="topicDescription hiddenLine3" v-show="!showMore">
                {{topicDetailData.topicDescription}}
                <span v-show="showMoreText" class="showMoreText" @click="showMore=true">...查看更多</span>
              </div>
              <div class="topicDescription" :class="{showline3: !showMore}">
                {{topicDetailData.topicDescription}}
                <div class="hiddenMore" @click="showMore=false">收起</div>
              </div>
            </el-col>
          </el-row>

          <el-row class="btn-content">
            <el-col :span="12">
              <div class="btn-write" @click="questionOpen">
                <img class="btnIcon" :src="$image.xinhu.edittopic"> 提问
              </div>
            </el-col>
            <el-col :span="12">
              <div v-show="!topicDetailData.attention" class="btn-attention" @click="addAttention">
                <img class="btnIcon" :src="$image.xinhu.add">关注话题
              </div>
              <div v-show="topicDetailData.attention" class="btn-attention-cancel" @click="unfollow">已关注</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="6">
          <div class="attention-content">
            <div class="count">
              关注<span>{{topicDetailData.attentionCount}}</span>
              问题<span>{{topicDetailData.relatedQuestionCount}}</span>
            </div>
            <div class="headerImg">
              <img v-for="(item,index) in attentionUserList" :src="item.weixinAvatar" :key="index" class="headerImg"
                   v-if="item.weixinAvatar">
              <span v-show="attentionUserList.length>5">...</span>
            </div>
            <div class="userName" v-if="attentionUserList.length>0">
              <template v-for="(item,index) in attentionUserList">
                {{item.userName}}
              </template>
              <span v-show="attentionUserList.length>2">...</span>
              也关注了该话题
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!---->
    <el-row :gutter="20" class="mtop20">
      <el-col :span="18">
        <div class="xhTopicLeftTitlte">
          <li @click="xhTopicTitlte(index)" :class="{'xhTopicTitlte': item.showSelected}"
              v-for="(item,index) in xhTopicLeftTitlteData" :key="index">{{item.title}}
          </li>
        </div>
        <xhLaste ref="xhLaste" v-show="showContent" :topicId="this.topicId" v-if="this.topicId"></xhLaste>
        <xhAnswer ref="xhAnswer" v-show="!showContent" :topicId="this.topicId" v-if="this.topicId"></xhAnswer>
      </el-col>
      <el-col :span="6">
        <v-hotTopic></v-hotTopic>
        <v-ramdomv></v-ramdomv>
      </el-col>
    </el-row>
    <v-xhQuestion :isShow="showQuestion" @questionClose="questionClose" v-if="showQuestion"></v-xhQuestion>
  </div>
</template>

<script>
  import hotTopic from './components/hotTopic.vue'
  import ramdomv from './components/ramdomV.vue'
  import xhLaste from "./components/xhLatest"
  import xhAnswer from "./components/xhAnswer"
  import xhQuestion from "./components/xhQuestion"
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    name: "xh-topic",
    data() {
      return {
        showQuestion: false,
        userId: '',
        HotSearchWords: [],
        showFllowD: true,
        //  话题详情
        topicId: '',
        topicDetailData: [],
        //  话题标题列表
        xhTopicLeftTitlteData: [{
          'title': '最新提问',
          showSelected: true
        }, {
          'title': '精选回答',
          showSelected: ''
        }],
        showMore: false,
        showMoreText: false,
        showContent: true,
        attentionUserList: []
      }
    },
    components: {
      ElCol,
      ElRow,
      xhLaste: xhLaste,
      xhAnswer: xhAnswer,
      'v-hotTopic': hotTopic,
      'v-ramdomv': ramdomv,
      'v-xhQuestion': xhQuestion
    },
    watch: {
      '$route': function (val) {
        this.topicId = this.$route.query.topicId
        location.href = location.href
      }
    },
    created() {
      this.userId = this.$cookie.get('userId')
      this.topicId = this.$route.query.topicId
      this.getTopicDetail()
      this.getTopicAttentionUser()
    },
    methods: {
      // 提问关闭隐藏
      questionOpen() {
        this.showQuestion = true
      },
      questionClose() {
        this.showQuestion = false
      },
      xhToPersonal() {
        this.$router.push({path: '/xhMy', query: {'otherUserId': this.$api.xinhuUserId}})
      },

      xhProblemVFollow() {
        this.showFllowD = !this.showFllowD
      },

      // 获取话题详情
      getTopicDetail() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getTopicDetails,
          params: {
            topicId: this.topicId,
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          console.log('话题详情', res)
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.topicDetailData = res.data.returnObject

            this.$nextTick(() => {
              // alert(document.querySelector('.showline3').clientHeight)
              let descHeight = document.querySelector('.showline3').scrollHeight
              // alert(descHeight)
              if (descHeight > 85) {
                this.showMoreText = true
              } else {
                this.showMoreText = false
              }
            })
          }
        })
      },
      // 获取问题关注者列表
      getTopicAttentionUser() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.getTopicAttentionUser,
          params: {
            userId: this.userId,
            topicId: this.topicId
          }
        }).then((res) => {
          if (res.data.returnCode == 200 && res.data.returnObject) {
            this.attentionUserList = res.data.returnObject
          }
        })
      },
      // 切换标题
      xhTopicTitlte(index) {
        for (let i = 0; i < this.xhTopicLeftTitlteData.length; i++) {
          this.xhTopicLeftTitlteData[i].showSelected = false
        }
        this.xhTopicLeftTitlteData[index].showSelected = true
        if (index == 0) {
          this.showContent = true
          // this.getLasteData()
        } else {
          // this.getListShitAnswer()
          this.showContent = false
        }
      },
      // 取消关注
      unfollow(item, index) {
        this.$confirm('确定要取消关注吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$api.xinhu.unFollow,
            method: 'DELETE',
            params: {
              userId: this.userId,
              concernedId: this.topicId,
              attentionType: 0
            }
          }).then((res) => {
            if (res.data.returnCode == 200) {
              this.topicDetailData.attention = false
              this.topicDetailData.attentionCount = this.topicDetailData.attentionCount - 1
              this.getTopicAttentionUser()
            }
          })
        }).catch(() => {
        })
      },
      addAttention() {
        this.$http({
          method: 'POST',
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_TOPIC',
            concernedId: this.topicDetailData.topicId,
            concernedTitle: this.topicDetailData.topicName,
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.$message({showClose: true, type: 'success', duration: 3000, message: '关注成功'})
            this.topicDetailData.attention = true
            this.topicDetailData.attentionCount = this.topicDetailData.attentionCount + 1
            this.getTopicAttentionUser()
          } else {
            this.$message({showClose: true, type: 'success', duration: 3000, message: res.data.returnMsg})
          }
        }).catch((err) => {

        })
      }
    }

  }
</script>
<style lang="scss">
  @mixin btn {
    height: 35px;
    line-height: 35px;
    border-radius: 5px;
    font-size: 17px;
    text-align: center;
    cursor: pointer;
  }
  #xhTopic {
    padding-top: 20px;
    .top-content {
      width: 1200px;
      min-height: 200px;
      border-radius: 5px;
      border: 1px solid #e3e3e3;
      background-color: #fff;
      padding-bottom: 20px;
      .topicImage {
        width: 100px;
        height: 100px;
        border-radius: 5px;
        margin: 12px;
      }
      .question-topic {
        min-height: 84px;
      }
      .topicList {
        padding: 12px 12px 0 12px;
        span {
          display: inline-block;
          margin-right: 10px;
          border-radius: 12px;
          padding: 3px 8px;
          font-size: 16px;
          color: #ffb148;
          background-color: #ffefda;
        }
      }
      .topicName {
        font-size: 20px;
        color: #323232;
        padding: 12px 12px 0 12px;
      }
      .topicDescription {
        font-size: 14px;
        color: #8d8d8d;
        margin: 12px;
        position: relative;
        .showMoreText {
          display: inline-block;
          position: absolute;
          bottom: -2px;
          right: 6px;
          color: #ffb148;
          background-color: #fff;
        }
        .hiddenMore {
          color: #ffb148;
          text-align: right;
        }
      }
      .showline3 {
        height: 1px;
        overflow: hidden;
      }
      .btn-content {
        border-top: 1px solid #e3e3e3;
        width: 100%;
        padding: 12px 0 0 12px;
        .btn-write {
          @include btn;
          width: 100px;
          background-color: #ffb148;
          color: #fff;
          img {
            position: relative;
            top: 3px;
          }
        }
        .btn-attention {
          @include btn;
          width: 110px;
          border: 1px solid #ffb148;
          color: #ffb148;
          float: right;
        }
        .btn-attention-cancel {
          @include btn;
          width: 90px;
          border: 0;
          color: #8d8d8d;
          background-color: #f0f2f5;
          float: right;
        }
      }
      .attention-content {
        margin: 20px 0 0 10px;
        padding: 0 10px;
        width: 100%;
        height: 150px;
        border-left: 1px solid #e3e3e3;
        .count {
          font-size: 17px;
          color: #8d8d8d;
          span {
            display: inline-block;
            margin-left: 5px;
            font-size: 20px;
          }
        }
        .headerImg {
          margin: 8px 0;
          img {
            width: 35px;
            height: 35px;
            margin-left: -8px;
            border-radius: 50%;
            &:first-child {
              margin-left: 0;
            }
          }
        }
        .userName {
          font-size: 12px;
          color: #aeaeae;
        }
      }
    }
    .xhTopicTop {
      width: 100%;
      padding: 14px 16px;
      border: 1px solid #e3e3e3;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      margin-top: 20px;
      .xhTopicTopContent {
        width: 100%;
        padding: 5px;
        height: 125px;
        border-bottom: 1px solid #cccccc;
        .xhTopicTopHead {
          width: 104px;
          height: 104px;
          border: 1px solid #cccccc;
          border-radius: 5px;
          float: left;
          img {
            width: 104px;
            height: 104px;
          }
        }
        .xhTopicTopTitle {
          float: left;
          width: 787px;
          margin-left: 30px;
          .xhTopicTopBar {
            margin: 6px 0 15px 0;
            font-size: 20px;
            color: #333333;
          }
        }
        .xhTopicTopRight {
          float: right;
          width: 208px;
          padding: 0 0 0 23px;
          border-left: 1px solid #cccccc;
          .xhTopicTopRightFollow {
            margin-bottom: 17px;
            > p {
              color: #999999;
              font-size: 16px;
              display: inline-block;
              margin-right: 20px;
            }
          }
          .xhTopicTopRightPic {
            height: 34px;
          }
        }
      }
      .xhTopicTopCount {
        width: 79%;
        margin-top: 11px;
        position: relative;
        > span {
          display: inline-block;
          width: 110px;
          height: 35px;
          color: #ff9933;
          line-height: 35px;
          padding: 0 0 0 52px;
          border: 1px solid #ff9933;
          border-radius: 3px;
          img {
            width: 19px;
            height: 19px;
            margin-right: 10px;
            float: left;
            position: absolute;
            top: 8px;
            left: 22px;
          }
          &:active {
            background: #ff9933;
            border: none;
            color: #ffffff;
          }
        }
        > a {
          border-radius: 3px;
          width: 110px;
          height: 35px;
          color: #ff9933;
          text-align: center;
          line-height: 35px;
          border: 1px solid #ff9933;
          float: right;
          &:active {
            background: #ff9933;
            border: none;
            color: #ffffff;
          }
        }
      }
    }
    .xhTopicLeftTitlte {
      width: 100%;
      padding: 10px;
      height: 50px;
      padding: 0 16px;
      line-height: 50px;
      border: 1px solid #e3e3e3;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      background-color: #fff;
      margin-bottom: 15px;
      li {
        float: left;
        height: 100%;
        margin-right: 117px;
        &:hover {
          color: #ff9933;
        }
      }
      .xhTopicTitlte {
        color: #ff9933;
        border-bottom: 2px solid #ff9933;
      }
    }

  }
  .xhlist-pagination {
    width: 100%;
    margin: 0 0 20px 0;
    text-align: center;
    .el-pagination.is-background .el-pager li:not(.disabled).active {
      background-color: #ffb148;
    }
    .el-pagination.is-background .btn-prev, .el-pagination.is-background .btn-next, .el-pagination.is-background .el-pager li {
      background-color: white;
    }
  }
</style>
