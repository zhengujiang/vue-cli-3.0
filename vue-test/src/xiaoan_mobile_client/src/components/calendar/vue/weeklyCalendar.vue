<template>
  <div class="calendar">
    <table cellpadding="5" class="table-theader">
      <thead>
      <tr>
        <td v-for="week in weeks" class="week">{{week}}</td>
      </tr>
      </thead>
    </table>
    <!-- 日期 -->
    <div class="calendar-banner">
      <div id="tableWrap">
        <div data-index="-1" class="list">
          <table cellpadding="5" class="table-date">
            <tbody>
            <tr>
              <td @click="select(k2,$event)" v-for="(day, k2) in days" :key="k2"
                  :class="{'selected':day.selected,color:newDay(day,k2)}">
                <div class="td-box">
                  <span class="td-day" :class="{'red':k2==0||k2==6}">{{day.day}}</span>
                  <span class="point" v-show="day.eventName!= undefined">{{day.eventName}}</span>
                  <span class="annotation" v-show="day.annotation!= undefined">
                            <i></i>
                        </span>
                  <div class="text"
                       :class="{'isLunarFestival':day.isLunarFestival,'isGregorianFestival':day.isGregorianFestival}"
                       v-show="lunar">{{day.lunar}}
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div data-index="0" class="list">
          <table cellpadding="5" class="table-date">
            <tbody>
            <tr>
              <td @click="select(k2,$event)" v-for="(day, k2) in days"
                  :class="{'selected':day.selected,color:newDay(day,k2)}">
                <div class="td-box">
                  <span class="td-day" :class="{'red':k2==0||k2==6}">{{day.day}}</span>
                  <span class="point" v-show="day.eventName!= undefined">{{day.eventName}}</span>
                  <span class="annotation" v-show="day.annotation!= undefined">
                            <i></i>
                        </span>
                  <div class="text"
                       :class="{'isLunarFestival':day.isLunarFestival,'isGregorianFestival':day.isGregorianFestival}"
                       v-show="lunar">{{day.lunar}}
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div data-index="1" class="list">
          <table cellpadding="5" class="table-date">
            <tbody>
            <tr>
              <td @click="select(k2,$event)" v-for="(day, k2) in days"
                  :class="{'selected':day.selected,color:newDay(day,k2)}">
                <div class="td-box">
                  <span class="td-day" :class="{'red':k2==0||k2==6}">{{day.day}}</span>
                  <span class="point" v-show="day.eventName!= undefined">{{day.eventName}}</span>
                  <span class="annotation" v-show="day.annotation!= undefined">
                            <i></i>
                        </span>
                  <div class="text"
                       :class="{'isLunarFestival':day.isLunarFestival,'isGregorianFestival':day.isGregorianFestival}"
                       v-show="lunar">{{day.lunar}}
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div data-index="2" class="list">
          <table cellpadding="5" class="table-date">
            <tbody>
            <tr>
              <td @click="select(k2,$event)" v-for="(day, k2) in days"
                  :class="{'selected':day.selected,color:newDay(day,k2)}">
                <div class="td-box">
                  <span class="td-day" :class="{'red':k2==0||k2==6}">{{day.day}}</span>
                  <span class="point" v-show="day.eventName!= undefined">{{day.eventName}}</span>
                  <span class="annotation" v-show="day.annotation!= undefined">
                            <i></i>
                        </span>
                  <div class="text"
                       :class="{'isLunarFestival':day.isLunarFestival,'isGregorianFestival':day.isGregorianFestival}"
                       v-show="lunar">{{day.lunar}}
                  </div>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import calendar from '../js/calendar.js'

  export default {
    name: 'calendar',
    data() {
      return {
        currentYear: 1970,   // 年份
        currentMonth: 1,  // 月份
        currentDay: 1,    // 日期
        currentWeek: 1,    // 星期
        days: [],
        today: [],
        festival: {
          lunar: {
            "1-1": "春节",
            "1-15": "元宵节",
            "2-2": "龙头节",
            "3-7": "寒食节",
            "3-8": "清明节",
            "5-5": "端午节",
            "7-7": "七夕节",
            "7-15": "中元节",
            "8-15": "中秋节",
            "9-9": "重阳节",
            "10-1": "寒衣节",
            "10-15": "下元节",
            "12-8": "腊八节",
            "12-23": "祭灶节",
            "12-30": "除夕"
          },
          gregorian: {
            "1-1": "元旦",
            "2-14": "情人节",
            "3-8": "妇女节",
            "3-12": "植树节",
            "3-14": "白色情人",
            "4-1": "愚人节",
            "4-16": "复活节",
            "5-1": "劳动节",
            "5-4": "青年节",
            "6-1": "儿童节",
            "6-18": "父亲节",
            "7-1": "建党节",
            "8-1": "建军节",
            "9-10": "教师节",
            "10-1": "国庆节",
            "11-1": "万圣节",
            "12-24": "平安夜",
            "12-25": "圣诞节"
          },
        },
        index: {
          form: '',
        }
      }
    },
    props: {
      // 是否显示农历
      lunar: {
        type: Boolean,
        default: false
      },
      // 自定义星期名称
      weeks: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() == "zh-cn" ? ['日', '一', '二', '三', '四', '五', '六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
      },
      // 自定义事件
      events: {
        type: Object,
        default: function () {
          return {}
        }
      },// 自定义事件
      annotation: {
        type: Object,
        default: function () {
          return {}
        }
      },
      // 默认日期
      value: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 自定义月份
      months: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() == "zh-cn" ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
      },
    },
    watch: {
      value() {
        this.initData();
      },
      events: function () {
        this.initData()
      },
      'index.form': function (form) {
        if (form.indexOf('next') > -1) {
          this.weekNext();
          this.index.form = '';
        } else if (form.indexOf('prev') > -1) {
          this.weekPrev();
          this.index.form = '';
        }
      }
    },
    mounted() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.touchDom();
        })
      })
    },
    created() {
      this.initData()
    },

    methods: {
      getNewDate: function () {
        let date = new Date();
        let month = date.getMonth() + 1;
        let strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
        }
        return (date.getFullYear() + "-" + month + "-" + strDate);
      },
      //日期换算成时间戳
      getTimestamp: function (date) {
        date = new Date(Date.parse(date.replace(/-/g, "/")));
        return date.getTime();
      },
      newDay(l, i) {
        let date = this.getTimestamp(l.year + '-' + l.month + '-' + l.day);
        let newDate = this.getTimestamp(this.getNewDate());
        // console.log(newDate, date);
        if (newDate == date) {
          return true
        } else {
          return false
        }
      },
      touchDom() {
        let that = this;
        let lastPX = 0; // 上一次触摸的位置x坐标, 需要计算出手指每次移动的一点点距离
        let movex = 0; // 记录手指move的x方向值
        let imgWrap = document.getElementById('tableWrap');
        let startX = 0; // 开始触摸时手指所在x坐标
        let endX = 0; // 触摸结束时手指所在的x坐标位置
        let imgSize = imgWrap.children.length - 2; // 图片个数
        let t1 = 0; // 记录开始触摸的时刻
        let t2 = 0; // 记录结束触摸的时刻
        let width = window.innerWidth; // 当前窗口宽度
        let nodeList = document.querySelectorAll('#tableWrap .list'); // 所有轮播图节点数组 NodeList

        // 给图片设置合适的left值, 注意 querySelectorAll返回  NodeList, 具有 forEach方法
        nodeList.forEach(function (node, index) {
          node.style.left = (index - 1) * width + 'px';
        });

        /**
         * 移动图片到当前的 tIndex索引所在位置
         * @param {number} tIndex 要显示的图片的索引
         * */
        function toIndex(tIndex) {
          // console.log('tIndex', tIndex);
          let dis = -(tIndex * width);
          // 动画移动
          imgWrap.style.transform = 'translate3d(' + dis + 'px, 0, 0)';
          imgWrap.style.transition = 'transform .2s ease-out';
          movex = dis;
          // 索引到最后一张图片, 迅速切换索引到同一张图的初始位置
          setTimeout(function () {
            // console.log(tIndex, imgSize);
            if (tIndex === imgSize) {
              imgWrap.style.transform = 'translate3d(0, 0, 0)';
              imgWrap.style.transition = 'none';
              movex = 0;
            }
            if (tIndex === -1) {
              imgWrap.style.transform = 'translate3d(' + width * (1 - imgSize) + 'px, 0, 0)';
              imgWrap.style.transition = 'none';
              movex = -width * (imgSize - 1);
            }
            if (tIndex <= -2 || tIndex >= 3) {
              imgWrap.style.transform = 'translate3d(0, 0, 0)';
              imgWrap.style.transition = 'none';
              movex = 0;
            }
          }, 200);
          // console.log('338', movex, width, imgSize);
        }

        /**
         * 处理各种触摸事件 ,包括 touchstart, touchend, touchmove, touchcancel
         * @param {Event} evt 回调函数中系统传回的 js 事件对象
         * */
        function targetDom($event) {
          let target = $event.target;
          if (target.className.indexOf('list') !== -1) {
            return target;
          }//这种情况下，点击的就是box元素，比如box里面有个padding的值，返回的就是自己。
          if (target == Object) {
            return false;
          }
          //这种情况下，点到的是box与box之间的空隙，比如box有个margin-bottom:20px，返回false
          while (target.className.indexOf('list') === -1) {
            target = target.parentNode;
          }
          return target;
          //返回的target即是你要的box元素
        }

        function touch(evt) {
          var touch = evt.targetTouches[0];
          var tar = targetDom(evt);
          // console.log(tar);
          var index = parseInt(tar.getAttribute('data-index'));
          // console.log('123', index);
          if (evt.type === 'touchmove') {
            var di = parseInt(touch.pageX - lastPX);
            endX = touch.pageX;
            movex += di;
            imgWrap.style.webkitTransform = 'translate3d(' + movex + 'px, 0, 0)';
            imgWrap.style.transition = 'none'; // 移动时避免动画延迟
            lastPX = touch.pageX;
          }
          if (evt.type === 'touchend') {
            var minus = endX - startX;
            t2 = new Date().getTime() - t1;
            if (Math.abs(minus) > 0) { // 有拖动操作
              if (Math.abs(minus) < width * 0.4 && t2 > 500) { // 拖动距离不够,返回!
                toIndex(index);
              } else { // 超过一半,看方向
                //console.log(minus);
                if (Math.abs(minus) < 20) {
                  // console.log('距离很短' + minus);
                  toIndex(index);
                  return;
                }
                if (minus < 0) { // endX < startX,向左滑动,是下一张
                  toIndex(index + 1);
                  that.index.form = 'next' + Math.random();
                } else { // endX > startX ,向右滑动, 是上一张
                  toIndex(index - 1);
                  that.index.form = 'prev' + Math.random();
                }
              }
            } else { //没有拖动操作

            }
          }
          if (evt.type === 'touchstart') {
            lastPX = touch.pageX;
            startX = lastPX;
            endX = startX;
            t1 = new Date().getTime();
          }
          //console.log('index', index);
          return false;
        }

        imgWrap.addEventListener('touchstart', touch, false);
        imgWrap.addEventListener('touchmove', touch, false);
        imgWrap.addEventListener('touchend', touch, false);
        imgWrap.addEventListener('touchcancel', touch, false);

      },
      //
      moveStart(e) {
        // console.log('moveStart left', e);
        this.weekNext(e);
        // e.startRotate();
        e.preventDefault();
      },
      //
      moveEnd(e) {
        // console.log('moveEnd right', e);
        this.weekPrev(e);
        // e.startRotate();
        e.preventDefault();
      },
      //
      formatDate(year, month, day) {
        const y = year
        let m = month
        if (m < 10) m = `0${m}`
        let d = day
        if (d < 10) d = `0${d}`
        return `${y}/${m}/${d}`
      },

      initData() {
        let date = '';
        if (this.value.length != 0) {
          // console.log(1, this.value);
          date = new Date(this.value.join('/'));
        } else {
          // console.log(2);
          date = new Date();
          // console.log(date);
        }
        this.currentDay = date.getDate()          // 今日日期 几号
        this.currentYear = date.getFullYear()       // 当前年份
        this.currentMonth = date.getMonth() + 1    // 当前月份
        this.currentWeek = date.getDay() // 1...6,0   // 星期几
        // 如果用 周一 ~ 周日 this.currentWeek == 0 就转成7
        const str = this.formatDate(this.currentYear, this.currentMonth, this.currentDay)// 今日日期 年-月-日
        this.days.length = 0
        // 今天是周日，放在第一行第7个位置，前面6个 这里默认显示一周，如果需要显示一个月，则第二个循环为 i<= 35- this.currentWeek
        /* eslint-disabled */
        for (let i = this.currentWeek; i >= 0; i -= 1) {
          const d = new Date(str)
          d.setDate(d.getDate() - i)
          // console.log(d.getDate())
          this.days.push(Object.assign({
              date: d,
              timestamp: d.getTime(),
              year: d.getFullYear(),
              month: d.getMonth() + 1,
              day: d.getDate(),
              selected: false,
            },
            this.getLunarInfo(d.getFullYear(), d.getMonth() + 1, d.getDate()),
            this.getEvents(d.getFullYear(), d.getMonth() + 1, d.getDate()),
            this.getAnnotation(d.getFullYear(), d.getMonth() + 1, d.getDate()),
          ));
        }
        for (let i = 1; i <= 6 - this.currentWeek; i += 1) {
          const d = new Date(str)
          d.setDate(d.getDate() + i)
          this.days.push(Object.assign({
              date: d,
              timestamp: d.getTime(),
              year: d.getFullYear(),
              month: d.getMonth() + 1,
              day: d.getDate(),
              selected: false,
            },
            this.getLunarInfo(d.getFullYear(), d.getMonth() + 1, d.getDate()),
            this.getEvents(d.getFullYear(), d.getMonth() + 1, d.getDate()),
            this.getAnnotation(d.getFullYear(), d.getMonth() + 1, d.getDate()),
          ));
          // console.log(d.getDate())
        }
        if (this.value.length != 0) {
          let timestamp = new Date(this.value.join('/')).getTime();
          // console.log('timestamp', timestamp);
          this.days.forEach(v => {
            //  console.log(timestamp, v.timestamp);
            if (v.timestamp == timestamp) {
              v.selected = true
            }
          })
        }
        //console.log('123', this.days);
      },
      // 获取自定义事件
      getEvents(y, m, d) {
        if (Object.keys(this.events).length == 0) return false;
        let eventName = this.events[y + "-" + m + "-" + d]
        let data = {}
        if (eventName != undefined) {
          data.eventName = eventName
        }
        return data
      },
      //
      getAnnotation(y, m, d) {
        if (Object.keys(this.annotation).length == 0) return false;
        let annotationName = this.annotation[y + "-" + m + "-" + d]
        let data = {}
        if (annotationName != undefined) {
          data.annotation = annotationName
        }
        return data
      },
      // 获取农历信息
      getLunarInfo(y, m, d) {
        let lunarInfo = calendar.solar2lunar(y, m, d)
        let lunarValue = lunarInfo.IDayCn
        // console.log('lunarInfo', lunarInfo)
        let isLunarFestival = false
        let isGregorianFestival = false
        if (this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay] != undefined) {
          lunarValue = this.festival.lunar[lunarInfo.lMonth + "-" + lunarInfo.lDay]
          isLunarFestival = true
        } else if (this.festival.gregorian[m + "-" + d] != undefined) {
          lunarValue = this.festival.gregorian[m + "-" + d]
          isGregorianFestival = true
        }
        return {
          lunar: lunarValue,
          lunarInfo: lunarInfo,
          isLunarFestival: isLunarFestival,
          isGregorianFestival: isGregorianFestival,
        }
      },
      select(k2, e) {
        if (e != undefined) e.stopPropagation();
        /**/
        this.days.forEach(v => {
          v.selected = false
        });
        // 设置当前选中天
        this.days[k2].selected = true;
        this.$emit('select', this.days[k2])
        //  console.log(this.days[k2]);
      },
      //  上个星期
      weekPrev(e) {
        if (e) {
          e.stopPropagation()
        }
        const timestamp = this.days[0].timestamp // 如果当期日期是7号或者小于7号
        console.log('this.days123456', this.days);
        let daytime = 24 * 60 * 60 * 1000 * 7;
        let d = new Date(timestamp - daytime);
        this.$emit('weekAround', [d.getFullYear(), d.getMonth() + 1, d.getDate()])
      },

      //  下个星期
      weekNext(e) {
        if (e) {
          e.stopPropagation()
        }
        const timestamp = this.days[0].timestamp // 如果当期日期是7号或者小于7号
        console.log('this.days', this.days);
        let daytime = 24 * 60 * 60 * 1000 * 7;
        let d = new Date((timestamp + daytime));
        this.$emit('weekAround', [d.getFullYear(), d.getMonth() + 1, d.getDate()])
      },
      // 当前选择日期
      pick(date) {
        alert(this.formatDate(date.getFullYear(), date.getMonth() + 1, date.getDate()))
      }
    }
  }
