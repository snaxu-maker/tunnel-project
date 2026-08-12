import { reactive } from 'vue'
export const addFormRules = reactive({
    name: [
        { required: true, message: '请输入项目名称', trigger: 'blur' },
        { min: 3, max: 10, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    number: [
        {
            required: true,
            message: '请输入项目数量',
            trigger: 'blur',
        },
    ],
    money: [
        {
            required: true,
            message: '请输入项目金额',
            trigger: 'blur',
        },
    ],
    address: [
        {
            required: true,
            message: '请输入项目地址',
            trigger: 'blur',
        },
    ],
    duration: [
        {
            required: true,
            message: '请输入项目工期',
            trigger: 'blur',
        },
    ],
    startTime: [
        {
            type: 'date',
            required: true,
            message: '请选择开工日期',
            trigger: 'change',
        },
    ],
    endTime: [
        {
            type: 'date',
            required: true,
            message: '请选择结束日期',
            trigger: 'change',
        },
    ],
    quantity: [
        {
            required: true,
            message: '请输入项目数量',
            trigger: 'blur',
        },
    ],
    status: [
        { required: true, message: '请输入0或1', trigger: 'change' },
    ],
    remark: [
        { required: true, message: '请为项目输入一些备注', trigger: 'blur' },
        { min: 10, message: '备注内容不能少于10个字', trigger: 'blur' }
    ],
})