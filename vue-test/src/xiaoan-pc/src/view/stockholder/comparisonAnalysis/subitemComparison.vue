<template>
  <div id="subitemComparison">
    <!-- <el-card shadow="never" class="vxa-card-box vxa_card-b-margin" body-style="padding:0"> -->
      <!-- <div class="flex-box">
        <div class="col left">
          <el-checkbox-group :min="2" :max="12" class="checkbox-group" v-model="checkListRecord" >
            <el-checkbox :key="index" v-for="(item ,index) in recordDate" :label="item">{{item}}期</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="col right">
          <el-button type="primary" class="one-button" @click="contrast">一键对比</el-button>
          <p class="about">默认勾选最新2期，最多选12期</p>
        </div>
      </div> -->
      <div class="select-date">
        <div class="check-data">
          <el-checkbox-group :min="2" :max="12" v-model="checkListRecord" >
            <el-checkbox :key="index" v-for="(item ,index) in recordDate" :label="item">{{item}}期</el-checkbox>
          </el-checkbox-group>
        </div>
        <div class="comparison-btnbox">
          <el-button class="comparison-btn" type="primary" @click="getHolderComparisonChooseDate">一键对比</el-button>
          <div class="tip">默认勾选最新2期，最多选12期</div>
        </div>
      </div>
    <!-- </el-card> -->
    <!--股东性质分类对比-->
    <subitemHolderNature :numberOptions="numberOptions" :time="timeSelect" :changeData="changeData" :chooseNum="chooseNum" :checkListRecord="checkListRecord"></subitemHolderNature>
    <!--机构股东对比-->
    <subitemHolderMech :type="'mech'" :numberOptions="numberOptions" :time="timeSelect" :changeData="changeData" :chooseNum="chooseNum" :checkListRecord="checkListRecord"></subitemHolderMech>
    <!--自然人对比-->
    <subitemHolderMech :type="'person'" :numberOptions="numberOptions" :time="timeSelect" :changeData="changeData" :chooseNum="chooseNum" :checkListRecord="checkListRecord"></subitemHolderMech>
  </div>
</template>

