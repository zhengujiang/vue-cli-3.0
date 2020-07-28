<template>
  <div class="disclosure" id="disclosure">
    <div class="finance-title">
      <div class="content">
        <p>信息披露清单</p>
        <p>小安智能收集整理上市公司董办涉及各事务信息披露流程要点和审议程序。并可以根据本公司情况，自定义披露模板。</p>
      </div>
    </div>
    <div class="content" style="margin-top: -42px">
      <el-row :gutter="12" class="disclosure-header">
        <!--<el-col :span="5">-->
          <!--<el-card class="box-disclosure-card height" shadow="never" body-style="padding:0">-->
            <!--<div class="box-tabs-left">-->
              <!--<el-button class="addEvent" type="primary" @click="dialogVisible = true">-->
                <!--<i class="iconfont web-editor"></i>&ensp;创建事项-->
              <!--</el-button>-->
            <!--</div>-->
          <!--</el-card>-->
        <!--</el-col>-->
        <el-col :span="24">
          <el-card class="box-disclosure-card height box-col" shadow="never" body-style="padding:0">
            <ul class="box-tabs">
              <li v-for="(list , index) in bar" :class="{active: list.active}" @click="handleClick(index)">
                <span class="text">
                  {{list.name}}<span class="tab-bar"></span>
                </span>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
      <router-view></router-view>
    </div>
    <add-event v-model="dialogVisible" @close="closeAddEvent"></add-event>
  </div>
</template>

