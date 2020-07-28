<template>
  <div id="xa_demo" class="">
    <div class="vxa-container">
      <!---->
      <el-row :gutter="16">
        <el-col :span="16">
          <!--具体内容Card-->
          <el-card class="vxa-box-card margin-t" shadow="hover" body-style="padding:0 16px;">
            <div class="vxa-card-header vxa-flax-box align vxa-1px-b">
              <div class="col"><span class="bold">DEMODEMODEMO</span></div>
              <div class="col t-right">
                <span class="header-right">2018-01-01</span>
              </div>
            </div>
            <div class="vxa-card-content">
              <div v-for="o in 10" :key="o" class="text item">
                {{'列表内容 ' + o }}
              </div>
            </div>
          </el-card>
          <!---->
          <!--带时间选择器的Card-->
          <el-card class="vxa-box-card margin-t" shadow="hover" body-style="padding:0 16px;">
            <div class="vxa-card-header vxa-flax-box align vxa-1px-b">
              <div class="col"><span class="bold">DEMODEMODEMO</span></div>
              <div class="col t-right">
                <el-date-picker class="vxa-card-picker" size="mini" v-model="value2" align="right" type="date"
                                placeholder="选择日期"
                                :picker-options="pickerOptions" :clearable="false" :editable="false">
                </el-date-picker>
              </div>
            </div>
            <div class="vxa-card-content">
              <div v-for="o in 10" :key="o" class="text item">
                {{'列表内容 ' + o }}
              </div>
            </div>
          </el-card>
          <!---->
          <!--带单选筛选器的Card-->
          <el-card class="vxa-box-card margin-t" shadow="hover" body-style="padding:0 16px;">
            <div class="vxa-card-header vxa-flax-box align vxa-1px-b">
              <div class="col"><span class="bold">DEMODEMODEMO</span></div>
              <div class="col t-right">
                <el-select class="vxa-card-select" size="mini" v-model="value1" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="vxa-card-content">
              <div v-for="o in 10" :key="o" class="text item">
                {{'列表内容 ' + o }}
              </div>
            </div>
          </el-card>
          <!---->
          <el-card class="vxa-box-card margin-t" shadow="hover" body-style="padding:0 16px;">
          </el-card>
          <!---->
          <el-card class="vxa-box-card margin-t" shadow="hover" body-style="padding:0 0;height:400px">
            <div class="map" v-show="visible">
              <div id="map-core"></div>
              <div class="search">
                <div id="r-result">
                  <p>搜索定位:</p>
                  <input type="text" id="suggestId" value="百度"/>
                </div>
                <div class="lng-lat">
                  <div class="item">
                    <p>当前经度:</p>
                    <input type="text" v-model="location.lng"/>
                  </div>
                  <div class="item">
                    <p>当前纬度:</p>
                    <input type="text" v-model="location.lat"/>
                  </div>
                  <div class="item btn">
                    <button @click="selectLocation">确定</button>
                  </div>
                </div>
              </div>
            </div>
          </el-card>
          <!---->
          <el-card class="vxa-box-card margin-t" shadow="hover" body-style="padding:0 0;height:800px">
            <iframe src="http://pc-shop.xiaoe-tech.com/appe8O3plIM2665/login" frameborder="0" width="590px"
                    height="497px" id="iframe_id"></iframe>
          </el-card>
          <!---->
          <!---->
          <!---->
          <h2>button按钮</h2>
          <el-button size="medium" type="primary" @click="btn">button按钮</el-button>
          <h2>可点击文字</h2>
          <span class="vxa-a-hover underline">hover点击</span>
          <span class="vxa-click-text">默认点击</span>
          <h2>title标题栏</h2>
          <div class="vxa-title">这是一个标题</div>
          <h2>标签栏左右布局</h2>
          <div class="vxa-flax-box align vux-1px-b" style="height: 45px;">
            <div class="col">
              <span>这是左边</span>
            </div>
            <div class="col t-right">
              <span>这是右边</span>
            </div>
          </div>
          <h2>卡片型结构</h2>
          <el-card></el-card>
          <h2>分页</h2>
          <div id="vxa-foot-pagination">
            <div class="row block">
              <el-pagination @current-change="selectPage" layout="prev, pager, next"
                             :current-page="page.index" :page-count="page.total">
              </el-pagination>
            </div>
            <div class="row">
              <el-radio-group size="mini" v-model="page.size" @change="handlePageChange">
                <el-radio-button :label="30">30条</el-radio-button>
                <el-radio-button :label="50">50条</el-radio-button>
              </el-radio-group>
            </div>
          </div>
          <h2>柱状图</h2>
          <div id="echart-bar" style="height: 360px"></div>
          <h2>饼状图</h2>
          <div id="echart-pie" style="height: 360px"></div>
        </el-col>
        <el-col :span="8">
          <!---->
          <!---->
          <!---->
          <el-card class="vxa-box-card margin-t" shadow="hover" body-style="padding:0 16px;">
            <div class="vxa-card-header vxa-flax-box align vxa-1px-b">
              <div class="col">DEMODEMODEMO</div>
              <div class="col"></div>
            </div>
            <div class="vxa-card-content">
              <div v-for="o in 4" :key="o" class="text item">
                {{'列表内容 ' + o }}
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!---->
    </div>
  </div>
