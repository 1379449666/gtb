
<template>
  <!-- <div class="onClickSub" id="weixin" @click="handleSubmit">
    点击登录
  </div> -->
  <!-- <div>转圈</div> -->
  <div class="getcode">
    <a-spin />
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex'
import { timeFix } from '@/utils/util'
import { Login_, testLogin } from '@/api/logins'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  components: {
  },
  data () {
    return {
    }
  },
  created () {
    this.login()
    // this.testLogins()
  },
  methods: {
    ...mapActions(['Login', 'Logout']),
    ...mapMutations(['SET_TOKEN', 'SET_INFOS']),
    login () {
      Login_({ code: this.$route.query.code }).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.SET_TOKEN(res.result.session_id)
        this.SET_INFOS(res.result.user_info)
        storage.set(ACCESS_TOKEN, res.result.session_id, 7 * 24 * 60 * 60 * 1000)
        if (res.result.user_info.verified - 0 === 1) {
          this.loginSuccess(res)
          return false
        }
        this.$router.push({ path: 'binding-email' })
        return false
      })
    },
    testLogins () {
      testLogin({ uid: 2 }).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.SET_TOKEN(res.result.session_id)
        this.SET_INFOS(res.result.user_info)
        storage.set(ACCESS_TOKEN, res.result.session_id, 7 * 24 * 60 * 60 * 1000)
        if (res.result.user_info.verified - 0 === 1) {
          this.loginSuccess(res)
          return false
        }
        this.$router.push({ path: 'binding-email' })
        return false
      })
    },
    loginSuccess (res) {
      console.log(res)
      this.$router.push({ path: '/' })
      // 延迟 1 秒显示欢迎信息
      setTimeout(() => {
        this.$notification.success({
          message: `你好, ${this.$store.getters.userInfos.nickname}`,
          description: `${timeFix()}，欢迎回来`
        })
      }, 1000)
      this.isLoginError = false
    },
    requestFailed (err) {
      this.isLoginError = true
      this.$notification['error']({
        message: '错误',
        description: ((err.response || {}).data || {}).message || '请求出现错误，请稍后再试',
        duration: 4
      })
    },
    GetQueryString (name) {
     var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
     var r = window.location.search.substr(1).match(reg)
     if (r != null) return unescape(r[2])
     return null
    }
  }
}
</script>
<style lang="less" >
.getcode {
  .user-layout-content {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
}
</style>
