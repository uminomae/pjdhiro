# garage データ・根拠リファレンス（アドベンチャー／スクランブラー編）

`garage/data.md` の姉妹ファイル。**401〜700ccのアドベンチャー／スクランブラー**と、**普通二輪免許（399cc以下）で買えるADV**の一次情報をまとめる。プラットフォーム共用（同一エンジンで外装だけ違うのか、ジオメトリまで作り分けているのか）の検証結果もここに置く。

調査時点：2026年7月（価格・在庫状況は変動するため要再確認）。

**読み物版**：[`garage/draft-hand-numbness.md`](draft-hand-numbness.md) — 「手が痺れるか」という素朴な実用指標を軸に、2台構成（Z400＋250）の結論までを物語順に整理したもの。HTML化するならこちらが元。**数値の根拠はこのファイル**。

- `✓` = メーカー公式諸元・公式PDF・公式ニュースリリースで確認済み
- `△` = 媒体・二次情報のみ（公式に記載がない項目）
- `?` = 未確認・資料間で矛盾

---

## 0. 検証の要点（結論だけ先に）

1. **サスストロークには明確な階層がある。** ネイキッド 120〜130mm ＜ スクランブラー 130〜150mm ＜ ADV 135〜150mm ＜ 本格ADV 200〜265mm。
2. **「スクランブラーは外装とタイヤだけ」は誤り。** 調べた範囲で例外は CFMOTO 700CL-X のみ（全グレードでサスストローク150/150mm完全同一）。他は全てジオメトリかサスのどちらか、多くは両方が違う。
3. **スクランブラー化の業界定石**＝前輪19インチ化＋サス+20〜30mm＋ホイールベース+60〜75mm＋トレール+6〜11mm。Honda CL500・RE Bear 650・Triumph Scrambler 400X の3社で一致。
4. **ただしVersys 650は例外的なやり方**をしている。ホイールベースはZ650比+5mmのみ、ホイール径・タイヤは完全同一。変えたのはサスストローク・最低地上高・カウルだけ（§4参照）。
5. **スクランブラーはADVの下位互換。** CL500の地上高155mmは、同エンジンのNX500（180mm）を下回る。

---

## 1. 普通二輪免許（399cc以下）で買えるADV／スクランブラー

日本市場で最も選択肢が狭い領域。**これが今回の検討の核心。**

| モデル | 排気量・形式 | 最高出力 | 最大トルク | 車重 | 前輪 | サス前/後 | キャスター/トレール | WB | 地上高 | シート高 | カウル | 価格 | 状況 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **KTM 390 ADVENTURE X** | 398.7cc 単気筒 | 45PS ✓ | 39N·m ✓ | 約165kg ✓（燃料含まず） | 19" | ? | ? | 1,464mm ✓ | ? | 825mm ✓ | 有 | **799,000円** ✓ | 2026年6月発売 |
| **KTM 390 ADVENTURE R** | 398.7cc 単気筒 | 45PS/8,500 ✓ | 39N·m/7,000 ✓ | 165kg ✓ | **21"スポーク** | ? | ? | ? | ? | 870mm ✓ | 有 | **979,000円** ✓ | 2026年9月発売 |
| **Honda NX400** | 399cc 並列2気筒 | 46PS/9,000 ✓ | 38N·m/7,500 ✓ | 196kg ✓（E-Clutch 199kg） | 19"キャスト | 135/135 △ | **27°30′/108mm** ✓ | 1,435mm ✓ | 150mm ✓ | 800mm ✓ | 有 | **891,000円** ✓（E-Clutch 1,111,000円） | 現行 |
| Honda 400X | 399cc 並列2気筒 | 46PS/9,000 ✓ | 38N·m/7,500 ✓ | 199kg ✓ | 19"キャスト ✓ | 公式未記載 | 27°30′/108mm ✓ | 1,435mm ✓ | 150mm ✓ | 800mm ✓ | 有 | 858,000円 ✓ | **2023年12月生産終了** |
| Triumph Scrambler 400X | 398cc 単気筒 | ? | ? | 180kg ✓ | 19"（100/90-19）✓ | 150/– ✓ | 23.2°/– ✓ | 1,420mm ✓ | 195mm △ | 835mm ✓ | 無 | 949,000円 ✓ | 現行 |
| Kawasaki Z400 | 398cc 並列2気筒 | 48PS/10,000 ✓ | 37N·m/8,000 ✓ | **166kg** ✓ | 17"キャスト | **120/130** ✓ | 24.5°/92mm ✓ | 1,370mm ✓ | 145mm ✓ | 785mm ✓ | 無 | 770,000円 ✓ | 現行 |
| Kawasaki Ninja400 | 398cc 並列2気筒 | 48PS/10,000 ✓ | 37N·m/8,000 ✓ | 167kg ✓ | 17"キャスト | 120/130 ✓ | 24.7°/92mm ✓ | 1,370mm ✓ | 140mm ✓ | 785mm ✓ | 有（スポーツ） | 814,000円 ✓ | 現行 |
| Kawasaki Versys-X 250 | 249cc | — | — | — | 19"スポーク | — | — | — | — | — | 有 | — | **2023年終了** |

**Z400/Ninja400 の詳細（公式PDF）**
- ボア×ストローク 70.0×51.8mm ✓ / 圧縮比 11.5:1 ✓
- タイヤ 110/70R17M/C 54H ／ 150/60R17M/C 66H ✓（ラジアル）
- ホイール 17×MT3.00 ／ 17×MT4.00 キャスト ✓
- 前サス テレスコピック インナー径41mm・ホイールトラベル120mm ✓
- 後サス スイングアーム（ボトムリンク・ユニトラック）130mm ✓

**Honda 400X/NX400/CL500 のエンジン関係（公式）**
- 400X/NX400：ボア×ストローク **67.0×56.6mm** ✓ / 圧縮比 11.0 ✓
- CL500/NX500：ボア×ストローク **67.0×66.8mm** ✓ / 圧縮比 10.7 ✓
- → **ボア共通・ストロークのみ変更**した兄弟エンジン。400は日本の400ccクラス対応で腰下を作り分けている。

---

### 1-2. ★タイヤ問題は解決済み：110/70R17・150/60R17 にブロックパターンは実在する

