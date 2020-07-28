<template>
  <div id="dashboard">
    <div class="content">
      <el-row :gutter="20">
        <el-col :span="16" class="widthCol1">
          <el-card shadow="never" class="box-card contentHeight marketBox">
            <div class="stockLeft">
              <div class="stockTab">
                <div class="name">市场行情</div>
                <div class="date">{{dvData.apiDate}}</div>
              </div>
              <!--股票列表-->
              <div class="stockList">
                <div class="stockItem" v-for="(item,index) in marketSituationList" :key="index"
                     @click="index==0?$router.push({ path: '/market-condition'}):$router.push({ path: '/company-condition/' + item.fullCode })">
                  <div class="name">{{item.stockName}}({{item.code}})</div>
                  <div class="number">
                    <span v-if="item.change > 0"
                          class="up">{{item.now}}&nbsp;&nbsp;{{item.change}} ({{item.pctChange}}%)</span>
                    <span v-else class="down">{{item.now}}&nbsp;&nbsp;{{item.change}} ({{item.pctChange}}%)</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="stockRight">
              <div>
                <span class="stockName">{{stockName}}({{stockCode}})</span>
                <span class="updateTime">数据更新时间 ：{{dvData.apiDate}}</span>
                <el-button class="el-button-more" type="text" @click="showMarketMore">查看更多</el-button>
              </div>
              <div class="mtop10" v-if="stockData.shiFouTingPai">
                <span class="change up">停牌</span>
              </div>
              <div class="mtop10" v-else>
                <span :class="stockData.color" v-if="stockData.zhangDie != '--'" class="stockPrice">{{stockData.zuiXinJia}}</span>
                <span v-if="stockData.zhangDie != '--'" :class="stockData.color" class="change">{{stockData.zhangDie}} ({{stockData.zhangFu}}%)</span>
                <span v-else class="change">{{stockData.zhangDie}}</span>
              </div>

              <div style="height: 80px;">
                <div class="priceInfo mtop10">
                  <div class="echartsContentTopList">
                    <ul>
                      <li>
                        <span>
                          开盘价:
                          <span>{{stockData.kaiPanJia}}</span>
                        </span>
                      </li>
                      <li>
                        <span>
                          最高价:
                          <span>{{stockData.zuiGaoJia}}</span>
                        </span>
                      </li>
                      <li>
                        <span>
                          最低价:
                          <span>{{stockData.zuiDiJia}}</span>
                        </span>
                      </li>
                      <li>
                        <span>
                          成交额:
                          <!--<span>{{$common.autoPrices(stockData.chengJiaoE)}}</span>-->
                          <span v-if="stockData.chengJiaoE != '--'">{{$common.autoPrices(stockData.chengJiaoE)}}</span>
                          <span v-else>--</span>
                        </span>
                      </li>
                      <li>
                        <span>
                          成交量:
                          <span v-if="stockData.chengJiaoLiang != '--'">{{$common.autoPrices(stockData.chengJiaoLiang / 100)}}手</span>
                          <span v-else>{{stockData.chengJiaoLiang}}</span>
                        </span>
                      </li>
                      <li>
                        <span>
                          换手率:
                          <span v-if="stockData.huanShou != '--'" :class="{'up': stockData.huanShou>=20}">{{stockData.huanShou}}%</span>
                          <span v-else>{{stockData.huanShou}}</span>
                        </span>
                      </li>
                    </ul>
                  </div>

                </div>
                <div class="pianlizhi" :class="dvData.color">
                  <ul>
                    <li><span>偏离值</span></li>
                    <li>
                      <span v-if="bTotal == '--' || stockData.shiFouTingPai">--</span>
                      <span v-else>{{bTotal}}%</span></li>
                  </ul>

                </div>
              </div>
              <div>
                <market-item :componyCodeR='this.company.companyFullCode'
                             v-if="this.company.companyFullCode"></market-item>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="8" class="widthCol2">
          <div class="contentHeight">
            <el-card shadow="never" class="box-card elCard1" header="待办事项">
              <div slot="header" class="clearfix">
                <span>待办事项</span>
                <el-button class="el-button-more" type="text" @click="goLink('/calendar/index')">查看更多</el-button>
              </div>
              <v-dashboardCalendar></v-dashboardCalendar>
            </el-card>
            <el-card shadow="never" class="box-card elCard2" header="待办事项">
              <div slot="header" class="clearfix">
                <span class="inner">小安实验室</span>
              </div>
              <el-button type="primary" plain @click="yunyi">
                <img src="https://oss.in-hope.cn/xiaoan/web_static/icon.png" alt=""><span class="text">小安·云译</span>
              </el-button>
              <p>敬请期待更多功能</p>
            </el-card>
          </div>
        </el-col>
      </el-row>
      <el-row class="mtop" :gutter="20">
        <el-col :span="16" class="widthCol1">
          <el-card shadow="never" class="box-card contentHeight siftCard">
            <v-companyInfo :company="company" v-if="company.companyFullCode"></v-companyInfo>
          </el-card>
        </el-col>
        <el-col :span="8" class="widthCol2">
          <el-card shadow="never" class="box-card contentHeight siftCard">
            <v-sift></v-sift>
          </el-card>
        </el-col>
      </el-row>
      <el-row class="mtop" :gutter="20">
        <el-col :span="9" class="widthCol3">
          <el-card shadow="never" class="box-card contentHeight" header="法规">
            <div slot="header" class="clearfix">
              <span>法规</span>
              <el-button class="el-button-more" type="text" @click="goLink('/rule')">查看更多</el-button>
            </div>
            <div class="listBox" v-for="(item,index) in lawList" v-if="index<6">
              <div class="title" @click="goDetaile('/ruleDetail',item.id)">
                <span class="newtip">new</span>
                {{item.name}}
              </div>
              <div class="attribute">
                <span class="referenceNumber">{{item.referenceNumber}} </span>
                <span>| {{item.timeliness}} |</span>
                <span>{{$common.transTime(item.PublishDate)[0]}}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="9" class="widthCol3">
          <el-card shadow="never" class="box-card contentHeight" header="监管动态">
            <div slot="header" class="clearfix">
              <el-row>
                <el-col :span="15"><span>监管动态</span></el-col>
                <el-col :span="4">
                  <el-select v-model="valueJianguan" placeholder="请选择" size="mini" class="el-select-jianguan"
                             @change="superviseDynamic">
                    <el-option
                      v-for="item in optionsJianguan"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="5">
                  <el-button class="el-button-more" type="text" @click="goLink('/activities?index=0')">查看更多</el-button>
                </el-col>
              </el-row>

            </div>
            <div class="listBox" v-for="(item,index) in superviseDynamicList">
              <div class="title" @click="goUrl(item.sourceUrl)">{{item.title}}</div>
              <div class="attribute">
                <span>{{item.source}} |</span>
                <span>{{$common.transTime(item.releaseDate)[0]}}</span>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6" class="widthCol2">
          <el-card shadow="never" class="box-card contentHeight" header="违规案例">
            <div slot="header" class="clearfix">
              <span>违规案例</span>
              <el-button class="el-button-more" type="text" @click="goLink('/cases')">查看更多</el-button>
            </div>
            <div class="listBox" v-for="(item,index) in caseList">
              <div class="title" @click="goDetaile('/caseDetail',item.id)">{{item.docTitle}}</div>
              <div class="attribute">
                <span>{{item.companyMarketName}} |</span>
                <span>{{$common.transTime(item.processDate)[0]}}</span>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <v-friendlyLink></v-friendlyLink>
    </div>
  </div>
