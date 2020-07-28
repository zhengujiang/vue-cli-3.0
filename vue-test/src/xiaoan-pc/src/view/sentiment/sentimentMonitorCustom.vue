<template>
  <div id="sentimentMonitorCustom">
    <el-card shadow="hover" body-style="padding:0;" class="company-card">
      <div class="company-card-header">
        <div class="company-card-title">新建自定义舆情方案</div>
      </div>
      <!---->
      <div class="company-card-body">
        <div class="card-form-box">
          <!-- input框-->
          <div class="form-row vxa-flax-box">
            <label class="label-sm t-right">方案名称：</label>
            <div class="col">
              <el-input type="text" style="width: 100%" placeholder="请输入方案名称" v-model="scheme_name"
                        id="scheme_name" maxlength="10" @blur.prevent="changeCount"></el-input>
            </div>
          </div>
          <div class="form-tips">* 方案名称必填(最多10字符;只能包含中文,英文或数字)</div>
          <div class="form-row vxa-flax-box">
            <label class="label-sm t-right">监测对象：</label>
          </div>
          <div class="form-input-frame">
            <div class="form-row vxa-flax-box">
              <label class="label-xs">公司：</label>
              <div class="col">
                <el-autocomplete style="width: 100%" id="company" class="inline-input" v-model="company"
                                 :fetch-suggestions="querySearchCompany" placeholder="请输入公司"
                                 :trigger-on-focus="false" @select="handleSelectCompany"></el-autocomplete>
              </div>

            </div>
            <div class="form-row vxa-flax-box">
              <label class="label-xs">行业：</label>
              <div class="col">
                <el-autocomplete style="width: 100%" id="industry" class="inline-input" v-model="industry"
                                 :fetch-suggestions="querySearchIndustry" placeholder="请输入行业"
                                 :trigger-on-focus="false" @select="handleSelectIndustry"></el-autocomplete>
              </div>
            </div>
            <div class="form-row vxa-flax-box area">
              <label class="label-xs">地域：</label>
              <div class="col">
                <el-autocomplete style="width: 100%" id="province" class="inline-input" v-model="province"
                                 :fetch-suggestions="querySearchProvince" placeholder="请输入地域"
                                 @select="handleSelectProvince"></el-autocomplete>
              </div>
            </div>
            <div class="form-row vxa-flax-box">
              <label class="label-xs">人物：</label>
              <div class="col">
                <el-autocomplete style="width: 100%" id="people" class="inline-input" v-model="people"
                                 :fetch-suggestions="querySearchPeople" placeholder="请输入人物"
                                 :trigger-on-focus="false" @select="handleSelectPeople"></el-autocomplete>
              </div>
            </div>
            <div class="form-tips">* 以上四项必填一项</div>
          </div>
          <!-- input框 end-->
          <!-- 标签选择框-->
          <div class="form-keyword-box">
            <div class="form-row-auto vxa-flax-box">
              <label class="label-md">包含关键词：</label>
              <div class="form-keyword-group col">
                <div class="form-keyword-item" v-for="(val,index) in keyword" :key="index">
                  <template v-if="val.name.length > 5">
                    <span :title="val.name">{{val.name.substring(0,5)}}...</span>
                  </template>
                  <template v-else>
                    <span>{{val.name}}</span>
                  </template>
                  <a><i class="iconfont icon-error" @click="keyword_is_delete(index)"></i></a>
                </div>
                <div class="form-keyword-tools">
                  <a><i class="iconfont icon-guanjiancitianjia" @click="addKeyWord(1)"
                        :style="keyword.length ? 'top:5px;' : 'top:10px;'"></i></a>
                </div>
              </div>
            </div>
            <div class="form-row-auto vxa-flax-box">
              <label class="label-md">不含关键词：</label>
              <div class="form-keyword-group col">
                <div class="form-keyword-item" v-for="(val,index) in no_keyword" :key="index">
                  <template v-if="val.name.length > 5">
                    <span :title="val.name">{{val.name.substring(0,5)}}...</span>
                  </template>
                  <template v-else>
                    <span>{{val.name}}</span>
                  </template>
                  <a><i class="iconfont icon-error" @click="no_keyword_is_delete(index)"></i></a>
                </div>
                <div class="form-keyword-tools">
                  <a><i class="iconfont icon-guanjiancitianjia" @click="addNoKeyWord(0)"
                        :style="no_keyword.length ? 'top:5px;' : 'top:10px;'"></i></a>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-tips">
                * 监测对象只选择行业或者地域，以上两项至少填写一项
              </div>
            </div>
          </div>
          <div class="form-split">
            <p class="form-split-title">自定义方案舆情提醒设置</p>
          </div>
          <!-- checkbox框-->
          <div class="form-keyword-box">
            <div class="form-row">
              <label class="label-sm label-right">来源渠道：</label>
              <div class="form-checkbox-group">
                <label role="checkbox" class="el-checkbox" v-for="(val,index) in source_channel"
                       :key="val.id" @click.prevent="click_source_channel(val.id)">
                                                        <span aria-checked="mixed" class="el-checkbox__input"
                                                              :class="{'is-checked':val.check_style}">
                                                           <span class="el-checkbox__inner"></span>
                                                           <input type="checkbox" aria-hidden="true"
                                                                  class="el-checkbox__original" :value="val.name">
                                                        </span>
                  <span class="el-checkbox__label">{{val.name}}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-row">
            <label class="label-sm label-right">接收方式：</label>
            <div class="form-checkbox-group">
              <label role="checkbox" class="el-checkbox" v-for="(val,index) in acceptance_method"
                     :key="val.id" @click.prevent="click_acceptance_method(val.id)">
                                                       <span aria-checked="mixed" class="el-checkbox__input"
                                                             :class="{'is-checked':val.check_style}">
                                                           <span class="el-checkbox__inner"></span>
                                                           <input type="checkbox" aria-hidden="true"
                                                                  class="el-checkbox__original" :value="val.name">
                                                       </span>
                <span class="el-checkbox__label">{{val.name}}</span>
              </label>
            </div>
          </div>
          <div class="form-row">
            <label class="label-sm label-right">情感类型：</label>
            <div class="form-checkbox-group">
              <label role="checkbox" class="el-checkbox" v-for="(val,index) in emotional_type" :key="val.id"
                     @click.prevent="click_emotional_type(val.id)">
                                                       <span aria-checked="mixed" class="el-checkbox__input"
                                                             :class="{'is-checked':val.check_style}">
                                                           <span class="el-checkbox__inner"></span>
                                                           <input type="checkbox" aria-hidden="true"
                                                                  class="el-checkbox__original" :value="val.name">
                                                       </span>
                <span class="el-checkbox__label">{{val.name}}</span>
              </label>
            </div>
          </div>
          <div class="form-row">
            <label class="label-sm label-right">推送间隔：</label>
            <div class="form-select-box">
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
            <div class="form-select-box">
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
                                                       <span aria-checked="mixed" class="el-checkbox__input"
                                                             :class="{'is-checked':weekend_check}">
                                                           <span class="el-checkbox__inner"></span>
                                                           <input type="checkbox" aria-hidden="true"
                                                                  class="el-checkbox__original">
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
            <button class="form-btn form-btn-submit" @click="submission" type="button">确定</button>
          </div>
        </div>
      </div>
    </el-card>
    <keyword-popup v-model="keywordPopup" @close="closekeywordPopup" :keywordPopupArr='keyword'
                   :keywordPopupArrNo='no_keyword' @addKeyWordPopup="addKeyWordPopups" :roundString="roundString"
                   :keywordType="keywordType"></keyword-popup>
  </div>
