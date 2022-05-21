import axios, { AxiosRequestConfig }  from './axios';




let user = {
    name: 'John',
    password: '123456'
}

axios({
    method: 'get',
    url: 'https://www.baidu.com',
    params: user
}).then((response: AxiosRequestConfig) =>{
    console.log(response);
    
})