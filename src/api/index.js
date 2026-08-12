import axios from "@/utils/request";
import base from "./base";

const api = {
    //登录接口
    getLogin(params){
        return axios.post(base.login,params)
    },
    getRouter(params){
        return axios.get(base.router,{params})
    },
    getLineData(){
        return axios.get(base.line)
    },
    //获取project 表数据
    getProjectInfo(params){
        return axios.get(base.projectInfo,{params})
    },
    //模糊查询
    getSearchInfo(params){
        return axios.get(base.searchInfo,{params})
    },
    //获取project总数
    getProjectCount(){
        return axios.get(base.projectCount)
    },
    //给project表添加项目信息
    addProjectInfo(params){
        return axios.post(base.addProjectInfo,params)
    },
    //search info by id
    getInfoById(params){
        return axios.get(base.projectInfoById,{params})
    },
    updateProjectInfo(params){
        return axios.put(base.projectInfoUpdate,params)
    },
    deleteProjectInfo(params){
        return axios.get(base.deleteProjectInfo,{params})
    },
    //获取tunnel一级tree
    getTunnelList(){
        return axios.get(base.tunnelList)
    },
    //获取tunnel二级tree
    getTunnelListChild(params){
        return axios.get(base.tunnelListChild,{params})
    },
    //获取tunnel content
    getTunnelContent(params){
        return axios.get(base.tunnelContent,{params})
    },
    //更新隧道信息url
    updateTunnelContentUrl(params){
        return axios.get(base.tunnelContentUrl,{params})
    },
    //预览pdf
    getPerviewPDF(params){
        return axios.get(base.perviewPDF,{params})
    },
    //获取用户列表
    getUserList(){
        return axios.get(base.userList)
    },
    //搜索用户
    searchUser(params){
        return axios.get(base.userSearch,{params})
    },
    //add user
    addUser(params){
        return axios.get(base.addUser,{params})
    },
    //delete user
    deleteUser(params){
        return axios.get(base.deleteUser,{params})
    },
    //preview user
    previewUser(params){
        return axios.get(base.previewUser,{params})
    },
    //alter user
    updateUser(params){
        return axios.get(base.updateUser,{params})
    }
}
export default api


