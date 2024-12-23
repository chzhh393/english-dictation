import { useState } from 'react'
import { View } from '@tarojs/components'
import { Button, Input, Cell, Form, TextArea } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

const Create = () => {
  const [wordList, setWordList] = useState<Array<{word: string; meaning: string}>>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  // 选择图片
  const chooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFilePath = res.tempFilePaths[0]
        setLoading(true)
        try {
          // 临时模拟数据
          setTimeout(() => {
            setWordList([
              { word: 'apple', meaning: '苹果' },
              { word: 'banana', meaning: '香蕉' }
            ])
          }, 1000)
        } catch (error) {
          Taro.showToast({
            title: '识别失败',
            icon: 'error'
          })
        } finally {
          setLoading(false)
        }
      }
    })
  }

  // 保存单词组
  const handleSave = async () => {
    if (!name) {
      Taro.showToast({
        title: '请输入单词组名称',
        icon: 'none'
      })
      return
    }
    if (wordList.length === 0) {
      Taro.showToast({
        title: '请添加单词',
        icon: 'none'
      })
      return
    }

    try {
      // TODO: 保存到云数据库
      Taro.showToast({
        title: '保存成功',
        icon: 'success'
      })
      Taro.navigateBack()
    } catch (error) {
      Taro.showToast({
        title: '保存失败',
        icon: 'error'
      })
    }
  }

  return (
    <View className='create'>
      <Form>
        <Cell.Group>
          <Form.Item label='单词组名称'>
            <Input 
              placeholder='请输入单词组名称'
              value={name}
              onChange={(val) => setName(val)}
            />
          </Form.Item>
        </Cell.Group>
      </Form>

      <View className='action-buttons'>
        <Button 
          type='primary'
          loading={loading}
          onClick={chooseImage}
        >
          {loading ? '识别中...' : '选择/拍摄图片'}
        </Button>
      </View>

      {wordList.length > 0 && (
        <View className='word-list'>
          <Cell.Group title='识别结果'>
            {wordList.map((item, index) => (
              <Form.Item label={`单词${index + 1}`} key={index}>
                <Input 
                  placeholder='单词'
                  value={item.word}
                  onChange={(val) => {
                    const newList = [...wordList]
                    newList[index].word = val
                    setWordList(newList)
                  }}
                />
                <Input 
                  placeholder='释义'
                  value={item.meaning}
                  onChange={(val) => {
                    const newList = [...wordList]
                    newList[index].meaning = val
                    setWordList(newList)
                  }}
                />
              </Form.Item>
            ))}
          </Cell.Group>

          <Button type='success' onClick={handleSave}>
            保存单词组
          </Button>
        </View>
      )}
    </View>
  )
}

export default Create 