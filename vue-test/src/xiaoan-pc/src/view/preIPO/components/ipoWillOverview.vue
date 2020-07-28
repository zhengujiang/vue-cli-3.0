<template>
  <div id="ipoWillOverview" class="content">
    <el-row :gutter="15">
      <el-col :span="18">
        <!--IPO上会公司所属板块数据统计-->
        <el-card shadow="never" class="overview-card box-card first-card" body-style="padding:0 16px"
                 v-loading="boardData.loading">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO上会公司所属板块数据统计</div>
            <div class="row text">
              <div class="block">
                <span class="demonstration">截止日期：</span>
                <el-date-picker class="picker-option" size="mini" v-model="selectDate" :picker-options="pickerOptions"
                                :editable="false" :clearable="false" align="center" type="date" placeholder="选择日期"
                                format="yyyy-MM-dd" @change="boardChange"
                                value-format="timestamp">
                </el-date-picker>
                <span class="el-icon-arrow-down"></span>
              </div>
            </div>
          </div>
          <div class="echart-box">
            <div class="echaets-dom" id="echarts-bars"></div>
          </div>
        </el-card>
        <!--IPO上会公司行业分布及通过率-->
        <el-card shadow="never" class="overview-card box-card first-card" body-style="padding:0 16px"
                 v-loading="companyData.investorLoading">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO上会公司行业分布</div>
            <div class="row text">
              <el-select class="select-item" size="mini" @change="companyInvestorChange" v-model="companyInvestorVal"
                         placeholder="请选择">
                <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="echart-box pie-box">
            <div class="echart-flex">
              <div class="row">
                <div class="echaets-dom" id="echarts-pies"></div>
              </div>
              <div class="row">
                <div class="echaets-dom" id="echarts-pies-GET"></div>
              </div>
            </div>
            <div class="not-shadow" v-if="companyData.investor.length == 0">
              <v-noInfo></v-noInfo>
            </div>
          </div>
        </el-card>
        <!--IPO上会公司辖区分布及通过率-->
        <el-card shadow="never" class="overview-card box-card first-card" body-style="padding:0 16px"
                 v-loading="companyData.precinctLoading">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO上会公司辖区分布</div>
            <div class="row text">
              <el-select class="select-item" size="mini" @change="companyPrecinctChange" v-model="companyPrecinctVal"
                         placeholder="请选择">
                <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="echart-box pie-box">
            <div class="echart-flex">
              <div class="row">
                <div class="echaets-dom" id="echarts-pieCity"></div>
              </div>
              <div class="row">
                <div class="echaets-dom" id="echarts-pieCity-GET"></div>
              </div>
            </div>
            <div class="not-shadow" v-if="companyData.precinct.length == 0">
              <v-noInfo></v-noInfo>
            </div>
          </div>
        </el-card>
        <!--IPO上会公司板块分布及通过率-->
        <el-card shadow="never" class="overview-card box-card first-card" body-style="padding:0 16px"
                 v-loading="companyData.marketLoading">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO上会公司板块分布及通过率</div>
            <div class="row text">
              <el-select class="select-item" size="mini" @change="companyMarketChange" v-model="companyMarketVal"
                         placeholder="请选择">
                <el-option v-for="item in selectData" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="echart-box pie-box">
            <div class="echart-flex">
              <div class="row">
                <div class="echaets-dom" id="echarts-pieMarket"></div>
              </div>
              <div class="row">
                <div class="echaets-dom" id="echarts-pieMarket-GET"></div>
              </div>
            </div>
            <div class="not-shadow" v-if="companyData.market.length == 0">
              <v-noInfo></v-noInfo>
            </div>
          </div>
        </el-card>
        <!--上会公司反馈意见关键词-->
        <el-card shadow="never" class="overview-card box-card first-card" body-style="padding:0 16px"
                 v-loading="keyWordFeedbackLoading">
          <div class="head-flex vux-1px-b">
            <div class="row title">上会公司反馈意见关键词</div>
            <div class="row text">
              <el-select class="select-item" size="mini" @change="companyFeedbackChange" v-model="companyFeedbackVal"
                         placeholder="请选择">
                <el-option v-for="item in keyWordOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="echart-box wordCloud-box">
            <div class="echart-flex">
              <div class="row">
                <div class="echaets-dom" id="echarts-wordCloud-feedback"></div>
              </div>
              <shadow-card v-if="keyWordFeedbackData.length == 0"></shadow-card>
            </div>
          </div>
        </el-card>
        <!--上会公司关注问题关键词-->
        <el-card shadow="never" class="overview-card box-card first-card" body-style="padding:0 16px">
          <div class="head-flex vux-1px-b">
            <div class="row title">上会公司关注问题关键词</div>
            <div class="row text">
              <el-select class="select-item" size="mini" @change="companyQuestionChange" v-model="companyQuestionVal"
                         placeholder="请选择">
                <el-option v-for="item in keyWordOption" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </div>
          <div class="echart-box wordCloud-box">
            <div class="echart-flex">
              <div class="row">
                <div class="echaets-dom" id="echarts-wordCloud-question"></div>
              </div>
            </div>
            <shadow-card v-if="keyWordQuestionData.length == 0"></shadow-card>
          </div>
        </el-card>
        <!--IPO上会公司所属中介机构排名-->
        <v-company-medium-item></v-company-medium-item>
      </el-col>
      <el-col :span="6">
        <v-adv :pageName="'投关检索'" style="margin-top:15px;"></v-adv>
        <v-company-new-i-p-o-count-item></v-company-new-i-p-o-count-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VCompanyNewIPOCountItem from '../components/company/companyNewIPOCountItem'
  import VCompanyMediumItem from '../components/company/companyMediumItem.vue'

  export default {
    name: "ipoRetrialOverview",
    components: {
      VCompanyNewIPOCountItem,
      VCompanyMediumItem
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < new Date('2014/06/25') || time.getTime() > new Date()
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },
        selectDate: '',
        //
        keyWordFeedbackLoading: true,
        keyWordFeedbackData: [],
        //
        keyWordQuestionLoading: true,
        keyWordQuestionData: [],
        //
        keyWordOption: [
          {label: '过去一年', value: 'ONE_YEAR'},
          {label: '过去90天', value: 'NINETY_DAY'},
          {label: '过去30天', value: 'THIRTY'},
          {label: '过去7天', value: 'SEVEN'}
        ],
        selectData: [
          {label: '过去一年', value: '4'},
          {label: '过去90天', value: '3'},
          {label: '过去30天', value: '2'},
          {label: '过去7天', value: '1'}
        ],
        boardData: {
          pass: [],
          notPass: [],
          defer: [],
          radio: [],
          time: [],
          loading: true
        },
        //
        companyInvestorVal: '4',
        companyPrecinctVal: '4',
        companyMarketVal: '4',
        companyData: {
          market: [],
          marketLoading: true,
          precinct: [],
          precinctLoading: true,
          investor: [],
          investorLoading: true
        },
        companyFeedbackVal: 'ONE_YEAR',
        companyQuestionVal: 'ONE_YEAR',
        userInfo: {}
      }
    },
    created() {
      this.selectDate = new Date().getTime();
      this.userInfo = window.JSON.parse(this.$cookie.get("userInfo"));
      this.getHotWords(this.companyFeedbackVal, 3);
      this.getHotWords(this.companyQuestionVal, 4);
      this.getIpoBoardData(this.selectDate);
      //
      this.companyInvestorFun(this.companyInvestorVal);
      this.companyPrecinctChange(this.companyPrecinctVal);
      this.companyMarketFun(this.companyMarketVal);
    },
    mounted() {
    },
    methods: {
      boardChange(val) {
        this.getIpoBoardData(val);
      },
      getHotWords(time, type) {
        if (type == 3) {
          this.keyWordFeedbackLoading = true;
        } else {
          this.keyWordQuestionLoading = true;
        }
        this.$http({
          method: 'GET',
          url: this.$api.publish.getHotWords,
          params: {
            dateEnum: time,
            type: type
          }
        }).then((res) => {
          if (type == 3) {
            this.keyWordFeedbackLoading = false;
          } else {
            this.keyWordQuestionLoading = false;
          }
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            // console.log(res.data.returnObject);
            var data = res.data.returnObject;
            if (type == 3) {
              this.keyWordFeedbackData = data.map((item) => {
                return {name: item.key, value: item.value}
              })
              this.$nextTick(() => {
                this.wordCloud('echarts-wordCloud-feedback', this.keyWordFeedbackData);
              })
            } else if (type == 4) {
              this.keyWordQuestionData = data.map((item) => {
                return {name: item.key, value: item.value}
              })
              this.$nextTick(() => {
                this.wordCloud('echarts-wordCloud-question', this.keyWordQuestionData);
              })
            }
          } else {
            if (type == 3) {
              this.keyWordFeedbackData = [];
            } else {
              this.keyWordQuestionData = [];
            }
          }
        }).catch(() => {
          setTimeout(() => {
            this.keyWordFeedbackLoading = false;
          }, 3000)
        })
      },
      //
      getDistributionData(item, select) {
        return new Promise((resolve, reject) => {
          this.$http({
            method: 'GET',
            url: this.$api.publish.getDistributionData,
            params: {
              publishItemType: item,
              publishCycleType: select
            }
          }).then(res => {
            if (res.data.returnCode == 1 || res.data.returnCode == 200) {
              resolve(res.data.returnObject);
            } else {
              resolve([]);
            }
          }).catch(reject);
        })
      },
      //
      companyInvestorChange(val) {
        this.companyInvestorFun(val);
      },
      //
      companyInvestorFun(val) {
        this.companyData.investorLoading = true;
        this.getDistributionData(1, val).then((data) => {
          this.companyData.investorLoading = false;
          console.log('1', data);
          var object = data.sort((a, b) => {
            return b.total - a.total
          })
          this.companyData.investor = object.map(e => {
            return {name: e.name, value: e.total, statusList: e.statusList}
          })
          this.companyData.investor = this.companyData.investor.filter((e) => {
            return e.value != 0
          })
          this.echartPies('echarts-pies', this.companyData.investor, '行业');
        }).catch((error) => {
          this.companyData.investorLoading = false;
        });
      },
      //
      companyPrecinctChange(val) {
        this.companyPrecinctFun(val);
      },
      //
      companyPrecinctFun(val) {
        this.companyData.precinctLoading = true;
        this.getDistributionData(2, val).then((data) => {
          this.companyData.precinctLoading = false;
          console.log('2', data);
          var object = data.sort((a, b) => {
            return b.total - a.total
          })
          this.companyData.precinct = object.map(e => {
            return {name: e.name, value: e.total, statusList: e.statusList}
          })
          this.companyData.precinct = this.companyData.precinct.filter((e) => {
            return e.value != 0
          })
          this.echartPies('echarts-pieCity', this.companyData.precinct, '辖区');
        }).catch((error) => {
          this.companyData.precinctLoading = false;
        });
      },
      //
      companyMarketChange(val) {
        this.companyMarketFun(val);
      },
      //
      companyMarketFun(val) {
        this.companyData.marketLoading = true;
        this.getDistributionData(3, val).then((data) => {
          this.companyData.marketLoading = false;
          console.log('3', data);
          var object = data.sort((a, b) => {
            return b.total - a.total
          })
          this.companyData.market = object.map(e => {
            return {name: e.name, value: e.total, statusList: e.statusList}
          });
          this.companyData.market = this.companyData.market.filter((e) => {
            return e.value != 0
          })
          this.echartPies('echarts-pieMarket', this.companyData.market, '板块');
        }).catch((error) => {
          this.companyData.marketLoading = false;
        });
      },
      //
      companyFeedbackChange() {
        this.getHotWords(this.companyFeedbackVal, 3);
      },
      //
      companyQuestionChange() {
        this.getHotWords(this.companyQuestionVal, 4);
      },
      // =>渲染
      wordCloud(id, dataS) {
        var myChart = echarts.init(document.getElementById(id));
        var that = this;
        var color = ['#602221', '#FFBF7D', '#968C6D', '#F7AB45', '#E2E2E2', '#968C6D', '#DB536A'];
        var option = {
          background: '#fff',
          series: [{
            type: 'wordCloud',
            // shape: 'circle',
            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.
            // maskImage: maskImage,
            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.
            left: 'center',
            top: '5%',
            width: '90%',
            height: '90%',
            right: 'center',
            bottom: '5%',
            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.
            sizeRange: [18, 36],
            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45
            rotationRange: [0, 45],
            // rotationStep: 45,
            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.
            gridSize: 12,
            // set to true to allow word being draw partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            drawOutOfBound: false,
            textStyle: {
              normal: {
                fontFamily: 'sans-serif',
                fontWeight: '400',
                color: () => {
                  return color[parseInt(Math.random() * 7)];
                }
              },
              emphasis: {
                fontSize: 36,
                shadowBlur: 20,
                backgroundColor: '#f8f8f8',
                shadowColor: '#f8f8f8',
                shadowOffsetX: 0,
                shadowOffsetY: 0
              }
            },
            data: dataS
            // data: data
          }]
        }
        myChart.setOption(option, true);
        myChart.on('click', (item) => {
          let newHost = that.$api.host;
          var tempWindow = window.open('_blank');
          if (id == 'echarts-wordCloud-feedback') {
            tempWindow.location = newHost + 'ipo/search?confition=3&keyword=' + encodeURI(item.data.name); // 后更改页面地址
          } else {
            tempWindow.location = newHost + 'ipo/search?confition=4&keyword=' + encodeURI(item.data.name); // 后更改页面地址
          }
        });
      },
      //
      echartBars(id, datas) {
        var myChart = echarts.init(document.getElementById(id));
        // myChart.title = '堆叠条形图';
        var option = {
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: true,
                precision: 0
              },
              type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: function (data) {
              var html = `<div style="display:flex;color:#323232;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                            <span>${data[0].name}</span>
                          </div>`;
              data.forEach((item) => {
                if (item.seriesName.indexOf('率') > -1) {
                  html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}%</span></div>`
                } else {
                  html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}</span></div>`
                }
              })
              return html
            }
          },
          legend: {
            x: 'left',
            data: ['通过', '未通过', '暂缓表决', '通过率']
          },
          grid: {
            top: 40,
            left: 0,
            right: 2,
            bottom: 1,
            containLabel: true
          },
          yAxis: [
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              splitLine: {
                show: false
              },
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            },
            {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                },
                formatter: '{value}%'
              },
              min: 0,
              max: 100,
              position: 'right',
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#ccc"
                }
              }
            }
          ],
          color: ['#602221', '#FFB148', '#FFE0B7', '#C0BAA7'],
          xAxis: {
            type: "category",
            axisLabel: {
              rotate: 30,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },

            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: datas.time
          },
          series: [
            {
              name: '通过',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              itemStyle: {
                normal: {
                  show: true,
                  barBorderRadius: 0,
                  borderWidth: 0
                }
              },
              data: datas.pass
            },
            {
              name: '未通过',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              itemStyle: {
                normal: {
                  show: true,
                  barBorderRadius: 0,
                  borderWidth: 0
                }
              },
              data: datas.notPass
            },
            {
              name: '暂缓表决',
              type: 'bar',
              stack: '总量',
              barMaxWidth: 20,
              itemStyle: {
                normal: {
                  show: true,
                  barBorderRadius: 1,
                  borderWidth: 0
                }
              },
              data: datas.defer
            },
            {
              name: '通过率',
              type: 'line',
              yAxisIndex: 1,
              itemStyle: {normal: {color: '#C0BAA7'}},
              symbol: "circle",
              symbolSize: 7,
              data: datas.radio
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      //
      echartPies(id, data, types) {
        const that = this;
        var myChart = echarts.init(document.getElementById(id));
        var color = ["#FFE0B7", "#FFB148", "#DC6900", "#B45E0B", "#602221", "#BB2740", "#DB536A", "#DB0808", "#FFB600", "#C0BAA7", "#968C6D", "#DDDDDD"];
        let formatter = '{b}', title = `上会公司` + types + `分布`
        if (id == 'echarts-pies') {
          formatter = '\n{b}';
        }
        var option = {
          tooltip: {
            show: true,
            trigger: 'item',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: false
              },
              type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          color: color,
          title: {
            text: title,
            left: 'center',
            bottom: 10,
            textStyle: {
              align: 'center',
              color: '#aeaeae',
              fontSize: 12
            }
          },
          series: [
            {
              name: 'IPO' + title,
              type: 'pie',
              minAngle: 6,
              selectedMode: 'single',
              hoverAnimation: false,
              radius: ['30%', '50%'],
              center: ['58%', '50%'],
              data: data,
              label: {
                show: true,
                position: 'outside',
                formatter: formatter,
                color: '#aeaeae'
              },
              labelLine: {
                show: true,
                length: 20,
                length2: 5,
                smooth: false,
                lineStyle: {
                  color: '#e3e3e3'
                }
              },
              itemStyle: {
                emphasis: {
                  label: {
                    show: true,
                    position: 'outside',
                    color: '#aeaeae'
                  },
                  labelLine: {
                    lineStyle: {
                      color: '#e3e3e3'
                    }
                  }
                }
              }
            }
          ]
        };
        myChart.setOption(option, true);
        let selectedData = [];
        var colorGet = ["#FFE0B7", "#FFB148", "#DC6900", "#602221", "#C0BAA7", "#DDDDDD"];
        setTimeout(() => {
          that.$nextTick(() => {
            if (data.length > 0) {
              myChart.dispatchAction({type: 'pieSelect', seriesIndex: 0, dataIndex: 0, name: data[0].name});
              selectedData = data[0].statusList.map((item, index) => {
                return {name: item.statusName, value: item.count, itemStyle: {color: colorGet[index]}}
              });
              selectedData = selectedData.filter((item) => {
                return item.value > 0
              })
              //
              that.echartPiesGET(id + '-GET', selectedData, data[0].name);
            }
          });
        }, 600);
        myChart.on('pieselectchanged', params => {
          // 图例开关的行为只会触发 legendselectchanged 事件
          var isSelected = params.selected[params.name];
          // 在控制台中打印
          if (isSelected) {
            // 选中
            var selectObj = [];
            data.forEach((item) => {
              if (params.name == item.name) {
                selectObj = item.statusList;
              }
            })
            selectedData = selectObj.map((item, index) => {
              return {name: item.statusName, value: item.count, itemStyle: {color: colorGet[index]}}
            });
            selectedData = selectedData.filter((item) => {
              return item.value > 0
            })
            //
            that.echartPiesGET(id + '-GET', selectedData, params.name);
          }
        })
        myChart.on('pieselected', params => {
          // 图例开关的行为只会触发 legendselectchanged 事件
        })
      },
      //
      echartPiesGET(id, data, titles) {
        var myChart = echarts.init(document.getElementById(id));
        var color = ["#FFE0B7", "#FFB148", "#DC6900", "#602221", "#C0BAA7", "#DDDDDD"];
        let title = titles + '上会公司通过率';
        let formatter = function (val) {
          return (val.name + '\n').replace('，', '\n');
        };
        var option = {
          color: color,
          tooltip: {
            show: true,
            trigger: 'item',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            confine: true,
            axisPointer: { // 坐标轴指示器配置项
              label: {
                show: false
              },
              type: 'cross', // 指示器类型，十字准星
              crossStyle: {
                type: 'solid',
                color: '#e3e3e3'
              },
              lineStyle: {
                color: '#e3e3e3'
              }
            },
            textStyle: {
              color: "#aeaeae",
              fontSize: 12
            },
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          title: {
            text: title,
            left: 'center',
            bottom: 10,
            textStyle: {
              align: 'center',
              color: '#aeaeae',
              fontSize: 12
            }
          },
          series: [
            {
              name: 'IPO' + title,
              type: 'pie',
              minAngle: 6,
              // selectedMode: 'single',
              hoverAnimation: false,
              radius: ['30%', '50%'],
              center: ['50%', '50%'],
              data: data,
              label: {
                show: true,
                position: 'outside',
                formatter: formatter,
                color: '#aeaeae'
              },
              labelLine: {
                show: true,
                length: 20,
                length2: 5,
                smooth: false,
                lineStyle: {
                  color: '#e3e3e3'
                }
              },
              itemStyle: {
                emphasis: {
                  label: {
                    show: true,
                    position: 'outside',
                    color: '#aeaeae'
                  },
                  labelLine: {
                    lineStyle: {
                      color: '#e3e3e3'
                    }
                  }
                }
              }
            }
          ]
        };
        // console.log('===>', app);
        myChart.setOption(option, true);
      },
      //
      getIpoBoardData(time) {
        this.boardData.loading = true;
        this.$http({
          method: 'GET',
          url: this.$api.publish.getIpoBoardData,
          params: {
            deadLineTime: time
          }
        }).then((res) => {
          this.boardData.loading = false;
          console.log(res.data.returnObject);
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            var data = res.data.returnObject;
            this.boardData.time = data.map((e) => {
              return this.$common.transTime(e.dataTime)[5];
            })
            this.boardData.pass = data.map((e) => {
              return e.passCount
            })
            this.boardData.notPass = data.map((e) => {
              return e.notpassCount
            })
            this.boardData.defer = data.map((e) => {
              return e.defervoteCount
            })
            this.boardData.radio = data.map((e) => {
              return parseFloat((e.passradio).replace('%', ''));
            });
            //
            console.log('===>', this.boardData);
            this.echartBars('echarts-bars', this.boardData);
          }
        }).catch((err) => {
          setTimeout(() => {
            this.boardData.loading = false;
          }, 3000)
        })
      }
    }
  }
