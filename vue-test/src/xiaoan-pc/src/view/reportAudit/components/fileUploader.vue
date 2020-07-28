<template>
  <div id="file-uploader" :class="uploadStatus == 'no-file-chosen' ? 'no-file-chosen' : ''">
    <div v-if="uploadStatus == 'no-file-chosen'" id="drop-zone"
         @dragover.prevent="onDragover"
         @drop.prevent="onDrop"
         @click="uploadFileFromClick"
    >
      <input type="file" name="file" id="file-input" style="opacity: 0; display: none" ref="uploadBtn"
             @change="handleFiles"/>
      <img :src="$image.reportAudit.upload"/>
      <p>点击或将文件拖拽到这里上传</p>
      <small>支持扩展名：doc, docx, pdf</small>
    </div>
    <div v-else-if="uploadStatus == 'uploading'" class="status-wrapper uploading">
      <div class="progress-wrapper">
        <el-progress :stroke-width="10" :percentage="uploadPercentage" color="rgb(255, 177, 72)"
                     :show-text="false"></el-progress>
      </div>
      <p class="label">上传中...</p>
    </div>
    <div v-else-if="uploadStatus == 'uploaded'" class="status-wrapper uploaded">
      <img :src="$image.reportAudit.doc" style="width: 27px; height: 30px"/>
      <p class="label">上传完成</p>
    </div>
    <div v-else-if="uploadStatus == 'queuing'" class="status-wrapper queuing">
      <img :src="$image.reportAudit.doc" style="width: 27px; height: 30px"/>
      <p class="label">排队中，前面还有{{queueSize}}位</p>
    </div>
    <div v-else-if="uploadStatus == 'checking'" class="status-wrapper checking">
      <div class="progress-wrapper">
        <el-progress :stroke-width="10" :percentage="checkProgress" :text-inside="true" color="rgb(255, 177, 72)"
                     :show-text="false"></el-progress>
      </div>
      <p class="label"><img :src="$image.reportAudit.doc"
                            style="width: 18px; height: 20px; margin-right: 5px; vertical-align: sub"/>检测中...</p>
    </div>
    <div v-else-if="uploadStatus == 'completed'" class="status-wrapper completed">
      <div class="result-wrapper">
        <div class="result">
          <img :src="$image.reportAudit.doc" style="width: 27px; height: 30px; margin-bottom: 5px"/>
          <p class="label">{{resultHint}}<span v-if="(errorAmount + riskAmount) != 0">{{countDownToHuman}}</span></p>
        </div>
        <div class="filename">
          <img :src="$image.reportAudit.doc" style="width: 18px; height: 20px; margin-right: 8px"/>
          <span>文件名称：{{uploadedFileName}}</span>
        </div>
      </div>
      <div class="options-wrapper">
        <div class="option" :class="errorAmount != 0 ? 'top shadow' : ''">
          <router-link v-if="errorAmount != 0" :to="{ name: 'audit-result', params: { resultType: 'error' } }">
            {{errorAmount}}错误问题
          </router-link>
          <span v-else>{{errorAmount}}错误问题</span>
        </div>
        <div class="option" :class="riskAmount != 0 ? 'mid shadow' : ''">
          <router-link v-if="riskAmount != 0" :to="{ name: 'audit-result', params: { resultType: 'risk' } }">
            {{riskAmount}}风险提示
          </router-link>
          <span v-else>{{riskAmount}}风险提示</span>
        </div>
        <div class="option bottom shadow">
          <el-button type="text" @click="newCheck"><i class="el-icon-upload2"></i>新建检测</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import Axios from '@/service/http'
  import Xy from '@/service/testXyApi'

  export default {
    name: "fileUploader",
    data() {
      return {
        uploadStatus: 'no-file-chosen',
        uploadedFileName: '',
        uploadedFileId: '',
        uploadedStatus: '',
        queueSize: 0,
        queueCompletionQuerier: null,
        checkProgress: 0,
        checkedTime: '',
        checkCompletionQuerier: null,
        errorAmount: 0,
        riskAmount: 0,
        uploadPercentage: 0,
        resultHint: '检测完成，此文件未检测到问题，将于24小时后被销毁',
        countDownTimer: null,
        countDownToHuman: ''
      }
    },
    async created() {
      if (this.$cookie.get('xyUserId').length === 0) {
        await Axios.get(Xy.api.createUser(), {
          params: {
            dengluZh: this.$cookie.get('userId').slice(0, 30),
            yonghuMm: 'in-hope.cn'
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        let loginRes = await Axios.get(Xy.api.login(), {
          params: {
            username: this.$cookie.get('userId').slice(0, 30),
            password: 'in-hope.cn'
          },
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        this.$cookie.set('xyUserId', loginRes.data.data.user.userId)
        this.$cookie.set('xyUserToken', loginRes.data.data['user-token'])
      }

      Xy.api.userId = this.$cookie.get('xyUserId')
      Xy.api.userToken = this.$cookie.get('xyUserToken')

      if (localStorage.checkedTime) {
        this.uploadStatus = 'completed'
        this.errorAmount = parseInt(localStorage.errorAmount)
        this.riskAmount = parseInt(localStorage.riskAmount)
        this.uploadedFileName = localStorage.uploadedFileName
        this.checkedTime = localStorage.checkedTime
        this.getCheckResult()
      } else {
        switch (localStorage.uploadStatus) {
          case 'uploaded':
            this.uploadStatus = 'uploaded'
            this.queryQueueCompletion()
            break;
          case 'queuing':
            this.uploadStatus = 'uploaded'
            this.queryQueueCompletion()
            break;
          case 'checking':
            this.uploadStatus = 'uploaded'
            this.queryCheckingCompletion()
            break;
          case 'completed':
            this.uploadStatus = 'completed'
            this.uploadedFileName = localStorage.uploadedFileName
            this.checkedTime = localStorage.checkedTime
            this.queryCheckingCompletion()
            break;
        }
      }
    },
    methods: {
      uploadFileFromClick: function () {
        this.$refs.uploadBtn.click()
      },

      handleFiles: function (ev) {
        if (ev.target.files[0]) {
          let file = ev.target.files[0]
          this.uploadedFileName = file.name

          this.uploadFile(file)
        }
      },

      onDragover: function (ev) {
        // console.log('handleDragOver');
      },
      onDrop: async function (ev) {
        // console.log('handleDrop')

        if (ev.dataTransfer.files[0]) {

          let file = ev.dataTransfer.files[0]
          this.uploadedFileName = ev.dataTransfer.files[0].name

          this.uploadFile(file)
        }

        this.currentlyDragging = null;
        this.loggedEvent = 'handleDrop';
      },

      uploadFile: async function (file) {
        // console.log('Start Uploading')

        let formData = new FormData();

        formData.append('file', file);
        formData.append('userId', Xy.api.userId);
        formData.append('projectName', `project-${this.uuid()}`);
        formData.append('companyName', 'testCompany');
        formData.append('wenjianName', file.name);
        formData.append('wenjianLx', '三季度报告');
        formData.append('wenjianLxBm', '9000680001004');
        formData.append('gongsiLx', '9000040001');
        formData.append('shichangLx', '9000010001');
        formData.append('shangshiBk', '010001001');

        this.uploadStatus = 'uploading'

        let response = await Axios.post(Xy.api.uploadFile(),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'user-token': Xy.api.userToken
            },
            onUploadProgress: progressEvent => {
              this.uploadPercentage = (progressEvent.loaded / progressEvent.total * 100 | 0)
            }
          }
        )

        this.uploadStatus = 'uploaded'
        localStorage.uploadStatus = this.uploadStatus

        this.uploadedFileId = response.data.data
        localStorage.uploadedFileId = this.uploadedFileId
        localStorage.uploadedFileName = this.uploadedFileName

        this.queryQueueCompletion()
      },

      queryQueueCompletion: async function () {
        this.queueCompletionQuerier = window.setInterval(this.queryQueuingProgress, 1000);
      },

      queryQueuingProgress: async function () {
        let formData = new FormData();

        this.uploadStatus = 'queuing'
        localStorage.uploadStatus = this.uploadStatus

        formData.append('userId', Xy.api.userId);
        let response = await Axios.get(Xy.api.getQueueSize(), {
            headers: {
              'Content-Type': 'multipart/form-data',
              'user-token': Xy.api.userToken
            }
          }
        );

        let res = response.data

        if (res.data == 0) {
          this.stopQueueCompletionQuerier();
        } else {
          this.queueSize = res.data
        }
      },

      stopQueueCompletionQuerier() {
        clearInterval(this.queueCompletionQuerier);
        this.startCheckingFile()
      },

      startCheckingFile: async function () {
        let formData = new FormData();

        formData.append('userId', Xy.api.userId);
        formData.append('wenjians', JSON.stringify(
          [
            {
              wenjianId: localStorage.uploadedFileId,
              jianceLxBm: "9000710002001"
            }
          ])
        );

        let response = await Axios.post(Xy.api.startChecking(),
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'user-token': Xy.api.userToken
            }
          }
        );

        this.uploadStatus = 'checking'
        localStorage.uploadStatus = this.uploadStatus

        this.queryCheckingCompletion();
      },

      queryCheckingCompletion: async function () {
        this.checkCompletionQuerier = window.setInterval(this.queryCheckingProgress, 2000);
      },

      queryCheckingProgress: async function () {
        let formData = new FormData();

        this.uploadStatus = 'checking'
        localStorage.uploadStatus = this.uploadStatus

        formData.append('userId', Xy.api.userId);
        let response = await Axios.get(Xy.api.checkProgress(), {
            params: {
              userId: Xy.api.userId
            },
            headers: {
              'Content-Type': 'multipart/form-data',
              'user-token': Xy.api.userToken
            }
          }
        );

        let res = response.data.data.find(file => file.wenjianId === localStorage.uploadedFileId);

        if (!res) {
          this.stopCheckCompletionQuerier();
        } else {
          // display checking progress
          let curProgres = 0

          res.mokuaiJinduList.forEach(e => {
            if (e.jianceZt === 'FIN') {
              curProgres += 1
            }
          });
          this.checkProgress = curProgres * 100 / 5
        }
      },

      stopCheckCompletionQuerier: function () {
        clearInterval(this.checkCompletionQuerier);

        this.getCheckResult()
      },

      getCheckResult: async function () {
        let response = await Axios.get(Xy.api.findResults(), {
            params: {
              id: localStorage.uploadedFileId,
              typeGj: '9000710002004,9000710002002,9000710002003',
              typeIssue: '9000690001,9000690002',
              typeTable: '9000150015,9000150016,9000150017,fb',
              shifouhulue: '9000570008,9000570007,9000570006'
            },
            headers: {
              'Content-Type': 'multipart/form-data',
              'user-token': Xy.api.userToken
            }
          }
        );

        if (!localStorage.checkedTime) {
          this.checkedTime = new Date()
          localStorage.checkedTime = this.checkedTime
        }

        this.errorAmount = 0
        this.riskAmount = 0

        response.data.data.forEach(d => {
          if (d.guizeLxBm === '9000690001') {
            this.errorAmount += 1
          } else if (d.guizeLxBm === '9000690002') {
            this.riskAmount += 1
          }
        })

        localStorage.errorAmount = this.errorAmount
        localStorage.riskAmount = this.riskAmount

        if (this.errorAmount + this.riskAmount > 0) {
          this.resultHint = '检测完成，距离文件被销毁还剩：'
        } else {
          this.resultHint = '检测完成，此文件未检测到问题，将于24小时内被销毁'
        }

        this.uploadedFileName = localStorage.uploadedFileName
        this.uploadStatus = 'completed'
        localStorage.uploadStatus = this.uploadStatus

        this.startCountDown()
      },

      startCountDown() {
        this.countDownTimer = window.setInterval(this.countDownInterval, 1000);
      },

      countDownInterval() {
        let timeNow = new Date()
        let date = new Date(this.checkedTime)
        let finalDate = new Date(date.getTime() + 24 * 60 * 60 * 1000)
        // let finalDate = new Date(date.getTime() + 3 * 60 * 1000)
        if ((finalDate - timeNow) > 0) {
          this.countDownToHuman = this.msToTime(finalDate - timeNow)
        } else {
          this.stopCountDown()
        }
      },

      stopCountDown() {
        clearInterval(this.countDownTimer)
        this.$alert('您检测的文件超出24小时了，请重新上传', '超时提醒', {
          confirmButtonText: '确定',
          callback: () => {
            this.uploadStatus = 'no-file-chosen'
            this.uploadedFileName = ''
            this.uploadedFileId = ''
            this.uploadedStatus = ''
            this.queueSize = 0
            this.queueCompletionQuerier = null
            this.checkProgress = 0
            this.checkedTime = ''
            this.checkCompletionQuerier = null
            this.errorAmount = 0
            this.riskAmount = 0
            this.uploadPercentage = 0
            this.resultHint = '检测完成，此文件未检测到问题，将于24小时后被销毁'
            this.countDownTimer = null
            this.countDownToHuman = ''
            localStorage.removeItem('uploadStatus')
            localStorage.removeItem('uploadedFileId')
            localStorage.removeItem('uploadedFileName')
            localStorage.removeItem('errorAmount')
            localStorage.removeItem('riskAmount')
            localStorage.removeItem('checkedTime')
          }
        })
      },

      msToTime(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
          seconds = parseInt((duration / 1000) % 60),
          minutes = parseInt((duration / (1000 * 60)) % 60),
          hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
      },

      newCheck() {
        if (this.countDownTimer) {
          clearInterval(this.countDownTimer)
        }

        this.$confirm('新建检测时，您之前的检测报告将会被替换', '新建检测', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.uploadStatus = 'no-file-chosen'
          this.uploadedFileName = ''
          this.uploadedFileId = ''
          this.uploadedStatus = ''
          this.queueSize = 0
          this.queueCompletionQuerier = null
          this.checkProgress = 0
          this.checkedTime = ''
          this.checkCompletionQuerier = null
          this.errorAmount = 0
          this.riskAmount = 0
          this.uploadPercentage = 0
          this.resultHint = '检测完成，此文件未检测到问题，将于24小时后被销毁'
          localStorage.removeItem('uploadStatus')
          localStorage.removeItem('uploadedFileId')
          localStorage.removeItem('uploadedFileName')
          localStorage.removeItem('errorAmount')
          localStorage.removeItem('riskAmount')
          localStorage.removeItem('checkedTime')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      uuid: function () {
        var uuid = "", i, random;
        for (i = 0; i < 32; i++) {
          random = Math.random() * 16 | 0;
          if (i == 8 || i == 12 || i == 16 || i == 20) {
            uuid += "-"
          }
          uuid += (i == 12 ? 4 : (i == 16 ? (random & 3 | 8) : random)).toString(16);
        }
        return uuid;
      }
    }
  }
</script>

<style lang="sass" scoped>
  #file-uploader
    border: 1px solid #EAEAEA
    border-radius: 4px
    width: 100%
    min-height: 180px
    display: flex
    justify-content: center
    align-items: center

    &.no-file-chosen
      border: 4px solid rgba(255, 177, 72, .5)
      border-radius: 4px
      cursor: pointer

    #drop-zone
      border: 2px dashed rgb(255, 177, 72)
      border-radius: 4px
      width: 100%
      margin: 1rem
      padding: 1rem
      display: flex
      flex-direction: column
      align-items: center

      img
        margin: 10px 0

      small
        color: grey

    .status-wrapper
      width: 50%
      text-align: center

      &.completed
        width: 100%
        height: 300px
        display: flex
        flex-direction: row
        justify-content: space-between
        align-items: center

        .result-wrapper
          width: 80%
          height: 100%
          display: flex
          flex-direction: column
          justify-content: space-between
          align-items: center

          .result
            width: 100%
            height: 85%
            display: flex
            flex-direction: column
            justify-content: center
            align-items: center
            border-bottom: 1px solid #EAEAEA

            span
              color: #FFB148
              font-size: 20px
              font-weight: bold
              margin-right: 4px

          .filename
            height: 15%
            color: grey
            display: flex
            flex-direction: row
            align-items: center
            margin-left: 20px
            align-self: flex-start

        .options-wrapper
          width: 20%
          height: 100%
          display: flex
          flex-direction: column
          justify-content: space-between

          .option
            height: 33.33%
            display: flex
            justify-content: center
            align-items: center
            color: #8D8D8D
            background: #E3E3E3

            a, .el-button
              color: white
              font-size: 16px

            &.shadow
              box-shadow: -8px 4px 15px 0 rgba(198, 178, 178, .5)

            &.top
              background: #BB2740

            &.mid
              background: #DC6900

            &.bottom
              background: #FFB148

      .progress-wrapper
        margin-bottom: 30px

</style>

