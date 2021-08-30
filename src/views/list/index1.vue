<!--
 * @Author: wangChao
 * @Date: 2021-06-05 11:50:25
 * @LastEditTime: 2021-06-22 13:55:32
 * @LastEditors: wangChao
 * @Description: pdf列表
 * @FilePath: /guTengBao/src/views/list/index.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->
<template>
  <div class="gtb_center">
    <div class="gtb_top">
      <div class="flex item-center">
        <div class="flex item-center gtb_search_input" >
          <span>{{ inputType.title }} |</span>
          <a-input placeholder="输入关键词搜索" v-model="inputKeywords" allowClear/>
        </div>
        <div class="gtb_search" @click="getData">搜索</div>
      </div>
      <div >
        <span>最近常搜： </span>
        <span class="gtb-hot-search" v-for="(item, index) in hotKey" :key="index" @click="setHotKey(item.keywords)">{{ item.keywords }}</span>
      </div>
      <div class="flex">
        <a-pagination
          v-if="paging.total>0"
          show-size-changer
          :default-current="paging.page"
          :default-page-size="paging.offset"
          :total="paging.total"
          :show-less-items="true"
          @showSizeChange="onShowSizeChange"
          @change="onChange"
          :page-size-options="pageSizeOptions"
        />
        <!-- <a-pagination
          v-if="paging.total>0"
          :default-current="paging.page"
          :total="paging.total"
          @change="onChange"
          simple
          :page-size-options="pageSizeOptions"
        /> -->
        <!-- <a-dropdown>
          <a-menu slot="overlay" @click="handleMenuClick">
            <a-menu-item v-for="item in pageSizeOptions" :key="item">{{ item }}条/页</a-menu-item>
          </a-menu>
          <a-button style="margin-left: 8px;height: initial;"> {{ paging.offset }}条/页 <a-icon type="down" /> </a-button>
        </a-dropdown> -->
        <div class="upload" @click="$refs.modal.add()">上传</div>
      </div>
    </div>
    <div class="gtb_list">
      <div class="_left_pdf">
        <div class="detaileds" v-for="(item, index) in indexList" :key="index">
          <div class="img_wap"><img :src="item.cover" alt="" @click="$router.push({name: 'details', query: {id: item.pid}})"></div>
          <div class="gtb-scheme-introduction">
            <h5><h6>{{ item.title }}</h6></h5>
            <div class="gtb_list_label">
              <span v-for="(tag, index1) in item.tag" :key="index1">{{ tag }}</span>
              <span v-if="!item.tag || item.tag.length == 0" style="opacity: 0">古腾堡</span>
            </div>
            <div class="gtb_list_icon">
              <span><img src="@/assets/look.png" alt="">{{ item.read }}</span>
              <span><img src="@/assets/comment.png" alt="">{{ item.comment }}</span>
              <span><img src="@/assets/grey-Download.png" alt="">{{ item.download }}</span>
              <span><img src="@/assets/heart.png" alt="" @click="like(item.pid)">{{ item.like }}</span>
            </div>
          </div>
          <div class="gtb_list_info flex">
            <img :src="item.headimg" alt="">
            <i>{{ item.username }}</i>
            <span>{{ item.time }}</span>
            <div>
              <a-button type="primary" @click="down(item.pid, 'ppt', item.title)" :disabled="!item.ppt" :class="item.ppt ? '' : 'disabled'">PPT</a-button>
              <a-button type="primary" @click="down(item.pid, 'pdf', item.title)" :disabled="!item.pdf" :class="item.pdf ? '' : 'disabled'">PDF</a-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <org-modal ref="modal" @add="onAdd"></org-modal>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { Pagination } from 'ant-design-vue'
