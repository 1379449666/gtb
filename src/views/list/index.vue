<!--
 * @Author: wangChao
 * @Date: 2021-06-05 11:50:25
 * @LastEditTime: 2021-06-22 12:13:25
 * @LastEditors: wangChao
 * @Description: pdf列表
 * @FilePath: /guTengBao/src/views/list/index.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->
<template>
  <div class="gtb">
    <div class="_list">
      <div class="_left_pdf">
        <div class="detaileds" v-for="(item, index) in indexList" :key="index">
          <div class="img_wap"><img :src="item.cover" alt="" @click="$router.push({name: 'details', query: {id: item.pid}})"></div>
          <h5><h6>{{ item.title }}</h6></h5>
          <div>
            <a-button type="primary" @click="down(item.pid, 'ppt', item.title)">下载PPT</a-button>
            <a-button type="primary" @click="down(item.pid, 'pdf', item.title)">下载PDF</a-button>
          </div>
        </div>
        <a-pagination
          v-if="paging.total>0"
          show-size-changer
          :default-current="paging.page"
          :default-page-size="paging.offset"
          :total="paging.total"
          @showSizeChange="onShowSizeChange"
          @change="onChange"
          :page-size-options="pageSizeOptions"
        />
      </div>
      <div class="_right_type">
        <p >分类筛选</p>
        <div v-for="(item, index) in typelist" :key="index" :class="item.type === onSelect ? '_select' : ''" @click="onSelects(item)">{{ item.title }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { Pagination } from 'ant-design-vue'
import { typelist, index, download } from '@/api/index'
export default {
  name: 'List',
  components: {
    'a-pagination': Pagination
  },
  data () {
    return {
      indexList: [],
      type: [],
      typelist: [],
      inptData: this.$store.getters.search,
      ite: {
        pdf: 'http://storage.360buyimg.com/yunying/%E4%BA%AC%E4%B8%9C%E9%87%91%E9%87%87%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C.pdf',
        ppt: 'http://storage.360buyimg.com/yunying/%E4%BA%AC%E4%B8%9C%E9%87%91%E9%87%87%E5%BC%80%E9%80%9A%E6%B5%81%E7%A8%8B.pptx'
      },
      paging: {
        total: 0, // 总条数
        offset: 12, // 每页多少条数据
        page: 1 // 当前页
      },
      pageSizeOptions: ['12', '20', '30', '40', '50'],
      onSelect: 0
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
        // console.log(res)
        // if (res.code === 138) {
        //   this.$message.error('请先去认证')
        // }
        this.typelist = res.result.list
      })
    },
    getData () { // 获取数据
        // console.log(storage.get('Access-Token'))
      index({ page: this.paging.page, offset: this.paging.offset, type: this.onSelect, keywords: this.$store.getters.search }).then(res => {
        this.indexList = res.result.list
        this.paging = res.result.paging
        console.log(res)
      })
    },
    onSelects (item) {
      console.log(this.onSelect)
      if (item === this.onSelect) return false
      this.onSelect = item.type
      this.paging = {
        total: 0, // 总条数
        offset: 12, // 每页多少条数据
        page: 1 // 当前页
      }
      this.getData()
    },
    operations (item) {
      this.paging = {
        total: 0, // 总条数
        offset: 12, // 每页多少条数据
        page: 1 // 当前页
      }
      this.getData()
    },
    onShowSizeChange (current, pageSize) {
      this.paging.page = current
      this.paging.offset = pageSize
      this.getData()
    },
    onChange (current) {
      this.paging.page = current
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
  margin-bottom: 50px;
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
    padding: 43px 67px 0;
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
      h5 {
        overflow: hidden;
      }
      h6 {
        text-align: center;
        color: #707070;
        font-size: 30px;
        margin: 0;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
      }
      h6:hover {
        animation: 10s wordsLoop linear infinite normal;
        text-overflow: clip !important;
        white-space: nowrap !important;
        overflow: visible !important;
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
.gtb::after {
  content:"";
	display: inline-block;
	width: 10px;
	height: 10px;
	// background: rgba(255,0,0,.3);
}
.gtb {
  .ant-pagination {
    // margin-right: 260px;
    display: flex;
    // flex-direction: row-reverse;
    justify-content: flex-end;
  }
  .ant-pagination-prev, .ant-pagination-next, .ant-pagination-jump-prev, .ant-pagination-jump-next,
  .ant-pagination-item,
  .ant-select-selection--single {
    min-width: 40px;
    height: 40px;
    line-height: 40px;
  }
  .ant-select-selection__rendered {
    line-height: 40px;
    font-size: 26px;
  }
  .ant-pagination-prev .ant-pagination-item-link, .ant-pagination-next .ant-pagination-item-link,
  .ant-pagination-item {
    font-size: 26px;
  }
  .ant-select-arrow {
    font-size: 17px;
    right: 7px;
  }
  .ant-pagination-options-size-changer.ant-select {
    margin-right: 0;
  }
}
@keyframes wordsLoop {
    0% {
        transform: translateX(0px);
        -webkit-transform: translateX(0px);
    }
    100% {
        transform: translateX(-100%);
        -webkit-transform: translateX(-100%);
    }
}
</style>
