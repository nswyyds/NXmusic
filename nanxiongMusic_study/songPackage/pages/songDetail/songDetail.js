import PubSub from "pubsub-js";
import request from "../../../utils/request";
import moment from "moment";

//获取全局实例
const appInstance = getApp();

Page({
     /**
      * 页面的初始数据
      */
     data: {
          isPlay: false, //音乐是否播放
          song: "",
          musicId: "",
          musicLink: "",//音乐的链接
          currentTime: "00:00", //当前音乐的时长
          durationTime: "00:00", //总音乐时长
          currentWidth: 0, //实时进度条的宽度
     },

     /**
      * 生命周期函数--监听页面加载
      */
     onLoad: function (options) {
          //获取url传递过来的歌曲id信息
          let musicId = options.musicId;

          //点击新页面时，设置此页面歌曲的id
          this.setData({
               musicId
          });

          //获取音乐详情
          this.getMusicDetails(musicId);

          //判断当前音乐是否在后台播放
          if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
               //修改当前页面的播放状态为true
               this.setData({
                    isPlay: true
               });
          }

          //如果用户操作系统播放音乐/暂停时，页面不知道，导致页面显示是否播放的状态和真实的音乐播放状态不一致
          //通过控制音频的实例 backgroundAudioManager去监视音乐播放/暂停
          //创建控制音乐播放的实例
          this.backgroundAudioManager = wx.getBackgroundAudioManager();
          //部署音乐播放监听器
          this.backgroundAudioManager.onPlay(() => {
               //修改音乐播放的状态
               this.changePlayState(true);
               //全局data标注，正在播放的音乐id
               appInstance.globalData.musicId = this.data.musicId;
          });

          this.backgroundAudioManager.onPause(() => {
               this.changePlayState(false);
          });

          //监听音乐播放自然结束
          this.backgroundAudioManager.onEnded(() => {
               //切换下一首，播放
               PubSub.publish("switch-type","next");
               this.setData({
                    currentWidth: 0,
                    currentTime: "00:00"
               })
          })

          this.backgroundAudioManager.onStop(() => {
               this.changePlayState(false);
          });

          // 监听音乐实时播放的进度
          this.backgroundAudioManager.onTimeUpdate(() => {
               //console.log("总时长：",this.backgroundAudioManager.duration);
               //console.log("实时：",this.backgroundAudioManager.currentTime);
               //格式化实时的播放时间
               let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format("mm:ss");
               let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450;

               if (appInstance.globalData.musicId === this.data.musicId){
                    this.setData({
                         currentTime,
                         currentWidth
                    });
               }
          });
     },

     //修改播放状态的功能函数
     changePlayState(isPlay){
          this.setData({
               isPlay
          });
          appInstance.globalData.isMusicPlay = isPlay;
     },

     //获取音乐详情
     async getMusicDetails(musicId){
          //获取音乐的mp3数据信息
          let song = await request("/song/detail",{ids:musicId});
          //获取歌曲的时长信息
          let durationTime = moment(song.songs[0].dt).format("mm:ss");

          this.setData({
               song: song.songs[0],
               durationTime
          });

          //动态修改窗口标题
          wx.setNavigationBarTitle({
               title: song.songs[0].name
          });
     },

     //点击播放/暂停
     handleMusicPlay(){
          let isPlay = !this.data.isPlay;
          this.musicControl(isPlay,this.data.musicId,this.data.musicLink);
     },

     //控制音乐播放/暂停的功能函数
     async musicControl(isPlay,musicId,musicLink){
          if (isPlay){
               //如果不存在音乐的mp3资源，则去获取
               if (!musicLink){
                    //获取音乐播放链接
                    let musicLinkData = await request("/song/url",{id:musicId});
                    musicLink = musicLinkData.data[0].url;
                    this.setData({
                         musicLink
                    });
               }
               //设置好backgroundAudioManager的src以及title后，音乐会自动播放(play监听捕捉)
               this.backgroundAudioManager.src = musicLink;
               this.backgroundAudioManager.title = this.data.song.name;
          }else{
               this.backgroundAudioManager.pause();
          }
     },

     //点击切歌的回调
     handleSwitch(event){
          //获取切歌的类型
          let type = event.currentTarget.id;

          //停止上一首歌曲的播放
          this.backgroundAudioManager.stop();

          //发布消息数据给recommendSong页面
          PubSub.publish("switch-type",type);
          //订阅来自recommendSong页面发布的musicId信息
          PubSub.subscribe("musicId",(msg,musicId) => {
               //更新当前页面的musicId
               this.setData({
                    musicId
               });

               this.getMusicDetails(musicId);

               //自动播放当前的音乐
               this.musicControl(true,musicId);
               //取消订阅
               PubSub.unsubscribe("musicId");
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