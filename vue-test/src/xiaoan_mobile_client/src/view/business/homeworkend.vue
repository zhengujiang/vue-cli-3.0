<template>
  <div id="homeworkend">
    <div class="result">
      <div class="first">
        <img v-lazy="successicon" alt="">
        <p>{{ text }}</p>
      </div>
      <div class="second">
        <span>答题准确率：{{ truenum }}</span>
        <span>答题时间：{{ usetime }}</span>
        <div style="clear:both"></div>
      </div>
      <div class="three">
        <div class="part1" v-for="(list,index) in listarr">
          <div class="circle" :str='list.right' @click="errlist(index,0)" v-if="list.right==true">{{ list.num
            }}
          </div>
          <div class="circle falseitem" :str='list.right' @click="errlist(index,0)"
               v-else-if="list.right==false">{{ list.num }}
          </div>
          <div class="circle kongitem" :str='list.right' @click="errlist(index,0)"
               v-else-if="list.right==null">{{ list.num }}
          </div>
        </div>
        <div style="clear:both"></div>
      </div>
    </div>
    <!-- 推荐读物 -->
    <div class="content">
      <div class="collectGroom">
        <div class="testingEnd-content-middle-item">
          <span class="testingEnd-content-middle1"><div></div></span>
          <span class="testingEnd-content-middle-text">{{tuijianduwu}}</span>
          <span class="testingEnd-content-middle2"><div></div></span>
        </div>
      </div>
      <div class="listitem" @click="linkto(index)" v-for="(list,index) in duwu">
        {{ list.statuteName }}
      </div>
    </div>
    <!-- footer -->
    <div class="footer">
      <div class="jiexi" @click="errlist()">
        {{jiexiname}}
      </div>
      <div class="return" @click="BtnTwo">
        {{returnto}}
      </div>
      <div style="clear:both"></div>
    </div>
    <v-returnHome bottom="12%"></v-returnHome>
  </div>
