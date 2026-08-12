import { defineStore } from "pinia";

export const useLoginStore = defineStore('login',{
    state:()=>{
        return {
            username:'',
            token:'',
            permission:''
        }
    },
    persist:{
        enable:true,
        strategies:[
            {
                key:'count',
                storage:localStorage
            }
        ]
    }
    
})