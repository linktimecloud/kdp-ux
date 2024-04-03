/**
 * @param {*} hex 1f1f1f or #1f1f1f
 * @return hsl { h: 0, s: 84, l: 67 } s and l is percentage, should add % if used
 */
export const hexTohsl = hex => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!match) {
    return { h: 0, s: 0, l: 0 }
  }
  const hexToDec = num => parseInt(num, 16)
  const r = hexToDec(match[1]) / 255
  const g = hexToDec(match[2]) / 255
  const b = hexToDec(match[3]) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const hsl = {
    h: 0,
    s: 0,
    l: ((max + min) / 2).toFixed(2)
  }
  if (max !== min) {
    let { s, h } = hsl
    const { l } = hsl
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    hsl.h = Math.round(360 * (h / 6))
    hsl.s = Math.round(s * 100)
  }

  hsl.l = Math.round(hsl.l * 100)
  return hsl
}

/**
 * Calculate color's lighter color or darker color by luminance, luminnace should between 0 -> 1
 * @param {object} {h:129, s:87, l:19}
 * @return {object} hsl(120, 87%, 19%)
 */
export const hslFormatter = hslObj => `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)` // hsl(h, s%, l%)

/**
 * Calculate color's lighter color or darker color by luminance, luminnace should between 0 -> 1
 * @param currentLightness 20
 * @param {float} luminance 0.2 between 0 -> 1
 * @return {number} 40
 */
export const calcLuminance = (currentLightness, luminance) => {
  if (typeof luminance === 'number') {
    const percentage = luminance * 100
    let result = currentLightness
    const expectedResult = currentLightness + percentage
    if (expectedResult < 0) {
      result = 0
    } else if (expectedResult > 100) {
      result = 100
    } else {
      result = expectedResult
    }
    return Math.round(result)
  }
  return currentLightness
}

/**
 * Calculate color's lighter color or darker color by luminance, luminnace should between 0 -> 1
 * @param {string} hex #000000 000000
 * @param {float} luminance 0.2
 * @return {string} hsl(120, 87%, 19%)
 */
export const calHexColorLuminance = (hex, luminance = 0) => {
  const hslObj = hexTohsl(hex)
  const { l } = hslObj
  hslObj.l = calcLuminance(l, luminance)
  return hslFormatter(hslObj)
}

/**
 * Calculate color's lighter color or darker color by luminance, luminnace should between 0 -> 1
 * @param {string} hsl hsl(120, 87%, 19%)
 * @param {float} luminance 0.1
 * @return {string} hsl(120, 87%, 29%)
 */
export const calHslColorLuminance = (hsl, luminance = 0) => {
  const hslRegex = /hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)/g
  const match = hslRegex.exec(hsl)
  const hslObj = {
    h: match[1],
    s: parseInt(match[2]),
    l: parseInt(match[3])
  }
  hslObj.l = calcLuminance(hslObj.l, luminance)
  return hslFormatter(hslObj)
}

export const DEFAULT_COLORS = [
  '#74beff',
  '#a69efb',
  '#d44bff',
  '#fb8381',
  '#ffce67',
  '#69dba4',
  '#fc97af',
  '#87f7cf',
  '#f7c5a0',
  '#d4a4eb',
  '#d2f5a6',
  '#76f2f2',
  '#8c6ac4',
  '#c9ab00',
  '#f5994e',
  '#59678c',
  '#95706d',
  '#2ec7c9'
]

// Maximum 50 Colors
export const palette = (numOfColors, luminanceStep = 0.1, defaultColors = DEFAULT_COLORS) => {
  const numOfDefault = defaultColors.length
  const defaultColorsHsl = defaultColors.map(color => hslFormatter(hexTohsl(color)))
  if (numOfColors <= numOfDefault) {
    return defaultColorsHsl.slice(0, numOfColors)
  }

  const loop = Math.ceil(numOfColors / numOfDefault)
  let result = [...defaultColorsHsl]
  for (let i = 1; i <= loop; i++) {
    const luminance = -1 * luminanceStep * i
    result = result.concat(defaultColorsHsl.map(color => calHslColorLuminance(color, luminance)))
  }
  result = Array.from(new Set(result))
  return result.slice(0, numOfColors)
}
