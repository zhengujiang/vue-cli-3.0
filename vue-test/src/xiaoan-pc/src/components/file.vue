<template>
  <div class="listContent">
    <el-collapse accordion @change="handleChangeM()">
      <el-collapse-item>
        <template slot="title">
          <el-checkbox v-model="checkedM" @click="selectItem(this.checkedM, 'M')"></el-checkbox>
          默认收藏夹
        </template>
        <ul class="liList">
          <li v-for="(list, index) in listArr" @click="linkTo(list.refId, list.type)">
            <div class="liTitle">{{ list.title }}</div>
            <div>
                  <span class="liSort" style="background: #90b8f5" v-if="list.type == 'law'">
                    {{ list.type | listType }}
                  </span>
              <span class="liSort" style="background: #f2aa94" v-else-if="list.type == 'case'">
                    {{ list.type | listType }}
                  </span>
              <span class="liSort" style="background: #ffd092" v-else-if="list.type == 'qa'">
                    {{ list.type | listType }}
                  </span>
              <span class="liSort" style="background: #ffd092" v-else>
                    {{ list.type | listType }}
                  </span>
              <span class="liSplit">|</span>
              <span class="liTime">{{ list.time }}</span>
            </div>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
    <el-collapse accordion v-for="(list, index) in collectList" :key="index" @change="handleChange(list.id, index)">
      <el-collapse-item>
        <template slot="title">
          <el-checkbox v-model="list.checked" @click="selectItem(list.checked)"></el-checkbox>
          {{ list.title }}
        </template>
        <ul class="liList" v-if="!loadContent">
          <li v-for="(list, index) in listArr" @click="linkTo(list.refId, list.type)">
            <div class="liTitle">{{ list.title }}</div>
            <div>
                  <span class="liSort" style="background: #90b8f5" v-if="list.type == 'law'">
                    {{ list.type | listType }}
                  </span>
              <span class="liSort" style="background: #f2aa94" v-else-if="list.type == 'case'">
                    {{ list.type | listType }}
                  </span>
              <span class="liSort" style="background: #ffd092" v-else-if="list.type == 'qa'">
                    {{ list.type | listType }}
                  </span>
              <span class="liSort" style="background: #ffd092" v-else>
                    {{ list.type | listType }}
                  </span>
              <span class="liSplit">|</span>
              <span class="liTime">{{ list.time }}</span>
            </div>
          </li>
        </ul>
        <ul class="liList loading" v-else>
          <li v-if="listArr.length !== 0">
            <i class="el-icon-loading"></i>
          </li>
          <li v-if="listArr.length == 0">
            暂无收藏内容
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
