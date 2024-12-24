interface WordList {
  id: string
  name: string
  words: Array<{
    word: string
    meaning: string
  }>
}

Page({
  data: {
    wordLists: [] as WordList[]
  },

  onShow() {
    // 每次显示页面时重新加载数据
    this.loadWordLists()
  },

  loadWordLists() {
    const wordLists = wx.getStorageSync('wordLists') || []
    this.setData({ wordLists })
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