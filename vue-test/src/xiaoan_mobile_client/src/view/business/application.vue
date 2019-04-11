<template>
  <div id="application">
    <div class="instructions"><!-- 开票须知 -->
      <div class="content-middle">
        <div class="testingEnd-content-middle-item">
          <span class="testingEnd-content-middle1"><div></div></span>
          <span class="testingEnd-content-middle-text">开票须知</span>
          <span class="testingEnd-content-middle2"><div></div></span>
        </div>
      </div>
      <ul class="msg">
        <li v-for="list in msg">{{list}}</li>
      </ul>
    </div>
    <div class="application-foo"></div>
    <!--表单区域-->
    <div class="content">
      <!--发票信息-->
      <div class="ticket" v-show="ticketDis">
        <div class="ticketHead">
          <div class="ticketHeader">
            <div @click="geRen($event)">个人<span class="ticketHeadGe" v-show="ticketHeaderGe"></span></div>
            <div style="font-weight: lighter;color:#e3e3e3;">|</div>
            <div @click="geGong($event)">公司<span class="ticketHeadGong" v-show="ticketHeaderGong"></span>
            </div>
          </div>
        </div>
        <!--发票抬头-->
        <div class="ticketList ticketListTaitu">
          <label>{{taiTouName}}</label>
          <div>
            <input type="text" id="taiTou" :placeholder="taiTouText" v-model="taiTou"
                   @blur="inputBlur($event)"
                   @focus="inputFocus($event)">
            <b v-show="taiTou.length>0" @click="clock($event)"></b>
          </div>
        </div>
        <!--公司税号-->
        <div class="ticketList " v-show="ticketListShuiHao">
          <label>{{ shuiHaoName }}</label>
          <div>
            <input id="shuiHao" type="text" style="ime-mode:disabled"
                   @keyup="shuiHao=shuiHao.replace(/[\W]/g,'') "
                   :placeholder="shuiHaoText" v-model="shuiHao"
                   @focus="inputFocus($event)"
                   @blur="inputBlur($event)">
            <b v-show="shuiHao.length>0" @click="clock($event)"></b>
          </div>
        </div>
        <!--发票金额-->
        <div class="ticketList">
          <label>{{ jinEName }}</label>
          <div>
            <input id="jinE" style="ime-mode:disabled" type="number" min="0" @focus="inputFocus($event)"
                   :placeholder="jinEText"
                   v-model="jinE" @blur="inputBlur($event)">
            <b v-show="jinE.length>0" @click="clock($event)"></b>
          </div>
        </div>
        <!--付款凭证-->
        <div class="ticketFile">
          <div class="ticketFileOne">
            <div>{{ pinzhengName }}</div><!-- @click="alertContent=true"-->
            <button name="" class="ticketFilePin" @click="goApplicationImg">凭证示范</button>
          </div>
          <div class="ticketFileTwo">
            <label @click="onFileChange($event)" class=""><span>{{pingzhengText}}</span><img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHcAAAB3CAYAAAA5Od+KAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKFdpbmRvd3MpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkYxRDg0NUQyOTE2QjExRTc5NTgwOUJCM0FBNjgwRUZGIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkYxRDg0NUQzOTE2QjExRTc5NTgwOUJCM0FBNjgwRUZGIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RjFEODQ1RDA5MTZCMTFFNzk1ODA5QkIzQUE2ODBFRkYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RjFEODQ1RDE5MTZCMTFFNzk1ODA5QkIzQUE2ODBFRkYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz5XNXz9AAAC7klEQVR42uydvWvVUBiHT+wVrBVBQRwMUheH1sHBP0BddJCCbhXFta6iS0fBRRAnwU0QBUHUTlJo8W6C4tBR6qBws1z8oBRUWuuNv9OcSLhyM3iL5D0+D/wIycklN+9DTgL5OEmn03GBSeWksk/5qeQOLJCE6XtlLk3T1bKhFaZXlJvKCLUyzbssy85L8JtN6zpyT2j6orLCutJTtlErE/hedrQyv6wcleDv/sidCQt9N3xNWQw/QK4dubuVq8o55bByWnnm5R6oGL9FrWyhI3Rzqu74dpDrOejC0VleOH2jVKZp9V9kVeVyMRWP3J7jvBo3yEUuIBeQC8gF5AJykQvIBeQCcgG5gFxALnIBuYBcQC4gF5CLXEAuIBeQC8gF5AJy/ytake/fEcW/47jWt3yX8lrpItcuN5SpAW0XlQd0y3bZXtMW/Sursctdq2nbQC4gF5ALyAXkAnKRC8gF5AJyAbmAXEAucgG5TSf/yzbkGqDufu5K7HKb9pjNMeW4G/5Guv/uv/9a+GTNOtOuGGZnz5Db8tv5oTxSPiF3MGeV2X+0rQshW8WrpsltWre8arQH9ONDrHPOBeQCcsGQ3DGjddzZwIvTxv2hl8pDN/wAVr0wPaWMD1inrSy54tWSYWvo/28XufXMh2wVj2vk3lGe0C3HuX+xvyeFXOQCcgG5gFxALiAXuYBcQC4gF5ALyAXkIheQa3X/EuTaZm9N22jscmO/YX1dmXB/PpPln5tqI9c2CyGccwG5gFxALiAXkAvIRS4gF5ALyAXkAnKRC8gF5AJyAbmAXEAucgG5gFxALiAXkAvIRS6Yllu+p9qjHKap+ktKuSNhQYv6mOZrv1wv9HNYcMgVI3K1w/KEejWfLMv80Hh+AI3q6GbdUu495YwrRgZ5qnwIRzNybeDHLdyh7A/zX5TFUq4XeleZCY3j1Mss/gsCl9I0/Vg9z15WnitTrviOxAZ1MkMSrp3eKvcldvl3Q57nlCdSfgkwAEojaVERmBpkAAAAAElFTkSuQmCC"
              alt="">
            </label>
            <div class="" style="display: none">
              <form action="" onsubmit="return false;">
                <input id="upfile" type="file" style="display: none" ref="upload">
              </form>
              <!-- <img :src="upImg" alt="" style="display: none" @click="add">-->
            </div>
            <b v-show="pinzheng.length>0" @click="pinzheng=''"></b>
          </div>
        </div>
      </div>
      <!--收件人信息-->
      <div class="personal" v-show="personalDis">
        <!--收件人-->
        <div class="ticketList">
          <label>{{personName}}</label>
          <div>
            <input id="person" type="text" @focus="inputFocus($event)" :placeholder="personText"
                   v-model="person" @blur="inpBlur($event)">
            <b v-show="person.length>0" @click="person=''"></b>
          </div>
        </div>
        <!-- 联系方式 -->
        <div class="ticketList">
          <label for="tel">{{ telName }}</label>
          <div>
            <input id="tel" type="tel" @focus="inputFocus($event)" :placeholder="telText" v-model="tel"
                   @blur="inpBlur($event)">
            <b v-show="tel.length>0" @click="tel=''"></b>
          </div>
        </div>
        <!-- 收件地址 -->
        <div class="ticketList">
          <label>{{ adressName }}</label>
          <div class="areabox">
            <select class="pro" v-model="pid" @change="prochange()">
              <option :value="v.id" v-for="v in pro">{{v.name}}</option>
            </select>
            <select class="city" v-model="cid" @change="citychange()">
              <option :value="v.id" v-for="v in city">{{v.name}}</option>
            </select>
            <template v-if="county.length>0">
              <select class="county" v-model="ccid" @change="districtChange()">
                <option :value="v.id" v-for="v in county">{{v.name}}</option>
              </select>
            </template>
          </div>
        </div>
        <div class="ticketList">
                    <textarea id="textarea" class="textarea" @focus="inputFocus($event)" :placeholder="textareaName"
                              v-model="textarea"
                              @blur="inpBlur($event)"></textarea>
        </div>
      </div>
    </div>
    <!-- 提交 -->
    <div>
      <div class="complete completeColo" @click="completeNext" v-show="ticketDis">{{ complete }}</div>
      <div class="complete completeGat" @click="completeM" v-show="personalDis">提交</div>
    </div>
    <!-- 弹出内容 -->
    <div class="alertBox" v-show="alertContent">123</div>
    <div class="shadow" v-show="alertContent" @click="alertContent=false"></div>
    <!-- 确认开票信息 -->
    <div class="configBox" v-show="configInfo">
      <div class="configBoxTop">
        <div class="configBoxTopCont">
          <div class="partFirst">
            <!-- 发票抬头 -->
            <div class="infoList">
              <label>{{ taiTouName }}</label>
              <div class="infoCuter">{{ taiTou }}</div>
            </div>
            <!-- 发票税号 -->
            <div class="infoList">
              <label>{{ shuiHaoName }}</label>
              <div class="infoCuter">{{ shuiHao }}</div>
            </div>
            <!-- 发票金额 -->
            <div class="infoList">
              <label>{{ jinEName }}</label>
              <div class="infoCuter">￥{{ jinE }}</div>
            </div>
            <!-- 付款凭证 -->
            <div class="infoImg">
              <label>{{ pinzhengName }}</label>
              <div class="infoToImg">
                <img src="" alt="pinzheng" id="pinzheng">
              </div>
            </div>
          </div>
          <div class="infoTo-foo"></div>
          <div class="partSecond">
            <!-- 收件人 -->
            <div class="infoListT">
              <label>{{"&ensp;&ensp;"+personName}}</label>
              <div class="infoCuterLeft">{{person}}</div>
            </div>
            <!-- 联系方式 -->
            <div class="infoListT">
              <label>{{ telName }}</label>
              <div class="infoCuterLeft">{{tel}}</div>
            </div>
            <!-- 收件地址 -->
            <div class="infoListT">
              <label>{{ adressName }}</label>
              <div class="infoCuterLeft">{{province}}{{selectcity}}{{district}}{{textarea}}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="partButton">
        <button class="cancel" @click="configCal">{{ cancel }}</button>
        <button class="sure" @click="addInvoice">{{ sure }}</button>
      </div>
    </div>
    <!---->
    <div class="matteShow" v-show="matteSh">
      <div class="snake-circle rules-circle"></div>
    </div>
    <!--32342-->
    <div class="matter-goList" v-show="matterGoList">
      <img
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAL0AAAC/CAYAAACrH907AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkNCM0E2Rjk4QTQ4MTFFNzlGQUNEN0RDMTQ2OUU2ODQiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkNCM0E2RkE4QTQ4MTFFNzlGQUNEN0RDMTQ2OUU2ODQiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGQ0IzQTZGNzhBNDgxMUU3OUZBQ0Q3REMxNDY5RTY4NCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGQ0IzQTZGODhBNDgxMUU3OUZBQ0Q3REMxNDY5RTY4NCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PoBpp9UAACJVSURBVHja7F0JlBXVtT090MwCohJFAUdkcFYUBSQamdR2HpJv1MSf+NWfGH8SlZhozByNs0aNSowxmmjUSEyaoEZUjEmMiPMQRm1Awjw0SDP0v5vaJUXbXffUe/Vev+Hste4Sofr1q6pdp/bZ99xzK5oeHyOGjFDtRjuOqsjf48993ejpRmc3unB0cKM9f67CjSY3Nrixzo21bjS4sdqNlW6scmM+/y7ERjfWc2ywy0/U1mV04wzJAPJ+yo0+buzuxt5ubBf590o3urvRyY0aEr0m8nBURki/iWRuJJnXRcZK/r3wuP+48Z4bM934wI25disyj1aG1oEI3c+NfUny9ozg27uxE/+uX56+Cx6SOST7AjfmubGCD8hsN97mf9fYbTPSJ0E3N/bg2MaNnd0Y6MZQN3q38XfD22FXjuaY5ca/3HiLxF/Jh2MGpZLBSL+VFNnRjR3c6OXGAW6McmNkkZ3HbhwhkCNMdeMpN96kNKp340O+MYz0ZYYqam7IlMFIhUj0nvy3qhI4x45uHOPGp5kPQPI85MYTfBssd2NpuT4A1WV2rpAvR7pxOiUL3JWuTDRL+f7i/M5x42Q3PnLjb25McONlPgAbjPSlBbgmB7txrhsH0WnpXYZvufYcwCm8Fov5ANzvxjQjffFje0qXoySwFg/kA2AIJNzuHJB4QyRwg/7oxqNS4g5QKZJ+IPUsSD68FbcjTSySwEpc6MYyCWzERdTS2dyXbd3owf/24nlsm4PvD4l3BP+8nxvDKHvqmPwa6QsYBzBiIbKfEHmVpwWQeRYdECSB8MdhB2KyCNbgfMqFpXRPskUHSjEMWKd7ujGAUboTH4BPMVp3Tukc+3PgHA5x4wU3nud5lwwqSqAMYU9GdSRqY1P83IUcKzimu/Ei3Y+5bex84IHuw4dgOHMWBLDufBC2S+n3rKPen8joP6/g7n4GZQjFTPqevNkXUc50SOEGL6O7gWn+P7jxrBvvMnJvksK0+DBpVcnoP4hvunFM1jtSImXrTsHduceNeyUohVhqpM8vcANRFnC+GyfyNV+Z4WdtJNmXuPEXNx5z4x0JbLwG/luxoQPlTjdep5N4ndrx2mU6D9FIOfd7N65x430pBKuzDArOMHt6gRtnurFLltEd0fs+N/7ERHQR5UyxT9h8xLGEMuyfbtxI7T+OD0CPDIMN3q5nu7G/Gw9K4PUXXZlDsZC+ipr9NDcOzfCmAahknOTGZCZnbzBilSo2MsHGeIW6/Hdu7CWBV39kBp/ZkfcAQedwN35OGWikTxGDGF1Ola3rS5JgDsk+nZHvFSlPzOaAlJtG8g7mG6BXws9ClenpzB3wtvy1FInFWcikR2J2LC/sqRl+xmsk+DO8MYvFEOIFDtihLzFqD+FbIAng8R9I+YRk9x+S3RxF2ZK+L3X7VySzkl4kozOoOZ+grDG0DETn2yWwJqH3McdxQMK3KiTPeRKUZH/XjSlG+mTaHXLma258IYOfX0AJc5sbTzOhM+iwihLlEQnKN84l+XdI8BnIES6UwOZdYKT3AxMu8E8vkS3T4kmcGLxW73DjSQksx03G44yAupuHmewj8l9OCdRR+fOwSTFh9pCRPh7wlb/O6JK0VgZlAddL4B/Xm5RJBXB9MAH1GwmqMJHofkMCy9iHbkxyTd7EAFEEkx2jJVlBFch9pwQzp0jEVhpXU8c65kf1NAXOpLHQ1ROEZhrpWwfssu/wQiYB1oP+yo3HJSgZMOQWaE2CpYezGGC+KIHT0xLe5dvBSN8ChlAvnpTgZ2A5PkG9WGdczDtm8e2KmV7MnYyMSB48GLCG75VgNthIH0EVE51LJVlVJCzIuyWwIRcZ/9oUk/i2/RyJX0H5A9vz34X+5fNNehQ9He3GZaLvOABdOceN77nxgPGtYIC37s0cRYV8kh4RHpbkeDcOU/4MklPUcl8rQZ2MwaDDxLFhI4CqiPGxQmrrNuWL9Hj9HefGFRLUwFcofgYuwE1MWBfYXTQkIHwVc8WLJVhUI5RdN7h/eyofpK9khP+WBEvQNMAX/KEE7sxyu4uGBITHJOdnJZhXGBT5F9QGoU1jx3yQ/khG+CHK41FG8APKGptoMiQhPNZXYC4BrmD/Fo7AovfKXJMeDZXgwx+uPP4fTFj/bHfQkJDwqMrFfM+lrRA+xEG5JD3aScCl+bTyeNS5XyVBrbfBkITwKGPBohiUsgzwHZ4r0qMs9f8kKFPV4A1+4al2Bw0ZRPhTqOEHK35iTi5I35MR/vPK41+XYFr7X3YHDQnRnpKmedLaGmCQXJ826eHUXCnBelaNLYlipvOM8IYMAO7CpfmmBF3tfMAyyVvceCBt0oPAZ4iuuxgiPBYcvGT3z5AQNSQ8FMXeiuNRM3SDoPtFbd3qyhS/CGZZvyS6BcbT+YSahjdkQvgzEhAeZc5ogXK/I/zKNBPZHZmI7qc4FoVJ8OHNpTEkRQcmrSD8AMXxiPCoDfq1I/zyqC7KFl1I+OPF3z4OT93PJFiHaTAkAZYrYlOJS5VJK/oZBWUstXUrmicD2QBVk1hEfIn4W+st5VP3mN0/QwaERy0NXJp9Fcd/QA1/byhp0iQ95MxFCsKvl2BxAdaxrrZ7aEiA9pEIryF8PQl/N5LWlg7IhvTY6eNU0ZUJT5VgAch8u4eGBEC1ZFhaoJl4ep+Ev8sRvqG1g7IhPV43X1JEeSw2+L4EnrzBkITwZyYg/Fxq+HviCJ8N6RHdzxJ/9wJ0AYZTM0Vs/1JDslwRKuJyJeHnMF+Ehvd2Uc6E9DXUWL7aeFhED0vQ39AIb0jKr/EJCQ+XZpnmF2RCemgs2JO+3vDYpgYr59fafTQoAU6hSBE+/D6K4+HS3MIIv0z7S5KSHn3hvyz+mTBsy46m/bau1ZCE8LXU8Psrjp9PDT8hOvGUNulRQIZ6h76e49A09T7KGoNBA9iSJ5LwByiOx4ZvoUuTuLNdEtL3ZZTfxXMcdqV4yGSNQYlwEfdlCSI8aml+IRlu/aMlPVamoMhnd/GXDKPz2Ct2Lw0KwO4OXRpN3VY9NfydksVeV1rSI8qfK8HuIHG4V4KGqhvsfhoUER6EH68kfJi03i1Zbu6mIX03Jhh7SfxEFFrtoa3bXLufBgXvTkoQ4THTig3dfinBXr+Sa9JD0pztITx8ePQyn2730+ABfPjjSXiNhoekwc4y6GG6OK0nLg6QM2i2OsBD+BlSBN1qDW2O9iQ8ktYDFccviEia1HYp95EeM2KneI6BS/NbCdYgGgxxhD+OhD9YcXzY1vGuNCSNlvRwaVBq4Nv/aTa1vO0EYojj2fEJCI+aLZQWYA+xFbn4Mq1hb0qbOC2PL4T9WWfZfTXEBM9ww7aDFMfDh7+VieuKXD2BrWE0RxzQRwTbMJpFaWiN8GHxmEbDz2PSemeuCB9H+q7U891jfrZRgn41b9q9NbQAKIQTMiB8qklrEtKPULyKQHasd7WyYUNLvAr3IzgoIeEX5ePLtYRjxL8eEa08nrf7a2gGLAAZm0DDw6W5PV+Eb4306EW5pyeBRSnnq2JFZYatgYmnMST8oYrjFzFhhYZfnK8vWd1KlN/N83MoKpto99jQLMIfK0F5sKZZANZc3ELSZ6fhJ47tLls2dIapskRq6xrjko0oUASEmvk9PL8GfSjNpjSECPcU00Z4+PC3UsdnS3hw9cduvMABC/0M7kqiIv12EtTLx1mZ71DPWwJrCAEfHnuKDRF/6fmHJDxGtjOt6FaMvcnOIW8xsAjlajf+xxG/h4/0+PN+kddEa3jSjZftPhtIcFTgwpbUzLQuoJz5RQqEb08phWrNjs3+bVcJNgUZ5CM9istOky1bELaGV/i0GsobldTw2l0jQXiUFdxFPZ8t0EN1OHOJloCoP9hF+3ZxpEeEH8EPi3s1Wb28AfIXtuQVCTQ8CH9nigET+ec6zzF4GHeOIz36yneO+YCNbjwhQRmxoXyByDmaSavGpUG5+e0k/MIUvwcI7ytyHCktdO6ojOij/VrQRs1JP0WC2TND+Ub40ZQ0w5SED12ahSl/F8wRYQvWNTHH7CYtNDIISY/2fJ/xSBv4njNJfkN5avixJPxQxfGLSfibJTcTT+DjJPFb5zs4XV/VEulhVY6S+E0VZkgeZ80MBQckreMpaXy2JBJVuDSYfMpl8dg0xRsEPn6flkjfg6M14BUyWWw5YLliHAk/VEn4O0n6XPMFZQwfeY5B/c/g5qRH6IdNGVcTj4ThObHVUeWI0KXRSJqFJPztOdDwLWGTBJOlcRt9oI5sQHPSb8MMN24WdgO1k+n58tLwY0j4wxXHI8Jj0gnW5II8fk9s+BG3Prv9Zl3f7MR2ksBrrfbIm2XGg7IBuHAMJc0RiuOXkPCI8PnebQZ1YHM8x3R2yWxNlPTYDvOQGK2G6P6uWBlxOREeTh5cmhGK45eR7LfmOcKHmCf+OnxsFbVzlPTd+JetAdn384qEwVAakiaM8MOVhEfCenOeNPwnUVv3kfg374NXv0f0JLsoTgydyxqNEyWP0ST8MPG7NEup32+SPK14ioGvPz0K0AZFSd/D8wOrqZmslLi0EU48DRP/5nkgOVyaGwuA8MB7Hl2P1YADo/qtl+cDUeOQyaRUbwm6o/Xn/2M7noclnQo7Q7oYJfrSApAc61lvK6B7+R7zzn4xsq1blPS9PR+ICL8m4ZdAbfUFEiwu2DZysfblxXrNeFYwQNJ6RULC/1wKqwYLjlG9N19BmXFt3Xo8AX08B6MXeJJmTqjUPNeNL8rWW24iWcZOJljVMti41uaoihBe49IsiUT4+gI7lyXin/2FX79NGPbjFoGD7DMT6vl9ovqpBSD6/1T863ANuQPe8COZtI5UHI9uY1j8casUYpVt4OD4qgVQQdw9JP3OMQdCy89ISHq8OXyrr5A0wdvta/zLOypJdGj4TysJj6T1Zsn/xFMS+OaROlFtbL4AcdbUMr7KkpAefq2vsg6/82gJdpboZzzMu4b/FonvsyWXkfDYyW9BgZ/Xes+/w5rfXGbss6ZWS3JLCuWebymOq2CkuVv8fXYM6SBcADJC/LbkUkoaEL4Y1kT76sI6M9JX+k4cr4zlCX/5Kl6svyiPP5pasb9xMqfAdb6chK9SJIbYB/gWKZ4mAOBdg4f0WDfijfTrJLOd3F5y4yo3nlIeD43/IzFXJ1fAG/UKpaQB4ScwENUX0Tku96iSkPTeSA+dtCbDL4H1i9+WoOuUBifzQRloHE0NFST6FcqkdSnzLNiS7xfZuTZ4ckl0POuuIT0sy2xqbkD8r7nxd+Xx2Ff0+6bxU0EVpcx4ShsfVpDwkDTF2OYFwTnOtoRNi1nZCh/pN0n2u4xg44b/TUB8RHzYY32MtxmjkoRHhB+lOH5lJGl9v0jPuVGhSrpqIv1GSWdrHbQB/GoCqQONj0UJvY2/GQGSBi7NUUrC303CF3N7l/Xib/7UURPpmxjt0wCS26+78YwyUo1mQmURPxk+E9HwPpdmOSP8z6SwJ5400KiSdhrSpw1o/O9I0ARWA7yaUdy0u3FZHeEv5381hIeGR3nwghI5f98kakUYUTUOQJqAxEHR2V+Vx6PfCmp1zMePxwhKmqMV9xUzrfcyd6ovkfOvUDzoGzWkr1Q+GJkQ/zsJND7q8mFnDjBut0p42MPHKI6NEn5OiSXv1Ypkt8lH6CrFB2WKv7nxDWp9DbBDypUmdT5xo4czwmsID1vyVxLYkrNL7FpAr7f3HLNWQ/pKab3/dxqAjfkV0W/ycKYb10h8ZWg5Ef4IEn604vgGavgbSpDwACafOnuOWaUhfTt+WK6T24vc+KfyeGzIi7LkHcuY8BWM8FofHoWDsCWvk+L14X1A6XA3j7TBm26jj/Q1iqcnLeJju5SpimMhucbxJu5UpqQ/UrbMtPruIaLbBBK+voSvCUqHe3qkDcoUNvkuGDRS1zx96Rf4qp6ifLWPY8TfpQyT1stJeF++tZJJK3z4D0r8uqCuZnuPvFukIT1eGdvm8YujqdRVSuID2OTrxjJKbodFklYf4fEqv48a/oMyuDadJb7VPEi/WCNvsJC2V56//HMk/t+Ux4fVmXuW+E09PKLhffcNE0+/lqAR0+wyCQi+a7ImGunj2vUhyveV9CeoNMSHZp2mPP7zJESpVmcO5fmNUdwLSJr7Sfhy2h/M5zKuZqTf7N7M9uikPduA9CHxYWe+qjweG+j+QEqrSK0iEuHHKY7HKxw+/PVlRfiJYysoxX2RfrHU1m0m/RzPRe8juZmV1QASB3bmK8rjT5dgprFXiRB+KN94YxXHr2XSel0ZSZqonu+muD7LQh3k823beRKEXAOuzsWim7mtYnJ7hyeTLwZEJ558QSeceLpWynOfX9zrHTzHfLz0FRfTV1JazYS2LQFX51Jlcovvi4ZSqMcv1gmssLRglFKr/qqMCQ9ght5nXW9y0mZTSHpfi48OBSIXpkhQezNVeTyIf6MUn48PSXOZkvCrmLReJ6VVPJYUqMCNW1uNOvuP++eD9Cs8H9iVyWxlAZzc0xKUJb+YQONjze2uRXLzDmWEHyv+Mlm4NL+RwIefJeWNXT3yBoR/K0p66MG4Rjk9eTM6FMgJoq3ItxMkt+dIcdiZQ/g9jxVdacEDJPx7YvAlsQgK70RJv8zzaoSeP6yASA9gAcolbryhPP48SqNCtDMrSHhE+OPFbw83kPDXG+EFdiWcG99uOlj7OzNK+no6JHFrYUGWTgV2us9KYGdqiX8Wk73tCpDw40l4Hz6ihsd5/NsC/MfSxtcwGA2sPoySHnpnmsQvqq1RfHBbABNYaC8yXXEsNDL66mDN7bYF8v0PY4TXSJq1EZdmpnH9Y2BHcF/t1SqprdsQJT1mqmZ4dD2kDTaqal+AJ42I/03R+fhwQ1Crc0cBRHzMtKJacozCpcE9Qi3NNUb4TwBdH/p68p+tbHmQHivIUZNQ7dH1owooQraU3GLN7T+UEf80CWpT2srHhzFwKV0a38RfqOGvNZfmE2jPexgXNCB/32xOemA5k6KmmAg5vIBJD6BL8ndF30ntc278WPLfV+dgavhjRTfx9KAE9fAzjOOfwC4Kg2Va87wvJD0mqOokfjcHzVRvW2OSBGXGSe3MfO2IciA1/HHir4cH4X9Hl+Zd43eLJsAwRdB6X5pNwIakxwTV8xLf3xvHYj+pjgV+MSZLMKP5tvL4LzPy9s4T4U8Q/8RTAwl/XYLzKDfUMB+KaxKAVn//QWVlS6TfyGiyzpMEQoMWw+wmOqjB1XlHefyXJChL7pmjiHQw3ygnK1yaddTw1xjhY4Gy94GeN+arLcnC6A1YKvGb4eLmoSFosewK+AyJr9kKqJIa/0ZezLQ1PFwazcQTCB/68DbxFM/FweIvhHy6JWlY2czaeUzidwfHK2U3yW0vnLTQxJO+RHQLUXBuqNWBj98jpe8QTjwdp7hm4cTTT8QmnnwA2U9S5JjTW+JzZbMo82fx7zGE5KGY1qNOppZ+SUl8NJS6WbKvxz9EAlsSLo2m89aDlDTm0vgBGTrKk1+ivGZ+cz3fnPRNjDC+Ht/ouXJQkV0kPMxXK4mPVydKFtA0NlMf/0Am08eL34dfw6TVJI0OlQy6O3oSWOR1c1v7gChgk6HFXtw2JpjJHCCFOTsbhz9J4ONr7cwvSDDhlbQe/4CIS6OZeALhf2ZJqxpY2/FZj1xEycGj0soCqcoWdPB9Ck05lK/vYsOf6aJofe8LKFG0duZ+JPyJ4vfhQfiHJbAl3zQuq4E6m5M9QXfZZgOjtm69hvTCSOhbdjaSWrUYgUm4ixNoZzhA3xa/nRkSHjfE58OvI+GvNcInAqI75oq6eKTN83G5aWUrGvN18W9atZcUZuWlNrm9KIGG/iIlSLcYSTNedD78eiatPxWdnWrYgkG8xnHWL2ZfsaJsSRLSAxPFv2HCIdStxYgmJjoXK4lXQx0JV2ebVpJWjaRpjBD+HeNwRgbBcM8xKzYbFlwEnoT0rynIgOlf2Eadipj4k0hYjY8PDYkJrJsixD+Imv8ERWK/jknrT4zwGaGfBM1r464zovsf46J8HOmR/b7oSfgqqGOPKvKL+YQERWqaFoKI5Ocy+TyOEgkR3lfpBx/+IQmqOs2lyQxHib8XP1YB3i+eXQbjXseYxsdEVH9PtEcfyaclvkKz0PE4/3s1H2Qf/ptRvp/oJp5+z6TVCJ8ZMFGIxSI+b/71zde4hQkpTaQHUIeD2vSVnlc+VgAdJoXRIiRb4l+VQHogefWVK8AMeJRvhteNuxkDTuEQzzGzNt/DyLLATEgP/Iu61/cUokqxZwlcXBD/G5LOCiXU0jwiQWnBq8bbjNGdjs1enuOwau4vmg/0kR6TVI95NBKiPfotHiJt0904bcDHR7fkbJqgbqCkuYamgCFznKaQnPDkp7oovyoN0m9igvesxLcIwTLCr0rxlB37znkSz2dGhoQPXZo3jLNZAfNAnxP/bpKYaZ+o/VCNDp/jxj0Sv3mDMNEYKrnbdzbfxH+CUifJBFIjCf8jsZnWbNGehsHBHp6idHiKi/IL0yQ9biT6y7wo/t44iI6HltCFh8a/UpmENlLD/1hspjUNoMYGZd6+7mWI8H9N8sFaxwVOzl0SVGHGATbeCZL+6qO2BIj8fY82x1sQLs1PLcKnArhiX1fI5Q83X/faunm5IP166twXFDIHi3VHlthNQHEYPPy3W7k2fxBzadICiso+I0G9k28OBBN+ryT9BUn0N/z62ySYrIp7AlEFdzYlQSl143qUWv97ErQvb8cAgEBwUyYX39AiYE2eK0GZSEVMzoXo/qCL8vNzSXp8CVQnws3p5/nZWn6pSzx5QDFqfMxdoNoPjlU95cxS42oqQDA5Vfy7KK5jAM5ISiZ1WtAqBCW2WD0VV3ODenLsaH2sbJniLwU0kejzeO3WG09TxVkMlD7ZvZC51qpMfkkmpQNYZ4qld0s8x0ECXci3QqmhyQifOlDOAk/et8FCPfOrjKVzpvUySOyeVCQkR/ILdrV7aojB9ozyvoYDDTRUfiut913NGek/cGOC+PvCI/v+PDPxDnZvDa0Ai/BhdftaRqIm6g7xO4g5IT2AXf7g3fuWFSIh+SqjfqXdX0Mz/JcEC/B38hwHTx618i9n+wuzISHqxCdT3/uArmhYYL2v3WNDBJi9/5Ei7wubYf0ijV+abeRFQdaNdDN8gJNzfokmtobkgB+POQ/N/gDPUMcvLwTSA6hjvlz87QAhc87hq6yH3fOyBqomL6bk9WElo/zLaf3yNEgP7/4xJra+SRokKugHj+rFGrv3ZQk4NTA2YHBouuShRPsPEr8nWt5JDzQwq/ZtzQl0p8wZb/e/7NCViev54rexYUnCKLlb/IWObUJ6ADYmZms1baZ78vV2mZTGaiuDHx1JeHSQ8Dk1CJxY+oe1xYvS/iJpW4jPkfhzFcdC11/Ji9DOOFHS6EDCf010q+tQrYoy7ZzstZUL3xyvI2wOplnJ0oma7Twp3qZRBn+Ex2IQNMXqrzgeG6PdIlgNlSPkarIISe1NSi3WWYJ2eWfzz4bSAQIZ2iGitYpmIw9MdP5Sgp3RpdhIv5rExxPbqDge8gbNkC40qVMyQOtDlBfAi++nOB7uTLgr+qZcfrFcLuKGvLlTgqo5LPD1WZRdmNh2Yl7QYLwpWqD0HNY0ZuG1u7ncwzfCmlx/uVx3LkBCewNly2cVxIer8xUej59bYPwpOuzOewgd3ysB4X+ozAMLnvTADGbikC2nKol/IV+Pt4r1jikmjJTAjRsj/i4GIe4n4d/P15fMV4+at6nV4MljK0RfmTEiPVoFYkkeJiieND4VNJAbonsz5l5GJPg5rMuAbT07n182n42ZXo0kKSeK36nBhURLt92YCGHZ4X+MXwUHvJnRthyLhfoqfwYcQOnKN0U3p1O0pAem81W2hhpf8wrEahqUlMLygrVZbzwrGGCi6WxqeG2vIyzqnsifWdgWX7otWvC9TeLD1rxA9CuqLmbUx9T0NPHvd2vIHVAohm1wUF07TPTbq+Ke/YY/t6itvnxb9Z2cS6mD/YG+JbqKSxyDJWUDmfxgO/vlxr82kTMwGmBD7yL62ilU4N7C+7aoLU+gLZutfsiLAOL/QHSzsfi+2LgZbSLQGhyzvlOMh3lDLeXMSEm2HwFaIsKJe0QKoEdQW3cYxgXABNZaarxByp/bjslwL5IeGz7b5mW5A2pmMLuKfQj2T/izkxnd0fe/sRBOphDaaq8l8RfxlXlUAo04lGMPRhEsKzOHJz1AvhwvwQqn0zP4+QdpPvy9kE6qkHrJo1ckavExfX2K6KevAVibR/Aiow4brfeWGWczRi9GdLxNz5fkax4wk/5HyfOkUzGSHkDTV2xJP5typ1+Cn8XCBLR3xvQ3VnFhQutdS3YTAbJxVwYdrGdOuiP8el7zCZQ0BemwVTQ9PqYQvxceRrRrRgES9hvqmPDnG0l2XHi0c8aqrtXG6VaBkg/YwWfxrYm3bNJqV8y9TKS5gDdtfhr31tYVfaQPsYEyBXIH/Q0vEn3xEgB7cwdG/i8wiZpAF8H8/a2vE7ZDxSKeEbxmmSzmWUspg8KxhYV+0oW8PxQWBqNJJ6wuzOT+nyTf7KErx9nU/O8xGmka0JYysFQTM+KY99iZRkAm3Sk2Mo/CPltTi0VKFsOmaMuYFCGCwDI7Q/TWZghEr3049mWCVs8H4Fkpjw7EnfngH0Mpgw3M+mTxeW/w7fknBpOiQTHtBPhPCcoPIFFOoubvncHn7Clblq4dzM/FDDEK4tCGfFUJER0LeIZwINFHHVO2G+Ghm93jlJ8Ti/GiFNv2lxt4wV9gxMcM4VDJvBV46PMD8JKfksA5WkgXYo4U104qkCiodNyL+nwPBochKXz2AspMbDV6r+RhhZORfmtg79Db+Gq9gK9sRO8uWXzmYRzAUt7cqXx1r6bMwu9dWSDXoIKuCzqGoSQAE3oo0UAh2FgJ1iKkAeQ+cL9QKIaZ76Kf/CtUyzLpg9uPDs9JJECXFD63iYkaar9RH/Qy9f9rfBus5r9/xNGYo7dCNQmNatSOJPu2POeBjORH8NgqjjQaaK2glAHRf0vibyq4u5+BZVkKpA+xDTX+yRKUM+yc8psMN7whQvBNjP5v8kGYQwmwkATJ5gGATNmROvxTTDz3pyZvR2LX8GHoIul2iUNSj/Lvu6jb5xW0lClz0keTt9CdgC03UnLbOnADo+KaSNRfK1lsDyPBqrEOkdGZ51WV42tXRxkznW+zwtftJTQ5le1rGXu6vkG3Zx8+AFiU3isHv6+akqpnkV4v1MY8wmv2qsTvjF4SqC7hc1tPHY7xJN2ZvSXw6bHap5x75EOWwan6N0leVtWp1WVyntCl9/PP+9Dt2Z+aeZAkL6wq1oj+NnMORHR47DPK8YmvLsNzfp0DOh8W3zgJbD5Yf9sxGS6FZrKYZJvPqI7yAMxqTy5Xopc76UMg0XyL0e8GavJD+BCMYtIYJpHbFPi5wEmChRq6S5hnQNv0SZQvWKCzUQxlT/oo+TdS08IKgBd/NaN9fz4IxzAXqKazEvrh1W30XcMBsq9h3vIc/4tlk2s51kh2LpKRvgwQRsyw9n4OE+AHGO1rmAegUGsPyqP9KYtyjfmUZXg7zeTAgwrLdCWj+0q7hUb6NLCCIwq8BXqQ7DvI1p0cqvlgoPlRR/5bR0qlGtkyYxpG7UbZ4u2HEqWBhF4TifCrKFMWU6OvtVuTGSqamuztZygv/L8AAwCTD4p9L80GQwAAAABJRU5ErkJggg=="
        alt="">
      <div>你的发票申请已被受理！</div>
    </div>
  </div>
