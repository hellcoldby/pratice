/*
 * @Description: 
 * @Author: ygp
 * @Date: 2021-07-24 22:21:31
 * @LastEditors: ygp
 * @LastEditTime: 2021-07-25 21:59:48
 */
import Home from './Home.js' ;
import About from './about.js';
const NotFound = { template: '<p>Page not found</p>' }

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About }
]

// 3. 创建 router 实例，然后传 `routes` 配置
// 你还可以传别的配置参数, 不过先这么简单着吧。
const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
})

new Vue({
    el: '#app',
    router,
})