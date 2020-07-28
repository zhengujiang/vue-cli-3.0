<template>
  <div id="calendarIndex">
    <div class="addEvent">
      <el-button class="addButton" @click="link('/calendar/addEvent')">
        <i class="el-icon-plus"></i>
        添加事件
      </el-button>
      <div @click="linkSearch" style="display: inline-block">
        <el-input v-model="inputEvent" class="inputEvent" placeholder="请输入事件名称"></el-input>
        <!--  @focus="linkSearch" -->
      </div>
    </div>
    <div style="float: right">
      <el-select v-model="selectCalendar" placeholder="请选择" class="selectCal" @change="valueChange" @focus="valueChange"
                 @click="valueChange">
        <el-option
          v-for="item in cities"
          :key="item.value"
          :label="item.label"
          :value="item.value" @change="valueChange" @focus="valueChange" @click="valueChange">
          <span style="text-align: center">{{ item.label }}</span>
        </el-option>
      </el-select>
      <el-button @click.stop="setToday" class="returnToday">今天</el-button>
      <span style="font-size: 16px;color:#323232;">{{currentTime()}}</span>
    </div>
    <monthCalendar v-show="!weekShow" :watchCurrent="atCurrent" @preMonth="preMonth" @nextMonth="nextMonth"
                   @intoMonth="intoMonth"></monthCalendar>
    <v-calendar ref="calendarDom"
                :events="calendar1.events"
                :value="calendar1.value"
                :begin="calendar1.begin"
                :end="calendar1.end"
                :inYear="calendar1.selectYear"
                :inMonth="calendar1.selectMonth"
                :rest="resetTime"
                @select="select"
                @selectMonth="selectMonth"
                @selectYear="selectYear" v-if="!weekShow">
    </v-calendar>
    <weekCalendar v-else-if="weekShow" :watchCurrent="atCurrent" @weekPreM="weekPreM"
                  @weekNextM="weekNextM" :rest="resetTime"></weekCalendar>
    <eventList v-show="weekShow" :start="week_s" :end="week_e" :today="todayDate" :startFormat="startFormat"
               :endFormat="endFormat"></eventList>
    <!--  :startFormat="startFormat" :endFormat="startFormat" -->
  </div>
</template>

