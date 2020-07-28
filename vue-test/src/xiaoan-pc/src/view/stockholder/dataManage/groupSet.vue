<template>
  <div id="groupSet">
    <v-konggu @updateWarn="updateWarn"></v-konggu>
    <!--野蛮人管理-->
    <v-yemanren ref="yemanren"></v-yemanren>
    <!--其他一致行动人管理-->
    <v-qitaxingdongren></v-qitaxingdongren>
    <!-- 相同管理人旗下产品分组-->
    <v-managerfund></v-managerfund>
    <!--自定义分组管理-->
    <v-zidingyi></v-zidingyi>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";
  import konggu from './components/groupSet/konggu'
  import yemanren from './components/groupSet/yemanren'
  import qitaxingdongren from './components/groupSet/qitaxingdongren'
  import managerfund from './components/groupSet/managerfund'
  import zidingyi from './components/groupSet/zidingyi'

  export default {
    data() {
      return {
      }
    },
    // 使用其它组件
    components: {
      ElCol,
      ElRow,
      'v-konggu': konggu,
      'v-yemanren': yemanren,
      'v-qitaxingdongren': qitaxingdongren,
      'v-managerfund': managerfund,
      'v-zidingyi': zidingyi
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {
      updateWarn() {
        this.$refs.yemanren.getGroupListInfo()
      }
    }
  }
</script>

<style lang="scss">
  #groupSet {
    .export-list {
      margin-top: 16px;
      padding: 0 17px;
      .header-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .show-icon {
        margin-right: 20px;
      }
      .item1 {
        /*width: 180px;*/
        text-align: center;
      }
      .item2 {
        /*width: 120px;*/
        text-align: right;
      }
      .item3 {
        /*width: 210px;*/
        text-align: right;
      }
      .item4 {
        /*width: 180px;*/
        text-align: right;
      }
      .group-info {
        border-top: 1px solid #e3e3e3;
        margin-top: 10px;
      }
      .warn-level {
        font-size: 12px;
        color: #8d8d8d;
        font-weight: 400;
        margin-left: 16px;
        i {
          position: relative;
          top: -2px;
          width: 12px;
          height: 4px;
          display: inline-block;
          background-color: #E3E3E3;
          margin-left:1px;
          &:first-child {
            border-radius:100px 0px 0px 100px;
            margin-left: 0;
          }
          &:last-child {
            border-radius:0px 100px 100px 0px;
          }
        }
        .i1 {background-color: #FFE6C5;}
        .i2 {background-color: #FFD193;}
        .i3 {background-color: #FFB148;}
        .i4 {background-color: #FF9C16;}
        .i5 {background-color: #ED8800;}
      }
    }
    .possessorname {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .el-table__body-wrapper {
      max-height: 350px;
      overflow-y: auto;
    }
    .el-table td {
      vertical-align: top;
    }
  }
  .dialogStockHolder {
    .possessorname {
      width: 100%;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .setkonggu-content {
      min-height: 400px;
      /*border-bottom: 1px solid #e3e3e3;*/
      .konggu-search {
        font-size: 12px;
        display: flex;
        align-items: center;
        padding-bottom: 16px;
        .sp {
          white-space: nowrap;
        }
        .ml {
          display: inline-block;
          margin-left: 10px;
        }
        .gdxj{
          width: 140px;
        }
        .stock-name {
          width: 460px;
        }
      }

    }
    .btn-box {
      padding: 25px 0 10px 0;
      text-align: center;
    }
    .btn-main {
      width: 150px;
    }
    .editstage {
       padding-left: 64px;
       line-height: 30px;
    }
    .holderInfo {
      td {
        padding: 5px 0;
      }
    }
  }
</style>
