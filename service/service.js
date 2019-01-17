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
    this._defaultHeader.Authorization = "Token " + key;
  }

  /**
   * 统一的异常处理方法
   */
  errorHander(res) {
    console.error(res)
  }


  /**
   * function: 微信code登录
   * parameter: {js_code: 微信code}
   * return: {code:0, data"token"}
  */
  wxlogin(code, api = null) {
    let data = { js_code: code }
    let url = (api == null ? this._baseUrl + '/api/wx-auth/' : api)
    return this._request.postRequest(url, data).then(res => res.data)
  }
  

  /**
   * function: 查询漫画列表
   * parameter: {name:全部/搜索名称查询，api:翻页}
   * return: {code:0,count:20,data:[{mid:"3216",...},...],links:{next:'api?page=2',previous:null}}
   */
  getCartoonList(name = null,api = null) {
    let data = ( name==null ? {} : {name:name} )
    let url = (api == null ? this._baseUrl + '/api/spider/books/' : api )
    return this._request.getRequest(url, data).then(res => res.data)
  }

  /**
   * function: 查询某篇漫画详情
   * parameter: {mid：单本漫画识别id，api：章节翻页}
   * return: {code:0,count:20,data:[{mid:"3216",...},...],links:{next:'api?page=2',previous:null}}
   */
  getCartoonInfo(mid = 0, api = null) {
    let data = { }
    let url = (api == null ? this._baseUrl + '/api/spider/books/' + mid : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }

  /**
   * function: 获取某篇漫画章节
   * parameter: {mid：单本漫画识别id，api：章节翻页}
   * return: {code:0,count:20,data:[{mid:"3216",cid:"65536",...},...],links:{next:'api?page=2',previous:null}}
   */
  getCartoonDetail(mid = 0, api = null) {
    let data = {}
    let url = (api == null ? this._baseUrl + '/api/spider/books/' + mid + '/chapters/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }


  /**
   * function: 获取某章节漫画内容
   * parameter: {cid: 单个章节识别id，api：内容翻页}
   * return: {code:0,count:20,data:[{cid:"65536",page_no:1,...},...],links:{next:'api?page=2',previous:null},chapter_link:{next_cid:"28574", previous_cid: null}}
   */
  getCartoonContent(cid = 1570, api = null) {
    let data = {}
    let url = (api == null ? this._baseUrl + '/api/spider/chapters/' + cid +'/pages/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }

}

export default service
