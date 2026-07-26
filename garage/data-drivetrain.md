---
title: 駆動系・諸元データ（低速の押し出す力を計算するための正本）
---

# 駆動系データ ― 60km/h巡航の回転数を実ギア比から求める

`assets/lowspeed-pull.svg`（一般道の押し出す力）と `assets/lowrev-torque.svg` の作図根拠。
**手で置いた数値は使わない。** ここに無い値は図に描かない。

- 収集日: 2026-07-26
- 対象: 日本国内仕様。年式は各表に明記
- 用途: 「トップギアで60km/hを流すとき、エンジンは何回転か」を実測ギア比から計算する

---

## 1. 公式諸元（一次情報）

出力・トルク・重量・ギア比・タイヤは、すべて下の「出典一覧」の**メーカー公式**ページ／公式PDFから取得。

| 車種 | 年式・型式 | 最高出力 | 最大トルク | 車両重量 | 一次減速比 | 二次減速比 | トップギア | 後タイヤ |
|---|---|---|---|---|---|---|---|---|
| エリミネーター400 | 8BL-EL400A | 48PS/10,000 | 37N·m/8,000 | 176kg（SE 178kg） | 2.218 | 3.071 | 1.037（6速） | 150/80-16 |
| Ninja 400 | 2BL-EX400G（2018） | 48PS/10,000 | 38N·m/8,000 | 167kg | 2.218 | 2.928 | 1.037（6速） | 150/60R17 |
| Ninja 400 | 8BL-EX400L（現行） | 48PS/10,000 | 37N·m/8,000 | 167kg | 2.218 | 2.928 | 1.037（6速） | 150/60R17 |
| CBR400R | 8BL-NC56（2022） | 46PS/9,000 | 38N·m/7,500 | 192kg | 2.029 | 3.000 | 1.043（6速） | 160/60R17 |
| CBR400R E-Clutch | 8BL-NC65（2026） | 46PS/9,000 | 38N·m/7,500 | 195kg | 2.029 | 3.000 | 1.043（6速） | 160/60R17 |
| YZF-R3 | 8BL-RH25J | 42PS/10,750 | 30N·m/9,000 | 169kg | 3.043 | 3.071 | 0.800（6速） | 140/70R17 |
| Ninja ZX-4R SE | 8BL-ZX400P | 77PS/14,500<br>（ラムエア加圧時 80PS） | 39N·m/13,000 | 190kg | 2.029 | 3.428 | 1.037（6速） | 160/60ZR17 |
| CB400SF（教習車の世代） | EBL-NC42（2010） | 53PS/10,500 | 38N·m/9,500 | 194kg（ABS 199kg） | 2.171 | 2.933 | 1.130（6速） | 160/60ZR17 |
| Ninja ZX-25R | 2BK-ZX250E（2020） | 45PS/15,500 | 21N·m/13,000 | 183kg | 2.900 | 3.571 | 1.037（6速） | 150/60R17 |
| GSX250R | 8BK-DN12B | 24PS/8,000 | 22N·m/6,500 | 181kg | 3.238 | 3.285 | 0.807（6速） | 140/70-17 |

### 変速比 全段（参考）

- カワサキ4台（エリミ400・Ninja400・ZX-4R・ZX-25R）は**全車同一**: 2.928 / 2.055 / 1.619 / 1.333 / 1.153 / 1.037
- CBR400R: 3.285 / 2.105 / 1.600 / 1.300 / 1.150 / 1.043
- CB400SF NC42: 3.307 / 2.294 / 1.750 / 1.421 / 1.240 / 1.130
- YZF-R3: 2.500 / 1.823 / 1.347 / 1.086 / 0.920 / 0.800
- GSX250R: 2.416 / 1.529 / 1.181 / 1.043 / 0.909 / 0.807

---

## 2. 計算（式を明記）

**タイヤ外径**（カタログ表記から算出。実測ではない）

    外径 D [mm] = リム径[inch] × 25.4 + 2 × タイヤ幅[mm] × 扁平率[%] / 100

**総減速比**

    総減速比 = 一次減速比 × 二次減速比 × トップギア比

**トップギア巡航の回転数**

    エンジン回転数 [rpm] = 速度[m/min] ÷ (π × D[m]) × 総減速比
    ※ 60km/h = 1,000 m/min。タイヤのつぶれ・スリップは無視

