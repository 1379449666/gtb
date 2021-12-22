<!--
 * @Author: bert
 * @Date: 2021-08-30 15:58:32
 * @LastEditTime: 2021-11-07 17:13:56
 * @LastEditors: bert
 * @Description: type
 * @FilePath: /guTengBao/src/components/GlobalHeader/modules/Radio.vue
 * 我家门前有两棵树，一棵是枣树，另一棵也是枣树。
-->
<template>
  <div class="gtb-radios">
    <div class="list-item" v-for="(item, index) in radioList" :key="index">
      <div class="item-name" :class="[item.flag ? 'child-radio' : '', item.title=='售卖模式' ? 'flex' : '']">
        <span >{{ item.title }}{{ item.title=='聚类标签' || item.title=='行业标签' || item.title=='售卖模式' ? ':' : '' }}</span>
        <span v-if="item.title=='聚类标签'" class="sx-notes">(建议尽可能全面勾选包含的品类标签)</span>
        <span v-if="item.title=='行业标签'" class="sx-notes">(案例、报告建议勾选对应行业, 方便检索查询)</span>
        <div v-if="item.tag.length > 0" class="margin-left-50">
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
  .item-name .sx-notes {
    color: #ccc;
    line-height: 19px;
    margin-bottom: 0;
    margin-left: 10px;
  }
  .flex {
    display: flex;
    .margin-left-50 {
      margin-left: 20px;
    }
  }
  .margin-left-50 {
    margin-left: 50px;
  }
}
</style>
