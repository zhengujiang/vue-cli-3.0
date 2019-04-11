<template>
  <div class="focus-stock" ref="stockDom" :style="{height:height+'px'}">
    <div class="stock-tab-box" ref="tabBoxDom">
      <ul class="ul">
        <li v-for="(list,index) in stockTab" :class="list.type" @click="stockFiltering(index)">
          <span>{{list.name}}</span>
          <span v-show="list.active" class="way">
            <span class="wayicon top" v-show="list.top"></span>
            <span class="wayicon bottom" v-show="!list.top"></span>
          </span>
        </li>
      </ul>
    </div>
    <div class="stock-container" :style="{height:tabHeight+'px'}">
      <swipeout>
        <swipeout-item transition-mode="follow" v-for="(list,index) in focusData" :key="index">
          <div slot="right-menu">
            <swipeout-button background-color="#ffb148" @click.native="onOffClick(index)">取消关注</swipeout-button>
          </div>
          <div slot="content" class="vux-1px-b" @click="toLink(index)">
            <ul class="swipeout-content">
              <li class="name">
                <p class="title">{{list.zhongWenJianCheng}}</p>
                <p class="code">
                  <span class="code-img">
                    <img :src="SH" v-if="list.obj.indexOf('SH') >-1"/>
                    <img :src="SZ" v-else-if="list.obj.indexOf('SZ') >-1"/>
                  </span>
                  <span class="text">{{codeSubstring(list.obj)}}</span></p>
              </li>
              <li class="zuiXinJia">
                <p :style="{color:'black'}" v-if="list.zuiXinJia == -100">--</p>
                <p :style="{color:'black'}" v-else-if="list.zhangDie == 0">{{list.zuiXinJia}}</p>
                <p :style="{color:'#fb4319'}" v-else-if="list.zhangDie > 0">{{list.zuiXinJia}}</p>
                <p :style="{color:'#29da89'}" v-else-if="list.zhangDie < 0">{{list.zuiXinJia}}</p>
              </li>
              <li class="zhangDie">
                <p :style="{color:'black'}" v-if="list.zhangDie == -100">--</p>
                <p :style="{color:'black'}" v-else-if="list.zhangDie == 0">{{list.zhangDie}}</p>
                <p :style="{color:'#fb4319'}" v-else-if="list.zhangDie > 0">{{list.zhangDie}}</p>
                <p :style="{color:'#29da89'}" v-else-if="list.zhangDie < 0">{{list.zhangDie}}</p>
              </li>
              <li class="zhangFu">
                <p :style="{color:'black'}" v-if="list.zhangFu == -100">--</p>
                <p :style="{color:'black'}" v-else-if="list.zhangFu == 0">{{list.zhangFu}}%</p>
                <p :style="{color:'#fb4319'}" v-else-if="list.zhangFu > 0">{{list.zhangFu}}%</p>
                <p :style="{color:'#29da89'}" v-else-if="list.zhangFu < 0">{{list.zhangFu}}%</p>
              </li>
            </ul>
          </div>
        </swipeout-item>
      </swipeout>
    </div>
    <xiaoan-loading v-show="loading"></xiaoan-loading>
    <xiaoan-warning v-show="warning.show" :imgSrc="warning.img"
                    @click="addFocusClick" :hintBtn="warning.btnText"
                    :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
    <div class="stock-addFocus" @click="addFocusClick">
      <div class="box">
        <i class="icon iconfont icon-jia4"></i>
      </div>
    </div>
  </div>
</template>

