<template>
  <div class="calendar">
    <table cellpadding="5" class="table-theader">
      <thead>
      <tr>
        <td v-for="week in weeks" class="week">{{week}}</td>
      </tr>
      </thead>
    </table>
    <div class="calendar-banner">
      <div id="tableWrap">
        <div data-index="-1" class="list">
          <table class=" table-date" cellpadding="5">
            <tbody>
            <tr v-for="(day,k1) in days" :style="{'animation-delay':(k1 * 30)+'ms'}"> <!---->
              <td v-for="(child,k2) in day" :class="{'selected':child.selected,'disabled':child.disabled,
                'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar),color:newDay(child,k2)}"
                  @click="select(k1,k2,$event)">
                <div class="td-box">
                       <span class="td-day"
                             :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}">
                        {{child.day}}
                    </span>
                  <span class="point" v-show="child.eventName!= undefined">{{child.eventName}}</span>
                  <!--<span class="point hk" v-show="k2%2 == 0">港</span>-->
                  <!--<span class="point hktong" v-show="k2%3 == 0">通</span>-->
                  <span class="annotation" v-if="child.annotation!= undefined">
                            <i></i>
                        </span>
                  <!--<div class="text clue" v-if="child.eventName!= undefined">{{child.eventName}}</div>-->
                  <!--<div class="text"-->
                  <!--:class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival}"-->
                  <!--v-show="lunar">{{child.lunar}}-->
                  <!--</div>-->
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div data-index="0" class="list">
          <table class=" table-date" cellpadding="5">
            <tbody>
            <tr v-for="(day,k1) in days" :style="{'animation-delay':(k1 * 30)+'ms'}"> <!---->
              <td v-for="(child,k2) in day" :class="{'selected':child.selected,'disabled':child.disabled,
                'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar),color:newDay(child,k2)}"
                  @click="select(k1,k2,$event)">
                <div class="td-box">
                       <span class="td-day"
                             :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}">
                        {{child.day}}
                    </span>
                  <span class="point" v-show="child.eventName!= undefined">{{child.eventName}}</span>
                  <!--<span class="point hk" v-show="k2%2 == 0">港</span>-->
                  <!--<span class="point hktong" v-show="k2%3 == 0">通</span>-->
                  <span class="annotation" v-show="child.annotation!= undefined">
                            <i></i>
                  </span>
                  <!--<div class="text clue" v-if="child.eventName!= undefined">{{child.eventName}}</div>-->
                  <!--<div class="text"-->
                  <!--:class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival}"-->
                  <!--v-if="lunar">{{child.lunar}}-->
                  <!--</div>-->
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div data-index="1" class="list">
          <table class=" table-date" cellpadding="5">
            <tbody>
            <tr v-for="(day,k1) in days" :style="{'animation-delay':(k1 * 30)+'ms'}"> <!---->
              <td v-for="(child,k2) in day" :class="{'selected':child.selected,'disabled':child.disabled,
                'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar),color:newDay(child,k2)}"
                  @click="select(k1,k2,$event)">
                <div class="td-box">
                  <span class="td-day"
                        :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}">
                      {{child.day}}
                  </span>
                  <span class="point" v-show="child.eventName!= undefined">{{child.eventName}}</span>
                  <!--<span class="point hk" v-show="k2%2 == 0">港</span>-->
                  <!--<span class="point hktong" v-show="k2%3 == 0">通</span>-->
                  <span class="annotation" v-show="child.annotation!= undefined">
                    <i></i>
                  </span>
                  <!--<div class="text"-->
                  <!--:class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival}"-->
                  <!--v-if="lunar">{{child.lunar}}-->
                  <!--</div>-->
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
        <div data-index="2" class="list">
          <table class="table-date" cellpadding="5">
            <tbody>
            <tr v-for="(day,k1) in days" :style="{'animation-delay':(k1 * 30)+'ms'}"> <!---->
              <td v-for="(child,k2) in day" :class="{'selected':child.selected,'disabled':child.disabled,
                'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar),color:newDay(child,k2)}"
                  @click="select(k1,k2,$event)">
                <div class="td-box">
                       <span class="td-day"
                             :class="{'red':k2==0||k2==6||((child.isLunarFestival||child.isGregorianFestival) && lunar)}">
                        {{child.day}}
                    </span>
                  <span class="point" v-show="child.eventName!= undefined">{{child.eventName}}</span>
                  <!--<span class="point hk" v-show="k2%2 == 0">港</span>-->
                  <!--<span class="point hktong" v-show="k2%3 == 0">通</span>-->
                  <span class="annotation" v-show="child.annotation!= undefined"><i></i></span>
                  <!--<div class="text clue" v-if="child.eventName!= undefined">{{child.eventName}}</div>-->
                  <!--<div class="text"-->
                  <!--:class="{'isLunarFestival':child.isLunarFestival,'isGregorianFestival':child.isGregorianFestival}"-->
                  <!--v-show="lunar">{{child.lunar}}-->
                  <!--</div>-->
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!---->
    <div class="calendar-years" :class="{'show':yearsShow}">
      <span v-for="y in years" @click.stop="selectYear(y)" :class="{'active':y==year}">{{y}}</span>
    </div>
  </div>
