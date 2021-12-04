import request from "../../../utils/request";
import PubSub from "pubsub-js";

Page({
     /**
      * 页面的初始数据
      */
     data: {
          day: "",
          month: "",
          recommendSongs: [],
          index: 0,//点击音乐的下标
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          //更新日期
          this.setData({
               //获得此月的日期
               day: new Date().getDate(),
               //获得此年的月份
               month: new Date().getMonth() + 1
          });

          //获取用户信息
          let userInfo = wx.getStorageSync("userInfo");

          //用户不存在，提示信息，跳转登录界面
          if (!userInfo){
               wx.showToast({
                    title: "请登录",
                    icon: "none",
                    success: () => {
                         //跳转至登录界面
                         wx.navigateTo({
                              url: "../../../pages/login/login"
                         });
                    }
               });
          }

          //获取每日推介歌曲
          this.getRecommendSongs();

          //订阅来自songDetail页面发布的消息
          PubSub.subscribe("switch-type", (msg,type) => {
               let {recommendSongs,index} = this.data;
               if (type === "pre"){
                    index -= 1;
               }else{
                    index += 1;
               }

               //网络延迟加载报错解决
               if (recommendSongs){
                    //判断是否越界
                    if (index < 0){
                         index = recommendSongs.length - 1;
                    }else if(index > recommendSongs.length - 1){
                         index = 0;
                    }
               }

               let musicId = recommendSongs[index].id;

               //更新当前播放音乐的下标
               this.setData({
                    index
               });

               //将musicI回传给songDetail页面
               PubSub.publish("musicId",musicId);
          });
     },

     //获取每日推荐歌曲
     async getRecommendSongs(){
          let recommendSongs = await request("/recommend/songs");
          this.setData({
               recommendSongs: recommendSongs.recommend
          });
     },

     toSongDetail(event){
          let {song,index} = event.currentTarget.dataset;
          //为后文的下一曲/上一曲 切歌做准备
          this.setData({
               index
          });

          //路由跳转传参
          wx.navigateTo({
               url: "/songPackage/pages/songDetail/songDetail?musicId=" + song.id
          });
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