| 車種 | 総減速比 | 後輪外径 | **60km/hの回転数** | 最大トルクに達する速度（トップギア） |
|---|---|---|---|---|
| CBR400R | 6.349 | 623.8mm | **3,240rpm** | 139km/h |
| エリミネーター400 | 7.064 | 646.4mm | **3,478rpm** | 138km/h |
| Ninja 400 | 6.735 | 611.8mm | **3,504rpm** | 137km/h |
| CB400SF NC42 | 7.195 | 623.8mm | **3,672rpm** | 155km/h |
| Ninja ZX-4R SE | 7.213 | 623.8mm | **3,680rpm** | 212km/h |
| YZF-R3 | 7.476 | 627.8mm | **3,791rpm** | 142km/h |
| GSX250R | 8.584 | 627.8mm | **4,352rpm** | 90km/h |
| Ninja ZX-25R | 10.739 | 611.8mm | **5,587rpm** | 140km/h |

---

## 3. ここから分かる重要な事実

1. **トップギアの60km/hは、どの車も3,200〜5,600rpm**。ZX-4Rは3,680rpmで、Ninja400（3,504）やCB400SF（3,672）とほとんど変わらない。
   （※ 旧 `lowspeed-pull.svg` はZX-4Rの60km/h回転を6,000rpmと手で置いていた。**これは誤り**）
2. **どの車も、トップギアでは最大トルクの回転にまるで届かない**。最大トルクが出るのは137〜212km/h相当。
   例外的に低いのはGSX250R（90km/h）だけ。
3. ZX-4Rだけは突出して高い（212km/h）。**「公道では山に届かない」というこの章の主張は、この数字で裏づけられる。**
4. 逆に言うと、**60km/h付近で各車が実際に何N·m出しているかは、公式諸元からは分からない**。
   公式が公表するのは「最大トルク点」と「最高出力点」の2点だけで、どちらも3,200〜5,600rpmよりはるか上にある。

---

## 4. 実測トルクカーブ（ダイノ）の入手状況

低回転域を実データで描くには実測カーブが要る。調査結果は以下。**大半が入手できない。**

| 車種 | 実測カーブ | 内容・制約 |
|---|---|---|
| Ninja 400 | **あり** | Motorcycle.com がDynojet 250iで後輪計測。44.0hp/10,000rpm・25.0lb-ft/8,000rpm。「フラットなトルク特性」と明記。単位はhp/lb-ft（米国式） |
| Ninja ZX-25R | **あり** | Akrapovič提供のノーマル計測（20.8N·m/約12,700rpm、〜17,000rpmまで）。ヤングマシンのBLR計測（後輪PS）もあり |
| Ninja ZX-4R | **使えない** | 見つかるのは米国仕様（56hp・11,500rpmで頭打ち）のみ。国内77PS仕様とは別物なので流用不可 |
| YZF-R3 | **使えない** | 見つかるのはマフラー交換＋セッティング済みの改造車 |
| エリミネーター400 | **なし** | 398ccの計測は見つからず。Cycle Worldにあるのは**451ccのエリミネーター500**で別物 |
| CBR400R | **なし** | NC56/NC65系の実測は見つからず |
| CB400SF NC42 | **なし** | 世代を特定できる信頼できる計測が見つからず |
| GSX250R | **なし** | 実走データ（最高速・0-100km/h）はあるが、ダイノ曲線ではない |

**結論: 8台を同じ土俵で実測比較することはできない。** 曲線を描くなら、それは推定であることを図中に明記する必要がある。

---

## 5. 情報源の食い違い・注意点

- **エリミネーター400の二次減速比**: 公式サイト `3.071`、2023年プレスリリースPDF `3.017`。歯数はどちらも43/14で、43÷14＝3.0714。**PDF側の誤記と判断し 3.071 を採用**
- **Ninja 400の最大トルク**: 2018年式(2BL) `38N·m`、現行(8BL) `37N·m`。**世代差**であり矛盾ではない
- **ZX-4Rの車両重量**: 2023年プレスリリースPDFは188/189kgだが、同PDFに「数値は海外仕様」と注記あり。**国内公式の190kg（SE）を採用**
- **ZX-25Rの二次減速比**: 検索要約では `3.429(48/14)` と出るが**誤り**（ZX-4Rの値との混同）。公式は全年式 `3.571(50/14)`
- **ZX-25Rの最大トルク**: 21N·m。旧 `lowspeed-pull.svg` が使っていた23N·mは**根拠不明**
- **CB400SF NC42の出力・重量**: 公式は53PS/194kg（2010年式）。旧図が使っていた56PS/201kgは**誤り**。なお2014年式以降は197kg（ABS 200kg）
- **CB400SF 教習車仕様**の個別諸元（重量・ギア比が市販車と同じか）は公式に記載がなく**不明**
- **GSX250Rの装備重量**: 公式181kg。旧図の178kgは**誤り**
- **CBR400R の重量**: 通常仕様192kg、E-Clutch仕様195kg（機構ぶん+3kg）

