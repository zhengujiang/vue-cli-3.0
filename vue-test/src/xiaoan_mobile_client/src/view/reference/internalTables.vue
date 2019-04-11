<template>
  <div id="internalTables">
    <div class="swiper-inner">
      <swiper :options="swiperOption" :not-next-tick="notNextTick" class="swiperWrapper" ref="mySwiper">
        <swiper-slide v-for="(list, index) in swiperOption.swiperSlides" :key="index">
          <div class="internalGlobal" :class="list.class">
            <div class="internalGlobalTop">
              <ul class="internalGlobalTopUl">
                <li>{{list.name}}</li>
                <li @click="clicks">-&ensp;移除</li>
              </ul>
            </div>
            <div class="internalGlobalButton">
              <ul class="internalGlobalButtonUl">
                <li class="internalCode">{{list.code}}</li>
                <li class="innerCustomerGSelect">
                  <label class="labelUnit" for="selects">单位:</label>
                  <select id="selects" class="selectsShow" v-model="selected" @change="changeType">
                    <option :key="index" :value="list.id" v-for="(list, index) in allUnitItem">{{list.name}}
                    </option>
                  </select>
                </li>
              </ul>
            </div>
          </div>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
      <div class="matteShow" v-show="matteSh">
        <div class="snake-circle rules-circle"></div>
      </div>
    </div>
    <div class="splitColor"></div>
    <div class="ListBox">
      <div class="ListBoxShow" v-show="ListBoxDisplay">
        <div class="snake-circle rules-circle"></div>
      </div>
      <div class="listContent" v-for="(list,index) in allListItem">
        <div class="titleLine" @click="openInfo(index)">
          <div class="listTitle"> {{ list.name }}</div>
          <img :src="listImgSrc" alt="arrow" class="arrowDown">
        </div>
        <div class="listInfo">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" v-show="unitName=='万元'">
            <tr>
              <th align="left"></th>
              <th :key="yy" align="right" v-for="(xx,yy) in list.title">
                {{ xx.name }}
              </th>
            </tr>
            <tr :key="y" v-for="(x,y) in list.obj">
              <td align="left" @click="itemNameShow(index,y)">
                {{ x.projectName }}
                <span></span>
              </td>
              <td align="right" v-if="x.disclosureCriteria == null || x.disclosureCriteria==''">--</td>
              <td align="right"
                  v-else-if="x.disclosureCriteria !== null && x.disclosureCriteria !==''&& x.disclosureCriteria !=='y'">
                {{ unitYi(x.disclosureCriteria) }}
              </td>
              <td align="right"
                  v-else-if="x.disclosureCriteria !== null && x.disclosureCriteria !==''&& x.disclosureCriteria =='y'">
                <img :src="$image.lookupTables.duihao" class="duihaoImg" alt="" width="10%">
              </td>
              <td align="right"
                  v-if="(x.meetingCriteria == null || x.meetingCriteria=='') && allListItem[index].title.length==2">
                --
              </td>
              <td align="right"
                  v-else-if="x.meetingCriteria !== null && x.meetingCriteria !=='' && allListItem[index].title.length==2 && x.meetingCriteria !=='y'">
                {{ unitYi(x.meetingCriteria) }}
              </td>
              <td align="right"
                  v-else-if="x.meetingCriteria !== null && x.meetingCriteria !=='' && allListItem[index].title.length==2 && x.meetingCriteria =='y'">
                <img :src="$image.lookupTables.duihao" class="duihaoImg" alt="" width="10%">
              </td>
            </tr>
          </table>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" v-show="unitName=='亿元'">
            <tr>
              <th align="left"></th>
              <th align="right" v-for="(xx,yy) in list.title" :key="yy">
                {{ xx.name }}
              </th>
            <tr v-for="(x,y) in list.obj" :key="y">
              <td align="left" @click="itemNameShow(index,y)">
                {{ x.projectName }}
                <span></span>
              </td>
              <td align="right" v-if="x.disclosureCriteria == null || x.disclosureCriteria==''">--</td>
              <td align="right"
                  v-else-if="x.disclosureCriteria !== null && x.disclosureCriteria !==''&& x.disclosureCriteria !=='y'">
                {{ yiUnit(x.disclosureCriteria) }}
              </td>
              <td align="right"
                  v-else-if="x.disclosureCriteria !== null && x.disclosureCriteria !==''&& x.disclosureCriteria =='y'">
                <img :src="$image.lookupTables.duihao" class="duihaoImg" alt="" width="10%">
              </td>


              <td align="right"
                  v-if="(x.meetingCriteria == null || x.meetingCriteria=='') && allListItem[index].title.length==2">
                --
              </td>
              <td align="right"
                  v-else-if="x.meetingCriteria !== null && x.meetingCriteria !=='' && allListItem[index].title.length==2 && x.meetingCriteria !=='y'">
                {{ yiUnit(x.meetingCriteria) }}
              </td>
              <td align="right"
                  v-else-if="x.meetingCriteria !== null && x.meetingCriteria !=='' && allListItem[index].title.length==2 && x.meetingCriteria =='y'">
                <img :src="$image.lookupTables.duihao" class="duihaoImg" alt="" width="10%">
              </td>
            </tr>
          </table>
          <table width="100%" border="0" cellspacing="0" cellpadding="0" v-show="unitName=='自适应'">
            <tr>
              <th align="left"></th>
              <th align="right" v-for="(xx,yy) in list.title">
                {{ xx.name }}
              </th>
            </tr>
            <tr v-for="(x,y) in list.obj">
              <td align="left" @click="itemNameShow(index,y)">
                {{ x.projectName }}
                <span></span>
              </td>
              <td align="right" v-if="x.disclosureCriteria == null || x.disclosureCriteria==''">--</td>
              <td align="right"
                  v-else-if="x.disclosureCriteria !== null && x.disclosureCriteria !==''&& x.disclosureCriteria !=='y'">
                {{ unitWan(x.disclosureCriteria) }}
              </td>
              <td align="right"
                  v-else-if="x.disclosureCriteria !== null && x.disclosureCriteria !==''&& x.disclosureCriteria =='y'">
                <img :src="$image.lookupTables.duihao" class="duihaoImg" alt="" width="10%">
              </td>

              <td align="right"
                  v-if="(x.meetingCriteria == null || x.meetingCriteria=='') && allListItem[index].title.length==2">
                --
              </td>
              <td align="right"
                  v-else-if="x.meetingCriteria !== null && x.meetingCriteria !=='' && allListItem[index].title.length==2 && x.meetingCriteria !=='y'">
                {{ unitWan(x.meetingCriteria) }}
              </td>
              <td align="right"
                  v-else-if="x.meetingCriteria !== null && x.meetingCriteria !=='' && allListItem[index].title.length==2 && x.meetingCriteria =='y'">
                <img :src="$image.lookupTables.duihao" class="duihaoImg" alt="" width="10%">
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="listZs">
        <p>{{ zhushi1 }}</p>
        <p>{{ zhushi2 }}</p>
      </div>
    </div>
    <div class="goCustomer" @click="goCust">{{goText}}</div>
    <!--//<div class="goCustomer goHome" @click="goLaw">{{goText}}</div>-->
    <div class="goCustomer goHome" @click="goLaw">
      <div class="ans-homeIcon"></div>
      <div class="ans-homeText">主页</div>
    </div>
    <!-- 详细信息弹出查看 -->
    <div class="moreInfo" v-show="moreInfoShow">
      <div class="infoBox">
        <div class="msBox">
          <div class="title">描述</div>
          <div class="content" v-if="infoArr[0].content == null || infoArr[0].content == ''">暂无描述信息</div>
          <div class="content" v-else>{{ this.infoArr[0].content }}</div>
        </div>
        <div class="hLine"></div>
        <div class="jsBox">
          <div class="title">计算标准</div>
          <div class="content" v-if="infoArr[1].content[0] == null">暂无计算标准信息</div>
          <div class="content jsbzContent" style="padding-top:0;padding-bottom: 0;" v-else>
            <div class="conList" style="border: 0">
              <p class="guizeCont" v-for="n in this.infoArr[1].content">{{ n }}</p>
              <div style="clear: both"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="infoClose">
        <div class="closeButton" @click="closeMoreInfo"></div>
      </div>
    </div>
    <div class="infoShadow" @click="closeMoreInfo"></div>
    <div class="error" v-show="errShow">
      <div class="errBox">
        <img :src="$image.warning.warnin" alt="">
        <div class="errText">{{ errText }}</div>
        <div class="buttonBox" @click="reload">{{ errBtn }}</div>
      </div>
    </div>
    <!---->

    <!---->
    <div id="warning" v-show="warningHttp">
      <div class="waringImg"></div>
      <div class="waringText">{{waringText}}</div>
      <mt-button class="waringBtn" @click="waringBin">{{waringBtn}}</mt-button>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'internalTables',
    data() {
      return {
        ListBoxDisplay: false,
        matteSh: true,
        selected: 2,
        allUnitItem: [   //单位数组
          {id: "0", name: "亿元"},
          {id: "1", name: "万元"},
          {id: "2", name: "自适应"},
        ],
        notNextTick: true,
        imgsrc: this.$image.lookupTables.tablebottom,
        swiperSlides: [],
        swiperArr: [],
        listScroll: [],
        infoArr: [
          {name: "描述", content: "暂无描述"},
          /*{name: "计算标准", content: [{drule: ""}, {mrule: ""}, {orule: ""}]},*/
          {name: "计算标准", content: []},
        ],
        errText: "获取数据失败，请刷新重试！",
        errBtn: "刷新",
        moreInfoShow: false,//更多详细信息页面显示
        tableInfo: [],
        goText: "数据校准",
        isUnitShow: false,//是否显示单位选择框
        unitName: "自适应",//单位
        listImgSrc: this.$image.lookupTables.tablebottom,
        allListItem: [   //列表数组
          {id: "0", name: '非关联交易（担保除外）', obj: [], title: [{name: "披露"}, {name: "股东大会"}]},
          {id: "1", name: '关联交易（担保除外）', obj: [], title: [{name: "披露"}, {name: "股东大会"}]},
          {id: "2", name: '提供担保', obj: [], title: [{name: "披露及董事会"}, {name: "股东大会"}]},
          {id: "3", name: '重大资产重组', obj: [], title: [{"name": "披露标准"}, {"name": "股东大会"}]},
          {id: "4", name: '重大合同', obj: [], title: [{name: "披露及董事会"}]},
          {id: "5", name: '诉讼及仲裁', obj: [], title: [{name: "披露"}]},
          {id: "6", name: '政府补助', obj: [], title: [{name: "披露"}]},
          {id: "7", name: '资产减值', obj: [], title: [{name: "披露及董事会"},{name: "股东大会"}]},
          {id: "8", name: '财务资助', obj: [], title: [{name: "披露及董事会"},{name: "股东大会"}]}
        ],
        zhushi1: "* 基于2016年年报公布的财务数据测算",
        zhushi2: "* 适用于深交所主板披露规则",
        errShow: false,
        nullShow: false,
        company: "",
        code: "",
        comname: "",
        year: "",
        source: "",
        warningHttp: false,
        waringBtn: '前往完善',
        waringText: '本功能仅适用于上市公司，上市公司用户可在个人中心完善公司信息！',
        companycode: "",
        listScrollarr: '',
        swiperOption: {
          swiperSlides: [],
          pagination: '.swiper-pagination',
          effect: 'coverflow',
          grabCursor: true,
          centeredSlides: true,
          slidesPerView: 'auto',
          initialSlide: 0,
          coverflow: {
            rotate: 48,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false
          },
          nextButton: '.swiper-button-next',
          prevButton: '.swiper-button-prev',
          paginationClickable: true,
          spaceBetween: 0,
          debugger: true,
          //loop: true,

          on: {
            slideChangeTransitionStart: (swiper) => {
              this.ListBoxDisplay = true;
              this.getInof(this.swiperOption.swiperSlides[this.swiper.activeIndex].code);
            }
          }
        }
      }
    },
    watch: {
      '$route'(to, from) {
        //console.log(, to.name, from.name);
        //window.location.reload();
      },
      moreInfoShow: function (val, old) {
        $('.infoBox').scrollTop(0);
        $('.jsbzContent').scrollTop(0);
      },
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper;
      }
    },
    //
    updated() {
      this.listHeight();
    },
    created() {
      if (this.$route.query.index == undefined || this.$route.query.numberVal == undefined) {
        this.$router.push({path: '/searchPower'});
      }
      /***********************************************************************************/
      console.log("4532432", this.$route.query.index, this.$route.query.numberVal);
      // var numberVal = this.$route.query.numberVal;
    },
    mounted() {
      this.getPermissionInsideList();//获取数据
      //console.log("每次切换都会触发我43535");
      this.setTimeNext();
      //
      this.listHeight();
      //
      setTimeout(() => {
        this.$nextTick(() => {
          if (window.localStorage.getItem("swiperRealIndex") != null) {
            this.swiper.slideTo(window.localStorage.getItem("swiperRealIndex"), 2000, false);
          } else {
            this.swiper.slideTo(this.$route.query.index, 2000, false);
          }
          this.getInof(this.swiperOption.swiperSlides[this.swiper.realIndex].code);
          this.matteSh = false;
        })
      }, 1500);
      //
      console.log('23213', this.swiper);
      var user_id = this.$cookie.getCookie("userId");
      this.user_Id = user_id;
      if (this.$cookie.isLogin()) {
        this.$MTAmethod.mtaClick('a6ha223ea9v7m6fr', {'2fqj3h8w4s': 'true'});
        this.UserHome();
      } else {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
    },
    methods: {
      //
      changeType(val) {
        console.log('4234234324', val, this.selected);
        this.unitName = this.allUnitItem[this.selected].name;
        if (this.selected == 1) {
          $("table").css({'table-layout': 'fixed'})
          $("td").css({'word-wrap': 'break-word', 'white-space': 'normal', 'overflow': 'auto'});
          /*nowrap  inherit*/
          $("td:first-child").css({'width': '25%!important'}).siblings().css({'width': '37.5%!important'});
          $(".listContent").eq(2).find("td:first-child").css({
            'word-wrap': 'break-word',
            'width': '33.33%!important',
            'overflow': 'inherit'
          });
        } else {
          $("table").css({'table-layout': 'fixed'})
          $("td").css({
            'word-wrap': 'break-word',
            'width': '33.33%!important',
            'overflow': 'inherit'
          })
        }
        /*   this.isUnitShow = true;*/
      },
      // 获取
      getPermissionInsideList() {
        this.$axios.permission.getPermissionInsideList().then(res => {
          if (res.data.returnCode == 1) {
            this.swiperSlides = res.data.returnObject;
            this.swiperOption.swiperSlides = res.data.returnObject;
            this.swiperOption.swiperSlides.forEach((item, index) => {
              switch (index % 3) {
                case 0:
                  item.class = 'color-active';
                  break
                case 1:
                  item.class = 'color-next';
                  break
                case 2:
                  item.class = 'color-prev';
                  break
              }
            })
            this.listScrollarr = res.data.returnObject.length;
            console.log("getPermissionInsideList==>", res.data.returnObject);
          } else if (res.data.returnCode == -1) {
            this.$router.push({path: '/searchPower'});
          } else {
            this.errShow = true;
          }

        }).catch((err) => {
          this.$router.push({path: '/searchPower'});
        })
      },
      //
      setTimeNext() {
        setTimeout(() => {
          this.$nextTick(() => {
            var ArrQuery = this.$route.query.index;
            var acos = (ArrQuery % 3);
            if (acos == 0) {
              console.log("橙色", 1);
              $('.swiper-slide-active').addClass("swiper-color-active").removeClass("swiper-color-next swiper-color-prev");
              $('.swiper-slide-next').addClass("swiper-color-next").removeClass("swiper-color-active swiper-color-prev");
              $('.swiper-slide-prev').addClass("swiper-color-prev").removeClass("swiper-color-active swiper-color-next");
            } else if (acos == 1) {
              console.log("红色", 2);
              $('.swiper-slide-active').addClass("swiper-color-next").removeClass("swiper-color-active swiper-color-prev");
              $('.swiper-slide-next').addClass("swiper-color-prev").removeClass("swiper-color-active swiper-color-next ");
              $('.swiper-slide-prev').addClass("swiper-color-active").removeClass("swiper-color-next swiper-color-prev");
            } else if (acos == 2) {
              console.log("蓝色", 3);
              $('.swiper-slide-active').addClass("swiper-color-prev").removeClass("swiper-color-active swiper-color-next");
              $('.swiper-slide-next').addClass("swiper-color-active").removeClass("swiper-color-next swiper-color-prev");
              $('.swiper-slide-prev').addClass("swiper-color-next").removeClass("swiper-color-active swiper-color-prev");
            } else {
              console.log("不知道", 4);
            }
          })
        }, 1500);
      },
      //
      setTimeNext2() {
        setTimeout(() => {
          this.$nextTick(() => {
            var ArrQuery = this.swiper.realIndex - 1;
            var acos = (ArrQuery % 3);
            if (acos == 0) {
              console.log("橙色", 1);
              $('.swiper-slide-active').addClass("swiper-color-active").removeClass("swiper-color-next swiper-color-prev");
              $('.swiper-slide-next').addClass("swiper-color-next").removeClass("swiper-color-active swiper-color-prev");
              $('.swiper-slide-prev').addClass("swiper-color-prev").removeClass("swiper-color-active swiper-color-next");
            } else if (acos == 1) {
              console.log("红色", 2);
              $('.swiper-slide-active').addClass("swiper-color-next").removeClass("swiper-color-active swiper-color-prev");
              $('.swiper-slide-next').addClass("swiper-color-prev").removeClass("swiper-color-active swiper-color-next ");
              $('.swiper-slide-prev').addClass("swiper-color-active").removeClass("swiper-color-next swiper-color-prev");
            } else if (acos == 2) {
              console.log("蓝色", 3);
              $('.swiper-slide-active').addClass("swiper-color-prev").removeClass("swiper-color-active swiper-color-next");
              $('.swiper-slide-next').addClass("swiper-color-active").removeClass("swiper-color-next swiper-color-prev");
              $('.swiper-slide-prev').addClass("swiper-color-next").removeClass("swiper-color-active swiper-color-prev");
            } else {
              console.log("不知道", 4);
            }
            /**/
          })
        });
      },
      //
      deleteInsideCompany() {
        let params = {
            code: this.swiperOption.swiperSlides[this.swiper.realIndex].code,
          }
        this.$axios.permission.deleteInsideCompany(params).then(res => {
          console.log("每次切换都会触发我43535");
          if (res.data.returnCode == 1) {
            this.$axios.permission.getPermissionInsideList().then(res => {
              if (res.data.returnCode == 1) {
                this.swiperOption.swiperSlides = res.data.returnObject;
                this.swiperOption.swiperSlides.forEach((item, index) => {
                  switch (index % 3) {
                    case 0:
                      item.class = 'color-active';
                      break
                    case 1:
                      item.class = 'color-next';
                      break
                    case 2:
                      item.class = 'color-prev';
                      break
                  }
                })
                this.listScrollarr = res.data.returnObject.length;
                console.log("setInterval======>", res, this.listScrollarr, this.swiperSlides, this.swiper.realIndex);
                if (this.listScrollarr <= 0) {
                  this.$router.push({path: '/searchPower'});
                } else {
                  this.setTimeNext2();
                  this.swiper.slideTo(this.swiper.realIndex - 1, 1000, false);
                  console.log("this.swiper.realIndex", this.swiper.realIndex);
                  this.getInof(this.swiperOption.swiperSlides[this.swiper.realIndex].code);
                }
              } else if (res.data.returnCode == -1) {
                this.$router.push({path: '/searchPower'});
              } else {

              }
            }).catch((err) => {
            })
          }
        }).catch((err) => {
        })
      },
      //
      clicks() {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要取消关注吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.deleteInsideCompany();
          },
          onCancel() {
          }
        });
      },
      //
      selectDisplay(index) {
        console.log(1234567890, this.swiperOption.swiperSlides[index]);
      },
      //
      UserHome() {
        /*this.$http ({
          method: 'GET',
          url: this.$api.userHome.userhome,
        })*/
        this.$axios.userHome.userhome().then((res) => {
          if (res.data.returnCode == 1) {
            this.companycode = res.data.returnObject.companyCode;
            if (this.companycode !== "") {
              this.warningHttp = false;
              this.getInof(this.swiperOption.swiperSlides[this.swiper.realIndex].code);
            } else {
              this.warningHttp = true;
            }
          }
        }).catch((err) => {
          console.log(err);
        })
      },
      //
      waringBin() {
        this.$router.push({path: 'manage/reviseInfo', query: {id: '2'}});
      },
      //
      reload() {
        window.location.reload();
      },
      // 以 亿 为单位
      yiUnit(str) {
        if (!isNaN(str)) {
          var x = (str / 100000000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '亿';
        } else if (isNaN(str)) {
          return str
        }
      },
      // 自适应
      unitWan(str) {
        if (str.length < 12 && str.length >= 8 && !isNaN(str)) {
          var x = (str / 10000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '万';
        } else if (str.length >= 12 && !isNaN(str)) {
          var x = (str / 100000000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '亿';
        } else if (str.length < 8 || isNaN(str)) {
          return str
        }
      },
      // 以 万元 为单位
      unitYi(str) {
        if (str.length >= 8 && !isNaN(str)) {
          var x = (str / 10000).toFixed(2);
          var y = x.toString().split('.')
          if (y[0].length > 3) {
            var z = y[0].substring(0, y[0].length - 3);
            if (z.length > 3) {
              var hh = z.substring(0, z.length - 3)
              z = hh + ',' + z.substring(z.length - 3, z.length)
              if (hh.length > 3) {
                var ss = hh.substring(0, hh.length - 3)
                z = ss + ',' + hh.substring(hh.length - 3, hh.length) + ',' + z.substring(z.length - 3, z.length);
              }
            }
            var n = z + ',' + y[0].substring(y[0].length - 3, y[0].length);
            y[0] = n;
          }
          return y.join(".") + '万';
        } else if (str.length < 8 || isNaN(str)) {
          return str
        }
      },
      // 上交所
      listArr() {
        for (var i in this.allListItem[3].obj) {
          this.allListItem[3].obj[i].disclosureCriteria = this.allListItem[3].obj[i].otherCriteria;
        }
        this.allListItem[3].title.pop();

        this.allListItem[4].name = "特别重大合同";
        this.zhushi2 = "* 适用于上交所主板披露规则";
        console.log("234234324", this.allListItem[3].title[0].name, this.allListItem[3].title);
        this.allListItem[3].title[0].name = "重大资产重组";
        /**/
      },
      // 深交所
      listSZarr() {
        this.zhushi2 = "* 适用于深交所主板披露规则";
        this.allListItem[3].title[0].name = "重大资产重组";
        for (var i in this.allListItem[3].obj) {
          this.allListItem[3].obj[i].disclosureCriteria = this.allListItem[3].obj[i].otherCriteria;
        }
        this.allListItem[7].name = "资产减值或核销";
        this.allListItem[7].title[0].name = "披露";
        this.allListItem[7].title.pop();
        this.allListItem[3].title.pop();
      },
      // 创业板
      listCYarr() {
        this.zhushi2 = "* 适用于深交所创业板披露规则";
        this.allListItem[4].title[0].name = "披露";
        this.allListItem[1].title[0].name = "披露及董事会";
        this.allListItem[3].title[0].name = "重大资产重组";
        for (var i in this.allListItem[3].obj) {
          this.allListItem[3].obj[i].disclosureCriteria = this.allListItem[3].obj[i].otherCriteria;

        }
        this.allListItem[7].name = "资产减值或核销";
        this.allListItem[7].title[0].name = "披露";
        this.allListItem[7].title.pop();
        this.allListItem[3].title.pop();
        this.allListItem[4].name = "日常经营重大合同";
      },
      // 中小板
      listCXarr() {
        this.zhushi2 = "* 适用于深交所中小板披露规则";
        this.allListItem[4].title[0].name = "披露";//重大合同
        this.allListItem[4].name = "日常经营性重大合同";//重大合同
        this.allListItem[3].title[0].name = "重大资产重组"; //重大资产重组
        for (var i in this.allListItem[3].obj) {
          this.allListItem[3].obj[i].disclosureCriteria = this.allListItem[3].obj[i].otherCriteria;
        }
        this.allListItem[3].title.pop();
        this.allListItem[7].title[0].name = "披露";
      },
      // 获取信息
      getInof(code) {
        let params = {
            code: code,
          }
        this.$axios.permission.getInsideList(params).then(res => {
          console.log(res)
          if (res.data.returnCode == '-3') {
            this.goCust();
          } else if (res.data.returnCode == 1) {
            this.company = res.data.returnObject.companyName;
            this.code = res.data.returnObject.companyCode;
            this.comname = res.data.returnObject.companyMarket;
            this.year = res.data.returnObject.year;
            this.source = res.data.returnObject.sourceType;
            this.allListItem = [
              {id: "0", name: '非关联交易（担保除外）', obj: [], title: [{name: "披露"}, {name: "股东大会"}]},
              {id: "1", name: '关联交易（担保除外）', obj: [], title: [{name: "披露"}, {name: "股东大会"}]},
              {id: "2", name: '提供担保', obj: [], title: [{name: "披露及董事会"}, {name: "股东大会"}]},
              {id: "3", name: '重大资产重组', obj: [], title: [{"name": "披露标准"}, {"name": "股东大会"}]},
              {id: "4", name: '重大合同', obj: [], title: [{name: "披露及董事会"}]},
              {id: "5", name: '诉讼及仲裁', obj: [], title: [{name: "披露"}]},
              {id: "6", name: '政府补助', obj: [], title: [{name: "披露"}]},
              {id: "7", name: '资产减值', obj: [], title: [{name: "披露及董事会"},{name: "股东大会"}]},
              {id: "8", name: '财务资助', obj: [], title: [{name: "披露及董事会"},{name: "股东大会"}]}
            ]
            this.allListItem[0].obj = res.data.returnObject.data.transaction;//非关联交易(担保除外)
            this.allListItem[1].obj = res.data.returnObject.data.relatedTransaction;//关联交易(担保除外)
            this.allListItem[2].obj = res.data.returnObject.data.guarantees;//提供担保

            this.allListItem[3].obj = res.data.returnObject.data.significantAssetRestructuring;//重大资产重组
            this.allListItem[4].obj = res.data.returnObject.data.especiallyMajorContract;//特别重大合同
            this.allListItem[5].obj = res.data.returnObject.data.litigationAndArbitration;//诉讼和仲裁significantAssetRestructuring

            this.allListItem[6].obj = res.data.returnObject.data.governmentSubsidy;//政府补助
            this.allListItem[7].obj = res.data.returnObject.data.impairmentOfSssets;//资产减值
            if (res.data.returnObject.data.financialAssistance && res.data.returnObject.data.financialAssistance.length > 0) {
              this.allListItem[8].obj = res.data.returnObject.data.financialAssistance;//财务资助
            } else {
              this.allListItem.length = 8;
            }
            if (res.data.returnObject.data.majorEmergency) {
              let obj = {id: "8", name: '重大突发事件', obj: res.data.returnObject.data.majorEmergency, title: [{name: "披露"}]}
              this.allListItem.push(obj)
            }
            console.log('-------allListItem =', res.data.returnObject.data.majorEmergency, this.allListItem)
            if (this.source == "0") {
              this.zhushi1 = "* 基于" + this.year + "年年报公布的财务数据测算";
            } else {
              this.zhushi1 = "* 基于用户自定义的财务数据测算";
            }
            if (this.comname == "SH") {
              this.listArr();
            } else if (this.comname == "SZ") {
              this.listSZarr();
            } else if (this.comname == "CY") {
              this.listCYarr();
            } else if (this.comname == "ZX") {
              this.listCXarr();
            }
            if (res.data.returnObject.isNew === 1) {
              let _this = this;
              this.$vux.confirm.show({
                title: '',
                content: '系统自动检测到贵司已发布' + res.data.returnObject.newYear + '年年度经审计年报，是否切换数据源？',
                // 组件除show外的属性
                onConfirm() {
                  let params = {
                      code: code,
                    }
                 _this.$axios.permission.setNewAnnualReport(params).then(res => {
                    window.location.reload();
                  }).catch((err) => {
                  })
                },
                onCancel() {
                  window.location.reload();
                }
              })
            }
          } else {
            this.$vux.toast.show({text: '暂无该公司年报', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
          this.ListBoxDisplay = false;
          setTimeout(() => {
            this.matteSh = false;
          }, 1500)
        }).catch((err) => {
          console.log(err, err.message)
          //this.errShow = true;
        })
      },
      // 关闭详细数据显示框
      closeMoreInfo() {
        this.moreInfoShow = false;
        $(".infoShadow").hide().css('z-index', '-22');
        $(".ListBox").css('overflow', 'auto');
      },
      //
      ImpArr(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === "" || typeof(array[i]) === "undefined") {
            array.splice(i, 1);
            i = i - 1;
          }
        }
      },
      // 显示第index个行情信息内容
      itemNameShow(arrIndex, index) {
        this.moreInfoShow = true;
        $(".ListBox").css('overflow', 'hidden');
        $(".infoShadow").show().css('z-index', '1002');
        this.infoArr[0].content = this.allListItem[arrIndex].obj[index].description;//描述
        this.infoArr[1].content[0] = this.allListItem[arrIndex].obj[index].disclosureRule;//披露规则
        var str = this.allListItem[arrIndex].obj[index].disclosureRule;
        var arr = [];
        //匹配中文标点符号 。；
        var reg = /[\u3002|\uff1b]/;
        if (reg.test(str)) {
          var arr = str.split("\n");
          this.ImpArr(arr);//去除空元素
          for (var i in arr) {
            if (arr[i].indexOf('（2）') > 0) {
              var text = [];
              text = "（2）" + arr[i].split('（2）')[1];
              arr[i] = arr[i].split('（2）')[0];
              arr.push(text);
            }
          }
          this.infoArr[1].content = arr;
        } else {
          //console.log('没有分号和句号')
        }
        //设置计算标准内容高度
        this.$nextTick(() => {
          let infoBoxH = document.querySelector(".infoBox").clientHeight;
          let msBoxH = document.querySelector(".msBox").clientHeight;
          let hLineH = document.querySelector(".hLine").clientHeight;
          let titleH = document.querySelector(".title").clientHeight;
          let toheight = (infoBoxH - (msBoxH + hLineH + titleH + 10)) + "px";
          $(".jsbzContent").height(toheight);
        }, 500)
      },
      //
      listHeight() {
        var hei = document.body.clientHeight;
        var ghg = (hei - document.querySelector('.swiper-inner').clientHeight - 7.5) + "px";
        $(".ListBox").css({"height": ghg});
      },
      //
      showUnit() {
        this.isUnitShow == false ? this.isUnitShow = true : this.isUnitShow = false;
      },
      //
      choiceItem(index) {
        this.unitName = this.allUnitItem[index].name;
        if (this.unitName == "万元") {
          $("table").css({'table-layout': 'fixed'})
          $("td").css({'word-wrap': 'break-word', 'white-space': 'normal', 'overflow': 'auto'})
          /*nowrap  inherit*/
          $("td:first-child").css({'width': '25%!important'}).siblings().css({'width': '37.5%!important'})
          $(".listContent").eq(2).find("td:first-child").css({
            'word-wrap': 'break-word',
            'width': '33.33%!important',
            'overflow': 'inherit'
          });
        } else {
          $("table").css({'table-layout': 'fixed'})
          $("td").css({
            'word-wrap': 'break-word',
            'width': '33.33%!important',
            'overflow': 'inherit'
          })
        }
        this.isUnitShow = false;
      },
      // 打开列表信息
      openInfo(index) {
        var status = $(".listContent").eq(index).find('.listInfo').css('display');
        if (status == "none") {
          $(".listContent").find('.listInfo').hide(100);
          $(".listContent").find('img').removeClass('arrowUp');
          $(".listContent").eq(index).find('.listInfo').fadeIn(300)
          $(".listContent").eq(index).find('img').addClass('arrowUp')
        } else {
          $(".listContent").eq(index).find('.listInfo').fadeOut(100);
          $(".listContent").eq(index).find('img').removeClass('arrowUp');
        }
      },
      // 数据校准跳转
      goCust() {
        this.$router.push({
          path: "/innerCustomerTables",
          query: {
            name: this.swiperOption.swiperSlides[this.swiper.realIndex].name,
            code: this.swiperOption.swiperSlides[this.swiper.realIndex].code
          }
        });
        console.log("2312", this.swiperOption.swiperSlides[this.swiper.realIndex], this.swiper.realIndex);
        window.localStorage.setItem("swiperRealIndex", this.swiper.realIndex);
      },
      //
      goLaw() {
        this.$router.push({path: "/home"});
      },
    }
  }
</script>

<style lang="scss">
  .color-active {
    /* background-color: #ffb948;*/
    box-shadow: 0 0 13px rgba(255, 177, 72, 0.5);
    background: linear-gradient(to right, #ffc548, #ffb148); /* 标准的语法 */
  }
  .color-prev {
    /*background-color: #85b1f5;*/
    box-shadow: 0 0 5px rgba(116, 167, 245, 0.5);
    background: linear-gradient(to right, #90b8f5, #74a7f5); /* 标准的语法 */
  }
  .color-next {
    /* background-color: #ff7756;*/
    box-shadow: 0 0 5px rgba(255, 114, 80, 0.5);
    background: linear-gradient(to right, #fe8d6f, #ff7250); /* 标准的语法 */
  }
  #selects {
    display: none;
  }
</style>

<style scoped lang="scss">
  .swiper-inner {
    width: 100%;
    height: 110px;
    padding-top: 15px;
    padding-bottom: 15px;
    box-sizing: border-box;
    opacity: 1;
    position: relative;
  }
  .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 200px;
    height: 80px;
    border-radius: 2px;
  }
  .swiper-button-next, .swiper-button-prev {
    background-image: none;
    top: 0;
    height: 100%;
    /*background-color: white;*/
    margin-top: 0;
    width: 15%;
  }
  #internalTables .internalGlobal {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    padding: 10px 15px;
  }
  #internalTables .internalGlobalTop, #internalTables .internalGlobalButton {
    height: 50%;
    box-sizing: border-box;
    position: relative;
  }
  ul, li {
    list-style-type: none;
  }
  .internalGlobalTopUl li {
    display: inline-block;
    float: left;
    font-size: 20px;
    height: 27px;
    line-height: 27px;
    color: white;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    word-break: keep-all;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 55%;
  }
  .internalGlobalTopUl li + li {
    float: right;
    display: inline-block;
    width: 52.5px;
    height: 23px;
    border: 1px solid white;
    color: white;
    font-size: 13px;
    line-height: 23px;
    text-align: center;
    border-radius: 2px;
  }
  .internalGlobalButtonUl {
    height: 100%;
  }
  .internalGlobalButtonUl .internalCode {
    display: inline-block;
    position: absolute;
    bottom: 0;
    left: 0;
    color: white;
    font-size: 13px;
  }
  .internalGlobalButtonUl .innerCustomerGSelect {
    /* display: inline-block;*/
    position: absolute;
    bottom: 0;
    right: 0;
    color: white;
    /* font-size: 0px;*/
  }
  /*warning页面*/
  #warning {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 1);
    z-index: 3000;
    overflow: hidden;
    text-align: center;
  }
  #warning > .waringImg {
    height: 110px;
    width: 118.25px;
    margin: 38.2% auto 0 auto;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/warning/warningCode.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  #warning .waringText {
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #ffb148;
    padding: 20px 14% 0 14%;
    box-sizing: border-box;
    text-align: center;
  }
  #warning .waringBtn {
    box-shadow: none;
    color: white;
    border: 0;
    width: 90px;
    margin-top: 20px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    height: 30px;
    background: #ffb148;
    font-size: 15px;
  }
  /**/
  #internalTables {
    width: 100%;
    height: 100%;
  }
  /*  #internalTables .innerCustomerGSelect{
    }*/
  /* .innerCustomerGSelect .labelUnit{
       font-size: 15px;
   }*/
  .selectsShow {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAtCAYAAAA6GuKaAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYyNUE3MThEODcxMDExRTc4RTZFRDcwQzI4NDY2MTlEIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYyNUE3MThFODcxMDExRTc4RTZFRDcwQzI4NDY2MTlEIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjI1QTcxOEI4NzEwMTFFNzhFNkVENzBDMjg0NjYxOUQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjI1QTcxOEM4NzEwMTFFNzhFNkVENzBDMjg0NjYxOUQiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz52nVdgAAADpElEQVR42uSZS0iUURTHz4xWYz4CKQh825iRhpkRtLLpQbqLIFrUpqjsQRZBUe2aVdkutBf0IIoeBNUiggjNWgSFWZGVr2oU6eGitEzHMb/+t+98zTDM4NzvuzqfdOCPw3gfP87ce+459zo0TSOLNh9aDpVB86AsKAWaAfVBP6Fu6B3UBNVDb6xM6DAJnQtthjZA+Sb6v4euQOehj9K9BbSE3NAlKKCpsQCP55bhiLWhCzoCDWnjY2JcL8+jBLoAatYmxpp5PkvQq6E+bWJNzFdhFnod5NfiY36ePyJbtOghQtg9aCrFz4ahSg6RY4a8AugZx9l4m4jzS6C20C+dYY1c0HWbABNzXGOuqNCHoFKylwmew9GWhxt6DU0j+5kfKoY6wj3ttSkwMZc33NNzoFYogexro9BcqNPw9BabAxurYmuop0WmlUP2ty7BKeiLpIC/tarF+N5ONPg11tbZgldAL4t5gnaEzMd7kcofUwPcjx/4UTXRg00yvTwCerFEzaD/6XlI9PaiNeBfn4kad/GRli7Ts0xAF8bcvGA9uhxkr+PgbDlrDlgsh4YdyNYQENJQBK24INO70Cm9ATPKiRYd0D933kK1d07eww3biX4P4ZBGpC2vRVxIlBkh28lFqJxleohKqvXPHTdxjp6JEfgLcrYqopFBotRcHdghHWlTRcgzX477kL2+PKF/zl+Dg7YqetuBHqzh3Tpwcga2P4ATXKYDdr9p6BykuyV7uL6+DY+fjgL8CUtipw48fTaAT5oGhv1w8r2EecupwBrfz+B3gp7/N0U3gLfhEEZOn5qF8gKbN8FSbfEX2mc53mai0CndF1wyr2qDUaIRHh4dATD2e3kdftspVmfzJXKitNQyeNYqbCoM97wGScFdgAaIept14BR42HMqGOetWauTr6rUmIgqRjjsug9P9yIO52EN16kCFtYkokcRJ//qrKcRQx8lSppFtBInp8OpcvRiI8vzcTKiFjwd/kiaqTrLyzVccFV5EilOTrXABqcWWrm0RSh0bV25dPLVgZ3tBnNOqmp8gcgtw6txUZ7X2NTLxw3gSNdiIiF4Ai20EfALPvyGokETL/anNInu8ogbrCX91jKeNswcbZFS00gmrlc3xhF8mOevj/jfMV4CKuLwEtAPVf53by6hr1vecXzd8qt+3bLdO6LVF1uxWfJM9P8AXSaTL7YOzfrbuMjHPRR8Gxf3KMlQGhfNA5z6Gm/jDVCLlQn/CDAABzSX6OUW+PUAAAAASUVORK5CYII=");
    background-size: 15px;
    background-repeat: no-repeat;
    background-position: right center;
  }
  #internalTables .innerCustomerGSelect label {
    font-size: 15px;
  }
  #internalTables .innerCustomerGSelect #selects {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 0;
    display: inline-block;
    border-color: rgba(0, 0, 0, 0);
    color: white;
    outline: none;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    padding: 0 20px 0 0;
    margin-top: 0;
    background-color: rgba(255, 170, 72, 0);
    font-size: 15px;
    /**/
  }
  #internalTables .innerCustomerGSelect select option {
    color: #323232;
  }
  /**/
  #internalTables .matteShow {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 1);
    overflow: hidden;
    z-index: 3000;
  }
  /**/
  #internalTables .ListBoxShow {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 1);
    overflow: hidden;
    z-index: 3000;
  }
  .snake-circle {
    height: 14px;
    width: 14px;
    -webkit-animation: snake-rotate 0.8s infinite linear;
    animation: snake-rotate 0.8s infinite linear;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top-color: rgb(252, 199, 127);
    border-left-color: rgb(252, 199, 127);
    border-bottom-color: rgb(252, 199, 127);
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  @keyframes snake-rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  /**/
  .arrowImg {
    width: 8px;
    position: absolute;
    left: 0;
    right: 0px;
    margin: auto;
    bottom: 0;
    top: 0px;
  }
  .arrowImg1 {
    width: 8px;
    position: absolute;
    left: 0px;
    right: 0;
    margin: auto;
    bottom: 0;
    top: 0px;
    transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -o-transform: rotate(180deg);
  }
  /**/
  .splitColor {
    width: 100%;
    height: 7.5px;
    background: #f0f1f5;
  }
  /*权限列表内容部分*/
  .ListBox {
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  .listContent {
    width: 100%;
    height: auto; /*border-bottom: 0.5px solid #e3e3e3;padding:0 12.5px;box-sizing: border-box;*/
    position: relative;
  }
  .titleLine {
    width: 100%;
    height: 50px;
    border-bottom: 0.5px solid #e3e3e3;
  }
  .listTitle {
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #323232;
    display: inline-block;
    height: 100%;
    line-height: 50px;
    width: auto;
    margin-left: 12.5px;
  }
  .arrowDown {
    width: 12px;
    float: right;
    margin-top: 20px;
    margin-right: 12.5px;
  }
  table .duihaoImg {
    transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
  }
  .arrowUp {
    /*transform: rotate(0deg);
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);*/
    transform: rotate(180deg);
    -ms-transform: rotate(180deg);
    -moz-transform: rotate(180deg);
    -webkit-transform: rotate(180deg);
    -o-transform: rotate(180deg);
  }
  .listInfo {
    width: 100%;
    height: auto;
    border-bottom: 0.5px solid #e3e3e3;
    background: #f4f5f8;
    display: none;
    padding: 0 12.5px;
    box-sizing: border-box;
  }
  table {
    border-collapse: collapse;
    font-size: 15px;
    color: #323232;
    table-layout: fixed;
  }
  th {
    font-weight: normal;
    padding: 10px 0;
  }
  table > tr {
    border-bottom: 0.75px solid #e3e3e3;
    height: 40px;
    border-collapse: collapse;
    /*line-height: 40px;*/
    box-sizing: border-box;
  }
  td {
    width: 33%;
    height: 100%;
    overflow: inherit;
    padding: 10px 0;
    /*word-wrap: break-word;*/
    /*white-space: nowrap;*/
  }
  table > tr:last-child {
    border: 0;
  }
  table span {
    display: inline-block;
    width: 15px;
    height: 15px;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA4ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoxOWNkODE0ZS00MGI5LTQ2YTItODBhOC1hNWQ5NmQxMTFkOTQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6REYxNTNDQjk3QjFCMTFFNzg3RjE4QUMyMzUzRDc4NUQiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6REYxNTNDQjg3QjFCMTFFNzg3RjE4QUMyMzUzRDc4NUQiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMDU0YWY2MC1jOGFkLTRkMzEtOWI0Yy00MzE4MDZjOTQ5NjMiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo2NTEyMjQ1OC1iM2QzLTExN2EtYjliOS1jYzg0NTBmYzEwZGIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6golU5AAADUUlEQVR42pyXWUgVURjHz71RCQXatSQkKCpTaEUICUojSL0RUho3KYggUipzgd56MEjoLY1ssR4iooWIyksgGm1q9BBFC8IVqSCiB8vUVltv/zPzHzodnZkzfvCb5cw533/OMt98J5RMJsUoi0f1komgCKwFy8FckMZnQ+AleAhugnZR0vZT+FjIR1g6rwW7wQxhZu/BMdCEFxhyqxT2cFAOEqCeos95vQZkgskkk2X1rDOd1wl0oNy8x/HoBByPgl0s6QL7eTaxVaAB5PP+BNiL3v92F7ZFL4NSMMJhPgWSIpiFQIU13EKkgKsgporrQ91E0SEOX8s4RAUEkqCFPgbp88jYcxyPbsaxCnwDxeCBh+s0zuMGcAi8BffBHO0FpA+5Ur+CPdRQhjoelY56QQbn9qRPnxo5DbpdBFsgqK+bCo5eP8iWq93pcS1Fu1jBz+7xrH+vIy71T4NOatTaPW4tnoTzG34y+XibrjECyFi2jIFFLpxZoAesA69H9dju9Up27J2sL3tcSNFnlqi5PWG0mgdSwSJL1H3BdeP4lFqFjrDgm5vaNq72TwyTqw3bORpFUjiXN52GjQ+Cs7yeykDRyl77maORK4UX8CZh0PAM2A52aOXfwS+D9r08Z4WVNx0waChFZ4OPWvlt8MWgvaORGg4Yk+aDP+CAVn4+aHCTwsO8Tjeo/4LiC5WyzwEWpqMxLIX7eJNj2Fif33MMsyaWzXOfFH6k/M5MPyXVLgQYYedX+VgKd/CmzKBhGX/8QgmZ3fwy9hm0L+W5wxGWq20Jw5rwyUpU61E+k2zPlrbvpQyZ7WGEsh+4aObjBlQIeTTXX2wKeAWug50eoiFmJdKOS82wkgDIX1YBqPQQnqndZ1F0o8GCLGBvm/4lAnY2WM1Kh0Gei4Nr/Hykg1tgK6jzGeI8JfuodjJPPedqtjIFIT6A9T5ZiFfq4/hbgeMNELFS3pK2Krecq4bBIMIwWMnELZjJOY1HK+kjQp817nm1nQXGmJKmMAW6G+Abd+LBHbZNoa+Yd3r7/06inHOTwVKZrF9hFpHgjkEwgc+h4CawmOX9Vi9L2i6NdwtTx3lPN+zxALcwjV5bmFDATVuhsmmbxmeDyqatw8KODZ72V4ABAC8B+W2Xu2m3AAAAAElFTkSuQmCC");
    border-radius: 50%;
    margin-bottom: -2px;
    margin-left: -2px;
    background-size: contain;
  }
  .listZs {
    padding: 0 12.5px;
    color: #8d8d8d;
    box-sizing: border-box;
    font-size: 12px;
  }
  .listZs p:first-child {
    padding: 8px 0;
  }
  .listZs p:last-child {
    padding-bottom: 8px;
  }
  .conList {
    padding: 12px 0 0 0;
    box-sizing: border-box;
    border-top: 0.5px solid #e3e3e3;
  }
  .guizeTile {
    float: left;
    width: 25%;
  }
  .guizeCont {
    width: 100%;
    margin-bottom: 1em;
    text-align: justify;
  }
  .guizeCont p {
    text-indent: 2em;
  }
  /**/
  #internalTables .goCustomer {
    height: 45px;
    width: 45px;
    border: 0;
    box-sizing: border-box;
    display: inline-block;
    background-color: rgba(255, 177, 72, 0.65);
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    position: absolute;
    bottom: 5.18%;
    right: 8.66%;
    color: white;
    font-size: 12px;
    padding: 9px;
    text-align: center;
    line-height: 14px;
  }
  #internalTables .goHome {
    bottom: 15.31%;
    padding-top: 0;
  }
  #internalTables .ans-homeIcon {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAA7CAYAAAAtpUeYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVGRjIwM0ZCNjIyRTExRTc4OTkyRDI5QTE5QUFCMDIwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVGRjIwM0ZDNjIyRTExRTc4OTkyRDI5QTE5QUFCMDIwIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NUZGMjAzRjk2MjJFMTFFNzg5OTJEMjlBMTlBQUIwMjAiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NUZGMjAzRkE2MjJFMTFFNzg5OTJEMjlBMTlBQUIwMjAiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7qSSpMAAADTUlEQVR42uyaWWgTQRjHN6GtWsWzFvVBgg/BIhEaES+kD634ICLWE1ErYh88gihIRRAUqQf0QRGlHlQEDxAULbaIiD6IQsUWRERUCipWpVC1BVvRNut/cBaWsDOzNXvMJPPBD5LM7uw3PzLH7mzENE0j5BgJLoO19PstUAu+hZVQJGQpU8B9kMj4/T1YCt6GkVQ0RCFJ8MJBCIkYaAcL8knKEtAGSjnHjAFPwLJ8kLKedpkCN90b3AVbclnKbnCdUTYEBhlll0BdYFmSgTYgjprs6AdlYCb4yTnuZBC5BiWkidPQzyBhO3YW+Mg5/obqUgpBK6eBHaDU4bwJoI1z3mMwTkUpk2mjWdFCpbHOj4JmzvmdIKaSlATtFqy4OIy6Gjn19ICkClIW04GTFfX/UedhTn2/QZXMUqpNfqSyqHuHoO4NMkrZLkh6nQfXWC24xl6ZpBziJDoAKj2UXwF6OddrkEEKbyDsyliDeEWczj6suBaWFDJl3uEk1g5KfJzyyTrlKef6j0BxkFImgeechFoFaxAvuc3J4w2YFoSUuGAZ3hTg/ZTFOU4+X+itg29S5oE+TgLHQxBicURww1nhh5TlgulwT4hCLFKCHNd4KWWrj4syr6nNNlc3FzlgiiMmkZSpLvI9xqtD9OTtNKh3+VRelnCTy366rTLsx5E3wS4jd2MzeOD0rNhJynjwDFQbuR+VoAOU8KRY+y1zGZVcAS8VbPxrcJVRlqBtjjtJSdLCGYyTD4JNoEhBKaPBRrCPUT6dtn2h/Wn+IjDEGa3rbKNzt0P5fIlmn3KH/H6AIlq+UzAzVVn/lLOcQZcYPmEzPqjgP4XsKY2ln8+AFfQ3p2iM2hqbGQN0ILL3RVPhQTVt+9xMu8p3h+NGWFLI1PvHVvAOzAEPc3jmITNsOXiV8XvKmqPvgTKwEvSDCxmScjU+gNlgG+1eLWSmsi9cOkGDkX9ButV5Wd5PkTa0FC1FS9FStBQtRUvRUrQULUVL0VK0FC1Fh5aipWgp0khJS9SmtCxSuiSS8snIciumwKNEToFuUBiyELJRNzHbSrySskqBoSLiZ/cpVnDsHOXnmPIL9CkohWzw9folhYzsNeCrQkJ6jH+vkLh+MeCvAAMAf1XzDjMmclkAAAAASUVORK5CYII=");
    background-repeat: no-repeat;
    background-size: contain;
    height: 18px;
    width: 21px;
    margin: 5px auto 0 auto;
  }
  #internalTables .ans-homeText {
    font-size: 11px;
    margin-top: 2px;
    color: white;
  }
  /*更多详细信息页面*/
  .moreInfo {
    width: 89%;
    height: 69%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    margin: auto;
    z-index: 1055;
  }
  .infoBox {
    width: 100%;
    height: 91%;
    background: #fff;
    border-radius: 3px;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .infoClose {
    width: 100%;
    height: 9%;
    margin-top: 10%;
    position: relative;
  }
  .closeButton {
    width: 40px;
    height: 40px; /*34px*/
    border-radius: 50%;
    text-align: center;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/close2.png");
    background-size: cover;
    position: absolute;
    left: 0;
    right: 0;
    margin: 0 auto;
    bottom: 0;
  }
  .infoShadow {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    position: fixed;
    left: 0;
    top: 0;
    z-index: -22;
    display: none;
  }
  /*弹出框*/
  .msBox, .jsBox, .bzBox {
    padding: 0 10px;
    box-sizing: border-box;
  }
  .jsbzContent {
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }
  .title {
    width: 100%;
    height: 50px;
    border-bottom: 0.5px solid #e3e3e3;
    box-sizing: border-box;
    line-height: 50px;
    text-align: center;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #323232;
  }
  .hLine {
    background: #f0f1f5;
    width: 100%;
    height: 7.5px;
  }
  .content {
    padding: 15px 0;
    font-size: 14px;
    color: #323232;
    box-sizing: border-box;
    line-height: 22px;
    text-align: justify;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  /*友好界面*/
  .error {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9999;
    background: #fff;
  }
  .errBox {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: auto;
    height: 50%;
  }
  .errBox img {
    display: block;
    width: 110px;
    height: 100px;
    margin: 0 auto;
  }
  .errBox .errText {
    color: #ffb148;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    display: block;
    text-align: center;
    margin: 35px auto 20px;
  }
  .errBox .buttonBox {
    width: 90px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #fff;
    background: #ffb148;
    margin: 0 auto;
    border-radius: 2px;
  }
</style>
