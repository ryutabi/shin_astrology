const getFortune = async () => {
  const y = year.value
  const m = month.value
  const d = day.value

  const xiuyaojingResult = await xiuyaojing(y, m, d)
  birthday.textContent = `${y}. ${m}. ${d}`
  soulNumber.textContent = numberology(y + m + d)
  SYUKU_27.textContent = xiuyaojingResult.S_27
  SYUKU_28.textContent = xiuyaojingResult.S_28

  birthday.classList.remove('hidden')
  result.classList.remove('hidden')
}


// 数秘術
const numberology = num => {
  let number = 0
  for(let i = 0; i < num.length; i++) {
    number += Number(num[i])
  }

  num = number.toString()
  if (num.length > 1 && !( num.length === 2 && num[0] === num[1])) {
    return numberology(num)
  }

  return number
}


// 宿曜占星術
const xiuyaojing = async (y, m, d) => {
  // 27宿曜リスト
  const SYUKUYO_27_LIST = [
    ["室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎"],
    ["奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃"],
    ["胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢"],
    ["畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参"],
    ["参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼"],
    ["鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星"],
    ["張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫"],
    ["角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏"],
    ["氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心"],
    ["心", "尾", "箕", "斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕"],
    ["斗", "女", "虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚"],
    ["虚", "危", "室", "壁", "奎", "婁", "胃", "昴", "畢", "觜", "参", "井", "鬼", "柳", "星", "張", "翼", "軫", "角", "亢", "氏", "房", "心", "尾", "箕", "斗", "女", "虚", "危", "室"]
  ]

  // 28宿曜リスト
  const SYUKUYO_28_LIST = [
    "角", "亢", "氏", "房", "心", "尾", "箕",
    "斗", "牛", "女", "虚", "危", "室", "壁",
    "奎", "婁", "胃", "昴", "畢", "觜", "参",
    "井", "鬼", "柳", "星", "張", "翼", "軫"
  ]

  const qreki = await getQreki(y, m, d)
  const i = qreki.month - 1
  const j = qreki.day - 1
  const k = getElapsedDays(y, m, d) % 28

  return {
    S_27: SYUKUYO_27_LIST[i][j],
    S_28: SYUKUYO_28_LIST[k]
  }
}


// get_qreki.php から旧暦を取得
const getQreki = (y, m, d) => {
  const url = new URL('https://dateinfoapi.appspot.com/v1')
  const params = `${y}-${m}-${d}`
  url.searchParams.set('date', params)

  return fetch(url.href, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => qreki = {
    date: data.old_date,
    year: data.old_year,
    month: data.old_month,
    day: data.old_day
  })
}


// 1920/1/1 からの経過日数
const getElapsedDays = (y, m, d) => {
  const startDay = new Date('1920/1/1')
  const today = new Date(`${y}/${m}/${d}`)
  const msecDiff = today.getTime() - startDay.getTime()
  const dayDiff = Math.floor(msecDiff / 1000 / 60 / 60 / 24)

  return dayDiff
}


// module.exports = { numberology, xiuyaojing }
