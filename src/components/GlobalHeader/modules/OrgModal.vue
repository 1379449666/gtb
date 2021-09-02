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
            v-decorator="['ppt', {initialValue: creFrom.ppt}]"
          >
            <a-button > <a-icon type="upload" /> {{ creFrom.ppt ? creFrom.ppt.name : '上传文件' }} </a-button>
          </a-upload>
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
        </a-form-item>
        <a-form-item label="方案名称" :labelCol="labelCol" :wrapperCol="wrapperCol" >
          <a-input placeholder="30字以内，简单清晰地表述" :maxLength="30" v-decorator="['title', {initialValue: creFrom.title, rules: [{required: true, message: '30字以内，简单清晰地表述'}]}]"></a-input>
        </a-form-item>
        <a-form-item label="方案分类" :labelCol="labelCol" :wrapperCol="wrapperCol" style="margin-bottom: 8px;">
          <!-- <a-select placeholder="请选择分类类型" @change="selectHandleChange" v-decorator="[ 'type', {initialValue: creFrom.type, rules: [{required: true, message: '请选择分类！'}]}]">
            <a-select-option :value="item.type" v-for="(item,index) in $store.getters.typelist" :key="index" >{{ item.title }}</a-select-option>
          </a-select> -->
          <a-radio-group v-decorator="['type', {initialValue: creFrom.type, rules: [{required: true, message: '请选择方案类型！'}]}]">
            <a-radio :value="item.type" v-for="item in radioList" :key="item.type">{{ item.title }}</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="" :labelCol="{xs: { span: 2 },sm: { span: 2 }}" :wrapperCol="{xs: { span: 24, offset: 3 },sm: { span: 19, offset: 4 }}">
          <radio-list :radioList="es" :tagId="re" @radio="getRadio"></radio-list>
          <!-- <a-tree
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
          /> -->
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
          <a-input style="height:80px;" placeholder="讲述建议将会在评论区里展示" type="textarea" v-decorator="['describe', {initialValue: creFrom.describe}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
import { Tree } from 'ant-design-vue'
import { tagList } from '@/api/index'
import RadioList from './Radio'
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
          // if (this.isEdit) {
          //   var idArray = []
          //   for (let index = 0; index < element.child.length; index++) {
          //     if (element.child[index].id) idArray.push(element.child[index].id)
          //   }
          //   const value = idArray.filter(v => this.creFrom.tag_id.includes(v))
          //   if (value.length === 0) this.re[index] = undefined
          //   this.re[index] = value
          // }
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
      if (!isJpgOrPng) return this.$message.error('请上传pdf或者ppt文件!')
      const isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) return this.$message.error('文件上限 100MB!')
      if (type === 'ppt' || type === 'pptx') this.$nextTick(() => { this.form.setFieldsValue({ title: file.name.split('.')[0] }) })
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
</style>
