<template>
  <div id="subscribe">
    <el-dialog id="addEvent-dialog" :visible.sync="dialogVisible" width="550px" center :before-close="handleClose">
      <div slot="title" class="title">公司舆情订阅设置</div>
      <div class="company-card-body">
        <div class="card-form-box">
          <!-- checkbox框-->
          <div class="form-keyword-box">
            <div class="form-row">
              <label class="label-sm label-right">来源渠道：</label>
              <div class="form-checkbox-group">
                <label role="checkbox" class="el-checkbox" v-for="(val,index) of source_channel" :key="val.id"
                       @click.prevent="click_source_channel(val.id)">
                            <span aria-checked="mixed" class="el-checkbox__input"
                                  :class="{'is-checked':val.check_style}">
                               <span class="el-checkbox__inner"></span>
                               <input type="checkbox" aria-hidden="true" class="el-checkbox__original"
                                      :value="val.name">
                            </span>
                  <span class="el-checkbox__label">{{val.name}}</span>
                </label>
              </div>
            </div>
            <div class="form-row">
              <label class="label-sm label-right">接收方式：</label>
              <div class="form-checkbox-group">
                <label role="checkbox" class="el-checkbox" v-for="(val,index) of acceptance_method" :key="val.id"
                       @click.prevent="click_acceptance_method(val.id)">
                           <span aria-checked="mixed" class="el-checkbox__input"
                                 :class="{'is-checked':val.check_style}">
                               <span class="el-checkbox__inner"></span>
                               <input type="checkbox" aria-hidden="true" class="el-checkbox__original"
                                      :value="val.name">
                           </span>
                  <span class="el-checkbox__label">{{val.name}}</span>
                </label>
              </div>
            </div>

            <div class="form-row">
              <label class="label-sm label-right">情感类型：</label>
              <div class="form-checkbox-group">
                <label role="checkbox" class="el-checkbox" v-for="(val,index) of emotional_type" :key="val.id"
                       @click.prevent="click_emotional_type(val.id)">
                           <span aria-checked="mixed" class="el-checkbox__input"
                                 :class="{'is-checked':val.check_style}">
                               <span class="el-checkbox__inner"></span>
                               <input type="checkbox" aria-hidden="true" class="el-checkbox__original"
                                      :value="val.name">
                           </span>
                  <span class="el-checkbox__label">{{val.name}}</span>
                </label>
              </div>
            </div>

            <!-- <div class="form-row">
               <label class="label-sm label-right">相关性：</label>
               <div class="form-checkbox-group">
                   <label role="checkbox" class="el-checkbox" v-for="(val,index) of relevance" :key="val.id" @click.prevent="click_relevance(val.id)">
                          <span aria-checked="mixed" class="el-checkbox__input" :class="{'is-checked':val.check_style}">
                              <span class="el-checkbox__inner"></span>
                              <input type="checkbox" aria-hidden="true" class="el-checkbox__original" :value="val.name">
                          </span>
                          <span class="el-checkbox__label">{{val.name}}</span>
                    </label>
               </div>
            </div> -->

            <div class="form-row">
              <label class="label-sm label-right">推送间隔：</label>
              <div class="form-select-box" style="text-align: left;">
                <div class="el-select el-select--mini">
                  <div class="el-input el-input--small el-input--suffix">
                    <el-select v-model="intervalId" placeholder="请选择">
                      <el-option
                        v-for="item in pushInterval"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <label class="label-sm label-right">推送时间：</label>
              <div class="form-select-box" style="text-align: left;">
                <div class="el-select el-select--mini">
                  <div class="el-input el-input--small el-input--suffix">
                    <el-select v-model="timeId" placeholder="请选择">
                      <el-option
                        v-for="item in pushTime"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-row">
              <label class="label-sm label-right">周末推送：</label>
              <div class="form-checkbox-group">
                <label role="checkbox" aria-checked="true" class="el-checkbox"
                       @click.prevent="weekend_push(weekend_check)">
                           <span aria-checked="mixed" class="el-checkbox__input" :class="{'is-checked':weekend_check}">
                               <span class="el-checkbox__inner"></span>
                               <input type="checkbox" aria-hidden="true" class="el-checkbox__original">
                           </span>
                  <span class="el-checkbox__label">是</span>
                </label>
              </div>
            </div>
          </div>
          <!-- checkbox框 end-->
          <div class="form-row">
            <div class="form-btn-box">
              <button class="form-btn form-btn-cancel" type="reset" @click="remove">取消</button>
              <!--  <template v-if="isUpdate"> -->
              <button class="form-btn form-btn-submit" type="button" @click="submission">确定</button>
              <!-- </template> -->
              <!-- <template v-else>
                  <button class="form-btn form-btn-submit" type="button" @click="submission">确定</button>
              </template> -->

            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "subscribe",
    props: {
      value: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        source_channel: [
          {id: 0, name: '论坛', check_style: false},
          {id: 1, name: '报纸', check_style: false},
          {id: 2, name: '手机新闻', check_style: false},
          {id: 3, name: '网络新闻', check_style: false}
          // {id: 4, name:'博客', check_style:true},
          // {id: 5, name:'互动易/e互动', check_style:false}
        ],
        sourceChannelData: '报纸,手机新闻,网络新闻', // 默认
        acceptance_method: [
          {id: 0, name: '微信', check_style: false, value: 'wxmsg'},
          {id: 1, name: '站内信', check_style: false, value: 'sysmsg'}
        ],
        acceptanceMethodData: 'sysmsg', // 默认
        emotional_type: [
          {id: 0, name: '正面', check_style: false},
          {id: 1, name: '中性', check_style: false},
          {id: 2, name: '负面', check_style: false}
        ],
        emotionalTypeData: '负面', // 默认
        relevance: [
          {id: 0, name: '敏感', check_style: false},
          {id: 1, name: '非敏', check_style: false}
        ],
        relevanceData: '',
        pushInterval: [
          {id: 0, name: '15分钟', value: 'real'},
          {id: 1, name: '60分钟', value: 'hour'},
          {id: 2, name: '半天', value: 'half_day'},
          {id: 3, name: '每天', value: 'day'}
        ],
        intervalId: '每天', // 默认
        pushTime: [
          {id: 0, name: '09:00-18:00', value: 'workingtime'},
          {id: 1, name: '全天', value: 'allday'}
        ],
        timeId: '09:00-18:00', // 默认
        weekend_check: false,
        weekend_check_data: 'no',
        // 获取用户ID
        userId: this.$cookie.get('userId'),
        // 获取公司代码
        companyId: window.JSON.parse(this.$cookie.get('userInfo')).companyId
      }
    },
    mounted() {

      this.updateSubscribe();
    },
    watch: {
      value: function (val) {
        this.dialogVisible = val;
      }
    },
    methods: {
      // 更新数据
      updateSubscribe() {
        var _this = this;
//        this.$http.get('http://dev.in-hope.com.cn/zuul/getCompanySentimentPlans', {
//           params:{
//             userId: _this.userId,
//             companyCode: _this.enterpriseCompanyCode
//           }
        this.$axios.sentiment.getCompanySentimentPlans({
          userId: _this.userId,
          companyId: _this.companyId
        }).then(function (res) {
          // alert(res.data.returnObject);
          // console.log(res.data.returnObject);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.length) {
              if (res.data.returnObject[0].source) {
                _this.source_channel.forEach(function (data, index) {
                  _this.source_channel[index].check_style = false;
                  res.data.returnObject[0].source.split(',').forEach(function (a) {
                    if (data.name == a) {
                      _this.source_channel[index].check_style = true;
                    }
                  })
                })

                var source_channel_data = '';
                _this.source_channel.forEach(function (a) {
                  if (a.check_style) {
                    source_channel_data += a.name + ',';
                  }
                })

                _this.sourceChannelData = source_channel_data.slice(',', -1);
              }
              if (res.data.returnObject[0].pushType) {
                _this.acceptance_method.forEach((data, index) => {
                  _this.acceptance_method[index].check_style = false;
                  res.data.returnObject[0].pushType.split(',').forEach((a) => {
                    if (data.value == a) {
                      _this.acceptance_method[index].check_style = true;
                    }
                  })
                })
                var acceptance_method_data = '';
                _this.acceptance_method.forEach(function (a) {
                  if (a.check_style) {
                    acceptance_method_data += a.value + ',';
                  }
                })

                _this.acceptanceMethodData = acceptance_method_data.slice(',', -1);
              }
              if (res.data.returnObject[0].sentimentType) {
                _this.emotional_type.forEach(function (data, index) {
                  _this.emotional_type[index].check_style = false
                  res.data.returnObject[0].sentimentType.split(',').forEach(function (a) {
                    if (data.name == a) {
                      _this.emotional_type[index].check_style = true;
                    }
                  })
                })
                var emotional_type_data = '';
                _this.emotional_type.forEach(function (a) {
                  if (a.check_style) {
                    emotional_type_data += a.name + ',';
                  }
                })

                _this.emotionalTypeData = emotional_type_data.slice(',', -1);
              }
              if (res.data.returnObject[0].relationType) {
                _this.relevance.forEach(function (data, index) {
                  res.data.returnObject[0].relationType.split(',').forEach(function (a) {
                    if (data.name == a) {
                      _this.relevance[index].check_style = true;
                    }
                  })
                })
                var relevance_data = '';
                _this.relevance.forEach(function (a) {
                  if (a.check_style) {
                    relevance_data += a.name + ',';
                  }
                })

                _this.relevanceData = relevance_data.slice(',', -1);
              }
              if (res.data.returnObject[0].pushSleep) {
                _this.pushInterval.forEach(function (data, index) {
                  if (data.value == res.data.returnObject[0].pushSleep) {
                    _this.intervalId = index
                  }
                })
              }
              if (res.data.returnObject[0].pushTime) {
                _this.pushTime.forEach(function (data, index) {
                  if (data.value == res.data.returnObject[0].pushTime) {
                    _this.timeId = index
                  }
                })

              }

              if (res.data.returnObject[0].pushWeekend == 'yes') {
                _this.weekend_check = true;
                _this.weekend_check_data = 'yes';
              } else {
                _this.weekend_check = false;
                _this.weekend_check_data = 'no';
              }

              // _this.isUpdate = true;
            }
          }
        }, function (response) {
        })
      },
      handleClose() {
        this.$emit('close', false);
      },
      // 来源渠道
      click_source_channel: function (index) {
        if (this.source_channel[index].check_style) {
          this.source_channel[index].check_style = false;
        } else {
          this.source_channel[index].check_style = true;
        }
        var source_channel_data = '';
        this.source_channel.forEach(function (a) {
          if (a.check_style) {
            source_channel_data += a.name + ',';
          }
        })

        this.sourceChannelData = source_channel_data.slice(',', -1);
      },
      // 接收方式
      click_acceptance_method: function (index) {
        if (this.acceptance_method[index].check_style) {
          this.acceptance_method[index].check_style = false;
        } else {
          this.acceptance_method[index].check_style = true;
        }
        var acceptance_method_data = '';
        this.acceptance_method.forEach(function (a) {
          if (a.check_style) {
            acceptance_method_data += a.value + ',';
          }
        })

        this.acceptanceMethodData = acceptance_method_data.slice(',', -1);
      },
      // 情感类型
      click_emotional_type: function (index) {
        if (this.emotional_type[index].check_style) {
          this.emotional_type[index].check_style = false;
        } else {
          this.emotional_type[index].check_style = true;
        }
        var emotional_type_data = '';
        this.emotional_type.forEach(function (a) {
          if (a.check_style) {
            emotional_type_data += a.name + ',';
          }
        })

        this.emotionalTypeData = emotional_type_data.slice(',', -1);
      },
      // 相关性
      click_relevance: function (index) {
        if (this.relevance[index].check_style) {
          this.relevance[index].check_style = false;
        } else {
          this.relevance[index].check_style = true;
        }
        var relevance_data = '';
        this.relevance.forEach(function (a) {
          if (a.check_style) {
            relevance_data += a.name + ',';
          }
        })

        this.relevanceData = relevance_data.slice(',', -1);
      },
      weekend_push: function (weekend_check) {
        if (weekend_check == true) {
          this.weekend_check = false;
          this.weekend_check_data = 'no';
        } else {
          this.weekend_check = true;
          this.weekend_check_data = 'yes';
        }
      },
      remove() {
        this.updateSubscribe();
        this.$emit("resetSubscribe");
      },
      judge() {
        var source = true;
        var accept = true;
        var emotional = true;
        var relevance = true;
        var interval = true;
        var time = true;

        // 来源渠道
        if (!this.sourceChannelData) {
          this.$message({message: '请选择来源渠道！', showClose: true, type: 'warning', duration: 3000})
          source = false;
          return false;
        }
        // 接收方式
        if (!this.acceptanceMethodData) {
          this.$message({message: '请选择接收方式！', showClose: true, type: 'warning', duration: 3000})
          accept = false;
          return false;
        }
        // 情感类型
        if (!this.emotionalTypeData) {
          this.$message({message: '请选择情感类型！', showClose: true, type: 'warning', duration: 3000})
          emotional = false;
          return false;
        }
        // 相关性
        /* if (!this.relevanceData) {
          this.$message({message: '请选择相关性！', showClose: true, type: 'warning', duration: 3000})
          relevance = false;
          return false;
        } */
        // 推送间隔
        if (this.intervalId === '') {
          this.$message({message: '请选择推送间隔！', showClose: true, type: 'warning', duration: 3000})
          interval = false;
          return false;
        }
        // 推送时间
        if (this.timeId === '') {
          this.$message({message: '请选择推送时间！', showClose: true, type: 'warning', duration: 3000})
          time = false;
          return false;
        }

        if (source && accept && emotional && relevance && interval && time) {
          return true;
        } else {
          return false
        }
      },
      submission: function () {
        var _this = this;
        // 判断
        if (!this.judge()) {
          return false;
        }

        // 对推送间隔和推送时间做判断
        if (this.intervalId == '每天') {
          this.intervalId = 3;
        }
        if (this.timeId == '09:00-18:00') {
          this.timeId = 0;
        }
        // 公司自定义舆情订阅新增
//            this.$http.post('http://dev.in-hope.com.cn/zuul/updateCompanySentimentPlans', {
//              "name": '',
//              "source": this.sourceChannelData,
//              "pushType": this.acceptanceMethodData,
//              "sentimentType": this.emotionalTypeData,
//              "relationType": this.relevanceData,
//              "pushSleep": this.intervalId === '' ? '' : this.pushInterval[this.intervalId].value,
//              "pushTime": this.timeId === '' ? '' : this.pushTime[this.timeId].value,
//              "pushWeekend": this.weekend_check_data,
//              // "createTime": "2018-11-1",
//              // "id": 0,
//              // "isDelete": 0,css2sass | Convert CSS Snippets to Syntactically Awesome StyleSheets code
//              "type": "company",
//              "userId": this.userId,
//              "companyCode": this.enterpriseCompanyCode
//              // "weixinId": "string"
//            }, {
//              emulateJSON:true
        this.$axios.sentiment.updateCompanySentimentPlans({
          "name": '',
          "source": this.sourceChannelData,
          "pushType": this.acceptanceMethodData,
          "sentimentType": this.emotionalTypeData,
          "relationType": this.relevanceData,
          "pushSleep": this.intervalId === '' ? '' : this.pushInterval[this.intervalId].value,
          "pushTime": this.timeId === '' ? '' : this.pushTime[this.timeId].value,
          "pushWeekend": this.weekend_check_data,
          // "createTime": "2018-11-1",
          // "id": 0,
          // "isDelete": 0,css2sass | Convert CSS Snippets to Syntactically Awesome StyleSheets code
          "type": "company",
          "userId": this.userId,
          "companyCode": this.enterpriseCompanyCode
        }).then((res) => {
          if (res.data.returnCode == 1) {
            _this.$message({message: '公司舆情订阅设置成功！', showClose: true, type: 'success', duration: 2000});
            this.updateSubscribe();
            _this.handleClose();
          } else {
            _this.$message({message: '公司舆情订阅设置失败！', showClose: true, type: 'success', duration: 2000});
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .title {
    width: 100%;
    height: 31px;
    margin: -9px auto;
    color: #FFB148;
    font-weight: 800;
    border-bottom: 1px solid #e3e3e3;
  }
  .card-form-box {
    .form-row {
      width: 100%;
      height: 40px;
    }
    .form-row-auto {
      width: 100%;
      height: auto;
      margin-bottom: 10px;
      overflow: hidden;
    }
    .form-row label {
      float: left;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #323232;
      margin-left: 1px;
    }
    .form-row-auto label {
      line-height: 40px;
    }
    .form-row {
      .label-xs {
        width: 50px;
      }
      .label-sm {
        width: 80px;
      }
      .label-md {
        width: 100px;
      }
      .label-right {
        text-align: right;
      }
      input {
        float: left;
        height: 40px;
        line-height: 40px;
        border-radius: 4px;
        border: 1px solid #AEAEAE;
        padding: 0 10px;
        color: #000;
      }
    }
    .form-tips {
      font-size: 12px;
      color: #FFB148;
    }
    .form-input-frame {
      display: block;
      overflow: hidden;
      padding-left: 30px;
      label {
        color: #8D8D8D;
      }
      .form-tips {
        margin-left: 55px;
      }
    }
    .form-keyword-box .form-tips {
      margin-left: 100px;
    }
  }
  .form-checkbox-group .el-checkbox {
    margin-right: 8px;
    .el-checkbox__label {
      padding-left: 6px;
    }
  }
  .form-row-auto label {
    float: left;
    margin-left: 5px;
  }
  .form-keyword-group {
    float: left;
    width: 600px;
    height: auto;
  }
  .form-row-auto .form-keyword-group {
    margin-left: 5px;
  }
  .form-keyword-group {
    .form-keyword-item {
      display: inline-block;
      height: 24px;
      border: 1px solid #E3E3E3;
      border-radius: 4px;
      color: #AEAEAE;
      font-size: 12px;
      margin: 8px 5px;
      span {
        padding: 0 6px 0 15px;
        line-height: 24px;
      }
      .icon-error {
        display: inline-block;
        width: 10px;
        height: 10px;
        background-size: 100%;
        background: url(../../../assets/image/sentiment/icon/icon-error.svg) no-repeat center;
      }
      .iconfont {
        margin-right: 6px;
        font-size: 12px;
        position: relative;
        color: #AEAEAE;
        transform: rotate(90deg);
      }
    }
    .form-keyword-tools {
      display: inline-block;
      margin-left: 5px;
      .icon-guanjiancitianjia {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: relative;
        top: 5px;
        background-size: 100%;
        background: url(../../../assets/image/sentiment/icon/icon-guanjiancitianjia.svg) no-repeat center;
      }
    }
  }
  .card-form-box .form-select-box {
    height: 40px;
    padding: 8px 0;
    margin-left: 90px;
    input {
      width: 120px;
      height: 24px;
      font-size: 14px;
      text-align: left;
    }
    i {
      position: relative;
      top: 18px;
    }
  }
  .form-row .form-btn-box {
    width: 326px;
    margin: 15px auto;
  }
  .form-btn-box {
    .form-btn {
      display: inline-block;
      width: 150px;
      height: 35px;
      border-radius: 4px;
      font-weight: 800;
      font-size: 16px;
      text-align: center;
    }
    .form-btn-cancel {
      background: rgba(255, 177, 72, 0.3);
      color: #FFB148;
      border: 1px solid #FFB148;
      margin-right: 20px;
    }
    .form-btn-submit {
      background: #FFB148;
      color: #FFF;
      border: 1px solid #FFB148;
    }
  }

</style>

<style lang="scss" scoped>
  #subscribe > > > .el-dialog--center {margin-top: 30vh !important;}
  #subscribe > > > .el-message-box {position: relative;top: -60px;}
  #addEvent-dialog > > > .el-dialog__headerbtn {top: 14px;font-size: 19px;}
  #addEvent-dialog > > > .el-dialog__body {padding: 12px 25px 30px}
  #addEvent-dialog > > > .el-checkbox__label {padding-left: 1px;}
  #addEvent-dialog > > > .el-input__inner {width: 130px;height: 26px;font-size: 14px;line-height: 26px;}
  #addEvent-dialog > > > .el-select {display: inline-block;position: relative;margin-left: -4px;}
</style>
