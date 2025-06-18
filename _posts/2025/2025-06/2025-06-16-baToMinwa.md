---
permalink: /20250616baToMinwa/
title: "スピノル場の理解のために民話をあててみる"
date: 2025-06-17T019:30:31+09:00
categories:
  - 量子
  - 民話
tags:
  - 間主観性
  - 場
  - スピノル
  - 民話
  - ユング
  - パウリ
  - 日本神話
  - 四元数
  - ゼロイチ
header:
  teaser: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Clifford-torus.gif"   
# excerpt: ""  
---

回転の平方根が気になる。パウリにトライ。彼の心理はユングのせいで世界にダダ漏れ。そんな親近感。  
ユングといえば物語。まずは、最も古い神話イザナミ、と最古の文学かぐや姫。和風で。月っぽく。  
<!-- more -->
アクエリオンとかSAOとかでもいいけど古典大事。古典と基礎さえもらえれば、あとはアジャイルになんとかするだけ、と思うタイプ。

<iframe
  width="1027" height="578" 
  style="display:block; border:none;"
  src="https://www.youtube.com/embed/S0vn6vDeYSI?autoplay=1&mute=1"
  title="Left of Centre - A Julia Set Fractal Zoom"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  allowfullscreen
></iframe>

## 背景

<div markdown="0">
<figure style="
    float: right;
    max-width: 40%;       /* お好みで調整 */
    margin: 0 0 1em 1em;  /* 下／左に余白 */
    text-align: right;    /* キャプションを右揃え */
">
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Clifford-torus.gif"
    alt="Clifford トーラスのステレオ投影回転アニメーション"
    style="
      max-width:100%; height:auto; 
      display:block; 
      margin: 1em 0 0em 0em;
  ">
  <figcaption style="
    font-size:0.8em; 
      color:#666; 
      text-align:right; 
      margin: 0 0 1em 0em;
      ">
    出典：
    <a href="https://commons.wikimedia.org/wiki/File:Wind-God-Fujin-and-Thunder-God-Raijin-by-Tawaraya-Sotatsu.png" target="_blank" style="color:#666; text-decoration:none;">
      Wikimedia Commons
    </a>
    （CC0 Public Domain）
  </figcaption>
</figure>
</div>

- 発散思考のために、精神を☯️陰陽マークイメージの回転体と仮定して三次元で扱おうと試みた。
  - やってみたら720度で1サイクルのコードになった。
  - 奇遇にも回転に用いる命令文のようなスピノルは720度で一回転する。
    - qVq⁻¹ は回転全般のことなのかも。二次元も三次元も。
      - オイラーの公式の解析のところ広げて三次元化したようなイメージ
      - 「回転の平方根を順番に2回」が回転の本質なのかも
        - ユングの友達のパウリの行列もそれっぽい
- スピノルは命令文としてではなく、場として扱う方がいいのかも。「海」として。
- 日本神話にヒントを求めていく
  - この前湧いた量子マインド仮説に対するかぐや姫のアナロジーと合わせて

## スピノルの共役作用:イザナギとイザナミ


<div markdown="0">
<figure style="
    float: right;
    max-width: 40%;       /* お好みで調整 */
    margin: 0 0 1em 1em;  /* 下／左に余白 */
    text-align: right;    /* キャプションを右揃え */
">
  <img
    src="{{'/assets/images/humor/byai/izanami.png' | relative_url}}"
    alt="イザナギとイザナミの生成シーン"
    style="
      max-width:100%; height:auto; 
      display:block; 
      margin: 1em 0 0em 0em;
  ">
  <figcaption style="
    font-size:0.8em; 
      color:#666; 
      text-align:right; 
      margin: 0 0 1em 0em;
      ">
      <small>Image generated with DALL·E (OpenAI)</small>
  </figcaption>
</figure>
</div>

qVq⁻¹ の順番指定で真っ先に思い出した。
昔、「まちづくり」の定義のために、国家のゼロイチが気になって読んだ日本書紀と古事記。合体して創生する神話のところ。  
二重スリット実験のシマの失敗が、ちょうどダジャレでいーかなと。

- スピノル共役作用とは、
  - 四元数による三次元の回転計算と同じ枠組み
  - 四元数の共役演算を用いてベクトルや位相を回転させる操作。
  - 回転の順序や符号が生成結果に影響を与える。
  - スピノルは回転の平方根として機能し、360°の回転を180°ずつ二段階に分割。

<div markdown="0">
<section>
<blockquote cite="https://www.aozora.gr.jp/cards/001518/files/51732_44768.html" style="
  margin: 1em 0;
  padding-left: 1em;
  border-left: 4px solid #ccc;
  line-height: 1.6;
  white-space: normal;
  word-break: break-word;
  font-size: 0.8rem;
