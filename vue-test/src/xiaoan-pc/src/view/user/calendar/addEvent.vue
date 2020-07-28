<template>
  <div id="cAddEvent">
    <div class="ctitle">
      <router-link to="/calendar/index" class="back"><i class="el-icon-arrow-left iarrow"></i> 返回</router-link>
      <span v-if="this.eventId">编辑事件</span>
      <span v-else>添加事件</span>
      <!--<el-button class="fright editBtn" type="primary" size="mini" @click="editEvent">编辑</el-button>-->
      <el-button v-if="eventId" class="fright editBtn" size="mini" type="primary" @click="editForm()" :disabled="saveState">保 存</el-button>
      <el-button v-else class="fright editBtn" size="mini" type="primary" @click="submitForm()" :disabled="saveState">保 存</el-button>
    </div>
    <el-form label-width="126px" class="dataForm">
      <div style="width:445px;padding-right: 20px;" class="fleft">
        <div class="eventDetaile">事件详情</div>
        <el-form-item label="事件类型" required>
          <el-cascader style="width:100%" :disabled="!!eventId"
                       expand-trigger="click"
                       :options="selectTempateData"
                       v-model="selectTempateValue"
                       :props="selectProps"
                       @change="selectTemplateChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="事件名称"
                      :class="[{'is-success': errFrom.eventName === 1}, {'is-error': errFrom.eventName === 0}]"
                      required>
          <el-input v-model="dataForm.eventName" spellcheck="false" :placeholder="eventNamePlaceholder"
                    @blur="onblur('eventName')"
                    @focus="oninput('eventName')"></el-input>
          <div v-show="errFrom.eventName===0" class="el-form-item__error">请输入事件名称</div>
        </el-form-item>

        <!--日常事件选项-->
        <el-form-item v-show="templateType===normalEvent" label="事件日期"
                      :class="[{'is-success': errFrom.eventDate === 1}, {'is-error': errFrom.eventDate === 0}]"
                      required>
          <!--<el-input v-model="dataForm.name" spellcheck="false" ></el-input>-->
          <el-date-picker @blur="onblur('eventDate')" @focus="oninput('eventDate')" :editable="false"
                          style="width:100%;"
                          v-model="dataForm.eventDate"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
          <div v-show="errFrom.eventDate===0" class="el-form-item__error">请选择事件日期</div>
          <!--[ "2018-03-06", "2018-04-10" ]-->
        </el-form-item>

        <!--模板事件选项-->
        <el-form-item v-show="eventConfigValue.indexOf('B') > -1" label="定期报告" required>
          <el-select placeholder="请选择" no-data-text="请选择" v-model="dataForm.reportType" @change="reportTypeChange">
            <el-option label="年度报告" :value="1">年度报告</el-option>
            <el-option label="一季报" :value="2">一季报</el-option>
            <el-option label="半年报" :value="3">半年报</el-option>
            <el-option label="三季报" :value="4">三季报</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="eventConfigValue.indexOf('Y') > -1" label="业绩报告" required>
          <el-select placeholder="请选择" no-data-text="请选择" v-model="dataForm.reportType" @change="reportTypeChange">
            <el-option label="业绩预告" :value="5">业绩预告</el-option>
            <el-option label="业绩快报" :value="6">业绩快报</el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="eventConfigValue.indexOf('T') > -1 || eventConfigValue.indexOf('P') > -1"
                      :label="eventConfigValue.indexOf('T') > -1 ? '会议日期' : '披露日期'"
                      :class="[{'is-success': errFrom.eventGddhDate === 1}, {'is-error': errFrom.eventGddhDate === 0}]"
                      required>

          <el-date-picker v-model="dataForm.eventGddhDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                          :disabled="!dataForm.calendarId" :editable="false"
                          @blur="onblur('eventGddhDate')" @focus="oninput('eventGddhDate')" @change="checkSelectData"
                          style="width:100%;"></el-date-picker>
          <div v-show="errFrom.eventGddhDate===0 && !dataForm.eventGddhDate" class="el-form-item__error">
            请选择{{ eventConfigValue.indexOf('T') > -1 ? '会议日期' : '披露日期'}}
          </div>
          <div v-show="errorTData && errFrom.eventGddhDate!==0 && eventConfigValue.indexOf('T') > -1"
               class="el-form-item__error" style="width: 300px;line-height: 16px">{{errorTData}}
          </div>
          <div v-show="reportDateErr && errFrom.eventGddhDate!==0 && eventConfigValue.indexOf('P') > -1"
               class="el-form-item__error" style="width: 300px;line-height: 16px">{{reportDateErr}}
          </div>

        </el-form-item>
        <el-form-item v-show="eventConfigValue.indexOf('R') > -1" label="股权登记日"
                      :class="[{'is-success': errFrom.eventGqdjDate === 1}, {'is-error': errFrom.eventGqdjDate === 0}]"
                      required>
          <el-date-picker v-model="dataForm.eventGqdjDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                          :disabled="!dataForm.eventGddhDate" :editable="false"
                          @blur="onblur('eventGqdjDate')" @focus="oninput('eventGqdjDate')" @change="checkSelectData"
                          style="width:100%;"></el-date-picker>
          <div v-show="errFrom.eventGqdjDate===0" class="el-form-item__error">请选择股权登记日</div>
          <div v-show="errorRData && errFrom.eventGqdjDate!==0" class="el-form-item__error"
               style="width: 300px;line-height: 16px">{{errorRData}}
          </div>
        </el-form-item>

        <!--回购股份（集中竞价方式）-->
        <el-form-item v-show="eventConfigValue.indexOf('HG') > -1" label="董事会召开日"
                      :class="[{'is-success': errFrom.hgTDate === 1}, {'is-error': errFrom.hgTDate === 0}]" required>
          <el-date-picker v-model="dataForm.hgTDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :editable="false"
                          @blur="onblur('hgTDate')" @focus="oninput('hgTDate')" @change="checkHgDate"
                          style="width:100%;"></el-date-picker>
          <div v-show="errFrom.hgTDate" class="el-form-item__error">{{errFrom.hgTDate}}</div>
        </el-form-item>

        <el-form-item v-show="eventConfigValue.indexOf('HG') > -1" label="股东大会召开日"
                      :class="[{'is-success': errFrom.hgSDate === 1}, {'is-error': errFrom.hgSDate === 0}]" required>
          <el-date-picker v-model="dataForm.hgSDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                          :disabled="!dataForm.hgTDate" :editable="false" @change="checkHgDate"
                          @blur="onblur('hgSDate')" @focus="oninput('hgSDate')"
                          style="width:100%;"></el-date-picker>
          <div v-show="errFrom.hgSDate" class="el-form-item__error">{{errFrom.hgSDate}}</div>
        </el-form-item>

        <el-form-item v-show="eventConfigValue.indexOf('HG') > -1" label="回购股份届满日"
                      :class="[{'is-success': errFrom.hgRDate === 1}, {'is-error': errFrom.hgRDate === 0}]" required>
          <el-date-picker v-model="dataForm.hgRDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"
                          :disabled="!dataForm.hgSDate || !!errFrom.hgSDate" :editable="false" @change="checkHgDate"
                          @blur="onblur('hgRDate')" @focus="oninput('hgRDate')"
                          style="width:100%;"></el-date-picker>
          <div v-show="errFrom.hgRDate" class="el-form-item__error">{{errFrom.hgRDate}}</div>
        </el-form-item>



        <el-form-item v-show="eventConfigValue.indexOf('C') > -1" label="差异化分红送转" required>
          <el-select placeholder="请选择" no-data-text="请选择" v-model="dataForm.choseBonused"
                     @change="checkSelectChoseBonused">
            <el-option label="是" :value="1">是</el-option>
            <el-option label="否" :value="0">否</el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="我的日历" :class="[{'is-success': errFrom.calendarId === 1}]" required>
          <el-select v-model="dataForm.calendarId" placeholder="请选择" no-data-text="请选择" @change="onblur('position')">
            <el-option v-for="item in myCalendarList" :key="item.id" :label="item.calendarName" :value="item.id">
              <span
                style="display: inline-block;width:8px;height: 8px;border-radius: 50%;background-color: #ffb148;margin-right: 5px;"
                v-bind:style="{backgroundColor: '#' + item.calendarColor}"></span>
              <span>{{ item.calendarName }}</span>
            </el-option>
          </el-select>
          <div v-show="errFrom.calendarId===0" class="el-form-item__error">请选择日历</div>
        </el-form-item>
        <el-form-item label="地　　点"
                      :class="[{'is-success': errFrom.eventLocation === 1}, {'is-error': errFrom.eventLocation === 0}]"
                      required class="hiddenreqired">
          <el-input v-model="dataForm.eventLocation" placeholder="请输入地点" spellcheck="false"
                    @blur="onblur('eventLocation')" @focus="oninput('eventLocation')"></el-input>
          <div v-show="errFrom.eventLocation===0" class="el-form-item__error">请输入活动名称</div>
        </el-form-item>

        <el-form-item label="提　　醒" required class="hiddenreqired">
          <el-col :span="12" class="space">
            <el-form-item :class="[{'is-success': errFrom.name === 1}]">
              <el-select v-model="dataForm.eventConfirmType" placeholder="请选择" @change="eventConfirmTypeChange"
                         @blur="onblur('companyTypeOne')">
                <el-option v-for="item in eventConfirmType" :key="item.id" :label="item.name" :value="item.id">
                  {{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item :class="[{'is-success': errFrom.name === 1}]">
              <el-select v-model="dataForm.eventConfirmDayType" placeholder="请选择" @blur="onblur('companyTypeTwo')">
                <el-option v-for="item in eventConfirmDayType" :key="item.id" :label="item.name" :value="item.id">
                  {{item.name}}
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="备　　注"
                      :class="[{'is-success': errFrom.eventremark === 1}, {'is-error': errFrom.eventremark === 0}]"
                      required class="hiddenreqired">
          <el-input type="textarea" placeholder="请输入备注" v-model="dataForm.eventremark" :rows="4"></el-input>
          <div v-show="errFrom.eventremark===0" class="el-form-item__error">请输入备注</div>
        </el-form-item>
      </div>
      <div style="width:450px; border-left:1px solid #e3e3e3;min-height: 600px;" class="fright">
        <el-tabs v-model="activeTab" class="ctabs">
          <el-tab-pane label="事件节点" name="1" v-if="this.templateType!==normalEvent">
            <div v-if="eventContainList.length>0">
              <div class="eventNode" v-for="(item,index) in eventContainList" :key="index"
                   :class="[{'overdue': judgeDate(item.eventBeginDate, item.eventEndDate) == 0,'dateNow': judgeDate(item.eventBeginDate, item.eventEndDate) == 1}]">
                <div class="line">
                  <span class="s1"></span>
                </div>
                <div class="eventContent">
                  <div>
                    <template v-if="item.eventBeginDate!=item.eventEndDate">
                      <span class="text-black2" v-if="item.eventBeginDate">{{ msToTransTime(item.eventBeginDate)
                        }}</span>
                      <span class="text-black2" v-if="item.eventBeginDate && item.eventEndDate">~</span>
                      <span class="text-black2" v-if="item.eventEndDate">{{ msToTransTime(item.eventEndDate) }}</span>
                    </template>
                    <template v-else>
                      <span class="text-black2" v-if="item.eventBeginDate">{{ msToTransTime(item.eventBeginDate)
                        }}</span>
                    </template>
                    <span class="today">今日</span>
                    <!--<i class="icon iconfont web-tixing fright"></i>-->
                    <i class="iconfont web-tixing fright" :class="{isRemind: item.eventConfirmFrequency === 1}"
                       v-if="item.eventConfirmFrequency!=null"
                       @click="editEventContainList(index)"></i>
                  </div>
                  <div class="text-black4">{{item.eventName}}</div>
                </div>
              </div>
            </div>
            <div v-else class="text-black3">请先填写事件相关信息</div>
          </el-tab-pane>
          <el-tab-pane label="通知对象" name="2">
            <div>
              <el-input class="inputTel" v-model="dataForm.inviterNumber" spellcheck="false"
                        placeholder="请输入对方手机号，最多邀请10个"></el-input>
              <el-button v-if="eventId" class="addTelBtn" @click="editInviteList">添加</el-button>
              <el-button v-else class="addTelBtn" @click="addInviteList">添加</el-button>
              <!--编辑-->
              <ul class="cul" v-if="eventId">
                <li v-for="(item,index) in dataForm.inviterNumberList" :key="index">
                  <img v-if="item.avatar" :src="item.avatar">
                  <img :src="$image.user.calendar.headerImg" v-else>
                  <span class="tel">{{item.mobile}}</span>
                  <i class="iconfont web-shanchu" @click="removeInviteList(index,item)"></i>
                </li>
              </ul>
              <!--添加-->
              <ul class="cul" v-else>
                <li v-for="(item,index) in dataForm.inviterNumberList"
                    :key="index">
                  <img v-if="item.avatar" :src="item.avatar">
                  <img :src="$image.user.calendar.headerImg" v-else>
                  <span class="tel">{{item.mobile}}</span>
                  <i class="iconfont web-shanchu" @click="removeInviteList(index,item)"></i>
                </li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        saveState: false,
        allCloseDate: '',
        normalEvent: 'normal',
        eventId: '',
        eventType: '',
        eventNamePlaceholder: '请输入事件名称',
        dataForm: {
          'name': '',
          // 常规事件
          'eventName': '',
          'eventTemplateId': '',
          'eventTemplateName': '',
          'calendarId': '',
          'calendarName': '',
          'myCalendar': '1-600001',
          'eventDate': '',  // 含开始，结束时间
//          'eventBeginDate': '',
//          'eventEndDate': '',
          'eventLocation': '',
          'eventConfirmType': 2,
          'eventConfirmDayType': 1,
          'eventremark': '',
          'inviterNumber': '',
          'inviterNumbers': [],
          'userId': '',

          // 模板事件
          reportType: 1,
          choseBonused: 0,
          'eventGddhDate': '',
          'eventGqdjDate': '',
          hgTDate: '',
          hgSDate: '',
          hgRDate: '',
          'eventConfirmFrequency': '',
          'eventContainList': '',
          inviterNumberList: []
        },
        errFrom: {
          'name': '',
          'eventName': '',
          'eventDate': '',
          'calendarId': '',
          'eventGddhDate': '',
          'eventGqdjDate': '',
          hgTDate: '',
          hgSDate: '',
          hgRDate: ''
        },
        eventTemplateList: [],
        eventTemplateListAll: [],
        myCalendarList: [],
        eventConfirmType: [{'id': 0, 'name': '无'}, {'id': 1, 'name': '微信'}, {'id': 2, 'name': '短信'}, {
          'id': 3,
          'name': '电子邮件'
        }],
        eventConfirmDayType: [{'id': 1, 'name': '当日提醒'}, {'id': 2, 'name': '提前一天提醒'}],
        eventConfirmDayTypeTixin: [{'id': 1, 'name': '当日提醒'}, {'id': 2, 'name': '提前一天提醒'}],
        eventConfirmDayTypeNone: [{'id': 0, 'name': '无'}],
        // eventTemplateCategory: [{'type': 'normal', 'name': '自定义事件'}, {'type': 'sh_a', 'name': '沪市'}, {'type': 'sz', 'name': '深市'}],
        selectTempateData: [
          {id: 'normal', value: '自定义事件'},
          {id: 'sh_a', value: '沪市', children: []},
          {id: 'sz', value: '深市', children: []}
        ],
        colorArr: [
          {id: '0', value: '#9f2956'},
          {id: '1', value: '#e25e32'},
          {id: '2', value: '#e6cb59'},
          {id: '3', value: '#377f48'},
          {id: '4', value: '#4250af'},
          {id: '5', value: '#822ea4'},
          {id: '6', value: '#c73560'},
          {id: '7', value: '#df742c'},
          {id: '8', value: '#c2ca50'},
          {id: '9', value: '#419388'},
          {id: '10', value: '#7b85c6'},
          {id: '11', value: '#73564a'},
          {id: '12', value: '#c42b1b'},
          {id: '13', value: '#e39735'},
          {id: '14', value: '#88b152'},
          {id: '15', value: '#4498df'},
          {id: '16', value: '#af9ed7'},
          {id: '17', value: '#616161'},
          {id: '18', value: '#d88276'},
          {id: '19', value: '#eec14b'},
          {id: '20', value: '#5db37e'},
          {id: '21', value: '#4e82f4'},
          {id: '22', value: '#966bab'},
          {id: '23', value: '#a59b8f'}
        ],
        eventTemplateConfig: [],
        eventConfigValue: '',
        selectProps: {value: 'id', label: 'value', children: 'children'},
        selectTempateValue: [],
        templateType: 'normal',
        positionList: [],
        eventContainList: [], // 事件节点信息
        // eventContainListEdit: [], // 修改后的信息
        stype: '',
        activeTab: '2',
        errorRData: '',
        eventTemplateType: '',
        reportDateErr: '', // 季报，业绩报告错误提示信息
        errorTData: '', // 会议日期错误提示，非交易日，周末
        userInfo: {},
        marketType: ''
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      // 判断沪深
      this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
      console.log(this.userInfo)
      this.checkMarkType()
      this.eventTemplateConfig = this.$config.eventTemplateConfig
      this.eventId = this.$route.query.id
      this.eventType = this.$route.query.eventType // 0日常事件，1模板事件

//      this.getTemplateList()  // 获取模板列表
//      this.getCalendarByUserId() // 获取自己的日历
//      this.getAllCloseDate() // 获取休息日
      this.initData()
    },
    mounted() {
      // this.judgeDate()
      // console.log('-=-=-=', this.$route)
      if (this.$route.query.i) {
        var timearr = this.$common.transTime(this.$route.query.i)[1]
        // console.log(timearr)
        this.dataForm.eventDate = [timearr, timearr]
      }
    },
    // 方法
    methods: {
      // 初始化数据 并发请求
      initData() {
        // 获取自己的日历
        let getCalendarByUserId = this.$http({
          method: 'GET',
          url: this.$api.calendar.getCalendarByUserId,
          params: {
            userId: this.$cookie.get('userId')
          }
        })
        // 获取模板列表
        let getTemplateList = this.$http({
          method: 'GET',
          url: this.$api.calendar.getTemplateList,
          params: {}
        })
        let _this = this
        this.$http.all([getCalendarByUserId, getTemplateList]).then(this.$http.spread((res1, res2) => {
          this.getCalendarByUserId(res1)
          this.getTemplateList(res2)
          // 获取事件详情
          if (this.eventId) {
            document.title = '编辑事件'
            if (this.eventType == '0') {
              this.templateType = 'normal'
              this.bindData()
            } else if (this.eventType == '1') {
              this.templateType = 'sh_a'
              this.bindTemplateData()
            } else if (this.eventType == '2') {
              this.templateType = 'sz'
              this.bindTemplateData()
            }
          }
        }))
      },
      // 日间判断
      judgeDate(startTime, endTime) {
        if (!startTime && !endTime) {
          return 0
        }
        let now = new Date()
        let nowDate = now.getFullYear() + '/' + (now.getMonth() + 1) + '/' + now.getDate()
        let todayStart = (new Date(nowDate + ' 00:00:00')).getTime()
        let todayEnd = (new Date(nowDate + ' 23:59:59')).getTime()
        // console.log('t:' + todayStart, 'e:' + todayEnd)
        if (endTime) {
          if (endTime < todayStart) {
            return 0 // 过期
          }
          if (!startTime && (endTime > todayStart)) {
            return 2
          }
        }
        if (startTime) {
          if (startTime > todayEnd) {
            return 2 // 未来
          }
          if (!endTime && (startTime < todayStart)) {
            return 0
          }
        }
        return 1 // 现在
      },
      msToTransTime(ms) {
        if (!ms) return ''
        return this.$common.transTime(ms)[0]
      },
      checkAll() {
        let allkey = []
        if (this.templateType === this.normalEvent) {
          allkey = ['eventName', 'eventDate', 'calendarId']
        } else {
          if (this.eventConfigValue.indexOf('HG') > -1) {
            allkey = ['eventName', 'calendarId']
          } else {
            allkey = ['eventName', 'eventGddhDate', 'eventGqdjDate', 'calendarId']
          }
        }
        for (let i = 0; i < allkey.length; i++) {
          this.onblur(allkey[i])
        }
        if (this.templateType === this.normalEvent) {
          if (this.errFrom.eventName === 0 || this.errFrom.eventDate === 0 || this.errFrom.calendarId === 0) {
            return false
          } else {
            return true
          }
        } else {
          // 如果模板事件不需要 股权登记日，则设置为验证通过
          if (this.eventConfigValue.indexOf('T') > -1 && this.errFrom.eventGddhDate === 0) {
            return false
          }
          if (this.eventConfigValue.indexOf('R') > -1 && this.errFrom.eventGqdjDate === 0) {
            return false
          }
          if (this.eventConfigValue.indexOf('HG') > -1) {
            if (!this.dataForm.hgTDate) {
              this.errFrom.hgTDate = '董事会召开日不能为空'
              return false
            } else {
              this.errFrom.hgTDate = ''
            }
            if (!this.dataForm.hgSDate) {
              this.errFrom.hgSDate = '股东大会召开日不能为空'
              return false
            } else {
              this.errFrom.hgSDate = ''
            }
            if (!this.dataForm.hgRDate) {
              this.errFrom.hgRDate = '回购股份届满日不能为空'
              return false
            } else {
              this.errFrom.hgRDate = ''
            }
          }
          if (this.errFrom.eventName === 0 || this.errFrom.calendarId === 0) {
            return false
          } else {
            return true
          }
        }

      },
      onblur(key) {
        if (key === 'eventName') {
          if (this.empty(this.dataForm.eventName)) {
            this.errFrom.eventName = 0
          } else {
            this.errFrom.eventName = 1
          }
        } else if (key === 'eventDate') {
          if (this.empty(this.dataForm.eventDate)) {
            this.errFrom.eventDate = 0
          } else {
            this.errFrom.eventDate = 1
          }
        } else if (key === 'eventGddhDate') {
          if (this.empty(this.dataForm.eventGddhDate)) {
            this.errFrom.eventGddhDate = 0
          } else {
            this.errFrom.eventGddhDate = 1
          }
          this.checkSelectData()
        } else if (key === 'eventGqdjDate') {
          if (this.empty(this.dataForm.eventGqdjDate)) {
            this.errFrom.eventGqdjDate = 0
          } else {
            this.errFrom.eventGqdjDate = 1
          }
          this.checkSelectData()
        } else if (key === 'calendarId') {
          if (!this.dataForm.calendarId) {
            this.errFrom.calendarId = 0
          } else {
            this.errFrom.calendarId = 1
          }
        }
      },
      oninput(key) {
        if (key === 'eventName') {
          this.errFrom.eventName = 2
        } else if (key === 'eventDate') {
          this.errFrom.eventDate = 2
        } else if (key === 'eventGddhDate') {
          this.errFrom.eventGddhDate = 2
        } else if (key === 'eventGqdjDate') {
          this.errorRData = ''
          this.errFrom.eventGqdjDate = 2
        }
      },
      empty(value) {
        if (!value) {
          return true
        } else {
          return this.$regx.blank(value)
        }
      },
      // 模板类型选择
      eventTemplateCategoryChange() {
        this.eventTemplateList = this.eventTemplateListAll[this.templateType]
        this.dataForm.eventTemplateId = this.eventTemplateList[0].id
        this.eventTemplateChange()
      },
      eventTemplateChange() {
        // this.templateType = this.getObjById(id, this.eventTemplateList).order
        if (this.templateType == 'normal') {
          this.activeTab = '2'
        } else {
          this.activeTab = '1'
        }

        this.errFrom.eventName = 1
        this.errFrom.eventDate = 1
        this.errFrom.calendarId = 1
        this.errFrom.eventGddhDate = 1
        this.errFrom.eventGqdjDate = 1
        this.checkSelectData()

      },
      // 事件模板级联选择事件
      selectTemplateChange() {
        // this.eventContainList = []
        console.log('this.selectTempateValue:' + this.selectTempateValue)
        this.templateType = this.selectTempateValue[0]
        this.eventTemplateList = this.eventTemplateListAll[this.templateType]
        if (this.templateType == 'normal') {
          this.activeTab = '2'
          this.dataForm.eventTemplateId = this.eventTemplateListAll.normal[0].id
        } else {
          this.activeTab = '1'
          this.dataForm.eventTemplateId = this.selectTempateValue[1]
        }
        this.eventTemplateType = this.getObjById(this.dataForm.eventTemplateId, this.eventTemplateList).eventTemplateType // 枚举ID
        this.eventConfigValue = this.getObjById(this.eventTemplateType, this.eventTemplateConfig).valueList // 枚举ID获取T,R配置
        this.eventNamePlaceholder = this.getObjById(this.eventTemplateType, this.eventTemplateConfig).nameSample.replace('20XX', (new Date().getFullYear()))
        if (!this.eventId) {
          this.dataForm.eventName = this.eventNamePlaceholder
        }
        console.log('eventConfigValue:' + this.eventConfigValue)

        if (this.eventId) {
          if (this.eventConfigValue.indexOf('Y') > -1 && this.dataForm.reportType == 1) {
            this.dataForm.reportType = 5
          } else if (this.eventConfigValue.indexOf('B') > -1 && this.dataForm.reportType == 5) {
            this.dataForm.reportType = 1
          }
        } else {
          if (this.eventConfigValue.indexOf('Y') > -1) {
            this.dataForm.reportType = 5
          } else if (this.eventConfigValue.indexOf('B') > -1) {
            this.dataForm.reportType = 1
          }
          if (this.eventConfigValue.indexOf('HG') > -1) {
            if (this.eventTemplateType == 20) { // 沪市
              this.dataForm.eventremark = '按照竞价回购业务指引，在上海证券交易所上市公司，回顾股份的实施期限自股东大会审议通过回购股份方案原则上不超过六个月'
            }
            if (this.eventTemplateType == 21) { // 深市
              this.dataForm.eventremark = '按照竞价回购业务指引，在深圳证券交易所上市公司，回顾股份的实施期限自股东大会审议通过回购股份方案原则上不超过十二个月'
            }
          } else {
            this.dataForm.eventremark = ''
          }
          // 重置数据
          this.dataForm.eventGddhDate = ''
          this.dataForm.eventGqdjDate = ''
          this.dataForm.hgTDate = ''
          this.dataForm.hgSDate = ''
          this.dataForm.hgRDate = ''
          this.eventContainList = []
        }

        this.errFrom.eventName = 1
        this.errFrom.eventDate = 1
        this.errFrom.calendarId = 1
        this.errFrom.eventGddhDate = 1
        this.errFrom.eventGqdjDate = 1
        if (!this.eventId) {
          this.checkSelectData()
        }
      },
      // 提醒类型选择
      eventConfirmTypeChange() {
        if (this.dataForm.eventConfirmType === 0) {
          this.eventConfirmDayType = this.eventConfirmDayTypeNone
          this.dataForm.eventConfirmDayType = 0
        } else {
          this.eventConfirmDayType = this.eventConfirmDayTypeTixin
          this.dataForm.eventConfirmDayType = 1
        }
      },
      // 差异化分红送转 选择
      checkSelectChoseBonused() {
        this.checkSelectData()
      },
      // 添加邀请
      addInviteList() {
        if (!this.$regx.telphone(this.dataForm.inviterNumber)) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写正确的手机号'})
          return false
        }
        if (this.dataForm.inviterNumbers.indexOf(this.dataForm.inviterNumber) > -1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '手机号已添加'})
          return false
        }
        if (this.dataForm.inviterNumbers.length < 10) {
          this.$http({
            method: 'GET',
            url: this.$api.calendar.getAvatarByMobile,
            params: {
              mobile: this.dataForm.inviterNumber
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              let data = res.data.returnObject
              this.dataForm.inviterNumberList.push({
                mobile: this.dataForm.inviterNumber,
                avatar: data.avatar
              })
            } else {
              this.dataForm.inviterNumberList.push({
                mobile: this.dataForm.inviterNumber,
                avatar: ''
              })
            }
          })
          this.dataForm.inviterNumbers.push(this.dataForm.inviterNumber)
        } else {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '最多邀请10个'})
        }
      },
      // 编辑邀请人
      editInviteList() {
        if (!this.$regx.telphone(this.dataForm.inviterNumber)) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '请填写正确的手机号'})
          return false
        }
        if (this.dataForm.inviterNumbers.indexOf(this.dataForm.inviterNumber) > -1) {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '手机号已添加'})
          return false
        }
        let eventType = this.eventType == 0 ? 0 : 1
        if (this.dataForm.inviterNumbers.length < 10) {
          this.$http({
            method: 'GET',
            url: this.$api.calendar.checkInviter,
            params: {
              eventId: this.eventId,
              mobile: this.dataForm.inviterNumber,
              eventType: eventType
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.$http({
                method: 'GET',
                url: this.$api.calendar.addInviter,
                params: {
                  eventId: this.eventId,
                  mobile: this.dataForm.inviterNumber,
                  eventType: eventType,
                  userId: this.$cookie.get('userId')
                }
              }).then((res) => {
                if (res.data.returnCode == 1) {
                  this.dataForm.inviterNumberList = res.data.returnObject
                  this.$message({showClose: true, type: 'warning', duration: 3000, message: '添加成功'})
                } else {
                  this.$message({showClose: true, type: 'warning', duration: 3000, message: '添加失败'})
                }
              })
            } else {
              this.$message({showClose: true, type: 'warning', duration: 3000, message: '手机号不合法'})
            }
          })
          this.dataForm.inviterNumbers.push(this.dataForm.inviterNumber)
        } else {
          this.$message({showClose: true, type: 'warning', duration: 3000, message: '最多邀请10个'})
        }
      },
      // 删除邀请
      removeInviteList(index, item) {
        this.$confirm('确定删除吗?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'})
          .then(() => {
            if (this.eventId) {
              let eventType = this.eventType == 0 ? 0 : 1
              this.$http({
                method: 'GET',
                url: this.$api.calendar.deleteInviter,
                params: {
                  eventId: this.eventId,
                  mobile: item.mobile,
                  eventType: eventType
                }
              }).then((res) => {
                if (res.data.returnCode == 1) {
                  this.$message({showClose: true, type: 'warning', duration: 3000, message: '删除成功'})
                  if (this.dataForm.inviterNumberList.length > 0) {
                    this.dataForm.inviterNumberList.splice(index, 1)
                    this.dataForm.inviterNumbers.splice(index, 1)
                  }
                } else {
                  this.$message({showClose: true, type: 'warning', duration: 3000, message: '删除失败'})
                }
              })
            } else {
              if (this.dataForm.inviterNumbers.length > 0) {
                this.dataForm.inviterNumbers.splice(index, 1)
                this.dataForm.inviterNumberList.splice(index, 1)
              }
            }
          }).catch(() => {
        })
      },

      // 获取自己的日历列表
      getCalendarByUserId(res) {
        /* this.$http({
          method: 'GET',
          url: this.$api.calendar.getCalendarByUserId,
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.myCalendarList = res.data.returnObject
            this.dataForm.calendarId = this.myCalendarList[0].id
            for (let i in this.myCalendarList) {
              if (!this.myCalendarList[i].calendarColor) {
                this.myCalendarList[i].calendarColor = this.colorArr[i].value.replace('#', '')
              }
            }
            console.log(this.myCalendarList)
            // 获取事件详情
            if (this.eventId) {
              document.title = '编辑事件'
              if (this.eventType == '0') {
                this.templateType = 'normal'
                this.bindData()
              } else if (this.eventType == '1') {
                this.templateType = 'sh_a'
                this.bindTemplateData()
              } else if (this.eventType == '2') {
                this.templateType = 'sz'
                this.bindTemplateData()
              }
            }
          }
        }) */
        if (res.data.returnCode == 1) {
          this.myCalendarList = res.data.returnObject
          this.dataForm.calendarId = this.myCalendarList[0].id
          for (let i in this.myCalendarList) {
            if (!this.myCalendarList[i].calendarColor) {
              this.myCalendarList[i].calendarColor = this.colorArr[i].value.replace('#', '')
            }
          }
          console.log(this.myCalendarList)
        }
      },
      // 检查季报，业绩预报时间正确性选择框切换
      reportTypeChange() {
        this.reportDateErr = ''
        this.dataForm.eventGddhDate = ''
        console.log('reportTypeChange 清除 eventGddhDate')
      },
      // 检查股东大会召开日和股权登记日 日期选中事件
      checkSelectData() {
        if (!this.dataForm.eventGddhDate) {
          this.dataForm.eventGqdjDate = '';
          this.errorRData = '';
          this.errFrom.eventGqdjDate = 1
        }
        if (!this.dataForm.eventGqdjDate) {
          this.errorRData = '';
          this.errFrom.eventGqdjDate = 1
        }

        // 检查季报，业绩预报时间正确性
        if (this.eventConfigValue.indexOf('P') > -1 && this.dataForm.eventGddhDate) {
          let checkMsg = this.checkTDataMsg(this.dataForm.eventGddhDate)
          if (checkMsg) {
            this.reportDateErr = checkMsg
          } else {
            this.reportDateErr = 0
          }
          if (checkMsg) {
            let eventTDate = this.$common.getTimestampms(this.dataForm.eventGddhDate + ' 00:00:00')
            let eventRDate = 0
            if (this.eventConfigValue.indexOf('R') < 0) {
              eventRDate = 0
            } else {
              if (this.dataForm.eventGqdjDate) {
                eventRDate = this.$common.getTimestampms(this.dataForm.eventGqdjDate + ' 00:00:00')
              } else {
                eventRDate = ''
              }
            }
            this.getEventContainList(eventTDate, eventRDate)
            return
          }
        }

        if (this.dataForm.eventGddhDate) {
          this.checkEventDate()
        }
        if (this.eventConfigValue.indexOf('R') < 0 && this.dataForm.eventGddhDate) {
          this.checkEventDate()
        }

      },
      // 检查股东大会召开日和股权登记日是否合法
      checkEventDate() {
        let eventTDate = this.$common.getTimestampms(this.dataForm.eventGddhDate + ' 00:00:00')
        let eventRDate = 0
        if (this.eventConfigValue.indexOf('R') < 0) {
          eventRDate = 0
        } else {
          if (this.dataForm.eventGqdjDate) {
            eventRDate = this.$common.getTimestampms(this.dataForm.eventGqdjDate + ' 00:00:00')
          } else {
            eventRDate = ''
          }
        }
        this.$http({
          method: 'GET',
          url: this.$api.calendar.checkDate,
          params: {
            userId: this.$cookie.get('userId'),
            templateEventId: this.dataForm.eventTemplateId,
            eventTDate: eventTDate,
            eventRDate: eventRDate == '' ? 0 : eventRDate,
            eventSDate: 0
          }
        }).then((res) => {
          this.getEventContainList(eventTDate, eventRDate)
          if (res.data.returnCode == 1) {
            // this.eventContainList = res.data.returnObject
            this.errorRData = ''
            this.errorTData = ''
          } else {
            let returnMsg = res.data.returnObject
            this.errorRData = returnMsg.R
            this.errorTData = returnMsg.T
            this.reportDateErr = returnMsg.T
            // this.$message({showClose: true, type: 'error', message: res.data.returnMsg})
          }
        })
      },

      // 回购股份（集中竞价方式） 时间验证
      checkHgDate() {
        if (!this.dataForm.hgTDate) {
          this.dataForm.hgSDate = ''
          this.dataForm.hgRDate = ''
        }
        let eventTDate = 0
        if (this.dataForm.hgTDate) {
          eventTDate = this.$common.getTimestampms(this.dataForm.hgTDate + ' 00:00:00')
        }
        let eventSDate = 0
        if (this.dataForm.hgSDate) {
          eventSDate = this.$common.getTimestampms(this.dataForm.hgSDate + ' 00:00:00')
        }
        let eventRDate = 0
        if (this.dataForm.hgRDate) {
          eventRDate = this.$common.getTimestampms(this.dataForm.hgRDate + ' 00:00:00')
        }

        this.$http({
          method: 'GET',
          url: this.$api.calendar.checkDate,
          params: {
            userId: this.$cookie.get('userId'),
            templateEventId: this.dataForm.eventTemplateId,
            eventTDate: eventTDate,
            eventRDate: eventRDate,
            eventSDate: eventSDate
          }
        }).then((res) => {
//          if (eventTDate && eventRDate && eventSDate) {
//            this.getEventContainList(eventTDate, eventRDate, eventSDate)
//          }
          if (res.data.returnCode == 1) {
            this.errFrom.hgSDate = ''
            this.errFrom.hgRDate = ''
            this.errFrom.hgTDate = ''
            if (!eventTDate || !eventRDate || !eventSDate) {
              this.eventContainList = []
            } else {
              this.getEventContainList(eventTDate, eventRDate, eventSDate)
            }
          } else {
            let returnMsg = res.data.returnObject
            this.errFrom.hgSDate = returnMsg.S
            this.errFrom.hgRDate = returnMsg.R
            this.errFrom.hgTDate = returnMsg.T
            this.eventContainList = []
          }
        })
      },

      // 获取事件节点信息
      getEventContainList(eventTDate, eventRDate, eventSDate = 0) {
        if (eventRDate === '') {
          return
        }
        if (this.eventConfigValue.indexOf('HG') > -1) {
          if (!eventTDate || !eventRDate || !eventSDate) {
            this.eventContainList = []
            return false
          }
        }
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getEventContainList,
          params: {
            userId: this.$cookie.get('userId'),
            templateEventId: this.dataForm.eventTemplateId,
            eventTDate: eventTDate,
            eventRDate: eventRDate,
            eventSDate: eventSDate,
            isChoseBonus: this.dataForm.choseBonused == 1
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.eventContainList = res.data.returnObject
            for (let item in this.eventContainList) {
              if (this.eventContainList[item].eventConfirmFrequency) {
                this.eventContainList[item].eventConfirmFrequency = 1
              }
            }
          } else if (res.data.returnCode == 901) {
            this.$message({showClose: true, type: 'error', message: '节点信息获取失败，没有相关数据'})
          } else {
            this.$message({showClose: true, type: 'error', message: res.data.returnMsg})
          }
        })
      },
      // 用户修改节点提醒信息
      editEventContainList(index) {
        if (this.eventContainList[index].eventConfirmFrequency === 1) {
          this.eventContainList[index].eventConfirmFrequency = 0
        } else {
          this.eventContainList[index].eventConfirmFrequency = 1
        }
      },
      // 获取模板列表
      getTemplateList(res) {
        /* this.$http({
          method: 'GET',
          url: this.$api.calendar.getTemplateList,
          params: {}
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.eventTemplateListAll = res.data.returnObject
            // this.eventTemplateListAll = {'normal': [{'id': 1, 'value': '自定义事件'}], 'sh_a': [{'id': 2, 'value': '召开临时股东大会'}], 'sz':[{'id': 2, 'value': '召开临时股东大会'}]}
            this.eventTemplateList = this.eventTemplateListAll.normal
            this.dataForm.eventTemplateId = this.eventTemplateList[0].id
            if (this.$route.query.eventType) {
              if (this.eventType == '1') {
                this.eventTemplateList = this.eventTemplateListAll.sh_a
              } else if (this.eventType == '2') {
                this.eventTemplateList = this.eventTemplateListAll.sz
              }
            }

            this.selectTempateData[1].children = this.eventTemplateListAll.sh_a
            this.selectTempateData[2].children = this.eventTemplateListAll.sz
            this.selectTempateValue = ['normal']

            if (!this.eventId) {
              // 判断沪深
              if (this.marketType === 'sh') {
                // this.eventTemplateList = this.eventTemplateListAll.sh_a
                this.selectTempateValue = ['sh_a', this.eventTemplateListAll.sh_a[0].id]
                this.selectTemplateChange()
              } else if (this.marketType === 'sz') {
                // this.eventTemplateList = this.eventTemplateListAll.sz
                this.selectTempateValue = ['sz', this.eventTemplateListAll.sz[0].id]
                this.selectTemplateChange()
              }
            }
          }
        }) */

        if (res.data.returnCode == 1) {
          this.eventTemplateListAll = res.data.returnObject
          // this.eventTemplateListAll = {'normal': [{'id': 1, 'value': '自定义事件'}], 'sh_a': [{'id': 2, 'value': '召开临时股东大会'}], 'sz':[{'id': 2, 'value': '召开临时股东大会'}]}
          this.eventTemplateList = this.eventTemplateListAll.normal
          this.dataForm.eventTemplateId = this.eventTemplateList[0].id
          if (this.$route.query.eventType) {
            if (this.eventType == '1') {
              this.eventTemplateList = this.eventTemplateListAll.sh_a
            } else if (this.eventType == '2') {
              this.eventTemplateList = this.eventTemplateListAll.sz
            }
          }
          let lastSH = this.eventTemplateListAll.sh_a.pop()
          this.eventTemplateListAll.sh_a.unshift(lastSH)

          let lastSZ = this.eventTemplateListAll.sz.pop()
          this.eventTemplateListAll.sz.unshift(lastSZ)

          this.selectTempateData[1].children = this.eventTemplateListAll.sh_a
          this.selectTempateData[2].children = this.eventTemplateListAll.sz
          this.selectTempateValue = ['normal']

          if (!this.eventId) {
            // 判断沪深
            if (this.marketType === 'sh') {
              // this.eventTemplateList = this.eventTemplateListAll.sh_a
              this.selectTempateValue = ['sh_a', this.eventTemplateListAll.sh_a[0].id]
              this.selectTemplateChange()
            } else if (this.marketType === 'sz') {
              // this.eventTemplateList = this.eventTemplateListAll.sz
              this.selectTempateValue = ['sz', this.eventTemplateListAll.sz[0].id]
              this.selectTemplateChange()
            }
          }
        }

      },
      // 添加日常事件
      addNormalEvent() {
        let eventBeginDate = this.$common.getTimestampms(this.dataForm.eventDate[0] + ' 00:00:00')
        let eventEndDate = this.$common.getTimestampms(this.dataForm.eventDate[1] + ' 00:00:00')
        // let eventTemplateName = this.getObjById(this.dataForm.eventTemplateId, this.eventTemplateList).value
        let calendarName = this.getObjById(this.dataForm.calendarId, this.myCalendarList).calendarName
        // let eventConfirmName = this.getObjById(this.dataForm.eventConfirmType, this.eventConfirmType).name
        // let eventConfirmDayName = this.getObjById(this.dataForm.eventConfirmDayType, this.eventConfirmDayType).name
        let params = {
          eventName: this.dataForm.eventName,
          eventTemplateId: this.dataForm.eventTemplateId,
          // eventTemplateName: eventTemplateName,
          calendarId: this.dataForm.calendarId,
          calendarName: calendarName,
          eventBeginDate: eventBeginDate,
          eventEndDate: eventEndDate,
          eventLocation: this.dataForm.eventLocation,
          eventConfirmType: this.dataForm.eventConfirmType,
          // eventConfirmName: eventConfirmName,
          eventConfirmDayType: this.dataForm.eventConfirmDayType,
          // eventConfirmDayName: eventConfirmDayName,
          // eventConfirmContent: '',
          eventRemark: this.dataForm.eventremark,
          inviterNumbers: this.dataForm.inviterNumbers.join(','),
          userId: this.$cookie.get('userId')
        }
        console.log(params)
        this.$http({
          method: 'POST',
          url: this.$api.calendar.addNormalEvent,
          params: params
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', message: '添加成功'})
            this.goDetaile(res.data.returnObject.id, 0)
          } else {
            this.$message({showClose: true, type: 'error', message: '添加失败'})
          }
          this.saveState = false
        })
      },
      // 修改日常事件
      editNormalEventInfo() {
        let eventBeginDate = this.$common.getTimestampms(this.dataForm.eventDate[0] + ' 00:00:00')
        let eventEndDate = this.$common.getTimestampms(this.dataForm.eventDate[1] + ' 00:00:00')
        let eventTemplateName = this.getObjById(this.dataForm.eventTemplateId, this.eventTemplateList).value
        let calendarName = this.getObjById(this.dataForm.calendarId, this.myCalendarList).calendarName
        // let eventConfirmName = this.getObjById(this.dataForm.eventConfirmType, this.eventConfirmType).name
        // let eventConfirmDayName = this.getObjById(this.dataForm.eventConfirmDayType, this.eventConfirmDayType).name
        let inviterNumbers = []
        if (this.dataForm.inviterNumberList.length > 0) {
          for (let index in this.dataForm.inviterNumberList) {
            inviterNumbers.push(this.dataForm.inviterNumberList[index].mobile)
          }
        }
        let params = {
          id: this.eventId,
          eventName: this.dataForm.eventName,
          eventTemplateType: 19,
          eventTemplateId: this.dataForm.eventTemplateId,
          eventTemplateName: eventTemplateName,
          calendarId: this.dataForm.calendarId,
          calendarName: calendarName,
          eventBeginDate: eventBeginDate,
          eventEndDate: eventEndDate,
          eventLocation: this.dataForm.eventLocation,
          eventConfirmType: this.dataForm.eventConfirmType,
          // eventConfirmName: eventConfirmName,
          eventConfirmDayType: this.dataForm.eventConfirmDayType,
          // eventConfirmDayName: eventConfirmDayName,
          // eventConfirmContent: '',
          eventRemark: this.dataForm.eventremark,
          inviterNumbers: inviterNumbers.join(','),
          userId: this.$cookie.get('userId')
        }
        console.log(params)
        this.$http({
          method: 'POST',
          url: this.$api.calendar.editNormalEventInfo,
          params: params
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', message: '修改成功'})
            this.goDetaile(this.eventId, 0)
          } else {
            this.$message({showClose: true, type: 'error', message: res.data.returnMsg})
          }
          this.saveState = false
        })
      },
      // 添加模板事件
      addTemplateEvent() {
        let userId = this.$cookie.get('userId')
        let eventRDate = 0
        let eventTDate = 0
        let eventSDate = 0
        if (this.eventConfigValue.indexOf('HG') > -1) {
          if (this.dataForm.hgTDate && this.dataForm.hgSDate && this.dataForm.hgRDate && this.errFrom.hgSDate == '' && this.errFrom.hgRDate == '') {
            eventRDate = this.$common.getTimestampms(this.dataForm.hgRDate + ' 00:00:00')
            eventTDate = this.$common.getTimestampms(this.dataForm.hgTDate + ' 00:00:00')
            eventSDate = this.$common.getTimestampms(this.dataForm.hgSDate + ' 00:00:00')
          } else {
            this.checkHgDate()
            this.saveState = false
            return false
            // this.$message({showClose: true, type: 'error', message: '添加失败'})
          }

        } else {
          eventRDate = this.$common.getTimestampms(this.dataForm.eventGqdjDate + ' 00:00:00')
          eventTDate = this.$common.getTimestampms(this.dataForm.eventGddhDate + ' 00:00:00')
          eventSDate = 0
          // 股权登记日 信息
          if (this.eventConfigValue.indexOf('R') < 0) {
            eventRDate = 0
          }
        }
        let eventTemplateName = this.getObjById(this.dataForm.eventTemplateId, this.eventTemplateList).value
        let calendarName = this.getObjById(this.dataForm.calendarId, this.myCalendarList).calendarName
        let eventConfirmName = this.getObjById(this.dataForm.eventConfirmType, this.eventConfirmType).name
        let eventConfirmDayName = this.getObjById(this.dataForm.eventConfirmDayType, this.eventConfirmDayType).name
        let inviterNumberList = []
        if (this.dataForm.inviterNumbers.length > 0) {
          for (let i = 0; i < this.dataForm.inviterNumbers.length; i++) {
            inviterNumberList.push({
              avatar: '',
              eventId: 0,
              id: 0,
              mobile: this.dataForm.inviterNumbers[i]
            })
          }
        }
        let templateEventType = this.getObjById(this.dataForm.eventTemplateId, this.eventTemplateList).eventTemplateType
//        let templateEventType = 1
//        if (this.templateType === 'sh_a') {
//          templateEventType = 1
//        } else if (this.templateType === 'sz') {
//          templateEventType = 2
//        }
        // 处理事件节点信息
        for (let index in this.eventContainList) {
          this.eventContainList[index].calendarId = this.dataForm.calendarId
          this.eventContainList[index].calendarName = calendarName
          this.eventContainList[index].createUserId = userId
          this.eventContainList[index].createUserName = ''
          this.eventContainList[index].eventConfirmDayType = this.dataForm.eventConfirmDayType
          this.eventContainList[index].eventConfirmType = this.dataForm.eventConfirmType
          this.eventContainList[index].templateEventId = this.dataForm.eventTemplateId
          this.eventContainList[index].templateEventName = eventTemplateName
        }
        let params = {
          calendarId: this.dataForm.calendarId,
          calendarName: calendarName,
          createUserId: userId,
          createUserName: '',
          // delete: 不填,
          eventConfirmContent: '', // 不填  传空,
          // eventConfirmDayName: 事件提醒日期方式  不填,
          eventConfirmDayType: this.dataForm.eventConfirmDayType, // 事件提醒日期方式  枚举id,
          eventConfirmFrequency: this.dataForm.eventConfirmType === 0 ? 0 : 1, // 不填  传空,
          // eventConfirmFrequencyName: '', // 不填,
          // eventConfirmName: '', // 不填,
          eventConfirmType: this.dataForm.eventConfirmType, // 事件提醒方式  枚举Id,
          eventContainList: this.eventContainList,
          /* [{
             calendarId: this.dataForm.calendarId,
             calendarName: calendarName,
             createUserId: userId,
             createUserName: '',
             // delete: 不填,
             eventBeginDate: '', // 事件开始日期,
             eventConfirmContent: '', // 事件提醒内容,
             eventConfirmDayType: '', // 事件提醒日期方式,
             eventConfirmDayTypeName: '', // 不填,
             eventConfirmFrequency: '', // 事件提醒频率 枚举id默认提醒1，用户可选择不提醒0,
             eventConfirmFrequencyName: '', // 不填,
             eventConfirmType: '', // 事件提醒方式,
             eventConfirmTypeName: '', // 不填,
             eventEndDate: '', // 事件结束时间,
             eventName: '', // 事件节点名称,
             eventRemark: '', // 事件备注,
             id: '', // 不填,
             parentEventId: '', // 传空,
             parentEventName: '', // 传空,
             templateEventId: '', // 事假模板Id,
             templateEventName: '', // 事件模板名,
             templateEventType: '', // 事件模板类型,
             updateUserId: '', // 用户id,
             updateUserName: '' // 用户名
           }], */

          eventLocation: this.dataForm.eventLocation, // 事件地址,
          eventName: this.dataForm.eventName, // 事件名称  与节点list里的不同,
          eventRDate: eventRDate, // 事件Rdate,
          eventRemark: this.dataForm.eventremark, // 事件备注,
          eventTDate: eventTDate, // 事件Tdate,
          eventSDate: eventSDate,
          id: '', // 不填,
          inviterNumberList: inviterNumberList,
          templateEventId: this.dataForm.eventTemplateId, // 事件模板id,
          templateEventName: eventTemplateName, // 事件模板名,
          templateEventType: templateEventType, // 事件模板类型  枚举Id 可传空,
          updateUserId: userId,
          updateUserName: '' // 用户名
        }
        // 获取 定期报告、业绩报告信息
        if (this.eventConfigValue.indexOf('B') > -1 || this.eventConfigValue.indexOf('Y') > -1) {
          params.reportType = this.dataForm.reportType
        }
        // 差异化分红送转 信息
        if (this.eventConfigValue.indexOf('C') > -1) {
          params.choseBonused = this.dataForm.choseBonused == 1
        }

        console.log(params)
        this.$http({
          method: 'POST',
          url: this.$api.calendar.addTemplateEvent,
          data: params
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', message: '添加成功'})
            this.goDetaile(res.data.returnObject.id, 1)
          } else {
            this.$message({showClose: true, type: 'error', message: '添加失败'})
          }
          this.saveState = false
        })
      },
      // 编辑模板事件
      editTemplateEvent() {
        let userId = this.$cookie.get('userId')
        let eventRDate = 0
        let eventTDate = 0
        let eventSDate = 0
        if (this.eventConfigValue.indexOf('HG') > -1) {
          if (this.dataForm.hgTDate && this.dataForm.hgSDate && this.dataForm.hgRDate && this.errFrom.hgSDate == '' && this.errFrom.hgRDate == '') {
            eventRDate = this.$common.getTimestampms(this.dataForm.hgRDate + ' 00:00:00')
            eventTDate = this.$common.getTimestampms(this.dataForm.hgTDate + ' 00:00:00')
            eventSDate = this.$common.getTimestampms(this.dataForm.hgSDate + ' 00:00:00')
          } else {
            this.checkHgDate()
            this.saveState = false
            return false
            // this.$message({showClose: true, type: 'error', message: '添加失败'})
          }

        } else {
          eventRDate = this.$common.getTimestampms(this.dataForm.eventGqdjDate + ' 00:00:00')
          eventTDate = this.$common.getTimestampms(this.dataForm.eventGddhDate + ' 00:00:00')
          eventSDate = 0
          // 股权登记日 信息
          if (this.eventConfigValue.indexOf('R') < 0) {
            eventRDate = 0
          }
        }
        let eventTemplateName = this.getObjById(this.dataForm.eventTemplateId, this.eventTemplateList).value
        let calendarName = this.getObjById(this.dataForm.calendarId, this.myCalendarList).calendarName
        let eventConfirmName = this.getObjById(this.dataForm.eventConfirmType, this.eventConfirmType).name
        let eventConfirmDayName = this.getObjById(this.dataForm.eventConfirmDayType, this.eventConfirmDayType).name
        let templateEventType = this.getObjById(this.dataForm.eventTemplateId, this.eventTemplateList).eventTemplateType
        let inviterNumberList = []
        if (this.dataForm.inviterNumbers.length > 0) {
          for (let i = 0; i < this.dataForm.inviterNumbers.length; i++) {
            inviterNumberList.push({
              avatar: '',
              eventId: 0,
              id: 0,
              mobile: this.dataForm.inviterNumbers[i]
            })
          }
        }
        // 处理事件节点信息
        for (let index in this.eventContainList) {
          this.eventContainList[index].calendarId = this.dataForm.calendarId
          this.eventContainList[index].calendarName = calendarName
          this.eventContainList[index].createUserId = userId
          this.eventContainList[index].createUserName = ''
          this.eventContainList[index].eventConfirmDayType = this.dataForm.eventConfirmDayType
          this.eventContainList[index].eventConfirmType = this.dataForm.eventConfirmType
          this.eventContainList[index].templateEventId = this.dataForm.eventTemplateId
          this.eventContainList[index].templateEventName = eventTemplateName
        }
        let params = {
          calendarId: this.dataForm.calendarId,
          calendarName: calendarName,
          createUserId: userId,
          createUserName: '',
          // delete: 不填,
          eventConfirmContent: '', // 不填  传空,
          // eventConfirmDayName: 事件提醒日期方式  不填,
          eventConfirmDayType: this.dataForm.eventConfirmDayType, // 事件提醒日期方式  枚举id,
          eventConfirmFrequency: this.dataForm.eventConfirmType === 0 ? 0 : 1, // 不填  传空,
          // eventConfirmFrequencyName: '', // 不填,
          // eventConfirmName: '', // 不填,
          eventConfirmType: this.dataForm.eventConfirmType, // 事件提醒方式  枚举Id,
          eventContainList: this.eventContainList,
          eventLocation: this.dataForm.eventLocation, // 事件地址,
          eventName: this.dataForm.eventName, // 事件名称  与节点list里的不同,
          eventRDate: eventRDate, // 事件Rdate,
          eventRemark: this.dataForm.eventremark, // 事件备注,
          eventTDate: eventTDate, // 事件Tdate,
          eventSDate: eventSDate,
          id: this.eventId, //
          inviterNumberList: this.dataForm.inviterNumberList,
          templateEventId: this.dataForm.eventTemplateId, // 事件模板id,
          templateEventName: eventTemplateName, // 事件模板名,
          templateEventType: templateEventType, // 事件模板类型  枚举Id 可传空,
          updateUserId: userId,
          updateUserName: '' // 用户名
        }
        // 获取 定期报告、业绩报告信息
        if (this.eventConfigValue.indexOf('B') > -1 || this.eventConfigValue.indexOf('Y') > -1) {
          params.reportType = this.dataForm.reportType
        }
        // 差异化分红送转 信息
        if (this.eventConfigValue.indexOf('C') > -1) {
          params.choseBonused = this.dataForm.choseBonused == 1
        }
        // 股权登记日 信息
//        if (this.eventConfigValue.indexOf('R') < 0) {
//          params.eventRDate = 0
//        }
        console.log(params)
        this.$http({
          method: 'POST',
          url: this.$api.calendar.editTemplateEvent,
          data: params
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$message({showClose: true, type: 'success', message: '编辑成功'})
            this.goDetaile(this.eventId, 1)
          } else {
            this.$message({showClose: true, type: 'error', message: '编辑失败'})
          }
          this.saveState = false
        })
      },
      // 修改bind 日常事件信息
      bindData() {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getNormalEventInfo,
          params: {
            userId: this.$cookie.get('userId'),
            eventId: this.eventId,
            eventType: 0
          }
        }).then((res) => {
          if (res.data.returnCode === 1) {
            let data = res.data.returnObject
            this.dataForm.eventName = data.eventName
            this.dataForm.eventTemplateId = data.eventTemplateId
            this.selectTempateValue = ['normal']
            this.dataForm.calendarId = data.calendarId
            this.dataForm.eventDate = [this.$common.transTime(data.eventBeginDate)[1], this.$common.transTime(data.eventEndDate)[1]]
            this.dataForm.eventLocation = data.eventLocation
            this.dataForm.eventConfirmType = data.eventConfirmType
            if (this.dataForm.eventConfirmType === 0) {
              this.eventConfirmDayType = this.eventConfirmDayTypeNone
            } else {
              this.eventConfirmDayType = this.eventConfirmDayTypeTixin
            }
            this.dataForm.eventConfirmDayType = data.eventConfirmDayType
            this.dataForm.eventremark = data.eventRemark
            // this.dataForm.inviterNumbers = data.inviterNumbers.split(',')
            if (data.inviterNumbers) {
              this.dataForm.inviterNumbers = data.inviterNumbers.split(',')
            }
            if (data.inviterNumbersList) {
              this.dataForm.inviterNumberList = data.inviterNumbersList
            }
            this.eventBeginDate = this.$common.transTime(data.eventBeginDate)[1]
            this.eventEndDate = this.$common.transTime(data.eventEndDate)[1]
          }
        })
      },
      // 修改bind 模板事件信息
      bindTemplateData() {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getTemplateEventInfo,
          params: {
            // userId: this.$cookie.get('userId'),
            eventId: this.eventId
          }
        }).then((res) => {
          if (res.data.returnCode === 1) {
            let data = res.data.returnObject
            this.dataForm.eventName = data.eventName
            this.dataForm.eventTemplateId = data.templateEventId
            if (data.templateEventTypeName === 'calendar_template_sh_a') {
              this.selectTempateValue = ['sh_a', data.templateEventId]
            } else {
              this.selectTempateValue = ['sz', data.templateEventId]
            }
            this.dataForm.calendarId = data.calendarId
            // this.dataForm.eventDate = [this.$common.transTime(data.eventBeginDate)[1], this.$common.transTime(data.eventEndDate)[1]]
            // this.dataForm.eventGddhDate = this.$common.transTime(data.eventTDate)[1]
            // this.dataForm.eventGqdjDate = this.$common.transTime(data.eventRDate)[1]

            this.dataForm.eventLocation = data.eventLocation
            this.dataForm.eventConfirmType = data.eventConfirmType
            if (this.dataForm.eventConfirmType === 0) {
              this.eventConfirmDayType = this.eventConfirmDayTypeNone
            } else {
              this.eventConfirmDayType = this.eventConfirmDayTypeTixin
            }
            this.dataForm.eventConfirmDayType = data.eventConfirmDayType
            this.dataForm.eventremark = data.eventRemark
            if (data.inviterNumberList.length > 0) {
              this.dataForm.inviterNumbers = data.inviterNumberList
            }
            this.dataForm.inviterNumberList = data.inviterNumberList
            this.dataForm.eventGqdjDate = this.$common.transTime(data.eventRDate)[1]
            this.dataForm.eventGddhDate = this.$common.transTime(data.eventTDate)[1]

            this.dataForm.hgTDate = this.$common.transTime(data.eventTDate)[1]
            this.dataForm.hgSDate = this.$common.transTime(data.eventSDate)[1]
            this.dataForm.hgRDate = this.$common.transTime(data.eventRDate)[1]

            this.eventContainList = data.eventContainList
            this.dataForm.reportType = data.reportType
            this.dataForm.choseBonused = data.choseBonused ? 1 : 0
            this.selectTemplateChange()
            console.log('eventTDate:' + data.eventTDate + ' eventRDate:' + data.eventRDate + ' eventGddhDate:' + this.dataForm.eventGddhDate + ' eventGqdjDate:' + this.dataForm.eventGqdjDate)
          }
        })
      },
      // 添加提交按钮
      submitForm() {
        if (this.checkAll()) {
          this.saveState = true
          if (this.templateType === this.normalEvent) {
            this.addNormalEvent()
          } else {
            this.addTemplateEvent()
          }
        }
      },
      // 修改提交按钮
      editForm() {
        if (this.checkAll()) {
          this.saveState = true
          if (this.templateType === this.normalEvent) {
            this.editNormalEventInfo()
          } else {
            this.editTemplateEvent()
          }
        }
      },
      // 根据id获取对象名称
      getObjById(id, obj) {
        for (let i in obj) {
          if (obj[i].id === id) {
            return obj[i]
          }
        }
      },
      goDetaile(id, eventType) {
        this.$router.push({path: '/calendar/eventDetaile', query: {id: id, eventType: eventType, from: 'add'}})
      },
      // 返回错误信息
      checkTDataMsg(date) {
        // config 枚举id 判断提示文字
        if ([2, 3, 12, 13].indexOf(this.eventTemplateType) > -1) {
          if (!this.checkTData(date)) {
            if (this.dataForm.reportType === 1) {
              return '年度报告应在1月1日至4月30日披露，披露日应为交易日或周六。'
            } else if (this.dataForm.reportType === 2) {
              return '一季报应在4月1日至4月30日披露，披露日应为交易日或周六。'
            } else if (this.dataForm.reportType === 3) {
              return '半年报应在7月1日至8月31日披露，披露日应为交易日或周六。'
            } else if (this.dataForm.reportType === 4) {
              return '三季报应在10月1日至10月31日披露，披露日应为交易日或周六。'
            } else if (this.dataForm.reportType === 5) {
              return '业绩预告披露日应为交易日或周六。'
            } else if (this.dataForm.reportType === 6) {
              return '业绩快报披露日应为交易日或周六。'
            }
          }
        }
        return ''
      },
      // 定期报告窗口期、业绩预告业绩快报窗口期，两个事件缺 T 日 合法性判断
      checkTData(date) {
        let m = new Date(date).getMonth() + 1
        let t = new Date(date).toLocaleDateString()
        let week = new Date(date).getDay()
        if (week === 0) {
          return false
        }
        if (this.allCloseDate.indexOf(t) > -1) {
          return false
        }
        if (this.dataForm.reportType === 1) {
          if (m > 4) {
            return false
          }
        } else if (this.dataForm.reportType === 2) {
          if (m != 4) {
            return false
          }
        } else if (this.dataForm.reportType === 3) {
          if (m != 8 && m != 7) {
            return false
          }
        } else if (this.dataForm.reportType === 4) {
          if (m != 10) {
            return false
          }
        }
        return true
      },
      // 判断非交易日
      checkAllCloseDate(date) {
        let m = new Date(date).getMonth() + 1
        let t = new Date(date).toLocaleDateString()
        let week = new Date(date).getDay()
        if (week === 0 || week === 6) {
          return false
        }
        if (this.allCloseDate.indexOf(t) > -1) {
          return false
        }
        return true
      },
      // 判断板块-沪 深
      checkMarkType() {
        let comType1 = this.userInfo.companyTypeOne
        let comType2 = this.userInfo.companyTypeTwo
        if (comType1 == '上市公司') {
          if (comType2 == '沪市主板') {
            this.marketType = 'sh'
          } else if (comType2 == '深市主板' || comType2 == '深市中小板' || comType2 == '深市创业板') {
            this.marketType = 'sz'
          } else if (comType2 == '港股主板' || comType2 == '港股创业板') {
            this.marketType = 'hk'
          }
        } else if (comType1 == '挂牌公司') {
          this.marketType = 'gp'
        }
      },
      // 获取所有非交易日
      getAllCloseDate() {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getCloseDate,
          params: {}
        }).then((res) => {
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject
            let closeDateList = []
            for (let i in data) {
              if (data[i].district.indexOf('0') > -1) {
                closeDateList.push(new Date(data[i].closeDay).toLocaleDateString())
              }
            }
            // console.log(closeDateList)
            this.allCloseDate = closeDateList
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #cAddEvent {
    margin-top: -10px;
    .ctitle {
      position: relative;
      border-bottom: 1px solid #e3e3e3;
      line-height: 60px;
      text-align: center;
      .back {
        position: absolute;
        left: 0;
        color: #ffb148;
      }
      .iarrow {
        font-weight: 900;
      }
      .editBtn {
        margin-top: 12px;
      }
    }
    .ctabs {
      font-size: 14px;
      margin: 0 0 20px 20px;
      .tabspane {
        margin-left: -20px;
        width: 520px;
      }
      .inputTel {
        display: inline-block;
        width: 335px;
      }
      .addTelBtn {
        background-color: #f0f1f5;
        border: 1px solid #e3e3e3;
        margin-left: 10px;
        &:hover {
          border: 1px solid #e3e3e3;
        }
      }
      .cul {
        color: #aeaeae;
        .double {
          &:after {
            content: '';
            position: absolute;
            top: 15px;
            right: 10px;
            border-right: 1px solid #e3e3e3;
            height: 25px;
          }
        }
        .single {
          padding-left: 30px;
        }
        li {
          position: relative;
          width: 99%;
          float: left;
          height: 50px;
          line-height: 50px;
          border-bottom: 1px solid #e3e3e3;
          margin-top: 10px;
          img {
            width: 30px;
            height: 30px;
            position: relative;
            top: 10px;
            border-radius: 50%;
          }
          .tel {
            display: inline-block;
            width: 84%;
            margin-left: 10px;
          }
        }
      }
      .el-table__header {
        tr, th {
          background-color: #f0f1f5;
          font-weight: 400;
        }
      }
      .el-table td {
        vertical-align: top;
      }
    }
    .subBtn {
      width: 240px;
      height: 40px;
      font-size: 17px;
    }
    .regBtn {
      width: 220px;
      height: 40px;
      margin-left: 90px;
      font-size: 17px;
    }
    .dataForm {
      padding-top: 20px;
      width: 100%;
      .eventDetaile {
        color: #ffb148;
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #e3e3e3;
        margin-bottom: 15px;
      }
    }
    .space {
      padding-right: 10px;
    }
    .el-select {
      width: 100%;
    }
    .el-form-item.is-required .el-form-item__label:before {
      margin-left: 4px;
      float: right;
      position: relative;
      top: 3px;
    }
    .line {
      text-align: center;
      color: rgba(255, 255, 255, 0)
    }
    .hiddenreqired .el-form-item__label:before {
      visibility: hidden;
    }
    .el-form-item.is-error .el-input__inner {
      border-color: #fb4319
    }
    .el-form-item__error {
      color: #fb4319;
      position: relative;
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #e3e3e3;
    }
    .el-cascader.is-disabled .el-cascader__label span {
      color: #c0c4cc;
    }
    .rotate90 {
      transform: rotate(90deg);
    }
    .web-tixing {
      color: #e3e3e3;
      cursor: pointer;
    }
    .isRemind {
      color: #ffb148;
    }
    .eventNode {
      position: relative;
      margin: 10px 0;
      padding-left: 15px;
      .line {
        position: absolute;
        width: 1px;
        height: 110%;
        top: 40px;
        background-color: #e3e3e3;
        .s1 {
          position: relative;
          display: inline-block;
          left: -6px;
          top: -6px;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          border: 1px solid #aeaeae;
          &:before {
            content: '';
            border-radius: 50%;
            position: absolute;
            left: 1px;
            top: 1px;
            width: 6px;
            height: 6px;
            border: 1px solid #aeaeae;
            background-color: #aeaeae;
          }
        }
      }
      .eventContent {
        margin: 5px 0 0 20px;
        padding: 15px 15px;
        width: 390px;
        min-height: 74px;
        border-top: 2px solid #ffb148;
        border-radius: 5px;
        box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
        background-color: #fff8ee;
        font-size: 14px;
        div {
          min-height: 25px;
          line-height: 25px;
        }
        .today {
          display: none;
          width: 40px;
          text-align: center;
          padding: 1px;
          font-size: 12px;
          border-radius: 5px;
          color: #fff;
          background-color: #849fee;
        }
      }
    }
    .overdue {
      .eventContent {
        background-color: #f9f9f9;
        border: 0;
      }
      .text-black2 {
        color: #aeaeae !important;
      }
      .line {
        .s1 {
          border: 1px solid #e3e3e3;
          &:before {
            border: 1px solid #e3e3e3;
            background-color: #e3e3e3;
          }
        }
      }
    }
    .dateNow {
      .line {
        .s1 {
          border: 1px solid #535353;
          &:before {
            background-color: #849fee;
          }
        }
      }
      .eventContent {
        .today {
          display: inline-block;
        }
      }
    }
    .eventNode:last-child {
      .line {
        background-color: #fff;
      }
    }
  }
  .el-cascader-menu__item {
    text-overflow: inherit;
  }
  .el-date-editor .el-range-input {
    width: 38%;
  }
  .el-date-editor .el-range-separator {
    width: 18px;
  }
  .el-cascader-menu__item {
    padding: 8px 30px 8px 20px;
  }
  .trmb {
    /*margin-bottom: 40px !important;*/
  }
  .el-form-item {
    margin-bottom: 15px;
    margin-top: 15px;
  }
  .el-col-12 {
    .el-form-item {
      margin-top: 0;
    }
  }
</style>
