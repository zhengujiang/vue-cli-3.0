<template>
  <div id="calendar">
    <div class="content">
      <div class="left">
        <calendar ref="Calendar" v-on:choseDay="clickDay" v-on:isToday="clickToday" v-on:changeMonth="changeDate"
                  :markArray=[]></calendar>
        <div class="addCalendar">
          <el-input v-model="calendarName" :maxlength='10' placeholder="输入日历名称"></el-input>
          <i class="addIcon" @click="addCalendar" @keyup.13="addCalendar">添加</i>
        </div>
        <div>
          <el-collapse v-model="activeNames">
            <el-collapse-item name="1">
              <template slot="title">
                我的日历
              </template>
              <calendarSort v-for="(list, index) in calendarList" :title="list.calendarName"
                            :title1="list.shareCalendarName"
                            :bgColor="list.calendarColor" :isChecked="list.isChecked"
                            :key="index" @link="editCalendar(list)" :share="list.isShare" :team="list.team"
                            @delete="delCalendar(list)" @changeColor="setColor(list,index)"
                            @isDisplay="isDisplay(list,index)"
                            v-show="index <= calendarList.length - 1 - systemCalendar.length"></calendarSort>
              <div class="noInfo" v-if="calendarList.length == systemCalendar.length">暂无个人日历信息！</div>
            </el-collapse-item>
          </el-collapse>
        </div>
        <div>
          <el-collapse v-model="activeNames2">
            <el-collapse-item name="2">
              <template slot="title">
                市场日历
              </template>
              <calendarSort v-for="(list, index) in calendarList" :title="list.calendarName"
                            :bgColor="list.calendarColor" :isChecked="list.isChecked"
                            @isDisplay="isDisplay(list,index)"
                            :key="index" sort="market"
                            v-if="index >= calendarList.length - systemCalendar.length"></calendarSort>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
      <div class="right">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  import nav from './nav.vue'
  import calendar from '../../components/calendar/vue-calendar.vue'
  import calendarSort from '../../components/calendar/calendarSort.vue'

  export default {
    data () {
      return {
        isActive: 'account',
        calendarName: '',
        activeNames: '1',
        activeNames2: '2',
        calendarList: [],
        systemCalendar: [],
        shareKey: '',
        marketCar: [],
        subscribeObj: {},
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
        ]
      }
    },
    // 使用其它组件
    components: {
      'v-nav': nav,
      calendar,
      calendarSort
    },
    activated () {
      console.log('keep-alive')
    },
    // 方法
    computed: {
      editSave () {
        return this.$store.state.editStatus
      },
      userName () {
        return this.$store.state.userData.userName
      }
    },
    watch: {
      '$route' (to, from) {
        this.setTab()
      },
      editSave (val) {
        // console.log('editStatus = ', val)
        this.getCalendarByUserId()
      },
      shareKey (val) {
        if (val) {
          this.subscribeOther()
        }
      },
      calendarList (val) {
        // console.log('calendarList = ', val)
        this.$store.commit('cScreen', this.calendarList)
      }
    },
    methods: {
      isDisplay (list, index) {
        console.log('$route =  =', this.$route.path)
        if (this.$route.path == '/calendar/searchEvent') {
          this.$router.push({
            path: '/calendar/searchEvent',
            query: {
              id: Math.random()
            }
          })
        }
        this.calendarList[index].isChecked ? this.calendarList[index].isChecked = false : this.calendarList[index].isChecked = true
        // console.log('this.calendarList[index].isChecked = ', list)
        // this.calendarList = Object.assign({}, this.calendarList)
        this.$http({
          method: 'POST',
          url: this.$api.calendar.updateCalendarCheckedStatus,
          params: {
            userId: this.$cookie.get('userId'),
            calendarId: this.calendarList[index].id,
            isChecked: this.calendarList[index].isChecked ? 1 : 0,
            isShare: this.calendarList[index].isShare ? 1 : 0,
            isSystem: this.calendarList[index].isSystem ? 1 : 0,
            isTeam: this.calendarList[index].team ? 1 : 0
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            // console.log('updateCalendarCheckedStatus', res.data.returnObject)
            this.getCalendarByUserId()
          } else {

          }
        })

      },
      // 共享日历添加
      addShareCalendar () {
        // console.log('添加共享日历', this.subscribeObj)
        this.$http({
          method: 'POST',
          url: this.$api.calendar.addShareCalendar,
          params: {
            userId: this.$cookie.get('userId'),
            calendarId: this.subscribeObj.id,
            calendarName: this.subscribeObj.calendarName,
            belongsUserId: this.subscribeObj.createUserId,
            remark: this.subscribeObj.calendarRemark,
            shareCalendarColor: this.subscribeObj.calendarColor,
            shareCalendarName: ''
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.getCalendarByUserId()
          } else if (res.data.returnCode == 2) {
            for (var i in this.calendarList) {
              if (this.subscribeObj.id == this.calendarList[i].id) {
                // console.log('123123123123====', this.calendarList[i])
                window.localStorage.setItem('editCalendarList', JSON.stringify(this.calendarList[i]))
                var url = '/calendar/editCalendar'
                this.$router.push(url)
              }
            }
          } else {
            this.$message({showClose: true, type: 'error', message: res.data.returnMsg, duration: 3000})
          }
        })
      },
      // subscribe
      subscribeOther () {
        // console.log('~~~~~~~~~~~~~~~~~~~~~~~~~')
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getShareCalendarInfo,
          params: {
            shareCalendarLink: this.shareKey
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            console.log('subscribeObj = ', res.data.returnObject)
            var obj = res.data.returnObject
            this.subscribeObj = obj
            var user = obj.createUserName ? obj.createUserName : ''
            this.$confirm(obj.calendarName + '，来自' + user + '分享', '添加日历', {
              confirmButtonText: '添加',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.addShareCalendar()
            })
          } else {
            this.$message({showClose: true, message: res.data.returnMsg, type: 'warning', duration: 3000})
          }
        })

      },
      // #
      splitTool (str) {
        return str.split('#')[1]
      },
      // color
      setColor (list, index) {
        this.calendarList[index].calendarColor = window.localStorage.getItem('color')
        // console.log(list, index, this.calendarList, this.calendarList[index].share)
        this.$http({
          method: 'POST',
          url: this.$api.calendar.editCalendarColor,
          params: {
            userId: this.$cookie.get('userId'),
            calendarId: list.id,
            calendarColor: this.splitTool(list.calendarColor),
            isShare: list.isShare ? '1' : '0'
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.getCalendarByUserId()
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '日历颜色修改失败！',
              duration: 3000
            })
          }
        })
      },
      // del
      delCalendar (list) {
        var text = ''
        if (list.isShare) {
          text = '确定要退订“'
        } else {
          text = '确定要移除“'
        }
        this.$confirm(text + list.calendarName + '”吗？您将无法再查看此日历和其中的活动。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.calendar.deleteCalendarInfo,
            params: {
              userId: this.$cookie.get('userId'),
              isShare: list.isShare ? '1' : '0',
              calendarId: list.id
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.getCalendarByUserId()
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: '日历' + text + '失败！',
                duration: 3000
              })
            }
          })
        })
      },
      // 编辑日历
      editCalendar (list) {
        // console.log('----- list ------', list)
        var url = '/calendar/editCalendar?id=' + Math.random()
        this.$router.push(url)
        window.localStorage.setItem('editCalendarList', JSON.stringify(list))
      },
      // 根据userID获取个人日历列表
