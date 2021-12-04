// pages/video/video.js
import request from "../../utils/request";

Page({

     /**
      * 页面的初始数据
      */
     data: {
          navItems: [],
          navId: '', //导航标识
          videoList: [],
          videoId: '',
          videoUpdateTime: [],//视频video播放的时长
          isTriggered: false, //标识下拉刷新是否被触发
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          this.getNavItems();
     },

     //获取导航数据
     async getNavItems(){
          let navItems = await request("/video/group/list");
          this.setData({
               navItems: navItems.data.slice(0,14),
               navId: navItems.data[0].id
          });

          this.getVideoList();
     },

     //获取视频列表数据
     async getVideoList(){
          let videoListData = await request("/video/group",{id: this.data.navId});

          //判断是否携带cookie
          if (videoListData.msg === "需要登录"){
               wx.showToast({
                    title: "需要登录",
                    icon: "none"
               })

               wx.navigateTo({
                    url: "/pages/login/login"
               })
          }

          let index = 0;
          //map() 方法按照原始数组元素顺序依次处理元素

          let videoList;

          if (videoListData.datas){
               videoList = videoListData.datas.map(item => {
                    item.id = index++;
                    return item;
               })
          }

          this.setData({
               videoList,
               //关闭下拉刷新
               isTriggered: false
          })
     },

     //点击切换导航的回调
     async changeNav(event){
          let navId = event.currentTarget.id;//通过id向event传参的时候如果传的是number,会自动转换为String

          this.setData({
               //将navId从String类型转换为int类型
               navId: navId * 1,
          })

          //显示正在加载
          wx.showLoading({
               title: "正在加载"
          })

          //动态获取当前导航对应的视频数据
          await this.getVideoList();

          //关闭加载提示框
          wx.hideLoading();
     },

     //处理点击视频播放/继续的事件
     handlePlay(event){
          let vid = event.currentTarget.id;

          this.setData({
               videoId: vid
          })

          //创建控制video标签的实例对象
          this.videoContext = wx.createVideoContext(vid);

          let {videoUpdateTime} = this.data;
          let videoItem = videoUpdateTime.find(item => item.vid === vid);
          //判断当前的视频是否播放过
          if (videoItem){
               this.videoContext.seek(videoItem.currentTime);
          }

          this.videoContext.autoplay = "true";

     },

     //监听视频播放进度
     handleTimeUpdate(event){
          let videoTimeObj = {vid: event.currentTarget.id,currentTime: event.detail.currentTime};
          let {videoUpdateTime} = this.data;

          let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);

          if (videoItem){
               videoItem.currentTime = videoTimeObj.currentTime;
          }else{
               videoUpdateTime.push(videoTimeObj);
          }

          this.setData({
               videoUpdateTime
          })
     },

     //视频播放结束调用的回调
     handleEnd(event){
          //移除记录播放时长数组中当前视频的对象
          let {videoUpdateTime} = this.data;
          let index = videoUpdateTime.findIndex(item => item.id === event.currentTarget.id);
          videoUpdateTime.splice(index,1);

          this.setData({
               videoUpdateTime
          })

     },

     //自定义下拉刷新的回调
     handleRefresher(){
          this.getVideoList();
     },

     //自定义上拉触底回调
     handleToLower(){
          console.log("上拉加载，网易云暂时没有提供接口")
     },

     toSearch(){
          wx.navigateTo({
               url: "/pages/search/search"
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
     onShareAppMessage: function ({from}) {
          console.log(from)
     }
})