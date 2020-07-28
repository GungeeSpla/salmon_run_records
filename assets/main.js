'use strict';

const OPEN_TIME = new Date().getTime();

// Google Visualization APIの読み込み
google.load('visualization', '1');

// スプレッドシートにアクセスするためのベースURL
// いつからかURL_BASE_1 だとCORSで弾かれるようになったのでURL_BASE_2に変更
const URL_BASE_1 = 'http://spreadsheets.google.com/tq';
const URL_BASE_2 = 'https://docs.google.com/spreadsheets/d';

// スプレッドシートのID
const SHEET_KEY = '1v-OCTcqyj_mEgxityyfAWCfT2_2IueRrtsGItYPZCMU';

// 単語定義をスプレッドシートから取得するか？
// trueにするとスプレッドシートから取得した結果をコンソールに表示する（表示するだけ）
// 単語定義は別にしょっちゅう変わるものではないので直接ソースコードにぶちこむ仕様
const SHOULD_GET_WORD_DEFINITIONS = false;

// ステージの単語定義
const STAGE_WORD_DEFINITIONS = {"0":{"id":"0","ja":"シェケナダム","en":"Spawning Grounds"},"1":{"id":"1","ja":"難破船ドン･ブラコ","en":"Marooner's Bay"},"2":{"id":"2","ja":"海上集落シャケト場","en":"Lost Outpost"},"3":{"id":"3","ja":"トキシラズいぶし工房","en":"Salmonid Smokeyard"},"4":{"id":"4","ja":"朽ちた箱舟 ポラリス","en":"Ruins of Ark Polaris"}};

// 種目の単語定義
const EVENT_WORD_DEFINITIONS = {"0":{"id":"0","ja":"総合金","en":"Total Golden Eggs"},"1":{"id":"1","ja":"総合金（昼のみ）","en":"Total Golden Eggs (No Night)"},"2":{"id":"2","ja":"1WAVE最高金","en":"1-Wave Golden Eggs"},"3":{"id":"3","ja":"個人金","en":"Single Player Golden Eggs"},"4":{"id":"4","ja":"野良3総合金","en":"Total Golden Eggs in Freelance"},"5":{"id":"5","ja":"野良3個人金","en":"Single Player Golden Eggs in Freelance"},"6":{"id":"6","ja":"野良2総合金","en":"Total Golden Eggs in Twinlance"},"7":{"id":"7","ja":"野良2個人金","en":"Single Player Golden Eggs in Twinlance"},"8":{"id":"8","ja":"通常昼","en":"NT Normal"},"9":{"id":"9","ja":"満潮昼","en":"HT Normal"},"10":{"id":"10","ja":"干潮昼","en":"LT Normal"},"11":{"id":"11","ja":"通常ラッシュ","en":"NT Rush"},"12":{"id":"12","ja":"満潮ラッシュ","en":"HT Rush"},"13":{"id":"13","ja":"通常霧","en":"NT Fog"},"14":{"id":"14","ja":"満潮霧","en":"HT Fog"},"15":{"id":"15","ja":"干潮霧","en":"LT Fog"},"16":{"id":"16","ja":"通常間欠泉","en":"NT Goldie Seeking"},"17":{"id":"17","ja":"満潮間欠泉","en":"HT Goldie Seeking"},"18":{"id":"18","ja":"通常グリル","en":"NT Grillers"},"19":{"id":"19","ja":"満潮グリル","en":"HT Grillers"},"20":{"id":"20","ja":"通常ハコビヤ","en":"NT Mothership"},"21":{"id":"21","ja":"満潮ハコビヤ","en":"HT Mothership"},"22":{"id":"22","ja":"干潮ハコビヤ","en":"LT Mothership"},"23":{"id":"23","ja":"干潮ドスコイ","en":"Cohock Charge"},"24":{"id":"24","ja":"総合赤","en":"Total Power Eggs"},"25":{"id":"25","ja":"個人赤","en":"Single Player Power Eggs"},"26":{"id":"26","ja":"野良3総合赤","en":"Total Power Eggs in Freelance"},"27":{"id":"27","ja":"野良3個人赤","en":"Single Player Power Eggs in Freelance"},"28":{"id":"28","ja":"野良2総合赤","en":"Total Power Eggs in Twinlance"}};

