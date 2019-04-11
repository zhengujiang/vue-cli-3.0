<template>
  <div class="calendar-share-event-details" ref="contDom">
    <div class="nav" ref="navDom">
      <div v-if="$route.query.type == 0"> <!--日常事件-->
        <tab :prevent-default="false" :line-width="2" custom-bar-width="50px" v-model="active">
          <tab-item v-for="(list,index) in navbar" :key="index"
                    @on-item-click="tabClick" :selected="list.active">{{list.name}}
          </tab-item>
        </tab>
      </div>
      <div v-else>
        <tab :prevent-default="false" :line-width="2" custom-bar-width="50px" v-model="active">
          <tab-item v-for="(list,index) in navbar1" :key="index"
                    @on-item-click="tabClick" :selected="list.active">{{list.name}}
          </tab-item>
        </tab>
      </div>
    </div>
    <div class="tab-container" :style="{height:bodyHeight+'px'}">
      <swiper :min-moving-distance="130" v-model="active" :show-dots="false" :height="'100%'">
        <swiper-item class="box">
          <div class="back-item back-item-box" :style="{height:bodyHeight+'px'}">
            <div>
              <ul class="box-item">
                <li class="list title">事件名称</li>
                <li class="list content">{{templateEventInfo.eventName}}</li>
              </ul>
            </div>
            <div v-if="$route.query.type == 0">
              <ul class="box-item">
                <li class="list title">事件日期</li>
                <li class="list content" v-if="templateEventInfo.eventBeginDate == templateEventInfo.eventEndDate">
                  {{$const.format(templateEventInfo.eventBeginDate)}}
                <li class="list content" v-else>
                  {{$const.format(templateEventInfo.eventBeginDate)}}至{{$const.format(templateEventInfo.eventEndDate)}}
                </li>
              </ul>
            </div>
            <div v-if="$route.query.type == 1 && templateEventInfo.valueList.indexOf('T') > -1">
              <ul class="box-item">
                <li class="list title">会议日期</li>
                <li class="list content">{{$const.format(templateEventInfo.eventTDate)}}</li>
              </ul>
            </div>
            <div v-if="$route.query.type == 1 && templateEventInfo.valueList.indexOf('R') > -1">
              <ul class="box-item">
                <li class="list title">股权登记日</li>
                <li class="list content">{{$const.format(templateEventInfo.eventRDate)}}</li>
              </ul>
            </div>
            <div v-if="$route.query.type == 1 && templateEventInfo.valueList.indexOf('C') > -1">
              <ul class="box-item">
                <li class="list title">差异化分红送转</li>
                <li class="list content" v-if="templateEventInfo.choseBonused">{{'是'}}</li>
                <li class="list content" v-else>{{'否'}}</li>
              </ul>
            </div>
            <div v-if="$route.query.type == 1 && templateEventInfo.valueList.indexOf('B') > -1">
              <ul class="box-item">
                <li class="list title">定期报告</li>
                <li class="list content" v-if="templateEventInfo.reportType == null"></li>
                <li class="list content" v-else>{{reportType(templateEventInfo.reportType)}}</li>
              </ul>
            </div>
            <div v-if="$route.query.type == 1 && templateEventInfo.valueList.indexOf('Y') > -1">
              <ul class="box-item">
                <li class="list title">业绩报告</li>
                <li class="list content" v-if="templateEventInfo.reportType == null"></li>
                <li class="list content" v-else>{{reportType(templateEventInfo.reportType)}}</li>
              </ul>
            </div>
            <div v-if="$route.query.type == 1 && templateEventInfo.valueList.indexOf('P') > -1">
              <ul class="box-item">
                <li class="list title">披露日期</li>
                <li class="list content">{{$const.format(templateEventInfo.eventTDate)}}</li>
              </ul>
            </div>
            <div>
              <ul class="box-item">
                <li class="list title">日&ensp;&ensp;&ensp;&ensp;历</li>
                <li class="list content">{{templateEventInfo.calendarName}}</li>
              </ul>
            </div>
            <div>
              <ul class="box-item">
                <li class="list title">地&ensp;&ensp;&ensp;&ensp;址</li>
                <li class="list content"
                    v-if="templateEventInfo.eventLocation =='' || templateEventInfo.eventLocation == null">{{'无'}}
                </li>
                <li class="list content" v-else>{{templateEventInfo.eventLocation}}</li>
              </ul>
            </div>
            <div>
              <ul class="box-item">
                <li class="list title">提&ensp;&ensp;&ensp;&ensp;醒</li>
                <!--<li class="list content"-->
                <!--v-if="templateEventInfo.eventConfirmFrequency!=0 && templateEventInfo.eventConfirmType != 0 &&templateEventInfo.eventConfirmType !=null">-->
                <!--{{templateEventInfo.eventConfirmName}};{{templateEventInfo.eventConfirmDayName}}-->
                <!--</li>-->
                <li class="list content" v-if="templateEventInfo.isSystem == true">
                  {{templateEventInfo.eventConfirmFrequencyName}}
                </li>
                <li class="list content"
                    v-else-if="!templateEventInfo.isSystem && templateEventInfo.eventConfirmType!=0">
                  {{templateEventInfo.eventConfirmName}};{{templateEventInfo.eventConfirmDayName}}
                </li>
                <li class="list content" v-else>不提醒</li>
              </ul>
            </div>
            <div>
              <ul class="box-item">
                <li class="list title">备&ensp;&ensp;&ensp;&ensp;注</li>
                <li class="list content"
                    v-if="templateEventInfo.eventRemark== '' || templateEventInfo.eventRemark== null">{{'无'}}
                </li>
                <li class="list content" v-else>{{templateEventInfo.eventRemark}}</li>
              </ul>
            </div>
          </div>
        </swiper-item>
        <swiper-item class="box" v-if="$route.query.type == 1">
          <div class="back-item back-node-color" :style="{height:bodyHeight+'px'}">
            <div class="back-item-node">
              <ul class="calendar-all-body-ul">
                <li class="calendar-all-body-li back-node-calendar-box" v-for="(list,index) in eventContainList">
                  <div class="line" :class="{linecolor:newDateT>list.eventEndDate}">
                    <span class="s1"></span>
                  </div>
                  <div class="eventContent" :class="{color:newDateT>list.eventEndDate}">
                    <div class="li-top">
                      <div class="flex li-top-left">
                        <span v-show="list.eventBeginDate" class="li-top-left-month">{{$const.formatArray(list.eventBeginDate)[1]}}月{{$const.formatArray(list.eventBeginDate)[2]}}日</span>
                        <span
                          v-show="(list.eventEndDate && list.eventBeginDate) && list.eventBeginDate !=list.eventEndDate">-</span>
                        <span v-show="list.eventEndDate && list.eventBeginDate !=list.eventEndDate"
                              class="li-top-left-month">{{$const.formatArray(list.eventEndDate)[1]}}月{{$const.formatArray(list.eventEndDate)[2]}}日</span>
                        <span class="li-top-set" v-show="eventCont(list.eventBeginDate, list.eventEndDate)">今</span>
                      </div>
                      <div class="flex li-top-right" v-if="list.eventConfirmFrequency != null"
                           @click="toCalendarFrequency(index)">
                        <i class="icon iconfont icon-tixing1 color" v-show="list.eventConfirmFrequency == 1"></i>
                        <i class="icon iconfont icon-tixing1" v-show="list.eventConfirmFrequency == 0"></i>
                      </div>
                    </div>
                    <div class="li-bottom">
                      <p class="li-bottom-top">{{list.eventName}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </swiper-item>
        <swiper-item class="box" v-if="this.mobileItem.length != 0">
          <div class="back-item" :style="{height:bodyHeight+'px'}">
            <div class="back-item-invited">
              <div class="back-invited-body">
                <swipeout>
                  <swipeout-item v-for="(list, index) in mobileItem" :key="index" transition-mode="follow">
                    <div :slot="'content'" class="invited-li-cell cell-solid">
                      <div class="invited-li-val Left">
                        <img v-if="list.avatar == '' || list.avatar == null" :src="img.on" alt="">
                        <img :src="list.avatar" alt="" v-else>
                      </div>
                      <div class="invited-li-val Right"><span>{{list.mobile}}</span></div>
                    </div>
                  </swipeout-item>
                </swipeout>
              </div>
            </div>
            <xiaoan-waring v-show="calendarWaringData.calendarWaringShow"
                           :imgSrc="calendarWaringData.calendarWaring" @click="hintClick"
                           :hintBtn="calendarWaringData.btnText" :topHeight="calendarWaringData.topHeightWaring"
                           :message="calendarWaringData.text"></xiaoan-waring>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div ref="footerDom" class="calendar-all-footer">
      <button class="footer-home" @click="toHome">
        <span><img :src="bottom.home" alt=""></span>
        <span class="p-txt">主页</span>
      </button>
      <button @click="toDay">
        <span><img :src="bottom.today" alt=""></span>
        <span class="p-txt">今日</span>
      </button>
      <button @click="toCalendarWork">
        <span><img :src="bottom.thing" alt=""></span>
        <span class="p-txt">日历</span>
      </button>
      <button @click="toCalendarBacklog">
        <span><img :src="bottom.calendar" alt=""></span>
        <span class="p-txt">待办事项</span>
      </button>
    </div>
  </div>
</template>

<script>
  import {Swipeout, SwipeoutButton, SwipeoutItem, Swiper, SwiperItem, Tab, TabItem} from 'vux'
  import xiaoanWaring from '@/components/warning/warning'
  import eventTemplateConfig from '@/components/calendar/js/eventTemolateConfig'

  export default {
    name: "calendar-share-event-details",
    components: {
      Tab, TabItem, Swiper, SwiperItem, Swipeout, SwipeoutItem, SwipeoutButton,
      xiaoanWaring
    },
    destroyed() {
      this.$vux.datetime.hide()
    },
    data() {
      return {
        eventTemplateConfigData: eventTemplateConfig,
        calendarWaringData: {
          calendarWaring: this.$image.calendar.calendarWaring,
          topHeightWaring: '24%',
          calendarWaringShow: false,
          text: '暂时没有相关事件',
          btnText: '添加'
        },
        templateEventInfo: {
          valueList: ''
        },
        userHomeData: {},
        mobileItem: [],
        active: 0,
        tabHeight: 0,
        bodyHeight: 0,
        reportTypeData: [
          {id: 1, name: '年度报告'},
          {id: 2, name: '一季报'},
          {id: 3, name: '半年报'},
          {id: 4, name: '三季报'},
          {id: 5, name: '业绩预报'},
          {id: 6, name: '业绩快报'},
        ],
        bottom: {
          home: this.$image.base.home,
          today: this.$image.calendar.today,
          thing: this.$image.calendar.calendar,
          calendar: this.$image.calendar.thing
        },
        navbar: [
          {name: '事件详情', data: 0, id: 0, active: true, show: true},
          {name: '通知对象', data: 2, id: 2, active: false, show: true}
        ],
        navbar1: [
          {name: '事件详情', data: 0, id: 0, active: true, show: true},
          {name: '事件节点', data: 1, id: 1, active: false, show: true},
          {name: '通知对象', data: 2, id: 2, active: false, show: true}
        ],
        eventContainList: [],
        img: {
          off: '',
          on: this.$image.calendar.calendarMobile3x
        }
      }
    },
    watch: {},
    created() {
      this.newDateT = this.$const.getTimestamp(this.$const.getNewDate());
      if (this.$route.query.type == 1) {
        this.getTemplateEventInfo();
      } else if (this.$route.query.type == 0) {
        this.getNormalEventInfo();
      }
      //
      this.userHomeData = this.$cookie.getUserInfo();
    },
    mounted() {
      setTimeout(() => {
        this.$nextTick(() => {
          // console.log(this.$refs.contDom.clientHeight)
          // console.log(this.$refs.navDom.clientHeight)
          // console.log(this.$refs.footerDom.clientHeight)
          // this.tabHeight = this.$refs.contDom.clientHeight - this.$refs.navDom.clientHeight - this.$refs.footerDom.clientHeight;
          this.bodyHeight = this.$refs.contDom.clientHeight - this.$refs.navDom.clientHeight - this.$refs.footerDom.clientHeight;
        });
      })
      this.$nextTick(() => {
        let doc = '';
        let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll';
        this.$weixin.wxshare('小安日历，众多功能帮您解决“遗忘症”', doc, link,this.$api.share.defaultImg, true);
      })
    },
    methods: {
      reportType(dataI) {
        let da = '';
        this.reportTypeData.forEach((item) => {
          if (dataI == item.id) {
            da = item.name
          }
        })
        return da
      },
      hintClick() {

      },
      //
      eventCont(start, end) {
        let newDate = this.$const.getTimestamp(this.$const.getNewDate());
        // console.log(newDate);
        let da = false;
        if (start == null && end == null) {
          // 2
          return false
        } else if (start !== null && end == null) {
          if (newDate == start) {
            return true
          } else {
            return false
          }
          // st 1
        } else if (start == null && end !== null) {
          if (newDate == end) {
            return true
          } else {
            return false
          }
          //end 1
        } else if (start !== null && end !== null) {
          // console.log(1);
          if (newDate == start || newDate == end) {
            return true
          } else {
            return false
          }
          // no
        }
        //
        console.log(start, end);
      },
      //
      getNormalEventInfo() {
        // 日常事件详情
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getNormalEventInfo,
          params: {
            eventId: this.$route.query.id
          }
        })*/
        let params = {
          eventId: this.$route.query.id
        }
        this.$axios.calendar.getNormalEventInfo(params).then((res) => {
          console.log(1234567890123, res);
          if (res.data.returnCode == 1) {
            this.templateEventInfo = res.data.returnObject;
            this.eventContainList = this.templateEventInfo.eventContainList;
            this.mobileItem = this.templateEventInfo.inviterNumbersList ? this.templateEventInfo.inviterNumbersList : [];
            console.log('123213454356436', this.mobileItem);
            if (this.mobileItem == null || this.mobileItem.length == 0) {
              this.navbar = [
                {name: '事件详情', data: 0, id: 0, active: true, show: true},
              ];
              this.navbar1 = Object.assign({}, this.navbar1);
            }

          } else if (res.data.returnCode == -1) {
            // console.log(-1, '错误');
          }
        }).catch(() => {

        })
      },
      //
      getTemplateEventInfo() {
        // 模板获取详情
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getTemplateEventInfo,
          params: {
            eventId: this.$route.query.id
          }
        })*/
        let params = {eventId: this.$route.query.id}
        this.$axios.calendar.getTemplateEventInfo(params).then((res) => {
          //console.log(1234567890, res);
          if (res.data.returnCode == 1) {
            let templateEventInfo = res.data.returnObject;
            this.eventContainList = templateEventInfo.eventContainList;
            this.mobileItem = templateEventInfo.inviterNumberList;
            if (this.mobileItem == null || this.mobileItem.length == 0) {
              this.navbar1 = [
                {name: '事件详情', data: 0, id: 0, active: true, show: true},
                {name: '事件节点', data: 1, id: 1, active: false, show: true},
              ];
              this.navbar1 = Object.assign({}, this.navbar1);
            }
            this.eventTemplateConfigData.forEach((item) => {
              if (item.id == templateEventInfo.templateEventType) {
                templateEventInfo.valueList = item.valueList;
              }
              // console.log(item);
            });
            this.templateEventInfo = templateEventInfo;
            console.log('43535435', this.templateEventInfo)
          } else if (res.data.returnCode == -1) {
            //console.log(-1, '错误');
          }
        }).catch(() => {

        })
      },
      //
      onButtonClick(index) {
        this.mobileItem.splice(index, 1);
        console.log('123', this.mobileItem);
      },
      //
      toHome() {
        this.$router.push({path: '/rule'});
      },
      // 默认今日
      toDay() {
        this.$router.replace({path: '/calendar/calendarAll', query: {date: 1}});
      },
      //
      tabClick(index) {
        console.log('123', index);
        if (this.$route.query.type == 1) {
          //
        } else if (this.$route.query.type == 0) {
          //
        }
      },
      // 进入提心事项
      toCalendarBacklog() {
        this.$router.push({path: '/calendar/calendarBacklog'});
      },
      // 进入日历定位到今天的日期
      toCalendarWork() {
        this.$router.push({path: '/calendar/calendarList'});
      },
      //提交按钮
      onsubmitCut(i) {
      }
    }
  }
