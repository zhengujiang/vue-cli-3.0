<template>
  <div id="eventList">
    <div class="dateRange" v-show="eventSort == ''" v-if="!singleDay">
      <span> <!--  @click="watchCurrentWeek" -->
        <i class="el-icon-date"></i>
        本周：
      </span>
      <span>{{start}} — {{end}}</span>
    </div>
    <div class="dateRange" v-show="eventSort == ''" v-else-if="singleDay">
      <span>
        <i class="el-icon-date"></i>
        {{singleWeek}}：
      </span>
      <span>{{singleDate}}</span>
    </div>
    <el-row class="title">
      <el-col :span="3">日期</el-col>
      <el-col :span="15" style="text-align: left;padding-left: 80px;">事件</el-col>
      <el-col :span="4">日历</el-col>
      <el-col :span="2">提醒</el-col>
    </el-row>
    <el-row class="father_row" v-for="(list,index) in tableData" :key="index">
      <el-col :span="4" style="padding-left: 10px;">
        <span v-if="list.date == undefined" style="width: 20px;height:10px;display: inline-block"></span>
        <span v-else-if="list.date !== undefined">{{list.date}}</span>
      </el-col>
      <el-col :span="14" v-html="replaceBr(list.eventRemark)"></el-col><!--eventName-->
      <el-col :span="4" class="sortStyle">{{list.calendarName}}</el-col>
      <el-col :span="2" class="noticStyle"></el-col>

      <el-row class="son_row" v-for="(lista,indexa) in list.events" :key="indexa">
        <!--   v-else-if="list.arr.length !== 0" -->
        <el-col :span="4" v-if="indexa !== 0" style="min-height: 10px"></el-col>
        <el-col :span="4" v-else></el-col>
        <el-col :span="14" class="eventStyle" @click.native="eventContent(lista)"
                v-html="replaceBr(lista.eventRemark)"></el-col>
        <el-col :span="4" class="sortStyle">{{lista.calendarName}}</el-col>
        <el-col :span="2" class="noticStyle" @click.native="remind(indexa,index)"
                v-show="lista.eventConfirmFrequency !== '' && lista.eventConfirmFrequency !== null && !lista.isSystem">
          <i class="iconfont web-tixing" :class="{isRemind: lista.eventConfirmFrequency == '1'}"></i>
        </el-col>
      </el-row>
    </el-row>
    <!--<transition name="fade" transiton="fade">-->
    <div v-show="noInfo" style="padding: 150px 0 50px 0;opacity: 0.7" calss="queshen">
      <img :src="$image.user.calendar.noEvent" alt="" style="width: 120px;display:block;margin:0 auto;">
      <p style="text-align: center;font-size: 14px;color:#ffb148;padding: 10px 0;">当前暂无事件</p>
    </div>
    <!--</transition>-->
  </div>
