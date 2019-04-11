<template>
  <div class="calendar-all" ref="docmentDom">
    <div class="calendar-all-header vxa-flex-box align" ref="headDom">
      <div class="col header-date" @click="dateCalendarPlugin">
        <span>{{calendar.data[0]+'年'+ $const.add0(calendar.data[1])+'月'+ $const.add0(calendar.data[2])+'日'}}</span>
      </div>
      <div class="col header-schema-date">
        <button-tab v-model="weatherData" height="24">
          <button-tab-item v-for="(item, index) in weather" :key="index" @on-item-click="schemaChange">{{item.name}}
          </button-tab-item>
        </button-tab>
      </div>
      <div class="col t-right header-search-date">
        <button class="search" @click="toCalendarSearch">
          <i class="icon iconfont icon-tripsousuo"></i>
        </button>
        <button class="add" @click="addCalendarItems">
          <i class="icon iconfont icon-jia4"></i>
        </button>
      </div>

      <!--<div class="all-header left">
        <ul class="all-header-bal">
          <li class="header-date">
            <input id="headdate" type="date" v-model="dateVal" ref="dateDom" class="dateAll">
          </li>
          <li class="header-switch">
            &lt;!&ndash;<button class="switch-btn">日历</button>&ndash;&gt;
            &lt;!&ndash;<button class="switch-btn">周历</button>&ndash;&gt;
            <button class="head-select" @click="visible = true">
              <i class="icon iconfont icon-xiangxiajiantou"></i>
              <span class="text">{{weather[selectSchema].name}}</span>
            </button>
          </li>
        </ul>
      </div>
      <div class="all-header" @click="toCalendarSearch">
        <i class="icon iconfont icon-tripsousuo"></i>
      </div>
      <div class="all-header right">
        <i class="icon iconfont icon-jia4" @click="addCalendarItems()"></i>
      </div>-->
    </div>
    <div ref="calendarDom" class="xiaoan-calendar">
      <div class="" v-if="weather[0].show">
        <weekly-calendar
          ref="calendarZhouDom"
          :value="calendar.value"
          :events="calendar.events"
          :annotation="calendar.annotation"
          @select="select"
          @weekAround="weekAround"
        >
        </weekly-calendar>
      </div>
      <div class="" v-if="weather[1].show">
        <calendar
          ref="calendarYueDom"
          :events="calendar.events"
          :lunar="calendar.lunar"
          :zero="calendar.zero"
          :value="calendar.value"
          :begin="calendar.begin"
          :end="calendar.end"
          :annotation="calendar.annotation"
          @select="select"
          @selectMonth="selectMonth">
        </calendar>
      </div>
    </div>
    <div ref="calendarbody" class="calendar-all-body" :style="{height: allBody+'px'}">
      <div class="calendar-scroller" :style="{height: allBody+'px'}">
        <ul class="calendar-all-body-ul">
          <li class="calendar-all-body-li" :style="{borderLeftColor: borderColorFun(index)}"
              v-for="(list,index) in calendarEvents">
            <div class="calendar-all-body-box">
              <div class="li-top">
                <div class="flex li-top-left" @click="toCalendarDetails(index)">
                  <span class="li-top-left-month">{{$const.formatArray(list.eventBeginDate)[1]}}月{{$const.formatArray(list.eventBeginDate)[2]}}日</span><span
                  class="li-top-left-month" v-if="list.eventBeginDate!=list.eventEndDate">-{{$const.formatArray(list.eventEndDate)[1]}}月{{$const.formatArray(list.eventEndDate)[2]}}日</span>
                  <span class="li-top-left-cue" v-show="list.market && list.calendarName != '小安日历'">
                    <span :style="{backgroundColor:'#'+list.calendarColor}">休</span>
                  </span>
                  <span class="li-top-left-cue new" v-show="newDate == list.eventBeginDate"><span>今</span></span>
                </div>
                <div class="flex li-top-right"
                     v-show="list.eventConfirmFrequency !== '' && list.eventConfirmFrequency !== null && !list.isSystem"
                     @click="updateRemindChange(index)">
                  <i class="icon iconfont icon-tixing1" :class="{color:list.eventConfirmFrequency == 1}"></i>
                </div>
              </div>
              <div class="li-bottom" @click="toCalendarDetails(index)">
                <p class="li-bottom-top" v-if="list.eventRemark" v-html="replaceBr(list.eventRemark)"></p>
                <p class="li-bottom-top" v-else v-html="replaceBr(list.eventName)"></p>
                <p class="li-bottom-bot">
                  <span class="li-bottom-bot-left">{{list.calendarName}}</span>
                  <span class="li-bottom-bot-right">查看详情<i class="icon iconfont icon-xiangyoujiantou"></i></span>
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <xiaoan-waring v-show="calendarWaringShow" :imgSrc="calendarWaring" @click="hintClick" hintBtn="添加事件"
                     :topHeight="topHeightWaring" message="暂时没有相关事件"></xiaoan-waring>
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
    <div v-transfer-dom>
      <confirm v-model="showConfirm.show" :close-on-confirm="false" :cancel-text="showConfirm.cancel"
               :confirm-text="showConfirm.confirm"
               :title="''" @on-confirm="confirmClick">
        <div class="content">{{showConfirm.text}}</div>
      </confirm>
    </div>
    <xiaoan-loading v-show="loading" bgColor="rgba(0,0,0,0.5)"></xiaoan-loading>
  </div>