// ブキの単語定義
const WEAPON_WORD_DEFINITIONS = {"0":{"id":"0","ja":"ボールドマーカー","en":"Sploosh-o-matic"},"10":{"id":"10","ja":"わかばシューター","en":"Splattershot Jr."},"20":{"id":"20","ja":"シャープマーカー","en":"Splash-o-matic"},"30":{"id":"30","ja":"プロモデラーMG","en":"Aerospray"},"40":{"id":"40","ja":"スプラシューター","en":"Splattershot"},"50":{"id":"50","ja":".52ガロン","en":".52 Gal"},"60":{"id":"60","ja":"N-ZAP85","en":"N-ZAP '85"},"70":{"id":"70","ja":"プライムシューター","en":"Splattershot Pro"},"80":{"id":"80","ja":".96ガロン","en":".96 Gal"},"90":{"id":"90","ja":"ジェットスイーパー","en":"Jet Squelcher"},"200":{"id":"200","ja":"ノヴァブラスター","en":"Luna Blaster"},"210":{"id":"210","ja":"ホットブラスター","en":"Blaster"},"220":{"id":"220","ja":"ロングブラスター","en":"Range Blaster"},"230":{"id":"230","ja":"クラッシュブラスター","en":"Clash Blaster"},"240":{"id":"240","ja":"ラピッドブラスター","en":"Rapid Blaster"},"250":{"id":"250","ja":"Rブラスターエリート","en":"Rapid Blaster Pro"},"300":{"id":"300","ja":"L3リールガン","en":"L-3 Nozzlenose"},"310":{"id":"310","ja":"H3リールガン","en":"H-3 Nozzlenose"},"400":{"id":"400","ja":"ボトルガイザー","en":"Squeezer"},"1000":{"id":"1000","ja":"カーボンローラー","en":"Carbon Roller"},"1010":{"id":"1010","ja":"スプラローラー","en":"Splat Roller"},"1020":{"id":"1020","ja":"ダイナモローラー","en":"Dynamo Roller"},"1030":{"id":"1030","ja":"ヴァリアブルローラー","en":"Flingza Roller"},"1100":{"id":"1100","ja":"パブロ","en":"Inkbrush"},"1110":{"id":"1110","ja":"ホクサイ","en":"Octobrush"},"2000":{"id":"2000","ja":"スクイックリンα","en":"Squiffer"},"2010":{"id":"2010","ja":"スプラチャージャー","en":"Splat Charger"},"2020":{"id":"2020","ja":"スプラスコープ","en":"Splatterscope"},"2030":{"id":"2030","ja":"リッター4K","en":"E-liter 4K"},"2040":{"id":"2040","ja":"4Kスコープ","en":"E-liter 4K Scope"},"2050":{"id":"2050","ja":"14式竹筒銃・甲","en":"Bamboozler 14"},"2060":{"id":"2060","ja":"ソイチューバー","en":"Goo Tuber"},"3000":{"id":"3000","ja":"バケットスロッシャー","en":"Slosher"},"3010":{"id":"3010","ja":"ヒッセン","en":"Tri-Slosher"},"3020":{"id":"3020","ja":"スクリュースロッシャー","en":"Sloshing Machine"},"3030":{"id":"3030","ja":"オーバーフロッシャー","en":"Bloblobber"},"3040":{"id":"3040","ja":"エクスプロッシャー","en":"Explosher"},"4000":{"id":"4000","ja":"スプラスピナー","en":"Mini Splatling"},"4010":{"id":"4010","ja":"バレルスピナー","en":"Heavy Splatling"},"4020":{"id":"4020","ja":"ハイドラント","en":"Hydra Splatling"},"4030":{"id":"4030","ja":"クーゲルシュライバー","en":"Ballpoint Splatling"},"4040":{"id":"4040","ja":"ノーチラス47","en":"Nautilus 47"},"5000":{"id":"5000","ja":"スパッタリー","en":"Dapple Dualies"},"5010":{"id":"5010","ja":"スプラマニューバー","en":"Splat Dualies"},"5020":{"id":"5020","ja":"ケルビン525","en":"Glooga Dualies"},"5030":{"id":"5030","ja":"デュアルスイーパー","en":"Dualie Squelchers"},"5040":{"id":"5040","ja":"クアッドホッパーブラック","en":"Tetra Dualies"},"6000":{"id":"6000","ja":"パラシェルター","en":"Splat Brella"},"6010":{"id":"6010","ja":"キャンピングシェルター","en":"Tenta Brella"},"6020":{"id":"6020","ja":"スパイガジェット","en":"Undercover Brella"},"7000":{"id":"7000","ja":"クマサン印のブラスター","en":"Grizzco Blaster"},"7010":{"id":"7010","ja":"クマサン印のシェルター","en":"Grizzco Brella"},"7020":{"id":"7020","ja":"クマサン印のチャージャー","en":"Grizzco Charger"},"7030":{"id":"7030","ja":"クマサン印のスロッシャー","en":"Grizzco Slosher"},"7040":{"id":"7040","ja":"すべてのクマサン印のブキ","en":"All Grizzco Weapons"},"8000":{"id":"8000","ja":"緑？ (クマサン印のブラスター)","en":"Green-? (Grizzco Blaster)"},"8010":{"id":"8010","ja":"緑？ (クマサン印のシェルター)","en":"Green-? (Grizzco Brella)"},"8020":{"id":"8020","ja":"緑？ (クマサン印のチャージャー)","en":"Green-? (Grizzco Charger)"},"8030":{"id":"8030","ja":"緑？ (クマサン印のスロッシャー)","en":"Green-? (Grizzco Slosher)"},"-2":{"id":"-2","ja":"金？","en":"Golden-?"},"-1":{"id":"-1","ja":"緑？","en":"Green-?"}};

