<template>
  <div id="comp-upload">
    <div class="one"></div>
    <div class="two">
      <button class="back-img-box" v-if="base64Info" @click="uploadFile">
        <img class="back-img" :src="base64Info"/>
      </button>
      <button class="back" @click="uploadFile" v-show="!base64Info">
        <span>拍摄/上传个人名片</span>
        <input type="file" ref="payfile" id="pay-file" accept="image/*" style="display: none" @change="selectFile">
      </button>
      <h3 class="question">为什么要上传个人名片？</h3>
      <p class="answer">上传名片能帮助我们准确地将奖品发放给您！</p>
    </div>
    <div class="three position" v-transfer-dom>
      <button class="btn" :class="{not_btn: isClick}" @click="uploadCheck"></button>
    </div>
    <!---->
    <!--<img class="previewer-demo-img" v-for="(item, index) in list" :src="item.src" width="100" @click="show(index)">-->
    <div v-transfer-dom class="comp_popup_upload">
      <popup v-model="isLoading" position="bottom" height="100%">
        <div class="box">
          <!---->
          <div class="prompt">
            <div class="back"></div>
          </div>
          <!---->
          <div class="upload-text"><span>{{num}}</span>秒后自动跳转到活动首页。</div>
          <button class="foot-btn" @click="link"></button>
        </div>
      </popup>
    </div>
    <div v-transfer-dom>
      <previewer :list="list" ref="previewer" :options="options" @on-index-change="logIndexChange"></previewer>
    </div>
  </div>
</template>

