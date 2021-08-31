<template>
  <div>
    <div class="list-item" v-for="(item, index) in radioList" :key="index">
      <div class="item-name">
        <span v-if="item.disableCheckbox" >{{ item.tag }}</span>
        <div v-if="item.disableCheckbox">
          <a-radio-group v-model="value[index]">
            <i>{{ getValue(item.child, index) }}</i>
            <!-- <a-radio-group v-decorator="['biaoqian' + item, {initialValue: getValue(item.child), rules: [{required: true, message: '请选择！'}]}]"> -->
            <a-radio :value="item.id" v-for="items in item.child" :key="items.id">{{ items.tag }}</a-radio>
          </a-radio-group>
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
        return [50, 28]
      }
    }
  },
  data () {
    return {
      value: []
    }
  },
  methods: {
    gtbFilter (a) {
      console.log(this)
      // let intersection = a.filter(v => b.includes(v))
      a.filter(function (v) { return this.tagId.indexOf(v) > -1 })
    },
    getValue (a, index) {
      var idArray = []
      for (let index = 0; index < a.length; index++) {
        if (a[index].id) idArray.push(a[index].id)
      }
      const value = idArray.filter(v => this.tagId.includes(v))
      // this.$nextTick(() => {
        // for (let index = 0; index < a.length; index++) {
        //   this.get
        // }
      // })
       this.value[index] = value[0]
       console.log(this.value)
    }
  }
}
</script>