// localStorageに保存する際に使用するキー
const STORAGE_KEY = 'salmon-run-records';

// 無視するレコードID
// 「1WAVE最高」の記録は無視してもいいかな
const IGNORE_RECORD_IDS = [2];

// 赤イクラ記録の種目IDたち
// これに該当する種目は、イクラの前に赤イクラアイコンを付ける
const POWER_EGGS_RECORD_IDS = [24, 25, 26, 27, 28];

// 「その種目とセットで更新確認をすべき種目」たち
// たとえば「野良3総合赤の記録が、総合赤の記録をも塗り替えていやしないか？」とチェックをするためのもの
const UPDATE_TOGETHER = {
	'26': 24,
	'27': 25,
	'28': 24,
};

// ステージの数
const STAGE_COUNT = 5;

// 種目の数
const RECORD_COUNT = 29;

// 通常編成、一緑編成、全緑編成、黄金編成、編成不明のIDたち
const ROTATION_KIND_NORMAL = 0;
const ROTATION_KIND_GREEN_MYSTERY_ONE = 1;
const ROTATION_KIND_GREEN_MYSTERY_ALL = 2;
const ROTATION_KIND_GOLDEN_MYSTERY = 3;
const ROTATION_KIND_UNKNOWN = 4;

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

// CSVファイルを読み込むべき？ スプレッドシートに不具合がある場合trueにする
const SHOULD_USE_CSV = false;

// CSVファイルのバージョン キャッシュ対策
const CSV_VERSION = 1;

// 取得したレコード
const ROW_RECORDS = [];

// 取得した編成履歴
const ROTATIONS = [];