---

## 6. 出典一覧

### カワサキ（公式）
- [2027 Ninja ZX-4R SE 諸元](https://www.kawasaki-motors.com/ja-jp/motorcycle/ninja/supersport/ninja-zx-4r/2027-ninja-zx-4r-se)
- [2026 Ninja 400 諸元](https://www.kawasaki-motors.com/ja-jp/motorcycle/ninja/sport/ninja-400/2026-ninja-400)
- [2026 Ninja ZX-25R SE 諸元](https://www.kawasaki-motors.com/ja-jp/motorcycle/ninja/supersport/ninja-zx-25r/2026-ninja-zx-25r-se)
- [2027 ELIMINATOR SE 諸元](https://www.kawasaki-motors.com/ja-jp/motorcycle/eliminator/street-cruiser/eliminator/2027-eliminator-se)
- [ELIMINATOR 主要諸元 PDF（2023-03-17）](https://www.khi.co.jp/pressrelease/20230317-1.pdf)
- [Ninja ZX-4R 主要諸元 PDF（2023-02-02・海外仕様値注記あり）](https://www.khi.co.jp/pressrelease/news_230202-1.pdf)
- [Ninja ZX-25R SE 主要諸元 PDF（2023-03-20）](https://www.khi.co.jp/pressrelease/news_230320-1.pdf)
- [Ninja ZX-25R 主要諸元 PDF（2020）](https://prtimes.jp/a/?f=d28066-20200714-2206.pdf)
- [Ninja 400 主要諸元 PDF（2018）](https://prtimes.jp/a/?f=d28066-20180821-2174.pdf)

### ホンダ（公式）
- [CBR400R 2022年式 ニュースリリース（諸元表付き）](https://global.honda/jp/news/2021/2211203.html)
- [CBR400R 2019年式 ファクトブックPDF](https://www.honda.co.jp/factbook/motor/CBR400R/201903/P11.pdf)
- [CBR400R E-Clutch 2026年式 ニュースリリース](https://global.honda/jp/news/2026/2260515-cbr400r-nx400.html)
- [CBR400R E-Clutch 公式スペック（ギア比記載なし）](https://www.honda.co.jp/CBR400R/spec/)
- [CB400SF 2010年式 ニュースリリース（諸元表付き）](https://global.honda/jp/news/2010/2100209-cb400sf.html)
- [CB400SF 2008年式 ファクトブック](https://www.honda.co.jp/factbook/motor/CB400/200801/013.html)
- [CB400SF 2014年式 ファクトブックPDF](https://www.honda.co.jp/factbook/motor/CB400/201403/P09.pdf)

### ヤマハ・スズキ（公式）
- [YZF-R3 / YZF-R25 諸元](https://www.yamaha-motor.co.jp/mc/lineup/yzf-r25/spec.html)
- [GSX250R 諸元](https://www1.suzuki.co.jp/motor/lineup/gsx250rrlzm6/?page=style)
- [GSX-R250〜GSX250R 諸元表PDF（旧型クロスチェック用）](https://www.suzuki.co.jp/suzuki_digital_library/pdf/2_moto/sports/084.pdf)

### 実測ダイノ（すべて非公式）
- [Ninja 400 実測（Motorcycle.com・Dynojet 250i・後輪）](https://www.motorcycle.com/manufacturer/kawasaki/2018-kawasaki-ninja-400-exclusive-dyno-run-and-measured-weight.html)
- [ZX-25R 実測（Asphalt & Rubber／Akrapovič提供・後輪）](https://www.asphaltandrubber.com/bikes/akrapovic-kawasaki-ninja-zx-25r-horsepower-dyno/)
- [ZX-25R 実測対決（ヤングマシン・BLR計測・後輪PS）](https://young-machine.com/2020/11/11/141382/)
- [ZX-4R 実測（Cycle World）※**米国仕様**なので国内77PS仕様には使えない](https://www.cycleworld.com/bikes/kawasaki-ninja-zx-4rr-dyno-test-2023/)
- [エリミネーターSE 実測（Cycle World）※**451ccのエリミネーター500**であり398ccとは別物](https://www.cycleworld.com/bikes/kawasaki-eliminator-se-dyno-test-2024/)
