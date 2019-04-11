<template>
  <div id="homework">
    <div class="content">
      <div class="subject">
        {{ questionnumber }}. {{ question }}
      </div>
      <div class="select">
        <ul>
          <li :key="index" v-for="(list,index) in liarr" @click="selectitem(index)">
            <span :sel="list.selectstatus" class="sel" :class="{selecti:list.selectstatus=='true'}"></span>
            <span class="seltext">{{list.optionName}}</span>
          </li>
        </ul>
      </div>
      <div class="answers" v-show="jiexishow">
        <div class="title">
          <span>|</span>答题解析
        </div>
        <div class="true">
          <div class="line">
            <p v-show="userselect !==''">您的答案是<span>{{userselect}}</span></p>
            <p>正确的答案是<span>{{trueselsect}}</span></p>
          </div>
        </div>
        <div class="because">
          选择<span>{{trueselsect}}</span>的原因是：{{yuanyin}}
        </div>
      </div>
    </div>
    <div class="footer">
      <div :key="index" class="up" v-for="(list,index) in footerarr" @click="fclick(index)">
        <img :src="list.icon" alt="">
        <p>{{list.name}}</p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'homework',
    data() {
      return {
        footerarr: [
          {name: "上一题", icon: this.$image.testing.uparrow},
          {name: "解析", icon: this.$image.testing.jiexi},
          {name: "下一题", icon: this.$image.testing.downarrow}
        ],
        liarr: [],
        jiexishow: false,
        itemtime: 0, // 每道题的时间
        timea: "", // 时间函数
        no: 0, // 获取接口的第几题
        question: "", // 题目
        questionnumber: "", // 第几题
        xuanzhong: "", // 选中的题目
        courseid: 0, // 获取解析的id
        yuanyin: "", // 解析的内容
        userselect: "", // 用户选择的答案
        trueselsect: "", // 正确的答案
        timuid: 0, // 题目的id
        userselarr: [], // 用户选择的答案数组
        userselarrstatus: "",
        errstatus: false,
        daan: "", // 错题解析中用户选中的
        nolength: "",
        allarr: [],
        userselects: "",
        starttime: 0,
        endtime: 0,
        isallitem: false, // 是否查看的所有作业？
        user_id: ''
      }
    },
    updated() {
      this.contentHeight();
    },
    created() {
      let userId = this.$cookie.getCookie("userId");
      this.user_id = userId;
      console.log(userId);
      if (this.$route.query.courseId !== undefined) {
        this.courseid = this.$route.query.courseId;
      } else {
        this.$vux.toast.show({text: '链接错误，三秒后跳出', position: 'middle', type: 'text', width: 'auto', time: 2500});
        setTimeout(() => {
          window.location.go(-1);
        })
      }
    },
    mounted() {
      if (this.$route.query.err !== undefined && this.$route.query.no !== undefined) {
        this.isallitem = true;
        this.no = this.$route.query.no;
        this.getresultinfo(this.no);
        this.jiexishow = true;
        this.errstatus = true;
      } else if (this.$route.query.err !== undefined) {

        this.geterrinfo(this.no);
        this.jiexishow = true;
        this.errstatus = true;
        /* if(this.$route.query.no!==undefined){
             this.isallitem=true;
             this.no=this.$route.query.no;
             this.getresultinfo(this.no);
         }else{
             this.no=0;
         }*/
      } else {
        this.getinfo(this.no);
      }
      this.contentHeight();
    },
    methods: {
      //查看自己的答题记录
      getresultinfo(index) {
        let params = {
            courseId: this.courseid
          }
        this.$axios.course.getQuestions(params).then(res => {
          console.log(res)
          if (res.data.returnCode == 1) {
            this.liarr = res.data.returnObject[index].optionsList;
            this.question = res.data.returnObject[index].questions;
            this.questionnumber = res.data.returnObject[index].questionsNumber;
            for (var i in this.liarr) {
              if (this.liarr[i].id == res.data.returnObject[index].answerId) {
                this.trueselsect = this.liarr[i].optionNumber;
              }
            }
            this.yuanyin = res.data.returnObject[index].analysis;
            this.timuid = res.data.returnObject[index].id;
            this.daan = res.data.returnObject[index].chosenOptionId;
            this.nolength = (res.data.returnObject).length;
            //console.log("this.daan", this.daan)
            this.$nextTick(() => {
              this.sss();
            })
          } else if (res.data.returnCode == 100) {
            console.log(res);
            this.$weixin.wxAuthRedirect(this, 'COURSE-' + this.courseid);
          }
        }).catch((err) => {
          console.error(err)
        })
      },
      ss() {
        $(".up").eq(0).hide();
        $(".up").css('width', "50%")
      },
      //获取错题解析
      geterrinfo(index) {
        let params = {
            courseId: this.courseid
          }
        this.$axios.course.getErrorResult(params).then(res => {
          //console.log(res)
          if (res.data.returnCode == 1) {
            this.liarr = res.data.returnObject[index].optionsList;
            this.question = res.data.returnObject[index].questions;
            this.questionnumber = res.data.returnObject[index].questionsNumber;
            for (var i in this.liarr) {
              if (this.liarr[i].id == res.data.returnObject[index].answerId) {
                this.trueselsect = this.liarr[i].optionNumber;
              }
            }
            this.yuanyin = res.data.returnObject[index].analysis;
            this.timuid = res.data.returnObject[index].id;
            this.daan = res.data.returnObject[index].chosenOptionId;
            this.nolength = (res.data.returnObject).length;
            //console.log("this.daan", this.daan)
            this.$nextTick(() => {
              this.sss();
            })
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      sss() {
        for (var i in this.liarr) {
          if (this.liarr[i].id == this.daan) {
            $('.seltext').eq(i).siblings().addClass('selecti')
          } else {
            $('.seltext').eq(i).siblings().removeClass('selecti')
          }
        }
        $(".content").animate({scrollTop: 9999}, 1500);
      },
      //获取课后作业题目
      getinfo(index) {
        /*this.$nextTick(() => {
            this.timea = setInterval(() => {
                this.itemtime++;
            }, 1000)
        })
        console.log('------?>', this.itemtime)*/
        console.log("每次获取题目的时候生成一个时间戳")
        var timestamp = Date.parse(new Date());
        this.starttime = timestamp;
        console.log('132465----start', timestamp, this.$const.formatS(timestamp));
        let params = {
            courseId: this.courseid
          }
          this.$axios.course.getQuestions(params).then(res => {
          //console.log(res)
          if (res.data.returnCode == 1) {
            this.liarr = res.data.returnObject[index].optionsList;
            this.question = res.data.returnObject[index].questions;
            this.questionnumber = res.data.returnObject[index].questionsNumber;
            for (var i in this.liarr) {
              if (this.liarr[i].id == res.data.returnObject[index].answerId) {
                this.trueselsect = this.liarr[i].optionNumber;
              }
            }
            this.yuanyin = res.data.returnObject[index].analysis;
            this.timuid = res.data.returnObject[index].id;
            this.daan = res.data.returnObject[index].chosenOptionId;
            this.allarr = res.data.returnObject;
            this.$nextTick(() => {
              this.sss();
              this.xxx();
            })
          } else if (res.data.returnCode == 100) {
            this.$weixin.wxAuthRedirect(this, 'COURSE-' + this.courseid);
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
        })
      },
      xxx() {
        var j = 0;
        //console.log('465798/',this.allarr)
        for (var i in this.allarr) {
          if (this.allarr[i].chosenOptionId == null && this.allarr[i].isAnswer !== true) {
            j++;
          }
        }
        if (j == 0) {
          this.$router.replace({path: "/homeworkend", query: {courseId: this.courseid}});
        }
      },
      //单选操作
      selectitem(index) {
        //console.log(index, this.liarr)
        this.userselarrstatus = index;
        if (this.jiexishow !== true) {
          for (var i in $('li')) {
            $('li').eq(i).find('span').removeClass('selecti')
          }
          $(".sel").eq(index).addClass('selecti');
        } else {
        }
      },
      contentHeight() {
        var hei = document.body.clientHeight;
        var ghg = (hei - document.querySelector('.footer').clientHeight) + "px";
        $(".content").css({"height": ghg});
        if (this.errstatus !== true) {
          this.$nextTick(() => {
            this.ss();
          }, 1000)
        }
      },
      //用户选择的id
      userselectm() {
        var ids = '';
        var idse = '';
        for (var i in this.liarr) {
          if ($(".selecti").siblings('span').text() == this.liarr[i].optionName) {
            ids = this.liarr[i].optionNumber;
            idse = this.liarr[i].id;
          }
        }
        this.userselect = ids;//用户选择的
        this.userselects = idse;
      },
      //点击footer按钮
      fclick(index) {
        if (index == '0') {
          //错题解析的上一题
          if (this.errstatus == true) {
            if (this.no <= 0) {

              if (this.isallitem == true) {
                this.$vux.toast.show({text: '没有上一题', position: 'middle', type: 'text', width: 'auto', time: 2500});
              } else {
                this.$vux.toast.show({text: '没有错题了', position: 'middle', type: 'text', width: 'auto', time: 2500});
              }
            } else {
              if (this.isallitem == true) {
                this.no -= 1;
                this.getresultinfo(this.no);//开启下一题
              } else {
                this.no -= 1;
                this.geterrinfo(this.no);//开启下一题
              }
            }
          } else {
            //点击作业上一题
          }
        } else if (index == '1') { //解析
          if (this.errstatus == true) {
            // 错题解析
          } else {
            // 作业解析
            //console.log(index,'解析',$(".selecti").siblings('span').text())
            this.jiexishow = true;
            this.$nextTick(() => {
              $(".content").animate({scrollTop: 999}, 550);
            }, 1000)
            this.userselectm();
          }
        } else if (index == '2') {
          clearInterval(this.timea)
          if (this.errstatus == true) {
            // 错题下一题
            if (this.no >= this.nolength - 1) {

              if (this.isallitem == true) {
                this.$vux.toast.show({
                  text: '没有更多题目\n' + ',点击“返回”上一页',
                  position: 'middle',
                  type: 'text',
                  width: 'auto',
                  time: 2500
                });
              } else {
                this.$vux.toast.show({
                  text: '没有更多错题,\n' + '点击“返回”上一页',
                  position: 'middle',
                  type: 'text',
                  width: 'auto',
                  time: 2500
                });
              }
            } else {
              if (this.isallitem == true) {
                this.no += 1;
                this.getresultinfo(this.no);//开启下一题
              } else {
                this.no += 1;
                this.geterrinfo(this.no);//开启下一题
              }
            }
          } else {
            // 作业下一题
            console.log(index, '下一题')
            clearInterval(this.timea)
            this.userselectm();
            // 如果没有选择题目 也没有点击解析
            if ($(".selecti").length !== 0 || this.jiexishow == true) {
              this.jiexishow = false;
              if (this.no >= 5) {
                this.$router.replace({path: "/homeworkend", query: {courseId: this.courseid}});
              } else {
                // 作业没选择选项 但是 点了解析
                if (this.userselect == '') {
                  this.no += 1;
                  /*if (this.no >= 5) {
                      this.no = 4;
                  }*/
                  console.log("查看判断条件", this.no)

                  //提交答题记录的时候 处理时间
                  var timestamp = Date.parse(new Date());
                  this.endtime = timestamp;
                  console.log('132465----end', this.starttime, this.endtime, this.$const.formatS(this.endtime), '----', (this.endtime - this.starttime), (this.endtime - this.starttime) / 1000);
                  var timecha = (this.endtime - this.starttime) / 1000;
                  let params = {
                      questionId: this.timuid,
                      optionId: null,
                      useTime: timecha,
                    }
                  this.$axios.course.answerRecord(params).then(res => {
                    console.log(res)
                    clearInterval(this.timea)
                    this.timea = 0;
                    if (res.data.returnCode == 1 || res.data.returnCode == -2) {
                      console.log('answer465', this.no)
                      if (this.no >= 5) {

                      } else {
                        this.getinfo(this.no);//开启下一题
                      }

                      for (var i in $('li')) {
                        $('li').eq(i).find('span').removeClass('selecti');
                      }
                      if (this.no >= 5) {
                        this.$router.replace({path: "/homeworkend", query: {courseId: this.courseid}});
                      }

                    } else {
                      this.$vux.toast.show({
                        text: res.data.returnMsg,
                        position: 'middle',
                        type: 'text',
                        width: 'auto',
                        time: 2500
                      });
                    }
                  }).catch((err) => {
                    console.error(err);
                    this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
                  })
                } else {
                  console.log('判断条件++++', this.no)
                  // 没点解析但有选择选项
                  // 提交答题记录的时候 处理时间
                  var timestamp = Date.parse(new Date());
                  this.endtime = timestamp;
                  console.log('132465----end', this.starttime, this.endtime, this.$const.formatS(this.endtime), '----', (this.endtime - this.starttime), (this.endtime - this.starttime) / 1000);
                  var timecha = (this.endtime - this.starttime) / 1000;
                  let params = {
                    questionId: this.timuid,
                    optionId: this.userselects,
                    useTime: timecha,
                  }
                  this.$axios.course.answerRecord(params).then(res => {
                    console.log(res)
                    if (res.data.returnCode == 1 || res.data.returnCode == -2) {
                      this.no += 1;
                      console.log('answer465', this.no)
                      if (this.no >= 5) {

                      } else {
                        this.getinfo(this.no);//开启下一题
                      }

                      for (var i in $('li')) {
                        $('li').eq(i).find('span').removeClass('selecti');
                      }
                      if (this.no >= 5) {
                        this.$router.replace({path: "/homeworkend", query: {courseId: this.courseid}});
                      }

                    } else {
                      this.$vux.toast.show({
                        text: res.data.returnMsg,
                        position: 'middle',
                        type: 'text',
                        width: 'auto',
                        time: 2500
                      });
                    }
                  }).catch((err) => {
                    console.error(err);
                    this.$vux.toast.show({text: '网络错误', position: 'middle', type: 'text', width: 'auto', time: 2500});
                  })
                }
              }
            } else {
              this.$vux.toast.show({text: '请勾选项', position: 'middle', type: 'text', width: 'auto', time: 2500});
            }

          }

        }
      }
    }
  }
</script>
<style scoped>
  #homework {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  /**/
  .content {
    width: 100%;
    height: auto;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
    color: #323232;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .subject {
    width: 100%;
    height: auto;
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 7.5px solid #f0f1f5;
  }
  .select, .answers {
    width: 100%;
    height: auto;
  }
  .select ul {
    list-style: none;
    width: 100%;
    height: auto;
    padding: 20px;
    box-sizing: border-box;
    border: 1px solid #fff;
    overflow: hidden;
  }
  .select li {
    margin-bottom: 20px;
    width: 100%;
    float: left;
  }
  .select li:last-child {
    margin-bottom: 0;
  }
  li span {
    float: left;
  }
  li span:first-child {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1px solid #e3e3e3;
    margin-right: 10px;
  }
  #homework li .selecti {
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/SELECTED.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-color: #ffb148;
    border: 1px solid #ffb148;
    background-position: center;
  }
  #homework li .selectiErr {
    background: #e3e3e3;
  }
  #homework li .seltext {
    max-width: 88%;
  }
  /**/
  .title {
    background: #fef1d8;
    width: 100%;
    height: 40px;
    font-size: 15px;
    color: #ffb148;
    font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
    line-height: 40px;
    padding-left: 20px;
    box-sizing: border-box;
  }
  .title span {
    font-weight: bold;
    margin-right: 5px;
  }
  .true, .because {
    width: 100%;
    height: auto;
    padding: 20px 20px 20px 20px;
    box-sizing: border-box;
    color: #8d8d8d;
    font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
    font-size: 15px;
  }
  .true p:last-child {
    margin-bottom: 20px;
  }
  .line {
    border-bottom: 1px solid #e3e3e3;
    width: 100%;
    height: 100%;
  }
  /**/
  .footer {
    width: 100%;
    height: 50px;
    background: #f0f1f5;
    border-top: 1px solid #e3e3e3;
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    left: 0;
  }
  .up {
    width: 33.33%;
    height: 100%;
    float: left;
    text-align: center;
    font-size: 11px;
    color: #ffb148;
  }
  .up img {
    width: 25px;
    display: block;
    padding: 10px 0 3px;
    box-sizing: border-box;
    margin: 0 auto;
  }
  .footer .up:nth-child(2) img {
    padding: 6px 0 3px;
    width: 20px;
  }

</style>
