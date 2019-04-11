<template>
  <div class="calendar-search" ref="docmentDom">
    <div class="head-search" ref="headDom">
      <div class="back-invited-head">
        <div class="invited-cell left">
          <input @keyup.13="searchEventList" v-model="SearchIpt" @input="searchChange" type="text"
                 placeholder="输入关键词搜索" ref="inputDom">
        </div>
        <div @click="searchEventList" class="invited-cell right">
          <i class="icon iconfont icon-tripsousuo"></i>
        </div>
      </div>
      <div class="back-invited-body" :style="{height:boxHeight+'px'}">
        <ul class="calendar-all-body-ul">
          <li class="calendar-all-body-li"  :style="{borderLeftColor: borderColorFun(index)}" v-for="(list,index) in calendarEvents">
            <div class="li-top">
              <div class="flex li-top-left">
                <span class="li-top-left-month" v-if="list.eventBeginDate == list.eventEndDate">{{$const.formatArray(list.eventBeginDate)[1]}}月{{$const.formatArray(list.eventBeginDate)[2]}}日</span>
                <span class="li-top-left-month" v-else>{{$const.formatArray(list.eventBeginDate)[1]}}月{{$const.formatArray(list.eventBeginDate)[2]}}日-{{$const.formatArray(list.eventEndDate)[1]}}月{{$const.formatArray(list.eventEndDate)[2]}}日</span>
                <span class="li-top-left-cue" v-show="list.isSystem && list.calendarName != '小安日历'">
                    <span :style="{backgroundColor: '#'+list.calendarColor}">休</span>
                  </span>
                <span class="li-top-left-cue new" v-show="newDate == list.eventBeginDate"><span>今</span></span>
              </div>
            </div>
            <div class="li-bottom" @click="toCalendarDetails(index)">
              <p class="li-bottom-top">{{list.eventName}}</p>
              <p class="li-bottom-bot">
                <span class="li-bottom-bot-left">{{list.calendarName}}</span>
                <span class="li-bottom-bot-right">查看详情<i class="icon iconfont icon-xiangyoujiantou"></i></span>
              </p>
            </div>
          </li>
        </ul>
        <xiaoan-warning v-show="calendarWaringShow" :imgSrc="calendarWaring" @click="hintClick" hintBtn="添加事件"
                        :isShowBtn="false" :topHeight="topHeightWaring" message="当前暂无事件"></xiaoan-warning>
      </div>
    </div>
  </div>
</template>

<script>
  import XiaoanWarning from '../../components/warning/warning'

  export default {
    name: "calendar-search",
    data() {
      return {
        topHeightWaring: '24%',
        calendarWaringShow: false,
        calendarWaring: this.$image.calendar.calendarWaring,
        SearchIpt: "",
        boxHeight: 0,
        calendarEvents: [],
        data: {
          defaultData: [],
          shareData: [],
          marketData: [],
          personalData: []
        },
        newDate: this.$const.getTimestamp(this.$const.getNewDate()),
        calendar: {
          calendarIds: ''
        }
      }
    },
    components: {
      XiaoanWarning
    },
    created() {
      this.getUserCanlendarList();
    },
    mounted() {
      this.$nextTick(() => {
        this.boxHeight = this.$refs.docmentDom.clientHeight - this.$refs.headDom.clientHeight;
      });
      this.$nextTick(() => {
        let doc = '';
        let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll';
        this.$weixin.wxshare('小安日历，众多功能帮您解决“遗忘症”', doc, link, this.$api.share.defaultImg, true);
      });
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.inputDom.focus();
        })
      }, 1200)
    },
    activated() {
      this.calendarWaringShow = false;
      setTimeout(() => {
        this.$nextTick(() => {
          this.$refs.inputDom.focus();
        })
      }, 1200);
      this.getUserCanlendarList();
    },
    destroyed() {
      this.calendarWaringShow = false;
    },
    methods: {
      hintClick() {

      },
      borderColorFun(index) {
        return '#' + this.calendarEvents[index].calendarColor;
        // console.log(index, this.calendarEvents[index]);
      },
      // 个人获取 // 获取我的日历
      getUserCanlendarList() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getUserCanlendarList,
          params: {
            isPC: 0
          }
        })*/
        let params = {isPC: 0}
        this.$axios.calendar.getUserCanlendarList(params).then((res) => {
          console.log('edrwasrdfsafsadfdsfsfdsfs', res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.shareCalendar) {
              this.data.shareData = res.data.returnObject.shareCalendar;
            } else {
              this.data.shareData = [];
            }
            //
            if (res.data.returnObject.personalCalendar) {
              this.data.personalData = res.data.returnObject.personalCalendar;
            } else {
              this.data.personalData = [];
              // 如果没有日历 默认帮助他创建默认日历
              this.addCalendar();
            }
            // 获取的市场日历
            if (res.data.returnObject.marketCalendar) {
              this.data.marketData = res.data.returnObject.marketCalendar;
            }
            //
            let data = [];
            this.data.defaultData = data.concat(this.data.marketData, this.data.shareData, this.data.personalData);
            let newData = [];
            this.data.defaultData.forEach((item) => {
              if (item.isCheck == true) {
                newData.push(item.id);
              }
            });
            this.calendar.calendarIds = newData.join(",");
            this.$nextTick(() => {
              if (this.$array.trim(this.SearchIpt)) {
                this.searchEventList();
              }
            })
          }
        }).catch((err) => {

        })
      },
      // 个人获取
      searchChange() {

      },
      //
      toCalendarDetails(index) {
        console.log(this.calendarEvents[index]);
        // 模板事件
        if (this.calendarEvents[index].isSystem === true) {
          this.$router.push({
            path: '/calendar/calendarShareEventDetails',
            query: {id: this.calendarEvents[index].id, type: this.calendarEvents[index].eventType}
          });
        } else if (this.calendarEvents[index].isSystem === false) {
          this.$router.push({
            path: '/calendar/calendarEventDetails',
            query: {id: this.calendarEvents[index].id, type: this.calendarEvents[index].eventType}
          });
        }
      },
      searchEventList() {
        if (this.$array.trim(this.SearchIpt) == '') {
          return false
        }
        this.calendarEvents = []
        /*this.$http ({
          url: this.$api.calendar.searchEventList,
          method: "GET",
          params: {
            calendarIDs: this.calendar.calendarIds,
            eventName: this.SearchIpt
          }
        })*/
        let params = {
          calendarIDs: this.calendar.calendarIds,
          eventName: this.SearchIpt
        }
        this.$axios.calendar.searchEventList(params).then((res) => {
          console.log("111", res.data.returnObject)
          if (res.data.returnCode == 1) {
            let arr = res.data.returnObject;
            if (arr == null || arr == [] || arr.length == 0) {
              this.calendarWaringShow = true;
            } else {
              this.calendarEvents = arr;
              this.calendarWaringShow = false;
              console.log(this.calendarEvents);
            }
          } else {
          }
        })
      }

    }
  }
