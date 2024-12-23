Page({
  data: {
    wordLists: []
  },

  onLoad() {
    // TODO: Load word lists from storage or cloud
    this.setData({
      wordLists: []
    })
  },

  handleItemClick(e: any) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/dictation/index?id=${id}`
    })
  },

  handleCreate() {
    wx.navigateTo({
      url: '/pages/create/index'
    })
  }
}) 