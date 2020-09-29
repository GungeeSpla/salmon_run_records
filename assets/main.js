'use strict';

// localStorageに保存する際に使用するキー
const STORAGE_KEY = 'salmon-run-records';

// navigatorの言語
const NAVIGATOR_LANG = navigator.language || navigator.userLanguage || 'ja';

// locationのクエリパラメータ
const LOCATION_QUERIES = getQueries();

// locationのクエリパラメータもしくはnavigatorから言語を日本語か英語のどちらかひとつに決定
const LANG_KEY = (LOCATION_QUERIES.lang === 'ja')
	? 'ja'
	: (LOCATION_QUERIES.lang === 'en')
		? 'en'
		: (NAVIGATOR_LANG.indexOf('ja') > -1)
			? 'ja'
			: 'en';

// 無視するレコードID
// 「1WAVE最高」の記録は無視してもいいかな
const IGNORE_RECORD_IDS = [2];

// ステージの数
const STAGE_COUNT = 5;

// 種目の数
const RECORD_COUNT = 29;

const RECORD_ORDER = [
	0, 1, 3, 29, 4, 5, 6, 7, 8, 9, 10,
	11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
	21, 22, 23, 24, 25, 26, 27, 28,
];

// 赤イクラ記録の種目IDたち
// これに該当する種目は、イクラの前に赤イクラアイコンを付ける
const POWER_EGGS_RECORD_IDS = [24, 25, 26, 27, 28];

// リンクのドメインごとに表示する画像を決める
const FQDN_ICON_TYPES = {
	'cdn.discordapp.com': 'image',
	'ibb.co': 'image',
	'imgur.com': 'image',
	'pbs.twimg.com': 'image',
	'ton.twitter.com': 'image',
	'www.reddit.com': 'image',
	'media.discordapp.net': 'image',
	'salmon-stats.yuki.games': 'chain',
	'twitter.com': 'twitter',
	'clips.twitch.tv': 'video',
	'www.twitch.tv': 'video',
	'www.openrec.tv': 'video',
	'www.youtube.com': 'video',
	'youtu.be': 'video',
	'www.nicovideo.jp': 'video',
};

// 何回もアクセスすることになるであろうDOM要素への参照
let $recordTable;
let $forSave;
let srrManager;

/** initialize()
 */
async function initialize() {
	console.log('ページの読み込みが完了しました。');

	// レコードテーブル要素を取得
	$recordTable = document.getElementById('record-table');
	$forSave = document.getElementsByClassName('for-save');

	// localStorageから設定を読み込む
	loadStorage();

	// 各DOM要素にイベントを設定したり初期値を設定したりする
	initializeDOMElements();

	// スプレッドシートにアクセス
	srrManager = new SRRManager();
	await srrManager.init();
	console.log('テーブルを作成しています…');
	updateRecordTable();
	console.log('テーブルを作成しました。');
	return;
}


/** initializeDOMElements()
 */
