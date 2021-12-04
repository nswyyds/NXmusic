// pages/text/text.js
import config from "../../utils/config";

Page({

     /**
      * 页面的初始数据
      */
     data: {
          address: "",
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          this.forSources()
     },

     forSources(){
          wx.request({
               url:"https://data.beijing.gov.cn/cms/web/bjdata/api/userApply.jsp",
               data: {id:"796237fbd34f4addb1d237b5e0edde4e58697",key:1634988219425},

               success: (res) => {
                    //对csv文件进行数据解析
                    this.explainCSV(res.data.result.address);
                    this.setData({
                         address: res.data.result.address
                    })

               },

               fail: (err) => {
                    console.log("请求失败")
               }
          })
     },

     explainCSV(csv){
          wx.downloadFile({
               url: csv,
               filePath: wx.env.USER_DATA_PATH + "/res",

               success: (res) => {
                    console.log(res.filePath);

                    wx.openDocument({
                         filePath: res.filePath,
                         success: function (res) {
                              console.log('打开文档成功')
                         },

                         fail: (res) => {
                              console.log(res)
                         }
                    })

               },


               fail: (res) => {
                    console.log(res);
               }
          })
     },



     /**
      * 生命周期函数--监听页面初次渲染完成
      */
     onReady: function () {

     },

     /**
      * 生命周期函数--监听页面显示
      */
     onShow: function () {

     },

     /**
      * 生命周期函数--监听页面隐藏
      */
     onHide: function () {

     },

     /**
      * 生命周期函数--监听页面卸载
      */
     onUnload: function () {

     },

     /**
      * 页面相关事件处理函数--监听用户下拉动作
      */
     onPullDownRefresh: function () {

     },

     /**
      * 页面上拉触底事件的处理函数
      */
     onReachBottom: function () {

     },

     /**
      * 用户点击右上角分享
      */
     onShareAppMessage: function () {

     }
})