<!--
 * @Author: wangChao
 * @Date: 2021-06-05 11:50:25
 * @LastEditTime: 2021-06-17 14:40:06
 * @LastEditors: wangChao
 * @Description: pdf列表
 * @FilePath: /guTengBao/src/views/list/index.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->
<template>
  <div class="_list">
    <div class="_left_pdf">
      <div class="detaileds" v-for="(item, index) in indexList" :key="index">
        <div class="img_wap"><img :src="item.cover" alt="" @click="$router.push({name: 'details', query: {id: item.pid}})"></div>
        <h6>{{ item.title }}</h6>
        <div>
          <a-button type="primary" @click="down(item.pid, 'ppt', item.title)">下载PPT</a-button>
          <a-button type="primary" @click="down(item.pid, 'pdf', item.title)">下载PDF</a-button>
        </div>
      </div>
    </div>
    <div class="_right_type">
      <p >分类筛选</p>
      <div v-for="(item, index) in $store.getters.typelist" :key="index" :class="item.type === onSelect ? '_select' : ''" @click="onSelects(item)">{{ item.title }}</div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { typelist, index, download } from '@/api/index'
export default {
  name: 'List',
  data () {
    return {
      indexList: [],
      type: [],
      inptData: this.$store.getters.search,
      ite: {
        pdf: 'http://storage.360buyimg.com/yunying/%E4%BA%AC%E4%B8%9C%E9%87%91%E9%87%87%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C.pdf',
        ppt: 'http://storage.360buyimg.com/yunying/%E4%BA%AC%E4%B8%9C%E9%87%91%E9%87%87%E5%BC%80%E9%80%9A%E6%B5%81%E7%A8%8B.pptx'
      },
      onSelect: 1
    }
  },
  created () {
    this.getType()
    this.getData()
  },
  computed: {
   search () {
      // return this.$store.state.user.contractFile
      return this.$store.getters.search
   }
  },
  watch: {
    search: {
      immediate: true,
      handler: function (newval) {
      this.operations(newval)
    }
   }
  },
  methods: {
    ...mapMutations(['SET_TYPE_LIST']),
    getType () { // 获取数据
        // console.log(storage.get('Access-Token'))
      typelist({}).then(res => {
        console.log(res)
        // if (res.code === 138) {
        //   this.$message.error('请先去认证')
        // }
        this.SET_TYPE_LIST(res.result.list)
      })
    },
    getData () { // 获取数据
        // console.log(storage.get('Access-Token'))
      index({ page: 1, offset: 1000, type: this.onSelect, keywords: this.$store.getters.search }).then(res => {
        this.indexList = res.result.list
      })
    },
    onSelects (item) {
      console.log(this.onSelect)
      if (item === this.onSelect) return false
      this.onSelect = item.type
      this.getData()
    },
    operations (item) {
      this.getData()
    },
    down (pid, type, name) {
      download({ pid, type }).then(res => {
        console.log(res)
        var a = document.createElement('a')
        a.href = res.result.url
        a.target = '_blank'
        a.style.display = 'none'
        a.setAttribute('download', name + type)
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      })
    }
  }
}
</script>

<style lang="less">
._list {
  background-color: #fff;
  display: flex;
  ._right_type {
    border-left: 1px solid #707070;
    padding-bottom: 20px;
    width: 260px;
    color: #707070;
    font-weight: 600;
    p {
      font-size: 40px;
      text-align: center;
      margin: 42px auto;
    }
    >div {
      cursor: pointer;
      width: 180px;
      height: 65px;
      line-height: 65px;
      text-align: center;
      font-size: 30px;
      margin: 0 auto;
      border: 1px solid #707070;
      border-radius: 10px;
      margin-top: 20px;
    }
    ._select {
      background-color: #5C646A;
      color: #fff;
    }
  }
  ._left_pdf {
    flex: 1;
    padding: 43px 67px;
    // background-color: aquamarine;
    .detaileds {
      cursor: pointer;
      padding: 14px;
      display: inline-block;
      margin-bottom: 45px;
      width: calc((100% - 90px) /3);
      border: 1px solid #707070;
      border-radius: 10px;
      .img_wap {
        padding-bottom: 56.25%;
        width: 100%;
        position: relative;
        img {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          background-color: #707070;
        }
      }
      h6 {
        text-align: center;
        color: #707070;
        font-size: 30px;
        margin: 0;
      }
      >div {
        .ant-btn-primary {
          width: 39%;
          height: 65px;
          font-size: 30px;
          border: 1px solid #707070;
          border-radius: 10px;
          background-color: #EB8A1B;
          overflow: hidden;
        }
        .ant-btn-primary:nth-child(2){
          background-color: #DC3752;
        }
        // .ant-btn-primary {
        //   font-size: 30px;
        //   width: 100%;
        //   height: 100%;
        //   background-color: #EB8A1B;
        //   border: 0;
        // }
        display: flex;
        justify-content: space-around;
      }
    }
   .detaileds:nth-child(3n -1) {
      margin: 0 45px;
    }
  }
}
</style>
