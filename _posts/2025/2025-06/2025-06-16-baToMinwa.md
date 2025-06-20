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

## 背景・概要

- 発散思考のために、精神を☯️陰陽マークイメージの回転体と仮定して三次元で扱おうと試みた。
  - やってみたら720度で1サイクルのコードになった。
  - 奇遇にも回転に用いる命令文のようなスピノルは720度で一回転する。
    - qVq⁻¹ は回転全般のことなのかも。二次元も三次元も。
      - オイラーの公式の解析のところ広げて三次元化したようなイメージ

<div markdown="0">
  <figure style="
      float: right;
      max-width: 20%;       /* お好みで調整 */
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
      font-size:0.7em; 
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

- 「回転の平方根を順番に2回」が回転の本質なのかも
  - ユングの友達のパウリの行列もそれっぽい
- スピノルは命令文としてではなく、場として扱う方がいいのかも。「海」として。
- 日本神話にヒントを求めていく
  - この前湧いた量子マインド仮説に対するかぐや姫の延長

## スピノルの共役作用:イザナギとイザナミ

qVq⁻¹ の順番指定で真っ先に思い出した。
昔、「まちづくり」の定義のために、国家のゼロイチが気になって読んだ日本書紀と古事記。イザナ「キ」と「ミ」が合体して創生する神話のところ。全力の未完成。  
二重スリット実験のシマの失敗も、ちょうどダジャレでいーかなと。

---

### 島々の生成：天沼矛

