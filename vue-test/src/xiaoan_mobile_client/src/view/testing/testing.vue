<template>
  <transition name="bounce">
    <div id="vxa-testing" class="vxa-testing">
      <div class="vxa-scroller">
        <div class="testingTitle">
          <div class="testingTitle-icon"></div>
        </div>
        <div class="testing-text">{{clue}}<span class="testing-mun">{{totalNums}}</span>{{ren}}</div>
        <div class="testing-pal">
            <span class="testing-pal-mun"><span class="testing-pal-icon"></span>
                {{text[0]}}<span class="testing-pal-int">{{friendNums}}</span>{{text[1]}}</span>
        </div>
        <div class="clickQue">
          <button @click="clickQue(0)" class="leftIcon">{{btnStr[0].title}}</button>
          <button @click="clickQue(1)" class="leftIcon"><img class="leftIconImg" :src="newIcon">{{btnStr[1].title}}
          </button>
        </div>
        <div class="testing-details">
          <div class="testing-detailsgul">
            <div class="testing-details-tli">
              <div class="testingEnd-content-middle-item">
                <span class="testingEnd-content-middle1"><div></div></span>
                <span class="testingEnd-content-middle-text" v-html="text[2]"></span>
                <span class="testingEnd-content-middle2"><div></div></span>
              </div>
            </div>
            <div class="testing-details-content">
              <div class="newOTCBBTestDescribe-docBox">
                <div class="newOTCBBTestDescribe-docBoxAll">
                  <p v-for="list in test">
                  <span class="newOTCBBTest-docBoxAllOneA">
                      <span class="newOTCBBTest-docBoxAllOne">
                          <span>{{list.id}}</span>
                      </span>
                  </span>
                    <span>{{list.name}}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'testing',
    data() {
      return {
        text: ['好友参与人数', '人', '活&ensp;动&ensp;详&ensp;情'],
        testingBack: this.$image.testing.testing,
        clue: '已累计参与人数',
        ren: '人',
        user_id: '',
        totalNums: "0",
        friendNums: "0",
        username: "",
        rulTime: '',
        newIcon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAG8AAABICAYAAAD4bKvuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MzEwRkE3NzlDMTBCMTFFNzkwQTFEOUIyMEZCQzA0RjQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MzEwRkE3N0FDMTBCMTFFNzkwQTFEOUIyMEZCQzA0RjQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozMTBGQTc3N0MxMEIxMUU3OTBBMUQ5QjIwRkJDMDRGNCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozMTBGQTc3OEMxMEIxMUU3OTBBMUQ5QjIwRkJDMDRGNCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiUlGKwAAA9vSURBVHja7F0LcFTVGT53dwEhIeTFQ8AA4RFfqFAND1HUKr7ajq0WqdU+BmHajqV1bK0zrY9qdbRMpzqOrQ6CBqYddQaR6igPER+AiKCRRCAJIQTCQ0lAAZWY7P37n7s3u/fe859zz969G03IMv/m7rnn3Mf57v//3///ZxcDll/FsvDqhVKOMhVlPEopymko+Sh5oZ4JJB+A6AqeneBzLOl+cB8i1e8ofvgMP+/D7XqUKtxej383obQ5LiA5JvLTNYFvPRbiNA5Aud6Wi1FyWbZeFGBA9wMtMDT22xMPin3WgwnWw1mCMsXRfhzb38a/S7kAwOdhTEMkhGOMQ3kKpQllIco1oQMHTnF8AEi1M0eTJcDA1UAcy7vfex5brGOB49Sm60TScY72XDzGNSgLwYQm/PwUyjhmfnPgDUdZgrIdZW5WAaPAogBTguGdWDlgTrBADYobSDO1D0GyjwPWtuMcuShzse92/LskXnHp8KBTZATwedzU/h7l3lABC2oKlb5L31SC3BRqtQNIrkfanmw7jlt/xa1HY798sz2b4I1AeQ5lcjcjGuI4LcB8AFaACGLbRnyfFZv9VmM2zOa1KJUZARfEFEKGptDUNIVmBqaQ6m8yV1vy/KZ9T6bjehN9J6NUti+4+NqwwZuNstym+icT0ZCAxUhwk8dPPjAOsJyACeOTIOZj3+VtT100Oyzw7kBZgBI9yYkGNdke7XI8gLK+RFvHuRJjcJ6BLWh7ctodmYI3B2U+941paRdkql16YPlql59pc2iGtnapTKHCbDpNsxMsPlYEFgxsm9/2rwvnBiUs19qmMtpDNJREQ+xLtIFWP/c142Yc/1zX+7b1r6QDHmeVH6IUfMszGuGAxdwWQgDLBxhqPAhtnvGSNhDbjuD7xN7zNuzWMZu9cMDzKAU9REObaLhNIenjgGxLnCfla13MN9EPcYDnvn5sSi95bjP1RP0RP0zqdtrlZwr9+lKmMIB2ga4Wuu+F43EnyoNus/nSVc4b4QnVGpRTunFGQzSFCrPpvm2NCSfABpCB5bk/GX9I9DmB72V9bt+4J6V57sEPcOB6iEbGRENxH34PuOdYqQ2uUA+h3JzSvGVXdhyvNKF1EEsLrNKZzJh4q7t/cx0z3/iNLyjGmFnMuMA9Fj7+H4PKx2iw+o9m0esWhJJKNXdtwGu8K3Edwy9j0avvE/q0PXmRr4mLTv0Di0z4oTC2ffk9zGx8XQlWrxsrmHHqOPc5l93NzN2rJS7LCizO7nPHe9stwuIgGneixNIlGsaAUeJJiscyllPqTzTyR4rX90mllGgYhWeEV7U4UJUiGick5TUfosEGjGWRs66SB8BS4oYTP+JyATjzQC0zG1a7tdmVdUCCCez2FNtMHDAH5aYgGQ02oIQOIMtm+mY0jPwR4i03b5VnNApGh4ad+emOjowGPjCb5eCZHlaYfLCARSfNYax3X43khVsB+DEik28RhsQ3LvGCRWWcbmqdX57nAA+uQ+kfiMZzLaPAGzHVN6PBBnrGfnEY3XKLNKNhDD4zHOS+/goBe9/9QFHzb7rBsvrbNN7IQ60be6FPqtAzZ3ZTZOQVLEJp3a5VBOgeZWLAFe0GJ2GZFYhoFE6QX3ivvswo+R6DxldIomEUTxTv9dOaxORIiIZRINYtzR2rGTSsFx57AAUhaP2cJavYEuBSk0b7+uiUuWrg8oYSc5c4ZpTSug2LacZL3wMHbxH3cVzvvxsk5jIKxqlvoPQynNiX6eMUlIlzdbghBbSH2Rl5Y6wHQhiDwMHeNRlnNOB4CzNyizxPBj2BkZGXs8g4H63LG0Iy0cgoQuv221qnYKAetnzJiUcu6Ms1rxw/9lXGHrJ9A89WV3qHnstYLhKXY/XCMYwCkehAS63o5O0PxtBy2nftWeOfvgLmT+MRPOYFT6Y5k27RqK4A+dBHJ/9M1Lp3F9OAyTWQP8XlyDZZedDSCcsv8S/Vj/0+WTphBQRZ2btWXjopLCWYaS2ZtfcjGqn78JyHBM7t7w30V16WGK9dr0VaLK0b6tW6GmbWr3KcJlWSSj54RDmNKx0SFhgftHRi5A8TCYc3eTrqIrJ0YgxykxU40qQsnRiFBNgtjYp8IU003OGLvCLSEWc6iYYV11H+at2Tau2zB0eniGPbNyzRBctdqAR2Dmebo32Tu8I+nMxTp4vX2vQBg30fuRtzCpkx7BLXE24UfYfwd3vsiXec0wGMMXgcEVbUi8ldSgt96Tcwc9/H4oOHWubsEzn9R4K/itegzz1c61ucjoyagVpXRmjdSglYzAuWt19pDCdmWKDSSeFYAoBdDA5sZdFh57pN55gZDPa8kcqsFBNkpaUhEfgSpMIYfD45L9GLf2VJOq+2ip+jltcKSXHQ8FsxYnWCWf2aPD/pYMvRqYTWrVcwTKkZT24M5xmWgiClE6OAyI4cwsC3frkVR7me4FKM+XoXJTMapP86VCvNaBgDTw8lvOOMEg7X2OUrd7XLT3Oi5/2CGf2LRM2xYzM41kKaXUtjR19Ba93OlXLtkmogdPwpiFjLswOs0WAFJUScttnqZ9avE4nL6TckTSHpvxrXSIkGBXYg8Jr3iIB13FTrcQXhQH9VPpOIzZak5vNYs5SsxKaKDLN93WKFf/PWUT1eLdHcPxJ0jYaRP1xkfrafMbf+V/QfY6enNMnjv+Bwk5JoRIpHhpMS435NkvqDgzVS1YtOv4vUujj6qyTR8N7voFEJX1dK+Lp9ttYptMt7iQSobejzGD5ykJtO6cQYdhnh7xpTPvPITgtMJ0g8O2IMOp80Ueb+bQnAJMG0MUQkK/Ety9CPfqB0EV5/bR6s1ChxedpPGchi511NsMTFanPbp18C+PFXS7RO9G8g92/UdR6L2d9YyU1njYZB5DOheZeLfps1a1nUo2GRc36MQFX5jnWVjYbQwXm8bi2So02y0ok/OBp9eFN00mwh+ZzwV6vkqayOay8oY9EzphFat4KsFDG/Oqq77Tg3m/vSXaPBhpxFEI7tLqJh1r0qEpcREzFMoILt7fLSSckFdGJ5/yZV6UQjVnL3gc/EVeZGn/601nVojpdoeF6x6b8W2e47FbQpBMk6IakfhIMRnPBdmotBUzEeRVYOvO8mGl8dYmbjB+5O+ARHz55BjN0kLZ2wYjGNZrbs1SmdUIGtJ45NxbJmyw5x8qfcJNE6IjbzAp9XTGtd3Uo5WNQDLO/XwDWvOo3FoHgzxczILXRP/sFakmjEP3zBnwEeqJWWTiyHXyQyU7OpWqd0QvZxrWim6LkTgOLTaK0jtcYztn8RqXXqkID5Llx2SFUMJ3xzOms0jIHnEITj41SJxVlOQo3iTNIolH8FzWzeLS2dWOcrGk6EJDt1Syeq5K4/YRHYKtecFWqioRpbuyIdQkLsdp3wfR7nvYt32KZK7qZiPM40J9CTKSnkmjveVGveoXqJ5tjpKVJbq+Sm0E+7KB9oP+l8glWv9nUVtFLw7dYv1Zmdtyp0TKGghda/ZIoy2a8NZSMvCR3FBoyq4VKd0olRRJRyPqmWak5863MsOvVm+RN5cJu8Xji4jBwTu+YvgeK8tpfvtzIs6Wpch+bE61ZKtQY+QcZcShenzSausa8F0S5Zvw39Hqg8GrMLjs/j/F2qU8A0ik4TmR/PFXqr7x0bXzZbJZOopHhpsUa66ogmms6seINerRe/zpYav3yhHHjurwACAd/29rPyZY7exbtKc56c4KXWPNhE4wW8sFbf0kmfYqHaDMj8KKLhNIXmTrrexSvIKqIRKS5hYb3MQ3v8MxoS05f0dSoTJzsv17qaFR7T7jSHsrDAqTguE/s1VzYLPBusI7hzqR/9jgw+TwyWrZQTk389i9/AtqVk4tbcVy2NywAILc8EvL3VVHLXFXNZpo/UnAqf3CNIAWx761kPWEoG6Y1jKGBf6ve3jz613IfDFDyCO37CvN/Fc5ROuLRvXuaelLq1WtmK9rcXMmPQGFcfs3YtsdDJNpmFZaz9vRcDZqDFC4l/+KLI6D394ru3iIc68YWDJcr9Ubxhs5iXPnGcxWte8zGHWj7O2fiPJCdo/afrK+bL8Q5/4OsOtNbXh0njdal+xvnCsGi8v+8CvwePvJFX+z20Nfmd9ZiHaPyZ8R/BAeKXkQA6B6xghUl6TgKAoK8JgYiGrnZR7fxnPv7kIm4eolGN8jiZL8xGRkO9RkOrMKlROgkro5Ep0dDsK/o5u/lx1LpqV8hErC28myV+gqosu6ZQVyO6kCnMXLtkXol/AegeId4lYpcvUG5EeZdZ6zl9wErLzIVgCtMvnYRjCjMnGsrjgryRl2Zm5TxcJZT6IxIT9hHKPBWNd60qk5omyGSNRlilE6XZ0jaFEMAUMl9T6FlRT/afh8BVkpkmhSl8miV+HO7eHqKRFVOowzrvz3mk6mlZRBSTHcAG7D584/Wf32qBlYZ/A01QwzBbWaXxwUyhzvEfR+DuVYWzMfcX3Ukg5qF8ZhGZHqKRDe2iDvSgTRyVrxiAFhCc6exHeRQ/9+khGgG1S6l11s5WlNtz/l79b51EUiyNcIAvyOc5oBfw86iTJKOhdxjld/yYrpo2oMxE4DbrZgEjAjNUBtIIHsAE3HjCWs1JLwYNa42GbmEySHJXO6CmCSCx4El5fOUYXhp4AndPSAc4d5ynTzT4UsHbUJ5BeQwbLuwhGtra5R3Da2W/y5lfvSVI/j3itzRAEXNtQZmGGzPw7+t2uKRXOtGKubKsXSwd7WJ62gVaGsn/8d/4uBJlWlDg6DgvfaKx2hJgfCUu/yrM9djhzJOMaOiM28YSP83Pf1S9Tn3jaZrNEIhGHco9uMmZ6akofE08N6njre8AJtq6I9GgxhxgHf8pRsI0vmG1Ub9slAl4kJ2MBr/4/yQkqV38dzv574cUBARgKL6/k2bMFbf986rg2pWWv+M/r3jUPq8ANKSj0WkRluwTjbh1c4nfjwyiXe1pmkI8H8zBxmeypF2+yYmwwdKM87p8RoPT7zk2I84eWJ2gXWmA1y0yGhy4Wy3gwiEa4WsXhINqTHdyuwjR4ImDWwWNC1G7IND47KhgLOTFoN9kctdjKgMG1mGZQh3AIETwunBGIwEcwKJvvSkMUQFjwKArl0469nKNW9SpRENzmXznEZaul9EAm5ws6q7alR7b7DoZDbDJyaJvnGh0Elg02/w2mUI9fycxlV2DaHSC2ewUohFEIzuAW9gdTWFmGZbOIxpBJonXihLAdWGikX2zmV2iEYTG87e54ADuZNAu1ev/AgwA1MS02PtrcToAAAAASUVORK5CYII=",
        headerTouxiang: "",
        userQa: false,
        userD: '',
        test: [{
          id: "1",
          name: "本测试涵盖信息披露、公司治理、股票交易、发行、收购、重组等多个专业维度。完整填写注册信息后，系统将从题库中智能地挑选题型并调整难度，最终测评出董秘各个专业维度的能力，得出综合能力指数。"
        },
          {id: "2", name: "测试过程若意外中断，重新登录后可从中断部分继续答题。不论中断频次，系统不会停止计时，测试时长会直接影响综合能力指数，提醒注意答题时间。"},
          {id: "3", name: "每邀请5位好友参与测试会点亮1颗魅力值之星，点亮全部六颗星将有机会获得惊喜奖励，详情请关注“信公咨询”微信公众号了解奖品和领奖方式。"}
        ],
        btnStr: [{id: "0", title: "沪深两市", togo: ""},
          {id: "1", title: "新三板", togo: "newOTCBBTestingList"}],
        payMode: "",
        hasNoDone: '',
        myUserId: ''
      }
    },
    created() {
      this.userHome();
      // 获取用户信息判断是否填写个人信息  若是没有则跳转填写个人信息页面
      if (this.$route.query.userId !== undefined) {
        this.userD = this.$route.query.userId;
      }
      if (this.$route.query.fromUserId) {
        window.localStorage.setItem("fromUserId", this.$route.query.fromUserId);
      }
      let userId = this.$cookie.getCookie('userId');
      this.user_id = userId;
      if (this.$cookie.isLogin()) {
        // 有
        console.log('有登录的情况');
      } else {
        // 无
        console.log('没有登录的情况');
        this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
      }
      console.log(this.user_id);
      this.sectestSetNum(); // 获取人数
      this.linkTest();
    },
    mounted() {

      this.minsHeight();
    },
    methods: {
      //
      userHome() {
        /* this.$http ({
          method: "GET",
          url: this.$api.userHome.userhome,
          params: {}
        }) */
        this.$axios.userHome.userhome().then((res) => {
          console.log(res);
          if (res.data.returnCode == 1) {
            if (res.data.returnObject.realName == '' || res.data.returnObject.realName === null) {
              this.$storage.loginStatus(this, this.$route.meta.title, window.location.href, 'completeInfo');
            }
            this.myUserId = res.data.returnObject.id;
            console.log('sadad,,,,,', this.myUserId);
          }
          let adverttitle = "专业董秘才敢做的测试题！";
          let sharelink2 = this.$api.CURRENTIP.IP + "#/testing?fromUserId=" + this.myUserId; // 分享链接
          let shareDesc = ""; // 描述
          this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.testingImg, true);
        }).catch((err) => {
          console.error(err);
        });
      },
      //
      linkTest() {
        this.$axios.testing.myTest().then(res => {
          this.results = res.data.result;
          console.log("=========================", res);
        }).catch((err) => {
          console.error(err);
        });
      },
      //
      minsHeight() {
        var min = $(document).height();
        var max = $(document).width();
        console.log("23423423", max, min);
        if (max === 360) {
          $("#testing .testingTitle-icon").css({"height": "120px", "width": "226.8px", "margin": "auto"});
          $('#testing .testing-details').css({"height": "180px"});
          $('#testing .testing-details-content').css({"height": "61%"});
        } else if (max < 360) {
          $("#testing .testingTitle-icon").css({"height": "120px", "width": "226.8px", "margin": "auto"});
          $('#testing .testing-details').css({"height": "180px"});
          $('#testing .testing-details-content').css({"height": "61%"});
        }
      },
      // 获取人数
      sectestSetNum() {
        this.$axios.testing.getNum().then(res => {
          console.log("linkTest", res);
          this.totalNums = res.data.returnObject.totalNum;
          this.friendNums = res.data.returnObject.friendNum;
        }).catch((err) => {
          console.error(err);
        })
      },
      // 判断该用户测评状态
      clickQue(index) {
        if (this.btnStr[index].id === "0") {
          if (this.user_id == '' || this.user_id.length == 0) {
            this.$storage.loginStatus(this, this.$route.meta.title, window.location.href);
            this.$MTAmethod.mtaShare('dongminenglicep-2', {teststart: true});
          } else {
            this.$MTAmethod.mtaShare('dongminenglicep-2', {teststartnow: true});
            if (this.results == '-1') {
              this.$router.push({path: "/testingEnd"});
            } else if (this.results == 1) {
              this.$router.push({path: "/testPlate"});//流程走
            } else if (this.results == 2) {
              this.$router.push({path: "/testingEnd"});//
            } else if (this.results == 3) {
              this.$router.push({path: "/testingEnd"});
            } else {
              console.log("有测试未完成");
              this.rulTime = "当前有测试未完成！";
              this.$router.push({path: "/testingList", query: {market: 1}});
            }
          }
        } else {
          this.$router.push({path: "/newOTCBBTestingList", query: {entrance: 0}});
        }
      }
    }
  }
