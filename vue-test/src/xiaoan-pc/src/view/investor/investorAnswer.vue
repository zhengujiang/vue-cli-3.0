<template>
  <div id="investorAnswer" class="caseDetail" v-loading="answerLoading">
    <div class="content">
      <el-row :gutter="16">
        <el-col :span="18" class="left-list">
          <div class="answer-content">
            <ul class="list-answer" v-if="iscCurrentAnswer">
              <li class="li">
                <div class="head">
                  <div class="row img">
                    <img :src="$image.investor.investorHeader" alt="">
                  </div>
                  <div class="row title">
                    <div class="title">
                      {{currentAnswer.userName}}
                      <span class="market sh-bg-color" v-if="formMarket(currentAnswer.marketType) == '沪'">沪</span>
                      <span class="market sz-bg-color" v-else>深</span>
                    </div>
                    <div class="time">{{$common.transTime(currentAnswer.questionTime)[0]}}</div>
                  </div>
                  <div class="row btns"
                       v-if="currentAnswer.companyCode == userInfo.enterpriseCompanyCode && !!!currentAnswer.answer">
                    <el-button type="primary" class="btn-link" @click="link(currentAnswer.companyCode)">回复</el-button>
                  </div>
                  <div class="icon-box hide-print" v-if="userId">
                    <span @click="collectDialogInfo=true">
                      <i class="iconfont web-shoucang"></i> 收藏
                    </span>
                  </div>
                </div>
                <div class="details">
                  <div class="question vux-1px-b"><span v-html="currentAnswer.question"></span>&ensp;<span
                    class="origin">{{'@'+currentAnswer.companyName+'('+currentAnswer.companyCode+')'}}</span>
                  </div>
                  <div class="answer" v-if="currentAnswer.answer">
                    <div class="desc" v-html="currentAnswer.answer"></div>
                    <div class="about">来自 {{currentAnswer.companyName}}
                      {{$common.transTime(currentAnswer.answerTime)[0]}}
                    </div>
                  </div>
                  <div class="answer" v-else>
                    <div class="desc no-desc">暂无回答</div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="no-content" v-else>
              <span>暂时没有内容</span>
            </div>
          </div>
          <div class="divider-box vux-1px-b">
            <span>相关问题</span>
          </div>
          <!---->
          <div class="no-list" v-if="listInfo.length == 0">
            <v-noInfo></v-noInfo>
          </div>
          <div class="no-list" v-loading="loading" v-else>
            <v-list :data="listInfo"></v-list>
          </div>
          <!---->
          <div class="foot-pagination" v-if="page.total>0">
            <el-pagination @current-change="currentChange" layout="prev, pager, next"
                           :current-page="page.index" :page-count="page.total"></el-pagination>
          </div>
        </el-col>
        <el-col :span="6" class="right-card">
          <v-adv :pageName="'投关问答详情'" style="margin-top:15px;"></v-adv>
          <el-card class="box-card" shadow="never" body-style="padding:0px 16px" v-if="currentAnswer.userName">
            <!--投资者简介-->
            <!--提问过的上市公司-->
            <div class="company-brief">
              <div class="header vux-1px-b">
                <div class="row title">投资者简介</div>
              </div>
              <div class="head vux-1px-b">
                <div class="row img">
                  <router-link target="_blank" class="a-link"
                               :to="'/investor/personal?market='+ marketFun(currentAnswer.marketType) +'&name=' + currentAnswer.userName">
                    <img :src="currentAnswer.userImage" alt="">
                  </router-link>
                </div>
                <div class="row title">
                  <div class="title textHidden">
                    <router-link target="_blank" class="a-link"
                                 :to="'/investor/personal?market='+ marketFun(currentAnswer.marketType) +'&name=' + currentAnswer.userName">
                      {{currentAnswer.userName}}
                    </router-link>
                    <span class="market sh-bg-color" v-if="formMarket(currentAnswer.marketType) == '沪'">沪</span>
                    <span class="market sz-bg-color" v-else>深</span>
                  </div>
                  <div class="time">{{$common.transTime(currentAnswer.questionTime)[0]}}</div>
                </div>
              </div>
              <div class="header">提问过的公司</div>
              <table class="company-table">
                <tr v-for="(item,index) of tableData">
                  <td class="code">
                    <span class="market sh-bg-color" v-if="String(item.companyCode).substring(0, 1) == 6">{{item.companyCode}}</span>
                    <span class="market sz-bg-color" v-else>{{item.companyCode}}</span>
                  </td>
                  <td class="companyName">
                    <p class="name">
                      <!--<router-link :to="'/investor/company?code='+item.companyCode" target="_blank">-->
                      {{item.companyName}}
                      <!--</router-link>-->
                    </p>
                    <p class="number">
                      <span class="small">提问数:{{item.questionCount}}&emsp;</span>
                      <span class="small">回复数:{{item.answerCount}}</span>
                    </p>
                  </td>
                </tr>
              </table>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!--<v-sidebar :collectInfo="contentDetail | delContent" v-show="isLogin" @scaleMethod="scaleScreen"-->
               <!--@printfMethod="printfM" :scaleShow="isScreen"></v-sidebar>-->
    <collect-dialog :collectDialogInfo="collectDialogInfo" :info="contentDetail | delContent"
                    @changeCollectDialog="changeCollectDialog" v-if="contentDetail.id"></collect-dialog>
  </div>
