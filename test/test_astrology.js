/**
 * =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
 * from qreki.js
 * =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
 */
const k = Math.PI / 180
const dt = new Date()
const tz = dt.getTimezoneOffset() / 1440
let rm_sun0

Date.prototype.getJD = Date_getJD
Date.prototype.setJD = Date_setJD
function Date_getJD() {
  return 2440587 + this.getTime() / 864e5 - tz
}
function Date_setJD(jd) {
  this.setTime((jd + tz - 2440587) * 864e5)
}

function Qreki(tm) {
  let i, lap, state
  const chu = new Array(4)
  const saku = new Array(5)
  const m = new Array(5)
  for (i = 0; i < 5; i++) m[i] = new Object

  chu[0] = calcChu(tm, 90)
  m[0].month = Math.floor(rm_sun0 / 30) + 2
  for (i = 1; i < 4; i++) {
    chu[i] = calcChu(chu[i - 1] + 32, 30)
  }
  saku[0] = calcSaku(chu[0])
  for (i = 1; i < 5; i++) {
    saku[i] = calcSaku(saku[i - 1] + 30)
    if (Math.abs(Math.floor(saku[i - 1]) - Math.floor(saku[i])) <= 26) {
      saku[i] = calcSaku(saku[i - 1] + 35)
    }
  }
  if (Math.floor(saku[1]) <= Math.floor(chu[0])) {
    for (i = 0; i < 4; i++) {
      saku[i] = saku[i + 1]
    }
    saku[4] = calcSaku(saku[3] + 35)
  } else if (Math.floor(saku[0]) > Math.floor(chu[0])) {
    for (i = 4; i > 0; i--) saku[i] = saku[i - 1]
    saku[0] = calcSaku(saku[0] - 27)
  }

  lap = (Math.floor(saku[4]) <= Math.floor(chu[3]))
  m[0].isLeap = false
  m[0].jd = Math.floor(saku[0])
  for (i = 1; i < 5; i++) {
    if (lap && i > 1) {
      if (chu[i - 1] <= Math.floor(saku[i - 1]) ||
          chu[i - 1] >= Math.floor(saku[i])) {
        m[i-1].month = m[i-2].month
        m[i-1].isLeap = true
        m[i-1].jd = Math.floor(saku[i - 1])
        lap = false
      }
    }
    m[i].month = m[i-1].month + 1
    if (m[i].month > 12) m[i].month -= 12
    m[i].jd = Math.floor(saku[i])
    m[i].isLeap = false
  }
  state = 0
  for (i = 0; i < 5; i++) {
    if (Math.floor(tm) < Math.floor(m[i].jd)) {
      state = 1
      break
    } else if (Math.floor(tm) === Math.floor(m[i].jd)) {
      state = 2
      break
    }
  }
  if (state === 0 || state === 1) i--

  const d = new Date()
  d.setJD(tm)
  this.year = d.getFullYear()
  if (this.month > 9 && this.month > d.getMonth() + 1) this.year--
  this.month = m[i].month
  this.day = Math.floor(tm) - Math.floor(m[i].jd) + 1
  this.isLeap = m[i].isLeap
}


function calcChu(tm, longitude) {
  let tm1, tm2, t, rm_sun, delta_rm
  tm1 = Math.floor(tm)
  tm2 = tm - tm1 + tz
  t = (tm2 + .5) / 36525 + (tm1 - 2451545) / 36525
  rm_sun = LONGITUDE_SUN(t)
  rm_sun0 = longitude * Math.floor(rm_sun / longitude)
  let delta_t1 = 0, delta_t2 = 1
  for (; Math.abs(delta_t1 + delta_t2) > (1 / 86400);) {
    t = (tm2 + .5) / 36525 + (tm1 - 2451545) / 36525;
    rm_sun = LONGITUDE_SUN(t)
    delta_rm = rm_sun - rm_sun0 
    if (delta_rm > 180) {
      delta_rm -= 360
    } else if (delta_rm < -180) {
      delta_rm += 360
    }
    delta_t1 = Math.floor(delta_rm * 365.2 / 360)
    delta_t2 = delta_rm * 365.2 / 360 - delta_t1
    tm1 = tm1 - delta_t1
    tm2 = tm2 - delta_t2
    if (tm2 < 0) {
      tm1 -= 1
      tm2 += 1
    }
  }

  return tm2 + tm1 - tz
}


