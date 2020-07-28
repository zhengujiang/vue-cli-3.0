<template>
  <div id="comparisonAnalysis" class="content">
    <ul class="menu">
      <li v-for="(item,index) in menuList" :class="{active: item.active}" @click="handleMenu(item, index)">
        {{item.name}}
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'comparisonAnalysis',
    data() {
      return {
        checked: false,
        showDialog: false,
        menuList: [
          {
            name: '股东对比分析总览',
            tabName: 'stockholderComparison',
            active: true,
            link: '/stockholder/stockholderComparison'
          },
          {name: '分项股东对比分析', tabName: 'subitemComparison', active: false, link: '/stockholder/subitemComparison'},
          {name: '分组对比分析', tabName: 'groupComparison', active: false, link: '/stockholder/groupComparison'}
        ]
      }
    },
    // 使用其它组件
    components: {},
    computed: {},
    watch: {
      $route: function () {
        this.menuLoad()
      }
    },
    // 生命周期函数
    created() {
      this.menuLoad()
    },
    mounted() {
    },
    // 方法
    methods: {
      menuLoad() {
        let name = this.$route.name
        this.menuList.forEach((item, index) => {
          if (name.indexOf(item.tabName) > -1) {
            item.active = true
          } else {
            item.active = false
          }
        })
      },
      handleMenu(item, index) {
        this.menuList.forEach((item2, index2) => {
          if (index2 == index) {
            this.$set(this.menuList[index2], 'active', true)
          } else {
            this.$set(this.menuList[index2], 'active', false)
          }
        })
        this.$router.push(item.link)
      },
      close() {
        if (this.checked) {
          this.showDialog = false
        } else {
          this.$message({showClose: true, type: 'error', duration: 3000, message: '请先同意用户协议'});
        }
      }
    }
  }
</script>

<style lang="scss">
  #comparisonAnalysis {
    min-height: 600px;
    .menu {
      width: 100%;
      height: 50px;
      border-bottom: 1px solid #e3e3e3;
      margin-bottom: 16px;
      li {
        position: relative;
        padding: 15px 0;
        margin-right: 40px;
        float: left;
        font-size: 14px;
      }
      .active {
        color: #ffb148;
        &::before {
          content: '';
          position: absolute;
          width: 60px;
          height: 2px;
          top: 48px;
          left: 50%;
          margin-left: -30px;
          background-color: #ffb148;
        }
      }
    }
  }
</style>
