<template>
  <div id="institutionRisk" style="min-height: 600px">
    <el-card shadow="never" v-loading="riskLoading" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:0 16px">
      <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
          <span class="titleInner">风险检查</span>
      </div>
      <div class="align risk">
        <div class=" left">
          <p class="riskLeft">
            <img :src="$image.stockholder.danger" alt="">
            <span>重大风险</span>
            <!-- <i class="el-icon-info i-info"></i> -->
            <el-tooltip class="item" effect="light" popper-class="risk_popper" :content="dangerInfo" :visible-arrow="false" placement="right">
              <i class="el-icon-info i-info"></i>
            </el-tooltip>
            <span v-if="listImp.length > 0">共<i style="color: #FFB148">{{listImp.length}}</i>项</span>
          </p>
          <div class="riskDanger info" v-if="listImp.length > 0">
            <span v-for="(item, index) in listImp" :key="index" @click="showDetails(item.data.hits, item.label.name, item.data.total)">{{item.label.name}}</span>
          </div>
          <div class="riskTips info" v-else>
            <span class="normal">暂未发现风险</span>
          </div>
        </div>
        <div class=" right">
          <p class="riskRight">
            <img :src="$image.stockholder.tips" alt="">
            <span>提示风险</span>
            <el-tooltip class="item" effect="light" popper-class="risk_popper" :content="warnInfo" :visible-arrow="false" placement="right">
              <i class="el-icon-info i-info"></i>
            </el-tooltip>
            <span v-if="list.length > 0">共<i style="color: #FFB148">{{list.length}}</i>项</span>
          </p>
          <div class="riskTips info" v-if="list.length > 0">
            <span v-for="(item, index) in list" :key="index" @click="showDetails(item.data.hits, item.label.name, item.data.total)">{{item.label.name}}</span>
          </div>
          <div class="riskTips info" v-else>
            <span class="normal">暂未发现风险</span>
          </div>
        </div>
      </div>
    </el-card>
    <!-- <iframe width="1200" height="500" scrolling="no" src="https://api.riskstorm.com/v1/company/91100000710927046U/relation/IjkxMTAwMDAwNzEwOTI3MDQ2VSI.W_5BdA.RmJj544EZqNF8-zxxhTLvP1u04w" frameborder="0"></iframe> -->
    <!-- <el-card shadow="never" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:0 16px">
      <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
          <span class="titleInner">涉诉统计</span>
      </div>
      <div v-show="ktgg || cpws" class="echart-overview" id="echart-picture" style="height: 360px; margin-top: 10px" v-loading="echartLoading"></div>
      <div v-show="!ktgg && !cpws" style="height: 60px; position: relative">
        <vxa-not-info><span style="font-size: 14px">暂无数据</span></vxa-not-info>
      </div>
    </el-card> -->
    <el-card shadow="never" class="vxa-card-box vxa_card-b-margin compare" body-style="padding:0 16px">
      <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
          <span class="titleInner">涉诉统计</span>
      </div>
      <el-tabs class="account-tabs" v-model="tableType" @tab-click="handleClick">
        <el-tab-pane v-for="(item ,i) in accountInfoData" :key="i" :label="item.tab"
                     :name="item.type"></el-tab-pane>
      </el-tabs>
      <!-- <el-radio-group size="small" @change="pageSizeChange" v-model="tableType" style="margin-top: 10px">
        <el-radio-button :label="1">裁判文书</el-radio-button>
        <el-radio-button :label="2">开庭公告</el-radio-button>
      </el-radio-group> -->
      <el-table v-if="tableType == 0" :key="cpws" v-loading="echartLoading" size="mini" stripe :data="cpwsList" style="width: 100%">
        <el-table-column show-overflow-tooltip align="center" prop="判决时间" label="判决时间" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row['判决时间']">{{scope.row['判决时间']}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip align="center" prop="标题" label="标题" width="400">
          <template slot-scope="scope">
            <span v-if="scope.row['标题']">{{scope.row['标题']}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="案由" label="案由" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row['案由']">{{scope.row['案由']}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column class-name="party_name" align="center" prop="当事人" label="当事人">
          <template slot-scope="scope">
            <div v-if="scope.row['当事人'].length > 0">
              <ul class="relationList" v-if="scope.row.show">
                <li v-for="(item, index) in scope.row['当事人']" :key="index">
                  <p v-if="item['角色']" style="text-align: left"><i>{{item['角色'][0]}}：</i><i>{{item['名字']}}；</i></p>
                  <p v-else style="text-align: left">{{item}}</p>
                </li>
                <span class="floatDown" @click="scope.row.show = !scope.row.show">收起<i
                  class="el-icon-arrow-up"></i></span>
              </ul>
              <ul class="relationList" v-else>
                <li v-if="scope.row['当事人'].length > 0">
                  <p v-if=" scope.row['当事人'][0]['角色']" style="text-align: left"><i>{{ scope.row['当事人'][0]['角色'][0]}}：</i><i>{{ scope.row['当事人'][0]['名字']}}；</i></p>
                  <p v-else style="text-align: left">{{ scope.row['当事人'][0]}}</p>
                  <span class="floatDown" v-if="scope.row['当事人'].length > 1"
                        @click="scope.row.show = !scope.row.show">展开<i
                    class="el-icon-arrow-down"></i></span>
                </li>
              </ul>
            </div>
            <div v-else style="text-align: left">--</div>
          </template>
        </el-table-column>
      </el-table>
      <el-table v-if="tableType == 1" :key="ktgg" v-loading="echartLoading" size="mini" stripe :data="ktggList" style="width: 100%">
        <el-table-column show-overflow-tooltip align="center" prop="发布时间" label="发布时间" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row['发布时间']">{{scope.row['发布时间']}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="法院" label="法院" width="200">
          <template slot-scope="scope">
            <span v-if="scope.row['法院']">{{scope.row['法院']}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="案由" label="案由">
          <template slot-scope="scope">
            <span v-if="scope.row['案由']">{{scope.row['案由']}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column class-name="party_name" align="center" prop="当事人" label="当事人">
          <template slot-scope="scope">
            <div v-if="scope.row['当事人'].length > 0">
              <ul class="relationList" v-if="scope.row.show">
                <li v-for="(item, index) in scope.row['当事人']" :key="index">
                  <p v-if="item['角色']" style="text-align: left"><i>{{item['角色'][0]}}：</i><i>{{item['名字']}}；</i></p>
                  <p v-else style="text-align: left">{{item}}</p>
                </li>
                <span class="floatDown" @click="scope.row.show = !scope.row.show">收起<i
                  class="el-icon-arrow-up"></i></span>
              </ul>
              <ul class="relationList" v-else>
                <li v-if="scope.row['当事人'].length > 0">
                  <p v-if=" scope.row['当事人'][0]['角色']" style="text-align: left"><i>{{ scope.row['当事人'][0]['角色'][0]}}：</i><i>{{ scope.row['当事人'][0]['名字']}}；</i></p>
                  <p v-else style="text-align: left">{{ scope.row['当事人'][0]}}</p>
                  <span class="floatDown" v-if="scope.row['当事人'].length > 1"
                        @click="scope.row.show = !scope.row.show">展开<i
                    class="el-icon-arrow-down"></i></span>
                </li>
              </ul>
            </div>
            <div v-else style="text-align: left">--</div>
          </template>
        </el-table-column>
      </el-table>
      <div class="vxa-flax-box" style="margin: 30px 0" v-if="page.total > 10">
        <div class="col t-left">
          <el-pagination class="pagination-new-box" @current-change="currentChange" :current-page="page.index"
                          :page-size="page.size"
                          layout="prev, pager, next" :total="page.total" background></el-pagination>
        </div>
      </div>
    </el-card>
    <el-dialog top="13%" width="800px" id="risk" class="dialogStockHolder dialog-detail" :visible.sync="analysisD"
                append-to-body center>
      <template slot="title" class="title">小安提示</template>
      <div style="padding: 0 10px;" v-loading="detailLoading">
        <div class="content">
          <div class="el-steps el-steps--vertical">
            <div class="el-step is-vertical cicle lineTop">
              <div class="el-step__head is-finish">
                <div class="el-step__line" style="margin-right: 0px;">
                  <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
                </div>
                <div class="el-step__icon is-text">
                  <div class="el-step__icon-inner">{{total}}</div>
                </div>
              </div>
              <div class="el-step__main">
                <div class="el-step__title" style="color: #323232;font-weight: 600;font-size:16px">{{detailName}}</div>
              </div>
            </div>
            <div class="el-step is-vertical cicle" v-for="(item, index) in detailData" :key="index">
              <div class="el-step__head is-finish">
                <div class="el-step__line" style="margin-right: 0px;">
                  <i class="el-step__line-inner" style="transition-delay: 0ms; border-width: 0px; height: 0%;"></i>
                </div>
                <div class="dot"></div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '高管变动' || detailName == '企业地址变更' || detailName == '经营项目变更'">
                <div class="el-step__title is-finish">{{item['变更日期']}}</div>
                <div class="el-step__description">
                  <div class="hits">变更后：{{item['变更后']}}</div>
                  <div class="hits grayColor">变更前：{{item['变更前']}}</div>
                </div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '清算备案' || detailName == '清算中'">
                <div class="el-step__title is-finish clearfix">
                  <div class="left">{{item['变更日期']}}</div>
                  <div class="right">{{item['变更事项']}}</div>
                </div>
                <div class="el-step__description">
                  <div class="hits">变更后：{{item['变更后']}}</div>
                  <div class="hits grayColor">变更前：{{item['变更前']}}</div>
                </div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '经营异常'">
                <div class="el-step__title is-finish">{{item['列入日期']}}</div>
                <div class="el-step__description">
                  <div class="hits">{{item['异常原因']}}</div>
                  <div class="grayColor">{{item['作出决定机关']}}</div>
                </div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '失信被执行人'">
                <div class="el-step__title is-finish">{{item['发布时间']}}</div>
                <div class="el-step__description">
                  <div class="hits">{{item['被执行人的履行情况']}}&nbsp;|&nbsp;{{item['生效法律文书确定的义务']}}</div>
                  <div class="grayColor">{{item['做出执行依据单位']}}&nbsp;|&nbsp;{{item['案号']}}</div>
                </div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '注销' || detailName == '吊销'">
                <div class="el-step__title is-finish">{{item['核准日期']}}</div>
                <div class="el-step__description">
                  <div class="hits">登记状态:{{item['登记状态']}}</div>
                  <div class="hits grayColor">登记机关:{{item['登记机关']}}</div>
                </div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '重大税收违法'">
                <div class="el-step__title is-finish">{{item['发布时间']}}</div>
                <div class="el-step__description">
                  <div class="hits">{{item['案件性质']}}</div>
                  <div class="grayColor">{{item['相关法律依据及税务处理处罚情况']}}</div>
                </div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '税务非正常户'">
                <div class="el-step__title is-finish">{{item['发布期']}}</div>
                <div class="el-step__description">
                  <div class="hits">{{item['企业名称']}}</div>
                  <div class="grayColor">{{item['税务机关']}}</div>
                </div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '经营有效期逾期'">
                <div class="el-step__title is-finish">{{item['营业期限至']}}</div>
                <div class="el-step__description">
                  <div class="hits">营业期限至：{{item['营业期限至']}}</div>
                </div>
              </div>
              <div class="el-step__main el-content" v-if="detailName == '曾有欠税记录'">
                <div class="el-step__title is-finish clearfix">
                  <div class="left">{{item['发布时间']}}</div>
                  <div class="right">{{item['税种']}}</div>
                </div>
                <div class="el-step__description">
                  <div class="hits">金额：{{item['金额']}}元</div>
                  <div class="grayColor">税务机关：{{item['税务机关']}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p class="foot" v-if="total > 3">仅显示最近3条记录</p>
      </div>

    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      accountInfoData: [
        {
          tab: '裁判文书'
        },
        {
          tab: '开庭公告'
        }
      ],
      companyId: '',
      detailLoading: false,
      riskLoading: false,
      dangerInfo: '重大风险：公司破产、失信、经营异常、欠税、被执行、等严重影响公司信誉及经营活动的风险',
      warnInfo: '提示风险：公司重要成员变更、经营项目变更、发生负面新闻等可能对公司内部结构、生产经营活动产生影响的风险',
      analysisD: false,
      listImp: [],
      list: [],
      detailData: [],
      total: 0,
      detailName: '',
      echartLoading: false,
      echartData: {
        legend: [],
        data: []
      },
      ktggData: {},
      cpwsData: {},
      ktgg: true, // 开庭公告是否有数据
      cpws: true, // 裁判文书是否有数据
      dataList: [],
      page: {
        index: 1,
        size: 10,
        total: 10
      },
      tableType: '0',
      cpwsList: [],
      ktggList: []
    }
  },

  components: {},
  created() {},
  computed: {
    institutionAccountInfo: function () {
      return this.$store.state.institutionAccountInfo
    }
  },
  watch: {
    'institutionAccountInfo': function() {
      this.riskstormSearch(this.institutionAccountInfo.possessorName);
    }
  },
  mounted() {
    if (this.institutionAccountInfo.possessorName) {
      this.riskstormSearch(this.institutionAccountInfo.possessorName);
    }
  },
  methods: {
    handleClick(val) {
      if (this.tableType == 0) {
        this.riskstormCpws();
      } else if (this.tableType == 1) {
        this.riskstormKtgg();
      }
    },
    riskstormSearch(val) {
      this.riskLoading = true;
      let params = {
        requestUrl: '/v1/company/search',
        requestParams: 'keyword',
        userId: this.$cookie.get('userId'),
        requestValues: val
      }
      this.$axios.gxfApi.riskstorm(params).then(res => {
        if (res.data.hits.length > 0) {
          res.data.hits[0]['统一社会信用代码'] ? this.companyId = res.data.hits[0]['统一社会信用代码'] : this.companyId = res.data.hits[0]['注册号'];
          this.riskstormRisk();
          this.handleClick()
        } else {
          this.riskLoading = false
        }
      }).catch(err => {
        this.riskLoading = false
      })
    },
    riskstormRisk() {
      let params = {
        requestUrl: '/v1/company/' + this.companyId + '/risk',
        requestParams: 'keyword',
        userId: this.$cookie.get('userId'),
        requestValues: ''
      }
      this.$axios.gxfApi.riskstorm(params).then(res => {
        this.riskLoading = false;
        this.listImp = res.data.filter(item => {
          let e = item.label
          // return item.level == 'alert' && (e.name == '注销' || e.name == '吊销' || e.name == '清算中' || e.name == '清算备案' || e.name == '经营有效期逾期' || e.name == '失信被执行人' || e.name == '重大税收违法' || e.name == '税务非正常户' || e.name == '经营异常' || e.name == '曾有欠税记录')
          return e.name == '注销' || e.name == '吊销' || e.name == '清算中' || e.name == '清算备案' || e.name == '经营有效期逾期' || e.name == '失信被执行人' || e.name == '重大税收违法' || e.name == '税务非正常户' || e.name == '经营异常' || e.name == '曾有欠税记录'
        });
        this.list = res.data.filter(item => {
          let e = item.label
          // return item.level == 'warning' && (e.name == '高管变动' || e.name == '企业地址变更' || e.name == '经营项目变更')
          return e.name == '高管变动' || e.name == '企业地址变更' || e.name == '经营项目变更'
        })
      }).catch(err => {
        this.riskLoading = false;
      })
    },
    showDetails(data, name, total) {
      this.total = total;
      this.detailName = name;
      this.detailData = data;
      this.analysisD = true;
    },
    // 涉诉统计--开庭公告
    riskstormKtgg() {
      this.echartLoading = true
      let params = {
        requestUrl: '/v1/company/' + this.companyId + '/ktgg',
        requestParams: 'from,size',
        userId: this.$cookie.get('userId'),
        requestValues: `${(this.page.index - 1) * this.page.size},10`
      }
      this.$axios.gxfApi.riskstorm(params).then(res => {
        this.echartLoading = false
        let data = res.data.hits;
        this.ktggList = data;
        this.ktggList.forEach((item1) => {
          this.$set(item1, 'show', false);
        });
        this.page.total = res.data.total
      }).catch(err => {
        this.echartLoading = false
      })
    },
    // 涉诉统计--裁判文书
    riskstormCpws() {
      this.echartLoading = true
      let params = {
        requestUrl: '/v1/company/' + this.companyId + '/cpws',
        requestParams: 'from,size',
        userId: this.$cookie.get('userId'),
        requestValues: `${(this.page.index - 1) * this.page.size},10`
      }
      this.$axios.gxfApi.riskstorm(params).then(res => {
        this.echartLoading = false;
        if (res.data.hits) {
          let data = res.data.hits;
          this.cpwsList = data;
          this.cpwsList.forEach((item1) => {
            this.$set(item1, 'show', false);
          });
          this.page.total = res.data.total
        }
      }).catch(err => {
        this.echartLoading = false;
      })
    },
    currentChange(val) {
      this.page.index = val;
      if (this.tableType == 0) {
        this.riskstormCpws();
      } else if (this.tableType == 1) {
        this.riskstormKtgg();
      }
    },
    pageSizeChange(type) {
      this.tableType = type;
      if (type == 1) {
        this.riskstormCpws();
      } else if (type == 2) {
        this.riskstormKtgg();
      }
    },
    echartOverviewOne(id) {
        if (!!!document.getElementById(id)) {
          return false
        }
        let that = this;
        var myChart = echarts.init(document.getElementById(id));
        myChart.clear();
        var option = {
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: false
              },
              type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: function (data) {
              var html = `<div style="display:flex;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                            <span>${data[0].name}</span>
                          </div>`;
              data.forEach((item) => {
                html += `<div style="display:flex;justify-content:space-between"><span>${item.seriesName}：</span><span>${item.value}</span></div>`
              });
              return html
            }
          },
          grid: {
            top: "10%",
            left: "0%",
            right: "1%",
            bottom: "10%",
            containLabel: true
          },

          legend: {
            selectedMode: true,
            align: 'left',
            top: 0,
            left: 0,
            textStyle: {
              fontSize: 10,
              color: 'rgba(174,174,174,1)'
            },
            data: ['裁判文书案由(次)', '开庭公告案由(次)']
          },
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 30,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            boundaryGap: true,
            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: Object.keys(that.ktggData)
          }],
          yAxis: [
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              splitLine: {
                show: true
              },
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            },
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter: '{value}'
              },
              // min: 0,
              // max: 30,
              position: 'right',
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            }
          ],
          series: [
            {
              name: '裁判文书案由(次)',
              type: 'bar',
              itemStyle: {normal: {color: '#FFB148'}},
              barWidth: 10,
              // barMinHeight: 3,
              barGap: '30%',
              stack: '数量',
              data: Object.values(that.cpwsData)
            },
            {
              name: '开庭公告案由(次)',
              type: 'bar',
              itemStyle: {normal: {color: '#602221'}},
              barWidth: 10,
              // barMinHeight: 3,
              barGap: '30%',
              stack: '数量',
              data: Object.values(that.ktggData)
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      }

  }
}
</script>
<style lang='scss'>
  #risk {
    .clearfix:after{
      content: "";
      display: block;
      height: 0;
      clear: both;
      visibility: hidden;
      }

    .clearfix {
      /* 触发 hasLayout */
      zoom: 1;
    }
    .el-dialog {
      .foot {
        color: #AEAEAE;
        font-size: 12px;
        margin-top: 16px;
      }
      .content {
        max-height: 400px;
        // overflow-y: scroll;
        overflow: auto;
        .right {
          float: right;
          text-align:right;
          background: #ffb148;
          color:#fff;
          text-align:center;
          padding: 0 10px
        }
        .left {
          float: left;
        }
        .cicle {
          .el-step__line {
            background-color: #FFB148;
            display: inherit;
          }
          .dot {
            width: 12px;
            height: 12px;
            background-color: #FFB148;
            border-radius: 6px;
            margin: 0 auto;
            margin-left: 6px;
          }
        }
        .el-content {
          padding-left: 28px;
        }
        .hits {
          color: #323232;
          font-size: 14px;
          line-height: 20px;
          margin-top: 10px;
        }
        .grayColor {
          color: #8D8D8D;
          font-size: 14px;
          line-height: 20px;
          margin-top: 10px;
          margin-bottom: 16px;
        }
        .lineTop {
          height: 40px;
        }
        .el-step__main {
          width: 100%;
        }
        .el-step__icon.is-text {
          background-color: #ffb148;
          color: #fff
        }
        .el-step__icon-inner {
          font-weight: normal;
        }
        .el-step__description {
          padding-bottom: 10px;
        }
      }
    }
  }
  .risk_popper {
    width: 400px;
    color: #323232;
    text-align: left;
    line-height: 20px;
  }
  #institutionRisk {
    .el-table {
      margin: 10px 0;
      td.party_name .cell {
        .info {
          text-align: center;
          max-height: 46px;
          line-height: 1.4;
          overflow : hidden;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          text-overflow: ellipsis;
        }
      }
      .relationList {
        li {
          cursor: pointer;
          text-align: justify;
          line-height: 1.5;
          padding-top: 10px;
          &:first-child {
            padding: 0;
          }
          .lawName {
            &:hover {
              color: #ffb148;
              text-decoration: underline;
            }
          }
        }
        .floatDown {
          cursor: pointer;
          float: right;
          color: #ffb148;
          i {
            color: #ffb148;
          }
        }
      }
    }
    .titleInner {
      font-size: 14px;
      color: #323232;
    }
    .risk {
      margin: 16px 0;
      .left {
        width: 49%;
        padding-right: 10px;
        border-right: 1px solid #E3E3E3;
        vertical-align: top;
        display: inline-block;
      }
      .right {
        width: 49%;
        padding-left: 16px;
        display: inline-block;
      }
      p {
        position: relative;
        font-size: 14px;
        img {
          vertical-align: middle;
        }
        span {
          &:nth-child(4) {
            position: absolute;
            right: 0;
          }
        }
        .i-info {
          color: #d6d6d6;
          cursor: pointer;
        }
      }
      .riskLeft {
        span {
          &:nth-child(3) {
            right: 16px;
          }
        }
      }
      .riskDanger {
        span {
          color: #FB4319;
          background:rgba(251,67,25,0.1);
        }
      }
      .riskTips {
        span {
          color: #FFB148;
          background:rgba(255,177,72,0.1);
        }
      }
      .info {
        margin-top: 10px;
        span {
          display: inline-block;
          padding: 0 2px;
          height: 22px;
          line-height: 22px;
          margin: 5px 20px 5px 0;
          cursor: pointer;
          font-size: 14px;
        }
        .normal {
          color: #8D8D8D;
          display: inherit;
          text-align: center;
          background: #fff;
        }
      }
    }
  }
</style>
