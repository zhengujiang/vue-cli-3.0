<template>
  <div id="headerInvite">
    <img id="imgShow" style="width:100%;" :src="base64Img">
    <canvas id="canvas_box"></canvas>
    <div class="btnBox">
      <el-button type="primary" size="small" @click="saveAs">保存图片</el-button>
      <el-button type="primary" size="small" @click="showShareCode=true">分享到朋友圈</el-button>
    </div>

    <div id="canvasCode" style="display: none">
      <v-qrcode :text="enterpriseApplyUrl"></v-qrcode>
    </div>

    <div id="shareCode" class="shareCodeBox" v-if="showShareCode">
      <div class="shareCode">
        <img class="inviteclose" :src="$image.header.inviteClose" @click="showShareCode=false">
        <v-qrcode :text="shareUrl" :propId="'shareqrCode'" :width="200" :height="200"></v-qrcode>
      </div>
    </div>
  </div>
</template>

<script>
  import qrcode from '@/components/qrcode.vue'
  export default {
    data() {
      return {
        bgimg1: require('../../assets/image/invite/head_invite1.png'),
        bgimg2: require('../../assets/image/invite/head_invite2.png'),
        bgimg3: require('../../assets/image/invite/head_invite3.png'),
        base64Img: '',
        showShareCode: false,
        enterpriseCompanyCode: '',
        enterpriseApplyUrl: '',
        shareUrl: ''
      }
    },
    // 使用其它组件
    components: {
      'v-qrcode': qrcode
    },
    props: {
      num: Number
    },
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
      if (this.num == 1) {
        this.base64Img = this.bgimg1
      } else if (this.num == 2) {
        this.base64Img = this.bgimg2
      } else {
        this.base64Img = this.bgimg3
      }
      this.userId = this.$cookie.get('userId')
      if (this.userId) {
        this.userInfo = JSON.parse(this.$cookie.get('userInfo'))
        if (this.userInfo.enterpriseCompanyCode) {
          this.enterpriseCompanyCode = this.userInfo.enterpriseCompanyCode
          this.enterpriseApplyUrl = this.$api.share.enterpriseApply + this.enterpriseCompanyCode
          this.shareUrl = this.$api.share.cases + '?enterpriseCompanyCode=' + this.enterpriseCompanyCode
        }
      }
    },
    mounted() {
      setTimeout(() => {
        // alert(document.querySelector('#headerInvite #qrcode img').getAttribute('src'))
        this.drawQrcode();
        console.log(document.querySelector('#qrcode img'));
//        document.querySelector('#imgShow').style.width = '200px'
//        document.querySelector('#imgShow').style.height = '300px'
      }, 500)

    },
    // 方法
    methods: {
      getRandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return (Min + Math.round(Rand * Range));
        //    var num = GetRandomNum(1,3);
        //    alert(num);
      },

      // 画布
      saveAs() {
        var filename = '131231.png'
        var a = document.createElement('a');
        a.setAttribute('download', this.enterpriseCompanyCode);
        a.href = this.base64Img;
        a.innerHTML = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.parentNode.removeChild(a);
      },
      drawQrcode() {
        var _that = this;
        var nameText = this.enterpriseCompanyCode
        var textsStyle = {
          textAlign: 'left',
          font: '60px PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica',
          lineWidth: 1.0,
          fillStyle: '#ffb148'
        };
        // 开始构造
        var nWidth = 375, // 屏幕可视区域 宽度
          nHeight = 667, // 屏幕可视区域 高度
          _canvasWidth = 750, // 画布 宽度
          _canvasHeight = 1334; // 画布 高度
        // 开始画图，获取上下文；
        var _canvas = document.getElementById("canvas_box");
        _canvas.width = _canvasWidth;
        _canvas.height = _canvasHeight;
        var _context = _canvas.getContext('2d');
        // 背景
        _context.fillRect(0, 0, nWidth * 2, nHeight * 2);
        // 白色矩形部分
        _context.fill();
        _context.closePath();
        //
        // onload是异步加载，所以要等第一个onload 加载完毕再画第二张图片
        // 代言文字图片
        var _imagetext = new Image();
        // _imagetext.setAttribute('crossorigin', 'anonymous');
        if (this.num == 1) {
          _imagetext.src = this.bgimg1
          // textsStyle.fillStyle = '#3d388f'
          textsStyle.fillStyle = '#ffb148'
        } else if (this.num == 2) {
          _imagetext.src = this.bgimg2
          textsStyle.fillStyle = '#ffb148'
        } else {
          _imagetext.src = this.bgimg3
          textsStyle.fillStyle = '#e56566'
        }
        // 第一次 执行 话 大图
        _imagetext.onload = function () {
          _context.save(); // 保存当前_context的状态
          _context.drawImage(_imagetext, 0, 0);
          _context.stroke();//
          _context.closePath();
          // 保存当前_context的状态
          _context.save();
          var codeImg = new Image();
          codeImg.src = document.querySelector('#qrcode img').getAttribute('src')
          _context.save(); // 保存当前_context的状态
          _context.drawImage(codeImg, 480, 1040, 200, 200);
          _context.stroke();//
          _context.closePath();
          _context.save();

          // 头像下面的文字
          _context.beginPath();
          _context.textAlign = textsStyle.textAlign;
          // 设置字体
          _context.font = textsStyle.font;
          _context.lineWidth = textsStyle.lineWidth; //
          _context.fillStyle = textsStyle.fillStyle; // 字颜色
          _context.fillText(nameText, 280, 765);
          _context.save();
          // canvas 画完图 一定要生成图片流，作为img 的src属性值，同时隐藏canvas，只展示img 就ok了，在手机上试试长按保存功能吧
          console.log(_canvas);
          var _imgSrc = _canvas.toDataURL("image/png", 1);
          _canvas.style.display = "none";
          var imgShow = document.getElementById('imgShow');
          imgShow.setAttribute('src', _imgSrc);
          _that.base64Img = _imgSrc
        }
      }
    }
  }
</script>

<style lang="scss">
  #headerInvite {
    /*width:375px;*/
    /*height: 300px;*/
    .btnBox {
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      .el-button {
        width: 49%;
      }
    }
    #canvas_box {
      zoom: 0.375;
    }
    /*#imgShow{*/
    /*display: none;*/
    /*}*/
    .shareCodeBox {
      position: absolute;
      background-color: rgba(48, 49, 51, .5);
      width: 100%;
      height: 100%;
      padding: 10px;
      /* border: 1px solid #e3e3e3; */
      top: 0;
      left: 0;
      z-index: 2100;
      .shareCode {
        position: absolute;
        background-color: #fff;
        width: 240px;
        height: 240px;
        padding: 20px;
        border: 1px solid #e3e3e3;
        top: 50%;
        left: 50%;
        margin-left: -120px;
        margin-top: -100px;
        .inviteclose {
          width: 20px;
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
        }
      }
    }

  }
</style>
