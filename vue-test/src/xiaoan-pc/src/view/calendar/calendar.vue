<template>
  <v-nav navIndex="4">
    <template slot="slotMain">
      <div id="calendar">
        <div class="left">

        </div>
        <div class="right" id="rightContent">
          <div class="addEvent">
            <el-button>添加事件1</el-button>
            <el-input v-model="inputEvent" class="inputEvent" placeholder="请输入事件名称"></el-input>
          </div>
          <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs">
            <el-tab-pane label="周历" name="first"></el-tab-pane>
            <el-tab-pane label="月历" name="second"></el-tab-pane>
          </el-tabs>
          <el-button @click.stop="$refs.calendarDom.setToday()">今天</el-button>
          <v-calendar ref="calendarDom"
                      :events="calendar1.events"
                      :lunar="calendar1.lunar"
                      :value="calendar1.value"
                      :begin="calendar1.begin"
                      :end="calendar1.end"
                      @select="select"
                      @selectMonth="selectMonth"
                      @selectYear="selectYear" v-if="!weekShow">
          </v-calendar>
          <weekCalendar v-else-if="weekShow"></weekCalendar>
          <eventList v-show="weekShow"></eventList>
        </div>
      </div>
    </template>
  </v-nav>
</template>
<script>
  import nav from '../user/nav.vue'
  import calendar from '../../components/calendar/calendar.vue'
  import weekCalendar from '../../components/calendar/week.vue'
  import eventList from '../../components/calendar/eventList.vue'

  export default {
    name: 'calendar',
    data () {
      return {
        inputEvent: '',
        activeName: 'first',
        weekShow: true,
        calendar1: {
          value: [2018, 3, 1], // 默认日期
          lunar: false, // 显示农历
          weeks: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // 周
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'], // 月
          events: {
            '2018-3-1': '写代码'
            // '2017-7-20':'写代码',
            // '2017-7-21':'写代码',
            // '2017-7-22':'写代码',
          }, // 显示的提示
          timestamp: Date.now() // 当前时间
        }
      }
    },
    components: {
      'v-nav': nav,
      'v-calendar': calendar,
      weekCalendar,
      eventList
    },
    methods: {
      handleClick (tab, event) {
        console.log('周历 or 月历', tab, event)
        tab.name == 'first' ? this.weekShow = true : this.weekShow = false
      },
      select (value) {
        console.log('选中某天', value[0] + '-' + value[1] + '-' + value[2] + '')
        this.calendar1.value = [value[0], value[1], value[2]]
      },
      selectMonth (month, year) {
        console.log('年', year, '月', month)
      },
      selectYear (year) {
        console.log('年', year)
      }
    }
  }
</script>
<style lang="scss" >
  #calendar {
    width: 100%;
    height: auto;
    #rightContent {
      padding: 15px 20px;
      .addEvent {
        display: inline-block;
        .inputEvent {
          width: 200px;
        }
      }
      .tabs {
        display: inline-block;
        width: auto;
        .el-tabs__header {
          margin: 0;
        }
      }
    }
  }
</style>
