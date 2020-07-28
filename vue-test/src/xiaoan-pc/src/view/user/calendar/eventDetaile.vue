<template>
  <div id="cEventDetaile">
    <div class="ctitle">
      <div @click="goback" class="back"><i class="el-icon-arrow-left iarrow"></i> 返回</div>
      <span>事件详情</span>
      <el-button v-if="!isSystem && isOwn" class="fright editBtn" type="primary" size="mini" @click="editEvent">编辑</el-button>
    </div>
    <div style="min-height: 300px;margin:20px 0;display: table">
      <div style="width:445px;padding-right: 20px;" class="fleft">
        <div class="eventDetaile" v-if="!isSystem">事件详情</div>
        <div class="detaileBox">
          <el-row>
            <el-col :span="6">事件名称</el-col>
            <el-col :span="18">{{eventName}}</el-col>
          </el-row>
          <el-row v-if="eventType==='normal'">
            <el-col :span="6">事件日期</el-col>
            <el-col :span="18">{{eventBeginDate}} 至 {{eventEndDate}}</el-col>
          </el-row>
          <el-row v-if="eventConfigValue.indexOf('B') > -1">
            <el-col :span="6">定期报告</el-col>
            <el-col :span="18">{{reportType}}</el-col>
          </el-row>
          <el-row v-if="eventConfigValue.indexOf('Y') > -1">
            <el-col :span="6">业绩报告</el-col>
            <el-col :span="18">{{reportType}}</el-col>
          </el-row>
          <el-row v-if="eventConfigValue.indexOf('P') > -1">
            <el-col :span="6">披露日期</el-col>
            <el-col :span="18">{{eventTDate}}</el-col>
          </el-row>
          <el-row v-if="eventConfigValue.indexOf('T') > -1">
            <el-col :span="6">会议日期</el-col>
            <el-col :span="18">{{eventTDate}}</el-col>
          </el-row>
          <el-row v-if="eventConfigValue.indexOf('R') > -1">
            <el-col :span="6">股权登记日</el-col>
            <el-col :span="18">{{eventRDate}}</el-col>
          </el-row>
          <template v-if="eventConfigValue.indexOf('HG') > -1">
            <el-row>
              <el-col :span="6">董事会召开日</el-col>
              <el-col :span="18">{{eventTDate}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">股东大会召开日</el-col>
              <el-col :span="18">{{eventSDate}}</el-col>
            </el-row>
            <el-row>
              <el-col :span="6">回购股份届满日</el-col>
              <el-col :span="18">{{eventRDate}}</el-col>
            </el-row>
          </template>
          <el-row v-if="eventConfigValue.indexOf('C') > -1">
            <el-col :span="6">差异化分红送转</el-col>
            <el-col :span="18">{{choseBonused ? '是':'否'}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">日　　历</el-col>
            <el-col :span="18">{{calendarName}}</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">地　　点</el-col>
            <el-col v-if="eventLocation" :span="18">{{eventLocation}}</el-col>
            <el-col v-else :span="18">无</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">提　　醒</el-col>
            <el-col :span="18" v-if="isSystem">{{eventConfirmFrequencyName}}</el-col>
            <el-col :span="18" v-else-if="eventConfirmName && eventConfirmDayName">{{eventConfirmName}}；{{eventConfirmDayName}}</el-col>
            <el-col :span="18" v-else>不提醒</el-col>
          </el-row>
          <el-row>
            <el-col :span="6">备　　注</el-col>
            <el-col :span="18" v-if="eventRemark">{{eventRemark}}</el-col>
            <el-col :span="18" v-else>无</el-col>
          </el-row>
        </div>
      </div>
      <div style="width:450px; border-left:1px solid #e3e3e3;min-height: 300px;" class="fright" v-if="!isSystem">
        <el-tabs v-model="activeTab"  class="ctabs" >
          <!--        <el-tab-pane label="事件详情" name="1">
                    <div class="tabspane">

                    </div>
                  </el-tab-pane>-->
          <el-tab-pane label="事件节点" name="1" v-if="eventType!=='normal'">
            <div>
              <div class="eventNode" v-for="(item,index) in eventContainList" :key="index"
                   :class="[{'overdue': judgeDate(item.eventBeginDate, item.eventEndDate) == 0,'dateNow': judgeDate(item.eventBeginDate, item.eventEndDate) == 1}]">
                <div class="line" >
                  <span class="s1"></span>
                </div>
                <div class="eventContent">
                  <div>
                    <template v-if="item.eventBeginDate!=item.eventEndDate">
                      <span class="text-black2" v-if="item.eventBeginDate">{{ msToTransTime(item.eventBeginDate) }}</span>
                      <span class="text-black2" v-if="item.eventBeginDate && item.eventEndDate">~</span>
                      <span class="text-black2" v-if="item.eventEndDate">{{ msToTransTime(item.eventEndDate) }}</span>
                    </template>
                    <template v-else>
                      <span class="text-black2" v-if="item.eventBeginDate">{{ msToTransTime(item.eventBeginDate) }}</span>
                    </template>
                    <span class="today">今日</span>
                    <i class="iconfont web-tixing fright" v-if="item.eventConfirmFrequency!=null" :class="{isRemind: item.eventConfirmFrequency === 1}"></i>
                  </div>
                  <div class="text-black4">{{item.eventName}}</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="通知对象" name="2">
            <div>
              <ul class="cul" v-if="inviterNumbers.length>0">
                <li  v-for="(item,index) in inviterNumbers" :key="index">
                  <img v-if="item.avatar" :src="item.avatar">
                  <img v-else :src="$image.user.calendar.headerImg">
                  <span class="tel">{{item.mobile}}</span>
                </li>
              </ul>
              <div v-else>无</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="clearBoth"></div>
    <div class="deleteBox"  v-if="!isSystem && isOwn">
      <div class="title">删除事件<el-button class="fright editBtn" type="primary" size="mini" @click="delEvent">删除</el-button></div>
      <div class="desc">删除当前事件</div>
    </div>
  </div>
</template>

<script>
  import ElRow from "element-ui/packages/row/src/row";
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    data() {
      return {
        eventType: 'normal',
        'activeTab': '2',
        'name': '',
        // 常规事件
        'eventName': '',
        'eventTemplateId': '',
        'eventTemplateName': '',
        'calendarId': 1,
        'calendarName': '',
        'myCalendar': '1-600001',
        // 'eventDate': '',  // 含开始，结束时间
        'eventBeginDate': '',
        'eventEndDate': '',
        'eventLocation': '',
        'eventConfirmType': 2,
        eventConfirmName: '',
        'eventConfirmDayType': 1,
        eventConfirmDayName: '',
        'eventRemark': '',
        'inviterNumber': '',
        'inviterNumbers': [],
        'userId': '',
        eventConfirmFrequencyName: '',
        eventConfirmFrequency: '',

        // 模板事件
        // 'eventGddhDate': '',
        // 'eventGqdjDate': '',
        // 事件选项配置
        eventTemplateConfig: '',
        eventConfigValue: '',
        reportTypeName: ['null', '年度报告', '一季报', '半年报', '三季报', '业绩预告', '业绩快报'],
        reportType: '',
        choseBonused: false,
        eventRDate: '',
        eventTDate: '',
        eventSDate: '',
        eventContainList: [],
        'tableData': [],
        templateEventType: 0,
        isSystem: false,
        isOwn: false
      }
    },
    // 使用其它组件
    components: {
      ElCol,
      ElRow},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      this.eventTemplateConfig = this.$config.eventTemplateConfig
      this.eventId = this.$route.query.id
      if (this.eventId) {
        let eType = this.$route.query.eventType
        if (eType == '0' || eType == '2') {
          this.eventType = 'normal'
          this.bindNormalEventInfo()
        } else {
          this.eventType = 'template'
          this.bindTemplateEventInfo()
        }
      }
      // this.getEventListByDatetime()
    },
    mounted() {
      // this.goback()
    },
    // 方法
    methods: {
      goback () {
        if (this.$route.query.from) {
          this.$router.push('/calendar/index')
        } else {
          this.$router.go(-1)
        }
      },
      // 日间判断
      judgeDate (startTime, endTime) {
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
      msToTransTime: function (ms) {
        if (!ms) return ''
        return this.$common.transTime(ms)[0]
      },
      // 编辑跳转
      editEvent () {
        this.$router.push({path: '/calendar/addEvent', query: {id: this.eventId, eventType: this.templateEventType}})
      },
      getEventListByDatetime () {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getEventsListBytimeSlot,
          params: {
            userId: this.$cookie.get('userId'),
            startDate: this.$common.getTimestampms('2018-03-10 00:00:00'),
            endDate: this.$common.getTimestampms('2018-03-17 00:00:00'),
            calendarIds: 711
          }
        }).then((res) => {

        })
      },
      // 删除事件
      delEvent () {
        let url = this.$api.calendar.deleteEventById
        let method = 'POST'
        if (this.eventType !== 'normal') {
          url = this.$api.calendar.deleteTemplateEvent
          method = 'GET'
        }
        this.$confirm('确定要删除吗?', '事件删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: method,
            url: url,
            params: {
              eventId: this.eventId
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.$message({showClose: true, type: 'success', duration: 3000, message: '删除成功'})
              this.$router.push('/calendar/index')
            } else {
              this.$message({showClose: true, type: 'error', duration: 3000, message: res.data.returnMsg})
            }
          })
        }).catch(() => {})
      },
      // 绑定日常事件
      bindNormalEventInfo () {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getNormalEventInfo,
          params: {
            userId: this.$cookie.get('userId'),
            eventId: this.eventId,
            eventType: this.$route.query.eventType
          }
        }).then((res) => {
           if (res.data.returnCode === 1) {
             let data = res.data.returnObject
             this.eventName = data.eventName
             this.eventTemplateId = data.eventTemplateId
             this.calendarId = data.calendarId
             this.calendarName = data.calendarName
             this.eventLocation = data.eventLocation
             this.eventConfirmType = data.eventConfirmType
             this.eventConfirmDayType = data.eventConfirmDayType
             this.eventConfirmName = data.eventConfirmName === '无' ? '' : data.eventConfirmName
             this.eventConfirmDayName = data.eventConfirmDayName === '无' ? '' : data.eventConfirmDayName
             this.eventRemark = data.eventRemark
             if (data.inviterNumbersList) {
               this.inviterNumbers = data.inviterNumbersList
             }
             this.eventBeginDate = this.$common.transTime(data.eventBeginDate)[1]
             this.eventEndDate = this.$common.transTime(data.eventEndDate)[1]
             this.isSystem = data.isSystem
             this.eventConfirmFrequencyName = data.eventConfirmFrequencyName
             this.eventConfirmFrequency = data.eventConfirmFrequency
             let createUserId = data.createUserId
             if (createUserId == this.$cookie.get('userId')) {
               this.isOwn = true
             }
           } else {
             this.$message({showClose: true, type: 'error', duration: 3000, message: '事件详情获取失败或者事件已删除'})
             setTimeout(() => {

             })
           }
        })

      },
      // 绑定模板事件
      bindTemplateEventInfo () {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getTemplateEventInfo,
          params: {
            // userId: this.$cookie.get('userId'),
            eventId: this.eventId
          }
        }).then((res) => {
          if (res.data.returnCode === 1) {
            this.activeTab = '1'
            let data = res.data.returnObject
            this.eventName = data.eventName
            this.eventTemplateId = data.eventTemplateId
            this.calendarId = data.calendarId
            this.calendarName = data.calendarName
            this.eventLocation = data.eventLocation
            this.eventConfirmType = data.eventConfirmType
            this.eventConfirmDayType = data.eventConfirmDayType
            this.eventConfirmName = data.eventConfirmName
            this.eventConfirmDayName = data.eventConfirmDayName
            this.eventRemark = data.eventRemark

            console.log('inviterNumberList:' + !!data.inviterNumberList)
            if (data.inviterNumberList) {
              this.inviterNumbers = data.inviterNumberList
            }
            this.eventRDate = this.$common.transTime(data.eventRDate)[1]
            this.eventTDate = this.$common.transTime(data.eventTDate)[1]
            this.eventSDate = this.$common.transTime(data.eventSDate)[1]
            this.eventContainList = data.eventContainList
            if (data.templateEventTypeName === 'calendar_template_sh_a') {
              this.templateEventType = 1
            } else {
              this.templateEventType = 2
            }
            // this.templateEventType = data.templateEventType
            this.eventConfigValue = this.getObjById(data.templateEventType, this.eventTemplateConfig).valueList
            this.reportType = this.reportTypeName[data.reportType]
            this.choseBonused = data.choseBonused
            this.eventConfirmFrequencyName = data.eventConfirmFrequencyName
            this.eventConfirmFrequency = data.eventConfirmFrequency
            let createUserId = data.createUserId
            if (createUserId == this.$cookie.get('userId')) {
              this.isOwn = true
            }
          }
        })

      },
      getObjById(id, obj) {
        for (let i in obj) {
          if (obj[i].id === id) {
            return obj[i]
          }
        }
      }
    }
  }
