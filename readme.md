# [Shin Astorology](https://ryutabi.github.io/shin_astrology/)<br>
## 〜複合式宿曜占星術〜
---
オリジナルの占いをする方の為に制作した作品。<br>
結果を得るために既存のサイト3度も訪問していたが、このツールで一回で結果を取得することができる。<br>
生年月日を入力し、各結果を表示。

## このツールで取得できる結果
- ソウルナンバー
- 宿曜
  - 27宿
  - 28宿

### ソウルナンバー
生年月日の各数字を全て足して算出する。<br>
算出した数字の「10の位」と「1の位」をもう一度足し、一桁になるまで繰り返す。<br>
最後に算出された一桁の数字がソウルナンバー。<br>
ゾロ目の場合はそのまま算出する。

### 27宿曜占星術
生年月日から旧暦を取得し、一覧表に基づき宿曜を出力する。<br>

旧暦を取得するために参考にしたサイト及びプログラム
- [旧暦計算サンプルスクリプト](https://www.vector.co.jp/soft/dos/personal/se016093.html)
- [qreki](https://wiki.suikawiki.org/n/qreki)
- プログラム
  - PHP版 [qreki.php](https://www.2chan.net/script/qreki.php.txt)
  - JavaScript版 [qreki.js](https://github.com/nasano/japanese-calendar/blob/master/scripts/qreki.js)

取得した旧暦の「月」と「日」から一覧表（[月宿傍通暦](https://nakshatra.tokyo/pc/30.html)）より27宿を選出する。

### 28宿曜占星術
1920/01/01 から生年月日までの経過日数を取得する。<br>
経過日数を28で割った余りで、一覧表より出力する。

---

当初は Web API で行っていたが、JavaScript に移行した事により爆速化を実現。<br>
JEST によるテストにて、計算精度を確認した。検証による精度は100％。<br>
PWA に対応させてアプリケーション化させた。