function initializeDOMElements() {
	// タッチデバイスかマウスデバイスか
	if ('ontouchstart' in window) {
		document.body.classList.add('touchdevice');
	} else {
		document.body.classList.add('mousedevice');
	}

	// モーダルウィンドウをクリックしたらモーダルウィンドウを閉じる
	document.getElementById('modal').addEventListener('click', () => {
		modal.classList.add('hidden');
	});

	// モーダルウィンドウ中の要素をクリックしても上のイベントが呼ばれないようにする
	document.getElementById('modal-rotation').addEventListener('click', (e) => {
		e.stopPropagation();
	});

	// 言語設定が英語なら翻訳対象のDOM要素をすべて翻訳する
	if (LANG_KEY === 'en') {
		const $transElements = document.getElementsByClassName('for-translation');
		Array.prototype.forEach.call($transElements, ($elm) => {
			const txt = $elm.getAttribute('en-text');
			$elm.textContent = txt;
		});
	}

	// 値が変更されたときレコードテーブルを更新しなければならないような
	// <input>要素すべてにイベントを仕込む
	const $inputs = document.getElementsByClassName('for-update-table');
	Array.prototype.forEach.call($inputs, ($input) => {
		$input.addEventListener('change', () => {
			updateRecordTable();
			console.log('テーブルを更新しました。');
		});
	});

	// 値が変更されたときレコードテーブルのクラスを付け替えなければならないような
	// <input>要素すべてにイベントを仕込む
	const $inputs2 = document.getElementsByClassName('for-update-table-class');
	Array.prototype.forEach.call($inputs2, ($input) => {
		const toggleClass = $input.getAttribute('toggle-class');
		const update = () => {
			if ($input.checked) {
				$recordTable.classList.add(toggleClass);
			} else {
				$recordTable.classList.remove(toggleClass);
			}
		};
		$input.addEventListener('change', update);
		update();
	});

	// 値が変更されたときlocalStorageにセーブしなければならないような
	// <input>要素すべてにイベントを仕込む
	const $saveInputs = $forSave;
	Array.prototype.forEach.call($saveInputs, ($input) => {
		$input.addEventListener('change', () => {
			saveStorage();
		});
	});
}


/** updateRecordTable()
 * レコードテーブルを更新します。
 */
function updateRecordTable() {
	// 生レコードデータを整理する
	const orgnizedRecords = getOrgnizedRecords();
	// テーブルHTML配列を作成する
	const tableHTMLArray = createTableHTMLArray(orgnizedRecords);
	// テーブルHTML配列をHTMLに変換してinnerHTMLに代入する
	$recordTable.innerHTML = createTableHTML(tableHTMLArray);
	// 編成部分をクリックしたときに詳細が見られるようにする
	setRotationViewEvents();
}

/** setRotationViewEvents()
 * レコードテーブルのブキ編成をクリックしたときに
 * シフト画像を表示するイベントを仕込みます。
 */
function setRotationViewEvents() {
	const $rotations = $recordTable.getElementsByClassName('rotation-images');
	Array.prototype.forEach.call($rotations, ($rotation) => {
		$rotation.addEventListener('click', () => {
			const id = $rotation.getAttribute('rotation-id');
			const rot = srrManager.rotations[id - 1];
			const modal = document.getElementById('modal');
			modal.classList.remove('hidden');
			const weapons = modal.getElementsByClassName('weapon-image');
			weapons[0].setAttribute('src', `./assets/img/weapon/${rot.w1}.png`);
			weapons[1].setAttribute('src', `./assets/img/weapon/${rot.w2}.png`);
			weapons[2].setAttribute('src', `./assets/img/weapon/${rot.w3}.png`);
			weapons[3].setAttribute('src', `./assets/img/weapon/${rot.w4}.png`);
			if (rot.rare) {
				weapons[4].setAttribute('style', '');
				weapons[4].setAttribute('src', `./assets/img/weapon/${rot.rare}.png`);
			} else {
				weapons[4].setAttribute('style', 'display: none;');
			}
			const stageId = parseInt(rot.stage) - 1;
			modal.querySelector('.rotation-stage img').setAttribute('src', `./assets/img/stage/${stageId}.png`);
			modal.querySelector('.rotation-stage p').textContent = srrManager.STAGE_WORDS[stageId][LANG_KEY];
			const startStr = unixToString(parseInt(rot.start), true);
			const endStr = unixToString(parseInt(rot.end), false);
			const nth = `[${getNthString(parseInt(rot.num))}]`;
			const timeStr = `${nth} ${startStr} - ${endStr}`;
			modal.querySelector('h5').textContent = timeStr;
		});
	});
}


/** getQueries(url)
 * URLに付けられたクエリパラメータを連想配列にして返します。
 * @param url {string} - クエリパラメータを取得するURL（省略するとlocationから取る）
 * @return {object} クエリパラメータの連想配列
 */
