<template>
    <iframe :src="pdfUrl" frameborder="0" width="100%" height="100%"></iframe>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { onMounted,ref } from 'vue';
import api from '@/api/index'
const route = useRoute()
const pdfUrl = ref("")
onMounted(()=>{
    api.getPerviewPDF({id:route.params.id})
    .then(res=>{
        if(res.status === 200){
            pdfUrl.value = "http://localhost:3000/" + res.result.url
        }
    }).catch(err => {
        console.log(err);
    })
})
</script>