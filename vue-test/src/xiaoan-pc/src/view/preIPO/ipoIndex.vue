<template>
  <div id="pre-ipo-index">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "ipoIndex",
    components: {},
    data() {
      return {}
    },
    created() {
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  #pre-ipo-index {
    min-height: 800px;
    min-width: 1200px;
    .box-card {
      margin-bottom: 16px;
    }
  }
</style>
<style lang="scss">
  .ipoTablePopover {
    padding: 10px;
    .popover-content {
      .popover-date-picker {
        width: 100%;margin-bottom: 10px;
        .el-input {
          width: 100%;
        }
        .el-input__inner {
          width: 100%;
        }
      }
      .checkbox-global {
        .isIndeterminate {
          height: 30px;
          line-height: 30px;
          .el-checkbox__label{
            font-size: 12px;
            font-weight: normal;
          }
        }
        .el-checkbox-group {
          ul {
            max-height: 270px;
            min-height: 270px;
            height: 270px;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 5px 0;
            li {
              padding: 5px 0;
              line-height: 1;
              .el-checkbox {
                display: flex;
                align-items: center;
                font-size: 12px;
                .el-checkbox__input {
                  flex: inherit;
                }
                .el-checkbox__label {
                  flex: 1;
                  font-weight: normal;
                  white-space: normal;
                  font-size: 12px;
                }
              }
            }
          }
        }
      }
      .button-global {
        display: flex;
        padding-top: 8px;
        .row {
          flex: 1;
          margin-right: 10px;
          .el-button {
            width: 100%;
            padding: 0;
            height: 30px;
          }
          .primary-plain {
            &:focus {
              color: #ffb148;
              background: #fff7ed;
              border-color: #ffe0b6;
            }
          }
          &.right {
            margin-right: 0;
          }
        }
      }
    }

  }
  #pre-ipo-index {
    .box-card {
      margin: 16px 0;
    }
    //
    .foot-pagination {
      display: flex;
      align-items: center;
      text-align: inherit;
      .row {
        flex: 1;
        &:last-child {
          flex: inherit;
          .el-radio-button--mini .el-radio-button__inner {
            padding: 8px;
            font-size: 12px;
            font-weight: normal;
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
</style>
