<!--
 * @Author: bert
 * @Date: 2022-01-17 19:30:12
 * @LastEditTime: 2022-01-20 18:21:49
 * @LastEditors: bert
 * @Description: 排行榜
 * @FilePath: /guTengBao/src/views/ranking/index.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->
<template>
  <div class="ranking">
    <h3>古腾堡贡献排行榜<span>(数据更新时间 {{ info.day }} )</span></h3>
    <div class="flex">
      <RankList :rankingData="info.list.read" title="查看" remarks="被查看总量"/>
      <RankList :rankingData="info.list.like" title="点赞" remarks="被点赞总量"/>
      <RankList :rankingData="info.list.download" title="下载" remarks="被下载总量"/>
      <RankList :rankingData="info.list.upload" title="上传" remarks="上传总量"/>
    </div>
  </div>
</template>

<script>
import { rank } from '@/api/index'
import RankList from './modules/List'
export default {
  name: 'Ranking',

  components: {
    RankList
  },

  data () {
    return {
      info: {
        list: {}
      }
    }
  },

  created () {
    this.getData()
  },

  methods: {
    getData () {
      rank().then(res => {
        console.log(res)
        this.info = res.result || {}
      })
    }
  }
}
</script>

<style lang="less" scoped>
.ranking {
  h3 {
    color: #c47e51;
    font-size: 28px;
    font-weight: 600;
    span {
      color: rgba(0, 0, 0, .65);
      font-weight: normal;
      font-size: 14px;
      margin-left: 20px;
    }
  }
  padding: 30px;
  .flex {
    display: flex;
    >div {
      flex: 1;
      margin-right: 3%;
      border: 1px solid #ccc;
      background-color: #fff;
    }
    >div:last-child {
      margin-right: 0;
    }
  }
}
</style>
