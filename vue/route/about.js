/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-07-24 22:20:19
 * @LastEditors: ygp
 * @LastEditTime: 2021-07-24 22:47:14
 */

export default {
    template: '<p>about page</p>' ,
    computed: {
      username() {
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