<template>
  <div class="xiaoan-box reviseInfo cont" id="contrev-info" ref="reviseInfoDom">
    <div class="revise-info-scroll box" :style="{height:contentHeight+'px'}">
      <div class="revise-info-box">
        <div class="back-info baseInfo">
          <ul>
            <li>
              <div class="listBox">
                <span>用户名<i>*</i></span>
                <input type="text" v-model="nickname" :placeholder="baseInfoDataObj.nickName.placeholder"
                       @input="reviseInfoInput('nickname')" @focus="reviseInfoFocus('nickname')"
                       @blur="reviseInfoBlur('nickname')">
                <b class="icon iconfont icon-X" @click="()=>{this.nickname='';this.isnickname=false;}"
                   v-show="this.nickname.length>0"></b>
              </div>
              <p class="nickErr" v-show="!isnickname">{{baseInfoDataObj.nickName.textErr}}</p>
            </li>
            <li>
              <div class="listBox">
                <span>姓&emsp;名<i>*</i></span>
                <input type="text" v-model="realname" :placeholder="baseInfoDataObj.userName.placeholder"
                       @input="reviseInfoInput('realname')" @focus="reviseInfoFocus('realname')"
                       @blur="reviseInfoBlur('realname')">
                <b class="icon iconfont icon-X" @click="()=>{this.realname='';this.isusername=false;}"
                   v-show="this.realname.length>0"></b>
              </div>
              <p class="userErr" v-show="!isusername">{{baseInfoDataObj.userName.textErr}}</p>
            </li>
            <li>
              <div class="listBox">
                <span>邮&emsp;箱<i style="opacity: 0">*</i></span>
                <input type="text" v-model="emailAddress" :placeholder="baseInfoDataObj.email.placeholder"
                       @input="reviseInfoInput('email')" @focus="reviseInfoFocus('email')">
                <b class="icon iconfont icon-X" @click="()=>{emailAddress=''; emailshow = true}"
                   v-show="emailAddress.length>0"></b>
              </div>
              <p class="emailErr" v-show="!emailshow && this.emailAddress.length!==0">
                {{baseInfoDataObj.email.textErr}}</p>
            </li>
            <li>
              <div class="listBox">
                <span>简&emsp;介<i style="opacity: 0">*</i></span>
                <input type="text" v-model="synopsis" :placeholder="baseInfoDataObj.synopsis.placeholder"
                       @input="reviseInfoInput('synopsis')" maxlength="10">
                <b class="icon iconfont icon-X" v-show="this.synopsis !=''" @click="synopsis=''"></b>
              </div>
            </li>
          </ul>
        </div>
        <hr>
        <div class="back-info company">
          <ul>
            <li>
              <div class="listBox">
                <span>公司类型<i>*</i></span>
                <div class="sortbox">
                  <select id="company-1" v-model="Oneid" @change="oneChange">
                    <option :value="list.id" v-for="(list,index) in sortOne">{{list.name}}</option>
                  </select>
                  <select id="company-2" v-model="Twoid" @change="twoChange">
                    <option :value="list.id" v-for="(list,index) in sortTwo">{{list.name}}</option>
                  </select>
                </div>
              </div>
              <p class="sortErr" style="display: none" v-show="!sortshow">{{baseInfoDataObj.companyType.textErr}}</p>
            </li>
            <li>
              <div v-show="codeShow">
                <div class="listBox">
                  <span>公司代码<i>*</i></span>
                  <input type="text" v-model="comCode" :placeholder="baseInfoDataObj.code.placeholder"
                         @input="reviseInfoInput('code')" @focus="reviseInfoFocus('code')"
                         @blur="reviseInfoBlur('code')">
                  <b class="icon iconfont icon-X" @click="()=>{this.comCode='';this.code=false}"
                     v-show="this.comCode.length>0"></b>
                </div>
                <!--请输入正确的公司代码！-->
                <p class="codeErr" v-show="!code">{{baseInfoDataObj.code.textErr}}</p>
              </div>
            </li>
            <li>
              <div class="listBox">
                <span>公司名称<i>*</i></span>
                <input type="text" v-model="allname" :placeholder="baseInfoDataObj.fullName.placeholder"
                       @input="reviseInfoInput('allname')" @focus="reviseInfoFocus('allname')"
                       @blur="reviseInfoBlur('allname')">
                <b class="icon iconfont icon-X" @click="()=>{this.allname='';this.fullname=false}"
                   v-show="this.allname.length>0"></b>
              </div>
              <p class="fullErr" v-show="!fullname">{{baseInfoDataObj.fullName.textErr}}</p>
            </li>
          </ul>
        </div>
        <hr>
        <div class="back-info address">
          <ul>
            <li>
              <div class="listBox">
                <span>职&emsp;&emsp;位<i style="opacity: 0">*</i></span>
                <div class="jobsort">
                  <select @change="getJobName" id="getJob" v-model="jobId">
                    <option :value="item.id" v-for="(item,index) of jobList">{{ item.name }}</option>
                  </select>
                  <div class="jobtext" v-show="false">{{ jobNameShow }}</div>
                </div>
              </div>
            </li>
            <li>
              <div class="listBox">
                <span>公司地址<i style="opacity: 0">*</i></span>
                <div class="areabox">
                  <select v-model="pid" @change="proChange()">
                    <option :value="list.id" v-for="(list,index) in pro">{{list.name}}</option>
                  </select>
                  <select v-model="cid" @change="cityChange()">
                    <option :value="list.id" v-for="(list,index) in city">{{list.name}}</option>
                  </select>
                  <select v-model="ccid" @change="districtChange()">
                    <option :value="list.id" v-for="(list,index) in county">{{list.name}}</option>
                  </select>
                </div>
              </div>
            </li>
            <li>
              <div class="listBox textArea">
                <textarea class="textarea" placeholder="请输入公司详细地址" v-model="fullAdress"></textarea>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div ref="footerDom" class="complete pass vux-1px-t" @click="completes()">
      <button v-if="subText">保&emsp;存</button>
      <button v-else>下一步</button>
    </div>
    <xiaoan-loading v-show="loading"></xiaoan-loading>
  </div>
