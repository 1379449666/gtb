<template>
  <a-modal
    :title="text"
    :width="640"
    :visible="visible"
    :maskClosable="false"
    :keyboard="false"
    :destroy-on-close="true"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-spin :spinning="confirmLoading">
      <a-form :form="form">
        <a-form-item label="PPT上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!isEdit">
          <a-upload
            accept=".ppt, .pptx"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="(i) => handleChange(i, 'ppt')"
            v-decorator="['ppt', {initialValue: creFrom.ppt, rules: [{required: true, message: '请上传ppt'}]}]"
          >
            <a-button > <a-icon type="upload" /> {{ creFrom.ppt ? creFrom.ppt.name : '上传文件' }} </a-button>
          </a-upload>
          <p class="sx-notes">注：除报告外, 必须上传PPT文件</p>
        </a-form-item>
        <a-form-item label="PPT上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-else>
          <a-upload
            accept=".ppt, .pptx"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="(i) => handleChange(i, 'ppt')"
          >
            <a-button > <a-icon type="upload" /> {{ creFrom.ppt ? '已上传' : '上传文件' }} </a-button>
          </a-upload>
          <p class="sx-notes">注：除报告外, 必须上传PPT文件</p>
        </a-form-item>
        <a-form-item label="缩略图" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!isEdit&&img!==''">
          <img :src="img" alt="" class="simg">
        </a-form-item>
        <a-form-item label="PDF上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!isEdit">
          <a-upload
            accept=".pdf"
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="(i) => handleChange(i, 'pdf')"
            v-decorator="['pdf', {initialValue: creFrom.pdf}]"
          >
            <a-button > <a-icon type="upload" /> {{ creFrom.pdf ? creFrom.pdf.name : '上传文件' }} </a-button>
          </a-upload>
          <p class="sx-notes">为保证正确显示缩略图, 建议也上传PDF</p>
        </a-form-item>
        <a-form-item label="PDF上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-else>
          <a-upload
            name="avatar"
            accept=".pdf"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="(i) => handleChange(i, 'pdf')"
          >
            <a-button > <a-icon type="upload" /> {{ creFrom.pdf ? '已上传' : '上传文件' }} </a-button>
          </a-upload>
          <p class="sx-notes">为保证正确显示缩略图, 建议也上传PDF</p>
        </a-form-item>
        <a-form-item label="标题名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="30字以内，简单清晰地表述文档内容" :maxLength="30" v-decorator="['title', {initialValue: creFrom.title, rules: [{required: true, message: '请输入'}]}]"></a-input>
        </a-form-item>
        <a-form-item label="所属板块" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 8px;">
          <a-radio-group v-decorator="['type', {initialValue: creFrom.type, rules: [{required: true, message: '请选择！'}]}]">
            <a-radio :value="item.type" v-for="item in typelist" :key="item.type" v-if="item.title!=='全部'">{{ item.title }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="" :labelCol="{xs: { span: 2 },sm: { span: 2 }}" :wrapperCol="{xs: { span: 24, offset: 3 },sm: { span: 19, offset: 3 }}">
          <radio-list :radioList="es" :tagId="re" @radio="getRadio"></radio-list>
        </a-form-item>
        <a-form-item label="信息备注" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input style="height:80px;" placeholder="其他可以用来描述文档的关键词, 例如: 品牌、艺人、项目名, 请使用逗号隔开, 系统会抓取用于搜索。" type="textarea" v-decorator="['describe', {initialValue: creFrom.describe}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { mapState } from 'vuex'
import { Tree } from 'ant-design-vue'
import { tagList } from '@/api/index'
import RadioList from './Radio'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
export default {
  components: {
    'a-tree': Tree,
    RadioList
  },
  props: {
    catigroyList: {
      type: Array,
      default: () => {
        return []
      }
    },
    customerTypeList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 }
      },
      visible: false,
      confirmLoading: false,
      loading: false,
      creFrom: {
        name: '',
        firstCateId: []
      },
      img: '',
      text: '',
      form: this.$form.createForm(this),
      isEdit: false,
      treeData: [],
      checkedKeys: [], // 默认选中的值
      replaceFields: {
        children: 'child',
        title: 'tag',
        key: 'id'
      },
      es: [],
      re: []
    }
  },
   watch: {
    checkedKeys (val) {
      // console.log('onCheck', val)
    }
  },
  computed: {
    ...mapState({
      typelist: state => state.list.typelist
    })
  },
  mounted () {
    this.getTag()
  },
  methods: {
    getTag () {
      tagList().then(res => {
        this.treeData = res.result.list
        var newArr = res.result.list
        this.digui(newArr)
      })
    },
    digui (item, flag = false) {
      for (let index = 0; index < item.length; index++) {
        const element = item[index]
        if (element.child) { // disableCheckbox为true, 以及有child 说明是 单独的一个数组
          var idArray = []
          for (let i = 0; i < element.child.length; i++) {
            const tag = element.child[i].id
            idArray.push(tag)
          }
          var obj = {
            title: element.tag,
            tag: element.child,
            flag: false,
            idArray
          }
          if (flag) {
            obj.flag = true
          }
          if (element.tag === '行业标签') obj.tag = []
          this.es.push(obj)
          this.digui(element.child, true)
        }
      }
    },
    getRadio (e) {
      this.checkedKeys = e
    },
    edit (item) {
      this.form.resetFields()
      this.visible = true
      this.text = '编辑'
      this.creFrom = item
      this.isEdit = true
      this.creFrom.tag_id = this.checkedKeys = this.creFrom.tag_id.split(',').map(Number)
      for (let index = 0; index < this.es.length; index++) {
        const value = this.es[index].idArray.filter(v => this.creFrom.tag_id.includes(v))
        if (value.length === 0) this.re[index] = undefined
        this.re[index] = value
      }
    },
    add () {
      this.form.resetFields()
      this.creFrom = {}
      this.checkedKeys = []
      this.visible = true
      this.text = '新建'
      this.isEdit = false
      this.re = []
      this.img = ''
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      validateFields((errors, values) => {
        if (!errors) {
          this.confirmLoading = true
          var param = {
            ppt: typeof this.creFrom.ppt === 'boolean' ? false : this.creFrom.ppt,
            pdf: typeof this.creFrom.pdf === 'boolean' ? false : this.creFrom.pdf,
            title: values.title,
            type: values.type,
            describe: values.describe || '',
            tag: this.checkedKeys.join(',')
          }
          if (this.isEdit) param.id = this.creFrom.id
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
      const isJpgOrPng = type === 'ppt' || type === 'pptx' || type === 'pdf'
      if (!isJpgOrPng) return this.$message.error('请上传pdf或者ppt文件!')
      const isLt2M = file.size / 1024 / 1024 < 200
      if (!isLt2M) return this.$message.error('文件上限 200MB!')
      if (type === 'ppt' || type === 'pptx') this.$nextTick(() => { this.form.setFieldsValue({ title: file.name.split('.')[0] }) })
      return false
    },
    handleChange (info, type) {
      this.creFrom[type] = info.file
      var formData = new FormData()
      formData.append('file', info.file)
      formData.append('session_id', storage.get(ACCESS_TOKEN))
      // formData.append('test', 1)
      if (type === 'ppt' && !this.isEdit) {
        this.$http.post('/project/getCover', formData).then(res => {
          if (res.code === 200) {
            this.img = `${res.result.cover}`
          } else {
            // this.$message.error('')
          }
        })
      }
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
      this.creFrom = {}
    },
    handLoading () {
     this.confirmLoading = false
    }
  }
}
</script>

<style lang="less">
.avatar-uploader {
  height: 30px !important;
  .ant-upload.ant-upload-select-picture-card {
    height: auto;
    border: 0;
    background-color: #fff;
    padding: 0;
    margin-bottom: 0;
  }
  .ant-upload.ant-upload-select-picture-card > .ant-upload {
    padding: 4px 0;
  }
}
.simg {
  width: 240px;
  height: 135px;
}
.sx-notes {
  font-size: 14px;
  color: #ccc;
  line-height: 19px;
  margin-bottom: 0;
}
</style>
