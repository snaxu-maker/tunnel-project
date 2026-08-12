import {defineStore} from 'pinia'

export const useToggleStore = defineStore('toggle',{
    state:()=>{
        return{
            logoToggle:true
        }
    },
    persist:{
        enable:true,
        strategies:[
            {
                key:'toggle',
                storage:localStorage
            }
        ]
    }
})

