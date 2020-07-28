<template>
  <div id="company">
    <div class="content">
      <el-row :gutter="12">
        <el-card class="box-card first-box" shadow="never" body-style="padding:0;">
          <el-col :span="8">
            <div class="stockLeft">
              <div style="float:left">
                <span class="stockName">{{stockName || company.companyName}}({{stockCode || company.postalCode}})</span>
                <div>
                  <span :class="stockData.color" class="stockPrice" v-if="stockData.shiFouTingPai"></span>
                  <span :class="stockData.color" class="stockPrice" v-else>{{stockData.zuiXinJia}}</span>
                  <p></p>
                  <span v-if="stockData.zhangDie != '--' && stockData.zhangDie && stockData.shiFouTingPai "
                        :class="stockData.color" class="change">{{stockData.zhangDie}}({{stockData.zhangFu}}%)</span>
                  <span v-else-if="stockData.shiFouTingPai" class="change up">停牌</span>
                  <span v-else-if="stockData.zhangDie == '--' || !stockData.zhangDie" class="change">--</span>
                  <span v-else class="change">{{stockData.zhangDie}} ({{stockData.zhangFu}}%)</span>
                </div>
              </div>
              <div class="pianlizhi" :class="dvData.color">
                <ul>
                  <li><span>偏离值</span></li>
                  <li>
                    <span v-if="stockData.shiFouTingPai">--</span>
                    <span v-else-if="bTotal != '--'">{{bTotal}}%</span>
                    <span v-else-if="bTotal == null">--</span>
                    <span v-else>{{bTotal}}</span>
                  </li>
                </ul>
              </div>
              <div style="clear:both"></div>
              <div class="infotab">
                <el-tabs v-model="activeTab">
                  <el-tab-pane label="行情数据" name="1">
                    <div class="hangqing">
                      <span class="text"> 最高<span class="result" :class="hangqingUpOrDown(moreStockData.zuiGaoJia)">{{moreStockData.zuiGaoJia || '--'}}</span></span>
                      <span class="text"> 今开<span class="result" :class="hangqingUpOrDown(moreStockData.kaiPanJia)">{{moreStockData.kaiPanJia || '--'}}</span></span>
                      <span class="text"> 最低<span class="result" :class="hangqingUpOrDown(moreStockData.zuiDiJia)">{{moreStockData.zuiDiJia || '--'}}</span></span>
                      <span class="text"> 昨收<span class="result">{{moreStockData.zuoShou || '--'}}</span></span>
                      <span class="text"> 涨停<span class="result" :class="hangqingUpOrDown(moreStockData.zhangTing)">{{moreStockData.zhangTing || '--'}}</span></span>
                      <span class="text"> 总量<span class="result" v-if="stockData.chengJiaoLiang != '--'">{{$common.autoPrice(stockData.chengJiaoLiang / 100)}}手</span>
                      <span class="result" v-else>{{moreStockData.chengJiaoLiang || '--'}}</span></span>
                      <span class="text"> 跌停<span class="result" :class="hangqingUpOrDown(moreStockData.dieTing)">{{moreStockData.dieTing || '--'}}</span></span>
                      <span class="text"> 总额<span class="result" v-if="moreStockData.chengJiaoE != '--'">{{$common.autoPrice(stockData.chengJiaoE)}}</span>
                      <span class="result" v-else>{{moreStockData.chengJiaoE || '--'}}</span></span>
                      <div class="br-line"></div>
                      <span class="text"> 换手<span class="result" v-if="moreStockData.huanShou != '--'">{{moreStockData.huanShou}}%</span>
                      <span class="result" v-else>{{moreStockData.huanShou || '--'}}</span></span>
                      <span class="text">
                        量比
                        <span class="result">
                          {{moreStockData.liangBi || '--'}}
                        </span>
                      </span>
                      <span class="text">
                        振幅
                        <span class="result" v-if="moreStockData.zhenFu!='--'">
                          {{moreStockData.zhenFu}}%
                        </span>
                      <span class="result" v-else>
                          {{moreStockData.zhenFu || '--'}}
                        </span>
                      </span>
                      <span class="text">
                        委比
                        <span class="result" v-if="moreStockData.weiBi">
                          {{moreStockData.weiBi}}%
                        </span>
                      <span class="result" v-else>
                          {{moreStockData.weiBi || '--'}}
                        </span>
                      </span>
                      <span class="text"> 市盈率（动）<span class="result">{{moreStockData.shiYingLv || '--'}}</span></span>
                      <span class="text"> 市净率<span class="result">{{moreStockData.shiJingLv || '--'}}</span></span>
                      <span class="text">市盈率（静）<span
                        class="result">{{moreStockData.jingTaiShiYingLv || '--'}}</span></span>
                      <span class="text">每股净资产<span
                        class="result">{{moreStockData.meiGuJingZiChan || '--'}}</span></span>
                      <div class="br-line"></div>
                      <span class="text">
                        总市值
                        <span class="result" v-if="moreStockData.zongShiZhi!='--' && moreStockData.zongShiZhi!='0.00'">
                          {{$common.autoPrice(moreStockData.zongShiZhi*10000)}}
                        </span>
                      <span v-else class="result">
                          {{moreStockData.zongShiZhi || '--'}}
                        </span>
                      </span>
                      <span class="text">
                        总股本
                        <span v-if="moreStockData.zongGuBen!='--' && moreStockData.zongGuBen!='0.00'" class="result">
                          {{$common.autoPrice(moreStockData.zongGuBen*10000)}}
                        </span>
                      <span v-else-if="moreStockData.zongGuBen =='0.00'" class="result">
                           0.00
                        </span>
                      <span v-else class="result">
                          {{moreStockData.zongGuBen || '--'}}
                        </span>
                      </span>
                      <span class="text">
                        流通值
                        <span v-if="moreStockData.liuTongShiZhi!='--'&& moreStockData.liuTongShiZhi!='0.00'"
                              class="result">
                          {{$common.autoPrice(moreStockData.liuTongShiZhi*10000)}}
                        </span>
                      <span v-else-if="moreStockData.liuTongShiZhi =='0.00'" class="result">
                           0.00
                        </span>
                      <span v-else class="result">
                          {{moreStockData.liuTongShiZhi || '--'}}
                        </span>
                      </span>
                      <span class="text">
                        流通股
                        <span v-if="moreStockData.wuXianShouGuHeJi!='--'&& moreStockData.wuXianShouGuHeJi!='0.00'"
                              class="result">
                          {{$common.autoPrice(moreStockData.wuXianShouGuHeJi*10000)}}
                        </span>
                      <span v-else class="result">
                          {{moreStockData.wuXianShouGuHeJi || '--'}}
                        </span>
                      </span>
                      <span class="text">52周最高<span class="result">{{moreStockData.zhouZuiGao || '--'}}</span></span>
                      <span class="text"> 股息<span class="result">{{moreStockData.mgfh || '--'}}</span></span>
                      <span class="text"> 52周最低<span class="result">{{moreStockData.zhouZuiDi || '--'}}</span></span>
                      <span class="text"> 股息收益率<span class="result">{{moreStockData.gxsyl || '--'}}<span
                        v-if="moreStockData.gxsyl!='--'">%</span></span>
                      </span>
                    </div>
                  </el-tab-pane>
                  <el-tab-pane v-if="dvData.industry" label="偏离值" name="2">
                    <el-table :data="dvData.data" size="mini" v-if="dvData.color" @row-click="stockRowClick">
                      <el-table-column prop="name" label="证券简称">
                      </el-table-column>
                      <el-table-column align="center" label="涨跌幅">
                        <el-table-column prop="jinRiZhangDie" show-overflow-tooltip align="right" width="70px"
                                         :label="`${$common.transTime(dvData.data[1].jinRi)[3]}`">
                          <template slot-scope="scope">
                            <span v-if="scope.row.jinRiZhangDie == null">
                            --
                          </span>
                            <span :class="scope.row.jinRiZhangDie>0?'up':'down'" v-else>
                            {{`${scope.row.jinRiZhangDie.toFixed(2)}%`}}
                          </span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="zuoRiZhangDie" show-overflow-tooltip align="right" width="70px"
                                         :label="`${$common.transTime(dvData.data[1].zuoRi)[3]}`">
                          <template slot-scope="scope">
                            <span v-if="scope.row.zuoRiZhangDie == null">
                            --
                          </span>
                            <span :class="scope.row.zuoRiZhangDie>0?'up':'down'" v-else>
                            {{`${scope.row.zuoRiZhangDie.toFixed(2)}%`}}
                          </span>
                          </template>
                        </el-table-column>
                        <el-table-column prop="qianRiZhangDie" width="70px" align="right" show-overflow-tooltip
                                         :label="`${$common.transTime(dvData.data[1].qianRi)[3]}`">
                          <template slot-scope="scope">
                            <span v-if="scope.row.qianRiZhangDie == null">
                            --
                          </span>
                            <span :class="scope.row.qianRiZhangDie>0?'up':'down'" v-else>
                            {{`${scope.row.qianRiZhangDie.toFixed(2)}%`}}
                          </span>
                          </template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column prop="shiYingLv" width="70px" show-overflow-tooltip align="right"
                                       label="市盈率(动态)">
                        <template slot-scope="scope">
                          <span v-if="scope.row.shiYingLv == null">
                            --
                          </span>
                          <span v-else>
                            {{`${scope.row.shiYingLv.toFixed(2)}`}}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <p
                      style="text-align:center;font-size:12px;font-weight:bold;padding:8px 0px;border-bottom:1px solid #e3e3e3">
                      {{dvData.industry}}</p>
                    <el-table :data="sameIndustryStockInfo" size="mini" v-if="dvData.color" :show-header="false"
                              v-loading="isLoading" height="156px" @row-click="stockRowClick">
                      <el-table-column prop="name" label="证券简称">
                      </el-table-column>
                      <el-table-column prop="jinRiZhangDie" width="70px" align="right" show-overflow-tooltip
                                       :label="`${$common.transTime(dvData.data[1].jinRi)[3]}`">
                        <template slot-scope="scope">
                          <span v-if="scope.row.jinRiZhangDie == null">
                            --
                          </span>
                          <span :class="scope.row.jinRiZhangDie>0?'up':'down'" v-else>
                            {{`${scope.row.jinRiZhangDie.toFixed(2)}%`}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="zuoRiZhangDie" width="70px" align="right" show-overflow-tooltip
                                       :label="`${$common.transTime(dvData.data[1].zuoRi)[3]}`">
                        <template slot-scope="scope">
                          <span v-if="scope.row.zuoRiZhangDie == null">
                            --
                          </span>
                          <span :class="scope.row.zuoRiZhangDie>0?'up':'down'" v-else>
                            {{`${scope.row.zuoRiZhangDie.toFixed(2)}%`}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="qianRiZhangDie" width="70px" align="right" show-overflow-tooltip
                                       :label="`${$common.transTime(dvData.data[1].qianRi)[3]}`">
                        <template slot-scope="scope">
                          <span v-if="scope.row.qianRiZhangDie == null">
                            --
                          </span>
                          <span :class="scope.row.qianRiZhangDie>0?'up':'down'" v-else>
                            {{`${scope.row.qianRiZhangDie.toFixed(2)}%`}}
                          </span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="shiYingLv" width="70px" align="right" show-overflow-tooltip label="市盈率">
                        <template slot-scope="scope">
                          <span v-if="scope.row.shiYingLv == null">
                            --
                          </span>
                          <span v-else>
                            {{`${scope.row.shiYingLv.toFixed(2)}`}}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination small v-if="sameIndustryStockInfo.length>0" style="margin:4px auto;width:200px"
                                   layout="prev, pager, next" @current-change="handleCurrentChange"
                                   :current-page.sync="pageNum" :total="total" :page-size="6">
                    </el-pagination>
                  </el-tab-pane>
                  <el-tab-pane v-if="dvData.industry" label="换手率" name="3">
                    <el-table :data="thrunoverInfoArr" size="mini" v-if="thrunoverInfoArr.length>0">
                      <!--@row-click="stockRowClick"-->
                      <el-table-column prop="name" label="证券简称">
                      </el-table-column>
                      <el-table-column label="累计换手率/ (倍数)" align="center">
                        <el-table-column show-overflow-tooltip width="70px" align="right" label="当日">
                          <template slot-scope="scope">
                            <p v-if="scope.row.todayThurnover != null" :class="{'up': scope.row.todayThurnover>=20}">
                              {{`${(scope.row.todayThurnover*1).toFixed(2)}%`}}
                            </p>
                            <p v-else>
                              --
                            </p>
                            <p :class="{'up': scope.row.todayRatio>=30}">
                              ({{$common.autoPrice(scope.row.todayRatio)}})</p>
                          </template>
                        </el-table-column>
                        <el-table-column show-overflow-tooltip align="right" width="70px" label="前两日">
                          <template slot-scope="scope">
                            <p v-if="scope.row.twoDaysThurnover != null">
                              {{`${(scope.row.twoDaysThurnover*1).toFixed(2)}%`}}
                            </p>
                            <p v-else>
                              --
                            </p>
                            <p>({{$common.autoPrice(scope.row.twoDaysRatio)}})</p>
                          </template>
                        </el-table-column>
                        <el-table-column width="70px" show-overflow-tooltip align="right" label="前三日">
                          <template slot-scope="scope">
                            <p v-if="scope.row.threeDaysThurnover != null">
                              {{`${(scope.row.threeDaysThurnover*1).toFixed(2)}%`}}
                            </p>
                            <p v-else>
                              --
                            </p>
                            <p>({{scope.row.threeDayRatio}})</p>
                          </template>
                        </el-table-column>
                      </el-table-column>
                      <el-table-column prop="shiYingLv" width="70px" show-overflow-tooltip align="right" label="市盈率">
                        <template slot-scope="scope">
                          <span v-if="scope.row.shiYingLv == null">
                            --
                          </span>
                          <span v-else>
                            {{`${(scope.row.shiYingLv*1).toFixed(2)}`}}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <p
                      style="text-align:center;font-size:12px;font-weight:bold;padding:8px 0px;border-bottom:1px solid #e3e3e3">
                      {{dvData.industry}}</p>
                    <el-table :data="sameIndustryThrunoverInfo" size="mini" v-if="sameIndustryThrunoverInfo.length>0"
                              :show-header="false" v-loading="isLoading" height="147px" @row-click="stockRowClick">
                      <el-table-column prop="name" label="证券简称">
                      </el-table-column>
                      <el-table-column width="70px" align="right" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <p v-if="scope.row.todayThurnover != null">
                            {{`${(scope.row.todayThurnover*1).toFixed(2)}%`}}
                          </p>
                          <p v-else>
                            --
                          </p>
                          <p>({{$common.autoPrice(scope.row.todayRatio)}})</p>
                        </template>
                      </el-table-column>
                      <el-table-column width="70px" align="right" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <p v-if="scope.row.twoDaysThurnover != null"
                             :class="{'exception':scope.row.twoDaysThurnover>=20}">
                            {{`${(scope.row.twoDaysThurnover*1).toFixed(2)}%`}}
                          </p>
                          <p v-else>
                            --
                          </p>
                          <p>({{$common.autoPrice(scope.row.twoDaysRatio)}})</p>
                        </template>
                      </el-table-column>
                      <el-table-column width="70px" align="right" show-overflow-tooltip>
                        <template slot-scope="scope">
                          <p v-if="scope.row.threeDaysThurnover != null">
                            {{`${(scope.row.threeDaysThurnover*1).toFixed(2)}%`}}
                          </p>
                          <p v-else>
                            --
                          </p>
                          <p>({{$common.autoPrice(scope.row.threeDayRatio)}})</p>
                        </template>
                      </el-table-column>
                      <el-table-column prop="shiYingLv" width="70px" align="right" show-overflow-tooltip label="市盈率">
                        <template slot-scope="scope">
                          <span>
                            {{`${(scope.row.shiYingLv*1).toFixed(2)}`}}
                          </span>
                        </template>
                      </el-table-column>
                    </el-table>
                    <el-pagination v-if="sameIndustryThrunoverInfo.length>0" small style="margin:4px auto;width:200px"
                                   layout="prev, pager, next" @current-change="handleCurrentChange2"
                                   :current-page.sync="pageNum2" :total="total2" :page-size="3">
                    </el-pagination>
                  </el-tab-pane>
                </el-tabs>
              </div>
              <div class="updateTime">数据更新时间：{{$common.transTime(updateTime)[4]}}</div>
            </div>
          </el-col>
          <el-col :span="16">
            <div class="search-box">
              <el-row :gutter="10">
                <el-col :span="10">
                  <v-stock-search v-if="userInfo.enterpriseUser"
                                  @onAddAttentionSuccess="onAddAttentionSuccess"></v-stock-search>
                </el-col>
                <el-col :span="6" :offset="8" v-if="isGuest && userInfo.enterpriseUser">
                  <el-button v-if="!isAttention" type="primary" size="mini" @click="addToAttention">+关注</el-button>
                  <el-button v-if="isAttention" size="mini" type="info" @click="cancelAttention">已关注</el-button>
                  <el-button type="text" size="mini" @click="$router.push('/market-condition')"
                             style="margin-left: 10px">返回市场行情
                  </el-button>
                </el-col>
              </el-row>
            </div>
            <div class="market-item">
              <market-for-company :componyCodeR="company.companyFullCode"
                                  v-if="company.companyFullCode"></market-for-company>
            </div>
          </el-col>
        </el-card>
      </el-row>
      <el-row :gutter="12" v-if="userInfo.enterpriseUser">
        <el-card class="box-card bottom" shadow="never" body-style="padding:0">
          <div class="wrapper">
            <v-companyInfo :companyCode="company.companyFullCode" :company="company" v-if="company.companyFullCode"
                           :is-guest="isGuest"></v-companyInfo>
          </div>
        </el-card>
      </el-row>
    </div>
  </div>
</template>
<script>
  import capitalItem from "../enterprises/components/dashboard/capitalItem";
  import MarketForCompany from "../enterprises/components/dashboard/marketForCompany";
  import dashboardCalendar from "../enterprises/components/dashboard/calendar"; // 待办事项
  import sift from "../enterprises/components/dashboard/sift"; // 信乎精选，信公精选，团队收藏
  import companyInfo from "../enterprises/components/dashboard/companyInfo"; // 公司信息（资金，新闻，简况，公告，研报，互动e）
  import stockSearch from '@/view/condition/components/stockSearch'

  export default {
    name: 'company-condition',
    data() {
      return {
        userInfo: {},
        company: {},
        userId: "",
        lawList: [],
        caseList: [],
        stockData: {
          color: "up"
        },
        isGuest: true,
        isAttention: false,
        moreStockData: {},
        // 偏离值
        dvData: {},
        bTotal: "--",
        stockName: "",
        stockCode: "",
        marketSituationList: [],
        superviseDynamicList: [],
        tabf10: "1",
        tabBacklog: "1",
        tabLastSevenDay: "1",
        // marketSituation: '2018年06月05日',
        optionsJianguan: [
          {value: "全部", label: "全部"},
          {value: "证监会", label: "证监会"},
          {value: "上交所", label: "上交所"},
          {value: "深交所", label: "深交所"}
        ],
        valueJianguan: "全部",
        interval: null,
        activeTab: "1",
        searchCompanyCode: "",
        bar: [
          {name: "资金", type: "main", active: true, link: "/finance/main"},
          {
            name: "新闻",
            type: "financials",
            active: false,
            link: "/finance/financials"
          },
          {
            name: "论坛",
            type: "comparison",
            active: false,
            link: "/finance/comparison"
          },
          {
            name: "简介",
            type: "analyse",
            active: false,
            link: "/finance/analyse"
          },
          {
            name: "公告",
            type: "analyse",
            active: false,
            link: "/finance/analyse"
          },
          {
            name: "研报",
            type: "analyse",
            active: false,
            link: "/finance/analyse"
          },
          {
            name: "互动e",
            type: "analyse",
            active: false,
            link: "/finance/analyse"
          }
        ],
        updateTime: "",
        sameIndustryStockInfo: [],
        pageNum: 1,
        total: 1,
        thrunoverInfoArr: [],
        sameIndustryThrunoverInfo: [],
        pageNum2: 1,
        total2: 1,
        isLoading: true
      };
    },
    // 使用其它组件
    components: {
      capitalItem,
      MarketForCompany,
      "v-dashboardCalendar": dashboardCalendar,
      "v-sift": sift,
      "v-companyInfo": companyInfo,
      "v-stock-search": stockSearch
    },
    watch: {
      activeTab(val) {
        window.clearInterval(this.interval);
        this.reData(val);
      },
      $route: function (val) {
        window.clearInterval(this.interval)
        this.userId = this.$cookie.get("userId");
        this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
        this.initData();
        this.reData();
      }
    },
    created() {
      this.userId = this.$cookie.get("userId")
      if (this.userId) {
        this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      }
      this.initData();
      this.reData();
    },
    mounted() {
    },
    destroyed() {
      console.log('destroyed')
      window.clearInterval(this.interval);
    },
    methods: {
      // 实时刷新
      reData(val) {
        window.clearInterval(this.interval)
        var _this = this;
        if (val == "2") {
          if (this.sameIndustryStockInfo.length <= 0) {
            this.isLoading = true;
          }
          this.getSameIndustryStockInfo();
          this.interval = setInterval(() => {
            console.log("行情刷新");
            _this.stockInfo();
            _this.moreInfo();
            _this.deviationValue();
            // _this.marketSituation();
            // console.log(_this.optionDate)
            _this.getSameIndustryStockInfo();
          }, 10 * 1000);
        } else if (val == "3") {
          if (this.sameIndustryThrunoverInfo.length <= 0) {
            this.isLoading = true;
          }
          this.getThrunoverInfo();
          this.interval = setInterval(() => {
            console.log("行情刷新");
            _this.stockInfo();
            _this.moreInfo();
            _this.deviationValue();
            // _this.marketSituation();
            // console.log(_this.optionDate)
            _this.getThrunoverInfo();
          }, 10 * 1000);
        } else {
          this.interval = setInterval(() => {
            console.log("行情刷新");
            _this.stockInfo();
            _this.moreInfo();
            _this.deviationValue();
            // _this.marketSituation();
            // console.log(_this.optionDate)
          }, 10 * 1000);
        }
      },
      initData() {
        if (this.$route.params.code) {
          this.isGuest = true;
          this.$http({
            method: "GET",
            url: this.$api.stock.searchStock,
            params: {
              userId: this.userId,
              searchStr: this.$route.params.code.substr(2),
              searchKeyWord: this.$route.params.code.substr(2)
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.isAttention = !!res.data.returnObject[0].status;
              this.company.companyFullCode = res.data.returnObject[0].fullCode;
              this.company.companyCode = res.data.returnObject[0].code;
              this.afterInitData();
            } else {
              this.$router.replace({path: '/index'});
            }
          }).catch(err => {
          });
        } else {
          this.isGuest = false;
          this.getCompany();
        }
        this.lawSearch();
        this.caseSearch();
        this.superviseDynamic();
        // this.stockInfo()
        // this.deviationValue()
        // this.marketSituation()
      },
      afterInitData() {
        this.stockInfo();
        this.moreInfo();
        this.deviationValue();
        // this.marketSituation();
      },
      // 获取当前所在公司的信息
      getCompany() {
        console.log(this.userInfo);
        if (this.userInfo.companyId === null || this.userInfo.companyId === "") {
          //  this.$message({showClose: true, type: "error", message: "非公司用户！"});
          // debugger
          if (this.userInfo.companyCode) {
            let code = '';
            if (this.userInfo.companyCode.substring(0, 2) == '60') {
              code = 'SH' + this.userInfo.companyCode;
            } else {
              code = 'SZ' + this.userInfo.companyCode;
            }
            this.$router.replace('/company-condition/' + code);
          } else {
            this.$message({showClose: true, type: 'error', duration: 3000, message: '非上市公司暂无行情信息，请先设置公司信息'});
            this.$router.replace('/manage/person');
          }
        } else {
          this.$http({
            method: "GET",
            url: this.$api.manage.companyInfo,
            params: {
              companyId: this.userInfo.companyId
            }
          }).then(res => {
            if (res.data.returnCode === 1) {
              this.company = res.data.returnObject;
              this.afterInitData();
            }
          });
        }
      },
      // 监管动态
      superviseDynamic() {
        let stype = this.valueJianguan == "全部" ? "" : this.valueJianguan;
        this.$http({
          method: "GET",
          url: this.$api.supervise.superviseDynamic,
          params: {
            type: stype,
            pageNo: 1,
            pageSize: 6
          }
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.superviseDynamicList =
              res.data.returnObject.superviseDynamicList;
          }
        });
      },
      // 案例
      caseSearch() {
        this.$http({
          method: "POST",
          url: this.$api.cases.searchC,
          data: {
            sortType: "处理日期",
            userId: this.userId,
            pageNo: 1,
            pageSize: 6
          }
        }).then(res => {
          if (res.data.returnCode == 1) {
            this.caseList = res.data.returnObject.list;
          }
        });
      },
      // 法规
      lawSearch() {
        this.$http({
          method: "GET",
          url: this.$api.rule.lawSearch,
          params: {
            pageNo: 1, // 页码
            pageSize: 6, // 每页行数
            type: "law",
            sortType: "发布日期", // 搜索排序，时间排序time
            userId: this.userId
          }
        }).then(res => {
          if (res.data.returnCode == 1) {
            this.lawList = res.data.returnObject.list;
          }
        });
      },
      stockInfo() {
        this.$http({
          method: "GET",
          url: this.$api.stock.getStockInfo,
          params: {
            obj: this.company.companyFullCode
          }
        })
          .then(res => {
            if (res.data.returnCode == 1) {
              this.stockData = res.data.returnObject.data;
              const data = res.data.returnObject.data;
              if (this.stockData.shiFouTingPai) {
                this.$set(this.stockData, "chengJiaoE", "--");
                this.$set(this.stockData, "chengJiaoLiang", "--");
                this.$set(this.stockData, "huanShou", "--");
                this.$set(this.stockData, "zhangDie", "--");
                this.$set(this.stockData, "zhangFu", "--");
                this.$set(this.stockData, "zuiDiJia", "--");
                this.$set(this.stockData, "zuiGaoJia", "--");
                this.$set(this.stockData, "zuiXinJia", "--");
                this.$set(this.stockData, "kaiPanJia", "--");
                // this.$set(this.stockData,'zuiGaoJia', '--)'
              } else {
                this.$set(
                  this.stockData,
                  "chengJiaoE",
                  data.chengJiaoE.toFixed(2)
                );
                this.$set(
                  this.stockData,
                  "chengJiaoLiang",
                  data.chengJiaoLiang.toFixed(2)
                );
                this.$set(this.stockData, "huanShou", data.huanShou.toFixed(2));
                this.$set(this.stockData, "zhangDie", data.zhangDie.toFixed(2));
                this.$set(this.stockData, "zhangFu", data.zhangFu.toFixed(2));
                this.$set(this.stockData, "zuiDiJia", data.zuiDiJia.toFixed(2));
                this.$set(this.stockData, "zuiGaoJia", data.zuiGaoJia.toFixed(2));
                this.$set(this.stockData, "zuiXinJia", data.zuiXinJia.toFixed(2));
                this.$set(this.stockData, "kaiPanJia", data.kaiPanJia.toFixed(2));

                if (this.stockData.zhangDie > 0) {
                  this.$set(this.stockData, "color", "up");
                } else {
                  this.$set(this.stockData, "color", "down");
                }
              }
            }
          })
          .catch(err => {
          });
      },
      onAddAttentionSuccess(fullCode) {
        this.$router.push({path: '/company-condition/' + fullCode});
      },
      moreInfo() {
        this.$http({
          method: "GET",
          url: this.$api.stock.getMore,
          params: {
            code: this.company.companyFullCode
          }
        })
          .then(res => {
            if (res.data.returnCode == 1) {
              for (let i in res.data.returnObject) {
                const prop = res.data.returnObject[i];
                if (prop == null) {
                  this.$set(this.moreStockData, i, "--");
                } else if (prop == "0") {
                  this.$set(this.moreStockData, i, "0.00");
                } else if (prop / 1) {
                  this.$set(this.moreStockData, i, prop.toFixed(2));
                }
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
      },
      deviationValue() {
        this.$http({
          method: "GET",
          url: this.$api.stock.getDeviationValue,
          params: {
            code: this.company.companyFullCode
          }
        }).then(res => {
          // res.data.returnObject = null
          if (res.data.returnCode == 1 && res.data.returnObject != null) {
            this.dvData = res.data.returnObject;
            this.updateTime = res.data.returnObject.apiDate;
            this.stockName = this.dvData.data[0].name;
            this.stockCode = this.dvData.data[0].code;
            this.bTotal = this.dvData.bTotal;
            this.dvData.apiDate = this.$common.transTime(this.dvData.apiDate)[0];
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
                //   if(comCode.indexOf('SH') == -1 && comCode.indexOf('SZ') == 0)
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
            this.getThrunoverInfo()
          } else {

          }
        })
      },
      // marketSituation() {
      //   this.$http({
      //     method: "GET",
      //     url: this.$api.stock.listMarketSituation,
      //     params: {
      //       companyId: this.company.id
      //     }
      //   }).then(res => {
      //     if (res.data.returnCode == 1) {
      //       this.marketSituationList = res.data.returnObject;
      //     }
      //   });
      // },
      hangqingUpOrDown(price) {
        const zuoShou = this.moreStockData.zuoShou;
        const kaiPanJia = this.moreStockData.kaiPanJia;
        if (!zuoShou || kaiPanJia == '--' || kaiPanJia == '0.00') {
          return "grey"
        }
        return parseFloat(zuoShou) > parseFloat(price) ? "down" : "up";
      },
      getSameIndustryStockInfo() {
        // 同行业行情
        console.log("tong");
        this.$http({
          url: this.$api.stock.getSameIndustryStockInfo,
          method: "GET",
          params: {
            industry: this.dvData.industry,
            apiDate: this.dvData.apiDate,
            code: this.company.companyCode,
            pageNum: this.pageNum,
            pageSize: 6
          }
        }).then(res => {
          this.isLoading = false;
          this.sameIndustryStockInfo = res.data.returnObject;
          this.total = res.data.total;
        });
      },
      addToAttention() {
        this.$http({
          method: "GET",
          url: this.$api.stock.addAttention,
          params: {
            userId: this.$cookie.get('userId'),
            companyId: this.company.companyCode,
            companyFullCode: this.company.companyFullCode
          }
        }).then(res => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.$message({type: 'success', message: '关注成功'});
            this.isAttention = true;
          }
        }).catch(err => {
        });
      },
      cancelAttention() {
        this.$confirm('确认取消关注该股票？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: "GET",
            url: this.$api.stock.deleteAttention,
            params: {
              companyFullCode: this.company.companyFullCode,
              userId: this.$cookie.get('userId')
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '取消关注成功'});
              this.isAttention = false;
            }
          }).catch(err => {
          });
        }).catch(err => {
        });
      },
      handleCurrentChange() {
        this.isLoading = true;
        this.getSameIndustryStockInfo();
      },
      handleCurrentChange2() {
        this.isLoading = true;
        this.getSameIndustryThrunoverInfo();
      },
      getThrunoverInfo() {
        console.log("thrun");
        this.$http({
          url: this.$api.stock.getThrunoverInfo,
          method: "GET",
          params: {
            code: this.company.companyFullCode
          }
        }).then(res => {
          this.thrunoverInfoArr = [];
          this.thrunoverInfoArr.push(res.data.returnObject);
          this.getSameIndustryThrunoverInfo();
        });
      },
      getSameIndustryThrunoverInfo() {
        this.$http({
          url: this.$api.stock.getSameIndustryThrunoverInfo,
          method: "GET",
          params: {
            industry: this.dvData.industry,
            biShi: this.stockData.biShi,
            code: this.company.companyCode,
            pageNum: this.pageNum2,
            pageSize: 3
          }
        }).then(res => {
          this.isLoading = false;
          this.sameIndustryThrunoverInfo = res.data.returnObject;
          this.total2 = res.data.total;
        });
      },
      stockRowClick(e) {
        let code = '';
        if (e.code.substring(0, 2) == '60') {
          code = 'SH' + e.code;
        } else {
          code = 'SZ' + e.code;
        }
        this.$router.push({path: '/company-condition/' + e.code})
      }
    }
  }
