<template>
  <el-tabs v-model="tabValue" @tab-click="handleClick" class="dashboard-companyInfo">
    <el-tab-pane label="资金" name="1">
      <span slot="label" class="eltab">资金<div class="splitTab">|</div></span>
      <div class="tabContent">
        <capital-item :companyCode="company.companyFullCode" v-if="company.companyFullCode"></capital-item>
      </div>
    </el-tab-pane>
    <el-tab-pane label="新闻" name="2" v-if="!isGuest">
      <span slot="label" class="eltab">新闻<div class="splitTab">|</div></span>
      <div class="tabContent">
        <div class="listBox_Big" v-for="(item,index) in newsList" v-if="index<4">
          <div class="title" @click="goUrl(item.uri)"><span class="tendency_color_1" v-if="item.tendency=='正面'">{{item.tendency}}</span>
            <span class="tendency_color_2" v-if="item.tendency=='负面'">{{item.tendency}}</span>
            <span class="tendency_color_3" v-if="item.tendency=='中性'">{{item.tendency}}</span>
            <span class="tendency_color_3" v-if="item.tendency==null">中性</span> {{item.title}}
          </div>
          <div class="describe" @click="goUrl(item.uri)"><span v-line-clamp:22="1">{{item.describe}}</span></div>
          <div class="attribute">
            <span v-if="item.media">{{item.media}} |</span>
            <span v-if="item.createdStr">{{item.createdStr}}</span>
          </div>
        </div>
        <el-button class="el-buttom-more" type="text" @click="goLink('/supervise')">查看更多</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="简况" name="3">
      <span slot="label" class="eltab">简况<div class="splitTab">|</div></span>
      <div class="tabContent introduction">
        <div class="baseInfo">
          <div class="title"><span class="title-text">基本信息</span></div>
          <table class="basic-info-table">
            <tbody>
            <tr>
              <td>公司名称</td>
              <td>{{companyInfo.compname}}</td>
            </tr>
            <tr>
              <td>地址</td>
              <td>{{companyInfo.regaddress}}</td>
            </tr>
            <tr>
              <td>成立日期</td>
              <td>{{companyInfo.founddate}}</td>
            </tr>
            <tr>
              <td>上市日期</td>
              <td>{{companyInfo.listdate}}</td>
            </tr>
            <tr>
              <td>工商登记号</td>
              <td>{{companyInfo.regnumber}}</td>
            </tr>
            <tr>
              <td>注册资本</td>
              <td>{{$common.wanUnit(companyInfo.regcapital)}}元</td>
            </tr>
            <tr>
              <td>法定代表人</td>
              <td>{{companyInfo.chairman}}</td>
            </tr>
            <tr>
              <td>省份</td>
              <td>{{companyInfo.province}}</td>
            </tr>
            <tr>
              <td>城市</td>
              <td>{{companyInfo.city}}</td>
            </tr>
            <tr>
              <td>证监会行业分类</td>
              <td>{{companyInfo.csrcnew}}</td>
            </tr>
            <tr>
              <td>申万行业分类</td>
              <td>{{companyInfo.sw2014}}</td>
            </tr>
            <tr>
              <td>网址</td>
              <td>{{companyInfo.website}}</td>
            </tr>
            <tr>
              <td>联系电话</td>
              <td>{{companyInfo.phone}}</td>
            </tr>
            <tr>
              <td>电子邮箱</td>
              <td>{{companyInfo.email}}</td>
            </tr>
            <tr v-if="companyInfo.business">
              <td>经营范围</td>
              <td>{{companyInfo.business}}</td>
            </tr>
            <tr v-if="!companyInfo.business">
              <td>公司简介</td>
              <td>{{companyInfo.comprofile}}</td>
            </tr>
            </tbody>
          </table>
        </div>
        <div class="controlPerson">
          <div class="title"><span class="title-text">十大股东</span></div>
          <el-table :data="topTenStockholder" border style="width: 100%">
            <el-table-column prop="name" label="股东名称"></el-table-column>
            <el-table-column prop="total" label="持股数" width="120"></el-table-column>
            <el-table-column prop="percent" label="持股占比" width="120"></el-table-column>
            <!--<el-table-column prop="info" label="完整信息">
            </el-table-column>-->
          </el-table>
        </div>
        <div class="controlPerson">
          <div class="title"><span class="title-text">十大流通股东</span></div>
          <el-table :data="topTenFloatingStockholder" border style="width: 100%">
            <el-table-column prop="name" label="股东名称"></el-table-column>
            <el-table-column prop="total" label="持股数" width="120"></el-table-column>
            <el-table-column prop="percent" label="持股占比" width="120"></el-table-column>
            <!--<el-table-column prop="info" label="完整信息">
            </el-table-column>-->
          </el-table>
        </div>
        <div class="controlPerson">
          <div class="title"><span class="title-text">董事会</span></div>
          <el-table :data="directors" border style="width: 100%">
            <el-table-column prop="name" label="姓名" width="160px"></el-table-column>
            <el-table-column prop="job" label="职务"></el-table-column>
            <!-- <el-table-column prop="duty" label="任期"></el-table-column> -->
            <!-- <el-table-column prop="info" label="完整信息">
             </el-table-column>-->
          </el-table>
        </div>
        <div class="controlPerson">
          <div class="title"><span class="title-text">监事会</span></div>
          <el-table :data="supervisors" border style="width: 100%">
            <el-table-column prop="name" label="姓名" width="160px"></el-table-column>
            <el-table-column prop="job" label="职务"></el-table-column>
            <!-- <el-table-column prop="duty" label="任期"></el-table-column> -->
            <!--<el-table-column prop="info" label="完整信息">
            </el-table-column>-->
          </el-table>
        </div>
        <div class="controlPerson">
          <div class="title"><span class="title-text">高级管理人员</span></div>
          <el-table :data="manager" border style="width: 100%">
            <el-table-column prop="name" label="姓名" width="160px"></el-table-column>
            <el-table-column prop="job" label="职务"></el-table-column>
            <!-- <el-table-column prop="duty" label="任期"></el-table-column> -->
            <!--<el-table-column prop="info" label="完整信息">
            </el-table-column>-->
          </el-table>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="公告" name="4">
      <span slot="label" class="eltab">公告<div class="splitTab">|</div></span>
      <div class="tabContent">
        <div class="listBox_Big" v-for="(item,index) in afficheList">
          <div class="title" @click="goDetaile('/affiche/details',item.mainId)">{{item.title}}</div>
          <div class="describe"><span v-line-clamp:22="1">{{item.content}}</span>
          </div>
          <div class="attribute">
            <span>{{$common.transTime(item.releaseDate)[0]}} |</span>
            <span>{{item.marketType}}</span>
          </div>
        </div>
        <el-button class="el-buttom-more" type="text" @click="goLink('/affiche')">查看更多</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="研报" name="5">
      <span slot="label" class="eltab">研报<div class="splitTab">|</div></span>
      <div class="tabContent">
        <div class="listBox_Big" v-for="(item,index) in reportList">
          <div class="title" @click="goDetaile('/report/details',item.id)">{{item.subject}}</div>
          <div class="describe"><span v-line-clamp:22="1">{{item.summary}}</span></div>
          <div class="attribute">
            <span v-if="item.sentDate">{{$common.transTime(item.sentDate)[0]}}</span>
            <span v-if="item.securitiesCompany">| {{item.securitiesCompany}}</span>
            <span v-if="item.author">| {{item.author}}</span>
            <span v-if="item.levelTwo">| {{item.levelTwo}}</span>
            <span v-if="item.rating">| {{item.rating}}</span>
          </div>
        </div>
        <el-button class="el-buttom-more" type="text" @click="goLink('/report')">查看更多</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="e互动" name="6">
      <span slot="label" class="eltab">
        <!--{{eName}}-->
        <el-badge :value="totalCount" :max="99" :hidden="!totalCount>0" class="item">{{eName}}</el-badge>
        <div class="splitTab">|</div>
      </span>
      <div class="tabContent">
        <div class="listBox_Big list-height" v-for="(item,index) in interactList">
          <div class="title">
            <router-link class="a" :to="'/investor/answer?id='+ item.id" target="_blank">
              {{item.userName+'：'+item.question}}
            </router-link>
          </div>
          <div class="describe">{{item.answer}}</div>
          <div class="attribute">
            <span class="row about">
              <span>{{$common.transTime(item.questionTime)[1]}}</span>
              <span>| {{item.companyName}}</span>
            </span>
            <span class="row answer" v-if="!item.answer">
              <el-button class="btn" size="mini" type="primary" @click="link(item.companyCode)">回复</el-button>
            </span>
          </div>
        </div>
        <el-button v-if="company.companyCode" class="el-buttom-more" type="text">
          <router-link class="a-link" :to="'/investor/company/list'" target="_blank">查看更多
          </router-link>
        </el-button>
        <el-button v-else class="el-buttom-more" type="text">
          <router-link class="a" :to="'/investor'" target="_blank">查看更多</router-link>
        </el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="" name="7" v-if="!isGuest">
      <span slot="label" class="eltab">论坛<div class="splitTab">|</div></span>
      <div class="tabContent">
        <div class="listBox_Big" v-for="(item,index) in bbsList" v-if="index<4">
          <div class="title" @click="goUrl(item.uri)"><span class="tendency_color_1" v-if="item.tendency=='正面'">{{item.tendency}}</span>
            <span class="tendency_color_2" v-if="item.tendency=='负面'">{{item.tendency}}</span>
            <span class="tendency_color_3" v-if="item.tendency=='中性'">{{item.tendency}}</span>
            <span class="tendency_color_3" v-if="item.tendency==null">中性</span> {{item.title}}
          </div>
          <div class="describe"><span v-line-clamp:22="1">{{item.describe}}</span></div>
          <div class="attribute">
            <span v-if="item.media !== ''">{{item.media}} |</span>
            <span v-if="item.createdStr !== ''">{{item.createdStr}}</span>
          </div>
        </div>
        <el-button class="el-buttom-more" type="text" @click="goLink('/supervise')">查看更多</el-button>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
  import capitalItem from "./capitalItem";
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  export default {
    data() {
      return {
        totalCount: 0,
        eName: 'e互动',
        tabValue: "1",
        tabData: {},
        newsList: [],
        bbsList: [],
        afficheList: [],
        reportList: [],
        interactList: [],
        sentimentKeyWord: this.company.companyName +
          "," +
          this.company.companyFullName +
          "," +
          this.company.companyCode,
        companyInfo: {},
        topTenStockholder: [],
        topTenFloatingStockholder: [],
        directors: [],
        supervisors: [],
        manager: []
      };
    },
    props: {
      company: Object,
      companyCode: String,
      isGuest: {
        type: Boolean,
        default: false
      }
    },
    // 使用其它组件
    components: {
      ElCol,
      ElRow,
      capitalItem
    },
    computed: {},
    watch: {
      companyCode() {
        this.getSentimentData();
        this.getBBSData();
        this.getAfficheList();
        // this.getReportList();
        this.getInteractList();
        this.getCompanyInfo();
      }
    },
    // 生命周期函数
    created() {
      if (this.company) {
        this.eName = this.$config.eName(this.companyCode)
        this.getSentimentData();
        this.getBBSData();
        this.getAfficheList();
        // this.getReportList();
        this.getInteractList();
        this.getCompanyInfo();
        this.isNumberSearch();
      }
    },
    mounted() {
    },
    // 方法
    methods: {
      isNumberSearch() {
        //
        let isAnswer = 'false';
        this.$http({
          methods: 'GET',
          url: this.$api.investor.search,
          params: {
            companyCode: this.company.companyCode, // code
            isAnswer: 'false',
            pageNum: 1, // 页数
            pageSize: 6 // 每页条数
          }
        }).then((res) => {
          this.loading = false
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            console.log(typeof isAnswer, '23423', isAnswer)
            this.totalCount = res.data.returnObject.count;
          }
        }).catch((err) => {

        })
      },
      handleClick() {
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
      // 获取新闻
      getSentimentData() {
        console.log("sentimentKeyWord", this.sentimentKeyWord);
        this.$http({
          method: "GET",
          url: this.$api.sentiment.getSentimentData,
          params: {
            keyword: this.sentimentKeyWord,
            pageNo: 1,
            pageSize: 10,
            type: "sentiment"
          }
        })
          .then(res => {
            this.loading = false;
            if (res.data.returnCode === 1 && res.data.returnObject.data) {
              this.newsList = res.data.returnObject.data;
            }
          })
          .catch(err => {
            this.newsList = [];
          });
        console.log("-----------------", this.newsList);
      },
      // 获取论坛
      getBBSData() {
        this.$http({
          method: "GET",
          url: this.$api.sentiment.getSentimentData,
          params: {
            keyword: this.sentimentKeyWord,
            pageNo: 1,
            pageSize: 10,
            type: "bbs"
          }
        })
          .then(res => {
            this.loading = false;
            if (res.data.returnCode === 1 && res.data.returnObject.data) {
              this.bbsList = res.data.returnObject.data;
            }
          })
          .catch(err => {
            this.bbsList = [];
          });
      },
      // 获取该公司公告
      getAfficheList() {
        this.$http({
          method: "GET",
          url: this.$api.affiche.afficheSearch,
          params: {
            pageNo: 1,
            pageSize: 4,
            companyCode: this.company.companyCode
          }
        })
          .then(res => {
            this.loading = false;
            if (res.data.returnCode == 1) {
              this.afficheList = res.data.returnObject.list;
            }
          })
          .catch(err => {
            this.afficheList = [];
          });
      },
      // 获取研报
      getReportList(industry) {
        this.$http({
          method: "GET",
          url: this.$api.report.searchReport,
          params: {
            pageNum: 1,
            pageSize: 4,
            industry: industry
          }
        })
          .then(res => {
            this.loading = false;
            if (res.data.returnCode == 1) {
              this.reportList = res.data.returnObject;
            }
          })
          .catch(err => {
            this.reportList = [];
          });
      },
      // 获取互动e信息
      getInteractList() {
        this.$http({
          method: "GET",
          url: this.$api.investor.search,
          params: {
            companyCode: this.company.companyCode, // code
            isAnswer: '',
            pageNum: 1, // 页数
            pageSize: 6 // 每页条数
          }
        })
          .then(res => {
            this.loading = false;
            if (res.data.returnCode == 200) {
              var arrList = res.data.returnObject.list;
              this.interactList = arrList;
            }
          })
          .catch(err => {
            this.interactList = [];
          });
        console.log("-------互动e----------", this.interactList);
      },
      getCompanyInfo() {
        this.companyInfo = {}
        this.topTenStockholder = []
        this.topTenFloatingStockholder = []
        this.directors = []
        this.supervisors = []
        this.manager = []

        this.$http({
          method: "GET",
          url: this.$api.company.getCompanyInfo,
          params: {
            companyCode: this.company.companyFullCode.toString().substr(2) + "." + this.company.companyFullCode.toString().substr(0, 2)
          }
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.companyInfo = res.data.returnObject;
            this.getReportList(this.companyInfo.sw2014.replace(/\//g, ','))
            this.companyInfo.companyMangerList.forEach(item => {
              if (item.type == 0) {
                this.directors.push({
                  name: item.name,
                  job: item.job,
                  duty: item.duty
                });
              }
              if (item.type == 1) {
                this.supervisors.push({
                  name: item.name,
                  job: item.job,
                  duty: item.duty
                });
              }
              if (item.type == 2) {
                this.manager.push({
                  name: item.name,
                  job: item.job,
                  duty: item.duty
                });
              }
            });
            this.companyInfo.companyStockholderList.forEach(item => {
              if (item.type == 0) {
                this.topTenStockholder.push({
                  name: item.name,
                  total: Number(item.total / 10000).toFixed(2) + "万",
                  percent: Number(item.percent).toFixed(2) + "%"
                });
              }
              if (item.type == 1 && item.name != 'None') {
                this.topTenFloatingStockholder.push({
                  name: item.name,
                  total: Number(item.total / 10000).toFixed(2) + "万",
                  percent: Number(item.percent).toFixed(2) + "%"
                });
              }
            });
          }
        })
          .catch(err => {
            this.companyInfo = {};
          });
        console.log("-------互动e----------", this.interactList);
      },
      // go  link
      goLink(path) {
        this.$router.push(path);
      },
      // go  link
      goUrl(url) {
        window.open(url);
      },
      goDetaile(path, id) {
        this.$router.push({path: path, query: {id: id}});
      }
    }
  };
</script>
<style lang="scss">
  .dashboard-companyInfo {
    .el-tabs__header {
      margin-bottom: 10px;
    }
    .splitTab {
      position: absolute;
      right: -50px;
      top: 0;
      color: #e3e3e3;
      font-weight: 100;
    }
    .eltab {
      width: 33%;
      .item {
        top: -2px;
        .el-badge__content.is-fixed {
          top: 9px;
          right: 7px;
        }
      }
    }
    .el-buttom-more {
      .a {
        color: #ffb148;
      }
    }
    .list-height {
      height: 70px;
      .title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: inherit;
        margin-bottom: 0;
        .a {
          color: #323232;
          &:hover {
            color: #ffb148;
          }
        }
      }
      .describe {
        overflow: hidden;
        display: block;
        -webkit-line-clamp: 1;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 1;
      }
      .attribute {
        display: flex;
        .row {
          flex: 1;
          &.answer {
            flex: 0 0 20%;
            text-align: right;
            .btn {
              color: #fff;
              padding: 0;
              cursor: pointer;
              width: 36px;
              height: 22px;
              font-size: 12px;
              span {
                display: inherit;
                color: #fff;
                vertical-align: inherit;
              }
            }
          }
        }
      }
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      color: #8d8d8d;
      padding: 0;
      margin: 0 43px;
      height: 40px;
      line-height: 40px;
    }
    /*.el-tabs__item.is-top:nth-child(2) {*/
    /*margin-left:0;*/
    /*}*/
    /*.el-tabs__item.is-top:last-child {*/
    /*margin-right: 0;*/
    /*}*/
    .el-tabs__item.is-active {
      color: #ffb148;
      border-bottom: 2px solid #ffb148;
      .date {
        color: #ffb148;
      }
    }
    .tendency_color_1 {
      display: inline-block;
      width: 30px;
      font-size: 10px;
      text-align: center;
      background-color: #29da89;
      color: #f7f7f7;
      height: 20px;
      line-height: 20px;
      transform: scale(.8);
      border-radius: 2px;
    }
    .tendency_color_2 {
      display: inline-block;
      width: 30px;
      font-size: 10px;
      text-align: center;
      background-color: #fa4319;
      color: #f7f7f7;
      height: 20px;
      line-height: 20px;
      transform: scale(.8);
      border-radius: 2px;
    }
    .tendency_color_3 {
      display: inline-block;
      width: 30px;
      font-size: 10px;
      text-align: center;
      background-color: #ffb148;
      color: #f7f7f7;
      height: 20px;
      line-height: 20px;
      transform: scale(.8);
      border-radius: 2px;
    }

    .introduction {
      height: 480px;
      overflow-y: auto;
      overflow-x: hidden;
      font-size: 14px;
      .el-table thead {
        tr th {
          background-color: #f1f1f1;
        }
      }
      .title {
        border-bottom: 1px solid #e3e3e3;
        line-height: 30px;
        margin-bottom: 10px;
        .title-text {
          display: inline-block;
          line-height: 30px;
          border-bottom: 2px solid #ffb148;
          color: #323232;
        }
      }
      .baseInfo {
        .el-col {
          min-height: 50px;
          display: flex;
          align-items: center;
        }
        .el-col-8 {
          padding-left: 10px !important;
        }
        .elrow {
          margin-top: 3px;
        }
        .graybg {
          padding-right: 4px 20px 4px 0 !important;
          background-color: #f1f1f1;
          text-align: right;
          justify-content: flex-end;
        }
      }
      .controlPerson {
        margin-top: 10px;
      }
    }
    .basic-info-table {
      margin: 10px 0;
      table-layout: fixed;
      width: 100%;
      border-collapse: collapse;
      td {
        &:nth-child(1) {
          text-align: right;
          width: 150px;
        }
        padding: 10px 15px;
        border: solid 1px #e3e3e3;
        color: #8d8d8d;
        font-size: 14px;
      }
    }
  }
</style>
