import axios from "axios";

async function fetchPost(callback) {
    return axios.get("http://www.tianqiapi.com/api?version=v9&appid=23035354&appsecret=8YvlPNrz").then((res) => {
        return callback(res.data);
    });
}

export { fetchPost };
