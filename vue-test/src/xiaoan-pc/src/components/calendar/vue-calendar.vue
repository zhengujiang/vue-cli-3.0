<template>
  <section class="wh_container">
    <div class="wh_content_all">
      <div class="wh_top_changge">
        <li class="wh_content_li">{{dateTop}}</li>
        <li @click="PreMonth()">
          <div class="wh_jiantou1"></div>
        </li>
        <li @click="NextMonth()">
          <div class="wh_jiantou2"></div>
        </li>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="tag in textTop">
          <div>
            {{tag}}
          </div>
        </div>
      </div>
      <div class="wh_content">
        <div class="wh_content_item" v-for="(item,index) in list" @click="clickDay(item,index)">
          <div>
            <li class="wh_nextDayShow" v-if="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide">
              {{item.id}}
              <i class="redCircle" v-show="item.isMark"></i>
            </li>
            <li v-else="(isHideOtherday&&item.nextDayShow)||item.otherMonth||item.dayHide"
                v-bind:class="{ wh_isToday: item.isToday}"> <!-- ,wh_isMark:item.isMark -->
              {{item.id}}
              <i class="redCircle" v-show="item.isMark"></i>  <!--v-show="item.mark"-->
            </li>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
  export default {
    data () {
      return {
        textTop: ['日', '一', '二', '三', '四', '五', '六'],
        myData: [],
        list: [],
        calendarList: [],
        tableData: [],
        start: '',
        end: '',
        dateTop: ''
      }
    },
    props: {
      markArray: {default: '[]'},
      agoDayHide: {default: '0'},
      futureDayHide: {default: '15181550670000'},
      isHideOtherday: {default: false}
    },
    created () {
      this.myData = new Date()
      // console.log('this.myData = ', this.myData)
      this.calendarList = JSON.parse(window.localStorage.getItem('calendarList'))
      var start = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/01'
      // console.log('jintian = ', Date.parse(new Date(start)), this.getLastDayOfMonth(new Date().getFullYear(), (new Date().getMonth() + 1)))
      this.start = Date.parse(new Date(start))
      this.end = this.getLastDayOfMonth(new Date().getFullYear(), (new Date().getMonth() + 1))
      this.getEventsListBytimeSlot()
    },
    mounted () {
      this.getList(this.myData)
    },
    computed: {
      currentEvent () {
        return this.$store.state.currentEvent
      },
      watchCurrent () {
        return this.$store.state.watchCurrent
      },
      selectDate () {
        return this.$store.state.selectDate
      }
    },
    watch: {
      currentEvent (val) {
        // console.log('currentEvent = ', val, new Date(val))
        if (val == '') {
          this.getList(new Date())
        }
      },
      list: {
//        console.log('------ list ------', val)
//        this.constrast()
        handler: function (val) {

//          this.calendarList = val
//          if (this.singleDay == false) {
//            this.getEventsListBytimeSlot()
//          } else {
//            this.getEventsListBytimeSlot(this.currentEvent)
//          }
          for (var i in val) {
            for (var j in this.tableData) {
              if (new Date(val[i].date).getTime() == this.tableData[j].date) {
                val[i].isMark = true
              }
            }
          }
          // console.log('-=-=-=-=-=-=-=-=-, list = ', val)
          // this.list = Object.assign([], val)
        },
        deep: true
      },
      watchCurrent (val) {
      },
      selectDate (val) {
        if (val == '') {
          this.getList(new Date())
        } else {
          for (let i in this.list) {
            if (new Date(this.list[i].date).getTime() == val) {
              this.list[i].isToday = true
            } else {
//            this.list[i].isToday = false
//            console.log(new Date(this.list[i].date).getMonth(), new Date(val).getMonth())
              if (new Date(this.list[14].date).getMonth() == new Date(val).getMonth()) {
                this.list[i].isToday = false
              } else {
                this.myData = new Date(val)
                this.getList(new Date(val))
                let dateTime = new Date(val)
                this.start = new Date(dateTime.getFullYear() + '/' + (dateTime.getMonth() + 1) + '/01').getTime()
                this.end = this.getLastDayOfMonth(dateTime.getFullYear(), dateTime.getMonth() + 1)
                // console.log('3 - ', this.start, this.end)
                this.getEventsListBytimeSlot()
              }
            }
          }
        }
//        else {
//          this.getList(new Date(val))
//        }
        console.log('this.list ==', this.list)

        // getList
      },
      markArray (val, oldVal) {
//        var list = this.list
//        for (var i = 0; i < list.length; i++) {
//          list[i].isMark = false
//          if (list[i].date) {
//            for (var n = 0; n < val.length; n++) {
//              if (list[i].id == val[n]) {
//                list[i].isMark = true
//              }
//            }
//          }
//        }
//        this.list = list
        // console.log('---- markArray ----', this.markArray)
      },
      tableData (val) {
        this.constrastEvent()
      }
    },
    methods: {
      // 日历日期下事件
      constrastEvent () {
        for (let i in this.list) {
          for (let j in this.tableData) {
            if (Date.parse(new Date(this.list[i].date)) == this.tableData[j].date) {
              // console.log(i)
              this.list[i].isMark = true
            }
          }
        }
      },
      // 获取时间段事件
      getEventsListBytimeSlot (time) {
        var str = ''
        if (this.calendarList.length !== 0) {
          let arr = []
          for (let i in this.calendarList) {
            console.log(this.calendarList[i].isChecked)
            if (this.calendarList[i].isChecked == true) {
              arr.push(this.calendarList[i].id)
            }
          }
          str = arr.join(',')
        }
        this.tableData = []
        var start, end
        if (time) {
          start = time - 28800000
          end = time + 43200000
        } else {
          // console.log('0000000000 start', this.startFormat)
          start = this.start
          end = this.end
        }
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getEventsListBytimeSlot,
          params: {
            userId: this.$cookie.get('userId'),
            startDate: start,
            endDate: end,
            calendarIds: str
          }
        }).then((res) => {
          // this.noInfo = true
          if (res.data.returnCode == 1) {
            var eventList = res.data.returnObject
            for (let i in eventList) {
              eventList[i].id = i
              eventList[i].date = eventList[i].date
              // eventList[i].date = this.$common.transTime(eventList[i].date)[0]
              for (let j in eventList[i].events) {
                var obj = eventList[i].events[j]
                if (obj.eventType == 0) {
                  obj.eventRemark = obj.eventName
                } else {
                  if (obj.eventRemark == null || obj.eventRemark == '') {
                    obj.eventRemark = obj.eventName
                    obj.eventName = ''
                  }
                }
              }
            }
            this.tableData = eventList

            console.log('左侧日历事件数据 tableData = ', this.tableData, this.list)
          } else {
            this.noInfo = true
//            this.$message({
//              showClose: true,
//              message: '事件获取失败！',
//              duration: 3000,
//              type: 'error'
//            })
          }
        })
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
        var endDate = end.getFullYear() + '-' + months + '-' + end.getDate()
        console.log(endDate, Date.parse(new Date(endDate)))
        // 返回结果
        return Date.parse(new Date(endDate))
      },
      // 今天
      constrast () {
        var current = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate()
//        for (let i in this.list) {
//          if (this.list[i].date == current) {
//            this.list[i].isMark = false
//          }
//        }
      },
      clickDay: function (item, index) {
        // console.log('=====', this.list)
        if (!(this.isHideOtherday && item.nextDayShow) && !item.dayHide) {
          this.$emit('choseDay', item.date)
        }
        if (item.otherMonth) {
          item.otherMonth < 0 ? this.PreMonth(item.date) : this.NextMonth(item.date)
        } else {
          if (!(this.isHideOtherday && item.nextDayShow) && !item.dayHide) {
            for (var i = 0; i < this.list.length; i++) {
              if (i == index) {
                this.list[i].isToday = true
              } else {
                this.list[i].isToday = false
              }
            }
          }
        }
        this.constrast()
      },
      ChoseMonth: function (date, isChosedDay = true) {
        date = this.dateFormat(date)
        this.myData = new Date(date)
        this.$emit('changeMonth', this.dateFormat(this.myData))
        this.getList(this.myData, date, isChosedDay)
      },
      PreMonth: function (date, isChosedDay = true) {
        date = this.dateFormat(date)
        this.myData = this.getPreMonth(this.myData)
        this.$emit('changeMonth', this.dateFormat(this.myData))
        this.getList(this.myData, date, isChosedDay)
        this.start = new Date(this.myData.getFullYear() + '/' + (this.myData.getMonth() + 1) + '/01').getTime()
        this.end = this.getLastDayOfMonth(this.myData.getFullYear(), this.myData.getMonth() + 1)
        // console.log('3 - ', this.start, this.end)
        this.getEventsListBytimeSlot()
      },
      NextMonth: function (date, isChosedDay = true) {
        date = this.dateFormat(date)
        console.log('1 - ', this.myData)
        this.myData = this.getNextMonth(this.myData)
        // console.log('2 - ', this.myData)
        this.$emit('changeMonth', this.dateFormat(this.myData))
        this.getList(this.myData, date, isChosedDay)
        this.start = new Date(this.myData.getFullYear() + '/' + (this.myData.getMonth() + 1) + '/01').getTime()
        this.end = this.getLastDayOfMonth(this.myData.getFullYear(), this.myData.getMonth() + 1)
        // console.log('3 - ', this.start, this.end)
        this.getEventsListBytimeSlot()
      },
      getPreMonth: function (date) {
        var timeArray = this.dateFormat(date).split('/')
        var year = timeArray[0]
        var month = timeArray[1]
        var day = timeArray[2]
        var days = new Date(year, month, 0)
        days = days.getDate()
        var year2 = year
        var month2 = parseInt(month) - 1
        if (month2 == 0) {
          year2 = parseInt(year2) - 1
          month2 = 12
        }
        var day2 = day
        var days2 = new Date(year2, month2, 0)
        days2 = days2.getDate()
        if (day2 > days2) {
          day2 = days2
        }
        if (month2 < 10) {
          month2 = '0' + month2
        }
        var t2 = year2 + '/' + month2 + '/' + day2
        return new Date(t2)
      },
      getNextMonth: function (date) {
        var arr = this.dateFormat(date).split('/')
        var year = arr[0] // 获取当前日期的年份
        var month = arr[1] // 获取当前日期的月份
        var day = arr[2] // 获取当前日期的日
        var days = new Date(year, month, 0)
        days = days.getDate() // 获取当前日期中的月的天数
        var year2 = year
        var month2 = parseInt(month) + 1
        if (month2 == 13) {
          year2 = parseInt(year2) + 1
          month2 = 1
        }
        var day2 = day
        var days2 = new Date(year2, month2, 0)
        days2 = days2.getDate()
        if (day2 > days2) {
          day2 = days2
        }
        if (month2 < 10) {
          month2 = '0' + month2
        }

        var t2 = year2 + '/' + month2 + '/' + day2
        return new Date(t2)
      },
      getDaysInOneMonth: function (date) { // 天数
        var getyear = date.getFullYear()
        var getmonth = date.getMonth() + 1
        getmonth = parseInt(getmonth, 10)
        var d = new Date(getyear, getmonth, 0)
        return d.getDate()
      },
      getMonthweek: function (date) {
        var getyear = date.getFullYear()
        var getmonth = date.getMonth() + 1
        var dateOne = new Date(getyear + '/' + getmonth + '/1')
        console.log('getMonthweek = ', getmonth, dateOne.getDay())
        return dateOne.getDay() == 0 ? 7 : dateOne.getDay()
      },
      getList: function (date, chooseDay, isChosedDay = true) {
        console.log('>>> tablist', date)
        var mygetMonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
        this.dateTop = date.getFullYear() + '年' + mygetMonth + '月'
        var array = []
        for (var i = 0; i < this.getDaysInOneMonth(date); i++) {
          var nowTime = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1)
          if (
            this.dateFormat(new Date()) ==
            this.dateFormat(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1))) && !chooseDay
          ) {
            array = array.concat({
              id: i + 1,
              date: nowTime,
              isToday: true,
              isMark: '', // this.markArray.indexOf(i + 1) >= 0,
              dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
              nextDayShow:
              new Date(nowTime).getTime() >
              new Date().getTime()
            })
            this.$emit(
              'isToday',
              this.dateFormat(new Date(date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + (i + 1)))
            )
          } else {
            array = array.concat({
              id: i + 1,
              date: nowTime,
              isToday: chooseDay == nowTime && isChosedDay,
              isMark: '', // this.markArray.indexOf(i + 1) >= 0,
              dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
              nextDayShow:
              new Date(nowTime).getTime() >
              new Date().getTime()
            })
          }
        }

        var array2 = []
        var num = this.getDaysInOneMonth(this.getPreMonth(date)) - this.getMonthweek(date) + 1
        var preDate = this.getPreMonth(date)
        var nextDate = this.getNextMonth(date)
        // console.log('----console', num, this.getDaysInOneMonth(this.getPreMonth(date)), this.getMonthweek(date))
        // 上个月多少开始
        for (let i = 0; i < this.getMonthweek(date); i++) {
          nowTime = preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/' + (num + i)
          array2 = array2.concat({
            id: num + i,
            date: nowTime,
            dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
            nextDayShow:
            new Date(nowTime).getTime() >
            new Date().getTime(),
            otherMonth: -1
          })
        }
        // console.log('array2 = ', array2)
        array = array2.concat(array)
        // console.log('array = ', array)
        var _length = 7 - array.length % 7
        if (_length < 7) {
          nowTime = nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1)
          for (let i = 0; i < _length; i++) {
            array.push({
              id: i + 1,
              date: nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/' + (i + 1),
              dayHide: new Date(nowTime).getTime() < parseInt(this.agoDayHide) || new Date(nowTime).getTime() > parseInt(this.futureDayHide),
              nextDayShow:
              new Date(nowTime).getTime() >
              new Date().getTime(),
              otherMonth: 1
            })
          }
        }
        this.list = array
