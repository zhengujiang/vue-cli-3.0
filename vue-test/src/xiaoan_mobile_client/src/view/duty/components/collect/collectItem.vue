<template>
  <div class="xiaoan-box collect-item collect-all-item" :style="{height:height+'px'}">
    <div class="collect-item-scroll">
      <div class="collect-search" ref="tabDom">
        <form action="" onsubmit=" return false">
          <div class="input-box">
            <input @input="addValInput" type='text' maxlength="40" v-model="addVal" :placeholder='placeholder'
                   @keyup.13="addCollect"/>
            <transition name="bounce">
              <span class="icon-box" @click="addVal = ''" v-show="addVal !=''">
                <i class="icon iconfont icon-X"></i>
              </span>
            </transition>
          </div>
          <div class="inputbtn">
            <button type="button" @click="addCollect">创建</button>
          </div>
        </form>
      </div>
      <div class="collect-cell" :style="{height:contentHeight+'px'}">
        <swipeout>
          <swipeout-item transition-mode="follow">
            <div slot="content" class="infinite">
              <div class="card-box" @click="toCollectDetail(0,0)">
                <p class="title">{{collectDefaultData.favouriteName}}</p>
                <ul class="vux-1px-t">
                  <li>
                    <div>
                      <img :src="category.statute" alt="">
                      <span>{{collectDefaultData.lawCount}}</span>
                    </div>
                    <div>
                      <img :src="category.notice" alt="">
                      <span>{{collectDefaultData.caseCount}}</span>
                    </div>
                    <div>
                      <img :src="category.reportIcon" alt="">
                      <span>{{collectDefaultData.reportCount}}</span>
                    </div>
                    <div v-if="!(isTestUser == 2)">
                      <img :src="category.qaIcon" alt="">
                      <span>{{collectDefaultData.qaCount}}</span>
                    </div>
                  </li>
                  <li class="data"><span>{{$const.format(collectDefaultData.createTime)}}</span></li>
                </ul>
              </div>
            </div>
          </swipeout-item>
          <swipeout-item transition-mode="follow" v-for="(list,index) of collectData" :key="index">
            <div slot="right-menu" class="btn-box">
              <swipeout-button v-if="list.share" :background-color="'#ffd091'" @click.native="onShareClick(index)">
                取消分享
              </swipeout-button>
              <swipeout-button :background-color="'#ffb148'" @click.native="onItemClick(index)">编辑</swipeout-button>
              <swipeout-button :background-color="'#ff7250'" @click.native="onOffClick(index)">删除</swipeout-button>
            </div>
            <div slot="content" class="infinite">
              <div class="card-box" @click="toCollectDetail(1,index)">
                <p class="title">{{list.favouriteName}}</p>
                <ul class="vux-1px-t">
                  <li>
                    <div>
                      <img :src="category.statute" alt="">
                      <span>{{list.lawCount}}</span>
                    </div>
                    <div>
                      <img :src="category.notice" alt="">
                      <span>{{list.caseCount}}</span>
                    </div>
                    <div>
                      <img :src="category.reportIcon" alt="">
                      <span>{{list.reportCount}}</span>
                    </div>
                    <div v-if="!(isTestUser == 2)">
                      <img :src="category.qaIcon" alt="">
                      <span>{{list.qaCount}}</span>
                    </div>
                  </li>
                  <li class="data">
                    <span>{{$const.format(list.createTime)}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <p class="infinite-loading">
          <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
        </p>
      </div>
    </div>
    <xiaoan-loading v-show="loading"></xiaoan-loading>
  </div>
</template>

<script>
  import {Swipeout, SwipeoutButton, SwipeoutItem} from 'vux'
  import XiaoanWarning from '@/components/warning/warning'
  import XiaoanLoading from '@/components/warning/loading'

  export default {
    name: "collect-item",
    components: {
      XiaoanLoading,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XiaoanWarning
    },
    data() {
      return {
        allLoaded: false,
        loading: false,
        addVal: '',
        placeholder: '请输入新建收藏夹名称（最多40个字）',
        collectData: [],
        collectDefaultData: {},
        category: {
          notice: this.$image.collect.statute,
          statute: this.$image.collect.notice,
          reportIcon: this.$image.report.reportCollect,
          qaIcon: this.$image.collect.qa,
        },
        contentHeight: 0,
        page: {
          index: 30,
          size: 1,
          total: 0
        },
        isTestUser: 0
      }
    },
    watch: {
      active: function (val) {
        if (val == 0) {
          this.getDefault();
          this.getFavourite();
        }
      },
      height: function () {
        this.$nextTick(() => {
          this.contentHeight = this.height - this.$refs.tabDom.clientHeight;
        })
      }
    },
    props: {
      height: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
      active: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
    },
    created() {
      let userId = this.$cookie.getCookie('userId');
      if (userId) {
        // this.apiUserHome();
        this.getDefault();
        this.getFavourite();
      }
    },
    methods: {
      // 获取登录信息
      apiUserHome() {
        /*this.$http({
          method: 'GET',
          url: this.$api.userHome.userhome,
          params: {}
        })*/
        this.$axios.userHome.userhome({}).then((res) => {
          console.log("有userId", res);
          if (res.data.returnCode == 1) {
            let data = res.data.returnObject;
            // let isTestUser = data.testUser;
            // if (isTestUser == false) {
            //   // 非测试用户
            //   this.isTestUser = 2;
            // }
          } else if (res.data.returnCode == -1) {
            this.$vux.toast.show({
              text: res.data.returnCode + res.data.returnMsg,
              position: 'middle',
              type: 'text',
              width: 'auto',
              time: 2500
            });
          }
        }).catch((err) => {
          console.error(err);
          this.$vux.toast.show({text: err.message, position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      addValInput(number) {
        this.addVal = this.$array.trim(this.addVal);
        if (this.addVal.length > number) {
          this.addVal = this.addVal.substring(0, number);
        }
      },
      // 创建收藏夹
      addCollect() {
        if (this.addVal == '') {
          console.log('不能为空', this.addVal);
        } else {
          this.addFavourite();
        }
      },
      //
      toCollectDetail(type, index) {
        switch (type) {
          case 0:
            this.$router.push({path: '/collect/collectDetails', query: {id: this.collectDefaultData.id}});
            break;
          case 1:
            this.$router.push({path: '/collect/collectDetails', query: {id: this.collectData[index].id}});
            break;
        }
      },
      // 取消分享
      onShareClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要取消分享吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.shareSwitch(index);
          },
          onCancel() {
          }
        })
      },
      // 编辑
      onItemClick(index) {
        // 编辑方法
        this.$router.push({path: '/collect/collectDetails', query: {id: this.collectData[index].id, show: true}});
      },
      // 删除
      onOffClick(index) {
        let _this = this;
        this.$vux.confirm.show({
          title: '',
          content: '确定要删除吗？',
          // 组件除show外的属性
          onConfirm() {
            _this.deleteById(index);
            console.log(index);
          },
          onCancel() {
          }
        })
      },
      // 默认收藏夹
      getDefault() {
        let params = {}
        this.$axios.favourite.getDefault(params).then(res => {
          this.collectDefaultData = res.data.returnObject;
        }).catch((err) => {
          console.log(err);
        })
      },
      // 获取我的收藏夹
      getFavourite() {
        this.loading = true
        let params = {
          pageSize: this.page.index,
          pageIndex: this.page.size
        }
        this.$axios.favourite.getFavourite(params).then(res => {
          this.collectData = [];
          setTimeout(() => {
            this.loading = false;
          }, 0)
          if (res.data.returnCode == 1 && res.data.returnObject) {
            this.collectData = res.data.returnObject.list;
          } else {
            this.collectData = [];
          }
        }).catch((err) => {
          this.$vux.toast.show({text: '获取收藏夹失败', position: 'middle', type: 'text', width: 'auto', time: 2500});
        });
      },
      //
      nuwNumber(str) {
        let hei = document.body.clientWidth;
        let nowH = 40;
        if (str.length >= nowH) {
          return str = str.substring(0, nowH) + '';
        } else {
          return str
        }
      },
      // 取消分享
      shareSwitch(index) {
        let params = {
          favouriteId: this.collectData[index].id,
          isShare: false
        }
        this.$axios.favourite.shareSwitch(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.$vux.toast.show({text: '已取消分享', position: 'middle', type: 'text', width: 'auto', time: 1500});
            this.getFavourite();
          } else {
            this.$vux.toast.show({text: '取消分享失败，请刷新后重试', position: 'middle', type: 'text', width: 'auto', time: 1500});
          }
        }).catch((err) => {
          this.$vux.toast.show({text: '取消分享错误', position: 'middle', type: 'text', width: 'auto', time: 1500});
          console.log(err)
        })
      },
      // 创建项目
      addFavourite() {
        let params = {
          favouriteName: this.addVal,
          isDefault: 0,
        }
        this.$axios.favourite.addFavourite(params).then(res => {
          if (res.data.returnCode == 1) {
            this.addVal = '';
            this.$vux.toast.show({text: '创建成功', position: 'middle', type: 'text', width: 'auto', time: 2500});
            this.getFavourite();
          } else if (res.data.returnCode == 3) {
            this.$vux.toast.show({text: '收藏夹不能相同', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else if (res.data.returnCode == 2) {
            this.$vux.toast.show({text: '最多只能创建十个收藏夹', position: 'middle', type: 'text', width: 'auto', time: 2500});
          } else {
            this.addVal = '';
          }
        }).catch((err) => {
          console.log(err);
        });
      },
      // 删除项目
      deleteById(index) {
        let params = {
          id: this.collectData[index].id
        }
        this.$axios.favourite.deleteById(params).then(res => {
          console.log("删除成功", res);
          if (res.data.returnCode == 1) {
            this.getFavourite();
          }
        }).catch((err) => {
          console.log(err);
        });
      },
    }
  }
</script>

<style lang="scss">
  .xiaoan-box.collect-item.collect-all-item {
    height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: #f0f1f5;
    position: relative;
    .collect-item-scroll {
      height: 100%;
      width: 100%;
      background-color: #f0f1f5;
      .collect-search {
        height: 55px;
        width: 100%;
        padding: 10px 12px;
        background-color: #f0f1f5;
        form {
          height: 100%;
          width: 100%;
          display: table;
          .input-box {
            height: 100%;
            width: 84%;
            display: table-cell;
            vertical-align: middle;
            position: relative;
            input {
              height: 100%;
              width: 100%;
              background-color: #FFFFFF;
              color: #8d8d8d;
              font-size: 15px;
              padding: 0 30px 0 10px;
            }
            .icon-box {
              height: 29px;
              width: 29px;
              i {
                position: absolute;
                right: 7.5px;
                top: 50%;
                transform: translateY(-50%);
                color: #aeaeae;
              }
            }
          }
          .inputbtn {
            height: 100%;
            width: 16%;
            display: table-cell;
            vertical-align: middle;
            text-align: right;
            button {
              height: 100%;
              width: 85%;
              background-color: #FFFFFF;
              border: 0;
              color: #ffb148;
              font-size: 15px;
              border-radius: 2px;
            }
          }
        }
      }
    }
    .collect-cell {
      background-color: #f0f1f5;
      width: 100%;
      overflow-y: scroll;
      overflow-x: hidden;
      -webkit-overflow-scrolling: touch;
      .vux-swipeout {
        .vux-swipeout-item {
          .vux-swipeout-button-box {
            .btn-box {
              padding-bottom: 10px;
            }
          }
          .vux-swipeout-content {
            .infinite {
              width: 100%;
              padding: 0 12px 10px 12px;
              background-color: #f0f1f5;
              .card-box {
                width: 100%;
                padding: 10px 10px 8px 10px;
                background-color: #FFFFFF;
                border-radius: 2px;
                .title {
                  font-size: 15px;
                  padding-bottom: 6px;
                }
                ul {
                  display: table;
                  width: 100%;
                  padding-top: 6px;
                  li {
                    display: table-cell;
                    vertical-align: middle;
                    div {
                      padding-right: 5px;
                      display: inline-block;
                      img {
                        vertical-align: middle;
                        height: 14px;
                        font-size: 0;
                      }
                      span {
                        font-size: 12px;
                        vertical-align: middle;
                        color: #8d8d8d;
                        padding-left: 3px;
                      }
                    }
                  }
                  li.data {
                    text-align: right;
                    span {
                      color: #8d8d8d;
                      font-size: 12px;
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
</style>