<script>
  import {Swipeout, SwipeoutButton, SwipeoutItem} from 'vux'
  import XiaoanWarning from '../../../../components/warning/warning'
  import XiaoanLoading from '@/components/warning/loading'

  export default {
    name: "focus-stock",
    components: {
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XiaoanWarning,
      XiaoanLoading,
    },
    props: {
      height: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
      active: {
        type: String,
        required: false,//是否必填
        default: 0,
      },
    },
    data() {
      return {
        loading: false,
        warning: {
          top: '25%',
          show: false,
          img: this.$image.personal.toFocus,
          text: '你暂时还没有关注！',
          btnText: '去关注'
        },
        focusData: [],
        focusTimestamp: 0,
        tabHeight: 0,
        SH: this.$image.lookupTables.SH,
        SZ: this.$image.lookupTables.SZ,
        stockTab: [
          {type: 'name', name: '股票名称', active: false, top: true},
          {type: 'zuiXinJia', name: '现价', active: false, top: true},
          {type: 'zhangDie', name: '涨跌', active: false, top: true},
          {type: 'zhangFu', name: '涨跌幅', active: true, top: true}
        ],

      }
    },
    watch: {
      height: function () {
        this.$nextTick(() => {
          this.tabHeight = this.height - this.$refs.tabBoxDom.clientHeight;
          console.log(this.tabHeight, this.height);
        })
      }
    },
    destroyed() {
      console.log('离开页面清除定时器');
      clearInterval(this.setIntervalFocus);
    },
    created() {
      this.loading = true;
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        this.getAttentions();
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.setInterval();
      });
      setTimeout(() => {
        this.loading = false;
      }, 240)
    },
    methods: {
      //
      onOffClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要取消关注吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.deleteAttention(index);
          },
          onCancel() {
          }
        })
      },
      //
      toLink(index) {
        this.$router.push({
          path: '/afficheList',
          query: {
            code: this.focusData[index].obj,
            name: this.focusData[index].zhongWenJianCheng
          }
        });
      },
      //
      deleteAttention(index) {
        /*this.$http ({
          method: "GET",
          url: this.$api.attention.deleteAttention,
          params: {
            companyFullCode: this.focusData[index].obj,
          }
        })*/
        let params = {
          companyFullCode: this.focusData[index].obj,
        }
        this.$axios.attention.deleteAttention(params).then((res) => {
          if (res.data.returnCode == 1) {
            this.getAttentions();
          } else {
            this.$vux.toast.show({text: '取消关注失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      //
      addFocusClick() {
        this.$router.push({path: '/addFocus'});
      },
      //
      stockFiltering(index) {
        if (index == 0) {
          return false
        }
        if (this.focusData.length == 0) {
          return false
        }
        if (this.stockTab[index].active) {
          // 如果是已选择的，
          this.stockTab[index].top == true ? this.stockTab[index].top = false : this.stockTab[index].top = true;
          //
          this.sortArray(this.stockTab[index].top, this.stockTab[index].type, this.focusData);
        } else {
          this.stockTab.forEach((item) => {
            item.active = false;
            item.top = true;
          });
          this.stockTab[index].active = true;
          //
          this.sortArray(this.stockTab[index].top, this.stockTab[index].type, this.focusData);
        }
      },
      //
      codeSubstring(str) {
        return str.replace('SH', '').replace('SZ', '');
      },
      // 小数点后保留两位没有两位填
      toDecimal2(x) {
        let fx = parseFloat(x);
        if (isNaN(fx)) {
          return;
        }
        let f = Math.round(x * 100) / 100;
        let s = f.toString();
        let rs = s.indexOf('.');
        if (rs < 0) {
          rs = s.length;
          s += '.';
        }
        while (s.length <= rs + 2) {
          s += '0';
        }
        return s;
      },
      //
      setInterval() {
        console.log('234324', this.focusTimestamp);
        let that = this;
        this.setIntervalFocus = setInterval(() => {
          that.getAttentions();
        }, 5000);
      },
      // 处理时间戳
      add0(m) {
        return m < 10 ? '0' + m : m
      },
      //
      formatS(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(shijianchuo);
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        var h = time.getHours();
        var mm = time.getMinutes();
        var s = time.getSeconds();
        return y + ',' + this.add0(m) + ',' + this.add0(d) + ',' + this.add0(h) + ',' + this.add0(mm) + ',' + this.add0(s);
      },
      //
      getAttentions() {
        /*this.$http ({
          method: "GET",
          url: this.$api.attention.getAttentions,
          params: {}
        })*/
        this.$axios.attention.getAttentions().then((res) => {
          if (res.data.returnCode == 1) {
            console.log('32434324234', res.data.returnObject);
            let focusData = res.data.returnObject.data;
            this.focusTimestamp = res.data.returnObject.timestamp;
            let currentTime = this.formatS(this.focusTimestamp);
            let currentTimeArr = currentTime.split(',');
            // 判断时间凌晨到9点30之前停止时间函数获取股票信息
            if (currentTimeArr[3] < 10 && currentTimeArr[3] >= 0) {
              if (currentTimeArr[3] == 9 && currentTimeArr[4] <= 30) {
                console.log('清除');
                clearInterval(this.setIntervalFocus);
              } else if (currentTimeArr[3] >= 9 && currentTimeArr[4] > 30) {
                console.log('不用清除定时器');
              } else {
                console.log('清除');
                clearInterval(this.setIntervalFocus);
              }
            } else if (currentTimeArr[3] >= 15) {
              console.log('清除');
              clearInterval(this.setIntervalFocus);
            }
            //
            focusData.forEach((item) => {
              if (item.zhongWenJianCheng.indexOf('暂停上市') > 0) {
                item.zhangFu = -100;
              }
              if (item.shiFouTingPai === true) {
                item.zuiXinJia = -100;
                item.zhangDie = -100;
                item.zhangFu = -100;
              }
              if (item.zuiXinJia == null) {
                item.zuiXinJia = -100
              } else {
                item.zuiXinJia = this.toDecimal2(item.zuiXinJia);
              }
              if (item.zhangDie == null) {
                item.zhangDie = -100
              } else {
                item.zhangDie = this.toDecimal2(item.zhangDie);
              }
              if (item.zhangFu == null) {
                item.zhangFu = -100
              } else {
                item.zhangFu = this.toDecimal2(item.zhangFu);
              }
            });
            let top = {};
            this.stockTab.forEach((item) => {
              if (item.active == true) {
                top = item
              }
            });

            this.sortArray(top.top, top.type, focusData);
            this.focusData = focusData;
          } else if (res.data.returnCode == -1) {
            this.focusData = [];
            this.warning.show = true;
          } else {
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      //
      sortArray(sortFlag, sortKey, array) { //排序
        if (sortFlag) {
          array.sort((a, b) => {
            return b[sortKey] - a[sortKey]
          });
        } else {
          array.sort((a, b) => {
            return a[sortKey] - b[sortKey]
          });
        }
      }
    }
  }
</script>

<style lang="scss">
  .focus-stock {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: relative;
    .stock-tab-box {
      ul.ul {
        width: 100%;
        height: 30px;
        display: table;
        word-wrap: break-word;
        background-color: #f4f5f8;
        padding: 0 12px;
        text-align: center;
        li {
          display: table-cell;
          vertical-align: middle;
          text-align: center;
          font-size: 13px;
          width: 25%;
          color: #8d8d8d;
          &:first-child {
            text-align: left;
            width: 20%;
          }
          &:last-child {
            width: 30%;
            text-align: right;
          }
          .way {
            width: 10px;
            display: inline-block;
            .wayicon {
              height: 10px;
              width: 10px;
              position: relative;
              &:before {
                content: '';
                height: 0;
                width: 0;
                display: inline-block;
                border: 5px transparent solid;
                border-top-width: 0;
                border-bottom-color: #8d8d8d;
                position: absolute;
                left: 0;
                top: 2px;
              }
              &:after {
                content: '';
                height: 0;
                width: 0;
                display: inline-block;
                border: 5px transparent solid;
                border-bottom-width: 0;
                border-top-color: #8d8d8d;
              }
            }
            .wayicon.top {
              &:before {
                border-bottom-color: #ffb148;
              }
            }
            .wayicon.bottom {
              &:after {
                border-top-color: #ffb148;
              }
            }
          }
        }
        .name {
        }
        .zuiXinJia {
          text-align: right;
          width: 23%;
        }
        .zhangDie {
          text-align: right;
          width: 27%;
        }
        .zhangFu {
          text-align: right;
        }
      }
    }
    .stock-container {
      width: 100%;
      background-color: #FFFFFF;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .vux-swipeout {
        .vux-swipeout-item {
          ul.swipeout-content {
            display: table;
            table-layout: fixed;
            word-wrap: break-word;
            height: 55px;
            width: 100%;
            padding: 0 12px;
            li {
              display: table-cell;
              vertical-align: middle;
              width: 25%;
              text-align: center;
              font-size: 15px;
              color: #8d8d8d;
              &:first-child {
                text-align: left;
                width: 20%;
              }
              &:last-child {
                text-align: right;
                width: 30%;
              }
              p {
                color: #323232;
              }
              .title {
                font-size: 15px;
                color: #323232;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-family: PingFangSC-Medium, sans-serif;
                margin-bottom: 3px;
              }
              .code {
                font-size: 12px;
                color: #aeaeae;
                .text {
                  line-height: 1;
                }
                .code-img {
                  img {
                    height: 11px;
                  }
                }
              }
            }
            .name {
            }
            .zuiXinJia {
              text-align: right;
              width: 23%;
            }
            .zhangDie {
              text-align: right;
              width: 27%;
            }
            .zhangFu {
              text-align: right;
            }
          }
        }
      }
    }
    .stock-addFocus {
      position: absolute;
      bottom: 5px;
      right: 5px;
      height: 45px;
      width: 45px;
      background-color: #FFFFFF;
      -moz-box-shadow: 0px 0px 10px #e3e3e3;
      -webkit-box-shadow: 0px 0px 10px #e3e3e3;
      box-shadow: 0px 0px 10px #e3e3e3;
      border-radius: 50%;
      transform: translate3d(-50%, -50%, 0);
      .box {
        position: relative;
        height: 100%;
        width: 100%;
        i {
          font-size: 21px;
          color: #ffb148;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate3d(-50%, -50%, 0);
        }
      }

    }
  }
</style>