> その矛をさしおろして下の世界をかき廻され、海水を音を立ててかき廻して引きあげられた時に、矛の先から滴したゝる海水が、積つて島となりました。  
[参考:【稗田の阿禮、太の安萬侶 武田祐吉訳 古事記 現代語譯　古事記】](https://www.aozora.gr.jp/cards/001518/files/51732_44768.html)

[![image]({{ '/assets/images/yinyang/uzu.png' | relative_url }})]({{ '/assets/images/yinyang/uzu.png' | relative_url }})


- スピノル共役作用とは、
  - 四元数による三次元の回転計算と同じ枠組み
  - 四元数の共役演算を用いてベクトルや位相を回転させる操作。
  - 回転の順序や符号が生成結果に影響を与える。
  - スピノルは回転の平方根として機能し、360°の回転を180°ずつ二段階に分割。

- イメージは、3枚の紙の交差点で一度裏返り、720度でようやく自身に重なる波
  - 通常の移相回転 = e<sup>iθ</sup> 
    - 1枚の複素平面上を巡る
  - スピノルの位相回転 = 
      <span style="font-family: Cambria, 'Times New Roman', serif;">
        q = cos(θ/2) + sin(θ/2)(n ⋅ σ)
      </span>
- LLMに聞くと、
    - 二次元の複素回転 e<sup>iθ</sup> を、二次元にも三次元にも適用できる「回転を一般化」したもの。
    - 四元数 \( q = w + xi + yj + zk \) において、xy 平面だけを考えるとき（つまり、四元数の w = z = 0）と、**オイラーの公式 e<sup>iθ</sup> = cosθ + i·sinθ は完全に一致する。**
      - <small>たとえば回転軸を x軸（n = (1, 0, 0)）に限定すると、<br>
      <span style="font-family: Cambria, 'Times New Roman', serif;">
          q = cos(θ/2) + sin(θ/2)(n ⋅ σ):<br>
      </span>
        単位ベクトル <i>n</i>= 回転軸<br>
        パウリ行列ベクトル <i>σ</i> = (σ₁, σ₂, σ₃) <br>
        内積は σ₂, σ₃がゼロなので、<code>n ⋅ σ = σ₁</code><br>
        <span style="font-family: Cambria, 'Times New Roman', serif;">
        q = cos(θ/2) + sin(θ/2)·σ₁
        </span>
        <br>
        この <code>σ₁</code> は行列だけれど、xy平面だけなので<code>i</code> をかけるのとほぼ同じ意味になる。
        ※複素数 <code>i</code> が2次元の点を回すなら、<code>σ₁</code> は2つの直交する状態を回す。<br> 
        だからこの式は、
        <br>
        <span style="font-family: Cambria, 'Times New Roman', serif;">
        q = cos(θ/2) + i·sin(θ/2)
        </span>
        <br>
        これはオイラーの公式 <code>e<sup>iθ</sup> = cosθ + i·sinθ</code> の平方根と同じ。<br>
        <span style="font-family: Cambria, 'Times New Roman', serif;">
        q = √e<sup>iθ</sup>
        </span>  
        つまり、スピノルは「回転の平方根」。
        <br>
        スピノルでは <code>qVq⁻¹</code> のかたちで左右から回転をかけるため、  
        <code>θ/2</code> の回転が2回作用して、ベクトルは θ 回る。
      </small>

<div markdown="0">
  <figure style="
        /* float: right; */
        max-width: 60%;
        margin: 0 0 0em 0em;  /* 下／左に余白 */
        /* text-align: right; */
    ">
    <img src="https://64.media.tumblr.com/09afb7493f2ecbf733649b1e356fc340/acac94ed57a4196c-ab/s500x750/3c8acd46abe3f44c018d12ff6d8be5b336f3d24f.gif" 
        alt="Spinor-like Möbius animation"
        style="
        max-width: 60%; 
        height: auto; 
        display: block; 
        margin: 0em auto;">
    <figcaption style="
      font-size: 0.5em;
      color: #666;
      text-align: center;
      margin-left: auto; 
      margin-right: auto;
    ">
      出典：Tumblr（<a href="https://64.media.tumblr.com/09afb7493f2ecbf733649b1e356fc340/acac94ed57a4196c-ab/s500x750/3c8acd46abe3f44c018d12ff6d8be5b336f3d24f.gif" target="_blank">元画像リンク</a>）<br>
      ライセンス不明のため引用表示のみ（著作権は投稿者に帰属）
    </figcaption>
  </figure>
</div>


---

### オノゴロ島の柱：ヒルコ

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
    <figure style="
      float: right;
      max-width: 30%;
      margin: 0 0 1em 1em;  /* 下／左に余白 */
      text-align: right;
      ">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/8/84/Kobayashi_Izanami_and_Izanagi.jpg"
        alt="天之瓊矛（あめのぬぼこ）を以（も）て滄海（そうかい）を探（さぐ）るの図（ず）"
        style="
          display:block; 
          margin: 0em 0 0em 1em;
      ">
      <figcaption style="
        font-size:0.8em; 
          color:#666; 
          text-align:right; 
          margin: 0 0 1em 0em;
          ">
          <small>Originally uploaded on sv:wiki 10 April 2005 kl.18.50 by <a href="https://sv.wikipedia.org/wiki/User:Lamr%C3%A9" class="extiw" title="sv:User:Lamré">Lamré</a> - From sv.wikipedia.org., パブリック・ドメイン, <a href="https://commons.wikimedia.org/w/index.php?curid=626913">リンク</a></small><br>
      </figcaption>
    </figure>
        そこでイザナギの命が、イザナミの女神に「あなたのからだは、どんなふうにできていますか」と、お尋ねになりましたので、「わたくしのからだは、できあがつて、でききらない所が一か所あります」とお答えになりました。そこでイザナギの命の仰せられるには「わたしのからだは、できあがつて、でき過ぎた所が一か所ある。だからわたしのでき過ぎた所をあなたのでききらない所にさして國を生み出そうと思うがどうだろう」と仰せられたので、イザナミの命が「それがいいでしよう」とお答えになりました。そこでイザナギの命が「そんならわたしとあなたが、この太い柱を廻り廻りあつて、結婚をしよう」と仰せられてこのように約束して仰せられるには「あなたは右からお廻りなさい。わたしは左から廻つてあいましよう」と約束してお廻りになる時に、イザナミの命が先に「ほんとうにりつぱな青年ですね」といわれ、その後でイザナギの命が「ほんとうに美しいお孃さんですね」といわれました。それぞれ言い終つてから、その女神に「女が先に言つたのはよくない」とおつしやいましたが、しかし結婚をして、これによつて御子水蛭子をお生みになりました。この子はアシの船に乘せて流してしまいました。次に淡島をお生みになりました。これも御子の數にははいりません。
    </blockquote>
    <p>
      <small>
        参考: <a href="https://www.aozora.gr.jp/cards/001518/files/51732_44768.html">稗田の阿禮・太の安萬侶『古事記』現代語訳</a>
      </small>
    </p>
  </section>
</div>

---

<div markdown="0">
  <figure style="
    /* float: right; */
    max-width: 30%;
    margin: 0 0 1em 1em;  /* 下／左に余白 */
    text-align: right;
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
      font-size:0.5em;
      color:#666; 
      text-align:right; 
      margin: 0 0 1em 0em;
    ">
    Image generated with DALL·E (OpenAI)
    </figcaption>
  </figure>
</div>

- でき過ぎた所とでききらない所
  - 正負 ※理解未達。今のところ計算上のプラスとマイナス
- あなたは右からお廻りなさい。わたしは左から
  - 異なる方向からの作用が結果を変化させる
    - 四元数乗算の非可換性 q⁻¹Vq ではダメ。
- 女が先に言つたのはよくない
  - 同じく q⁻¹Vq はNG

<div markdown="0">
  <figure style="
    float: right;
    max-width: 30%;
    margin: 0 0 1em 1em;  /* 下／左に余白 */
    text-align: right;
  ">
    <img
      src="{{'/assets/images/humor/byai/hirukoUzu.png' | relative_url}}"
      alt="ヒルコと位相半回転"
      style="
        max-width:100%; height:auto; 
        display:block; 
        margin: 1em 0 0em 0em;
    ">
    <figcaption style="
      font-size:0.5em;
      color:#666; 
      text-align:right; 
      margin: 0 0 1em 0em;
    ">
    Image generated with DALL·E (OpenAI)
    </figcaption>
  </figure>
</div>
- ひるこをお生み
  - 生成の失敗
    - ☯️陰陽マークの片方だけ
- 次にあわしま
  - これはダジャレ：ランダムの点とシマ模様が現れる二重スリット実験（の失敗）
- 占術による言い直し
  - qVq⁻¹ の正順序への修正
    - 淡路島などの安定生成
  - もしくは、360°回転では位相が−1となるため、720°回転による同一性の回復

---

LLMに投げてみた。「これは正しい？」> [ChatGPT o3の回答](https://chatgpt.com/share/685216fc-fb80-800b-b030-ef42fa884001)  
「神話の単語を比喩と入れ替えて」 > [ChatGPT o3の回答](https://chatgpt.com/share/685225ee-c90c-800b-acc6-daef1476578d)

---

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
  - [参考:【内在秩序と外在秩序 - Wikipedia】](https://ja.wikipedia.org/wiki/%E5%86%85%E5%9C%A8%E7%A7%A9%E5%BA%8F%E3%81%A8%E5%A4%96%E5%9C%A8%E7%A7%A9%E5%BA%8F)
