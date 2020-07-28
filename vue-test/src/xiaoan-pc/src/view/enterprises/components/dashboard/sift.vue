<template>
  <el-tabs v-model="tabValue" @tab-click="handleClick" class="dashboard-jinxuan">
    <el-tab-pane name="1">
      <span slot="label" class="eltab">信乎精选<div class="splitTab">|</div></span>
      <div class="tabContent">
        <div class="listBox_small" v-for="(item,index) in xhSiftList">
          <div class="title" @click="goAnswerDetaile('xhAnswerDetail',item.questionId,item.answerId)"
               v-if="item.answerId">{{item.questionTitle}}
          </div>
          <div class="title" @click="goQuestionDetaile('xhQuestionDetail',item.questionId)" v-else="item.answerId">
            {{item.questionTitle}}
          </div>
          <div class="attribute">
            <span v-if="item.answerCount > 0">{{item.answerCount}}个回答 |</span>
            <span v-if="item.approveCount > 0">{{item.approveCount}}个赞同 |</span>
            <span v-if="item.attentionCount > 0">{{item.attentionCount}}个关注 |</span>
            <span>{{item.updateTime.split(' ')[0]}}</span>
          </div>
        </div>
        <el-button class="el-buttom-more" type="text" @click="goLink('/xhList?item=1')">查看更多</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane name="2">
      <span slot="label" class="eltab">信公精选<div class="splitTab">|</div></span>
      <div class="tabContent">
        <div class="listBox_small" v-for="(item,index) in advertList" v-if="index<6">
          <div class="title" @click="goUrl(item.advertUrl)">{{item.advertTitle}}</div>
          <div class="attribute">
            <span>{{$common.transTime(item.createTime)[0]}} |</span>
            <span>{{item.advertType}}</span>
          </div>
        </div>
        <el-button class="el-buttom-more" type="text" @click="link('/business/swift#0')">查看更多</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane name="3">
      <span slot="label" class="eltab">团队收藏</span>
      <div class="tabContent">
        <div class="listBox_small" v-for="(item,index) in shareContent" v-if="index<6">
          <div class="title" @click="linkContent(item.id)">{{item.favouriteName}}</div>
          <div class="attribute">
            <span>{{item.createTime}}</span>
            <!--<span>{{item.advertType}}</span>-->
          </div>
        </div>
        <el-button class="el-buttom-more" type="text"
                   @click="link('/collect/collectDetails?id='+ shareContent[0].id+'&type=team')">查看更多
        </el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        tabValue: '1',
        xhSiftList: [],
        advertList: [],
        userInfo: '',
        shareContent: []
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
      this.initData();
    },
    mounted() {
    },
    // 方法
    methods: {
      initData() {
        this.xinhuSift()
        this.getAdvertByType();
        this.getMyDefaultShare()
      },
      handleClick() {

      },
      linkContent(id) {
        this.$common.openWindow('/collect/collectDetails?id=' + id + '&type=team')
        // this.$router.push({path: '', query: {id: id, type: 'team'}});
      },
      getMyDefaultShare() {
        this.$http({
          method: 'GET',
          url: this.$api.teamFavourite.getTeamDefault,
          params: {
            companyId: this.userInfo.companyId
          }
        }).then((res) => {
          // console.log('res', res)
          if (res.data.returnCode == 1) {
            this.shareContent = []
            var content = res.data.returnObject
            content.createTime = this.$common.transTime(content.createTime)[1]
            this.shareContent[0] = content

            this.getMyShare()
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //
      getMyShare() {
        this.$http({
          method: 'GET',
          url: this.$api.teamFavourite.getFavourite,
          params: {
            companyId: this.userInfo.companyId,
            pageSize: 6,
            pageIndex: 1
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              let list = res.data.returnObject.list;
              list.forEach((item) => {
                item.createTime = this.$common.transTime(item.createTime)[1]
              })
              this.shareContent = this.shareContent.concat(list);
            }
          }
        })
      },
      link(link) {
        this.$common.openWindow(link)
      },
      xinhuSift() {
        this.$http({
          method: 'GET',
          url: this.$api.xinhu.listSiftAnswer,
          params: {
            topicId: '',
            pageNum: 1,
            pageSize: 6
          }
        }).then((res) => {
          this.loading = false
          console.log("信乎精选", res.data.returnObject.list)
          if (res.data.returnCode === 200 && res.data.returnObject.list) {
            this.xhSiftList = res.data.returnObject.list
          } else {
            this.xhSiftList = []
          }
        }).catch((err) => {
          this.xhSiftList = []
        })
      },
      getAdvertByType() {
        this.$http({
          method: 'GET',
          url: this.$api.advert.getAdvertByType,
          params: {
            page: 1,
            type: '信公干货'
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode === 1) {
            this.advertList = res.data.returnObject.list
          }
        }).catch((err) => {
          this.advertList = []
        })
      },
      // go  link
      goLink(path) {
        this.$router.push(path)
      },
      // go  link
      goUrl(url) {
        this.$common.openWindow(url)
      },
      goDetaile(path, id) {
        this.$router.push({path: path, query: {id: id}})
      },
      goQuestionDetaile(path, questionId) {
        this.$router.push({path: path, query: {questionId: questionId}})
      },
      goAnswerDetaile(path, questionId, answerId) {
        this.$router.push({path: path, query: {questionId: questionId, answerId: answerId}})
      }
    }
  }
</script>

<style lang="scss">
  .dashboard-jinxuan {
    .splitTab {
      position: absolute;
      right: -40px;
      top: 0;
      color: #e3e3e3;
      font-weight: 100;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      padding: 0;
      margin: 0 38px;
      height: 40px;
      line-height: 40px;
      color: #8d8d8d;
    }
    .el-tabs__item.is-top:nth-child(2) {
      margin-left: 0;
    }
    .el-tabs__item.is-top:last-child {
      margin-right: 0;
    }
    .el-tabs__item.is-active {
      color: #ffb148;
      border-bottom: 2px solid #ffb148;
      .date {
        color: #ffb148;
      }
    }
  }
</style>