<script>
  import {TransferDom, Popup, Previewer} from 'vux'

  export default {
    name: "comp-upload",
    directives: {
      TransferDom
    },
    components: {
      Popup, Previewer
    },
    data() {
      return {
        num: 10,
        base64Info: '',
        isClick: false,
        userInfo: {},
        competitionUser: {
          type: 0,
          id: '',
          isJoin: true
        },
        type: {
          "0": "COMMON",
          "1": "COMMONINVITE",
          "2": "SECRETARY"
        },
        list: [
          {
            msrc: 'http://ww1.sinaimg.cn/thumbnail/663d3650gy1fplwu9ze86j20m80b40t2.jpg',
            src: 'http://ww1.sinaimg.cn/large/663d3650gy1fplwu9ze86j20m80b40t2.jpg',
            w: 800,
            h: 400
          },
        ],
        options: {
          getThumbBoundsFn(index) {
            // find thumbnail element
            let thumbnail = document.querySelectorAll('.previewer-demo-img')[index]
            // get window scroll Y
            let pageYScroll = window.pageYOffset || document.documentElement.scrollTop
            // optionally get horizontal scroll
            // get position of element relative to viewport
            let rect = thumbnail.getBoundingClientRect()
            // w = width
            return {x: rect.left, y: rect.top + pageYScroll, w: rect.width}
            // Good guide on how to get element coordinates:
            // http://javascript.info/tutorial/coordinates
          }
        }
      }
    },
    computed: {
      isLoading() {
        let set = false;
        if (this.$route.query.loading == 1) {
          set = true
          return set
        }
        return set
      }
    },
    watch: {
      isLoading: function (val) {
        if (val) {
        }
      }
    },
    created() {
      if (this.$cookie.isLogin()) {
        this.userInfo = this.$cookie.getUserInfo();
        if (window.sessionStorage.getItem('competition_user')) {
          let com = window.JSON.parse(window.sessionStorage.getItem('competition_user'))
          if (this.userInfo.id == com.id) {
            window.sessionStorage.removeItem('competition_user');
          } else {
            if (!!!com.id) {
              com.id = '';
            }
            if (!!!com.type) {
              com.type = '0';
            }
            this.competitionUser = {
              id: com.id,
              type: com.type,
              isJoin: com.isJoin
            }
          }
        }
        if (!!!this.$route.query.loading) {
          this.$router.replace({query: Object.assign({}, {loading: 0})})
        }
      }
    },
    mounted() {
      this.$nextTick(_ => {
        this.$weixin.wxshare('信公小安-董秘智能移动工具', '', this.$api.CURRENTIP.IP, this.$api.share.defaultImg, true);
      });
    },
    destroyed() {
      clearInterval(this.numSetInt)
    },
    methods: {

      uploadFile() {
        this.$refs.payfile.click();
        // document.querySelector('#upfile').click()
      },
      //
      uploadCasecard() {
        if (!this.base64Info) {
          this.$vux.toast.show({text: '请先上传名片！', position: 'middle', type: 'text', width: 'auto', time: 2500});
          return false
        }
        this.$vux.loading.show({text: '正在上传名片'});
        let form = new FormData();
        form.append('inviteId', this.competitionUser.id);
        form.append('inviteTypeEnum', this.type[this.competitionUser.type]);
        form.append('isJoin', this.competitionUser.isJoin);
        form.append('fileBase64', this.base64Info);
        //
        let params = {
          data: form,
          onUploadProgress: progressEvent => {
            // this.uploadPercentage = (progressEvent.loaded / progressEvent.total * 100 | 0);
            var complete = (progressEvent.loaded / progressEvent.total * 100 | 0) + '%';
            console.log(progressEvent);
            console.log(complete);
            this.$vux.loading.show({text: complete});
          }
        };
        this.$axios.competition.uploadCasecard(params).then(res => {
          this.$vux.loading.hide();
          if (res.data.returnCode == 200) {
            this.$vux.toast.show({text: '上传成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$router.replace({query: Object.assign({}, {loading: 1})});
            this.$nextTick(_ => {
              this.num = 3;
              this.numSetInt = setInterval(() => {
                this.num--
                console.log(this.num);
                if (this.num < 1) {
                  this.num = 0
                  console.log(this.num);
                  clearInterval(this.numSetInt);
                  this.link()
                }
              }, 1000)
            })
          } else {
            // 模拟
            this.$router.replace({query: Object.assign({}, {loading: 1})});
            this.$nextTick(_ => {
              this.num = 3;
              this.numSetInt = setInterval(() => {
                this.num--
                console.log(this.num);
                if (this.num < 1) {
                  this.num = 0
                  console.log(this.num);
                  clearInterval(this.numSetInt);
                  this.link()
                }
              }, 1000)
            })
            //
          }
        }).catch(err => {
          this.$vux.loading.hide();
        })
      },
      //
      selectFile(val) {
        console.log(this.$refs.payfile.files);
        var file = this.$refs.payfile.files[0];
        var reader = new FileReader();
        if (file && file.type.match('image.*')) {
          reader.readAsDataURL(file);
        }
        reader.onloadend = () => {
          this.base64Info = reader.result
          // let base64head = reader.result
          // console.log(base64head)
        }
      },
      uploadCheck() {
        this.uploadCasecard();
      },
      link() {
        if (this.competitionUser.type == 0) {
          this.$router.replace({path: '/competition/home'});
        } else if (this.competitionUser.type == 1) {
          this.$router.replace({path: '/competition/home'});
        } else {
          this.$router.replace({
            path: '/competition/call',
            query: {id: this.competitionUser.id, type: this.competitionUser.type, call: 1}
          });
          setTimeout(_ => {
            this.$vux.toast.show({text: '打Call成功！', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }, 300)
        }
        //
        window.sessionStorage.removeItem('competition_user');
      },
      show(index) {
        this.$refs.previewer.show(index)
      },
      logIndexChange(arg) {
        console.log(arg)
      },
    }
  }
</script>

<style lang="scss">
  .comp_popup_upload {
    position: relative;
    .box {
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/competition-back.png) no-repeat;
      width: 100%;
      height: 100%;
      background-size: 100% 100%;
      /*position: absolute;*/
      filter: progid:DXImageTransform.Microsoft.AlphaImageLoader(src="https://oss.in-hope.cn/xiaoan/h5_static/competition/competition-back.png", sizingMethod="scale");
      .prompt {
        padding: 63.5px 28px 18px 28px;
        .back {
          width: 315px;
          height: 129px;
          background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/upload_upload.png) no-repeat;
          background-size: contain;
          background-origin: padding-box;
        }
      }
      .upload-text {
        width: 100%;
        text-align: center;
        color: white;
        font-size: 12px;
        span {
          color: #ffb148;margin-right: 0.5em;
        }
      }
      .foot-btn {
        position: absolute;
        position: fixed;
        bottom: 72px;
        left: 50%;
        transform: translateX(-50%);
        border: 0;
        width: 231px;
        height: 66px;
        background-color: transparent;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/upload_Button_1.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
    }
  }
  #comp-upload {
    width: 100%;
    .two {
      width: 100%;
      padding: 30px 36px 0 36px;
      height: auto;
      margin-bottom: 145px;
      .back-img {
        top: 0;
        left: 0;
        width: 303px;
        height: auto;
        display: inherit;
      }
      .back-img-box {
        font-size: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 175px;
        border: 1px dashed #FFFFFF;
        background-color: transparent;
      }
      .back {
        border: 0;
        background: transparent;
        height: 175px;
        width: 100%;
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/upload_border.png) no-repeat;
        background-size: contain;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          font-size: 15px;
          color: white;
        }
      }
      .question {
        font-size: 15px;
        font-weight: 600;
        color: rgba(255, 255, 255, 1);
        line-height: 36px;
      }
      .answer {
        font-size: 12px;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        line-height: 18px;
      }
    }

  }
  .position.three {
    width: 100%;
    position: absolute;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/competition-back.png) no-repeat;
    background-size: cover;
    background-position: bottom left;
    background-color: rgba(0, 0, 0, 0);
  }
  .three {
    width: 100%;
    text-align: center;
    font-size: 0;
    // box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    .btn {
      margin: 20px 0 30px 0;
      border: 0;
      width: 231px;
      height: 66px;
      background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/upload_btn.png) no-repeat;
      background-size: contain;
      background-origin: padding-box;
      transition: all .3s;
      &.not_btn {
        background: url(https://oss.in-hope.cn/xiaoan/h5_static/competition/upload_not_btn.png) no-repeat;
        background-size: contain;
        background-origin: padding-box;
      }
    }
  }
</style>