function getQueries(url) {
	const urlStr = String(url || window.location);
	const queryStr = urlStr.slice(urlStr.indexOf('?') + 1);
	const queries = {};
	if (!queryStr) {
		return queries;
	}
	queryStr.split('&').forEach((queryStr) => {
		const queryArr = queryStr.split('=');
		queries[queryArr[0]] = queryArr[1];
	});
	return queries;
}


/** saveStorage()
 * localStorageにセーブします。
 */
function saveStorage() {
	const saveDataObj = {};
	Array.prototype.forEach.call($forSave, ($input) => {
		const key = $input.getAttribute('id');
		if (key) {
			saveDataObj[key] = $input.checked;
		}
	});
	const saveDataJSON = JSON.stringify(saveDataObj);
	localStorage.setItem(STORAGE_KEY, saveDataJSON);
}


/** loadStorage()
 * localStorageからロードします。
 */
function loadStorage() {
	var saveDataJSON = localStorage.getItem(STORAGE_KEY);
	if (saveDataJSON !== null) {
		var saveDataObj = JSON.parse(saveDataJSON);
		// いったんすべてのチェックを外し
		Array.prototype.forEach.call($forSave, ($input) => {
			$input.checked = false;
		});
		// チェックを入れる必要があるものは入れ直す
		Array.prototype.forEach.call($forSave, ($input) => {
			const key = $input.getAttribute('id');
			if (saveDataObj[key]) {
				$input.checked = true;
			}
		});
	}
}


/** getOrgnizedRecords()
 * 数千行分ある生レコードをすべてチェックして、各種目の最高記録を整理し、
 * その結果をオブジェクトとして取得します。
 * @return {object} 各種目の最高記録レコードが詰め込まれたオブジェクト
 */
function getOrgnizedRecords() {

	// 編成種別のチェック状況
	const checked = {
		'rotation-normal': document.getElementById('rotation-normal').checked,
		'rotation-green-mystery-one': document.getElementById('rotation-green-mystery-one').checked,
		'rotation-green-mystery-all': document.getElementById('rotation-green-mystery-all').checked,
		'rotation-golden-mystery': document.getElementById('rotation-golden-mystery').checked,
	};
	
	return srrManager.getRecords(checked);
}


/** getNthString(num)
 * 数値numを受け取って、たとえばnumが3だったら "第3回" あるいは "3rd" を返す。
 * 言語が日本語なら "第3回" 、英語なら "3rd" を返します。
 * @param num {number} - 第n回のnの部分
 * @param {string} 文字列としてパッケージングされたn
 */
function getNthString(num) {
	if (LANG_KEY === 'ja') {
		return `第${num}回`;
	}
	switch (num) {
		case 1:
			return '1st';
		case 2:
			return '2nd';
		case 3:
			return '3rd';
		default:
			return `${num}th`;
	}
}


/** unixToString(unix, isEnabledYear)
 * UNIX時刻を人間が見やすい文字列に変換します。
 * "2020/12/31 23:59" あるいは "31th Dec. 2020 11:59 p.m." のような文字列を返します。
 * どちらの形式になるかは、言語設定が日本語か英語かによって判定されます。
 * @param unix {number} - UNIX時刻
 * @param isEnabledYear {boolean} - 年を含めるかどうか
 * @return {string} 文字列に変換されたUNIX時刻
 */
