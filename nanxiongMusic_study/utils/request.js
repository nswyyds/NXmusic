//发送ajax请求
/**
 * 1.封装功能函数
 * 2.封装功能组件
 */

import config from './config'

export default (url,data={},method="GET") => {
    return new Promise((resolve,reject) => {
        //1.new Promise初始化promise实例的状态为pending
        wx.request({
            url:config.host + url,
            data,
            method,
            header: {
                cookie: wx.getStorageSync("cookies")?wx.getStorageSync("cookies").find(item => item.indexOf("MUSIC_U") !== -1):""
            },

            success: (res) => {
                //修改promise的状态为成功状态resolved
                if(data.isLogin){
                    //将用户的cookie存储到本地
                    wx.setStorage({
                        key: "cookies",
                        data: res.cookies
                    });
                }
                resolve(res.data);
            },

            fail: (err) => {
                //修改promise的状态为失败状态rejected
                reject(err);
            }
        })
    })

}