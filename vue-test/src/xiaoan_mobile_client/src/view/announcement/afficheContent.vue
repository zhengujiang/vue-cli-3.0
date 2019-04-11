<template>
  <div class="afficheCont">
    <div class="afficheContent" :style="{height:contHeight+'px'}">
      <vxa-pdf :src="pdfUrl"></vxa-pdf>
    </div>
    <!---->
    <span class="tt-clue" :class="{clueActive: IsActive}">好内容点此收藏哟</span>
    <!--基本信息 -- 收藏-->
    <footer class="show_footer" ref="footerDom">
      <div class="footer-home" @click="returnHome">
        <div class="tabbar-Icon">
          <img :src="footerHome.icon" alt="">
        </div>
        <p class="tabbar-value">{{footerHome.name}}</p>
      </div>
      <div class="show_items" v-for="(list, index) in footerItem" @click="footerClick(index)">
        <div class="tabbar-Icon">
          <img :src="list.icon" alt="">
        </div>
        <p class="tabbar-value">{{list.name}}</p>
      </div>
    </footer>
    <!---->
    <div class="popup-afficheDetails" v-transfer-dom>
      <popup class="popup-bottom" v-model="rulePlate" position="bottom">
        <h3 class="popup-bottom-title">基本信息</h3>
        <div class="popup-bottom-content">
          <!---->
          <div class="rulesPlateHeader">
            <div class="rulesPlate">
              <div class="rulesGulop vux-1px-b">
                <span class="rulesfw">板块类别：</span>
                <span v-for="list in scopesName">
                <span class="market" v-if="list == '沪市主板'"
                      :style="{color:'#a9262c',borderColor:'#a9262c'}">沪主板</span>
                <span class="market" v-else-if="list == '深市主板'"
                      :style="{color:'#174299',borderColor:'#174299'}">深主板</span>
                <span class="market" v-else-if="list == '深市中小板'"
                      :style="{color:'#174299',borderColor:'#174299'}">中小板</span>
                <span class="market" v-else-if="list == '深市创业板'"
                      :style="{color:'#174299',borderColor:'#174299'}">创业板</span>
                <span class="market" v-else-if="list == '新三板'"
                      :style="{color:'#f6900c',borderColor:'#f6900c'}">新    三板</span>
                <span class="market" v-else-if="list == '港股主板' || list == '香港主板'"
                      :style="{color:'#174299',borderColor:'#174299'}">{{list}}</span>
                <span class="market" v-else-if="list == '港股创业板' || list == '香港创业板'"
                      :style="{color:'#174299',borderColor:'#174299'}">{{list}}</span>
              </span>
              </div>
            </div>
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">所属行业：</div>
                <div class="unitsCont">{{tradeSort}}</div>
              </div>
            </div>
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">证券简称/代码：</div>
                <div class="unitsCont">{{unitss?unitss:''}}</div>
                <!-- <div class="unitsCont"><span v-for="v in unitss" class="unitsName unit">{{v+"、"}}</span>
                 </div>-->
              </div>
            </div>
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">信披评级：</div>
                <span v-if="gradeInfo.length > 0">
                  <span v-for="(val, index) of gradeInfo" :key="index">
                    <span style="margin-right: 10px"> {{val.key}}:{{val.value}}</span>
                  </span>
                </span>
                <span v-else>该上市公司尚无信披评级</span>
              </div>
            </div>
            <div class="smCaption">
              <div class="units vux-1px-b">
                <div class="unitsTitle">公告名称：</div>
                <div class="unitsCont">{{referenceNumber?referenceNumber:''}}</div>
              </div>
            </div>

            <div class="smCaption">
              <div class="units nounits">
                <div class="unitsTitle">发布日期：</div>
                <div class="unitsCont">{{releaseEnd}}</div>
              </div>
            </div>
          </div>
        </div>
        <footer class="popup-bottom-footer" @click="rulePlate = false">
          <button class="share_btn">取消</button>
        </footer>
      </popup>
    </div>
    <!---->
    <div class="popup-afficheDetails" v-transfer-dom>
      <popup class="popup-bottom" v-model="ruleCollect" position="bottom">
        <h3 class="popup-bottom-title">收藏</h3>
        <div class="popup-bottom-content">
          <!---->
          <div class="collect_global">
            <div class="collect_shg">
              <div class="inputgle">
                <input v-model="inputVal" type='text' @input="createInput(40)" :placeholder='placeholders'
                       class="createVal"/>
                <i class="icon iconfont icon-X closeInputVal" v-show="inputVal !=''"
                   @click="closeVal()"></i>
              </div>
              <div class="inputbtn">
                <button class="createDom" @click="addFavourite()">创建</button>
              </div>
            </div>
            <div class="collect-sns am-collect-padding">
              <div class="collectMaxHeight">
                <ul class="default">
                  <li class="collect-list" @click="addCollect('default')">
                    <div class="collect-item vux-1px-b">
                      <span class="defaultText">默认收藏夹</span>
                    </div>
                  </li>
                  <li class="collect-list create" v-for="(list,index) in collcell"
                      @click="addCollect(index)">
                    <div class="collect-item vux-1px-b">
                      <span class="defaultText">{{list.favouriteName}}</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <footer class="popup-bottom-footer" @click="ruleCollect=false">
          <button class="share_btn">取消</button>
        </footer>
      </popup>
    </div>
    <!---->
    <xa-loading v-show="loading"></xa-loading>
    <xiaoan-error v-show="loadFalse"></xiaoan-error>
  </div>
