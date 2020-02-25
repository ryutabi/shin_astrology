const $id = id => document.getElementById(id)
const inputBirthday = $id('inputBirthday')
const birthday = $id('birthday')
const result = $id('result')
const soulNumber = $id('soulNumber')
const SYUKU_27 = $id('syuku27')
const SYUKU_28 = $id('syuku28')


const init = () => {
  // 西暦一覧の作成
  const nowYear = new Date().getFullYear().toString()
  const selectYear = document.createElement('select')
  selectYear.id = 'year'
  for (let y = 1920; y <= nowYear; y++) {
    const option = document.createElement('option')
    option.value = option.textContent = y.toString()
    if (y === 1970) {
      option.selected = true
    }
    selectYear.appendChild(option)
  }
  inputBirthday.prepend(selectYear)

  // 月一覧の作成
  const selectMonth = document.createElement('select')
  selectMonth.id = 'month'
  for (let m = 1; m <= 12; m++) {
    const option = document.createElement('option')
    option.value = option.textContent = m.toString()
    selectMonth.appendChild(option)
  }
  inputBirthday.appendChild(selectMonth)

  // 日一覧の作成
  const selectDay = document.createElement('select')
  selectDay.id = 'day'
  for (let d = 1; d <= 31; d++) {
    const option = document.createElement('option')
    option.value = option.textContent = d.toString()
    selectDay.appendChild(option)
  }
  inputBirthday.appendChild(selectDay)
}