**Husqvarna Svartpilen 401** が Z400/Ninja400 と**完全に同一のタイヤサイズ（110/70R17・150/60R17）**で、純正に **Pirelli Scorpion Rally STR**（ブロックパターン）を装着している ✓。
→ Z400ベースで「17インチのままブロックタイヤ」を実現する際の銘柄は確実に存在する。長らく未解決だった唯一の技術的リスクはこれで消えた。

**Svartpilen 401（2026）諸元** — 398.6cc 水冷単気筒DOHC4バルブ ✓／45PS/8,500rpm ✓／3.9kgm(約38N·m)/7,000rpm ✓／乾燥159kg ✓（装備は約170kg推定）／WB 1,368±15.5mm ✓／トレール95mm ✓／シート高820mm ✓／前サス150mm △／燃料13L ✓／日本価格 不明。2024年式で373cc→398.6ccに拡大＋シート高15mm低下＋WB延長。
→ **構想（17インチ・軽量・短WB・ブロックタイヤ）の完成品がすでに市販されている。**ただし単気筒、シート高はZ400より35mm高い。

### 1-3. ★Z400RS は存在しない（2026年7月時点）

未発表。噂されている「Z400RS」は **ZX-4Rベースの直列4気筒ネオクラシック**で、並列2気筒のZ400とは別物。予想価格100〜120万円（媒体予想のみ、公式発表なし）。
→ 中型免許で選べるカワサキ並列2気筒は **Z400（770,000円）と Ninja400（814,000円）の2台のみ**。

### 1-4. 中型枠でのジオメトリ比較（キビキビ度）

| | キャスター/トレール | ホイールベース | 車重 | 出力 | 前輪 |
|---|---|---|---|---|---|
| **Z400** | **24.5°/92mm** ✓ | **1,370mm** ✓ | **166kg** ✓ | 48PS ✓ | 17" |
| Ninja400 | 24.7°/92mm ✓ | 1,370mm ✓ | 167kg ✓ | 48PS ✓ | 17" |
| Svartpilen 401 | –/95mm ✓ | 1,368mm ✓ | 159kg（乾燥）✓ | 45PS ✓ | 17" |
| MT-03 | ? | ? | 168kg | 42PS（320cc） | 17" |
| Triumph Speed 400 | 24.6°/102mm ✓ | 1,377mm ✓ | 170kg ✓ | ? | 17" |
| Triumph Scrambler 400X | 23.2°/– ✓ | 1,420mm ✓ | 180kg ✓ | ? | 19" |
| GB350 | **27.5°/120mm** ✓ | 1,440mm ✓ | 179kg ✓ | **20PS/5,500rpm** | 19" |
| CL250 | 27.0°/108mm ✓ | 1,485mm ✓ | 172kg ✓ | 24PS | 19" |
| NX400 | 27°30′/108mm ✓ | 1,435mm ✓ | 196kg ✓ | 46PS ✓ | 19" |
| **エリミネーター** | **30.0°/121mm** ✓ | **1,520mm** ✓ | 176kg ✓ | 48PS | 18" |
| レブル250 | 28.0°/110mm ✓ | 1,490mm ✓ | 171kg ✓ | — | 18" |

→ **Z400/Ninja400 が中型枠で最短WB・最小トレール**。エリミネーターは対極（WB+150mm・トレール+29mm・キャスター+5.5°）で、キビキビ方向とは真逆。GB350は27.5°/120mmの安定志向＋20PS。

---

## 2. 401〜700cc アドベンチャー