</template>
<script>
  import returnHome from '../../components/warning/returnHome.vue';

  export default {
    name: "homeworkend",
    data() {
      return {
        title: "homeworkend",
        successicon: this.$image.testing.chenggong,
        text: "您已完成作业！",
        truenum: '4/5',
        usetime: "1'30s",
        listarr: [],
        jiexiname: "错题解析",
        returnto: "返回小鹅通",
        tuijianduwu: "推荐读物",
        duwu: [],
        courseid: 0,
      }
    },
    updated() {
      this.tjheight();
    },
    mounted() {
      this.tjheight();
      if (this.$route.query.courseId !== undefined) {
        this.courseid = this.$route.query.courseId;
      }
      this.getresult();
      this.getduwu();
    },
    methods: {
      //返回小鹅通
      BtnTwo() {
        window.location.href = "https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/";
      },
      //错题解析
      errlist(index, show) {
        console.log('index', index, show)
        let params = {
            courseId: this.courseid
          }
        this.$axios.course.getErrorResult(params).then(res => {
          //console.log(res)
          if (res.data.returnCode == 1) {
            if (index !== undefined) {
              this.$router.push({
                path: "/homework",
                query: {courseId: this.courseid, err: true, no: index}
              });
            } else {
              this.$router.push({
                path: "/homework",
                query: {courseId: this.courseid, err: true}
              });
            }
          } else if (res.data.returnCode == -3) {
            if (show !== undefined) {
              this.$router.push({
                path: "/homework",
                query: {courseId: this.courseid, err: true, no: index}
              });
            } else {
              let _this = this;
              this.$vux.confirm.show({
                title: '',
                content: '您答对了所有作业，是否复习答题？',
                // 组件除show外的属性
                onConfirm() {
                  _this.$router.push({
                    path: "/homework",
                    query: {courseId: _this.courseid, err: true, no: 0}
                  });
                },
                onCancel() {
                }
              });
            }

          }

        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })

      },
      getduwu() {
        let params = {
          courseId: this.courseid
        }
        this.$axios.course.getStatute(params).then(res => {
          console.log(res)
          this.duwu = res.data.returnObject;
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      formatSeconds(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if (theTime > 60) {
          theTime1 = parseInt(theTime / 60);
          theTime = parseInt(theTime % 60);
          if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60);
            theTime1 = parseInt(theTime1 % 60);
          }
        }
        var result = "" + parseInt(theTime) + "s";
        if (theTime1 > 0) {
          result = "" + parseInt(theTime1) + "'" + result;
        }
        if (theTime2 > 0) {
          result = "" + parseInt(theTime2) + "时" + result;
        }
        return result;
      },
      //获取答题结果
      getresult() {
        let params = {
          courseId: this.courseid
        }
        this.$axios.course.getAnswerResult(params).then(res => {
          console.log(res)
          if (res.data.returnCode == 1) {
            this.truenum = res.data.returnObject.accuracy;
            if (this.usetime !== null && this.usetime !== undefined) {
              this.usetime = this.formatSeconds(parseInt(res.data.returnObject.useTime));
            } else {
              this.usetime = res.data.returnObject.useTime;
            }
            console.log("sjdlafjasldjflaks", this.usetime, this.formatSeconds(200))
            var arr = res.data.returnObject.recordsMap;
            this.listarr = res.data.returnObject.recordsMap;
            console.log(this.listarr, this.usetime, typeof(this.usetime), parseInt(this.usetime))
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      tjheight() {
        var hei = document.body.clientHeight;
        var x = document.querySelector('.result').clientHeight;
        var y = document.querySelector('.footer').clientHeight;
        var ghg = (hei - x - y) + "px";
        document.querySelector(".content").style.height = ghg;
      },
      linkto(index) {
        console.log("跳转法规", this.duwu[index].statuteLink)
        window.location.href = this.duwu[index].statuteLink;
      }
    },
    components: {
      'v-returnHome': returnHome
    }
  }
</script>
<style scoped>
  #homeworkend {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .result {
    width: 100%;
    height: auto;
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 7.5px solid #f0f1f5;
  }
  .first {
    width: 100%;
    height: auto;
  }
  .first img {
    width: 47px;
    display: block;
    margin: 0 auto;
  }
  .first p {
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 18px;
    color: #323232;
    margin: 20px 0;
    padding: 0;
    width: 100%;
    text-align: center;
  }
  /**/
  .second {
    width: 100%;
    height: auto;
  }
  .second span {
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 13px;
    color: #323232;
    display: inline-block;
    margin-left: 15px;
  }
  .second span:first-child {
    float: left;
  }
  .second span:nth-child(2) {
    float: right;
    margin-right: 20px;
  }
  /**/
  .three {
    width: 100%;
    height: auto;
    margin-top: 20px;
  }
  .part1 {
    width: 20%;
    height: 44px;
    float: left;
  }
  .circle {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: #ffb148;
    color: #fff;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 20px;
    line-height: 44px;
    text-align: center;
    margin: 0 auto;
  }
  .part1 .falseitem {
    background: #8d8d8d;
  }
  .part1 .kongitem {
    background: #fff;
    color: #323232;
    border: 1px solid #e3e3e3;
  }
  /***/
  .content {
    width: 100%;
    height: auto;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    padding: 0 12px;
    box-sizing: border-box;
  }
  .listitem {
    width: 100%;
    height: auto;
    padding: 15px 0;
    box-sizing: border-box;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #323232;
    border-bottom: 1px solid #e3e3e3;
    box-sizing: border-box;
  }
  /*推荐*/
  #homeworkend .collectGroom {
    height: 60px;
    line-height: 60px;
    width: 100%;
    box-sizing: border-box;
    border-bottom: 1px solid #e3e3e3;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #323232;
  }
  /**/
  #homeworkend .testingEnd-content-middle-item {
    text-align: center;
    color: #323232;
  }
  #homeworkend .testingEnd-content-middle-text {
    padding: 0 6px 0 6px;
    font-size: 15px;
  }
  #homeworkend .testingEnd-content-middle1, #homeworkend .testingEnd-content-middle2 {
    width: 60px;
    height: 2px;
    display: inline-block;
    border-bottom: 1px solid #ffb551;
    position: relative;
    box-sizing: border-box;
    top: -5px;
  }
  #homeworkend .testingEnd-content-middle1 div {
    height: 3px;
    width: 3px;
    background-color: #ffb551;
    position: absolute;
    border-radius: 50%;
    right: 0;
    top: 0;
  }
  #homeworkend .testingEnd-content-middle2 div {
    height: 3px;
    width: 3px;
    background-color: #ffb551;
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
  }
  /***/
  .footer {
    width: 100%;
    height: 50px;
    border-top: 1px solid #e3e3e3;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .footer div {
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 18px;
    line-height: 50px;
    text-align: center;
    float: left;
    width: 50%;
    height: 100%;
  }
  .footer div:nth-child(1) {
    background: #fff;
    color: #ffb148;
  }
  .footer div:nth-child(2) {
    background: #ffb148;
    color: #fff;
  }
</style>
