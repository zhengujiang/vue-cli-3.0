<template>
  <transition name="bounce">
    <div id="testingList">
      <div class="testingList-trends">
        <div class="testingList-item">
          <img v-lazy="XIAO" alt="" class="testingList-liang">
          <span class="testingList-text">第{{primo}}题</span>
        </div>
        <div class="testingList-zong">共25题</div>
      </div>
      <div class="testingList-TiMu">
        <div class="testPlate-number" v-show="primo">{{ primo +"、"}}</div>
        <div class="testPlate-wenti" v-if="ScoType =='2'">{{QaText+"（单选）"}}</div>
        <div class="testPlate-wenti" v-if="ScoType =='1'">{{QaText+"（判断）"}}</div>
        <div class="testPlate-wenti" v-if="ScoType =='3'">{{QaText+"（多选）"}}</div>
      </div>
      <div class="testPlate-cont-scroll">
        <div class="testPlate-tianxie">
          <div class="testPlate-units" v-for="(list,index) in candidate" @click="xuanzhe($event,index)">
            <div class="testPlate-number testPlate-numberFoo">{{ primo +"、"}}</div>
            <div class="testPlate-units-TitleS">
              <div class="testPlate-units-Title" flag="false">
                <div style="display: none">{{list.optionId}}</div>
              </div>
            </div>
            <div class="testPlate-units-Cont">{{list.questionOption}}</div><!--=={{list.isCorrect}}-->
          </div>
        </div>
      </div>
      <!---->
      <div class="testPlate-toButton" v-show="toButton"></div>
      <!---->
      <div @click="testSubmit()" class="testPlate-cont-submit">
        <button class="leftIcon" v-if="leftIcon == true">下一题</button>
        <button class="leftIcon" v-else-if="leftIcon == false">交卷</button>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'testingList',
    data() {
      return {
        toButton: false,//提示滚动向下滑动
        leftIcon: false,
        XIAO: this.$image.testing.xiaodian,
        user_id: '',
        market: '',
        ScoType: '',//（单选还是选）
        primo: '',//问题
        QaText: "",
        candidate: [],
        isNexts: '',
        TestId: '',
        nextQa: '',
        tiarr: [],
        strQa: "",
      }
    },
    //页面执行前调用
    created() {
      this.loadd();
      console.log("created");
    },
    //页面加载完成后调用
    updated() {
      this.loadd();
      console.log("updated");
      this.maxsHeight();
    },
    //页面执行时调用
    mounted() {
      document.body.addEventListener('touchstart', function () {
      }, false);

      var userId = this.$cookie.getCookie("userId");
      this.user_id = userId;
      console.log(this.user_id);
      /**&********************************/
      console.log(this.ScoType, this.QaText, this.primo, this.isNexts);
      console.log(this.$route.query.market);
      console.log(this.primo);
      this.market = this.$route.query.market;
      /*判断使用那一条方法*/
      if (this.isNexts = 1) {
        this.leftIcon = true
      } else {
        this.leftIcon = false
      }
      if (this.$route.query.market == undefined) {
        console.log("我调用",);

      } else {
        console.log("没有");
        this.startQa();
      }
      /*判断是第几题 进度条显示*/
      this.loadd();
      console.log("mounted");
      /*this.maxsHeight();*/
      console.log(this.ScoType);
    },

    methods: {
      /**/
      /*选择*/
      xuanzhe(event, index) {
        var array = [];
        var el = event.currentTarget;
        console.log(el);
        console.log($(el).find('.testPlate-units-Title'));
        $(el).find('.testPlate-units-Title').removeClass('unitsIcon');
        /*var tempLi = {};*/
        if (this.ScoType == 2) {
          console.log('单选');
          console.log(this.candidate[index].optionId);
          $(el).find('.testPlate-units-Title').addClass('unitsIcon');
          $(el).siblings().find('.testPlate-units-Title').removeClass('unitsIcon');
          console.log($(el));
        } else if (this.ScoType == 1) {
          $(el).find('.testPlate-units-Title').addClass('unitsIcon');
          $(el).siblings().find('.testPlate-units-Title').removeClass('unitsIcon');
          console.log('判断');
        } else if (this.ScoType == 3) {
          function unique(arr) {//数组去重
            var result = [];
            var obj = {};
            for (let i = 0; i < arr.length; i++) {
              if (!obj.hasOwnProperty(arr[i])) {
                result.push(arr[i]);
                obj[arr[i]] = 0;
              }
            }
            return result
          }

          console.log("打印多从选项", this.tiarr);
          if ($(el).find('.testPlate-units-Title').attr("flag") == "false") {
            $(el).find('.testPlate-units-Title').attr('flag', 'true').addClass('unitsIcon');
            var arr = $(el).find('.testPlate-units-Title div').html();
            this.tiarr.push($(el).find('.testPlate-units-Title div').html());
            this.tiarr = this.$array.unique(this.tiarr);
          } else {
            $(el).find('.testPlate-units-Title').attr('flag', 'false').removeClass("unitsIcon");
            var arr = $(el).find('.testPlate-units-Title div').html();
            this.tiarr = this.$array.unique(this.tiarr);
            for (var i = 0; i < this.tiarr.length; i++) {
              console.log(this.tiarr[i]);
              if (this.tiarr[i] == arr) {
                this.tiarr.splice(i, 1);
                break;
              }
            }
          }
          console.log("取消", this.tiarr);
          var str = this.tiarr.join(",");
          this.strQa = str;
          console.log("asdasdas", this.strQa);
        } else {

        }
      },
      /**/
      //答题开始
      startQa() {
        let params = {
            market: this.market,
          }
        this.$axios.testing.start(params).then(res => {
          if (res.data.returnCode == 1) {
            console.log(res);
            this.ScoType = res.data.returnObject.questionType;
            this.QaText = res.data.returnObject.questionText;
            this.primo = res.data.returnObject.questionNum;//
            this.candidate = res.data.returnObject.secQuestionOptions;//答案选象
            this.QaIdS = res.data.returnObject.questionId;//题目id
            this.TestId = res.data.testId;
            this.isNexts = res.data.isNext;
            console.log("startQa答案", this.ScoType, this.QaText, this.primo, this.isNexts, typeof this.QaIdS);
            console.log("startQa答案", this.candidate);
            this.$nextTick(() => {
              this.maxsHeight();
            });
            if (this.isNexts == -1) {
              this.leftIcon = false;
              this.maxsHeight();
            }
          } else {
            this.$router.replace({path: "/testingEnd"});
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      /*安卓机兼容*/
      maxsHeight() {
        let testingListtrends = ($(".testingList-trends").offset().top) + $(".testingList-trends").height();
        let testingListTiMu = document.querySelector(".testingList-TiMu").clientHeight;
        let testPlateContSubmit = ($(".testPlate-cont-submit").offset().top);
        let num = 25 * 2.4;
        let testPlateTianxie = document.querySelector(".testPlate-tianxie").clientHeight;
        let scrollX = testPlateContSubmit - testingListtrends - testingListTiMu - num;
        document.querySelector(".testPlate-cont-scroll").style.height = scrollX + "px";
        console.log("===>", scrollX, testPlateTianxie);
        if (testPlateTianxie > scrollX) {
          //有滚动区域
          this.toButton = true;
          $("#testingList .testPlate-toButton").css({"bottom": "18%", "opacity": "1"});
          setTimeout(() => {
            $('.testPlate-toButton').animate({bottom: "100px", opacity: 0});
          }, 3000);
          console.log(1);
        } else {
          //无滚动区域
          this.toButton = false;
          console.log(2);
        }
      },
      /*控制进度条长度*/
      loadd() {
        console.log("loadd", this.primo);
        console.log(this.primo);
        if (this.primo > 1) {
          var aP = (((this.primo - 1) * 3.5) + 8) + "%";
          console.log(aP);
          document.querySelector(".testingList-item").style.width = aP;
          if (this.primo > 21) {
            setTimeout(() => {
              document.querySelector(".testingList-zong").style.display = "none";
            }, 1000);
          }
        }
      },
      //
      commit() {
        if (this.ScoType == 3) {
          this.nextQa = this.strQa;
          console.log("scotype == 3", this.nextQa, "", this.strQa);
        } else {
          this.nextQa = $('.unitsIcon div').html();
          console.log(this.nextQa);
        }
        let params = {
            testId: this.TestId,
            questionId: this.QaIdS,
            choseIds: this.nextQa,
          }
        this.$axios.testing.commit(params).then(res => {
          var data = res.data.returnObject;
          console.log(this.ScoType, this.QaText, this.primo, this.isNexts, data);
          window.sessionStorage.setItem("timeDateTime", data);
          this.$router.replace({path: "/testLoading"});
          this.$MTAmethod.mtaShare('dongminenglicep-2', {testsubmit: true});
          console.log(res);
        }).catch((err) => {
          console.error(err);
        });
      },
      toNext() {
        if (this.ScoType == 3) {
          this.nextQa = this.strQa;
          console.log("scotype == 3", this.nextQa, "", this.strQa);
        } else {
          this.nextQa = $('.unitsIcon div').html();
          console.log(this.nextQa);
        }
        console.log(this.ScoType, this.QaText, this.primo, this.isNexts, this.nextQa);
        //请求
        let params = {
            testId: this.TestId,
            questionId: this.QaIdS,
            choseIds: this.nextQa,
          }
        this.$axios.testing.toNext(params).then(res => {
          this.tiarr = [];//请求成功后清空数组;
          $('.testPlate-units-Title').attr('flag', 'false');
          $('.testPlate-units-Title').removeClass('unitsIcon');
          console.log(res);
          this.ScoType = res.data.returnObject.questionType;
          this.QaText = res.data.returnObject.questionText;
          this.primo = res.data.returnObject.questionNum;//
          this.candidate = res.data.returnObject.secQuestionOptions;//答案选象
          this.QaIdS = res.data.returnObject.questionId;//题目id
          this.TestId = res.data.testId;
          this.isNexts = res.data.isNext;
          window.localStorage.setItem("testId", this.TestId);
          console.log("下一题", this.ScoType, this.QaText, this.primo, this.isNexts);
          if (this.isNexts == -1) {
            this.leftIcon = false;
          }
        }).catch((err) => {
          console.error(err);
        })
      },
      testSubmit() {
        if (this.isNexts == "1") {
          console.log($('.unitsIcon div').html());
          if ($('.unitsIcon div').html() == undefined) {
            //this.toNext();
            this.$vux.toast.show({text: '请勾选选项', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.toNext();
            /*MtaH5.clickShare('dongminenglicep-2', {testnextstep: true});*/
            this.$MTAmethod.mtaShare('dongminenglicep-2', {testnextstep: true})
          }
        } else if (this.isNexts == "-1") {
          if ($('.unitsIcon div').html() == undefined) {
            //this.commit();
            this.$vux.toast.show({text: '请勾选选项', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.commit();
          }
        }
        console.log("答题完成");
      }
    }
  }
</script>
<style>

</style>

<style scoped>
  #testingList {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/back2@3x.png");
    background-size: 100% 100%;
  }
  #testingList .testingList-trends {
    height: 4px;
    width: 100%;
    margin-top: 19px;
    background-color: #5e6566;
  }
  /***************************************/
  #testingList .testPlate-wenti {
    font-size: 16px;
    letter-spacing: -1px;
    line-height: 24px;
    display: table-cell;
  }
  #testingList .testingList-TiMu {
    padding: 50.5px 21px 0 21px;
    font-size: 16px;
    color: #f0cf8d;
    line-height: 21px;
    display: table;
    text-align: justify;
    box-sizing: border-box;
    width: 100%;
  }
  #testingList .testingList-item {
    display: inline-block;
    height: 4px;
    width: 8%;
    position: relative;
    top: -9px;
    transition: width 2s;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: -webkit-gradient(linear, 100% 0%, 20% 0%, from(#F9F9D0), to(#6498A0));
  }
  #testingList .testingList-liang {
    width: 12px;
    height: 12px;
    position: absolute;
    top: -4px;
    right: -6px;
  }
  #testingList .testingList-text {
    position: absolute;
    right: -22px;
    top: 6px;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/dijiti.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
    border-radius: 2px;
    width: 45px;
    height: 23.67px;
    color: white;
    font-size: 11px;
    line-height: 28px;
    text-align: center;
  }
  #testingList .testingList-zong {
    position: absolute;
    top: 30px;
    font-size: 11px;
    color: white;
    right: 12px;
  }
  #testingList .testPlate-cont-scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    margin-top: 6%;
  }
  #testingList .testPlate-tianxie {
    padding: 0 21px 0 21px;
  }
  #testingList .testPlate-number {
    font-size: 16px;
    display: table-cell;
  }
  #testingList .testPlate-numberFoo {
    opacity: 0;
    background-color: rgba(0, 0, 0, 0);
    color: rgba(0, 0, 0, 0);
  }
  #testingList .testPlate-units {
    display: table;
    vertical-align: middle;
    padding-bottom: 20px;
  }
  #testingList .testPlate-units-TitleS {
    display: table-cell;
  }
  #testingList .testPlate-units-Title {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(240, 207, 141, 0.26);
    margin-right: 8px;
  }
  #testingList .unitsIcon {
    height: 20px;
    width: 20px;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/clickd@3x.png");
    background-repeat: no-repeat;
    background-size: 100% 100%;
  }
  #testingList .testPlate-units-Cont {
    color: white;
    width: 93.5%;
    height: auto;
    text-align: justify;
    font-size: 15px;
    display: table-cell;
    vertical-align: top;
  }
  #testingList .testPlate-cont-submit {
    position: absolute;
    bottom: 57.5px;
    width: 100%;
    text-align: center;
  }
  /**/
  #testingList .leftIcon {
    width: 195px;
    height: 40px;
    border: none;
    background-color: #f0cf8d;
    color: white;
    font-size: 23px;
    padding: 0;
    line-height: 40px;
    text-align: center;
    border-radius: 30px;
    outline: none;
  }
  #testingList .leftIcon:active {
    background-color: #e4c077;
  }
  /**/
  #testingList .testPlate-toButton {
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/toButtom.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
    height: 20px;
    width: 32.76px;
    margin: auto;
    position: absolute;
    bottom: 18%;
    left: 50%;
    margin-left: -16.3px;
  }

</style>

