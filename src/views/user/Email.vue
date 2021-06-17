<!--
 * @Author: wangChao
 * @Date: 2021-06-16 09:49:11
 * @LastEditTime: 2021-06-17 10:32:48
 * @LastEditors: wangChao
 * @Description: 绑定邮箱
 * @FilePath: /guTengBao/src/views/user/Email.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->
<template>
  <div class="Email">
    <a-form :form="form">
      <a-form-item label="绑定邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="types + ''=='0'">
        <a-input placeholder="请输入邮箱" v-decorator="['email', {initialValue: email, rules: [{required: true, message: '请输入邮箱!'}]}]"></a-input>
      </a-form-item>
      <a-form-item label="" :labelCol="labelCol" :wrapperCol="wrapperCol1" :offset="7" v-if="types + '' =='0'">
        <a-button a-button type="primary" @click="subEmail">提交邮箱</a-button>
      </a-form-item>
      <div class="not-active" v-if="types - 0 == 2">已发送邮箱未激活</div>
    </a-form>
  </div>
</template>
<script>
import { verifiedUser, getVerfied } from '@/api/logins'
import { mapActions } from 'vuex'
export default {
  name: 'Email',
  data () {
    return {
      email: '',
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      wrapperCol1: {
        xs: { span: 24 },
        sm: { span: 13, offset: 7 }
      },
      form: this.$form.createForm(this),
      types: '0'
    }
  },
  created () {
    this.getVerfied()
  },
  methods: {
    ...mapActions(['Logout']),
    subEmail () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          verifiedUser({ email: values.email }).then(res => {
            if (res.code !== 200) return this.$message.error(res.msg)
            this.types = res.result.verified
            this.$message.success(res.msg)
          })
        }
      })
    },
    getVerfied () {
      getVerfied().then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        // this.types = 0
        this.types = res.result.verified
        if (res.result.verified === 1) {
          this.Logout({}).then(() => {
            setTimeout(() => {
              this.$router.push({ path: '/' })
            }, 16)
          })
        }
      })
    }
  }
}
</script>

<style lang="less" >
.Email {
  .user-layout-content {
  width: 100%;
}
.ant-form {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50%;
  .ant-form-item-control {
    text-align: left;
  }
  .ant-form-item-required, .ant-input{
    font-size: 33px;
    height: 60px;
    padding: 4px 11px;
    line-height: 60px;
  }
  .ant-btn {
    height: 60px;
    line-height: 60px;
    font-size: 33px;
    margin-top: 30px;
  }
  .not-active {
    text-align: center;
    font-size: 33px;
  }
}
}
</style>
