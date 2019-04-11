<template>
  <div id="personal-info" class="xiaoan-box personal-info">
    <form action="" onsubmit=" return false">
      <div class="password" :class="{borderColor: passBox.passErr.borColor}">
        <span>密码</span>
        <input type="password" placeholder="请输入6-20位密码" v-model="password" @focus="focusPsd" @blur="blurPsd">
        <i class="icon iconfont icon-X bbb" v-show="this.password.length > 0"
           @click="()=>{this.password='';this.passvalid=false}"></i>
      </div>
      <p class="passErr" v-show="passBox.passErr.show">{{passBox.passErr.text}}</p>
      <!---->
      <div class="again" :class="{borderColor: passBox.apassErr.borColor}">
        <span>再次输入</span>
        <input type="password" placeholder="请确认登录密码" v-model="apassword" @focus="focusAPsd()"
               @blur="blurAPsd()">
        <i class="icon iconfont icon-X bbb" v-show="this.apassword.length>0"
           @click="()=>{this.apassword='';this.apassvalid=false}"></i>
      </div>
      <p class="apassErr" v-show="passBox.apassErr.show">{{passBox.apassErr.text}}</p>
      <!---->
      <div class="regsitor" :class="{borderColor: passBox.regErr.borColor}">
        <span>验证码</span>
        <input type="tel" placeholder="请输入验证码" v-model="reg" @focus="focusReg()" @input="yzInput()"
               @blur="blurReg()">
        <i style="right:37%" class="icon iconfont icon-X bbb" v-show="this.reg.length > 0"
           @click="()=>{this.reg='';this.regvalid=false}"></i>
        <p class="regnum" @click="sendSmsCode" ref="regNum">{{ getNumber }}
        <div class="shadowx" v-show="shadowx"></div>
      </div>
      <p class="regErr" v-show="passBox.regErr.show">{{passBox.regErr.text}}</p>
      <!---->
      <div class="lawbox">
        <div class="checked">
          <div class="checkbox" @click="checked = !checked">
            <img :src="chengseduigou" v-show="checked" style="width: 100%;height: 100%">
          </div>
        </div>
        <div class="agree">
          <span @click="checked = !checked">我已阅读并同意</span>
          <span class="law" @click="show()">《<span>小安用户注册协议</span>》</span>
        </div>
      </div>
      <!---->
      <div class="lawbox road">
        <div class="checked">
          <div class="checkbox" @click="checkedRoad = !checkedRoad">
            <img :src="chengseduigou" v-show="checkedRoad" style="width: 100%;height: 100%">
          </div>
        </div>
        <div class="agree">
          <span @click="checkedRoad = !checkedRoad">贵公司是否有半年度业绩路演的计划或诉求（勾选后，我们的工作人员将在3个工作日内联系您）</span>
        </div>
      </div>
      <button class="next pass" @click="next()">下一步</button>
    </form>
    <!---->
    <div class="shadow" v-show="shadowBox"></div>
    <div v-show="shadowBox" class="lawboxup">
      <div class="content">
        <div class="lawheader">信公小安用户协议</div>
        <div class="ccbox">
          <div class="paddingbox">
            <div class="lawcontent" v-for="item in content">
              <p class="title">{{ item.title }}</p>
              <p class="lawcc" v-for="items in item.cclist">{{ items.cc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="close" @click="close()"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: "personal-info",
    data() {
      return {
        chengseduigou: this.$image.personal.chengseduigou,
        username: "",
        email: '',
        password: "",
        apassword: "",
        getNumber: "获取验证码",
        reg: "",
        phoneNumber: "",
        passvalid: false,
        apassvalid: false,
        regvalid: false,
        checked: false, // 设置个人信息勾选
        checkedRoad: false,
        content: [
          {
            title: "一、接受条款",
            cclist: [
              {cc: "1、用户点击信公小安注册页面的同意注册按钮并完成注册程序、获得信公小安账号和密码时，视为用户与信公小安已达成《信公小安用户协议》。"},
              {cc: "2、信公小安在此特别提示，用户欲使用信公小安服务，必须事先认真阅读本协议全部条款（未成年人阅读时应得到其监护人的陪同），特别是本协议中免除、减轻或者限制信公小安责任的全部条款以及含有限制用户权利内容的全部条款。"},
              {cc: "3、用户下载、注册、登录、使用及连接信公小安服务等行为均将被视为用户完全了解、接受并同意遵守本协议项下的全部内容。本协议可由信公小安单方随时修改，修改后的协议条款一经信公小安公布即代替本协议的原条款，构成用户与信公小安之间就本协议主题事由的全部、最新协议。用户可可以随时在信公小安网站或信公小安应用程序中查阅最新协议条款。如果用户不接受信公小安修改后的最新协议条款，请立即停止使用信公小安服务。如用户选择继续使用信公小安服务，则视为用户完全了解、接受并同意遵守信公小安修改后的最新协议条款。"},
              {cc: "4、用户特此声明，已经完全理解本协议相关内容，并不存在任何重大误解；同时，认可协议内容并不存在有失公平的情形。"},
            ]

          },
          {
            title: "二、用户信息条款",
            cclist: [
              {cc: "1、用户个人信息。用户个人信息包括下列信息：用户真实姓名，职业，头像，手机号码，IP地址。"},
              {cc: "2、非用户个人信息。用户对信公小安服务的操作状态、使用记录、使用习惯等反映在信公小安服务器端的全部记录信息，及其他一切本条第1款所述的用户个人信息范围外的信息，均为普通信息，均不属于用户个人信息。"},
              {cc: "3、第三方平台记录信息。用户通过新浪微博账号、微信账号等第三方平台账号（下称“第三方平台”）注册、登陆、使用信公小安服务的，将被视为用户完全了解、同意并接受信公小安已包括但不限于收集、统计、分析等方式使用其在新浪微博、微信等第三方平台上填写、登记、公布、记录的全部信息（下称“第三方平台记录信息”）。用户一旦使用第三方平台账号注册、登陆、使用信公小安服务，信公小安对该等第三方平台记录的信息的任何使用，均将被视为已经获得了用户本人的完全同意并接受。"},
              {cc: "4、重要提示：为向客户提供信公小安服务，信公小安将可能合理使用用户个人信息、非用户个人信息及第三方平台记录信息（以下合称“用户信息”）。用户一旦注册、登陆、使用信公小安服务，将视为用户完全了解、同意并接受信公小安通过包括但不限于收集、统计、分析、使用等方式合理使用用户信息。"},
              {cc: "6、用户查询、更正、添加信息的渠道。用户可通过信公小安服务中的相关功能查询、更正、添加其授权信公小安服务使用的用户信息。"},
              {cc: "7、用户拒绝提供信息的方式及后果。用户可以通过停止使用信公小安服务，不再向信公小安提供用户信息。但是，用户此前同意信公小安使用的用户信息，信公小安不承担主动删除、销毁的责任。用户拒绝提供用户信息的，信公小安可以随时停止提供服务。"},
              {cc: "8、用户授权的明确性。用户注册、登陆、使用信公小安服务的行为，即视为明确同意信公小安收集和使用其用户信息，无需其他意思表示。信公小安对用户信息的使用无需向用户支付任何费用。"},
              {cc: "9、信公小安承诺。信公小安尊重授权用户的合法权利，尊重授权用户的自由选择权，不会以违反法律、行政法规以及本协议约定的方式收集、使用用户信息。"}
            ]

          },
          {
            title: "三、信公小安服务使用规则",
            cclist: [
              {cc: "1、用户完全了解并同意：用户对以其帐号注册、登陆、使用信公小安服务的全部行为，包括其提供给信公小安的全部用户信息、以其信公小安服务账号进行的所有行为和事件独立承担完全的法律责任。"},
              {cc: "2、用户同意在使用信公小安服务过程中，严格遵守以下规则："},
              {cc: "（1）遵守中国法律、法规、行政规章及规范性文件；"},
              {cc: "（2）遵守信公小安所有与信公小安服务有关的协议、规定、程序、通知、使用守则等全部文件；"},
              {cc: "（3）不得为任何违法、犯罪目的而使用信公小安服务；"},
              {cc: "（4）不得以任何形式使用信公小安服务侵犯信公小安的合法权利；"},
              {cc: "（5）不得利用信公小安服务进行任何可能对互联网正常运转造成不利影响的行为"},
              {cc: "（2）遵守信公小安所有与信公小安服务有关的协议、规定、程序、通知、使用守则等全部文件；"},
              {cc: "（6）不得利用信公小安提供的服务上传、展示或传播任何虚假的、骚扰性的、中伤他人的、种族歧视性的、辱骂性的、恐吓性的、情色的或其他任何非法的信息资料；"},
              {cc: "（7）不得以任何方式侵犯其他任何人依法享有的专利权、著作权、商标权、商业秘密等知识产权，第三人的名誉权或其他任何第三方的合法权益。"},
              {cc: "（8）保证在信公小安服务上展示的相关信息内容，包括但是不限于在前条“二、用户信息条款”中的内容，没有违反相关法律规定，没有侵犯第三方的合法权利。"},
              {cc: "3、信公小安有权对用户使用信公小安服务的情况进行审查和监督，如用户在使用信公小安服务时违反任何上述约定，信公小安有权要求用户改正或直接单方面采取一切必要措施，以消除或减轻用户不当行为给信公小安、第三方、互联网服务或社会公共利益造成的任何影响。信公小安在进行前述操作前，操作过程中或操作完成后不对用户进行任何方式的通知。"},
              {cc: "4、用户在使用信公小安各项服务的同时，同意接受信公小安发布、推送、提供的各类信息。"},
              {cc: "5、用户同意，信公小安有权随时变更、中止或终止部分或全部的信公小安服务，信公小安无需就此通知用户，且信公小安不因此对用户或任何第三方承担任何责任。"},
            ]

          },
          {
            title: "四、信息披露的免责条款",
            cclist: [
              {cc: "信公小安将按照法律法规的规定及行业规范使用用户信息，不向任何无关的第三方披露用户个人信息中能够对用户个人进行身份辨识的用户个人信息或用户个人通讯信息，但有下列情形之一的除外："},
              {cc: "1、事先获得了用户的明确授权；"},
              {cc: "2、为了维护公众以及信公小安的合法利益；"},
              {cc: "3、信公小安可能会与第三方合作向用户提供相关的网络服务，在此情形下，如果第三方同意承担与本协议约定的用户隐私保护条款同等的责任，则信公小安有权将用户信息提供给该等第三方，无需获得用户的另行同意；"},
              {cc: "4、按照有关的法律法规要求；"},
              {cc: "5、按照相关政府主管部门、司法机关的要求。"},
              {cc: "用户完全了解并同意，发生上述任何一种或多种情形时，信公小安对向任何第三方披露用户信息的行为不承担任何责任。"}
            ]

          },
          {
            title: "五、知识产权",
            cclist: [
              {cc: "1、“知识产权”是指与信公小安服务相关的各种类的过去有效的、现行有效的、或即将产生的知识产权，包括但不限于发明专利、商标、著作权、实用新型、外观设计、布图设计、商业秘密、其他知识产权以及相关申请的权利。"},
              {cc: "2、信公小安为与信公小安服务相关的全部知识产权的权利人，对信公小安服务提供过程中包含的全部知识产权，包括但不限于任何文本、图片、图形、音频和/或视频资料享有及保留完整、独立的全部权利。"},
              {cc: "对于信公小安享有版权的内容，未经信公小安同意，用户不得在任何媒体直接或间接发布、播放、出于播放或发布目的而改写或再发行信公小安享有知识产权的或者信公小安服务提供任何资料和信息，也不得将前述资料和信息用于任何商业目的；未经信公小安书面同意与许可，任何人不得擅自（包括但不限于：以非法的方式复制、传播、展示、镜像、上载、下载）使用，或通过非常规方式（如：恶意抓取、攻击等）影响信公小安的正常服务，任何人不得擅自以软件程序自动获得信公小安数据。否则，信公小安将依法追究法律责任。"},
              {cc: "3、信公小安为了服务及数据的完整性，会通过用户贡献、第三方数据合作的方式提供部分信息，该部分版权为用户、第三方数据上所有，信公小安会进行标注和说明。"},
              {cc: "（1）用户在信公小安上贡献的内容（包括但不仅限于公司、评论、人物信息、图片等），著作权归用户本人所有。用户可以授权信公小安使用，也可以授权第三方使用。"},
              {cc: "（2）信公小安引用的第三方数据（包括但不限于新闻、知识产权、工商数据等），著作权归第三方所有。用户若需要使用，需要和第三方联系并得到授权。"},
              {cc: "（3）对于用户贡献、第三方数据提供的信息，信公小安无法确认信息的真实性、可靠性、产权所有权等属性，您需要对使用该信息的结果承担可能的风险或损失，信公小安不承诺承担连带责任。对于该部分信息，欢迎用户参与和我们一起完善，如果涉及到有真实、可靠、知识产权纠纷的，请与hello@itjuzi.com联系，我们会第一时间做信息的下线与删除处理。"},
              {cc: "4、对于用户本人创作并上传到信公小安网站或平台的任何文本、图片、图形、音频和或视频等，信公小安保留对其内容进行实时监控的权利，并有权依信公小安独立判断对任何违反本协议约定或涉嫌违法、违规的内容实施删除。信公小安对于删除用户作品引起的任何后果或导致用户的任何损失不负任何责任。"},
              {cc: "5、本条款非经信公小安书面同意将持续有效，不因用户关闭信公小安服务账户或者停止使用信公小安服务而失效。"}
            ]

          },
          {
            title: "六、其他免责声明",
            cclist: [
              {cc: "1、信息依现状提供。信公小安提供的全部服务信息仅依照该等信息提供时的现状提供并仅供用户参考，信公小安不对信前述信息的准确性、完整性、适用性等做任何承诺和保证。用户应对信公小安提供的信息自行判断，并承担因使用前述信息而引起的任何、全部风险，包括因其对信息的正确性、完整性或实用性的任何依赖或信任而导致的风险。信公小安无需对因用户使用信息的任何行为导致的任何损失承担责任。"},
              {cc: "2、对于因不可抗力或信公小安不能预料、或不能控制的原因（包括但不限于计算机病毒或黑客攻击、系统不稳定、用户不当使用账户、以及其他任何技术、互联网络、通信线路原因等）造成的包括但不限于用户计算机信息和数据的安全，用户个人信息的安全等给用户或任何第三方造成的任何损失等，信公小安不承担任何责任。"},
              {cc: "3、由于用户以违法、违规或违反本协议约定等任何方式使用信公小安服务的行为，包括但不限于登录网站内容违法、不真实、不正当，侵犯第三方任何合法权益等，给信公小安或其他第三人造成的任何损失，用户同意承担由此造成的全部损害赔偿责任。"},
              {cc: "4、用户完全了解并同意，在使用信公小安服务的过程中，可能存在来自任何其他第三方的包括威胁性的、诽谤性的、令人反感的或非法的内容或行为，也可能存在对他人权利（包括知识产权）造成侵犯的匿名、冒名、或伪造的各种信息或行为，用户须自行判断相关内容、信息、行为的安全性等风险，并自行独立承担上述风险给信公小安或第三方造成的任何责任。"},
              {cc: "5、信公小安及其合作方对信公小安服务的任何及全部内容不作任何形式的承诺或保证，不论是明确的或暗示的。前述承诺或保证包括但不限于：信公小安服务真实性、适销性、对特定用途的适用性、任何形式的所有权保证，非侵权保证等。信公小安对因前述未做承诺或保证的内容导致的任何直接、间接、偶然、特殊及后续的损害，不承担任何责任。"}
            ]
          },
          {
            title: "七、适用法律和争议解决",
            cclist: [
              {cc: "1、本协议的成立、生效、履行、解释及因本协议产生的任何争议，均适用中华人民共和国法律（不包括港澳台地区法律）。"},
              {cc: "2、用户和信公小安之间与本协议有关的任何争议，首先应友好协商解决，在争议发生之日起三十日内仍不能通过协商达成一致的，用户在此完全、不可撤销地同意将前述争议提交北京岁月桔子科技有限公司住所地的人民法院进行诉讼。"}
            ]
          },
          {
            title: "八、其他规定",
            cclist: [
              {cc: "1、如本协议中的任何条款因任何原因完全或部分无效或不具有执行力，均不影响本协议其他条款的效力。"},
              {cc: "2、本协议及本协议任何条款内容的最终解释权及修改权归信公小安所有。若您对信公小安及本服务有任何意见，欢迎垂询信公小安。"},
              {cc: "邮件联系：service@infaith.com.cn "},
              {cc: "服务网站：http://www.in-hope.cn"}
            ]
          }
        ],
        shadowx: false,
        shadowBox: false,
        passBox: {
          passErr: {
            show: false,
            text: '请输入6-20位密码！',
            borColor: false
          },
          apassErr: {
            show: false,
            text: '两次输入不一致！',
            borColor: false
          },
          regErr: {
            show: false,
            text: '验证码输入有误！',
            borColor: false
          }
        }
      }
    },
    watch: {
      'password': function (val) {
        this.password = this.$array.trim(val);
      },
      'apassword': function (val) {
        this.apassword = this.$array.trim(val);
        if (this.apassword == this.password) {
          this.apassvalid = true;
        }
      },
      'reg': function (val) {
        this.reg = this.$array.trim(val);
      },
      'apassvalid': function () {
        console.log('apassvalid', this.apassvalid);
      }
    },
    created: function () {
      let mobile = this.$route.query.mobile;
      console.log(mobile);
      this.phoneNumber = mobile;
    },
    mounted() {
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/my'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    methods: {
      // 密码 focus
      focusPsd() {
        this.passBox.passErr.borColor = true;
        this.passvalid = false;
        this.passBox.passErr.show = false;
      },
      // 密码 blur
      blurPsd() {
        this.passBox.passErr.borColor = false;
        if (this.password.length == 0) {
          this.passBox.passErr.show = true;
          this.passBox.passErr.text = '请输入6-20位密码！';
        } else if (this.password.length !== 0) {
          this.passBox.passErr.text = '请输入6-20位密码！';
          let regExp = /^([a-z0-9\，\。\,\.\@\!\#\$\%\^\&\-\_\=\+\<\>\/\*\(\)]){6,20}$/i;
          this.passvalid = regExp.test(this.password);
          console.log("regshow--" + this.passvalid, this.password)
          if (this.passvalid == true) {
            this.passBox.passErr.show = false;
          } else if (this.password.length == 0) {
            this.passvalid = false;
            this.passBox.passErr.show = false;
          } else {
            this.passBox.passErr.show = true;
          }
          console.log('passvalid:' + this.passvalid)
          let _this = this;
          if (_this.apassword !== this.password && _this.apassword.length !== 0) {
            _this.apassvalid = false;
            console.log('apassvalid:' + _this.apassvalid)
          } else if (_this.apassword.length == 0) {
            _this.apassvalid = false;
            this.passBox.apassErr.show = false;
          } else {
            _this.apassvalid = true;
            console.log('apassvalid:' + _this.apassvalid);
            this.passBox.apassErr.show = false;
            this.passBox.apassErr.text = '两次输入不一致！';
          }
        }
      },
      // 确认密码 focus
      focusAPsd() {
        this.passBox.apassErr.borColor = true;
        this.apassvalid = false;
        this.passBox.apassErr.show = false;
      },
      // 确认密码 blur
      blurAPsd() {
        this.passBox.apassErr.borColor = false;
        if (this.apassword.length == 0) {
          this.passBox.apassErr.show = true;
          this.passBox.apassErr.text = '请再次输入密码！';
        } else if (this.apassword.length !== 0) {
          this.passBox.apassErr.text = '两次输入不一致！';
          let _this = this;
          if (_this.apassword !== this.password && _this.apassword.length !== 0) {
            _this.apassvalid = false;
            console.log('apassvalid:' + _this.apassvalid)
            this.passBox.apassErr.show = true;
          } else if (_this.apassword.length == 0) {
            _this.apassvalid = false;
            this.passBox.apassErr.show = false;
          } else {
            _this.apassvalid = true;
            console.log('apassvalid:' + _this.apassvalid)
            this.passBox.apassErr.show = false;
          }
        }
      },
      // 验证码 focus
      focusReg() {
        this.passBox.regErr.borColor = true;
        // this.apassvalid = false;
        this.passBox.regErr.show = false;
      },
      // 验证码 blur
      blurReg() {
        this.passBox.regErr.borColor = false;
        if (this.reg.length == 4) {
          this.regvalid = true;
          this.passBox.regErr.show = false;
        } else if (this.reg.length < 4 || this.reg.length == 0 || this.reg.length > 4) {
          this.regvalid = false;
          this.passBox.regErr.show = true;
          if (this.reg.length == 0) {
            this.passBox.regErr.show = true;
            this.passBox.regErr.text = '请输入验证码！';
          } else {
            this.passBox.regErr.text = '验证码输入有误！';
          }
        }
        console.log('apassvalid:', this.apassvalid);
      },
      // 验证码 input
      yzInput() {
        if (this.reg.length > 0) {
          this.regvalid = true;
          this.passBox.regErr.show = false;
        } else if (this.reg.length < 4 || this.reg.length == 0 || this.reg.length > 4) {
          this.regvalid = false;
          this.passBox.regErr.show = true;
          if (this.reg.length == 0) {
            this.passBox.regErr.show = true;
            this.passBox.regErr.text = '请输入验证码！';
          } else {
            this.passBox.regErr.text = '验证码输入有误！';
          }
        }
      },
      // 获取短信验证码
      sendSmsCode() {
        let _this = this;
        this.shadowx = true;
        let params = {
          mobile: this.phoneNumber,
            type: 'register'
        }
       this.$axios.user.sendSmsCode('GET',params).then(res => {
          //成功后，倒计时60秒
          let countDown = 60;
          if (res.data.returnCode == -1) {
            this.passBox.regErr.show = true;
            this.passBox.regErr.text = res.data.returnMsg;
          } else if (res.data.returnCode == 1) {
            for (let i = 0; i <= 60; i++) {
              window.setTimeout(function () {
                if (countDown != 0) {
                  _this.shadowx = true;
                  _this.getNumber = countDown + "s";
                  countDown--;
                } else {
                  countDown = 60;//如果倒计时结束就让  获取验证码显示出来
                  _this.getNumber = "重新获取"
                  _this.shadowx = false;
                }
              }, i * 1000)
            }
            this.passBox.regErr.show = false;
          }
          console.log(res)
        }).catch((err) => {
          console.log(err)
        })
      },
      //
      close() {
        this.shadowBox = false;
      },
      //
      show() {
        this.shadowBox = true;
      },
      // submit 下一步
      next() {
        let password;
        if (this.password == this.apassword) {
          password = this.apassword;
        }
        if (this.passvalid == true && this.apassvalid == true && this.checked == false && this.regvalid == true) {
          this.$vux.toast.show({text: '请阅读并勾选《小安用户协议》！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
        if (this.password == '' || this.apassword == '' || this.reg == '') {
          this.$vux.toast.show({text: '请完善未填信息！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
        //this.yzInput(); 备用
        console.log("passvalid", this.passvalid, "appa", this.apassvalid, "checked", this.checked, "regvalid", this.regvalid)
        if (this.passvalid == true && this.apassvalid == true && this.checked == true && this.regvalid == true) {
          this.mobileRegister();
        } else {
          // this.regvalid = false; 备用
        }
      },
      //
      mobileRegister() {
        let params = {
            mobile: this.phoneNumber,
            password: this.password,
            code: this.reg,
            isNeedForRoadShow: this.checkedRoad // 增加参数
          }
        this.$axios.user.mobileRegister(params).then(res => {
          console.log('mobileRegister', res);
          if (res.data.returnCode == 1) {
            this.regvalid = true;
            let data = res.data.returnObject;
            this.$cookie.setAuth(data);
            // window.localStorage.setItem("token", res.data.returnObject.token);
            // window.localStorage.setItem("weixinId", res.data.returnObject.weixinId);
            // let wx = window.JSON.stringify(res.data.returnObject);
            // window.localStorage.setItem('wx-my-home', wx);
            this.$MTAmethod.mtaClick('dongminenglicep-2', {regpasswd: true})
            this.$router.push({path: '/manage/reviseInfo', query: {id: 1}});
          } else if (res.data.returnCode == 100) {
            console.info('遇见未知错误');
            this.$vux.toast.show({
              text: res.data.returnMsg + '（' + res.data.returnCode + '）',
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
            setTimeout(() => {
              this.$router.replace({path: '/number'});
            }, 3000);
          } else if (res.data.returnCode == -1) {
            this.regvalid = false;
            this.passBox.regErr.show = true;
            this.passBox.regErr.text = res.data.returnMsg;
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      //
      check() {
        this.checked === true ? this.checked = false : this.checked = true;
        console.log('按钮状态', this.checked);
      },
    }
  }
</script>

<style lang="scss" scoped>
  .personal-info {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #FFFFFF;
    .borderColor {
      border: 1px solid #ffb148 !important;
    }
    form {
      width: 100%;
      height: 100%;
      padding: 15px;
      font-size: 0;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
      .password, .again, .regsitor {
        width: 100%;
        height: auto;
        font-size: 0;
        background: #f0f1f5;
        border: 1px solid #f0f1f5;
        border-radius: 2px;
        margin-bottom: 7.5px;
        display: inline-block;
        position: relative;
        span {
          width: 22%;
          height: 40px;
          font-size: 15px;
          color: #323232;
          padding-left: 7.5px;
          display: inline-block;
          line-height: 40px;
          box-sizing: border-box;
        }
      }
      .regsitor {
        margin-bottom: 10px;
        input {
          width: 43%;
          height: 38px;
          background: #f0f1f5;
          font-size: 15px;
          color: #8d8d8d;
          line-height: 20px;
          margin: 0;
          padding: 0;
          border: 0;
          outline: none;
          margin-right: 5%;
        }
      }
      .password input, .again input {
        width: 78%;
        height: 38px;
        background: #f0f1f5;
        font-size: 15px;
        color: #8d8d8d;
        line-height: 20px;
        margin: 0;
        padding: 0;
        border: 0;
        outline: none;
      }
      /*.password span, .again span, .regsitor span {*/
      /*width: 22%;*/
      /*height: 40px;*/
      /*font-size: 15px;*/
      /*color: #323232;*/
      /*padding-left: 7.5px;*/
      /*display: inline-block;*/
      /*line-height: 40px;*/
      /*box-sizing: border-box;*/
      /*}*/
    }
    .passErr, .apassErr, .regErr {
      margin: 0 0 5px 0;
      color: #fb4319;
      font-size: 13px;
    }
    .bbb {
      font-size: 15px;
      color: #aeaeae;
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }
    b {
      width: 15px;
      height: 15px;
      color: #fff;
      position: absolute;
      right: 10px;
      top: 0;
      bottom: 0;
      margin: auto;
      border-radius: 50%;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/close.png");
      background-size: contain;
    }
    .lawbox {
      width: 100%;
      display: table;
      font-size: 0;
      box-sizing: border-box;
      position: relative;
      margin-top: 3px;
      &.road {
        margin-top: 9px;
        .checked {
          padding-top: 2.5px;
          vertical-align: top;
        }
      }
      .checked {
        display: table-cell;
        vertical-align: middle;
        width: 20px;
        .checkbox {
          width: 14px;
          height: 14px;
          border: 0.5px solid #ffb148;
          background-color: #f0f1f5;
          box-sizing: border-box;
          -moz-box-sizing: border-box; /* Firefox */
          -webkit-box-sizing: border-box; /* Safari */
          border-radius: 2px;
          display: inline-block;
        }
      }
      .agree {
        font-size: 13px;
        color: #8d8d8d;
        display: table-cell;
        vertical-align: middle;
      }
    }
    .next {
      width: 100%;
      height: 50px;
      background-color: #ffd59c;
      text-align: center;
      line-height: 50px;
      border: 0;
      margin: 0;
      color: #fff;
      font-size: 18px;
      border-radius: 2px;
      font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
      margin-top: 13px;
      outline: none;
      -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    .next:active {
      background-color: rgba(255, 177, 72, 0.6);
      -webkit-transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
      transition: background-color 0.07s cubic-bezier(0.645, 0.045, 0.355, 1);
    }
    .regnum {
      width: 30%;
      border-left: 1px solid #ffb249;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
      text-align: center;
      display: inline-block;
      font-size: 15px;
      color: #ffb249;
    }
    .shadowx {
      width: 34%;
      height: 80%;
      background: rgba(0, 0, 0, 0);
      position: absolute;
      right: 0;
      top: 0;
      bottom: 0;
      margin: auto;
    }
    input[type=checkbox] {
      width: 15px;
      height: 15px;
      border: 0.5px solid #8d8d8d;
      background-color: #f0f1f5;
    }
    .law {
      color: #ffc684;
      font-size: 13px;
    }
    .law span {
      text-decoration: underline;
    }
    .shadow {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .2);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
    }
    .lawboxup {
      width: 335px;
      height: 495px;
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      z-index: 120;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
    }
    .ccbox {
      width: 100%;
      height: 405px;
      overflow: auto;
      padding-bottom: 15px;
      box-sizing: border-box;
      -webkit-overflow-scrolling: touch;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
    }
    .content {
      width: 100%;
      height: 445px;
      background: #fff;
      border-radius: 2px;
      overflow: hidden;
    }
    .paddingbox {
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      -moz-box-sizing: border-box; /* Firefox */
      -webkit-box-sizing: border-box; /* Safari */
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
    }
    .lawheader {
      width: 100%;
      height: 40px;
      background: #ffefda;
      color: #ffb148;
      font-family: PingFangSC-Medium, sans-serif;
      font-size: 15px;
      text-align: center;
      line-height: 40px;
      border-bottom: 0.05px solid #e3e3e3;
    }
    .title {
      margin: 15px 10px;
      font-size: 14px;
      color: #ffb148;
    }
    .lawcc {
      margin: 0 10px 15px;
      color: #323232;
      font-size: 14px;
      text-align: justify;
    }
    .close {
      width: 37px;
      height: 37px;
      border-radius: 50%;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/close2.png");
      background-size: cover;
    }
    .pass {
      background: #ffb148;
    }
  }
</style>