</template>

<script>
  import VList from './components/list'
  import VSidebar from '@/components/sidebar.vue'
  import collectDialog from '@/view/aside/components/components/collectDialog.vue'
  export default {
    name: "investorAnswer",
    components: {
      VList,
      VSidebar,
      collectDialog
    },
    data() {
      return {
        collectDialogInfo: false,
        answerLoading: false,
        isLogin: true,
        isScreen: false,
        page: {
          index: 1,
          size: 10,
          total: 0
        },
        contentDetail: {},
        marketData: [
          {id: 0, name: '沪市主板'},
          {id: 1, name: '深市主板'},
          {id: 2, name: '深市中小板'},
          {id: 3, name: '深市创业板'}
        ],
        loading: false,
        questionId: '',
        tableData: [],
        listData: [],
        iscCurrentAnswer: false,
        currentAnswer: {
          userName: 'XXXX',
          marketType: '',
          question: 'XXXXXXXXXXXXXXXXXXXX',
          userImage: 'http://oss.in-hope.cn/enterpriseApply/cd27274ef95c489687413e81fb1d51b2.png?123443543',
          companyName: 'xxxx',
          companyCode: '000000',
          questionTime: '1500000000000'
        },
        listInfo: [],
        userInfo: {},
        userId: ''
      }
    },
    filters: {
      delContent: function (obj) {
        if (obj == {}) return obj
        var newObj = {
          id: obj.id,
          title: obj.question,
          time: obj.questionTime,
          timeliness: '@' + obj.companyName + '(' + obj.companyCode + ')',
          type: 'interact'
        };
        console.log(newObj);
        return newObj
      }
    },
    watch: {
      '$store.state.scaleShowState': function (val) {
        console.log(val);
        this.isScreen = val;
        this.scaleScreen();
      },
      $route: function (val) {
        console.log(val);
      }
    },
    created() {
      this.userId = this.$cookie.get('userId')
      this.$store.commit('scaleShowState', true)
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      if (this.$route.query.id) {
        this.questionId = this.$route.query.id;
      }
      //
      this.getQuestionDetail(this.questionId);
      //
      this.getRelationQuestion(this.questionId);
    },
    methods: {
      changeCollectDialog() {
        this.collectDialogInfo = false
      },
      link(code) {
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getHrefByCompanyCode,
          params: {
            companyCode: code
          }
        }).then((res) => {
          // console.log(res.data.returnObject);
          if (res.data.returnCode == 200) {
            // alert(123);
            // this.$common.openWindow(res.data.returnObject);
            var tempWindow = window.open('_blank'); // 先打开页面
            tempWindow.location = res.data.returnObject; // 后更改页面地址
          }
        }).catch((err) => {

        })
      },
      printfM() {

      },
      // 页面缩放
      scaleScreen() {
        this.isScreen ? this.isScreen = false : this.isScreen = true
        // console.log(this.isScreen)
      },
      marketFun(type) {
        let data = '';
        this.marketData.forEach((item) => {
          if (type.indexOf(item.name) > -1) {
            data = item.id
          }
        })
        // console.log('213123', data);
        return data
      },
      //
      getInvosterQuestionCompany(market, userName) {
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getInvosterQuestionCompany,
          params: {
            userName: userName,
            marketType: market,
            pageNum: 1,
            pageSize: 5
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.tableData = res.data.returnObject.data;
            } else {
              this.tableData = [];
            }
          }
        }).catch((err) => {

        })
      },
      // 问答详情
      getQuestionDetail(id) {
        this.answerLoading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getQuestionDetail,
          params: {
            id: id,
            userId: this.userId
          }
        }).then((res) => {
          setTimeout(() => {
            this.answerLoading = false
          }, 300)
          console.log('23123', res.data.returnObject);
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.iscCurrentAnswer = true;
              let img = 'http://oss.in-hope.cn/enterpriseApply/cd27274ef95c489687413e81fb1d51b2.png?' + Math.random();
              this.currentAnswer = res.data.returnObject;
              this.contentDetail = this.currentAnswer;
              this.$common.getSidebarInfo(this.contentDetail, 'id', 'question', 'questionTime', `@${this.contentDetail.companyName}(${this.contentDetail.companyCode})`, 'interact')
              this.$set(this.currentAnswer, 'userImage', img);
              if (this.currentAnswer.userName) {
                this.getInvosterQuestionCompany(this.currentAnswer.marketType, this.currentAnswer.userName);
              }
            } else {
              this.iscCurrentAnswer = false;
            }
            console.log('324234', this.currentAnswer);
          }
        }).catch((err) => {
          setTimeout(() => {
            this.answerLoading = false
          }, 1000)
        })
      },
      formMarket(type) {
        let s = '';
        if (type.indexOf('沪') > -1) {
          s = '沪';
        } else if (type.indexOf('深') > -1) {
          s = '深';
        }
        return s
      },
      // 相关问题
      getRelationQuestion(id) {
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getRelationQuestion,
          params: {
            id: id,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        }).then((res) => {
          console.log(res.data.returnObject);
          this.loading = false;
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page.total = Math.ceil(res.data.returnObject.count / this.page.size)
            // total数量超过1000条 控制显示
            if (this.page.total > 5) {
              this.page.total = 5
            }
            // 没有搜索结果
            if (this.page.total == 0) {
              this.listInfo = [];
            } else {
              var arrList = res.data.returnObject.list;
              this.listInfo = [];
              var reg = /\s/g;
              var content = '';
              arrList.forEach((item, i) => {
                if (item.answer) {
                  content = item.answer.replace(reg, '');
                }
                //
                var strs = '', obj = {}, link = '', img = '';
                if (this.$common.browserSort() != 'Chrome') {
                  // 兼容 非chrome浏览器 只显示2行
                  strs = content;
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                } else {
                  strs = item.answer
                }
                link = '/investor/answer?id=' + item.id;
                img = 'http://oss.in-hope.cn/enterpriseApply/cd27274ef95c489687413e81fb1d51b2.png';
                obj = {
                  id: item.id,
                  userName: item.userName,
                  userImage: item.userImage,
                  companyName: item.companyName,
                  companyCode: item.companyCode,
                  question: item.question,
                  questionTime: item.questionTime,
                  questionSource: item.questionSource,
                  answer: strs,
                  answerTime: item.answerTime,
                  answerSource: item.answerSource,
                  marketType: item.marketType,
                  industry: item.industry,
                  userId: item.userId,
                  isIndex: item.isIndex,
                  isAnswer: item.isAnswer,
                  link: link,
                  img: img
                };
                this.listInfo.push(obj)
              })
            }
          } else {
            this.listInfo = [];
          }
        }).catch((err) => {

        })
      },
      // 分页的change
      currentChange(index) {
        this.page.index = index;
        this.$common.returnTop();
        this.getRelationQuestion(this.questionId);
      }
    }
  }
