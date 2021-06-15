import jsonp from 'jsonp'
/**
 *
 *
 * 使用jsonp发送请求获取数据，返回一个promise对象
 * @param {string} url
 * @param {JSON} data
 * @param {JSON} opt
 * @return {Promise} result
 */
export default function reqData(url,data,opt){
  // jsonp只能发送get请求
  // url?k=v&k=v...
  // 讲json格式的data转换成字符串
  url += '?'
  let str = ''
  for(let key in data){
    str += `&${key}=${data[key]}`
  }
  str = str.slice(1)
  url = url + str
  // 封装jsonp发送请求，返回promise对象
  return new Promise((resolve,reject)=>{
    jsonp(url,opt,(err,data)=>{
      if(err){
        reject(err)
      }else{
        resolve(data)
      }
    })
  })

}