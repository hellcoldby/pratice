import { AxiosRequestConfig } from "./types";
export default  class Axios {
    // T用来限制响应对象 response 里的data 类型
    request<T>(config: AxiosRequestConfig): Promise<T>{
        return this.dispatchRequest(config);
    }

    dispatchRequest<T>(config: AxiosRequestConfig): Promise<T>{
        return new Promise<T>(function(resolve, reject){
            let request = new XMLHttpRequest();
            let { url, method } = config;
            if(params && typeof params === 'object'){
                
            }
            request.open(method, url, true);
        });
    }
}

