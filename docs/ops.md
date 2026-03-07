# Operations

## API 自動更新ルール（kesson-articles）

結論: 自動更新されます。

確認内容は以下です。

- `api/kesson-articles.json` は front matter を持つ Liquid テンプレートなので、Jekyll がビルド時にレンダリングします。
- `_config.yml` で `api/` は `exclude` に入っておらず、`permalink: /api/kesson-articles.json` も設定済みです。

つまり `public-pjdhiro` ブランチを GitHub Pages がビルドするたびに、posts/pages の tags/categories に基づいて JSON が再生成されます。

注意点:

- GitHub Pages のビルドが走ったときに更新されます。ローカルのファイル自体が自動書き換えされるわけではありません。

---

## §PDF生成ワークフロー（kesson guides）

### 使用ツール

| ツール | バージョン（確認時） | 用途 |
|---|---|---|
| pandoc | 3.8.3 | Markdown → PDF 変換 |
| lualatex (LuaHBTeX) | 1.21.0 (TeX Live 2025) | PDF エンジン |
| Hiragino Mincho ProN | macOS 付属 | JA 本文フォント |
| Hiragino Sans | macOS 付属 | JA 見出しフォント |

### 正規の生成方法（推奨）

kesson-driven-thinking リポジトリの `publish-pdf.sh` が正本。pjdhiro 側で個別に PDF を生成する必要はない。

```bash
cd ~/dev/kesson-driven-thinking

# ビルドのみ（build/ に PDF 生成）
bash transform/scripts/publish-pdf.sh --build --lang all

# ビルド + pjdhiro へコピー＆push
bash transform/scripts/publish-pdf.sh --lang all
```

内部で実行される pandoc コマンド:

```bash
pandoc <temp_md_with_yaml_header> \
    -o build/kesson-general.pdf \
    --pdf-engine=lualatex \
    --resource-path="$REPO:$REPO/resources/images" \
    -V colorlinks=true
```

YAML ヘッダー（JA）で `documentclass: ltjsarticle`、`\setmainjfont{Hiragino Mincho ProN}` を指定。

### 単体再生成（pjdhiro 側で直接やる場合）

```bash
cd ~/dev/pjdhiro

pandoc assets/kesson/guides/ja/md/kesson-general.md \
    -o assets/kesson/guides/ja/pdf/kesson-general.pdf \
    --pdf-engine=lualatex \
    -V documentclass=ltjsarticle \
    -V classoption=a4paper \
    -V geometry:margin=25mm \
    --metadata title="欠損駆動思考 — 概要版" \
    --metadata date="$(date +%Y年%m月%d日)" \
    -V header-includes='\usepackage{luatexja-fontspec}\setmainjfont{Hiragino Mincho ProN}\setsansjfont{Hiragino Sans}' \
    -V colorlinks=true

git add assets/kesson/guides/ja/pdf/kesson-general.pdf
git commit -m "fix(pdf): kesson-general.pdf 再生成"
git push origin main
```

### 対象ファイル一覧

| audience | JA ソース | JA PDF |
|---|---|---|
| general | `assets/kesson/guides/ja/md/kesson-general.md` | `assets/kesson/guides/ja/pdf/kesson-general.pdf` |
| designer | `assets/kesson/guides/ja/md/kesson-designer.md` | `assets/kesson/guides/ja/pdf/kesson-designer.pdf` |
| academic | `assets/kesson/guides/ja/md/kesson-academic.md` | `assets/kesson/guides/ja/pdf/kesson-academic.pdf` |

EN 版は `en/` ディレクトリに同構造。

### 注意点

- **日付**: YAML ヘッダーの `date` フィールドでタイトルページの日付が決まる。`publish-pdf.sh` は実行時の日付を自動挿入する
- **front matter**: pjdhiro 側の MD は front matter 除去済み。`publish-pdf.sh` はビルド時に YAML ヘッダーを別途付与する
- **フォント**: macOS の Hiragino フォント前提。Linux/CI では HaranoAji 等に変更が必要
- **正本**: PDF 生成の設定正本は `kesson-driven-thinking/transform/scripts/build-pdf-lualatex.sh`