</script>

<style lang="scss" scoped>
  #investorAnswer {
    padding-bottom: 16px;
    .answer-content {
      min-height: 120px;
      position: relative;
      .no-content {
        position: absolute;
        top: 0;
        left: 0;
        margin: auto;
        height: 100%;
        width: 100%;
        background-color: #fff;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #8d8d8d;
      }
    }
    .divider-box {
      font-weight: bold;
      padding: 0;
      span {
        font-size: 18px;
        color: #323232;
        height: 35px;
        display: inline-flex;
        position: relative;
        &:after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          height: 2px;
          width: 70px;
          margin: auto;
          background-color: #ffb148;
        }
        // border-bottom: 2px solid #ffb148;
        // align-items: center;
      }
    }
    .no-list {
      min-height: 800px;
      width: 100%;
    }
    .list-answer {
      .li {
        padding: 15px 0 0 0;
        cursor: text;
        .head {
          display: flex;
          padding: 0 0 16px 0;
          align-items: center;
          .row {
            flex: 1;
            &.img {
              flex: inherit;
              img {
                height: 40px;
                width: 40px;
                border-radius: 50%;
                display: inherit;
              }
              .a-link {
                font-size: 0;
                display: inherit;
              }
            }
            &.title {
              font-size: 14px;
              color: #323232;
              padding-left: 10px;
              font-weight: 600;
              .title {
                /*&:hover {*/
                /*color: #ffb148;*/
                /*}*/
                .market {
                  font-size: 12px;
                  color: white;
                  border-radius: 2px;
                  height: 15px;
                  letter-spacing: 0;
                  width: 15px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: normal;
                }
              }
              .time {
                font-size: 12px;
                color: #AEAEAE;
                font-weight: normal;
              }
            }
            &.btns {
              flex: 0 0 10%;
              text-align: right;
              .btn-link {
                border-radius: 2px;
                height: 28px;
                width: 60px;
                padding: 0;
                font-size: 14px;
                color: #FFFFFF;
                font-weight: normal;
              }
            }
          }
          .icon-box {
            cursor: pointer;
            font-size: 14px;
            color: #ffb148;
            font-weight: 400;
            span {
              margin-right: 15px;
              cursor: pointer;
            }
          }
        }
        .details {
          // padding-left: 50px;
          .question {
            font-size: 14px;
            color: #323232;
            font-weight: 600;
            padding-bottom: 7px;
            .origin {
              font-weight: normal;
              color: #ffb148;
            }
          }
          .answer {
            padding: 7px 0 20px 0;
            border-radius: 4px;
            .desc {
              font-size: 14px;
              color: #545454;
              /*text-align: justify;*/
              .float {
                color: #ffb148;
                float: right;
              }
            }
            .no-desc{
              padding: 5px 0;
              color: #aeaeae;
            }
            .about {
              padding-top: 7px;
              font-size: 12px;
              color: #8d8d8d;
            }
          }
        }

      }
    }
    //
    .company-brief {
      .head {
        display: flex;
        padding: 8px 0 8px 0;
        align-items: center;
        .row {
          flex: 1;
          &.img {
            flex: inherit;
            img {
              height: 40px;
              width: 40px;
              border-radius: 50%;
              display: inherit;
            }
          }
          &.title {
            font-size: 14px;
            color: #323232;
            padding-left: 10px;
            .title {
              width: 100%;
              .a-link {
                color: #323232;
                font-size: 14px;
                &:hover {
                  color: #ffb148;
                }
              }

              .market {
                font-size: 12px;
                color: white;
                border-radius: 2px;
                height: 15px;
                letter-spacing: 0;
                width: 15px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
              }
            }
            .time {
              font-size: 12px;
              color: #AEAEAE;
            }
          }
        }
      }
      .header {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 10px 0;
        font-size: 14px;

        color: #323232;
        .row {
          flex: 1;
          &.title {
            font-size: 14px;
            color: #323232;
            font-weight: 600;
          }
          &.r-pagination {
            flex: 0 0 20%;
            text-align: right;
            margin: 0;
            padding: 0;
            &.text {
              font-size: 14px;
              color: #8d8d8d;
              cursor: pointer;
              i {
                font-size: 16px;
              }
            }
          }
        }
      }
      .company-table {
        width: 100%;
        font-size: 14px;
        margin: 0 0 11px 0;
        border: none;
        border: 0;
        border-collapse: collapse;
        // table-layout: fixed;
        tr {
          height: 45px;
          // cursor: pointer;
          &:hover {
            // background-color: #f6f6f6;
          }
          .index {
            width: 6%;
            font-size: 16px;
            color: #323232;
            text-align: center;
          }
          .code {
            width: 55px;
            padding: 3px 0;
            vertical-align: top;
            .market {
              display: inline-block;
              border-radius: 2px;
              height: 20px;
              width: 50px;
              line-height: 20px;
              text-align: center;
              color: white;
              font-size: 12px;
            }
          }
          .companyName {
            padding-left: 5px;
            font-size: 14px;
            color: #323232;
            .name {
              font-size: 14px;
              color: #323232;
              a {
                color: #ffb148;
                width: 100%;
                &:hover {
                  color: #ffb148;
                }
              }
            }
          }
          p {
            line-height: 1;
          }
          .number {
            padding-top: 5px;
            font-size: 14px;
            color: #323232;
            .small {
              font-size: 12px;
              color: #AEAEAE;
            }
          }
        }
      }
    }

  }
</style>