</script>
<style lang="scss" scoped>
  .calendar {
    margin: auto;
    width: 100%;
    min-width: 300px;
    padding: 0 5px;
    background: #fff;
    font-family: "PingFang SC", "Hiragino Sans GB", "STHeiti", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    user-select: none;
  }
  .calendar * {
    -webkit-transition: background-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
    transition: background-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1) k;
  }
  .calendar .calendar-banner {
    overflow: hidden;
    width: 100%;
    height: 40px;
  }
  .calendar #tableWrap {
    position: relative;
    height: 100%;
    width: 100%;
  }
  .calendar #tableWrap .list {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  .calendar table {
    clear: both;
    width: 100%;
    border-collapse: collapse;
    color: #444444;
  }
  .calendar .table-theader {
    position: relative;
    margin-bottom: 5px;
  }
  .calendar .table-theader:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    /*border-bottom: 1px solid #D9D9D9;*/
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .calendar .table-date {
    margin-bottom: 0;
  }
  .calendar td {
    margin: 2px !important;
    padding: 0px 0;
    width: 14.28571429%;
    height: 40px;
    text-align: center;
    vertical-align: middle;
    font-size: 14px;
    line-height: 125%;
    cursor: pointer;
    position: relative;
    vertical-align: top;
  }
  .calendar td.week {
    font-size: 10px;
    pointer-events: none !important;
    cursor: default !important;
  }
  .calendar td.disabled {
    /*color: #ccc;*/
    /*pointer-events:none !important;*/
    /*cursor: default !important;*/

  }
  .calendar td.disabled div {
    color: #ccc;
  }
  .calendar td span {
    display: block;
    max-width: 26px;
    height: 26px;
    font-size: 16px;
    line-height: 26px;
    margin: 0px auto;
    border-radius: 20px;
  }
  .calendar td:not(.selected) span:not(.red):hover {
    /*background: #f3f8fa;*/
    /*color: #444;*/
  }
  .calendar td:not(.selected) span.red:hover {
    /*background:#f9efef;*/
  }
  .calendar td:not(.disabled) span.red {
    color: #ea6151;
  }
  .calendar td.selected span {
    /*background-color: #849fee;*/
    color: #fff;
  }
  .calendar td.color.selected .td-day {
    background-color: #849fee;
  }
  .calendar td.selected .td-day {
    background-color: #849fee;
  }
  .calendar td.color .td-day {
    background-color: #c0cae5;
    color: white;
  }
  .calendar td .td-day {
  }
  .calendar td .text {
    position: absolute;
    top: 28px;
    left: 0;
    right: 0;
    text-align: center;
    padding: 2px;
    font-size: 8px;
    line-height: 1.2;
    color: #444;
  }
  .calendar td .isGregorianFestival,
  .calendar td .isLunarFestival {
    color: #ea6151;
  }
  .calendar td.selected span.red {
    background-color: #ea6151;
    color: #fff;
  }
  .calendar td.selected span.red:hover {
    background-color: #ea6151;
    color: #fff;
  }
  .calendar thead td {
    text-transform: uppercase;
    height: 30px;
    vertical-align: middle;
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
    -webkit-overflow-scrolling: touch;
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
<style>
  .calendar td .td-box .point {
    position: absolute;
    top: 2px;
    right: 2px;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    width: 10px;
    height: 10px;
    font-size: 8px;
    line-height: 8px;
    text-align: center;
    color: #FFFFFF;
    background-color: #ea6151;
    padding: 0;
    margin: 0 auto;
  }
  .calendar td .td-box .annotation {
    height: 0;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    font-size: 0;
    align-items: center;
  }
  .calendar td .td-box .annotation i {
    width: 5px;
    height: 5px;
    font-size: 0;
    line-height: 1;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 50%;
    text-align: center;
    color: #FFFFFF;
    background-color: #d2d2d2;
  }
</style>
