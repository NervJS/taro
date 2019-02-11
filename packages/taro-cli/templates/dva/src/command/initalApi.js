
import api from './api'
// 发送网络请求数据
api.send = function (thz, payload) {
  thz.props.dispatch({ type: 'fetch/send', payload })
}

// 设置值
api.setValue = function (thz, modalName, payload) {
  thz.props.dispatch({ type: `${modalName}/setValue`, payload })
}

// 切换model列表
api.clearList = function (thz, payload) {
  payload.forEach((e) => {
    thz.props.dispatch({ type: `${e}/clear` })
  })
}

// 切换弹出层显示
api.toggleModal = function (thz, modelName, state) {
  thz.props.dispatch({
    type: `${modelName}/setValue`,
    payload: {
      isShowModal: state !== undefined ? state : false
    }
  })
}

// 设置
api.toggleShow = function (thz, modelName) {
  thz.props.dispatch({
    type: `${modelName}/setValue`,
    payload: {
      isShow: false
    }
  })
}

// 修改弹出层选中
api.changeSelectModal = function (thz, modelName, data) {
  thz.props.dispatch({
    type: `${modelName}/setValue`,
    payload: {
      childrenData: data
    }
  })
}

// 重置弹出层数据源
api.resetModal = function (thz, modelName) {
  thz.props.dispatch({
    type: `${modelName}/setValue`,
    payload: {
      isShowModal: false,
      childrenData: {}
    }
  })
}

// 修改弹出层输入
api.changeModalInput = function (thz, modelName, keys, value, childrenData) {
  thz.props.dispatch({
    type: `${modelName}/setValue`,
    payload: {
      childrenData: {
        ...childrenData,
        [keys]: value
      }
    }
  })
}

// 清空单个model
api.clear = function (thz, modelName, payload) {
  thz.props.dispatch({ type: `${modelName}/clear`, payload })
}