</script>

<style lang="scss">
  .calendar-share-event-details {
    height: 100%;
    width: 100%;
    background-color: #f0f1f5;
    overflow: hidden;
    .nav {
      width: 100%;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 1);
      white-space: nowrap;
      padding: 0;
      .vux-tab {
        .vux-tab-item.vux-tab-selected {
          border-color: #ffb148;
          font-family: PingFangSC-Medium, sans-serif;
          color: #ffb148;
        }
        .vux-tab-ink-bar {
          .vux-tab-bar-inner {
            background-color: #ffb148;
          }
        }
      }
    }
    .tab-container {
      width: 100%;
      height: auto;
      overflow: hidden;
      * {
        box-sizing: border-box;
      }
      .vux-slider {
        height: 100%;
      }
      .box {
        height: 100%;
        width: 100%;
        overflow: hidden;
        .back-item {
          height: 100%;
          width: 100%;
          background-color: #fff;
          color: #e3e3e3;
          overflow-y: scroll;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;

        }
        .back-item-invited {
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
              width: 15%;
            }
          }
          .back-invited-body {
            .invited-li-cell {
              padding: 0 12px;
              height: 50px;
              width: 100%;
              display: table;
              .invited-li-val {
                display: table-cell;
                vertical-align: middle;
                img {
                  height: 35px;
                  width: 35px;
                  text-align: center;
                  border-radius: 50%;
                  border-color: transparent;
                }
                span {
                  font-size: 14px;
                  line-height: 1;
                  color: #8d8d8d;
                }
              }
              .invited-li-val.Left {
                line-height: 1;
                width: 40px;
              }
              .invited-li-val.Right {

              }
            }
            .invited-li-cell.cell-solid {
              position: relative;
              &:after {
                content: '';
                position: absolute;
                height: 1px;
                width: 100%;
                display: block;
                background-color: #e3e3e3;
                z-index: 15;
                -webkit-transform: scaleY(0.33);
                transform: scaleY(0.33)
              }
              &:after {
                left: 0;
                bottom: 0;
                -webkit-transform-origin: 50% 70%;
                transform-origin: 50% 70%
              }
            }
          }
        }
        .back-item-box div {
          color: #8d8d8d;
          width: 100%;
          padding: 12px 12px 0 12px;
          .box-item {
            display: table;
            font-size: 15px;
            width: 100%;
            .list {
              display: table-cell;
              vertical-align: top;
              word-break: break-all;
            }
            .list.title {
              width: 32%;
            }
            .list.content {

            }
          }
        }
        .back-item-node {
          ul.calendar-all-body-ul {
            width: 100%;
            padding: 0 12px 12px 18px;
            box-sizing: border-box;
            background-color: #FFFFFF;
            li.calendar-all-body-li {
              background-color: transparent;
              color: #545454;
              padding-top: 10px;
              border-radius: 5px;
              &:last-child {
              }
              .li-top {
                display: table;
                padding-bottom: 5px;
                width: 100%;
                .flex {
                  display: table-cell;
                  vertical-align: middle;
                }
                .li-top-left {
                  .li-top-left-day {
                    font-size: 21px;
                    line-height: 1;
                  }
                  .li-top-left-month {
                    font-size: 15px;
                  }
                  .li-top-set {
                    display: inline-block;
                    height: 17px;
                    width: 17px;
                    border-radius: 50%;
                    background-color: #849fee;
                    color: #FFFFFF;
                    font-size: 10px;
                    text-align: center;
                    vertical-align: top;
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
                  width: 10%;
                  i {
                    position: absolute;
                    top: 50%;
                    right: 1px;
                    transform: translateY(-50%);
                    height: 15px;
                  }
                  i.color {
                    color: #ffb148;
                  }
                }
              }
              .li-bottom {
                padding-top: 5px;
                .li-bottom-top {
                  line-height: 1;
                  padding-bottom: 3px;
                  font-size: 14px;
                  color: #aeaeae;
                }
                .li-bottom-bot {
                  font-size: 12px;
                  line-height: 1;
                  color: #aeaeae;
                  display: flex;
                  .li-bottom-bot-left {
                    flex: 1;
                  }
                  .li-bottom-bot-right {
                    flex: 1;
                    text-align: right;
                    i {
                      font-size: 12px;
                      padding-left: 5px;
                    }
                  }
                }
              }
            }
            .back-node-calendar-box {
              position: relative;
              /*margin: 12px 0;*/
              .line {
                display: inline-block;
                position: absolute;
                top: 50%;
                transform: translate(-45%, -50%);
                border-radius: 50%;
                width: 12px;
                height: 12px;
                border: 0.5px solid #aeaeae;
                &:before {
                  content: "";
                  border-radius: 50%;
                  position: absolute;
                  left: 50%;
                  top: 50%;
                  transform: translateY(-50%) translateX(-50%);
                  width: 3px;
                  height: 3px;
                  border: 0.5px solid #aeaeae;
                  background-color: #aeaeae;
                }
              }
              &:before {
                content: '';
                height: 200%;
                width: 1px;
                position: absolute;
                display: inline-block;
                left: 0;
                top: -100%;
                transform: scale(0.5);
                background-color: #aeaeae;
              }
              .eventContent {
                margin: 0 0 0 20px;
                padding: 10px 8px;
                border-top: 2px solid #ffb148;
                border-radius: 5px;
                -webkit-box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
                box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
                background-color: #fff8ee;
                font-size: 14px;
                position: relative;

                .text-black4 {

                }
              }
              .eventContent.color {
                background-color: #f9f9f9;
                border: 0;
              }
            }
          }
        }
        .back-item.back-node-color {
          // background-color: #f0f1f5;
        }
      }
    }
    .add-calendar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50px;
      width: 100%;
      display: flex;
      z-index: 100;
      &:before {
        content: '';
        position: absolute;
        height: 1px;
        width: 100%;
        display: block;
        background-color: #e3e3e3;
        z-index: 15;
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
        left: 0;
        top: 0;
        -webkit-transform-origin: 50% 20%;
        transform-origin: 50% 20%
      }
      button {
        flex: 1;
        font-size: 17px;
        background-color: #ffb148;
        color: #FFFFFF;
        border: 0;
      }
    }
    .calendar-all-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50px;
      width: 100%;
      display: flex;
      text-align: center;
      .footer-home:active {
        background-color: #e3e3e3;
        -webkit-transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .footer-home {
        flex: 0.5;
        border-right: 0.5px solid #e3e3e3;
      }
      button {
        flex: 1;
        border: 0;
        img {
          height: 20px;
        }
        .p-txt {
          display: block;
          font-size: 11px;
          color: #8d8d8d;
        }
      }
      &:before {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: 1px;
        border-top: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
  }
</style>