// 何回もアクセスすることになるであろうDOM要素への参照
let $recordTable;
let $forSave;

// リンクのドメインごとに表示する画像を決める
const FQDN_ICON_TYPES = {
	'cdn.discordapp.com': 'image',
	'ibb.co': 'image',
	'imgur.com': 'image',
	'pbs.twimg.com': 'image',
	'ton.twitter.com': 'image',
	'www.reddit.com': 'image',
	'salmon-stats.yuki.games': 'chain',
	'twitter.com': 'twitter',
	'clips.twitch.tv': 'video',
	'www.twitch.tv': 'video',
	'www.openrec.tv': 'video',
	'www.youtube.com': 'video',
	'youtu.be': 'video',
	'www.nicovideo.jp': 'video',
};


/** initialize()
 */
async function initialize() {
	console.log('ページの読み込みが完了しました。', getProcessTimeStr());

	// レコードテーブル要素を取得
	$recordTable = document.getElementById('record-table');
	$forSave = document.getElementsByClassName('for-save');

	// localStorageから設定を読み込む
	loadStorage();

	// 各DOM要素にイベントを設定したり初期値を設定したりする
	initializeDOMElements();

	// スプレッドシートにアクセス
	console.log('スプレッドシートにアクセスしています…');

	// getCSV or getSheet
	const get = (SHOULD_USE_CSV) ? getCSV : getSheet;

	// 単語設定を読み込みにいく
	if (SHOULD_GET_WORD_DEFINITIONS) {
		// ステージ単語定義を取得する
		await get({
			key: SHEET_KEY,
			sheet: 'Languages',
			range: 'A7:C12',
			callback: (lines) => {
				const stageDefine = {};
				lines.forEach((line) => {
					stageDefine[line.id] = line;
				});
				console.log('▼ ステージ単語定義を取得しました');
				console.log(JSON.stringify(stageDefine));
			},
		});

		// 種目単語定義を取得する
		await get({
			key: SHEET_KEY,
			sheet: 'Languages',
			range: 'A14:C43',
			callback: (lines) => {
				const recordDefine = {};
				lines.forEach((line) => {
					recordDefine[line.id] = line;
				});
				console.log('▼ 種目単語定義を取得しました');
				console.log(JSON.stringify(recordDefine));
			},
		});

		// ブキ単語定義を取得する
		await get({
			key: SHEET_KEY,
			sheet: 'Languages',
			range: 'A45:C106',
			callback: (lines) => {
				const weaponDefine = {};
				lines.forEach((line) => {
					weaponDefine[line.id] = line;
				});
				console.log('▼ ブキ単語定義を取得しました');
				console.log(JSON.stringify(weaponDefine));
			},
		});
	}

	// レコードの数と編成履歴の数を取得する
	let rotationCount = 0;
	let recordCount = 0;
	await get({
		key: SHEET_KEY,
		sheet: 'Count',
		range: 'A1:B2',
		callback: (lines) => {
			console.log('▼ レコードの数と編成履歴の数を取得しました。', getProcessTimeStr());
			rotationCount = parseInt(lines[0]['rotation count']);
			recordCount = parseInt(lines[0]['record count']);
			console.log(`　レコードの数: ${recordCount}件`);
			console.log(`　編成履歴の数: ${rotationCount}件`);
		},
	})

	// レコードを取得する
	await get({
		key: SHEET_KEY,
		sheet: 'Records',
		range: `A${ROW_RECORDS.length + 1}:J${recordCount + 1}`,
		array: ROW_RECORDS,
		callback: (lines) => {
			console.log('▼ レコードを取得しました。', getProcessTimeStr());
			console.log(lines);
			//console.log(JSON.stringify(lines));
		},
	});

	// 編成履歴を取得する
	await get({
		key: SHEET_KEY,
		sheet: 'Rotations',
		range: `A${ROTATIONS.length + 2}:J${rotationCount + 2}`,
		array: ROTATIONS,
		callback: (lines) => {
			console.log('▼ 編成履歴を取得しました。', getProcessTimeStr());
			console.log(lines);
			//console.log(JSON.stringify(lines));
		},
	});
	console.log('テーブルを作成しています…');
	updateRecordTable();
	console.log('テーブルを作成しました。', getProcessTimeStr());
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
	const orgnizedRecords = getOrgnizedRecords(ROW_RECORDS);
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
			const rot = ROTATIONS[id - 1];
			console.log(rot);
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
			modal.querySelector('.rotation-stage p').textContent = STAGE_WORD_DEFINITIONS[stageId][LANG_KEY];
			const startStr = unixToString(parseInt(rot.start), true);
			const endStr = unixToString(parseInt(rot.end), false);
			const nth = `[${getNthString(parseInt(rot.num))}]`;
			const timeStr = `${nth} ${startStr} - ${endStr}`;
			modal.querySelector('h5').textContent = timeStr;
		});
	});
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


