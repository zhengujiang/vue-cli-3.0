<template>
  <div class="calendar">
    <!--<div class="calendar-tools">
      <span class="calendar-prev" @click="prev"><</span>
      <div class="calendar-info"> &lt;!&ndash;  @click.stop="changeYear" 选择年份 &ndash;&gt;
        &lt;!&ndash; {{monthString}} &ndash;&gt;
        <div class="month">
          <div class="month-inner"> &lt;!&ndash; :style="{'top':-(this.month*20)+'px'}" &ndash;&gt;
            <span v-for="(m,n) in months" class="monthStyle">
              &lt;!&ndash;<span v-if="month == n" style="color:#ffb148">{{m + n}}</span>&ndash;&gt;
              &lt;!&ndash;<span v-else-if="month < n">{{m + n}}</span>&ndash;&gt;
              &lt;!&ndash;<span v-show="month <= n">{{year}}</span>&ndash;&gt;
              <span v-if="month == n" style="color: #ffb148;">{{m + n}}</span>
              <span v-else>{{m + n}}</span>
              <span>{{year}}</span>
            </span>
          </div>
        </div>
        &lt;!&ndash;<div class="year">{{year}}</div>&ndash;&gt;
      </div>
      <span class="calendar-next" @click="next">></span>
    </div>-->
    <div class="todayMonth" v-show="inYear && inMonth">
      <span>
        <i class="el-icon-date"></i>
        本月：
      </span>
      <span>{{inYear}}</span>年
      <span>{{inMonth}}</span>月
    </div>
    <table cellpadding="5">
      <thead>
      <tr>
        <td v-for="(week,index) in weeks" v-if="0<index<6" class="week">{{week}}</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(day,k1) in days" :style="{'animation-delay':(k1 * 30)+'ms'}"> <!--  -->
        <td v-for="(child,k2) in day" :class="{'selected':child.selected,'disabled':child.disabled,
                'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}"
            @click="select(k1,k2,$event)">
          <div class="td-box">
              <span :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}"
                    class="dayList">
                  <!--<i class="restIcon" v-show="daysStatus[k1][k2].isrest">{{ daysStatus[k1][k2].district }}</i>-->
                <div style="display: inline-block">
                     <span class="restIcon" v-for="(listss,indexss) in daysStatus[k1][k2].district" :key="indexss"
                        :title="listss.eventName" :style="{background: colorArr[listss.district]}" v-show="listss.viewContent !== '通(二)'">{{listss.viewContent}}</span>
                  </div>
                  {{child.day | addZero}}
              </span>

            <div class="text" v-show="child.eventName!= undefined" v-for="(son, k3) in child.eventName" @click.stop="intoEvent(son,child)">
              <span :style="{background: '#' + son.calendarColor}" v-if="son.calendarColor !== null"></span>
              <span style="background: #ffb148" v-else-if="son.calendarColor == null"></span>
              <!--{{child.eventName}}-->
              <!--<div>{{ son.eventName }}</div>-->
              <div v-if="son.eventType == 0 || son.eventType == 2" v-html="replaceBr(son.eventName)"></div>
              <div v-else-if="son.eventType == 1 && son.eventRemark !== ''" v-html="replaceBr(son.eventRemark)"></div>
              <div v-else-if="son.eventType == 1 && son.eventRemark == ''" v-html="replaceBr(son.eventName)"></div>
            </div>
            <!--<div class="text"
                 :class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival}"
                 v-if="lunar">{{child.lunar}}
            </div>-->
          </div>
        </td>
      </tr>
      </tbody>
    </table>
    <!---->
    <div class="calendar-years" :class="{'show':yearsShow}">
      <span v-for="y in years" @click.stop="selectYear(y)" :class="{'active':y==year}">{{y}}</span>
    </div>

  </div>
</template>

