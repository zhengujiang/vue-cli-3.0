<template>
  <div id="investor-personal">
    <div class="box-header">
      <div class="content">
        <div class="list">
          <div class="row img">
            <img :src="'http://oss.in-hope.cn/enterpriseApply/cd27274ef95c489687413e81fb1d51b2.png?' + Math.random()"
                 alt="">
          </div>
          <div class="row title">
            <span class="title">{{userName}}</span>&ensp;
            <span class="questionNumber"><span style="color: #e3e3e3">|</span>&emsp;提问数：{{questionNumber}}</span>
          </div>
          <div class="row text" v-if="false">
            <div class="font-size-16 name">{{userName}}
              <span class="market-label sh-bg-color" v-if="marketObj.type == '沪'">沪</span>
              <span class="market-label sz-bg-color" v-else>深</span>
            </div>
            <div class="font-size-12">提问数：{{questionNumber}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <el-row :gutter="16">
        <el-col :span="18" class="left-list" v-loading="personalLoading">
          <!---->
          <div class="no-list" v-if="listInfo.length == 0">
            <v-noInfo></v-noInfo>
          </div>
          <div class="no-list" v-loading="loading" v-else>
            <v-list :data="listInfo"></v-list>
            <div class="foot-pagination">
              <el-pagination @current-change="selectPage" layout="prev, pager, next"
                             :current-page="page.index" :page-count="page.total"></el-pagination>
            </div>
          </div>
        </el-col>
        <el-col :span="6" class="right-card">
          <v-adv :pageName="'投关投资者'" style="margin-top:15px;"></v-adv>
          <!--<el-card class="box-card" shadow="never" body-style="padding:0px">-->
          <!--&lt;!&ndash;广告&ndash;&gt;-->
          <!--<v-advertisement></v-advertisement>-->
          <!--</el-card>-->
          <el-card class="box-card" shadow="never" body-style="padding:0 16px" v-loading="companyQuestionLoading">
            <!--提问过的上市公司-->
            <div class="company-question">
              <div class="header vux-1px-b">
                <div class="row title">他提问过的上市公司</div>
                <div class="row pagination">
                  <el-pagination @current-change="currentChange" :current-page="companyPage.index"
                                 :page-size="companyPage.size" small
                                 layout="prev,next" :page-count="companyPage.total">
                  </el-pagination>
                </div>
              </div>
              <table class="company-table">
                <tr v-for="(item,index) of tableData">
                  <td class="index">{{((companyPage.index * companyPage.size) - 4) + index}}</td>
                  <td class="code">
                    <span class="market sh-bg-color" v-if="marketObj.type == '沪'">{{item.companyCode}}</span>
                    <span class="market sz-bg-color" v-else>{{item.companyCode}}</span>
                  </td>
                  <td class="companyName">
                    <!--<router-link :to="'/investor/company?code=' + item.companyCode" target="_blank">-->
                    {{item.companyName}}
                    <!--</router-link>-->
                  </td>
                  <td class="number"><span class="small">提问数：</span>{{item.questionCount}}</td>
                </tr>
              </table>
            </div>
          </el-card>
          <el-card class="box-card" shadow="never" body-style="padding:0 16px" v-if="wordCloudShow">
            <div class="company-question" v-loading="keyWordLoading">
              <div class="header vux-1px-b">
                <div class="row title">他提问过的关键词</div>
              </div>
              <div id="echartWordCloud"></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import VList from './components/list'
  export default {
    name: "investor-personal",
    components: {
      VList
    },
    data() {
      return {
        keyWordLoading: true,
        personalLoading: true,
        companyQuestionLoading: true,
        loading: false,
        marketData: [
          {id: 0, name: '沪市主板', type: '沪'},
          {id: 1, name: '深市主板', type: '深'},
          {id: 2, name: '深市中小板', type: '深'},
          {id: 3, name: '深市创业板', type: '深'}
        ],
        marketObj: {},
        marketType: '',
        questionNumber: 0,
        userName: 'xxxx',
        tableData: [],
        page: {
          index: 1,
          size: 10,
          total: 100
        },
        companyPage: {
          index: 1,
          size: 5,
          total: 100
        },
        listInfo: [],
        isInfo: false,
        wordCloudData: [],
        wordCloudShow: true
      }
    },
    created() {
      for (var i = 0; i < 2; i++) {
        this.tableData = this.tableData.concat(this.tableData);
      }
      this.marketData.forEach((item) => {
        if (item.id == this.$route.query.market) {
          this.marketType = item.name;
          this.marketObj = item;
        }
      })
      this.userName = decodeURI(this.$route.query.name);
      this.search(this.marketType, this.userName);
      this.getInvosterQuestionCount(this.marketType, this.userName);
      this.getInvosterQuestionCompany(this.marketType, this.userName);
      this.getKeywordByUserName(this.marketType, this.userName);
    },
    mounted() {
      // this.wordCloud();
    },
    methods: {
      //
      getInvosterQuestionCompany(market, userName) {
        this.companyQuestionLoading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getInvosterQuestionCompany,
          params: {
            userName: userName,
            marketType: market,
            pageNum: this.companyPage.index,
            pageSize: this.companyPage.size
          }
        }).then((res) => {
          setTimeout(() => {
            this.companyQuestionLoading = false;
          }, 300)
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              this.companyPage.total = Math.ceil(res.data.returnObject.count / this.companyPage.size)
              // total数量超过1000条 控制显示
              if (this.companyPage.total > 1000) {
                this.companyPage.total = 1000
              }
              this.tableData = res.data.returnObject.data;
            } else {
              this.tableData = [];
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.companyQuestionLoading = false;
          }, 1000)
        })
      },
      //
      getInvosterQuestionCount(market, userName) {
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getInvosterQuestionCount,
          params: {
            userName: userName,
            marketType: market
          }
        }).then((res) => {
          console.log(res.data);
          if (res.data.returnCode == 200) {
            this.questionNumber = res.data.returnObject;
          }
        }).catch((err) => {

        })
      },
      //
      selectPage(index) {
        this.page.index = index;
        this.$common.returnTop();
        this.search(this.marketType, this.userName);
      },
      //
      currentChange(index) {
        this.companyPage.index = index;
        this.getInvosterQuestionCompany(this.marketType, this.userName);
      },
      //
      search(market, userName) {
        this.personalLoading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.search,
          params: {
            userName: userName,
            marketType: market,
            pageNum: this.page.index, // 页数
            pageSize: this.page.size // 每页条数
          }
        }).then((res) => {
          setTimeout(() => {
            this.personalLoading = false
          }, 300)

          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.page.total = Math.ceil(res.data.returnObject.count / this.page.size)
            // total数量超过1000条 控制显示
            if (this.page.total > 1000) {
              this.page.total = 1000
            }
            // 没有搜索结果
            if (this.page.total == 0) {
              this.isInfo = true
              this.listInfo = []
            } else {
              this.isInfo = false;
              var arrList = res.data.returnObject.list;
              this.listInfo = []
              var reg = /\s/g
              var content = '';
              arrList.forEach((item, i) => {
                if (item.answer) {
                  content = item.answer.replace(reg, '')
                }
                //
                var strs = '', obj = {}, link = '', img = '';
                if (this.$common.browserSort() != 'Chrome') {
                  // 兼容 非chrome浏览器 只显示2行
                  strs = content
                  if (strs.length > 250) {
                    strs = strs.substring(0, 250) + '...'
                  }
                } else {
                  strs = item.answer
                }
                link = '/investor/answer?id=' + item.id;
                img = 'http://oss.in-hope.cn/enterpriseApply/cd27274ef95c489687413e81fb1d51b2.png?' + Math.random();
                obj = {
                  id: item.id,
                  userName: item.userName,
                  userImage: item.userImage,
                  companyName: item.companyName,
                  companyCode: item.companyCode,
                  question: item.question,
                  questionTime: item.questionTime,
                  questionSource: item.questionSource,
                  answer: item.answer,
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
          setTimeout(() => {
            this.listInfo = [];
            this.loading = false;
            this.personalLoading = false
          }, 300)
          this.$message({
            showClose: true,
            type: 'error',
            duration: 3000,
            message: err.message
          })
        })
      },
      // 获取词云
      getKeywordByUserName(market, userName) {
        this.keyWordLoading = true;
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getKeywordByUserName,
          params: {
            userName: userName,
            marketType: market
          }
        }).then((res) => {
          setTimeout(() => {
            this.keyWordLoading = false;
          }, 300)
          console.log(res.data);
          if (res.data.returnCode == 200) {
            if (res.data.returnObject) {
              if (res.data.returnObject.length == 0) {
                this.wordCloudShow = false;
              }
              let data = res.data.returnObject;
              data = data.slice(0, 20);
              this.wordCloudData = data.map(e => {
                return {name: e.hot_word, value: e.freq}
              })
              this.wordCloud(this.wordCloudData);
            } else {
              this.wordCloudData = [];
              this.wordCloudShow = false;
            }
          }
        }).catch((err) => {
          setTimeout(() => {
            this.keyWordLoading = false;
          }, 1000)
        })
      },
      //
      marketFun(type) {
        let data = '';
        this.marketData.forEach((item) => {
          if (type.indexOf(item.name) > -1) {
            data = item.id
          }
        })
        console.log('213123', data);
        return data
      },
      //
      wordCloud(datas) {
        var myChart = echarts.init(document.getElementById('echartWordCloud'));
        var color = ['#738BFF', '#FFB164', '#FFB09C', '#BBBBBB'];
        var option = {
          background: '#fff',
          series: [{
            type: 'wordCloud',
            // shape: 'circle',
            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.
            // maskImage: maskImage,
            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.
            left: 'center',
            top: '5%',
            width: '90%',
            height: '90%',
            right: 'center',
            bottom: '5%',
            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.
            sizeRange: [12, 30],
            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
            rotationRange: [0, 0],
            // rotationStep: 45,
            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.
            gridSize: 12,
            // set to true to allow word being draw partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            drawOutOfBound: false,
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: '400',
                color: function () {
                  return color[parseInt(Math.random() * 4)];
                }
              },
              emphasis: {
                //  shadowBlur: 10,
                //  shadowColor: '#323232'
              }
            },
            data: datas
            // data: data
          }]
        }
        myChart.setOption(option, true);
      }
    }
  }
