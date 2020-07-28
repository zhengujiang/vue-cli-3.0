<template>
  <div class="dateComponent">
    <!-- 上周 -->
    <div class="weekArrow" @click="weekPre">
      <i class="iconfont web-xiangzuojiantou"></i>
      往前
    </div>
    <!-- 日期 -->
    <ul class="days">
      <li @click="pick(day,index)" v-for="(day, index) in days" :key="index">
        <!--本月-->
        <div>
          <span v-if="day.getMonth()+1 != currentMonth"
                :class="{active: dayStatus[index].isactive, currentToday: day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()}"> <!--class="other-month"-->
                  <p class="restIconDiv">
                     <i class="restIconSpan" v-for="(list,index) in dayStatus[index].district"
                        :title="list.eventName" :style="{background: colorArr[list.district]}" v-show="list.viewContent !== '通(二)'">
                       <i>{{list.viewContent}}</i>
                     </i>
                  </p>
            {{ day.getDate() }}
          </span>

          <span v-else>
          <!--今天-->
            <span
              v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()"
              :class="{active: dayStatus[index].isactive, currentToday: day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()}">

                  <p class="restIconDiv">
                     <i class="restIconSpan" v-for="(list,index) in dayStatus[index].district"
                        :title="list.eventName" :style="{background: colorArr[list.district]}" v-show="list.viewContent !== '通(二)'">
                       <i>{{list.viewContent}}</i> <!--  v-if="list.viewContent !== '通(二)'" -->
                       <!--<i v-else>{{list.district}}</i>-->
                     </i>
                  </p>

              {{ day.getDate() }}
            </span>
            <span :class="{active: dayStatus[index].isactive}" v-else> <!--   :class="{active: dayStatus[index].isactive}" -->
                  <p class="restIconDiv">
                     <i class="restIconSpan" v-for="(list,index) in dayStatus[index].district"
                        :title="list.eventName" :style="{background: colorArr[list.district]}" v-show="list.viewContent !== '通(二)'">
                       <i>{{list.viewContent}}</i> <!--  v-if="list.viewContent !== '通(二)'" -->
                       <!--<i v-else>{{list.district}}</i>-->
                     </i>
                  </p>
              {{ day.getDate() }}
            </span>
        </span>

        </div>
        <!-- 星期 -->
        <div class="weekStyle">
          <!-- <span v-if="day.getMonth()+1 != currentMonth" class="other-month">{{ day.getDay() | weekStr }}</span>-->
          <span> <!--v-else-->
            <span
              v-if="day.getFullYear() == new Date().getFullYear() && day.getMonth() == new Date().getMonth() && day.getDate() == new Date().getDate()"
              :class="{activeWeek: dayStatus[index].isactive}">{{ day.getDay() | weekStr }}</span>
              <span :class="{activeWeek: dayStatus[index].isactive}" v-else>{{ day.getDay() | weekStr }}</span>
          </span>
        </div>
      </li>
    </ul>

    <div class="weekArrow" @click="weekNext">
      往后
      <i class="iconfont web-xiangyoujiantou"></i>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'calendar',

    data () {
      return {
        currentYear: 1970,   // 年份
        currentMonth: 1,  // 月份
        currentDay: 1,    // 日期
        currentWeek: 1,    // 星期
        days: [],
        dayStatus: [
          {day: '', isrest: false, isactive: false, district: '', viewContent: ''},
          {day: '', isrest: false, isactive: false, district: '', viewContent: ''},
          {day: '', isrest: false, isactive: false, district: '', viewContent: ''},
          {day: '', isrest: false, isactive: false, district: '', viewContent: ''},
          {day: '', isrest: false, isactive: false, district: '', viewContent: ''},
          {day: '', isrest: false, isactive: false, district: '', viewContent: ''},
          {day: '', isrest: false, isactive: false, district: '', viewContent: ''}
        ],
        dateStr: '',
        colorArr: ['#e25e32', '#867d72', '#616161', '#867d72']
      }
    },
    props: {
      today: {
        type: String,
        default: ''
      },
      watchCurrent: {
        type: Boolean,
        default: false
      },
      rest: {
        type: Array,
        default: []
      }
    },
    computed: {
      selectDate () {
        return this.$store.state.selectDate
      },
      currentTime () {
        return this.$store.state.currentEvent
      }
    },
    watch: {
      rest (val) {
        this.dayStatus = []
        var current = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        if (this.currentTime !== '') {
          current = new Date(this.currentTime).getFullYear() + '-' + (new Date(this.currentTime).getMonth() + 1) + '-' + new Date(this.currentTime).getDate()
        }
        for (var i = 0; i < this.days.length; i++) {
          var valList = this.days[i].getFullYear() + '-' + (this.days[i].getMonth() + 1) + '-' + this.days[i].getDate()
          let obj
          if (valList == current) {
            obj = {day: Date.parse(this.days[i]), isrest: false, isactive: true, district: ''}
          } else {
            obj = {day: Date.parse(this.days[i]), isrest: false, isactive: false, district: ''}
          }
          this.dayStatus.push(obj)
        }
        var timeStamps = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        this.$nextTick(() => {
          for (let j in this.dayStatus) {
            for (let i in this.rest) {
              if (this.rest[i].closeDay == this.$common.transTime(this.dayStatus[j].day)[1]) {
                this.dayStatus[j].isrest = true
                this.dayStatus[j].district = this.rest[i].district
              }
            }
            if ((this.dayStatus[j].day - 28800000) == this.selectDate) {
              this.dayStatus[j].isactive = true
            } else {
              this.dayStatus[j].isactive = false
            }
            if ((this.dayStatus[j].day - 28800000) == timeStamps && this.selectDate == '') {
              this.dayStatus[j].isactive = true
            }
          }
          if (this.currentTime !== '') {
            for (let i in this.dayStatus) {
              console.log('day ===', this.dayStatus[i].day)
              if ((this.dayStatus[i].day - 28800000) == this.currentTime) {
                this.dayStatus[i].isactive = true
              } else {
                this.dayStatus[i].isactive = false
              }
            }
          } else {
            var now = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate()).getTime()
            for (let i in this.dayStatus) {
              if ((this.dayStatus[i].day - 28800000) == now) {
                this.dayStatus[i].isactive = true
              } else {
                this.dayStatus[i].isactive = false
              }
            }
          }
        })
      },
      selectDate (val) {
        this.initData(val)
        this.$store.commit('currentEvent', val)
      },
      today (val) {
        const str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay) // 今日日期 年-月-日
      },
      watchCurrent (val) {
        this.$store.commit('currentEvent', '')
        this.days = []
        this.dayStatus = []
        this.initData(null)
      },
      days (val) {
        console.log('---- val -----', val)
        this.dayStatus = []
        var current = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        if (this.currentTime !== '') {
          current = new Date(this.currentTime).getFullYear() + '-' + (new Date(this.currentTime).getMonth() + 1) + '-' + new Date(this.currentTime).getDate()
        }
        for (var i = 0; i < val.length; i++) {
          var valList = val[i].getFullYear() + '-' + (val[i].getMonth() + 1) + '-' + val[i].getDate()
          let obj
          if (valList == current) {
            obj = {day: Date.parse(val[i]), isrest: false, isactive: true, district: ''}
          } else {
            obj = {day: Date.parse(val[i]), isrest: false, isactive: false, district: ''}
          }
          this.dayStatus.push(obj)
        }
        var timeStamps = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        console.log('------ val2 ------', this.selectDate)
        this.$nextTick(() => {
          for (let j in this.dayStatus) {
            for (let i in this.rest) {
              if (this.rest[i].closeDay == this.$common.transTime(this.dayStatus[j].day)[1]) {
                this.dayStatus[j].isrest = true
                this.dayStatus[j].district = this.rest[i].district
              }
            }
            if ((this.dayStatus[j].day - 28800000) == this.selectDate) {
              console.log('4')
              this.dayStatus[j].isactive = true
            } else {
              this.dayStatus[j].isactive = false
            }
            if ((this.dayStatus[j].day - 28800000) == timeStamps && this.selectDate == '') {
              this.dayStatus[j].isactive = true
            }
          }
          if (this.currentTime !== '' || this.selectDate !== '') {
            console.log('2', this.currentTime, this.selectDate, this.dayStatus)
            for (let i in this.dayStatus) {
              if ((this.dayStatus[i].day - 28800000) == this.currentTime || (this.dayStatus[i].day - 28800000) == this.selectDate) {
                console.log('2.1')
                this.dayStatus[i].isactive = true
              } else {
                this.dayStatus[i].isactive = false
              }
            }
          } else {
            console.log('3')
            var now = new Date(new Date().getFullYear() + '/' + (new Date().getMonth() + 1) + '/' + new Date().getDate()).getTime()
            for (let i in this.dayStatus) {
              if ((this.dayStatus[i].day - 28800000) == now) {
                this.dayStatus[i].isactive = true
              } else {
                this.dayStatus[i].isactive = false
              }
            }
          }
        })
      },
      currentTime (val) {
//        for (let i in this.dayStatus) {
//          console.log('watch: currentTime = ', val, val == (this.dayStatus[i].day - 28800000), i)
//          if ((this.dayStatus[i].day - 28800000) == val) {
//            this.dayStatus[i].isactive = true
//          } else {
//            this.dayStatus[i].isactive = false
//          }
//        }
//        this.dayStatus = Object.assign([], this.dayStatus);
//        console.log('00000 daysStatus = ', this.dayStatus)
      }
    },
    mounted () {
      // console.log('mounted: currentTime = ', this.currentTime)
      if (this.currentTime !== '') {
        this.initData(this.currentTime)
      }
      // console.log('mounted: dayStatus = ', this.dayStatus)
    },
    filters: {
      weekStr (str) {
        var weekList = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        return weekList[str]
      }
    },

    created () {
      this.initData(null)
    },

    methods: {
      returnCurrent () {
        this.dayStatus = []
        var val = this.days
        var current = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()
        for (let i in val) {
          let valList = val[i].getFullYear() + '-' + (val[i].getMonth() + 1) + '-' + val[i].getDate()
          let obj
          if (valList == current) {
            obj = {day: Date.parse(val[i]), isrest: false, isactive: true}
          } else {
            obj = {day: Date.parse(val[i]), isrest: false, isactive: false}
          }
          this.dayStatus.push(obj)
        }
      },
      formatDate (year, month, day) {
        const y = year
        let m = month
        if (m < 10) m = `0${m}`
        let d = day
        if (d < 10) d = `0${d}`
        return `${y}-${m}-${d}`
      },

      initData (cur) {
        let date = ''
        if (cur) {
          date = new Date(cur)
        } else {
          date = new Date()
        }
        this.currentDay = date.getDate()          // 今日日期 几号
        this.currentYear = date.getFullYear()       // 当前年份
        this.currentMonth = date.getMonth() + 1    // 当前月份
        this.currentWeek = date.getDay() // 1...6,0   // 星期几
        if (this.currentWeek === 0) {
          this.currentWeek = 1
        }
        const str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay)// 今日日期 年-月-日
        this.days.length = 0
        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
        /* eslint-disabled */
        for (let i = this.currentWeek; i >= 0; i -= 1) {
          const d = new Date(str)
          d.setDate(d.getDate() - i)
          this.days.push(d)
        }
        for (let i = 1; i < 7 - this.currentWeek; i += 1) {
          const d = new Date(str)
          d.setDate(d.getDate() + i)
          this.days.push(d)
        }
        this.returnCurrent()
        // console.log('cur = ', cur, this.days)
      },

      //  上个星期
      weekPre () {
        const d = this.days[1]    // 如果当期日期是7号或者小于7号
        console.log('上个星期 d = ', d)
        d.setDate(d.getDate() - 7)
        console.log('上个星期 d2 = ', d)

        this.initData(d)
        let x = this.days[0]
        console.log('x = ', d.setDate(d.getDate()) - 28800000, d.setDate(d.getDate() + 6))
        this.$emit('weekPreM', d.setDate(d.getDate() - 7) - 28800000, d.setDate(d.getDate() + 6))
      },
      //  下个星期
      weekNext () {
        const d = this.days[6]    // 如果当期日期是7号或者小于7号
        console.log('下个星期 d = ', d)
        d.setDate(d.getDate() + 7)
        console.log('下个星期 d2 = ', d)
        this.dateStr = d
        this.initData(d)
        console.log('下周 === ', d.setDate(d.getDate() - 6) - 28800000, d.setDate(d.getDate() + 6))

        this.$emit('weekNextM', d.setDate(d.getDate() - 6) - 28800000, d.setDate(d.getDate() + 6))
      },

      // 上一個月   传入当前年份和月份
      pickPre (year, month) {
        const d = new Date(this.formatDate(year, month, 1))
        d.setDate(0)
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      },

      // 下一個月   传入当前年份和月份
      pickNext (year, month) {
        const d = new Date(this.formatDate(year, month, 1))
        d.setDate(35)
        this.initData(this.formatDate(d.getFullYear(), d.getMonth() + 1, 1))
      },

      // 当前选择日期
      pick (date, index) {
        // console.log(this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate()))
        // console.log(this.dayStatus[index], this.days[index])
//        this.$message({
//          message: this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate()) + '==' + index,
//          showClose: false,
//          duration: 3000,
//          type: 'success'
//        })
        this.$store.commit('currentEvent', '')
        for (let i in this.dayStatus) {
          this.dayStatus[i].isactive = false
        }
        this.dayStatus[index].isactive = true
        this.$store.commit('currentEvent', this.dayStatus[index].day)
        this.$store.commit('selectDate', (this.dayStatus[index].day - 28800000))
//        console.log('week -> this.dayStatus[index].day =', this.dayStatus[index].day)
//        console.log('pick: dayStatus = ', this.dayStatus)
      }
    }
  }
