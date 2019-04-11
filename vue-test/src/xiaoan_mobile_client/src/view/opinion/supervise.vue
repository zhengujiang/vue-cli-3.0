<template>
  <div id="supervise" class="xiaoan-box supervise">
    <div class="supervise-scroll">
      <header>
        <div class="head">
          <div class="allName">
            <label for="tox">项目名称</label>
            <input id="tox" type="text" v-model.trim="textName" @blur="inputBlur(0)" @input="inputInput(0)"
                   :placeholder="globalText[0]"/>
            <i class="icon iconfont icon-X" v-show="textName.length != 0"
               @click="()=>{this.textName = ''}"></i>
          </div>
          <div class="allDoc">
            <label>监控关键词</label>
            <p class="allBox addBox">
              <label>{{prompt[1]}}</label>
              <input ref="inputDom0" type="text" v-model.trim="defaultInputBox"
                     @input="inputChange(0)" :placeholder="allBoxPlaceholder[0]" @blur="defaultCodeBlur"/>
              <button type="button" @click="closeBtn(0)"><i class="icon iconfont icon-i"></i>
              </button>
            </p>
            <p class="allBox addBox" v-show="minInputList >= 1">
              <label>{{prompt[2]}}</label>
              <input ref="inputDom1" type="text" v-model.trim="inputBox[1]"
                     @input="inputChange(1)" :placeholder="allBoxPlaceholder[1]">
              <button type="button" @click="closeBtn(1)"><i class="icon iconfont icon-shanchu"></i>
              </button>
            </p>
            <p class="allBox addBox" v-show="minInputList >= 2">
              <label>{{prompt[3]}}</label>
              <input ref="inputDom2" type="text" v-model.trim="inputBox[2]"
                     @input="inputChange(2)" :placeholder="allBoxPlaceholder[1]">
              <button type="button" @click="closeBtn(2)"><i class="icon iconfont icon-shanchu"></i>
              </button>
            </p>
            <p class="allBox addBox" v-show="minInputList >= 3">
              <label>{{prompt[4]}}</label>
              <input ref="inputDom3" type="text" v-model.trim="inputBox[3]"
                     @input="inputChange(3)" :placeholder="allBoxPlaceholder[1]">
              <button type="button" @click="closeBtn(3)"><i class="icon iconfont icon-shanchu"></i>
              </button>
            </p>
            <p class="allBox addBox" v-show="minInputList >= 4">
              <label>{{prompt[5]}}</label>
              <input ref="inputDom4" type="text" v-model.trim="inputBox[4]"
                     @input="inputChange(4)" :placeholder="allBoxPlaceholder[1]">
              <button type="button" @click="closeBtn(4)"><i class="icon iconfont icon-shanchu"></i>
              </button>
            </p>
            <p class="addInput" v-show="addIcon">
              <strong @click="addInput()">
                <i class="icon iconfont icon-jia2"></i><span>{{prompt[0]}}</span>
              </strong>
            </p>
          </div>
        </div>
      </header>
      <div class="container">
        <div class="allbtn">
          <p><span>微信提醒</span><span><mt-switch v-model="switchWx"></mt-switch></span></p>
        </div>
        <!--evans for 2017-12-15 hide-->
        <div class="alltext allauto">
          <label for=""><i></i></label>
          <p v-html="globalText[1]"></p>
        </div>
      </div>
    </div>
    <footer>
      <button v-for="(list, index) in btn" @click="btnClick(index)">{{list}}</button>
    </footer>
    <mt-popup v-model="popupTop" position="top" class="mint-popup-top" :modal="false">
      <p @click="()=>{this.popupTop = false}">
        <span>{{listPopup[0]}}</span>
        <i class=""></i>
      </p>
    </mt-popup>
    <xa-loading v-show="loading" bgColor="rgba(255,255,255,1)"></xa-loading>
  </div>
</template>

