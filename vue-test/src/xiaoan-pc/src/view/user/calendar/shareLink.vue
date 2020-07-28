<template>
  <div id="calendarUrl">
    <div class="ctitle">
      <div @click="$router.go(-1)" class="back"><i class="el-icon-arrow-left iarrow"></i> 返回</div>
      <span>编辑日历</span>
    </div>
    <div class="info">
      <p>
        日历共享链接
        <span>（点击更新共享链接后，原共享链接失效）</span>
        <span @click="updateUrl" style="cursor: pointer">
          <i class="el-icon-refresh"></i>
          更新
        </span>
      </p>
      <div>
        <el-input v-model="url" id="copy"></el-input>
        <el-button @click="copyLink">复制链接</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        editObj: {},
        url: ''
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created () {
      this.editObj = JSON.parse(window.localStorage.getItem('editCalendarList'))
      this.getShareCalendarLink()
    },
    mounted () {
    },
    // 方法
    methods: {
      updateUrl () {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.updateShareCalendarLink,
          params: {
            calendarId: this.editObj.id,
            dateTime: Math.random()
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            // console.log('url = ', res.data.returnObject)
            var url = res.data.returnObject
            this.url = this.$api.host + 'calendar/index?cid=' + url
          } else {
            this.$message({
              type: 'error',
              duration: 3000,
              showClose: true,
              message: '更新共享链接失败!'
            })
          }
        })
      },
      getShareCalendarLink () {
        this.$http({
          method: 'GET',
          url: this.$api.calendar.getShareCalendarLink,
          params: {
            calendarId: this.editObj.id
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            // console.log('124', res.data.returnObject)
            this.url = ''
            var url = res.data.returnObject
            this.url = this.$api.host + 'calendar/index?cid=' + url
          } else {
            this.$message({
              showClose: true,
              type: 'error',
              message: '链接获取失败！',
              duration: 3000
            })
          }
        })
      },
      copyLink () {
        var e = document.getElementById('copy')
        e.select() // 选择对象
        document.execCommand('Copy') // 执行浏览器复制命令
        this.$message({
          showClose: true,
          message: '复制链接成功！',
          duration: 3000,
          type: 'success'
        })
      }
    }
  }
</script>

<style lang="scss">
  #calendarUrl {
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
        cursor: pointer;
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
        span {
          color: #8d8d8d;
        }
        span:last-child {
          color: #ffb148;
          user-select: none;
          float: right;
          &:active {
            color: #fff;
          }
        }
      }
      div {
        .el-input {
          width: 87%;
        }
        .el-button {
          color: #fff;
          background: #ffb148;
          font-size: 16px;
          border: none;
          float: right;
          &:active {
            background: #fff;
            color: #ffb148;
          }
        }
      }
    }
  }
</style>
