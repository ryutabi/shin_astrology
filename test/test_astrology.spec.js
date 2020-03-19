const { numberology, xiuyaojing } = require('./test_astrology')
const testData = require('./data.json')

describe('astrology test', () => {
  testData.forEach(data => {
    it(`Birthday: ${data.y}/${data.m}/${data.d}`, async () => {
      expect(numberology(`${data.y}${data.m}${data.d}`)).toBe(data.number)
      const result = await xiuyaojing(data.y, data.m, data.d)
      expect(result).toEqual({ S_27: data.s_27, S_28: data.s_28 })
    })
  })
})