</template>

<script>
  import calendar from '../js/calendar.js'

  export default {
    props: {
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
          return window.navigator.language.toLowerCase() == "zh-cn" ? ['日', '一', '二', '三', '四', '五', '六'] : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        }
      },
      // 自定义月份
      months: {
        type: Array,
        default: function () {
          return window.navigator.language.toLowerCase() == "zh-cn" ? ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] : ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        }
      },
      // 自定义事件
      events: {
        type: Object,
        default: function () {
          return {}
        }
      },
      //
      annotation: {
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data() {
      return {
        index: {
          form: '',
        },
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
        rangeBegin: [],
        rangeEnd: [],
      }
    },
    watch: {
      'month': function (val) {
        // if (this.zero) {
        //     this.month = this.zeroPad(this.month);
        // }
      },
      events() {
        this.render(this.year, this.month);
      },
      'value': function () {
        this.init();
      },
      'index.form': function (form) {
        if (form.indexOf('next') > -1) {
          this.next();
          this.index.form = '';
        } else if (form.indexOf('prev') > -1) {
          this.prev();
          this.index.form = '';
        }
      }
    },
    created() {
      this.init()
    },
    mounted() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.touchDom();
        })
      })
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
        let currentdate = date.getFullYear() + "-" + month + "-" + strDate;
        return currentdate;
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
        let movex = 0;  // 记录手指move的x方向值
        let imgWrap = document.getElementById('tableWrap');
        let startX = 0; // 开始触摸时手指所在x坐标
        let endX = 0;  // 触摸结束时手指所在的x坐标位置
        let imgSize = imgWrap.children.length - 2;  // 图片个数
        let t1 = 0;  // 记录开始触摸的时刻
        let t2 = 0;  // 记录结束触摸的时刻
        let width = window.innerWidth;  // 当前窗口宽度
        let nodeList = document.querySelectorAll('#tableWrap .list');   // 所有轮播图节点数组 NodeList

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
      moveStart(e) {
        // console.log('moveStart left', e);
        this.next(e);
        // e.startRotate();
        e.preventDefault();
      },
      moveEnd(e) {
        // console.log('moveEnd right', e);
        this.prev(e);
        // e.startRotate();
        e.preventDefault();
      },
      init() {
        let now = new Date();
        this.year = now.getFullYear()
        this.month = now.getMonth()
        this.day = now.getDate();
        // console.log('dateVal', this.day);
        if (this.value.length > 0) {
          if (this.range) { //范围
            this.year = parseInt(this.value[0][0])
            this.month = parseInt(this.value[0][1]) - 1
            this.day = parseInt(this.value[0][2])

            let year2 = parseInt(this.value[1][0])
            let month2 = parseInt(this.value[1][1]) - 1
            let day2 = parseInt(this.value[1][2])

            this.rangeBegin = [this.year, this.month, this.day]
            this.rangeEnd = [year2, month2, day2]
          } else if (this.multi) {//多选
            this.multiDays = this.value;
            this.year = parseInt(this.value[0][0])
            this.month = parseInt(this.value[0][1]) - 1
            this.day = parseInt(this.value[0][2])
          } else { //单选
            this.year = parseInt(this.value[0])
            this.month = parseInt(this.value[1]) - 1
            this.day = parseInt(this.value[2])
          }
        }
        this.render(this.year, this.month)
      },
      // 渲染日期
      render(y, m) {
        let firstDayOfMonth = new Date(y, m, 1).getDay()         //当月第一天
        let lastDateOfMonth = new Date(y, m + 1, 0).getDate()    //当月最后一天
        let lastDayOfLastMonth = new Date(y, m, 0).getDate()     //最后一月的最后一天
        this.year = y
        let seletSplit = this.value;
        // console.log('seletSplit-value', seletSplit);
        let i, line = 0, temp = [], nextMonthPushDays = 1
        for (i = 1; i <= lastDateOfMonth; i++) {
          let day = new Date(y, m, i).getDay() //返回星期几（0～6）
          let k
          // 第一行
          if (day == 0) {
            temp[line] = []
          } else if (i == 1) {
            temp[line] = []
            k = lastDayOfLastMonth - firstDayOfMonth + 1
            for (let j = 0; j < firstDayOfMonth; j++) {
              // console.log("第一行",lunarYear,lunarMonth,lunarValue,lunarInfo)
              temp[line].push(Object.assign({
                  year: this.computedPrevYear(),
                  month: this.computedPrevMonth(true),
                  day: k,
                  disabled: true
                },
                this.getLunarInfo(this.computedPrevYear(), this.computedPrevMonth(true), k),
                this.getEvents(this.computedPrevYear(), this.computedPrevMonth(true), k),
                this.getAnnotation(this.computedPrevYear(), this.computedPrevMonth(true), k),
              ))
              k++;
            }
          }
          if (this.range) { // 范围
            // console.log("日期范围", this.range, this.getLunarInfo(this.year, this.month + 1, i))
            let options = Object.assign({
                year: this.year,
                month: this.month + 1,
                day: i
              },
              this.getLunarInfo(this.year, this.month + 1, i),
              this.getEvents(this.year, this.month + 1, i),
              this.getAnnotation(this.year, this.month + 1, i),
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
          } else if (this.multi) {//多选
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
                this.getEvents(this.year, this.month + 1, i),
                this.getAnnotation(this.year, this.month + 1, i)
              )
            } else {
              options = Object.assign({
                  year: this.year,
                  month: this.month + 1, day: i, selected: false
                },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i),
                this.getAnnotation(this.year, this.month + 1, i))
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
            temp[line].push(options);
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
                this.getEvents(this.year, this.month + 1, i),
                this.getAnnotation(this.year, this.month + 1, i),
              ))
              this.today = [line, temp[line].length - 1]
            }
            // 没有默认值的时候显示选中今天日期
            else if (chkY == this.year && chkM == this.month && i == this.day && this.value == "") {
              // console.log("今天",lunarYear,lunarMonth,lunarValue,lunarInfo)
              temp[line].push(Object.assign({
                  year: this.year,
                  month: this.month + 1,
                  day: i,
                  selected: true
                },
                this.getLunarInfo(this.year, this.month + 1, i),
                this.getEvents(this.year, this.month + 1, i),
                this.getAnnotation(this.year, this.month + 1, i),
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
                this.getEvents(this.year, this.month + 1, i),
                this.getAnnotation(this.year, this.month + 1, i),
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
              temp[line].push(options);
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
              temp[line].push(Object.assign({
                  year: this.computedNextYear(),
                  month: this.computedNextMonth(true),
                  day: k,
                  disabled: true
                },
                this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), k),
                this.getEvents(this.computedNextYear(), this.computedNextMonth(true), k),
                this.getAnnotation(this.year, this.month + 1, i),
              ))
              k++
            }
            // 下个月除了补充的前几天开始的日期
            nextMonthPushDays = k
            // console.log('nextMonthPushDays', nextMonthPushDays);
          }
          // console.log('temp1', temp);
        } //end for
        // console.log('temp2', temp);
        // console.log(this.year + "/" + this.month + "/" + this.day + ":" + line)
        // 补充第六行让视觉稳定
        if (line <= 5 && nextMonthPushDays > 0) {
          // console.log({nextMonthPushDays:nextMonthPushDays,line:line})
          for (let i = line + 1; i <= 5; i++) {
            temp[i] = []
            let start = nextMonthPushDays + (i - line - 1) * 7;
            // console.log('start', start);
            for (let d = start; d <= start + 6; d++) {
              temp[i].push(Object.assign({
                  year: this.computedNextYear(),
                  month: this.computedNextMonth(true),
                  day: d, disabled: true
                },
                this.getLunarInfo(this.computedNextYear(), this.computedNextMonth(true), d),
                this.getEvents(this.computedNextYear(), this.computedNextMonth(true), d),
                this.getAnnotation(this.year, this.month + 1, i),
              ))
            }
            // console.log('temp[i]', temp[i]);
          }
        }
        this.days = temp;
        // console.log('this.days', this.days);
      },
      computedPrevYear() {
        let value = this.year
        if (this.month - 1 < 0) {
          value--
        }
        return value
      },
      computedPrevMonth(isString) {
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
      computedNextYear() {
        let value = this.year
        if (this.month + 1 > 11) {
          value++
        }
        return value
      },
      computedNextMonth(isString) {
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
      getTEvents(y, m, d) {
        if (Object.keys(this.events).length == 0) return false;
        let eventTName = this.events[y + "-" + m + "-" + d]
        let data = {}
        if (eventTName != undefined) {
          data.eventTName = eventTName
        }
        return data
      },
      getHKEvents(y, m, d) {
        if (Object.keys(this.events).length == 0) return false;
        let eventHKName = this.events[y + "-" + m + "-" + d]
        let data = {}
        if (eventHKName != undefined) {
          data.eventHKName = eventHKName
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
      // 上月
      prev(e) {
        if (e) {
          e.stopPropagation()
        }
        if (this.month == 0) {
          this.month = 11
          this.year = parseInt(this.year) - 1
        } else {
          this.month = parseInt(this.month) - 1
        }
        if (this.zero) {
          this.day = this.zeroPad(this.day);
        }
        this.$nextTick(() => {
          this.render(this.year, this.month);
        })
        if (this.zero) {
          this.day = this.zeroPad(this.day);
        }
        this.$emit('selectMonth', this.year, this.zeroPad(this.month + 1))
        this.$emit('prev', this.zeroPad(this.month + 1), this.year)
      },
      //  下月
      next(e) {
        if (e) {
          e.stopPropagation()
        }
        if (this.month == 11) {
          this.month = 0
          this.year = parseInt(this.year) + 1
        } else {
          this.month = parseInt(this.month) + 1
        }
        this.render(this.year, this.month)
        console.log(this.day);
        this.$emit('selectMonth', this.year, this.zeroPad(this.month + 1))
        this.$emit('next', this.zeroPad(this.month + 1), this.year)
      },
      // 选中日期
      select(k1, k2, e) {
        //this.render(this.days[k1][k2].year, this.days[k1][k2].month)
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
            this.multiDays.push([this.year, this.zeroPad(this.month + 1), this.zeroPad(this.days[k1][k2].day)]);
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
          this.days[k1][k2].selected = true;
          this.days[k1][k2].day = this.zeroPad(this.days[k1][k2].day);
          this.days[k1][k2].month = this.zeroPad(this.days[k1][k2].month);
          this.day = this.zeroPad(this.days[k1][k2].day);
          this.today = [k1, k2];
          console.log('1111111', this.days[k1][k2]);
          this.$emit('select', this.days[k1][k2]);
        }
        //console.log('select', k1, k2);
      },
      changeYear() {
        // this.$refs.inputdom.focus();
        if (this.yearsShow) {
          this.yearsShow = false
          return false
        }
        this.yearsShow = true
        this.years = [];
        for (let i = ~~this.year - 10; i < ~~this.year + 15; i++) {
          this.years.push(i)
        }
        //console.log(this.years);
      },
      selectYear(value) {
        this.yearsShow = false
        this.year = value
        this.render(this.year, this.month)
        this.$emit('selectYear', value)
      },
      // 返回今天
      setToday() {
        let now = new Date();
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
      zeroPad(n) {
        return String(n < 10 ? '0' + n : n)
      },
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
  .calendar, .calendar * {
    box-sizing: border-box;
  }
  .calendar .calendar-banner {
    overflow: hidden;
    width: 100%;
    height: 240px;
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
  .calendar * {
    /*-webkit-transition: background-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);*/
    /*transition: background-color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1), color 0.1s cubic-bezier(0.645, 0.045, 0.355, 1) k;*/
  }
  .calendar-tools {
    height: 40px;
    font-size: 20px;
    line-height: 40px;
    color: #5e7a88;
  }
  .calendar-tools span {
    cursor: pointer;
  }
  .calendar-prev {
    width: 14.28571429%;
    float: left;
    text-align: center;
  }
  .calendar-info {
    padding-top: 3px;
    font-size: 16px;
    line-height: 1.3;
    text-align: center;
  }
  .calendar-info > div.month {
    margin: auto;
    height: 20px;
    width: 100px;
    text-align: center;
    color: #5e7a88;
    overflow: hidden;
    position: relative;
  }
  .calendar-info > div.month .month-inner {
    position: absolute;
    left: 0;
    top: 0;
    height: 240px;
    transition: top .5s cubic-bezier(0.075, 0.82, 0.165, 1);
  }
  .calendar-info > div.month .month-inner > span {
    display: block;
    font-size: 14px;
    height: 20px;
    width: 100px;
    overflow: hidden;
    text-align: center;
  }
  .calendar-info > div.year {
    font-size: 10px;
    line-height: 1;
    color: #999;
  }
  .calendar-next {
    width: 14.28571429%;
    float: right;
    text-align: center;
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
  .calendar .table-date {
    margin-bottom: 0;
  }
  .calendar .table-theader:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    /*border-bottom: 1px solid #D9D9D9;*/
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
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
    background-color: #fa4319;
    padding: 0;
    margin: 0 auto;
  }
  .calendar td .td-box .point.hk {
    position: absolute;
    top: 12px;
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
    background-color: #fa4319;
    padding: 0;
    margin: 0 auto;
  }
  .calendar td .td-box .point.hktong {
    position: absolute;
    top: 20px;
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
    background-color: #fa4319;
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