function calcSaku(tm) {
  let lc, t, tm1, tm2, rm_sun, rm_moon, delta_rm
  lc = 1
  tm1 = Math.floor(tm)
  tm2 = tm - tm1 + tz
  let delta_t1 = 0, delta_t2 = 1
  for (; Math.abs(delta_t1 + delta_t2) > (1 / 86400); lc++) {
    t = (tm2 + .5) / 36525 + (tm1 - 2451545) / 36525
    rm_sun = LONGITUDE_SUN(t)
    rm_moon = LONGITUDE_MOON(t)
    delta_rm = rm_moon - rm_sun 
    if (lc === 1 && delta_rm < 0) {
      delta_rm = NORMALIZATION_ANGLE(delta_rm)
    } else if (rm_sun >= 0 && rm_sun <= 20 && rm_moon >= 300) {
      delta_rm = NORMALIZATION_ANGLE(delta_rm)
      delta_rm = 360 - delta_rm
    } else if (Math.abs(delta_rm) > 40) {
      delta_rm = NORMALIZATION_ANGLE(delta_rm)
    }
    delta_t1 = Math.floor(delta_rm * 29.530589 / 360)
    delta_t2 = delta_rm * 29.530589 / 360 - delta_t1
    tm1 = tm1 - delta_t1
    tm2 = tm2 - delta_t2
    if (tm2 < 0) {
      tm1 -= 1
      tm2 += 1
    }
    if (lc === 15 && Math.abs(delta_t1 + delta_t2) > (1 / 86400)) {
      tm1 = Math.floor(tm - 26)
      tm2 = 0
    } else if (lc > 30 && Math.abs(delta_t1 + delta_t2) > (1 / 86400)) {
      tm1 = tm
      tm2 = 0
      break
    }
  }

  return tm2 + tm1 - tz
}


function NORMALIZATION_ANGLE(angle) {
  return angle - 360 * Math.floor(angle / 360)
}


function LONGITUDE_SUN(t) {
  let ang,th
  th = .0004 * Math.cos(k * NORMALIZATION_ANGLE(31557 * t + 161))
  th += .0004 * Math.cos(k * NORMALIZATION_ANGLE(29930 * t + 48))
  th += .0005 * Math.cos(k * NORMALIZATION_ANGLE(2281 * t + 221))
  th += .0005 * Math.cos(k * NORMALIZATION_ANGLE(155 * t + 118))
  th += .0006 * Math.cos(k * NORMALIZATION_ANGLE(33718 * t + 316))
  th += .0007 * Math.cos(k * NORMALIZATION_ANGLE(9038 * t + 64))
  th += .0007 * Math.cos(k * NORMALIZATION_ANGLE(3035 * t + 110))
  th += .0007 * Math.cos(k * NORMALIZATION_ANGLE(65929 * t + 45))
  th += .0013 * Math.cos(k * NORMALIZATION_ANGLE(22519 * t + 352))
  th += .0015 * Math.cos(k * NORMALIZATION_ANGLE(45038 * t + 254))
  th += .0018 * Math.cos(k * NORMALIZATION_ANGLE(445267 * t + 208))
  th += .0018 * Math.cos(k * NORMALIZATION_ANGLE(19 * t + 159))
  th += .0020 * Math.cos(k * NORMALIZATION_ANGLE(32964 * t + 158))
  th += .0200 * Math.cos(k * NORMALIZATION_ANGLE(71998.1 * t + 265.1))
  ang = NORMALIZATION_ANGLE(35999.05 * t + 267.52)
  th = th - .0048 * t * Math.cos(k * ang)
  th += 1.9147 * Math.cos(k * ang)
  ang = NORMALIZATION_ANGLE(36000.7695 * t)
  ang = NORMALIZATION_ANGLE(ang + 280.4659)
  th = NORMALIZATION_ANGLE(th + ang)

  return th
}