</template>
<script>
  // import BMap from 'BMap'
  export default {
    data() {
      return {
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
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
        value1: '',
        value2: '',
        options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value: '',
        //
        page: {
          index: 1,
          size: 30,
          total: 50
        },
        inputText: '',
        echartLoading: false,
        barData: {
          xAxis: ["2018-07-31", "2018-08-01", "2018-08-02", "2018-07-31", "2018-08-01", "2018-08-02"],
          values: [
            {name: '方宏忠', data: [2111577513, 784168900, 2250000000, 2111577513, 784968900, 2250000000]},
            {name: '胡健', data: [2111567513, 784468900, 2250300000, 1111575513, 784962900, 2250400000]},
            {name: '许芝弟', data: [1121577513, 734968100, 2250040000, 2111477513, 784918900, 2250600000]}
          ],
          stockPrice: [4.14, 4.05, 3.96, 4.14, 4.05, 3.96],
          possessorName: ["方宏忠", "胡健", "许芝弟", "股价"]
        },
        pieData: [
          {name: "股份质押总数量", value: 224765.7, ratio: 0.3223},
          {name: "股份质押总数", value: 122465.7, ratio: 0.3223},
          {name: "股份质押总", value: 22465.7, ratio: 0.3223}
        ],
        location: {
          lng: '',
          lat: ''
        },
        map: {},
        ac: {},
        visible: true
      };
    },
    components: {},
    created() {
    },
    watch: {
      'location': {
        handler() {
          this.drawLocation()
        },
        deep: true
      },
      visible() {
        console.log('ddd')
      }
    },
    mounted() {
      this.echartBar('echart-bar', this.barData);
      this.echartPie('echart-pie', this.pieData);
      // this.getCurrentPosition();
      // this.$nextTick(() => {
      //   setTimeout(() => {
      //     var test = window.document.getElementById('iframe_id');
      //     console.log('213213123==============>', $(test));
      //     console.log('213213123==============>', $("#iframe_id").contents());
      //     // console.log('213213123==============>', test.contentWindow.document);
      //     console.log('213213123==============>', test.contentDocument.getElementsByClassName('imgBox'));
      //   }, 3000)
      // })
    },
    methods: {
      //
      //
      //
      //
      //
      //
      //
      btn() {
        this.$array.download('https://oss.in-hope.cn/ipo/007b1d7c-6417-4e33-a48b-aab1d90f423a.doc', '湖南科力尔电机股份有限公司上会重点关注问题.doc')
      },
      //
      selectPage(val) {
        this.page.index = val;
      },
      handlePageChange(val) {
        this.page.size = val;
      },
      searchMethod() {

      },
      echartBar(id, data) {
        var myChart = echarts.init(document.getElementById(id));
        var color = ['#602221', '#FFB148', '#FFE0B7', '#738bff', '#ffac25', '#FF7844'];
        let seriesData = []
        data.values.forEach((item, index) => {
          seriesData.push({
            name: item.name,
            type: 'bar',
            itemStyle: {normal: {color: color[index]}},
            barWidth: 10,
            barGap: '10%',
            data: item.data.reverse()
          })
        })
        seriesData.push({
          name: '股价',
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {normal: {color: '#C0BAA7'}},
          symbol: "circle",
          symbolSize: 7,
          data: data.stockPrice.reverse()
        })
        let that = this;
        var option = {
          title: {
            text: '市值： (亿元)',
            show: false,
            textStyle: {
              color: '#323232',
              fontWeight: 400,
              fontSize: 14
            },
            top: 10,
            left: 40
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
              color: "#aeaeae"
            },
            formatter: function (data) {
              if (data[0].name) {
                let html = `<div style="display:flex;color:#8d8d8d;justify-content:left;border-bottom: 1px solid #e3e3e3;margin-bottom: 5px;text-align: center">
                            <span>${data[0].name}</span>
                          </div>`;
                data.forEach((item, index) => {
                  let value = 0
                  if (item.seriesName == '股价' && item.value) {
                    value = item.value.toFixed(2)
                  } else {
                    value = that.$array.amountAbs(item.value)
                  }
                  html += `
                  <div style="display:flex;justify-content:space-between">
                    <span>${item.seriesName}：</span><span>${value}</span>
                  </div>
                `
                })
                return html
              } else {
                return ''
              }
            }
          },
          grid: {
            top: "25%",
            left: "0%",
            right: "0%",
            bottom: "10%",
            containLabel: true
          },
          legend: {
            selectedMode: false,
            align: 'left',
            top: 10,
            left: 5,
            formatter: function (name) {
              if (name == '股价') {
                return name + '(元)'
              } else {
                return name + '(股)'
              }
            },
            data: data.possessorName
          },
          dataZoom: [
            {
              type: 'slider',
              show: true,
              start: 0,
              end: 100,
              top: 325,
              height: 15,
              backgroundColor: '#FFE0B7',
              fillerColor: '#DFCCAF',
              showDataShadow: false,
              showDetail: false,
              handleIcon: 'image://https://oss.in-hope.cn/xiaoan/web_static/echart_circle.png',
              handleSize: '130%'
            },
            {
              type: 'inside',
              show: true,
              start: 0,
              end: 100,
              handleSize: 8
            }
          ],
          xAxis: [{
            type: "category",
            axisLabel: {
              rotate: 30,
              margin: 10,
              textStyle: {
                color: "#8d8d8d",
                fontSize: 10
              }
            },
            boundaryGap: true,
            axisTick: {
              length: 0
            },
            axisLine: {
              lineStyle: {
                color: "#ccc"
              }
            },
            data: data.xAxis.reverse()
          }],
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
                formatter: '{value}'
              },
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
          series: seriesData
        };
        // 使用刚指定的配置项和数据显示图表
        myChart.setOption(option, true);
      },
      echartPie(id, data) {
        let that = this
        var myChart = echarts.init(document.getElementById(id));
        var option = {
          title: {
            text: '',
            show: true
          },
          tooltip: {
            trigger: 'item',
            backgroundColor: '#fff',
            borderWidth: 1,
            borderColor: '#e3e3e3',
            axisPointer: {
              type: 'line',
              lineStyle: {
                opacity: 0
              }
            },
            formatter: function (item) {
              return '<div style="border-bottom:1px solid #e3e3e3;max-width:250px;white-space: normal; text-align: left;">' + item.name + '</div>' + '<div>持股比例(%)：' + (item.data.ratio * 100).toFixed(2) + '%</div>'
            },
            textStyle: {
              color: "#aeaeae"
            }
          },
          color: ["#602221", "#FFB148", '#C0BAA7', '#FBD6A4', '#BB2740', '#DDDDDD', '#FEBAA8', '#CD4110', '#A96BC7', '#76C0CB'],
          legend: {
            orient: 'vertical',
            show: false,
            x: 'left'
          },
          series: [{
            name: '净流入',
            type: 'pie',
            selectedMode: 'single',
            startAngle: 45,
            minAngle: 1,
            radius: ['30%', '50%'],
            labelLine: {
              normal: {
                length: 10,
                length2: 10,
                lineStyle: {
                  color: '#aeaeae'
                }
              }
            },
            label: {
              normal: {
                formatter: function (item) {
                  let value = that.$array.abs(item.data.value, true) + '万，'
                  let ratio = '占比' + (item.data.ratio * 100).toFixed(2) + '%'
                  if (item.name.indexOf('限售') > -1) {
                    value = '\n' + value
                  } else {
                    ratio = '\n' + ratio
                  }

                  return item.name + value + ratio
                },
                align: 'left',
                color: '#aeaeae',
                borderWidth: 0,
                borderRadius: 4,
                shadowBlur: 3,
                shadowOffsetX: 1,
                shadowOffsetY: 1,
                shadowColor: '#999',
                // padding: [0, 0],
                rich: {
                  a: {
                    color: '#333',
                    fontSize: 12,
                    lineHeight: 10
                  },
                  hr: {
                    borderColor: '#333',
                    width: '100%',
                    borderWidth: 0.5,
                    height: 0
                  },
                  b: {
                    fontSize: 12,
                    lineHeight: 15,
                    color: '#333'
                  }
                }
              }
            },
            data: data
          }]
        };
        myChart.setOption(option, true);
      },
      // /
      // /
      // /
      // /
      // /
      // /
      getCurrentPosition() {
        console.log(navigator.geolocation);
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              console.log('ewewqeqweqw', position)
              this.location.lng = position.coords.longitude;
              this.location.lat = position.coords.latitude;
              this.setMap()
              this.setSearch()
              // console.log(latitude)
            }, (e) => {
              switch (e.code) {
                case 1:
                  alert("位置服务被拒绝。");
                  break;
                case 2:
                  alert("暂时获取不到位置信息。");
                  break;
                case 3:
                  alert("获取位置信息超时。");
                  break;
                default:
                  alert("未知错误。");
                  break;
              }
              this.setMap()
              this.setSearch()
              // console.log(e)
              var msg = e.code;
              var dd = e.message;
              console.log(msg)
              console.log(dd)
            }
          )
        }
      },
      // 初始化地图
      setMap() {
        this.map = new BMap.Map('map-core')
        this.map.centerAndZoom(new BMap.Point(121.481, 31.236), 10)
        // 地图缩放控件
        const topLeftControl = new BMap.ScaleControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT})
        // 城市选择控件
        const cityListControl = new BMap.CityListControl({anchor: BMAP_ANCHOR_TOP_RIGHT})
        // 比例尺控件
        const topLeftNavigation = new BMap.NavigationControl()
        this.map.addControl(topLeftControl)
        this.map.addControl(topLeftNavigation)
        this.map.addControl(cityListControl)
        const _this = this
        // 鼠标缩放
        setTimeout(function () {
          _this.map.setZoom(11)
        }, 2000) // 2秒后放大到11级
        this.map.enableScrollWheelZoom(true)
        // 点击获取经纬度
        this.map.addEventListener('click', function (e) {
          _this.location.lng = parseFloat(e.point.lng).toFixed(3)
          _this.location.lat = parseFloat(e.point.lat).toFixed(3)
        })
      },
      // 根据经纬度绘制地图中的坐标点
      drawLocation() {
        if (this.location.lng !== "" && this.location.lat !== "") {
          this.map.clearOverlays()
          const new_point = new BMap.Point(this.location.lng, this.location.lat)
          const marker = new BMap.Marker(new_point)
          this.map.addOverlay(marker)
          this.map.panTo(new_point)
        }
      },
      // 搜索位置功能实现
      setSearch() {
        const _this = this
        // 建立一个自动完成的对象
        this.ac = new BMap.Autocomplete({"input": "suggestId", "location": _this.map})
        // 鼠标放在下拉列表上的事件
        this.ac.addEventListener("onhighlight", function (e) {
          let str = ""
          let _value = e.fromitem.value
          let value = ""
          if (e.fromitem.index > -1) {
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
          value = ""
          if (e.toitem.index > -1) {
            _value = e.toitem.value
            value = _value.province + _value.city + _value.district + _value.street + _value.business
          }
        })
        let myValue
        // 鼠标点击下拉列表后的事件
        this.ac.addEventListener("onconfirm", function (e) {
          let _value = e.item.value
          myValue = _value.province + _value.city + _value.district + _value.street + _value.business
          _this.setPlace(myValue)
        });
      },
      setPlace(myValue) {
        const _this = this
        // 清除地图上所有覆盖物
        this.map.clearOverlays()
        // 智能搜索
        this.local = new BMap.LocalSearch(_this.map, {
          onSearchComplete: _this.onSearchComplete
        });
        this.local.search(myValue);
      },
      onSearchComplete() {
        // 获取第一个智能搜索的结果
        let pp = this.local.getResults().getPoi(0).point
        this.location.lng = parseFloat(pp.lng).toFixed(3)
        this.location.lat = parseFloat(pp.lat).toFixed(3)
        this.map.centerAndZoom(pp, 18)
        // 添加标注
        this.map.addOverlay(new BMap.Marker(pp))
      },
      // 向父组件传递经纬度
      selectLocation() {
        this.$emit('selectLocation', this.location)
      }
    }
  }
