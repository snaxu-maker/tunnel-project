const base = {
    login:'/login',           //登录接口
    router:'/router' ,         //用户权限地址
    line:'/line',             //图表line地址
    projectInfo:'/project/all',       //project info
    searchInfo:'/project/search',     //project info search
    projectCount:'/project/count',      //project info count
    addProjectInfo:'/project/add',
    projectInfoById:'/project/infoById', //search info by id
    projectInfoUpdate:'/project/updateInfo',
    deleteProjectInfo:'/project/delete',  //
    tunnelList:'/project/list',  //tree 一级目录
    tunnelListChild:'/project/list/child',  //tree 二级目录
    tunnelContent:'/tunnel/content',       //tunnel content
    tunnelContentUrl:'/tunnel/content/url' ,//content url update
    perviewPDF:'/tunnel/pdf',             //perview pdf
    userList:'/user/list' ,               //user list
    userSearch:'/user/search',           //user search
    addUser:'/user/add' ,                  //user search
    deleteUser:'/user/delete',         //user delete
    previewUser:'/user/preview',      //user preview
    updateUser:'/user/update',        //user alter
}
export default base