function LONGITUDE_MOON(t) {
  let ang,th
  th = .0003 * Math.cos(k * NORMALIZATION_ANGLE(2322131 * t + 191))
  th += .0003 * Math.cos(k * NORMALIZATION_ANGLE(4067 * t + 70))
  th += .0003 * Math.cos(k * NORMALIZATION_ANGLE(549197 * t + 220))
  th += .0003 * Math.cos(k * NORMALIZATION_ANGLE(1808933 * t + 58))
  th += .0003 * Math.cos(k * NORMALIZATION_ANGLE(349472 * t + 337))
  th += .0003 * Math.cos(k * NORMALIZATION_ANGLE(381404 * t + 354))
  th += .0003 * Math.cos(k * NORMALIZATION_ANGLE(958465 * t + 340))
  th += .0004 * Math.cos(k * NORMALIZATION_ANGLE(12006 * t + 187))
  th += .0004 * Math.cos(k * NORMALIZATION_ANGLE(39871 * t + 223))
  th += .0005 * Math.cos(k * NORMALIZATION_ANGLE(509131 * t + 242))
  th += .0005 * Math.cos(k * NORMALIZATION_ANGLE(1745069 * t + 24))
  th += .0005 * Math.cos(k * NORMALIZATION_ANGLE(1908795 * t + 90))
  th += .0006 * Math.cos(k * NORMALIZATION_ANGLE(2258267 * t + 156))
  th += .0006 * Math.cos(k * NORMALIZATION_ANGLE(111869 * t + 38))
  th += .0007 * Math.cos(k * NORMALIZATION_ANGLE(27864 * t + 127))
  th += .0007 * Math.cos(k * NORMALIZATION_ANGLE(485333 * t + 186))
  th += .0007 * Math.cos(k * NORMALIZATION_ANGLE(405201 * t + 50))
  th += .0007 * Math.cos(k * NORMALIZATION_ANGLE(790672 * t + 114))
  th += .0008 * Math.cos(k * NORMALIZATION_ANGLE(1403732 * t + 98))
  th += .0009 * Math.cos(k * NORMALIZATION_ANGLE(858602 * t + 129))
  th += .0011 * Math.cos(k * NORMALIZATION_ANGLE(1920802 * t + 186))
  th += .0012 * Math.cos(k * NORMALIZATION_ANGLE(1267871 * t + 249))
  th += .0016 * Math.cos(k * NORMALIZATION_ANGLE(1856938 * t + 152))
  th += .0018 * Math.cos(k * NORMALIZATION_ANGLE(401329 * t + 274))
  th += .0021 * Math.cos(k * NORMALIZATION_ANGLE(341337 * t + 16))
  th += .0021 * Math.cos(k * NORMALIZATION_ANGLE(71998 * t + 85))
  th += .0021 * Math.cos(k * NORMALIZATION_ANGLE(990397 * t + 357))
  th += .0022 * Math.cos(k * NORMALIZATION_ANGLE(818536 * t + 151))
  th += .0023 * Math.cos(k * NORMALIZATION_ANGLE(922466 * t + 163))
  th += .0024 * Math.cos(k * NORMALIZATION_ANGLE(99863 * t + 122))
  th += .0026 * Math.cos(k * NORMALIZATION_ANGLE(1379739 * t + 17))
  th += .0027 * Math.cos(k * NORMALIZATION_ANGLE(918399 * t + 182))
  th += .0028 * Math.cos(k * NORMALIZATION_ANGLE(1934 * t + 145))
  th += .0037 * Math.cos(k * NORMALIZATION_ANGLE(541062 * t + 259))
  th += .0038 * Math.cos(k * NORMALIZATION_ANGLE(1781068 * t + 21))
  th += .0040 * Math.cos(k * NORMALIZATION_ANGLE(133 * t + 29))
  th += .0040 * Math.cos(k * NORMALIZATION_ANGLE(1844932 * t + 56))
  th += .0040 * Math.cos(k * NORMALIZATION_ANGLE(1331734 * t + 283))
  th += .0050 * Math.cos(k * NORMALIZATION_ANGLE(481266 * t + 205))
  th += .0052 * Math.cos(k * NORMALIZATION_ANGLE(31932 * t + 107))
  th += .0068 * Math.cos(k * NORMALIZATION_ANGLE(926533 * t + 323))
  th += .0079 * Math.cos(k * NORMALIZATION_ANGLE(449334 * t + 188))
  th += .0085 * Math.cos(k * NORMALIZATION_ANGLE(826671 * t + 111))
  th += .0100 * Math.cos(k * NORMALIZATION_ANGLE(1431597 * t + 315))
  th += .0107 * Math.cos(k * NORMALIZATION_ANGLE(1303870 * t + 246))
  th += .0110 * Math.cos(k * NORMALIZATION_ANGLE(489205 * t + 142))
  th += .0125 * Math.cos(k * NORMALIZATION_ANGLE(1443603 * t + 52))
  th += .0154 * Math.cos(k * NORMALIZATION_ANGLE(75870 * t + 41))
  th += .0304 * Math.cos(k * NORMALIZATION_ANGLE(513197.9 * t + 222.5))
  th += .0347 * Math.cos(k * NORMALIZATION_ANGLE(445267.1 * t + 27.9))
  th += .0409 * Math.cos(k * NORMALIZATION_ANGLE(441199.8 * t + 47.4))
  th += .0458 * Math.cos(k * NORMALIZATION_ANGLE(854535.2 * t + 148.2))
  th += .0533 * Math.cos(k * NORMALIZATION_ANGLE(1367733.1 * t + 280.7))
  th += .0571 * Math.cos(k * NORMALIZATION_ANGLE(377336.3 * t + 13.2))
  th += .0588 * Math.cos(k * NORMALIZATION_ANGLE(63863.5 * t + 124.2))
  th += .1144 * Math.cos(k * NORMALIZATION_ANGLE(966404 * t + 276.5))
  th += .1851 * Math.cos(k * NORMALIZATION_ANGLE(35999.05 * t + 87.53))
  th += .2136 * Math.cos(k * NORMALIZATION_ANGLE(954397.74 * t + 179.93))
  th += .6583 * Math.cos(k * NORMALIZATION_ANGLE(890534.22 * t + 145.7))
  th += 1.2740 * Math.cos(k * NORMALIZATION_ANGLE(413335.35 * t + 10.74))
  th += 6.2888 * Math.cos(k * NORMALIZATION_ANGLE(477198.868 * t + 44.963))
  ang = NORMALIZATION_ANGLE(481267.8809 * t)
  ang = NORMALIZATION_ANGLE(ang + 218.3162)
  th = NORMALIZATION_ANGLE(th + ang)

  return th
}
/**
 * =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
 * =*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*
 */



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

  const date = new Date(`${y}/${m}/${d}`)
  const qreki = await new Qreki(date.getJD())

  const i = qreki.month - 1
  const j = qreki.day - 1
  const k = getElapsedDays(date) % 28

  return {
    S_27: SYUKUYO_27_LIST[i][j],
    S_28: SYUKUYO_28_LIST[k]
  }
}


// 1920/1/1 からの経過日数
const getElapsedDays = date => {
  const startDay = new Date('1920/1/1')
  const msecDiff = date.getTime() - startDay.getTime()
  const dayDiff = Math.floor(msecDiff / 1000 / 60 / 60 / 24)

  return dayDiff
}


module.exports = { numberology, xiuyaojing }
