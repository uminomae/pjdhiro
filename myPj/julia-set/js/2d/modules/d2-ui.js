// ファイル：js/2d/modules/d2-ui.js

/**
 * “数式欄”に文字列を書き込む。
 * 元の updateFormula() を移植。
 *
 * @param {string} text
 */
export function updateFormula(text) {
	const elem = document.getElementById('formula');
	if (elem) {
	  elem.textContent = text;
	}
  }
  