<script>
  import tableTotal from './components/tableTotal.vue';
  import subitemHolderNature from './components/subitemHolderNature.vue'
  import subitemHolderMech from './components/subitemHolderMech.vue'
  export default {
    name: 'sub-item-comparison',
    data() {
      return {
        page: 1,
        numberOptions: [],
        holderOptions: [{
          value: '1,2,3,4,5,6,7,8,9,10',
          label: '全部'
        }, {
          value: '1',
          label: '公募基金'
        }, {
          value: '2',
          label: '私募基金'
        }, {
          value: '3',
          label: '证券公司资管产品'
        }, {
          value: '4',
          label: '社保基金'
        }, {
          value: '5',
          label: 'QFII'
        }, {
          value: '6',
          label: 'RQFII'
        }, {
          value: '7',
          label: '汇金公司'
        }, {
          value: '8',
          label: '中证金'
        }, {
          value: '9',
          label: '香港结算公司'
        }, {
          value: '10',
          label: '一般机构或产品'
        }], // 自然人 value 11
        holderSelect: '1,2,3,4,5,6,7,8,9,10', // 股东性质选择
        natureSelect: '',
        mechSelect: '',
        personSelect: '',
        recordDate: [],
        natureTypes: [1, 2, 3, 4, 5], // 股东性质类型选择
        mechTypes: [1, 2, 3, 4, 5], // 机构股东对比
        personTypes: [1, 2, 3, 4, 5], // 自然人对比
        checkListRecord: [],
        natureTableData: [], // 股东性质表格数据
        mechTableData: [], // 机构股东表格数据
        personTableData: [], // 自然人表格数据
        companySummaryData: {
          dateTime: '',
          question: [],
          answer: [],
          answerRate: []
        },
        showSummary: true, // 是否显示合计 只选择两期时显示
        timeSelect: [], // 一键对比之后选中的日期
        allLoading: null, // 全屏loading
        natureLoading: false,
        mechLoading: false, // 机构股东loading
        personLoading: false,
        mechChartLoading: false,
        personChartLoading: false,
        chooseNum: '', // 默认对比数量
        lastRecordDate: '',
        oldRecordDate: '',
        natureIndex: 0,
        mechIndex: 0,
        personIndex: 0,
        mechOnePass: [],
        personOnePass: [],
        natureSort: {
          prossesSort: '', // 持股数量排序
          personSort: '', // 人员数量排序
          changeSort: '' // 变化股排序
        },
        mechSort: {
          prossesSort: '', // 持股数量排序
          changeSort: '' // 变化股排序
        },
        personSort: {
          prossesSort: '', // 持股数量排序
          changeSort: '' // 变化股排序
        },
        natureTotal: {
          allAmount: '',
          allRatio: ''
        },
        mechTotal: {
          allAmount: '',
          allRatio: ''
        },
        personTotal: {
          allAmount: '',
          allRatio: ''
        },
        changeData: 1
      }
    },
    // 使用其它组件
    components: {
      tableTotal,
      subitemHolderNature,
      subitemHolderMech
    },
    computed: {},
    // 生命周期函数
    created() {
      this.getGroupListInfo();
    },
    // 方法
    methods: {
      amountAbs(val) {
        if (val == null || val == '--') {
          return '--'
        } else if (val == 0) {
          return 0;
        } else {
          return this.$array.abs(val, false);
        }
      },
      addRight(val) {
        if (val == 'nature') {
          if (this.natureIndex + 5 >= this.timeSelect.length) {
            return false
          } else {
            this.natureIndex++;
          }
        }
        if (val == 'mech') {
          if (this.mechIndex + 5 >= this.timeSelect.length) {
            return false
          } else {
            this.mechIndex++;
          }
        }
        if (val == 'person') {
          if (this.personIndex + 5 >= this.timeSelect.length) {
            return false
          } else {
            this.personIndex++;
          }
        }
      },
      addLeft(val) {
        if (val == 'nature') {
          if (this.natureIndex == 0) {
            return false
          } else {
            this.natureIndex--;
          }
        }
        if (val == 'mech') {
          if (this.mechIndex == 0) {
            return false
          } else {
            this.mechIndex--;
          }
        }
        if (val == 'person') {
          if (this.personIndex == 0) {
            return false
          } else {
            this.personIndex--;
          }
        }
      },
      // 一键对比
      contrast() {
        this.natureLoading = true;
        this.mechLoading = true;
        this.personLoading = true;
        this.mechChartLoading = true;
        this.personChartLoading = true;
        let dates = [];
        this.page = 1;
        this.checkListRecord.forEach(item => {
          dates.push(new Date(Date.parse(item.replace(/-/g, '/'))).getTime());
        })
        dates.sort(function(a, b) {
          return b - a
        });
        this.timeSelect = [];
        dates.forEach(item => {
          this.timeSelect.push(this.$common.transTime(`${item}`)[1]);
        })
        this.natureSelect = this.chooseNum;
        this.mechSelect = this.chooseNum;
        this.personSelect = this.chooseNum;
        this.holderSelect = '1,2,3,4,5,6,7,8,9,10';
        // this.getHolderPropertyComparisonInfo(this.chooseNum);
        // // this.getHolderComparisonInfo(this.chooseNum);
        // if (this.timeSelect.length == 2) {
        //   this.getHolderComparisonInfo(this.chooseNum, 'all');
        // } else {
        //   this.getOneKeyComparisonInfo(this.chooseNum, 'all');
        // }
        this.changeData++;
      },
      // 获取股东对比分析总览-获取股东对比信息可选日期
      getHolderComparisonChooseDate() {
        let dates = [];
        this.checkListRecord.forEach(item => {
          dates.push(new Date(Date.parse(item.replace(/-/g, '/'))).getTime());
        })
        let params = {
          recordDates: dates.join(','),
          userId: this.$cookie.get('userId')
        }
        this.$axios.gxfApi.getHolderComparisonChooseDate(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.numberOptions = [];
            res.data.returnObject.forEach(item => {
              let obj = {label: `前${item}`, value: item};
              this.numberOptions.push(obj);
            })
            this.numberOptions[this.numberOptions.length - 1].value >= 200 ? this.chooseNum = 200 : this.chooseNum = this.numberOptions[this.numberOptions.length - 1].value;
            this.natureSelect = this.chooseNum;
            this.mechSelect = this.chooseNum;
            this.personSelect = this.chooseNum;
            this.contrast();
          }
        })
      },
      //
      getGroupListInfo() {
        let params = {
          userId: this.$cookie.get('userId')
        };
        this.$axios.gxfApi.getLastedRecordDate(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            this.recordDate = res.data.returnObject;
            // this.recordDate.reverse();
            this.checkListRecord = this.recordDate.slice(0, 2);
            this.getHolderComparisonChooseDate();
          }
        }).catch(() => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #subitemComparison {
    .flex-box {
      .col {
        &.left {
          .checkbox-group {
            line-height: 21px;
            .el-checkbox {
              margin-right: 30px;
              width: 110px;
              & + .el-checkbox {
                margin-left: 0;
              }
            }
          }
        }
      }
    }
    .el-checkbox + .el-checkbox {
      margin-left: 40px;
    }
    img {
      vertical-align: text-top;
    }
    .page-img {
      position: relative;
      top: 2px;
      .right-img {
        margin-right: 16px;
        margin-left: 14px;
      }
    }
    .button-group {
      margin-right: 18px;
      .el-button {
        margin-left: 10px;
        padding: 0;
        font-size: 13px;
      }
    }
    .primary-small {
      display: inline-block;
      vertical-align: text-bottom;
    }
    .el-table {
      .el-table__footer-wrapper {
        td {
          padding: 0
        }
      }
      td {
        vertical-align: middle;
      }
      th {
        height: 35px;
        .cell {
          padding-left: 0;
          padding-right: 0;
        }
      }
      th.date-column {
        .cell {
          width: 70px;
          height: 34px;
          line-height: 17px;
          text-align: left;
          padding-left: 0;
          padding-right: 0;

        }
      }
      th.date-column-more {
        .cell {
          width: 70px;
          height: 34px;
          line-height: 17px;
        }
      }
      td.date-column-more {
        .cell {
          // padding-right: 5px;
          width: 125px;
          text-align: right;
          margin: 0 auto;
          padding: 0;
          padding-right: 28px !important;
        }
      }
      td.date-column {
        .cell {
          padding-right: 5px;
        }
      }
      td.date-IE {
        .cell {
          padding-right: 10px;
        }
      }
      .split-column {
        &:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 1px;
          height: 100%;
          box-shadow: 14px -1px 5px 0px rgba(0, 0, 0, 0.18);
        }
      }
      .el-table__footer-wrapper {
        .split-column {
          &:before {
            display: none;
          }
        }
      }
      th.date-column-sort {
        .cell {
          position: relative;
          width: 90px;
          height: 34px;
          line-height: 17px;
          text-align: left;
          padding-left: 0;
          padding-right: 20px;
        }
        .caret-wrapper {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .gutter {
        display: table-cell!important;
      }
    }
  }
</style>

<style lang="scss">
  #subitemComparison {
    .select-date {
      display: flex;
      justify-content: space-between;
      padding: 16px 16px 8px 16px;
      min-height: 100px;
      border-radius: 4px;
      border: 1px dashed #e3e3e3;
      margin-bottom: 20px;
      .check-data {
        width: 780px;
        .el-checkbox {
          margin-right: 40px;
          padding-bottom: 8px;
          width: 110px;
        }
        .el-checkbox + .el-checkbox {
          margin-left: 0;
        }
      }
      .comparison-btnbox {
        width: 358px;
        .comparison-btn {
          width: 358px;
          height: 50px;
          font-size: 18px;
          font-weight: 600;
          color: rgba(255, 255, 255, 1);
          line-height: 25px;
        }
        .tip {
          padding: 8px 0;
          font-size: 14px;
          color: #B6B5B5;
        }
      }
    }
    .headerRow{
      color: red;
    }
    .card-dashed {
      border: 1px dashed #E3E3E3;
    }
    .flex-box {
      display: flex;
      align-items: center;
      .col {
        flex: 1;
        &.left {
          padding: 0 10px;
        }
        &.right {
          padding: 16px;
          flex: inherit;align-items: center;
          .one-button {
            padding: 0;
            width: 358px;
            height: 50px;
            background: rgba(255, 177, 72, 1);
            border-radius: 4px;
            font-size: 18px;
            font-weight: 600;
            color: rgba(255, 255, 255, 1);
          }
          .about {
            font-size: 14px;
            font-weight: 400;
            padding-top: 8px;
            color: rgba(182, 181, 181, 1);
            transform: scale3d(1, 1, 1);
            transform-origin: left bottom;
          }
        }
      }
    }
    .echart-overview {
      height: 360px;
      width: 100%;
    }
    .compare {
      .type {
        height: 49px;
        line-height: 49px;
        .el-checkbox {
          .chk-img {
            margin-right: 3px;
          }
          .el-checkbox__label {
            padding-left: 5px;
            font-size: 12px;
            font-weight:400;
            color: #323232;
          }
        }
      }
      .titleInner {
        color:rgba(50,50,50,1);
        font-size: 14px;
        font-weight: 600;
        margin-right: 8px;
      }
      .titleTime {
        color:rgba(141,141,141,1);
        font-size: 12px;
      }
      .holderTitle {
        font-size: 12px;
        color:rgba(141,141,141,1);
        line-height:17px;
      }
      .total {
        width: 100%;
        height: 35px;
        line-height: 35px;
      }
    }
  }
</style>
