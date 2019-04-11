<template>
  <div class="user-other-client-item" :style="{height:height+'px'}">
    <div class="user-other-client-item-scroll">
      <ul v-infinite-scroll="loadMore" :infinite-scroll-disabled="loading" :infinite-scroll-distance="0">
        <li v-for="(list,index) of userOtherClientData">
          <div class="infinite" @click="toLink(index)">
            <div class="li-box vux-1px-b">
              <div class="cell nameImg">
                <img :src="list.concernedHeadUrl" alt="" v-if="list.concernedHeadUrl">
                <img :src="$image.personal.timg" alt="" v-else>
              </div>
              <div class="cell doc">
                <p class="title">{{list.concernedName}}</p>
                <p class="about" v-show="false">{{list.about}}</p>
                <p class="origin">
                  <!--<span v-if="list.concernedTitle">{{list.concernedTitle}} |</span>-->
                  <span>{{list.attentionCount}}个关注</span>
                  <!--<span>{{$const.format(list.createDate)}}</span>-->
                </p>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <p class="infinite-loading">
        <xiaoan-drop v-model="allLoaded"></xiaoan-drop>
      </p>
    </div>
    <xiaoan-loading v-show="allLoading"></xiaoan-loading>
    <xiaoan-warning v-show="warning.show" :imgSrc="warning.img" :hintBtn="warning.btnText" :isShowBtn="false"
                    :topHeight="warning.top" :message="warning.text"></xiaoan-warning>
  </div>
</template>

<script>
  import XiaoanLoading from '@/components/warning/loading'
  import XiaoanWarning from '@/components/warning/warning'
  export default {
    name: "user-other-client-item",
    components: {
      XiaoanWarning,
      XiaoanLoading
    },
    data() {
      return {
        userOtherClientData: [],
        allLoading: false,
        allLoaded: false,
        page: {
          index: 1,
          size: 20,
          total: 0
        },
        warning: {
          top: '25%',
          show: false,
          img: this.$image.personal.toFocus,
          text: '他暂时还没有关注！',
          btnText: ''
        },
        loading: false
      }
    },
    props: {
      height: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
      active: {
        type: String,
        required: false,//是否必填
        default: 0,
      },
      type: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
      status: {
        type: Number,
        required: false,//是否必填
        default: 0,
      },
    },
    watch: {
      active: function (val) {
        console.log('==========>', val);
        switch (val) {
          case 'share':
            this.warning.text = '他暂时还没有关注！';
            break;
          case 'groom':
            this.warning.text = '暂时还没有人关注他！';
            break;
        }
      },
      status: function (val) {
        console.log(val);
        this.allLoading = true;
        setTimeout(() => {
          this.page.index = 1;
          this.page.total = 0;
          this.userOtherClientData = [];
          this.searchAttentionUser();
          this.allLoading = false;
        }, 350)
      },
      $route: function (to, form, next) {
        if (to.query.selectUserId != form.query.selectUserId) {
          window.location.reload();
        }
      }
    },
    created() {
      this.searchAttentionUser();
    },
    methods: {
      toLink(index) {
        this.$router.push({
          path: '/userOther',
          query: {selectUserId: this.userOtherClientData[index].concernedId}
        });
        window.location.reload();
      },
      loadMore() {
        let lastValue = this.page.index;
        if (lastValue < this.page.total) {
          this.loading = true;
        } else {
          this.loading = false;
          return
        }
        setTimeout(() => {
          if (lastValue < this.page.total) {
            this.page.index += 1;
            this.searchAttentionUser();
          }
          setTimeout(() => {
            this.loading = false;
          }, 5000);
        }, 300);
      },
      searchAttentionUser() {
        /*this.$http ({
          method: "GET",
          url: this.$api.xinhu.searchAttentionUser,
          params: {
            selectType: this.type,
            selectUserId: this.$route.query.selectUserId,
            pageNum: this.page.index,
            pageSize: this.page.size
          }
        })*/
        let params = {
          selectType: this.type,
          selectUserId: this.$route.query.selectUserId,
          pageNum: this.page.index,
          pageSize: this.page.size
        }
        this.$axios.xinhu.searchAttentionUser(params).then((res) => {
          if (res.data.returnCode == 1 || res.data.returnCode == 200) {
            this.warning.show = false;
            this.page.total = this.$array.totalPage(res.data.total, this.page.size);
            if (res.data.returnObject != null) {
              //控制下拉刷新
              let data = res.data.returnObject;
              this.userOtherClientData = this.$array.loadMore(this.userOtherClientData, data);
            }
          } else if (res.data.returnCode == -1) {
            if (this.userOtherClientData.length == 0) {
              this.warning.show = true;
            }
          }
        }).catch((data) => {

        })
      }
    }
  }
</script>

<style lang="scss">
  .user-other-client-item {
    .user-other-client-item-scroll {
      height: 100%;
      overflow-y: scroll;
      -webkit-overflow-scrolling: touch;
      ul {
        li {
          .infinite {
            padding: 0 12px;
            .li-box {
              padding: 10px 0;
              display: table;
              table-layout: fixed;
              word-wrap: break-word;
              width: 100%;
              .cell.nameImg {
                width: 14%;
              }
              .cell.doc {
                width: 86%;
              }
              .cell {
                display: table-cell;
                vertical-align: middle;
                img {
                  width: 35px;
                  height: 35px;
                  border-radius: 50%;
                  vertical-align: middle;
                }
                .title {
                  font-size: 15px;
                  color: #323232;
                  text-align: justify;
                  text-justify: auto;
                  font-family: PingFangSC-Medium, sans-serif;
                  margin-bottom: 5px;
                }
                .about {
                  font-size: 13px;
                  color: #545454;
                  text-justify: distribute;
                  display: -webkit-box;
                  -webkit-box-orient: vertical;
                  -webkit-line-clamp: 2;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  margin-bottom: 5px;
                }
                .origin {
                  color: #aeaeae;
                  font-size: 12px;
                }
              }
            }
          }
          &:active {
            background-color: #f0f1f5;
          }
        }
      }
    }
  }
</style>
