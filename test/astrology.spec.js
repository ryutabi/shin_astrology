const { numberology, xiuyaojing } = require('../src/astrology')
const data = require('./test.json')

describe('astrology test', () => {
  for (let i = 0; i < data.length; i++) {
    const birthday = data[i].y + data[i].m + data[i].d
    it('Birthday: ' + birthday, () => {
      expect(numberology(birthday)).toBe(data[i].number)
    })
    // it('hoge', () => {
    //   expect(xiuyaojing(data[i].y, data[i].m, data[i].d)).toEqual({
    //     "s_27": data[i].s_27,
    //     "s_28": data[i].s_28
    //   })
    // })
  }
})
