<template>
  <div id="trendCard">
    <div class="cart" v-loading="cardLoading">
      <el-card class="common">
        <p class="title">最新户数及变化
          <!-- <el-tooltip effect="light" content="截止本报告期末股东总户数及较上一报告期末变化比例" placement="right" :visible-arrow="false">
            <i class="el-icon-info i-info"></i>
          </el-tooltip> -->
          <i class="el-icon-info" @mouseover="tipOne = false" @mouseout="tipOne = true"></i>
        </p>
        <div class="inner" v-if="tipOne">
          <span><em v-if="!cardData.stockholdersDiffNum">--</em><em
            v-else>{{cardData.stockholdersDiffNum}}</em>(户)</span>
          <span>
              <em>{{cardData.stockholdersChange}}</em>(%)
              <img v-if="cardData.stockholdersChange > 0" :src="$image.stockholder.c4" alt="">
              <img v-if="cardData.stockholdersChange < 0" :src="$image.stockholder.c5" alt="">
            </span>
        </div>
        <div class="inner tips" v-else>
          <i>截止本报告期末股东总户数及较上一报告期末变化比例</i>
        </div>
      </el-card>
      <el-card class="common">
        <p class="title">整体质押比例
          <!-- <el-tooltip effect="light" content="质押比例计算公式为：（场外质押登记股数+股票质押式回购交易数量）/上市公司A股总股本" placement="right" :visible-arrow="false">
            <i class="el-icon-info i-info"></i>
          </el-tooltip> -->
          <i class="el-icon-info" @mouseover="tipTwo = false" @mouseout="tipTwo = true"></i>
        </p>
        <div class="inner export" v-if="tipTwo">
          <span><em>{{cardData.pledgeRate}}</em>(%)</span>
        </div>
        <div class="inner export tips" v-else>
          <i>质押比例计算公式为：（场外质押登记股数+股票质押式回购交易数量）/上市公司A股总股本</i>
        </div>
      </el-card>
      <el-card class="common">
        <p class="title">公募基金持股比例及变化
          <!-- <el-tooltip effect="light" content="公墓基金持有上市公司的股份比例合计及较上一报告期末变化比例" placement="right" :visible-arrow="false">
            <i class="el-icon-info i-info"></i>
          </el-tooltip> -->
          <i class="el-icon-info" @mouseover="tipThree = false" @mouseout="tipThree = true"></i>
        </p>
        <div class="inner" v-if="tipThree">
          <span><em>{{cardData.publicStockRate}}</em>(%)</span>
          <span>
              <em>{{cardData.publicStockRateChange}}</em>(%)
              <img v-if="cardData.publicStockRateChange > 0" :src="$image.stockholder.c4" alt="">
              <img v-if="cardData.publicStockRateChange < 0" :src="$image.stockholder.c5" alt="">
            </span>
        </div>
        <div class="inner tips" v-else>
          <i>公募基金持有上市公司股份比例合计及较上报告期末变化比例（基于公募基金半年度及年度持股数据）</i>
        </div>
      </el-card>
      <el-card class="common">
        <p class="title">潜在基金家数
          <i class="el-icon-info" @mouseover="tipFour = false" @mouseout="tipFour = true"></i>
        </p>
        <div class="inner export" v-if="tipFour">
          <span><em>{{cardData.potentialFundNum}}</em>(家)</span>
        </div>
        <div class="inner export tips" v-else>
          <i>小安精准计算判断</i>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        cardData: {},
        cardLoading: false,
        tipOne: true,
        tipTwo: true,
        tipThree: true,
        tipFour: true
      }
    },
    props: ['companyCode'],
    created() {
      if (this.companyCode) {
        this.getGeneralInfoByStockCode();
      }
    },
    watch: {
      'companyCode': function () {
        this.getGeneralInfoByStockCode();
      }
    },
    methods: {
      getGeneralInfoByStockCode() {
        this.cardLoading = true;
        let params = {
          stockCode: this.companyCode
        }
        this.$axios.gxfApi.getGeneralInfoByStockCode(params).then(res => {
          this.cardLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.cardData = res.data.returnObject;
          }
        }).catch(err => {
          this.cardLoading = false;
        })
      }
    }
  }
</script>
<style lang="scss">
  #trendCard {
    .cart {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
      .el-card {
        width: 288px;
        height: 140px;
        padding: 13px 16px 19px 16px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        .el-icon-info {
          cursor: pointer;
        }
        .tips {
          color: #545454;
          font-size: 12px;
          line-height: 18px !important;
        }
        .el-card__body {
          padding: 0;
        }
        .title {
          height: 32px;
          border-bottom: 1px solid rgba(227, 227, 227, 1);
          font-size: 14px;
          font-weight: 400;
          color: rgba(50, 50, 50, 1);
          margin-bottom: 20px;
          i {
            color: rgba(214, 214, 214, 1);
            font-size: 12px;
            margin-left: 5px;
          }
        }
        .inner {
          height: 55px;
          line-height: 55px;
          display: flex;
          span {
            font-size: 12px;
            width: 50%;
            display: inline-block;
            box-sizing: border-box;
            text-align: center;
            em {
              font-size: 30px;
              font-weight: 600;
              font-style: normal;
              color: rgba(50, 50, 50, 1);
            }
            img {
              margin-left: 3px;
            }
          }
          span:nth-child(2) {
            border-left: 1px solid rgba(227, 227, 227, 1);
          }
        }
        .export {
          span {
            width: 100%;
          }
        }
      }
    }
  }
</style>
