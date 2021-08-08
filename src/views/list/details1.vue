<!--
 * @Author: wangChao
 * @Date: 2021-06-07 13:21:30
 * @LastEditTime: 2021-06-22 14:23:05
 * @LastEditors: wangChao
 * @Description: 详情
 * @FilePath: /guTengBao/src/views/list/details.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->

<template>
  <div class="details">
    <!-- <div class="topTitle">
      <span>{{ infoData.info.title }}</span>
      <div>
        <a-button type="primary" class="button_edit" @click="$refs.project.edit(infoData.info)" v-if="infoData.do_auth">修改单页</a-button>
        <a-button type="primary" class="button_delete" @click="onDelete" v-if="infoData.do_auth">删除单页</a-button>
        <a-button type="primary" class="button_ppt" @click="down($route.query.id, 'ppt', '1')">下载PPT</a-button>
        <a-button type="primary" class="button_pdf" @click="down($route.query.id, 'pdf', '1')">下载PDF</a-button>
      </div>
    </div>
    <div class="center-img">
      <div class="img_wap"><img :src="infoData.info.cover" alt="" srcset=""></div>
    </div>
    <div class="uploadedOn">
      <div>
        <img :src="infoData.info.headimg" alt="" srcset="">
        <span>{{ infoData.info.username }} 上传于 {{ infoData.info.time }}</span>
      </div>
      <div>
        <i>{{ infoData.info.like }}</i><em class="red"><a-icon type="heart" :theme="infoData.is_like ? 'filled' : 'outlined'" two-tone-color="#eb2f96" @click="is_like"/></em>
        <i>{{ infoData.info.download }}</i><em class="yellow">下载</em>
      </div>
    </div>
    <div class="bottom-label">
      <span class="bottom-label-type">{{ infoData.info.typeTag }}</span>
      <span v-for="(item, index) in infoData.tags" :key="index" @click="typeTagEdit(item)">{{ item.tag }} <a-icon type="close" @click.stop="onClose(item.tag)" v-if="infoData.do_auth"/></span>
      <span v-if="infoData.do_auth" class="bottom-label-add">可输入新增标签 <a-icon type="plus" @click="$refs.modal.add()"/></span>
    </div> -->
    <div class="gtb_details_title">{{ infoData.info.title }}</div>
    <div class="gtb_details_lable">
      <span v-for="(item, index) in infoData.tags" :key="index">{{ item }}</span>
    </div>
    <div class="gtb_details_info flex">
      <div class="gtb_details_info_left flex">
        <img :src="infoData.info.headimg" alt="">
        <i>{{ infoData.info.username }}</i>
        <span>{{ infoData.info.time }}</span>
      </div>
      <div class="gtb_details_info_icon">
        <span><img src="@/assets/look.png" alt="">{{ infoData.info.read }}</span>
        <span><img src="@/assets/comment.png" alt="">{{ infoData.info.comment }}</span>
        <span><img src="@/assets/grey-Download.png" alt="">{{ infoData.info.download }}</span>
        <!-- <span><img src="@/assets/heart.png" alt="">{{ infoData.info.like }}</span> -->
        <span><em class="red"><a-icon type="heart" :theme="infoData.is_like ? 'filled' : 'outlined'" two-tone-color="#DC5034" @click="is_like"/></em><i>{{ infoData.info.like }}</i></span>
      </div>
      <div class="gtb_details_info_right flex">
        <div @click="onDelete" v-if="infoData.do_auth">删除文档</div>
        <div @click="$refs.project.edit(infoData.info)" v-if="infoData.do_auth">修改文档</div>
        <div @click="down($route.query.id, 'ppt', '1')" :class="infoData.info.ppt ? '' : 'disabled'">下载PPT</div>
        <div @click="down($route.query.id, 'pdf', '1')" :class="infoData.info.ppt ? '' : 'disabled'">下载PDF</div>
      </div>
    </div>
    <div class="gtb_comment flex">
      <div><img :src="infoData.info.cover" alt=""></div>
      <div>
        <div class="gtb_comment_list" id="data-list-content">
          <div class="gtb_comment_info" v-for="(item, index) in commentList" :key="index">
            <div class="gtb_details_info_left flex">
              <img :src="item.headimg" alt="">
              <i>{{ item.username }}</i>
              <span>{{ item.time }}</span>
            </div>
            <p>{{ item.content }}</p>
          </div>
        </div>
        <div class="gtb_comment_release flex">
          <a-input placeholder="可以备注、评论或补充客户信息" v-model="comment"/>
          <div @click="addComment">发布</div>
        </div>
      </div>
    </div>
    <add-tags ref="modal" @add="onAdd" @edit="onEdit"></add-tags>
    <edit-project ref="project" @edit="onEditProject"></edit-project>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import addTags from './addTag'
