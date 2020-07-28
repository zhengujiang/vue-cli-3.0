<template>
  <div id="yunyi">
    <div class="zong">
      <img :src="topUrl" alt="" class="banner icon">
      <div class="detail">
        <div class="trans" v-if="!exporting">
          <button class="wz" ref="chinese">{{onoff?'中文':'英文'}}</button>
          <img :src="img" class="t1Image" @click="toggle" @mouseout="changeOut" @mouseover="changeColor">
          <button class="wz" ref="english">{{!onoff?'中文':'英文'}}</button>
        </div>
        <div class="upload-border" v-if="!translated" id="t2" ref="borderChange">
          <!-- 上传布局 -->
          <div class="export-box" v-if="!exporting">
            <div class="upload-progress" ref="uploadpro">
              <div class="el-upload el-upload--text">
                <input class="inputUpload" id="upload" ref="upload" multiple="multiple" name="file" type="file"
                       @change="handleUpload($event)"/>
                <el-button ref="uploadExportBtn" size="medium" class="export-btn upload-export-btn" type="primary">
                  添加文件/拖拽文件
                </el-button>
              </div>
              <div class="el-upload__tip" slot="tip">支持 docx、xlsx、pptx 格式</div>
            </div>
          </div>
          <!--上传中-->
          <div class="progress" v-if="uploading">
            <vxa-progress v-model="uploadPercentage" :animation="false" :height="10"></vxa-progress>
            <div class="upload1">上传中...</div>
          </div>
          <!--翻译中-->
          <div v-if="translateing" class="translating">
            <vxa-progress v-model="translatingUploading" :animation="false" :height="10"></vxa-progress>
            <div class="text">翻译中...</div>
          </div>
        </div>
        <p class="warning one" v-if="!translated">提示：1、为保护公司敏感信息，上传的文件将于翻译完成后24小时自动销毁</p>
        <p class="warning two" v-if="!translated">2、上传的文件最大支持5M</p>
        <div class="translated-border" v-if="translated">
          <!--翻译完成-->
          <div class="translated" v-show="common1">
            <img src="https://oss.in-hope.cn/xiaoan/web_static/icon_ok.png" class="translatedIcon">
            <div class="complete">翻译完成，距离文件被销毁还剩：<a class="keep">{{keepTime}}</a></div>
            <p class="please" v-if="!isCommon">请<span><a class="link" @click="clickCommon">评价</a></span>本次体验，以便给您提供更好的服务！</p>
            <p class="please" v-if="isCommon">评价成功!</p>
          </div>
          <!--翻译体验-->
          <div class="evaluate" v-show="common">
            <div class="inner">
              <div class="block">
                <span class="translate">此次体验：</span>
                <el-radio-group v-model="radio" @change="evaluate">
                  <el-radio :label="1">很赞</el-radio>
                  <el-radio :label="2">一般</el-radio>
                  <el-radio :label="3">不好</el-radio>
                </el-radio-group>
              </div>
              <div class="block">
                <span class="translate">翻译质量：</span>
                <el-rate @change="quality" v-model="value" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
              </div>
              <div class="block">
                <span class="translate">翻译速度：</span>
                <el-rate @change="speed" v-model="value1" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
              </div>
            </div>
            <el-button type="primary" size="mini" @click.native="uploadjudge">提交</el-button>
          </div>
          <div class="transfoot">
            <div class="box">
              <p><i class="el-icon-tickets"></i>文件名称：{{filename}}</p>
            </div>
            <div class="inner">
              <div class="newtrans" @click="centerDialogVisible = true">
                <i class="el-icon-upload2"></i>新建翻译
              </div>
              <div class="downtrans" @click="downloadTranslation">
                <i class="el-icon-download"></i>下载译文
              </div>
            </div>
          </div>
        </div>
        <div class="footer">
          <el-row :gutter="0" class="lay">
            <el-col :span="9">
              <el-card class="box-card" body-style="padding:0;">
                <div class="text item">
                  <div class="lang">如您需要定制化翻译，请联系我们</div>
                  <div class="listInner">
                    <div class="list" v-for="item in collectData" :key="item">{{item}}</div>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="9">
              <el-card class="box-card" body-style="padding:0;">
                <div class="text item">
                  <div class="lang">更多语言支持</div>
                  <div class="listInner">
                    <table class="lang-table" border="0">
                      <tr v-for="index in Math.ceil(languageData.length / 3)">
                        <td v-for="item in languageData.slice((index-1)*3, index*3)">{{item}}</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </el-card>
            </el-col>
            <el-col :span="6">
              <el-card class="box-card" body-style="padding:0;">
                <div class="text item">
                  <div class="lang">更多服务支持</div>
                  <div class="listInner">
                    <div class="list">
                      <p>文档翻译<br/>口译服务<br/>排版录入<br/>认证盖章</p>
                    </div>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    <!--弹出提示-->
    <el-dialog :visible.sync="centerDialogVisible" width="620px" top="35vh" center>
      <div style="border-top: 1px solid #e3e3e3;margin-top:-5px;height:100%">
        <div class="el_dialogtitle">新建翻译</div>
        <span class="dialogtext">新建翻译时，您之前的翻译文件将会被替换</span>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="createNewTrans">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        topUrl: 'https://oss.in-hope.cn/xiaoan/web_static/banner.jpg',
        img: '',
        transiconurl: 'https://oss.in-hope.cn/xiaoan/web_static/icon_trans.png',
        transiconChange: 'https://oss.in-hope.cn/xiaoan/web_static/change.png',
        onoff: true,
        lang: 'zh-cn_en',
        exporting: false,
        uploading: false,
        uploadPercentage: 0,
        translateing: false,
        translated: false,
        common: false,
        common1: true,
        keepTime: "00:00:00",
        centerDialogVisible: false,
        radio: 1,
        value: 5,
        value1: 5,
        filename: "",
        timer: null,
        languageData: ['日语', '韩语', '俄语', '德语', '法语', '西班牙语', '葡萄牙语', '意大利语', '阿拉伯语', '泰语', '拉丁语', '荷兰语', '越南语', '希腊语', '......'],
        collectData: ["电话：021-20740322", "邮箱：xiaoan_help@infaith.com.cn", "微信：infaithjinjin"],
        destorytime: 24 * 60 * 60,
        // status: '',
        fileId: '',
        filextension: ["docx", "xlsx", "pptx"],
        timer1: null,
        translatingUploading: 0, // 翻译中
        failStatus: false,
        fileSize: '',
        newCreate: false,
        isCommon: false
      };
    },
    components: {},
    watch: {

    },
    created() {
      this.img = this.transiconurl;
      let translatingUploading = window.sessionStorage.getItem('percentage');
      if (translatingUploading == null) {
        this.translatingUploading = 0;
      } else {
        this.translatingUploading = parseInt(translatingUploading);
      }
      this.getStatus();
    },
    /* mounted() {
      this.$refs.uploadpro.ondragleave = e => {
        e.preventDefault(); // 阻止离开时的浏览器默认行为
      };
      this.$refs.uploadpro.ondrop = e => {
        e.preventDefault(); // 阻止拖放后的浏览器默认行为
        const data = e.dataTransfer.files; // 获取文件对象
        if (data.length < 1) {
          // alert("無文件被拖拽！");
        } else {
          // alert("當前有文件被拖拽！");
          if (e.dataTransfer.files) {
            this.fileUpload(e.dataTransfer.files);
            console.log(e.dataTransfer.files);
          }
        }
      };
      this.$refs.uploadpro.ondragenter = e => {
        e.preventDefault(); // 阻止拖入时的浏览器默认行为
      };
      this.$refs.uploadpro.ondragover = e => {
        e.preventDefault(); // 阻止拖来拖去的浏览器默认行为
      };
    }, */
    methods: {
      changeColor() {
        this.img = this.transiconChange;
      },
      changeOut() {
        this.img = this.transiconurl;
      },
      toggle() {
        this.img = this.transiconChange;
        this.onoff = !this.onoff;
        if (this.onoff) {
          this.lang = 'zh-cn_en'
        } else {
          this.lang = 'en_zh-cn'
        }
        console.log(this.lang);
      },
      handleUpload(e) {
        if (e.target.files) {
          this.fileUpload(e.target.files);
          this.$refs.upload.value = null;
        }
      },
      fileUpload(file) {
        let name = file[0].name.split('.');
        let fileType = name[name.length - 1];
        let fileSize = file[0].size;
        if (this.filextension.indexOf(fileType) == -1) {
          this.$message({showClose: true, type: 'error', message: '该格式不支持上传，请自行转换成其他格式。'});
        } else if (fileSize > 5 * 1024 * 1024) {
          this.$message({showClose: true, type: 'error', message: '上传文件过大，请不要超过5M,最佳大小在3M以内。'});
        } else {
          this.uploading = true;
          this.exporting = true;
          let form = new FormData();
          form.append('file', file[0]);
          form.append('userId', this.$cookie.get('userId'));
          form.append('lang', this.lang);
          let params = {
            data: form,
            onUploadProgress: progressEvent => {
              this.uploadPercentage = (progressEvent.loaded / progressEvent.total * 100 | 0);
              this.exporting = true;
              this.uploading = true;
              this.translateing = false;
              if (this.uploadPercentage == 100) {
                this.uploading = false;
                this.translateing = true;
              }
            }
          };
          this.$axios.yunyi.translateFile(params).then((res) => {
            this.uploading = false;
            this.uploadPercentage = 0;
            if (res.data.returnCode == 1) {
              console.log('获取成功');
              this.exporting = true;
              this.uploading = false;
              let status = res.data.returnObject.status;
              if (status == 1) { // 翻译中
                this.translateing = true;
                this.getStatus();
              } else if (status == 2) { // 翻译成功;
                this.translateing = false;
                this.translated = true;
                this.countTime(this.destorytime);
              } else if (status == 3) { // 翻译失败
                this.failStatus = true;
                clearInterval(this.timer1);
                this.translateing = false;
                this.exporting = false;
                this.deleteTranslation();
              }
            }
          }).catch((err) => {
            console.log(err.message);
          });
        }
      },
      getStatus() {
        let setTime = 1;
        let index = 1;
        this.timer1 = setInterval(() => {
          index++;
          let params = {
            userId: this.$cookie.get('userId')
          };
          this.$axios.yunyi.getTranslateFileByUser(params).then((res) => {
            if (res.data.returnCode == 1) {
              this.fileId = res.data.returnObject.id;
              this.filename = res.data.returnObject.fileName;
              console.log(res.data.returnObject.status);
              if (res.data.returnObject.status == 1) {
                this.exporting = true;
                this.translateing = true;
                this.fileSize = res.data.returnObject.fileSize;
                window.sessionStorage.setItem('percentage', this.translatingUploading);
                if (this.fileSize.indexOf('MB') != -1) {
                  setTime = Math.ceil(parseFloat(this.fileSize) * 1);
                }
                if ((index % setTime) == 0) {
                  if (this.translatingUploading >= 98) {
                    this.translatingUploading = 98;
                  } else {
                    this.translatingUploading += 1;
                  }
                }
              }
              if (res.data.returnObject.status == 2) {
                clearInterval(this.timer1);
                this.translatingUploading = 100;
                this.translateing = false;
                this.translated = true;
                this.exporting = true;
                this.common1 = true;
                let time = res.data.returnObject.createTime + this.destorytime * 1000 - new Date().getTime();
                let downTime = Math.ceil(time / 1000);
                if (downTime <= 0) {
                  downTime = 0;
                  console.log('downTime', downTime);
                } else {
                  if (window.sessionStorage.getItem('isCommon') == 'true') {
                    this.isCommon = true;
                  } else {
                    this.isCommon = false;
                  }
                }
                this.countTime(downTime);
              } else if (res.data.returnObject.status == 3) {
                this.failStatus = true;
                clearInterval(this.timer1);
                this.translateing = false;
                this.exporting = false;
                this.deleteTranslation();
              }
            } else {
              clearInterval(this.timer1);
              window.sessionStorage.setItem('percentage', 0);
            }
          }).catch(() => {
          });
        }, 1000);
      },
      // 倒计时
      countTime(time) {
        this.timer = setInterval(() => {
          let h = this.checkTime(parseInt(time / 60 / 60 % 24));
          let m = this.checkTime(parseInt(time / 60 % 60));
          let s = this.checkTime(parseInt(time % 60));
          this.keepTime = `${h}:${m}:${s}`;
          if (time <= 0) {
            clearInterval(this.timer);
            this.init();
            this.newCreate = false;
            this.deleteTranslation();
          }
          time--;
        }, 1000);
      },
      checkTime(num) {
        if (num < 10) {
          num = '0' + num;
        }
        return num;
      },
      // 删除译文
      deleteTranslation() {
        let params = {
          cloudId: this.fileId
        };
        this.$axios.yunyi.deleteTranslateFile(params).then((res) => {
          if (res.data.returnCode == 1) {
            if (this.failStatus) {
              this.$message({showClose: true, type: 'success', message: '翻译失败，请重新上传!'});
            } else if (this.newCreate) {

            } else {
              this.$message({showClose: true, type: 'success', message: '删除成功!'});
            }
          }
          console.log(res.data);
        }).catch((err) => {

        });
      },
      // 下载译文
      downloadTranslation() {
        let params = {
          userId: this.$cookie.get('userId')
        };
        this.$axios.yunyi.getTranslateFileByUser(params).then((res) => {
          if (res.data.returnCode == 1) {
            let downloadFile = res.data.returnObject.tdocOssUrl;
            var linkA = document.createElement('a');
            linkA.setAttribute('target', '_blank');
            linkA.setAttribute('download', 'download');
            linkA.setAttribute('href', downloadFile);
            linkA.setAttribute('id', downloadFile);
            if (!document.getElementById(downloadFile)) {
              document.body.appendChild(linkA)
            }
            linkA.click();
          }
        }).catch(() => {

        });
      },
      // 评论
      evaluate(value) {
        this.radio = value;
      },
      quality(value) {
        this.value = value;
      },
      speed(value) {
        this.value1 = value;
      },
      comment() {
        let params = {
          userId: this.$cookie.get('userId'),
          evaluate: this.radio,
          quality: this.value,
          speed: this.value1
        };
        this.$axios.yunyi.addEvaluate(params).then((res) => {
          if (res.data.returnCode == 1) {
            console.log(res.data);
          }

        }).catch((err) => {
          console.log(err);
        })
      },
      // 新建翻译页面
      createNewTrans() {
        this.centerDialogVisible = false;
        clearInterval(this.timer);
        this.newCreate = true;
        this.deleteTranslation();
        this.init();
      },
      // 初始化
      init() {
        this.exporting = false;
        this.translated = false;
        this.common = false;
        this.common1 = true;
        this.translateing = false;
        this.failStatus = false;
        this.uploading = false;
        this.keepTime = '00:00:00';
        this.translatingUploading = 0;
        this.radio = 1;
        this.value = 5;
        this.value1 = 5;
        this.isCommon = false;
        window.sessionStorage.setItem('isCommon', false);
        window.sessionStorage.setItem('percentage', 0);
      },
      // 评论点击提交
      uploadjudge() {
        this.common1 = true;
        this.common = false;
        this.comment();
        this.isCommon = true;
        window.sessionStorage.setItem('isCommon', true);
      },
      clickCommon() {
        this.common = true;
        this.common1 = false;
      }
    }
  };