</template>
<script>
  export default {
    name: 'eventList',
    data() {
      return {
        calendarList: [],
        ids: '',
        kaishi: '',
        jieshu: '',
        noInfo: false,
        singleDay: false,
        singleDate: '',
        singleWeek: '',
        tableData: [
          {
            id: '1',
            date: '2018年03月12日',
            events: [
              {id: '11', calendarName: '工作日历', eventName: '召开临时股东大会', eventConfirmFrequency: '1'},
              {id: '12', calendarName: '工作日历', eventName: '召开临时股东大会', eventConfirmFrequency: '1'}
            ]
          }
        ]
      }
    },
    props: {
      tabList: {
        type: Array,
        default() {
          return [
            {
              id: '1',
              date: '2018年03月12日',
              arr: [
                {id: '11', calendarName: '工作日历', eventName: '召开临时股东大会', eventConfirmFrequency: '1'},
                {id: '12', calendarName: '工作日历', eventName: '召开临时股东大会', eventConfirmFrequency: '1'}
              ]
            }
          ]
        }

      },
      eventSort: {
        type: String,
        default: ''
      },
      text: {
        type: String,
        default: ''
      },
      start: {
        type: String,
        default: ''
      },
      end: {
        type: String,
        default: ''
      },
      startFormat: {
        type: Date,
        default() {
          return new Date()
        }
      },
      endFormat: {
        type: Date,
        default() {
          return new Date()
        }
      }
    },
    created() {
      this.calendarList = JSON.parse(window.localStorage.getItem('calendarList'))
      // console.log('---- this.$common.transTime(eventList[i].date)[0]', this.$common.transTime(0)[0])
    },
    mounted() {
      console.log('-- this.calendarList --==================', this.calendarList)
      if (this.eventSort == '') {
        if (this.currentEvent !== '') {
          this.singleDay = true
          this.getEventsListBytimeSlot(this.currentEvent)
        } else {
          console.log('-------- screen????? -------')
          this.getEventsListBytimeSlot()
        }
      } else {
        if (this.$route.path == '/calendar/searchEvent') {
          if (this.$store.state.inputEvent !== '') {
            this.searchEventList()
          }
        }
      }
    },
    computed: {
      currentMonths() {
        return this.$store.state.currentMonths
      },
      screen() {
        return this.$store.state.cScreen
      },
      currentEvent() {
        return this.$store.state.currentEvent
      },
      selectDate() {
        return this.$store.state.selectDate
      },
      watchCurrent() {
        if (this.$route.path !== '/calendar/searchEvent') {
          console.log('----?????? ----', this.currentEvent)
          if (new Date(this.startFormat).getTime() <= this.currentEvent && (this.currentEvent - 28800000) <= new Date(this.endFormat).getTime()) {
            console.log('---- a ----', this.currentEvent)
            this.getEventsListBytimeSlot(this.currentEvent)
          } else {
            if (this.selectDate !== '') { // (this.currentEvent - 28800000)
              console.log('---- b ----', this.selectDate, '周历？=', this.singleDay)
              // this.getEventsListBytimeSlot(this.selectDate)
              if (this.singleDay) {
                this.getEventsListBytimeSlot(this.currentEvent)
              } else {
                this.getEventsListBytimeSlot()
              }
            } else {
              console.log('---- c ----')
              this.getEventsListBytimeSlot()
            }
          }
        }
        return this.$store.state.watchCurrent
      }
    },
    watch: {
      '$route': 'getPath',
      start() {
        console.log('------ start ------')
        this.getEventsListBytimeSlot()
      },
      tabList(val) {
        this.tableData = val
        if (this.tableData.length == 0 || this.tableData == null) {
          this.noInfo = true
        } else {
          this.noInfo = false
        }
      },
      singleDay(val) {
        // console.log('----- singleDay ?????------', val)
        var weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        if (val) {
          // this.singleDay = true
          this.singleDate = this.$common.transTime(this.currentEvent)[0]
          this.singleWeek = weekList[new Date(this.currentEvent).getDay()]
          console.log('------ singleDay3 ------')
          this.getEventsListBytimeSlot(this.currentEvent)
        } else {
          if (this.selectDate == this.currentEvent) {
            this.singleDate = this.$common.transTime(this.currentEvent)[0]
            this.singleWeek = weekList[new Date(this.currentEvent).getDay()]
            console.log('------ singleDay2 ------', this.start, this.end)
            // this.getEventsListBytimeSlot(this.currentEvent)
            if (this.start <= this.currentEvent <= this.end) {
              this.getEventsListBytimeSlot(this.currentEvent)
            } else {
              this.getEventsListBytimeSlot()
            }
          } else {
            console.log('------ singleDay ------')
            this.getEventsListBytimeSlot()
          }
        }
      },
      calendarList(val) {

      },
      screen: {
        handler: function (val) {
          // console.log('-=-=-=-=-=-=-=-=-', val)
          this.calendarList = val
          if (this.$route.path == '/calendar/searchEvent') {
            if (this.$store.state.inputEvent !== '') {
              console.log('--------- s1 --------')
              this.$nextTick(() => {
                this.searchEventLists()
              })
            }
          } else {
            if (this.singleDay == false) {
              console.log('-------- screen+++ -------')
              this.getEventsListBytimeSlot()
            } else {
              // console.log('start = end =', new Date(this.startFormat).getTime() <= this.currentEvent && this.currentEvent <= new Date(this.endFormat).getTime())
              // this.getEventsListBytimeSlot(this.currentEvent)
              console.log('???????????', (this.currentEvent - 28800000) <= new Date(this.endFormat).getTime())
              if (new Date(this.startFormat).getTime() <= this.currentEvent && (this.currentEvent - 28800000) <= new Date(this.endFormat).getTime()) {
                this.getEventsListBytimeSlot(this.currentEvent)
              } else {
                console.log('------ screen 22 ------')
                this.getEventsListBytimeSlot()
              }
            }
          }
        },
        deep: true
      },
      watchCurrent(val) {
        this.singleDay = false
        console.log('watch: watchCurrent = ', val)
      },
      currentEvent(val) {
        console.log('EVENTlist -- currentEvent = ', val, new Date(val))
        var weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        if (val == '') {

        } else {
          this.singleDay = true
          this.singleDate = this.$common.transTime(val)[0]
          this.singleWeek = weekList[new Date(val).getDay()]
          console.log('------ currentEvent ------')
          this.getEventsListBytimeSlot(val)
        }
      },
      startFormat(val) {
        this.singleDay = false
        console.log('------ startFormat ------', new Date(val).getTime(), '-------', this.selectDate, this.currentEvent)
        this.getEventsListBytimeSlot()
        if (this.start <= this.currentEvent <= this.end) {
          this.getEventsListBytimeSlot(this.currentEvent)
        } else {
          this.getEventsListBytimeSlot()
        }
      }
    },
    methods: {
      replaceBr(value) {
        if (value) {
          return value.toString().replace(/\\n/g, '<br/>')
        } else {
          return value
        }
      },
      getPath() {
        if (this.$route.path == '/calendar/searchEvent') {
          this.calendarList = JSON.parse(window.localStorage.getItem('calendarList'))
        }
      },
      watchCurrentWeek() {
        console.log('-------- screen5 -------')
        this.getEventsListBytimeSlot()
      },
      // 搜索事件结果
      searchEventList() {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.searchEventList,
          params: {
            userId: this.$cookie.get('userId'),
            calendarIDs: this.getIds(),
            eventName: this.$store.state.inputEvent/* ,
            pageNum: 1,
            pageSize: 20 */
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            var eventList = res.data.returnObject
            for (let i in eventList) {
              // eventList[i].id = i
              eventList[i].date = this.$common.transTime(eventList[i].date)[0]
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
              eventList.forEach((item, index) => {
                if (item.eventType == 0) {
                  item.eventRemark = item.eventName
                } else {
                  if (item.eventRemark == null || item.eventRemark == '') {
                    item.eventRemark = item.eventName
                    item.eventName = ''
                  }
                }
              })
            }
            this.tableData = eventList
            console.log('searchEventList 事件获取 -> this.tableData = ', this.tableData)
          } else {

          }
        })
      },
      getIds() {
        var str = ''
        if (this.calendarList.length !== 0) {
          let arr = []
          for (let i in this.calendarList) {
            if (this.calendarList[i].isCheck == true) {
              arr.push(this.calendarList[i].id)
            }
          }
          str = arr.join(',')
        }
        return str
      },
      // 根据时间段获取事件列表
      getEventsListBytimeSlot(time) {
        // console.log('90909090909090')
        var str = ''
        if (this.calendarList.length !== 0) {
          let arr = []
          for (let i in this.calendarList) {
            // console.log(this.calendarList[i].isChecked)
            if (this.calendarList[i].isCheck == true) {
              arr.push(this.calendarList[i].id)
            }
          }
          str = arr.join(',')
        }
        this.tableData = []
        var start = ''
        var end = ''
        if (time) {
//          start = time - 28800000
//          end = time + 43200000
          start = this.$common.getTimestampms(this.$common.transTime(time)[1] + ' 00:00:00')
          end = this.$common.getTimestampms(this.$common.transTime(time)[1] + ' 23:59:59')
//          console.log('time', this.$common.transTime(time)[2])
//          console.log('start', this.$common.transTime(start)[2])
//          console.log('end', this.$common.transTime(end)[2])
        } else {
          start = this.startFormat.getTime()
          end = this.endFormat.getTime()
          if (this.$route.path == '/calendar/searchEvent') {
            var starts = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/01'
            start = Date.parse(new Date(starts))
            end = this.$common.getLastDayOfMonth(new Date().getFullYear(), (new Date().getMonth() + 1))
          }
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
              // eventList[i].id = i

              eventList[i].date = this.$common.transTime(eventList[i].date)[0]

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
              eventList.forEach((item, index) => {
                if (item.eventType == 0) {
                  item.eventRemark = item.eventName
                } else {
                  if (item.eventRemark == null || item.eventRemark == '') {
                    item.eventRemark = item.eventName
                    item.eventName = ''
                  }
                }
              })
            }
            this.tableData = eventList
            console.log('getEventsListBytimeSlot 事件获取 -> this.tableData = ', this.tableData)
            if (eventList == null || eventList.length == 0) {
              this.noInfo = true
            } else {
              this.noInfo = false
            }
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
      remindDaily(son, father) {
        console.log('remindDaily 提醒 =', this.tableData[father].events[son].eventConfirmFrequency)
        var str = this.tableData[father].events[son].eventConfirmFrequency
        var message = ''
        if (str == '0') {
          message = '提醒已开启！'
        } else {
          message = '提醒已关闭！'
        }
        this.$http({
          method: 'POST',
          url: this.$api.calendar.changeConfirmType,
          params: {
            eventId: this.tableData[father].events[son].id,
            eventType: this.tableData[father].events[son].eventType,
            eventName: this.tableData[father].events[son].eventName == '' ? this.tableData[father].events[son].eventRemark : this.tableData[father].events[son].eventName,
            eventConfirmFrequency: this.tableData[father].events[son].eventConfirmFrequency
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({
              message: message,
              showClose: true,
              type: 'success',
              duration: 3000
            })
            if (this.currentEvent !== '' && this.singleDay) {
              // console.log('this.currentEvent = ', this.currentEvent)
              if (this.$store.state.inputEvent !== '') {
                this.searchEventLists()
              } else {
                this.getEventsListBytimeSlot(this.currentEvent)
              }
            } else {
              if (this.$store.state.inputEvent !== '') {
                this.searchEventLists()
              } else {
                this.getEventsListBytimeSlot()
              }
            }
          } else {
            this.$message({
              message: '修改失败！',
              showClose: true,
              type: 'error',
              duration: 3000
            })
          }
        })
      },
      // 设置提醒
      remind(son, father) {
//        if (this.$store.state.inputEvent !== '') {
//          this.searchEventLists()
//        } else {
//          this.remindDaily(son, father)
//        }
        this.remindDaily(son, father)
      },
      // 搜索事件结果
      searchEventLists() {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.searchEventList,
          params: {
            userId: this.$cookie.get('userId'),
            calendarIDs: this.getIds(),
            eventName: this.$store.state.inputEvent/* ,
            pageNum: 1,
            pageSize: 20 */
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            var eventList = res.data.returnObject
            for (let i in eventList) {
              // eventList[i].id = i

              eventList[i].date = this.$common.transTime(eventList[i].date)[0]

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
              eventList.forEach((item, index) => {
                if (item.eventType == 0) {
                  item.eventRemark = item.eventName
                } else {
                  if (item.eventRemark == null || item.eventRemark == '') {
                    item.eventRemark = item.eventName
                    item.eventName = ''
                  }
                }
              })
            }
            this.tableData = eventList
            this.tableData = Object.assign([], this.tableData)
            console.log('searchEventLists 468 tableData = ', this.tableData)
          } else {

          }
        })
      },
      linkContent(id, arr) {
        if (arr.length == 0) {
          this.$message({
            showClose: true,
            message: id,
            duration: 3000,
            type: 'success'
          })
        }
      },
      eventContent(list) {
        // console.log(list)
        this.$router.push({
          path: '/calendar/eventDetaile',
          query: {
            id: list.id,
            eventType: list.eventType
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  #eventList {
    .fade-enter-active, .fade-leave-active {
      transition: opacity 1s
    }
    .fade-enter, .fade-leave-active {
      opacity: 0
    }
  }
</style>
<style lang="scss" scoped>
  #eventList {
    .dateRange {
      span {
        font-size: 14px;
        color: #323232;

        i {
          color: #bfbfbf;
          font-size: 16px;
        }
      }
    }
    .title {
      height: 40px;
      margin-top: 10px;
      .el-col {
        text-align: center;
        height: 100%;
        font-size: 14px;
        color: #323232;
        background: #f0f1f5;
        line-height: 40px;
      }
    }
    .father_row {
      height: auto;
      border-bottom: 1px solid #e3e3e3;
      margin-top: 13px;
      .el-row {
        height: auto;
        line-height: 20px;
        font-size: 14px;
        color: #323232;
        /*cursor: pointer;*/
      }
      .el-col {
        line-height: 22px;
        font-size: 14px;
        color: #323232;
      }
      .son_row {
        .sortStyle, .noticStyle {
          text-align: center;
        }
        .noticStyle {
          color: #e3e3e3;
          min-height: 23px;
          cursor: pointer;
          .isRemind {
            color: #ffb148;
          }
        }
        .eventStyle {
          cursor: pointer;
          &:hover {
            color: #ffb148;
          }
        }
      }
      .son_row:last-child {
        margin-bottom: 5px;
      }
    }

  }
</style>
