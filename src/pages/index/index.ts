/// <reference path="../../../node_modules/miniprogram-api-typings/index.d.ts" />

Page({
  data: {
    title: '英语听写小助手',
    features: [
      {
        name: '开始听写',
        path: '/pages/word-list/index',
        icon: '📝'
      },
      {
        name: '错题记录',
        path: '/pages/history/index',
        icon: '📚'
      },
      {
        name: '学习统计',
        path: '/pages/statistics/index',
        icon: '📊'
      }
    ]
  },
  onLoad() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  handleFeatureClick(e: any) {
    const { path } = e.currentTarget.dataset
    wx.navigateTo({ url: path })
  }
}) 