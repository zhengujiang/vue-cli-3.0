<template>
  <div id="customerTables" class="customerTables">
    <div class="customerScroll" id="customerScroll">
      <div class="customerHeader">
        <div class="customertis" v-if="sourceTypes == 0">
          <div class="customerMid">
            <p class="customer_p customer_pp"><img :src="lightImg" alt=""><span>{{XGText}}</span></p>
            <p class="customer_p2 customer_p2p">{{XGText2}}<span>{{yareDate+"年年度经审计年报"}}</span></p>
          </div>
        </div>
        <div class="customertis" v-else>
          <div>
            <p class="customer_p"><img :src="lightImg" alt=""><span>{{XGText}}</span></p>
            <p class="customer_p2">{{XGText2}}<span>{{Custom}}</span></p>
            <p class="customer_p3">{{XGText3}}{{format(UpToDate)}}</p>
            <p class="customer_p3">{{ XGText4 }}</p>
          </div>
        </div>
      </div>
      <div class="customerFoo"></div>
      <div class="customerContent">
        <!-- 总资产 -->
        <div v-show="stockMarketTotalAssets">
          <label for="totalAssets">{{totalAssetsName}}</label>
          <div class="customer_input">
            <span>{{ dateText }}</span>
            <input type="text" id="YtotalAssets" class="tuColor" @focus="focusColor($event)"
                   @blur="blurColor($event)" v-model="YtotalAssetsVal"
                   :placeholder="YtotalAssetsVals" maxlength="17">
            <b>{{unit}}</b>
          </div>
          <div class="customer_input new">
            <span>{{ dateTextY }}</span>
            <input type="text" id="totalAssets" class="tuColor" @focus="focusColor($event)"
                   @blur="blurColor($event)" v-model="totalAssetsVal"
                   :placeholder="totalAssetsVals" maxlength="17">
            <b>{{ unit }}</b>
          </div>
        </div>
        <!-- 归母净资产 -->
        <div v-show="stockMarketNetAssets">
          <label for="netAssets">{{netAssetsName}}</label>
          <div class="customer_input">
            <span>{{ dateText }}</span>
            <input type="text" id="YnetAssets" class="tuColor" @focus="focusColor($event)"
                   @blur="blurColor($event)"
                   v-model="YnetAssetsVal"
                   :placeholder="YnetAssetsVals" maxlength="17">
            <b>{{unit}}</b>
          </div>
          <div class="customer_input new">
            <span>{{ dateTextY }}</span>
            <input type="text" id="netAssets" class="tuColor" @focus="focusColor($event)"
                   @blur="blurColor($event)"
                   v-model="netAssetsVal"
                   :placeholder="netAssetsVals" maxlength="17">
            <b>{{unit}}</b>
          </div>
        </div>
        <div v-show="stockMarketNetProfit">
          <label for="netProfit">{{netProfitName}}</label>
          <div class="customer_input">
            <span>{{ dateTextY }}</span>
            <input type="text" id="netProfit" class="tuColor" @focus="focusColor($event)"
                   @blur="blurColor($event)"
                   v-model="netProfitVal"
                   :placeholder="netProfitVals" maxlength="17">
            <b>{{unit}}</b>
          </div>
        </div>
        <div v-show="stockMarketTotalIncome">
          <label for="totalIncome">{{totalIncomeName}}</label>
          <div class="customer_input">
            <span>{{ dateTextY }}</span>
            <input type="text" id="totalIncome" class="tuColor" @focus="focusColor($event)"
                   @blur="blurColor($event)" v-model="totalIncomeVal"
                   :placeholder="totalIncomeVals" maxlength="17">
            <b>{{unit}}</b>
          </div>
        </div>
        <div v-show="stockMarketIncome">
          <label for="income">{{incomeName}}</label>
          <div class="customer_input">
            <span>{{ dateTextY }}</span>
            <input type="text" id="income" class="tuColor" @focus="focusColor" @blur="blurColor($event)"
                   v-model="incomeVal" :placeholder="incomeVals" maxlength="17">
            <b>{{unit}}</b>
          </div>
        </div>
        <div v-show="stockMarketBusinessIncome">
          <label for="businessIncome">{{businessIncomeName}}</label>
          <div class="customer_input">
            <span>{{ dateTextY }}</span>
            <input type="text" id="businessIncome" class="tuColor" @focus="focusColor"
                   @blur="blurColor($event)"
                   v-model="businessIncomeVal"
                   :placeholder="businessIncomeVals" maxlength="17">
            <b>{{unit}}</b>
          </div>
        </div>
        <div v-show="stockMarketCosts">
          <label for="costs">{{costsName}}</label>
          <div class="customer_input">
            <span>{{ dateTextY }}</span>
            <input type="text" id="costs" class="tuColor" @focus="focusColor($event)"
                   @blur="blurColor($event)"
                   v-model="costsVal" :placeholder="costsVals" maxlength="17">
            <b>{{unit}}</b>
          </div>
        </div>
      </div>
    </div>
    <div class="customerFooter" v-show="showFooter">
      <button @click="sustain()">重置</button>
      <button class="" @click="keep()">保存</button>
    </div>
    <!---->
    <div class="matteShow" v-show="matteSh">
      <div class="snake-circle rules-circle"></div>
    </div>
    <!---->
    <xiaoan-error v-show="getError"></xiaoan-error>
    <v-returnHome routeUrl="My"></v-returnHome>
  </div>