</script>
<style lang="scss">
  .dateComponent {
    height: 100px;
    color: #323232;
    width: 100%;
    border-top: 1px solid #e3e3e3;
    border-bottom: 1px solid #e3e3e3;
    position: relative;
    margin: 15px 0;

    .weekArrow {
      width: 7%;
      position: absolute;
      left: 0;
      top: 0;
      padding-top: 38px;
      height: 100%;
      cursor: pointer;
      font-size: 16px;
      color: #545454;
      text-align: left;
      &:active {
        color: #ffb148;
      }
      &:hover {
        color: #ffb148;
      }
    }
    .weekArrow:last-child {
      right: 0;
      position: absolute;
      left: inherit;
      text-align: right;
    }
    .weekdays, .days {
      width: 86%;
      color: #545454;
      font-size: 13px;
    }
    .weekStyle {
      color: #545454;
      font-size: 13px;
      margin-top: 0px;
    }

    .days {
      display: flex;
      position: absolute;
      left: 0;
      right: 0;
      margin: auto;
      top: 18px;
      font-size: 22px;
      li {
        flex: 1;
        text-align: center;
        line-height: 30px;
        span {
          position: relative;
          display: inline-block;
          width: 35px;
          height: 35px;
          line-height: 35px;
          text-align: center;
          .restIcon {
            width: 17px;
            height: 17px;
            border-radius: 50%;
            text-align: center;
            line-height: 17px;
            background: #e25e32;
            font-size: 10px;
            color: #fff;
            position: absolute;
            right: -12px;
            top: -10px;
          }
          .restIconDiv {
            position: absolute;
            left: 30px;
            top: -10px;
            width: auto;
            height: auto;
            line-height: normal;
            min-width: 75px;
            display: inline-table;
            // display: table-cell;
            i {
              width: 17px;
              height: 17px;
              border-radius: 50%;
              text-align: center; // display: inline-block;
              line-height: 17px;
              font-size: 10px;
              color: #fff;
              font-weight: normal;
              margin-right: 2px;
              float: left;font-size: 10px;
            }
            i:last-child {
              margin-right: 0;
            }
          }
        }
        .active {
          color: #fff;
          border-radius: 50%;
          background-color: #849fee !important;
        }
        .currentToday {
          border-radius: 50%;
          background-color: #c0cae5;
          color: #fff;
        }
        .other-month {
          color: #aeaeae;
        }
      }
      .activeWeek {
        color: #849fee;
      }
    }
  }
</style>