<script>
  import calendar from '@/components/calendar/calendar.vue'
  import weekCalendar from '@/components/calendar/week.vue'
  import monthCalendar from '@/components/calendar/month.vue'
  import eventList from '@/components/calendar/eventList.vue'

  export default {
    name: 'calendar',
    data () {
      return {
        inputEvent: '',
        currentTime: function () {
          var l = ['日', '一', '二', '三', '四', '五', '六']
          var d = new Date().getDay()
          var str = '星期' + l[d]
          return new Date().getFullYear() + '年' + (new Date().getMonth() + 1) + '月' + new Date().getDate() + '日' + str
        },
        weekShow: true,
        resetTime: [],
        cities: [{
          value: '0',
          label: '周历'
        }, {
          value: '1',
          label: '月历'
        }],
        currentMonths: [],
        selectCalendar: '0',
        week_s: '',
        week_e: '',
        startFormat: '',
        endFormat: '',
        todayDate: '',
        calendar1: {
          value: [2018, 2, 1], // 默认日期
          selectYear: new Date().getFullYear(),
          selectMonth: new Date().getMonth() + 1,
          weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // 周
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // 月
          events: {
            '2018-3-1': [
              {value: '日历自定义事件日历自定1', color: 'red'},
              {value: '日历自定义事件日历自定2', color: 'yellow'},
              {value: '日历自定义事件日历自定3', color: 'red'},
              {value: '日历自定义事件日历自定4', color: '#ffb148'}
            ],
            '2018-3-2': [
              {value: '日历自定义事件日历自定3-2-1', color: 'red'},
              {value: '日历自定义事件日历自定3-2-2', color: 'pink'}
            ],
            '2018-3-3': [
              {value: '日历自定义事件日历自定3-3-1', color: 'red'}
            ],
            '2018-3-20': [
              {value: '日历自定义事件日历自定3-20-1', color: 'red'},
              {value: '日历自定义事件日历自定3-20-2', color: 'blue'},
              {value: '日历自定义事件日历自定3-20-3', color: 'red'},
              {value: '日历自定义事件日历自定3-20-4', color: 'blue'}]
          }, // 显示的提示
          startTime: '',
          endTime: '',
          timestamp: Date.now() // 当前时间
        },
        atCurrent: false,
        calendarList: {}
      }
    },
    created () {
      this.selectCalendar = this.$store.state.calendarSort ? this.$store.state.calendarSort : ''
      if (this.selectCalendar !== '0' && this.selectCalendar !== '1' && this.selectCalendar !== '') {
        this.selectCalendar = '0'
      }
      if (this.selectCalendar == '') {
        this.selectCalendar = this.cities[0].label
      }
      this.$store.commit('inputEvent', '')
      this.calendar1.value = [new Date().getFullYear(), (new Date().getMonth() + 1), new Date().getDay()]
      this.calendarList = JSON.parse(window.localStorage.getItem('calendarList'))
      this.getWeekArea() // 获取本周起止时间
      this.getCloseDate() // 获取休市时间
      var current = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/01'
      this.startTime = new Date(current).getTime()
      this.endTime = this.getLastDayOfMonth(new Date().getFullYear(), new Date().getMonth() + 1)
    },
    mounted () {
      if (this.$store.state.watchEventDate !== '') {
        var str = this.$store.state.watchEventDate
        str = str.split('/')
        var current = str[0] + '/' + str[1] + '/01'
        this.calendar1.selectYear = str[0]
        this.calendar1.selectMonth = str[1]
        this.startTime = new Date(current).getTime()
        this.endTime = this.getLastDayOfMonth(str[0], str[1])
        this.getMonthEvents()
      } else {
        this.getMonthEvents()
      }
    },
    components: {
      'v-calendar': calendar,
      weekCalendar,
      monthCalendar,
      eventList
    },
    computed: {
      screen () {
        return this.$store.state.cScreen
      },
      currentMonths () {
        return this.$store.state.currentMonths
      }
    },
    watch: {
      screen: {
        handler: function (val) {
          this.calendarList = val
          this.getMonthEvents()
          this.getCloseDate()
        },
        deep: true
      },
      selectCalendar (val) {
        if (val == '0') {
          this.weekShow = true
          this.getWeekArea()
        } else if (val == '1') {
          this.weekShow = false
          // console.log('===============', this.currentMonths)
        }
      },
      currentMonths (val) {
        console.log('currentMonths', val)
        for (var i in val) {
          if (val[i].iscurrent == true) {
            this.calendar1.selectYear = val[i].year
            this.calendar1.selectMonth = val[i].value
            // console.log('this.months = ', this.calendar1.selectYear, this.calendar1.selectMonth)
          }
        }
        var current = this.calendar1.selectYear + '/' + this.calendar1.selectMonth + '/01'
        // this.startTime = Date.parse(new Date(current))
        this.startTime = new Date(current).getTime()
        this.endTime = this.getLastDayOfMonth(this.calendar1.selectYear, this.calendar1.selectMonth)
        this.getMonthEvents()
      }
    },
    methods: {
      linkSearch () {
        this.$router.push('/calendar/searchEvent')
      },
      getLastDayOfMonth (year, month) {
        // 获取本年本月的第一天日期
        var date = new Date(year, month - 1, '01')
        // 设置日期
        date.setDate(1)
        // 设置月份
        date.setMonth(date.getMonth() + 1)
        // 获取本月的最后一天
        var end = new Date(date.getTime() - 1000 * 60 * 60 * 24)
        // 打印某年某月的最后一天
        var months = Number(end.getMonth()) + 1
        if (months < 10) {
          months = '0' + months
        }
        var endDate = end.getFullYear() + '/' + months + '/' + end.getDate()
        // console.log(endDate, Date.parse(new Date(endDate)))
        // 返回结果
        return Date.parse(new Date(endDate))
      },
      // 获取月历事件
      getMonthEvents () {
        this.calendar1.events = {}
        var str = ''
        if (this.calendarList.length !== 0) {
          let arr = []
          for (let i in this.calendarList) {
            if (this.calendarList[i].isChecked) {
              arr.push(this.calendarList[i].id)
            }
          }
          str = arr.join(',')
        }
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getEventsListBytimeSlot,
          params: {
            userId: this.$cookie.get('userId'),
            startDate: this.startTime,
            endDate: this.endTime,
            calendarIds: str
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            let closeDay = res.data.returnObject
            let date = []
            if (closeDay) {
              closeDay.forEach((keys, i) => {
                date.push(this.format(keys.date))
              })
              let keys = {}
              date.forEach((key, value) => {
                let keyValue = {}
                keyValue[key] = closeDay[value].events
                keys[key] = keyValue[key]
              })
              this.calendar1.events = keys
            }
            // console.log('kkkkys', keys)
            // console.log('0-0-0-', this.calendar1.events)
          } else {

          }
        })
      },
      format: function (shijianchuo) {
        if (shijianchuo == null || shijianchuo == '') {
          let date = ''
          return date
        } else {
          // shijianchuo是整数，否则要parseInt转换
          let time = new Date(parseInt(shijianchuo))
          let y = time.getFullYear()
          let m = time.getMonth() + 1
          let d = time.getDate()
          return (y + '-' + m + '-' + d)
        }
      },
      // 获取休市时间
      getCloseDate () {
        var arr = []
        for (var i in this.calendarList) {
          if (this.calendarList[i].isSystem == true && this.calendarList[i].isCheck) {
            arr.push(this.calendarList[i].marketCalendarCode)
          }
        }
        var str = ''
        console.log('--------- arr ------', arr)
        if (arr.length !== 0) {
          str = arr.join(',')
        }
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getCloseDate,
          params: {
            districts: str
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.resetTime = res.data.returnObject
            for (let i in this.resetTime) {
              this.resetTime[i].closeDay = this.$common.transTime(this.resetTime[i].closeDay)[1]
            }
            // console.log('this.resetTime == ', this.resetTime)
          } else {
            this.resetTime = []
//            this.$message({
//              type: 'warning',
//              showClose: true,
//              message: '未成功获取休市时间！',
//              duration: 3000
//            })
          }
        }).catch((err) => {
          this.resetTime = []
//          this.$message({
//            type: 'warning',
//            showClose: true,
//            message: err.message,
//            duration: 3000
//          })
        })
      },
      // 获取本周起止时间
      getWeekArea () {
        var now = new Date() // 当前日期
        var nowDayOfWeek = now.getDay() // 今天本周的第几天
        var nowDay = now.getDate() // 当前日
        var nowMonth = now.getMonth() // 当前月
        var nowYear = now.getFullYear() // 当前年
        var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
        var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))

        function formatDate (date) {
          var myyear = date.getFullYear()
          var mymonth = date.getMonth() + 1
          var myweekday = date.getDate()

          if (mymonth < 10) {
            mymonth = '0' + mymonth
          }
          if (myweekday < 10) {
            myweekday = '0' + myweekday
          }
          return (myyear + '年' + mymonth + '月' + myweekday + '日')
        }

        this.startFormat = weekStartDate
        this.endFormat = weekEndDate
        this.week_s = formatDate(weekStartDate)
        this.week_e = formatDate(weekEndDate)
        // console.log('weekEndDate = ', weekStartDate, this.endFormat)
      },
      valueChange (val) {
        this.$store.commit('calendarM', val)
      },
      intoMonth (val) {
        // console.log('this.months == ', val)
        this.currentMonths = []
        this.currentMonths = val
      },
      preMonth (val) {
        // console.log('this.months = ', val)
        this.currentMonths = val
        this.atCurrent = false
      },
      nextMonth (val) {
        console.log('this.months = ', val)
        this.currentMonths = val
        this.atCurrent = false
      },
      link (url) {
        // console.log('calendarList = ', this.calendarList)
        if (this.calendarList.length <= 3 || this.calendarList.length == 0) {
          this.$message({type: 'error', showClose: true, duration: 3000, message: '请先行创建日历！'})
        } else {
          this.$router.push(url)
        }
      },
      setToday () {
        this.todayDate = 'today' + Math.random()
        // console.log('setToday =', this.todayDate, 'year = ' + new Date().getFullYear() + ', month = ' + (new Date().getMonth() + 1))
        this.atCurrent ? this.atCurrent = false : this.atCurrent = true
        this.$store.commit('watchCurrent', this.atCurrent)
        this.$store.commit('selectDate', '')
        console.log('--- selectCalendar ---', this.selectCalendar)
        if (this.selectCalendar == '1') {
          this.calendar1.selectYear = new Date().getFullYear()
          this.calendar1.selectMonth = new Date().getMonth() + 1
          var current = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/01'
          this.startTime = Date.parse(new Date(current))
          this.endTime = this.getLastDayOfMonth(new Date().getFullYear(), new Date().getMonth() + 1)
          this.getMonthEvents()
        } else {
          var now = new Date() // 当前日期
          var nowDayOfWeek = now.getDay() // 今天本周的第几天
          var nowDay = now.getDate() // 当前日
          var nowMonth = now.getMonth() // 当前月
          var nowYear = now.getFullYear() // 当前年
          var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek)
          var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek))
          // console.log(weekStartDate, weekEndDate, this.$common.transTime(weekStartDate)[0])
          // this.weekNextM(Date.parse(weekStartDate), Date.parse(weekEndDate))
          this.week_s = this.$common.transTime(Date.parse(weekStartDate))[0]
          this.week_e = this.$common.transTime(Date.parse(weekEndDate))[0]
          this.startFormat = new Date(weekStartDate)
          this.endFormat = new Date(weekEndDate)
          // console.log('12312312312312312', this.week_s, this.week_e)
          // this.$store.commit('currentEvent', '')
        }
      },
      weekPreM (week_s, week_e) {
        // console.log('123 ===', this.$common.transTime(week_s)[1], this.$common.transTime(week_e)[1])
        this.week_s = this.$common.transTime(week_s)[0]
        this.week_e = this.$common.transTime(week_e)[0]
        this.startFormat = new Date(week_s)
        this.endFormat = new Date(week_e)
        this.atCurrent = false
      },
      weekNextM (week_s, week_e) {
        this.week_s = this.$common.transTime(week_s)[0]
        this.week_e = this.$common.transTime(week_e)[0]
        this.startFormat = new Date(week_s)
        this.endFormat = new Date(week_e)
        // console.log('456 ===', new Date(), new Date(week_s), this.$common.transTime(week_e)[0])
        this.atCurrent = false
      },
      select (value) {
        console.log('选中某天', value[0] + '/' + value[1] + '/' + value[2] + '', value)
        var timeampe = new Date(value[0] + '/' + value[1] + '/' + value[2]).getTime()
        this.$router.push({
          path: 'addEvent',
          query: {
            i: timeampe
          }
        })
        // this.calendar1.value = [value[0], value[1], value[2]]
      },
      selectMonth (month, year) {
        console.log('年', year, '月', month)
      },
      selectYear (year) {
        console.log('年', year)
      },
      /**/
      changeEvents () {
        this.calendar1.events = {
          // '2017-7-20': '$' + (Math.random() * 1000 >> 0),
          // '2017-7-21': '$' + (Math.random() * 1000 >> 0),
          // '2017-7-22': '$' + (Math.random() * 1000 >> 0),
        }
        console.log('1', this.calendar1.events)
      }
    },
    destroyed () {
      // alert('1')
      this.$store.commit('currentEvent', '')
      this.$store.commit('selectDate', '')
    }
  }
