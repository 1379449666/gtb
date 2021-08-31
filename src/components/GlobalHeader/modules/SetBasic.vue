<template>
  <a-modal
    :title="text"
    :width="640"
    :visible="visible"
    :maskClosable="false"
    :keyboard="false"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
    :footer="null"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="昵称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="请输入" v-model="creFrom.nickname"><a-icon slot="addonAfter" type="setting" @click="setBasic('nickname')"/></a-input>
        </a-form-item>

        <a-form-item label="性别" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-radio-group v-model="creFrom.sex" @change="setBasic('sex')">
            <a-radio :value="1">男</a-radio>
            <a-radio :value="0">女</a-radio>
          </a-radio-group>
        </a-form-item>

        <a-form-item label="邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="请输入邮箱" v-model="creFrom.email"><a-icon slot="addonAfter" type="setting" @click="setEmail"/></a-input>
        </a-form-item>

        <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol" class="head-portrait">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="handleChange"
            v-decorator="['headimg', {initialValue: creFrom.headimg}]"
          >
            <img v-if="headimg" :src="headimg" alt="avatar" class="ActarImg"/>
            <div v-else>
              <a-icon :type="loading ? 'loading' : 'plus'" />
              <div class="ant-upload-text">
                上传图片
              </div>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import storage from 'store'
import { mapMutations } from 'vuex'
import { getUserInfo, editUser, verifiedUser } from '@/api/logins'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      loading: false,
      creFrom: {
        nickname: '',
        sex: '',
        email: ''
      },
      text: '',
      headimg: '',
      form: this.$form.createForm(this),
      isEdit: false
    }
  },
  mounted () {
  },
  methods: {
    ...mapMutations(['SET_INFOS']),
    edit (item) {
      this.form.resetFields()
      this.visible = true
      this.text = '修改'
      // this.creFrom = item
      this.getUserInfo()
      this.isEdit = true
    },
    getUserInfo () {
      getUserInfo().then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.creFrom = res.result.user_info
        this.headimg = res.result.user_info.headimg
      })
    },
    setBasic (type) {
      editUser({ [`${type}`]: this.creFrom[type] }).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.creFrom = res.result.user_info
      })
    },
    setEmail () {
      verifiedUser({ email: this.creFrom.email }).then(res => {
            if (res.code !== 200) return this.$message.error(res.msg)
            // this.types = res.result.verified
            this.$message.success(res.msg)
          })
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var param = {
            ppt: this.creFrom.ppt,
            pdf: this.creFrom.pdf,
            title: values.title,
            type: values.type,
            describe: values.describe
          }
          // if (this.isEdit) param.id = this.creFrom.id
          setTimeout(() => {
            this.$emit(this.isEdit ? 'edit' : 'add', param)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    beforeUpload (file) {
      const type = file.name.split('.').pop()
      const isJpgOrPng = type === 'jpg' || type === 'jpeg' || type === 'png' || type === 'webp'
      if (!isJpgOrPng) {
        return this.$message.error('请上传图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.$message.error('文件上限 100MB!')
        return
      }
      return false
    },
    handleChange (info, type) {
      console.log(info, type)
      this.creFrom[type] = info.file
      var formData = new FormData()
      formData.append('img', info.file)
      formData.append('session_id', storage.get(ACCESS_TOKEN))
      const config = {
        header: { 'content-type': 'multipart/form-data' }
      }
      this.$http.post('/user/uploadFileImg', formData, config).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        // this.creFrom = res.result.user_info
        this.SET_INFOS(res.result.user_info)
        this.headimg = res.result.user_info.headimg
      })
    },
    successSubmit () {
     this.form.resetFields()
     this.creFrom = {}
    },
    selectHandleChange (value) {
      this.firstCateId = value.key
      this.firstCateName = value.label
      this.creFrom.name = value.label
    },
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
 .avatar-uploader {
    height:100px;
    width:100px;
    .ActarImg {
      height:100px;
      width:100px;
    }
  }
  .head-portrait {
    height: 120px;
  }
</style>
