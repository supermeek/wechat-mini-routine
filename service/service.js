/**
 * name: http.js
 * description: request服务
 * author: 王星月
 * date: 2019-1-9
 */
const app = getApp();
import request from './request.js'
class service {
  constructor() {
    this._baseUrl = 'https://yueyatianchong.cn'
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
    // console.error("接口报错了")
    console.error(res)
    console.log(res)
    var that = this;
    if (res.statusCode == 403){
      wx.showModal({
        title: '提示',
        content: '您的账号信息已过期，请退出重新进入',
        success: function () {
          if (res.confirm) {
          } else if (res.cancel) {
          } else {
          }
        },
      })
    }else{
      wx.stopPullDownRefresh()
      wx.hideNavigationBarLoading()
      wx.showToast({
        title: '出错了',
        icon: 'none'
      })
    }
  }


  /**
   * function: 微信code登录
   * method: POST
   * parameter:
        js_code: 微信code
   * response:
        code:0, 
        data"token"
  */
  wxlogin(code, api = null) {
    let data = { js_code: code }
    let url = (api == null ? this._baseUrl + '/api/wx-auth/' : api)
    return this._request.postRequest(url, data).then(res => res.data)
  }
  
  /**  **************漫画****************** */

  /**
   * function: 查询漫画列表
   * method: GET
   * parameter:
        api:翻页
   * request: 
        name:全部/搜索名称查询，
   * response: 
        code:0,
        count:20,
        data:[{mid:"3216",...},...],
        links:{next:'api?page=2',previous:null}
   */
  getCartoonList(name = null,api = null) {
    let data = ( name==null ? {} : {name:name} )
    let url = (api == null ? this._baseUrl + '/api/spider/books/' : api )
    return this._request.getRequest(url, data).then(res => res.data)
  }

  /**
   * function: 查询某篇漫画详情
   * method: GET
   * parameter:
        mid：单本漫画识别id，
        api：章节翻页
   * response: 
        code:0,
        count:20,
        data:[{mid:"3216",...},...],
        links:{next:'api?page=2',previous:null}
   */
  getCartoonInfo(mid = 0, api = null) {
    let data = { }
    let url = (api == null ? this._baseUrl + '/api/spider/books/' + mid + '/': api)
    return this._request.getRequest(url, data).then(res => res.data)
  }

  /**
   * function: 获取某篇漫画章节
   * method: GET
   * parameter:
        mid：单本漫画识别id，
        api：章节翻页
   * request: 
        reverse: false/true 章节排序
   * response: 
        code:0,
        count:20,
        data:[{mid:"3216",cid:"65536",...},...],
        links:{next:'api?page=2',previous:null}
   */
  getCartoonDetail(mid = 0, api = null, reverse = false) {
    let data = reverse ? { reverse: reverse} : {}
    let url = (api == null ? this._baseUrl + '/api/spider/books/' + mid + '/chapters/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }


  /**
   * function: 获取某章节漫画内容
   * method: GET
   * parameter:
        cid: 单个章节识别id，
        api：内容翻页
   * response: 
        code:0,
        count:20,
        data:[{cid:"65536",page_no:1,...},...],
        links:{next:'api?page=2',previous:null},
        chapter_link:{next_cid:"28574", previous_cid: null}
   */
  getCartoonContent(mid = 0, cid = 0, api = null) {
    let data = {}
    let url = (api == null ? this._baseUrl + '/api/spider/books/'+ mid +'/chapters/' + cid +'/pages/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }

  /**
   * function: 收藏某漫画或小说
   * method: POST
   * request:
        mid: 单本漫画识别id，
        source_type：'comic'漫画 / 'novel'小说
   */
  addCollect(mid = 0, source_type, api = null) {
    let data = { mid: mid, source_type: source_type}
    let url = (api == null ? this._baseUrl + '/api/spider/favourites/' : api)
    return this._request.postRequest(url, data).then(res => res.data)
  }


  /**
   * function: 删除收藏
   * method: POST
   * request:
        mid: 单本漫画识别id，
        source_type：'comic'漫画 / 'novel'小说
   */
  removeCollect(mid = 0, source_type, api = null) {
    let data = { mid: mid, source_type: source_type }
    let url = (api == null ? this._baseUrl + '/api/spider/favourites/delete/' : api)
    return this._request.postRequest(url, data).then(res => res.data)
  }


  /**
   * function: 获取收藏列表
   * method: GET
   */
  getCollectList(api = null) {
    let data = {  }
    let url = (api == null ? this._baseUrl + '/api/spider/favourites/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }


  /**  **************小说****************** */

  /**
     * function: 查询小说列表
     * method: GET
     * parameter:
          api:翻页
     * request: 
          name:全部/搜索名称查询，
     */
  getNovelList(name = null, api = null) {
    let data = (name == null ? {} : { name: name })
    let url = (api == null ? this._baseUrl + '/api/spider/novelbooks/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }


  /**
   * function: 查询某篇小说详情
   * method: GET
   * parameter:
        mid：单本小说识别id，
        api：章节翻页
   */
  getNovelInfo(mid = 0, api = null) {
    let data = {}
    let url = (api == null ? this._baseUrl + '/api/spider/novelbooks/' + mid + '/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }

  /**
   * function: 获取某小说章节
   * method: GET
   * parameter:
        mid：单本小说识别id，
        api：章节翻页
   * request: 
        reverse: false/true 章节排序
   */
  getNovelDetail(mid = 0, api = null, reverse = false) {
    let data = reverse ? { reverse: reverse } : {}
    let url = (api == null ? this._baseUrl + '/api/spider/novelbooks/' + mid + '/chapters/' : api)
    return this._request.getRequest(url, data).then(res => res.data)
  }


  /**
     * function: 获取某章节漫画内容
     * method: GET
     * parameter:
          cid: 单个章节识别id，
          api：内容翻页
     */
  getNovelContent(mid = 0, cid = 0, api = null) {
    let data = {}
    let url = (api == null ? this._baseUrl + '/api/spider/novelbooks/' + mid + '/chapters/' + cid + '/': api)
    return this._request.getRequest(url, data).then(res => res.data)
  }

}

export default service
