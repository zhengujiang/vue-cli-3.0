<template>
  <div id="investor-index">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "investor-index",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss">
  @import "../../styles/theme-style";
  #investor-index {
    min-width: 1200px;
    background-color: #fff;
    .box-card {
      margin-top: 16px;
      border: 1px solid #E3E3E3;
      border-radius: 4px;
      transition: all .3s;
    }
    //
    .company-question {
         .header {
           width: 100%;
           display: flex;
           align-items: center;
           padding: 10px 0;
           .row {
             flex: 1;
             .title {
               font-size: 14px;
               color: #323232;
             }
             &.pagination {
               flex: 0 0 20%;
               text-align: right;
               &.text {
                 font-size: 14px;
                 color: #8d8d8d;
                 cursor: pointer;
                 i {
                   font-size: 16px;
                 }
               }
             }
           }
         }
         .company-table {
           width: 100%;
           font-size: 14px;
           margin: 11px 0;
           border: none;
           border: 0;
           border-collapse: collapse;
           // table-layout: fixed;
           tr {
             height: 40px;
             .index {
               width: 6%;
               font-size: 16px;
               color: #323232;
               text-align: center;
             }
             .code {
               width: 60px;
               padding-left: 5px;
               .market {
                 display: inline-block;
                 border-radius: 2px;
                 height: 20px;
                 width: 50px;
                 line-height: 20px;
                 text-align: center;
                 color: white;
                 font-size: 12px;
               }
             }
             .companyName {
               padding-left: 5px;
               font-size: 14px;
               color: #323232;
               width: 70px;
             }
             .number {
               text-align: right;
               font-size: 14px;
               color: #323232;
               .small {
                 font-size: 12px;
                 color: #AEAEAE;
               }
             }
           }
         }
       }
    .foot-pagination {
      padding: 30px 0;
      text-align: center;
      .btn-prev, .btn-next, li {
        margin-right: 10px;
        width: auto;
        height: 30px;
        border-radius: 4px;
        border: 1px solid #e3e3e3;
        box-sizing: border-box;
        padding: 0 8px;
        min-width: 30px;
        .el-icon {
          font-size: 14px;
        }
      }
      li:last-child {
        margin-right: 0;
      }
      .el-pager {
        li {
          font-size: 12px;
          color: #8d8d8d;
          font-weight: 400;
        }
        li.active {
          color: #fff;
          background: #ffb148;
        }
      }
      .btn-next {
        margin-left: 10px;
        color: #b4bccc;
      }
      .btn-prev {
        color: #b4bccc;
      }
    }
  }
</style>
