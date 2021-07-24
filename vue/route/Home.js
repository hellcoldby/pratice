/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-07-24 22:20:11
 * @LastEditors: ygp
 * @LastEditTime: 2021-07-24 22:46:56
 */


export default {
  template: '<p>home page</p>',
  computed: {
    username() {
      console.log(this.$route);
      // 我们很快就会看到 `params` 是什么
      return this.$route.params.username
    }
  },
  methods: {
    goBack() {
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/')
    }
  }
}