<template>
  <div id="groupComparison">
    <div class="select-date">
      <div class="check-data">
        <el-checkbox-group v-model="recordDateValue" :max="12">
          <el-checkbox v-for="item in recordDate" :label="item" :key="item">{{item}}期</el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="comparison-btnbox">
        <el-button class="comparison-btn" type="primary" @click="handleComparison">一键对比</el-button>
        <div class="tip">默认勾选最新2期，最多选12期</div>
      </div>
    </div>

    <!--1:控股股东；2:野蛮人;3:其他一致行动人;4:自定义分组-->
    <v-groupComparisonKongGu :recordDateValue="recordDateSearch" :groupType="1"></v-groupComparisonKongGu>
    <v-groupComparisonInfo :recordDateValue="recordDateSearch" :groupType="2"></v-groupComparisonInfo>
    <v-groupComparisonInfo :recordDateValue="recordDateSearch" :groupType="3"></v-groupComparisonInfo>
    <v-groupComparisonInfo :recordDateValue="recordDateSearch" :groupType="5"></v-groupComparisonInfo>
    <v-groupComparisonInfo :recordDateValue="recordDateSearch" :groupType="4"></v-groupComparisonInfo>
  </div>
</template>
<script>
  import NoInfo from "../../../components/noInfo.vue";
  import groupComparisonKongGu from './components/groupComparisonKongGu'
  import groupComparisonInfo from './components/groupComparisonInfo'
  export default {
    data() {
      return {
        userId: '',
        recordDateSearch: [],
        recordDateValue: [],
        recordDate: [],
        comparisonTypes: [1, 2, 3, 4, 5],
        groupComparisonInfo: [],
        chartData: {}
      }
    },
    // 使用其它组件
    components: {
      NoInfo,
      'v-groupComparisonKongGu': groupComparisonKongGu,
      'v-groupComparisonInfo': groupComparisonInfo
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.getLastedRecordDate()
    },
    mounted() {
    },
    // 方法

    methods: {
      goManageGroup() {
        this.$router.push('/stockholder/groupSet')
      },
      // 获取名册期数
      getLastedRecordDate () {
        let paras = {
          userId: this.userId
        }
        this.$axios.gxfApi.getLastedRecordDate(paras)
          .then((res) => {
            if (res.data.returnCode == 200 || res.data.returnCode == 1) {
              if (res.data.returnObject) {
                this.recordDate = res.data.returnObject
                this.recordDateValue.push(this.recordDate[0])
                this.recordDateValue.push(this.recordDate[1])
                // this.recordDateValue.push(this.recordDate[2])
                this.handleComparison()
//                this.getGroupComparisonChart()
              }
            }
          })
      },
      handleComparison() {
        if (this.recordDateValue.length < 2) {
          this.$message({showClose: true, type: "error", duration: 3000, message: '最少选择二期数据对比'});
        }
        this.recordDateSearch = Object.assign([], this.recordDateValue).sort((a, b) => { return new Date(b) - new Date(a) })
      }
    }
  }
</script>

<style lang="scss">
  #groupComparison {
    .select-date {
      display: flex;
      justify-content: space-between;
      padding: 16px 16px 8px 16px;
      min-height: 100px;
      border-radius: 4px;
      border: 1px dashed #e3e3e3;
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
        }
        .tip {
          padding: 8px 0;
          font-size: 14px;
          color: #B6B5B5;
        }
      }
    }
    .group-list {
      margin-top: 16px;
      padding: 0 16px;
      .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .record-date {
          font-size: 12px;
          color: #8d8d8d;
          margin-left: 5px;
        }
        .manage-btn {
          width:60px;
          height:20px;
          font-size:14px;
          font-weight:400;
          color:#FFB148;
          line-height:20px;
          text-decoration: underline;
          cursor: pointer;
        }
        .page-img {
          position: relative;
          top: 2px;
          margin-right: 18px;
          .left-img {
            margin-right: 10px;
          }
          .rotate {
             transform: rotate(180deg);
          }
          img:first-child {
            margin-right: 10px;
          }
        }

      }
      .list-box {
        .group-comparisontypes {
          padding-bottom: 16px;
        }
        .chk-img {
          margin-right: 3px;
        }
        .el-checkbox__label {
          padding-left: 5px;
          font-size: 12px;
          color: #323232;
        }
        .el-checkbox + .el-checkbox {
          margin-left: 40px;
        }
        .el-table_1_column_6,.split-column {
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            width: 1px;
            height: 100%;
            box-shadow: 3px 2px 5px 0px rgba(0, 0, 0, 0.18);
          }
          // border-left: 1px solid #e3e3e3;
        }
        th.date-column {
          .cell {
            width: 90px;
            height: 34px;
            line-height: 17px;
            text-align: left;
            padding-left: 0;
            padding-right: 20px;
            .caret-wrapper {
              position: relative;
              top: -34px;
              right: -65px;
            }
          }
        }
      }
      .chart-title {
        padding: 16px 0;
        border-bottom: 1px solid #e3e3e3;
        font-weight: 600;
        font-size: 14px;
      }
    }
    .possessorname {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .el-table td {
      vertical-align: top;
    }
  }
</style>