/** getOrgnizedRecords(rowRecords)
 * 数千行分ある生レコードをすべてチェックして、各種目の最高記録を整理し、
 * その結果をオブジェクトとして取得します。
 * @param rowRecords {array} - スプレッドシートに登録された生レコードの配列
 * @return {object} 各種目の最高記録レコードが詰め込まれたオブジェクト
 */
function getOrgnizedRecords(rowRecords) {
	const records = {};

	// 編成種別のチェック状況
	const checked = {
		'rotation-normal': document.getElementById('rotation-normal').checked,
		'rotation-green-mystery-one': document.getElementById('rotation-green-mystery-one').checked,
		'rotation-green-mystery-all': document.getElementById('rotation-green-mystery-all').checked,
		'rotation-golden-mystery': document.getElementById('rotation-golden-mystery').checked,
	};

	for (let i = 0; i < rowRecords.length; i++) {
		const rec = rowRecords[i];

		if ('ties' in rec) {
			delete rec.ties;
		}

		// ステージID、レコードID、スコアのいずれかひとつでも数値に変換できなければこのレコードは無効
		// for文を抜けてしまっていい
		if (isNaN(parseInt(rec['stage id'])) ||
				isNaN(parseInt(rec['record id'])) ||
				isNaN(parseInt(rec['score']))) {
			break;
		}

		// 編成種別を取得
		const rotationId = parseInt(rec['rotation id']);
		const rotationKind = parseInt((!isNaN(rotationId)) ?
			ROTATIONS[rotationId - 1].kind :
			ROTATION_KIND_UNKNOWN);

		// 金ランダム編成にチェックが入っておらず、このレコードが金ランダム編成のものならば、無視
		if (!checked['rotation-golden-mystery'] &&
				rotationKind === ROTATION_KIND_GOLDEN_MYSTERY) {
			continue;
		}

		// 一緑ランダム編成にチェックが入っておらず、このレコードが一緑ランダム編成のものならば、無視
		if (!checked['rotation-green-mystery-one'] &&
				rotationKind === ROTATION_KIND_GREEN_MYSTERY_ONE) {
			continue;
		}

		// 全緑ランダム編成にチェックが入っておらず、このレコードが全緑ランダム編成のものならば、無視
		if (!checked['rotation-green-mystery-all'] &&
				rotationKind === ROTATION_KIND_GREEN_MYSTERY_ALL) {
			continue;
		}

		// 通常編成にチェックが入っておらず、このレコードが通常編成（あるいは編成不明）のものならば、無視
		if (!checked['rotation-normal'] &&
			 (rotationKind === ROTATION_KIND_NORMAL || rotationKind === ROTATION_KIND_UNKNOWN)) {
			continue;
		}

		// ステージID+レコードIDでキーを作成
		const stageId = rec['stage id'];
		const recordId = rec['record id'];
		const key1 = `${stageId}-${recordId}`;
		const keys = [key1];

		if (recordId in UPDATE_TOGETHER) {
			keys.push(`${stageId}-${UPDATE_TOGETHER[recordId]}`);
		}

		keys.forEach((key) => {
			// そのキーのプロパティがレコードデータにすでに存在するかどうか
			if (key in records) {
				// プロパティがレコードデータにすでに存在するならば
				// スコアを比較する
				const newEggs = parseInt(rec.score);
				const oldEggs = parseInt(records[key].score);
				if (newEggs > oldEggs) {
					// 更新していれば置換する
					records[key] = rec;
				} else if (newEggs === oldEggs) {
					// タイ記録ならばtiesプロパティに配列を作って格納する
					// あるいはすでに存在しているties配列にpushする
					if ('ties' in records[key]) {
						records[key].ties.push(rec);
					} else {
						records[key].ties = [rec];
					}
				}
			} else {
				// プロパティがまだ存在していないならば単に代入する
				records[key] = rec;
			}
		});
	}
	return records;
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
		const rot = ROTATIONS[rotationId - 1];
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
			// 「//」の後を取得する
			const url2 = url.split('//')[1];
			if (url2) {
				// FQDN部分を取得する
				const fqdn = url2.split('/')[0];
				// クエリパラメータを取得する
				const queries = getQueries(url);
				// アイコンタイプを決定する
				const type = queries.type || FQDN_ICON_TYPES[fqdn] || 'chain';
				if (type !== 'none') {
					linksHTML += `<a href="${url}" target="_blank"><img src="./assets/img/link-${type}.png"></a>`;
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
		tableHTMLArray[0][x + 1] = `${stage}<p>${STAGE_WORD_DEFINITIONS[x][`${LANG_KEY}`]}</p>`;
	}

	// 各行（各種目）について
	for (let y = 0; y < RECORD_COUNT; y++) {
		// 無視すべき種目はスキップする
		if (IGNORE_RECORD_IDS.indexOf(y) > -1) {
			continue;
		}
		tableHTMLArray[y + 1] = [];
		// 左端ヘッダーには種目名を入れる
		tableHTMLArray[y + 1][0] = EVENT_WORD_DEFINITIONS[y][LANG_KEY];
		// 各ステージについて
		for (let x = 0; x < STAGE_COUNT; x++) {
			// 無視すべきステージはスキップする
			if (visibleStage.indexOf('' + x) < 0) {
				continue;
			}
			const rec = organizedRecords[`${x}-${y}`];
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


/** getSheet(opt)
 * スプレッドシートのデータを取得するプロミスを返します。
 * awaitを付けてこの関数を呼べば、データ取得の完了を待つことができます。
 * @param opt.key {string} - スプレッドシートのID
 * @param opt.sheet {string} - 参照するシート名
 * @param opt.range {string} - 参照するセル範囲
 * @param opt.array {array} - データを格納する配列
 * @param opt.callback {function} - コールバック
 * @return {promise}
 */
function getSheet(opt) {
	// 参考: https://builder.japan.zdnet.com/tool/20369905/3/
	return new Promise((resolve) => {
		//const url = encodeURI(`${URL_BASE}?key=${opt.key}&sheet=${opt.sheet}&range=${opt.range}`);
		const url = encodeURI(`sdfd${URL_BASE_2}/${opt.key}/gviz/tq?sheet=${opt.sheet}&range=${opt.range}`);
		const query = new google.visualization.Query(url);
		query.setRefreshable(false);
		query.send(function(response){
			const data = response.getDataTable();
			// 各行のオブジェクトデータを格納するための配列
			const lines = opt.array || [];
			// 参照範囲の2行目以降の各行について
			for (let y = 0; y < data.getNumberOfRows(); y++) {
				// この行のデータを格納するためのオブジェクト
				const obj = {};
				// 参照範囲の各列について
				for (let x = 0; x < data.getNumberOfColumns(); x++) {
					// 参照範囲目の1行目がラベルとして扱われるので
					// この列のラベルを取得してオブジェクトのキーとして使う
					const key = data.getColumnLabel(x);
					// このセルの値を取得
					const value = data.getFormattedValue(y, x); 
					// オブジェクトに格納
					obj[key] = value;
				}
				// 配列に格納
				lines.push(obj);
			}
			// コールパック
			if (opt.callback) {
				opt.callback(lines);
			}
			resolve(true);
		});
	});
}


/** getCSV(opt)
 * CSVファイルを取得するプロミスを返します。
 * awaitを付けてこの関数を呼べば、データ取得の完了を待つことができます。
 * @param opt.sheet {string} - 参照するシート名
 * @param opt.range {string} - 参照するセル範囲
 * @param opt.array {array} - データを格納する配列
 * @param opt.callback {function} - コールバック
 * @return {promise}
 */
function getCSV(opt) {
	return new Promise((resolve) => {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `./assets/csv/${opt.sheet}.csv?ver=${CSV_VERSION}`, true);
		xhr.responseType = 'text';
		xhr.onreadystatechange = function (event) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var data = xhr.responseText;
					const ranges = opt.range.split(':'); // ex) "A2:E8"
					const startCell = ranges[0]; // "A1"
					const startX = alphabet2int(startCell.replace(/[0-9]*/g, '')) - 1; // 0
					const startY = parseInt(startCell.replace(/[a-zA-Z]*/g, '')) - 1; // 1
					const endCell = ranges[1]; // "E8"
					const endX = alphabet2int(endCell.replace(/[0-9]*/g, '')) - 1; // 4
					const endY = parseInt(endCell.replace(/[a-zA-Z]*/g, '')) - 1; // 7
					// CSVのテキストデータを改行で区切る
					const rows = data.split('\n');
					// そのうち1行目はラベルデータとして扱う
					const keys = rows[startY].split(',');
					for (let x = 0; x < keys.length; x++) {
						keys[x] = keys[x].trim();
					}
					// 各行のオブジェクトデータを放り込んでいくための配列
					const lines = opt.array || [];
					// startY～endYにかけて各行を見ていく
					for (let y = startY + 1; y <= endY; y++) {
						const obj = {};
						// CSVとは各項目をカンマで区切ったテキストデータのことだが
						// そのひとつの項目がそもそもカンマを含むデータだった場合
						// 1行分の文字列データに対して単純にsplit(',')メソッドを呼ぶと思うように動作しない
						// したがってひとつの項目内に含まれるカンマを:comma:に変換する
						let rowstr = '';
						let isQuote = false;
						// この行の文字をひとつひとつ見ていく
						for (let i = 0; i < rows[y].length; i++) {
							let c = rows[y][i];
							if (c === '"') {
								// ダブルクォーテーションならばクォートフラグを反転させる
								isQuote = !isQuote;
							} else {
								// カンマならば:comma:に変換し
								if (isQuote && c === ',') {
									c = ':comma:';
								}
								// この1文字をつなげていく
								rowstr += c;
							}
						}
						// こうして出来上がった文字列はsplit(',')で存分に区切ってよい！
						const row = rowstr.split(',');
						// startX～endXにかけて:comma:をカンマに変換しながら値をオブジェクトに放り込んでいく
						for (let x = startX; x <= endX; x++) {
							obj[keys[x]] = row[x].replace(/:comma:/g, ',');
						}
						// linesにオブジェクトを放り込む
						lines.push(obj);
					}
					// コールパック
					if (opt.callback) {
						opt.callback(lines);
					}
					resolve(true);
				}
			}
		};
		xhr.send(null);
	});
}


/** getProcessTimeStr()
 */
function getProcessTimeStr() {
	const time = new Date().getTime();
	const dif = time - OPEN_TIME;
	const str = (dif / 1000).toFixed(3);
	return `(${str} s)`;
}
