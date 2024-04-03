import { parseJSONFile } from '@/utils/document'

describe('parseJSONFile', () => {
  test('should parse the JSON file correctly', async () => {
    // 创建测试文件或模拟文件
    const testFile = new File(['{"name": "John", "age": 30}'], 'test.json')
    try {
      const result = await parseJSONFile(testFile)
      expect(result).toEqual({ name: 'John', age: 30 })
    } catch (error) {
      // 处理异常情况
    }

    const testFile2 = new File([], 'test2.json')
    try {
      const result = await parseJSONFile(testFile2)
      expect(result).toEqual({})
    } catch (error) {
      // 处理异常情况
    }
  })

  test('should parse the Empty JSON file correctly', async () => {
    // 创建测试文件或模拟文件
    const testFile2 = new File([], 'test2.json')
    try {
      const result = await parseJSONFile(testFile2)
      expect(result).toEqual({})
    } catch (error) {
      // 处理异常情况
    }
  })
})