">
      そこでイザナギの命が、イザナミの女神に「あなたのからだは、どんなふうにできていますか」と、お尋ねになりましたので、「わたくしのからだは、できあがつて、でききらない所が一か所あります」とお答えになりました。そこでイザナギの命の仰せられるには「わたしのからだは、できあがつて、でき過ぎた所が一か所ある。だからわたしのでき過ぎた所をあなたのでききらない所にさして國を生み出そうと思うがどうだろう」と仰せられたので、イザナミの命が「それがいいでしよう」とお答えになりました。そこでイザナギの命が「そんならわたしとあなたが、この太い柱を廻り廻りあつて、結婚をしよう」と仰せられてこのように約束して仰せられるには「あなたは右からお廻りなさい。わたしは左から廻つてあいましよう」と約束してお廻りになる時に、イザナミの命が先に「ほんとうにりつぱな青年ですね」といわれ、その後でイザナギの命が「ほんとうに美しいお孃さんですね」といわれました。それぞれ言い終つてから、その女神に「女が先に言つたのはよくない」とおつしやいましたが、しかし結婚をして、これによつて御子水蛭子をお生みになりました。この子はアシの船に乘せて流してしまいました。次に淡島をお生みになりました。これも御子の數にははいりません。
  </blockquote>
  <p>参考: <a href="https://www.aozora.gr.jp/cards/001518/files/51732_44768.html">稗田の阿禮・太の安萬侶『古事記』現代語訳</a></p>
</section>
</div>

---


- でき過ぎた所とでききらない所
  - 正負 ※今のところ計算上のプラスとマイナス
- あなたは右からお廻りなさい。わたしは左から
  - 異なる方向からの作用が結果を変化させる
    - 四元数乗算の非可換性 q⁻¹Vq ではダメ。
- 女が先に言つたのはよくない
  - 同じく q⁻¹Vq はNG
- ひるこをお生み
  - 生成の失敗
    - ☯️陰陽マークの片方だけ
    - 勾玉は胎児をモチーフ
- 次にあわしま
  - これはダジャレ：ランダムの点とシマ模様が現れる二重スリット実験（の失敗）
- 占術による言い直し
  - qVq⁻¹ の正順序への修正
    - 淡路島などの安定生成
  - もしくは、360°回転では位相が−1となるため、720°回転による同一性の回復

---

LLMに投げてみた。「これは正しい？」> [ChatGPT o3の回答](https://chatgpt.com/share/685216fc-fb80-800b-b030-ef42fa884001)  
「神話の単語を比喩と入れ替えて」 > [ChatGPT o3の回答](https://chatgpt.com/share/685225ee-c90c-800b-acc6-daef1476578d)

## 量子マインド仮説: かぐや姫 のアナロジー

[![image]({{ '/assets/images/humor/zukai/asistobe/kimiTaketori.png' | relative_url }})]({{ '/assets/images/humor/zukai/asistobe/kimiTaketori.png' | relative_url }})

微小管内の量子コヒーレンスが意識を生む。
  
- 竹林＝脳内の微小管ネットワークや神経回路
- 竹の筒＝微小管内の閉じた量子コヒーレント空間
- かぐや姫＝量子もつれによって励起された “非日常的” な意識状態（対極的存在）
  
- 重ね合わせ
  - かぐや姫が竹の中で「現世」と「月の世界」の両方に同時に属している。
  - まだ誰にも見つかってない状態。帰属先は未確定のまま。
- もつれ（Entanglement）
  - 竹取の翁と出会って幼女として真逆の存在として確定。だがまだ二人だけの秘密の絆。置き去りにすることもできた。
  - 対外的には隠されたままの小さな世界（可逆）。
- デコヒーレンス
  - 月の使者が竹取の翁との結びつきを断ち切る。 
「現世と月」の両帰属の重ね合わせは不可逆に崩壊し、かぐや姫は月世界への帰属に確定。

---

「このアナロジーは正しい？」> [ChatGPT o4-miniの回答](https://chatgpt.com/share/684ff2f0-d2e4-800b-bdca-540faa5d723f)



## 参考・関連

- 二重スリット実験
  - [参考:【単一フォトンによるヤングの干渉実験（浜松ホトニクス／1982年） - YouTube】](https://www.youtube.com/watch?v=ImknFucHS_c)
  - [参考:【『二重スリット実験』〜観測すると世界が決まる⁉知るとぞっとする世界でもっとも美しい実験】](https://www.yamanashibank.co.jp/fuji_note/culture/double_slit.html)
  -[参考:【量子消しゴム実験 - Physics Lab. 2021】](https://event.phys.s.u-tokyo.ac.jp/physlab2021/articles/4t-2sztt2pa/)
- 波の反射
  - [参考:【2022物性研一般公開: 中性子科学研究施設「中性子ビームで見る物質のミクロな構造と機能」 - YouTube】](https://www.youtube.com/watch?v=LiVSpl7mTh8)
- 顕微鏡：視覚センサーデバイスのレンズのイメージ
  - [参考:【Thorlabs.com - 量子消しゴム(Quantum Eraser)実習キット】](https://www.thorlabs.co.jp/NewGroupPage9_PF.cfm?ObjectGroup_ID=6957&utm_source=chatgpt.com)
- 量子
  - [参考:【阪大教授が解説する量子力学と量子コンピュータ（前編） - YouTube】](https://www.youtube.com/watch?v=B0ZZ2lV0TLs)