</template>

<script>
  import calendar from '@/components/calendar/vue/calendar.vue'
  import weeklyCalendar from '@/components/calendar/vue/weeklyCalendar'
  import xiaoanWaring from '@/components/warning/warning'
  import XiaoanLoading from '../../components/warning/loading'
  import {
    Cell, Confirm, Group, Picker, Popup, Swipeout, XButton, SwipeoutButton, SwipeoutItem,
    TransferDomDirective as TransferDom, XSwitch, ButtonTab, ButtonTabItem
  } from 'vux'
  export default {
    directives: {
      TransferDom
    },
    name: "calendar-all",
    data() {
      return {
        loading: false,
        userHome: {},
        shareFriendData: {},
        showConfirm: {
          show: false,
          text: '确认删除吗？删除后数据不保存！',
          cancel: '取消',
          confirm: '添加'
        },
        topHeightWaring: '24%',
        calendarWaringShow: false,
        calendarWaring: this.$image.calendar.calendarWaring,
        visible: false,
        data: {
          defaultData: [],
          shareData: [],
          marketData: [],
          personalData: []
        },
        marketData: [],
        navbar: [
          {name: '我的日历', data: 'my-calendar', id: 0, active: true},
          {name: '市场日历', data: 'market-calendar', id: 1, active: false},
          {name: '共享日历', data: 'sharing-calendar', id: 2, active: false}
        ],
        // test
        allBody: 0,
        dateVal: '',
        selectSchema: 0,
        weather: [
          {id: 0, name: '周历', value: 0, show: true, parent: 0},
          {id: 1, name: '月历', value: 1, show: false, parent: 0}
        ],
        weatherData: 0,
        bottom: {
          home: this.$image.base.home,
          today: this.$image.calendar.today,
          thing: this.$image.calendar.calendar,
          calendar: this.$image.calendar.thing
        },
        closeDataEvent: [],
        calendarEvents: [],
        newDate: this.$const.getTimestamp(this.$const.getNewDate()),
        calendar: {
          value: [], //默认日期
          data: [],
          zero: true,
          lunar: false, // 显示农历
          weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // 周
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // 月
          events: {}, // 显示的提示
          annotation: {}, // 显示的提示
          timestamp: Date.now(), // 当前时间
          startDate: '',
          endDate: '',
          calendarIds: ''
        }
      }
    },
    components: {
      calendar,
      weeklyCalendar,
      Confirm, Popup, Swipeout, SwipeoutItem, SwipeoutButton, Picker,
      xiaoanWaring,
      XiaoanLoading,
      XSwitch, Group, Cell,
      ButtonTab, ButtonTabItem, XButton
    },
    destroyed() {
      this.$vux.datetime.hide()
    },
    watch: {
      'calendar.value': function (val) {
        this.calendar.data = val;
        this.dateVal = val.join('-');
        console.log('1234567890', this.dateVal);
      },
      'dateVal': function (val) {
        if (val == '' || val == undefined) {
        } else {
          this.calendar.value = val.split('-');
        }
      }
    },
    created() {
      //
      if (this.$cookie.getUserInfo()) {
        this.userHome = this.$cookie.getUserInfo();
      } else {
        this.userHome.weixinUsername = '好友';
      }
      //
      if (this.$route.query.cid) {
        console.log(123, '有cid');
        let link = decodeURI(this.$route.query.cid);
        // 通过执行 方法
        this.getShareCalendarInfo(link);
      } else {
        // 没有cid
        console.log(456, '没有cid');
      }
      //
      this.userId = this.$cookie.getCookie('userId');
      if (this.$cookie.isLogin()) {
        this.getUserCanlendarList();
        this.$nextTick(() => {
          console.log('12qqqqq3', this.calendar.value);
          let data = this.$const.getNewDate();
          let date = this.$const.getTimestamp(data);
          let arr = this.$const.getFirstDayOfWeek(date);
          console.log('123arr', data, arr);
          this.calendar.startDate = arr[0];
          this.calendar.endDate = arr[1];
          this.getEventsListBytimeSlot();
        })
      } else {
        this.$storage.loginStatus(this, '我的日历', window.location.href);
      }
      //
    },
    activated() {
      this.$nextTick(() => {
        this.allBody = this.$refs.docmentDom.clientHeight - this.$refs.headDom.clientHeight - this.$refs.calendarDom.clientHeight - this.$refs.footerDom.clientHeight
        console.warn('activated执行成功');
        this.getUserCanlendarList();
        console.log('1', this.newDate, this.$const.getTimestamp(this.$const.getNewDate()));
        //
        if (this.$route.query.date == 1) {
          this.$router.replace({path: '/calendar/calendarAll'});
          setTimeout(() => {
            this.toDay();
          })
        }
      })
    },
    mounted() {
      if (window.sessionStorage.getItem('calendar-date')) {
        this.calendar.value = window.JSON.parse(window.sessionStorage.getItem('calendar-date'));
      } else {
        this.toDay();
      }
      this.$nextTick(() => {
        this.allBody = this.$refs.docmentDom.clientHeight - this.$refs.headDom.clientHeight - this.$refs.calendarDom.clientHeight - this.$refs.footerDom.clientHeight
      });
      this.$nextTick(() => {
        this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'r42kku8n8ssu94yu': 'true'})
        let doc = '';
        let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll';
        this.$weixin.wxshare('小安日历，众多功能帮您解决“遗忘症”', doc, link, this.$api.share.defaultImg, true);
      });
    },
    methods: {
      replaceBr(value) {
        if (value) {
          return value.toString().replace(/\\n/g, '<br/>')
        } else {
          return value
        }
      },
      // 增加日期选择
      dateCalendarPlugin() {
        let that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: that.calendar.value.join('-'),
          onConfirm(val) {
            console.log('plugin Confirm', val);
            that.calendar.value = val.split('-');
            that.calendar.startDate = that.$const.getTimestamp(val)
            that.calendar.endDate = that.$const.getTimestamp(val);
            that.getEventsListBytimeSlot();
            console.log(that.calendar.value);
          },
          onShow() {
            console.log('plugin show');
          },
          onHide() {
            console.log('plugin hide')
          }
        })
      },
      //
      borderColorFun(index) {
        return '#' + this.calendarEvents[index].calendarColor;
        // console.log(index, this.calendarEvents[index]);
      },
      // 添加分享
      addShareCalendar(data) {
        /*this.$http ({
          method: 'POST',
          url: this.$api.calendar.addShareCalendar,
          params: {
            userName: this.userHome.userName,
            shareCalendarColor: data.calendarColor,
            calendarId: data.id,
            calendarName: data.calendarName,
            remark: data.calendarRemark,
            belongsUserId: data.createUserId,
            shareCalendar: '' // 别名
          }
        })*/
        let params = {
          userName: this.userHome.userName,
          shareCalendarColor: data.calendarColor,
          calendarId: data.id,
          calendarName: data.calendarName,
          remark: data.calendarRemark,
          belongsUserId: data.createUserId,
          shareCalendar: '' // 别名
        }
        this.$axios.calendar.addShareCalendar(params).then((res) => {
          console.log(res, this.userHome, this.userHome.userName,
            'shareCalendarColor', data.calendarColor,
            'calendarId', data.id,
            'calendarName', data.calendarName,
            'remark', data.calendarRemark,
            'belongsUserId', data.createUserId,
            'shareCalendarName', '');
          if (res.data.returnCode == 1) {
            this.$vux.toast.show({text: '添加成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$router.push({path: '/calendar/calendarList'});
          } else if (res.data.returnCode == 2) {
            this.$router.replace({path: '', query: {}});
            this.$router.push({path: '/calendar/calendarModifyColor', query: {id: data.id, isShare: true}});
          } else if (res.data.returnCode == 3) {
            this.$router.replace({path: '/calendar/calendarAll'});
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({
              text: '添加失败',
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
            this.$router.replace({path: '/calendar/calendarAll'});
          }
        }).catch((err) => {
          console.log(err, this.userName, this.userHome.userName,
            'shareCalendarColor', data.calendarColor,
            'calendarId', data.id,
            'calendarName', data.calendarName,
            'remark', data.calendarRemark,
            'belongsUserId', data.createUserId,
            'shareCalendarName', '');
          //
          this.$vux.toast.show({
            text: this.userHome.userName + data.calendarColor + data.id,
            position: 'middle',
            type: 'text',
            width: 'auto',
            time: 2500
          });
          this.$vux.toast.show({text: '添加失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      //
      confirmClick() {
        this.showConfirm.show = false;
        if (this.shareFriendData) {
          this.addShareCalendar(this.shareFriendData);
        }
      },
      //
      getShareCalendarInfo(link) {
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getShareCalendarInfo,
          params: {
            shareCalendarLink: link
          }
        })*/
        let params = {shareCalendarLink: link}
        this.$axios.calendar.getShareCalendarInfo(params).then((res) => {
          // console.log('123', res);
          // console.log('123', this.userHome);
          let data = res.data.returnObject;
          this.shareFriendData = data;
          if (res.data.returnCode == 1) {
            if (data) {
              if (this.userHome.id == data.createUserId) {
                console.warn('自己分享的！！！！！！！！');
                this.$vux.toast.show({
                  text: '不能添加自己分享的日历！', position: 'middle', type: 'text', width: 'auto', time: 2500
                });
              } else {
                this.showConfirm.text = data.calendarName + '，' + '来自' + data.createUserName + '分享';
                this.showConfirm.show = true;
              }
            }
          } else if (res.data.returnCode == 2) {
            this.$vux.toast.show({text: '该日历已被删除', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$router.replace({path: '/calendar/calendarAll'});
          }
        }).catch((err) => {

        })
      },
      //
      hintClick() {
        console.log(1);
        this.addCalendarItems();
      },
      //
      pickerSubmit(i) {
        this.weather.forEach((item, index) => {
          item.show = false;
          if (index == i) {
            item.show = true;
          }
        })
        //
        this.selectSchema = i;
        this.visible = false;
        switch (parseInt(this.selectSchema)) {
          case 0:
            // 周历
            this.topHeightWaring = '25%';
            break;
          case 1:
            this.topHeightWaring = '4%';
            break;
        }
        ;

        this.weather[this.selectSchema].show = true;
        console.log('监听', this.weatherData, this.selectSchema);
        this.$nextTick(() => {
          this.allBody = this.$refs.docmentDom.clientHeight - this.$refs.headDom.clientHeight - this.$refs.calendarDom.clientHeight - this.$refs.footerDom.clientHeight
        });
        let a = this.$const.getDaysInMonth(this.calendar.value[0], this.calendar.value[1])
        console.log('12qqqqq3', this.calendar.value);
        this.calendar.startDate = this.$const.getTimestamp(this.calendar.value[0] + '-' + this.calendar.value[1] + '-' + 1);
        this.calendar.endDate = this.$const.getTimestamp(this.calendar.value[0] + '-' + this.calendar.value[1] + '-' + a);
        this.getEventsListBytimeSlot();
        console.log('1223', this.calendar.startDate, this.allBody);
      },
      //
      toCalendarDetails(index) {
        console.log(this.calendarEvents[index]);
        // 模板事件
        if (this.calendarEvents[index].market == true) {
          this.$router.push({
            path: '/calendar/calendarShareEventDetails',
            query: {id: this.calendarEvents[index].id, type: this.calendarEvents[index].eventType}
          });
        } else {
          if (this.calendarEvents[index].isShare === true) {
            this.$router.push({
              path: '/calendar/calendarShareEventDetails',
              query: {id: this.calendarEvents[index].id, type: this.calendarEvents[index].eventType}
            });
          } else if (this.calendarEvents[index].isShare === false) {
            this.$router.push({
              path: '/calendar/calendarEventDetails',
              query: {id: this.calendarEvents[index].id, type: this.calendarEvents[index].eventType}
            });
          }
        }
        this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'6sddj9m9u9z6kbqh': 'true'})
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
      //
      changeConfirmType(index, frequency) {
        // 模板事件
        /*this.$http ({
          method: 'POST',
          url: this.$api.calendar.changeConfirmType,
          params: {
            eventId: this.calendarEvents[index].id,
            eventName: this.calendarEvents[index].eventName,
            eventConfirmFrequency: frequency,
            eventType: this.calendarEvents[index].eventType
          }
        })*/
        let params = {
          eventId: this.calendarEvents[index].id,
          eventName: this.calendarEvents[index].eventName,
          eventConfirmFrequency: frequency,
          eventType: this.calendarEvents[index].eventType
        }
        this.$axios.calendar.changeConfirmType(params).then((res) => {
          if (res.data.returnCode == 1) {
            console.log(res);
            if (frequency == 0) {
              this.calendarEvents[index].eventConfirmFrequency = 1;
            } else if (frequency == 1) {
              this.calendarEvents[index].eventConfirmFrequency = 0;
            }
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({text: '设置提醒方式失败', position: 'middle', type: 'text', width: 'auto', time: 1500});
          }
        }).catch((err) => {

        })
      },
      // 模板事件设置提醒
      updateRemind(index, frequency) {
        // 模板事件
        /*this.$http ({
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
      // 时间戳转换
      format(shijianchuo) {
        if (shijianchuo == null || shijianchuo == "") {
          let date = "";
          return date
        } else {
          //shijianchuo是整数，否则要parseInt转换
          let time = new Date(parseInt(shijianchuo));
          let y = time.getFullYear();
          let m = time.getMonth() + 1;
          let d = time.getDate();
          return (y + '-' + m + '-' + d)
        }
      },
      // 周历月历切换
      schemaChange(val) {
        this.weatherData = val;
        console.log(val, this.weatherData);
        this.pickerSubmit(val);
        console.log('schemaChange', val);
      },
      // 根据时间段来获取日历
      getEventsListBytimeSlot() {
        if (this.calendar.calendarIds == null || this.calendar.calendarIds == '') {
          this.calendarEvents = [];
          this.calendarWaringShow = true;
          return false;
        }
        // this.calendarWaringShow = false
        this.$store.commit('UPDATE_LOADING', {isLoading: true});
        /*this.$http ({
          method: "GET",
          url: this.$api.calendar.getEventsListBytimeSlot,
          params: {
            startDate: this.calendar.startDate,
            endDate: this.calendar.endDate,
            calendarIds: this.calendar.calendarIds
          }
        })*/
        let params = {
          startDate: this.calendar.startDate,
          endDate: this.calendar.endDate,
          calendarIds: this.calendar.calendarIds
        }
        this.$axios.calendar.getEventsListBytimeSlot(params).then((res) => {
          console.log('getEventsListBytimeSlot', res);
          if (res.data.returnCode == 1) {
            //
            if (res.data.returnObject == null || res.data.returnObject == []) {
              this.calendarEvents = [];
              this.calendarWaringShow = true
            } else {
              // if (this.calendar.annotation) {
              //
              // } else {
              //   let datata = res.data.returnObject;
              //   let date = [];
              //   datata.forEach((keys, i) => {
              //     date.push(this.format(keys.date));
              //   });
              //   let keys = {};
              //   date.forEach((key) => {
              //     let keyValue = {};
              //     keyValue[key] = '';
              //     keys[key] = keyValue[key];
              //   });
              //   this.calendar.annotation = keys;
              // }
              console.log('1111111111111111111111111112342', this.calendar.annotation);
              console.log('res.data.returnObject', res.data.returnObject);
              let data = res.data.returnObject;
              let array = [];
              data.forEach((item) => {
                item.events.forEach((k2) => {
                  array.push(k2);
                });
              });
              this.data.defaultData.forEach((k1) => {
                array.forEach((k2) => {
                  if (k1.id === k2.calendarId) {
                    k2.isShare = k1.isShare;
                    k2.market = k1.market;
                  }
                })
              });
              // let nowResult = [];
              // let result = [];
              // let obj = {};
              // (function (arr) {
              //   for (let i = 0; i < arr.length; i++) {
              //     if (!obj.hasOwnProperty(arr[i].id)) {
              //       result.push(arr[i]);
              //       obj[arr[i].id] = 0;
              //     } else {
              //       nowResult.push(arr[i]);
              //     }
              //   }
              // })(array);
              //
              // result.forEach((k1) => {
              //   nowResult.forEach((k2) => {
              //     if (k1.id == k2.id) {
              //       if (k1.eventBeginDate > k2.eventBeginDate) {
              //         k1.eventEndDate = k1.eventBeginDate;
              //       } else {
              //         k1.eventEndDate = k2.eventBeginDate;
              //       }
              //     }
              //   })
              // })
              // console.log('============', result);
              // this.calendarEvents = result;
              this.calendarEvents = array;
              this.calendarWaringShow = false;
            }
            setTimeout(() => {
              this.$store.commit('UPDATE_LOADING', {isLoading: false});
            }, 300)
          } else {
            this.calendarEvents = [];
            this.calendarWaringShow = true
          }
        }).catch((err) => {
          console.error(err);
          setTimeout(() => {
            this.$store.commit('UPDATE_LOADING', {isLoading: false});
          }, 1000)
        })
      },
      //
      addCalendar() {
        /*this.$http ({
          method: 'POST',
          url: this.$api.calendar.addCalendar,
          params: {
            calendarName: '我的日历',
            calendarRemark: '创建我的日历',
            calendarColor: 'c73560'
          }
        })*/
        let params = {
          calendarName: '我的日历',
          calendarRemark: '创建我的日历',
          calendarColor: 'c73560'
        }
        this.$axios.calendar.addCalendar(params).then((res) => {
          console.log('api', res);
          if (res.data.returnCode == 1) {
            this.getUserCanlendarList();
          } else if (res.data.returnCode == -1) {
            // this.$toast({message: '创建日历失败', position: 'middle', duration: 1500});
          }
        }).catch((err) => {

        })
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
            let districts = [];
            if (res.data.returnObject.marketCalendar) {
              this.data.marketData = res.data.returnObject.marketCalendar;
              this.data.marketData.forEach((item) => {
                item.market = true;
                if (item.isCheck == true) {
                  districts.push(item.marketCalendarCode);
                }
              });
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
            this.getEventsListBytimeSlot();
            this.getAllCloseDate(districts);
          }
        }).catch((err) => {

        })
      },
      // 跳转到搜索页
      toCalendarSearch() {
        this.$router.push({path: '/calendar/calendarSearch'});
        this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'z2v5y4q7pc4pn95c': 'true'})
      },
      // 进入提心事项
      toCalendarBacklog() {
        this.$router.push({path: '/calendar/calendarBacklog'});
        this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'9x7j36fsb8p3t3mz': 'true'})
      },
      // 进入日历定位到今天的日期
      toCalendarWork() {
        this.$router.push({path: '/calendar/calendarList'});
        this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'83uza8fjs4rp2xu8': 'true'})

      },
      // 添加日历时间跳转
      addCalendarItems() {
        if (this.data.length == 0) {
          this.$vux.toast.show({text: '您暂无工作日历，请先创建日历', position: 'middle', type: 'text', width: 'auto', time: 1500});
          this.$router.push({path: '/calendar/addCalendar', query: {id: 1}});
        } else {
          this.$router.push({path: "/calendar/addCalendarItems"});
          this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'v6b2x3p7azc3a79s': 'true'})
        }
      },
      // 周历左右选中
      weekAround(val) {
        let data = val.join('-');
        let arr = this.$const.getFirstDayOfWeek(this.$const.getTimestamp(data));
        // this.getEventsByTime(arr[0], arr[1]);
        console.log('123arr', data, arr);
        this.calendar.startDate = arr[0]
        this.calendar.endDate = arr[1];
        this.getEventsListBytimeSlot();
        console.log('123', val);
        this.calendar.value = val;

      },
      // 月历周历选中
      select(value) {
        console.log('选中某天', value);
        let date = value.year + '-' + value.month + '-' + value.day;
        this.calendar.value = [value.year, value.month, value.day];
        this.calendar.startDate = this.$const.getTimestamp(date)
        this.calendar.endDate = this.$const.getTimestamp(date);

        this.getEventsListBytimeSlot();
      },
      // 左滑切换月份
      selectMonth(years, months) {
        console.log(years, '年', months, '月');
        let d = new Date();
        if (months == d.getMonth() + 1) {
          this.calendar.value = [years, months, d.getDate()];
        } else {
          this.calendar.value = [years, months, 1];
        }
        //

        let number = this.$const.getDaysInMonth(this.calendar.value[0], this.calendar.value[1]);
        console.log('12qqqqq3', number, this.calendar.value);
        this.calendar.startDate = this.$const.getTimestamp(this.calendar.value[0] + '-' + this.calendar.value[1] + '-' + 1);
        this.calendar.endDate = this.$const.getTimestamp(this.calendar.value[0] + '-' + this.calendar.value[1] + '-' + number);
        // this.getEventsByTime(this.calendar.startDate, this.calendar.endDate);
        this.getEventsListBytimeSlot();
      },
      //
      getAllCloseDate(data) {
        if (data.length == 0) {
          this.calendar.events = {};
          return false
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getAllCloseDate,
          params: {
            districts: data.join(',')
          }
        })*/
        let params = {districts: data.join(',')}
        this.$axios.calendar.getAllCloseDate(params).then((res) => {
          if (res.data.returnCode == 1) {
            this.calendar.events = {};
            let closeDay = res.data.returnObject;
            this.closeDataEvent = closeDay;
            let date = [];
            closeDay.forEach((keys, i) => {
              date.push(this.format(keys.closeDay));
            });
            let keys = {};
            date.forEach((key, value) => {
              let keyValue = {};
              keyValue[key] = '休';
              keys[key] = keyValue[key];
            });
            this.calendar.events = keys;
            console.log('21321321', this.calendar);
          } else if (res.data.returnCode == -1) {
            this.calendar.events = {}
          }
        }).catch((err) => {

        })
      },
      toHome() {
        this.$router.push({path: '/rule'});
      },
      // 默认今日
      toDay() {
        let d = new Date();
        this.calendar.value = [d.getFullYear(), this.zeroPad(d.getMonth() + 1), this.zeroPad(d.getDate())];
        let date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        this.calendar.startDate = this.$const.getTimestamp(date)
        this.calendar.endDate = this.$const.getTimestamp(date)
        this.getEventsListBytimeSlot();
        this.$MTAmethod.mtaShare('zx78Z5ksW4xTmArM', {'cd5aa4pky8wk32gd': 'true'})

        console.log('2131321311313213213' [d.getFullYear(), d.getMonth() + 1, d.getDate()]);
      },
      // 日期补零
      zeroPad(n) {
        return String(n < 10 ? '0' + n : n);
      }
    }
  }
