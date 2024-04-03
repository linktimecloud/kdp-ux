import { palette, hexTohsl, hslFormatter, calHexColorLuminance, calHslColorLuminance } from '@/utils/color/palette'

describe('palette utils', () => {
  describe('hexTohsl util', () => {
    it('hexToHsl should convert hex value to hsl value', () => {
      const hsl = {
        h: 350,
        s: 73,
        l: 87
      }
      expect((hexTohsl('#F6C6CE'))).toEqual(hsl)
      expect((hexTohsl('F6C6CE'))).toEqual(hsl)
      expect((hexTohsl('#ffffff'))).toEqual({
        h: 0,
        s: 0,
        l: 100
      })
    })

    it('hexToHsl should return default value if hex value is invalid', () => {
      const hsl = {
        h: 0,
        s: 0,
        l: 0
      }
      expect((hexTohsl('#fff'))).toEqual(hsl)
      expect((hexTohsl('#abc'))).toEqual(hsl)
      expect((hexTohsl('abc'))).toEqual(hsl)
    })

    it('hexToHsl should convert hex value to hsl value, cover more colors', () => {
      expect((hexTohsl('#E6F5D0'))).toEqual({
        h: 84,
        s: 65,
        l: 89
      })
      expect((hexTohsl('0074D9'))).toEqual({
        h: 208,
        s: 100,
        l: 43
      })
    })
  })
  describe('hslFormatter util', () => {
    it('hslFormatter should format hsl object to hsl string', () => {
      expect((hslFormatter({
        h: 350,
        s: 73,
        l: 87
      }))).toEqual('hsl(350, 73%, 87%)')
    })
  })

  describe('calHexColorLuminance utils', () => {
    it('calHexColorLuminance should return color hsl format', () => {
      expect(calHexColorLuminance('#F6C6CE')).toBe('hsl(350, 73%, 87%)')
    })

    it('calHexColorLuminance should return calculated color if pass luminance offset', () => {
      expect(calHexColorLuminance('#F6C6CE', 0.1)).toBe('hsl(350, 73%, 97%)')
      expect(calHexColorLuminance('#F6C6CE', -0.1)).toBe('hsl(350, 73%, 77%)')
      expect(calHexColorLuminance('#F6C6CE', -1.1)).toBe('hsl(350, 73%, 0%)')
      expect(calHexColorLuminance('#F6C6CE', 1.1)).toBe('hsl(350, 73%, 100%)')
    })

    it('calHexColorLuminance should return current lightness if luminance offset is invalid', () => {
      expect(calHexColorLuminance('#F6C6CE', 'abc')).toBe('hsl(350, 73%, 87%)')
    })
  })

  describe('palette utils', () => {
    it('palette should return a set of colors from default colors', () => {
      const colors = palette(10)
      expect(colors.length).toEqual(10)
      expect(colors[0]).toMatch(/hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/)
    })

    it('palette should return colors with different luminance', () => {
      const defaultColors = ['#0074D9']
      const colors = palette(5, 0.1, defaultColors)
      expect(colors).toEqual([
        'hsl(208, 100%, 43%)',
        'hsl(208, 100%, 33%)',
        'hsl(208, 100%, 23%)',
        'hsl(208, 100%, 13%)',
        'hsl(208, 100%, 3%)'
      ])
    })
  })

  describe('calHslColorLuminance utils', () => {
    it('calHslColorLuminance calculate hsl luminance', () => {
      expect(calHslColorLuminance('hsl(208, 100%, 43%)')).toBe('hsl(208, 100%, 43%)')
      expect(calHslColorLuminance('hsl(208, 100%, 43%)', 0.1)).toBe('hsl(208, 100%, 53%)')
      expect(calHslColorLuminance('hsl(208, 100%, 43%)', -0.1)).toBe('hsl(208, 100%, 33%)')
    })
  })
})
