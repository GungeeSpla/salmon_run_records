'use strict';
google.load('visualization', '1');
// https://docs.google.com/spreadsheets/d/1v-OCTcqyj_mEgxityyfAWCfT2_2IueRrtsGItYPZCMU/edit?usp=sharing
const URL_BASE = 'http://spreadsheets.google.com/tq';
const URL_BASE_2 = 'https://docs.google.com/spreadsheets/d';
const SHEET_KEY = '1v-OCTcqyj_mEgxityyfAWCfT2_2IueRrtsGItYPZCMU';
const STAGE_DEFINE = {"0":{"id":"0","ja":"シェケナダム","en":"Spawning Grounds"},"1":{"id":"1","ja":"難破船ドン･ブラコ","en":"Marooner's Bay"},"2":{"id":"2","ja":"海上集落シャケト場","en":"Lost Outpost"},"3":{"id":"3","ja":"トキシラズいぶし工房","en":"Salmonid Smokeyard"},"4":{"id":"4","ja":"朽ちた箱舟 ポラリス","en":"Ruins of Ark Polaris"}};
const RECORD_DEFINE = {"0":{"id":"0","ja":"総合金","en":"Total Golden Eggs"},"1":{"id":"1","ja":"総合金（昼のみ）","en":"Total Golden Eggs (No Night)"},"2":{"id":"2","ja":"1WAVE最高金","en":"1-Wave Golden Eggs"},"3":{"id":"3","ja":"個人金","en":"Single Player Golden Eggs"},"4":{"id":"4","ja":"野良3総合金","en":"Total Golden Eggs in Freelance"},"5":{"id":"5","ja":"野良3個人金","en":"Single Player Golden Eggs in Freelance"},"6":{"id":"6","ja":"野良2総合金","en":"Total Golden Eggs in Twinlance"},"7":{"id":"7","ja":"野良2個人金","en":"Single Player Golden Eggs in Twinlance"},"8":{"id":"8","ja":"通常昼","en":"NT Normal"},"9":{"id":"9","ja":"満潮昼","en":"HT Normal"},"10":{"id":"10","ja":"干潮昼","en":"LT Normal"},"11":{"id":"11","ja":"通常ラッシュ","en":"NT Rush"},"12":{"id":"12","ja":"満潮ラッシュ","en":"HT Rush"},"13":{"id":"13","ja":"通常霧","en":"NT Fog"},"14":{"id":"14","ja":"満潮霧","en":"HT Fog"},"15":{"id":"15","ja":"干潮霧","en":"LT Fog"},"16":{"id":"16","ja":"通常間欠泉","en":"NT Goldie Seeking"},"17":{"id":"17","ja":"満潮間欠泉","en":"HT Goldie Seeking"},"18":{"id":"18","ja":"通常グリル","en":"NT Grillers"},"19":{"id":"19","ja":"満潮グリル","en":"HT Grillers"},"20":{"id":"20","ja":"通常ハコビヤ","en":"NT Mothership"},"21":{"id":"21","ja":"満潮ハコビヤ","en":"HT Mothership"},"22":{"id":"22","ja":"干潮ハコビヤ","en":"LT Mothership"},"23":{"id":"23","ja":"干潮ドスコイ","en":"Cohock Charge"},"24":{"id":"24","ja":"総合赤","en":"Total Power Eggs"},"25":{"id":"25","ja":"個人赤","en":"Single Player Power Eggs"},"26":{"id":"26","ja":"野良3総合赤","en":"Total Power Eggs in Freelance"},"27":{"id":"27","ja":"野良3個人赤","en":"Single Player Power Eggs in Freelance"},"28":{"id":"28","ja":"野良2総合赤","en":"Total Power Eggs in Twinlance"}};
const WEAPON_DEFINE = {"0":{"id":"0","ja":"ボールドマーカー","en":"Sploosh-o-matic"},"10":{"id":"10","ja":"わかばシューター","en":"Splattershot Jr."},"20":{"id":"20","ja":"シャープマーカー","en":"Splash-o-matic"},"30":{"id":"30","ja":"プロモデラーMG","en":"Aerospray"},"40":{"id":"40","ja":"スプラシューター","en":"Splattershot"},"50":{"id":"50","ja":".52ガロン","en":".52 Gal"},"60":{"id":"60","ja":"N-ZAP85","en":"N-ZAP '85"},"70":{"id":"70","ja":"プライムシューター","en":"Splattershot Pro"},"80":{"id":"80","ja":".96ガロン","en":".96 Gal"},"90":{"id":"90","ja":"ジェットスイーパー","en":"Jet Squelcher"},"200":{"id":"200","ja":"ノヴァブラスター","en":"Luna Blaster"},"210":{"id":"210","ja":"ホットブラスター","en":"Blaster"},"220":{"id":"220","ja":"ロングブラスター","en":"Range Blaster"},"230":{"id":"230","ja":"クラッシュブラスター","en":"Clash Blaster"},"240":{"id":"240","ja":"ラピッドブラスター","en":"Rapid Blaster"},"250":{"id":"250","ja":"Rブラスターエリート","en":"Rapid Blaster Pro"},"300":{"id":"300","ja":"L3リールガン","en":"L-3 Nozzlenose"},"310":{"id":"310","ja":"H3リールガン","en":"H-3 Nozzlenose"},"400":{"id":"400","ja":"ボトルガイザー","en":"Squeezer"},"1000":{"id":"1000","ja":"カーボンローラー","en":"Carbon Roller"},"1010":{"id":"1010","ja":"スプラローラー","en":"Splat Roller"},"1020":{"id":"1020","ja":"ダイナモローラー","en":"Dynamo Roller"},"1030":{"id":"1030","ja":"ヴァリアブルローラー","en":"Flingza Roller"},"1100":{"id":"1100","ja":"パブロ","en":"Inkbrush"},"1110":{"id":"1110","ja":"ホクサイ","en":"Octobrush"},"2000":{"id":"2000","ja":"スクイックリンα","en":"Squiffer"},"2010":{"id":"2010","ja":"スプラチャージャー","en":"Splat Charger"},"2020":{"id":"2020","ja":"スプラスコープ","en":"Splatterscope"},"2030":{"id":"2030","ja":"リッター4K","en":"E-liter 4K"},"2040":{"id":"2040","ja":"4Kスコープ","en":"E-liter 4K Scope"},"2050":{"id":"2050","ja":"14式竹筒銃・甲","en":"Bamboozler 14"},"2060":{"id":"2060","ja":"ソイチューバー","en":"Goo Tuber"},"3000":{"id":"3000","ja":"バケットスロッシャー","en":"Slosher"},"3010":{"id":"3010","ja":"ヒッセン","en":"Tri-Slosher"},"3020":{"id":"3020","ja":"スクリュースロッシャー","en":"Sloshing Machine"},"3030":{"id":"3030","ja":"オーバーフロッシャー","en":"Bloblobber"},"3040":{"id":"3040","ja":"エクスプロッシャー","en":"Explosher"},"4000":{"id":"4000","ja":"スプラスピナー","en":"Mini Splatling"},"4010":{"id":"4010","ja":"バレルスピナー","en":"Heavy Splatling"},"4020":{"id":"4020","ja":"ハイドラント","en":"Hydra Splatling"},"4030":{"id":"4030","ja":"クーゲルシュライバー","en":"Ballpoint Splatling"},"4040":{"id":"4040","ja":"ノーチラス47","en":"Nautilus 47"},"5000":{"id":"5000","ja":"スパッタリー","en":"Dapple Dualies"},"5010":{"id":"5010","ja":"スプラマニューバー","en":"Splat Dualies"},"5020":{"id":"5020","ja":"ケルビン525","en":"Glooga Dualies"},"5030":{"id":"5030","ja":"デュアルスイーパー","en":"Dualie Squelchers"},"5040":{"id":"5040","ja":"クアッドホッパーブラック","en":"Tetra Dualies"},"6000":{"id":"6000","ja":"パラシェルター","en":"Splat Brella"},"6010":{"id":"6010","ja":"キャンピングシェルター","en":"Tenta Brella"},"6020":{"id":"6020","ja":"スパイガジェット","en":"Undercover Brella"},"7000":{"id":"7000","ja":"クマサン印のブラスター","en":"Grizzco Blaster"},"7010":{"id":"7010","ja":"クマサン印のシェルター","en":"Grizzco Brella"},"7020":{"id":"7020","ja":"クマサン印のチャージャー","en":"Grizzco Charger"},"7030":{"id":"7030","ja":"クマサン印のスロッシャー","en":"Grizzco Slosher"},"7040":{"id":"7040","ja":"すべてのクマサン印のブキ","en":"All Grizzco Weapons"},"8000":{"id":"8000","ja":"緑？ (クマサン印のブラスター)","en":"Green-? (Grizzco Blaster)"},"8010":{"id":"8010","ja":"緑？ (クマサン印のシェルター)","en":"Green-? (Grizzco Brella)"},"8020":{"id":"8020","ja":"緑？ (クマサン印のチャージャー)","en":"Green-? (Grizzco Charger)"},"8030":{"id":"8030","ja":"緑？ (クマサン印のスロッシャー)","en":"Green-? (Grizzco Slosher)"},"-2":{"id":"-2","ja":"金？","en":"Golden-?"},"-1":{"id":"-1","ja":"緑？","en":"Green-?"}};
const STAGE_COUNT = 5;
const STORAGE_KEY = 'salmon-run-records';
const IGNORE_RECORD_IDS = [2];
const POWER_EGGS_RECORD_IDS = [24, 25, 26, 27, 28];
const UPDATE_TOGETHER = {
	'26': 24,
	'27': 25,
	'28': 24,
};
const RECORD_COUNT = 29;
const ROTATION_KIND_NORMAL = 0;
const ROTATION_KIND_GREEN_MYSTERY_ONE = 1;
const ROTATION_KIND_GREEN_MYSTERY_ALL = 2;
const ROTATION_KIND_GOLDEN_MYSTERY = 3;
const ROTATION_KIND_UNKNOWN = 4;
const RECORD_NUM_MAX = 1500;
const ROTATION_NUM_MAX = 800;
const navigatorLang = navigator.language || navigator.userLanguage || 'ja';
const queries = (() => {
	const queryStr = window.location.search.slice(1);
	const queries = {};
	if (!queryStr) {
		return queries;
	}
	queryStr.split('&').forEach((queryStr) => {
		const queryArr = queryStr.split('=');
		queries[queryArr[0]] = queryArr[1];
	});
	return queries;
})();
const LANG_KEY = (queries.lang === 'ja') ? 'ja' : (queries.lang === 'en') ? 'en' : (navigatorLang.indexOf('ja') > -1) ? 'ja' : 'en';
let RECORDS;
let ROTATIONS;
let createdRecords;
const LINK_TYPES = {
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


/** getSheet(param)
 */
function getSheet(param) {
	return new Promise((resolve) => {
		//const url = encodeURI(`${URL_BASE}?key=${param.key}&sheet=${param.sheet}&range=${param.range}`);
		const url = encodeURI(`${URL_BASE_2}/${param.key}/gviz/tq?sheet=${param.sheet}&range=${param.range}`);
		const query = new google.visualization.Query(url);
		query.setRefreshable(false);
		query.send(function(response){
			const data = response.getDataTable();
			const lines = [];
			for (let y = 0; y < data.getNumberOfRows(); y++) {
				const obj = {};
				for (let x = 0; x < data.getNumberOfColumns(); x++) {
					const key = data.getColumnLabel(x);
					const value = data.getFormattedValue(y, x); 
					obj[key] = value;
				}
				lines.push(obj);
			}
			param.callback(lines);
			resolve();
		});
	});
}


/** getDefine()
 */
async function getDefine() {
	await getSheet({
		key: SHEET_KEY,
		sheet: 'Languages',
		range: 'A7:C12',
		callback: (lines) => {
			const stageDefine = {};
			lines.forEach((line) => {
				stageDefine[line.id] = line;
			});
			console.log('▼ステージ定義を取得しました');
			console.log(JSON.stringify(stageDefine));
		},
	});
	await getSheet({
		key: SHEET_KEY,
		sheet: 'Languages',
		range: 'A14:C43',
		callback: (lines) => {
			const recordDefine = {};
			lines.forEach((line) => {
				recordDefine[line.id] = line;
			});
			console.log('▼レコード定義を取得しました');
			console.log(JSON.stringify(recordDefine));
		},
	});
	await getSheet({
		key: SHEET_KEY,
		sheet: 'Languages',
		range: 'A45:C106',
		callback: (lines) => {
			const weaponDefine = {};
			lines.forEach((line) => {
				weaponDefine[line.id] = line;
			});
			console.log('▼ブキ定義を取得しました');
			console.log(JSON.stringify(weaponDefine));
		},
	});
}


/** init()
 */
let $recordTable;
async function init() {
	$recordTable = document.getElementById('record-table');	
	loadStorage();
	if ('ontouchstart' in window) {
		document.body.classList.add('touchdevice');
	} else {
		document.body.classList.add('mousedevice');
	}
	document.getElementById('modal').addEventListener('click', () => {
		modal.classList.add('hidden');
	});
	document.getElementById('modal-rotation').addEventListener('click', (e) => {
		e.stopPropagation();
		return false;
	});
	if (LANG_KEY === 'en') {
		const transElements = document.getElementsByClassName('for-translation');
		Array.prototype.forEach.call(transElements, (elm) => {
			const txt = elm.getAttribute('en-text');
			elm.textContent = txt;
		});
	}
	const inputs = document.getElementsByClassName('for-update-table');
	Array.prototype.forEach.call(inputs, (input) => {
		input.addEventListener('change', () => {
			updateRecordTable(true);
		});
	});
	const inputs2 = document.getElementsByClassName('for-update-table-class');
	Array.prototype.forEach.call(inputs2, (input) => {
		const toggleClass = input.getAttribute('toggle-class');
		const update = () => {
			if (input.checked) {
				$recordTable.classList.add(toggleClass);
			} else {
				$recordTable.classList.remove(toggleClass);
			}
		};
		input.addEventListener('change', update);
		update();
	});
	const inputs3 = document.getElementsByClassName('for-remake-table');
	Array.prototype.forEach.call(inputs3, (input) => {
		input.addEventListener('change', () => {
			updateRecordTable(false);
		});
	});
	const saveInputs = document.getElementsByClassName('for-save');
	Array.prototype.forEach.call(saveInputs, (input) => {
		input.addEventListener('change', () => {
			saveStorage();
		});
	});
	console.log('シートにアクセスしています…');
	// await getDefine();
	let rotationCount = 0;
	let recordCount = 0;
	await getSheet({
		key: SHEET_KEY,
		sheet: 'Count',
		range: 'A1:B2',
		callback: (lines) => {
			rotationCount = parseInt(lines[0]['rotation count']);
			recordCount = parseInt(lines[0]['record count']);
		},
	})
	await getSheet({
		key: SHEET_KEY,
		sheet: 'Records',
		range: `A1:M${recordCount+1}`,
		callback: (lines) => {
			console.log(lines);
			RECORDS = lines;
			console.log('レコードを取得しました。');
		},
	});
	await getSheet({
		key: SHEET_KEY,
		sheet: 'Rotations',
		range: `A2:K${rotationCount+2}`,
		callback: (lines) => {
			console.log(lines);
			ROTATIONS = lines;
			console.log('編成履歴を取得しました。');
		},
	});
	console.log('テーブルを作成しています…');
	updateRecordTable();
	return;
}


/** updateRecordTable()
 */
function updateRecordTable() {
	createdRecords = createRecords();
	// テーブルデータを作成する
	const tableData = createTableData(createdRecords);
	// テーブルデータをHTMLに変換してinnerHTMLに代入する
	$recordTable.innerHTML = createTableHTML(tableData);
	// 編成部分をクリックしたときに詳細が見られるようにする
	const rotations = $recordTable.getElementsByClassName('rotation-images');
	Array.prototype.forEach.call(rotations, (rotation) => {
		rotation.addEventListener('click', () => {
			const id = rotation.getAttribute('rotation-id');
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
			modal.querySelector('.rotation-stage p').textContent = STAGE_DEFINE[stageId][LANG_KEY];
			const startStr = unixToString(parseInt(rot.start), true);
			const endStr = unixToString(parseInt(rot.end), false);
			const nth = getNthString(parseInt(rot.num));
			const timeStr = `${nth} ${startStr} - ${endStr}`;
			modal.querySelector('h5').textContent = timeStr;
		});
	});
	console.log('テーブルを更新しました。');
}


/** getNthString(num)
 * 数値numを受け取って、たとえばnumが3だったら "[第3回]" あるいは "[3rd]" を返すような関数です。
 * 言語が日本語なら "[第3回]" 、英語なら "[3rd]" を返します。
 * @param num {number} - 第n回のnの部分
 */
function getNthString(num) {
	if (LANG_KEY === 'ja') {
		return `[第${num}回]`;
	}
	switch (num) {
		case 0:
			return '[0th]';
		case 1:
			return '[1st]';
		case 2:
			return '[2nd]';
		case 3:
			return '[3rd]';
		default:
			return `[${num}th]`;
	}
}


/** unixToString(unix, isEnabledYear)
 * UNIX時刻を受け取って、人間が見やすい文字列に変換します。
 * "2020/12/31 23:59" あるいは "12/31/2020 11:59 p.m." のような文字列を返します。
 * どちらの形式になるかは言語が日本語か英語かで切り替わります。
 * @param unix {number} - UNIX時刻
 * @param isEnabledYear {boolean} - 年を含めるかどうか
 */
function unixToString(unix, isEnabledYear) {
	const date = new Date(unix * 1000);
	const Y = date.getFullYear();
	const M = date.getMonth() + 1;
	const D = date.getDate();
	const m = date.getMinutes();
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
			return `${M}/${D}/${Y} ${h}:00 ${ampm}`;
		} else {
			return `${M}/${D} ${h}:00 ${ampm}`;
		}
	}
}