//        for (let i in this.list) {
//          for (let j in this.tableData) {
//            if (new Date(this.list[i].date).getTime() == this.tableData[j].date) {
//              this.list[i].isMark = true
//            } else {
//              this.list[i].isMark = false
//            }
//          }
//        }
        // console.log('-----  list a ======', this.list)
      },
      dateFormat: function (date) {
        date = new Date(date)
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate()
      }
    }
  }
</script>
<style>
  .wh_container {
    width: 100%;
    padding: 20px 15px 17px 15px;
    box-sizing: border-box;
    margin: auto;
  }

  li {
    list-style-type: none;
  }

  .wh_content_all {
    width: 100%;
    overflow: hidden;
  }

  .wh_content {
    display: flex;
    flex-wrap: wrap;
    /*padding: 0 3% 0 3%;*/
    width: 100%;
  }

  .wh_content:first-child .wh_content_item {
    color: #ddd;
    font-size: 14px;
    height: 15%;
    line-height: 15%;
  }

  .wh_content_item {
    font-size: 13px;
    width: 29.5px;
    height: 29.5px;
    line-height: 29.5px;
    text-align: center;
    color: #323232;margin: 0px 0;
    position: relative;
  }

  .wh_content_item div {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .wh_content_item li {
    width: 100%;
    height: 100%;
    border-radius: 100px;
    position: relative;
  }
  li .redCircle{
    position: absolute;bottom:2px;right:0px;left:0;margin: auto;width: 4px;height: 4px;border-radius: 50%;background-color: #e3e3e3;
  }

  @media screen and (min-width: 460px) {
    .wh_content_item li:hover {
      background: #849fee;
      color: #fff;
      cursor: pointer
    }
  }

  .wh_top_changge {
    display: flex;
  }

  .wh_top_changge li {
    cursor: pointer;
    display: flex;
    color: #323232;
    font-size: 16px;
    flex: 1;
    justify-content: left;
    align-items: center;
    margin-bottom: 10px;
    margin-left: 8px;
  }

  .wh_top_changge .wh_content_li {
    cursor: auto;
    flex: 7.5;
  }

  .wh_jiantou1 {
    width: 8px;
    height: 8px;
    border-top: 1px solid #323232;
    border-left: 1px solid #323232;
    transform: rotate(-45deg);
  }

  .wh_jiantou1:active,
  .wh_jiantou2:active {
    border-color: #ddd;
  }

  .wh_content_item div .wh_isToday {
    margin: auto;
    background-color: #849fee!important;
    color: #fff;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    text-align: center;
  }

  .wh_jiantou2 {
    width: 8px;
    height: 8px;
    border-top: 1px solid #323232;
    border-right: 1px solid #323232;
    transform: rotate(45deg);
  }

  .wh_content_item div .wh_isMark {
    margin: auto;
    border-radius: 100px;
    z-index: 2;background-color: #c0cae5;color:#fff;
  }

  .wh_content_item div .wh_nextDayShow {
    color: #bfbfbf;
  }
</style>