</script>

<style lang="scss">
  #yunyi {
    background:rgba(246,246,246,1);
    min-height: 780px;
    padding-bottom: 50px;
    * {
      transition: .3s all;
    }
    .el-dialog {
      .dialogtext {
        float: left;
        width: 100%;
        height: 50px;
        text-align: center;
        margin-top: 25px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(50, 50, 50, 1);
        font-size: 16px;
        line-height: 22px;
      }
      .el_dialogtitle {
        margin-top: -33px;
        height: 22px;
        text-align: center;
        font-size: 16px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(255, 177, 72, 1);
        line-height: 22px;
      }
    }
    .zong {
      width: 1200px;
      margin: 0 auto;
      background: white;
      .banner {
        width: 1200px;
        height: 240px;
        display: block;
        margin: 0 auto 23px;
      }
      .detail {
        width: 1200px;
        border-radius: 2px;
        padding-bottom: 35px;
        .trans {
          display: block;
          margin: 0 180px 0 180px;
          .wz {
            border: 1px solid #e3e3e3;
            height: 24px;
            width: 60px;
            padding-top: 2px;
            text-align: center;
            font-size: 12px;
            color: #aeaeae;
            border-radius: 2px;
            cursor: text;
            background: white;
          }
          .t1Image {
            height: 14px;
            padding: 0 4px;
            vertical-align: middle;
            cursor: pointer;
          }
        }
        .upload-border {
          width: 840px;
          height: 203px;
          border:4px solid rgba(255,224,182,1);
          border-radius: 4px;
          margin: 6px auto;
          display: flex;
          align-items: center;
          justify-content: center;
          .export-box {
            height: 148px;
            width: 790px;
            border-radius: 6px;
            border: 2px dashed #fcd29d;
            .upload-progress {
              position: relative;
              width: 100%;
              height: 148px;
              .el-upload--text {
                text-align: center;
                display: flex;
                justify-content: center;
                input {
                  position: absolute;
                  bottom: 0;
                  opacity: 0;
                  -ms-filter: "alpha(opacity=0)";
                  width: 100%;
                  height: 100%;
                  cursor: pointer;
                }
                .export-btn {
                  width: 200px;
                  height: 35px;
                  color: white;
                  text-align: center;
                  border-radius: 4px;
                  font-size: 16px;
                  font-weight: 600;
                  margin-top: 45px;
                  padding: 0;
                }
              }
              .el-upload__tip {
                font-size: 14px;
                color: #aeaeae;
                width: 273px;
                text-align: center;
                margin-left: 259px;
              }
            }
          }
          .progress {
            width: 437px;
            height: 100px;
            .upload1 {
              margin-top: 8px;
              margin-left: 200px;
              color: #323232;
              font-size: 16px;
            }
          }
          .translating {
            .el-progress {
              width: 437px;
              .el-progress-bar__innerText {
                height: 100%;
                font-size: 10px;
                margin-top: -6px;
              }
            }
            .translatingicon {
              width: 60px;
              height: 60px;
            }
            .text {
              color: #323232;
              font-size: 16px;
              text-align: center;
            }
            .waiting {
              color: #323232;
              font-size: 16px;
              a {
                color: #ffb148;
              }
            }
          }
        }
        .warning {
          font-size: 14px;
          color: #8d8d8d;
          margin-left: 180px;
          margin-top: 5px;
          &.two {
            text-indent: 3em;
          }
        }

        .translated-border {
          width: 840px;
          height: 294px;
          border: 2px solid #ececec;
          border-radius: 2px;
          margin: 6px auto;
          .translated {
            height: 233px;
            width: 100%;
            border-bottom: 1px solid #ececec;
            border-radius: 2px;
            .translatedIcon {
              width: 50px;
              height: 37px;
              margin-top: 45px;
              margin-left: 394px;
            }
            .complete {
              margin-top: 15px;
              margin-left: 249px;
              color: #323232;
              font-size: 16px;
              .keep {
                color: #ffb148;
                font-family: "PingFangSC-Semibold";
                font-size: 24px;
              }
            }
            .please {
              color: #aeaeae;
              font-size: 14px;
              text-align: center;
              span {
                cursor: pointer;
                text-decoration: underline;
                .link {
                  color: #ffb148;
                  font-weight: 600;
                  font-size: 16px;
                  &.link {
                    cursor: pointer;
                    &:hover {
                      text-decoration: underline;
                    }
                  }
                }
              }
            }
          }
          .evaluate {
            height: 233px;
            width: 100%;
            border-bottom: 1px solid #ececec;
            border-radius: 2px;
            margin: 0 auto;
            text-align: center;
            .inner {
              padding: 55px 0 0 268px;
              .block {
                clear: both;
                height: 30px;
                .translate {
                  float: left;
                  font-size: 16px;
                  font-family: PingFangSC-Regular;
                  font-weight: 400;
                  color: rgba(50, 50, 50, 1);
                  margin-top: -5px;
                }
                .el-rate {
                  float: left;
                }
                .el-radio-group {
                  float: left;
                }
              }
            }
            .el-button {
              margin-top: 10px;
            }
          }
          .transfoot {
            display: inline-block;
            width: 100%;
            .box {
              float: left;
              color: #8d8d8d;
              font-size: 12px;
              margin-left: 5px;
              width: 500px;
              height: 60px;
              display: flex;
              align-items: center;
            }
            .inner {
              float: right;
              width: 260px;
              height: 59px;
              .newtrans {
                float: left;
                background: #ffb148;
                width: 130px;
                cursor: pointer;
                height: 59px;
                right: 0;
                font-size: 14px;
                font-family: "PingFangSC-Semibold";
                font-weight: 600;
                color: rgba(255, 255, 255, 1);
                line-height: 20px;
                border-top-left-radius: 4px;
                border-bottom-left-radius: 4px;
                .el-icon-upload2 {
                  margin-top: 23px;
                  margin-left: 27px;
                }
              }
              .downtrans {
                float: right;
                background: #d96d24;
                width: 130px;
                height: 59px;
                cursor: pointer;
                right: 0;
                font-size: 14px;
                font-family: "PingFangSC-Semibold";
                font-weight: 600;
                color: rgba(255, 255, 255, 1);
                line-height: 20px;
                border-top-right-radius: 4px;
                border-bottom-right-radius: 4px;
                .el-icon-download {
                  margin-top: 23px;
                  margin-left: 27px;
                }
              }
            }
          }
        }
        .footer {
          width: 840px;
          margin-left: 180px;
          margin-top: 30px;
          .lay {
            .box-card {
              border: 0;
              box-shadow: none;
              .text {
                font-size: 14px;
                color: #8d8d8d;
              }
              .item {

              }
            }
            .lang {
              font-size:14px;
              font-family:PingFangSC-Semibold;
              font-weight:600;
              color:rgba(50,50,50,1);
              padding-left: 5px;
              border-left: 2px solid rgba(255,177,72,1);
            }
            .lang-table {
              width: 230px;
              table-layout: fixed;
              td {
                margin: 10px;
                padding: 2px;
              }
            }
            .lay1Image {
              width: 420px;
              height: 220px;
              display: block;
              background-size: 100% 100%;
            }
            .layInner {
              line-height: 24px;
            }
            .listInner {
              padding-left: 5px;
              padding-top: 12px;
              height:133px;
              border-left: 1px solid rgba(241,240,245,1);
            }
            .list {
              line-height: 24px;
            }
          }
        }
      }
    }
  }
</style>
