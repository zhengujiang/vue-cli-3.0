<template>
  <ul class="list">
    <li class="li vux-1px-b" v-for="(item, index) of listData">
      <div class="head">
        <div class="row img">
          <router-link target="_blank" class="a-link"
                       :to="'/investor/personal?market='+ marketFun(item.marketType) +'&name=' + item.userName">
            <img :src="item.img" alt="">
          </router-link>
        </div>
        <div class="row title">
          <div class="title">
            <router-link target="_blank" class="a-link"
                         :to="'/investor/personal?market='+ marketFun(item.marketType) +'&name=' + item.userName">
              {{item.userName}}
              <span class="market sh-bg-color" v-html="formMarket(item.marketType)"
                    v-if="formMarket(item.marketType) == '沪'"></span>
              <span class="market sz-bg-color" v-html="formMarket(item.marketType)" v-else></span>
            </router-link>
          </div>
          <div class="time">{{$common.transTime(item.questionTime)[0]}}</div>
        </div>
        <div class="row btns" v-if="companyCode == item.companyCode && !!!item.answer">
          <el-button type="primary" class="btn-link" @click="link(item.companyCode)">回复</el-button>
        </div>
      </div>
      <div class="details">
        <router-link :to="item.link" target="_blank">
          <div class="question"><span v-html="item.question"></span><span
            class="origin">{{'@'+item.companyName+'('+item.companyCode+')'}}</span>
          </div>
        </router-link>
        <router-link :to="item.link" target="_blank" v-if="item.answer">
          <div class="answer">
            <div class="desc hiddenLine2" v-html="item.answer"></div>
            <div class="about">来自 {{item.companyName}}
              {{$common.transTime(item.answerTime)[1]}}
            </div>
          </div>
        </router-link>
      </div>
    </li>
  </ul>
</template>

<script>
  export default {
    name: "list",
    components: {},
    data() {
      return {
        listData: [],
        userInfo: {},
        companyCode: '',
        marketData: [
          {id: 0, name: '沪市主板'},
          {id: 1, name: '深市主板'},
          {id: 2, name: '深市中小板'},
          {id: 3, name: '深市创业板'}
        ]
      }
    },
    props: {
      data: {
        type: Array,
        require: false,
        default: []
      }
    },
    watch: {
      data: function (arr) {
        this.listData = arr;
        // console.log('data', arr);
      }
    },
    created() {
      if (this.$cookie.get("userInfo")) {
        this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
        this.companyCode = this.userInfo.enterpriseCompanyCode;
      }
      // console.log('3432423', this.userInfo.enterpriseCompanyCode);
      this.listData = this.data;
    },
    methods: {
      formMarket(type) {
        let s = '';
        if (type.indexOf('沪') > -1) {
          s = '沪';
        } else if (type.indexOf('深') > -1) {
          s = '深';
        }
        return s
      },
      marketFun(type) {
        let data = '';
        this.marketData.forEach((item) => {
          if (type.indexOf(item.name) > -1) {
            data = item.id
          }
        })
        // console.log('213123', data);
        return data
      },
      link(code) {
        this.$http({
          methods: 'GET',
          url: this.$api.investor.getHrefByCompanyCode,
          params: {
            companyCode: code
          }
        }).then((res) => {
          // console.log(res.data.returnObject);
          if (res.data.returnCode == 200) {
            // alert(123);
            // this.$common.openWindow(res.data.returnObject);
            var tempWindow = window.open('_blank'); // 先打开页面
            tempWindow.location = res.data.returnObject; // 后更改页面地址
          }
        }).catch((err) => {

        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list {
    .li {
      padding: 15px 0;
      .head {
        display: flex;
        align-items: center;
        padding: 0 0 8px 0;
        .row {
          flex: 1;
          &.img {
            flex: inherit;
            line-height: 1;
            .a-link {
              font-size: 0;
              line-height: 1;
            }
            img {
              height: 40px;
              width: 40px;
              border-radius: 50%;
              display: inherit;
            }
          }
          &.title {
            font-size: 14px;
            color: #323232;
            padding-left: 10px;
            .title {
              .a-link {
                color: #323232;
                &:hover {
                  color: #ffb148;
                }
              }
              &:hover {
                color: #ffb148;
                cursor: pointer;

              }
              .market {
                font-size: 12px;
                color: white;
                border-radius: 2px;
                height: 15px;
                letter-spacing: 0;
                width: 15px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
              }
            }
            .time {
              font-size: 12px;
              color: #AEAEAE;
            }
          }
          &.btns {
            flex: 0 0 10%;
            text-align: right;
            .btn-link {
              border-radius: 2px;
              height: 28px;
              width: 60px;
              padding: 0;
              font-size: 14px;
              color: #FFFFFF;
              font-weight: normal;
            }
          }
        }
      }
      .details {
        padding-left: 50px;
        .question {
          font-size: 14px;
          color: #323232;
          padding-bottom: 7px;
          .origin {
            color: #ffb148;
          }
        }
        .answer {
          padding: 5px 10px;
          background: #FFFAF5;
          border-radius: 4px;
          .desc {
            max-height: 37px;
            overflow: hidden;
            font-size: 14px;
            line-height: 20px;
            color: #545454;
            /*text-align: justify;*/
            .float {
              color: #ffb148;
              float: right;
            }
          }
          .about {
            padding-top: 3px;
            font-size: 12px;
            color: #8d8d8d;
          }
        }
      }

    }
  }
</style>