/** createRecords()
 */
function createRecords() {
	const records = {};
	// 編成種別のチェック状況
	const checked = {
		'rotation-normal': document.getElementById('rotation-normal').checked,
		'rotation-green-mystery-one': document.getElementById('rotation-green-mystery-one').checked,
		'rotation-green-mystery-all': document.getElementById('rotation-green-mystery-all').checked,
		'rotation-golden-mystery': document.getElementById('rotation-golden-mystery').checked,
	};
	for (let i = 0; i < RECORDS.length; i++) {
		const rec = RECORDS[i];
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
/** createEggsHTML(rec)
 */
function createEggsHTML(rec) {
	const className = (POWER_EGGS_RECORD_IDS.indexOf(parseInt(rec['record id'])) > -1) ? 'p-eggs' : 'eggs';
	let eggsHTML = `<p class="${className}"><span class="num">${rec.score}</span></p>`;
	return eggsHTML;
}


/** createMembersHTML(rec)
 */
function createMembersHTML(rec) {
	let membersHTML = rec['member 1'];
	if (rec['member 2']) membersHTML += ' ' + rec['member 2'];
	if (rec['member 3']) membersHTML += ' ' + rec['member 3'];
	if (rec['member 4']) membersHTML += ' ' + rec['member 4'];
	membersHTML = `<p class="members">${membersHTML}</p>`;
	return membersHTML;
}


/** createRotationHTML(rec)
 */
function createRotationHTML(rec) {
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


/** createLinksHTML(rec)
 */
function createLinksHTML(rec) {
	let linksHTML = '';
	if (rec.links) {
		const urls = rec.links.split(',');
		urls.forEach((url) => {
			const url2 = url.split('//')[1];
			if (url2) {
				const domain = url2.split('/')[0];
				let type = LINK_TYPES[domain] || 'chain';
				if (url.indexOf('type=video') > -1) {
					type = 'video';
				}
				if (url.indexOf('type=none') < 0) {
					linksHTML += `<a href="${url}" target="_blank"><img src="./assets/img/link-${type}.png"></a>`;
				}
			}
		});
	}
	linksHTML = `<p class="links">${linksHTML}</p>`;
	return linksHTML;
}


/** createTableData(records)
 */
function createTableData(records) {
	const tableData = [['']];
	let visibleStage;
	const radios = document.getElementsByName('visible-stage');
	Array.prototype.forEach.call(radios, (radio) => {
		if (radio.checked) {
			visibleStage = radio.getAttribute('value');
		}
	});
	for (let x = 0; x < STAGE_COUNT; x++) {
		if (visibleStage.indexOf('' + x) < 0) {
			continue;
		}
		const stage = `<img src="./assets/img/stage/${x}.png">`;
		tableData[0][x + 1] = `${stage}<p>${STAGE_DEFINE[x][`${LANG_KEY}`]}</p>`;
	}
	for (let y = 0; y < RECORD_COUNT; y++) {
		if (IGNORE_RECORD_IDS.indexOf(y) > -1) {
			continue;
		}
		tableData[y + 1] = [];
		tableData[y + 1][0] = RECORD_DEFINE[y][LANG_KEY];
		for (let x = 0; x < STAGE_COUNT; x++) {
			if (visibleStage.indexOf('' + x) < 0) {
				continue;
			}
			const rec = records[`${x}-${y}`];
			if (!rec) {
				tableData[y + 1][x + 1] = '';
				continue;
			}
			let html = '';
			html += createEggsHTML(rec);
			html += createMembersHTML(rec);
			html += createRotationHTML(rec);
			html += createLinksHTML(rec);
			if ('ties' in rec) {
				html += '<div class="ties">';
				rec.ties.forEach((tie) => {
					html += createMembersHTML(tie);
					html += createRotationHTML(tie);
					html += createLinksHTML(tie);
				});
				html += '</div>';
			}
			tableData[y + 1][x + 1] = html;
		}
	}
	return tableData;
}
/** createTableHTML(tableData)
 */
function createTableHTML(tableData) {
	let html = '';
	tableData.forEach((tr, y) => {
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
function saveStorage() {
	const saveDataObj = {};
	const inputs = document.getElementsByClassName('for-save');
	Array.prototype.forEach.call(inputs, (input) => {
		const key = input.getAttribute('id');
		if (key) {
			saveDataObj[key] = input.checked;
		}
	});
	const saveDataJSON = JSON.stringify(saveDataObj);
	localStorage.setItem(STORAGE_KEY, saveDataJSON);
}
function loadStorage() {
	var saveDataJSON = localStorage.getItem(STORAGE_KEY);
	if (saveDataJSON !== null) {
		var saveDataObj = JSON.parse(saveDataJSON);
		const inputs = document.getElementsByClassName('for-save');
		Array.prototype.forEach.call(inputs, (input) => {
			input.checked = false;
		});
		Array.prototype.forEach.call(inputs, (input) => {
			const key = input.getAttribute('id');
			if (saveDataObj[key]) {
				input.checked = true;
			}
		});
	}
}
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
/** getCSV(opt)
 */
function getCSV(opt) {
	return new Promise((resolve) => {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', `./assets/csv/${opt.sheet}.csv`, true);
		xhr.responseType = 'text';
		xhr.onreadystatechange = function (event) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var data = xhr.responseText;
					const ranges = opt.range.split(':');
					const startCell = ranges[0];
					const endCell = ranges[1];
					const startX = alphabet2int(startCell.replace(/[0-9]*/g, '')) - 1;
					const startY = parseInt(startCell.replace(/[a-zA-Z]*/g, '')) - 1;
					const endX = alphabet2int(endCell.replace(/[0-9]*/g, '')) - 1;
					const endY = parseInt(endCell.replace(/[a-zA-Z]*/g, '')) - 1;
					const rows = data.split('\n');
					const keys = rows[startY].split(',');
					for (let x = 0; x < keys.length; x++) {
						keys[x] = keys[x].trim();
					}
					const lines = [];
					for (let y = startY + 1; y <= endY; y++) {
						const obj = {};
						let rowstr = '';
						let isQuote = false;
						for (let i = 0; i < rows[y].length; i++) {
							let c = rows[y][i];
							if (c === '"') isQuote = !isQuote;
							if (isQuote) c = '::';
							rowstr += c;
						}
						const row = rowstr.split(',');
						for (let x = startX; x <= endX; x++) {
							obj[keys[x]] = row[x].replace(/::/g, ',');
						}
						lines.push(obj);
					}
					if (opt.callback) opt.callback(lines);
					resolve();
				} else {
					if (opt.error) opt.error();
				}
			}
		};
		xhr.onerror = function (event) {
			if (opt.error) opt.error();
		};
		xhr.send(null);
	});
}