</script>

<style lang="scss">
  #investor-personal {
    .right-card {
      margin-bottom: 16px;
      .company-question {
        .header {
          .row {
            &.title {
              font-size: 14px;
              font-weight: 500;
            }
            &.pagination {
              .el-pagination {
                padding: 0;
                .btn-prev {
                  padding: 0;
                }
                .btn-next {
                  padding: 0;
                }
              }
            }
          }
        }
      }
    }
  }
</style>

<style lang="scss" scoped>
  #investor-personal {
    width: 100%;
    background-color: #fff;
    min-height: 600px;
    .market-label {
      display: inline-block;
      line-height: 1;
      padding: 2px 2px;
      font-size: 12px;
      border-radius: 2px;
      color: #FFFFFF;
      vertical-align: middle;
      margin-left: 8px;
    }
    .box-header {
      width: 100%;
      height: 100px;
      background: #fff;
      -moz-box-shadow: 0px 10px 20px #f6f6f6;
      -webkit-box-shadow: 0px 10px 20px #f6f6f6;
      box-shadow: 0px 10px 20px #f6f6f6;
      /*background: url(../../../assets/image/affiche/afficheBg.png) center center no-repeat;*/
      position: relative;
      /*background-size: cover;*/
      /*padding: 16px 0;*/
      overflow: hidden;
      .list {
        display: flex;
        height: 100px;
        align-items: center;
        .row {
          flex: 1;
          &.img {
            flex: inherit;
            img {
              height: 48px;
              width: 48px;
              border-radius: 50%;
              display: inherit;
            }
          }
          &.title {
            padding-left: 10px;
            .title {
              font-size: 20px;
              color: #323232;
              line-height: 1;
            }
            .questionNumber {
              font-size: 16px;
              color: #aeaeae;
            }
          }
          &.text {
            padding-left: 10px;
            .name {
              display: flex;
              align-items: center;
              padding-bottom: 5px;
            }
          }
        }
      }
    }
    #echartWordCloud {
      width: 100%;
      min-height: 200px;
      // -webkit-filter: opacity(0.7);
      // -moz-box-shadow: 0 0 40px rgb(249, 249, 255) inset;
      // -webkit-box-shadow: 0 4px 20px rgb(249, 249, 255) inset;
      // box-shadow: 0 0 40px rgb(249, 249, 255) inset;
    }
  }
</style>