</template>
<script>
  import area_data from '../../assets/province/areaData'

  export default {
    name: "application",
    data() {
      return {
        matterGoList: false,
        matteSh: false,
        title: "开票须知：",
        msg: [
          // "1、支付金额满￥299，方可开具发票。默认开具增值税普通发票，类型为「信息技术服务」服务费。每月 20-25 日集中开具发票。",
          "请务必仔细核对信息，发票一经开具，非我司原因将无法重开。",
        ],
        taiTouName: "发票抬头",
        taiTou: "",
        taiTouText: "请输入开票公司名称",
        shuiHao: "",
        shuiHaoName: "公司税号",
        shuiHaoText: "请准确填写公司税号",
        jinE: "",
        jinEName: "发票金额",
        jinEText: "请准确填写开票金额，管理员将审核",
        pinzheng: "",
        pinzhengName: "付款凭证",
        pingzhengText: "点击上传微信付款凭证",
        person: "",
        personName: "收件人",
        personText: "请输入收件人名称",
        tel: "",
        telName: "联系方式",
        telText: "请输入联系电话",
        adressName: "收件地址",
        textareaName: "请填写详细地址，如门牌号码、楼层和房间号",
        textarea: "",
        complete: "下一步",
        all: area_data,
        pid: "",
        pro: "",
        cid: "",
        city: "",
        ccid: "",
        county: "",
        province: "",
        selectcity: "",
        district: "",
        alertContent: false,
        configInfo: false,
        sure: "确定",
        cancel: "取消",
        personalDis: false,

        ticketDis: true,
        pingzhengUrl: '',
        fileStatus: false,
        ticketHeaderGe: true,
        ticketHeaderGong: false,
        ticketListShuiHao: false,//税号个人隐藏,
        /**/
        images: '',
        logs: '',
        upImg: '',
        media_id: '',
      }
    },
    watch: {
      'alertContent'(val, old) {
        if (val == true) {
          document.querySelector('.content').style.overflow = 'hidden';
        } else {
          document.querySelector('.content').style.overflow = 'auto';
        }
      }
    },
    created() {
      this.pro = this.all.pro;
      this.pid = this.pro[0]['id'];
      this.prochange();
      this.pid = '0';
      this.cid = '001';
      this.ccid = '0001';
      this.prochange(this.cid, this.ccid);
    },
    mounted() {
      $("#taiTou").attr('disabled', true).next().css("position", "relative");
      this.taiTou = "个人";
      /*$("#taiTou");*/
      $("#taiTou").css("background-color", "#f0f1f5");
      this.CHheight();
      this.configBoxTopHei();
      /*todo
        * */
      var adverttitle = "信公商学院";
      var sharelink2 = "https://wx006d673ce5a4a44b.h5.xiaoe-tech.com/";//分享链接
      var shareDesc = "";//描述
      /**/
      this.$weixin.wxshare(adverttitle, shareDesc, sharelink2, this.$api.share.defaultImg, true);
      /**/

    },
    methods: {
      /**/
      onFileChange(e) {
        var images = {localId: [], serverId: []};
        var sesses = false;
        var i = 0, length = images.localId.length;
        var vm = this;

        function isWeiXin() {
          var ua = window.navigator.userAgent.toLowerCase();
          console.log(ua);
          //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143safari/601.1
          return (ua.match(/MicroMessenger/i) == 'micromessenger' ? true : false);
        }

        if (isWeiXin()) {
          console.log(" 是来自微信内置浏览器");
          ////
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              images.localId = res.localIds;
              //alert('已选择 ' + res.localIds.length + ' 张图片');
              if (images.localId.length === 0) {
                alert('请先使用 chooseImage 接口选择图片');
                return;
              }
              // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
              // localId 可以用于微信手机版图片显示（目前PC版不可用）;
              $('#pinzheng').attr('src', images.localId[0]);
              images.serverId = [];
              wx.uploadImage({
                localId: images.localId[i],
                isShowProgressTips: 1, // 默认为1，显示进度提示
                success: function (res) {
                  var media_id = res.serverId;
                  vm.pingzhengUrl = media_id;
                  sesses = true;
                  console.log(sesses);
                  vm.add(sesses);
                },
                fail: function (rest) {
                  vm.pingzhengText = "上传失败！";
                  $(".ticketFileTwo label span").css("color", "#ff6154");
                  vm.matteSh = false;
                  //console.log(err.message);
                  alert(JSON.stringify(rest));
                }
              });
            },
            fail: function (rest) {
              vm.pingzhengText = "图片获取失败！";
              $(".ticketFileTwo label span").css("color", "#ff6154");
              //vm.$toast("图片获取失败！");
            },
            cancel: function () {
              // 用户取消后执行的回调函数
            },
          });
        } else {
          console.log("不是来自微信内置浏览器");
          vm.$vux.toast.show({text: '请使用微信端登陆！', position: 'middle', type: 'text', width: 'auto', time: 2500});
        }
        /**/
        console.log('after resolved');
      },
      /**/
      add(sesses) {
        if (sesses == true) {
          this.fileStatus = true;
          this.pingzhengText = "上传成功！";
          this.matteSh = false;
          $(".ticketFileTwo label span").css("color", "#7fc76d");
          if (this.ticketHeaderGong === false) {
            //个人
            if (this.jinE.trim().length !== 0 && this.fileStatus === true) {
              var jin = parseFloat(this.jinE);
              if (jin > 0) {
                $(".completeColo").css("background-color", "#ffb148");
              } else {
                $(".completeColo").css("background-color", "#ffd59c");
              }
            }
          } else {
            //公司
            if (this.taiTou.trim().length !== 0 && this.shuiHao.trim().length !== 0 && this.jinE.trim().length !== 0 && this.fileStatus == true) {
              var jin = parseFloat(this.jinE);
              if (jin > 0) {
                $(".completeColo").css("background-color", "#ffb148");
              } else {
                $(".completeColo").css("background-color", "#ffd59c");
              }
            }
          }
        } else {
          this.pingzhengText = "上传失败！";
          $(".ticketFileTwo label span").css("color", "#ff6154");
          this.matteSh = false;
          console.log("message");
        }
      },
      /*************************/
      configCal() {
        this.ticketDis = true;
        this.personalDis = false;
        this.configInfo = false;
      },
      geRen(ele) {
        var el = ele.currentTarget;
        //console.log($(el), $(el).parent().children("div:last-child"));
        $(el).css("color", "#ffb148");
        $(el).parent().children("div:last-child").css("color", "#323232");
        this.ticketHeaderGe = true;
        this.ticketHeaderGong = false;
        this.ticketListShuiHao = false;//税号个人隐藏
        $("#taiTou").attr('disabled', true).next().css("position", "relative");
        this.taiTou = "个人";
        this.shuiHao = "";
        /*$("#taiTou");*/
        $("#taiTou").css("background-color", "#f0f1f5");
        if (this.jinE.trim().length !== 0 && this.fileStatus === true) {
          let jin = parseFloat(this.jinE);
          if (jin > 0) {
            $(".completeColo").css("background-color", "#ffb148");
          } else {
            $(".completeColo").css("background-color", "#ffd59c");
          }
        }
      },
      geGong(ele) {
        var el = ele.currentTarget;
        //console.log($(el), $(el).parent().children("div:first-child"));
        $(el).css("color", "#ffb148");
        $(el).parent().children("div:first-child").css("color", "#323232");
        this.ticketHeaderGe = false;
        this.ticketHeaderGong = true;
        this.ticketListShuiHao = true;//税号个人隐藏
        //
        $("#taiTou").attr('disabled', false).next().css("position", "absolute");
        this.taiTou = "";
        $("#taiTou").css("background-color", "#fff");
        /* $("#taiTou");*/
        if (this.taiTou.trim().length !== 0 && this.shuiHao.trim().length !== 0 && this.jinE.trim().length !== 0 && this.fileStatus === true) {
          let jin = parseFloat(this.jinE);
          if (jin > 0) {
            $(".completeColo").css("background-color", "#ffb148");
          } else {
            $(".completeColo").css("background-color", "#ffd59c");
          }
        }
        //
      },
      inputFocus(ele) {
        var el = ele.currentTarget;
        console.log($(el).offset().top);
        var id = $(el)[0].id;
        this.$const.androidTop(id);
      },
      inpBlur(ele) {
        var el = ele.currentTarget;
        if (this.person.trim().length !== 0 && this.tel.trim().length !== 0 && this.textarea.trim().length !== 0 && this.pid != '0' &&
          this.cid != '001' && this.ccid != '0001') {
          $(".completeGat").css("background-color", "#ffb148");
          $(".completeColo").css("background-color", "#ffb148");
        } else {
          $(".completeGat").css("background-color", "#ffd59c");
          $(".completeColo").css("background-color", "#ffd59c");
          console.log("4332443mei", this.configInfo);
        }
        console.log("4332443", this.configInfo);
      },
      inputBlur(ele) {
        //var el = ele.currentTarget;
        //let id = $(el).prev()[0].id;
        if (this.ticketListShuiHao == false) {
          if (this.jinE.trim().length !== 0 && this.fileStatus == true) {
            let jin = parseFloat(this.jinE);
            if (jin > 0) {
              $(".completeColo").css("background-color", "#ffb148");
            } else {
              $(".completeColo").css("background-color", "#ffd59c");
            }
          }
        } else {
          if (this.taiTou.trim().length !== 0 && this.shuiHao.trim().length !== 0 && this.jinE.trim().length !== 0 && this.fileStatus == true) {
            let jin = parseFloat(this.jinE);
            if (jin > 0) {
              $(".completeColo").css("background-color", "#ffb148");
            } else {
              $(".completeColo").css("background-color", "#ffd59c");
            }
          }
        }
        /**/
        /*if (id == "taiTou") {
        } else if (id == "shuiHao") {
          $(".completeColo").css("background-color", "#ffd59c");
        } else if (id == "jinE") {

        } else if (id == "person") {

        } else if (id == "tel") {

          $(".completeGat").css("background-color", "#ffd59c");
        } else {
          console.log("未定义");
          $(".completeGat").css("background-color", "#ffd59c");
        }*/
      },
      clock(ele) {
        var el = ele.currentTarget;
        $(el).hide();
        /*$(el).prev()[0].value = "";
        $(el).prev()[0]._value = "";*/
        $(el).prev().focus();
        console.log($(el).prev());
        $(".completeColo").css("background-color", "#ffd59c");
        let id = $(el).prev()[0].id;
        if (id == "taiTou") {
          this.taiTou = '';
        } else if (id == "shuiHao") {
          this.shuiHao = "";
        } else if (id == "jinE") {
          this.jinE = "";
        } else if (id == "person") {
          this.person = "";
          $(".completeGat").css("background-color", "#ffd59c");
        } else if (id == "tel") {
          this.tel = "";
          $(".completeGat").css("background-color", "#ffd59c");
        } else {
          console.log("未定义");
          $(".completeGat").css("background-color", "#ffd59c");
        }
      },
      /**/
      configBoxTopHei() {
        let hei = document.body.clientHeight;
        let heifoot = $(".partButton").height();
        let topHei = (hei - heifoot) + "px";
        console.log(hei, "23423", heifoot, topHei);
        document.querySelector(".configBoxTop").style.height = topHei;
      },
      completeNext() {
        if (this.ticketListShuiHao == false) {
          if (this.jinE.trim().length !== 0 && this.fileStatus == true) {
            let jin = parseFloat(this.jinE);
            if (jin > 0) {
              $(".completeColo").css("background-color", "#ffb148");
              this.ticketDis = false;
              this.personalDis = true;
            } else {
            }
          }
        } else {
          if (this.taiTou.trim().length !== 0 && this.shuiHao.trim().length !== 0 && this.jinE.trim().length !== 0 && this.fileStatus == true) {
            let jin = parseFloat(this.jinE);
            if (jin > 0) {
              this.ticketDis = false;
              this.personalDis = true;
            } else {

            }
          }
        }
      },
      CHheight() {
        var Beight = document.body.clientHeight;
        var Feight = document.querySelector(".complete").clientHeight;
        var msg = document.querySelector(".msg").clientHeight;
        var msgBottom = document.querySelector(".content-middle").clientHeight;
        var foo = document.querySelector(".application-foo").clientHeight;
        var ghg = (Beight - Feight - msg - msgBottom - foo) + "px";
        document.querySelector(".content").style.height = ghg;
        console.log(Beight, Feight, msg, msgBottom, ghg);
      },
      /**/
      goApplicationImg() {
        this.$router.push({path: '/applicationImg', query: Object.assign({}, this.$route.query)});
      },
      //添加发票
      addInvoice() {
        let params = {
          /*invoiceId: '',//发票id*/
          weixinId: this.$route.query.weixinId,//微信id
          invoiceHeader: this.taiTou,//发票抬头
          companyTax: this.shuiHao,//公司税号
          invoiceMoney: this.jinE,//发票金额
          invoiceVoucher: this.pingzhengUrl,//付款凭证
          invoiceUserName: this.person,//收件人姓名
          telephone: this.tel,//收件人电话
          addressDetails: this.province + this.selectcity + this.district + this.textarea //详细地址
        }
        ///
        this.$axios.invoice.addInvoice(params).then(res => {
          console.log(res);
          if (res.data.returnCode == 1) {
            this.matterGoList = true;
            setTimeout(() => {
              this.matterGoList = false;
              this.$router.push({path: '/applicationList', query: Object.assign({}, this.$route.query)});
            }, 1500)
          } else {

          }
        }).catch((err) => {

        })
      },
      prochange: function (cityId, districtId) {
        this.city = this.all.city[this.pid];
        this.cid = cityId || this.city[0]['id'];
        this.county = this.all.county[this.cid];
        if (this.county.length > 0) {
          this.ccid = this.county[0]['id'];
        }
        this.$nextTick(() => {
          this.province = $(".pro option:selected").text();
          this.citychange(districtId);
          console.log(this.pid, this.province)
        });
      },
      citychange: function (districtId) {
        this.county = this.all.county[this.cid];
        if (!districtId) {
          if (this.county.length > 0) {
            this.ccid = this.county[0]['id'];
          }
        } else {
          if (this.county.length > 0) {
            this.ccid = districtId;
          }
        }
        this.selectcity = $(".city option:selected").text();
        this.$nextTick(() => {
          this.districtChange();
          console.log(this.cid, this.selectcity)
        })
      },
      districtChange: function () {
        this.district = $(".county option:selected").text();
        console.log(this.ccid, this.district)
      },
      completeM() {
        console.log(this.configInfo);
        if (this.person.trim().length !== 0 && this.tel.trim().length !== 0 && this.textarea.trim().length !== 0 && this.pid != '0' &&
          this.cid != '001' && this.ccid != '0001') {
          $(".completeGat").css("background-color", "#ffb148");
          this.configInfo = true;
        } else {
          this.configInfo = false;
        }
      }
    }
  }
