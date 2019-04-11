<template>
  <div id="settings-wx">
    <group gutter="0">
      <x-switch class="vxa-switch" :title="'微信通知'" v-model="totalVal"
                @on-change="switchTotalChange('total')"></x-switch>
    </group>
    <div class="foo"></div>
    <group gutter="0">
      <x-switch v-for="(item, i) in switchList" :key="i" class="vxa-switch" :title="item.wxMsgType"
                @on-change="switchChange(i)" :inline-desc="item.wxMsgDescribe"
                v-model="item.started"></x-switch>
    </group>
  </div>
</template>

<script>
  import {Group, XSwitch} from 'vux'
  export default {
    name: "settings",
    components: {
      Group, XSwitch
    },
    data() {
      return {
        totalVal: true,
        switchList: [],
        isClickItem: {},
        ischeckbox: '1'
      }
    },
    created() {
      if (this.$cookie.getCookie('userId')) {
        this.getManageByUserId();
      } else {
        this.$storage.loginStatus(this, '设置微信通知推送消息', window.location.href);
      }
    },
    methods: {
      switchClick(o, n) {
        console.log('123213', o, n)
      },
      switchChange(val) {
        this.ischeckbox = '1';
        this.isClickItem = this.switchList[val]
        console.log('3213421341', this.switchList[val]);
        this.updateStarted(this.isClickItem.started, this.isClickItem.wxMsgId);
      },
      getManageByUserId() {
        this.$vux.loading.show({text: '加载中'})
        /*this.$http ({
          method: 'GET',
          url: this.$api.massage.getManageByUserId,
          params: {}
        }).then(res => {
          if (res.data.returnCode == 200) {
            this.switchList = res.data.returnObject.data;
            this.totalVal = res.data.returnObject.wxManage;
            //
            setTimeout(() => {
              this.$vux.loading.hide();
              this.ischeckbox = '0';
            }, 500)
          }
        }).catch(err => {

        })*/
        let params = {}
        this.$axios.message.getManageByUserId(params).then(res => {
          if (res.data.returnCode == 200) {
            this.switchList = res.data.returnObject.data;
            this.totalVal = res.data.returnObject.wxManage;
            //
            setTimeout(() => {
              this.$vux.loading.hide();
              this.ischeckbox = '0';
            }, 500)
          }
        }).catch(err => {

        })
      },
      switchTotalChange(val) {
        console.log(val);
        // this.ischeckbox = '0';
        if (this.ischeckbox == '1') {
          return
        }
        this.switchList = [];
        this.updateStarted(this.totalVal, '');
      },
      // POST /msgManage/updateStarted
      updateStarted(start, id) {
        let params = {
          started: start,
          wxMsgId: id
        };
        if (id) {
          this.ischeckbox = '1';
        } else {
          this.ischeckbox = '0';
        }
        console.log(params);
        /*this.$http ({
          method: 'POST',
          url: this.$api.massage.updateStarted,
          params: params
        }).then(res => {
          if (res.data.returnCode == 200) {
            //
            // this.switchList = [];
            this.getManageByUserId();
          }
        }).catch(err => {

        })*/
        this.$axios.message.updateStarted(params).then(res => {
          if (res.data.returnCode == 200) {
            this.getManageByUserId();
          }
        }).catch(err => {

        })
      }
    }
  }
</script>

<style lang="scss">
  #settings-wx {
    .foo {
      height: 6px;
      background-color: #f0f1f5;
    }
  }
</style>