<script>
  import calendar from './calendar.js'

  export default {
    props: {
      // 本月日期
      inYear: {
        type: Number,
        default: function () {
          return new Date().getFullYear()
        }
      },
      inMonth: {
        type: Number,
        default: function () {
          return new Date().getMonth() + 1
        }
      },
      // 多选模式
      multi: {
        type: Boolean,
        default: false
      },
      // 范围模式
      range: {
        type: Boolean,
        default: false
      },
      // 默认日期
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 开始选择日期
      begin: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 结束选择日期
      end: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否小于10补零
      zero: {
        type: Boolean,
        default: false
      },
      // 屏蔽的日期
      disabled: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 是否显示农历
      lunar: {
        type: Boolean,
        default: false
      },
      // 自定义星期名称
      weeks: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() == 'zh-cn' ? ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
      },
      // 自定义月份
      months: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() == 'zh-cn' ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
      },
      // 自定义事件
      events: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // 休息日
      rest: {
        type: Array,
        default: []
      }
    },
    data () {
      return {
        years: [],
        yearsShow: false,
        year: 0,
        month: 0,
        day: 0,
        days: [],
        multiDays: [],
        today: [],
        festival: {
          lunar: {
            '1-1': '春节',
            '1-15': '元宵节',
            '2-2': '龙头节',
            '3-7': '寒食节',
            '3-8': '清明节',
            '5-5': '端午节',
            '7-7': '七夕节',
            '7-15': '中元节',
            '8-15': '中秋节',
            '9-9': '重阳节',
            '10-1': '寒衣节',
            '10-15': '下元节',
            '12-8': '腊八节',
            '12-23': '祭灶节',
            '12-30': '除夕'
          },
          gregorian: {
            '1-1': '元旦',
            '2-14': '情人节',
            '3-8': '妇女节',
            '3-12': '植树节',
            '3-14': '白色情人',
            '4-1': '愚人节',
            '4-16': '复活节',
            '5-1': '劳动节',
            '5-4': '青年节',
            '6-1': '儿童节',
            '6-18': '父亲节',
            '7-1': '建党节',
            '8-1': '建军节',
            '9-10': '教师节',
            '10-1': '国庆节',
            '11-1': '万圣节',
            '12-24': '平安夜',
            '12-25': '圣诞节'
          }
        },
        rangeBegin: [],
        rangeEnd: [],
        currentMonth: '2018年02月',
        daysCopy: [], // 当月日期数组
        daysStatus: [], // 当月日期休市状态
        colorArr: ['#e25e32', '#867d72', '#616161', '#867d72']
      }
    },
    filters: {
      addZero (str) {
        if (str < 10) {
          return '0' + str
        } else {
          return str
        }
      }
    },
    watch: {
      rest (val) {
        this.daysCopy = []
        for (let i in this.days) {
          for (let j in this.days[i]) {
            let obj
            if (this.days[i][j].disabled == true) {
              obj = {
                date: this.days[i][j].year + '-' + this.days[i][j].day,
                isrest: false
              }
            } else {
              obj = {
                date: this.days[i][j].year + '-' + this.zeroPad(this.days[i][j].month) + '-' + this.zeroPad(this.days[i][j].day),
                isrest: false
              }
            }
            this.daysCopy.push(obj)
          }
        }
        for (let i in this.daysCopy) {
          for (let j in this.rest) {
            if (this.daysCopy[i].date == this.rest[j].closeDay) {
              this.daysCopy[i].isrest = true
              this.daysCopy[i].district = this.rest[j].district
            }
          }
        }
        console.log('arr-----------', this.daysCopy, this.daysStatus)
      },
      events () {
        this.render(this.year, this.month)
      },
      value (value) {
        this.init()
      },
      inYear (val) {
        this.year = val
        this.month = this.inMonth - 1
        this.render(this.year, this.month)
      },
      inMonth (val) {
        this.year = this.inYear
        this.month = val - 1
        this.render(this.year, this.month)
        console.log('-------inmonth ---', val, this.year, this.month)
      },
      days (val) {
        this.daysCopy = []
        for (let i in val) {
          for (let j in val[i]) {
            let obj
            if (val[i][j].disabled == true) {
              obj = {
                date: val[i][j].year + '-' + val[i][j].day,
                isrest: false
              }
            } else {
              obj = {
                date: val[i][j].year + '-' + this.zeroPad(val[i][j].month) + '-' + this.zeroPad(val[i][j].day),
                isrest: false
              }
            }
            this.daysCopy.push(obj)
          }
        }
        for (let i in this.daysCopy) {
          for (let j in this.rest) {
            if (this.daysCopy[i].date == this.rest[j].closeDay) {
              this.daysCopy[i].isrest = true
              this.daysCopy[i].district = this.rest[j].district
            }
          }
        }
      },
      daysCopy (val) {
        // console.log('val', val)
        this.daysStatus = []
        for (let i = 0, len = val.length; i < len; i += 7) {
          this.daysStatus.push(val.slice(i, i + 7))
        }

      }
    },
    created () {
//      if (this.$store.state.watchEventDate !== '') {
//        var str = this.$store.state.watchEventDate
//        str = str.split('/')
//        this.render(str[0], str[1] - 1)
//      } else {
        this.init()
//      }
    },
    mounted () {
      if (this.$store.state.watchEventDate !== '') {
        var str = this.$store.state.watchEventDate
        str = str.split('/')
        this.year = str[0]
        this.month = str[1] - 1
        this.render(this.year, this.month)
      }
    },
    methods: {
      replaceBr (value) {
        if (value) {
          return value.toString().replace(/\\n/g, '<br/>')
        } else {
          return value
        }
      },
      // 查看事件
      intoEvent (event, i) {
        console.log('月历 -> intoEvent = ', i)
        this.$store.commit('watchEventDate', i.year + '/' + i.month)
        this.$router.push({
          path: '/calendar/eventDetaile',
          query: {
            id: event.id,
            eventType: event.eventType
          }
        })
      },
      moveStart (e) {
        console.log('moveStart left', e)
      },
      moveEnd (e) {
        console.log('moveEnd right', e)
      },
      init () {
        let now = new Date()
        this.year = now.getFullYear()
        this.month = now.getMonth()
        this.day = now.getDate()
        if (this.value.length > 0) {
          if (this.range) { // 范围

            this.year = parseInt(this.value[0][0])
            this.month = parseInt(this.value[0][1]) - 1
            this.day = parseInt(this.value[0][2])

            let year2 = parseInt(this.value[1][0])
            let month2 = parseInt(this.value[1][1]) - 1
            let day2 = parseInt(this.value[1][2])

            this.rangeBegin = [this.year, this.month, this.day]
            this.rangeEnd = [year2, month2, day2]
          } else if (this.multi) { // 多选
            this.multiDays = this.value
            this.year = parseInt(this.value[0][0])
            this.month = parseInt(this.value[0][1]) - 1
            this.day = parseInt(this.value[0][2])
          } else { // 单选
            this.year = parseInt(this.value[0])
            this.month = parseInt(this.value[1]) - 1
            this.day = parseInt(this.value[2])
          }
        }
        console.log('calendar -> init =', this.year, this.month)
        this.render(this.year, this.month)
      },
      // 渲染日期
      render (y, m) {
        let firstDayOfMonth = new Date(y, m, 1).getDay()         // 当月第一天
        let lastDateOfMonth = new Date(y, m + 1, 0).getDate()    // 当月最后一天
        let lastDayOfLastMonth = new Date(y, m, 0).getDate()     // 最后一月的最后一天
        this.year = y
        let seletSplit = this.value
        console.log('seletSplit-value', seletSplit)
        let i, line = 0, temp = [], nextMonthPushDays = 1
        for (i = 1; i <= lastDateOfMonth; i++) {
          let day = new Date(y, m, i).getDay() // 返回星期几（0～6）
          let k
          // 第一行
          if (day == 0) {
            temp[line] = []
          } else if (i == 1) {
            temp[line] = []
            k = lastDayOfLastMonth - firstDayOfMonth + 1
            for (let j = 0; j < firstDayOfMonth; j++) {
              // console.log("第一行",lunarYear,lunarMonth,lunarValue,lunarInfo)
              // console.log('第一行', this.computedPrevMonth(true))
              let m = this.computedPrevMonth(true)
              let dayk = ''
              if (m < 10) {
                dayk = '0' + m + '-' + k
              } else {
                dayk = m + '-' + k
              }
              temp[line].push(Object.assign({
                  year: this.computedPrevYear(),
                  month: this.computedPrevMonth(true),
                  day: dayk,
                  disabled: true
                },
                this.getLunarInfo(this.computedPrevYear(), this.computedPrevMonth(true), k),
                this.getEvents(this.computedPrevYear(), this.computedPrevMonth(true), k)
              ))
              k++
            }
          }
          if (this.range) { // 范围
            console.log('日期范围', this.range, this.getLunarInfo(this.year, this.month + 1, i))
            let options = Object.assign({
                year: this.year,
                month: this.month + 1,
                day: i
              },
              this.getLunarInfo(this.year, this.month + 1, i),
              this.getEvents(this.year, this.month + 1, i)
            )
            if (this.rangeBegin.length > 0) {
              let beginTime = Number(new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2]))
              let endTime = Number(new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]))
              let stepTime = Number(new Date(this.year, this.month, i))
              if (beginTime <= stepTime && endTime >= stepTime) {
                options.selected = true
              }
            }
            if (this.begin.length > 0) {
              let beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])))
              if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true
            }
            if (this.end.length > 0) {
              let endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])))
              if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true
            }
            if (this.disabled.length > 0) {
              if (this.disabled.filter(v => {
                  return this.year === v[0] && this.month === v[1] - 1 && i === v[2]
                }).length > 0) {
                options.disabled = true
              }
            }
            temp[line].push(options)
          } else if (this.multi) { // 多选
            let options
            // 判断是否选中
            if (this.value.filter(v => {
                return this.year === v[0] && this.month === v[1] - 1 && i === v[2]
              }).length > 0) {
              options = Object.assign({
                  year: this.year,
                  month: this.month + 1, day: i, selected: true
                },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i))
            } else {
              options = Object.assign({
                  year: this.year,
                  month: this.month + 1, day: i, selected: false
                },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i))
              if (this.begin.length > 0) {
                let beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])))
                if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true
              }
              if (this.end.length > 0) {
                let endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])))
                if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true
              }
              if (this.disabled.length > 0) {
                if (this.disabled.filter(v => {
                    return this.year === v[0] && this.month === v[1] - 1 && i === v[2]
                  }).length > 0) {
                  options.disabled = true
                }
              }
            }
            temp[line].push(options)
            // console.log(temp[line]);
          } else { // 单选
            // console.log(this.lunar(this.year,this.month,i));
            let chk = new Date()
            let chkY = chk.getFullYear()
            let chkM = chk.getMonth()
            // 匹配上次选中的日期
            if (parseInt(seletSplit[0]) == this.year && parseInt(seletSplit[1]) - 1 == this.month && parseInt(seletSplit[2]) == i) {
              // console.log("匹配上次选中的日期",lunarYear,lunarMonth,lunarValue,lunarInfo)
              temp[line].push(Object.assign({
                  year: this.year,
                  month: this.month + 1,
                  day: i,
                  selected: true
                },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i)
              ))
              this.today = [line, temp[line].length - 1]
            } else if (chkY == this.year && chkM == this.month && i == this.day && this.value == '') {
              // 没有默认值的时候显示选中今天日期
              // console.log("今天",lunarYear,lunarMonth,lunarValue,lunarInfo)
              temp[line].push(Object.assign({
                  year: this.year,
                  month: this.month + 1,
                  day: i,
                  time: this.year + '-' + (this.month + 1) + '-' + i,
                  selected: true
                },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i)
              ))
              this.today = [line, temp[line].length - 1]
            } else {
              // 普通日期
              // console.log("设置可选范围",i,lunarYear,lunarMonth,lunarValue,lunarInfo)
              let options = Object.assign({
                  year: this.year,
                  month: this.month + 1,
                  day: i,
                  selected: false
                },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i)
              )
              if (this.begin.length > 0) {
                let beginTime = Number(new Date(parseInt(this.begin[0]), parseInt(this.begin[1]) - 1, parseInt(this.begin[2])))
                if (beginTime > Number(new Date(this.year, this.month, i))) options.disabled = true
              }
              if (this.end.length > 0) {
                let endTime = Number(new Date(parseInt(this.end[0]), parseInt(this.end[1]) - 1, parseInt(this.end[2])))
                if (endTime < Number(new Date(this.year, this.month, i))) options.disabled = true
              }
              if (this.disabled.length > 0) {
                if (this.disabled.filter(v => {
                    return this.year === v[0] && this.month === v[1] - 1 && i === v[2]
                  }).length > 0) {
                  options.disabled = true
                }
              }
              temp[line].push(options)
              // console.log('temp[line]', temp[line]);
            }
          }
          // 到周六换行
          if (day == 6 && i < lastDateOfMonth) {
            line++
          } else if (i == lastDateOfMonth) {
            // line++
            let k = 1
            for (let d = day; d < 6; d++) {
              // console.log(this.computedNextYear()+"-"+this.computedNextMonth(true)+"-"+k)
              // console.log('????', k, this.computedNextMonth(true))
              let m = this.computedNextMonth(true)
              let dayk = ''
              if (m < 10) {
                if (k < 10) {
                  dayk = '0' + m + '-' + '0' + k
                } else {
                  dayk = '0' + m + '-' + k
                }
              } else {
                if (k < 10) {
                  dayk = m + '-' + '0' + k
                } else {
                  dayk = m + '-' + k
                }
              }
              temp[line].push(Object.assign({
                  year: this.computedNextYear(),
                  month: this.computedNextMonth(true),
                  day: dayk,
                  disabled: true
                },
                this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), k),
                this.getEvents(this.computedNextYear(), this.computedNextMonth(true), k)
              ))
              k++
            }
            // 下个月除了补充的前几天开始的日期
            nextMonthPushDays = k
            // console.log('nextMonthPushDays', nextMonthPushDays);
          }
          // console.log('temp1', temp);
        } // end for
        // console.log('temp2', temp);
        // console.log(this.year + "/" + this.month + "/" + this.day + ":" + line)
        // 补充第六行让视觉稳定
        if (line <= 5 && nextMonthPushDays > 0) {
          // console.log({nextMonthPushDays:nextMonthPushDays,line:line})
          for (let i = line + 1; i <= 5; i++) {
            temp[i] = []
            let start = nextMonthPushDays + (i - line - 1) * 7
            console.log('start', start)
            for (let d = start; d <= start + 6; d++) {
              let m = this.computedNextMonth(true)
              let dayk = ''
              if (m < 10) {
                if (d < 10) {
                  dayk = '0' + m + '-' + '0' + d
                } else {
                  dayk = '0' + m + '-' + d
                }
              } else {
                if (d < 10) {
                  dayk = m + '-' + '0' + d
                } else {
                  dayk = m + '-' + d
                }
              }
              temp[i].push(Object.assign({
                  year: this.computedNextYear(),
                  month: this.computedNextMonth(true),
                  day: dayk,
                  disabled: true
                },
                this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), d),
                this.getEvents(this.computedNextYear(), this.computedNextMonth(true), d)
              ))
            }
            console.log('temp[i]', temp[i])
          }
        }
        this.days = temp
        if (this.days[4][0].month != this.days[5][0].month) {
          this.days.splice(5, 1)
        }
        // console.log('this.days = ', this.days)
      },
      computedPrevYear () {
        let value = this.year
        if (this.month - 1 < 0) {
          value--
        }
        return value
      },
      computedPrevMonth (isString) {
        let value = this.month
        if (this.month - 1 < 0) {
          value = 11
        } else {
          value--
        }
        // 用于显示目的（一般月份是从0开始的）
        if (isString) {
          return value + 1
        }
        return value
      },
      computedNextYear () {
        let value = this.year
        if (this.month + 1 > 11) {
          value++
        }
        return value
      },
      computedNextMonth (isString) {
        let value = this.month
        if (this.month + 1 > 11) {
          value = 0
        } else {
          value++
        }
        // 用于显示目的（一般月份是从0开始的）
        if (isString) {
          return value + 1
        }
        return value
      },
      // 获取农历信息
      getLunarInfo (y, m, d) {
        let lunarInfo = calendar.solar2lunar(y, m, d)
        let lunarValue = lunarInfo.IDayCn
        // console.log(lunarInfo)
        let isLunarFestival = false
        let isGregorianFestival = false
        if (this.festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay] != undefined) {
          lunarValue = this.festival.lunar[lunarInfo.lMonth + '-' + lunarInfo.lDay]
          isLunarFestival = true
        } else if (this.festival.gregorian[m + '-' + d] != undefined) {
          lunarValue = this.festival.gregorian[m + '-' + d]
          isGregorianFestival = true
        }
        return {
          lunar: lunarValue,
          isLunarFestival: isLunarFestival,
          isGregorianFestival: isGregorianFestival
        }
      },
      // 获取自定义事件
      getEvents (y, m, d) {
        if (Object.keys(this.events).length == 0) return false
        let eventName = this.events[y + '-' + m + '-' + d]
        let data = {}
        if (eventName != undefined) {
          data.eventName = eventName
        }
        return data
      },
      // 上月
      prev (e) {
        e.stopPropagation()
        if (this.month == 0) {
          this.month = 11
          this.year = parseInt(this.year) - 1
        } else {
          this.month = parseInt(this.month) - 1
        }
        this.render(this.year, this.month)
        this.$emit('selectMonth', this.month + 1, this.year)
        this.$emit('prev', this.month + 1, this.year)
      },
      //  下月
      next (e) {
        e.stopPropagation()
        if (this.month == 11) {
          this.month = 0
          this.year = parseInt(this.year) + 1
        } else {
          this.month = parseInt(this.month) + 1
        }
        this.render(this.year, this.month)
        this.$emit('selectMonth', this.month + 1, this.year)
        this.$emit('next', this.month + 1, this.year)
        console.log('====', this.month, this.months)
      },
      // 选中日期
      select (k1, k2, e) {
        // this.render(this.days[k1][k2].year, this.days[k1][k2].month)
        // console.log('this.days', this.days[k1][k2].year, this.days[k1][k2].month);

        if (e != undefined) e.stopPropagation()
        // 日期范围
        if (this.range) {
          if (this.rangeBegin.length == 0 || this.rangeEndTemp != 0) {
            this.rangeBegin = [this.year, this.month, this.days[k1][k2].day]
            this.rangeBeginTemp = this.rangeBegin
            this.rangeEnd = [this.year, this.month, this.days[k1][k2].day]
            this.rangeEndTemp = 0

          } else {
            this.rangeEnd = [this.year, this.month, this.days[k1][k2].day]
            this.rangeEndTemp = 1
            // 判断结束日期小于开始日期则自动颠倒过来
            if (+new Date(this.rangeEnd[0], this.rangeEnd[1], this.rangeEnd[2]) < +new Date(this.rangeBegin[0], this.rangeBegin[1], this.rangeBegin[2])) {
              this.rangeBegin = this.rangeEnd
              this.rangeEnd = this.rangeBeginTemp
            }
            // 小于10左边打补丁
            let begin = []
            let end = []
            if (this.zero) {
              this.rangeBegin.forEach((v, k) => {
                if (k == 1) v = v + 1
                begin.push(this.zeroPad(v))
              })
              this.rangeEnd.forEach((v, k) => {
                if (k == 1) v = v + 1
                end.push(this.zeroPad(v))
              })
            } else {
              begin = this.rangeBegin
              end = this.rangeEnd
            }
            // console.log("选中日期",begin,end)
            this.$emit('select', begin, end)
          }
          this.render(this.year, this.month)
        } else if (this.multi) {
          // 如果已经选过则过滤掉
          let filterDay = this.multiDays.filter(v => {
            return this.year === v[0] && this.month === v[1] - 1 && this.days[k1][k2].day === v[2]
          })
          if (filterDay.length > 0) {
            this.multiDays = this.multiDays.filter(v => {
              return this.year !== v[0] || this.month !== v[1] - 1 || this.days[k1][k2].day !== v[2]
            })
          } else {
            this.multiDays.push([this.year, this.month + 1, this.days[k1][k2].day])
          }
          this.days[k1][k2].selected = !this.days[k1][k2].selected
          this.$emit('select', this.multiDays)
        } else {
          // 取消上次选中
          if (this.today.length > 0) {
            this.days.forEach(v => {
              v.forEach(vv => {
                vv.selected = false
              })
            })
          }
          // 设置当前选中天
          this.days[k1][k2].selected = true
          this.day = this.days[k1][k2].day
          this.today = [k1, k2]
          // this.value = [this.days[k1][k2].year, this.days[k1][k2].month, this.days[k1][k2].day];
          this.$emit('select', [this.days[k1][k2].year, this.zero ? this.zeroPad(this.days[k1][k2].month) : this.days[k1][k2].month, this.zero ? this.zeroPad(this.days[k1][k2].day) : this.days[k1][k2].day])
        }
        console.log('select', k1, k2);
      },
      changeYear () {
        if (this.yearsShow) {
          this.yearsShow = false
          return false
        }
        this.yearsShow = true
        this.years = []
        for (let i = ~~this.year - 15; i < ~~this.year + 15; i++) {
          this.years.push(i)
        }
      },
      selectYear (value) {
        this.yearsShow = false
        this.year = value
        this.render(this.year, this.month)
        this.$emit('selectYear', value)
      },
      // 返回今天
      setToday () {
        let now = new Date()
        this.year = now.getFullYear()
        this.month = now.getMonth()
        this.day = now.getDate()
        this.render(this.year, this.month)
        // 遍历当前日找到选中
        this.days.forEach(v => {
          let day = v.find(vv => {
            return vv.day == this.day && !vv.disabled
          })
          if (day != undefined) {
            day.selected = true
          }
        })
      },
      // 日期补零
      zeroPad (n) {
        return String(n < 10 ? '0' + n : n)
      }
    }
  }
