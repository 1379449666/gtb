<template>
  <div class="gtb_statistics">
    <div v-for="(item, index) in statisticsData" :key="index">
      <img :src="item" alt="">
      <p>{{ infoArray[index] }}</p>
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
      statisticsData: [require('@/assets/cloud-upload.png'), require('@/assets/cloud-download.png'), require('@/assets/heart.png')],
      infoArray: []
    }
  },
  mounted () {
  },
  computed: {
   userStat () {
      return this.$store.getters.userStat
   }
  },
  watch: {
    userStat: {
      immediate: true,
      handler: function (newval) {
        this.setUserStat(newval)
      }
    }
  },
  methods: {
    setUserStat (info) {
      this.infoArray = [info.upload, info.download, info.like]
      console.log(this.infoArray)
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
   >div:nth-child(1) p {
     color: #0085C3;
   }
   >div:nth-child(2) {
     margin: 0 40px;
    p {
      color: #F2AF00;
      }
   }
   >div:nth-child(3) p {
     color: #DC5034;
   }
 }
</style>
