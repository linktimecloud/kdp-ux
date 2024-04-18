import { describe, expect, test } from 'vitest'
import { applyDrag } from '@/utils/dnd.js'

describe('applyDrag', () => {
  test('should return the array as it is if both removedIndex and addedIndex are null', () => {
    const input = [1, 2, 3]
    const dragResult = { removedIndex: null, addedIndex: null, payload: null }
    const result = applyDrag(input, dragResult)
    expect(result).toEqual(input)
  })

  test('should remove an item when removedIndex is defined', () => {
    const input = [1, 2, 3]
    const dragResult = { removedIndex: 1, addedIndex: null, payload: null }
    const result = applyDrag(input, dragResult)
    expect(result).toEqual([1, 3])
  })

  test('should add an item when addedIndex is defined and removedIndex is null', () => {
    const input = [1, 2, 3]
    const dragResult = { removedIndex: null, addedIndex: 1, payload: 4 }
    const result = applyDrag(input, dragResult)
    expect(result).toEqual([1, 4, 2, 3])
  })

  test('should move an item when both removedIndex and addedIndex are defined', () => {
    const input = [1, 2, 3]
    const dragResult = { removedIndex: 0, addedIndex: 2, payload: null }
    const result = applyDrag(input, dragResult)
    expect(result).toEqual([2, 3, 1])
  })
})
