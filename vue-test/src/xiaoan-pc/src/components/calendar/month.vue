<template>
  <div id="month">
    <div class="monthPre" @click="preMonth">
      <i class="iconfont web-xiangzuojiantou"></i>
      往前
    </div>
    <ul class="monthBody">
      <li v-for="(list,index) in months" :class="{current: list.iscurrent}" :key="index" @click="intoMonth(index)">
        <p class="monthNum">{{list.value | transHan}}</p>
        <p class="yearNum">{{list.year}}</p>
       <!-- <p>{{list.num}}</p>-->
      </li>
    </ul>
    <div class="monthNext" @click="nextMonth">
      往后
      <i class="iconfont web-xiangyoujiantou"></i>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'month',
    data () {
      return {
        currentYear: 1970,   // 年份
        currentMonth: 1,  // 月份
        currentDay: 1,    // 日期
        currentWeek: 1,    // 星期
        months: []
      }
    },
    filters: {
      transHan (str) {
        var monthObj = [
          {id: 1, value: '一月', iscurrent: false},
          {id: 2, value: '二月', iscurrent: false},
          {id: 3, value: '三月', iscurrent: true},
          {id: 4, value: '四月', iscurrent: false},
          {id: 5, value: '五月', iscurrent: false},
          {id: 6, value: '六月', iscurrent: false},
          {id: 7, value: '七月', iscurrent: false},
          {id: 8, value: '八月', iscurrent: false},
          {id: 9, value: '九月', iscurrent: false},
          {id: 10, value: '十月', iscurrent: false},
          {id: 11, value: '十一月', iscurrent: false},
          {id: 12, value: '十二月', iscurrent: false}
        ]
        for (var i in monthObj) {
          if (monthObj[i].id == str) {
            return monthObj[i].value
          }
        }
      }
    },
    watch: {
      watchCurrent (val) {
        // console.log('watch current', val)
        // this.watchCurrent = false
        this.months = []
        this.getMonth()
      },
      months (val) {
        console.log('this.months ===', val)
        this.$store.commit('currentMonths', val)
      }
    },
    computed: {

    },
    props: {
      watchCurrent: {
        type: Boolean,
        default: false
      }
    },
    created () {
      if (this.$store.state.currentMonths.length !== 0) {
        this.months = this.$store.state.currentMonths
      } else {
        this.getMonth()
      }
    },
    mounted () {
      if (this.$store.state.watchEventDate !== '') {
        var str = this.$store.state.watchEventDate
        str = str.split('/')
        // console.log('------sdfsdf', this.months)
        for (var i in this.months) {
          if (this.months[i].year == str[0] && this.months[i].value == str[1]) {
            this.intoMonth(i)
          }
        }
      } else {

      }
    },
    methods: {
      // 查看该月月历
      intoMonth (index) {
        // console.log('-----index-----', this.months)
        for (var i in this.months) {
          this.months[i].iscurrent = false
        }
        this.months[index].iscurrent = true
        this.$store.commit('watchEventDate', this.months[index].year + '/' + this.months[index].value)
        this.$emit('intoMonth', this.months)
      },
      // 下个月
      nextMonth () {
        var monthStart = this.months[this.months.length - 1].num
        this.getMonth(monthStart)
        this.$emit('nextMonth', this.months)
      },
      // 上个月
      preMonth () {
        var monthStart = this.months[0].num
        this.getMonth(monthStart, true)
        this.$emit('preMonth', this.months)
      },
      // 月
      getMonth (cur, pre) {
        console.log('cur = ', cur)
        this.currentYear = new Date().getFullYear()
        if (cur) {
          this.currentMonth = cur + 1 // pre next
          if (pre) {
            this.currentMonth = cur
          }
        } else {
          this.currentMonth = new Date().getMonth() + 1 // 3 10
        }
        this.months = []
        for (let i = 0; i < 7; i++) {
          let obj = {
            id: i,
            value: pre ? this.currentMonth + i - 7 : this.currentMonth + i,
            year: this.currentYear,
            num: pre ? this.currentMonth + i - 7 : this.currentMonth + i,
            iscurrent: false
          }
          let num = this.currentMonth + i

          // 下月处理
          if (this.currentMonth + i > 12) {
            console.log('?', (this.currentMonth + i), this.currentYear + parseInt((this.currentMonth + i) / 12))
            obj = {
              id: i,
              value: num % 12 == 0 ? 12 : num % 12,
              year: ((this.currentMonth + i) / 12) % 1 === 0 ? this.currentYear + parseInt((this.currentMonth + i) / 12) - 1 : this.currentYear + parseInt((this.currentMonth + i) / 12),
              num: pre ? this.currentMonth + i - 7 : this.currentMonth + i,
              iscurrent: false
            }
          }
          if (this.currentMonth + i <= 0) {
            obj = {
              id: i,
              value: this.currentMonth + i + 12,
              year: this.currentYear + Math.floor((this.currentMonth + 1) / 12), // this.currentYear + Math.round(num / 12)
              num: this.currentMonth + i,
              iscurrent: false
            }
            if (this.currentMonth + i <= -12) {
              obj = {
                id: i,
                value: Math.abs(this.currentMonth + i + 12) % 12 == 0 ? 12 : 12 - Math.abs(this.currentMonth + i + 12) % 12,
                year: ((this.currentMonth + i) / 12) % 1 === 0 ? this.currentYear + Math.floor((this.currentMonth + i) / 12) - 1 : this.currentYear + Math.floor((this.currentMonth + i) / 12),
                num: this.currentMonth + i,
                iscurrent: false
              }
            }
          }

          // 上月处理
          if (this.currentMonth + i - 7 <= 0 && pre) {
            obj = {
              id: i,
              value: this.currentMonth + i - 7 + 12,
              year: ((this.currentMonth + i - 7) / 12) % 1 === 0 ? this.currentYear + Math.floor((this.currentMonth + i - 7) / 12) - 1 : this.currentYear + Math.floor((this.currentMonth + i - 7) / 12), // this.currentYear + Math.floor((this.currentMonth + i - 7) / 12),
              num: this.currentMonth + i - 7,
              iscurrent: false
            }
            if (this.currentMonth + i - 7 <= -12) {
              obj = {
                id: i,
                value: Math.abs(this.currentMonth + i - 7) % 12 == 0 ? 12 : 12 - Math.abs(this.currentMonth + i - 7) % 12,
                year: ((this.currentMonth + i - 7) / 12) % 1 === 0 ? this.currentYear + Math.floor((this.currentMonth + i - 7) / 12) - 1 : this.currentYear + Math.floor((this.currentMonth + i - 7) / 12),
                num: this.currentMonth + i - 7,
                iscurrent: false
              }
            }
          } else if (this.currentMonth + i - 7 > 0 && pre) {
            console.log('pre > 0')
            obj = {
              id: i,
              value: this.currentMonth + i - 7,
              year: ((this.currentMonth + i - 7) / 12) % 1 === 0 ? this.currentYear + parseInt((this.currentMonth + i - 7) / 12) - 1 : this.currentYear + parseInt((this.currentMonth + i - 7) / 12),
              num: this.currentMonth + i - 7,
              iscurrent: false
            }
            if (this.currentMonth + i - 7 > 12) {
              console.log('pre > 12')
              obj = {
                id: i,
                value: (this.currentMonth + i - 7) % 12 == 0 ? 12 : (this.currentMonth + i - 7) % 12, // num % 12 == 0 ? 12 : num % 12
                year: ((this.currentMonth + i - 7) / 12) % 1 === 0 ? this.currentYear + parseInt((this.currentMonth + i - 7) / 12) - 1 : this.currentYear + parseInt((this.currentMonth + i - 7) / 12),
                num: this.currentMonth + i - 7,
                iscurrent: false
              }
            }
          }
          this.months.push(obj)
        }
        // console.log(this.months)
        this.months[0].iscurrent = true
      }
    }
  }
</script>
<style lang="scss" scoped>
  #month {
    width: 100%;
    height: auto;
    overflow: hidden;
    line-height: 40px;
    border-top: 1px solid #E3e3e3;
    border-bottom: 1px solid #e3e3e3;
    margin: 15px 0;
    .monthPre {
      float: left;
      width: 10%;
      cursor: pointer;
      line-height: 90px;
      &:hover{
        color:#ffb148;
      }
    }
    .monthBody {
      float: left;
      width: 80%;
      li {
        display: inline-block;
        width: 14.2%;
        text-align: center;
        font-size: 16px;
        color: #545454;
        .monthNum {
          margin-bottom: 0;
          margin-top: 15px;
        }
        .yearNum {
          font-size: 13px;
          line-height: 30px;
        }
      }
      .current {
        color: #849fee;
        .monthNum {
          width: 45px;
          height: 45px;
          line-height: 45px;
          font-weight: 400;
          margin: 0 auto;
          border-radius: 50%;
          background: #849fee;
          color: #fff;
          font-size: 16px;
        }
      }
    }
    .monthNext {
      float: left;
      width: 10%;
      text-align: right;
      cursor: pointer;
      line-height: 90px;
      &:hover{
        color:#ffb148;
      }
    }
  }
</style>