</script>

<style scoped>
  input, textarea {
    -webkit-appearance: none;
  }
  #application {
    width: 100%;
    height: 100%;
    background-color: white;
  }
  #application .instructions {
    height: auto;
    width: 100%;
    box-sizing: border-box;
  }
  .title {
    padding: 10px;
    box-sizing: border-box;
  }
  #application .msg {
    padding: 0 12px 15px 12px;
    list-style: none;
    box-sizing: border-box;
  }
  #application .msg li {
    font-size: 14px;
    color: #8d8d8d;
    text-align: justify;
    line-height: 18px;
  }
  /**/
  #application .application-foo {
    height: 7.5px;
    width: 100%;
    background-color: #f0f1f5;
  }
  /**/
  #application .ticket {
    box-sizing: border-box;
    /*padding-top: 15px;*/
  }
  #application .ticketHead {
    width: 100%;
    height: 60px;
    font-size: 0;
    padding: 0 12px;
    box-sizing: border-box;
    margin-bottom: 15px;
    display: table;
  }
  #application .ticketHead .ticketHeader {
    width: 100%;
    height: 60px;
    box-sizing: border-box;
    border-bottom: 0.5px solid #e3e3e3;
  }
  #application .ticketHead .ticketHeader > div {
    display: table-cell;
    width: 33.33%;
    float: left;
    height: 60px;
    font-size: 15px;
    line-height: 60px;
    text-align: center;
    position: relative;
  }
  #application .ticketHead .ticketHeader > div:last-child {
    text-align: left;
    box-sizing: border-box;
    padding-left: 3.33%;
    color: #323232;
  }
  #application .ticketHead .ticketHeader > div:first-child {
    text-align: right;
    box-sizing: border-box;
    padding-right: 3.33%;
    color: #ffb048;
  }
  #application .ticketHeader .ticketHeadGe, #application .ticketHeader .ticketHeadGong {
    border-top: 2px solid #ffb048;
    width: 55px;
    font-size: 0;
    border-radius: 8px;
  }
  #application .ticketHeader .ticketHeadGe {
    position: absolute;
    bottom: 0.5px;
    right: 0;
  }
  #application .ticketHeader .ticketHeadGong {
    position: absolute;
    bottom: 0.5px;
    left: 0;
  }
  #application .ticketList {
    width: 100%;
    height: 40px;
    padding: 0 12px 0 12px;
    box-sizing: border-box;
    margin-bottom: 12px;
  }
  #application .ticketList label {
    width: 18%;
    height: 100%;
    float: left;
    line-height: 40px;
    text-align: left;
    font-size: 15px;
    color: #323232;
  }
  /* label span{
       display: inline-block;
       width: 25%;
       height: 50%;
       background: #ffb048;
       margin-bottom: -10%;
   }*/
  .ticketList div {
    width: 80%;
    height: 100%;
    float: right;
    position: relative;
  }
  .ticketList input {
    width: 100%;
    height: 40px;
    border: 1px solid #e3e3e3;
    box-sizing: border-box;
    padding-left: 15px;
    border-radius: 2px;
    font-size: 15px;
    color: #8d8d8d;
  }
  #application .ticketFile {
    width: 100%;
    padding: 0 12px;
    height: 150px;
    box-sizing: border-box;
  }
  #application .ticketFileOne {
    display: inline-block;
    font-size: 15px;
    color: #323232;
    width: 18%;
    float: left;
    box-sizing: border-box;
    padding-top: 10px;
  }
  #application .ticketFilePin {
    border: 0;
    background-color: #ffb148;
    color: white;
    height: 22.5px;
    width: 60px;
    margin-top: 3px;
    border-radius: 2px;
    font-size: 12px;
  }
  #application .ticketFileTwo {
    display: inline-block;
    border: 1px solid #e3e3e3;
    height: 135px;
    width: 80%;
    float: right;
    border-radius: 2px;
    position: relative;
  }
  #application .ticketFileTwo label {
    width: 100%;
    height: 100%;
    display: inline-block;
    box-sizing: border-box;
    padding: 10px 0 0 15px;
    font-size: 15px;
    color: #8d8d8d;
  }
  #application .ticketFileTwo img {
    height: 40px;
    position: absolute;
    top: 45%;
    left: 50%;
    -webkit-transform: translateX(-50%);
  }
  #application .personal {
    padding: 15px 0 15px 0;
  }
  #application .areabox {
    height: 40px;
    box-sizing: border-box;
    display: table;
    width: 80%;
    border: 0.5px solid #e3e3e3;
    padding: 0 10px 0 0;
  }
  #application .areabox select {
    display: table-cell;
    width: 33%;
    float: left;
    height: 40px;
    border: none;
    outline: none;
    background-color: white;
    color: #8d8d8d;
    box-sizing: border-box;
    font-size: 15px;
    padding: 0 0 0 10px;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/toTDSelect.png") no-repeat right center;
    /*//background-position-x: 50%;*/
    background-size: 18px;
    border-radius: 0;
  }
  #application .areabox .county {
    width: 34%;
  }
  .textarea {
    font-family: PingFangSC-Regular, sans-serif;
    display: block;
    color: #8d8d8d;
    font-size: 15px;
    width: 80%;
    height: 110px;
    border-radius: 2px;
    margin-left: 20%;
    resize: none;
    border: 1px solid #e3e3e3;
    box-sizing: border-box;
    padding: 10px 10px;
    outline: none;
  }
  /**/
  #application .matteShow {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.5);
    overflow: hidden;
  }
  .snake-circle {
    height: 14px;
    width: 14px;
    -webkit-animation: snake-rotate 0.8s infinite linear;
    animation: snake-rotate 0.8s infinite linear;
    border: 2px solid transparent;
    border-radius: 50%;
    border-top-color: rgb(252, 199, 127);
    border-left-color: rgb(252, 199, 127);
    border-bottom-color: rgb(252, 199, 127);
    margin: auto;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  @keyframes snake-rotate {
    0% {
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  .complete {
    width: 100%;
    height: 50px;
    background: #ffd59c; /*#ffb148*/
    line-height: 50px;
    text-align: center;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 18px;
    color: #fff;
    font-family: PingFangSC-Medium, sans-serif;
  }
  .content {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
  }
  .alertBox {
    position: absolute;
    left: 0;
    top: 0;
    width: 80%;
    height: 80%;
    background: #fff;
    z-index: 999;
    bottom: 0;
    right: 0;
    margin: auto;
  }
  .shadow {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .45);
    z-index: 888;
  }
  b {
    width: 15px;
    height: 15px;
    color: #fff;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    background-image: url("https://oss.in-hope.cn/xiaoan/h5_static/personal/close.png");
    background-size: contain;
  }
  /**/
  #application .configBox {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1000;
    background: #f0f1f5;
  }
  #application .configBoxTop {
    box-sizing: border-box;
    padding: 15px 12px;
  }
  #application .infoTo-foo {
    border-bottom: 1px dashed #8d8d8d;
  }
  #application .configBoxTopCont {
    width: 100%;
    height: 100%;
    background-color: white;
    box-sizing: border-box;
    padding: 17.5px 12px 0 12px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  #application .configBoxTopCont .partFirst {
    /*height: 70%;
    width: 100%;*/
    font-size: 15px;
    color: #323232;
  }
  #application .configBoxTopCont .partFirst .infoList {
    margin-bottom: 20px;
  }
  #application .configBoxTopCont .infoCuter {
    display: inline-block;
    /*float: right;*/
    font-size: 15px;
  }
  #application .configBoxTopCont .infoImg {
    margin-bottom: 20px;
    height: 300px;
  }
  #application .configBoxTopCont .infoToImg {
    display: inline-block;
    float: right;
  }
  #application .infoToImg img {
    max-height: 300px;
    width: 250px;
  }
  #application .partSecond {
    font-size: 15px;
    color: #323232;
    box-sizing: border-box;
    padding: 22.5px 0 0 0;
  }
  #application .partSecond .infoListT {
    /*margin-bottom: 15px;*/
    height: 40px;
    width: 100%;
  }
  #application .partSecond .infoList:last-child {
    margin-bottom: 0;
  }
  #application .infoListT label {
    display: inline-block;
    width: 20%;
    height: 40px;
    float: left;
  }
  #application .infoCuterLeft {
    display: inline-block;
    font-size: 15px;
    width: 80%;
    float: left;
    box-sizing: border-box;
    padding-left: 8px;
  }
  #application .partButton {
    width: 100%;
    height: 50px;
    position: absolute;
    left: 0;
    bottom: 0;
    background: #ffb048;
    color: #fff;
    font-size: 0;
  }
  .partButton button {
    width: 50%;
    height: 100%;
    text-align: center;
    line-height: 50px;
    box-sizing: border-box;
    float: left;
    font-size: 18px;
    border: none;
    background-color: white;
    color: #ffb048;
  }
  .partButton button + button {
    background: #ffb048;
    color: #ffffff;
  }
  #application .matter-goList {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 2000;
    background-color: white;
  }
  #application .matter-goList img {
    height: 75px;
    position: absolute;
    left: 50%;
    top: 27%;
    transform: translateX(-50%);
    /*margin: 0 auto;*/
  }
  #application .matter-goList div {
    font-size: 15px;
    color: #323232;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 42%;
  }
  /**/
  /**/
  /*推荐阅读*/
  #application .content-middle {
    /*padding: 15px 0;*/
    box-sizing: border-box;
    height: 44px;
    line-height: 44px;
    font-size: 15px;
  }
  #application .testingEnd-content-middle-item {
    text-align: center;
    color: #ffb148;
  }
  #application .testingEnd-content-middle-text {
    padding: 0 24px;
  }
  #application .testingEnd-content-middle1, #application .testingEnd-content-middle2 {
    width: 60px;
    height: 1px;
    display: inline-block;
    border-bottom: 0.5px solid #ffb148;
    position: relative;
    top: -4.5px;
  }
  #application .testingEnd-content-middle1 > div {
    height: 3px;
    width: 3px;
    background-color: #ffb148;
    position: absolute;
    border-radius: 50%;
    right: 0;
    top: 0;
  }
  #application .testingEnd-content-middle2 > div {
    height: 3px;
    width: 3px;
    background-color: #ffb148;
    position: absolute;
    border-radius: 50%;
    left: 0;
    top: 0;
  }
</style>