</script>
<style lang='scss' scoped>
  #xa_demo {
    /*padding: 20px;*/
    /*width: 100%;*/
    background-color: #e0efef;
    h2 {
      font-size: 14px;
      font-weight: bold;
      padding-top: 10px;
      padding-bottom: 5px;
      margin-top: 20px;
      margin-bottom: 10px;
    }
    .vxa-title {
      font-size: 14px;
      font-weight: 600;
      border-left: 4px solid #ffb148;
      line-height: 1;
      padding-left: 10px;
    }
    //
    .map {
      width: 100%;
      height: 100%;
      font-size: 14px;
      #map-core {
        width: 100%;
        height: 90%;
      }
      .search {
        display: flex;
        margin-top: 10px;
        height: 40px;
        #r-result {
          display: flex;
          height: 20px;
          line-height: 20px;
          p {
            height: 20px;
            padding-right: 10px;
          }
          input {
            width: 180px;
            height: 20px;
          }
        }
        .lng-lat {
          display: flex;
          .item {
            display: flex;
            padding-left: 10px;
            height: 20px;
            line-height: 20px;
            p {
              height: 20px;
              padding-right: 10px;
            }
            input {
              width: 100px;
              height: 20px;
            }
            button {
              color: #fff;
              height: 28px;
              width: 60px;
              background: #40B0FF;
              border: 1px solid #40B0FF;
              border-radius: 2px;
              &:hover {
                background: #10B0FF;
                border: 1px solid #10B0FF;
                cursor: pointer;
              }
            }
          }
        }
      }
    }
  }
</style>
