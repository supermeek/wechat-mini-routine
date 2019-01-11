/**
 * name: http.js
 * description: request服务
 * author: 王星月
 * date: 2019-1-9
 */
import request from './request.js'
class service {
  constructor() {
    this._baseUrl = 'http://yueyatianchong.cn'
    this._defaultHeader = {
      'content-type':'application/json; charset=UTF-8',
    }
    this._request = new request
    this._request.setErrorHandler(this.errorHander)
    this._request._header = this._defaultHeader
    
  }

  setHeader( key ){
    console.log("设置header")
    this._defaultHeader.Authorization = "Token " + key;
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }

  /**
   * 登录
  */
  
  login(api = null) {
    let data = { username: 'pangzi', password: 'Xingyue99'}
    let url = (api == null ? this._baseUrl + '/api/login/' : api)
    return this._request.postRequest(url, data).then(res => res.data)
  }
  


  /**
   * 查询漫画列表
   */
  getCartoonList(api = null) {
    let data = {}
    let url = (api == null ? this._baseUrl + '/api/spider/books/' : api )
    return this._request.getRequest(url, data).then(res => res.data)
  }

  /**
   * 获取某篇漫画章节
   */
  getCartoonDetail(mid = 1570, api = null) {
    let data = {}
    let url = (api == null ? this._baseUrl + '/api/spider/books/' + mid + '/chapters/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }

  /**
   * 获取某章节漫画内容
   */
  getCartoonContent(cid = 1570, api = null) {
    let data = {}
    let url = (api == null ? this._baseUrl + '/api/spider/chapters/' + cid +'/pages/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }

}

export default service