</template>

<script>
  import ElCol from "element-ui/packages/col/src/col"
  import capitalItem from './components/dashboard/capitalItem'
  import marketItem from './components/dashboard/marketItem'

  import dashboardCalendar from './components/dashboard/calendar' // 待办事项
  import sift from './components/dashboard/sift' // 信乎精选，信公精选，团队收藏
  import friendlyLink from './components/dashboard/friendlyLink' // 友情连接
  import companyInfo from './components/dashboard/companyInfo' // 公司信息（资金，新闻，简况，公告，研报，互动e）
  import ElRow from "element-ui/packages/row/src/row"

  export default {
    data() {
      return {
        userInfo: {},
        company: [],
        userId: '',
        lawList: [],
        caseList: [],
        stockData: {
          color: 'up',
          chengJiaoE: "--",
          chengJiaoLiang: "--",
          huanShou: "--",
          kaiPanJia: "--",
          zhangDie: "--",
          zhangFu: "--",
          zuiDiJia: "--",
          zuiGaoJia: "--",
          zuiXinJia: "--"
        },
        // 偏离值
        dvData: {
          color: ''
        },
        bTotal: "--",
        stockName: "",
        stockCode: "",
        marketSituationList: [],
        superviseDynamicList: [],
        tabf10: '1',
        tabBacklog: '1',
        tabLastSevenDay: '1',
        // marketSituation: '2018年06月05日',
        optionsJianguan: [
          {value: '全部', label: '全部'},
          {value: '证监会', label: '证监会'},
          {value: '上交所', label: '上交所'},
          {value: '深交所', label: '深交所'}
        ],
        valueJianguan: '全部',
        componyCode: '',
        interval: null
      }
    },
    // 使用其它组件
    components: {
      ElRow,
      ElCol,
      capitalItem,
      marketItem,
      'v-dashboardCalendar': dashboardCalendar,
      'v-sift': sift,
      'v-companyInfo': companyInfo,
      'v-friendlyLink': friendlyLink
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.componyCode = 'SZ000001'
      this.userInfo = window.JSON.parse(this.$cookie.get('userInfo'));
//      if (!this.userInfo.enterpriseUser) {
//        this.$router.push('/index')
//      }
      this.initData()
      this.reData()
    },
    mounted() {
    },
    destroyed() {
      window.clearInterval(this.interval)
    },
    // 方法
    methods: {
      //
      showMarketMore() {
        this.$router.push('/company-condition')
      },
      // 实时刷新
      reData() {
        // 初始化数据，用于第一次加载
        this.stockInfo()
        this.deviationValue()
        this.marketSituation()
        // 定时加载
        this.interval = setInterval(() => {
          if (this.$common.checkMarkTime()) {
            this.stockInfo()
            this.deviationValue()
            this.marketSituation()
          }
        }, 10000)
      },
      //
      initData() {
        this.getCompany()
        this.lawSearch()
        this.caseSearch()
        this.superviseDynamic()
        // this.stockInfo()
        // this.deviationValue()
        // this.marketSituation()
      },
      //
      afterInitData() {
        this.stockInfo()
        this.deviationValue()
        this.marketSituation()
      },
      // 获取当前所在公司的信息
      getCompany() {
        // console.log(this.userInfo.companyId);
        if (this.userInfo.companyId === null || this.userInfo.companyId === '') {
          this.$router.push('/index')
        } else {
          this.$http({
            method: 'GET',
            url: this.$api.manage.companyInfo,
            params: {
              companyId: this.userInfo.companyId
            }
          }).then((res) => {
            if (res.data.returnCode === 1) {
              this.company = res.data.returnObject;
              // console.log("公司信息-------------", this.company);
              this.afterInitData()
            }
          })
        }

      },
      //
      goLink(path) {
        this.$router.push(path)
      },
      // go  link
      goUrl(url) {
        this.$common.openWindow(url)
      },
      //
      handleClick() {

      },
      //
      goDetaile(path, id) {
        if (path === '/supervise') {
          return
        }
        this.$router.push({path: path, query: {id: id}})
      },
      // 法规
      lawSearch() {
        this.$http({
          method: 'GET',
          url: this.$api.rule.lawSearch,
          params: {
            pageNo: 1, // 页码
            pageSize: 6, // 每页行数
            type: 'law',
            sortType: '发布日期', // 搜索排序，时间排序time
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.lawList = res.data.returnObject.list
            this.lawList.forEach((item) => {
              // 发文号为空是，显示发文单位
              let issued = ''
              if (item.referenceNumber && item.referenceNumber !== '无') {
                issued = item.referenceNumber
              } else {
                let organizations = item.organizations
                if (organizations) {
                  for (let k in organizations) {
                    if (k <= 2) {
                      issued += organizations[k].value + ','
                    }
                  }
                }
                issued = issued.substring(0, issued.length - 1)
              }
              item.referenceNumber = issued
            })
          }
        })
      },
      // 监管动态
      superviseDynamic() {
        let stype = this.valueJianguan == '全部' ? '' : this.valueJianguan
        this.$http({
          method: 'GET',
          url: this.$api.supervise.superviseDynamic,
          params: {
            type: stype,
            pageNo: 1,
            pageSize: 6
          }
        }).then((res) => {
          // console.log("监管动态：--------------", res.data)
          if (res.data.returnCode == 200) {
            this.superviseDynamicList = res.data.returnObject.superviseDynamicList
          }
        })
      },
      // 案例
      caseSearch() {
        this.$http({
          method: 'POST',
          url: this.$api.cases.searchC,
          data: {
            sortType: '处理日期',
            userId: this.userId,
            pageNo: 1,
            pageSize: 6
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.caseList = res.data.returnObject.list
          }
        })
      },
      // 股票简要行情信息
      stockInfo() {
        if (!this.company.companyFullCode) {
          return false
        }
        this.$http({
          method: 'GET',
          url: this.$api.stock.getStockInfo,
          params: {
            obj: this.company.companyFullCode
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.stockData = res.data.returnObject.data
            if (this.stockData.shiFouTingPai) {
              this.stockData.chengJiaoE = '--'
              this.stockData.chengJiaoLiang = '--'
              this.stockData.huanShou = '--'
              this.stockData.zhangDie = '--'
              this.stockData.zhangFu = '--'
              this.stockData.zuiDiJia = '--'
              this.stockData.zuiGaoJia = '--'
              this.stockData.zuiXinJia = '--'
              this.stockData.kaiPanJia = '--'
              // this.stockData.zuiGaoJia = '--'
            } else {
              this.stockData.chengJiaoE = this.stockData.chengJiaoE.toFixed(2)
              this.stockData.chengJiaoLiang = this.stockData.chengJiaoLiang.toFixed(2)
              this.stockData.huanShou = this.stockData.huanShou ? this.stockData.huanShou.toFixed(2) : 0.00
              this.stockData.zhangDie = this.stockData.zhangDie.toFixed(2)
              this.stockData.zhangFu = this.stockData.zhangFu.toFixed(2)
              this.stockData.zuiDiJia = this.stockData.zuiDiJia.toFixed(2)
              this.stockData.zuiGaoJia = this.stockData.zuiGaoJia.toFixed(2)
              this.stockData.zuiXinJia = this.stockData.zuiXinJia.toFixed(2)
              this.stockData.kaiPanJia = this.stockData.kaiPanJia.toFixed(2)

              if (this.stockData.zhangDie > 0) {
                // console.log(" 正", this.stockData.zhangDie)
                this.stockData.color = "up"
              } else {
                // console.log(" 负", this.stockData.zhangDie)
                this.stockData.color = "down"
              }
            }

            // console.log(" 行情", this.stockData)
          }
        })
      },
      //
      deviationValue() {
        if (!this.company.companyFullCode) {
          return false
        }
        //
        let fullCompanyName = this.company.companyName; //
        let fullCompanyCode = this.company.companyFullCode;
        this.$http({
          method: 'GET',
          url: this.$api.stock.getDeviationValue,
          params: {
            code: this.company.companyFullCode
          }
        }).then((res) => {
          // res.data.returnObject = null
          if (res.data.returnCode == 1 && res.data.returnObject != null) {
            this.dvData = res.data.returnObject;
            this.updateTime = res.data.returnObject.apiDate;
            this.stockName = this.dvData.data[0].name;
            this.stockCode = this.dvData.data[0].code;
            this.bTotal = this.dvData.bTotal;
            this.dvData.apiDate = this.$common.transTime(this.dvData.apiDate)[4];
            // this.dvData.bTotal = 15
            let absBToltal = Math.abs(this.dvData.bTotal);
            let fullCode = this.company.companyFullCode;
            if (this.stockName.indexOf("ST") !== 0 && this.stockName.indexOf("*ST") !== 0) {
              if (absBToltal > 0 && absBToltal < 10) {
                // console.log("配色1")
                this.dvData.color = "bgColorOne";
              } else if (absBToltal > 10 && absBToltal < 20) {
                // console.log("配色2");
                this.dvData.color = "bgColorTwo";
              } else if (absBToltal >= 20) {
                // console.log("配色3")
                this.dvData.color = "bgColorThree";
              }
              if (
                this.bTotal == null ||
                this.dvData.shiFouTingPai == true ||
                this.bTotal == 0
              ) {
                this.dvData.color = "bgColorFour";
                this.bTotal = "--";
                if (this.bTotal == 0) {
                  this.bTotal = "0.00%";
                }
              }
            } else {
              if (fullCode.indexOf("SH") == 0) {
                // 沪市
                if (absBToltal > 0 && absBToltal < 7.5) {
                  // console.log("配色1")
                  this.dvData.color = "bgColorOne";
                } else if (absBToltal > 7.5 && absBToltal < 15) {
                  // console.log("配色2 沪市 ", this.comCode);
                  this.dvData.color = "bgColorTwo";
                } else if (absBToltal >= 15) {
                  // console.log("配色3")
                  this.dvData.color = "bgColorThree";
                }
                if (
                  this.bTotal == null ||
                  this.dvData.shiFouTingPai == true ||
                  this.bTotal == 0
                ) {
                  this.dvData.color = "bgColorFour";
                  this.bTotal = "--";
                  if (this.dvData.bTotal == 0) {
                    this.bTotal = "0.00%";
                  }
                }
              } else {
                // console.log('-------------------------')
                if (absBToltal > 0 && absBToltal < 6) {
                  // console.log("配色1")
                  this.dvData.color = "bgColorOne";
                } else if (absBToltal >= 6 && absBToltal < 12) {
                  // console.log("配色2 深市", this.comCode);
                  this.dvData.color = "bgColorTwo";
                } else if (absBToltal >= 12) {
                  // console.log("配色3")
                  this.dvData.color = "bgColorThree";
                }
                if (
                  this.dvData.bTotal == null ||
                  this.dvData.shiFouTingPai == true ||
                  this.dvData.bTotal == 0
                ) {
                  this.dvData.color = "bgColorFour";
                  this.dvData.bTotal = "--";
                  if (this.dvData.bTotal == 0) {
                    this.dvData.bTotal = "0.00%";
                  }
                }
              }
            }
          } else {

          }
        })
      },
      //
      marketSituation() {
        if (!this.company.companyFullCode) {
          return false
        }
        this.$http({
          method: 'GET',
          url: this.$api.stock.listMarketSituation,
          params: {
            companyId: this.company.id
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.marketSituationList = res.data.returnObject
            // console.log(" 市场概况", this.marketSituationList)
          }
        })
      },
      yunyi() {
        this.$router.push({path: '/yunyi'})
      }
    }
  }
