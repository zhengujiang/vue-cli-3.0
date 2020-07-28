<template>
  <div :class="{isChecked: isChecked}" class="calendarSort">
    <span class="checkSpan" :style="{background: bgColor,borderColor:bgColor}"
          @click="xuanze" v-if="isChecked"></span><!-- v-if="isChecked" -->
    <span class="checkSpan" style="background:#fff" v-else @click="xuanze"></span>

    <span class="sortname" @click="xuanze" v-if="!share">{{title}}</span>
    <span class="sortname" @click="xuanze" v-else-if="share">{{title1}}</span>

    <el-popover
      ref="popover4"
      placement="right"
      width="200"
      popper-class="soreActive"
      v-model="visible"
      trigger="click">
      <div class="setup">
        <!--<p v-if="team" class="set">设置</p>-->
        <p @click="link">设置和分享</p>
        <ul>
          <li v-for="(list,index) in colorArr" :key="index" :style="{background: list.value}"
              @click="changeColor(list)"></li>
          <!--<li style="background: #eeeeee;color:#949495;" @click="addColor">
            <i class="el-icon-plus" style="display: none;"></i>
          </li>-->
        </ul>
      </div>
    </el-popover>
    <i class="el-icon-more watchMore" v-popover:popover4 :class="{showIcon: showMore}" v-show="sort !== 'market' && !team"></i>

    <i class="iconfont web-shanchu delSort" :class="{showIcon: showMore}"
       v-if="title !== '我的日历' && sort !== 'market' && !team"
       @click="delSort"></i>
    <input type="color" v-show="colorShow" id="color">
  </div>
</template>
<script>
  export default {
    name: 'calendarSort',
    data () {
      return {
        // isChecked: false,
        color1: 'red',
        visible: false,
        colorShow: false,
        colorArr: [
          {id: '0', value: '#9f2956'},
          {id: '1', value: '#e25e32'},
          {id: '2', value: '#e6cb59'},
          {id: '3', value: '#377f48'},
          {id: '4', value: '#4250af'},
          {id: '5', value: '#822ea4'},
          {id: '6', value: '#c73560'},
          {id: '7', value: '#df742c'},
          {id: '8', value: '#c2ca50'},
          {id: '9', value: '#419388'},
          {id: '10', value: '#7b85c6'},
          {id: '11', value: '#73564a'},
          {id: '12', value: '#c42b1b'},
          {id: '13', value: '#e39735'},
          {id: '14', value: '#88b152'},
          {id: '15', value: '#4498df'},
          {id: '16', value: '#af9ed7'},
          {id: '17', value: '#616161'},
          {id: '18', value: '#d88276'},
          {id: '19', value: '#eec14b'},
          {id: '20', value: '#5db37e'},
          {id: '21', value: '#4e82f4'},
          {id: '22', value: '#966bab'},
          {id: '23', value: '#a59b8f'}
        ]
      }
    },
    props: {
      title: {
        type: String,
        default: '我的日历'
      },
      title1: {
        type: String,
        default: '我的日历'
      },
      bgColor: {
        type: String,
        default: '#fff'
      },
      sort: {
        type: String,
        default: 'my'
      },
      isfocus: {
        type: Boolean,
        default: false
      },
      isChecked: {
        type: Boolean,
        default: false
      },
      showMore: {
        type: Boolean,
        default: false
      },
      share: {
        type: Boolean,
        default: false
      },
      team: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      showMore (val, old) {
        // console.log('showMore = ', val, old)
      }
    },
    methods: {
      addColor () {
        document.getElementById('color').click()
        var _this = this
        document.getElementById('color').onchange = function () {
          // alert('您选择的颜色是：' + this.value)
          _this.$confirm('设置日历颜色为：' + this.value + ', 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            let obj = {
              id: _this.colorArr.length,
              value: this.value
            }
            _this.colorArr.push(obj)
            _this.changeColor(obj)
          })
        }
      },
      changeColor (list) {
        window.localStorage.setItem('color', list.value)
        this.visible = false
        this.$emit('changeColor')
      },
      link () {
        this.visible = false
//        var url = '/calendar/index'
//        this.$router.push(url)
        this.$emit('link')
      },
      xuanze () {
        this.$emit('isDisplay')
      },
      delSort () {
        this.$emit('delete')
      }
    }
  }
</script>
<style lang="scss">
  .soreActive {
    left: 228px !important;
    padding: 0 !important;
    .popper__arrow {
      display: none !important;
    }
    .setup {
      width: 100%;
      height: auto;
      p {
        line-height: 40px;
        text-align: center;
        width: 100%;
        height: 40px;
        color: #323232;
        cursor: pointer;
        font-size: 14px;
        border-bottom: 1px solid #e3e3e3;
        box-sizing: border-box;
        &:hover {
          color: #ffb148;
        }
      }
      .set {
        cursor: default;
        &:hover {
          color: #323232;
        }
      }
      ul {
        padding: 15px;
        box-sizing: border-box;
        li {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-left: 7px;
          text-align: center;
          line-height: 20px;
          &:hover {

          }
        }
        li:nth-of-type(2n) {
          background: red;
        }
      }
    }
  }

</style>
<style lang="scss" scoped>
  .calendarSort {
    width: 100%;
    height: auto;
    padding: 7px 15px;
    box-sizing: border-box;
    color: #323232;
    font-size: 14px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    .checkSpan {
      display: inline-block;
      display: inline-flex;
      position: relative;
      border: 1px solid #d8dce5;
      border-radius: 2px;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      width: 14px;
      height: 14px;
      background-color: #fff;
      z-index: 1;
      -webkit-transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
      transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46), background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    }
    .checkSpan::after {
      -webkit-box-sizing: content-box;
      -moz-box-sizing: content-box;
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      -webkit-transform: rotate(45deg) scaleY(0);
      -ms-transform: rotate(45deg) scaleY(0);
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      -webkit-transition: -webkit-transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
      transition: -webkit-transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
      transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
      transition: transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s, -webkit-transform 0.15s cubic-bezier(0.71, -0.46, 0.88, 0.6) 0.05s;
      -webkit-transform-origin: center;
      -ms-transform-origin: center;
      transform-origin: center;
    }
    .sortname, .checkSpan {
      cursor: pointer;
    }
    .delSort, .watchMore {
      display: none;
      font-size: 16px;
      cursor: pointer;
      color: #8d8d8d;
      float: right;
      margin-top: 3px;
    }
    .delSort {
      font-size: 15px;margin-top: -2px;
    }
    .watchMore {
      margin-left: 5px;
      -webkit-transform: rotate(90deg);
      -ms-transform: rotate(90deg);
      transform: rotate(90deg);
    }
    &:hover {
      background: #f7f7f9;
      .delSort, .watchMore {
        display: inline-flex;
      }
    }
    .showIcon {
      display: inline-block;
    }
  }

  .isChecked {
    .checkSpan {
      background-color: #ffb148;
      border-color: #ffb148;
    }
    .checkSpan::after {
      -webkit-transform: rotate(45deg) scaleY(1);
      -ms-transform: rotate(45deg) scaleY(1);
      transform: rotate(45deg) scaleY(1);
    }
  }

  /*.isfocus{
    background: #f7f7f9;
    .delSort, .watchMore {
      display: inline-block;
      cursor: pointer;
    }
  }*/
</style>