</template>

<script>
  import KeywordPopup from './components/keywordPopup.vue';
  export default {
    name: "sentimentMonitorCustom",
    components: {
      KeywordPopup
    },
    data() {
      return {
        scheme_name: '',
        company: '', // 公司
        companyCode: '', // 公司代码
        companyDatas: '',
        industry: '', // 行业
        industryDatas: '',
        province: '', // 地域
        provinceData: [],
        provinceDatas: '',
        people: '', // 人物
        peopleDatas: '',
        keyword: [],
        no_keyword: [],
        source_channel: [
          {id: 0, name: '论坛', check_style: false},
          {id: 1, name: '报纸', check_style: true},
          {id: 2, name: '手机新闻', check_style: true},
          {id: 3, name: '网络新闻', check_style: true}
          // {id: 4, name:'博客', check_style:false},
          // {id: 5, name:'互动易/e互动', check_style:false}
        ],
        sourceChannelData: '报纸,手机新闻,网络新闻', // 默认
        acceptance_method: [
          {id: 0, name: '微信', check_style: false, value: 'wxmsg'},
          {id: 1, name: '站内信', check_style: true, value: 'sysmsg'}
        ],
        acceptanceMethodData: 'sysmsg', // 默认
        emotional_type: [
          {id: 0, name: '正面', check_style: false},
          {id: 1, name: '中性', check_style: false},
          {id: 2, name: '负面', check_style: true}
        ],
        emotionalTypeData: '负面',
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
        getData: {},
        // 关键词弹出框
        keywordPopup: false,
        roundString: '',
        keywordType: '',
        //
        pushWeekendDataList: [{name: '是', label: 'yes'}],
        source_channel_val: [],
        acceptance_method_val: [],
        pushWeekend_val: [],
        emotional_type_val: []
      }
    },
    mounted() {
      // 获取地域
      this.provinceData = this.loadAll();
    },
    methods: {
      // 关闭弹窗
      closekeywordPopup() {
        this.keywordPopup = false;
      },
      // resetkeywordPopups() {
      //     this.keywordPopup = false;
      // },
      // 验证方案名称合法性
      changeCount() {
        var regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,10}$");
        if (this.scheme_name) {
          if (!regex.test(this.scheme_name)) {
            // document.querySelector('#scheme_name').focus();
            this.$message({message: '方案名称只能包含中文,英文或数字!', showClose: true, type: 'warning', duration: 1000})
          }
        }
      },
      // 获取公司信息
      querySearchCompany(queryString, cb) {
        var _this = this;
        var data = [];
//            this.$http.get('http://dev.in-hope.com.cn/v1/sentimentPlans/company', {
//               params:{company: queryString}
        this.$axios.sentiment.company({
          company: queryString
        }).then(function (res) {
          console.log(res);
          if (res.data.returnCode == 1) {
            // 调用 callback 返回建议列表的数据
            res.data.returnObject.forEach(function (a) {
              data.push({"value": a.name + "(" + a.code + ")", "code": a.code});
            })

            cb(data);
          } else {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }

        }, function (response) {
        })
      },
      handleSelectCompany(item) {
        // console.log(item);
        this.companyDatas = item.value;
        this.companyCode = item.code;
      },
      // 获取行业信息
      querySearchIndustry(queryString, cb) {
        var _this = this;
        var data = [];
//            this.$http.get('http://dev.in-hope.com.cn/v1/sentimentPlans/industry', {
//               params:{industry: queryString}
        this.$axios.sentiment.industry({
          industry: queryString
        }).then(function (res) {
          if (res.data.returnCode == 1) {
            // 调用 callback 返回建议列表的数据
            res.data.returnObject.forEach(function (a) {
              data.push({"value": a.levelOne});
            })

            cb(data);
          } else {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }
        }, function (response) {
        })
      },
      handleSelectIndustry(item) {
        this.industryDatas = item.value;
      },
      // 获取地域信息
      querySearchProvince(queryString, cb) {
        var restaurants = this.provinceData;
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      loadAll() {
        return [
          {value: "北京市"},
          {value: "天津市"},
          {value: "河北省"},
          {value: "山西省"},
          {value: "内蒙古自治区"},
          {value: "辽宁省"},
          {value: "吉林省"},
          {value: "黑龙江省"},
          {value: "上海市"},
          {value: "江苏省"},
          {value: "浙江省"},
          {value: "安徽省"},
          {value: "福建省"},
          {value: "江西省"},
          {value: "山东省"},
          {value: "河南省"},
          {value: "湖北省"},
          {value: "湖南省"},
          {value: "广东省"},
          {value: "广西壮族自治区"},
          {value: "海南省"},
          {value: "重庆市"},
          {value: "四川省"},
          {value: "贵州省"},
          {value: "云南省"},
          {value: "西藏自治区"},
          {value: "陕西省"},
          {value: "甘肃省"},
          {value: "青海省"},
          {value: "宁夏回族自治区"},
          {value: "新疆维吾尔自治区"},
          {value: "台湾省"},
          {value: "香港特别行政区"},
          {value: "澳门特别行政区"}
        ];
      },
      handleSelectProvince(item) {
        this.provinceDatas = item.value;
      },
      // 获取人物信息
      querySearchPeople(queryString, cb) {
        var _this = this;
        var data = [];

//            this.$http.get('http://dev.in-hope.com.cn/v1/sentimentPlans/manager', {
//               params:{manager: queryString}
        this.$axios.sentiment.manager({
          manager: queryString
        }).then(function (res) {
          if (res.data.returnCode == 1) {
            // 调用 callback 返回建议列表的数据
            res.data.returnObject.forEach(function (a) {
              data.push({"value": a.companyName + ' : ' + a.name});
            })

            cb(data);
          } else {
            _this.$alert('系统错误', '提示', {
              confirmButtonText: '确定'
            });
          }
        }, function (response) {
        })
      },
      handleSelectPeople(item) {
        this.peopleDatas = item.value;
      },
      // 对象去重
      // duplicate(arr, type) {
      //     var newArr = [];
      //     var tArr = [];
      //     var a = true;
      //     if (arr.length == 0) {
      //         return arr;
      //     } else {
      //         for (var i = 0; i < arr.length; i++) {
      //             if (!tArr[arr[i][type]]) {
      //               newArr.push(arr[i]);
      //               tArr[arr[i][type]] = true;
      //             } else {
      //               tArr[arr[i][type]] = false;
      //             }

      //             if (tArr[arr[i][type]] == false) {
      //               this.$message({message: '关键词重复！', showClose: true, type: 'warning', duration: 2000})
      //             }
      //         }
      //         return newArr;
      //     }
      // },
      keyword_is_delete(index) {
        this.keyword.splice(index, 1);
      },
      addKeyWord(valType) {
        if (this.keyword.length < 10) {
          this.roundString = Math.random();
          this.keywordType = valType;
          this.keywordPopup = true;
          // this.$prompt('请输入包含关键词', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消'
          // }).then(({ value }) => {
          //   if (value) {
          //     var val = value.replace(/\s*/g, "");
          //     this.keyword.push({name:val});
          //     // 获取新的包含关键词
          //     this.keyword = this.duplicate(this.keyword, 'name');
          //   }
          // }).catch(() => {

          // });
        } else {
          this.$message({message: '包含关键词只能包含10个！', showClose: true, type: 'warning', duration: 2000})
        }
      },
      // 添加关键词
      addKeyWordPopups(value, type) {
        if (value) {
          if (type == 1) {
            this.keyword.push({name: value});
          } else {
            this.no_keyword.push({name: value});
          }
          // 获取新的包含关键词
          // this.keyword = this.duplicate(this.keyword, 'name');
        }
        // 关闭弹窗
        this.keywordPopup = false;
      },
      no_keyword_is_delete(index) {
        this.no_keyword.splice(index, 1);
      },
      addNoKeyWord(valType) {
        if (this.no_keyword.length < 10) {
          this.roundString = Math.random();
          this.keywordType = valType;
          this.keywordPopup = true;
          // this.$prompt('请输入不包含关键词', '提示', {
          //   confirmButtonText: '确定',
          //   cancelButtonText: '取消'
          // }).then(({ value }) => {
          //   if (value) {
          //     var val = value.replace(/\s*/g, "");
          //     this.no_keyword.push({name:val});
          //     // 获取新的不包含关键词
          //     this.no_keyword = this.duplicate(this.no_keyword, 'name');
          //   }
          // }).catch(() => {

          // });
        } else {
          this.$message({message: '不含关键词只能包含10个！', showClose: true, type: 'warning', duration: 2000})
        }

      },
      // 来源渠道
      click_source_channel(index) {
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
      click_acceptance_method(index) {
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
      click_emotional_type(index) {
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
      click_relevance(index) {
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
      weekend_push(weekend_check) {
        if (weekend_check == true) {
          this.weekend_check = false;
          this.weekend_check_data = 'no';
        } else {
          this.weekend_check = true;
          this.weekend_check_data = 'yes';
        }
      },
      remove() {
        // 取消新增自定义列表
        this.$emit('resetCustom');
      },
      submission() {
        var _this = this;
        if (!this.scheme_name) {
          document.querySelector('#scheme_name').focus()
          this.$message({message: '方案名称不能为空！', showClose: true, type: 'warning', duration: 2000})
          return false
        } else {
          if (this.scheme_name.length > 10) {
            document.querySelector('#scheme_name').focus()
            this.$message({message: '方案名称最多10字符！', showClose: true, type: 'warning', duration: 2000})
            return false
          }

          var regex = new RegExp("^([\u4E00-\uFA29]|[\uE7C7-\uE7F3]|[a-zA-Z0-9_]){1,10}$");
          if (!regex.test(this.scheme_name)) {
            document.querySelector('#scheme_name').focus();
            this.$message({message: '方案名称只能包含中文,英文或数字!', showClose: true, type: 'warning', duration: 1000})
            return false;
          }
        }
        if (!String(this.company) && !this.industry && !this.province && !this.people) {
          document.querySelector('#company').focus()
          this.$message({message: '检测对象必填一项！', showClose: true, type: 'warning', duration: 3000})
          return false
        }
        if (this.company) {
          if (this.company != this.companyDatas) {
            document.querySelector('#company').focus()
            this.$message({message: '请选择正确的公司信息！', showClose: true, type: 'warning', duration: 2000})
            return false
          }
        }
        if (this.industry) {
          if (this.industry != this.industryDatas) {
            document.querySelector('#industry').focus()
            this.$message({message: '请选择正确的行业信息！', showClose: true, type: 'warning', duration: 2000})
            return false
          }
        }
        if (this.province) {
          if (this.province != this.provinceDatas) {
            document.querySelector('#province').focus()
            this.$message({message: '请选择正确的地域信息！', showClose: true, type: 'warning', duration: 2000})
            return false
          }
        }
        if (this.people) {
          if (this.people != this.peopleDatas) {
            document.querySelector('#people').focus()
            this.$message({message: '请选择正确的人物信息！', showClose: true, type: 'warning', duration: 2000})
            return false
          }
        }

        if (this.industry && !String(this.company) && !this.province && !this.people) {
          if (!(this.keyword.length || this.no_keyword.length)) {
            this.$message({message: '至少填写一项关键词！', showClose: true, type: 'warning', duration: 3000})
            return false
          }
        }
        if (!this.industry && !String(this.company) && this.province && !this.people) {
          if (!(this.keyword.length || this.no_keyword.length)) {
            this.$message({message: '至少填写一项关键词！', showClose: true, type: 'warning', duration: 3000})
            return false
          }
        }
        // // 来源渠道
        // if(!this.sourceChannelData) {
        //   this.$message({message: '请选择来源渠道！', showClose: true, type: 'warning', duration: 3000})
        //   return false
        // }
        // // 接收方式
        // if(!this.acceptanceMethodData) {
        //   this.$message({message: '请选择接收方式！', showClose: true, type: 'warning', duration: 3000})
        //   return false
        // }
        // // 情感类型
        // if(!this.emotionalTypeData) {
        //   this.$message({message: '请选择情感类型！', showClose: true, type: 'warning', duration: 3000})
        //   return false
        // }
        // // 相关性
        // if(!this.relevanceData) {
        //   this.$message({message: '请选择相关性！', showClose: true, type: 'warning', duration: 3000})
        //   return false
        // }
        // 包含关键词
        var includeKey = '';
        this.keyword.forEach(function (value) {
          // 多关键词用逗号隔开
          includeKey += value.name + ',';

        })
        // 不包含关键词
        var noIncludeKey = '';
        this.no_keyword.forEach(function (value) {
          // 多关键词用逗号隔开
          noIncludeKey += value.name + ',';
        })

        // 对推送间隔和推送时间做判断
        if (this.intervalId == '每天') {
          this.intervalId = 3;
        }
        if (this.timeId == '09:00-18:00') {
          this.timeId = 0;
        }
        // 新增自定义舆情方案
//            this.$http.post('http://dev.in-hope.com.cn/zuul/createSentimentPlans', {
//              "name": this.scheme_name.replace(/\s*/g, ""),
//              "company": this.company,
//              "companyCode": this.companyCode,
//              "industry": this.industry,
//              "area": this.province,
//              "manager": this.people,
//              "include": includeKey.slice(',', -1),
//              "except": noIncludeKey.slice(',', -1),
//              "source": this.sourceChannelData,
//              "pushType": this.acceptanceMethodData,
//              "sentimentType": this.emotionalTypeData,
//              "relationType": this.relevanceData,
//              "pushSleep": this.intervalId === '' ? '' : this.pushInterval[this.intervalId].value,
//              "pushTime": this.timeId === '' ? '' : this.pushTime[this.timeId].value,
//              "pushWeekend": this.weekend_check_data,
//              "type": "customer",
//              "userId": this.$cookie.get('userId')
//            }, {
//              emulateJSON:true
        this.$axios.sentiment.createSentimentPlans({
          "area": this.province,
          "company": this.company,
          "companyCode": this.companyCode,
          "except": noIncludeKey.slice(',', -1),
          "include": includeKey.slice(',', -1),
          "industry": this.industry,
          "manager": this.people,
          "name": this.scheme_name.replace(/\s*/g, ""),
          "pushSleep": this.intervalId === '' ? '' : this.pushInterval[this.intervalId].value,
          "pushTime": this.timeId === '' ? '' : this.pushTime[this.timeId].value,
          "pushType": this.acceptanceMethodData,
          "pushWeekend": this.weekend_check_data,
          "relationType": this.relevanceData,
          "sentimentType": this.emotionalTypeData,
          "source": this.sourceChannelData,
          "type": "customer",
          "userId": this.$cookie.get('userId')
        }).then(function (res) {
          if (res.data.returnCode == 1) {
            _this.$message({message: '自定义舆情方案新增成功！', showClose: true, type: 'success', duration: 2000})
            // _this.$router.push('/sentiment/sentimentMonitor')
            _this.$emit('saveCustom');
          }
        })

      }
    }
  }
</script>

<style lang="scss" scoped>
  #sentimentMonitorCustom {
    .el-row {margin: 10px -10px;}
    .company-card {margin: 10px;padding: 10px 15px 20px;border-radius: 8px;}
    .company-card:hover {-webkit-box-shadow: 0 0 20px rgba(50, 50, 50, 0.1);box-shadow: 0 0 20px rgba(50, 50, 50, 0.2);}
    .company-card-header {border-bottom: 1px solid #E3E3E3;padding-bottom: 8px;overflow: hidden;}
    .company-card-nopadding .company-card-header {padding: 0 15px 10px;}
    .company-card-header .company-card-title {float: left;height: 24px;line-height: 24px; font-size: 14px;font-weight: 800;color: #323232;}
    .company-card-body {overflow: hidden;padding-top: 10px;}
    .company-card-nopadding .company-card-body {overflow: hidden;padding-top: 0;}

  }
  #company-header {background: url(../../assets/image/sentiment/company-slogan@2x.png) no-repeat center;width: 100%;height: 150px;color: #fff;font-size: 16px;background-size: 100% 100%;}
  #company-header .company-title {display: table-cell;vertical-align: middle;float: left;height: 64px;margin: 43px 0;}
  #company-header .company-title h2 {margin: 0;font-size: 30px;line-height: 42px;}
  #company-header .company-title-only {display: table-cell;vertical-align: middle;float: left;height: 42px;margin: 54px 0;}
  #company-header .company-title-only h2 {margin: 0;font-size: 30px;line-height: 42px;}
  /* 表单 */
  .card-form-box .form-row {width: 100%;height: 40px;margin-bottom: 10px;}
  .card-form-box .form-row-auto {width: 100%;height: auto;margin-bottom: 10px;overflow: hidden;}
  .card-form-box .form-row label {float: left;height: 40px;line-height: 40px;font-size: 16px;color: #323232;margin-left: 5px;}
  .card-form-box .form-row-auto label {line-height: 40px;}
  .card-form-box .form-row .label-xs {width: 50px;}
  .card-form-box .form-row .label-sm {width: 96px;}
  .card-form-box .form-row .label-md {width: 100px;}
  .card-form-box .form-row .label-right {text-align: right;}
  .card-form-box .form-row input {float: left;height: 34px;line-height: 34px;border-radius: 4px;border: 1px solid #E3E3E3;padding: 0 10px;margin: 3px 0;color: #000;}
  .card-form-box .form-tips {font-size: 12px;color: #FFB148;margin-left: 100px;margin-top: -10px;}
  .card-form-box .form-input-frame {display: block; overflow: hidden;padding-left: 3em;}
  .card-form-box .form-input-frame label {color: #8D8D8D;}
  .card-form-box .form-input-frame .form-tips {margin-left: 55px;}
  .card-form-box .form-keyword-box .form-tips {margin-left: 100px;}
  .form-checkbox-group .el-checkbox {margin-right: 16px;}
  .form-checkbox-group .el-checkbox .el-checkbox__label {padding-left: 6px;}
  .form-row-auto label {float: left;margin-left: 5px;}
  .form-keyword-group {float: left; width: 600px;height: auto;}
  .form-row-auto .form-keyword-group {margin-left: 5px;}
  .form-keyword-group .form-keyword-item {display: inline-block;height: 24px;border: 1px solid #E3E3E3;border-radius: 4px;color: #AEAEAE;font-size: 12px;margin: 8px 5px;}
  .form-keyword-group .form-keyword-item span {padding: 0 6px 0 15px;line-height: 24px;cursor: pointer;}
  .form-keyword-group .form-keyword-item .icon-error {display: inline-block;width: 10px;height: 10px;background-size: 100%;background: url(../../assets/image/sentiment/icon/icon-error.svg) no-repeat center;}
  .form-keyword-group .form-keyword-item .iconfont {margin-right: 6px;font-size: 12px;position: relative;color: #AEAEAE;transform: rotate(90deg);}
  .form-keyword-group .form-keyword-tools {display: inline-block;margin-left: 5px;}
  .form-keyword-group .form-keyword-tools .icon-guanjiancitianjia {display: inline-block;width: 20px;height: 20px;position: relative;top: 5px;background-size: 100%;background: url(../../assets/image/sentiment/icon/icon-guanjiancitianjia.svg) no-repeat center;}
  .card-form-box .form-select-box {height: 40px;padding: 8px 0;margin-left: 90px;}
  .card-form-box .form-select-box input {width: 120px;height: 24px;font-size: 14px;text-align: left;}
  .card-form-box .form-select-box i {position: relative; top: 18px;}
  .form-row .form-btn-box {width: 326px;margin: 15px auto;}
  .form-btn-box .form-btn {display: inline-block;width: 150px;height: 35px;border-radius: 4px;font-weight: 800;font-size: 16px;text-align: center;}
  .form-btn-box .form-btn-cancel {background: rgba(255, 177, 72, .3);color: #FFB148;border: 1px solid #FFB148;margin-right: 20px;}
  .form-btn-box .form-btn-submit {background: #FFB148;color: #FFF;border: 1px solid #FFB148;}
  .form-split { border-bottom: 1px solid #e3e3e3;margin-bottom: 20px;}
  .form-split-title { width: 200px;margin: 0 auto;position: relative;top: 10px;background: #fff;text-align: center;color: #8D8D8D;font-size: 14px;}
  .el-input--small > > > .el-input__inner {width: 130px;height: 26px;line-height: 26px;font-size: 14px;}
  .form-input-frame > > > .el-input__inner {height: 34px;line-height: 34px;border-radius: 4px;border: 1px solid #E3E3E3;padding: 0 10px;margin: 3px 0;font-size: 16px;text-align: left;color: #000;}
  .el-message-box__wrapper {z-index: 99999;}
</style>