| モデル | 排気量・形式 | 最高出力 | 最大トルク | ボア×スト | 車重 | 前輪 | 後輪 | サス前/後 | キャスター/トレール | WB | 地上高 | シート高 | 価格・状況 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **CFMOTO 450MT** | 449cc 並列2気筒 **270°** | 42.1PS/8,500 ✓ | 42N·m/6,500 ✓ | 72×55.2 ✓ | **185kg** ✓ | 21"スポーク | 18" | **200/200** ✓（KYB） | ? | 1,505mm ✓ | **220mm** ✓ | 820mm（調整800）✓ | **999,900円** ✓ 日本正規 |
| **RE Himalayan 450** | 452cc 単気筒 | 40PS/8,000 ✓ | 40N·m/5,500 ✓ | 84×81.5 ✓ | 195kg ✓ | 21"スポーク | 17" | **200/200** ✓（Showa φ43倒立） | ? | 1,510mm ✓ | **230mm** ✓ | 825/845mm ✓ | **880,000円**〜 ✓ 日本正規 |
| Honda NX500 | 471cc 並列2気筒 | 47PS/8,500 ✓ | 43N·m/6,500 ✓ | 67.0×66.8 ✓ | 199kg ✓ | 19"キャスト | 17" | 150/– ✓ | 27.5°/108mm ✓ | 1,443-1,445mm ✓ | **180mm** ✓ | 830mm ✓ | **日本未導入** |
| **Kawasaki Versys 650** | 649cc 並列2気筒 | 67PS/8,500 ✓ | 61N·m/7,000 ✓ | 83.0×60.0 ✓ | 219kg ✓ | **17"キャスト** | 17" | **150/145** ✓ | 25.0°/108mm ✓ | 1,415mm ✓ | 170mm ✓ | 845mm ✓ | 1,166,000円 ✓ |
| Benelli TRK502X | 500cc 並列2気筒 | 47.6PS/8,500 ✓ | 46N·m/6,000 ✓ | 69.0×66.8 ✓ | 235kg（乾燥表記）? | 19"スポーク | 17" | 140/– ✓ | ? | 1,505mm ✓ | 210mm ✓ | 830mm ✓ | 968,000円 ✓ 日本正規 |
| Triumph Tiger Sport 660 | 660cc **3気筒** | 95PS/11,250 ✓（2026） | 68N·m/8,250 ✓ | 74.04×51.1 ✓ | 206kg ✓ | 17"キャスト | 17" | 150/150 ✓ | **23.1°/97mm** ?（ADVとして不自然・要再確認） | 1,418mm ✓ | ? | 835mm ✓ | 1,179,000円 ✓ |
| Yamaha Ténéré 700 | 689cc 並列2気筒 CP2 | ? | ? | ? | 208kg ✓ | 21"スポーク | 18" | **210/200** ✓ | 27°/105mm ✓ | 1,595mm ✓ | ? | 875mm ✓ | 1,452,000円 ✓ |
| Aprilia Tuareg 660 | 659cc 並列2気筒 | 80PS/9,250 ✓ | 70N·m/6,500 ✓ | 81.0×63.93 ✓ | 204kg（乾燥187）✓ | 21"スポーク | 18" | **240/240** △ | 26.7°/114mm △ | 1,500mm ✓ | 240mm ? | 860mm ✓ | 約139.7〜176万円 |
| KTM 690 Enduro R | 692.7cc 単気筒 | 79PS/8,000 ✓ | 73N·m/6,750 ✓ | 105×80 ✓ | 乾燥152kg ✓ | 21"スポーク | 18" | **265/250** ✓（WP XPLOR φ48） | ? | 1,506mm ✓ | **265mm** ✓ | 935mm ✓ | **1,799,000円** ✓ |
| Husqvarna 701 Enduro | 692.7cc 単気筒 | 79PS ✓ | 73N·m ✓ | 105×80 ✓ | 乾燥152kg ✓ | 21"スポーク | 18" | 265/250 ✓ | ? | 1,506mm ✓ | 265mm ✓ | 935mm ✓ | 日本価格 不明 |
| Voge DS525X | 494cc 並列2気筒 | 39.6kW/8,500 ✓ | 50.5N·m/7,000 ✓ | 67×63.5 ✓ | 190kg（kerb）? | 19"スポーク | 17" | 170/– ✓ | ? | 1,456mm ✓ | 200mm ✓ | 810/830mm ✓ | 日本正規 未確認 |
| Voge DS625X | **581cc** 並列2気筒 270° | 63-64PS/9,000 ✓ | 57N·m/6,500 ✓ | ? | 206kg ✓ | 19"スポーク | 17" | 174/– ✓ | ? | 1,465mm ✓ | 220mm ✓ | 835mm ✓ | 日本正規 未確認 |
| Moto Morini X-Cape 650 | 649cc 並列2気筒 | 60PS/8,250 ✓ | 54N·m/7,000 ✓ | 83×60 ✓ | 約234kg（乾燥213）✓ | 19"（スポーク/キャスト2種） | 17" | ?（Marzocchi φ50倒立） | ? | 1,490mm ✓ | ? | 820mm ✓ | 日本価格 不明（PCI取扱） |
| Zontes 703F | 699cc **3気筒** | 96-97hp/10,000 ✓ | 76N·m/7,500 ✓ | 70×60.6 ✓ | 236kg ✓ | 21"スポーク（チューブレス） | 18" | 180/180 ✓（Marzocchi） | ? | 1,565mm ✓ | 205mm ✓ | 845mm ✓ | **日本未導入** |
| Kove 450 Rally | 449.9cc 単気筒 | 65PS/9,500 ✓ | 50N·m/7,500 ✓ | ? | 128kg（curb）✓ | 21"スポーク | 18" | ? | ? | 1,490mm ✓ | **310mm** ✓ | 960mm ✓ | KOVE Japan取扱・価格不明 |
| Suzuki V-Strom 650 | 645cc V型2気筒 | ? | ? | ? | 216kg ✓ | ? | ? | ? | ? | 1,560mm ✓ | ? | 835mm ✓ | **2025年モデルで生産終了** |
| CFMOTO 700MT | 693cc 並列2気筒 | 約68PS/9,500 ✓ | 60N·m/6,000 ✓ | ? | 258kg（満タン）✓ | 19" | 17" | ? | ? | ? | ? | 800-840mm可変 ✓ | 日本導入 不明 |
| Fantic Caballero Rally 500 | 463cc 単気筒 | 45PS/8,000 ✓ | 42.5N·m/7,000 ✓ | ? | **150kg** ✓ | 21"スポーク | 17" | **200/200** ✓ | ? | 1,455mm ✓ | ? | 860mm ✓ | 1,400,000円 ✓ |

**存在しないもの（確認済み）**
- **V-Strom 500** は存在しない。スズキの現行V-Stromは 800 / 800DE / 800DE Adventure / 1050 / 1050DE のみ。
- **KTM 490 Adventure** は2026年7月時点で未発売（Bajaj共同開発の並列2気筒、EICMA 2026お披露目→2027年投入見込みの媒体予測のみ）。
- **Husqvarna Norden 501** も未発売。Norden 901 は889ccで対象外。
- **Kawasaki に400ccクラスのアドベンチャーは存在しない**（Versys-X 250 は2023年終了、その上は Versys 650）。
- KTM 390 Adventure の現行は **399cc（398.7cc）**。旧世代の373ccから変更。ボア89×ストローク64mm。

---

## 3. 401〜700cc スクランブラー