</script>
<style lang="scss">
  #dashboard {
    ::-webkit-scrollbar {
      width: 10px;
      background-color: #fff;
      border-radius: 10px;
    }

    ::-webkit-scrollbar-thumb {
      height: 5px;
      border: 1px solid #fff;
      border-radius: 5px;
      background-color: #b2b2b2;
    }
    .widthCol1 {
      width: 70% !important;
    }
    .widthCol2 {
      width: 30% !important;
    }
    .widthCol3 {
      width: 35% !important;
    }
    .mtop {
      margin-top: 20px;
    }
    .mtop10 {
      margin-top: 10px;
    }
    .pleft {
      padding-left: 12px;
    }
    .contentHeight {
      height: 550px;
    }
    .elCard1 {
      height: 380px;
      margin-bottom: 20px;
    }
    .elCard2 {
      height: 150px;
      .inner {
        font-size:17px;
        font-family:PingFangSC-Semibold;
        font-weight:600;
        color:rgba(255,177,72,1);
      }
      .el-button {
        width:309px;
        height:36px;
        text-align: center;
        img {
          width: 20px;
          height: 20px;
          display: inline-block;
          float: left;
          margin: -5px 5px 0 90px;
          margin-top: -4px;
        }
        .text {
          float: left;
        }
      }
      p {
        font-size:12px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(174,174,174,1);
        margin-top: 19px;
      }
    }
    .marketBox {
      .el-card__body {
        padding: 0;
      }
      .stockLeft {
        float: left;
        .stockTab {
          width: 180px;
          height: 60px;
          padding: 9px 12px;
          /*border-bottom: 1px solid #e3e3e3;*/
          .name {
            color: #ffb148;
            font-weight: 800;
            font-size: 17px;
          }
          .date {
            color: #8d8d8d;
            font-size: 12px;
          }
        }
        .stockList {
          width: 190px;
          height: 490px;
          overflow-y: auto;
          border-top: 1px solid #e3e3e3;
          border-right: 1px solid #e3e3e3;
          .stockItem {
            cursor: pointer;
            border: 1px solid #e3e3e3;
            border-right: 0;
            border-bottom: 0;
            padding: 17px 12px;
            &:hover {
              background-color: #f8f8f8;
            }
            &:first-child {
              border-top: 0;
            }
            &:last-child {
              border-bottom: 1px solid #e3e3e3;
            }
            .name {
              color: #323232;
              font-weight: 800;
              font-size: 14px;
            }
            .number {
              margin-top: 2px;
              color: #8d8d8d;
              font-size: 12px;
              .up {
                color: #fa4319;
              }
              .down {
                color: #29da89;
              }
            }
          }
          .active {
            background-color: #f0f1f5;
          }
        }
      }
      .stockRight {
        float: left;
        margin-left: 10px;
        width: 630px;
        height: 548px;
        padding: 9px 12px;
        .stockName {
          color: #323232;
          font-weight: 800;
          font-size: 17px;
        }
        .updateTime {
          display: inline-block;
          margin-left: 30px;
          color: #8d8d8d;
          font-size: 12px;
        }
        .stockPrice {
          display: inline-block;
          /*color: #fa4319;*/
          font-size: 26px;
          margin-right: 10px;
        }
        .change {
          font-size: 16px;
        }
        .up {
          color: #fa4319;
        }
        .down {
          color: #29da89;
        }
        .priceInfo {
          float: left;
          width: 460px;
          border-top: 1px solid #e3e3e3;
        }
        .pianlizhi {
          float: right;
          width: 135px;
          height: 60px;
          border-radius: 5px;
          text-align: center;
          > ul {
            width: 100%;
            height: 100%;
            cursor: default;
            li {
              padding-top: 7px;
              cursor: default;
            }
          }

        }
        .bgColorBlack {
          color: #323232;
          background: #fff;
          background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fff), to(#fff));
        }
        .bgColorOne {
          color: #fff;
          background: #ffb148;
          background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ffb148), to(#ffb148));
        }
        .bgColorTwo {
          color: #fff;
          background: #ff9348;
          background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#ff8948), to(#ff9348));
        }
        .bgColorThree {
          color: #fff;
          background: #ff6f43;
          background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#fe533d), to(#FF8948));
        }
        .bgColorFour {
          color: #fff;
          background: #a9a9a9;
          background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#a9a9a9), to(#a9a9a9));
        }

        .echartsContentTopList {
          width: 100%;
          margin-top: 12px;
          > ul {
            display: flex;
            flex-wrap: wrap;
            li {
              cursor: default;
              width: 33%;
              float: left;
              line-height: 25px;
              font-size: 14px;
              color: #6b6b6b;
            }
          }
        }
      }

    }
    .echartsContentTop {
      width: 100%;
      height: 75px;
      padding: 10px 10px;
      .marketSituation {
        background: yellow;
        float: left;
        line-height: 25px;
      }
      .marketMore {
        float: right;
        width: 100px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        border-radius: 5px;
      }
    }
    .echartsContent {
      width: 100%;
      height: 300px;
      .echartsContentSide_bar {
        width: 195px;
        margin-right: 5px;
        float: left;
        .echartsSide_barlist {
          width: 100%;
          height: 65px;
          padding: 5px 10px;
          line-height: 25px;
          border: 1px solid #8d8d8d;
          .echartsSide_barLeft {
            float: left;
          }
          span {
            float: right;
          }
        }
      }
      .echartsContentRight {
        width: 455px;
        float: right;
      }

    }
    padding: 20px 0;
    background-color: #f6f6f6;
    .detaile {
      /*margin-top:20px;*/
    }
    .tabContent {
      min-height: 200px;
    }
    .lastSevenData {
      margin-top: 12px;
    }

    .listBox {
      width: 100%;
      height: 76px;
      background: #fff;
      border-bottom: 1px solid #e3e3e3;
      box-sizing: border-box;
      /*margin-bottom: 6px;*/
      /*border-radius: 4px;*/
      /*padding: 0px 12px;*/
      cursor: pointer;
      /* box-shadow: 0 1px 3px rgba(0, 0, 0, .1);
      &:hover {
        !*-moz-box-shadow: 4px 4px 10px rgba(0, 0, 0, .15);*!
        !*-webkit-box-shadow: 4px 4px 10px rgba(0, 0, 0, .15);*!
        box-shadow: 4px 4px 10px rgba(0, 0, 0, .15);
      } */
      .title {
        width: 100%;
        height: auto;
        max-height: 50px;
        line-height: 25px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        font-size: 14px;
        color: #323232;
        word-wrap: break-word;
        margin: 4px 0 2px 0;
        position: relative;
        &:hover {
          color: #ffb148;
        }
        .newtip {
          width: 33px;
          height: 16px;
          font-weight: 400;
          line-height: 1;
          position: relative;
          top: -1px;
          font-size: 13px;
          display: inline-block;
          background: #ffb148;
          color: #fff;
          text-align: center;
          border: 1px solid #ffb148;
          border-radius: 2px;
          box-sizing: border-box;
        }
      }
      .attribute {
        cursor: default;
        padding-bottom: 8px;
        span {
          display: inline-block;
          color: #aeaeae;
          font-size: 12px;
          vertical-align: middle;
        }
        .referenceNumber {
          max-width: 220px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .eltab {
      width: 33%;
      .item{
        top: -2px;
        .el-badge__content.is-fixed{
          top: 9px;
          right: 7px;
        }
      }
    }
    .el-card__header {
      padding: 10px 12px;
      color: #ffb148;
    }
    .el-card__body {
      padding: 12px;
    }
    .siftCard {
      .el-card__body {
        padding-top: 3px;
      }
    }
  }
  .el-button-more {
    float: right;
    padding: 3px 0;
    border-bottom: 1px solid !important;
    border-radius: 0;
    font-size: 12px;
  }

  .el-tabs__nav {
    width: 100%;
  }
  .jinxuanTab {
    .el-tabs__item {
      width: 33%;
      text-align: center;
    }
  }
  /*.el-tabs--top .el-tabs__item.is-top:nth-child(2) {*/
  /*padding-right: 40px;*/
  /*}*/

  /* 监管下拉框 */
  .el-select-jianguan {
    width: 70px;
  }
  .el-select-dropdown__item {
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    font-size: 12px;
  }
  .el-input--mini .el-input__inner {
    height: 25px;
    line-height: 25px;
  }
  .el-select .el-input__inner {
    padding: 0 10px 0 5px;
  }
  .x-tabs {
    .xtab-header {
      display: flex;
      justify-content: space-between;
      padding: 12px;
      border-bottom: 2px solid #e3e3e3;
      .div {
      }
    }
    .xtab-content {
    }
  }
  .listBox_Big {
    width: 100%;
    height: 106px;
    background: #fff;
    border-bottom: 1px solid #e3e3e3;
    box-sizing: border-box;
    cursor: pointer;
    .title {
      width: 100%;
      height: 25px;
      line-height: 25px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 14px;
      color: #323232;
      margin: 5px 0 5px 0;
      position: relative;
      &:hover {
        color: #ffb148;
      }
    }
    .describe {
      margin: 0;
      overflow: hidden;
      max-height: 50px;
      line-height: 25px;
      display: -webkit-box;
      color: #aeaeae;
      font-size: 12px;
      vertical-align: middle;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      word-wrap: break-word;
    }
    .attribute {
      padding-bottom: 8px;
      cursor: default;
      span {
        display: inline-block;
        color: #aeaeae;
        font-size: 12px;
        vertical-align: middle;
      }
    }
  }
  .listBox_small {
    width: 100%;
    height: 72px;
    background: #fff;
    border-bottom: 1px solid #e3e3e3;
    box-sizing: border-box;
    cursor: pointer;
    .title {
      width: 100%;
      height: auto;
      max-height: 42px;
      line-height: 21px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 14px;
      color: #323232;
      word-wrap: break-word;
      margin: 4px 0 4px 0;
      position: relative;
      &:hover {
        color: #ffb148;
      }
    }
    .describe {
      padding: 8px 0 4px 0;
      overflow: hidden;
      display: -webkit-box;
      color: #aeaeae;
      font-size: 12px;
      vertical-align: middle;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      word-wrap: break-word;
    }
    .attribute {
      cursor: default;
      padding-bottom: 8px;
      span {
        display: inline-block;
        color: #aeaeae;
        font-size: 12px;
        vertical-align: middle;
      }
    }
  }
</style>
