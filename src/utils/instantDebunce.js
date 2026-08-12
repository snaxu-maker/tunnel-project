/**
 * 通用防抖函数 (支持立即执行)
 * @param {Function} func - 需要执行的目标函数
 * @param {number} wait - 盲区/等待时间 (毫秒)
 * @param {boolean} immediate - 是否立即执行 (true 为点击立刻发送，随后防抖)
 * @returns {Function} - 返回包装后的防抖函数
 */
export const debounce = (func, wait = 300, immediate = true) => {
    let timeout = null;

    return function (...args) {
        const context = this;

        // 每次触发，先清除之前的定时器
        if (timeout) clearTimeout(timeout);

        if (immediate) {
            // 如果已经设置了定时器，说明还在点击盲区内，此时不执行
            const callNow = !timeout;

            // 创建一个定时器，在盲区时间结束后，将 timeout 重置为 null
            timeout = setTimeout(() => {
                timeout = null;
            }, wait);

            // 只有在盲区外（timeout 为 null）时，才立刻执行函数
            if (callNow) func.apply(context, args);
        } else {
            // 常规防抖模式：延迟执行
            timeout = setTimeout(() => {
                func.apply(context, args);
            }, wait);
        }
    };
};


import { debounce } from '@/utils/debounce' // 根据你项目的实际路径引入

// 1. 抽取核心的业务逻辑（不要在这里加判断，保持逻辑纯粹）
const doSearch = () => {
    api.getSearchInfo({ search: searchInfo.value.trim() })
        .then(res => {
            tableData.lists = res.result
        })
        .catch(err => {
            ElMessage.error(err)
        })
}

// 2. 使用封装的工具函数进行包装
// 设置 500ms 盲区，第三个参数为 true（点击立刻请求，500ms 内连续点击无效）
const debouncedSearch = debounce(doSearch, 500, true)

/**
 * 按钮绑定的主函数
 */
const searchHandler = () => {
    // 立即拦截空输入（不需要防抖，直接拦截）
    if (!searchInfo.value) {
        return ElMessage.info('请输入查询内容')
    }
    
    // 执行带防抖的请求
    debouncedSearch()
}



/**
 * 把防抖封装成 Vue 的自定义指令（v-debounce），是解决多处按钮重复点击最优雅、代码量最少的方案。
 * 封装完成后，你在模板中只需要写一行 v-debounce="searchHandler"，
 * 就能自动实现“点击立刻发送，随后控制高频连击”的效果。
 * 
 * 1. 编写自定义指令 (directives/debounce.js)在项目中新建或修改指令文件，
 * 利用指令的生命周期钩子（Vue 3 中为 mounted 和 beforeUnmount）来实现：
 * 
 * 2. 全局注册指令 (main.js)打开你的入口文件 main.js，将这个指令注册到全局：
 * import { debounceDirective } from './directives/debounce'
 *  app.directive('debounce', debounceDirective)
** 3. 在组件中丝滑使用现在你的组件代码将变得极其干净。
      你不需要在 JS 中引入任何工具函数，直接写最纯粹的业务逻辑即可：
 */
export const debounceDirective = {
    mounted(el, binding) {
        // binding.value 就是传给指令的函数（如 searchHandler）
        if (typeof binding.value !== 'function') return;

        // 从指令参数中获取等待时间，例如 v-debounce:500="fn" -> 500ms，默认 400ms
        const wait = binding.arg ? Number(binding.arg) : 400;
        let timeout = null;

        // 保存点击事件处理函数，方便在解绑时移除
        el._vueDebounceClick = function (event) {
            if (timeout) clearTimeout(timeout);

            // 立即执行模式的核心：只有在定时器为 null 时才触发
            const callNow = !timeout;

            timeout = setTimeout(() => {
                timeout = null;
            }, wait);

            if (callNow) {
                binding.value(event);
            }
        };

        // 绑定点击事件
        el.addEventListener('click', el._vueDebounceClick);
    },

    beforeUnmount(el) {
        // 组件销毁前，务必移除事件监听，防止内存泄漏
        if (el._vueDebounceClick) {
            el.removeEventListener('click', el._vueDebounceClick);
            delete el._vueDebounceClick;
        }
    }
};

{/* <template>
  <!-- 基础用法：默认 400ms 盲区 -->
  <el-button type="primary" v-debounce="searchHandler">查询</el-button>

  <!-- 进阶用法：支持传参改变盲区时间（例如设置 800ms 防连击） -->
  <el-button type="primary" v-debounce:800="searchHandler">查询</el-button>
</template>

<script setup>
// JS 逻辑保持极简，完全不需要感知防抖的存在
const searchHandler = () => {
    if (!searchInfo.value) {
        return ElMessage.info('请输入查询内容')
    }
    
    api.getSearchInfo({ search: searchInfo.value.trim() })
        .then(res => {
            tableData.lists = res.result
        })
        .catch(err => {
            ElMessage.error(err)
        })
} */}



