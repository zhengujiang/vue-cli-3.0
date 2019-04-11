<template>
  <div id="coverOne">
    <img class="logo" :src="$image.year2018.logo"/>
    <div class="title1 animated y-swing">
      <img :src="$image.year2018.dsh"/>
    </div>
    <div class="title2">
      <img :src="$image.year2018.xiaoanpro" class="animated y-fadeInDown delay-1s"/>
    </div>
    <div class="user-info animated y-flash delay-2s">
      <img class="header-img" :src="userInfo.weixinAvatar"/>
      <p class="user-nick">{{userInfo.userName}}</p>
      <p class="user-code">{{companyName + ' ' + companyCode}}</p>
    </div>
    <div class="active">
      <p>
        <img class="active-img" :src="$image.year2018.active"/>
        活跃指数:<span class="active-num y-scale-iteration">{{data.animate_index}}</span>
      </p>
    </div>
    <div class="cover-time animated y-fadeInUp">数据截止至2018年12月29日</div>
    <div class="person">
      <img class="animated y-zoomIn delay-1s" :src="$image.year2018.person"/>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    },
    props: ['userInfo', 'companyCode', 'companyName', 'data'],
    // 使用其它组件
    components: {},
    computed: {},
    watch: {

    },
    // 生命周期函数
    created() {
    },
    mounted() {
    },
    // 方法
    methods: {}
  }
</script>

<style lang="scss">
  @function x2($n) {
    @return $n / 2;
  }
  #coverOne {
    .logo {
      width:104px;
      height: 41px;
      margin: 0 0 0 18px;
    }
    .title1 {
      padding: 26px 45px 0 45px;
      img {
        width: 100%;
      }
    }
    .title2 {
      padding: 15px 92px 0 92px;
      img {
        width: 100%;
      }
    }
    .user-info {
      text-align: center;
      .header-img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-top: 15px;
        border: 2px solid #FF6830;
      }
      .user-nick {
        font-size: 14px;
        color: #0E0702;
        margin-top: 5px;
        width:80%;
        margin-left: 10%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .user-code {
        font-size: 12px;
        color: #3C2303;
        /*margin-top: 5px;*/
      }
    }
    .active {
      display: flex;
      justify-content: center;
      margin-top: 10px;
      p {
       display: flex;
       align-items: center;
       justify-content: center;
       width:145px;
       height:26px;
       border:1px solid rgba(120,96,42,1);
       border-radius:23px 25px 25px 23px;
        padding: 0 5px;
       .active-img {
         width:18px;
         height: 18px;
         margin-right: 5px;
       }
      }
      .active-num {
        margin-left: 10px;
      }
    }
    .cover-time {
      text-align: center;
      font-size: 14px;
      color: #3C2303;
      opacity: .6;
      margin-top: 9px;
    }
    .person {
      padding: 15px 121px 0 121px;
      img {
        width: 100%;
      }
    }
  }
</style>
