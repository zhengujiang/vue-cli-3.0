<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../../../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
    <div class="box">
      <div class="item item1"></div>
      <div class="item item2"></div>
      <div class="item item3"></div>
      <div class="item item4"></div>
      <div class="item item5"></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '../components/HelloWord.vue'

export default {
  name: 'home',
  components: {
    // HelloWorld
  },
  methods: {
    deepCopy (obj) {
      let resultObj = Array.isArray(obj) ? [] : {}
      for (let key in obj) {
        if (typeof obj[key] === 'object') {
          resultObj[key] = this.deepCopy(obj[key])
        } else {
          resultObj[key] = obj[key]
        }
      }
      return resultObj
    }
  }
}
</script>

<style lang="less" scoped>
  .box {
    width: 800px;
    height: 500px;
    border: 1px solid #ccc;
    margin: 0 auto;
    display: flex;
    .item {
      width: 50px;
      height: 50px;
      background: red;
      margin: 5px;
    }
    .item1 {
      // flex-basis: 4;
      flex-grow: 3;
    }
    .item2 {
      flex-basis: 2
    }
  }
</style>