</script>

<style lang="scss">
  .vxa-testing {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #5B5C64;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/testback.png");
    background-size: 100% 100%;
    .vxa-scroller{
      height: 100%;
    }
    .testingTitle {
      padding: 25px 30px 0 30px;
      .testingTitle-icon {
        width: 321.41px;
        height: 170px;
        margin: auto;
        background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/testing/biaoti@3x.png");
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .testing-text {
      color: #f0cf8d;
      padding-top: 22px;
      text-align: center;
      font-size: 15px;
      .testing-mun {
        color: #ffffff;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        font-size: 29px;
        padding: 0 0 0 2px;
      }
    }
    .testing-pal {
      text-align: center;
      position: relative;
      top: -5px;
      .testing-pal-mun {
        background-color: rgba(0, 0, 0, 0.5);
        color: #f0cf8d;
        font-size: 15px;
        border-radius: 1px;
        padding: 0 5px 0 5px;
        z-index: 120;
        position: relative;
        .testing-pal-icon {
          display: block;
          text-align: center;
          height: 8px;
          color: #f0cf8d;
          position: absolute;
          top: -8px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 100;
        }
        .testing-pal-icon:before {
          content: '';
          height: 0;
          width: 0;
          display: block;
          border: 8px transparent solid;
          border-top-width: 0;
          border-bottom-color: rgba(0, 0, 0, 0.5);
        }
      }
      .testing-pal-int {
        color: white;
        font-size: 29px;
      }

    }
    .clickQue {
      padding-top: 4%;
      text-align: center;
      display: table;
      width: 100%;
      .leftIcon {
        width: 145px;
        display: table-cell;
        vertical-align: middle;
        height: 40px;
        border: none;
        background-color: #f0cf8d;
        color: white;
        font-size: 23px;
        border-radius: 30px;
        line-height: 40px;
        text-align: center;
        padding: 0;
        font-family: PingFangSC-Medium, sans-serif, Microsoft Yahei, Helvetica;
        position: relative;
        .leftIconImg {
          width: 40px;
          position: absolute;
          right: 0px;
          top: -26px;
        }
      }
      .leftIcon:first-child {
        margin-right: 30px;
      }
      .leftIcon:active {
        background-color: #e4c077;
      }
    }
    .testing-details {
      padding: 0 21px 21px 21px;
      min-height: 257.5px;
      margin-top: 20px;
      .testing-detailsgul {
        width: 100%;
        height: 100%;
        background: rgba(240, 207, 141, 0.23);
        border-radius: 10px;
        .testing-details-tli {
          padding: 15px 0 15px 0;
          text-align: center;
          .testingEnd-content-middle-item {
            text-align: center;
            color: #f0cf8d;
            padding-left: 6px;
            .testingEnd-content-middle1 {
              width: 60px;
              height: 1px;
              display: inline-block;
              border-bottom: 0.5px solid #f0cf8d;
              position: relative;
              top: -5px;
              div {
                height: 3px;
                width: 3px;
                background-color: #f0cf8d;
                position: absolute;
                border-radius: 50%;
                right: 0;
                top: 0;
              }
            }
            .testingEnd-content-middle-text {
              padding: 0 6px 0 6px;
              font-size: 15px;
              /* letter-spacing: 5px;*/
            }
            .testingEnd-content-middle2 {
              width: 60px;
              height: 1px;
              display: inline-block;
              border-bottom: 0.5px solid #f0cf8d;
              position: relative;
              top: -5px;
              div {
                height: 3px;
                width: 3px;
                background-color: #f0cf8d;
                position: absolute;
                border-radius: 50%;
                left: 0;
                top: 0;
              }
            }
          }
        }
        .testing-details-content {
          font-size: 13px;
          padding: 0 17.5px 10px 17.5px;
          text-align: justify;
          color: #f0cf8d;
          font-family: PingFangSC-Regular, sans-serif;
          overflow-y: auto;
          -webkit-overflow-scrolling: touch;
          .newOTCBBTestDescribe-docBox {
            .newOTCBBTestDescribe-docBoxAll {
              p {
                font-size: 13px;
                color: #f0cf8d;
                overflow: hidden;
                text-align: justify;
                font-family: PingFangSC-Regular, sans-serif, Microsoft Yahei, Helvetica;
                display: table;
                width: 100%;
                margin-bottom: 7px;
                span {
                  display: table-cell;
                }
                .newOTCBBTest-docBoxAllOneA {
                  width: 23px;
                  vertical-align: top;
                  .newOTCBBTest-docBoxAllOne {
                    width: 16.5px;
                    border: 0;
                    border-radius: 50%;
                    height: 16px;
                    font-size: 10px;
                    color: rgba(240, 207, 141, 1);
                    background-color: rgba(240, 207, 141, 0.15);
                    display: inline-block;
                    text-align: center;
                    position: relative;
                    span {
                      line-height: 1;
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      transform: translateX(-50%) translateY(-50%);
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
