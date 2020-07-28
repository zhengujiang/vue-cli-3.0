<template>
  <div id="searchEvent">
    <div class="ctitle">
      <router-link to="/calendar/index" class="back"><i class="el-icon-arrow-left iarrow"></i> 返回</router-link>
      <el-input
        placeholder="请输入内容"
        v-model="inputEvent" :autofocus="autofocus"
        @change="searchEventList" @blur="searchEventList">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
    </div>
    <eventSearchList :tabList="tableData" :eventSort="msg" :text="inputEvent"></eventSearchList>
  </div>
</template>

<script>
  import eventSearchList from '@/components/calendar/eventSearchList.vue'

  export default {
    data () {
      return {
        msg: 'searchEvent',
        week_s: '',
        week_e: '',
        todayDate: '',
        inputEvent: '',
        start: '',
        end: '',
        autofocus: true,
        tableData: [
//          {
//            id: '1',
//            date: '',
//            arr: [
//              {id: '11', calendarName: '工作日历', eventName: '召开临时股东大会', eventConfirmFrequency: '1'},
//              {id: '12', calendarName: '工作日历', eventName: '召开临时股东大会', eventConfirmFrequency: '1'}
//            ]
//          }
        ],
        calendarList: []
      }
    },
    // 使用其它组件
    components: {
      eventSearchList
    },
    computed: {
      cScreen () {
        return this.$store.state.cScreen
      }
    },
    watch: {
      '$route': 'getPath',
      cScreen () {
        if (this.$route.path == '/calendar/searchEvent') {
          this.calendarList = JSON.parse(window.localStorage.getItem('calendarList'))
          // this.tableData = []
          if (this.$store.state.inputEvent !== '') {

          } else {
            this.$nextTick(() => {
              this.getEventsListBytimeSlot()
            })
          }
        }
      }
    },
    // 生命周期函数
    created () {
      this.calendarList = JSON.parse(window.localStorage.getItem('calendarList'))
      var lett = this
      document.onkeydown = function (e) {
        var key = window.event.keyCode
        if (key == 13) {
          console.log('-------- c-1 -------- ')
          lett.searchEventList()
        }
      }
    },
    mounted () {
      // document.querySelector('el-input__inner').focus()
      var starts = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/01'
      this.start = Date.parse(new Date(starts))
      // console.log('------ start ', this.start)
      this.end = this.$common.getLastDayOfMonth(new Date().getFullYear(), (new Date().getMonth() + 1))

      if (this.$store.state.inputEvent !== '') {
        this.inputEvent = this.$store.state.inputEvent
        console.log('-------- c0 -------- ')
        this.searchEventList()
      } else {
        this.getEventsListBytimeSlot()
      }
    },
    activated () {
      // document.querySelector('el-input__inner').focus()
//      var starts = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/01'
//      this.start = Date.parse(new Date(starts))
//      console.log('------ start ', this.start)
//      this.end = this.$common.getLastDayOfMonth(new Date().getFullYear(), (new Date().getMonth() + 1))
//      this.getEventsListBytimeSlot()
    },
    deactivated () {
      console.log('-----009090-------')
    },
    // 方法
    methods: {
      getPath () {
        this.calendarList = JSON.parse(window.localStorage.getItem('calendarList'))
        // console.log('-------get-------', this.calendarList, this.getIds())
//        var starts = new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/01'
//        this.start = Date.parse(new Date(starts))
//        this.end = this.$common.getLastDayOfMonth(new Date().getFullYear(), (new Date().getMonth() + 1))
        this.tableData = []
        if (this.$store.state.inputEvent !== '') {
          console.log('-------- c1 -------- ')
          this.searchEventList()
        } else {
          this.$nextTick(() => {
            console.log('121212')
            // this.getEventsListBytimeSlot()
          }, 3000)

        }

      },
      getIds () {
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
      getEventsListBytimeSlot () {
        this.tableData = []
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getEventsListBytimeSlot,
          params: {
            userId: this.$cookie.get('userId'),
            startDate: this.start,
            endDate: this.end,
            calendarIds: this.getIds()
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
            console.log('------事件捕捉--------', this.tableData)
          } else {

          }
        })
      },
      // 搜索事件结果
      searchEventList () {
        if (this.inputEvent !== '') {
          this.calendarList = JSON.parse(window.localStorage.getItem('calendarList'))
          this.$store.commit('inputEvent', this.inputEvent)
          this.$http({
            method: 'GET',
            url: this.$api.calendar.searchEventList,
            params: {
              userId: this.$cookie.get('userId'),
              calendarIDs: this.getIds(),
              /* pageNum: 1,
               pageSize: 20, */
              eventName: this.inputEvent
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              var eventList = res.data.returnObject
              for (let i in eventList) {
                // // eventList[i].id = i
                // eventList[i].date = this.$common.transTime(eventList[i].date)[0]
                eventList[i].date = this.$common.transTime(eventList[i].eventBeginDate)[0] + '--' + this.$common.transTime(eventList[i].eventEndDate)[0]
                if (eventList[i].eventBeginDate == eventList[i].eventEndDate) {
                  eventList[i].date = this.$common.transTime(eventList[i].eventBeginDate)[0]
                }
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
              console.log('失焦了，tableData = ', this.tableData)
            } else {

            }
          })
        }

      }
    }
  }
</script>

<style lang="scss">
  #searchEvent {
    width: 100%;
    height: auto;
    margin-top: -10px;
    .ctitle {
      position: relative;
      // border-bottom: 1px solid #e3e3e3;
      line-height: 60px;
      text-align: center;
      font-size: 16px;
      color: #323232;
      .back {
        position: absolute;
        left: 0;
        color: #ffb148;
        cursor: pointer;
      }
      .iarrow {
        font-weight: 900;
      }
      .el-input {
        width: 80%;
        margin-left: -45px;
        .el-input__inner {
          height: 30px;
          line-height: 30px;
        }
      }
    }
  }
</style>
