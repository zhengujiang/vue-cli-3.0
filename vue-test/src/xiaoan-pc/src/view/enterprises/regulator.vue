<template>
  <div id="regulator">
    <div class="content">
      <v-regulatorOverView @showCompanySet="showCompanySet" :companyCodes="companyCodes"></v-regulatorOverView>
      <el-row class="mtop16" :gutter="16">
        <el-col :span="18">
          <v-regulatorCompanyList @showCompanySet="showCompanySet" ref="companySet"></v-regulatorCompanyList>
          <v-regulatorWordCloud :companyCodes="companyCodes"></v-regulatorWordCloud>
          <v-regulatorChartLine :companyCodes="companyCodes"></v-regulatorChartLine>
          <v-regulatorChartPie :companyCodes="companyCodes"></v-regulatorChartPie>
          <v-regulatorInteractE :companyCodes="companyCodes"></v-regulatorInteractE>
        </el-col>
        <el-col :span="6">
          <v-regulatorItemList :title="'市场舆情'" :itemList="marketSentiment"></v-regulatorItemList>
          <v-regulatorItemList :title="'监管动态'" :itemList="superviseDynamicList" class="mtop16"></v-regulatorItemList>
          <v-regulatorItemList :title="'最新法规'" :itemList="lawList" class="mtop16"></v-regulatorItemList>
          <v-regulatorItemList :title="'信公干货'" :itemList="advertList" class="mtop16"></v-regulatorItemList>
        </el-col>
      </el-row>
    </div>
    <v-regulatorCompanySet :show="showCompanySetDialog" @hideCompanySet="hideCompanySet"></v-regulatorCompanySet>
  </div>
</template>