</script>

<style lang="scss">
  #calendarIndex {
    width: 100%;
    height: auto;
    .addEvent {
      display: inline-block;
      .addButton {
        width: 105px;
        height: 30px;
        border-radius: 4px;
        background: #ffb148;
        line-height: 30px;
        padding: 0;
        border: none;
        font-size: 16px;
        color: #fff;
        span {
          font-weight: normal;
        }
      }
      .inputEvent {
        width: 320px;
        height: 30px;
        input {
          width: 100%;
          height: 100%;
          line-height: 30px;
          padding: 0 10px;
          box-sizing: border-box;
        }
      }
    }
    .returnToday {
      width: 48px;
      height: 30px;
      background: #f0f1f5;
      border-radius: 4px;
      line-height: 30px;
      padding: 0;
      // border: none;
      color: #323232;
      margin-right: 5px;
      font-size: 16px;
      border: 1px solid #dcdfe6;
      box-sizing: border-box;
      &:active {
        border: 1px solid #ffb148;
      }
    }
    .tabs {
      display: inline-block;
      width: auto;
      .el-tabs__header {
        margin: 0;
      }
    }
    .selectCal {
      width: 80px;
      height: 30px;
      margin-right: 5px;
      .el-input {
        height: 30px;
        width: 100%;
        padding: 0;
        line-height: 30px;
        background-color: #f0f1f5;
        color: #323232;
        font-size: 16px;border-radius: 4px;
        .el-input__inner {
          padding: 0 10px;
          background-color: #f0f1f5;
          height: 100%;
          line-height: 30px;
          color: #323232;
          font-size: 16px;
        }
      }
    }
  }
</style>