<script>
  import AddEvent from './components/addEvent.vue'
  export default {
    name: "disclosure",
    data() {
      return {
        activeName: 'checklist',
        dialogVisible: false,
        bar: [
          {name: '信息披露清单', type: 'checklist', active: true, link: '/disclosure/checklist'},
          {name: '进行中的事项', type: 'proceed', active: false, link: '/disclosure/proceed'},
          {name: '已归档事项', type: 'archive', active: false, link: '/disclosure/archive'}
        ]
      }
    },
    components: {
      AddEvent
    },
    watch: {
      $route: function (to) {
        this.bar.forEach((item) => {
          item.active = false;
          if (item.type == this.$route.meta.tabName) {
            item.active = true;
          }
        })
      }
    },
    created() {

      console.log(this.$route);
      this.bar.forEach((item) => {
        item.active = false;
        if (item.type == this.$route.meta.tabName) {
          item.active = true;
        }
      });
    },
    mounted() {
      this.editInfo();
    },
    methods: {
      closeAddEvent() {
        this.dialogVisible = false
      },
      handleClick(index) {
        this.bar.forEach((item) => {
          item.active = false;
        })
        this.bar[index].active = true;
        this.activeName = this.bar[index].type;
        this.$router.push({path: this.bar[index].link});
      },
      editInfo () {
        if (this.$route.query.value) {
          this.dialogVisible = true;
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  #addEventDialog-two {
    .el-dialog__header {
      color: #ffb148;
      font-weight: bold;
      font-size: 16px;
      border-bottom: 1px solid #dcdfe6;
    }
    .el-dialog__body {
      padding: 20px 20px 0 20px;
      .pane-scroll-default {
        max-height: 300px;
        overflow-y: scroll;
        overflow-x: hidden;
        .el-input__inner {
          border-color: #e3e3e3;
        }
        .collapse-select {
          border-top: 0;
          .el-collapse-item__content {
            padding-bottom: 0;
          }
          .collapse-select-list {
            ul {
              li {
                height: 40px;
                line-height: 40px;
                text-indent: 2em;
                border-top: 1px solid #e3e3e3;
                color: #8d8d8d;
                font-size: 14px;
                &.active {
                  background-color: rgba(255, 177, 72, 0.1);
                }
                &:hover {
                  background-color: rgba(255, 177, 72, 0.1);
                }
              }
            }
          }
        }
      }
    }
    .addEventDialog-two-body {
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .addMobile-box-scroll {
        min-height: 250px;
        max-height: 250px;
        overflow-y: scroll;
        overflow-x: hidden;
      }
      .addMobile-box {
        .addMobileInput {
          font-size: 16px;
          height: 40px;
        }
        .addMobileBtn {
          background-color: #f0f1f5;
          border-color: #e3e3e3;
          color: #8d8d8d;
          font-size: 16px;
          padding: 0 12px;
          height: 40px;
        }
        .clearMobileBtn {
          color: #8d8d8d;
          font-size: 16px;
          padding: 0 0;
          height: 40px;
        }
      }
      .add-calendar-user-item {
        ul {
          li {
            display: flex;
            padding: 10px 0;
            align-items: center;
            border-bottom: 1px solid #f0f1f5;
            > div {
              flex: 1;
              &.img {
                flex: 0 0 50px;
                border-radius: 50%;
                img {
                  height: 50px;
                  width: 50px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
              }
              &.name {
                padding-left: 20px;
                font-size: 16px;
                overflow: hidden; /*超出部分隐藏*/
                white-space: nowrap; /*不换行*/
                text-overflow: ellipsis; /*超出部分文字以...显示*/
              }
              &.clear {
                flex: 0 0 20px;
                text-align: right;
                i {
                  font-size: 16px;
                }
              }
            }
          }
        }
      }
      .input-def-item {
        margin-bottom: 10px;
        .el-select {
          width: 100%;
        }
      }
      .addEvent-date-picker {
        width: 100%;
      }
      .input-def {
        .el-input__inner {
          border: transparent;
        }
      }
    }
    .el-dialog__footer {
      .el-button {
        width: 175px;
        height: 35px;
        padding: 0;
        font-size: 16px;
        line-height: 35px;
      }
    }
  }
  .disclosure {
    min-height: 800px;
    background-color: #f6f6f6;
    .finance-title {
      width: 100%;
      height: 166px;
      background-image: url(https://oss.in-hope.cn/xiaoan/web_static/financeBack.jpg);
      background-size: 100% 100%;
      color: #FFFFFF;
      p:first-child {
        font-size:30px;
        font-weight:600;
        padding: 32px 0 4px 0;
      }
      p {
        font-size:12px;
        font-weight:400;
      }
    }
    .box-tabs {
      height: 42px;
      align-items: center;
      li {
        background-color:rgba(255,255,255,0.08);
        color: #FFFFFF;
        width: 168px;
        margin-right: 1px;
        display: inline-block;
        height: 100%;
        text-align: center;
        line-height: 42px;
        position: relative;
        * {
          cursor: pointer;
        }
        &.active {
          color: #ffb148;
          .tab-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 2px;
            width: 100%;
            background-color: #ffb148;
            margin: 0 auto;
          }
        }
        &:hover {
          background-color: #FFB148;
          color: #FFFFFF;
        }
        .text {
          height: 100%;
          position: relative;
          display: inline-block;
        }
      }
    }
  }
  #disclosure {
    .disclosure-header {
      background-color: transparent;
    }
    .box-disclosure-card {
      min-height: 30px;
      width: 100%;
      &.box-col {
        border: none;
        border-radius: 0;
        background-color: transparent;
      }
      .el-card__body {
        position: relative;
      }
      .box-tabs-left {
        width: 100%;
        display: flex;
        height: 50px;
        align-items: center;
        padding: 0 17.5px;
        &:after {
          content: '';
          position: absolute;
          right: 5px;
          height: 20px;
          width: 2px;
          background-color: #e3e3e3;
          top: 50%;
          -webkit-transform: translateY(-50%);
          -ms-transform: translateY(-50%);
          transform: translateY(-50%);
        }
        .addEvent {
          width: 100%;
          height: 35px;
          padding: 0 0;
          font-size: 16px;
          text-align: center;
          i {
            font-size: 15px;
          }
        }
      }
      .box-tabs {
        height: 42px;
        align-items: center;
        li {
          background-color:rgba(255,255,255,0.08);
          color: #FFFFFF;
          width: 168px;
          margin-right: 1px;
          display: inline-block;
          height: 100%;
          text-align: center;
          line-height: 42px;
          position: relative;
          &.active {
            color: #ffb148;
            .bar {
              position: absolute;
              bottom: 0;
              left: 0;
              right: 0;
              height: 2px;
              width: 100%;
              background-color: #ffb148;
              margin: 0 auto;
            }
          }
          &:hover {
            background-color: #FFB148;
            color: #FFFFFF;
          }
          .text {
            height: 100%;
            position: relative;
            display: inline-block;
          }
        }
      }
    }
    .tab-header {
    }
  }
</style>
