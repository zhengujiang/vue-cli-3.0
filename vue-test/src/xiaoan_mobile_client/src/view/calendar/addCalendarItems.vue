<template>
  <div class="add-calendar-items" ref="contDom">
    <div class="nav" ref="navDom">
      <div v-if="addressObj.parent == '自定义'"> <!--日常事件-->
        <tab :prevent-default="true" :line-width="2" custom-bar-width="50px" v-model="active">
          <tab-item v-for="(list,index) in navbar" :key="index" @on-item-click="tabClick" :selected="list.active">
            {{list.name}}
          </tab-item>
        </tab>
      </div>
      <div v-else>
        <tab :prevent-default="true" :line-width="2" custom-bar-width="50px" v-model="active">
          <tab-item v-for="(list,index) in navbar1" :key="index" @on-item-click="tabClick" :selected="list.active">
            {{list.name}}
          </tab-item>
        </tab>
      </div>
    </div>
    <div class="tab-container" :style="{height:tabHeight+'px'}">
      <swiper :min-moving-distance="500" :show-dots="false" :height="'100%'" v-model="active">
        <swiper-item class="box">
          <div class="back-item" :style="{height:bodyHeight+'px'}">
            <div class="back-item-box">
              <div>
                <ul class="back-item-ul">
                  <li class="title">事件模板<span>*</span></li>
                  <li @click="visible = true" class="right-value">
                    <div>
                      <span>{{addressObj.parent +'-'+ addressObj.name}}</span>
                      <span class="v-png"><img :src="$image.personal.toTDSelect" alt=""></span>
                    </div>
                  </li>
                </ul>
                <p class="warn opacityColor"></p>
              </div>
              <div>
                <ul class="back-item-ul">
                  <li class="title">事件名称<span>*</span></li>
                  <li class="right-value">
                    <input @focus="eventFocus('eventName')" v-model.trim="submission.eventName" class="text"
                           type="text" :placeholder="this.eventPlaceholder.eventName"/>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.eventName}">
                  {{warnListDataText.eventNameText}}</p>
              </div>
              <!---->
              <div v-show="addressObj.valueList.indexOf('SE') > -1">
                <!--todo 事件日期-->
                <ul class="back-item-ul">
                  <li class="title">{{addressObj.valueListMap['SE']}}<span>*</span></li>
                  <li class="right-value">
                    <div class="date-all">
                      <label class="labelO" plain @click="showPrevPlugin">{{incidentText.prevDate}}</label>
                      <i>-</i>
                      <label class="labelT" plain @click="showNextPlugin">{{incidentText.nextDate}}</label>
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.nextprevDate}">
                  {{warnListDataText.nextprevDateText}}</p>
              </div>
              <!---->
              <div v-show="addressObj.valueList.indexOf('T') > -1">
                <!--todo 会议日期-->
                <ul class="back-item-ul">
                  <li class="title">{{addressObj.valueListMap['T']}}<span>*</span></li>
                  <li class="right-value">
                    <div class="date-all addressObj" @click="eventTDatePlugin">
                      <label class="labelO">{{incidentText.eventTDate}}</label>
                      <img :src="$image.personal.toTDSelect" alt=""/>
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.eventTDate}">
                  {{warnListDataText.eventTDateText}}</p>
              </div>
              <div v-show="addressObj.valueList.indexOf('B') > -1">
                <!--todo 定期报告-->
                <ul class="back-item-ul">
                  <li class="title">{{addressObj.valueListMap['B']}}<span>*</span></li>
                  <li class="right-value">
                    <div class="select">
                      <select @change="selectReportType" name="数据" v-model="incidentText.reportType">
                        <option v-for="(list, index) in reportTypeData" :value="list.id">{{list.name}}</option>
                      </select>
                      <img :src="$image.personal.toTDSelect" alt=""/>
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.reportTypeData}">请选择定期报告</p>
              </div>
              <div v-show="addressObj.valueList.indexOf('Y') > -1">
                <!--todo 业绩报告-->
                <ul class="back-item-ul">
                  <li class="title">{{addressObj.valueListMap['Y']}}<span>*</span></li>
                  <li class="right-value">
                    <div class="select">
                      <select @change="selectPerformanceReport" name="数据" v-model="incidentText.performanceReport">
                        <option v-for="(list, index) in performanceReportData" :value="list.id">{{list.name}}</option>
                      </select>
                      <img :src="$image.personal.toTDSelect" alt="">
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.performanceReportData}">
                  {{warnListDataText.performanceReportText}}</p>
              </div>
              <div v-show="addressObj.valueList.indexOf('P') > -1">
                <!--todo 披露日期-->
                <ul class="back-item-ul">
                  <li class="title">{{addressObj.valueListMap['P']}}<span>*</span></li>
                  <li class="right-value">
                    <div class="date-all addressObj" @click="eventTDatePlugin">
                      <label class="labelO">{{incidentText.eventTDate}}</label>
                      <img :src="$image.personal.toTDSelect" alt=""/>
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.eventTDate}">
                  {{warnListDataText.eventPDateText}}</p>
              </div>
              <!---->
              <div v-show="addressObj.valueList.indexOf('T,R,S') > -1">
                <!--todo 股东大会召开日-->
                <ul class="back-item-ul">
                  <li class="title">{{addressObj.valueListMap['S']}}<span>*</span></li>
                  <li class="right-value">
                    <div class="date-all addressObj" @click="eventSDatePlugin">
                      <label class="labelO">{{incidentText.eventSDate}}</label>
                      <img :src="$image.personal.toTDSelect" alt=""/>
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.eventSDate}">
                  {{warnListDataText.eventSDateText}}</p>
              </div>
              <div v-show="addressObj.valueList.indexOf('R') > -1">
                <!--todo 股权登记日 <回购股份届满日>-->
                <ul class="back-item-ul">
                  <li class="title">{{addressObj.valueListMap['R']}}<span>*</span></li>
                  <li class="right-value">
                    <div class="date-all addressObj" @click="eventRDatePlugin">
                      <label class="labelO">{{incidentText.eventRDate}}</label>
                      <img :src="$image.personal.toTDSelect" alt=""/>
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.eventRDate}">
                  {{warnListDataText.eventRDateText}}</p>
              </div>
              <div v-show="addressObj.valueList.indexOf('C') > -1">
                <!--todo 分红转送-->
                <ul class="back-item-ul">
                  <li class="title">{{addressObj.valueListMap['C']}}<span>*</span></li>
                  <li class="right-value">
                    <div class="select">
                      <select @change="selectChoseBonus" name="数据" v-model="incidentText.choseBonus">
                        <option v-for="(list,index) in choseBonusData" :value="list.type">{{list.name}}</option>
                      </select>
                      <img :src="$image.personal.toTDSelect" alt="">
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor: !warnListData.choseBonusData}">请选择分红转送</p>
              </div>
              <!---->
              <div>
                <!--todo 选择日历-->
                <ul class="back-item-ul">
                  <li class="title">选择日历<span>*</span></li>
                  <li class="right-value">
                    <div class="select">
                      <select @focus="eventFocus('calendar')" @change="selectCalendar" name="数据" id="selectId"
                              v-model="calendaritem.calendarName">
                        <option v-for="(list,index) in calendarData" :value="index">{{list.calendarName}}</option>
                      </select>
                      <img :src="$image.personal.toTDSelect" alt="">
                    </div>
                  </li>
                </ul>
                <p class="warn" :class="{opacityColor:!warnListData.calendar}">{{warnListDataText.calendarText}}</p>
              </div>
            </div>
            <div class="back-foo"></div>
            <!---->
            <div class="back-item-box bottom">
              <div>
                <ul class="back-item-ul">
                  <li class="title">地&ensp;&ensp;&ensp;&ensp;点</li>
                  <li class="right-value">
                    <input v-model.trim="submission.eventLocation" class="text" type="text" placeholder="输入事件地址"/>
                  </li>
                </ul>
                <p class="warn opacityColor"></p>
              </div>
              <div>
                <ul class="back-item-ul">
                  <li class="title">提&ensp;&ensp;&ensp;&ensp;醒</li>
                  <li class="right-value">
                    <div class="all-select">
                      <div class="all-select-list select-left">
                        <select name="" v-model="calendaritem.eventConfirmType" @change="ConfirmType">
                          <option v-for="(list,index) in eventConfirmType" :value="index">{{list.name}}</option>
                        </select>
                        <img :src="$image.personal.toTDSelect" alt="">
                      </div>
                      <div class="all-select-list select-right">
                        <select v-model="calendaritem.eventConfirmDayType" name="" @change="ConfirmDayType">
                          <option v-for="(list,index) in eventConfirmDayType" :value="list.id">{{list.name}}</option>
                        </select>
                        <img :src="$image.personal.toTDSelect" alt="">
                      </div>
                    </div>
                  </li>
                </ul>
                <p class="warn opacityColor"></p>
              </div>
              <div>
                <ul class="back-item-ul v-textarea">
                  <li class="title">备&ensp;&ensp;&ensp;&ensp;注</li>
                  <li class="right-value">
                    <textarea placeholder="输入事件备注" v-model.trim="submission.eventRemark" class="textarea"
                              name=""></textarea>
                  </li>
                </ul>
                <p class="warn opacityColor"></p>
              </div>
            </div>
            <!---->
          </div>
          <div class="add-calendar-footer" ref="footDom">
            <button @click="toBack(0)">返回</button>
            <button @click="onsubmitCut(0)">{{'下一步'}}</button>
          </div>
        </swiper-item>
        <swiper-item v-if="addressObj.parent != '自定义'" class="box">
          <div class="back-item back-node-color" :style="{height:bodyHeight+'px'}">
            <div class="back-item-node">
              <ul class="calendar-all-body-ul">
                <li class="calendar-all-body-li back-node-calendar-box" v-for="(list,index) in eventContainList">
                  <div class="line"></div>
                  <div class="eventContent" :class="{color:newDateT>list.eventEndDate}">
                    <div class="li-top">
                      <div class="flex li-top-left">
                        <span v-show="list.eventBeginDate" class="li-top-left-month">{{$const.formatArray(list.eventBeginDate)[1]}}月{{$const.formatArray(list.eventBeginDate)[2]}}日</span>
                        <span
                          v-show="(list.eventEndDate && list.eventBeginDate) && list.eventBeginDate !=list.eventEndDate">-</span>
                        <span v-show="list.eventEndDate && list.eventBeginDate !=list.eventEndDate"
                              class="li-top-left-month">{{$const.formatArray(list.eventEndDate)[1]}}月{{$const.formatArray(list.eventEndDate)[2]}}日</span>
                        <span class="li-top-set" v-show="eventCont(list.eventBeginDate, list.eventEndDate)">今</span>
                      </div>
                      <div class="flex li-top-right" v-if="list.eventConfirmFrequency != null"
                           @click="toCalendarFrequency(index)">
                        <i class="icon iconfont icon-tixing1 color" v-show="list.eventConfirmFrequency == 1"></i>
                        <i class="icon iconfont icon-tixing1" v-show="list.eventConfirmFrequency == 0"></i>
                      </div>
                    </div>
                    <div class="li-bottom">
                      <p class="li-bottom-top">{{list.eventName}}</p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="add-calendar-footer" ref="footDom">
            <button @click="toBack(1)">上一步</button>
            <button @click="onsubmitCut(1)">{{footButton}}</button>
          </div>
        </swiper-item>
        <!---->
        <swiper-item class="box">
          <div class="back-item" :style="{height:bodyHeight+'px'}">
            <div class="back-item-invited">
              <div class="back-invited-head">
                <div class="invited-cell left">
                  <input @input="mobileInput" v-model="onMobile" type="tel" placeholder="输入手机号，最多邀请10个">
                </div>
                <div class="invited-cell right">
                  <button @click="addMobileClick">添加</button>
                </div>
              </div>
              <div class="back-invited-body">
                <swipeout>
                  <swipeout-item v-for="(list, index) in mobileItem" :key="index" transition-mode="follow"
                                 @on-close="handleEvents(index)" @on-open="handleEvents(index)">
                    <div :slot="'right-menu'">
                      <swipeout-button @click.native="onButtonClick(index)" type="warn">删除</swipeout-button>
                    </div>
                    <div :slot="'content'" class="invited-li-cell cell-solid">
                      <div class="invited-li-val Left">
                        <img v-if="list.avatar == '' || list.avatar == null" :src="img.on" alt="">
                        <img :src="list.avatar" alt="" v-else>
                      </div>
                      <div class="invited-li-val Right"><span>{{list.mobile}}</span></div>
                    </div>
                  </swipeout-item>
                </swipeout>
              </div>
            </div>
          </div>
          <div class="add-calendar-footer" ref="footDom">
            <button @click="toBack(2)">上一步</button>
            <button @click="onsubmitCut(2)">{{'保存'}}</button>
          </div>
        </swiper-item>
      </swiper>
    </div>
    <div class="xiao-picker popuppic">
      <transition name="fade">
        <div v-show="visible" class="box">
          <div class="area_btn_box">
            <div class="area_btn larea_cancel" @click="pickerClose">取消</div>
            <div class="area_btn larea_finish" @click="pickerSubmit">确定</div>
          </div>
          <div class="area_btn_content">
            <picker :data='addressSlots' :fixed-columns="2" :columns=2 v-model='addressProvince'
                    @on-change='onAddressChange'></picker>
          </div>
        </div>
      </transition>
      <transition name="bounce">
        <div class="area_Box" v-show="visible" @click="visible = false"></div>
      </transition>
    </div>
  </div>