</script>
<style lang="scss">
  #company {
    background-color: #f6f6f6;
    min-height: 770px;
    .box-card {
      .el-table {
        td {
          cursor: pointer;
        }
      }
      min-height: 500px;
      width: 100%;
      margin-bottom: 20px;
      &.first-box {
        margin-top: 20px;
      }
      .box-tabs {
        display: flex;
        height: 45px;
        align-items: center;
        border-bottom: 1px solid #e3e3e3;
        li {
          height: 100%;
          text-align: center;
          line-height: 45px;
          width: 120px;
          position: relative;
          * {
            cursor: pointer;
          }
          &:after {
            content: "";
            position: absolute;
            right: 0;
            height: 20px;
            width: 2px;
            background-color: #f0f1f5;
            top: 50%;
            transform: translateY(-50%);
          }
          &.active {
            color: #ffb148;
            .bar {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 2px;
              background-color: #ffb148;
              margin: 0 auto;
              width: 70%;
            }
          }
          .text {
            height: 100%;
            width: 100%;
            position: relative;
            display: inline-block;
          }
        }
      }
    }
    .bottom {
      margin-bottom: 20px;
      .el-card-body {
        padding: 0;
      }
      .wrapper {
        // margin: 0px 10px;
      }
    }
    .stockLeft {
      margin: 10px 0px;
      padding: 0px 12px;
      border-right: 1px solid #e3e3e3;
      .stockName {
        color: #323232;
        font-size: 17px;
      }
      .updateTime {
        float: right;
        margin-top: 20px;
        color: #8d8d8d;
        font-size: 12px;
      }
      .stockPrice {
        display: inline-block;
        /*color: #fa4319;*/
        font-size: 30px;
        margin-right: 10px;
        font-weight: 500;
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
      .grey {
        color: #606266
      }
      .infotab {
        margin-top: 10px;
        width: 100%;
        height: 400px;
        td {
          padding: 1px;
        }
        .hangqing {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: space-between;
          .br-line {
            width: 100%;
            height: 1px;
            background-color: #e3e3e3;
            margin: 6px 0px;
          }
          .text {
            width: 45%;
            margin: 2px 0px;
            font-size: 12px;
            color: #606266;
            .result {
              float: right;
            }
          }
        }
      }
      .pianlizhi {
        /*border: 1px solid #e3e3e3;*/
        float: right;
        height: 60px;
        border-radius: 5px;
        width: 100px;
        margin-top: 10px;
        text-align: center;
        > ul {
          width: 100%;
          height: 100%;
          cursor: default;
          li {
            margin-top: 7px;
            color: white;
            cursor: default;
          }
        }
      }
      .bgColorOne {
        background-color: #ffb148;
      }
      .bgColorTwo {
        background-color: #ff9348;
      }
      .bgColorThree {
        background-color: #ff6f43;
      }
      .bgColorFour {
        background-color: #a9a9a9;
      }

      .echartsContentTopList {
        width: 100%;
        margin-top: 5px;

        > ul {
          display: flex;
          flex-wrap: wrap;
          li {
            width: 33%;
            float: left;
            line-height: 25px;
            font-size: 14px;
            color: #6b6b6b;
          }
        }
      }
    }
    .search-box {
      padding-top: 10px;
    }
    .market-item {
      width: 100%;
      margin: 10px 0px;
    }
  }
  .listBox {
    width: 100%;
    height: 74px;
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
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 14px;
      color: #323232;
      word-wrap: break-word;
      margin: 8px 0 5px 0;
      position: relative;
      &:hover {
        color: #ffb148;
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
      height: auto;
      max-height: 50px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 1;
      font-size: 14px;
      color: #323232;
      word-wrap: break-word;
      margin: 8px 0 5px 0;
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
    height: 75px;
    background: #fff;
    border-bottom: 1px solid #e3e3e3;
    box-sizing: border-box;
    cursor: pointer;
    .title {
      width: 100%;
      height: auto;
      max-height: 50px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      font-size: 14px;
      color: #323232;
      word-wrap: break-word;
      margin: 8px 0 5px 0;
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
  .bottom {
    .dashboard-companyInfo {
      padding: 5px 10px;
    }
    .exception {
      color: #F56C6C !important
    }
  }
</style>
