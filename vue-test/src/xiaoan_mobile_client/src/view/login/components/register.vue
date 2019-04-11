<template>
  <div id="register">
    <div class="phoneNumber">
      <div class="information vux-1px-b">
        <input @focus="resetPhone" @blur="blurPhone" @input="checkPhone" maxlength="11" type="text" v-model="phoneNumber" placeholder="手机号">
        <b @click="phoneNumber=''" v-show="phoneNumber.length>0 && phoneInfo" class="wrong"></b>
      </div>
    </div>
    <div class="phoneNumber">
      <p class="logon-right">
        <span v-show="alreadyRegister">该手机号已注册,请登录</span>
        <span v-show="phoneNumberErr">手机号输入错误</span>
        <span v-show="noPhoneNumber">请输入手机号</span>
      </p>
      <div v-show="!alreadyRegister">
        <div class="information vux-1px-b">
          <input class="password" @focus="resetPassword" @blur="blurPassword" @input="password = password.trim();" type="password" v-model="password" placeholder="设置登录密码(6-20位密码)" maxlength="20">
          <b @click="closeEye" v-show="eyeState" class="closeEye"></b>
          <b @click="openEye" v-show="!eyeState" class="openEye"></b>
        </div>
      </div>
      <div v-show="alreadyRegister">
        <div class="gray-div">
          <div class="grayDiv">设置登录密码(6-20位密码)</div>
          <b class="closeEye"></b>
        </div>
        <div class="grayCode">
          <p class="logon-right"></p>
          <div>验证码</div>
          <span>获取验证码</span>
        </div>
      </div>
    </div>
    <div v-show="!alreadyRegister">
      <div class="phoneNumber">
        <p class="logon-right">
          <span v-show="passwordLength">请输入6-20位密码</span>
        </p>
        <div class="verCode vux-1px-b">
          <input @focus="resetVeri" @blur="blurVeri" @input="verificationCode = verificationCode.trim();" class="verificationCode" type="text" v-model="verificationCode" placeholder="验证码" maxlength="4">
          <b @click="verificationCode=''" v-show="verificationCode.length>0 && removeState" style="right:28%" class="wrong"></b>
          <span v-if="countDownTime" @click="getVerificationCode">获取验证码</span>
          <span style="color: rgba(141,141,141,1); text-align:center" v-else>{{countDown}}&nbsp;S</span>
        </div>
      </div>
    </div>
    <p class="logon-right">
      <span v-show="verificationCodeErr">验证码输入错误</span>
      <span v-show="noVerificationCode">请输入验证码</span>
    </p>
    <div v-show="!alreadyRegister">
      <div class="lawbox">
        <div class="checked">
          <div class="checkbox" @click="checked = !checked">
            <img :src="chengseduigou" v-show="checked" style="width: 100%;height: 100%">
          </div>
        </div>
        <div class="agree">
          <span @click="checked = !checked">我已阅读并同意</span>
          <span class="law" @click="showInfo()"><span>《小安用户注册协议》</span></span>
        </div>
      </div>
    </div>
    <div v-show="alreadyRegister">
      <div class="lawbox">
        <div class="checked">
          <div class="checkbox">
          </div>
        </div>
        <div class="agree">
          <span class="graySpan">我已阅读并同意</span>
          <span class="graySpan">《小安用户注册协议》</span>
        </div>
      </div>
    </div>
    <button v-if="!alreadyRegister" type="button" @click="registerGo">注册</button>
    <button v-else type="button" @click="loginGo">去登录</button>
    <p @click="loginGo" class="newUser">登录 ></p>
    <div v-transfer-dom>
      <x-dialog v-model="shadowBox" class="dialog-demo">
        <div class="lawboxup">
          <div class="content">
            <div class="lawheader">信公小安用户协议</div>
            <div class="ccbox">
              <div class="paddingbox">
                <div class="lawcontent" v-for="(item, index) in content" :key="index">
                  <p class="title">{{ item.title }}</p>
                  <p class="lawcc" v-for="(items, i) in item.cclist" :key="i">{{ items.cc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="close" @click="closeInfo()"></div>
      </x-dialog>
    </div>

    <div v-transfer-dom>
      <confirm v-model="deleteInfo" :close-on-confirm="false" :title="''" @on-confirm="confirmClick">
        <div class="regnum">
          <div class="regbox">
            <input ref="regDom" @focus="resetRegnumber" @blur="blurRegnumber" @input="regnumber = regnumber.trim();" type="text" v-model="regnumber" placeholder="验证码" maxlength="4">
            <img v-lazy="ImageCode" alt="验证码" @click="changeReg" id="changeRegimg">
            <b @click="regnumber=''" v-show="regnumber.length>0 && regnumberInfo" style="right:33%" class="wrong"></b>
          </div>
          <p class="logon-right">
            <span v-show="regError">{{errorText}}</span>
          </p>
        </div>
      </confirm>
    </div>
    <div v-transfer-dom>
      <confirm class="pauseInfoDialog" v-model="show6" :show-cancel-button="false" @on-confirm="onConfirm">
        <p class="pauseInfo">尊敬的用户，抱歉，由于连续多次获取验证码，您的账户暂被停用，请于1小时后再试。</p>
      </confirm>
    </div>
  </div>
</template>
<script>
  import {
    Confirm,
    XDialog
  } from 'vux'
  import { setTimeout } from 'timers';
  export default {
    name: "register",
    components: {
      Confirm,
      XDialog
    },
    data() {
      return {
        regnumberInfo: false,
        phoneInfo: false,
        removeState: false,
        codeTime: 0,
        regnumber: "",
        show6: false,
        errorText: "",
        verificationTime: 0,
        noVerificationCode: false,
        verificationCodeErr: false,
        passwordLength: false,
        phoneNumberErr: false,
        noRegister: false,
        noPhoneNumber: false,
        alreadyRegister: false,
        shadowBox: false,
        chengseduigou: this.$image.personal.chengseduigou,
        checked: false,
        deleteInfo: false,
        countDownTime: true,
        timer: 60,
        countDown: 60,
        verificationCode: "",
        errorPrompt: false,
        eyeState: true,
        phoneNumber: "",
        oldPassword: "",
        password: "",
        reg: "",
        ImageCode: "",
        regError: false,
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
        ]
      }
    },
    created() {
      this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
    },
    mounted() {
      var adverttitle = '个人中心';
      var sharelink2 = this.$api.CURRENTIP.IP + '#/home'; // 分享链接
      var shareDesc = "";// 描述
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    destroyed () {
    },
    methods: {
      changeReg() {
        this.ImageCode = this.$api.user.getImageCode + '/?' + new Date().getTime();
        $("#changeRegimg").attr({src: this.ImageCode, alt: "验证码"});
      },
      onConfirm () {
        this.show6 = false;
      },
      blurRegnumber () {
        this.regnumberInfo = false;
        if (this.regnumber.length == 0) {
          this.regError = true;
          this.errorText = '请输入验证码';
        } else if (this.regnumber.length > 0 && this.regnumber.length < 4) {
          this.regError = true;
          this.errorText = '验证码输入错误';
        }
      },
      resetRegnumber () {
        this.regnumberInfo = true;
        this.regError = false;
        this.errorText = '';
      },
      // 弹框
      confirmClick() {
        if (this.regnumber.length == 0) {
          this.errorText = '请输入验证码';
          this.regError = true;
        } else if (this.regnumber.length > 0 && this.regnumber.length < 4) {
          this.regError = true;
          this.errorText = '验证码输入错误';
        } else {
          this.apiImgCodeCheck();
        }
      },
      // 验证码 验证方法
      apiImgCodeCheck() {
        let params = {code: this.regnumber}
        this.$axios.user.imgCodeCheck(params).then(res => {
          if (res.data.returnCode == -1) {
            this.errorText = '验证码输入错误';
            this.regnumber = '';
            this.changeReg();
            this.regError = true;
            this.codeTime ++;
            if (this.codeTime >= 5) {
              this.regError = false;
              this.errorText = '';
              this.deleteInfo = false;
              this.codeTime = 0;
              this.$vux.toast.show({
                text: '验证码连续输入错误,请重新获取',
                position: 'middle',
                type: 'text',
                width: 'auto',
                time: 2500
              });
            }
          } else if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.regError = false;
            this.errorText = '';
            this.regnumber = '';
            this.deleteInfo = false;
            this.getNum();
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      getVerificationCode () {
        if (this.phoneNumber.length == 0) {
          this.noPhoneNumber = true;
        } else {
          if (this.noRegister && !this.phoneNumberErr) {
            if (this.verificationTime == 0) {
              this.getNum();
            } else {
              this.errorText = '';
              this.regError = false;
              this.deleteInfo = true;
              this.changeReg();
              this.regnumber = '';
            }
          }
        }
      },
      getNum() {
        let params = {
           mobile: this.phoneNumber,
           type: 'register'
        }
        this.$axios.user.sendSmsCode('GET',params).then(res => {
          if (res.data.returnCode == -1) {
            this.show6 = true;
            // this.$vux.toast.show({
            //   text: res.data.returnMsg + '(' + res.data.returnCode + ')',
            //   position: 'middle',
            //   type: 'text',
            //   width: 'auto',
            //   time: 2500
            // });
          } else if (res.data.returnCode == 1) {
            this.verificationTime ++;
            this.timeDown();
          }
          console.log(res)
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      resetVeri () {
        this.removeState = true;
        this.verificationCodeErr = false;
        this.noVerificationCode = false;
      },
      blurVeri () {
        this.removeState = false;
        if (this.verificationCode.length == 0) {
          this.verificationCodeErr = false;
          this.noVerificationCode = true;
        }
        if (this.verificationCode.length > 0 && this.verificationCode.length < 4) {
          this.verificationCodeErr = true;
          this.noVerificationCode = false;
        }
      },
      resetPassword () {
        this.passwordLength = false;
      },
      blurPassword () {
        if (this.password.length < 6) {
          this.passwordLength = true;
        }
      },
      // 注册
      mobileRegister() {
        let params = {
            mobile: this.phoneNumber,
            password: this.password,
            code: this.verificationCode,
            isNeedForRoadShow: false, // 增加参数
            token: '' // 增加参数
          }
        this.$axios.user.mobileRegister(params).then(res => {
          console.log('mobileRegister', res);
          if (res.data.returnCode == 1) {
            // this.regvalid = true;
            let data = res.data.returnObject;
            window.sessionStorage.setItem('registerInfo', JSON.stringify(data));
            // this.$cookie.setAuth(data);
            // window.localStorage.setItem("token", res.data.returnObject.token);
            // window.localStorage.setItem("weixinId", res.data.returnObject.weixinId);
            // let wx = window.JSON.stringify(res.data.returnObject);
            // window.localStorage.setItem('wx-my-home', wx);
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
            this.verificationCodeErr = true;
          }
        }).catch((err) => {
          console.log(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      resetPhone() {
        this.phoneInfo = true;
        this.alreadyRegister = false;
        this.phoneNumberErr = false;
        this.noPhoneNumber = false;
      },
      blurPhone () {
        this.phoneInfo = false;
        if (this.phoneNumber.length == 0) {
          this.noPhoneNumber = true;
        } else {
          this.phoneNumberErr = !this.isPoneAvailable(this.phoneNumber);
          if (this.phoneNumber.length == 11) {
            this.checkMobileExist();
          }
        }
      },
      loginGo () {
        this.$router.push({path: '/login'})
      },
      closeEye () {
        $(".password").attr('type','text');
        this.eyeState = false;
      },
      openEye () {
        $(".password").attr('type','password');
        this.eyeState = true;
      },
      // 倒计时
      timeDown () {
        this.countDownTime = false;
        this.setTimeDown = setInterval(() => {
          if (this.timer > 0) {
            this.timer--;
            this.countDown = this.timer
            if (this.timer < 10) {
              this.countDown = `0${this.timer}`;
            }
          } else {
            clearInterval(this.setTimeDown)
            this.countDownTime = true;
            this.timer = this.countDown = 60;

            // this.$router.push({path: '/rule', query: {from: 'apply'}})
          }
        }, 1000)
      },
       showInfo() {
        this.shadowBox = true;
      },
      closeInfo() {
        this.shadowBox = false;
      },
      checkPhone () {
        this.noRegister = false;
        this.alreadyRegister = false;
        this.phoneNumber = this.phoneNumber.trim();
        if (this.phoneNumber.length == 11) {
          this.phoneNumberErr = !this.isPoneAvailable(this.phoneNumber)
          if (!this.phoneNumberErr) {
            this.checkMobileExist();
          }
        } else if (this.phoneNumber.length > 11) {
          this.phoneNumberErr = true;
        } else {
          this.phoneNumberErr = false;
        }
      },
      isPoneAvailable(str) {
        if (str != '') {
          let myreg=/^[1][0-9]{10}$/;
          if (!myreg.test(str)) {
              return false;
          } else {
              return true;
          }
        } else {
          return true;
        }
      },
      checkMobileExist () {
        let params = {
          mobile: this.phoneNumber,
        }
        this.$axios.user.checkMobileExist(params).then(res => {
          if (res.data.returnCode == -1) {
            this.alreadyRegister = true
            console.log("已注册");
            // this.$router.replace({path: '/login', query: {mobile: this.phoneNumber}});
          } else if (res.data.returnCode == 1) {
            this.noRegister = true;
            console.log("未注册");
          }
        }).catch((err) => {
          console.error(err);
        });
      },
      registerGo () {
        if (!this.checked) {
          this.$vux.toast.show({text: '请阅读并勾选《小安用户协议》！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
        if (this.phoneNumber.length == 0) {
          this.noPhoneNumber = true;
        }
        if (this.password.length == 0) {
          this.passwordLength = true;
        }
        if (this.verificationCode.length == 0) {
          this.noVerificationCode = true;
        }
        if (this.phoneNumber.length == 11 && this.noRegister && !this.passwordLength && this.verificationCode.length == 4 && this.checked) {
          // this.mobileLogin();
          console.log(this.phoneNumber+"a"+this.password+"b"+this.verificationCode);
          this.mobileRegister();
        }
      }
    }
  }
</script>
<style lang="scss">
  .pauseInfoDialog {
    .weui-dialog__bd:first-child {
      padding: 26px 12px;
    }
  }
  .lawboxup {
      height: 430px;
      margin: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      .content {
        width: 100%;
        height: 445px;
        background: #fff;
        border-radius: 2px;
        overflow: hidden;
      }
      .lawheader {
        width: 100%;
        height: 40px;
        background: #ffefda;
        color: #ffb148;
        font-size: 15px;
        text-align: center;
        line-height: 40px;
        border-bottom: 0.05px solid #e3e3e3;
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
      .paddingbox {
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        -moz-box-sizing: border-box; /* Firefox */
        -webkit-box-sizing: border-box; /* Safari */
        overflow: scroll;
        -webkit-overflow-scrolling: touch;
      }
      .lawcc {
        margin: 0 10px 15px;
        color: #323232;
        font-size: 14px;
        text-align: justify;
      }
      .title {
        margin: 15px 10px;
        font-size: 14px;
        color: #ffb148;
        text-align: left;
      }
    }
    .close {
      margin: 5px auto;
      width: 37px;
      height: 37px;
      border-radius: 50%;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/close2.png");
      background-size: cover;
      background-color: #c1c1c1;
    }

</style>

<style scoped lang="scss">
  #register {
    width: 100%;
    .logon-left, .logon-right {
      height: 17px;
      font-size:12px;
      font-weight:400;
      color:rgba(251,72,16,1);
      margin-top: 6px;
    }
    .logon-right {
      text-align: right;
    }
    .information {
      width: 100%;
      // border-bottom: 1px solid #E3E3E3;
    }
    .grayDiv {
      width: 100%;
      height: 42px;
      border: none;
      font-size: 15px;
      font-weight:400;
      line-height: 42px;
      // vertical-align: middle;
      border-bottom: 1px solid #E3E3E3;
      color: rgba(174,174,174,1);
    }
    .gray-div {
      .closeEye {
        top: 0;
        bottom: 51px;
      }
    }
    .grayCode {
      position: relative;
      font-size: 15px;
      font-weight: 400;
      color: rgba(174,174,174,1);
      border-bottom: 1px solid #E3E3E3;
      div {
        display: inline-block;
        width: 73%;
        height: 42px;
        line-height: 42px;
        border: none;
        font-weight: 400;
      }
      span {
        display: inline-block;
        height: 15px;
        border-left: 1px solid #E3E3E3;
        width: 25%;
        padding-left: 7px;
        // line-height: 42px;
        text-align: right;
        line-height: 15px;
        margin-bottom: 13px;
      }
    }
    .phoneNumber {
      height: auto;
      position: relative;
      .wrong {
        bottom: 15px;
      }
      .verCode {
        width: 100%;
        position: relative;
        // border-bottom: 1px solid #E3E3E3;
        input {
          width: 73%;
          border: none;
          font-weight: 500;
        }
        span {
          display: inline-block;
          height: 15px;
          border-left: 1px solid #E3E3E3;
          width: 25%;
          padding-left: 7px;
          line-height: 15px;
          font-size:15px;
          font-weight:400;
          text-align: right;
          color:rgba(50,50,50,1);
          margin-bottom: 13px;
        }
      }
    }
    .prompt {
      margin: 13px 0 34px 0;
      font-size: 13px;
      font-weight:400;
      color:rgba(50,50,50,1);
      line-height:18px;
    }
    input {
      width: 100%;
      height: 42px;
      font-size: 15px;
      font-weight: 500;
      vertical-align: bottom;
      color:#323232;
      border: none;
    }
    button {
      display: block;
      width: 100%;
      height: 50px;
      text-align: center;
      border-radius: 2px;
      border: 0;
      background: #ffb148;
      color: #FFFFFF;
      font-size: 18px;
      border-radius: 2px;
    }
    .newUser {
      font-size:13px;
      font-weight:400;
      color:rgba(40,50,65,1);
      margin: 13.5px 0 20px 0;
      text-align: center;
    }
    .regbox {
      width: 100%;
      height: 50px;
      // border-radius: 2px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      position: relative;
      border-bottom: 1px solid #E3E3E3;
      input {
        width: 70%;
        border: none;
        font-weight: 500;
      }
      img {
        width: 30%;
        border-radius:2px;
        height: 35px;
        border: 1px solid #E3E3E3;
        margin-bottom: 0px;
      }
      .wrong {
        top: 5px;
      }
    }
    .pauseInfo {
      text-align:justify;
      font-size:14px;
      font-weight:400;
      color:rgba(50,50,50,1);
    }
    .wrong, .closeEye, .openEye{
      width: 20px;
      height: 14px;
      color: #fff;
      position: absolute;
      right: 10px;
      top: 15px;
      bottom: 0;
      margin: auto;
      // border-radius: 50%;
      background-size: contain;
    }
    .wrong {
      width: 16px;
      height: 16px;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/login/wrong.jpg");
    }
    .closeEye {
      top: 5px;
      right: 8px;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/login/closeEye.jpg");
    }
    .openEye {
      top: 5px;
      right: 8px;
      background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/login/openEye.jpg");
    }
    .lawbox {
      width: 100%;
      display: table;
      font-size: 0;
      box-sizing: border-box;
      position: relative;
      margin: 5px 0 11.5px 0;
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
          border: 0.5px solid #E3E3E3;
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
        .law {
          span {
            color: #FFB148;
          }
        }
        .graySpan {
          color: rgba(174,174,174,1);
        }
      }
    }
    //
    .shadow {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .2);
      position: absolute;
      left: 0;
      top: 0;
      z-index: 100;
    }
  }

</style>