</template>

<script>
  import {Datetime, Picker, Swipeout, SwipeoutButton, SwipeoutItem, Swiper, SwiperItem, Tab, TabItem} from 'vux'
  import eventTemplateConfig from '@/components/calendar/js/eventTemolateConfig'

  export default {
    name: "add-calendar-items",
    components: {
      Picker, Datetime, Tab, TabItem, Swiper, SwiperItem, Swipeout, SwipeoutItem, SwipeoutButton
    },
    destroyed() {
      this.$vux.datetime.hide()
    },
    data() {
      return {
        newDateT: 0,
        userHomeData: {},
        eventTemplate: eventTemplateConfig,
        value1: '',
        navbar: [
          {name: '事件详情', data: 0, id: 0, active: true, show: true},
          {name: '通知对象', data: 2, id: 2, active: false, show: true}
        ],
        navbar1: [
          {name: '事件详情', data: 0, id: 0, active: true, show: true},
          {name: '事件节点', data: 1, id: 1, active: false, show: true},
          {name: '通知对象', data: 2, id: 2, active: false, show: true}
        ],
        eventPlaceholder: {
          eventName: '',
        },
        footButton: '下一步',
        eventConfirmType: [
          {
            id: 0, name: '无',
            list: [
              {id: 1, name: '无'}
            ]
          },
          {
            id: 1, name: '微信',
            list: [
              {id: 1, name: '当天'},
              {id: 2, name: '提前一天'}
            ]
          },
          {
            id: 2, name: '短信',
            list: [
              {id: 1, name: '当天'},
              {id: 2, name: '提前一天'}
            ]
          },
          {
            id: 3, name: '邮件',
            list: [
              {id: 1, name: '当天'},
              {id: 2, name: '提前一天'}
            ]
          }
        ],
        eventConfirmDayType: [{name: '无'}],
        calendaritem: {
          calendarId: '',
          calendarName: 0,
          eventBeginDate: '',
          eventEndDate: '',
          eventConfirmType: 2,
          eventConfirmDayType: 1,
          inviterNumbers: '',
          eventTemplateId: ''
        },
        onMobile: '',
        mobileItem: [],
        submission: {
          eventTemplateId: '', // 模板id
          eventTemplateName: '', // 模板名称
          eventTemplateType: '', //
          eventName: '', // 事件名称
          calendarId: '', // 日历id
          calendarName: '', // 日历名称
          eventBeginDate: '', // 起始日期
          eventEndDate: '', // 结束日期
          eventTDate: '请选择', // @T
          eventRDate: '请选择', // @R
          eventSDate: '请选择', // @S
          eventLocation: '',  // 地址
          eventConfirmType: 2, // 提醒方式
          eventConfirmDayType: 1,// 提醒方式 的时间
          eventRemark: '', // 时间备注
          reportType: 1, // 定期报告
          performanceReport: '业绩预报',
          inviterNumbers: '' // 邀请人号码列表
        },
        calendarData: [],
        visible: false,
        isSelected: [],
        active: 0,
        selected: 1,
        tabHeight: 0,
        bodyHeight: 0,
        reportTypeData: [
          {id: 1, name: '年度报告'},
          {id: 2, name: '一季报'},
          {id: 3, name: '半年报'},
          {id: 4, name: '三季报'},
        ],
        choseBonusData: [
          {id: 0, name: '是', type: true},
          {id: 1, name: '否', type: false}
        ],
        // 业绩报告
        performanceReportData: [
          {id: 5, name: '业绩预报', type: '业绩预报'},
          {id: 6, name: '业绩快报', type: '业绩快报'},
        ],
        //
        warnListDataText: {
          eventNameText: '请输入事件名称',
          nextprevDateText: '请选择起止日期',
          calendarText: '请选择日历',
          eventTDateText: '请选择会议日期',
          eventPDateText: '请选择披露日期',
          eventRDateText: '请选择股权登记日',
          eventSDateText: '请选择回购股份届满日',
          performanceReportText: '请选择业绩报告'
        },
        warnListData: {
          eventName: false,
          nextprevDate: false,
          calendar: false,
          eventTDate: false,
          eventRDate: false,
          eventSDate: false,
          performanceReport: false
        },
        incidentText: {
          /* *
          * @T: 会议日期
          * @R: 股权登记日
          * @B: 定期报告：年度报告/一季报/半年报/三季报
          * @P: 披露日期
          * @Y: 业绩报告：业绩预告/业绩快报  \/\
          * @C: 差异化分红送转：是/否
          * @SE: 日常事件开始时间，结束时间
          * */
          eventSDate: '请选择', // @S
          eventTDate: '请选择', // @T
          eventRDate: '请选择', // @R
          reportType: 1, // @B
          performanceReport: 5, // @Y
          eventPDate: '请选择', // @P
          choseBonus: false, // @C
          prevDate: '请选择', // @SE
          nextDate: '请选择', // @SE
        },
        incidentTextData: [
          {type: 'S', name: '回购股份届满日'},
          {type: 'T', name: '会议日期'},
          {type: 'R', name: '股权登记日'},
          {type: 'B', name: '定期报告'},
          {type: 'Y', name: '业绩报告'},
          {type: 'P', name: '披露日期'},
          {type: 'C', name: '差异化分红送转'}
        ],
        img: {
          off: '',
          on: this.$image.calendar.calendarMobile3x
        },
        // 时间模板的筛选
        addressObj: {
          eventTemplateType: 0,
          lable: "",
          name: "",
          nameSample: "",
          parent: "",
          value: 0,
          valueList: "SE",
          valueListMap: {
            "SE": "事件日期"
          }
        },
        isCheckData: false,
        addressSlots: [
          {name: '自定义', value: '自定义', parent: 0},
          {name: '沪市', value: '沪市', parent: 0},
          {name: '深市', value: '深市', parent: 0}
        ],
        addressProvince: [],
        eventContainList: [],
      }
    },
    watch: {
      'incidentText.choseBonus': function (val) {
        this.submission.choseBonused = val;
      },
      'incidentText.eventRDate': function (val) {
        if (val == '' || val == undefined || val == '请选择') {
          this.incidentText.eventRDate = '请选择';
          this.submission.eventRDate = 0;
        } else {
          this.submission.eventRDate = this.$const.getTimestamp(this.incidentText.eventRDate);
        }
      },
      'incidentText.eventTDate': function (val) {
        if (val == '' || val == undefined || val == '请选择') {
          this.incidentText.eventTDate = '请选择';
          this.submission.eventTDate = 0;
        } else {
          this.submission.eventTDate = this.$const.getTimestamp(this.incidentText.eventTDate);
        }
      },
      'incidentText.eventSDate': function (val) {
        if (val == '' || val == undefined || val == '请选择') {
          this.incidentText.eventSDate = '请选择';
          this.submission.eventSDate = 0;
        } else {
          this.submission.eventSDate = this.$const.getTimestamp(this.incidentText.eventSDate);
        }
      },
      'incidentText.prevDate': function (val) {
        if (val == '' || val == undefined || val == '请选择') {
          this.incidentText.prevDate = '请选择';
          this.submission.eventBeginDate = '';
        } else {
          this.submission.eventBeginDate = this.$const.getTimestamp(this.incidentText.prevDate);
        }
      },
      'incidentText.nextDate': function (val) {
        if (val == '' || val == undefined || val == '请选择') {
          this.incidentText.nextDate = '请选择';
          this.submission.eventEndDate = '';
        } else {
          this.submission.eventEndDate = this.$const.getTimestamp(this.incidentText.nextDate);
        }
      },
      'mobileItem': function (val) {
        if (this.addressObj.parent == '自定义') {
          // richang
          if (val.length > 0) {
            let number = [];
            val.forEach((item) => {
              number.push(item.mobile);
            })
            this.submission.inviterNumbers = number.join(',');
          }
        } else {
          // muban
          this.submission.inviterNumbers = val;
        }
      }
    },
    computed: {},
    created() {
      this.newDateT = this.$const.getTimestamp(this.$const.getNewDate());
      this.getTemplateList();
      // 获取模板
      this.getCalendarByUserId();
      this.userHomeData = this.$cookie.getUserInfo();
      console.log('userHomeData', this.userHomeData);
      // 初始化时 提醒方式 的时间
      this.eventConfirmDayType = this.eventConfirmType[this.calendaritem.eventConfirmType].list;
    },
    mounted() {
      this.$nextTick(() => {
        this.tabHeight = this.$refs.contDom.clientHeight - this.$refs.navDom.clientHeight;
        this.bodyHeight = this.$refs.contDom.clientHeight - this.$refs.navDom.clientHeight - this.$refs.footDom.clientHeight;
      });
      this.$nextTick(() => {
        let doc = '';
        let link = this.$api.CURRENTIP.IP + '#/calendar/calendarAll';
        this.$weixin.wxshare('小安日历，众多功能帮您解决“遗忘症”', doc, link, this.$api.share.defaultImg, true);
      })
      console.log('eventTemplateConfig', this.eventTemplate);
    },
    methods: {
      //
      eventCont(start, end) {
        let newDate = this.$const.getTimestamp(this.$const.getNewDate());
        // console.log(newDate);
        let da = false;
        if (start == null && end == null) {
          // 2
          return false
        } else if (start !== null && end == null) {
          if (newDate == start) {
            return true
          } else {
            return false
          }
          // st 1
        } else if (start == null && end !== null) {
          if (newDate == end) {
            return true
          } else {
            return false
          }
          //end 1
        } else if (start !== null && end !== null) {
          console.log(1);
          if (newDate == start || newDate == end) {
            return true
          } else {
            return false
          }
        }
        console.log(start, end);
      },
      //
      getAvatarByMobile(mobile) {
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getAvatarByMobile,
          params: {
            mobile: mobile
          }
        })*/
        let params = {mobile: mobile}
        this.$axios.calendar.getAvatarByMobile(params).then((res) => {
          let da = true;
          if (this.mobileItem.length > 1) {
            this.mobileItem.forEach((item) => {
              if (mobile == item.mobile) {
                da = false
              }
            })
          }
          //
          if (da) {
            if (res.data.returnCode == 1) {
              console.log('123', res);
              this.mobileItem.push(res.data.returnObject);
            } else if (res.data.returnCode == -1) {
              this.mobileItem.push({avatar: '', eventId: null, id: null, mobile: mobile});
            }
          } else {
            //

          }
        }).catch((err) => {

        })
      },
      //
      eventFocus(val) {
        if (val == 'eventName') {
          this.warnListData.eventName = false;
        } else if (val == 'calendar') {
          this.warnListData.calendar = false;
        }
        console.log();
      },
      // 分红的change
      selectChoseBonus() {
        this.submission.choseBonus = this.incidentText.choseBonus;
        this.getEventContainList();
      },
      //
      selectReportType() {
        this.incidentText.eventTDate = 0;
        // console.log(this.incidentText.reportType);
        this.submission.reportType = this.incidentText.reportType;
        //console.log(this.incidentText.reportType);
      },
      // 业绩报告
      selectPerformanceReport() {
        this.submission.performanceReport = this.incidentText.performanceReport;
      },
      isSDateCheck(set) {
        console.log(this.addressObj);
        console.log(this.incidentText);
        if (this.addressObj.type == '回购股份') {
          if (set == 1) {
            if (this.incidentText.eventTDate == '' || this.incidentText.eventTDate == '请选择') {
              this.warnListData.eventTDate = true;
              this.warnListDataText.eventTDateText = `请选择${this.addressObj.valueListMap['T']}`;
              console.log(this.warnListData, this.warnListDataText);
              return true
            }
          }
          //
          if (set == 2) {
            if (this.incidentText.eventSDate == '' || this.incidentText.eventSDate == '请选择') {
              this.warnListData.eventSDate = true;
              this.warnListDataText.eventSDateText = `请选择${this.addressObj.valueListMap['T']}`;
              console.log(this.warnListData, this.warnListDataText);
              return true
            }
          }
        } else {
          return false
        }
      },
      // S股东大会召开日
      eventSDatePlugin() {
        if (this.isSDateCheck(1)) {
          return
        }
        let that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: that.incidentText.eventSDate,
          onConfirm(val) {
            that.incidentText.eventSDate = val;
          },
          onShow() {
            console.log('eventSDatePlugin show');
            that.warnListData.eventSDate = false;
            that.warnListDataText.eventSDateText = '请选择回购股份届满日';
          },
          onHide() {
            console.log(that.incidentText, 'eventSDatePlugin hide');
            //
            if (that.incidentText.eventSDate == '' || that.incidentText.eventSDate == '请选择') {
              //
            } else {
              setTimeout(() => {
                that.checkDate();
              }, 200)
            }
          }
        })
      },
      // R日 股权登记日
      eventRDatePlugin() {
        if (this.isSDateCheck(2)) {
          return
        }

        let that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: that.incidentText.eventRDate,
          onConfirm(val) {
            that.incidentText.eventRDate = val;
            console.log('eventRDatePlugin confirm', val);
            setTimeout(() => {
              that.getEventContainList();
              that.checkDate();
            }, 200);
            //
            let reportType = that.incidentText.reportType;
            let performanceReport = that.incidentText.performanceReport;
            let eventDateText = [
              '站位',
              '年度报告应在1月1日至4月30日披露，披露日应为交易日或周六。',
              '一季报应在4月1日至4月30日披露，披露日应为交易日或周六。',
              '半年报应在7月1日至8月31日披露，披露日应为交易日或周六。',
              '三季报应在10月1日至10月31日披露，披露日应为交易日或周六。',
              '业绩预报披露日应为交易日或周六。',
              '业绩快报披露日应为交易日或周六。',
              '会议日期必须是交易日。',
            ];
            if (that.addressObj.valueList.indexOf('B') > -1) {
              let dt = new Date(val);
              let selectMonth = val.split('-')[1];
              that.warnListDataText.eventPDateText = '请填写披露日期';
              if (dt.getDay() === 0) {
                switch (reportType) {
                  case 1:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[1];
                    break;
                  case 2:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[2];
                    break;
                  case 3:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[3];
                    break;
                  case 4:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[4];
                    break;
                }
              } else {
                switch (reportType) {
                  case 1:
                    if (selectMonth >= 1 && selectMonth <= 4) {
                    } else {
                      that.warnListData.eventTDate = true;
                      that.warnListDataText.eventPDateText = eventDateText[1];
                    }
                    break;
                  case 2:
                    if (selectMonth == 4) {
                    } else {
                      that.warnListData.eventTDate = true;
                      that.warnListDataText.eventPDateText = eventDateText[2];
                    }
                    break;
                  case 3:
                    if (selectMonth == 8 || selectMonth == 7) {
                    } else {
                      that.warnListData.eventTDate = true;
                      that.warnListDataText.eventPDateText = eventDateText[3];
                    }
                    break;
                  case 4:
                    if (selectMonth == 10) {
                    } else {
                      that.warnListData.eventTDate = true;
                      that.warnListDataText.eventPDateText = eventDateText[4];
                    }
                    break;
                }
              }
            } else if (that.addressObj.valueList.indexOf('Y') > -1) {
              let dt = new Date(val);
              that.warnListDataText.eventPDateText = '请填写披露日期'
              if (dt.getDay() === 0) {
                switch (performanceReport) {
                  case 5:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[5];
                    break;
                  case 6:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[6];
                    break;
                }
              }
            } else if (that.addressObj.valueList.indexOf('T') > -1) {
              let dt = new Date(val);
              if (dt.getDay() === 0) {
                // that.warnListDataText.eventTDateText = eventDateText[7];
                // that.warnListData.eventTDate = true;
              }
            } else if (that.addressObj.valueList.indexOf('P,R,C') > -1) {

            }
          },
          onShow() {
            console.log('eventRDatePlugin show');
            that.warnListData.eventRDate = false;
            that.warnListDataText.eventRDateText = '请选择股权登记日';
          },
          onHide() {
            console.log(that.incidentText.eventRDate, 'eventRDatePlugin hide');
            //
            if (that.incidentText.eventRDate == '' || that.incidentText.eventRDate == '请选择') {

            } else {
              setTimeout(() => {
                that.checkDate();
              }, 200)
            }
          }
        })
      },
      // T日 会议日期 披露日期
      eventTDatePlugin() {
        let that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: that.incidentText.eventTDate,
          onConfirm(val) {
            that.incidentText.eventTDate = val;
            console.log('plugin0 confirm', val);
            //
            let ar = true;
            let reportType = that.incidentText.reportType;
            let performanceReport = that.incidentText.performanceReport;
            let eventDateText = [
              '站位',
              '年度报告应在1月1日至4月30日披露，披露日应为交易日或周六。',
              '一季报应在4月1日至4月30日披露，披露日应为交易日或周六。',
              '半年报应在7月1日至8月31日披露，披露日应为交易日或周六。',
              '三季报应在10月1日至10月31日披露，披露日应为交易日或周六。',
              '业绩预报披露日应为交易日或周六。',
              '业绩快报披露日应为交易日或周六。',
              '会议日期必须是交易日。',
            ];
            if (that.addressObj.valueList.indexOf('B') > -1) {
              let dt = new Date(val);
              let selectMonth = val.split('-')[1];
              that.warnListDataText.eventPDateText = '请填写披露日期';
              if (dt.getDay() === 0) {
                switch (reportType) {
                  case 1:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[1];
                    ar = false;
                    break;
                  case 2:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[2];
                    ar = false;
                    break;
                  case 3:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[3];
                    ar = false;
                    break;
                  case 4:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[4];
                    ar = false;
                    break;
                }
              } else {
                switch (reportType) {
                  case 1:
                    if (selectMonth >= 1 && selectMonth <= 4) {
                    } else {
                      that.warnListData.eventTDate = true;
                      that.warnListDataText.eventPDateText = eventDateText[1];
                      ar = false;
                    }
                    break;
                  case 2:
                    if (selectMonth == 4) {
                    } else {
                      that.warnListData.eventTDate = true;
                      that.warnListDataText.eventPDateText = eventDateText[2];
                      ar = false;
                    }
                    break;
                  case 3:
                    if (selectMonth == 8 || selectMonth == 7) {
                    } else {
                      that.warnListData.eventTDate = true;
                      that.warnListDataText.eventPDateText = eventDateText[3];
                      ar = false;
                    }
                    break;
                  case 4:
                    if (selectMonth == 10) {
                    } else {
                      that.warnListData.eventTDate = true;
                      that.warnListDataText.eventPDateText = eventDateText[4];
                      ar = false;
                    }
                    break;
                }
              }
            } else if (that.addressObj.valueList.indexOf('Y') > -1) {
              let dt = new Date(val);
              that.warnListDataText.eventPDateText = '请填写披露日期'
              if (dt.getDay() === 0) {
                switch (performanceReport) {
                  case 5:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[5];
                    ar = false;
                    break;
                  case 6:
                    that.warnListData.eventTDate = true;
                    that.warnListDataText.eventPDateText = eventDateText[6];
                    ar = false;
                    break;
                }
              }
            } else if (that.addressObj.valueList == 'T') {
              that.warnListData.eventTDate = false;
              // set 4.27
            } else if (that.addressObj.valueList.indexOf('T') > -1) {
              let dt = new Date(val);
              if (dt.getDay() === 0) {
                that.warnListDataText.eventTDateText = eventDateText[7];
                that.warnListData.eventTDate = true;
                ar = false
              }
            } else if (that.addressObj.valueList.indexOf('P,R,C') > -1) {

            }
            if (ar) {
              setTimeout(() => {
                that.getEventContainList();
                that.checkDate();
              });
            }
          },
          onShow() {
            console.log('plugin0 show');
            that.warnListData.eventTDate = false;
            that.warnListDataText.eventTDateText = ''; // 打开筛选 是清除提示
            that.warnListDataText.eventRDateText = '请选择股权登记日';
          },
          onHide() {
            if (that.incidentText.eventTDate == '' || that.incidentText.eventTDate == '请选择') {
              //
            } else if (that.warnListDataText.eventPDateText != '') {
              //
            } else {
              setTimeout(() => {
                that.checkDate();
              }, 200)
            }
          }
        })
      },
      // 终止时间
      showNextPlugin() {
        let that = this;
        if (that.incidentText.prevDate == '请选择') {
          this.$vux.toast.show({text: '请先选择起始日期', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return
        }
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: that.incidentText.nextDate,
          startDate: that.incidentText.prevDate,
          onConfirm(val) {
            that.incidentText.nextDate = val;
            console.log('plugin1 confirm', val)
            console.log('plugin1 confirm', that.incidentText.nextDate)
          },
          onShow() {
            console.log('plugin1 show');
            that.warnListData.nextprevDate = false;
          },
          onHide() {
            console.log('plugin1 hide')
          }
        })
      },
      // 起始时间
      showPrevPlugin() {
        let that = this;
        this.$vux.datetime.show({
          cancelText: '取消',
          confirmText: '确定',
          format: 'YYYY-MM-DD',
          value: that.incidentText.prevDate,
          onConfirm(val) {
            that.incidentText.prevDate = val;
            console.log('plugin0 confirm', val)
          },
          onShow() {
            console.log('plugin0 show');
            that.warnListData.nextprevDate = false;
          },
          onHide() {
            console.log('plugin0 hide');
          }
        })
      },
      // 上一步按钮
      toBack(i) {
        switch (i) {
          case 0:
            //
            this.$router.push({path: '/calendar/calendarAll'});
            break;
          case 1:
            this.active -= 1;
            //
            break;
          case 2:
            //
            this.active -= 1;
            break;
        }
      },
      // 点击右滑删除
      onButtonClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要删除吗？',
          // 组件除show外的属性
          onCancel() {
          },
          onConfirm() {
            _this.mobileItem.splice(index, 1);
          }
        })
        // this.mobileItem[index] = '';
        // this.mobileItem = this.$array.ImpArr(this.mobileItem);
        console.log('123', this.mobileItem);
      },
      //
      checkDate() {
        console.warn(this.submission.eventRDate);
        if (this.submission.eventTDate == '' || this.submission.eventTDate == null || this.submission.eventTDate == '请选择') {
          this.submission.eventTDate = 0;
        }
        if (this.submission.eventRDate == '' || this.submission.eventRDate == null || this.submission.eventRDate == '请选择') {
          this.submission.eventRDate = 0;
        }
        if (this.submission.eventSDate == '' || this.submission.eventSDate == null || this.submission.eventSDate == '请选择') {
          this.submission.eventSDate = 0;
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.checkDate,
          params: {
            templateEventId: this.submission.eventTemplateId,
            eventTDate: this.submission.eventTDate,
            eventRDate: this.submission.eventRDate,
            eventSDate: this.submission.eventSDate
          }
        })*/
        let params = {
          templateEventId: this.submission.eventTemplateId,
          eventTDate: this.submission.eventTDate,
          eventRDate: this.submission.eventRDate,
          eventSDate: this.submission.eventSDate
        }
        this.$axios.calendar.checkDate(params).then((res) => {
          console.log('checkDate', res.data);
          console.log('checkDate', this.addressObj);

          if (res.data.returnCode == -1) {
            this.isCheckData = false;
            // T/R都有时，不合法+Msg(提示语句);
            if (this.addressObj.valueList.indexOf('P') > -1) {
              this.warnListDataText.eventPDateText = res.data.returnObject.T;
              this.warnListDataText.eventRDateText = res.data.returnObject.R;
              this.warnListData.eventPDate = true;
              this.warnListData.eventRDate = true;
              this.warnListData.eventTDate = true;
            } else {
              this.warnListDataText.eventRDateText = res.data.returnObject.R;
              this.warnListDataText.eventTDateText = res.data.returnObject.T;
              this.warnListData.eventRDate = true;
              this.warnListData.eventTDate = true;
            }
            // 回购
            if (this.addressObj.valueList.indexOf('T,R,S') > -1) {
              this.warnListData.eventSDate = true;
              this.warnListData.eventTDate = true;
              this.warnListData.eventRDate = true;
              this.warnListDataText.eventSDateText = res.data.returnObject['S'];
              this.warnListDataText.eventRDateText = res.data.returnObject['R'];
              this.warnListDataText.eventTDateText = res.data.returnObject['T'];
            }
          } else if (res.data.returnCode == 1) {
            this.isCheckData = true;
            this.warnListData.eventRDate = false;
            this.warnListData.eventTDate = false;
            this.warnListData.eventSDate = false;
            // T/R都有时，合法
          } else if (res.data.returnCode == 0) {
            // 在只选了一个日期时，返回另一个日期可选日期
          } else if (res.data.returnCode == 2) {
            // 在只选了一个日期时，另一个日期无要求
          } else if (res.data.returnCode == -2) {
            //  程序错误
          }
        }).catch((err) => {

        })
      },
      //
      handleEvents(index) {
        console.log(index);
      },
      // 正则处理 onMobile
      mobileInput() {
        this.onMobile = this.$array.trim(this.onMobile);
      },
      //
      tabClick(index) {
        console.log('123', index);
      },
      //
      addMobileClick() {
        if (this.$regExp.mobile(this.onMobile)) {
          // 属于手机号码
          if (this.mobileItem.length == 10) {
            this.$vux.toast.show({text: '最多邀请10人', position: 'middle', type: 'text', width: 'auto', time: 1500});
          } else if (this.mobileItem.length < 10) {
            let ler = true;
            this.mobileItem.forEach((item) => {
              if (item.mobile == this.onMobile) {
                ler = false
              }
            })
            if (ler) {
              this.getAvatarByMobile(this.onMobile);
            } else {
              this.$vux.toast.show({text: '手机号已添加', position: 'middle', type: 'text', width: 'auto', time: 1500});
            }
          } else {

          }
        } else {
          this.$toast({message: '请输入正确手机号码', position: 'middle', duration: 1500});
        }
      },
      // 添加日常事件
      addNormalEvent() {
        this.$vux.loading.show({text: '正在提交'});
        /*
        *  item.id = null; // 日历名称
          item.calendarId = this.submission.calendarId; //
          item.calendarName = this.submission.calendarName; // 日历名称
          item.templateEventId = this.submission.eventTemplateId; // 日历模板id
          item.templateEventName = this.submission.eventTemplateName; // 日历模板id
          item.templateEventType = this.submission.eventTemplateType; // 日历模板类型 0 日常 ， 1沪市，2深市
          item.eventConfirmType = this.submission.eventConfirmType; // 提醒方式
          item.eventConfirmDayType = this.submission.eventConfirmDayType; // 提醒方式 日期id 1 ， 2
          item.eventRemark = this.submission.eventRemark; // 备注
          item.createUserId = this.userHomeData.id; // 备注
        *
        *
        * */
        /*this.$http ({
          method: 'POST',
          url: this.$api.calendar.addNormalEvent,
          params: {
            eventTemplateName: this.submission.eventTemplateName,
            eventName: this.submission.eventName,
            calendarId: this.submission.calendarId,
            calendarName: this.submission.calendarName,
            eventBeginDate: this.submission.eventBeginDate,
            eventEndDate: this.submission.eventEndDate,
            eventLocation: this.submission.eventLocation,
            eventConfirmType: this.submission.eventConfirmType,
            eventConfirmDayType: this.submission.eventConfirmDayType,
            eventRemark: this.submission.eventRemark,
            inviterNumbers: this.submission.inviterNumbers,
            eventTemplateId: this.submission.eventTemplateId
          }
        })*/
        let params = {
          eventTemplateName: this.submission.eventTemplateName,
          eventName: this.submission.eventName,
          calendarId: this.submission.calendarId,
          calendarName: this.submission.calendarName,
          eventBeginDate: this.submission.eventBeginDate,
          eventEndDate: this.submission.eventEndDate,
          eventLocation: this.submission.eventLocation,
          eventConfirmType: this.submission.eventConfirmType,
          eventConfirmDayType: this.submission.eventConfirmDayType,
          eventRemark: this.submission.eventRemark,
          inviterNumbers: this.submission.inviterNumbers,
          eventTemplateId: this.submission.eventTemplateId
        }
        this.$axios.calendar.addNormalEvent(params).then((res) => {
          // console.log('api1231321321321312321321', res);
          if (res.data.returnCode == 1) {
            this.$vux.loading.hide();
            this.$router.push({path: '/calendar/calendarAll'});
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      //提交按钮
      onsubmitCut(i) {
        if (this.addressObj.parent == '自定义') {
          // 日常
          switch (i) {
            case 0:
              if (this.submission.eventName == '') {
                this.switchClick(0);
                this.warnListData.eventName = true;
                // this.$vux.toast.show({text: '请填写事件名称', position: 'middle', type: 'text', width: 'auto', time: 1500});
                return
              }
              if (this.submission.eventBeginDate == '' || this.submission.eventBeginDate == '请选择') {
                this.switchClick(0);
                this.warnListData.nextprevDate = true;
                // this.$vux.toast.show({text: '请填写起止日期', position: 'middle', type: 'text', width: 'auto', time: 1500});
                return
              }
              if (this.submission.eventEndDate == '' || this.submission.eventEndDate == '请选择') {
                this.switchClick(0);
                this.$toast({message: '请选择结束日期', position: 'middle', duration: 1500});
                return
              }
              if (this.submission.calendarId == '') {
                this.switchClick(0);
                this.warnListData.calendar = true;
                //this.$vux.toast.show({text: '请选择日历', position: 'middle', type: 'text', width: 'auto', time: 1500});
                return
              }
              this.active = 1;
              break;
            case 2:
              // 提交le
              this.addNormalEvent();
              break;
          }
          console.log(i);
        } else {
          // muban
          switch (i) {
            case 0:
              this.judgmentValue(this.addressObj);
              // 出来了
              if (this.judgmentValue(this.addressObj)) {
                this.active += 1;
              }
              break;
            case 1:
              this.active += 1;
              break;
            case 2:
              console.log('1submission23', this.submission);
              this.addTemplateEvent();
              break;
          }
        }
        console.log(i, this.submission);
      },
      // 判断
      judgmentValue(value) {
        console.log('121212', value);
        let tmp = [];
        let trueA = true;
        this.incidentTextData.forEach((item) => {
          if (value.valueList.indexOf(item.type) > -1) {
            tmp.push(item);
          }
        });
        //
        if (this.addressObj.type == '回购股份') {
          if (this.isSDateCheck(2)) {
            return false
          }
          trueA = this.isCheckData;
        }
        //
        console.log(tmp);
        tmp.forEach((item) => {
          if (this.submission.eventName == '') {
            this.warnListData.eventName = true;
            // this.$vux.toast.show({text: '请选择日历', position: 'middle', type: 'text', width: 'auto', time: 1500});
            trueA = false
            return
          }
          if (item.type == 'T') {
            if (this.incidentText.eventTDate == '' || this.incidentText.eventTDate == '请选择') {
              this.warnListData.eventTDate = true;

              // this.$vux.toast.show({text: '请填写会议日期', position: 'middle', type: 'text', width: 'auto', time: 1500});
              trueA = false
              return
            }
          }
          if (item.type == 'R') {
            if (this.incidentText.eventRDate == '' || this.incidentText.eventRDate == '请选择') {
              this.warnListData.eventRDate = true;
              // this.$vux.toast.show({text: '请填写股权登记日', position: 'middle', type: 'text', width: 'auto', time: 1500});
              trueA = false
              return
            }
          }
          if (item.type == 'S') {
            if (this.incidentText.eventSDate == '' || this.incidentText.eventSDate == '请选择') {
              this.warnListData.eventSDate = true;
              // this.$vux.toast.show({text: '请填写股权登记日', position: 'middle', type: 'text', width: 'auto', time: 1500});
              trueA = false
              return
            }
          }
          if (item.type == 'P') {
            if (this.incidentText.eventTDate == '' || this.incidentText.eventTDate == '请选择') {
              this.warnListData.eventTDate = true;
              // this.$vux.toast.show({text: '请填写披露日期', position: 'middle', type: 'text', width: 'auto', time: 1500});
              trueA = false
            }
          }
          if (this.submission.calendarId == '') {
            this.warnListData.calendar = true;
            // this.$vux.toast.show({text: '请选择日历', position: 'middle', type: 'text', width: 'auto', time: 1500});
            trueA = false
          }
        })
        //
        return trueA
        // 得出当前模板要填的必选项
      },
      // 非日常 获取事件的节点
      getEventContainList() {
        let eventT = '', eventR = '', eventS = '';
        if (this.submission.eventTDate == '请选择' || this.submission.eventTDate == '') {
          eventT = 0
        } else {
          eventT = this.submission.eventTDate;
        }
        if (this.submission.eventRDate == '请选择' || this.submission.eventRDate == '') {
          eventR = 0
        } else {
          eventR = this.submission.eventRDate;
        }
        //
        if (this.submission.eventSDate == '请选择' || this.submission.eventSDate == '') {
          eventS = 0
        } else {
          eventS = this.submission.eventSDate;
        }
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getEventContainList,
          params: {
            templateEventId: this.submission.eventTemplateId,
            eventTDate: eventT,
            eventRDate: eventR,
            eventSDate: eventS,
            isChoseBonus: this.incidentText.choseBonus
          }
        })*/
        let params = {
          templateEventId: this.submission.eventTemplateId,
          eventTDate: eventT,
          eventRDate: eventR,
          eventSDate: eventS,
          isChoseBonus: this.incidentText.choseBonus
        }
        this.$axios.calendar.getEventContainList(params).then((res) => {
          console.log('2342142', res);
          if (res.data.returnCode == 1) {
            this.eventContainList = res.data.returnObject;
            // 重置事件
            this.eventContainList.forEach((item, index) => {
              if (item.eventConfirmFrequency !== null) {
                item.eventConfirmFrequency = 1;
              }
            });
            console.log('this.eventContainList', this.eventContainList);
          }
        }).catch((err) => {

        })
      },
      /*
      * submission: {
          eventTemplateId: '', // 模板id
          eventTemplateName: '', // 模板名称
          eventName: '', // 事件名称
          calendarId: '', // 日历id
          calendarName: '', // 日历名称
          eventBeginDate: '', // 起始日期
          eventEndDate: '', // 结束日期
          eventTDate: '请选择', // @T
          eventRDate: '请选择', // @R
          eventLocation: '',  // 地址
          eventConfirmType: 2, // 提醒方式
          eventConfirmDayType: 0,// 提醒方式 的时间
          eventRemark: '', // 时间备注
          reportType: 0, // 定期报告
          performanceReport: '业绩预告',
          inviterNumbers: '' // 邀请人号码列表
        },
      *{
      * */
      // 模板事件提交
      addTemplateEvent() {
        this.$vux.loading.show({text: '正在提交'});
        this.eventContainList.forEach((item, index) => {
          item.calendarId = this.submission.calendarId; //
          item.calendarName = this.submission.calendarName; // 日历名称
          item.templateEventId = this.submission.eventTemplateId; // 日历模板id
          item.templateEventName = this.submission.eventTemplateName; // 日历模板id
          item.templateEventType = this.submission.eventTemplateType; // 日历模板类型 0 日常 ， 1沪市，2深市
          item.eventConfirmType = this.submission.eventConfirmType; // 提醒方式
          item.eventConfirmDayType = this.submission.eventConfirmDayType; // 提醒方式 日期id 1 ， 2
          // item.eventRemark = this.submission.eventRemark; // 备注
        });
        if (this.addressObj.valueList.indexOf('Y') > -1) {
          this.submission.reportType = this.incidentText.performanceReport;
        }
        /*this.$http ({
          method: 'POST',
          url: this.$api.calendar.addTemplateEvent,
          data: {
            calendarId: this.submission.calendarId,
            choseBonused: this.submission.choseBonused,
            calendarName: this.submission.calendarName,
            createUserId: this.userHomeData.id,
            eventConfirmDayType: this.submission.eventConfirmDayType,
            eventConfirmType: this.submission.eventConfirmType,
            eventContainList: this.eventContainList,
            eventLocation: this.submission.eventLocation,
            eventName: this.submission.eventName,
            eventRDate: this.submission.eventRDate,
            eventRemark: this.submission.eventRemark,
            eventTDate: this.submission.eventTDate,
            eventSDate: this.submission.eventSDate,
            inviterNumberList: this.mobileItem,
            reportType: this.submission.reportType,
            templateEventId: this.submission.eventTemplateId,
            templateEventName: this.submission.eventTemplateName,
            templateEventType: this.submission.eventTemplateType,
            updateUserId: this.userHomeData.id,
            updateUserName: '',
          }
        })*/
        let params = {
          calendarId: this.submission.calendarId,
          choseBonused: this.submission.choseBonused,
          calendarName: this.submission.calendarName,
          createUserId: this.userHomeData.id,
          eventConfirmDayType: this.submission.eventConfirmDayType,
          eventConfirmType: this.submission.eventConfirmType,
          eventContainList: this.eventContainList,
          eventLocation: this.submission.eventLocation,
          eventName: this.submission.eventName,
          eventRDate: this.submission.eventRDate,
          eventRemark: this.submission.eventRemark,
          eventTDate: this.submission.eventTDate,
          eventSDate: this.submission.eventSDate,
          inviterNumberList: this.mobileItem,
          reportType: this.submission.reportType,
          templateEventId: this.submission.eventTemplateId,
          templateEventName: this.submission.eventTemplateName,
          templateEventType: this.submission.eventTemplateType,
          updateUserId: this.userHomeData.id,
          updateUserName: ''
        }
        this.$axios.calendar.addTemplateEvent(params).then((res) => {

          console.log('2342142', res);
          if (res.data.returnCode == 1) {
            this.$vux.loading.hide();
            this.$router.push({path: '/calendar/calendarAll'});
          }
        }).catch((err) => {

        })
      },
      //
      selectCalendar() {
        let obj = this.calendarData[this.calendaritem.calendarName];
        console.log(obj);
        this.submission.calendarId = obj.id;
        this.submission.calendarName = obj.calendarName;
      },
      // 当天 前一天
      ConfirmDayType() {
        console.log('this.calendaritem.eventConfirmDayType', this.calendaritem.eventConfirmDayType);
        //let obj = this.eventConfirmDayType[this.calendaritem.eventConfirmDayType];
        this.submission.eventConfirmDayType = this.calendaritem.eventConfirmDayType;
        //console.log(obj, this.submission.eventConfirmDayType);
      },
      // 提醒方式
      ConfirmType() {
        let obj = this.eventConfirmType[this.calendaritem.eventConfirmType];
        this.submission.eventConfirmType = obj.id;
        this.eventConfirmDayType = obj.list;
        this.calendaritem.eventConfirmDayType = 1;
        console.log('11', obj);
      },
      // 查找日历
      getCalendarByUserId() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getCalendarByUserId,
          params: {
            isPC: 0
          }
        })*/
        let params = {isPC: 0}
        this.$axios.calendar.getCalendarByUserId(params).then((res) => {
          // console.log('api1', res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.length == 0) {
              // 暂无日历
            } else {
              this.calendarData = [];
              // 有日历
              let calendarName = [{id: 0, calendarName: '请选择'}];
              // let calendarName = [];
              this.calendarData = calendarName.concat(res.data.returnObject);
              // console.log('2342432', this.calendarData);

            }
          }
        }).catch((err) => {

        })
      },
      // 事件模板监听
      onAddressChange() {
        this.submission = {
          eventTemplateId: '', // 模板id
          eventTemplateName: '', // 模板名称
          eventTemplateType: '', //
          eventName: '', // 事件名称
          calendarId: '', // 日历id
          calendarName: '', // 日历名称
          eventBeginDate: '', // 起始日期
          eventEndDate: '', // 结束日期
          eventTDate: '请选择', // @T
          eventRDate: '请选择', // @R
          eventSDate: '请选择', // @R
          eventLocation: '',  // 地址
          eventConfirmType: 2, // 提醒方式
          eventConfirmDayType: 1,// 提醒方式 的时间
          eventRemark: '', // 时间备注
          reportType: 1, // 定期报告
          performanceReport: '业绩预报',
          inviterNumbers: '' // 邀请人号码列表
        }
        this.$nextTick(() => {
          this.addressSlots.forEach((key) => {
            if (key.value == this.addressProvince[1]) {
              this.addressObj = key;
            }
          });
          console.log('1234', this.addressObj);
          this.submission.eventTemplateId = this.addressObj.value;
          this.submission.eventTemplateName = this.addressObj.name;
          this.submission.eventTemplateType = this.addressObj.eventTemplateType;
          this.submission.eventName = this.addressObj.nameSample;
          if (this.addressObj.nameSample.indexOf('XXXX') > -1) {
            let year = new Date().getFullYear();
            this.submission.eventName = this.addressObj.nameSample.replace(/XXXX/i, year);
          }
          this.eventPlaceholder.eventName = '请输入事件名称';
          if (this.addressObj.parent == '自定义') {
            this.navbar[1].show = false;
          } else {
            this.navbar[1].show = true;
          }

          /*每次切换就将this.incidentText 重置*/
          this.incidentText = {
            /* *
            * @T: 会议日期
            * @R: 股权登记日
            * @B: 定期报告：年度报告/一季报/半年报/三季报
            * @P: 披露日期
            * @Y: 业绩报告：业绩预告 / 业绩快报  \/\
            * @C: 差异化分红送转：是 / 否
            * @SE: 日常事件开始时间，结束时间
            * */
            eventSDate: '请选择', // @T
            eventTDate: '请选择', // @T
            eventRDate: '请选择', // @R
            reportType: 1, // @B
            performanceReport: 5, // @Y
            eventPDate: '请选择', // @P
            choseBonus: false, // @C
            prevDate: '请选择', // @SE
            nextDate: '请选择', // @SE
          };
          //
          this.warnListData = {
            eventName: false,
            nextprevDate: false,
            calendar: false,
            eventTDate: false,
            eventRDate: false,
            eventSDate: false,
            performanceReport: false
          };
          //
          this.warnListDataText = {
            eventNameText: '请输入事件名称',
            nextprevDateText: '请选择起止日期',
            calendarText: '请选择日历',
            eventTDateText: '请选择会议日期',
            eventSDateText: '请选择会议日期',
            eventPDateText: '请选择披露日期',
            eventRDateText: '请选择股权登记日',
            performanceReportText: '请选择业绩报告'
          };
          this.submission.eventRemark = this.addressObj.about;
          this.warnListDataText.eventTDateText = `请选择${this.addressObj.valueListMap['T']}`;
          this.warnListDataText.eventRDateText = `请选择${this.addressObj.valueListMap['R']}`;
          this.warnListDataText.eventSDateText = `请选择${this.addressObj.valueListMap['S']}`;
          this.warnListDataText.eventPDateText = `请选择${this.addressObj.valueListMap['P']}`;
          this.warnListDataText.performanceReportText = `请选择${this.addressObj.valueListMap['Y']}`;
        })
      },
      // 获取日历模板
      getTemplateList() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.calendar.getTemplateList,
          params: {}
        })*/
        this.$axios.calendar.getTemplateList().then((res) => {
          // console.log('api', res.data.returnObject);
          if (res.data.returnCode == 1) {
            let reg = res.data.returnObject.normal;
            let h = res.data.returnObject.sh_a;
            let s = res.data.returnObject.sz;
            let arr = [
              {name: '自定义', value: '自定义', parent: 0},
              {name: '沪市', value: '沪市', parent: 0},
              {name: '深市', value: '深市', parent: 0},
            ];
            let regX = reg.map((e) => {
              return {name: e.value, value: e.id, parent: '自定义', eventTemplateType: e.eventTemplateType, lable: e.lable}
            })
            let hX = h.map((e) => {
              return {name: e.value, value: e.id, parent: '沪市', eventTemplateType: e.eventTemplateType, lable: e.lable}
            })
            let lastHx = hX[hX.length - 1];
            hX.pop();
            hX.unshift(lastHx);
            let sX = s.map((e) => {
              return {name: e.value, value: e.id, parent: '深市', eventTemplateType: e.eventTemplateType, lable: e.lable}
            });
            let lastSx = sX[sX.length - 1];
            sX.pop();
            sX.unshift(lastSx);
            arr = arr.concat(regX, hX, sX);
            console.log('234324', arr);
            //
            this.$nextTick(() => {
              arr.forEach((k1, i1) => {
                this.eventTemplate.forEach((k2, i2) => {
                  if (k1.eventTemplateType == k2.id) {
                    k1.valueList = k2.valueList;
                    k1.nameSample = k2.nameSample;
                    k1.valueListMap = k2.valueListMap;
                    k1.type = k2.type;
                    k1.about = k2.about;
                  }
                })
              })
              this.addressSlots = arr;
              console.log('addressSlots', this.addressSlots);
            })
          } else if (res.data.returnCode == -1) {

          }
        }).catch((err) => {

        })
      },
      //
      toCalendarFrequency(index) {
        if (this.eventContainList[index].eventConfirmFrequency == 1) {
          this.eventContainList[index].eventConfirmFrequency = 0;
        } else {
          this.eventContainList[index].eventConfirmFrequency = 1;
        }
        console.log('123', this.eventContainList[index]);
      },
      //
      pickerSubmit() {
        this.visible = false;
      },
      //
      pickerClose() {
        this.visible = false;
      },
      //
      switchClick(index) {
        this.active = this.navbar[index].data;
        console.log(index, this.active);
      }
    }
  }
