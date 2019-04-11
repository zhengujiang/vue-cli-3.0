<template>
  <div class="calendar-backlog">
    <div ref="calendarbody" class="calendar-all-body" :style="{height: allBody+'px'}">
      <ul class="calendar-all-body-ul">
        <li class="calendar-all-body-li" :style="{borderLeftColor: borderColorFun(index)}"
            v-for="(list,index) in calendarEvents">
          <div class="li-top">
            <div class="flex li-top-left">
              <!--<span class="li-top-left-day">{{}}</span>-->
              <span class="li-top-left-month">{{$const.formatArray(list.eventBeginDate)[1]}}月{{$const.formatArray(list.eventBeginDate)[2]}}日</span><span
              class="li-top-left-month" v-if="list.eventBeginDate!=list.eventEndDate">-{{$const.formatArray(list.eventEndDate)[1]}}月{{$const.formatArray(list.eventEndDate)[2]}}日</span>
              <span class="li-top-left-cue" v-show="false"><span>休</span></span>
            </div>
            <!--<div class="flex li-top-right" v-show="list.eventConfirmFrequency != null"-->
            <!--@click="updateRemindChange(index)">-->
            <!--<i class="icon iconfont icon-tixing1" :class="{color:list.eventConfirmFrequency == 1}"></i>-->
            <!--</div>-->
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
    </div>
    <xiaoan-waring v-show="calendarWaringShow" :imgSrc="calendarWaring" @click="hintClick" hintBtn="添加事件"
                   :topHeight="topHeightWaring" message="暂时没有相关事件"></xiaoan-waring>
  </div>
</template>

