<template>
  <div id="footer">
    <div class="content clearFix">
      <div class="inhopeInfo">
        <ul class="info">
          <li class="first">关于</li>
          <li v-for="(list,index) in item" class="item">
            <div>
              <a :href="list.url" target="_blank">{{ list.name }}</a>
            </div>
            <!-- <div class="split"></div> -->
          </li>
        </ul>
        <p class="contact info">
          <span class="first">联系我们</span>
          <span class="item"><i class="iconfont web-dianhua"></i> 021-20740322</span>
          <span class="item"><i class="iconfont web-youxiang"></i> xiaoan_help@infaith.com.cn</span>
          <span class="item"><i class="iconfont web-weixin"></i> infaithjinjin</span>
        </p>
        <!-- <p>{{ copyright }}<a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011502008044" class="record"><img class="logo" :src="logo" alt="备案图标" title="备案图标">{{police}}</a>{{company}}</p> -->
      </div>
      <ul class="QRCode">
        <li v-for="list in qrCode">
          <img :src="list.img" :alt="list.title" :title="list.title">
          <span>{{ list.title }}</span>
        </li>
      </ul>
    </div>
    <div class="line"></div>
    <div class="bottom">
      <p>
        <span>{{ copyright }}</span>
        <span>{{company}}</span>
        <span class="num">{{num}}</span>
        <a target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=31011502008044" ><img class="logo" :src="logo" alt="备案图标" title="备案图标">{{police}}</a>
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'footer',
    data () {
      return {
        copyright: '© 2005－2017 in-hope.cn, all rights reserved ',
        company: ' 上海信公印诚信息技术有限公司',
        police: ' 沪公网安备 31011502008044号 ',
        num: '沪ICP备13013005号',
        qrCode: [
          {img: this.$image.footer.in_hopeQRCode, title: '信公小安移动版 '},
          {img: this.$image.footer.infaithQRCode, title: '信公咨询公众号'}
        ],
        logo: this.$image.footer.record,
        item: [
          {name: '关于信公', url: 'http://www.infaith.com.cn/about/'},
          {name: '用户协议', url: '/agreement'},
          {name: '隐私条款', url: '/privacy'}
        ]
      }
    },
    methods: {}
  }
</script>
<style lang="scss" scoped>
  #footer {
    display: table;
    width: 100%;
    min-width: 1200px;
    height: 160px;
    background: #2e2f31;
    position: relative;
    z-index: 1999;
    .line {
      width: 100%;
      height: 1px;
      background: #343537;
    }
    .bottom {
      width: 1230px;
      margin: 0 auto;
      padding: 22px 15px;
      span {
        color: #FFFFFF;
        opacity: 0.6;
        font-size: 14px;
      }
      a {
        color: #FFFFFF;
        opacity: 0.6;
        font-size: 14px;
        margin-left: 60px;
        img {
          vertical-align: middle;
        }
      }
      .num {
        margin-left: 25px;
      }
    }
    .content {
      display: block;
      margin: 30px auto 20px;
      ul {
        li {
          display: inline-block;
          cursor: pointer;
          -moz-user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
        }
      }
      p {
        color: #aeaeae;
        font-size: 16px;
      }
      .inhopeInfo {
        vertical-align: middle;
        float: left;
        ul {
          // padding-bottom: 10px;
          display: inline-block;
          width: 155px;
          li {
            color: #aeaeae;
            font-size: 16px;
            display: block;
            height: 20px;
            margin-top: 8px;
            padding-left: 11px;
            div {
              display: inline-block;
              a {
                font-size: 14px;
                color:rgba(255,255,255,0.6);
              }
            }
            .split {
              width: 1px;
              height: 12px;
              background: #aeaeae;
              margin: 0 30px;
            }
          }
          li:last-child {
            .split {
              display: none;
            }
          }
        }
        .contact {
          // padding: 0 0 10px 0;
          display: inline-block;
          span {
            display: block;
            margin-right: 15px;
            font-size: 14px;
            color: rgba(255,255,255,0.6);
            height: 20px;
            margin-top: 8px;
            padding-left: 11px;
          }
        }
        .info {
          border-left: 1px solid rgba(255,255,255,0.3);
          .first {
            font-size: 14px;
            color: rgba(255,255,255,0.9);
            line-height: 20px;
            margin-top: 0;
            border-left: 2px solid #FFB148;
            padding-left: 10px;
          }
        }
        .record {
          margin-left: 20px;
          margin-right: 15px;
          color: #aeaeae;
          .logo {
            position: relative;
            top: 4px;
          }
        }
      }
      .QRCode {
        // display: table-cell;
        display: inline-block;
        vertical-align: middle;
        text-align: right;
        float: right;
        li {
          margin-right: 43px;
          img {
            width: 96px;
            height: 96px;
            display: block;
          }
          span {
            display: inline-block;
            width: 100%;
            margin-top: 15px;
            text-align: center;
            font-size: 12px;
            color: #aeaeae;
          }
        }
        li:last-child {
          margin-right: 0;
        }

      }
    }
  }
</style>