| モデル | 排気量・形式 | 最高出力 | 最大トルク | ボア×スト | 車重 | 前輪 | 後輪 | タイヤ | サス前/後 | キャスター/トレール | WB | 地上高 | シート高 | 価格・状況 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Honda CL500** | 471cc 並列2気筒 | 46PS/8,500 ✓ | 43N·m/6,250 ✓ | 67.0×66.8 ✓ | 192kg ✓ | 19"**キャスト** ✓ | 17" | 110/80R19・150/70R17 ✓ | 150/145 ✓ | 27°00′/108mm ✓ | 1,485mm ✓ | 155mm ✓ | 790mm ✓ | 973,500円 ✓（発売時863,500円） |
| **RE Bear 650** | 648cc 空冷 並列2気筒 | 47PS/7,150 ✓ | 56.5N·m/5,150 ✓ | 78.0×67.8 △ | 214kg ✓ | 19"スポーク ✓ | 17" | 100/90-19・140/80R17 ✓ | 130/114 △（φ43倒立） | 26.1°/117mm △ | 1,460mm △ | 183mm △ | 830mm ✓ | 1,041,700〜1,068,100円 ✓ |
| Fantic Caballero Scrambler 700 | 689cc 並列2気筒（CP2） | 74hp/9,000 ✓ | 70N·m/6,500 ✓ | ? | 175kg（燃料抜）/装備約195kg ✓ | 19"スポーク | 17" | 110/80R19・150/70R17 ✓ | 150/150 ✓（Marzocchi φ45倒立） | ? | 1,460mm ✓ | ? | 830mm ✓ | 700系で約185万円まで（Scrambler単体価格 不明） |
| Fantic Caballero Scrambler 500 | 463cc 単気筒 | 44PS/8,000 ✓ | 42N·m/7,000 ✓ | ? | **150kg** ✓ | 19"スポーク | 17" | 110/80-19・140/80-17 ✓ | 150/150 ✓（φ41倒立） | ? | 1,425mm ✓ | ? | 820mm ✓ | 998,000〜1,340,000円 ✓ |
| Brixton Crossfire 500XC | 486cc 並列2気筒 | 47.6PS/8,500 ✓ | 43N·m/6,750 ✓ | ? | 195kg ✓ | 19"スポーク（2.50×19） | 17"スポーク | 110/80-19・150/60-17 ✓ | 150/130 ✓ | ? | ? | ? | 839mm ✓ | 1,298,000円 ✓ 日本正規 |
| Brixton Crossfire 500X | 486cc 並列2気筒 | 47.6PS/8,500 ✓ | 43N·m/6,750 ✓（日本公式は45N·m表記で矛盾 ?） | ? | 190kg ✓ | 17"キャスト | 17"キャスト | 120/70ZR17・160/60ZR17 ✓ | ? | ? | ? | ? | 795mm ✓ | 1,150,000円 ✓ 日本正規 |
| CFMOTO 700CL-X Heritage | 693cc 並列2気筒 | 74PS/8,500 △ | 68N·m △ | ? | 196kg（一部198kg）? | **17"か19"か資料矛盾** ? | 17" | ? | 150/150 ✓ | 24.5°/109mm △ | ? | ? | 800mm ✓ | **日本未導入** |
| CFMOTO 700CL-X Sport | 693cc 並列2気筒 | 同上 | 同上 | ? | ? | 17"キャスト | 17" | 120/180 | **150/150** ✓ | 24.3°/102.5mm △ | ? | ? | ? | 日本未導入 |
| CFMOTO 700CL-X Adventure | 693cc 並列2気筒 | 同上 | 同上 | ? | ? | 18"スポーク | 17" | Pirelli Scorpion Rally STR 110/170 | **150/150** ✓ | ? | ? | ? | ? | 日本未導入 |
| Benelli Leoncino 500 Trail | 500cc 並列2気筒 | 47.6PS/8,500 ✓ | 46N·m/6,000 ✓ | ? | 207kg（乾燥表記）／媒体190kg kerb ? | 19"スポーク | 17" | 110/80R19・150/70R17 ✓ | 135/– ✓（φ50倒立） | ? | 1,460mm ✓ | 190mm ✓ | 840mm（一部815mm表記 ?） | **日本未導入**（プロトのラインナップは125/250のみ） |
| Voge 525ACX | 494cc 並列2気筒 | 47.6PS ✓ | 44.5N·m/7,000 ✓ | ? | 乾燥185kg ✓ | 19"スポーク | 17" | 110/80-19・150/70-17 ✓ | ?（φ41倒立） | ? | 1,450mm ✓ | 200mm ✓ | 820mm ✓ | 日本正規なし |
| Moto Morini Seiemmezzo SCR | 649cc 並列2気筒 | 60PS/8,250 ✓ | 54N·m/7,000 ✓ | 83×60 ✓ | 195kg ✓ | 18" | 17" | ? | ? | ? | ? | ? | 810mm ✓ | 日本正規販売 不明 |
| Mash X-Ride 650 | 643.7cc 空油冷 **単気筒** | 39.3PS/6,000 ✓ | 49.2N·m/4,500 ✓ | ? | 乾燥169〜177kg ? | 17"（Trail仕様21"の記載あり ?） | 17"/18" | 120/70-17・150/60-17 ✓ | 150/150 ✓ | ? | 1,470mm ✓ | ? | 850/890mm ✓ | 日本正規なし（€5,799） |
| Macbor Montana XR5 500 | 500cc 2気筒 | ? | ? | ? | 178kg ✓ | キャストホイール（サイズ不明） | ? | Metzeler Tourance | ? | ? | ? | ? | ? | 日本正規なし（€6,199） |

**参考（401〜700cc外）**：Ducati Scrambler Icon 803cc、Triumph Scrambler 900 900cc（65PS/7,250・223kg・19"スポーク・145.9万円）、Triumph Scrambler 1200 X/XE 1,197cc（21"フロント）。
**Malaguti** には401〜700ccモデルが存在しない（現行は125ccのみ）。

---

## 4. Versys 650 vs Z650 ★重要

**カワサキ自身が同一プラットフォームでやった「ネイキッド→アドベンチャー」変換の実例。** Z400をADV化する場合の設計図として最も参考になる。

| | Z650 | Versys 650 | 差 |
|---|---|---|---|
| エンジン | 649cc 並列2気筒 | 649cc 並列2気筒 | **同一** |
| 最高出力／最大トルク | 68PS/8,000rpm ✓・63N·m/6,700rpm ✓ | 67PS/8,500rpm ✓・61N·m/7,000rpm ✓ | 微差（低回転寄り） |
| 前後タイヤ | 120/70ZR17・160/60ZR17 | 120/70ZR17・160/60ZR17 | **完全同一** |
| ホイール径 | 17/17 キャスト | 17/17 キャスト | **同一** |
| ホイールベース | 1,410mm ✓ | 1,415mm ✓ | **+5mm** |
| キャスター/トレール | 24.0°/100mm ✓ | 25.0°/108mm ✓ | +1.0°／+8mm |
| **前サスストローク** | **125mm** ✓ | **150mm** ✓ | **+25mm** |
| **後サスストローク** | **130mm** ✓ | **145mm** ✓ | **+15mm** |
| **最低地上高** | **130mm** ✓ | **170mm** ✓ | **+40mm** |
| **車両重量** | **189kg** ✓（Z650 S 190kg） | **219kg** ✓ | **+30kg** |
| シート高 | 790mm前後 | 845mm ✓ | +55mm |
| カウル | 無 | 有（可変スクリーン） | — |
| 価格 | 1,034,000円 ✓（S 1,078,000円） | 1,166,000円 ✓ | +132,000円 |