function unixToString(unix, isEnabledYear) {
	const date = new Date(unix * 1000);
	const Y = date.getFullYear();
	const M = date.getMonth() + 1;
	const D = date.getDate();
	const m = date.getMinutes();
	const MS = [
		'Jan.',
		'Feb.',
		'Mar.',
		'Apr.',
		'May',
		'Jun.',
		'Jul.',
		'Aug.',
		'Sep.',
		'Oct.',
		'Nov.',
		'Dec.',
	][M - 1];
	let h = date.getHours();
	let ampm;
	if (LANG_KEY === 'ja') {
		if (isEnabledYear) {
			return `${Y}/${M}/${D} ${h}:00`;
		} else {
			return `${M}/${D} ${h}:00`;
		}
	} else {
		if (h < 12) { 
			ampm = 'a.m.';
		} else {
			ampm = 'p.m.';
		}
		h = h % 12;
		if (h === 0) {
			h = 12;
		}
		if (isEnabledYear) {
			return `${getNthString(D)} ${MS} ${Y} ${h}:00 ${ampm}`;
		} else {
			return `${getNthString(D)} ${MS} ${h}:00 ${ampm}`;
		}
	}
}


/** getScoreHTML(rec)
 */
function getScoreHTML(rec) {
	const className = (POWER_EGGS_RECORD_IDS.indexOf(parseInt(rec['record id'])) > -1) ? 'p-eggs' : 'eggs';
	let eggsHTML = `<p class="${className}"><span class="num">${rec.score}</span></p>`;
	return eggsHTML;
}


/** getMembersHTML(rec)
 */
function getMembersHTML(rec) {
	let membersHTML = rec['member 1'];
	if (rec['member 2']) membersHTML += ' ' + rec['member 2'];
	if (rec['member 3']) membersHTML += ' ' + rec['member 3'];
	if (rec['member 4']) membersHTML += ' ' + rec['member 4'];
	membersHTML = `<p class="members">${membersHTML}</p>`;
	return membersHTML;
}


/** getRotationHTML(rec)
 */
function getRotationHTML(rec) {
	let rotationHTML = '';
	const rotationId = parseInt(rec['rotation id']);
	if (!isNaN(rotationId)) {
		const rot = srrManager.rotations[rotationId - 1];
		const w1 = `<li><img src="./assets/img/weapon/${rot.w1}.png"></li>`;
		const w2 = `<li><img src="./assets/img/weapon/${rot.w2}.png"></li>`;
		const w3 = `<li><img src="./assets/img/weapon/${rot.w3}.png"></li>`;
		const w4 = `<li><img src="./assets/img/weapon/${rot.w4}.png"></li>`;
		const w5 = (rot.rare) ? `<li><img src="./assets/img/weapon/${rot.rare}.png"></li>` : '';
		rotationHTML = `<ul class="rotation-images" rotation-id="${rotationId}">${w1}${w2}${w3}${w4}${w5}</ul>`;
	}
	return rotationHTML;
}


/** getLinksHTML(rec)
 */
function getLinksHTML(rec) {
	if (rec.links) {
		let linksHTML = '';
		// 生レコードのlinks列のデータをカンマで区切って配列にします
		// 基本的にありえないので考慮していないが、URL自体にカンマが含まれているとそこで区切られてしまいバグる
		// ex) https://example,co.jp, https://example,ne.jp のような場合
		const urls = rec.links.split(',');
		urls.forEach((item) => {
			// スペースなどをトリムする
			const url = item.trim();
			if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) { 
				// 「//」の後を取得する
				const url2 = url.split('//')[1];
				if (url2) {
					// FQDN部分を取得する
					const fqdn = url2.split('/')[0];
					// クエリパラメータを取得する
					const queries = getQueries(url);
					// アイコンタイプを決定する
					const type = queries.type || FQDN_ICON_TYPES[fqdn] || 'chain';
					// プレイヤー
					const title = (!queries.player) ? '' :
						(LANG_KEY === 'ja') ? queries.player + '視点' :
						 queries.player + '\'s POV';
					if (type !== 'none') {
						linksHTML += `<a href="${encodeURI(url)}" title="${title}" target="_blank"><img src="./assets/img/link-${type}.png"></a>`;
					}
				}
			}
		});
		return `<p class="links">${linksHTML}</p>`;
	} else {
		return '';
	}
}


/** createTableHTMLArray(organizedRecords)
 * 整理されたレコードデータからテーブルのセル要素の中身を作ります。
 * @param organizedRecords {object} - 整理されたレコードデータ
 * @return {array} 各セル要素のinnerHTMLが格納された二次元配列
 */
