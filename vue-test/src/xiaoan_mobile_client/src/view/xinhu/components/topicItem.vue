<template>
  <div>
    <div id="topicItem" :class="{'topticItemGZ': stype==='gz','topticItemAdd': stype==='add'}" @click="handleClick(item)">
      <div class="imgbox">
        <img class="topicImg" :src="item.topicImage">
      </div>
      <div class="textBox">
          <div class="title">{{item.topicName}}</div>
          <div>
            <span>{{item.attentionCount?item.attentionCount:0}}个关注</span>
            <span class="split">|</span>
            <span>{{item.relatedQuestionCount}}个问题</span>
          </div>
      </div>
      <div class="guanzuBox" v-if="stype==='gz'">
        <span v-show="item.attention" class="add"><i class="icon iconfont icon-jia3" @click="addAttention(item)"></i> 关注</span>
        <span v-show="!item.attention"  class="delete">已关注</span>
      </div>
      <div class="guanzuBox" v-else>
        <span v-show="!item.isAdd" class="add"><i class="icon iconfont icon-jia3" @click="addAttention(item)"></i> 添加</span>
        <span v-show="item.isAdd"  class="delete">已添加</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'topicItem',
    data() {
      return {
        item: {}
      }
    },
    props: {
      // 关注、已关注（gz） ；添加，已添加（add）
      stype: String,
      keyWord: String,
      data: Object
    },
    computed: {},
    watch: {
      data: {
        handler: function (val) {
          console.log('val', val)
          this.item = val
          alert(val)
        },
        deep: true
      }
    },
    // 生命周期函数
    created() {
      // alert(this.data.topicName)
      this.item = this.data
    },
    mounted() {
    },
    // 方法
    methods: {
      handleClick(evt) {
        // this.$emit('add', evt);
      },
      // 搜索相关话题
      listTopic () {
        /*this.$http({
          method: 'GET',
          url: this.$api.xinhu.listTopic,
          params: {
            topicName: this.keyWord
          }
        })*/
        let params = {topicName: this.keyWord}
        this.$axios.xinhu.listTopic(params).then((res) => {
          if (res.data.returnCode === 200) {
            this.topicList = res.data.returnObject.list
          } else {
            this.topicList = []
          }
        }).catch((err) => {

        })
      },
      addAttention (item) {
        this.$emit('add', item);
        /* this.$http({
          method: 'POST',
          url: this.$api.xinhu.addAttention,
          params: {
            attentionType: 'ATTENTION_TOPIC',
            concernedId: item.topicId,
            concernedTitle: item.topicName,
            userId: this.$cookie.getCookie('userId')
          }
        }).then((res) => {
          if (res.data.returnCode == 1) {
            this.$vux.toast.show({text: '关注成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.listTopic()
          } else {
            this.$vux.toast.show({text: '修改失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
          }
        }).catch((err) => {

        }) */
      }
    }
  }
</script>

<style lang="scss">
  .topticItemGZ {
    height: 65px;
    padding:10px 10px;
  }
  .topticItemAdd {
    height: 80px;
    padding:18px 10px;
  }
  #topicItem {
    background-color: #fff;
    border-bottom: 1px solid #e3e3e3;
    &>div {
      float:left ;
    }
    .topicImg {
      width:45px;
      height: 45px;
    }
    .guanzhuImg {
      width: auto;
      height: .64rem;
    }
    .textBox{
      padding:5px 10px;
      .title {
        font-size: 14px;
      }
      .split {
        display: inline-block;
        margin:0 2px !important;
      }
    }
    .guanzuBox {
      display: inline-block;
      float:right;
      margin-top: 10px;
      font-size: 16px;
      .add {
        padding:3px 8px;
        color: #ffb148;
        background-color:#fff;
        border: 1px solid #ffb148;
        border-radius: 2px;
      }
      .delete {
        padding:3px 8px;
        color:#8d8d8d;
        background-color:#f0f1f5;
        border: 1px solid #f0f1f5;
      }
      .icon {
        color: #ffb148;
      }
    }
  }
</style>