</script>
<style lang="scss">
  .calendar {
    .todayMonth {
      margin-bottom: 10px;
      font-size: 13px;
      color: #323232;
      span {
        font-size: 14px;
        color: #323232;
        .el-icon-date {
          color: #bfbfbf;
          font-size: 16px;
        }
      }
    }
    table {
      clear: both;
      width: 100%;
      margin-bottom: 10px;
      border-collapse: collapse;
      color: #444444;
      .week {
        background: #f0f1f5;
        font-size: 14px;
        color: #323232;
        line-height: 40px;
        height: 40px;
        pointer-events: none;
        cursor: default;
      }
      thead {
        td {
          border: none;
        }
      }
      td {
        padding: 0 0;
        width: 14.28571429%;
        min-height: 150px;
        text-align: center;
        font-size: 13px;
        color: #323232;
        cursor: pointer;
        position: relative;
        border-right: 1px solid #e3e3e3;
        border-bottom: 1px solid #e3e3e3;
        vertical-align: initial;
        .td-box {
          border: 1px solid #e3e3e3;
          padding: 5px;
          box-sizing: border-box;
          min-height: 150px;
          .dayList {
            display: block;
            width: 100%;
            height: 25px;
            font-size: 13px;
            color: #323232;
            line-height: 25px;
            margin: 0px auto 0;
            text-align: right;
            .restIcon {
              width: 18px;
              height: 18px;
              border-radius: 50%;
              text-align: center;
              line-height: 18px;
              background: #e25e32;
              font-size: 12px;
              color: #fff;
              display: inline-block;
              margin-right: 2px;
              &:last-child{
                margin-right: 0;
              }
            }
          }
          .text {
            width: 100%;
            height: auto;
            padding: 8px 5px 8px 8px;
            text-align: left;
            font-size: 12px;
            color: #323232;
            border-radius: 4px;
            position: relative;
            margin-bottom: 10px;
            -moz-box-shadow: 0px 0px 8px rgba(0, 0, 0, .1);
            -webkit-box-shadow: 0px 0px 8px rgba(0, 0, 0, .1);
            box-shadow: 0px 0px 8px rgba(0, 0, 0, .1);
            &:hover {
              -moz-box-shadow: 4px 4px 8px rgba(0, 0, 0, .1);
              -webkit-box-shadow: 4px 4px 8px rgba(0, 0, 0, .1);
              box-shadow: 4px 4px 8px rgba(0, 0, 0, .1);
            }
            span {
              float: left;
              width: 3px;
              height: 100%;
              position: absolute;
              left: 0;
              top: 0;
              display: block;
              background: red;
              border-top-left-radius: 4px;
              border-bottom-left-radius: 4px;
            }
          }
          .text:last-child {
            margin-bottom: 0;
          }
        }
      }
      .disabled {
        background: #fafafa;
        .dayList {
          color: #bfbfbf !important;
        }
      }
      td:not(.disabled).selected .td-box {

      }
      tr {
        td:last-child {
          border-right: none;
        }
      }
    }
  }
