<template>
  <div id="follow">
    <v-nav navIndex="1" :navCount="1">
      <template slot="slotMain">
        <div class="left">
          <div class="item" :class="{act:isActive==='users'}" @click="linkTo('users')">
            <span class="itemText">关注用户</span> </div>
          <div class="item" :class="{act:isActive==='questions'}" @click="linkTo('questions')">
            <span class="itemText">关注问题</span> </div>
          <div class="item" :class="{act:isActive==='topics'}" @click="linkTo('topics')">
            <span class="itemText">关注话题</span> </div>
          <div class="item" :class="{act:isActive==='companies'}" @click="linkTo('companies')">
            <span class="itemText">关注公司</span> </div>
          <div class="item" :class="{act:isActive==='regulations'}" @click="linkTo('regulations')">
            <span class="itemText">关注法规汇编</span> </div>
        </div>
        <div class="right">
          <router-view></router-view>
        </div>
      </template>
    </v-nav>
  </div>
</template>
<script>
import nav from './nav.vue'
export default {
  name: 'user-follow',
  data() {
    return {
      isActive: 'users'
    }
  },
  components: {
    'v-nav': nav
  },
  computed: {},
  watch: {
    '$route' (to, from) {
      this.setTab()
    }
  },
  methods: {
    linkTo(url) {
      this.$router.push('/follow/' + url)
    },
    setTab() {
      this.isActive = this.$route.meta.tabName
    }
  },
  created() {
    this.setTab()
  },
  mounted() {

  }
}
</script>
<style lang="scss">
#follow {
  header {
    .card-title {
      padding: 0 0 0 8px;
      margin: 0;
      line-height: 1;
      border-left: solid 3px #ffb148;
      margin-bottom: 15px;
      font-weight: 600;
    }
  }
}
</style>
