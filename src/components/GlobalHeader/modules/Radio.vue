<template>
  <div class="gtb-radios">
    <div class="list-item" v-for="(item, index) in radioList" :key="index">
      <div class="item-name" :class="item.flag ? 'child-radio' : ''">
        <span >{{ item.title }}</span>
        <div v-if="item.tag.length > 0">
          <!-- <a-radio-group v-decorator="['biaoqian' + item.id, {initialValue: 5, rules: [{required: true, message: '请选择！'}]}]" @change="onChange"> -->
          <!-- <a-radio-group v-model="tagId[index]" @change="onChange">
            <a-radio :value="items.id" v-for="items in item.tag" :key="items.id">{{ items.tag }}</a-radio>
          </a-radio-group> -->
          <a-checkbox-group v-model="value[index]" @change="onChange" >
            <a-checkbox :value="items.id" v-for="items in item.tag" :key="items.id">{{ items.tag }}</a-checkbox>
          </a-checkbox-group>
        </div>
      </div>
      <div v-if="item.child" class="children-item">
        <radio-list :radioList="item.child"></radio-list>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadioList',
  props: {
    radioList: {
      type: Array,
      default: () => {
        return []
      }
    },
    tagId: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data () {
    return {
      value: this.tagId,
      form: this.$form.createForm(this)
    }
  },
  methods: {
     onChange () {
       this.$emit('radio', this.value.reduce((prev, curr) => (prev.concat(curr)), []))
    }
  }
}
</script>

<style lang="less" scoped>
.gtb-radios {
 .child-radio {
    padding-left: 20px;
  }
  .list-item .ant-checkbox-wrapper {
    margin-left: 0;
    margin-right: 10px;
  }
  .item-name span{
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
  }
}
</style>
