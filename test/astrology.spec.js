const { numberology, xiuyaojing } = require('../src/astrology')
const data = require('./test.json')

describe('astrology test', () => {
  for (let i = 0; i < data.length; i++) {
    const birthday = data[i].y + data[i].m + data[i].d
    it('Birthday: ' + birthday, () => {
      expect(numberology(birthday)).toBe(data[i].number)
    })
  }
})
