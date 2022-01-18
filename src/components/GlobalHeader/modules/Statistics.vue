<template>
  <div class="gtb_statistics">
    <div v-for="(item, index) in statisticsData" :key="index" @click="jump(index)">
      <img :src="item" alt="">
      <p v-if="index == 1">{{ userStat.upload }}</p>
      <p v-else-if="index == 2">{{ userStat.download }}</p>
      <p v-else-if="index == 3">{{ userStat.like }}</p>
      <p v-else>排行榜</p>
    </div>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
  },
  data () {
    return {
      statisticsData: [require('@/assets/ranking-list.jpeg'), require('@/assets/cloud-upload.png'), require('@/assets/cloud-download.png'), require('@/assets/heart.png')],
      infoArray: []
    }
  },
  mounted () {
  },
  computed: {
    userStat () {
      return this.$store.getters.userStat || {}
    }
  },
  watch: {
    userStat: {
      immediate: true,
      handler: function (newval) {
        // this.setUserStat(newval)
      }
    }
  },
  methods: {
    // setUserStat (info) {
    //   this.infoArray = [info.upload, info.download, info.like]
    // }
    jump (index) {
      if (index === 0) this.$router.push({ name: 'ranking' })
    }
  }
}
</script>

<style lang="less" >
 .gtb_statistics {
   display: flex;
   img {
     height: 20px;
   }
   >div {
     text-align: center;
     p {
       margin-bottom: 0;
     }
   }
   >div:nth-child(1) {
     color: rgb(174, 65, 77);
     margin-right: 40px;
     cursor: pointer;
   }
   >div:nth-child(2) p {
     color: #0085C3;
   }
   >div:nth-child(3) {
     margin: 0 40px;
    p {
      color: #F2AF00;
    }
   }
   >div:nth-child(4) p {
     color: #DC5034;
   }
 }
</style>
