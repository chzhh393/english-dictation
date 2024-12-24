interface DictationConfig {
  playCount: number      // 播放次数
  playInterval: number   // 播放间隔(秒)
  playEnglish: boolean   // 播放英文
  playMeaning: boolean   // 播放释义
  playDing: boolean      // 播放提示音
  showMeaning: boolean   // 显示释义
  autoNext: boolean      // 自动播放下一个
  autoNextDelay: number  // 自动播放延时(秒)
}

const DEFAULT_CONFIG: DictationConfig = {
  playCount: 3,
  playInterval: 3,
  playEnglish: true,
  playMeaning: false,
  playDing: true,
  showMeaning: true,
  autoNext: true,
  autoNextDelay: 5
}

interface Word {
  word: string
  meaning: string
}

interface WordList {
  id: string
  name: string
  words: Word[]
}

Page({
  data: {
    wordList: null as WordList | null,
    currentIndex: 0,
    answers: [] as string[],
    showResult: false,
    isPlaying: false,
    showConfig: false,
    autoNextTimer: null as any,
    config: DEFAULT_CONFIG,
    tempConfig: DEFAULT_CONFIG // 临时配置，用于编辑时
  },

  onLoad(options: any) {
    if (!options || !options.id) {
      wx.showToast({
        title: '参数错误',
        icon: 'error'
      })
      wx.switchTab({
        url: '/pages/word-list/index'
      })
      return
    }

    const { id } = options
    const wordLists = wx.getStorageSync('wordLists') || []
    const wordList = wordLists.find((item: WordList) => item.id === id)
    
    if (!wordList) {
      wx.showToast({
        title: '单词组不存在',
        icon: 'error'
      })
      wx.switchTab({
        url: '/pages/word-list/index'
      })
      return
    }

    this.setData({
      wordList,
      answers: new Array(wordList.words.length).fill('')
    }, () => {
      // 页面加载完成后自动播放第一个单词
      this.playWord()
    })

    // 加载保存的配置
    const savedConfig = wx.getStorageSync('dictationConfig')
    if (savedConfig) {
      this.setData({ 
        config: savedConfig,
        tempConfig: savedConfig
      })
    }
  },

  toggleConfig() {
    const { showConfig, config } = this.data
    this.setData({
      showConfig: !showConfig,
      // 打开设置面板时，复制当前配置到临时配置
      tempConfig: showConfig ? config : { ...config }
    })
  },

  onConfigChange(e: any) {
    const { field } = e.currentTarget.dataset
    const value = e.detail.value
    this.setData({
      [`tempConfig.${field}`]: value
    })
  },

  cancelConfig() {
    this.setData({
      showConfig: false,
      // 取消时恢复原配置
      tempConfig: { ...this.data.config }
    })
  },

  saveConfig() {
    const { tempConfig } = this.data
    // 保存配置到本地存储
    wx.setStorageSync('dictationConfig', tempConfig)
    
    this.setData({
      showConfig: false,
      config: tempConfig
    })

    wx.showToast({
      title: '设置已保存',
      icon: 'success'
    })
  },

  async playWord() {
    const { wordList, currentIndex, isPlaying, config } = this.data
    if (!wordList || isPlaying) return
    
    // 清除可能存在的自动播放定时器
    if (this.data.autoNextTimer) {
      clearTimeout(this.data.autoNextTimer)
      this.setData({ autoNextTimer: null })
    }
    
    this.setData({ isPlaying: true })
    
    const word = wordList.words[currentIndex]
    
    try {
      // 播放指定次数
      for (let i = 0; i < config.playCount; i++) {
        // 播放英文
        if (config.playEnglish) {
          await this.playText(word.word, true)
          
          // 播放间隔
          if (config.playInterval > 0) {
            await new Promise(resolve => setTimeout(resolve, config.playInterval * 1000))
          }
        }
        
        // 播放释义
        if (config.playMeaning) {
          await this.playText(word.meaning, false)
        }
      }

      // 单词播放完成后播放叮声
      if (config.playDing) {
        await this.playDing()
      }

      // 设置自动播放下一个的定时器
      if (config.autoNext && currentIndex < wordList.words.length - 1) {
        const timer = setTimeout(() => {
          this.nextWord()
        }, config.autoNextDelay * 1000)
        this.setData({ autoNextTimer: timer })
      }
    } catch (error) {
      wx.showToast({
        title: '播放失败',
        icon: 'error'
      })
    } finally {
      this.setData({ isPlaying: false })
    }
  },

  playText(text: string, isEnglish: boolean): Promise<void> {
    return new Promise((resolve) => {
      const context = wx.createInnerAudioContext()
      
      if (isEnglish) {
        // 英文使用有道词典API
        context.src = `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(text)}&type=1`
        context.play()
        
        context.onEnded(() => {
          context.destroy()
          resolve()
        })
        
        context.onError(() => {
          context.destroy()
          this.fallbackToText(text, resolve)
        })
      } else {
        // 中文直接显示文字
        this.fallbackToText(text, resolve)
      }
    })
  },

  fallbackToText(text: string, resolve: () => void) {
    wx.showToast({
      title: text,
      icon: 'none',
      duration: 2000
    })
    setTimeout(resolve, 2000)
  },

  playDing(): Promise<void> {
    return new Promise((resolve) => {
      const audio = wx.createInnerAudioContext()
      audio.src = '/assets/audio/ding.mp3'
      audio.play()
      
      audio.onEnded(() => {
        audio.destroy()
        resolve()
      })
      
      audio.onError(() => {
        audio.destroy()
        // 音频播放失败时降级为显示文字
        wx.showToast({
          title: '叮',
          icon: 'none',
          duration: 500
        })
        setTimeout(resolve, 500)
      })
    })
  },

  onAnswerInput(e: any) {
    const { value } = e.detail
    const { currentIndex, answers } = this.data
    answers[currentIndex] = value
    this.setData({ answers })
  },

  nextWord() {
    const { currentIndex, wordList } = this.data
    if (!wordList) return
    
    if (currentIndex < wordList.words.length - 1) {
      this.setData({
        currentIndex: currentIndex + 1
      }, () => {
        // 切换到下一个单词时自动播放
        this.playWord()
      })
    }
  },

  prevWord() {
    const { currentIndex } = this.data
    if (currentIndex > 0) {
      this.setData({
        currentIndex: currentIndex - 1
      }, () => {
        // 切换到上一个单词时自动播放
        this.playWord()
      })
    }
  },

  submitDictation() {
    const { wordList, answers } = this.data
    if (!wordList) return

    // TODO: 保存听写结果
    this.setData({ showResult: true })
  },

  onUnload() {
    // 页面卸载时清除定时器
    if (this.data.autoNextTimer) {
      clearTimeout(this.data.autoNextTimer)
    }
  }
}) 