//      getUserCanlendarList () {
//        this.$http({
//          method: 'GET',
//          url: this.$api.calendar.getCalendarByUserId,
//          params: {
//            userId: this.$cookie.get('userId')
//          }
//        }).then((res) => {
//          if (res.data.returnCode == 1) {
//            this.calendarList = []
//            let result = []
//            result = res.data.returnObject
//            for (let i in result) {
//              result[i].isfocus = true
//              this.calendarList.push(result[i])
//            }
//            // console.log('= this.calendarList =', this.calendarList)
//          } else {
//            this.$message({
//              showClose: true,
//              type: 'error',
//              message: '日历获取失败！',
//              duration: 3000
//            })
//          }
//        })
//      },
      // 获取所属自己的日历
      getCalendarByUserId () {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getUserCanlendarList, // getCalendarByUserId
          params: {
            userId: this.$cookie.get('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            // console.log('获取所属自己的日历', res.data.returnObject)
            this.systemCalendar = res.data.returnObject.marketCalendar
            this.calendarList = []
            var result = []
            result = res.data.returnObject.personalCalendar
            var personal = res.data.returnObject.personalCalendar
            if (!result) {
              result = []
            }
            if (res.data.returnObject.shareCalendar) {
              result = result.concat(res.data.returnObject.shareCalendar)
            }
            if (res.data.returnObject.marketCalendar) {
              let marketArr = res.data.returnObject.marketCalendar
//              let objx = marketArr[0]
//              let objy = marketArr[2]
//              marketArr[0] = objy
//              marketArr[2] = objx
              result = result.concat(marketArr)
            }
            for (let i in result) {

              if (result[i].calendarColor) {
                result[i].calendarColor = '#' + result[i].calendarColor
              } else {
                // result[i].calendarColor = this.colorArr[i].value
              }
              result[i].isChecked = result[i].isCheck
              this.calendarList.push(result[i])
            }
            this.calendarList = Object.assign([], this.calendarList)
            this.$store.commit('cScreen', this.calendarList)
            window.localStorage.setItem('calendarList', JSON.stringify(this.calendarList))
            // console.log('-------', personal)
            if (personal == undefined) {
              // console.log('-------', result)
              this.calendarName = '我的日历'
              this.addCalendar()
            }
            // console.log('this.calendarList = ', this.calendarList)
          } else {
//            this.$message({
//              showClose: true,
//              type: 'error',
//              message: '日历获取失败！',
//              duration: 3000
//            })
          }
        })
      },
      // 创建日历
      addCalendar () {
        if (this.calendarName == '') {
          this.$message({
            showClose: true,
            type: 'error',
            message: '请先填写日历名称！',
            duration: 3000
          })
        } else {
          var color = ''
          // console.log('===== calendarList =====', this.calendarList)
          if (this.calendarName == '我的日历') {
            color = '9f2956'
          } else {
            let num = this.systemCalendar.length ? this.systemCalendar.length : 4
            console.log('fsdklfjlsdkjfklds = ', num, this.systemCalendar.length)
            color = this.colorArr[this.calendarList.length - num].value.split('#')[1]
          }
          this.$http({
            method: 'POST',
            url: this.$api.calendar.addCalendar,
            params: {
              userId: this.$cookie.get('userId'),
              calendarName: this.calendarName,
              calendarRemark: '',
              calendarColor: color
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              // console.log('创建日历', res.data.returnObject)
              this.calendarName = ''
              this.getCalendarByUserId() // 获取所属自己的日历
            } else {
              this.$message({
                showClose: true,
                type: 'error',
                message: res.data.returnMsg,
                duration: 3000
              })
            }
          })
        }
      },
      setTab () {
        this.isActive = this.$route.meta.tabName
      },
      clickDay (data) {
        console.log('选中了', data, Date.parse(new Date(data))) // 选中某天
        var dateParse = Date.parse(new Date(data))
        this.$store.commit('selectDate', dateParse)
      },
      clickToday (data) {
        console.log('跳到了本月', data) // 跳到了本月
      },
      changeDate (data) {
        console.log('左右点击切换月份', data) // 左右点击切换月份
      },
      demo () {
        // this.$refs.Calendar.ChoseMonth('2017-12-12',false); //跳到12月12日 但是不选中12月12日
        this.$refs.Calendar.ChoseMonth('2017-12-12') // 跳到12月12日
      }
    },
    // 生命周期函数
    created () {
      // console.log('userObj', this.$store.state.userData.userName)

      this.setTab()

      if (this.$cookie.get('userId')) {
        this.shareKey = this.$route.query.cid
      }
    },
    mounted () {
      // console.log('---', this.$store.state.userData.userName)

      this.getCalendarByUserId()
    }
  }
