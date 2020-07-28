<template>
  <div id="works">
    <v-nav navIndex="0" :navCount="1">
      <template slot="slotMain">
        <div class="left">
          <div class="item" :class="{act:isActive==='questions'}" @click="linkTo('questions')">
            <span class="itemText">我的提问</span> </div>
          <div class="item" :class="{act:isActive==='answers'}" @click="linkTo('answers')">
            <span class="itemText">我的回答</span> </div>
          <div class="item" :class="{act:isActive==='noteLaw'}" @click="linkTo('noteLaw')">
            <span class="itemText">我的笔记</span> </div>
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
  name: 'user-works',
  data() {
    return {
      isActive: 'questions'
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
      this.$router.push('/works/' + url)
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
#works {
  header {
    .card-title {
      padding: 0 0 0 8px;
      margin: 0;
      line-height: 1;
      border-left: solid 4px #ffb148;
      margin-bottom: 15px;
      font-weight: 600;
    }
  }
}
</style>