</template>
<script>
  import areaData from '../../assets/province/areaData.js'

  export default {
    name: "reviseInfo",
    data() {
      return {
        loading: true,
        baseInfoDataObj: {
          nickName: {placeholder: '默认微信名', textErr: '请输入用户名', show: false},
          userName: {placeholder: '请输入真实姓名', textErr: '请输入真实姓名', show: false},
          email: {placeholder: '请输入工作邮箱', textErr: '邮箱格式错误', show: false},
          synopsis: {placeholder: '请输入个人简介，最多10个字符', textErr: '个人简介', show: false},
          companyType: {placeholder: '', textErr: '请输入正确的公司类型', show: false},
          code: {placeholder: '请输入公司代码', textErr: '请输入正确的公司代码', show: false},
          fullName: {placeholder: '请输入公司全称', textErr: '请输入正确的公司名称', show: false}
        },
        synopsis: '', // 简介
        contentHeight: 0,
        subText: true, //
        nickname: "", // 微信昵称
        realname: "", // 真实姓名
        emailAddress: "", // 邮箱地址
        isnickname: true, // 是否填写用户名
        isusername: true, // 真实姓名 是否正确
        emailshow: true, // 邮箱地址 是否正确
        sortAll: [], // 公司类型库
        sortOne: "", // 一级公司类型
        sortonename: "", // 一级公司类型名称
        sorttwoname: "", // 二级公司类型名称
        sortTwo: "", // 二级公司类型
        sortshow: false, // 公司类型 是否正确
        Oneid: "", // 一级公司ID
        Twoid: "", // 二级公司ID
        comCode: "", // 公司代码
        code: true, // 公司代码 是否正确
        codeShow: true, // 公司代码一栏是否显示
        allname: "", // 公司全称
        fullname: true, // 公司全称 是否正确
        jobList: [],
        jobId: "", // 职位ID
        jobSubId: '', // 提交时职业id
        jobname: "", // 职位名称
        jobNameShow: '', // ios上不显示出来，怎么办
        fullAdress: "", // 公司详细地址
        allAreaData: areaData,
        pro: "",
        city: "",
        county: "",
        pid: "",
        cid: "",
        ccid: "",
        province: "",
        selectcity: "",
        district: "",
        fromUserIds: '',
        userId: ''
      }
    },
    created() {
      this.loading = true;
      if (this.$route.query.id) {
        if (this.$route.query.id == 1) {
          document.title = '完善个人信息';
          this.subText = false;
        } else if (this.$route.query.id == 2) {
          document.title = '修改个人信息';
          this.subText = true;
        }
      }
      if (sessionStorage.getItem('registerInfo')) {
        this.userId = JSON.parse(sessionStorage.getItem('registerInfo')).id;
        // window.sessionStorage.removeItem('registerInfo')
      } else {
        this.userId = this.$cookie.get("userId");
      }
      // if (this.$cookie.isLogin()) {
        this.pro = this.allAreaData.pro;
        this.pid = this.pro[0]['id'];
        this.apiUserHome();
        this.proChange();
      // } else {
      //   this.$storage.loginStatus(this, '个人中心', window.location.href);
      // }
    },
    mounted() {
      this.$nextTick(() => {
        this.contentHeight = this.$refs.reviseInfoDom.clientHeight - this.$refs.footerDom.clientHeight;
      });
      setTimeout(() => {
        this.loading = false;
      }, 600);
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/my'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      // userHome 接口获取信息
      apiUserHome() {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        let params = {
          userId: this.userId
        }
        this.$axios.userHome.userhome(params).then((res) => {
          if (res.data.returnCode == 1) {
            console.log(res.data.returnObject);
            let info = res.data.returnObject;
            if (!sessionStorage.getItem('registerInfo')) {
              this.$cookie.setAuth(info);
              this.$cookie.set('userInfo', window.JSON.stringify(info));
              window.localStorage.setItem('wx-my-home', window.JSON.stringify(info));
            }
            this.nickname = info.userName == null ? "" : info.userName; // 微信昵称
            this.realname = info.realName == null ? "" : info.realName; // 真实姓名
            this.synopsis = info.synopsis == null ? "" : info.synopsis; // 新增的个人简介
            this.emailAddress = info.email == null ? "" : info.email; // 邮箱地址
            this.fullAdress = info.companyStreet == null ? "" : info.companyStreet; // 公司详细地址
            this.comCode = info.companyCode == null ? "" : info.companyCode; // 公司代码
            this.allname = info.companyName == null ? "" : info.companyName; // 公司全称
            this.jobname = info.position; // 职位名称
            //
            if (info.position == '' || info.position == null) {
              this.jobname = '请选择'
            }
            this.jobNameShow = this.jobname;
            this.sortonename = info.companyTypeOne; // 公司类型
            this.sorttwoname = info.companyTypeTwo; //

            this.$nextTick(() => {
              this.pid = info.provinceId;
              this.cid = info.cityId;
              this.ccid = info.areaId;
              this.proChange(this.cid, this.ccid); // 公司地址
              console.log('省市区：', this.pid, this.cid, this.ccid)
            }, 10);
            //
            this.getUserCompanyInfo();
            this.getUserPosition();
          }
        }).catch((err) => {
          console.error(err)
        })
      },
      // input blur
      reviseInfoBlur(val) {
        switch (val) {
          case 'nickname':
            // 用户名
            if (this.nickname.length == 0) {
              $(".nickErr").text('请输入用户名！').show();
            }
            break;
          case 'realname':
            // 姓名
            let content = this.realname;
            if (!/^\s*$/.test(content) && content.length < 20) {
              this.isusername = true;
              $(".userErr").hide();
            } else {
              this.isusername = false;
              $(".userErr").show();
            }
            break;
          case 'code':
            this.codeIsErr();
            break;
          case 'allname':
            if (this.allname.length == 0) {
              $(".fullErr").text('请输入公司名称！').show();
            } else {
              $(".fullErr").text('请输入正确的公司名称！')
            }
            break;
        }
      },
      // focus
      reviseInfoFocus(val) {
        switch (val) {
          case 'nickname':
            // 用户名
            $(".nickErr").hide();
            break;
          case 'realname':
            // 姓 名
            $(".userErr").hide();
            break;
          case 'email':
            // email
            break;
          case 'code':
            if (this.comCode.length > 0) {
              $('.bbb3').show();
            }
            $(".codeErr").hide();
            break;
          case 'allname':
            if (this.allname.length > 0) {
              $('.bbb4').show();
            }
            $('.fullErr').hide();
            break;
        }
      },
      // input change
      reviseInfoInput(val) {
        switch (val) {
          case 'nickname':
            let value = this.nickname;
            this.nickname = value;
            console.log("微信昵称" + this.nickname)
            if (this.nickname.length == 0) {
              this.isnickname = false;
              $(".nickErr").show();
            } else {
              this.isnickname = true;
              $(".nickErr").hide();
            }
            break;
          case 'realname':
            let content = this.realname;
            if (!/^\s*$/.test(content) && content.length < 20) {
              this.isusername = true;// console.log("不显示")
              $(".userErr").hide();
            } else {
              this.isusername = false;
              $(".userErr").show();
            }
            console.log("真实姓名" + this.realname);
            break;
          case 'email':
            $(".bbb2").css('display', 'none');
            // 验证邮箱正则
            this.emailAddress = this.$array.trim(this.emailAddress);
            // console.log("youxiang" , this.emailAddress);
            this.emailshow = this.$regExp.email(this.emailAddress);
            if (this.emailAddress == '') {
              this.emailshow = true;
            }
            $(".nickErr").hide();
            //
            break;
          case 'code':
            // code 实时验证
            let codetext = this.comCode;
            let regExp = /^[0-9]{5,6}$/;
            this.code = regExp.test(codetext);
            this.code ? $(".codeErr").hide() : $(".codeErr").show();
            this.codeIsErr()
            if (!this.code) {
              return false
            }
            if (this.comCode.length !== 0 && this.code) {
              this.getStockCode();
            }
            //
            break;
          case 'allname':
            let text = this.allname;
            let textLength = text.length;
            if (textLength > 0 && textLength < 50) {
              this.fullname = true;
              $(".fullErr").hide();
            } else {
              this.fullname = false;
              $(".fullErr").show();
            }
            break;
          case 'synopsis':
            // 新增加的简介
            console.log('synopsis', this.synopsis, this.synopsis.length);
            this.synopsis = this.$array.ltrim(this.synopsis);
            // if (this.synopsis.length > 10) {
            //   this.synopsis = this.synopsis.substring(0, 10);
            // }
            break;
        }
      },
      // 根据代码查询公司名称
      getStockCode() {
        let params = {
            companyCode: this.comCode
          }
        this.$axios.common.getStockCode(params).then(res => {
          if (res.data.returnCode == 1) {
            this.allname = res.data.returnObject;
            this.baseInfoDataObj.code.textErr = '';
            this.fullname = true;
            $(".fullErr").hide();
          } else {
            // *console.log('未查询成功！')*/
            this.code = false;
            $(".codeErr").show();
            this.baseInfoDataObj.code.textErr = res.data.returnMsg;
            this.allname = '';
            console.log(this.code);
            this.fullname = false;
            $(".fullErr").text('请填写公司名称').show();
            let textLength = this.allname.length;
            if (textLength > 0 && textLength < 50) {
              this.fullname = true;
              $(".fullErr").hide();
            } else {
              this.fullname = false;
              $(".fullErr").show();
            }
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      // 获取公司二级菜单
      getCompanyInfoTwo(id) {
        var userCompanyInfoList = [];
        this.sortOne.forEach((item) => {
          if (item.id == id) {
            userCompanyInfoList = item.userCompanyInfoList;
          }
        });
        if (userCompanyInfoList.length == 0) {
          userCompanyInfoList = this.sortOne[0].userCompanyInfoList;
        }
        return userCompanyInfoList
      },
      //
      oneChange() {
        this.sortTwo = this.getCompanyInfoTwo(this.Oneid);
        this.Twoid = this.sortTwo[0].id;
        this.sortOne.forEach((item) => {
          if (item.id == this.Oneid) {
            this.sortonename = item.name;
          }
        });
        this.sortTwo.forEach((item) => {
          if (item.id == this.Twoid) {
            this.sorttwoname = item.name;
          }
        });
        this.canInputCode();
        this.code = true;
        $(".codeErr").hide();
      },
      //
      twoChange() {
        console.log(this.Oneid);
        console.log(this.Twoid);
        this.Twoid == '11' ? $(".sortErr").show() : $(".sortErr").hide();
        //
        this.sortTwo.forEach((item) => {
          if (item.id == this.Twoid) {
            this.sorttwoname = item.name;
          }
        });
        //
        this.canInputCode();
        this.code = true;
        $(".codeErr").hide();
      },
      // 职位 change
      getJobName() {
        console.log(this.jobId);
        this.jobList.forEach((item) => {
          if (this.jobId == item.id) {
            this.jobname = item.name
          }
        });
        this.jobNameShow = this.jobname;
      },
      // 省 change
      proChange(cityId, districtId) {
        this.city = this.allAreaData.city[this.pid];
        this.cid = cityId || this.city[0].id;
        this.county = this.allAreaData.county[this.cid];
        if (this.county.length > 0) {
          this.ccid = this.county[0].id;
        }
        let picObj = {};
        this.pro.forEach((item) => {
          if (item.id == this.pid) {
            picObj = item;
          }
        });
        this.province = picObj.name;
        this.$nextTick(() => {
          this.cityChange(districtId);
          console.log(this.pid, this.province)
        });
      },
      // 市 change
      cityChange(districtId) {
        this.county = this.allAreaData.county[this.cid];
        if (!districtId) {
          if (this.county.length > 0) {
            this.ccid = this.county[0]['id'];
          }
        } else {
          if (this.county.length > 0) {
            this.ccid = districtId;
          }
        }
        let cityObj = {};
        this.city.forEach((item) => {
          if (item.id == this.cid) {
            cityObj = item;
          }
        });
        this.selectcity = cityObj.name;
        this.$nextTick(() => {
          this.districtChange();
          console.log(this.cid, this.selectcity)
        })
      },
      // 区/县 change
      districtChange() {
        let countyObj = {};
        this.county.forEach((item) => {
          if (item.id == this.cid) {
            countyObj = item;
          }
        });
        this.district = countyObj.name;
        console.log(this.ccid, this.district)
      },
      //
      completes() {
        this.sortTwo[0].id !== '11' ? this.sortshow = true : this.sortshow = false;
        //console.log("this.sortshow="+this.sortshow)
        this.sortTwo[0].id !== '11' ? $(".sortErr").hide() : $(".sortErr").show();
        //
        console.log('this.code:' + this.code);
        this.codeIsErr();
        if (this.code == false || this.baseInfoDataObj.code.textErr == '没有对应公司名称！') {
          $(".codeErr").show();
          return
        } else {
          $(".codeErr").hide();
        }
        let textLength = this.allname.length;
        console.log(textLength);
        if (textLength > 0 && textLength < 50) {
          this.fullname = true;
          $(".fullErr").hide();
        } else {
          this.fullname = false;
          $(".fullErr").show();
        }
        if (this.codeShow) {
        } else {
          this.comCode = "";
        }
        if (window.localStorage.getItem("fromUserId") === null) {
          this.fromUserIds = '';
        } else {
          this.fromUserIds = window.localStorage.getItem("fromUserId");
        }
        // * 如果公司类型为上市公司，未填公司代码的情况下点击完成注册，提示信息  8.22版本修改以下 */
        if (this.codeShow == true && this.comCode.length == 0) {
          $(".codeErr").text('请输入公司代码！').show();
          $(".box").scrollTop($(".company-code").offset().top) // 滚动条位置滚动到公司代码栏位置
        } else {
          $(".codeErr").hide();
        }
        this.jobSubId = this.jobId;
        if (this.jobId == 0) {
          this.jobSubId = ''
        }
        /*8.22版本修改以上*/
        if (this.sortshow == true && this.isnickname == true && this.isusername == true && this.fullname == true && this.code == true && this.emailshow == true && this.codeShow == true && this.comCode.length !== 0) {
          console.log('公司代码填写正确', '有公司代码一栏', this.realname, this.Oneid, this.sortonename, this.Twoid, this.sorttwoname, this.comCode, this.allname, this.nickname, this.emailAddress, this.jobId, this.jobname, this.fullAdress, this.pid, this.province, this.cid, this.selectcity, this.ccid, this.district)
          this.completePersonInfo(true);
          //
        } else if (this.sortshow == true && this.isnickname == true && this.isusername == true && this.fullname == true && this.emailshow == true && this.codeShow == false) {
          console.log('无公司代码一栏', this.realname, this.Oneid, this.sortonename, this.Twoid, this.sorttwoname, this.comCode, this.allname, this.nickname, this.emailAddress, this.jobId, this.jobname, this.fullAdress, this.pid, this.province, this.cid, this.selectcity, this.ccid, this.district)
          this.completePersonInfo(false);
          //
        } else {
          console.log('3242424', this.emailshow, this.sortshow);
        }
      },
      //
      completePersonInfo(type) {
        // this.$http({
        //   method: "POST",
        //   url: this.$api.user.completePersonInfo,
        //   params: {
        //     userName: this.nickname,
        //     realName: this.realname,
        //     email: this.emailAddress,
        //     position: this.jobSubId,
        //     synopsis: this.synopsis,
        //     companyName: this.allname,
        //     companyProvince: this.province,
        //     companyCity: this.selectcity,
        //     companyTown: this.district,
        //     companyStreet: this.fullAdress,
        //     provinceId: this.pid,
        //     cityId: this.cid,
        //     areaId: this.ccid,
        //     companyTypeOne: this.Oneid,
        //     companyTypeTwo: this.Twoid,
        //     companyCode: this.comCode,
        //     fromUserId: this.fromUserIds
        //   }
        // }).then((res) => {
          let params = {
            userName: this.nickname,
            realName: this.realname,
            email: this.emailAddress,
            position: this.jobSubId,
            synopsis: this.synopsis,
            companyName: this.allname,
            companyProvince: this.province,
            companyCity: this.selectcity,
            companyTown: this.district,
            companyStreet: this.fullAdress,
            provinceId: this.pid,
            cityId: this.cid,
            areaId: this.ccid,
            companyTypeOne: this.Oneid,
            companyTypeTwo: this.Twoid,
            companyCode: this.comCode,
            fromUserId: this.fromUserIds,
            userId: this.userId
            }
          this.$axios.user.completePersonInfo(params).then(res => {
          // console.info("completePersonInfo",res.data);
          if (res.data.returnCode == 1) {
            window.sessionStorage.removeItem('registerInfo')
            if (window.sessionStorage.getItem('weixinBindPhone')) {
              window.sessionStorage.removeItem('weixinBindPhone')
              this.bindingWxInfo();
            } else {
              this.apiUserHome();
            }
            if (window.sessionStorage.getItem('refer_title') == '修改个人信息') {
              window.sessionStorage.removeItem('refer_title');
              window.sessionStorage.removeItem('refer_url');
            }
            if (type) {
              if (this.comCode !== '' && this.realname !== '') {
                if (this.subText == true) {
                  window.sessionStorage.setItem("register", 2);
                  this.$router.replace('/loadPass');
                } else {
                  window.sessionStorage.setItem("register", 0);
                  this.$router.replace('/loadPass');
                }
              }
            } else {
              // type = false
              if (this.realname !== '') {
                if (this.subText == true) {
                  window.sessionStorage.setItem("register", 2);
                  this.$router.replace('/loadPass');
                } else {
                  window.sessionStorage.setItem("register", 0);
                  this.$router.replace('/loadPass');
                }
              }
            }
          } else if (res.data.returnCode == -1) {
            console.log(res.data.returnMsg)
            if (type) {
              if (res.data.returnMsg == '用户名重复！') {
                this.nickname.length !== 0 ? $(".nickErr").text('用户名重复！').show() : $(".nickErr").text('请填写用户名！').show();
                $(".revise-info-box").scrollTop(0);
              } else {
                console.log(res.data.returnMsg);
              }
            } else {
              // type = false
              console.log(res.data.returnMsg)
              if (res.data.returnMsg == '用户名重复！') {
                $(".nickErr").text('用户名重复！').show()
              } else {
                console.log(res.data.returnMsg)
              }
            }
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '服务器错误请稍后重试！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      // 绑定或解除微信信息
      bindingWxInfo() {
        let params = {
          userId: this.userId,
          binding: true
        }
        this.$axios.user.bindingWxInfo(params).then(res => {
          if (res.data.returnCode == 200) {
            this.apiUserHome();
          } else {
            this.apiUserHome();
            this.$vux.toast.show({
              text: res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
            // setTimeout(()=> {
            //   this.$router.replace({path:'/manage'});
            //   // this.$router.push({path: '/login/bindPhone', query: {bind: true}});
            // },2000)
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      // 获取公司选项
      getUserCompanyInfo() {
        this.$axios.user.getUserCompanyInfo().then(res => {
          if (res.data.returnCode == 1) {
            this.sortAll = res.data.returnObject;
            this.sortOne = this.sortAll;
            this.Oneid = '';
            this.sortOne.forEach((item) => {
              if (item.name == this.sortonename) {
                this.Oneid = item.id;
                this.sortTwo = this.getCompanyInfoTwo(this.Oneid);
              }
            });
            console.log('this.sortTwo', this.sortTwo);
            if (this.sortTwo) {
              this.sortTwo.forEach((item) => {
                if (item.name == this.sorttwoname) {
                  this.Twoid = item.id;
                  $(".sortErr").hide();
                }
              })
            }
            console.log('this.Twoid', this.Twoid);
            // 设置默认值
            if (this.Oneid == '') {
              this.Oneid = this.sortOne[0].id
              this.sortonename = this.sortOne[0].name;
            }
            if (this.Twoid == '') {
              this.Twoid = this.sortOne[0].userCompanyInfoList[0].id;
              this.sorttwoname = this.sortOne[0].userCompanyInfoList[0].name;
              this.sortTwo = this.sortOne[0].userCompanyInfoList;
            }
            console.log(this.Oneid, this.Twoid);
            console.log('32131', this.sortOne);
            console.log('213213', this.sortTwo);

            this.canInputCode()
            this.baseInfoDataObj.code.textErr = '';
          }
        }).catch((err) => {
          console.error(err.response)
        })
      },
      // 获取职位信息
      getUserPosition() {
        this.$axios.user.getUserPosition().then(res => {
          if (res.data.returnCode == 1) {
            let jobListData = res.data.returnObject;
            jobListData.unshift({id: 0, name: '请选择'});
            this.jobList = jobListData;
            this.jobId = this.getPositionIdByName(this.jobname);
          }
        }).catch((err) => {
          console.error(err.response);
        })
      },
      // 获取职位id
      getPositionIdByName(name) {
        var rtnName = '';
        this.jobList.forEach((item) => {
          if (item.name == name) {
            rtnName = item.id;
          }
        });
        if (rtnName == '') {
          rtnName = this.jobList[0].id;
        }
        return rtnName
      },
      //
      canInputCode() {
        if ('上市公司,挂牌公司'.indexOf(this.sortonename) >= 0 && this.sorttwoname != '其他上市公司') {
          this.codeShow = true;
        } else {
          this.codeShow = false;
          this.code = true;
        }
        this.codeIsErr()
        console.log('codeShow:' + this.codeShow + ' this.sortonename:' + this.sortonename + ' this.sorttwoname:' + this.sorttwoname)
      },
      //
      setCodeTip(code, regx, num, isErr) {
        this.baseInfoDataObj.code.placeholder = '请输入公司代码,如:' + code
        if (!isErr) {
          this.baseInfoDataObj.code.textErr = this.sorttwoname + '代码' + regx + '开头' + num + '位数字'
        }
      },
      //
      codeIsErr() {
        let isErr = true
        if (this.codeShow) {
          if (this.sortonename == '上市公司') {
            if (this.sorttwoname == '沪市主板') {
              isErr = /^(600|601|603|900)[0-9]{3}$/.test(this.comCode)
              this.setCodeTip('600120', '600,601,603,900', '6', isErr)
            } else if (this.sorttwoname == '深市主板') {
              isErr = /^(000|001|200)[0-9]{3}$/.test(this.comCode)
              this.setCodeTip('000001', '000,001,200', '6', isErr)
            } else if (this.sorttwoname == '深市中小板') {
              isErr = /^(002)[0-9]{3}$/.test(this.comCode)
              this.setCodeTip('002001', '002', '6', isErr)
            } else if (this.sorttwoname == '深市创业板') {
              isErr = /^(300)[0-9]{3}$/.test(this.comCode)
              this.setCodeTip('300001', '300', '6', isErr)
            } else if (this.sorttwoname == '港股主板') {
              isErr = /^(00|01|02|03|04|06|80|84)[0-9]{3}$/.test(this.comCode)
              this.setCodeTip('00001', '00,01,02,03,04,06,80,84', '5', isErr)
            } else if (this.sorttwoname == '港股创业板') {
              isErr = /^(08)[0-9]{3}$/.test(this.comCode)
              this.setCodeTip('08030', '08', '5', isErr)
            }
          } else if (this.sortonename == '挂牌公司') {
            if ('创新层,基础层'.indexOf(this.sorttwoname) >= 0) {
              isErr = /^(43|83|87)[0-9]{4}$/.test(this.comCode)
              this.setCodeTip('430002', '43,83,87', '6', isErr)
            } else if (this.sorttwoname == '两网及退市公司') {
              isErr = /^(40|42)[0-9]{4}$/.test(this.comCode)
              this.setCodeTip('400002', '40,42', '6', isErr)
            }
          }
        }
        console.log(isErr)
        if (!isErr) {
          this.code = false
          $(".codeErr").show();
        } else {
          this.code = true
          $(".codeErr").hide();
        }
      }
    },
    destroyed: function () {
      window.localStorage.removeItem("fromUserId");
      window.sessionStorage.removeItem('registerInfo');
    }
  }
</script>

<style scoped lang="scss">
  .xiaoan-box.reviseInfo {
    width: 100%;
    height: 100%;
    background: #fff;
    overflow: hidden;
    position: relative;
    .revise-info-scroll {
      float: none;
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      .revise-info-box {
        width: 100%;
        height: auto;
        b {
          width: 15px;
          height: 15px;
          font-size: 15px;
          color: #c1c1c1;
          position: absolute;
          right: 8px;
          top: 50%;
          bottom: 0;
          transform: translateY(-50%);
        }
        input {
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          outline: none !important;
          font-size: 15px !important;
          color: #323232 !important;
          -webkit-appearance: none;
        }
        select {
          font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
          outline: none;
          font-size: 15px;
          color: #323232;
          border: 0;
          -webkit-appearance: none;
          background: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/toTDSelect.png") no-repeat right center;
          background-size: 18px;
          padding-right: 14px;
          border-radius: 0;
        }
        hr {
          width: 100%;
          height: 7.5px;
          background: #f0f1f5;
          border: 0;
          margin: 0;
        }
        .back-info {
          width: 100%;
          font-size: 0;
          height: auto;
          background: #fff;
          padding: 15px 10px 5px 10px;
          box-sizing: border-box;
          display: inline-block;
        }
        .back-info {
          ul {
            li {
              .listBox {
                width: 100%;
                height: 40px;
                display: inline-block;
                margin-bottom: 10px;
                position: relative;
                span {
                  width: 24%;
                  height: 40px;
                  display: inline-block;
                  text-align: right;
                  line-height: 40px;
                  padding-right: 5px;
                  box-sizing: border-box;
                  letter-spacing: 1px;
                  font-size: 15px;
                  color: #535353;
                }
                input {
                  display: inline-block;
                  width: 76%;
                  height: 40px;
                  outline: none;
                  font-size: 15px;
                  padding: 0 27px 0 5px;
                  box-sizing: border-box;
                  color: #8d8d8d;
                  font-family: PingFangSC-Regular, sans-serif;
                  border: 1px solid #e3e3e3;
                  border-radius: 2px;
                }
                i {
                  width: auto;
                  height: 100%;
                  color: #ffb148;
                  font-style: normal;
                }
                .sortbox, .jobsort, .areabox {
                  display: inline-block;
                  width: 76%;
                  height: 40px;
                  outline: none;
                  padding: 5px 5px;
                  box-sizing: border-box;
                  color: #8d8d8d;
                  font-family: PingFangSC-Regular, sans-serif;
                  border: 1px solid #e3e3e3;
                  border-radius: 2px;
                }
                .sortbox {
                  display: inline-block;
                  width: 76%;
                  height: 40px;
                  outline: none;
                  padding: 5px 5px;
                  box-sizing: border-box;
                  color: #8d8d8d;
                  font-family: PingFangSC-Regular, sans-serif;
                  border: 1px solid #e3e3e3;
                  border-radius: 2px;
                  #company-1, #company-2 {
                    width: 55%;
                    height: 100%;
                    border: 0;
                    text-align: left;
                    outline: none;
                  }
                  #company-2 {
                    width: 45%;
                    padding-left: 5px;
                    box-sizing: border-box;
                    option {
                      text-align: center;
                    }
                  }
                }
                .jobsort {
                  font-size: 15px;
                  position: relative;
                  select {
                    width: 100%;
                    height: 100%;
                    border: 0;
                    outline: none;
                    font-size: 15px;
                    font-family: PingFangSC-Regular, sans-serif;
                  }
                  .jobtext { /*ios显示出来 使用覆盖div层完成*/
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 50%;
                    height: 100%; /*padding: 5px 5px;*/
                    padding: 0 5px;
                    box-sizing: border-box;
                    color: #323232;
                    font-family: PingFangSC-Regular, sans-serif;
                    background: white;
                    line-height: 40px;
                  }
                }
                .areabox {
                  display: inline-block;
                  select {
                    width: 33.33333%;
                    height: 100%;
                    box-sizing: border-box;
                    border: 0;
                  }
                }
                //
                .textarea {
                  font-family: PingFangSC-Regular, sans-serif;
                  display: block;
                  color: #323232 !important;
                  font-size: 15px;
                  width: 76%;
                  min-height: 67px;
                  border-radius: 2px;
                  float: right;
                  resize: none;
                  border: 1px solid #e3e3e3;
                  box-sizing: border-box;
                  padding: 5px 4px;
                  -webkit-appearance: none;
                }
              }
              .listBox.textArea {
                height: auto;
              }
              .userErr, .emailErr, .fullErr, .codeErr, .sortErr, .nickErr {
                width: 100%;
                height: auto;
                padding-left: 24%;
                box-sizing: border-box;
                font-size: 13px;
                color: #fb4319;
                margin: -5px 0 5px 0;
              }
              .sortErr {
                display: none;
              }
              .fullErr {
                margin: -5px 0 -10px 0;
              }
            }
          }
        }
        .back-info.baseInfo {
        }
        .back-info.address {
          padding-bottom: 40px;
        }
      }
    }
    .complete {
      width: 100%;
      height: 50px;
      background-color: #ffd59c;
      position: absolute;
      bottom: 0;
      left: 0;
      button {
        height: 100%;
        width: 100%;
        border: none;
        border-radius: 0;
        font-size: 15px;
        background-color: #ffb148;
        color: white;
        font-family: PingFangSC-Medium, sans-serif;
        -webkit-transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
        &:active {
          background-color: rgba(255, 225, 149, 0.4);
          -webkit-transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
          transition: background-color 0.02s cubic-bezier(0.645, 0.045, 0.355, 1);
        }
      }
    }
    .complete.pass {
      background: #ffb148;
    }
  }
</style>
