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
      <span class="name">{{ name }}</span>
      <div class="flex">
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
      </div>
    </header>
    <org-modal ref="modal" @add="onAdd"></org-modal>
    <set-basic ref="basic" ></set-basic>
  </div>
</template>

<script>

import { mapMutations, mapActions } from 'vuex'
import OrgModal from './modules/OrgModal'
import SetBasic from './modules/SetBasic'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  name: 'GtbHeader',
  components: {
    OrgModal,
    SetBasic
  },
  data () {
    return {
      name: '古腾堡',
      inputData: this.$store.getters.search
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
 },
  methods: {
    ...mapMutations(['SET_INFOS', 'SET_SEARCH']),
    setInput () {
      this.SET_SEARCH(this.inputData)
      if (this.$route.name === 'details') this.$router.push({ path: 'home' })
    },
    ...mapActions(['Logout']),
    handleLogout () {
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
    onAdd (params) {
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
    }
  }
}
</script>

<style lang="less" >
header {
  background-color: #EFE9E9;
  height: 157px;
  padding-left: 67px;
  padding-right: 40px;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  .name {
    color: #1A85FF;
    font: normal normal bold 40px/52px Microsoft YaHei;
  }
  .flex {
    display: flex;
    align-items: center;
    .ant-btn-primary {
      background-color: #37DC5D;
      color: #fff;
      border: 1px solid #707070;
      border-radius: 10px;
      height: 65px;
      width: 118px;
      font: normal normal bold 30px/40px Microsoft YaHei;
    }
    .search {
      margin: 0 32px 0 37px;
    }
    .ant-input {
      border: 1px solid #707070;
      height: 65px;
      border-radius: 10px;
      font: normal normal bold 30px/40px Microsoft YaHei;
      padding-left: 25px;
    }
    img {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      border: 3px solid #C5C5C5;
      margin-left: 50px;
    }
  }
}
</style>
