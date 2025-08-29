# README

## Test

### コマンド

- ディレクトリ移動  
`cd myPj/tradingview/pine`  
- テスト実行
`sh run_test.sh`
- 一時的に上書きしたい（CLIが最優先）  
`sh run_test.sh --len1 50 --show-seconds 3`
- CIや画面なしなら保存だけ  
`HEADLESS=1 sh run_test.sh`
