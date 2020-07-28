<template>
  <div id="editCalendar">
    <div class="ctitle">
      <router-link to="/calendar/index" class="back"><i class="el-icon-arrow-left iarrow"></i> 返回</router-link>
      <span>编辑日历</span>
    </div>
    <div class="info">
      <p>基本信息</p>
      <div class="name" v-if="this.isShare">
        <label>名称</label>
        <div style="line-height: 40px;width: 85%">
          {{ this.editObj.calendarName }}
          <span v-show="this.editObj.belongsUserName">(来自{{this.editObj.belongsUserName}}的分享)</span>
        </div>
      </div>
      <div class="name" v-if="this.isShare">
        <label>别名</label>
        <el-input v-model="inputName" placeholder="请输入日历别名"></el-input>
      </div>
      <div class="name" v-else-if="!this.isShare">
        <label>名称</label>
        <el-input v-model="inputName" placeholder="请输入日历名称"></el-input>
      </div>
      <div class="remarks">
        <label>备注</label>
        <el-input
          type="textarea"
          :autosize="{ minRows: 4, maxRows: 4}"
          placeholder=""
          resize="none"
          v-model="textarea">
        </el-input>
      </div>
      <el-button @click="saveChange">保存</el-button>
    </div>
    <div class="share" v-show="!this.isShare">
      <p>共享日历</p>
      <el-button @click="getUrl">获取共享链接</el-button>
      <ul>
        <li v-for="(list,index) in shareList" :key="index">
          <span class="headerImg">
            <img :src="list.userAvatar" alt="" v-if="list.userName">
            <img :src="$image.user.calendar.headerImg" alt="" v-else>
          </span>
          <span class="realName">{{list.userName}}</span>
          <span class="cancelShare" @click="cancelMethod(list.userId)">取消</span>
          <i></i>
        </li>
        <li class="noInfo" v-show="shareList.length == 0">{{noInfo}}</li>
      </ul>
    </div>
    <div class="delete" v-show="!this.isShare">
      <p>删除日历</p>
      <el-button @click="delCalendar">删除</el-button>
      <p>{{ delText }}</p>
    </div>
    <div class="delete" v-show="this.isShare">
      <p>退订日历</p>
      <el-button @click="delCalendar('tui')">退订</el-button>
      <p>退订后，您将无法再访问此日历。</p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'cEdit',
    data() {
      return {
        inputName: '',
        inputNameOther: '',
        textarea: '',
        isShare: false,
        editObj: {},
        delText: '系统将删除此日历中的所有活动。如果其中的活动包含通知对象，则相应活动也将从通知对象的日历中删除。',
        shareList: [
          {
            id: '0',
            belongsUserAvatar: this.$image.user.calendar.headerImg,
            belongsUserName: 'user01'
          },
          {
            id: '0',
            belongsUserAvatar: this.$image.user.calendar.headerImg,
            belongsUserName: 'user01'
          },
          {
            id: '0',
            belongsUserAvatar: this.$image.user.calendar.headerImg,
            belongsUserName: 'user01'
          }
        ],
        noInfo: '暂无共享人信息！'
      }
    },
    created() {
      this.editObj = JSON.parse(window.localStorage.getItem('editCalendarList'))
      this.inputName = this.editObj.calendarName
      this.textarea = this.editObj.calendarRemark
      this.isShare = this.editObj.isShare
      if (this.isShare) {
        this.inputName = this.editObj.shareCalendarName
      }
      // {"id":"2","calendarName":"节日日历","calendarColor":"red","isfocus":false}
      this.getCalendarShareUsers()
    },
    watch: {
      '$route': 'getPath'
    },
    methods: {
      //
      getPath() {
//        let path = this.$route.path
//        console.log('12312312', path)
        this.textarea = ''
        this.inputName = ''
        this.editObj = JSON.parse(window.localStorage.getItem('editCalendarList'))
        // console.log('-------this.editObj =====', this.editObj)
        this.inputName = this.editObj.calendarName
        this.textarea = this.editObj.calendarRemark
        this.isShare = this.editObj.isShare
        if (this.isShare) {
          this.inputName = this.editObj.shareCalendarName
        }
        this.getCalendarShareUsers()
      },
      //
      cancelMethod(id) {
        this.$http({
          method: 'POST',
          url: this.$api.calendar.cancelCalendarShareUsers,
          params: {
            calendarId: this.editObj.id,
            shareUserId: id
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.getCalendarShareUsers()
          } else {
            this.$message({
              showClose: true,
              message: '取消日历共享人失败！',
              duration: 3000,
              type: 'error'
            })
          }
        })
      },
      // 获取日历共享人
      getCalendarShareUsers() {
        this.shareList = []
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getCalendarShareUsers,
          params: {
            calendarId: this.editObj.id
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            console.log('this.shareList = []', res.data.returnObject)
            let arr = res.data.returnObject.data
            if (arr) {
              this.shareList = arr
            } else {
              this.shareList = []
            }
            console.log(this.shareList)
          } else {
//            this.$message({
//              showClose: true,
//              message: '获取日历共享人失败！',
//              duration: 3000,
//              type: 'error'
//            })
          }
        })
      },
      getUrl() {
        this.$router.push('/calendar/shareLink')
      },
      // 删除日历
      delCalendar(str) {
        var text = ''
        if (str == 'tui') {
          text = '退订'
        } else {
          text = '删除'
        }
        this.$confirm(text + this.inputName + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            method: 'POST',
            url: this.$api.calendar.deleteCalendarInfo,
            params: {
              userId: this.$cookie.get('userId'),
              isShare: this.isShare ? '1' : '0',
              calendarId: this.editObj.id
            }
          }).then((res) => {
            if (res.data.returnCode == 1) {
              this.returnM(text + '成功！')
            } else {
              this.$message({
                showClose: true,
                message: '删除失败！',
                duration: 3000,
                type: 'error'
              })
            }
          })
        }).catch(() => {

        })
      },
      // 返回同一方法
      returnM(str) {
        this.$router.push('/calendar/index')
        this.$store.commit('editStatus', 3 * Math.random())
        this.$message({
          type: 'success',
          showClose: true,
          message: str,
          duration: 3000
        })
      },
      // 保存修改
      saveChange() {
        this.$http({
          method: 'POST',
          url: this.$api.calendar.editCalendarInfo,
          params: {
            userId: this.$cookie.get('userId'),
            calendarId: this.editObj.id,
            isShare: this.editObj.isShare ? '1' : '0',
            calendarName: this.inputName,
            remark: this.textarea
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.returnM('保存成功！')
          } else {
            this.$message({
              type: 'warning',
              showClose: true,
              message: '保存失败！',
              duration: 3000
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss">
  #editCalendar {
    width: 100%;
    height: 60px;
    margin-top: -10px;
    .ctitle {
      position: relative;
      border-bottom: 1px solid #e3e3e3;
      line-height: 60px;
      text-align: center;
      font-size: 16px;
      color: #323232;
      .back {
        position: absolute;
        left: 0;
        color: #ffb148;
      }
      .iarrow {
        font-weight: 900;
      }
    }
    .info {
      padding: 20px;
      box-sizing: border-box;
      p {
        font-size: 16px;
        color: #323232;
        margin-bottom: 20px;
      }
      .name {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        label {
          display: inline-block;
          line-height: 40px;
          width: 10%;
          height: 40px;
          text-indent: 2em;
        }
        .el-input {
          display: inline-block;
          width: 85%;
          height: 40px;
        }
      }
      .remarks {
        width: 100%;
        height: auto;
        display: flex;
        justify-content: space-between;
        margin-top: 15px;
        margin-bottom: 20px;
        label {
          text-indent: 2em;
        }
        .el-textarea {
          width: 85%;
          .el-textarea__inner {
            color: #323232;
          }
        }
      }
      .el-button {
        width: 100px;
        height: 30px;
        background: #ffb148;
        color: #fff;
        line-height: 30px;
        text-align: center;
        padding: 0;
        border: none;
        margin-left: 15%;
        &:active {
          background: #FFF;
          color: #ffb148;
        }
      }
    }
    .share, .delete {
      padding: 10px 20px;
      box-sizing: border-box;
      border-top: 1px solid #e3e3e3;
      border-bottom: 1px solid #e3e3e3;
      position: relative;
      .el-button {
        width: 110px;
        height: 30px;
        background: #ffb148;
        color: #fff;
        line-height: 30px;
        text-align: center;
        padding: 0;
        border: none;
        position: absolute;
        right: 0;
        top: 10px;
        &:active {
          background: #FFF;
          color: #ffb148;
        }
      }
      ul {
        margin-top: 20px;
        li {
          width: 48%;
          height: 70px;
          display: inline-block;
          // border: 1px solid #e3e3e3;
          box-sizing: border-box;
          padding: 10px 0;
          position: relative;
          i {
            width: 1px;
            height: 30px;
            background: #e3e3e3;
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            margin: auto;
          }
          span {
            float: left;
          }
          .headerImg {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            overflow: hidden;
            img {
              display: block;
              width: 100%;height: 100%;
            }
          }
          .realName, .cancelShare {
            width: auto;
            line-height: 50px;
            margin-left: 20px;
            font-size: 16px;
            color: #aeaeae;
          }
          .cancelShare {
            float: right;
            margin-right: 20px;
          }
        }
        li:nth-child(2n) {
          margin-left: 20px;
          i {
            display: none;
          }
        }
        .noInfo {
          border: none;
          color: #8d8d8d;
          height: auto;
          padding-top: 0;
          cursor: default;
        }
      }
    }
    .delete {
      border: none;
      .el-button {
        width: 55px;
      }
      p:last-child {
        color: #8d8d8d;
        font-size: 16px;
        margin-top: 10px;
      }
    }
  }
</style>
