/**
 * 通过加入 Vue 的修饰符（Modifiers），
 * 可以让一个指令完美兼容两种高频场景：v-debounce="fn"：默认/立即执行（适合按钮防重点击，一触即发）。
 * v-debounce.delay="fn"：延迟执行（适合输入框打字搜索，停顿后触发）。
 * 
 * 1. 扩展后的自定义指令 (directives/debounce.js)
 * 我们通过判断 binding.modifiers.delay 是否为 true，来动态切换执行逻辑：
 * 
 * 展示 Loading 动画和控制按钮 disabled 属性的能力
 * 
 * 1. The Ultimate Directive (directives/debounce.js)
 * This refined version auto-detects async functions or functions that return Promises.
 *  It manages disabled attributes and Element Plus loading classes dynamically:
 */

export const debounceDirective = {
    mounted(el, binding) {
        if (typeof binding.value !== 'function') return;

        const wait = binding.arg ? Number(binding.arg) : 400;
        const isDelayMode = binding.modifiers.delay;
        let timeout = null;
        let isExecuting = false; // Prevents overlapping executions

        // Helper to safely toggle loading & disabled state
        const toggleLoadingState = (show) => {
            if (show) {
                isExecuting = true;
                el.classList.add('is-loading');
                el.setAttribute('disabled', 'disabled');
                // Optional: Insert Element Plus loading spinner icon if it's an el-button
                if (el.classList.contains('el-button') && !el.querySelector('.el-icon-loading')) {
                    const icon = document.createElement('i');
                    icon.className = 'el-icon-loading el-icon--left';
                    el.insertBefore(icon, el.firstChild);
                }
            } else {
                isExecuting = false;
                el.classList.remove('is-loading');
                el.removeAttribute('disabled');
                const icon = el.querySelector('.el-icon-loading');
                if (icon) icon.remove();
            }
        };

        // Execution wrapper that handles promises and loading states
        const executeHandler = async (event) => {
            if (isExecuting) return;
            try {
                toggleLoadingState(true);
                // Execute the actual handler and await if it returns a Promise
                await binding.value(event);
            } finally {
                toggleLoadingState(false);
            }
        };

        // 1. Debounce handler
        el._vueDebounceHandler = function (event) {
            if (isExecuting) return;
            if (timeout) clearTimeout(timeout);

            if (isDelayMode) {
                timeout = setTimeout(() => {
                    executeHandler(event);
                }, wait);
            } else {
                const callNow = !timeout;
                timeout = setTimeout(() => {
                    timeout = null;
                }, wait);

                if (callNow) executeHandler(event);
            }
        };

        // 2. Enter key handler
        el._vueKeydownHandler = function (event) {
            if (event.key !== 'Enter' || isExecuting) return;
            if (timeout) clearTimeout(timeout);
            executeHandler(event);
        };

        // 3. Bind elements (Supports Element Plus wrapper structure)
        const isInputTag = el.tagName === 'INPUT' || el.tagName === 'TEXTAREA';
        const targetEl = isDelayMode && !isInputTag ? (el.querySelector('input') || el) : el;
        const eventType = isDelayMode ? 'input' : 'click';

        targetEl.addEventListener(eventType, el._vueDebounceHandler);
        if (isDelayMode) {
            targetEl.addEventListener('keydown', el._vueKeydownHandler);
        }

        el._vueDebounceTarget = targetEl;
        el._vueDebounceType = eventType;
    },

    beforeUnmount(el) {
        if (el._vueDebounceTarget) {
            if (el._vueDebounceHandler) {
                el._vueDebounceTarget.removeEventListener(el._vueDebounceType, el._vueDebounceHandler);
            }
            if (el._vueKeydownHandler) {
                el._vueDebounceTarget.removeEventListener('keydown', el._vueKeydownHandler);
            }
            delete el._vueDebounceHandler;
            delete el._vueKeydownHandler;
            delete el._vueDebounceTarget;
            delete el._vueDebounceType;
        }
    }
};

/***
 * 2. How to Use in Your ComponentTo make this work flawlessly, 
 * your event handler function must return the API Promise chain.
 *  Simply add a return statement in front of your api call:
 * 
 * 
 */
// Why this is incredibly powerful:Zero State Boilerplate: You no longer need to define const 
// loading = ref(false) variables across dozens of components just to manage UI button lockouts.
// Native Element Plus Theme Compatibility: Adding the .is-loading class and 
// injecting the .el-icon-loading node mimics Element Plus's native :loading="true" design seamlessly.
// Double Guarding Protection: Even if a user bypasses HTML constraints, 
// the isExecuting flag inside the JavaScript closure acts as a hard lockdown wall 
// until .finally() resolves.

/* <template>
  <div class="search-box" style="display: flex; gap: 10px;">
    <!-- Input Field: Debounces input, instantly triggers on Enter, disables during API requests -->
    <el-input 
      v-model="searchInfo" 
      v-debounce:500.delay="searchHandler" 
      placeholder="Type to search or press Enter..." 
    />

    <!-- Button: Instantly triggers, blocks double clicks, locks and shows loading spinner until API resolves -->
    <el-button 
      type="primary" 
      v-debounce="searchHandler"
    >
      Search
    </el-button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const searchInfo = ref('')

const searchHandler = () => {
    if (!searchInfo.value) {
        ElMessage.info('Please enter search query')
        return;
    }
    
    // CRITICAL: You must RETURN the Promise chain so the directive knows when it ends
    return api.getSearchInfo({ search: searchInfo.value.trim() })
        .then(res => {
            tableData.lists = res.result
        })
        .catch(err => {
            ElMessage.error(err)
        })
}
</script> */


