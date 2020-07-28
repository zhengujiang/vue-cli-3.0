<template>
  <div id="sentimentAsidePlan" ref="planList">
    <el-card class="company-card-nopadding" shadow="hover" body-style="padding:0;">
      <div class="company-card-header">
        <button class="btn-add-plan" @click="addCustom">
          <i class="iconfont web-jia"></i>自定义方案
        </button>
      </div>
      <div class="company-card-body" v-loading="loading">
        <div class="card-plan-list" id="planListScroll">
          <ul>
            <template v-if="plans.length"> <!-- :class="{'styleActive': index===selectItem}" -->
              <li v-for="(plan,index) in plans" :key="plan.id" :title="plan.name"
                  @click.self="handelGetData(plan,index,0)" :class="{'styleActive': index===selectItem}"
                  :id="'style'+index"> <!-- :class="{'styleActive': !index}" -->
                <template v-if="plan.name.length > 20">
                  {{plan.name.substring(0,15)}}...<i class="iconfont web-shanchu"
                                                     @click.self="deletePlan(plan.id)"></i>
                </template>
                <template v-else>
                  {{plan.name}}<i class="iconfont web-shanchu" @click.self="deletePlan(plan.id)"></i>
                </template>
              </li>
            </template>
            <template v-else>
              <li class='no text-black3'>当前无自定义舆情方案</li>
            </template>
          </ul>
        </div>
        <div class="card-aside-QRCode">
          <div class="aside-QRCode-box">
            <img src="../../../assets/image/sentiment/QRCode1.png">
            <p>
              扫码关注信公小安及时接收舆情通知
            </p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: "sentimentAsidePlan",
    components: {},
    props: {
      roundString: '',
      defaultStyle: '',
      plansIndexId: ''
      // sentimentPlanIds:''
    },
    data() {
      return {
        plans: [],
        userId: this.$cookie.get('userId'),
        loading: false,
        // 默认样式
        selectItem: 0,
        defaultStyleBool: false,
        fullHeight: document.documentElement.clientHeight,
        // 获取通过url地址传过来的参数
        urlPlanId: ''
        // getUrlData:false

      }
    },
    created() {
      // 页面加载渲染后获取自定义方案列表
      this.getSentimeAsidePlan();
      this.loading = true;
      // if (this.$route.query.SentimentPlanId) {
      //     var rand = Math.random();
      //     this.urlRand =  rand;
      // }
    },
    mounted() {
      const that = this;
      window.onresize = () => {
        return (() => {
          window.fullHeight = document.documentElement.clientHeight
          that.fullHeight = window.fullHeight
        })()
      }

      this.$refs.planList.style.height = this.fullHeight - 230 + 'px';

      if (this.$route.query.SentimentPlanId) {
        this.urlPlanId = this.$route.query.SentimentPlanId
        this.selectItem = '';
      } else {
        this.selectItem = 0;
      }

    },
    watch: {
      $route() {
        this.urlPlanId = this.$route.query.SentimentPlanId
      },
      urlPlanId() {
        // 获取当前PlanID一条自定义方案
        var _this = this;
//                this.$http.get('http://dev.in-hope.com.cn/zuul/sentimentPlans', {
//                   params:{userId:_this.userId, id:_this.urlPlanId}
        this.$axios.sentiment.sentimentPlans({
          userId: _this.userId,
          id: _this.urlPlanId
        }).then(function (res) {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            _this.urlData(res.data.returnObject[0]);
          } else if (res.data.returnCode == 500) {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }
        }, function (response) {
        })
      },
      fullHeight(val) {
        this.fullHeight = val;
        this.$refs.planList.style.height = val - 230 + 'px';
      },
      roundString(val) {

        this.getSentimeAsidePlan();
        this.loading = true;
        if (this.plansIndexId == 0) {
          this.selectItem = 0;
        } else {
          this.selectItem = '';
        }

        this.defaultStyleBool = true;

      },
      defaultStyle(val) {

      }
    },
    methods: {
      urlData(val) {
        if (val) {
          // 在获取一次方案列表
          var _this = this;
          var arr = [];
          // var a;
          // this.$http.get('http://dev.in-hope.com.cn/zuul/sentimentPlans', {
          //    params:{userId:_this.userId, id:''}
          this.$axios.sentiment.sentimentPlans({
            userId: _this.userId,
            id: ''
          }).then(function (res) {
            if (res.data.returnCode == 1) {
              res.data.returnObject.forEach(function (a, index) {
                if (a.name != '') {
                  arr.push(res.data.returnObject[index]);
                }
              })

              var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
              // 存储方案列表index下标数
              var indexNum = '';
              arr.forEach(function (a, ind) {
                if (a.id == val.id) {
                  indexNum = ind;
                  // 获取当前方案的距离顶端的位置
                  var distance = ind * 50;
                  var styleObject = document.getElementById('style' + ind);
                  if (userAgent.indexOf("Chrome") > -1) {
                    // if (distance < 450) {
                    //     document.getElementById('planListScroll').scrollTo(0, 0);
                    // } else {
                    //     document.getElementById('planListScroll').scrollTo(0, distance);
                    // }
                    if (distance > 450) {
                      document.getElementById('planListScroll').scrollTo(0, distance);
                    }
                    styleObject.setAttribute("class", 'styleActive');
                  } else {
                    // if (distance < 450) {
                    //     document.getElementById('planListScroll').scrollTop = 0;
                    // } else {
                    //     document.getElementById('planListScroll').scrollTop = distance;
                    // }
                    if (distance > 450) {
                      document.getElementById('planListScroll').scrollTop = distance;
                    }
                    styleObject.className = "styleActive";
                  }
                } else {
                  var styleObjects = document.getElementById('style' + ind);
                  if (userAgent.indexOf("Chrome") > -1) {
                    styleObjects.setAttribute("class", '');
                    // styleObjects.removeAttribute("class", '');
                  } else {
                    styleObjects.className = "";
                  }

                }
              })

              _this.$emit("getsentimentListDatas", val, indexNum);

            } else {
              _this.$alert('系统错误', '提示', {
                confirmButtonText: '确定'
              });
            }

          }, function (response) {
          })
        }
      },
      getSentimeAsidePlan() {
        var _this = this;
        var arr = [];
        // this.$http.get('http://dev.in-hope.com.cn/zuul/sentimentPlans', {
        //    params:{userId:_this.userId, id:''}
        this.$axios.sentiment.sentimentPlans({
          userId: _this.userId,
          id: ''
        }).then(function (res) {
          if (res.data.returnCode == 1) {
            res.data.returnObject.forEach(function (a, index) {
              if (a.name != '') {
                arr.push(res.data.returnObject[index]);
              }
            })
            _this.plans = arr;
            _this.loading = false;
          } else {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }

        }, function (response) {
        })
      },
      // 新增自定义方案
      addCustom() {
        this.$emit('addCustom');
      },
      // 删除自定义方案
      deletePlan(plansId) {
        var _this = this;
        this.$confirm('确定删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.$http.delete('http://dev.in-hope.com.cn/zuul/sentimentPlans', {
          //   params:{userId:_this.userId, id:plansId}
          this.$axios.sentiment.sentimentDelPlans({
            userId: _this.userId,
            id: plansId
          }).then(function (res) {
            var userAgent = navigator.userAgent; // 取得浏览器的userAgent字符串
            _this.getSentimeAsidePlan();
            // 改变样式
            if (userAgent.indexOf("Chrome") > -1) {
              _this.plans.forEach(function (a, ind) {
                var styleObject = document.getElementById('style' + ind);
                if (ind == 0) {
                  styleObject.setAttribute("class", 'styleActive');
                } else {
                  styleObject.setAttribute("class", '');
                }
              })
            } else {
              _this.plans.forEach(function (a, ind) {
                var styleObject = document.getElementById('style' + ind);
                if (ind == 0) {
                  styleObject.className = "styleActive";
                } else {
                  styleObject.className = "";
                }
              })
            }

            if (userAgent.indexOf("Chrome") > -1) {
              document.getElementById('planListScroll').scrollTo(0, 0);
            } else {
              document.getElementById('planListScroll').scrollTop = 0;
            }
          }, function (response) {
          });
          this.selectItem = 0;
          _this.$emit("deletesentimeListData", plansId);
        }).catch(() => {
        })
      },
      // 获取一个自定义方案
      handelGetData(plan, index, number) {
        if (number == 0) {
          this.plans.forEach(function (a, ind) {
            if (index == ind) {
              var styleObject = document.getElementById('style' + ind);
              styleObject.setAttribute("class", 'styleActive');
            } else {
              var styleObjects = document.getElementById('style' + ind);
              styleObjects.setAttribute("class", '');
            }
          })
          this.$emit("getsentimentListDatas", plan, index);
        }

        // if (number == 1) {
        //     // 存储方案列表index下标数
        //     var indexNum = '';
        //     alert(this.plans);
        //     this.plans.forEach(function(a, ind) {
        //         if (a.id == plan.id) {
        //             indexNum = ind;
        //             var styleObject = document.getElementById('style' + ind);
        //             styleObject.setAttribute("class", 'styleActive');
        //         } else {
        //             var styleObjects = document.getElementById('style' + ind);
        //             styleObjects.removeAttribute("class", '');
        //             // styleObject.setAttribute("class", '');
        //         }
        //     })

        //     this.$emit("getsentimentListDatas", plan, indexNum);
        // }

      }
    }
  }
