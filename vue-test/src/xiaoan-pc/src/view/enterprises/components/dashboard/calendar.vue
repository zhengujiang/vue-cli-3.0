<template>
  <el-tabs v-model="tabValue" @tab-click="handleClick" class="dashboard-tabCalendar">
    <el-tab-pane label="21(周一)" :name="item.stamp.toString()" v-for="(item,index) in dateData" :key="index">
      <div slot="label" class="tabBox">
        <div class="week">{{item.weekName}}</div>
        <div class="date">{{item.date}}</div>
      </div>
      <ul class="tabContent" v-if="eventList.length > 0">
        <li v-for="(item,index) in eventList" @click="goDetaile(item.id, item.eventType)" :key="index">
          <span class="disc"></span>{{item.eventName}}
        </li>
      </ul>
      <ul class="tabContent" v-else>
        <span>暂无待办事项</span>
      </ul>
    </el-tab-pane>
    <!--<el-tab-pane label="22(周二)" name="2">
      <div slot="label">
        <div>周二</div>
        <div>06-10</div>
      </div>
      <div class="tabContent">22(周二)</div>
    </el-tab-pane>
    <el-tab-pane label="23(周三)" name="3">
      <div slot="label">
        <div>周三</div>
        <div>06-10</div>
      </div>
      <div class="tabContent">23(周三)</div>
    </el-tab-pane>
    <el-tab-pane label="24(周四)" name="4">
      <div slot="label">
        <div>周四</div>
        <div>06-10</div>
      </div>
      <div class="tabContent">24(周四)</div>
    </el-tab-pane>
    <el-tab-pane label="25(周五)" name="5">
      <div slot="label">
        <div>周五</div>
        <div>06-10</div>
      </div>
      <div class="tabContent">25(周五)</div>
    </el-tab-pane>
    <el-tab-pane label="25(周五)" name="6">
      <div slot="label">
        <div>周六</div>
        <div>06-10</div>
      </div>
      <div class="tabContent">25(周五)</div>
    </el-tab-pane>
    <el-tab-pane label="25(周五)" name="7">
      <div slot="label">
        <div>周日</div>
        <div>06-10</div>
      </div>
      <div class="tabContent">25(周五)</div>
    </el-tab-pane>-->
  </el-tabs>
</template>

<script>
  export default {
    data() {
      return {
        eventList: [],
        tabValue: '周一',
        dateData: []
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.initDate()
    },
    mounted() {
    },
    // 方法
    methods: {
      initDate() {
        this.getWeekData()
        this.getEnterpriseEvents()
      },
      goDetaile(id, eventType) {
        this.$router.push({
          path: '/calendar/eventDetaile',
          query: {
            id: id,
            eventType: eventType
          }
        })
      },
      handleClick() {
        console.log(this.$common.transTime(this.tabValue)[3])
        this.getEnterpriseEvents()
      },
      getWeekData() {
        let dateArr = []
        let now = new Date();
        // let nowStr = now.getFullYear() + '/' + now.getMonth() + '/' + now.getDate() + ' 00:00:00'
        let nowTime = now.getTime()
        let day = now.getDay()
        let oneDayLong = 24 * 60 * 60 * 1000
        let weekNameArr = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        for (let i = 0; i <= 6; i++) {
          /* if (i == 7) {
            let stamp = nowTime + (i - day) * oneDayLong
            let isToday = day == i
            let datai = this.$common.transTime(stamp)[3]
            dateArr.push({stamp: stamp, isToday: isToday, date: datai, weekName: weekNameArr[i - 1]})
          } else {
            let stamp = nowTime - (day - i) * oneDayLong
            let isToday = day == i
            let datai = this.$common.transTime(stamp)[3]
            dateArr.push({stamp: stamp, isToday: isToday, date: datai, weekName: weekNameArr[i - 1]})
          }
          if (day + 7 == i) {
            this.tabValue = dateArr[i - 1].stamp.toString()
          }
          if (day == i) {
            this.tabValue = dateArr[i - 1].stamp.toString()
          } */

          let stamp = nowTime - (day - i) * oneDayLong
          let isToday = day == i
          let datai = this.$common.transTime(stamp)[3]
          dateArr.push({stamp: stamp, isToday: isToday, date: datai, weekName: weekNameArr[i]})

          if (day == i) {
            this.tabValue = dateArr[i].stamp.toString()
          }
        }
        this.dateData = dateArr
//        var MondayTime = nowTime - (day - 1) * oneDayLong
//        var SundayTime = nowTime + (7 - day) * oneDayLong
//        var monday = new Date(MondayTime);
//        var sunday = new Date(SundayTime);
        console.log(dateArr)

      },
      getEnterpriseEvents() {
        let userId = this.$cookie.get('userId')

        let startDate = this.$common.getTimestampms(this.$common.transTime(this.tabValue)[1]);
        // console.log(startDate);
        let endDate = parseInt(startDate) + 24 * 60 * 60 * 1000

        this.$http({
          method: 'GET',
          url: this.$api.calendar.getEnterpriseEvents,
          params: {
            startDate: startDate,
            endDate: endDate,
            userId: userId
          }
        }).then((res) => {
          if (res.data.returnCode == 1 && res.data.returnObject) {
            if (res.data.returnObject.length > 0) {
              this.eventList = res.data.returnObject[0].events
            } else {
              this.eventList = []
            }
          } else {
            this.eventList = []
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .dashboard-tabCalendar {
    .tabBox {
      padding-bottom: 5px;
    }
    .week {
      font-size: 15px;
    }
    .date {
      font-size: 12px;
      color: #aeaeae;
    }
    .tabContent {
      height: 420px;
      overflow: hidden;
      overflow-y: auto;
      span {
        font-size: 14px;
        color: #323232;
      }
      li {
        width: 100%;
        font-size: 14px;
        color: #323232;
        word-wrap: break-word;
        padding: 5px 0 5px 0;
        position: relative;
        cursor: pointer;
        &:hover {
          color: #ffb148;
          .disc {
            background-color: #ffb148;
          }
        }
        .disc {
          display: inline-block;
          position: relative;
          top: -3px;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #323232;
          margin-right: 5px;
        }
      }
    }
    .el-card__body {
      padding-top: 6px;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      padding: 0;
      margin: 0 5.7px;
      height: 45px;
      line-height: 20px;
    }
    .el-tabs__item.is-top:nth-child(2) {
      margin-left: 0;
    }
    .el-tabs__item.is-top:last-child {
      margin-right: 0;
    }
    .el-tabs__item.is-active {
      color: #ffb148;
      border-bottom: 2px solid #ffb148;
      .date {
        color: #ffb148;
      }
    }
  }
</style>