<script>
  import xiaoanWaring from '@/components/warning/warning'

  export default {
    name: "calendar-backlog",
    components: {
      xiaoanWaring
    },
    data() {
      return {
        calendarWaringShow: false,
        calendarWaring: this.$image.calendar.calendarWaring,
        topHeightWaring: '25%',
        allBody: '',
        img: {
          off: '',
          on: this.$image.calendar.calendarcall
        },
        calendar: {
          calendarIds: '',
          startDate: '',
          endDate: ''
        },
        data: {
          defaultData: [],
          shareData: [],
          marketData: [],
          personalData: []
        },
        calendarEvents: []
      }
    },
    created() {
      this.getUserCanlendarList();
    },
    mounted() {
      this.$nextTick(() => {
        let doc = '';
        let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll';
        this.$weixin.wxshare('小安日历，众多功能帮您解决“遗忘症”', doc, link, this.$api.share.defaultImg, true);
      })
    },
    methods: {
      //
      borderColorFun(index) {
        return '#' + this.calendarEvents[index].calendarColor;
        // console.log(index, this.calendarEvents[index]);
      },
      //
      hintClick() {
        this.addCalendarItems();
      },
      //
      updateRemindChange(index) {
        console.log('32423423423423432', this.calendarEvents[index]);
        if (this.calendarEvents[index].eventType == 1) {
          // 模板事件
          if (this.calendarEvents[index].eventConfirmFrequency == 0) {
            this.updateRemind(index, 1);
          } else if (this.calendarEvents[index].eventConfirmFrequency == 1) {
            this.updateRemind(index, 0);
          }
        } else if (this.calendarEvents[index].eventType == 0) {
          // 日常
          if (this.calendarEvents[index].eventConfirmFrequency == 0) {
            this.changeConfirmType(index, 0);
          } else if (this.calendarEvents[index].eventConfirmFrequency == 1) {
            this.changeConfirmType(index, 1);
          }
        }
      },
      //模板事件 设置提醒
      updateRemind(index, frequency) {
        // 模板事件
        /*this.$http({
          method: 'GET',
          url: this.$api.calendar.updateRemind,
          params: {
            eventId: this.calendarEvents[index].id,
            eventContainsName: this.calendarEvents[index].eventName,
            frequency: frequency
          }
        })*/
        let params = {
          eventId: this.calendarEvents[index].id,
          eventContainsName: this.calendarEvents[index].eventName,
          frequency: frequency
        }
        this.$axios.calendar.updateRemind(params).then((res) => {
          if (res.data.returnCode == 1) {
            console.log(res);
            this.calendarEvents[index].eventConfirmFrequency = frequency;
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({text: '设置提醒方式失败', position: 'middle', type: 'text', width: 'auto', time: 1500});
          }
        }).catch((err) => {

        })
      },
      //
      addCalendarItems() {
        if (this.data.length == 0) {
          this.$vux.toast.show({text: '您暂无工作日历，请先创建日历', position: 'middle', type: 'text', width: 'auto', time: 1500});
          this.$router.push({path: '/calendar/addCalendar', query: {id: 1}});
        } else {
          this.$router.push({path: "/calendar/addCalendarItems"});
        }
      },
      //
      toCalendarDetails(index) {
        console.log(this.calendarEvents[index]);
        // 模板事件
        this.$router.push({
          path: '/calendar/calendarEventDetails',
          query: {id: this.calendarEvents[index].id, type: this.calendarEvents[index].eventType}
        });
      },
      // 获取我的日历
      getCalendarByUserId() {
        /*this.$http({
          method: 'GET',
          url: this.$api.calendar.getCalendarByUserId,
          params: {
            isPC: 0
          }
        })*/
        let params = {isPC: 0}
        this.$axios.calendar.getCalendarByUserId(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.length == 0) {
              // 暂无日历
              this.data = [];
            } else {
              // 有日历
              let data = res.data.returnObject;
              this.data = data
              let newData = [];
              data.forEach((item, index) => {
                item.show = true;
                newData.push(item.id);
              });
              this.calendar.calendarIds = newData.join(",");
              console.log('122313213', this.calendar.calendarIds);
              this.$nextTick(() => {
                this.getEventsListBytimeSlot(this.calendar.calendarIds);
              })
            }
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      // 个人获取 // 获取我的日历
      getUserCanlendarList() {
        let calendarIds = [];
        if (window.sessionStorage.getItem('calendarIds')) {
          calendarIds = window.sessionStorage.getItem('calendarIds').split(',');
        }
        console.log('56757576575757', calendarIds);
        /*this.$http({
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
              this.data.shareData.forEach((item, index) => {
                item.market = false;
              });
            } else {
              this.data.shareData = [];
            }
            //
            if (res.data.returnObject.personalCalendar) {
              this.data.personalData = res.data.returnObject.personalCalendar;
              this.data.personalData.forEach((item) => {
                item.market = false;
              });
            } else {
              this.data.personalData = [];
              // 如果没有日历 默认帮助他创建默认日历
              this.addCalendar();
            }
            // 获取的市场日历
            if (res.data.returnObject.marketCalendar) {
              this.data.marketData = res.data.returnObject.marketCalendar;
              this.data.marketData.forEach((item) => {
                item.market = true;
              });
            }
            //
            let data = [];
            this.data.defaultData = data.concat(this.data.shareData, this.data.personalData);
            let newData = [];
            this.data.defaultData.forEach((item) => {
              newData.push(item.id);
            });
            this.calendar.calendarIds = newData.join(",");
            this.getEventsListBytimeSlot(this.calendar.calendarIds);
          }
        }).catch((err) => {

        })
      },
      // 根据时间段来获取日历
      getEventsListBytimeSlot(calenda) {
        if (calenda == null || calenda == '') {
          return false
        }
        let dayms = 86400000;
        let data = this.$const.getNewDate();
        let startDate = this.$const.getTimestamp(data);
        let endDate = startDate + (dayms * 30);
        //
        /*this.$http({
          method: "GET",
          url: this.$api.calendar.getEventsListBytimeSlot,
          params: {
            calendarIds: calenda,
            startDate: startDate,
            endDate: endDate,
          }
        })*/
        let params = {
          calendarIds: calenda,
          startDate: startDate,
          endDate: endDate,
        }
        this.$axios.calendar.getEventsListBytimeSlot(params).then((res) => {
          console.log('123', res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject == null || res.data.returnObject.length == 0) {
              this.calendarEvents = [];
              this.calendarWaringShow = true
            } else {
              let data = res.data.returnObject;
              let array = [];
              data.forEach((item) => {
                item.events.forEach((k2) => {
                  array.push(k2);
                })
              });
              this.calendarEvents = array;
              console.log('123', this.calendarEvents);
            }
          }
        }).catch((err) => {
          console.error(err);
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .calendar-backlog {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #f0f1f5;
    position: relative;
    .calendar-all-body {
      height: 100%;
      width: 100%;
      position: relative;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      ul.calendar-all-body-ul {
        width: 100%;
        padding: 12px 12px;
        box-sizing: border-box;
        li.calendar-all-body-li {
          border: 0.5px solid #f0f1f5;
          padding: 10px 10px;
          background-color: #FFFFFF;
          color: #545454;
          margin-bottom: 8px;
          border-radius: 5px;
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
</style>