</script>

<style lang="scss" scoped>
  #sentimentAsidePlan {
    position: relative;
    .company-card-nopadding {
      margin: 10px;
      padding: 10px 0 20px;
      border-radius: 8px;
      border: none;
      &:hover {
        -webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
        box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);
      }
      .company-card-header {
        padding: 0 15px 10px;
        border-bottom: 1px solid #E3E3E3;
      }
      .company-card-body {
        position: relative;
        height: calc(100% - 24px);
      }
    }
    .btn-add-plan {
      width: 100%;
      height: 34px;
      border: none;
      border-radius: 4px;
      background: #FFB148;
      color: #fff;
      font-size: 16px;
      font-weight: 800;
      .iconfont {
        margin-right: 10px;
      }
    }
    .card-plan-list {
      height: calc(100% - 170px);
      max-height: 370px;
      min-height: 370px;
      overflow-y: auto;
      li {
        height: 50px;
        line-height: 50px;
        font-size: 16px;
        // color: #323232;
        padding: 0 16px;
        .iconfont {
          float: right;
          display: none;
        }
        &:hover, &.active {
          background-color: #fff3e4;
        }
        &:hover .iconfont, &.active .iconfont {
          display: inline-block;
        }
      }
    }
    .card-aside-QRCode {
      padding-top: 20px;
      .aside-QRCode-box {
        width: 100px;
        margin: 0 auto;
        img {
          width: 100px;
          height: 100px;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        }
        p {
          font-size: 12px;
          color: #8D8D8D;
          text-align: center;
        }
      }
    }
    .no {
      color: #8d8d8d;
      font-size: 15px;
      padding: 10px 0;
      text-align: center;
    }
    .styleActive {
      color: #FFB148;
      background-color: #fff3e4;
    }
  }
</style>
