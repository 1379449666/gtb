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
        <a-form-item label="方案名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="20字以内，简单清晰地表述" v-decorator="['title', {initialValue: creFrom.title, rules: [{required: true, message: '20字以内，简单清晰地表述'}]}]"></a-input>
        </a-form-item>
        <a-form-item label="方案分类" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 8px;">
          <!-- <a-select placeholder="请选择分类类型" @change="selectHandleChange" v-decorator="[ 'type', {initialValue: creFrom.type, rules: [{required: true, message: '请选择分类！'}]}]">
            <a-select-option :value="item.type" v-for="(item,index) in $store.getters.typelist" :key="index" >{{ item.title }}</a-select-option>
          </a-select> -->
          <a-radio-group v-decorator="['type', {initialValue: creFrom.type, rules: [{required: true, message: '请选择方案类型！'}]}]">
            <a-radio :value="item.type" v-for="item in radioList" :key="item.type">{{ item.title }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="标签" :labelCol="labelCol" :wrapperCol="wrapperCol">
          <a-tree
            v-if="treeData.length>0"
            v-model="creFrom.tag_id"
            checkable
            :auto-expand-parent="autoExpandParent"
            :selected-keys="selectedKeys"
            :tree-data="treeData"
            defaultExpandAll
            :replace-fields="replaceFields"
            @expand="onExpand"
            @select="onSelect"
            @check="onCheck"
          />
          <!-- <a-tree
            v-if="treeData.length>0"
            v-model="checkedKeys"
            checkable
            @check="onCheck"
            :selected-keys="selectedKeys"
            :replace-fields="replaceFields"
            defaultExpandAll
            showLine
            :tree-data="treeData"/> -->
        </a-form-item>
        <a-form-item label="讲述建议" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input style="height:80px;" placeholder="请输入..." v-decorator="['describe', {initialValue: creFrom.describe, rules: [{required: true, message: '请输入SKU商品编号！'}]}]" type="textarea" />
        </a-form-item>
        <a-form-item label="PPT上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!isEdit">
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="(i) => handleChange(i, 'ppt')"
            v-decorator="['ppt', {initialValue: creFrom.ppt}]"
          >
            <a-button > <a-icon type="upload" /> {{ creFrom.ppt ? creFrom.ppt.name : '上传文件' }} </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="PPT上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-else>
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="(i) => handleChange(i, 'ppt')"
          >
            <a-button > <a-icon type="upload" /> {{ creFrom.ppt ? '已上传' : '上传文件' }} </a-button>
          </a-upload>
        </a-form-item>
        <a-form-item label="PDF上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-if="!isEdit">
          <a-upload
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
        </a-form-item>
        <a-form-item label="PDF上传" :labelCol="labelCol" :wrapperCol="wrapperCol" v-else>
          <a-upload
            name="avatar"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :before-upload="beforeUpload"
            @change="(i) => handleChange(i, 'pdf')"
          >
            <a-button > <a-icon type="upload" /> {{ creFrom.pdf ? '已上传' : '上传文件' }} </a-button>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { Tree } from 'ant-design-vue'
import { tagList } from '@/api/index'
export default {
  components: {
    'a-tree': Tree
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
        name: '',
        firstCateId: [],
        img: ''
      },
      text: '',
      form: this.$form.createForm(this),
      isEdit: false,
      treeData: [],
      radioList: this.$store.getters.typelist,
      expandedKeys: ['0-0-0'], // 展开指定的树节点
      autoExpandParent: true, // 是否自动展开父节点
      checkedKeys: [], // 默认选中的值
      selectedKeys: [], // 设置选中的树节点(后面)
      replaceFields: {
        children: 'child',
        title: 'tag',
        key: 'id'
      }
    }
  },
   watch: {
    checkedKeys (val) {
      // console.log('onCheck', val)
    }
  },
  mounted () {
    this.getTag()
  },
  methods: {
    getTag () {
      tagList().then(res => {
        console.log(res)
        this.treeData = res.result.list
      })
    },
     onExpand (expandedKeys) { // 展开/收起节点时触发
     return false
      // eslint-disable-next-line no-unreachable
      console.log('onExpand', expandedKeys)
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onCheck (checkedKeys) { // 点击复选框事件
      console.log('onCheck', checkedKeys)
      this.checkedKeys = checkedKeys
    },
    onSelect (selectedKeys, info) { // 点击树节点触发
     return false
      // eslint-disable-next-line no-unreachable
      console.log('onSelect', info)
      this.selectedKeys = selectedKeys
    },
    edit (item) {
      this.form.resetFields()
      this.visible = true
      this.text = '编辑'
      this.creFrom = item
      this.isEdit = true
      this.creFrom.tag_id = this.creFrom.tag_id.split(',').map(Number)
    },
    add () {
      this.form.resetFields()
      this.creFrom = {}
      this.visible = true
      this.text = '新建'
      this.isEdit = false
    },
    handleSubmit () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          var param = {
            ppt: typeof this.creFrom.ppt === 'boolean' ? false : this.creFrom.ppt,
            pdf: typeof this.creFrom.pdf === 'boolean' ? false : this.creFrom.pdf,
            title: values.title,
            type: values.type,
            describe: values.describe,
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
      if (!isJpgOrPng) {
        return this.$message.error('请上传pdf或者ppt文件!')
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
      // var formData = new FormData()
      // formData.append('file', info.file)
      // this.$http.post('/file/imageUpload', formData).then(res => {
      //   if (res.data !== null) {
      //     this.img = `http://${res.data}`
      //   } else {
      //     this.$message.error('上传失败')
      //   }
      // })
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
</style>