</template>

<script>
  import returnHome from "@/components/warning/returnHome.vue"

  export default {
    name: 'customerTables',
    data() {
      return {
        lightImg: this.$image.lookupTables.totle,
        XGText: "信公提示",
        XGText2: "数据来源：",
        XGText3: "数据更新于",
        XGText4: "请使用最近一年、最近一期经审计的财务数据",
        dateText: "期末",
        dateTextY: "年末",
        Custom: "用户自定义",
        XGDate: "7月30日",
        user_Id: '',
        inp: '',
        showFooter: true,
        UpToDate: '',
        IncomeId: '',
        unit: '元',//单位‘元’
        yareDate: '',
        totalAssetsName: '总资产',
        totalAssetsVal: "",
        totalAssetsVals: '',
        YtotalAssetsVal: "",
        YtotalAssetsVals: "",
        netAssetsName: '归母净资产',
        netAssetsVal: "",
        netAssetsVals: '',
        YnetAssetsVal: "",
        YnetAssetsVals: "",
        netProfitName: '归母净利润',
        netProfitVal: "",
        netProfitVals: '',
        totalIncomeName: '营业总收入',
        totalIncomeVal: "",
        totalIncomeVals: '',
        incomeName: '营业收入',
        incomeVal: "",
        incomeVals: '',
        businessIncomeName: '主营收入',
        businessIncomeVal: "",
        businessIncomeVals: '',
        costsName: '营业成本',
        costsVal: "",
        costsVals: '',
        totle: false,
        sourceTypes: '',
        restat: true,
        matteSh: false,
        stockMarkets: '',
        stockMarketTotalAssets: true,
        stockMarketNetAssets: true,
        stockMarketNetProfit: true,
        stockMarketTotalIncome: true,
        stockMarketIncome: true,
        stockMarketBusinessIncome: true,
        stockMarketCosts: true,

        getError: false,
        userInfo: {}
      }
    },
    watch: {
      '$route'(to, from) {
        console.log("window.location.reload();", to, from);
        window.location.reload();
      }
    },
    updated() {
      this.Hheight();
    },
    created() {
      if (this.$cookie.getUserInfo()) {
        this.userInfo = this.$cookie.getUserInfo();
      }
      var user_id = this.$cookie.getCookie("userId");
      this.user_Id = user_id;
      console.log('userId=', user_id, "sadasda", this.user_Id.length, this.$cookie.getCookie("userId"));
      if (this.$cookie.isLogin()) {
      } else {
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
    },
    mounted() {
      this.customerGlobal();
      /*this.iosAn();*/ // 引入rem布局
      var ar = window.location.href;
      var ars = ar.split("#/");
      var sharelink2 = ars[0] + "#/lookupTables";//分享链接
      var adverttitle = "信公小安，秒查披露权限，点击体验“快”感！";
      var shareDesc = "覆盖沪深两市，信息披露权限速查速算智能处理，嗖的一下！";//描述
      /**/
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
    },
    components: {
      "v-returnHome": returnHome,
    },
    methods: {
      waringBin() {
        window.location.reload();
      },
      iosAn() {
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        console.log('是否是iOS：', isiOS, '是否是Android：', isAndroid);
        if (isAndroid == true) {
          $("#customerTables .customerContent .customer_input").css({"width": "69%"});
          $("#customerTables .customerContent label").css({"width": "31%"});
        } else {
          $("#customerTables .customerContent .customer_input").css({"width": "72%"});
          $("#customerTables .customerContent label").css({"width": "28%"});
        }
        var min = document.body.clientHeight;
        var max = document.body.clientWidth;
        if (max < 360) {
          $("#customerTables .customerContent .customer_input").css({"width": "65%"});
          $("#customerTables .customerContent label").css({"width": "35%"});
        }

      },
      //
      add0(m) {
        return m < 10 ? '0' + m : m
      },
      format(shijianchuo) {
        //shijianchuo是整数，否则要parseInt转换
        var time = new Date(parseInt(shijianchuo));
        var y = time.getFullYear();
        var m = time.getMonth() + 1;
        var d = time.getDate();
        return y + '年' + this.add0(m) + '月' + this.add0(d) + '日';
      },
      //
      Hheight() {
        if (this.showFooter == true) {
          var hei = document.body.clientHeight;
          var ghg = (hei - 51) + "px"
          document.querySelector(".customerScroll").style.height = ghg;
        } else {
          var hei = document.body.clientHeight;
          var ghg = (hei - 0) + "px"
          document.querySelector(".customerScroll").style.height = ghg;
        }
      },
      //
      react() {
        let params = {}
        this.$axios.permission.resetAnnualReport(params).then(res => {
          if (res.data.returnCode == 1) {
            this.totalAssetsVals = this.fmoney(this.totalAssetsVal);
            this.YtotalAssetsVals = this.fmoney(this.YtotalAssetsVal);
            this.netAssetsVals = this.fmoney(this.netAssetsVal);
            this.YnetAssetsVals = this.fmoney(this.YnetAssetsVal);
            this.netProfitVals = this.fmoney(this.netProfitVal);
            this.totalIncomeVals = this.fmoney(this.totalIncomeVal);
            this.incomeVals = this.fmoney(this.incomeVal);
            this.costsVals = this.fmoney(this.costsVal);
            this.businessIncomeVals = this.fmoney(this.businessIncomeVal);
          }
        }).catch((err) => {

        })
      },
      //permission/getAnnualReport
      customerGlobal() {
        let params ={
          companyId: this.userInfo.enterpriseUser ? this.userInfo.companyId : '',
          companyCode: this.userInfo.enterpriseUser ? '' : this.userInfo.companyCode
        }
        this.$axios.permission.getAnnualReport(params).then(res => {
          console.log("customerGlobal", res);
          if (res.data.returnCode == 1) {

            this.IncomeId = res.data.returnObject.id;
            this.UpToDate = res.data.returnObject.updateTime;
            this.yareDate = res.data.returnObject.year;
            this.sourceTypes = res.data.returnObject.sourceType;
            this.stockMarkets = res.data.returnObject.stockMarket;
            console.log("stockMarkets", this.stockMarkets);
            /**/
            /* this.totalAssetsVal = res.data.returnObject.totalAssets;
             this.netAssetsVal = res.data.returnObject.netAssets;
             this.netProfitVal = res.data.returnObject.netProfit;
             this.totalIncomeVal = res.data.returnObject.totalOperatingIncome;
             this.incomeVal = res.data.returnObject.operatingIncome;
             this.costsVal = res.data.returnObject.operatingCost;
             this.businessIncomeVal = res.data.returnObject.mainBusinessIncome;*/
            /**/
            this.totalAssetsVals = res.data.returnObject.totalAssets;
            this.YtotalAssetsVals = res.data.returnObject.latestIssueTotalAssets;
            this.netAssetsVals = res.data.returnObject.netAssets;
            this.YnetAssetsVals = res.data.returnObject.latestIssueNetAssets;
            this.netProfitVals = res.data.returnObject.netProfit;
            this.totalIncomeVals = res.data.returnObject.totalOperatingIncome;
            this.incomeVals = res.data.returnObject.operatingIncome;
            this.costsVals = res.data.returnObject.operatingCost;
            this.businessIncomeVals = res.data.returnObject.mainBusinessIncome;
            this.totalAssetsVals = this.fmoney(this.totalAssetsVals);
            this.YtotalAssetsVals = this.fmoney(this.YtotalAssetsVals);
            this.netAssetsVals = this.fmoney(this.netAssetsVals);
            this.YnetAssetsVals = this.fmoney(this.YnetAssetsVals);
            this.netProfitVals = this.fmoney(this.netProfitVals);
            this.totalIncomeVals = this.fmoney(this.totalIncomeVals);
            /* this.incomeVals = this.fmoney(this.incomeVals);*/
            this.costsVals = this.fmoney(this.costsVals);
            this.businessIncomeVals = this.fmoney(this.businessIncomeVals);

            //console.log("this.sourceTypes", this.netAssetsVal, this.fmoney(this.totalAssetsVal));
            this.totalAssetsVal = "";
            this.YtotalAssetsVal = "";
            this.netAssetsVal = "";
            this.YnetAssetsVal = "";
            this.netProfitVal = "";
            this.totalIncomeVal = "";
            //this.incomeVal = "";
            this.costsVal = "";
            this.businessIncomeVal = "";
            /*this.totalAssetsVal = this.fmoney(this.totalAssetsVal);
            this.netAssetsVal = this.fmoney(this.netAssetsVal);
            this.netProfitVal = this.fmoney(this.netProfitVal);
            this.totalIncomeVal = this.fmoney(this.totalIncomeVal);
            this.incomeVal = this.fmoney(this.incomeVal);
            this.costsVal = this.fmoney(this.costsVal);
            this.businessIncomeVal = this.fmoney(this.businessIncomeVal);*/
            /**/
            console.log("stockMarkets", this.stockMarkets);
            /*todo
            *  stockMarketTotalAssets: true,//资产总
                stockMarketNetAssets: true,//净资产
                stockMarketNetProfit: true,//净利润
                stockMarketTotalIncome: true,//营业总
                stockMarketIncome: true,//营业收
                stockMarketBusinessIncome: true,//主营
                stockMarketCosts: true,//成本
            * */
            if (this.stockMarkets == "SH") {
              this.stockMarketIncome = false;//营业收入
              this.stockMarketBusinessIncome = false;
            } else if (this.stockMarkets == "SZ" || this.stockMarkets == "CY") {
              this.stockMarketIncome = false;
              this.stockMarketCosts = false;
            } else if (this.stockMarkets == "ZX") {
              this.stockMarketBusinessIncome = false;
              this.stockMarketCosts = false;
              // this.stockMarketTotalIncome = false;
              this.stockMarketIncome = false;//营业收入
            } else {
              this.$vux.toast.show({text: '未知错误', position: 'middle', type: 'text', width: 'auto', time: 1000});
            }
            /**/
          } else if (res.data.returnCode == -1 || res.data.returnCode == -3) {
            this.sourceTypes = 1;
            this.totalAssetsVals = 0;
            this.YtotalAssetsVals = 0;
            this.netAssetsVals = 0;
            this.YnetAssetsVals = 0;
            this.netProfitVals = 0;
            this.totalIncomeVals = 0;
            this.incomeVals = 0;
            this.costsVals = 0;
            this.businessIncomeVals = 0;
            var timestamp = Date.parse(new Date());
            this.UpToDate = timestamp;
            this.restat = false;
          } else if (res.data.returnCode == 0) {
            this.IncomeId = res.data.returnObject.id;
            this.UpToDate = res.data.returnObject.updateTime;
            this.yareDate = res.data.returnObject.year;
            this.sourceTypes = res.data.returnObject.sourceType;
            this.stockMarkets = res.data.returnObject.stockMarket;
            console.log("stockMarkets", this.stockMarkets);
            /**/
            this.totalAssetsVals = res.data.returnObject.totalAssets;
            this.YtotalAssetsVal = res.data.returnObject.latestIssueTotalAssets;
            this.netAssetsVals = res.data.returnObject.netAssets;
            this.YnetAssetsVals = res.data.returnObject.latestIssueNetAssets;
            this.netProfitVals = res.data.returnObject.netProfit;
            this.totalIncomeVals = res.data.returnObject.totalOperatingIncome;
            this.incomeVals = res.data.returnObject.operatingIncome;
            this.costsVals = res.data.returnObject.operatingCost;
            this.businessIncomeVals = res.data.returnObject.mainBusinessIncome;
            this.totalAssetsVals = this.fmoney(this.totalAssetsVals);
            this.netAssetsVals = this.fmoney(this.netAssetsVals);
            this.netProfitVals = this.fmoney(this.netProfitVals);
            this.totalIncomeVals = this.fmoney(this.totalIncomeVals);
            /* this.incomeVals = this.fmoney(this.incomeVals);*/
            this.costsVals = this.fmoney(this.costsVals);
            this.businessIncomeVals = this.fmoney(this.businessIncomeVals);

            /**/
            console.log("43534534");
            //console.log("this.sourceTypes", this.netAssetsVal, this.fmoney(this.totalAssetsVal));
            this.totalAssetsVal = "";
            this.YtotalAssetsVal = "";
            this.netAssetsVal = "";
            this.YnetAssetsVal = "";
            this.netProfitVal = "";
            this.totalIncomeVal = "";
            //this.incomeVal = "";
            this.costsVal = "";
            this.businessIncomeVal = "";
            /**/
            console.log("stockMarkets", this.stockMarkets);
            /*todo
            *  stockMarketTotalAssets: true,//资产总
                stockMarketNetAssets: true,//净资产
                stockMarketNetProfit: true,//净利润
                stockMarketTotalIncome: true,//营业总
                stockMarketIncome: true,//营业收
                stockMarketBusinessIncome: true,//主营
                stockMarketCosts: true,//成本
            * */
            if (this.stockMarkets == "SH") {
              this.stockMarketIncome = false;//营业收入
              this.stockMarketBusinessIncome = false;
            } else if (this.stockMarkets == "SZ" || this.stockMarkets == "CY") {
              this.stockMarketIncome = false;
              this.stockMarketCosts = false;
            } else if (this.stockMarkets == "ZX") {
              this.stockMarketBusinessIncome = false;
              this.stockMarketCosts = false;
              // this.stockMarketTotalIncome = false;
              this.stockMarketIncome = false;//营业收入
            } else {
              this.$vux.toast.show({text: '未知错误', position: 'middle', type: 'text', width: 'auto', time: 1000});
            }
            let _this = this;
            this.$vux.confirm.show({
              title: '',
              content: '是否获取最新年报数据，所有修改的数据将丢失，你确定要继续吗？',
              // 组件除show外的属性
              onConfirm() {
                _this.restArr();
              },
              onCancel() {
              }
            });
          } else {
            this.$vux.toast.show({text: '未知错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
          this.getError = true;
        })
      },
      //保存
      keep() {
        if (this.totalAssetsVal.trim().length !== 0 || this.YtotalAssetsVal.trim().length !== 0 || this.netAssetsVal.trim().length !== 0 || this.YnetAssetsVal.trim().length !== 0 || this.netProfitVal.trim().length !== 0 || this.totalIncomeVal.trim().length !== 0 || this.incomeVal.trim().length !== 0 || this.businessIncomeVal.trim().length !== 0 || this.costsVal.trim().length !== 0) {
          if (this.rmoney(this.totalAssetsVal) !== this.rmoney(this.totalAssetsVals) || this.rmoney(this.YtotalAssetsVal) !== this.rmoney(this.YtotalAssetsVals) || this.rmoney(this.netAssetsVal) !== this.rmoney(this.netAssetsVals) || this.rmoney(this.YnetAssetsVal) !== this.rmoney(this.YnetAssetsVals) || this.rmoney(this.netProfitVal) !== this.rmoney(this.netProfitVals) || this.rmoney(this.totalIncomeVal) !== this.rmoney(this.totalIncomeVals) || this.rmoney(this.incomeVal) !== this.rmoney(this.incomeVals) || this.rmoney(this.businessIncomeVal) !== this.rmoney(this.businessIncomeVals) || this.rmoney(this.costsVal) !== this.rmoney(this.costsVals)) {
            this.sourceTypes = 1;
            let params = {
                id: this.IncomeId,
                year: this.yareDate,
                totalAssets: this.rmoney(this.totalAssetsVal),
                latestIssueTotalAssets: this.rmoney(this.YtotalAssetsVal),
                netAssets: this.rmoney(this.netAssetsVal),
                latestIssueNetAssets: this.rmoney(this.YnetAssetsVal),
                netProfit: this.rmoney(this.netProfitVal),
                totalOperatingIncome: this.rmoney(this.totalIncomeVal),
                //operatingIncome: this.rmoney(this.incomeVal),
                operatingCost: this.rmoney(this.costsVal),
                mainBusinessIncome: this.rmoney(this.businessIncomeVal),
                sourceType: this.sourceTypes,
              }
            this.$axios.permission.saveAnnualReport(params).then(res => {
              if (res.data.returnCode = 1) {
                this.yareDate = "";
                this.matteSh = true;
                setTimeout(() => {
                  this.matteSh = false;
                  this.$vux.toast.show({text: '保存成功', position: 'middle', type: 'text', width: 'auto', time: 1000});
                }, 600)
                console.log("不等于保存1", res, this.toDate());
              }
            }).catch(() => {
            })
          } else {
            if (this.totle == true) {
              this.sourceTypes = 0;
              this.matteSh = true;
              setTimeout(() => {
                let params = {
                    id: this.IncomeId,
                    year: this.yareDate,
                    totalAssets: this.rmoney(this.totalAssetsVal),
                    latestIssueTotalAssets: this.rmoney(this.YtotalAssetsVal),
                    netAssets: this.rmoney(this.netAssetsVal),
                    latestIssueNetAssets: this.rmoney(this.YnetAssetsVal),
                    netProfit: this.rmoney(this.netProfitVal),
                    totalOperatingIncome: this.rmoney(this.totalIncomeVal),
                    //operatingIncome: this.rmoney(this.incomeVal),
                    operatingCost: this.rmoney(this.costsVal),
                    mainBusinessIncome: this.rmoney(this.businessIncomeVal),
                    sourceType: this.sourceTypes,
                  }
                this.$axios.permission.saveAnnualReport(params).then(res => {
                  if (res.data.returnCode = 1) {
                    console.log("等于保存2", res);
                    this.matteSh = false;
                    this.totle = false;
                    this.$vux.toast.show({text: '保存成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
                  }
                }).catch((err) => {
                  setTimeout(() => {
                    this.$nextTick(() => {
                      this.matteSh = false;
                      window.location.reload();
                    })
                  }, 1000)

                })
              }, 500);
            } else {
              this.matteSh = true;
              setTimeout(() => {
                this.$nextTick(() => {
                  this.matteSh = false;
                  console.log("4567456765756", this.totalAssetsVal, this.totalAssetsVals);
                  this.$vux.toast.show({text: '编辑后保存', position: 'middle', type: 'text', width: 'auto', time: 2500});
                  //this.$router.push({path: '/lookupTables'});
                })
              }, 600)
            }
          }
        } else {
          this.$vux.toast.show({text: '编辑后保存', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
      },
      toDate() {
        var d = new Date();
        var str = d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日";
        return str
      },
      //强制输入0-9和点
      rmoney(number) {
        if (number.length <= 0) {
          return (number == '' ? '' : number);
        } else {
          var ret = (number + "").replace(/[^\d\.-]/g, "");
          return parseFloat(ret);
        }
      },
      ImpArr(array) {
        for (let i = 0; i < array.length; i++) {
          if (array[i] === "" || typeof(array[i]) === "undefined") {
            array.splice(i, 1);
            i = i - 1;
          }
        }
      },
      fmoney(number) {
        number = String(number);
        var ngmer = '';
        number = number.replace(/\,/g, "");
        //console.log(number);
        if (isNaN(number) || number == "") {
          number = "";
        } else {
          number = Math.round(number * 100) / 100;
          if (number < 0) {
            ngmer = ('-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0));
          } else {
            ngmer = (this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0));
          }
        }
        return ngmer
      },
      //格式化金额
      outputdollars(number) {
        var mod, output
        if (number.length <= 3) {
          return (number == '' ? '' : number);
        } else {
          mod = number.length % 3;
          output = (mod == 0 ? '' : (number.substring(0, mod)));
          for (var i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0)) {
              output += number.substring(mod + 3 * i, mod + 3 * i + 3);
            } else {
              output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
          }
          return (output);
        }
      },
      outputcents(amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100);
        return (amount < 10 ? '.0' + amount : '.' + amount);
      },
      /*金额补充单位*/
      // 重置年报数据
      restArr() {
        let params = {}
        this.$axios.permission.resetAnnualReport(params).then(res => {
          if (res.data.returnCode == 1) {
            console.log("重置年报数据permission/resetAnnualReport", res);
            var totalAssetsVal = res.data.returnObject.totalAssets;
            var YtotalAssetsVal = res.data.returnObject.latestIssueTotalAssets;
            var netAssetsVal = res.data.returnObject.netAssets;
            var YnetAssetsVal = res.data.returnObject.latestIssueNetAssets;
            var netProfitVal = res.data.returnObject.netProfit;
            var totalIncomeVal = res.data.returnObject.totalOperatingIncome;
            //var incomeVal = res.data.returnObject.operatingIncome;
            var costsVal = res.data.returnObject.operatingCost;
            var businessIncomeVal = res.data.returnObject.mainBusinessIncome;
            //this.UpToDate = res.data.returnObject.updateTime;
            this.yareDate = res.data.returnObject.year;
            /**/
            this.totalAssetsVal = "";
            this.totalAssetsVals = this.fmoney(totalAssetsVal);
            this.YtotalAssetsVal = "";
            this.YtotalAssetsVals = this.fmoney(YtotalAssetsVal);

            this.netAssetsVal = "";
            this.netAssetsVals = this.fmoney(netAssetsVal);
            this.YnetAssetsVal = "";
            this.YnetAssetsVals = this.fmoney(YnetAssetsVal);

            this.netProfitVal = "";
            this.netProfitVals = this.fmoney(netProfitVal);
            this.totalIncomeVal = "";
            this.totalIncomeVals = this.fmoney(totalIncomeVal);
            // this.incomeVal = "";
            // this.incomeVals = this.fmoney(incomeVal);
            this.costsVal = "";
            this.costsVals = this.fmoney(costsVal);
            this.businessIncomeVal = "";
            this.businessIncomeVals = this.fmoney(businessIncomeVal);
            this.totle = false;//控制重置
            //this.matteSh = false;
            this.sourceTypes = 0;
            let params = {
                id: this.IncomeId,
                year: this.yareDate,
                totalAssets: totalAssetsVal,
                latestIssueTotalAssets: YtotalAssetsVal,
                netAssets: netAssetsVal,
                latestIssueNetAssets: YnetAssetsVal,
                netProfit: netProfitVal,
                totalOperatingIncome: totalIncomeVal,
                //operatingIncome: incomeVal,
                operatingCost: costsVal,
                mainBusinessIncome: businessIncomeVal,
                sourceType: this.sourceTypes,
              }
            this.$axios.permission.saveAnnualReport(params).then(res => {
              if (res.data.returnCode = 1) {
                this.matteSh = true;
                setTimeout(() => {
                  this.matteSh = false;
                  this.$vux.toast.show({text: '重置成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
                }, 300)
              }
            }).catch(() => {
            })
          } else {
            this.matteSh = false;
            this.$vux.toast.show({text: '暂无本公司年报数据', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {
        })
      },
      //
      focusColor(event) {
        var el = event.currentTarget;
        //console.log(el);
        var elId = $(el)[0].id;
        /*$(el).val();*/
        if (elId == "totalAssets") {
          //this.totalAssetsVal = "";
          this.totalAssetsVal = this.rmoney($(el).val());
          this.totalAssetsVals = this.rmoney(this.totalAssetsVals);
          //console.log("totalAssets", this.totalAssetsVal);
        } else if (elId == "YtotalAssets") {
          // 总资产最近一年
          this.YtotalAssetsVal = this.rmoney($(el).val());
          this.YtotalAssetsVals = this.rmoney(this.YtotalAssetsVals);

        } else if (elId == "YnetAssets") {
          // 归母净资产最近一年
          this.YnetAssetsVal = this.rmoney($(el).val());
          this.YnetAssetsVals = this.rmoney(this.YnetAssetsVals);

        } else if (elId == "netAssets") {
          this.netAssetsVal = this.rmoney($(el).val());
          this.netAssetsVals = this.rmoney(this.netAssetsVals);
          //console.log("netAssets");
        } else if (elId == "netProfit") {
          this.netProfitVal = this.rmoney($(el).val());
          this.netProfitVals = this.rmoney(this.netProfitVals);
          //console.log("netProfit");
        } else if (elId == "totalIncome") {
          this.totalIncomeVal = this.rmoney($(el).val());
          this.totalIncomeVals = this.rmoney(this.totalIncomeVals);
          //console.log("totalIncome");
        } else if (elId == "income") {
          this.incomeVal = this.rmoney($(el).val());
          this.incomeVals = this.rmoney(this.incomeVals);
          //console.log("income");
        } else if (elId == "costs") {
          this.costsVal = this.rmoney($(el).val());
          this.costsVals = this.rmoney(this.costsVals);
          //console.log("costs");
        } else {
          this.businessIncomeVal = this.rmoney($(el).val());
          this.businessIncomeVals = this.rmoney(this.businessIncomeVals);
          //console.log("businessIncome");
        }
        $(el).parent().css({'border': "1px solid #ffc87d", "color": "#aaaaaa"});
        $(el).parent().find('span').css({'color': "#ffb148"});
        $(el).css({"color": "#aaaaaa"});
        $(el).removeClass("tuColor");
        $(el).next("b").css({"color": "#aaaaaa"});

        //var top = $(el).offset().top;
        //console.log(top);
        this.androidTop(elId);
        //$(el).animate({scrollTop: "100px"});
      },
      blurColor(event) {
        var el = event.currentTarget;
        var elId = $(el)[0].id;
        console.log(elId);
        if (elId == "totalAssets") {
          this.totalAssetsVal = this.fmoney($(el).val().trim());
          this.totalAssetsVals = this.fmoney(this.totalAssetsVals);
          //console.log("totalAssets", this.totalAssetsVal);
        } else if (elId == "YtotalAssets") {
          // 总资产最近一年
          this.YtotalAssetsVal = this.fmoney($(el).val().trim());
          this.YtotalAssetsVals = this.fmoney(this.YtotalAssetsVals);

        } else if (elId == "YnetAssets") {
          // 归母净资产最近一年
          this.YnetAssetsVal = this.fmoney($(el).val().trim());
          this.YnetAssetsVals = this.fmoney(this.YnetAssetsVals);

        } else if (elId == "netAssets") {
          this.netAssetsVal = this.fmoney($(el).val().trim());
          this.netAssetsVals = this.fmoney(this.netAssetsVals);
          //console.log("netAssets");
        } else if (elId == "netProfit") {
          this.netProfitVal = this.fmoney($(el).val().trim());
          this.netProfitVals = this.fmoney(this.netProfitVals);
          //console.log("netProfit");
        } else if (elId == "totalIncome") {
          this.totalIncomeVal = this.fmoney($(el).val().trim());
          this.totalIncomeVals = this.fmoney(this.totalIncomeVals);
          //console.log("totalIncome");
        } else if (elId == "income") {
          this.incomeVal = this.fmoney($(el).val().trim());
          this.incomeVals = this.fmoney(this.incomeVals);
          //console.log("income");
        } else if (elId == "costs") {
          this.costsVal = this.fmoney($(el).val().trim());
          this.costsVals = this.fmoney(this.costsVals);
          //console.log("costs");
        } else {
          this.businessIncomeVal = this.fmoney($(el).val().trim());
          this.businessIncomeVals = this.fmoney(this.businessIncomeVals);
          //console.log("businessIncome");
        }
        $(el).parent().css({"border": "1px solid #e3e3e3"});
        $(el).parent().find('span').css({'color': "#8d8d8d"});
        $(el).css({"color": "#323232"});
        $(el).addClass("tuColor");
        $(el).next("b").css({"color": "#323232"});
      },
      sustain() {
        if (this.restat == true) {
          let _this = this;
          this.$vux.confirm.show({
            title: '',
            content: '将重置为最新年报数据，所有修改的数据将丢失，你确定要继续吗？',
            // 组件除show外的属性
            onConfirm() {
              _this.matteSh = true;
              setTimeout(() => {
                _this.restArr();
              }, 300)
            },
            onCancel() {
            }
          })
        } else {
        }
      },
      //panduanandroid
      androidTop(id) {
        var u = navigator.userAgent, app = navigator.appVersion;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        console.log('是否是iOS：', isiOS, '是否是Android：', isAndroid);
        // console.log(u);// console.log(app);
        if (isAndroid == true) {
          var totId = $("#" + id);
          var aa = totId.offset().top;
          var bodyH = document.body.clientHeight;
          bodyH = parseInt((bodyH / 4) - 20);
          $("body").animate({scrollTop: aa - bodyH}, 550);
        }
      },
    }
  }
</script>

<style>
  .mint-msgbox .mint-msgbox-message {
    width: 100% !important;
    box-sizing: border-box !important;
    line-height: 26px;
    padding: 0 15px;
  }
  .tuColor::-webkit-input-placeholder { /* WebKit browsers */
    color: #323232;
  }
  .tuColor:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #323232;
  }
  .tuColor::-moz-placeholder { /* Mozilla Firefox 4 to 18 */
    color: #323232;
  }
  .tuColor:-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #323232;
  }
</style>

<style scoped>
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
    display: none;
  }
  #warning > .waringImg {
    height: 110px;
    width: 118.25px;
    margin: 38.2% auto 0 auto;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/warning/warnin.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  #warning .waringText {
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    color: #ffb148;
    padding: 20px 0 0 0;
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
  }
  /**/
  #customerTables {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }
  #customerTables .customerHeader {
    height: 150px;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    padding: 15px 12.5px;
    font-size: 0;
  }
  #customerTables .customerHeader div {
    height: 120px;
    box-sizing: border-box;
    border-radius: 2px;
    box-shadow: 0 0 15px rgba(255, 200, 125, 0.5);
    background: -webkit-linear-gradient(left, #ffc548, #ffb148); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #ffc548, #ffb148); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #ffc548, #ffb148); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #ffc548, #ffb148); /* 标准的语法 */
  }
  #customerTables .customerHeader .customertis {
    font-size: 13px;
    color: white;
  }
  #customerTables .customerHeader .customertis p {
    text-align: center;
  }
  #customerTables .customerHeader .customertis .customer_p {
    padding-top: 10px;
    font-size: 15px;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
  }
  #customerTables .customerHeader .customertis .customer_pp {
    padding: 0;
  }
  #customerTables .customerHeader .customertis .customer_p span {
    position: relative;
    top: -5px;
    left: 10px;
  }
  #customerTables .customerMid {
    box-sizing: border-box;
    padding: 25px;
  }
  #customerTables .customerHeader .customertis .customer_p2 {
    padding-top: 8px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #customerTables .customerHeader .customertis .customer_p3 {
    padding-top: 4px;
  }
  #customerTables .customerHeader img {
    height: 25px;
  }
  #customerTables .customerHeader .customer_p2, #customerTables .customerHeader .customer_p3 {
    font-size: 14px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #customerTables .customerFoo {
    height: 7.5px;
    width: 100%;
    background-color: #f0f1f5;
  }
  #customerTables .customerContent {
    box-sizing: border-box;
    padding-top: 5px;
    padding-bottom: 15px;
    font-size: 0;
  }
  #customerTables .customerContent > div {
    width: 100%;
    box-sizing: border-box;
    font-size: 0;
    display: block;
    padding: 10px 12.5px 0 12.5px;
    position: relative;
  }
  #customerTables .customerContent div b {
    font-size: 15px;
    color: #323232;
    font-weight: normal;
    display: inline-block;
    box-sizing: border-box;
    text-align: left;
    border: none;
    float: left;
    height: 38px;
    max-width: 7%;
    line-height: 38px;
  }
  #customerTables .customerContent label {
    width: 28%;
    box-sizing: border-box;
    display: inline-block;
    float: left;
    text-align: right;
    padding-right: 15px;
    color: #323232;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
  }
  #customerTables .customerContent input {
    background-color: transparent;
    width: 72%;
    display: inline-block;
    box-sizing: border-box;
    border-radius: 2px;
    border: 0;
    outline: none;
    -webkit-caret-color: #ffc87d;
    caret-color: #ffc87d;
    color: #323232;
    text-align: right;
    padding: 11px 5px 11px 0;
    height: 38px;
    float: left;
    -webkit-appearance: none;
    font-size: 15px;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #customerTables .customer_input {
    border: 1px solid rgb(227, 227, 227);
    height: auto;
    box-sizing: border-box;
    width: 72%;
    display: inline-block;
    border-radius: 2px;
    position: relative;
  }
  #customerTables .new {
    position: relative;
    margin-left: 28%;
    margin-top: 11px;
  }
  #customerTables .customer_input span {
    /*position: absolute;
    left: 0;
    top: 0;*/
    float: left;
    line-height: 20px;
    text-align: center;
    background: #fff;
    width: 20%;
    margin-top: 10px;
    border-right: 1px solid #e3e3e3;
    height: 20px;
    display: block;
    font-size: 15px;
    color: #8d8d8d;
  }
  #customerTables .customerFooter {
    width: 100%;
    height: 50px;
    font-size: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    box-shadow: 0 -1px 0 rgba(0, 0, 0, .08);
  }
  /**/
  #customerTables .customerFooter button {
    width: 50%;
    height: 50px;
    border: 0;
    box-sizing: border-box;
    background-color: white;
    font-size: 18px;
    color: #ffb148;
    font-weight: normal;
    outline: none;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
  }
  #customerTables .customerFooter button + button {
    background-color: #ffb148;
    color: white;
  }
  #customerTables .customerFooter button:active {
    opacity: 0.6;
  }
  #customerTables .customerFooter button + button:active {
    opacity: 0.6;
  }
  #customerTables .customerScroll {
    -webkit-overflow-scrolling: touch;
    overflow-scrolling: touch;
    overflow: auto;
    width: 100%;
  }
  /**/
  #customerTables .matteShow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: hidden;
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

</style>
