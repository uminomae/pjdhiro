---
permalink: /note-dev-sidebar/
title: "サイドバーの編集"
date: 2025-05-25
categories:
  - サイト編集
sidebar:
  nav: docs
  nav2: ""
  nav3: ""
  nav4: cat-side-notes
  nav5: ""
---

## サイドバーの親カテゴリ

### 追加

- `_data/navigation.yml`を編集する

<img src="../assets/images/pages/sidenote/dev/date_navi.png" 
alt=""
style="
  width: 320px;
  height: auto;
  ">

- 編集例：上記ページに下記のように追加する

```yaml
  cat-side-notes: #サイドバーブロックの名前
  - title: "Side Notes"  #表示される親カテゴリ名
    children:
    - title: "経済" #表示されるカテゴリ名
      url: /pages-categories/economy/  #呼び出すページのパーマリンク。↓下記で登録
```

### 呼び出し

- `_pages/general/system/`　にカテゴリindex用ファイルを新規作成する
  - 既存ページ`pages-categories-word.md`などを参考にする。修正箇所は画像参照
    - "nav"に登録したカテゴリだけがページ左側に表示される
      
      ```yaml
      #例
      nav4: cat-side-notes #画像10行目
      ```

<img src="../assets/images/pages/sidenote/dev/pages_general_system.png" 
alt=""
style="
  width: 640px;
  height: auto;
  ">

- 下記のように表示される
  - リンクURLはpermalink:に登録したもの
    - ex. `permalink: /pages-categories/economy/` ※上記画像4行目

<img src="../assets/images/pages/sidenote/dev/sidebar_economy.png" 
alt=""
style="
  width: 180px;
  height: auto;
  margin: 0px 0px 0px 80px;
  ">

## ページの追加

<img src="../assets/images/pages/sidenote/dev/vscode_note_economy.png" 
alt=""
style="
  width: 180px;
  height: auto;
  margin: 0px 0px 0px 80px;
  ">

- わかりやすさのために`_pages/note/economy`のようなディレクトリを作成しておき、新規ファイルを作成する
  - 下記のようにパーマリンク、sidebarなどを指定する。
  - 一行目とヘッダー情報最終行の`---`も必要

```yaml
---
permalink: /note-economy/ #なるべく登録する
title: "タイトル名"
date: 2024-12-31
categories:
  - 経済 #必須：自動で収集されるため
sidebar:
  nav: docs
  nav2: ""
  nav3: ""
  nav4: cat-side-notes #親カテゴリ作成時に指定したサイドバーブロックの名前
  nav5: ""
---
```

---

<!-- [ChatGPT o3](https://chatgpt.com/share/6832a13d-0670-800b-b6d3-29d2984de741) -->
