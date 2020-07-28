<template>
  <div id="inputList">
    <div class="title">{{ title }}</div>
    <div class="final" v-if="finalText !== undefined">
      <el-input
        placeholder="请输入内容"
        v-model="inputValue"
        @blur="inpuTing(1)"
        :maxlength='maxLength'>
      </el-input>
      <div class="finalUnit">元</div>
      <div class="finalText">
        {{ finalText }}
      </div>
      <div class="finalSplit"></div>
    </div>
    <div class="final" v-if="finalText2 !== undefined">
      <el-input
        placeholder="请输入内容"
        v-model="inputValue1"
        @blur="inpuTing(2)"
        :maxlength='maxLength'>
      </el-input>
      <div class="finalUnit">元</div>
      <div class="finalText">
        {{ finalText2 }}
      </div>
      <div class="finalSplit"></div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'inputList',
    data () {
      return {
        input: '',
        inputYear: '',
        maxLength: 16
      }
    },
    props: {
      title: '',
      inputValue: '',
      inputValue1: '',
      finalText: '',
      finalText2: ''
    },
    methods: {
      inpuTing (x) {
        console.log('x = ', x)
        if (x == 1) {
          this.inputValue = this.fmoney(this.inputValue)
        } else if (x == 2) {
          this.inputValue1 = this.fmoney(this.inputValue1)
        }
      },
      // 格式化金额
      outputdollars (number) {
        var mod, output
        if (number.length <= 3) {
          return (number == '' ? '' : number)
        } else {
          mod = number.length % 3
          output = (mod == 0 ? '' : (number.substring(0, mod)))
          for (var i = 0; i < Math.floor(number.length / 3); i++) {
            if ((mod == 0) && (i == 0)) {
              output += number.substring(mod + 3 * i, mod + 3 * i + 3)
            } else {
              output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3)
            }
          }
          return (output)
        }
      },
      outputcents (amount) {
        amount = Math.round(((amount) - Math.floor(amount)) * 100)
        return (amount < 10 ? '.0' + amount : '.' + amount)
      },
      fmoney (number) {
        number = String(number)
        var ngmer = ''
        number = number.replace(/\,/g, '')
        // console.log(number);
        if (isNaN(number) || number == '') {
          number = ''
        } else {
          number = Math.round(number * 100) / 100
          if (number < 0) {
            ngmer = ('-' + this.outputdollars(Math.floor(Math.abs(number) - 0) + '') + this.outputcents(Math.abs(number) - 0))
          } else {
            ngmer = (this.outputdollars(Math.floor(number - 0) + '') + this.outputcents(number - 0))
          }
        }
        return ngmer
      }
    }
  }
</script>
<style lang="scss">
  #inputList {
    margin-bottom: 15px;
    .el-input__inner {
      text-align: right;
      padding: 0 20px 0 35px;
      font-size: 13px;
      color: #323232;
    }
  }
</style>
<style lang="scss" scoped>
  #inputList {
    width: 100%;
    height: auto;
    .title {
      font-size: 14px;
      font-weight: bold;
      color: #323232;
      line-height: 30px;
    }
    .final {
      width: 100%;
      height: auto;
      position: relative;
      margin-bottom: 10px;
      .finalText {
        font-size: 13px;
        color: #8d8d8d;
        position: absolute;
        left: 5px;
        top: 5px;
      }
      .finalUnit {
        font-size: 13px;
        color: #323232;
        position: absolute;
        right: 5px;
        top: 5.5px;
      }
      .finalSplit {
        width: 1px;
        height: 13px;
        background: #e3e3e3;
        position: absolute;
        left: 35px;
        top: 8px;
      }
    }
  }
</style>
