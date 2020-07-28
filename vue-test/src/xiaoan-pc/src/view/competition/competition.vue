<template>
  <div id="competition-index" class="bg-content">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: "competition",
    components: {},
    data() {
      return {
        userInfo: {level:-1}
      }
    },
    created() {
      if (!this.$cookie.get('userId')) {
        this.$router.push(`/login?redirect_url=competition/heart`)
      } else {
        this.$router.replace({path: '/competition/heart'});
      }
      if (this.$cookie.get('userInfo')) {
        this.userInfo = JSON.parse(this.$cookie.get('userInfo'));
      }
      if ((this.$cookie.get('userId') != this.$route.query.id) && this.$route.query.type == 1) {
        this.increaseAnswerNum()
      }
      
        // let time = new Date().getTime();
        // if (time < 1542816000000) {
        //   this.$router.replace({path: '/competition/heart'});
        // } else if (time > 1544025600000) {
        //   if (!this.$cookie.get('userId')) {
        //     this.$router.push(`/login?redirect_url=competition/activityAnswer?endInfo=2`)
        //   } else {
        //     this.checkUserApply();
        //     // this.$router.replace({path: '/competition/activityAnswer', query: {endInfo: 2}});
        //   }
        // } else {
        //   sessionStorage.setItem('competition', JSON.stringify(this.$route.fullPath));
        //   if (this.$route.query.type) sessionStorage.setItem('type', JSON.stringify(this.$route.query.type));
        //   if (this.$route.query.id) sessionStorage.setItem('id', JSON.stringify(this.$route.query.id));
        //   if (this.$route.query.name) sessionStorage.setItem('name', JSON.stringify(this.$route.query.name));
        //   if (this.$route.query.questionId) sessionStorage.setItem('questionId', JSON.stringify(this.$route.query.questionId));
        //   if (this.$route.query.type == 2) {
        //     this.$router.push('/competition/call');
        //   } else {
        //     this.checkUserCaseUpload();
        //   }
        // }
    },
    destroyed() {
      sessionStorage.removeItem('type');
      sessionStorage.removeItem('id');
      sessionStorage.removeItem('name');
      sessionStorage.removeItem('questionId');
      sessionStorage.removeItem('isJoin');
      sessionStorage.removeItem('competition');
    },
    methods: {
      // 增加答题次数
      increaseAnswerNum() {
        let params = {
          userId: this.$route.query.id
        }
        this.$axios.mobApi.increaseAnswerNum(params).then(res => {
          
        })
      },
      // 是否已经报名
      checkUserApply () {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.checkUserApply(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            let time = new Date().getTime();
            if (res.data.returnObject) {
              // this.getAllTestPaper();
              sessionStorage.setItem('isJoin', true);
              console.log(JSON.parse(sessionStorage.getItem('id')))
              if (this.$route.query.type == 1 && (this.$cookie.get('userId') != this.$route.query.id)) {
                this.$message({showClose: true, message: '您已参加本次活动 ！', duration: 3000, type: 'error'});
                sessionStorage.removeItem('id');
                sessionStorage.removeItem('type');
              }
              if (time > 1544025600000) {
                this.$router.replace({path: '/competition/activityAnswer', query: {endInfo: 2}});
              }
            } else {
              if (time > 1544025600000) {
                this.$router.replace('/competition/endPage');
              } else {
                this.$router.push('/competition/join');
              }
            }
          }
        })
      },
      // 是否上传名片
      checkUserCaseUpload () {
        let params = {
          userId: this.$cookie.get('userId')
        }
        this.$axios.mobApi.checkUserCaseUpload(params).then((res) => {
          if (res.data.returnCode == 200 || res.data.returnCode == 1) {
            if (res.data.returnObject) {
              this.checkUserApply();
            } else {
              this.$router.push('/competition/join');
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  #competition-index {
    clear: both;
    overflow: hidden;
    &.bg-content {
      background: url(/static/img/competition/bg.jpg) no-repeat;
      background-size: 100% 100%;
      width: 100%;
      height: auto;
    }
    .contentLeft {
      width: 897px;
      float: left;
      border:1px solid rgba(84,84,84,1);
      border-radius:4px;
      margin-top: 19px;
      .one {
        width: 591px;
        height: 241px;
        margin: 23px auto 28px;
        background: url(/static/img/competition/bg-title.png) no-repeat;
        background-size: contain;
      }
    }
    .contentRight {
      float: right;
      width: 292px;
      margin-top: 19px;
    }
  }
</style>
