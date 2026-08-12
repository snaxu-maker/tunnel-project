import axios from 'axios'
import { ElMessage } from 'element-plus';
// import qs from 'querystring'

// 使用原生 URLSearchParams 代替已弃用的 querystring,也可以使用第三方库query-string
const stringifData = (data)=>{
    if(!data) return ''
    const params = new URLSearchParams()
    for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
            params.append(key, data[key]);
        }
    }
    return params.toString();
}

const getToken = () => {
    // 支持直接 token 保存和 pinia persist 保存
    const rawToken = localStorage.getItem('token')
    if (rawToken) {
        return rawToken
    }

    try {
        const persisted = JSON.parse(localStorage.getItem('count') || '{}')
        return persisted.token || ''
    } catch (error) {
        return ''
    }
}

const instance = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 30000, // 增加超时时间到 30 秒
})
// 请求拦截器中动态注入 token，避免模块初始化时期 token 未定义
instance.interceptors.request.use(
    function (config) {
        const token = getToken();
        if (token) {
            config.headers = config.headers || {}
            config.headers.Authorization = `Bearer ${token}`
        }

        const method = config.method?.toLowerCase()
        if ((method === 'post' || method === 'put') && config.data && typeof config.data === 'object') {
            //config.data = qs.stringify(config.data) //将请求数据转化为 application/x-www-form-urlencoded （username=%E5%BC%A0+%E4%B8%89&password=123%26abc）
            // 明确指定内容类型，确保后端能正确解析 application/x-www-form-urlencoded
            config.data = stringifData(config.data)
            config.headers = config.headers || {}
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        return config
    },
    function (error) {
        // 必须 return，否则错误无法在链条中传递
        return Promise.reject(error)
    }
)
// 提取错误信息映射，避免臃肿的 switch-case，更易维护
const ERROR_MESSAGES = {
    400: "语义错误 (Bad Request)",
    401: "服务器认证失败 (Unauthorized)",
    403: "服务器请求拒绝执行 (Forbidden)",
    404: "请检查网络请求地址 (Not Found)",
    500: "服务器发生意外 (Internal Server Error)",
    502: "服务器无响应 (Bad Gateway)",
    503: "服务器有响应，当数据不存在"
};
const errorHandler = (status, info) => {
    const message = ERROR_MESSAGES[status] || info || `连接错误${status}`
    console.log(`[请求错误]:${status}:${message}`);
    // 实际项目中这里通常会替换为 UI 组件库的弹窗，例如：Message.error(message)
    ElMessage.error(message)
    
}
instance.interceptors.response.use(
    function (response) {
        if (response.status >= 200 && response.status <= 300) {
            // 直接返回 response.data，过滤掉 Axios 包装的 headers、status 等，业务层用起来更清爽
            return response.data
        }
        return Promise.reject(response)
    },
    //当网络请求本身出错（如断网、超时、服务器崩溃）或者在上一步被强行 reject 时，会触发这个函数。
    function (error) {
        const { response } = error;
        if (response) {
            // 标准 Axios 的响应数据在 response.data 中
            // 假设后端返回的错误格式为 { message: "xxx" } 或 { info: "xxx" }
            const serverInfo = response.data?.message || response.data?.msg || response.data?.statusText
            errorHandler(response.status, serverInfo)
            return Promise.reject(error)
        } else {
            // 细化无响应时的错误场景
            if (error.message?.includes('timeout')) {
                console.log("网络请求超时，请稍后再试");
            } else {
                console.log("网络请求被中断了或无法连接服务器");
            }
            
        }
        // 核心修正：必须返回 reject，阻止代码进入外部的 .then() 或 try 块
        return Promise.reject(error)

    }
)
export default instance