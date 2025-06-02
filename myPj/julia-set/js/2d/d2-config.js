// ファイル: js/2d/config.js

/**
 * アプリケーション全体で使う定数・デフォルト値をまとめておく
 */
export const AppConfig = {
	// ── 描画関連 ──
	dotDiameter: 4,          // d2-render.js の DOT_DIAMETER 相当
	defaultScale: 150,       // d2-init-app.js の scale 初期値
	defaultInterpSteps: 10,  // 補間ステップ数のデフォルト
	defaultPauseMs: 800,     // アニメーションの一時停止時間デフォルト
  
	// ── Canvas コンテナのデフォルトサイズ（あくまで参照用。実際はリサイズで上書き） ──
	defaultCanvasWidth: 800,
	defaultCanvasHeight: 600,
  
	// ── フォームの初期値 ──
	defaultCRe: -0.4,
	defaultCIm: 0.6,
	defaultSamples: 45,
	defaultMaxIter: 10,
	defaultPauseMsInput: 100,
  
	// ── その他UI関連（余白やフォントサイズ、ブレークポイントなどを定めてもOK） ──
	// 例: breakpoints: { sm: 576, md: 768, lg: 992, xl: 1200 }
  };
  