</style>
<style scoped>
  .calendar {
    margin: auto;
    width: 100%;
    min-width: 300px;
    background: #fff;
    user-select: none;
    display: block;
    float: left;
  }

  .calendar table {
    clear: both;
    width: 100%;
    margin-bottom: 10px;
    border-collapse: collapse;
    color: #444444;
  }

  .calendar tbody tr {
    /*//  padding: 3px;*/
  }

  .calendar td.disabled {
    color: #ccc;
    /*pointer-events: none !important;*/
    /*cursor: default !important;*/
  }

  .calendar td.disabled div {
    color: #ccc;
  }

  .calendar td:not(.selected) span:not(.red):hover {
    /*background: #f3f8fa;*/
    /*color: #444;*/
  }

  .calendar td:not(.selected) span.red:hover {
    /*background: #f9efef;*/
  }

  /* 周六日 */
  .calendar td:not(.disabled) span.red {
    color: #323232;
  }

  .calendar td .td-box {
    border: 2px solid transparent;
    height: 100%;
  }

  .calendar td.selected span {
    /*background-color: #5e7a88;*/
    /*color: #fff;*/
  }

  .calendar td .isGregorianFestival,
  .calendar td .isLunarFestival {
    color: #ffb148;
  }

  .calendar-button {
    text-align: center;
  }

  .calendar-button span {
    cursor: pointer;
    display: inline-block;
    min-height: 1em;
    min-width: 5em;
    vertical-align: baseline;
    background: #5e7a88;
    color: #fff;
    margin: 0 .25em 0 0;
    padding: .6em 2em;
    font-size: 1em;
    line-height: 1em;
    text-align: center;
    border-radius: .3em;
  }

  .calendar-button span.cancel {
    background: #efefef;
    color: #666;
  }

  .calendar-years {
    position: absolute;
    left: 0px;
    top: 60px;
    right: 0px;
    bottom: 0px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    overflow: auto;
    transition: all .5s cubic-bezier(0.075, 0.82, 0.165, 1);
    opacity: 0;
    pointer-events: none;
    transform: translateY(-10px);
  }

  .calendar-years.show {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0px);
  }

  .calendar-years > span {
    margin: 1px 5px;
    display: inline-block;
    width: 60px;
    line-height: 30px;
    border-radius: 20px;
    text-align: center;
    border: 1px solid #fbfbfb;
    color: #999;
  }

  .calendar-years > span.active {
    border: 1px solid #5e7a88;
    background-color: #5e7a88;
    color: #fff;
  }
</style>
