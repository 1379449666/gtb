<template>
  <div>
    <global-header v-if="$route.path !== '/ranking'"/>
    <router-view />
    <!-- <global-footer /> -->
  </div>

</template>

<script>
// import { SettingDrawer, updateTheme } from '@ant-design-vue/pro-layout'
// import { i18nRender } from '@/locales'
// import { mapState } from 'vuex'
// import { CONTENT_WIDTH_TYPE, SIDEBAR_TYPE, TOGGLE_MOBILE_TYPE } from '@/store/mutation-types'

// import defaultSettings from '@/config/defaultSettings'
import GlobalHeader from '@/components/GlobalHeader/index1'
import GlobalFooter from '@/components/GlobalFooter'
// import LogoSvg from '../assets/logo.svg?inline'

export default {
  name: 'BasicLayout',
  components: {
    // SettingDrawer,
    GlobalHeader,
    GlobalFooter
    // LogoSvg
  },
  data () {
    return {
      // preview.pro.antdv.com only use.
      // isProPreviewSite: process.env.VUE_APP_PREVIEW === 'true' && process.env.NODE_ENV !== 'development',
      // // end
      // isDev: process.env.NODE_ENV === 'development' || process.env.VUE_APP_PREVIEW === 'true',

      // // base
      // menus: [],
      // // 侧栏收起状态
      // collapsed: false,
      // title: defaultSettings.title,
      // settings: {
      //   // 布局类型
      //   layout: defaultSettings.layout, // 'sidemenu', 'topmenu'
      //   // CONTENT_WIDTH_TYPE
      //   contentWidth: defaultSettings.layout === 'sidemenu' ? CONTENT_WIDTH_TYPE.Fluid : defaultSettings.contentWidth,
      //   // 主题 'dark' | 'light'
      //   theme: defaultSettings.navTheme,
      //   // 主色调
      //   primaryColor: defaultSettings.primaryColor,
      //   fixedHeader: defaultSettings.fixedHeader,
      //   fixSiderbar: defaultSettings.fixSiderbar,
      //   colorWeak: defaultSettings.colorWeak,

      //   hideHintAlert: false,
      //   hideCopyButton: false
      // },
      // 媒体查询
      // query: {},

      // 是否手机模式
      // isMobile: false
    }
  },
  computed: {
    // ...mapState({
    //   // 动态主路由
    //   mainMenu: state => state.permission.addRouters
    // })
  },
  created () {
    // const routes = this.mainMenu.find(item => item.path === '/')
    // this.menus = (routes && routes.children) || []
    // // 处理侧栏收起状态
    // this.$watch('collapsed', () => {
    //   this.$store.commit(SIDEBAR_TYPE, this.collapsed)
    // })
    // this.$watch('isMobile', () => {
    //   this.$store.commit(TOGGLE_MOBILE_TYPE, this.isMobile)
    // })
  },
  mounted () {
    // const userAgent = navigator.userAgent
    // if (userAgent.indexOf('Edge') > -1) {
    //   this.$nextTick(() => {
    //     this.collapsed = !this.collapsed
    //     setTimeout(() => {
    //       this.collapsed = !this.collapsed
    //     }, 16)
    //   })
    // }

    // // first update color
    // // TIPS: THEME COLOR HANDLER!! PLEASE CHECK THAT!!
    // if (process.env.NODE_ENV !== 'production' || process.env.VUE_APP_PREVIEW === 'true') {
    //   updateTheme(this.settings.primaryColor)
    // }
  },
  methods: {
    // i18nRender,
    // handleMediaQuery (val) {
    //   this.query = val
    //   if (this.isMobile && !val['screen-xs']) {
    //     this.isMobile = false
    //     return
    //   }
    //   if (!this.isMobile && val['screen-xs']) {
    //     this.isMobile = true
    //     this.collapsed = false
    //     this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
    //     // this.settings.fixSiderbar = false
    //   }
    // },
    // handleCollapse (val) {
    //   this.collapsed = val
    // },
    // handleSettingChange ({ type, value }) {
    //   console.log('type', type, value)
    //   type && (this.settings[type] = value)
    //   switch (type) {
    //     case 'contentWidth':
    //       this.settings[type] = value
    //       break
    //     case 'layout':
    //       if (value === 'sidemenu') {
    //         this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fluid
    //       } else {
    //         this.settings.fixSiderbar = false
    //         this.settings.contentWidth = CONTENT_WIDTH_TYPE.Fixed
    //       }
    //       break
    //   }
    // }
  }
}
</script>

<style lang="less">
@import "./BasicLayout.less";
</style>
