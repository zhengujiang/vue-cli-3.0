<template>
  <div id="ipoRetrialOverview" class="content">
    <el-row :gutter="15">
      <el-col :span="18">
        <!---->
        <el-card shadow="never" class="overview-card box-card first-card" body-style="padding:0 16px"
                 v-loading="marketFromAuditingLoading">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO在审公司所属板块数据统计</div>
            <div class="row text">
              <div class="block">
                <span class="demonstration">截止日期：</span>
                <el-date-picker class="picker-option" size="mini" v-model="selectData" :picker-options="pickerOptions"
                                @change="marketFromAuditingChange" :editable="false" :clearable="false" align="center"
                                type="date"
                                placeholder="选择日期" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
                <span class="el-icon-arrow-down"></span>
              </div>
            </div>
          </div>
          <div class="echart-box">
            <div class="echaets-dom" id="echarts-bars"></div>
          </div>
        </el-card>
        <!---->
        <el-card shadow="never" class="overview-card box-card" body-style="padding:0 16px"
                 v-loading="auditStatusFromAuditingLoading">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO在审公司进度数据统计</div>
            <div class="row text">
              <div class="block">
                <span class="demonstration">截止日期：</span>
                <el-date-picker class="picker-option" size="mini" v-model="auditSelectData"
                                :picker-options="pickerOptions"
                                @change="auditStatusFromAuditingChange" :editable="false" :clearable="false"
                                align="center" type="date"
                                placeholder="选择日期" format="yyyy-MM-dd" value-format="timestamp">
                </el-date-picker>
                <span class="el-icon-arrow-down"></span>
              </div>
            </div>
          </div>
          <div class="echart-box">
            <div class="echaets-dom" id="echarts-lines"></div>
          </div>
        </el-card>
        <!---->
        <el-card shadow="never" class="overview-card box-card" body-style="padding:0 16px">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO在审公司行业分布</div>
            <div class="row text">
              <div class="block no-border">
                <span class="demonstration">{{distributionOption.industryTime}}</span>
              </div>
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
          </div>
        </el-card>
        <!---->
        <el-card shadow="never" class="overview-card box-card" body-style="padding:0 16px">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO在审公司辖区分布</div>
            <div class="row text">
              <div class="block no-border">
                <span class="demonstration">{{distributionOption.areaTime}}</span>
              </div>
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
          </div>
        </el-card>
        <!---->
        <el-card shadow="never" class="box-card demonstration-card" body-style="padding:0 16px"
                 v-loading="institutionFromAuditingLoading">
          <div class="head-flex vux-1px-b">
            <div class="row title">IPO在审公司所属中介机构排名</div>
            <div class="row text">
              <div class="block no-border">
                <span class="demonstration">{{institutionFromAuditingTime}}</span>
              </div>
            </div>
          </div>
          <div class="tabs-content">
            <el-tabs v-model="activeName" @tab-click="handleClick" class="tabs-box">
              <el-tab-pane class="v-tabs-item" label="保荐机构" name="QUESTION">
                <!--提问数最多的公司-->
                <table border="0" class="company-table">
                  <thead>
                  <tr>
                    <td class="row index">序号</td>
                    <td class="row companyName">保荐机构</td>
                    <td class="row code">沪主板</td>
                    <td class="row number">中小板</td>
                    <td class="row number">创业板</td>
                    <td class="row total">合计</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) of institutionFromAuditingData.sponsorInstitution"
                      :class="{'is-background': (index+1) % 2 == 0}">
                    <td class="row index"><span class="indexNo" :class="'index'+index">{{index+1}}</span></td>
                    <td class="row companyName">
                      <router-link class="link" :to="'/ipo/retrial/list?active=all&sponsor='+item.id" target="_blank">
                        {{item.name}}
                      </router-link>
                    </td>
                    <td class="row code">{{item.totalSH}}</td>
                    <td class="row number">{{item.totalZX}}</td>
                    <td class="row number">{{item.totalCY}}</td>
                    <td class="row number">{{item.total}}</td>
                  </tr>
                  </tbody>
                </table>
              </el-tab-pane>
              <el-tab-pane class="v-tabs-item" label="律师事务所" name="ANSWER">
                <!--回答数最多的公司-->
                <table border="0" class="company-table">
                  <thead>
                  <tr>
                    <td class="row index">序号</td>
                    <td class="row companyName">律师事务所</td>
                    <td class="row code">沪主板</td>
                    <td class="row number">中小板</td>
                    <td class="row number">创业板</td>
                    <td class="row total">合计</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) of institutionFromAuditingData.lawFirm"
                      :class="{'is-background': (index+1) % 2 == 0}">
                    <td class="row index"><span class="indexNo" :class="'index'+index">{{index+1}}</span></td>
                    <td class="row companyName">
                      <router-link class="link" :to="'/ipo/retrial/list?active=all&lawfirm='+item.id" target="_blank">
                        {{item.name}}
                      </router-link>
                    </td>
                    <td class="row code">{{item.totalSH}}</td>
                    <td class="row number">{{item.totalZX}}</td>
                    <td class="row number">{{item.totalCY}}</td>
                    <td class="row number">{{item.total}}</td>
                  </tr>
                  </tbody>
                </table>
              </el-tab-pane>
              <el-tab-pane class="v-tabs-item" label="会计师事务所" name="ANSWERRATE">
                <!--回复率最多的公司-->
                <table border="0" class="company-table">
                  <thead>
                  <tr>
                    <td class="row index">序号</td>
                    <td class="row companyName">会计师事务所</td>
                    <td class="row code">沪主板</td>
                    <td class="row number">中小板</td>
                    <td class="row number">创业板</td>
                    <td class="row total">合计</td>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) of institutionFromAuditingData.accountingFirm"
                      :class="{'is-background': (index+1) % 2 == 0}">
                    <td class="row index"><span class="indexNo" :class="'index'+index">{{index+1}}</span></td>
                    <td class="row companyName">
                      <router-link class="link" :to="'/ipo/retrial/list?active=all&accountingfirm='+item.id"
                                   target="_blank">
                        {{item.name}}
                      </router-link>
                    </td>
                    <td class="row code">{{item.totalSH}}</td>
                    <td class="row number">{{item.totalZX}}</td>
                    <td class="row number">{{item.totalCY}}</td>
                    <td class="row number">{{item.total}}</td>
                  </tr>
                  </tbody>
                </table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <v-adv :pageName="'投关检索'" style="margin-top:15px;"></v-adv>
        <v-company-will-item></v-company-will-item>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import VCompanyWillItem from './company/companyWillItem'
  export default {
    name: "ipoRetrialOverview",
    components: {
      VCompanyWillItem
    },
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < new Date('2017/9/28') || time.getTime() > new Date()
          },
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date());
              }
            },
            {
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
            }
          ]
        },
        selectData: '',
        marketFromAuditingLoading: true,
        marketFromAuditingData: {
          date: [],
          sh: [],
          zx: [],
          cy: [],
          total: []
        },
        auditSelectData: '',
        auditStatusFromAuditingLoading: true,
        auditStatusFromAuditingData: {
          feedback: [],
          update: [],
          defer: [],
          by: [],
          stop: [],
          accept: []
        },
        //
        distributionOption: {
          area: [],
          areaTime: '',
          industry: [],
          industryTime: ''
        },
        //
        institutionFromAuditingData: {
          accountingFirm: [],
          lawFirm: [],
          sponsorInstitution: [],
          time: ''
        },
        institutionFromAuditingTime: '',
        institutionFromAuditingLoading: true,

        //
        activeName: 'QUESTION',
        tableDataQ: [],
        tableDataA: [],
        tableDataR: [],
        tableDataLading: false

      }
    },
    created() {
      this.selectData = new Date().getTime()
      this.auditSelectData = new Date().getTime()
      this.getMarketFromAuditing(this.selectData);
      this.getAuditStatusFromAuditing(this.auditSelectData);
      this.getInstitutionFromAuditing();
      //
      this.getDistributionFromAuditing('Area_Distribution_Auditing');
      this.getDistributionFromAuditing('Industry_Distribution_Auditing');
    },
    mounted() {
    },
    methods: {
      // 第一张图  change api
      marketFromAuditingChange(val) {
        this.getMarketFromAuditing(val);
      },
      //
      getMarketFromAuditing(time) {
        this.marketFromAuditingLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.publish.getMarketFromAuditing,
          params: {
            releaseTime: time
          }
        }).then((res) => {
          this.marketFromAuditingLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            console.log(res.data.returnObject);
            let data = res.data.returnObject.list;
            data = data.reverse()
            // let '';
            this.marketFromAuditingData.date = data.map((item) => {
              return this.$common.transTime(item.releaseDate)[5]
            });
            data.forEach((item) => {
              let sh = '', zx = '', cy = '';
              item.statusList.forEach((k) => {
                if (k.statusName.indexOf('主板') > -1) {
                  sh = k.count
                }
                if (k.statusName.indexOf('中小') > -1) {
                  zx = k.count
                }
                if (k.statusName.indexOf('创业') > -1) {
                  cy = k.count
                }
              })
              this.marketFromAuditingData.sh.push(sh);
              this.marketFromAuditingData.zx.push(zx);
              this.marketFromAuditingData.cy.push(cy);
            })
            this.$nextTick(() => {
              this.echartBars('echarts-bars');
            })
          }
        }).catch(() => {
          setTimeout(() => {
            this.marketFromAuditingLoading = false;
          }, 3000)
        })
      },
      // 折线 change api
      auditStatusFromAuditingChange() {
        this.getAuditStatusFromAuditing(this.auditSelectData);
      },
      //
      getAuditStatusFromAuditing(time) {
        this.auditStatusFromAuditingLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.publish.getAuditStatusFromAuditing,
          params: {
            releaseTime: time
          }
        }).then((res) => {
          this.auditStatusFromAuditingLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            console.log(res.data.returnObject);
            let data = res.data.returnObject.list;
            data = data.reverse();
            //
            this.auditStatusFromAuditingData.date = data.map((item) => {
              return this.$common.transTime(item.releaseDate)[5]
            });
            //
            data.forEach((item) => {
              let feedback = '', update = '', defer = '', by = '', stop = '', accept = '';
              item.statusList.forEach((k) => {
                if (k.statusName.indexOf('已反馈') > -1) {
                  feedback = k.count
                }
                if (k.statusName.indexOf('预先披露更新') > -1) {
                  update = k.count
                }
                if (k.statusName.indexOf('暂缓表决') > -1) {
                  defer = k.count
                }
                if (k.statusName.indexOf('已通过') > -1) {
                  by = k.count
                }
                if (k.statusName.indexOf('中止审查') > -1) {
                  stop = k.count
                }
                if (k.statusName.indexOf('已受理') > -1) {
                  accept = k.count
                }
              })
              this.auditStatusFromAuditingData.feedback.push(feedback);
              this.auditStatusFromAuditingData.update.push(update);
              this.auditStatusFromAuditingData.defer.push(defer);
              this.auditStatusFromAuditingData.by.push(by);
              this.auditStatusFromAuditingData.stop.push(stop);
              this.auditStatusFromAuditingData.accept.push(accept);
            })
            console.log('=============>', this.auditStatusFromAuditingData);
            this.$nextTick(() => {
              this.echartLines('echarts-lines');
            })
          }
        }).catch(() => {
          setTimeout(() => {
            this.auditStatusFromAuditingLoading = false;
          }, 3000)
        })
      },
      //
      handleClick() {

      },
      //
      getDistributionFromAuditing(distribution) {
        this.$http({
          method: 'GET',
          url: this.$api.publish.getDistributionFromAuditing,
          params: {
            publishDistributionEnum: distribution
          }
        }).then((res) => {
          if (res.data.returnCode == 200) {
            var data = res.data.returnObject.list;
            data = data.sort(function (a, b) {
              return b.total - a.total
            })
            if (distribution == 'Area_Distribution_Auditing') {
              this.distributionOption.areaTime = res.data.returnObject.date;
              this.distributionOption.area = data.map(e => {
                return {name: e.name, value: e.total, statusList: e.statusList, selected: false}
              });
              this.distributionOption.area = this.distributionOption.area.filter((e) => {
                return e.value != 0
              })
              //
              this.echartPies('echarts-pieCity', this.distributionOption.area);
            } else if (distribution == 'Industry_Distribution_Auditing') {
              this.distributionOption.industryTime = res.data.returnObject.date;
              this.distributionOption.industry = data.map((e, index) => {
                return {name: e.name, value: e.total, statusList: e.statusList, selected: false}
              });
              this.distributionOption.industry = this.distributionOption.industry.filter((e) => {
                return e.value != 0
              })
              //
              this.echartPies('echarts-pies', this.distributionOption.industry);
            }
          }
        }).catch((err) => {

        })
      },
      //
      echartBars(id) {
        var data = this.marketFromAuditingData
        var myChart = echarts.init(document.getElementById(id));
        var option = {
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            fontSize: 12,
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
              var html = `<div style="display:flex;align-items:center;color:#323232;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: left">
                            <span>${data[0].name}</span>
                          </div>`;
              var number = 0;
              data.forEach((item) => {
                number += Number(item.value);
                html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${item.seriesName}：</span><span style="color: ${item.color}">${item.value}</span></div>`
              });
              html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${'合计'}：</span><span>${number}</span></div>`
              // console.log('324', data, i);
              return html
            }
          },
          legend: {
            top: 6,
            x: 'left',
            data: ['沪主板', '中小板', '创业板']
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
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#e3e3e3"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#e3e3e3"
                }
              }
            }, {
              type: "value",
              name: "",
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#e3e3e3"
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#e3e3e3"
                }
              }
            }
          ],
          color: ['#602221', '#FFB148', '#FFE0B7'],
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
            data: data.date
          },
          series: [
            {
              name: '沪主板',
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
              data: data.sh
            },
            {
              name: '中小板',
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
              data: data.zx
            },
            {
              name: '创业板',
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
              data: data.cy
            }
          ]
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      //
      echartLines(id) {
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#968C6D', '#FFB148', '#DC6900', '#BB2740', '#FC6D40'];
        var dataAll = this.auditStatusFromAuditingData;
        var option = {
          legend: {
            top: 6,
            x: 'left',
            data: ['已受理', '已反馈', '预先披露更新', '暂缓表决', '已通过发审会', '中止审查']
          },
          tooltip: {
            // 提示框
            trigger: 'axis',
            position: function (pt) {
              return [pt[0], '10%'];
            },
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            fontSize: 12,
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
            formatter: function (data) {
              var html = `<div style="display:flex;justify-content:left;color:#323232;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                            <span>${data[0].name}</span>
                          </div>`;
              var number = 0;
              data.forEach((item) => {
                number += Number(item.value);
                html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${item.seriesName}：</span><span style="color:${item.color}">${item.value}</span></div>`
              });
              html += `<div style="display:flex;color:#8d8d8d;justify-content:space-between"><span>${'合计'}：</span><span>${number}</span></div>`
              return html
            }
          },
          grid: {
            top: 40,
            left: 0,
            right: '1%',
            bottom: 0,
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
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
                  color: "#e3e3e3"
                }
              },
              boundaryGap: false,
              data: dataAll.date
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                textStyle: {
                  color: "#8d8d8d",
                  fontSize: 10
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: "#f0f1f5"
                }
              },
              axisTick: {
                length: 0
              },
              axisLine: {
                symbolSize: [0, 0],
                lineStyle: {
                  color: "#e3e3e3"
                }
              }
            }, {
              type: 'value',
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
                  color: "#e3e3e3"
                }
              }
            }
          ],
          series: [
            {
              name: '已受理',
              type: 'line',
              stack: '总量',
              symbol: "circle",
              symbolSize: 7,
              itemStyle: {normal: {color: color[0]}},
              areaStyle: {
                opacity: 0.4
                // color: 'rgba(210, 163, 137, 0.5)'
              },
              data: dataAll.accept
            },
            {
              name: '已反馈',
              type: 'line',
              stack: '总量',
              symbol: "circle",
              symbolSize: 7,
              itemStyle: {normal: {color: color[1]}},
              areaStyle: {
                opacity: 0.5
                // color: 'rgba(105, 217, 198, 0.5)'
              },
              data: dataAll.feedback
            },
            {
              name: '预先披露更新',
              type: 'line',
              stack: '总量',
              symbol: "circle",
              symbolSize: 7,
              itemStyle: {normal: {color: color[2]}},
              areaStyle: {
                opacity: 0.3
                // color: 'rgba(255, 177, 72, 0.3)'
              },
              data: dataAll.update
            },
            {
              name: '暂缓表决',
              type: 'line',
              stack: '总量',
              symbol: "circle",
              symbolSize: 7,
              itemStyle: {normal: {color: color[3]}},
              areaStyle: {
                opacity: 0.5
                // color: 'rgba(115, 139, 255, 0.4)'
              },
              data: dataAll.defer
            },
            {
              name: '已通过发审会',
              type: 'line',
              stack: '总量',
              symbol: "circle",
              symbolSize: 7,
              itemStyle: {normal: {color: color[4]}},
              areaStyle: {
                opacity: 0.5
                // color: 'rgba(209, 90, 236, 0.4)'
              },
              data: dataAll.by
            },
            {
              name: '中止审查',
              type: 'line',
              stack: '总量',
              symbol: "circle",
              symbolSize: 7,
              itemStyle: {normal: {color: color[5]}},
              areaStyle: {
                opacity: 0.3
                // color: 'rgba(252, 109, 64, 0.3)'
              },
              data: dataAll.stop
            }
          ]
        };
        myChart.setOption(option, true);
      },
      //
      echartPies(id, data) {
        const that = this;
        var myChart = echarts.init(document.getElementById(id));
        var color = ["#FFE0B7", "#FFB148", "#DC6900", "#B45E0B", "#602221", "#BB2740", "#DB536A", "#DB0808", "#FFB600", "#C0BAA7", "#968C6D", "#DDDDDD"];
        let formatter = '{b}', title = '在审公司辖区分布';
        if (id == 'echarts-pies') {
          formatter = '\n{b}';
          title = '在审公司行业分布'
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
            bottom: 30,
            textStyle: {
              align: 'center',
              color: '#545454',
              fontSize: 12,
              fontWeight: 400
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
          myChart.dispatchAction({type: 'pieSelect', seriesIndex: 0, dataIndex: 0, name: data[0].name});
          selectedData = data[0].statusList.map((item, index) => {
            return {name: item.statusName, value: item.count, itemStyle: {color: colorGet[index]}}
          });
          selectedData = selectedData.filter((item) => {
            return item.value > 0
          })
          if (id == 'echarts-pies') {
            that.echartPiesGET('echarts-pies-GET', selectedData, data[0].name);
          } else {
            that.echartPiesGET('echarts-pieCity-GET', selectedData, data[0].name + '辖区');
          }
        }, 1000);
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
            //
            selectedData = selectedData.filter((item) => {
              return item.value > 0
            })
            //
            if (id == 'echarts-pies') {
              that.echartPiesGET('echarts-pies-GET', selectedData, params.name);
            } else {
              that.echartPiesGET('echarts-pieCity-GET', selectedData, params.name + '辖区');
            }
          }
        })
        myChart.on('pieselected', params => {
          // 图例开关的行为只会触发 legendselectchanged 事件
        })
      },
      //
      echartPiesGET(id, data, titles) {
        console.log(data)
        var myChart = echarts.init(document.getElementById(id));
        var color = ["#FFE0B7", "#FFB148", "#DC6900", "#602221", "#C0BAA7", "#DDDDDD"];
        let title = titles + '在审公司进度分布';
        let formatter = function (val) {
          return (val.name + '\n').replace('，', '\n');
        };
        var option = {
          // color: color,
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
            bottom: 30,
            textStyle: {
              align: 'center',
              color: '#545454',
              fontSize: 12,
              fontWeight: 400
            }
          },
          series: [
            {
              name: 'IPO' + title,
              type: 'pie',
              // selectedMode: 'single',
              hoverAnimation: false,
              radius: ['30%', '50%'],
              center: ['52%', '50%'],
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
      // 获取在审公司所属中介机构排名
      getInstitutionFromAuditing() {
        this.institutionFromAuditingLoading = true;
        this.$http({
          method: 'GET',
          url: this.$api.publish.getInstitutionFromAuditing,
          params: {}
        }).then((res) => {
          this.institutionFromAuditingLoading = false;
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            console.log(res.data.returnObject);
            let data = res.data.returnObject;
            this.institutionFromAuditingTime = data.date;
            this.institutionFromAuditingData.accountingFirm = data.ACCOUNTING_FIRM;
            this.institutionFromAuditingData.lawFirm = data.LAW_FIRM;
            this.institutionFromAuditingData.sponsorInstitution = data.SPONSOR_INSTITUTION;

          }
        }).catch((err) => {
          setTimeout(() => {
            this.institutionFromAuditingLoading = false;
          }, 3000)
        })
      }
    }
  }
</script>

<style lang="scss">
  #ipoRetrialOverview {
    .box-card {
      width: 100%;
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
        min-height: 340px;
        width: 100%;
      }
      &.demonstration-card {
        min-height: 540px;
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
  #ipoRetrialOverview {
    .box-card.first-card {
      margin-top: 16px;
    }
    .box-card {
      .echart-box {
        height: 295px;
        width: 100%;
        &.pie-box {
          height: 410px;
        }
        .echaets-dom {
          height: 100%;
          width: 100%;
        }
        .echart-flex {
          display: flex;
          height: 100%;
          .row {
            flex: 1;
          }
        }
      }
      .tabs-content {
        padding-bottom: 16px;
        .company-table {
          width: 100%;
          font-size: 14px;
          border: none;
          border: 0;
          border-collapse: collapse;
          table-layout: fixed;
          thead {
            tr {
              background: #f2f2f2;
              height: 35px;
              font-size: 14px;
              color: rgba(50, 50, 50, 1);
              td {
                color: #323232;
                font-size: 14px;
              }
              .row {
                text-align: center;
                &.companyName {
                  width: 185px;
                }
                &.index {
                  width: 55px;
                }
                &.total {
                  width: 80px;
                }
              }
            }
          }
          tbody {
            tr {
              height: 40px;
              td {
                font-size: 14px;
                color: #545454;
              }
              .row {
                text-align: center;
                font-size: 14px;
                color: rgba(84, 84, 84, 1);
              }
              &.is-background {
                background: #F8F8F8;
              }
              .link {
                &:hover {
                  color: #FFB148;
                  text-decoration: underline;
                }
              }
              .index {
                width: 55px;
                font-size: 16px;
                color: #323232;
                text-align: center;
                .indexNo {
                  display: inline-flex;
                  align-items: center;
                  text-align: center;
                  height: 18px;
                  width: 18px;
                  font-size: 14px;
                  line-height: 1;
                  border-radius: 50%;
                  justify-content: center;
                  &.index0 {
                    background-color: #FFCE61;
                    color: white;
                  }
                  &.index1 {
                    background-color: #FEA734;
                    color: white;
                  }
                  &.index2 {
                    background-color: #C0BAA7;
                    color: white;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