**読み取り**：CL500やBear 650がやっている「前輪19インチ化＋WB+60〜75mm」を、Versysは**一切やっていない**。変えたのは①サスストローク ②最低地上高 ③カウル の3点のみ。キャスター/トレールの変化（+1.0°/+8mm）もサスが伸びた副産物に近い。
**そして同じ変換でZ650比+30kg**。Z400（166kg）に同等処理をすれば190kg台に届き、軽さの優位が消える。

---

## 5. プラットフォーム共用の検証結果

### 5-0. Kawasaki 649cc ファミリー詳細（Z650 / Z650RS / Ninja650）

| | Z650（Z650 S） | Z650RS | Versys 650 |
|---|---|---|---|
| フレーム | トレリス（鋼） | トレリス（鋼）**共用** | トレリス（鋼） |
| 最高出力 | 68PS/8,000rpm ✓ | 同一 | 67PS/8,500rpm ✓ |
| 最大トルク | 63N·m/6,700rpm ✓ | 同一 | 61N·m/7,000rpm ✓ |
| キャスター/トレール | 24.0°/100mm ✓ | **24.0°/100mm** ✓ | 25.0°/108mm ✓ |
| サス前/後 | 125/130mm ✓ | **125/130mm** ✓ | 150/145mm ✓ |
| ホイールベース | 1,410mm ✓ | 1,410mm ✓ | 1,415mm ✓ |
| 最低地上高 | 130mm ✓ | ? | 170mm ✓ |
| 車両重量 | 189kg（S 190kg）✓ | 約192kg △ | 219kg ✓ |
| シート高 | 790mm（S 805mm）✓ | ? | 845mm ✓ |
| タイヤ | 120/70ZR17(58W)・160/60ZR17(69W) ✓ | 同一 △ | 120/70ZR17・160/60ZR17 ✓ |
| 価格 | 1,034,000円 ✓（S 1,078,000円） | **1,089,000円** ✓（2025/11/15発売） | 1,166,000円 ✓ |

→ Z650 / Z650RS / Ninja650 は**ジオメトリ・サスストローク・ホイールベースが完全一致**。メインフレーム共用で、違いは外装とリアサブフレーム（テール形状）＋約3kg。
※ 一部媒体がZ650RSを「ダイヤモンドフレーム」と表記するが、カワサキ公式の系譜はトレリス。**表記ゆれとして要注意**。

### 5-1. 完全に「外装だけの兄弟車」（ジオメトリ・サス一致）