</script>

<style lang="scss">
  .xiao-picker.popup {
    height: 100%;
    width: 100%;
    .box {
      font-size: 15px;
      vertical-align: middle;
      color: #000;
      margin: 0;
      height: auto;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 9901;
      overflow: hidden;
      .area_btn_box {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: stretch;
        -webkit-align-items: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        background-color: #FFFFFF;
        background-image: linear-gradient(to bottom, #e7e7e7, #e7e7e7, transparent, transparent);
        background-position: bottom;
        background-size: 100% 0.026667rem;
        background-repeat: no-repeat;
        position: relative;
        height: 44px;
        line-height: 44px;
        padding: 0 12px;
        &:before, &:after {
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
        &:before {
          left: 0;
          top: 0;
          -webkit-transform-origin: 50% 20%;
          transform-origin: 50% 20%
        }
        &:after {
          left: 0;
          bottom: 0;
          -webkit-transform-origin: 50% 70%;
          transform-origin: 50% 70%
        }
        .area_btn {
          font-size: 15px;
          text-align: center;
        }
        .larea_cancel {
          color: #828282;
        }
        .larea_finish {
          color: #ffb148;
        }
      }
    }
    .area_Box {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 8000;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .area_btn_content {
      position: relative;
      text-align: center;
      width: 100%;
      .vux-picker {
        width: 100%;
        .vux-flexbox.vux-flex-row {
          background-color: #d5d8df;
        }
      }
    }
  }
  .calendar-all {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #f0f1f5;
    -webkit-overflow-scrolling: touch;
    box-sizing: border-box;
    * {
      box-sizing: border-box;
    }
    .calendar-all-header {
      height: 44px;
      /*display: table;*/
      /*padding: 0 24px;*/
      position: relative;
      background-color: #ffb148;
      color: white;
      width: 100%;
      .header-date {
        font-size: 15px;
        color: white;
        font-weight: bold;
        & > span {
          padding-left: 12px;
        }
      }
      .header-schema-date {
        flex: 0 0 28%;
      }
      .header-search-date {
        button {
          padding: 0 5px;
          background-color: transparent;
          border-color: transparent;
          width: 40px;
          height: 40px;
          i{
            font-size: 18px;
            color: white;
          }
          &.add{
            margin-right: 12px;
          }
        }
      }
    }
    .dateAll {
      background-color: transparent;
      color: transparent;
      opacity: 0;
      width: 20px;
      border: 0.5px solid transparent;
      position: absolute;
      left: 24px;
      outline: none;
    }
    input::-webkit-search-decoration,
    input::-webkit-search-cancel-button {
      display: none;
    }
    .xiaoan-calendar {
      position: relative;
      &:after {
        content: " ";
        position: absolute;
        left: 0;
        bottom: 0;
        right: 0;
        border-bottom: 1px solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
      }
    }
    .calendar-all-body {
      width: 100%;
      position: relative;
      .calendar-scroller {
        overflow-y: scroll;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
      }
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
    .calendar-all-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50px;
      z-index: 5000;
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