</script>

<style lang="scss">

  .fade-enter-active, .fade-leave-active {
    transition: .3s;
  }
  .fade-enter, .fade-leave-to {
    -webkit-transform: translate3d(0, 100%, 0);
    transform: translate3d(0, 100%, 0)
  }
  .xiao-picker.popuppic {
    height: 100%;
    width: 100%;
    .box {
      font-size: 15px;
      vertical-align: middle;
      color: #000;
      margin: 0;
      height: auto;
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 0;
      z-index: 9901;
      overflow: hidden;
      .area_btn_box {
        display: -webkit-box;
        display: -webkit-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-pack: justify;
        -webkit-justify-content: space-between;
        -ms-flex-pack: justify;
        justify-content: space-between;
        -webkit-box-align: stretch;
        -webkit-align-items: stretch;
        -ms-flex-align: stretch;
        align-items: stretch;
        background-color: #FFFFFF;
        background-image: linear-gradient(to bottom, #e7e7e7, #e7e7e7, transparent, transparent);
        background-position: bottom;
        background-size: 100% 0.026667rem;
        background-repeat: no-repeat;
        position: relative;
        height: 44px;
        line-height: 44px;
        padding: 0 12px;
        &:before, &:after {
          content: '';
          position: absolute;
          height: 1px;
          width: 100%;
          display: block;
          background-color: #e3e3e3;
          z-index: 15;
          -webkit-transform: scaleY(0.33);
          transform: scaleY(0.33)
        }
        &:before {
          left: 0;
          top: 0;
          -webkit-transform-origin: 50% 20%;
          transform-origin: 50% 20%
        }
        &:after {
          left: 0;
          bottom: 0;
          -webkit-transform-origin: 50% 70%;
          transform-origin: 50% 70%
        }
        .area_btn {
          font-size: 15px;
          text-align: center;
        }
        .larea_cancel {
          color: #828282;
        }
        .larea_finish {
          color: #ffb148;
        }
      }
    }
    .vux-flexbox .vux-flexbox-item:first-child {
      flex: 0.5;
    }
    .area_Box {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 8000;
      background-color: rgba(0, 0, 0, 0.5);
    }
    .area_btn_content {
      position: relative;
      text-align: center;
      .vux-picker {
        .vux-flexbox.vux-flex-row {
          background-color: #d5d8df;
        }
      }
    }
  }
  .add-calendar-items {
    height: 100%;
    width: 100%;
    background-color: #f0f1f5;
    overflow: hidden;
    #pickers {
      .area_ctrl {
        .area_btn.larea_cancel {
          font-size: 15px;
        }
        .area_btn.larea_finish {
          font-size: 15px;
        }
      }
      .area_roll_mask {
        .area_roll {
          .gear {
            .tooth {
              font-size: 15px;
            }
          }
        }
      }
    }
    .nav {
      width: 100%;
      box-sizing: border-box;
      background-color: rgba(255, 255, 255, 1);
      white-space: nowrap;
      padding: 0;
      .vux-tab {
        .vux-tab-item.vux-tab-selected {
          border-color: #ffb148;
          font-family: PingFangSC-Medium, sans-serif;
          color: #ffb148;
        }
        .vux-tab-ink-bar {
          .vux-tab-bar-inner {
            background-color: #ffb148;
          }
        }
      }
    }
    .tab-container {
      width: 100%;
      height: auto;
      overflow: hidden;
      * {
        box-sizing: border-box;
      }
      .vux-slider {
        height: 100%;
      }
      .box {
        height: 100%;
        width: 100%;
        overflow: hidden;
        .back-item {
          height: 100%;
          width: 100%;
          background-color: #fff;
          color: #e3e3e3;
          overflow-y: scroll;
          overflow-x: hidden;
          -webkit-overflow-scrolling: touch;
          .back-item-node {
            ul.calendar-all-body-ul {
              width: 100%;
              padding: 0 12px 12px 12px;
              box-sizing: border-box;
              background-color: #FFFFFF;
              li.calendar-all-body-li {
                background-color: transparent;
                color: #545454;
                padding-top: 10px;
                border-radius: 5px;
                &:last-child {
                  padding-bottom: 10px;
                }
                .li-top {
                  display: table;
                  padding-bottom: 5px;
                  width: 100%;
                  .flex {
                    display: table-cell;
                    vertical-align: middle;
                  }
                  .li-top-left {
                    .li-top-left-day {
                      font-size: 21px;
                      line-height: 1;
                    }
                    .li-top-left-month {
                      font-size: 15px;
                    }
                    .li-top-set {
                      display: inline-block;
                      height: 17px;
                      width: 17px;
                      border-radius: 50%;
                      background-color: #849fee;
                      color: #FFFFFF;
                      font-size: 10px;
                      text-align: center;
                      vertical-align: top;
                    }
                    .li-top-left-cue {
                      width: 16px;
                      display: inline-block;
                      height: 16px;
                      font-size: 0;
                      text-align: center;
                      align-items: center;
                      position: relative;
                      bottom: 3px;
                      span {
                        display: inline-block;
                        width: 16px;
                        border-radius: 50%;
                        height: 16px;
                        font-size: 12px;
                        line-height: 16px;
                        text-align: center;
                        color: #FFFFFF;
                        background-color: #fa4319;
                        padding: 0;
                        margin: 0;
                      }
                    }
                  }
                  .li-top-right {
                    text-align: right;
                    position: relative;
                    width: 10%;
                    i {
                      position: absolute;
                      top: 50%;
                      right: 1px;
                      transform: translateY(-50%);
                      height: 15px;
                    }
                    i.color {
                      color: #ffb148;
                    }
                  }
                }
                .li-bottom {
                  padding-top: 5px;
                  .li-bottom-top {
                    line-height: 1;
                    padding-bottom: 3px;
                    font-size: 14px;
                    color: #aeaeae;
                  }
                  .li-bottom-bot {
                    font-size: 12px;
                    line-height: 1;
                    color: #aeaeae;
                    display: flex;
                    .li-bottom-bot-left {
                      flex: 1;
                    }
                    .li-bottom-bot-right {
                      flex: 1;
                      text-align: right;
                      i {
                        font-size: 12px;
                        padding-left: 5px;
                      }
                    }
                  }
                }
              }
              .back-node-calendar-box {
                position: relative;
                /*margin: 12px 0;*/
                .line {
                  display: inline-block;
                  position: absolute;
                  top: 50%;
                  transform: translate(-45%, -50%);
                  border-radius: 50%;
                  width: 12px;
                  height: 12px;
                  border: 0.5px solid #aeaeae;
                  &:before {
                    content: "";
                    border-radius: 50%;
                    position: absolute;
                    left: 50%;
                    top: 50%;
                    transform: translateY(-50%) translateX(-50%);
                    width: 3px;
                    height: 3px;
                    border: 0.5px solid #aeaeae;
                    background-color: #aeaeae;
                  }
                }
                &:before {
                  content: '';
                  height: 200%;
                  width: 1px;
                  position: absolute;
                  display: inline-block;
                  left: 0;
                  top: -100%;
                  transform: scale(0.5);
                  background-color: #aeaeae;
                }
                .eventContent {
                  margin: 0 0 0 20px;
                  padding: 10px 8px;
                  border-top: 2px solid #ffb148;
                  border-radius: 5px;
                  -webkit-box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
                  box-shadow: 1px 1px 1px rgba(0, 0, 0, .1);
                  background-color: #fff8ee;
                  font-size: 14px;
                  position: relative;

                  .text-black4 {
                  }
                }
                .eventContent.color {
                  background-color: #f9f9f9;
                  border: 0;
                }
              }
            }
          }
          .back-item-invited {
            .back-invited-head {
              height: 45px;
              width: 100%;
              display: table;
              background-color: #f0f1f5;
              padding: 0 12px;
              .invited-cell {
                display: table-cell;
                vertical-align: middle;
                input {
                  height: 30px;
                  text-align: left;
                  font-size: 14px;
                  border: 1px solid transparent;
                  background-color: #FFFFFF;
                  width: 100%;
                  padding: 0 10px;
                  color: #8d8d8d;
                }
                button {
                  height: 30px;
                  font-size: 14px;
                  border: 1px solid transparent;
                  background-color: #FFFFFF;
                  color: #ffb148;
                  padding: 0 5px;
                  text-align: right;
                }
              }
              .invited-cell.left {
                text-align: left;
                width: 85%;
              }
              .invited-cell.right {
                text-align: right;
                width: 15%;
              }
            }
            .back-invited-body {
              .invited-li-cell {
                padding: 0 12px;
                height: 50px;
                width: 100%;
                display: table;
                .invited-li-val {
                  display: table-cell;
                  vertical-align: middle;
                  img {
                    height: 35px;
                    width: 35px;
                    text-align: center;
                    border-radius: 50%;
                    border-color: transparent;
                  }
                  span {
                    font-size: 14px;
                    line-height: 1;
                    color: #8d8d8d;
                  }
                }
                .invited-li-val.Left {
                  line-height: 1;
                  width: 40px;
                }
                .invited-li-val.Right {
                }
              }
              .invited-li-cell.cell-solid {
                position: relative;
                &:after {
                  content: '';
                  position: absolute;
                  height: 1px;
                  width: 100%;
                  display: block;
                  background-color: #e3e3e3;
                  z-index: 15;
                  -webkit-transform: scaleY(0.33);
                  transform: scaleY(0.33)
                }
                &:after {
                  left: 0;
                  bottom: 0;
                  -webkit-transform-origin: 50% 70%;
                  transform-origin: 50% 70%
                }
              }
            }
          }
          .back-item-box {
            padding: 12px 12px 0 12px;
            width: 100%;
            background-color: #FFFFFF;
            > div {
              padding-top: 1px;
            }
            .warn {
              width: 100%;
              min-height: 17px;
              padding-left: 27%;
              color: #fb4319;
            }
            .warn.opacityColor {
              opacity: 0;
              background-color: transparent;
              color: transparent;
            }
            .back-item-ul {
              display: table;
              width: 100%;
              li {
                display: table-cell;
                font-size: 15px;
                color: #545454;
                vertical-align: middle;
              }
              .title {
                width: 25%;
                text-align: right;
                span {
                  color: #ffb148;
                }
              }
              .right-value {
                padding-left: 10px;
                input {
                  /*outline: none;*/
                }
                > div {
                  border-radius: 2px;
                  width: 100%;
                  height: 40px;
                  border: 0.5px solid #e3e3e3;
                  display: table;
                  padding: 1px;
                  span {
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 15px;
                    text-align: left;
                    padding-left: 10px;
                    color: #8d8d8d;
                    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
                  }
                  .v-png {
                    font-size: 0;
                    line-height: 1;
                    text-align: right;
                    padding: 0 10px 0 0;
                    width: 15%;
                    img {
                      height: 17px;
                      font-size: 0;
                      line-height: 1;
                    }
                  }
                }
                > div.select {
                  height: 40px;
                  width: 100%;
                  font-size: 15px;
                  padding: 3px;
                  text-align: center;
                  position: relative;
                  img {
                    height: 17px;
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                  }
                  select {
                    -webkit-appearance: none;
                    border: 0;
                    background-color: white;
                    height: 100%;
                    width: 100%;
                    font-size: 15px;
                    color: #8d8d8d;
                    padding: 0 10px;
                    outline: none;
                    position: relative;
                    /*text-align: center;*/

                  }
                }
                .date-all {
                  display: table;
                  height: 40px;
                  width: 100%;
                  position: relative;
                  padding: 0 2px;
                  i {
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 15px;
                    line-height: 1;
                  }
                  label {
                    height: 100%;
                    width: 48%;
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 15px;
                    text-align: center;
                    z-index: 200;
                    background-color: white;
                    color: #8d8d8d;
                    b {
                      height: 40px;
                      line-height: 40px;
                    }
                  }
                  label.labelO {
                    left: 0;
                  }
                  label.labelT {
                    right: 0;
                  }
                  .data {
                    display: table-cell;
                    vertical-align: middle;
                    text-align: center;
                    height: 35px;
                    /*line-height: 1;*/
                    width: 48%;
                    font-size: 15px;
                    border: 1px solid #FFFFFF;
                    /*----------用来移除向下箭头----------*/
                    &::-webkit-calendar-picker-indicator {
                      display: none;
                    }
                    /*----------用来移除叉叉按钮----------*/
                    &::-webkit-clear-button {
                      display: none;
                    }
                  }
                }
                .date-all.addressObj {
                  .data {
                    width: 100%;
                  }
                  label {
                    width: 100%;
                    padding: 0 10px;
                    text-align: left;
                  }
                  img {
                    height: 17px;
                    width: auto;
                    position: absolute;
                    top: 50%;
                    right: 10px;
                    transform: translateY(-50%);
                  }
                }
              }
              .textarea {
                height: 130px;
                width: 100%;
                padding: 10px;
                border: 0.5px solid #e3e3e3;
                border-radius: 2px;
                resize: none;
                overflow-y: scroll;
                -webkit-overflow-scrolling: touch;
                outline: none;
                min-height: 75px;
                font-size: 15px;
                color: #8d8d8d;
              }
              .text {
                height: 40px;
                width: 100%;
                font-size: 15px;
                border: 0.5px solid #e3e3e3;
                border-radius: 2px;
                padding: 0 10px;
                color: #8d8d8d;
              }
            }
            .back-item-ul.v-textarea {
              li {
                vertical-align: top;
              }
            }
          }
          .back-item-box.bottom {
            .back-item-ul {
              .title {
                padding-right: 8px;
              }
              .right-value {
                .all-select {
                  font-size: 15px;
                  display: table;
                  padding: 1px;
                  .all-select-list {
                    display: table-cell;
                    width: 50%;
                    vertical-align: middle;
                    position: relative;
                    select {
                      -webkit-appearance: none;
                      width: 100%;
                      height: 100%;
                      font-size: 15px;
                      color: #8d8d8d;
                      padding: 0 10px;
                      border-color: transparent;
                      background-color: white;
                      /*text-align: center;*/
                      /*text-align-last: center;*/
                    }
                    img {
                      height: 17px;
                      width: auto;
                      position: absolute;
                      top: 50%;
                      right: 10px;
                      transform: translateY(-50%);
                    }
                  }
                  .all-select-list.select-left {
                  }
                  .all-select-list.select-right {
                  }
                }
              }
            }
          }
          .back-foo {
            height: 8px;
            width: 100%;
            background-color: #f0f1f5;
          }
        }
        .back-item.back-node-color {
          // background-color: #f0f1f5;
        }
      }
    }
    .add-calendar-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      height: 50px;
      width: 100%;
      display: flex;
      z-index: 100;
      &:before {
        content: '';
        position: absolute;
        height: 1px;
        width: 100%;
        display: block;
        background-color: #e3e3e3;
        z-index: 15;
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
        left: 0;
        top: 0;
        -webkit-transform-origin: 50% 20%;
        transform-origin: 50% 20%
      }
      button {
        flex: 1;
        font-size: 17px;
        background-color: #ffb148;
        color: #FFFFFF;
        border: 0;
        &:first-child {
          background-color: #fff;
          color: #ffb148;
        }
      }
    }
  }
</style>
