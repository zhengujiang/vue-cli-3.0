<template>
  <el-card shadow="never" class="regulator-box-card">
    <div slot="header">
      <span>{{title}}</span>
      <a :href="linkMore()" target="_blank">
      <el-button class="el-button-more" type="text" @click="linkMore()">
        查看更多<i class="el-icon-arrow-right icon-arrow"></i>
      </el-button>
      </a>
    </div>
    <a :href="setDetailUrl(item)" target="_blank" v-for="(item,index) in itemList">
      <div class="listBox">
        <span class="newtip" v-if="item.isNew"><span class="text">NEW</span></span>
        <span class="number" v-else>{{index + 1}}</span>
        {{item.name}}
      </div>
    </a>
  </el-card>
</template>

<script>
  export default {
    data() {
      return {
        detailUrl: ''
      }
    },
    props: {
      title: String,
      itemList: Array
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {},
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {
      setDetailUrl (item) {
        let url = ''
        if (this.title == '市场舆情') {
          url = item.uri
        } else if (this.title == '监管动态') {
          url = item.sourceUrl
        } else if (this.title == '最新法规') {
          url = '/rule/details?id=' + item.id
        } else if (this.title == '信公干货') {
          url = item.advertUrl
        }
        return url
      },
      linkMore () {
        let url = ''
        if (this.title == '市场舆情') {

        } else if (this.title == '监管动态') {
          url = '/activities'
        } else if (this.title == '最新法规') {
          url = '/rule'
        } else if (this.title == '信公干货') {
          url = '/business/swift#0'
        }
        return url
      }
    }
  }
</script>

<style lang="scss">
  .regulator-box-card {
    .listBox {
      padding: 0 16px;
      height: 34px;
      line-height: 34px;
      width: 100%;
      background: #fff;
      box-sizing: border-box;
      font-size: 12px;
      color: #323232;
      text-align: justify;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        background-color: #fbfbfb;
        color: #ffb148;
      }
      .newtip {
        width: 34px;
        height: 14px;
        line-height: 1;
        /*position: relative;*/
        top: -1px;
        display: inline-block;
        background: #ffb148;
        color: #fff;
        text-align: center;
        border: 1px solid #ffb148;
        border-radius: 2px;
        box-sizing: border-box;
        .text {
          display: inline-block;
          font-size: 12px;
          font-weight: 300;
          transform: scale(.8);
        }
      }
      .number {
        display: inline-block;
        padding-right: 10px;
      }
    }

  }
</style>