<script>
  import regulatorCompanySet from './regulator/regulatorCompanySet'
  import regulatorOverView from './regulator/regulatorOverview'
  import regulatorCompanyList from './regulator/regulatorCompanyList'
  import regulatorWordCloud from './regulator/regulatorWordCloud'
  import regulatorChartLine from './regulator/regulatorChartLine'
  import regulatorChartPie from './regulator/regulatorChartPie'
  import regulatorInteractE from './regulator/regulatorInteractE'
  import regulatorItemList from './regulator/regulatorItemList'
  export default {
    data() {
      return {
        userId: '',
        value1: '',
        marketSentiment: [],
        lawList: [],
        superviseDynamicList: [],
        advertList: [],
        showCompanySetDialog: false,
        companyCodes: ''
      }
    },
    // 使用其它组件
    components: {
      'v-regulatorCompanySet': regulatorCompanySet,
      'v-regulatorOverView': regulatorOverView,
      'v-regulatorCompanyList': regulatorCompanyList,
      'v-regulatorWordCloud': regulatorWordCloud,
      'v-regulatorChartLine': regulatorChartLine,
      'v-regulatorChartPie': regulatorChartPie,
      'v-regulatorInteractE': regulatorInteractE,
      'v-regulatorItemList': regulatorItemList
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getMarketSentiment()
      this.lawSearch()
      this.superviseDynamic()
      this.getAdvertList()
      this.getAllSuperviseCompanyByUser('create')

    },
    mounted() {

    },
    // 方法
    methods: {
      // 法规
      lawSearch() {
        this.$http({
          method: 'GET',
          url: this.$api.rule.lawSearch,
          params: {
            pageNo: 1, // 页码
            pageSize: 10, // 每页行数
            type: 'law',
            sortType: '发布日期', // 搜索排序，时间排序time
            userId: this.userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.lawList = res.data.returnObject.list
            this.lawList.forEach((item) => {
              // 发文号为空是，显示发文单位
              let createTime = this.$common.transTime(item.publishDate)[1]
              let nowData = this.$common.getNow('-')
              if (createTime == nowData) {
                item.isNew = true
              } else {
                item.isNew = false
              }
            })
          }
        })
      },
      // 监管动态
      superviseDynamic() {
        // let stype = this.valueJianguan == '全部' ? '' : this.valueJianguan
        this.$http({
          method: 'GET',
          url: this.$api.supervise.superviseDynamic,
          params: {
            type: '',
            pageNo: 1,
            pageSize: 10
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            this.superviseDynamicList = res.data.returnObject.superviseDynamicList
            this.superviseDynamicList.forEach(item => {
              item.name = item.title

              let createTime = this.$common.transTime(item.releaseDate)[1]
              let nowData = this.$common.getNow('-')
              if (createTime == nowData) {
                item.isNew = true
              } else {
                item.isNew = false
              }
            })
          }
        })
      },
      // 信公干货
      getAdvertList() {
        this.$http({
          url: this.$api.advert.getAdvertList,
          method: "GET",
          params: {
            pageNum: 1,
            pageSize: 10,
            type: '信公干货'
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.advertList = res.data.returnObject
            this.advertList.forEach(item => {
              item.name = item.advertTitle

              let createTime = this.$common.transTime(item.createTime)[1]
              let nowData = this.$common.getNow('-')
              if (createTime == nowData) {
                item.isNew = true
              } else {
                item.isNew = false
              }
            })
          }
        })
      },
      // 市场舆情
      getMarketSentiment() {
        this.$http({
          url: this.$api.superviseCompany.getMarketSentiment,
          method: "GET",
          params: {
            keyWord: '',
            pageNum: 1,
            pageSize: 10,
            userId: this.userId
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.marketSentiment = res.data.returnObject.data
            this.marketSentiment.forEach(item => {
              item.name = item.title

              let createTime = this.$common.transTime(item.createdStamp)[1]
              let nowData = this.$common.getNow('-')
              if (createTime == nowData) {
                item.isNew = true
              } else {
                item.isNew = false
              }
            })
          }
        })
      },
      // 获取所有监管公司
      getAllSuperviseCompanyByUser(initType) {
        this.$http({
          url: this.$api.superviseCompany.getAllSuperviseCompanyByUser,
          method: "GET",
          params: {
            userId: this.userId
          }
        }).then(res => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let data = res.data.returnObject
            // data.forEach(item => {
            //   codes.push(item.companyFullCode)
            // })
            let codes = data.map((e) => {
              return e.companyFullCode
            })
            this.companyCodes = codes.toString();
            if (this.companyCodes == '') {
              this.showCompanySetDialog = true
              if (initType != 'create') {
                setTimeout(() => {
                  this.$message({showClose: true, type: 'error', duration: 3000, message: '请先设置监管公司'})
                }, 500)
              }
            }
          }
        })
      },
      showCompanySet() {
        this.showCompanySetDialog = true
      },
      hideCompanySet() {
        this.showCompanySetDialog = false
        this.getAllSuperviseCompanyByUser()
        this.$refs.companySet.getSuperviseCompanyList()
      }
    }
  }
</script>

<style lang="scss">
  #regulator {
    background-color: #F6F6F6;
    .content {
      padding: 20px 0;
    }
    .mtop16 {
      margin-top: 16px;
    }
    .el-card__header {
      padding: 10px 0;
      margin: 0 12px;
      font-size: 14px;
      color: #323232;
      .title {
        font-size: 16px;
        color: #323232;
      }
      .set-buttom {
        float: right;
        font-size: 14px;
        color: #8D8D8D;
        padding: 1px 6px;
        border: 1px solid #E3E3E3;
        border-radius: 4px;
        cursor: pointer;
        .set-img {
          position: relative;
          top: 2px;
          width: 16px;
        }
      }
      .data-picker {
        float: right;
        width: 120px;
        position: relative;
        top: -3px;
        .el-input__inner {
          padding-right: 17px !important;
        }
        .el-input__suffix {
          right: 0;
        }
      }
      .el-button-more {
        float: right;
        padding: 3px 0;
        border-radius: 0;
        font-size: 12px;
        color: #aeaeae;
        .web-arrow {
          font-weight: 800;
        }
        &:hover {
          color: #ffb148;
        }
      }
    }
    .el-card__body {
      padding: 0 0 10px 0;
    }

  }
</style>
