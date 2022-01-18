<!--
 * @Author: bert
 * @Date: 2022-01-17 19:48:10
 * @LastEditTime: 2022-01-18 10:13:59
 * @LastEditors: bert
 * @Description: 排行榜列表
 * @FilePath: /guTengBao/src/views/ranking/modules/List.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->
<template>
  <div>
    <h5>{{ title }}排名 Top20</h5>
    <div>
      <div class="flex">
        <span>排名</span>
        <span>用户名</span>
        <span>被{{ title }}总量</span>
      </div>

      <div :class="['flex', item.rank > 3 ? 'greater' : 'three']" v-for="item in rankingData" :key="item.rank">
        <span><i>{{ item.rank }}</i></span>
        <span>{{ item.uname }}</span>
        <span>{{ item.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'RankingList',

  components: {

  },

  props: {
    title: {
      type: String,
      default: ''
    },
    rankingData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data () {
    return {

    }
  },

  created () {

  },

  methods: {

  }
}
</script>

<style lang="less" scoped>
h5 {
  background-color: #e48c34;
  color: #fff;
  font-size: 26px;
  font-weight: 600;
  padding: 3px 10px;
}
.flex {
  display: flex;
  padding: 0 20px;
  >span {
    // flex: 1;
    text-align: center;
    margin-bottom: 6px;
    font-size: 18px;
    i {
      font-style: normal;
      display: inline-block;
      width: 24px;
      height: 24px;
      line-height: 24px;
      border-radius: 50%;
    }
  }
  >span:nth-child(1) {
    width: 36px;
  }
  >span:nth-child(2) {
    flex: 2;
  }
  >span:nth-child(3) {
    width: 90px;
  }
}
.greater {
  i {
    background-color: #f2f2f7;
  }
}
.three {
  i {
    background-color: #b28d58;
    color: #fff;
  }
}
.greater:last-child {
  margin-bottom: 10px;
}
</style>
