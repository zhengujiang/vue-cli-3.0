<template>
  <div id="home">
    <vxa-header></vxa-header>
    <router-view class="vxa-container-box" :aside="aside"></router-view>
    <vxa-footer></vxa-footer>
    <vxa-aside v-transfer-dom v-show="$route.meta.aside && userId" ref="aside"></vxa-aside>
  </div>
</template>
<script>
  import TransferDom from '../directive/transfer-dom'
  import VxaHeader from '../components/header/header.vue'
  import VxaFooter from '../components/footer/footer.vue'
  import VxaAside from './aside/aside'
  export default {
    data() {
      return {
        showItem: '',
        hasScrollbar: false,
        loading: false,
        aside: '',
        userId: ''
      }
    },
    directives: {
      TransferDom
    },
    //  v-transfer-dom
    // 使用其它组件
    components: {
      VxaHeader,
      VxaFooter,
      VxaAside
    },
    // 方法
    computed: {
      isLogin: function () {
        return this.$store.state.isLogin
      },
      info: function () {
        return this.$store.state.userData
      }
    },
    watch: {
      isLoading: function (val) {
        console.log('=================>loading', val);
        // if (val) {
        //   this.$loading({lock: true, background: 'rgba(255, 255, 255, 0.7)'})
        // } else {
        //   this.$loading({lock: true, background: 'rgba(255, 255, 255, 0.7)'}).close();
        // }
      },
      '$route': function (val, old) {
        this.setStore(old.meta.tabName)
        for (let i in this.column) {
          if (val.meta.tabName == this.column[i].to) {
            this.column[i].isSelect = true
          } else {
            this.column[i].isSelect = false
          }
        }
      }
    },
    methods: {
      setStore(showItem) {
        this.$store.commit('COLUMN', showItem)
      }
    },
    // 生命周期函数
    created() {
      this.userId = this.$cookie.get('userId')
      this.$nextTick(() => {
        this.aside = this.$refs.aside;
      });
      console.log(this.$route);
      console.log('home');
      this.isActive = this.$route.meta.tabName
      for (var i in this.tab) {
        if (this.isActive == this.tab[i].to) {
          this.tab[i].isSelect = true
        } else {
          this.tab[i].isSelect = false
        }
      }
    },
    mounted() {
    }
  }
</script>
<style lang="scss" scoped>
  #home {
    width: 100%;
    height: 100%;
    // padding-top: 140px;
    transition: padding-top .3s ease;
    &.home-padding-top {
      padding-top: 60px;
      transition: padding-top .3s ease;
    }
  }
</style>