</script>

<style lang="scss">
  #ipoWillOverview {
    .box-card {
      .head-flex {
        width: 100%;
        display: flex;
        align-items: center;
        height: 45px;
        .row {
          flex: 1;
          &.title {
            font-size: 14px;
            color: #323232;
            font-weight: bold;
          }
          &.text {
            flex: inherit;
            text-align: right;
            font-size: 12px;
            color: #8d8d8d;
            .el-select {
              width: 105px;
              .el-input__inner {
                height: 26px;
                line-height: 1;
              }
            }
            .block {
              border: 1px solid #e3e3e3;
              border-radius: 4px;
              padding: 0 5px;
              cursor: pointer;
              &.no-border {
                border: 0;
                cursor: text;
              }
              .picker-option {
                width: 70px;
                .el-input__inner {
                  padding: 0;
                  border: 0;
                  height: 24px;line-height: 1;
                }
                .el-input__prefix {
                  display: none;
                }
              }
            }
          }
        }
      }
      &.overview-card {
        min-height: 200px;
        width: 100%;
      }
    }
    .warning {
      font-size: 12px;
      color: #aeaeae;
      text-align: left;
      margin-top: 20px;
      font-weight: normal;
    }
    .tabs-box {
      .splitTab {
        position: absolute;
        right: -40px;
        top: 0;
        color: #e3e3e3;
        font-weight: 100;
      }
      .el-tabs__header {
        margin-bottom: 10px;
      }
      .el-tabs__item {
        height: 40px;
        line-height: 40px;
        color: #8d8d8d;
        font-size: 14px;
        font-weight: normal;
        transition: all .3s;
      }
      .el-tabs__nav-wrap::after {
        height: 1px;
      }
      .el-tabs__item.is-active {
        color: #ffb148;
        font-weight: bold;
        // border-bottom: 2px solid #ffb148;
        .date {
          color: #ffb148;
        }
      }
    }
  }
</style>
<style lang="scss" scoped>
  #ipoWillOverview {
    .box-card.first-card {
      margin-top: 16px;
    }
    .box-card {
      .echart-box {
        height: 295px;
        width: 100%;
        position: relative;
        &.wordCloud-box {
          height: 200px;
        }
        .not-shadow {
          width: 100%;
          position: absolute;
          top: 0;
          left: 0;
          overflow: hidden;
          background-color: #fff;
        }
        &.pie-box {
          height: 400px;
        }
        .echaets-dom {
          height: 100%;
          width: 100%;
        }
        .echart-flex {
          display: flex;
          height: 100%;
          width: 100%;
          position: relative;
          .row {
            flex: 1;
          }
        }
      }
    }
  }
</style>