import storage from 'store'
import OrgModal from '@/components/GlobalHeader/modules/OrgModal.vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import { typelist, index, download, projectkKeywords, like } from '@/api/index'
import { userStat } from '@/api/login'
export default {
  name: 'List',
  components: {
    'a-pagination': Pagination,
    OrgModal
  },
  data () {
    return {
      paging: {
        total: 0, // 总条数
        offset: 15, // 每页多少条数据
        page: 1 // 当前页
      },
      pageSizeOptions: ['15', '45', '60', '75'],
      hotSearch: [1],
      indexList: [],
      type: [],
      hotKey: [],
      inputType: this.$store.getters.search,
      ite: {
        pdf: 'http://storage.360buyimg.com/yunying/%E4%BA%AC%E4%B8%9C%E9%87%91%E9%87%87%E4%BD%BF%E7%94%A8%E6%89%8B%E5%86%8C.pdf',
        ppt: 'http://storage.360buyimg.com/yunying/%E4%BA%AC%E4%B8%9C%E9%87%91%E9%87%87%E5%BC%80%E9%80%9A%E6%B5%81%E7%A8%8B.pptx'
      },
      inputKeywords: ''
    }
  },
  created () {
    this.getData()
    this.getHotKey()
    this.getUserStat()
  },
  computed: {
   search () {
      return this.$store.getters.search
   }
  },
  watch: {
    search: {
      immediate: true,
      handler: function (newval) {
        this.inputType = newval
        this.operations()
      }
    }
  },
  methods: {
    ...mapMutations(['SET_TYPE_LIST', 'SET_USER_STAT']),
    setHotKey (key) {
      this.inputKeywords = key
      this.operations()
    },
     handleMenuClick (e) {
      this.paging.offset = Number(e.key)
      this.paging.total = -1
      this.getData()
    },
    getType () { // 获取数据
      typelist({}).then(res => {
        // console.log(res)
        // if (res.code === 138) {
          //   this.$message.error('请先去认证')
        // }
        this.SET_TYPE_LIST(res.result.list)
        // this.typelist = res.result.list
      })
    },
    getData () { // 获取数据
      if (!(this.inputType.type + '')) return false
      index({ page: this.paging.page, offset: this.paging.offset, type: this.inputType.type, keywords: this.inputKeywords }).then(res => {
        this.indexList = res.result.list
        this.paging = res.result.paging
        console.log(this.paging)
      })
    },
    getHotKey () {
      projectkKeywords().then(res => {
        this.hotKey = res.result.list
      })
    },
    operations (item) {
      if (!this.inputType.type) return false
      this.paging = {
        total: 0, // 总条数
        offset: 15, // 每页多少条数据
        page: 1 // 当前页
      }
      console.log('--------')
      this.getData()
    },
    onShowSizeChange (current, pageSize) {
      this.paging.page = current
      this.paging.offset = pageSize
      this.getData()
    },
    onChange (current) {
      console.log(current)
      this.paging.page = current
      this.getData()
    },
    down (pid, type, name) { // 下载ppt/pdf
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
        this.getUserStat()
      })
    },
    onAdd (params) { // 新增方案
      console.log(params)
      // return false
      // eslint-disable-next-line no-unreachable
      var formData = new FormData()
      if (params.ppt) formData.append('ppt', params.ppt)
      if (params.pdf) formData.append('pdf', params.pdf)
      formData.append('title', params.title)
      formData.append('tag', params.tag)
      // formData.append('test', 1)
      formData.append('type', params.type)
      formData.append('describe', params.describe)
      formData.append('session_id', storage.get(ACCESS_TOKEN))
      const config = {
        header: { 'content-type': 'multipart/form-data' }
      }
      this.$http.post('/project/add', formData, config).then(res => {
        this.$refs.modal.handLoading()
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.$refs.modal.successSubmit()
        this.$refs.modal.handleCancel()
        this.operations()
      //   setTimeout(() => {
      //   this.SET_SEARCH('')
      // }, 10)
      })
      // sadd(params).then(res => {
      //   console.log(res)
      // })
    },
    getUserStat () {
      userStat().then(res => {
        this.SET_USER_STAT(res.result.info)
      })
    },
    like (pid) {
      like({ pid }).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.getData()
        this.getUserStat()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
}
.item-center {
  align-items: center;
}
.gtb_center {
  background-color: #F4F4F4;
  padding: 50px 15.62%;
}
.gtb_top {
  display: flex;
  // justify-content: space-between;
  align-items: center;
  >div {
    flex: 1;
  }
  >div:nth-child(2) {
    margin: 0 55px;
    font: normal normal bold 16px Microsoft YaHei;
    white-space:nowrap; // 不允许换行;
    text-overflow:ellipsis; // 超出显示省略号
    color: #7AB800;
    overflow:hidden;
    cursor: pointer;
    span {
      margin-right: 5px;
    }
    span:first-child {
      color: #737373;
    }
    span:last-child {
      margin-right: 0;
    }
  }
  >div:nth-child(3) {
    .ant-pagination {
      flex: 1 1 auto;
      /deep/ .ant-pagination-prev, .ant-pagination-next, .ant-pagination-jump-prev, .ant-pagination-jump-next {
        height: 36px;
      }
      // display: flex;
      // align-items: center;
      /deep/ .ant-pagination-simple-pager input {
        margin-right: 0;
        padding: 0;
      }
      /deep/ .ant-pagination-slash {
        margin-right: 5px;
      }
      // ul {
      //   display: flex;
      //   align-items: center;
      // }
    }
  }
  .gtb_search_input {
    flex: 1 1 auto;
    border: 1px solid #BFBFBF;
    border-radius: 4px;
    background-color: #fff;
    height: 36px;
    padding-left: 20px;
    >span:nth-child(1){
      font: normal normal bold 16px/19px Microsoft YaHei;
      color: #283452;
      white-space: nowrap;
    }
  }
  .gtb_search {
    width: 80px;
    height: 36px;
    border-radius: 4px;
    background: #7AB800;
    cursor: pointer;
    text-align: center;
    font: normal normal bold 17px/36px Microsoft YaHei;
    color: #fff;
    margin-left: 10px;
  }
  /deep/ input {
    // width: 80%;
    border: 0;  // 去除未选中状态边框
    outline: none; // 去除选中状态边框
    background-color: rgba(0, 0, 0, 0);// 透明背景
    font: normal normal normal 16px/19px Microsoft YaHei;
    color: #2C2C2C;
  }
  /deep/ .ant-input:focus {
    box-shadow: 0 0 0 0;// 透明背景
  }
  .upload {
    width: 80px;
    height: 36px;
    border-radius: 4px;
    background: #7AB800;
    text-align: center;
    font: normal normal bold 17px/36px Microsoft YaHei;
    color: #fff;
    margin-left: 10px;
    cursor: pointer;
  }

}
._left_pdf {
    margin-top: 40px;
    display: flex;
    flex-flow: row wrap;
    align-content: flex-start;
    .detaileds {
      box-shadow: 2px 3px 5px #0000001A;
      cursor: pointer;
      display: inline-block;
      margin-bottom: 45px;
      flex: 1;
      width: calc((100% - 110px) /3);
      min-width: calc((100% - 110px) /3);
      max-width: calc((100% - 110px) /3);
      border-radius: 10px;
      overflow: hidden;
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
        padding-top: 15px;
      }
      h6 {
        text-align: left;
        font: normal normal bold 20px/23px Microsoft YaHei;
        color: #353940;
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
      .gtb-scheme-introduction {
        background-color: #fff;
        padding: 0 25px 15px;
        border-bottom: 1px solid #DEDEDE;
      }
      .gtb_list_label {
        font: normal normal normal 16px/26px Microsoft YaHei;
        color: #858585;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
        span {
          margin-right: 5px;
        }
        span:last-child {
          margin-right: 0;
        }
      }
      .gtb_list_icon {
        margin-top: 15px;
        img {
          height: 20px;
          margin-right: 6px;
          margin-left: 25px;
        }
        span:first-child img{
          margin-left: 0;
        }
      }
      .gtb_list_info {
        padding: 20px 25px;
        background-color: #fff;
        align-items: center;
        img {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          margin-right: 5px;
        }
        i {
          font-style: normal;
          font: normal normal normal 16px/23px Microsoft YaHei;
          color: #263650;
          margin-right: 12px;
          display: inline-block;
          width: 70px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        span {
          font: normal normal normal 16px/23px Microsoft YaHei;
          color: #858585;
          margin-right: 12px;
          display: inline-block;
          width: 101px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        >div {
          margin-left: auto;
          .ant-btn-primary {
            width: 48px;
            height: 30px;
            border: 0;
            border-radius: 4px;
            text-align: center;
            padding: 0;
            background-color: #DC7734;
            font: normal normal bold 16px/19px Microsoft YaHei;
            color: #FFFFFF;
          }
          .ant-btn-primary:nth-child(2){
            background-color: #CE1111;
            margin-left: 11px;
          }
          .disabled {
            background-color: #BCB9B9;
          }
        // .ant-btn-primary {
        //   font-size: 30px;
        //   width: 100%;
        //   height: 100%;
        //   background-color: #EB8A1B;
        //   border: 0;
        // }
        // display: flex;
        // justify-content: space-around;
        }
         @media screen and (max-width: 1680px){
          padding: 20px 10px;
          i, span{
            margin-right: 0;
          }
        }
      }
    }
   .detaileds:nth-child(3n -1) {
      margin: 0 55px 45px;
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