</template>
<script>
  import loading from '../../components/warning/loading'
  import returnHome from '../../components/warning/returnHome'
  import {Popup, TransferDom} from 'vux'

  export default {
    name: "afficheContent",
    directives: {
      TransferDom
    },
    components: {
      Popup,
      'xa-loading': loading,
      'xiaoan-returnHome': returnHome
    },
    data() {
      return {
        rulePlate: false,
        ruleCollect: false,
        footerHome: {id: 0, name: '主页', value: '', icon: this.$image.base.home, isshow: false},
        footerItem: [
          {id: 0, name: '基本信息', value: '', show: false, icon: this.$image.rules.Attribute},
          {id: 1, name: '收藏', value: '', show: false, icon: this.$image.rules.celloctIcon},
        ],
        boxShdow: false,
        IsActive: true,
        loadFalse: false,
        pdfIframe: "/static/pdf/web/viewer.html?file=",
        pdfUrl: "",
        contHeight: '',
        show: true,
        src: '',
        allLoaded: false,
        size: "",
        loading: true,//是否加载中状态
        confirmShow: false,
        rulesId: "",//索引id
        user_id: "",//cookie userId
        //收藏相关
        getDefS: '',
        collcell: [],
        bottom: 15,
        pageTop: 1,
        close: this.$image.personal.close,
        inputVal: "",
        placeholders: '请输入新建收藏夹名称(最多40个字)',
        //公告详情
        scopesName: [],//板块类别
        tradeSort: "",//所属行业
        releaseEnd: "",//发布时间
        unitss: "",//公告公司简称/代码
        html: "",//公告链接
        titleShow: "",//公告大小是否提示
        referenceNumber: '',
        gradeInfo: [] // 信披评级
      }
    },
    watch: {
      selected(n, o) {
        console.log(n);
      }
    },
    created() {
      this.user_id = this.$cookie.getCookie("userId");
      this.rulesId = this.$route.query.id;
      if (this.user_id) {
        this.getFavourite();
        this.getDefault();
      }
    },
    mounted() {
      this.getDetails();
      this.$nextTick(() => {
        this.contHeight = document.body.clientHeight - document.querySelector('.show_footer').clientHeight - 1;
        // document.title = '公告详情'
      });
      // 页面获取内容
      let companyName = window.localStorage ? localStorage.getItem("name") : Cookie.read("name");
      let companyCode = window.localStorage ? localStorage.getItem("code") : Cookie.read("code");
      console.log('------>', companyName, '*******>', companyCode);
      if (this.user_id) {
        // 有this.user_id
      } else {
        setTimeout(() => {
          this.IsActive = false;
          setTimeout(() => {
            this.IsActive = true;
          }, 5000)
        }, 1000)
      }
    },
    methods: {
      footerClick(index) {
        console.log(index);
        switch (index) {
          case 0:
            this.rulePlate = true;
            break;
          case 1:
            this.ruleCollect = true;
            this.collectMethod();
            break;
        }
      },
      // 创建input
      createInput(maxlength) {
        this.inputVal = this.$array.trim(this.inputVal);
        if (this.inputVal.length > maxlength) {
          this.inputVal = this.inputVal.substring(0, maxlength);
        }
      },
      //
      closeVal() {
        if (this.inputVal.length != 0) {
          this.inputVal = '';
          document.querySelector('.createVal').focus();
        }
      },
      // 详情跳转到法规的主页
      returnHome() {
        console.log(',,,,', this.$route);
        this.$router.push({path: "/rule"});
      },
      // 页面通过索引id获取内容
      getDetails() {
        /*this.$http({
          method: "GET",
          url: this.$api.disclosure.getDetails,
          params: {
            id: this.rulesId,
          }
        })*/
        let params = {id: this.rulesId}
        this.$axios.disclosure.getDetails(params).then((res) => {
          if (res.data.returnCode === 1) {
            this.loading = false;
            this.loadFalse = false;
            this.tradeSort = res.data.returnObject.tradeType;//行业类别
            if (res.data.returnObject.threeYearLevel) {
              this.gradeInfo = res.data.returnObject.threeYearLevel; //信披评级
            }
            if (res.data.returnObject.releaseDate !== "0") {
              this.releaseEnd = this.$const.formatText(res.data.returnObject.releaseDate);//发布日期
            } else {
              this.releaseEnd = "";
            }
            if (res.data.returnObject.companyShort == null || res.data.returnObject.companyCode == null) {
              this.unitss = "";
            } else {
              this.unitss = res.data.returnObject.companyShort + " " + res.data.returnObject.companyCode;//来源
            }
            if (res.data.returnObject.marketType !== null) {
              this.scopesName = res.data.returnObject.marketType.split(',');//板块类别
            }
            //
            this.src = res.data.returnObject.coverFile;//一页pdf
            this.size = res.data.returnObject.fileSize;//pdf大小
            this.referenceNumber = res.data.returnObject.title;//pdf名称
            this.titleName = this.referenceNumber;
            this.titleShow = res.data.returnObject.isBig;
            //
            if (this.titleShow == 1) {
              let _this = this;
              this.$vux.confirm.show({
                title: '',
                content: '点击查看公告全文' + _this.size + '？',
                // 组件除show外的属性
                onConfirm() {
                  _this.html = res.data.returnObject.url;//PDF链接
                  let protocol = document.location.protocol == 'https:' ? 'https:' : 'https:';
                  let url = _this.html.replace('http:', protocol).replace('https:', protocol);
                  _this.pdfUrl = _this.$api.CURRENTIP.IP + _this.pdfIframe + url;
                },
                onCancel() {
                  if (window.history.length == 2) {
                    _this.$router.push({path: '/'});
                  } else {
                    _this.$router.go(-1);
                  }
                }
              })
            } else {
              this.html = res.data.returnObject.url; // PDF链接
              let protocol = document.location.protocol == 'https:' ? 'https:' : 'https:';
              let url = this.html.replace('http:', protocol).replace('https:', protocol);
              // this.pdfUrl = this.$api.CURRENTIP.IP + this.pdfIframe + url;
              this.pdfUrl = url
            }
            //Evans for 9.30 日期调整
            this.refNumber = res.data.returnObject.releaseDate;//收藏夹的发文字号改为公告发布日期
            $("title").text(res.data.returnObject.title);
          } else {
            this.$vux.toast.show({text: '获取公告遇见未知错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
            setTimeout(() => {
              this.loadFalse = true;
            }, 300)
          }
          //
          let adverttitle = res.data.returnObject.title;
          let sharelink2 = window.location.href;//分享链接
          let shareDesc = "上市公司、专业机构移动董办工具首选！";//描述
          this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
        }).catch((err) => {
          console.error(err);
          this.loading = false;
          this.loadFalse = true;
        })
      },
      //
      collectMethod() {
        console.log('userId=' + this.user_id);
        if (this.$cookie.isLogin()) {
        } else {
          console.log(window.location.href);
          // 主逻辑业务
          let title = '公告详情';
          this.$storage.loginStatus(this, title, window.location.href);
        }
      },
      // 添加收藏夹
      addFavourite() {
        if (this.inputVal.trim().length != 0) {
          let params = {
            favouriteName: this.inputVal,
            isDefault: 0
          }
          this.$axios.favourite.addFavourite(params).then(res => {
            if (res.data.returnCode == 1) {
              this.inputVal = '';
              document.querySelector('.closeInputVal').style.display = 'none';
              this.getFavourite();
              this.$vux.toast.show({text: '创建收藏夹成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else if (res.data.returnCode == 3) {
              this.$vux.toast.show({text: '收藏夹不能相同', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else if (res.data.returnCode == 2) {
              this.$vux.toast.show({text: '最多只能创建十个收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }
          }).catch((err) => {
            console.error(err);
          });
        }
      },
      // 根据用户id获取收藏夹
      getFavourite() {
        let params = {
          pageSize: this.bottom,
          pageIndex: this.pageTop
        }
        this.$axios.favourite.getFavourite(params).then(res => {
          console.log(res);
          console.log(res.data.returnObject);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.collcell = res.data.returnObject.list;
              this.num = res.data.returnObject.list.length;
            }
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      // 获取默认收藏夹
      getDefault() {
        let params = {}
        this.$axios.favourite.getDefault(params).then(res => {
          this.getDefS = res.data.returnObject;
          console.log('3221321', this.getDefS);
        }).catch((err) => {
          console.error(err);
        })
      },
      // 根据收藏夹添加
      addCollect(index) {
        let addcollect = {};
        if (index === 'default') {
          addcollect = {
            refId: this.rulesId, // 文章id
            favourableId: this.getDefS.id, // 文件夹id
            title: this.titleName, // 标题名
            publishTime: this.refNumber, // 发布时间  Evans for 9.30 日期存入错误 修正为publishTime
            type: "case" // 类型
          }
        } else {
          addcollect = {
            refId: this.rulesId, // 文章id
            favourableId: this.collcell[index].id, // 文件夹id
            title: this.titleName, // 标题名
            publishTime: this.refNumber, // 发布时间
            type: "case"//类型
          }
        }
        this.$nextTick(() => {
          this.$axios.collect.addCollect(addcollect).then(res => {
            console.log(res);
            if (res.data.returnCode == 2) {
              this.$vux.toast.show({text: '你已添加进此收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else if (res.data.returnCode == 1) {
              this.ruleCollect = false;
              this.$vux.toast.show({text: '收藏成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            } else {
              this.$vux.toast.show({text: '收藏失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }
          }).catch((err) => {
            console.error(err);
          })
        })
      }
    }
  }
</script>

<style lang="scss">
  .popup-afficheDetails {
    .popup-bottom {
      max-height: 400px;
      background: white;
      font-size: 14px;
      text-align: center;
      border-radius: 0;
      width: 100%;
      .popup-bottom-title {
        width: 100%;
        height: 50px;
        background-color: #fff;
        border-bottom: 1px solid #e3e3e3;
        color: #323232;
        margin: 0;
        font-size: 17px;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        text-align: center;
        line-height: 50px;
      }
      .popup-bottom-content {
        //
        .rulesPlateHeader {
          overflow-y: auto;
          overflow-x: hidden;
          max-height: 300px;
          -webkit-overflow-scrolling: touch;
          .rulesPlate {
            background-color: white;
            padding: 12px 12px 0 12px;
            font-size: 14px;
            text-align: left;
            color: #323232;
            .rulesGulop {
              padding-bottom: 12px;
              .rulesfw {
                font-size: 15px;
                color: #323232;
              }
              .market {
                text-align: center;
                display: inline-block;
                padding: 0 5px;
                border-radius: 20px;
                font-size: 10px;
                border: 1px solid #f0ad4e;
                margin-right: 5px;
              }
            }
          }
          .smCaption {
            background-color: #FFFFFF;
            text-align: left;
            padding: 12px 12px 0 12px;
            color: #323232;
            .nounits {
              border-bottom: none !important;
            }
            .units {
              display: flex;
              flex-flow: row;
              color: #323232;
              font-size: 15px;
              padding-bottom: 12px;
              box-sizing: border-box;
              .unitsTitle {
              }
              .unitsCont {
                text-align: justify;
                flex: 1;
                box-sizing: border-box;
                .unitsName {
                }
              }
            }
          }
        }
        //
        .collect_global {
          .collect_shg {
            overflow: hidden;
            width: 100%;
            height: 50px;
            background-color: #f0f1f5;
            padding: 7.5px 12px;
            vertical-align: middle;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            .inputgle {
              height: 35px;
              width: 84%;
              background-color: #8d8d8d;
              border-radius: 2px;
              display: inline-block;
              float: left;
              border: 0;
              vertical-align: middle;
              position: relative;
              .createVal {
                border: 0;
                float: left;
                height: 35px;
                margin: 0;
                width: 100%;
                padding: 0 10% 0 12px;
                border-radius: 2px;
                outline: none;
                box-sizing: border-box;
                font-size: 15px;
              }
              .closeInputVal {
                line-height: 1;
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                right: 3%;
                color: #aeaeae;
              }
            }
            .inputbtn {
              height: 35px;
              width: 13%;
              border-radius: 2px;
              display: inline-block;
              float: right;
              vertical-align: middle;
              .createDom {
                float: right;
                border: 0;
                background-color: white;
                height: 35px;
                border-radius: 2px;
                font-size: 15px;
                width: 100%;
                padding: 0;
                color: #ffb148;
              }
            }
          }
          .collect-sns {
            background-color: #fff;
            width: 100%;
            max-height: 300px;
            margin: 0;
            box-sizing: border-box;
            -webkit-box-sizing: border-box;
            list-style: none;
            overflow-y: scroll;
            -webkit-overflow-scrolling: touch;
            font-size: 15px;
            color: #323232;
            .collectMaxHeight {
              width: 100%;
              max-height: 250px;
              box-sizing: border-box;
              .default {
                width: 100%;
                box-sizing: border-box;
                .collect-list {
                  width: 100%;
                  height: auto;
                  box-sizing: border-box;
                  padding: 0 12px;
                  font-size: 15px;
                  position: relative;
                  overflow: hidden;
                  text-align: left;
                  .collect-item {
                    padding: 10px 0;
                    height: 100%;
                    box-sizing: border-box;
                    .defaultText {
                      text-align: left;
                      color: #323232;
                    }
                  }

                }
                .collect-list:last-child {
                  .collect-item {
                    border-bottom: 0;
                  }
                }
                .collect-list:active {
                  background-color: #f0f1f5;
                }
              }
            }
          }
        }
      }
      .popup-bottom-footer {
        width: 100%;
        height: 50px;
        font-size: 17px;
        font-family: PingFangSC-Medium, sans-serif;
        .share_btn {
          display: block;
          font-family: PingFangSC-Medium, sans-serif;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          text-align: center;
          line-height: 50px;
          background: white;
          color: #ffb148;
          border-top: 1px solid #eaeaea;
          box-sizing: border-box;
          -webkit-box-sizing: border-box;
          font-size: 17px;
        }
      }
    }
  }
  .afficheCont {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .clueActive {
      opacity: 0 !important;
      bottom: 55px !important;
    }
    .tt-clue {
      width: 120px;
      height: auto;
      line-height: 20px;
      left: 75%;
      transform: translateX(-75%);
      font-size: 14px;
      text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.1);
      text-align: center;
      border: 4px solid rgba(255, 177, 72, 0.9);
      text-indent: 0;
      border-radius: 2px;
      position: absolute;
      pointer-events: none;
      background-color: rgba(255, 177, 72, 0.9);
      color: white;
      bottom: 62px;
      opacity: 1;
      box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
      -webkit-transition: all 1s ease-in-out;
      -moz-transition: all 1s ease-in-out;
      -o-transition: all 1s ease-in-out;
      -ms-transition: all 1s ease-in-out;
      transition: all 1s ease-in-out;
      &:before, &:after {
        content: '';
        position: absolute;
        bottom: -11px;
        left: 75%;
        transform: translateX(-75%);
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 10px solid rgba(255, 177, 72, 0.9);
      }
    }
    .afficheContent {
      width: 100%;
      height: 93%;
      background: #808080;
      overflow: hidden;
      position: relative;
    }
    .show_footer {
      overflow: hidden;
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 50px;
      display: flex;
      z-index: 300;
      background: #f0f1f5;
      border-top: 1px solid #e3e3e3;
      box-shadow: 0 -8px 13px rgba(0, 0, 0, .02);
      -webkit-box-sizing: border-box;
      .footer-home:active {
        background-color: #e3e3e3;
        -webkit-transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
        transition: background-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      }
      .footer-home {
        height: 100%;
        padding: 5px 15px;
        text-align: center;
        border-right: 1px solid #e3e3e3;
        text-decoration: none;
        box-sizing: border-box;
        .tabbar-Icon {
          margin: 0 auto;
          img {
            height: 19px;
          }
        }
        p {
          font-size: 12px;
          color: #767877;
        }
      }
      .show_items {
        flex: 1;
        height: 100%;
        text-align: center;
        text-decoration: none;
        padding: 5px 0;
        box-sizing: border-box;
        -webkit-box-sizing: border-box;
        .tabbar-Icon {
          margin: 0 auto;
          img {
            height: 19px;
          }
        }
        .tabbar-value {
          color: #767877;
          font-size: 12px;
        }
      }

      .show_items.active {
        color: #f6900c;
      }
      .show_items span {
        display: block;
        width: 100%;
      }
      .show_shareIcon, .show_collectIcon, .show_relativeIcon {
        height: 50%;
      }
    }
  }
  .sharebg {
    background-color: rgba(0, 0, 0, 0.6);
    height: 100%;
    width: 100%;
    overflow: hidden;
    opacity: 1;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    top: 0;
    z-index: 1000;
  }
</style>