function createTableHTMLArray(organizedRecords) {
	const tableHTMLArray = [['']];

	// チェックが入っているステージのラジオボタンを特定する
	let visibleStage;
	const $radios = document.getElementsByName('visible-stage');
	Array.prototype.forEach.call($radios, ($radio) => {
		if ($radio.checked) {
			visibleStage = $radio.getAttribute('value');
		}
	});

	// ステージ画像とステージ名の行を作る
	for (let x = 0; x < STAGE_COUNT; x++) {
		// 無視すべきステージはスキップする
		if (visibleStage.indexOf('' + x) < 0) {
			continue;
		}
		const stage = `<img src="./assets/img/stage/${x}.png">`;
		tableHTMLArray[0][x + 1] = `${stage}<p>${srrManager.STAGE_WORDS[x][`${LANG_KEY}`]}</p>`;
	}

	// 各行（各種目）について
	for (let y = 0; y < RECORD_ORDER.length; y++) {
		const n = RECORD_ORDER[y];
		tableHTMLArray[y + 1] = [];
		// 左端ヘッダーには種目名を入れる
		tableHTMLArray[y + 1][0] = srrManager.EVENT_WORDS[n][LANG_KEY];
		// 各ステージについて
		for (let x = 0; x < STAGE_COUNT; x++) {
			// 無視すべきステージはスキップする
			if (visibleStage.indexOf('' + x) < 0) {
				continue;
			}
			const rec = organizedRecords[`${x}-${n}`];
			if (!rec) {
				tableHTMLArray[y + 1][x + 1] = '';
				continue;
			}
			let html = '';
			html += getScoreHTML(rec);
			html += getMembersHTML(rec);
			html += getRotationHTML(rec);
			html += getLinksHTML(rec);
			if ('ties' in rec) {
				html += '<div class="ties">';
				rec.ties.forEach((tie) => {
					html += getMembersHTML(tie);
					html += getRotationHTML(tie);
					html += getLinksHTML(tie);
				});
				html += '</div>';
			}
			tableHTMLArray[y + 1][x + 1] = html;
		}
	}
	return tableHTMLArray;
}


/** createTableHTML(tableHTMLArray)
 * 二次元配列を受け取ってテーブル要素のinnerHTMLを返します。
 * "<thead>…</thead><tbody>…</tbody>"という内容になります。
 * 上端と左端はヘッダーとして扱い、<td>ではなく<th>タグを使うようにします。
 * @param tableHTMLArray {array} - 各セル要素のinnerHTMLが格納された二次元配列
 * @return {string} テーブル要素のinnerHTML
 */
function createTableHTML(tableHTMLArray) {
	let html = '';
	tableHTMLArray.forEach((tr, y) => {
		if (y === 0) {
			html += '<thead><tr>';
			tr.forEach((td, x) => {
				html += `<th>${td}</th>`;
			});
			html += '</tr></thead>';
		} else {
			html += '<tr>';
			tr.forEach((td, x) => {
				if (x === 0) {
					html += `<th>${td}</th>`;
				} else {
					html += `<td>${td}</td>`;
				}
			});
			html += '</tr>';
		}
	});
	return html;
}


/** alphabet2int(str)
 * A, B, C…といった文字列を1, 2, 3…のような数値に変換します。
 * AA, AB, AC…は27, 28, 29…となります。
 * @param {string} - アルファベットの文字列
 * @return {number} - 変換結果
 */
function alphabet2int(str) {
	const charCodeA = 'a'.charCodeAt(0);
	const lower = str.toLowerCase();
	let sum = 0;
	for (let i = 0; i < lower.length; i++) {
		const a = lower[i];
		const b = a.charCodeAt(0) - charCodeA + 1;
		const c = b * Math.pow(26, i);
		sum += c;
	}
	return sum;
}