<!--
 * @Author: wangChao
 * @Date: 2021-06-05 10:56:35
 * @LastEditTime: 2021-06-17 14:41:43
 * @LastEditors: wangChao
 * @Description: 公共头部
 * @FilePath: /guTengBao/src/components/GlobalHeader/index.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->
<template>
  <div>
    <header>
      <div class="gtb_logo">
        <img :src="$store.getters.userInfos.headimg" alt="" @click="$router.push({ path: 'home' })">
        <div>
          <span>古腾堡 - Beta 2</span>
          <span>AMS策划方案 - 模块化交付</span>
        </div>
      </div>
      <div class="gtb_label_type">
        <span v-for="(item, index) in typelist" :key="index" :class="buttonIndex == index ? 'button-select' : ''" @click="editButtonIndex(index, item)">{{ item.title }}</span>
      </div>
      <statistics />
      <div class="gtb_personal_data gtb_flex">
        <div class="gtb_flex gtb_justify-center gtb_direction-column">
          <i>你好, {{ $store.getters.userInfos.nickname }}</i>
          <p>
            <span @click="setData">个人设置</span>
            <span @click="handleLogout">退出登录</span>
          </p>
        </div>
        <img :src="$store.getters.userInfos.headimg" alt="">
      </div>
      <!-- <div class="flex">
        <a-input placeholder="输入关键词搜索方案" v-model="inputData"/>
        <a-button type="primary" class="search" @click="setInput">搜索</a-button>
        <a-button type="primary" @click="$refs.modal.add()">上传</a-button>
        <a-dropdown>
          <img :src="$store.getters.userInfos.headimg" alt="">
          <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
            <a-menu-item key="1"><a-icon type="setting"/><span @click="$refs.basic.edit()">个人设置</span></a-menu-item>
            <a-menu-divider/>
            <a-menu-item key="3"><a href="javascript:;" @click="handleLogout"><a-icon type="logout"/><span>退出登录</span></a></a-menu-item>
          </a-menu>
        </a-dropdown>
      </div> -->
    </header>
    <org-modal ref="modal" @add="onAdd"></org-modal>
    <set-basic ref="basic" ></set-basic>
  </div>
</template>

<script>

import { mapMutations, mapActions } from 'vuex'
import OrgModal from './modules/OrgModal'
import SetBasic from './modules/SetBasic'
import Statistics from './modules/Statistics'
import storage from 'store'
import { typelist, addStat } from '@/api/index'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'GtbHeader',
  components: {
    OrgModal,
    SetBasic,
    Statistics
  },
  data () {
    return {
      name: '古腾堡',
      inputData: this.$store.getters.search,
      labaleTypeData: ['策略', '资源', '产品', '案例', '报告'],
      buttonIndex: 0,
      typelist: []
    }
  },
  created () {
    // 在页面刷新时将vuex里的信息保存到localStorage里
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('messageStore', JSON.stringify(this.$store.state))
  })
 // 在页面加载时读取localStorage里的状态信息
  localStorage.getItem('messageStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(localStorage.getItem('messageStore'))))
  this.SET_SEARCH('')
  this.inputData = this.$store.getters.search
  this.getType()
 },
  methods: {
    ...mapMutations(['SET_INFOS', 'SET_SEARCH']),
    editButtonIndex (index, item) {
      this.buttonIndex = index
      this.SET_SEARCH(item)
    },
    ...mapActions(['Logout']),
    handleLogout () { // 推出登录
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          }).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    },
    setData () {
      this.$refs.basic.edit()
      addStat({ type: 5 }).then(res => {})
    },
    onAdd (params) { // 新增方案
      // console.log(params)
      var formData = new FormData()
      formData.append('ppt', params.ppt)
      formData.append('pdf', params.pdf)
      formData.append('title', params.title)
      formData.append('type', params.type)
      formData.append('describe', params.describe)
      formData.append('session_id', storage.get(ACCESS_TOKEN))
      const config = {
        header: { 'content-type': 'multipart/form-data' }
      }
      this.$http.post('/project/add', formData, config).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.$refs.modal.successSubmit()
        this.$refs.modal.handleCancel()
        this.SET_SEARCH('-')
        setTimeout(() => {
        this.SET_SEARCH('')
      }, 10)
      })
      // sadd(params).then(res => {
      //   console.log(res)
      // })
    },
    getType () { // 获取数据
      typelist({}).then(res => {
        // this.SET_TYPE_LIST(res.result.list)
        this.typelist = res.result.list
        this.SET_SEARCH(res.result.list[0])
      })
    }
  }
}
</script>

<style lang="less" >
.gtb_flex {
  display: flex;
}
.gtb_justify-center {
  justify-content: center;
}
.gtb_direction-column {
  flex-direction: column;
}
header {
  background-color: #fff;
  height: 120px;
  padding: 0 10.41%;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  .gtb_logo {
    display: flex;
    align-items: center;
    margin-right: 4.01%;
    img {
      width: 80px;
      height: 80px;
      margin-right: 15px;
      cursor: pointer;
    }
    >div {
      display: flex;
      flex-direction: column;
      span:nth-child(1) {
        color: #263650;
        font: normal normal bold 20px/23px Microsoft YaHei;
      }
      span:nth-child(2) {
        color: #858585;
        font: normal normal normal 16px/23px Microsoft YaHei;
      }
    }
  }
  .gtb_label_type {
    margin-right: 4.5%;
    span {
      display: inline-block;
      width: 80px;
      height: 36px;
      text-align: center;
      color: #2C2C2C;
      background-color: #F4F4F4;
      font: normal normal bold 17px/36px Microsoft YaHei;
      border-radius: 4px;
      margin-right: 30px;
      cursor: pointer;
    }
    .button-select {
      color: #fff;
      background-color: #283452;
    }
    span:last-child {
      margin-right: 0;
    }
  }
  .gtb_personal_data {
    margin-left: 10px;
    cursor: pointer;
    img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: 3px solid #C5C5C5;
      margin-left: 25px;
    }
    i {
      font-style:normal;
      font-size: 20px;
      color: #263650;
    }
    span {
      color: #858585;
      font-size: 16px;
    }
    span:last-child {
      margin-left: 15px;
    }
    p {
      margin-bottom: 0;
    }
  }
}
</style>
