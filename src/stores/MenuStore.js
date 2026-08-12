import { defineStore } from "pinia";

export const useMenuStore = defineStore('menus',{
    state:()=>{
        return{
            menusList:[],
            isCollapse:false,
            breadcrumb:'首页',
        }
    },
    persist:{
        enable:true,
        strategies:[
            {
                key:'menus',
                storage:localStorage
            }
        ]
    }
})
