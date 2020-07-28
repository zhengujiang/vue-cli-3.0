<template>
  <div class="ts xn-input" :class="{'xn-input-active':isinput || value !==''}">
    <div class="ts lbl" @click="oninput()">{{text}}</div>
    <input :id="id" class="txt ts" :class="[isErr?'txterr':'',tip?'txterr':'', isinput?'txtinput':'']"
           :type="type"
           ref="input"
           :value="value"
           @click="oninput()"
           @blur="onblur()"
           @focus="onfocus()"
           @input="$emit('input', $event.target.value)"
           spellcheck="false"
           autocomplete="new-password"
           :maxlength="maxlength">
    <div v-show="isErr && this.value!=='' && !isinput" class="errmsg">{{errmsg}}</div>
    <div v-show="!isErr && tip!=='' && tip !==undefined" class="errmsg">{{tip}}</div>
  </div>

</template>
<script>
  export default {
    name: 'input',
    props: ['id', 'text', 'value', 'regx', 'errmsg', 'tip', 'maxlength'],
    data () {
      return {
        isinput: '',
        isErr: false,
        type: this.regx == 'password' ? 'password' : 'text'
      }
    },
    methods: {
      onblur () {
        this.isinput = false
        if (this.regx === 'mobile') {
          this.isErr = !this.$regx.telphone(this.value)
        } else if (this.regx === 'password') {
          this.isErr = !this.$regx.password(this.value)
        } else if (this.regx === 'imgcode') {
          this.isErr = !this.$regx.imgCode(this.value)
        } else if (this.regx === 'email') {
          this.isErr = !this.$regx.mail(this.value)
        }
        if (this.value === '') {
          this.isErr = false
        }
        if (!this.isErr) {
          this.$emit('blur', this.id)
        }

      },
      onfocus () {
        this.$emit('focus', this.id)
      },
      oninput() {
        this.isinput = true
        document.querySelector('#' + this.id).focus()
      }
    }
  }
</script>
<style lang="scss">
  .ts {
    transition: all .3s;
  }
  .xn-input {
    position: relative;
    height: 80px;
    &::before {
      content:"";
      position: absolute;
      bottom: 35px;
      height: 1px;
      width: 100%;
    }
    .lbl {
      transform: translateY(40px);
      color: rgba(0,0,0,.38);
      font-size: 16px;
      height: 40px;
      line-height: 40px;
      cursor: pointer;
    }
    .txt {
      height: 40px;
      width:100%;
      border:0;
      caret-color: #ffb148;
      border-bottom:1px solid #e3e3e3;
    }
    .txterr {
      border-bottom:1px solid #fb4319;
    }
    .txtinput {
      border-bottom:1px solid #ffb148;
    }
    .errmsg {
      position: relative;
      bottom: 0;
      text-align: right;
      color:#fb4319;
      width:100%;
      height:30px;
      line-height: 30px;
      font-size: 14px;

    }
    .imgcode {
      position: absolute;
      top: 34px;
      right: 0;
      width: 100px;
      height: 40px;
      border: 1px solid #e5e5e5;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .xn-input-active {
    .lbl {
      transform: translatey(10px);
      color: rgba(0,0,0,.38);
      font-size: 14px;
    }
  }
</style>
