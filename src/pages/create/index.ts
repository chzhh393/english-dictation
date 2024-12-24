interface WordItem {
  word: string
  meaning: string
}

Page({
  data: {
    name: '',
    loading: false,
    wordList: [] as WordItem[]
  },

  onNameInput(e: any) {
    this.setData({
      name: e.detail.value
    })
  },

  onWordInput(e: any) {
    const { index, field } = e.currentTarget.dataset
    const { value } = e.detail
    const wordList = [...this.data.wordList]
    wordList[index][field] = value
    this.setData({ wordList })
  },

  chooseImage() {
    const that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePath = res.tempFilePaths[0]
        that.setData({ loading: true })
        
        // 临时模拟数据
        setTimeout(() => {
          that.setData({
            wordList: [
              { word: 'apple', meaning: '苹果' },
              { word: 'banana', meaning: '香蕉' }
            ],
            loading: false
          })
        }, 1000)
      }
    })
  },

  handleSave() {
    const { name, wordList } = this.data
    
    if (!name) {
      wx.showToast({
        title: '请输入单词组名称',
        icon: 'none'
      })
      return
    }
    
    if (wordList.length === 0) {
      wx.showToast({
        title: '请添加单词',
        icon: 'none'
      })
      return
    }

    // 保存到本地存储
    try {
      const wordLists = wx.getStorageSync('wordLists') || []
      const newWordList = {
        id: Date.now().toString(),
        name,
        words: wordList
      }
      wordLists.unshift(newWordList)
      wx.setStorageSync('wordLists', wordLists)

      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
      wx.navigateBack()
    } catch (error) {
      wx.showToast({
        title: '保存失败',
        icon: 'error'
      })
    }
  }
}) 