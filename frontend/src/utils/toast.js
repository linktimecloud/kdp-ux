import { ElNotification } from 'element-plus'
import { isArray } from 'lodash'

const toast = {
  log (message, obj = {}) {
    ElNotification({
      ...obj,
      type: obj.type || 'warning',
      message
    })
  },
  error (title, msgArr, obj = {}) {
    const btnType = obj.type === 'error' ? 'danger' : 'warning'
    const btnOnClick = obj.cb
    const btnId = `toast-btn-${Date.now()}}`
    const textHtml = `
      <div class="flex flex-col">
        ${isArray(msgArr) ? msgArr.map(msg => `<span class="mb-1">${msg}</span>`).join('') : msgArr}
      </div>
      <div class="flex justify-end mt-3">
        <button id="${btnId}" class="el-button el-button--small el-button--${btnType}">查看详情</button>
      </div>
    `
    ElNotification({
      ...obj,
      title,
      type: obj.type || 'error',
      dangerouslyUseHTMLString: true,
      message: textHtml
    })

    document.getElementById(btnId)?.addEventListener('click', () => {
      btnOnClick && btnOnClick()
    })
  }
}

export default toast