</script>

<style lang="scss">
  #cEventDetaile {
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
        cursor: pointer;
      }
      .iarrow {
        font-weight: 900;
      }
      .editBtn {
        margin-top: 16px;
      }
    }
    .ctabs {
      margin: 0 0 20px 20px;
      .tabspane {
        width: 520px;
      }
      .inputTel {
        display: inline-block;
        width: 420px;
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
          cursor: default;
          img {
            height: 30px;
            position: relative;
            top: 10px;
            border-radius: 50%;
          }
          .tel {
            display: inline-block;
            width: 70%;
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
      .web-tixing {
        color:#e3e3e3;
        /*cursor: pointer;*/
      }
      .isRemind {
        color: #ffb148;
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
      color: #fb4319
    }
    .el-tabs__nav-wrap::after {
      height: 1px;
      background-color: #e3e3e3;
    }
    .detaileBox {
      // width:520px;
      font-size: 14px;
      padding-top: 20px;
      .el-col-6 {
        width: 27%;
      }
      .el-col-18 {
        width: 73%;
      }
    }
    .deleteBox {
       border-top:1px solid #e3e3e3;
       padding-top: 20px;
      .title {
        height: 28px;
        line-height: 28px;
      }
      .desc {
        padding-top: 10px;
        color:#aeaeae;
      }
     }
    .el-row {
      line-height: 35px;
    }
    .el-col-6 {
      color:#535353;
      font-weight: 400;
    }
    .el-col-18 {
      color:#aeaeae;
    }
    .eventDetaile {
      color:#ffb148;
      font-size: 14px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #e3e3e3;
      margin-bottom: 15px;
    }
    .eventNode {
      position: relative;
      margin: 10px 0;
      padding-left:15px;
      .line {
        position: absolute;
        width:1px;
        height: 110%;
        top:40px;
        background-color: #e3e3e3;
        .s1 {
          position: relative;
          display: inline-block;
          left:-6px;
          top:-6px;
          border-radius: 50%;
          width:12px;
          height: 12px;
          border:1px solid #aeaeae;
          &:before {
            content: '';
            border-radius: 50%;
            position: absolute;
            left:1px;
            top:1px;
            width:6px;
            height: 6px;
            border:1px solid #aeaeae;
            background-color: #aeaeae;
          }
        }
      }
      .eventContent {
        margin:5px 0 0 20px;
        padding:15px 15px;
        width:390px;
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
          width:40px;
          text-align: center;
          padding: 1px;
          font-size: 12px;
          border-radius: 5px;
          color:#fff;
          background-color: #849fee;
        }
      }
    }
    .overdue {
      .eventContent {
        background-color: #f9f9f9;
        border:0;
      }
      .text-black2 {
        color: #aeaeae !important;
      }
      .line {
        .s1 {
          border:1px solid #e3e3e3;
          &:before {
            border:1px solid #e3e3e3;
            background-color: #e3e3e3;
          }
        }
      }
    }
    .dateNow {
      .line {
        .s1 {
          border:1px solid #535353;
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
</style>
