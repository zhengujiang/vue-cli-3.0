<template>
  <el-row :gutter="16" id="regulatorOverview">
    <el-col :span="9">
      <el-card shadow="never" class="box-card">
        <div slot="header">
          <span class="title" v-if="companyCodes">监管公司概览({{companyCodes.split(',').length}}家)</span>
          <span class="title" v-else>监管公司概览(0家)</span>
          <div class="set-buttom" @click="showCompanySet">
            <img class="set-img" :src="$image.dashboard.set">设置
          </div>
        </div>
        <div class="card-content">
          <div class="top-count-box">
            <div class="count-detaile border-right">
              <div class="count">
                <a :href="'/affiche?inputCode='+ encodeURIComponent('监管公司')+'&releaseStart='+dataTimeNow+'&releaseEnd='+dataTimeNow" target="_blank">
                  <span>{{superviseData.announce.viewNumber}}</span>
                </a>
              </div>
              <div>公告</div>
            </div>
            <div class="count-detaile">
              <div class="count">
                <a :href="'/report?inputCode='+ encodeURIComponent('监管公司')+'&releaseStart='+dataTimeNow+'&releaseEnd='+dataTimeNow" target="_blank">
                  <span>{{superviseData.report.viewNumber}}</span>
                </a>
              </div>
              <div>研报</div>
            </div>
          </div>
          <div class="middle-count-box">
            <div class="count">
              <a href="/market-condition?index=supervise" target="_blank">
                <span>{{superviseData.marketValue.viewNumber}}</span>
              </a>

            </div>
            <div>总市值（亿元）</div>
          </div>
          <div class="update-time">更新于{{dateNow}}</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card shadow="never" class="box-card">
        <div slot="header">
          <span class="title">预警</span>
          <el-date-picker class="data-picker" v-model="warnTime" :editable="false" :clearable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" size="mini" placeholder="选择日期" @change="warningoverview"></el-date-picker>
        </div>
        <div class="card-content">
          <div class="top-count-box">
            <div class="count-detaile border-right">
              <div class="warm-count">
                <a :href="'/abnormal-condition?from=supervise&starttime='+warnTime.replace(/\//g, '-')+'&endtime='+warnTime.replace(/\//g, '-')" target="_blank">
                  <span>{{warnData.transaction.viewNumber}}</span>
                </a>
              </div>
              <div>异动</div>
            </div>
            <div class="count-detaile">
              <div class="warm-count"><span>{{warnData.sentiment.viewNumber}}</span></div>
              <div>负面舆情</div>
            </div>
          </div>
          <div class="middle-count-box">
            <div class="warm-count">
              <a :href="'/case?inputCode='+encodeURIComponent('监管公司')+'&releaseStart='+warnTime.replace(/\//g, '-')+'&releaseEnd='+warnTime.replace(/\//g, '-')" target="_blank">
              <span>{{warnData.violateCase.viewNumber}}</span>
              </a>
            </div>
            <div>违规案例</div>
          </div>
          <div class="update-time">更新于{{warnData.dateNow}}</div>
        </div>
      </el-card>
    </el-col>
    <el-col :span="7">
      <el-card shadow="never" class="box-card">
        <div slot="header">
          <span class="title">市场概览</span>
          <el-date-picker class="data-picker" v-model="markeTime" :editable="false" :clearable="false" value-format="yyyy-MM-dd" format="yyyy-MM-dd"  type="date" size="mini" placeholder="选择日期" @change="marketoverview"></el-date-picker>
        </div>
        <div class="card-content">
          <div class="top-count-box">
            <div class="count-detaile border-right">
              <div class="count">
                <a :href="'/rule?releaseStart='+markeTime.replace(/\//g, '-')+'&releaseEnd='+markeTime.replace(/\//g, '-')" target="_blank">
                  <span>{{marketData.rule.viewNumber}}</span>
                </a>
              </div>
              <div>新规</div>
            </div>
            <div class="count-detaile">
              <div class="count">
                <a :href="'/activities?starttime='+markeTime.replace(/\//g, '-')+'&endtime='+markeTime.replace(/\//g, '-')" target="_blank">
                  <span>{{marketData.superviseDynamic.viewNumber}}</span>
                </a>
              </div>
              <div>监管动态</div>
            </div>
          </div>
          <div class="middle-count-box">
            <div class="count"><span>{{marketData.marketSentiment.viewNumber}}</span></div>
            <div>市场舆情</div>
          </div>
          <div class="update-time">更新于{{marketData.dateNow}}</div>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    data() {
      return {
        dataTimeNow: '',
        dataNow: '',
        warnTime: '',
        markeTime: '',
        superviseData: {
          announce: {viewNumber: 0},
          report: {viewNumber: 0},
          marketValue: {viewNumber: 0}
        },
        warnData: {
          transaction: {viewNumber: 0},
          sentiment: {viewNumber: 0},
          violateCase: {viewNumber: 0},
          dateNow: '00:00'
        },
        marketData: {
          rule: {viewNumber: 0},
          superviseDynamic: {viewNumber: 0},
          marketSentiment: {viewNumber: 0},
          dateNow: '00:00'
        }
      }
    },
    props: {
      companyCodes: String
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      companyCodes: function (val) {
        if (val) {
          this.initData()
        }
      }
    },
    // 生命周期函数
    created() {
      this.dataTimeNow = this.$common.getNowDate().replace(/\//g, '-')
      this.initData()
    },
    mounted() {
    },
    // 方法
    methods: {
      showCompanySet () {
        this.$emit('showCompanySet')
      },
      getNewData () {
        let h = new Date().getHours()
        let m = new Date().getMinutes()
        return (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m)
      },
      initData () {
        let h = new Date().getHours()
        let m = new Date().getMinutes()
        this.dateNow = (h > 9 ? h : '0' + h) + ':' + (m > 9 ? m : '0' + m)

        this.warnTime = this.$common.getNowDate()
        this.markeTime = this.$common.getNowDate()
        this.getAllSuperviseCompanyByUser()
        this.warningoverview()
        this.marketoverview()
      },
      // 监管公司概览
      getAllSuperviseCompanyByUser () {
        if (!this.companyCodes) {
          return false
        }
        this.$http({
          url: this.$api.superviseCompany.superviseoverview,
          method: "GET",
          params: {
            companyCodes: this.companyCodes
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.superviseData = res.data.returnObject
          }
        })
      },
      // 预警
      warningoverview () {
        if (!this.companyCodes) {
          return false
        }
        console.log(this.warnTime)
        this.$http({
          url: this.$api.superviseCompany.warningoverview,
          method: "GET",
          params: {
            time: this.$common.getTimestampms(this.warnTime + ' 00:00:00'),
            companyCodes: this.companyCodes
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.warnData = res.data.returnObject
            this.warnData.dateNow = this.getNewData()
          }
        })
      },
      // 市场概览
      marketoverview () {
        if (!this.companyCodes) {
          return false
        }
        this.$http({
          url: this.$api.superviseCompany.marketoverview,
          method: "GET",
          params: {
            time: this.$common.getTimestampms(this.markeTime + ' 00:00:00'),
            companyCodes: this.companyCodes
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.marketData = res.data.returnObject
            this.marketData.dateNow = this.getNewData()
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #regulatorOverview {
    .card-content {
      height: 180px;
      padding: 3px 10px;
      font-size: 14px;
      color: #323232;
      .count {
        font-size: 30px;
        color: #ffb148;
        a {
          font-size: 30px;
          color: #ffb148;
        }
        a:hover {
          display: inline-block;
          height: 37px;
          border-bottom: 2px solid #ffb148;
          cursor: pointer;
          /*text-decoration: underline;*/
        }
      }
      .warm-count {
        font-size: 30px;
        color: #F5544C;
        a {
          font-size: 30px;
          color: #F5544C;
        }
        a:hover {
          display: inline-block;
          height: 37px;
          border-bottom: 2px solid #F5544C;
          cursor: pointer;
          /*text-decoration: underline;*/
        }
      }
      .top-count-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 3px;
        .count-detaile {
          width: 50%;
          height: 75px;
          text-align: center;
        }
        .border-right {
          border-right: 1px solid #e3e3e3;
        }
      }
      .middle-count-box {
        text-align: center;
        height: 80px;
        border-top: 1px solid #e3e3e3;
        padding-top: 16px;
        .count-detaile {
          text-align: center;
        }
      }
      .update-time {
        text-align: right;
        font-size: 12px;
        color: #8d8d8d;
      }
    }
  }
</style>
