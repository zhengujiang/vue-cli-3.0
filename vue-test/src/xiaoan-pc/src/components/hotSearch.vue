<template>
  <div class="hotSearch">
    <div class="hotTitle">热门搜索:</div>
    <ul class="hotArr">
      <li v-for="(list, index) in listArr" @click="hotClick(index)">{{ list }}</li>
    </ul>
    <div class="changeAgain" @click="another" v-if="sort != 'report'">
      <i class="iconfont web-huanyipi2" style="font-weight: 600"></i>
      <span>换一批</span>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'hotSearch',
    data() {
      return {
        listArr: []
      }
    },
    watch: {
      arr () {
        this.listArr = this.arr
      }
    },
    props: {
      arr: {
        type: Array
      },
      sort: {
        type: String,
        default: 'rule'
      }
    },
    methods: {
      hotClick(index) {
        this.$emit('hotClick', index, this.sort)
      },
      another() {
        this.$emit('another', this.sort)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .hotSearch {
    margin: 40px auto 0;
    font-size: 16px;
    color: #fff;
    display: inline-block;
    width: 100%;
    height: auto;
    text-align: center;
    .hotTitle, ul, li, .changeAgain {
      display: inline-block;
      margin-right: 10px;
      -moz-user-select: none;
      -webkit-user-select: none;
      -ms-user-select: none;
    }
    .changeAgain {
      cursor: pointer;
      color: #ffb147;
      span{
        // text-decoration: underline;
      }
    }
    ul {
      margin: 0;
      li {
        &:hover {
          color: #ffb148;
        }
      }
    }
  }
</style>