<script>
  // 合test
  import loading from '@/components/warning/loading'

  export default {
    name: "supervise",
    data() {
      return {
        listPopup: ['项目首个关键词为上市公司简称时，在项目详情页中会自动关联该公司公告与研报'],
        myUser: {}, // myuserhome de shujv
        textName: '',
        prompt: ['关键词', '关键词1', '关键词2', '关键词3', '关键词4', '关键词5'], // 提示
        switchBl: true, // 是否监控
        switchWx: false, // 微信监控
        addIcon: true, // 添加的小图标
        minInputList: 1, // 默认最小输入框的个数
        maxInputList: 4, // 默认最大输入框的个数
        defaultInputBox: '', // 默认显示的输入
        inputBox: ['', '', '', '', ''], // 增加显示的输入
        allBoxPlaceholder: ['监控关键词设置最好是精准词语', '监控关键词设置最好是精准词语'],
        btn: ['取消', '确定'],
        globalText: [
          '给项目取个名字，最多14个字符',
          '<span>如需开启舆情最新动态微信消息提醒功能，请提前关注“</span>' + '<span style="color: #ffb148">信公小安</span><span>”公众号，未关注开启功能无效。</span>'
        ],
        blurNum: 14,
        popupTop: false,
        loading: true,
        container: []

      }
    },
    watch: {
      'defaultInputBox': function () {
        this.inputBox[0] = this.defaultInputBox;
        console.log('123', this.inputBox);
      },
      'minInputList': function () {
        if (this.minInputList === this.maxInputList) {
          this.addIcon = false
        } else {
          this.addIcon = true
        }
      },
      'inputBox': function () {
        // let string = [];
        // for (let i in this.inputBox) {
        //     string.push(this.filterString(this.inputBox[i]));
        // }
        // this.inputBox = string;
        console.log('this.inputBox', this.inputBox);
      },
      'textName': function () {
        let str = this.$const.chkstrlen(this.textName), sen = "";
        if (str > this.blurNum) {
          this.textName = this.textName.substring(0, this.blurNum);
        }
        console.log(str, sen);
      }
    },
    components: {
      'xa-loading': loading
    },
    created() {
      this.user_id = this.$cookie.getCookie("userId");
      if (!this.$cookie.isLogin()) {
        //this.loadingDis = true;
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      this.loading = true;
      // 如果需要增加区分外部和内部用户 打开下行注释
      this.userHome();
      //
      if (this.$route.query.add == '1') {
        window.document.title = '添加舆情项目';
        this.apiUserHome();
      } else {
        window.document.title = '编辑舆情项目';
        // 获取舆情
        this.apiGetAllProject();
      }
    },
    mounted() {
      //
      if (this.minInputList === this.maxInputList) {
        this.addIcon = false
      } else {
        this.addIcon = true
      }
      setTimeout(() => {
        this.loading = false;
      }, 1000);
      //
      let adverttitle = "";
      let sharelink2 = this.$api.CURRENTIP.IP + '#/rule';// 分享链接
      let shareDesc = ""; // 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
      // console.log('2qweqwewqewqeq', this.filterString('./,dsfsfderw..09()*&'));
    },
    methods: {
      userHome() {
        this.$axios.userHome.userhome().then((res) => {
          console.log('', res, '123');
          if (res.data.returnCode == 1) {
            if (res.data.returnObject !== null) {
              let level = res.data.returnObject.level;
              if (level == 0) {
                // 外部用户
                this.maxInputList = 2;
                console.log('this.maxInputList', this.maxInputList);
              }
            }
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({text: '请重新登录', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      //
      inputChange(index) {
        this.inputBox[index] = this.filterString(this.inputBox[index]);
        this.defaultInputBox = this.filterString(this.defaultInputBox);
      },
      // 过滤特殊字符
      filterString(STRING) {
        // let pattern = new RegExp("[`~!@#$%^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
        // let pattern = new RegExp("[`~!@#$%^&*()=|{}\"':;',\\[\\].<>/?~！@#￥……&*（）+_——|｛｝·【】·＋－×÷±‘；：”“'。，、？]");
        let pattern = new RegExp(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g);
        let replaceString = "";
        for (let i = 0; i < STRING.length; i++) {
          replaceString = replaceString + STRING.substr(i, 1).replace(pattern, '');
        }
        console.log(replaceString);
        return replaceString;
      },
      // 第一个关键词 失去焦点
      defaultCodeBlur() {
        console.log(2313);
        this.apiGetCompanyInfoByName(this.defaultInputBox);
      },
      // 初始执行方法
      apiGetCompanyInfoByName(string) {
        let params = {
          name: string
        }
       this.$axios.common.getCompanyInfoByName(params).then(res => {
          if (res.data.returnCode == 1) {
            if (res.data.returnObject == null || res.data.returnObject == '') {
              this.prompt[1] = '关键词1';
            } else {
              this.prompt[1] = '公司简称';
            }
          }
        }).catch((err) => {
        })
      },
      //
      apiAutoComplete(code) {
        let params ={
            key: code,
          }
          this.$axios.common.autoComplete(params).then(res => {
          if (res.data.returnCode === 1) {
            this.defaultInputBox = res.data.returnObject[0].name;
            this.prompt[1] = '公司简称';
            this.inputBox[1] = res.data.returnObject[0].code;
            console.log(this.defaultInputBox, this.$refs);
          }
          console.log(res);
        }).catch((err) => {
          console.error(err);
        })
      },
      //
      apiUserHome() {
        // 如果有股票代码 默认帮用户 填写第一个关键词 为股票简称
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          if (res.data.returnCode === 1) {
            this.myUser = res.data.returnObject;
            if (this.myUser.companyCode) {
              this.apiAutoComplete(this.myUser.companyCode);
            }
          }
          console.log(res);
        }).catch((err) => {
          console.error(err);
        })
      },
      //
      removeArr(array, index) {
        // 第一变量 填处理的数组  第二变量 填处理数组 要处理的下标
        if (isNaN(index) || index >= array.length) {
          return false;
        }
        for (let i = 0, n = 0; i < array.length; i++) {
          if (array[i] != array[index]) {
            array[n++] = array[i]; //
          }
        }
        array.length -= 1;
        return array
      },
      //
      closeBtn(index) {
        if (index === 0) {
          this.popupTop = true;
          setTimeout(() => {
            this.popupTop = false
          }, 3200);
          console.log('123', 1221312);
        } else {
          if (this.minInputList > 0) {
            this.minInputList--
          }
          let add = this.removeArr(this.inputBox, index);
          console.log('32213', add, this.minInputList);
        }
      },
      //
      addInput() {
        if (this.minInputList < this.maxInputList) {
          this.minInputList++
        }
        console.log('123', this.minInputList);
      },
      //
      inputBlur(index) {
        if (index == 0) {
          let str = this.$const.chkstrlen(this.textName), sen = "";
          if (str > this.blurNum) {
            this.textName = this.textName.substring(0, this.blurNum);
          }
          console.log(str, this.textName);
        }
      },
      //
      inputInput(index) {
        if (index == 0) {
          this.textName = this.filterString(this.textName);
          let str = this.$const.chkstrlen(this.textName);
          if (str > 20) {
            this.textName = this.textName.substring(0, 20);
          }
        }
      },
      //
      keyword(array) {
        let arr = [];
        for (let i in array) {
          arr.push(array[i].keywordName);
        }
        return (arr.join(" "))
      },
      //
      apiGetAllProject() {
        let params = {}
        this.$axios.opinion.getAllProject(params).then(res => {
          if (res.data.returnCode == 1) {
            this.container = res.data.returnObject;
            let setDef = {};
            for (let i in this.container) {
              if (this.$route.query.id == this.container[i].id) {
                setDef = this.container[i];
              }
            }
            this.textName = setDef.projectName;  // 项目名
            let arr = [];
            for (let i in setDef.keywordList) {
              arr.push(setDef.keywordList[i].keywordName);
            }
            this.inputBox = [];
            this.defaultInputBox = arr[0];
            this.inputBox = arr;
            this.minInputList = this.inputBox.length - 1;
            // this.textDoc = this.keyword(setDef.keywordList);
            this.switchBl = setDef.monitor;
            this.switchWx = setDef.notice;
            console.log('23213', setDef);
          } else {
            this.$vux.toast.show({text: '出现未知错误，请联系管理员', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.$router.replace({path: '/superviseList'});
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      //
      btnClick(index) {
        if (index == 0) {
          // 取消
          this.$router.go(-1);
        } else {
          // 确认
          if (this.$route.query.add == 0) {
            // 编辑
            this.apiUpdateProject();
          } else {
            // 增加
            this.apiAddProject();
          }
        }
        console.log('index', index);
      },
      // 添加舆情
      apiAddProject() {
        this.loading = true;
        let textDoc = this.$array.ImpArr(this.inputBox).join(","); // 去空处理
        console.log('3432', this.inputBox);
        let params = {
          projectName: this.textName,
          keyword: textDoc,
          isMonitor: this.switchBl,
          isNotice: this.switchWx
        }
        this.$axios.opinion.addProject(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            setTimeout(() => {
              this.$nextTick(() => {
                this.loading = false;
              })
            }, 300)
            this.$router.replace({path: '/superviseList'});
          } else {
            this.loading = false;
            this.$vux.toast.show({text: '项目名和关键词都不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      //
      apiUpdateProject() {
        this.loading = true;
        let textDoc = this.$array.ImpArr(this.inputBox).join(","); // 去空处理
        let params = {
            projectId: this.$route.query.id,
            projectName: this.textName,
            keyword: textDoc,
            isMonitor: this.switchBl,
            isNotice: this.switchWx
        }
        this.$axios.opinion.updateProject(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            setTimeout(() => {
              this.$nextTick(() => {
                this.loading = false;
              })
            }, 300)
            this.$router.back(-1);
          } else {
            this.loading = false;
            this.$vux.toast.show({text: '项目名和关键词都不能为空', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          console.error(err);
        })
      },
    }
  }
</script>

<style lang="scss">
  .supervise {
    height: 100%;
    width: 100%;
    padding: 0 0 50px 0;
    position: relative;
    .supervise-scroll {
      height: 100%;
      width: 100%;
      background-color: #FFFFFF;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      header {
        padding: 15px 12px 0 12px;
        .head {
          .allName {
            position: relative;
            label {
              display: block;
              width: 100%;
              font-size: 15px;
              color: #323232;
              margin-bottom: 10px;
            }
            input {
              width: 100%;
              height: 40px;
              border: 1px solid #e3e3e3;
              font-size: 15px;
              color: #323232;
              padding: 0 27px 0 10px;
              outline: none;
              border-radius: 2px;
              box-sizing: border-box;
            }
            input::placeholder {
              color: #aeaeae;
            }
            input:focus {
              border-color: rgba(255, 177, 72, 0.5);
            }
            i {
              position: absolute;
              right: 3%;
              bottom: 22.5%;
              transform: translateY(22.5%);
              color: #aeaeae;
              background-color: white;
            }
          }
          .allDoc {
            .allBox {
              width: 100%;
              height: 40px;
              margin-bottom: 15px;
              font-size: 0;
              display: flex;
              position: relative;
              label {
                // border: 0.5px solid #e3e3e3;
                position: absolute;
                top: 50%;
                left: 1.5px;
                transform: translateY(-50%) translateX(-0.5px);
                border-top-left-radius: 2px;
                border-bottom-left-radius: 2px;
                box-sizing: border-box;
                background-color: rgba(240, 241, 245, 1);
                text-align: center;
                height: 38px;
                line-height: 38px;
                font-size: 14px;
                color: #8d8d8d;
                width: 80px;
                vertical-align: middle;
              }
              input {
                display: table-cell;
                width: 100%;
                height: 100%;
                border: 1px solid #e3e3e3;
                font-size: 14px;
                color: #323232;
                padding: 0 34px 0 90px;
                outline: none;
                border-top-right-radius: 2px;
                border-bottom-right-radius: 2px;
                box-sizing: border-box;
              }
              input::placeholder {
                color: #aeaeae;
              }
              input:focus {
                border-color: rgba(255, 177, 72, 0.5);
              }

            }
            .addBox {
              background-color: rgba(240, 241, 245, 1);
              position: relative;
              // -webkit-transition: display 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              // transition: display 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
              input {
              }
              button {
                height: 38px;
                border: none;
                border: 0;
                position: absolute;
                right: 1.5px;
                top: 50%;
                transform: translateY(-50%);
                padding: 0 8px;
                background-color: white;
                z-index: 100;
                i {
                  font-weight: 500;
                }
              }
            }
            .addInput {
              text-align: center;
              font-size: 0;
              line-height: 1;
              padding: 10px 0;
              strong {
                display: inline-block;
                padding: 5px;
                border: 1px solid #ffb148;
                border-radius: 2px;
                font-style: normal;
                font-weight: normal;
                i {
                  font-size: 20px;
                  vertical-align: middle;
                  color: #ffb148;
                  font-weight: 700;
                }
                span {
                  vertical-align: middle;
                  font-size: 15px;
                  color: #ffb148;
                  padding-left: 8px;
                  /*text-decoration: underline;*/
                  /*text-decoration-color: #ffb148;*/
                }
              }
            }
            > label {
              display: block;
              width: 100%;
              font-size: 15px;
              color: #323232;
              margin-bottom: 10px;
              margin-top: 15px;
            }
          }
        }
      }
      .container {
        padding: 0 12px;
        font-size: 0;
        height: auto;
        .alltext {
          display: table;
          width: 100%;
          margin-top: 10px;
          label {
            display: table-cell;
            width: 10px;
            font-size: 13px;
            line-height: 15px;
            i {
              height: 3px;
              width: 3px;
              display: inline-block;
              border-radius: 50%;
              background: #ffb148;
              vertical-align: middle;
            }
          }
          p {
            font-size: 12px;
            display: table-cell;
            color: #8d8d8d;
            text-align: justify;
            vertical-align: middle;
            .liStyle {
              display: inline-block;
              height: 16px;
              width: 16px;
              font-size: 8px;
              border-radius: 50%;
              background: #ffb148;
              color: white;
              line-height: 16px;
              text-align: center;
              margin-right: 2px;
            }
          }
        }
        .allauto {
          margin: 0;
        }
        .allbtn {
          margin: 24px 0;
          p {
            display: table;
            span {
              display: table-cell;
              font-size: 15px;
              vertical-align: middle;
              padding-right: 20px;
              color: #323232;
            }
            span:last-child {
              padding: 0;
              margin: 0;
              label {
                .mint-switch-input:checked + .mint-switch-core {
                  border-color: rgba(255, 177, 72, 1);
                  background: rgba(255, 177, 72, 1);
                }
                .mint-switch-core {
                  height: 24px;
                  width: 44px;
                }
                .mint-switch-core::after {
                  height: 22px;
                  width: 22px;
                }
                .mint-switch-core::before {
                  height: 22px;
                  width: 42px;
                }
              }
            }
          }
          p:first-child {
            margin-top: 10px;
            margin-bottom: 20px;
          }
        }
      }
    }
  }
  #supervise {
    .mint-popup-top {
      width: 100%;
      height: auto;
      box-sizing: border-box;
      padding: 12px;
      text-align: justify;
      background-color: rgba(255, 177, 72, .9);
      backface-visibility: hidden;
    }
    .mint-popup-top p {
      font-size: 14px;
      line-height: 1.4;
      color: #fff;
    }
    footer {
      font-size: 0;
      box-sizing: border-box;
      width: 100%;
      height: auto;
      position: absolute;
      bottom: 0;
      left: 0;
      box-shadow: 0 -1px 0 #f0f1f5;
      button {
        width: 50%;
        height: 50px;
        font-size: 15px;
        border: 0;
      }
      button:first-child {
        background: #fff;
        color: rgba(255, 177, 72, 1);
        &:active {
          background: rgba(255, 177, 72, 0.1);
          color: rgba(255, 177, 72, 0.8);
        }
      }
      button:last-child {
        background: rgba(255, 177, 72, 1);
        color: white;
        &:active {
          -webkit-transition: background 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background 0.1s cubic-bezier(0.645, 0.045, 0.355, 1);
          background: rgba(255, 177, 72, 0.8);
        }
      }

    }
  }
</style>
