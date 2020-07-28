/**
 * @type echarts
 * @name Evans
 * @code
 * @date 2018-12-14
 * @v 0.0.1
 * **/
const chart = () => {
  return {
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
        color: "#aeaeae",
        fontSize: 12
      }
      // formatter: function () {}  这个属性如适用请自定义使用
    },
    grid: {
      top: "15%",
      left: "0%",
      right: "0%",
      bottom: "0%",
      containLabel: true
    },
    legend: {
      selectedMode: true,
      align: 'left',
      top: 10,
      left: 0,
      data: []
    },
    xAxis: [{
      type: "category",  // category 可以自行修正
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
      data: []
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
    ]
  }
}
//
const bar = () => {
  return {}
};
//
const line = () => {
  return {}
};
//
const pie = () => {
  return {}
};
//
const wordCloud = () => {
  return {}
}

export {
  chart,
  bar,
  line,
  pie,
  wordCloud
}
