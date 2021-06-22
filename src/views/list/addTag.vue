
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
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="标签" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="请输入" v-decorator="['tag', {initialValue: creFrom.tag, rules: [{required: true, message: '请输入标签!'}]}]"></a-input>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
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
      },
      text: '',
      form: this.$form.createForm(this),
      isEdit: false
    }
  },
  mounted () {
  },
  methods: {
    edit (item) {
      this.form.resetFields()
      this.visible = true
      this.text = '编辑'
      this.creFrom = item
      this.isEdit = true
    },
    add () {
      this.form.resetFields()
      this.creFrom = {
      }
      this.visible = true
      this.text = '新建'
      this.isEdit = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        this.confirmLoading = true
        if (!errors) {
          var param = {
            tag: values.tag,
            pid: this.$route.query.id
          }
          if (this.isEdit) param.otag = this.creFrom.tag
          setTimeout(() => {
            this.confirmLoading = false
            this.$emit(this.isEdit ? 'edit' : 'add', param)
          }, 1500)
        } else {
          this.confirmLoading = false
        }
      })
    },
    successSubmit () {
     this.form.resetFields()
     this.creFrom = {}
    },
    handleCancel () {
      this.visible = false
      this.confirmLoading = false
    }
  }
}
</script>

<style lang="less" >
</style>
