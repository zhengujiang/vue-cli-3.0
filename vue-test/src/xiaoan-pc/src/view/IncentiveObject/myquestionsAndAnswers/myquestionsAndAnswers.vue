<template>
  <div id="myquestionsAndAnswers">
    <div class="content">
      <el-row :gutter="12">
        <el-col :span="16">
          <el-tabs v-model="activeName">
            <el-tab-pane label="常见问答" name="first">
              <el-input size="mini" placeholder="输入问题关键字" v-model="input" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <div class="search">
                <el-input size="mini" placeholder="请输入您的问题，不超过50字"></el-input>
                <el-button>提问</el-button>
              </div>
              <div class="common">
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
              </div>
              <div class="page">
                <el-pagination
                  background
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currentPage"
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="2355">
                </el-pagination>
                <el-radio-group v-model="radio" size="mini">
                  <el-radio-button label="30">30条</el-radio-button>
                  <el-radio-button label="50">50条</el-radio-button>
                </el-radio-group>
              </div>
            </el-tab-pane>
            <el-tab-pane label="我的问答" name="second">
              <el-input size="mini" placeholder="输入问题关键字" v-model="input" class="input-with-select">
                <el-button slot="append" icon="el-icon-search"></el-button>
              </el-input>
              <div class="search">
                <el-input size="mini" placeholder="请输入您的问题，不超过50字"></el-input>
                <el-button>提问</el-button>
              </div>
               <div class="common">
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                </div>
                <div class="commonTotal">
                  <p class="commonQuestion">
                    <span>问题： 这是常见问答的问题，样式和法规列表保持一致</span>
                    <span>提问于 2019.03.03</span>
                  </p>
                  <p class="commonAnswer">
                    <span>回答：</span>
                    <span>这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容这里的文字不进行隐藏，若点开展开，显示所有内容</span>
                  </p>
                </div>
              </div>
              <div class="lists">
                <ul>
                  <li v-for="list in lists" :key="list.index">
                      <span class="title">{{ list.title }}</span>
                      <span class="time">{{ list.time }}</span>
                  </li>
                </ul>
              </div>
              <div class="page">
                <el-pagination
                  background
                  @size-change="handleSizeChange1"
                  @current-change="handleCurrentChange1"
                  :current-page.sync="currentPage"
                  :page-size="5"
                  layout="prev, pager, next, jumper"
                  :total="2355">
                </el-pagination>
                <el-radio-group v-model="radio" size="mini">
                  <el-radio-button label="30">30条</el-radio-button>
                  <el-radio-button label="50">50条</el-radio-button>
                </el-radio-group>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="8">

        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: "myquestionsAndAnswers",
    data() {
      return {
        code1: 'show1',
        code2: 'show2',
        activeName: 'first',
        lists: [
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'},
          {title: '问题： 这是常见问答的问题，样式和法规列表保持一致', time: '提问于 2019.03.03'}
        ],
        radio: '30',
        input: '',
        currentPage: 1
      }
    },
    methods: {
      handleSizeChange() {

      },
      handleCurrentChange() {

      },
      handleSizeChange1() {

      },
      handleCurrentChange1() {

      }
    }
  }
</script>

<style lang="scss">
  #myquestionsAndAnswers {
    padding: 16px 0 40px;
    .el-col-16 {
      width:896px;
      .el-tabs {
        background:rgba(255,255,255,1);
        border-radius:4px;
        padding: 0 16px 36px;
        .el-tabs__header {
          position: relative;
          overflow: inherit;
        }
        .el-tabs__content {
          overflow: inherit;
        }
        .el-tabs__nav-wrap::after {
          height: 1px;
        }
        .import {
          width:80px;
          position: absolute;
          right: 0;
          top: -48px;
        }
        .el-table {
          margin-bottom: 28px;
          th, td {
            height: 40px;
            padding: 0;
            border: none;
          }
          th {
            font-size:14px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(141,141,141,1);
            background:rgba(0,0,0,0.03);
          }
          td {
            font-size:12px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(50,50,50,1);
          }
          td:nth-child(3) {
            color:rgba(141,141,141,1);
          }
          .icon {
            display: inline-block;
            width:24px;
            height:16px;
            background:rgba(255,177,72,1);
            border-radius:4px;
            font-size:10px;
            font-family:PingFangSC-Regular;
            font-weight:400;
            color:rgba(255,255,255,1);
            line-height: 16px;
            margin-left: 5px;
            text-align: center;
          }
          .button {
            span {
              font-size:12px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(141,141,141,1);
            }
          }
        }
        .el-table::before {
          height: 0;
        }
        .page {
          display: flex;
          justify-content: space-between;
        }
        .input-with-select {
          width:332px;
          position: absolute;
          right: 0;
          top: -48px;
          .el-input__inner {
            border:1px solid rgba(255,224,182,1);
          }
          .el-input-group__append {
            background:rgba(255,177,72,1);
            border-color: rgba(255,224,182,1);
            .el-icon-search {
              color: #ffffff;
            }
          }
        }
        .common {
          .commonTotal {
            padding: 12px 0;
            border-bottom: 1px solid rgba(0,0,0,0.08);
            .commonQuestion {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 12px;
              span:first-child {
                font-size:16px;
                font-family:PingFangSC-Medium;
                font-weight:600;
                color:rgba(50,50,50,1);
                line-height:22px;
              }
              span:last-child {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(174,174,174,1);
                line-height:20px;
              }
            }
            .commonAnswer {
              display: flex;
              span:first-child {
                display: inline-block;
                width: 100px;
                font-size:16px;
                font-family:PingFangSC-Semibold;
                font-weight:600;
                color:rgba(84,84,84,1);
                line-height:22px;
              }
              span:last-child {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(84,84,84,1);
                line-height:22px;
              }
            }
          }
          .commonTotal:last-child {
            margin-bottom: 38px;
          }
        }
        .el-tab-pane:nth-child(2) {
          .common {
            .commonTotal:last-child {
            margin-bottom: 0;
          }
          }
        }
        .search {
          height: 53px;
          padding-bottom: 16px;
          display: flex;
          justify-content: space-between;
          .el-input__inner {
            padding: 0;
            padding-left: 8px;
            width: 788px;
            height: 36px;
          }
          .el-button {
            padding: 0;
            width: 60px;
            height: 36px;
            background:rgba(255,177,72,1);
            border-radius:4px;
            border: none;
            span {
              font-size:14px;
              font-family:PingFangSC-Regular;
              font-weight:400;
              color:rgba(255,255,255,1);
            }
          }
        }
        .lists {
          ul {
            margin-bottom: 26px;
            li {
              padding-top: 13px;
              height: 46px;
              line-height: 46px;
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid rgba(0, 0, 0, 0.08);
              .title {
                font-size:16px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(50,50,50,1);
                line-height:22px;
              }
              .time {
                font-size:14px;
                font-family:PingFangSC-Regular;
                font-weight:400;
                color:rgba(141,141,141,1);
                line-height:20px;
              }
            }
          }
        }
      }
    }
    .el-col-8 {
      width:292px;
      height:164px;
      background:rgba(255,252,243,1);
      border-radius:4px;
    }
  }
</style>