import storage from 'store'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import editProject from '@/components/GlobalHeader/modules/OrgModal'
import { userStat } from '@/api/login'
import { download, info, addTag, editTag, deleteTag, like, projectDelete, commentAdd, commentList } from '@/api/index'
export default {
  name: 'Details',
  components: {
    addTags,
    editProject
  },
  data () {
    return {
      commentList: [],
      comment: '',
      processData: '',
      infoData: {
        info: {}
      }
    }
  },
  created () {
    this.getInfo()
    this.getCommentList()
  },

watch: {
  'processData': 'scrollToBottom'
},
  methods: {
    ...mapMutations(['SET_USER_STAT']),
    getCommentList () { // 获取评论列表
      commentList({ pid: this.$route.query.id }).then(res => {
        this.commentList = res.result.list
      })
    },
    addComment () { // 新增评论
      commentAdd({ pid: this.$route.query.id, content: this.comment }).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.commentList = res.result
        this.comment = ''
        this.scrollToBottom()
      })
    },

    scrollToBottom () {
      this.$nextTick(() => {
        var div = document.getElementById('data-list-content')
        div.scrollTop = div.scrollHeight
      })
    },
    onDelete () { // 删除单页
      var _that = this
      this.$confirm({
        title: '确定要删除?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          projectDelete({ pid: _that.$route.query.id }).then(res => {
            if (res.code !== 200) return _that.$message.error(res.msg)
            _that.$message.success(res.msg)
            _that.$router.history.go('-1')
          })
        }
      })
    },
    onClose (tag) { // 删除tag
      var _that = this
      this.$confirm({
        title: '确定要删除?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk () {
          deleteTag({ pid: _that.$route.query.id, tag }).then(res => {
            if (res.code !== 200) return _that.$message.error(res.msg)
            _that.$message.success(res.msg)
            _that.getInfo()
          })
        }
      })
    },
    onAdd (param) { // 新增tag
      addTag(param).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.getInfo()
        this.$refs.modal.successSubmit()
        this.$refs.modal.handleCancel()
      })
    },
    onEdit (param) { // 修改tag
      editTag(param).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.getInfo()
        this.$refs.modal.successSubmit()
        this.$refs.modal.handleCancel()
      })
    },
    typeTagEdit (item) { // 打开编辑tag弹窗
      if (this.infoData.do_auth) this.$refs.modal.edit(item)
    },
    down (pid, type, name) { // 下载
      download({ pid, type }).then(res => {
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
    getInfo () { // 获取数据
      info({ pid: this.$route.query.id }).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.infoData = res.result
      })
    },
    is_like () { // 点赞/取消
      like({ pid: this.$route.query.id }).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        // this.getInfo()
        this.infoData.info.like = res.result.like
        this.infoData.is_like = res.result.is_like
        this.getUserStat()
      })
    },
    getUserStat () {
      userStat().then(res => {
        this.SET_USER_STAT(res.result.info)
      })
    },
    onEditProject (params) { // 修改单页
       var formData = new FormData()
      if (params.ppt) formData.append('ppt', params.ppt)
      if (params.pdf) formData.append('pdf', params.pdf)
      formData.append('title', params.title)
      formData.append('type', params.type)
      formData.append('describe', params.describe)
      formData.append('session_id', storage.get(ACCESS_TOKEN))
      formData.append('pid', this.$route.query.id)
      const config = {
        header: { 'content-type': 'multipart/form-data' }
      }
      this.$http.post('/project/edit', formData, config).then(res => {
        if (res.code !== 200) return this.$message.error(res.msg)
        this.$message.success(res.msg)
        this.getInfo()
        this.$refs.project.successSubmit()
        this.$refs.project.handleCancel()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.flex {
  display: flex;
  align-items: center;
}
i {
  font-style: normal;
}
.details {
  background-color: #F4F4F4;
  padding: 50px 300px;
  height: calc(100% - 120px);
  .gtb_details_title {
    font: normal normal bold 36px Microsoft YaHei;
    color: #353940;
    text-align: center;
  }
  .gtb_details_lable {
    margin: 15px 0 68px;
    font: normal normal normal 20px/26px Microsoft YaHei;
    color: #858585;
    text-align: center;
    margin-top: 15px;
    span {
      margin-right: 5px;
    }
    span:last-child {
      margin-right: 0;
    }
  }
  .gtb_details_info_left {
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
      }
      span {
        font: normal normal normal 16px/23px Microsoft YaHei;
        color: #858585;
        margin-right: 12px;
      }
    }
  .gtb_details_info {
    justify-content: space-between;
    .gtb_details_info_icon {
      font: normal normal normal 16px/23px Microsoft YaHei;
      color: #858585;
      span {
        display: inline-flex;
        align-items: center;
      }
      img {
        height: 20px;
        margin-right: 6px;
        margin-left: 25px;
      }
      em {
        margin-right: 6px;
        margin-left: 25px;
        font-size: 24px;
      }
      i {
        color: #DC5034;
      }
    }
    .gtb_details_info_right {
      div {
        width: 90px;
        height: 30px;
        border-radius: 4px;
        color: #FFFFFF;
        text-align: center;
        font: normal normal bold 16px/30px Microsoft YaHei;
        margin-right: 15px;
        cursor: pointer;
      }
      div:first-child {
        background-color: #F2AF00;
      }
      div:nth-child(2) {
        background-color: #0085C3;
      }
      div:nth-child(3) {
        background-color: #DC7734;
      }
      div:last-child {
        background-color: #CE1111;
        margin-right: 0;
      }
      .disabled {
        background-color: #BCB9B9 !important;
        cursor: not-allowed;
        pointer-events:none;
      }
    }
  }
  .gtb_comment {
    margin-top: 36px;
    height: 511px;
    border-radius: 10px;
    overflow: hidden;
    align-items: flex-start;
    >div:first-child {
      flex: 1;
      // padding-bottom: 56.25%;
      height: 100%;
      position: relative;
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        border-radius: 10px;
      }
    }
    >div:last-child {
      width: 405px;
      background-color: #fff;
      padding: 33px 33px 86px;
      height: 100%;
      position: relative;
      p {
        font: normal normal normal 16px/26px Microsoft YaHei;
        color: #858585;
        margin-top: 5px;
      }
      .gtb_comment_list {
        overflow: hidden;
        overflow-y: auto; //出现垂直滚动条;
        height: 100%;
      }
      .gtb_comment_info {
        margin-top: 20px;
      }
      .gtb_comment_info:nth-child(1) {
        margin-top: 0;
      }
      .gtb_comment_release {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 86px;
        border-top: 1px solid #DEDEDE;
        padding: 35px;
        background-color: #fff;
        input {
          width: 80%;
          height: 36px;
          font: normal normal normal 16px Microsoft YaHei;
        }
        >div {
          width: 70px;
          height: 36px;
          background-color: #7AB800;
          cursor: pointer;
          text-align: center;
          font: normal normal bold 17px/36px Microsoft YaHei;
          color: #FFFFFF;
          margin-left: 15px;
        }
      }
    }
  }
}
.topTitle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 65px;
  height: 165px;
  >span {
    color: #707070;
    font: normal normal bold 60px/79px Microsoft YaHei;
  }
  >div {
    .ant-btn-primary {
      height: 65px;
      width: 190px;
      font-size: 30px;
      border: 1px solid #707070;
      border-radius: 10px;
    }
    .button_edit {
      background-color: #868686;
    }
    .button_delete {
      background: #ff4d4f;
      margin: 0 19px;
    }
    .button_ppt {
      background-color: #EB8A1B;
    }
    .button_pdf {
      margin-left: 19px;
      background-color: #DC3752;
    }
    // .ant-btn-primary:nth-child(1){
    //   background-color: #868686;
    // }
    // .ant-btn-primary:nth-child(2){
    //   margin: 0 19px;
    //   background-color: #EB8A1B;
    // }
    // .ant-btn-primary:nth-child(3){
    //   background-color: #DC3752;
    // }
  }
}
.center-img {
  margin: 0 65px;
  padding: 20px;
  border: 1px solid #707070;
  border-radius: 10px;
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
      border-radius: 10px;
    }
  }
}
.uploadedOn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 35px 70px;
  >div:nth-child(1) {
    display: flex;
    align-items: center;
    img {
      width: 85px;
      height: 85px;
      border-radius: 50%;
      border: 3px solid #C5C5C5;
      margin-right: 20px;
    }
    span {
      font: normal normal bold 40px/52px Microsoft YaHei;
      color: #686868;
    }
  }
  div:nth-child(2) {
    font: normal normal bold 40px/52px Microsoft YaHei;
    color: #ADADAD;
    i, em {
      font-style: normal;
    }
  }

}
.red {
  color: #DC5034;
  margin: 0 30px 0 10px;
}
.yellow {
  color: #EB8A1B;
  margin-left: 10px;
}
.bottom-label {
  padding: 0 80px;
  display: flex;
  flex-wrap: wrap;
  .bottom-label-type {
    background-color: #5C646A;
  }
  span {
    height: 65px;
    margin-right: 30px;
    padding: 10px 20px 13px;
    color: #fff;
    font-size: 30px;
    background-color: #B3B3B3;
    border: 1px solid #707070;
    border-radius: 10px;
    margin-bottom: 20px;
    i {
      margin-left: 10px;
    }
  }
  .bottom-label-add{
    background-color: #fff;
    color:  #A9A9A9;
  }
}
</style>
