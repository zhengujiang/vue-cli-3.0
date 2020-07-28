<template>
  <div id="personInfo">
    <div class="content">
      <div class="top">
        <span class="title">完善个人信息</span>
      </div>
      <div class="reginfo">
        <v-personEdit :stype="'add'" :register="true" :weixinNick="weixinNick" :userName="userName" @submitForm="step3"></v-personEdit>
        <!--<el-button class="regbtn" type="primary" @click="step3">注 册</el-button>-->
      </div>
    </div>
  </div>
</template>
<script>
  import personEdit from '../../components/personEdit'
  export default {
  data () {
      return {
        weixinNick: '',
        userName: ''
      };
  },

  components: {
    'v-personEdit': personEdit
  },
  created() {},
  mounted() {},
  methods: {
    step3() {
      this.$router.push('/index')
    }
  }
}
</script>
<style lang='scss' scoped>
  #personInfo {
    .content {
      border: 1px solid #e3e3e3;
      margin: 20px auto;
      height: 772px;
      .reginfo {
        margin-left: 350px;
        margin-top: 20px;
        width: 390px;
      }
      .top {
        width: 1129px;
        margin: 0 auto;
        height: 60px;
        border-bottom: 1px solid #E3E3E3;
        .title {
          display: inline-block;
          height: 60px;
          line-height: 60px;
          border-bottom: 2px solid #FFB148;
          font-size: 18px;
          font-weight: bold;
          color: #FFB148;
        }
      }
    }
  }
</style>