</script>

<style lang="scss">
  #calendar {
    padding: 20px 0;
    min-height: 800px;
    background-color: #f6f6f6;
    .el-collapse-item {
      .el-collapse-item__header {
        border-bottom: 1px solid #e3e3e3;
      }
      .el-collapse-item__wrap {
        border-bottom: 1px solid #e3e3e3;
      }
    }
    .is-active {
      .el-collapse-item__header {
        border-bottom: none;
      }
    }
    .el-collapse-item:last-child {
      .el-collapse-item__header {
        border-bottom: none;
      }
      .el-collapse-item__wrap {
        border-bottom: none;
      }
    }
    .left {
      float: left;
      width: 240px;
      background-color: #fff;
      border: 1px solid #e3e3e3;
      border-radius: 2px;
      min-height: 750px;
      height: auto !important;
      .el-collapse {
        border-top: 1px solid #e3e3e3;
        border-bottom: 1px solid #e3e3e3;
      }
      .el-collapse-item__header {
        box-sizing: border-box;
        padding-right: 15px;
        padding-left: 15px;
        font-size: 16px;
        color: #323232;
        font-weight: normal;
        .el-collapse-item__arrow {
          margin-right: 0 !important;
        }
      }
      .addCalendar {
        width: 100%;
        height: 50px;
        border-top: 1px solid #e3e3e3; /*border-bottom: 1px solid #e3e3e3;*/
        padding: 10px 15px;
        box-sizing: border-box;
        position: relative;
        .addIcon {
          // font-weight: bold;
          position: absolute;
          right: 15px;
          top: 10px;
          font-size: 14px;
          line-height: 30px;
          text-align: center;
          width: 43px;
          height: 30px;
          background: #ffb148;
          color: #fff;
          user-select: none;
          cursor: pointer;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          &:active {
            color: #ffb148;
            background: #fff;
          }
        }
        .el-input__inner {
          width: 100%;
          height: 30px;
          border-radius: 4px;
          padding: 0 20px 0 10px;
          caret-color: #ffb148;
        }
      }
      .noInfo {
        padding: 0 15px;
        color: #323232;
        font-size: 14px;
      }
    }
    .right {
      padding: 15px 20px !important;
      min-height: 750px!important;
      float: right;
      width: 940px;
      background-color: #fff;
      border: 1px solid #e3e3e3;
    }
  }
</style>