</script>

<style lang="scss">
  .calendar-search {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
    .head-search {
      .back-invited-head {
        height: 45px;
        width: 100%;
        display: table;
        background-color: #f0f1f5;
        padding: 0 12px;
        .invited-cell {
          display: table-cell;
          vertical-align: middle;
          input {
            height: 30px;
            text-align: left;
            font-size: 14px;
            border: 1px solid transparent;
            background-color: #FFFFFF;
            width: 100%;
            padding: 0 10px;
          }
          button {
            height: 30px;
            font-size: 14px;
            border: 1px solid transparent;
            background-color: #FFFFFF;
            color: #ffb148;
            padding: 0 5px;
            text-align: right;
          }
        }
        .invited-cell.left {
          text-align: left;
          width: 85%;
        }
        .head-search {
          .back-invited-head {
            height: 45px;
            width: 100%;
            display: table;
            background-color: #f0f1f5;
            padding: 0 12px;
            .invited-cell {
              display: table-cell;
              vertical-align: middle;
              input {
                height: 30px;
                text-align: left;
                font-size: 14px;
                border: 1px solid transparent;
                background-color: #FFFFFF;
                width: 100%;
                padding: 0 10px;
              }
              button {
                height: 30px;
                font-size: 14px;
                border: 1px solid transparent;
                background-color: #FFFFFF;
                color: #ffb148;
                padding: 0 5px;
                text-align: right;
              }
            }
            .invited-cell.left {
              text-align: left;
              width: 85%;
            }
            .invited-cell.right {
              text-align: right;
              width: 10%;
              i {
                font-size: 25px;
              }
            }
          }

        }

        .invited-cell.right {
          text-align: right;
          width: 10%;
          i {
            font-size: 25px;
          }
        }
      }
      .back-invited-body {
        position: relative;
        width: 100%;
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        ul.calendar-all-body-ul {
          width: 100%;
          padding: 12px 12px;
          box-sizing: border-box;
          background-color: #FFFFFF;
          li.calendar-all-body-li {
            border: 0.5px solid #f0f1f5;
            padding: 10px 10px;
            background-color: #FFFFFF;
            color: #545454;
            margin-bottom: 15px;
            border-radius: 5px;
            -moz-box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
            -webkit-box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
            border-left: 4px solid #c73560;
            &:last-child {
              margin-bottom: 0;
            }
            .li-top {
              display: table;
              border-bottom: 0.6px solid #e3e3e3;
              padding-bottom: 5px;
              width: 100%;
              .flex {
                display: table-cell;
                vertical-align: middle;
              }
              .li-top-left {
                .li-top-left-day {
                  font-size: 23px;
                  line-height: 1;
                }
                .li-top-left-month {
                  font-size: 15px;
                }
                .li-top-left-cue.new {
                  span {
                    background-color: #849fee;
                  }
                }
                .li-top-left-cue {
                  width: 16px;
                  display: inline-block;
                  height: 16px;
                  font-size: 0;
                  text-align: center;
                  align-items: center;
                  position: relative;
                  bottom: 3px;
                  span {
                    display: inline-block;
                    width: 16px;
                    border-radius: 50%;
                    height: 16px;
                    font-size: 12px;
                    line-height: 16px;
                    text-align: center;
                    color: #FFFFFF;
                    background-color: #fa4319;
                    padding: 0;
                    margin: 0;
                  }
                }
              }
              .li-top-right {
                text-align: right;
                position: relative;
                width: 17%;
                i {
                  font-size: 17px;
                  color: #8d8d8d;
                }
                .color {
                  color: #ffb148;
                }
                img {
                  /*position: absolute;
                  top: 50%;
                  right: 1px;
                  transform: translateY(-50%);*/
                  height: 15px;
                }
              }
            }
            .li-bottom {
              padding-top: 10px;
              .li-bottom-top {
                line-height: 1;
                font-size: 14px;
              }
              .li-bottom-bot {
                font-size: 12px;
                line-height: 1;
                color: #aeaeae;
                display: flex;
                .li-bottom-bot-left {
                  flex: 1;
                  padding-top: 8px;
                }
                .li-bottom-bot-right {
                  flex: 1;
                  text-align: right;
                  padding-top: 8px;
                  i {
                    font-size: 12px;
                    padding-left: 5px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