| プラットフォーム | 車種 | キャスター/トレール | サス前/後 |
|---|---|---|---|
| Kawasaki 399cc | Ninja400 / Z400 | 24.7°/92mm ・ 24.5°/92mm | 120/130 両車同一 |
| Kawasaki 649cc | Z650 / Z650RS / Ninja650 | 全て 24.0°/100mm | 全て 125/130 |
| Yamaha CP2 | MT-07 / XSR700 | 24.8°/90mm ・ 25°/90mm | 130/130 |
| **CFMOTO 693cc** | 700CL-X Heritage/Sport/**Adventure** | 24.5°/109 ・ 24.3°/102.5 | **全グレード 150/150** |

→ **CFMOTO 700CL-X が「スクランブラーは外装とタイヤだけ」の唯一の実例**。

### 5-2. ジオメトリまで作り分けている例（スクランブラー化の定石）

| プラットフォーム | 比較 | キャスター差 | トレール差 | 前サス差 | 後サス差 | WB差 | 前輪 |
|---|---|---|---|---|---|---|---|
| Honda 471 | CL500 vs CB500 Hornet | +1.5° | +6mm | **+30mm** | +25mm | **+74mm** | 17→**19** |
| RE 648 | Bear 650 vs Interceptor 650 | +2.1° | +11mm | +20mm | +27mm | **+62mm** | 18→**19** |
| Triumph 398 | Scrambler 400X vs Speed 400 | — | +7.6mm | +10mm | +20mm | **+41mm** | 17→**19** |

参考数値：CB500 Hornet 25.5°/102mm・F120/R120・WB1410・地上高145mm・シート高785mm。Interceptor 650 24°/106mm・F110/R88・WB1398・18"/18"・地上高174mm。Speed 400 24.6°/102mm・WB1377・170kg。

### 5-3. フレームごと別物にしている例

| プラットフォーム | ADV/派生側 | フレーム |
|---|---|---|
| Aprilia 659 | Tuareg 660 | **鋼管**（RS/Tuonoはアルミツインスパー）。エンジン搭載も3点→6点マウント＋10°後傾 |
| Yamaha CP2 | Ténéré 700 | **ダブルクレードル別フレーム**（MT-07は鋼ダイヤモンド）。27°/105mm・WB1,590-1,595・F210/R200 |
| Yamaha CP2 | Fantic Caballero 700 | **CrMo鋼＋アルミ鋳造スイングアーム**（エンジンのみヤマハ外部供給） |
| Suzuki 645 | V-Strom 650 | **アルミツインスパー**（SV650は鋼トレリス）。両車とも2025年で終了 |
| Kawasaki 399 | Eliminator 400 | **451cc（ストローク58.6mm）＋新設計トレリス**。30°/120mm・176kg |
| Honda 471 | Rebel 500 | **鋼チューブ別フレーム**。28°/110mm・F121/R95・16"/16" |
| RE 648 | Super Meteor 650 / Shotgun 650 | **Harris製新設計**。27.6°/118.5mm・WB1500・19"/16" ／ 25.3°・WB1465・18"/17" |

### 5-4. Triumph 660（3気筒）

Trident 660 24.6°/107mm・F120/R130 ／ Tiger Sport 660 23.1°/97mm・F150/R150 ／ Daytona 660 23.8°/81mm・F110/R130。フレームは共通ベース、ジオメトリとサスは作り分け。**スクランブラー銘柄なし。**
※ Tiger Sport 660 のキャスター23.1°はTridentより立っており、ADVとして不自然。**この1数値は要再確認。**

---

## 5-5. ★スクランブラー化の正体は「19インチ化＋ホイールベース延長」であって、地上高ではない

同一プラットフォームのネイキッド→スクランブラーの差分を並べると、**最低地上高はほとんど変わっていない**（+9〜10mm）。動いているのは前輪径とホイールベース。

| 項目 | CL500 vs CB500 Hornet | Bear 650 vs Interceptor 650 | Scrambler 400X vs Speed 400 |
|---|---|---|---|
| **前輪径** | 17 → **19** | 18 → **19** | 17 → **19** |
| **ホイールベース** | 1,410 → 1,485（**+75mm**） | 1,398 → 1,460（**+62mm**） | 1,377 → 1,420（**+43mm**） |
| トレール | +6mm | +11mm | +7.6mm |
| キャスター | +1.5° | +2.1° | — |
| 前サスストローク | +30mm | +20mm | +10mm |
| **最低地上高** | 145 → 155（**+10mm**） | 174 → 183（**+9mm**） | → 195mm |

**結論**：スクランブラーは「越える」車ではなく「緩い路面で落ち着く」車。19インチ前輪（凹凸への当たり角が浅い・ジャイロ効果）＋WB延長＋トレール増で、直進安定性を積み増している。CL500の地上高155mmが同エンジンのNX500（180mm）に25mm負けているのは、狙いが違うから。

### 設計思想の3層

| | 主な手段 | 狙い |
|---|---|---|
| スクランブラー | 19インチ＋WB延長＋サス微増 | **緩い路面で落ち着く** |
| アドベンチャー | ＋地上高180mm＋サス150mm | **越える** |
| 本格ADV | 21インチ＋サス200〜265mm | **攻める** |

### 第4の選択：17インチのままブロックタイヤ

Z650/Ninja650/Z650RS にブロックタイヤを履かせた場合、17インチのまま・WB1,410mmのままなので、**スクランブラーの定義的変更を両方ともやらない**。スクランブラーの安定パッケージもADVのクリアランスも持たない代わりに、**24.0°/100mm・189kgの軽快さをそのまま保つ**。
→ 平坦な未舗装路（軽トラ基準）＋一般道メインという用途には、3層のどれよりも噛み合う。1960年代の原点（ロードバイク＋ブロックタイヤ＋アップマフラー）にも最も近い位置。
→ 実在の近縁車：**Brixton Crossfire 500X**（190kg・17"/17"キャスト・120/70ZR17・160/60ZR17・シート高795mm）がZ650とほぼ同一スペック。CFMOTO 700CL-X Sport、Moto Morini Seiemmezzo SCR も同じ棚。

### 低い車高が有利に働く理由（平坦路限定）

シート高790mm（Versys 845 / Himalayan 825-845 / 450MT 820）→ 砂利上で両足が着く安心感。低重心で前輪が滑ったときの立て直しが素直。短いサスは平坦路では挙動が読みやすい。
地上高130mmが効くのは①轍中央の盛り上がり ②大きめの石・段差 ③深い泥や雪 のみ。軽トラ基準の道では該当しない。対策はアンダーガード（2〜4万円、主目的は飛び石）。

---

## 6. サスストロークの階層（総まとめ）

```
ネイキッド        120〜130mm   Z400(120/130) Z650(125/130) MT-07(130/130)
スクランブラー     130〜150mm   Bear650(130/114) CL500(150/145) Caballero(150/150)
アドベンチャー     135〜150mm   NX400(135/135) Versys650(150/145) NX500(150/-) TigerSport660(150/150)
本格ADV          200〜265mm   CFMOTO450MT(200/200) Himalayan450(200/200)
                              Ténéré700(210/200) Tuareg660(240/240) KTM690EnduroR(265/250)
```

最低地上高でも同じ階層：Z650 130 ＜ Ninja400 140 ＜ Z400 145 ＜ NX400 150 ＜ CL500 155 ＜ Versys650 170 ＜ NX500 180 ＜ Bear650 183 ＜ TRK502X 210 ＜ 450MT 220 ＜ Himalayan450 230 ＜ 690EnduroR 265 ＜ Kove450Rally 310。

---

## 7. 一次情報URL一覧

### Honda
- CL500 諸元PDF（公式）https://www.honda.co.jp/content/dam/site/www/CL500/cq_img/pdf/CL500_SPEC_SP.pdf
- CL500 スペック https://www.honda.co.jp/CL500/spec/
- CL500 主な特徴 https://www.honda.co.jp/CL500/features01.html
- CL500 ニュースリリース https://global.honda/jp/news/2023/2230323-cl500.html
- CL500 2025年一部変更 https://global.honda/jp/news/2025/2250822-cl500.html
- 400X スペック https://www.honda.co.jp/400X/spec/
- 400X ニュースリリース（ボア×ストローク出典）https://global.honda/jp/news/2021/2211203.html
- 400X 主要装備 https://www.honda.co.jp/400X/equipment/
- 400X タイプ・価格 https://www.honda.co.jp/400X/type/
- 400X アーカイブ（生産終了）https://www.honda.co.jp/customer/motor-archive/400x/
- NX400 公式 https://www.honda.co.jp/NX400/
- NX400 諸元 https://www.honda.co.jp/NX400/spec/
- NX400 ニュースリリース https://global.honda/jp/news/2024/2240216-nx400.html
- NX500 UK公式諸元 https://www.honda.co.uk/motorcycles/range/adventure/nx500/specifications-and-price.html
- CB500 Hornet UK公式 https://www.honda.co.uk/motorcycles/range/street/cb500-hornet/specifications-and-price.html
- CL500 UK公式 https://www.honda.co.uk/motorcycles/range/street/cl500/specifications-and-price.html
- CL500 EUプレスキット（サスストローク出典）https://hondanews.eu/eu/en/motorcycles/media/pressreleases/503770/25ym-honda-cl500-press-kit
- CL250 諸元PDF https://www.honda.co.jp/content/dam/site/www/CL250/cq_img/pdf/CL250_SPEC_SP.pdf

### Kawasaki
- Z400（2026）主要諸元PDF https://faq.kawasaki-motors.com/faq/show/4973
- Z400 製品ページ https://www.kawasaki-motors.com/ja-jp/motorcycle/z/supernaked/z400/2026-z400
- Ninja400（2026）主要諸元PDF https://faq.kawasaki-motors.com/faq/show/4972
- Ninja400 製品ページ https://www.kawasaki-motors.com/ja-jp/motorcycle/ninja/sport/ninja-400/2026-ninja-400
- Versys 650（2026）主要諸元PDF https://faq.kawasaki-motors.com/faq/show/4766
- Versys 650 製品ページ https://www.kawasaki-motors.com/ja-jp/motorcycle/versys/adventure-touring/versys-650/2026-versys-650
- Z650 S 製品ページ https://www.kawasaki-motors.com/ja-jp/motorcycle/z/supernaked/z650/2026-z650-s
- Z650RS 製品ページ https://www.kawasaki-motors.com/ja-jp/motorcycle/z/retro-sport/z650rs/2026-z650rs
- Z650RS（2026）FAQ諸元 https://faq.kawasaki-motors.com/faq/show/4991
- W800（2026）https://www.kawasaki-motors.com/ja-jp/motorcycle/w/retro-classic/w800/2026-w800
- Versys-X 300（US）https://www.kawasaki.com/en-us/motorcycle/versys/adventure-touring/versys-x-300
- Z650/Z650RS ジオメトリ（Cycle World）https://www.cycleworld.com/kawasaki/z650rs-abs/
- Eliminator 初期インプレ https://ridermagazine.com/2023/09/19/2024-kawasaki-eliminator-review-first-ride/

### KTM / Husqvarna
- 390 ADVENTURE X 日本発表 https://news.webike.net/motorcycle/542437/
- 390 ADVENTURE X（bikebros）https://news.bikebros.co.jp/model/news20260605-01/
- 390 ADVENTURE X（webオートバイ）https://www.autoby.jp/_ct/17843939
- 390 ADVENTURE R 日本発表 https://mc-web.jp/motorcycle/174411/
- 390 ADVENTURE R（Webike）https://news.webike.net/motorcycle/479383/
- 390 Adventure R 排気量399cc確認 https://ultimatemotorcycling.com/2025/07/02/2025-ktm-390-adventure-r-first-look-11-fast-facts/
- 690 Enduro R（2026）公式 https://www.ktm.com/en-us/models/dual-sport/2026-ktm-690-enduror.html
- 690 Enduro R 日本価格 https://news.bikebros.co.jp/model/news20260224-03/
- 701 Enduro（2026）公式 https://www.husqvarna-motorcycles.com/en-int/models/travel/701-enduro-2026.html
- 490 Adventure 未発売（媒体）https://www.zigwheels.com/news-features/general-news/ktm-490-adventure-spied-twin-cylinder-adv-between-390-and-890-adventure-nears-launch/57905/

### Royal Enfield
- Bear 650 日本公式 https://www.royalenfield.co.jp/lineup/bear650/
- Himalayan 450 日本公式 https://www.royalenfield.co.jp/lineup/new_himalayan/
- INT650 日本公式 https://www.royalenfield.co.jp/lineup/int650/
- Bear 650 詳細スペック（Rider）https://ridermagazine.com/2024/11/05/2025-royal-enfield-bear-650-review/
- Interceptor 650 公式PDF https://www.royalenfield.com/content/dam/open-pdf/royal-enfield-interceptor-650-technical-specifications-english.pdf
- Bear vs Interceptor 比較 https://www.autox.com/news/bike-news/royal-enfield-bear-650-vs-interceptor-650-spec-comparison-whats-different-118806/

### Triumph
- Scrambler 900 日本公式 https://www.triumphmotorcycles.jp/bikes/classic/scrambler/scrambler-900
- Scrambler 400 XC 日本公式 https://www.triumphmotorcycles.jp/bikes/classic/scrambler/scrambler-400-xc
- Tiger Sport 660 日本公式 https://www.triumphmotorcycles.jp/bikes/adventure/tiger-sport/tiger-sport-660
- Tiger Sport 660 グローバル諸元 https://www.triumphmotorcycles.com/motorcycles/adventure/tiger-sport-660/specification
- Daytona 660 諸元 https://www.triumphmotorcycles.com/motorcycles/sport/daytona-660/specification
- Scrambler 400X vs Speed 400 https://www.topspeed.com/triumph-scrambler-400-x-vs-speed-400-key-differences/

### Yamaha / Fantic
- Ténéré 700 日本公式 https://www.yamaha-motor.co.jp/mc/lineup/tenere700/
- Ténéré 700 Low https://www.yamaha-motor.co.jp/mc/lineup/tenere700/low/
- XSR700 日本公式諸元 https://www.yamaha-motor.co.jp/mc/lineup/xsr700/spec.html
- Fantic Caballero Scrambler 700 公式 https://www.fantic.com/en-en/moto/caballero/scrambler-700_ye3tm
- Caballero 日本サイト（Rally 500）https://caballero.jp/500rally
- Caballero 日本サイト（Scrambler）https://caballero.jp/scrambler
- Fantic Scrambler 700 日本輸入元 https://showroom.motorists.jp/fantic-scrambler700.html

### Aprilia
- Tuareg 660（Wikipedia・公式403のため）https://en.wikipedia.org/wiki/Aprilia_Tuareg
- Tuareg 660 日本価格帯 https://www.bikebros.co.jp/catalog/11/999_29/
- 660プラットフォーム解説 https://motofomo.com/the-aprilia-660-rs-tuono-tuareg/

### CFMOTO / 中国系
- 450MT 日本公式 https://cfmoto.tokyo/showroom/450mt/
- 450MT 発売告知 https://cfmoto.tokyo/news/450mt-now-on-sale/
- 700MT グローバル公式 https://www.cfmoto.com/global/motorcycles/mult-touring/700mt.html
- 700CL-X Sport レビュー https://www.revzilla.com/common-tread/cfmoto-700-cl-x-sport-motorcycle-review
- 700CL-X Adventure 諸元 https://www.mcnews.com.au/cfmoto-700cl-x-adventure-specifications/
- Voge DS525X 公式 https://www.vogeglobal.com/ds525x
- Voge DS625X 公式 https://www.vogeglobal.com/ds625x
- Voge 525ACX（Visordown）https://www.visordown.com/news/new-bikes/voge-updates-scrambler-range-new-525-acx-motorcycle
- Zontes 703F https://zontes.co.uk/zt703-f/
- Kove Japan https://www.kove-japan.com/
- Kove 450 Rally レビュー https://www.cyclenews.com/2025/08/article/2025-kove-450-rally-review/

### Benelli / Brixton / Moto Morini / その他
- Benelli TRK502X 日本（プロト）https://www.plotonline.com/benellimotorcycle/lineup_trk502x.html
- Benelli 日本ラインナップ https://www.plotonline.com/benellimotorcycle/lineup.html
- Leoncino 500 Trail 公式 https://www.benelli.com/cy-en/products/leoncino-500-trail
- Brixton Crossfire 500X 日本 https://brixton.motorists.jp/crossfire500x.html
- Brixton Crossfire 500XC 日本 https://brixton.motorists.jp/crossfire500xc.html
- Brixton Crossfire 500X 本国 https://www.brixton-motorcycles.com/models/crossfire-500-x/
- Moto Morini X-Cape https://motomorini.eu/model/x-cape/
- Moto Morini Seiemmezzo SCR https://motomorini.eu/model/seiemmezzo-scr/
- Mash X-Ride 650 https://www.lerepairedesmotards.com/technique/fiches/tech-mash-x-ride-650.php
- Macbor Montana XR5 https://www.macbor.com/montanaxr5/
- SWM Superdual X https://www.motorcyclespecs.co.za/model/SWM/SWM_Superdual_X.html

### Suzuki
- V-Strom 650 生産終了報道 https://response.jp/article/2025/06/28/397595.html
- SV650/V-Strom 650 打ち切り https://www.visordown.com/news/suzuki-confirms-it-will-drop-sv650-v-strom-650-line
- V-Strom 800DE https://suzukicycles.com/adventure/2026/v-strom-800de

### カスタム参考事例
- Ninja 650ベース スクランブラー「THE TWISTER」（Smoked Garage／インドネシアKawasaki Project X）https://kawa.mcgp.info/blog/ogata/post_108/
  - ダンロップK180・フロント18/リア14（スズキ バンバン由来の太リア）、前後ショーワ製サス、穴開きベリーパン、縦目LED2灯、タンク〜フレーム間の隠しパネル、メーターは純正流用

---

## 7.5 ★結論：Z400（ツアラー装備は着脱で常備）＋ 250 の2台体制

2026-07-22 の検討で確定した構成。要件は **①振動が少ない ②ストファイ感 ③下道2時間ツーリング ④年1回の高速走行**。

### 常用回転数（実測ベース）

| | 60km/h | 100km/h | 出典 |
|---|---|---|---|
| **エリミネーター** | 約3,300rpm（比例推定） | **5,500rpm** ✓ | [mc-web](https://mc-web.jp/motorcycle/113924/) |
| **Z400／Ninja400** | **3,500rpm** ✓ | 5,840rpm ✓ | [greeco](https://mtc.greeco-channel.com/kawasaki/z400_ex400g_gear/) |
| **MT-03／YZF-R3** | 3,790rpm ✓ | 6,320rpm ✓ | [greeco](https://mtc.greeco-channel.com/yamaha/mt03_rh13j_gear/) |

### 実使用での振動指数＝（ボア²×ストローク）×回転数²

| | ピストン側 | 60km/h回転 | 指数 | 対MT-03 |
|---|---|---|---|---|
| エリミネーター | 253,820 | 3,300² | **2.76×10¹²** | −6% |
| MT-03 | 203,918 | 3,790² | 2.93×10¹² | — |
| Z400 | 253,820 | 3,500² | 3.11×10¹² | **+6%** |

**結論：6%差は知覚閾値以下＝実質同点。** ピストン単体では24%差だが、Z400の常用回転が8%低い（その2乗で15%減）ため大半が相殺される。エリミネーターは同一エンジンでギアリングだけで最良になる。

### Z400の制振の伸びしろ（確認済み）

- **純正ハンドルは先端にナットが溶接されているだけ**＝重量バーエンドとしての機能なし
- 社外ヘビーウェイトバーエンドは**片側270g／375g**の選択肢あり
- ユーザー報告：「ハンドルの振動がひどい」→ 交換で「振動激減」
- → **1〜2万円で素のMT-03を下回る水準まで到達可能**

出典: [Z400バーエンド交換](https://amagumoter.com/archives/70) / [Ninja400ヘビーウェイトバーエンド](https://trip-rider.net/2019/10/02/ninja400_barendheavy/)

### 却下した候補と理由

| 車種 | 却下理由 |
|---|---|
| **MT-03** | 振動6%有利だが知覚閾値以下。トルクが23%低く（30 vs 37N·m）、常用回転は290rpm高い |
| **エリミネーター** | 振動・長距離快適性は最良（8時間実証）だが、30°/121mm・WB1,520mmで**ストファイ感なし** |
| **NX400** | 万能だが**スタイルが要件に合わない**。196kg |
| **Ninja400** | フルカウルで防風は最良だが**前傾で手に荷重**＝痺れに不利 |
| **Z650／Z650RS** | 大型免許。63N·mは100km/hが楽すぎて速度誘惑が強い |

### 2台の役割分担

| | Z400 | 250（FTR223／250TR／TW225） |
|---|---|---|
| 日常 | ストファイ（48PS・37N·m） | 近所・畦道・農道 |
| 下道2時間 | ○（3,500rpm巡航） | — |
| 年1回の高速 | 着脱式スクリーン装着 | — |
| 未舗装 | — | ◎ |
| 整備 | ディーラー任せ | **自分で維持る** |
| 車検 | あり | なし（250以下） |

---

## 8. 未確認・要再検証リスト

- Triumph Tiger Sport 660 のキャスター 23.1°（Tridentより立っていてADVとして不自然）
- Honda 400X のフロントフォーク径とサスストローク（公式は「SHOWA製SFF-BP倒立」のみ。φ41mmは二次情報）
- CFMOTO 700CL-X Heritage のホイール径（17"と19"で資料矛盾）
- Benelli Leoncino 500系の重量（公式「207kg dry」vs 媒体「190kg kerb」）
- Brixton Crossfire 500X の最大トルク（日本公式45N·m vs 欧州公式43N·m）とフロントホイール径（日本17" vs 欧州18"表記）
- KTM 390 ADVENTURE X/R のサスストローク・最低地上高・キャスター/トレール
- Ténéré 700 の出力・トルク・ボア×ストローク
- Suzuki V-Strom 650 / SV650 のキャスター・トレール
- Z650 の最高出力・最大トルク（今回未取得）
- Moto Morini の日本正規価格（PCI公式サイトがSSL証明書エラー）
