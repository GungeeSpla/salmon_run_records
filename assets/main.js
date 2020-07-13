//'use strict';
google.load('visualization', '1');
const URL_BASE = "http://spreadsheets.google.com/tq";
const STAGE_DEFINE = {"0":{"id":"0","ja-s":"シェケナダム","en-s":"Grounds","ja":"シェケナダム","en":"Spawning Grounds"},"1":{"id":"1","ja-s":"ドンブラコ","en-s":"Bay","ja":"難破船ドン･ブラコ","en":"Marooner's Bay"},"2":{"id":"2","ja-s":"シャケト場","en-s":"Outpost","ja":"海上集落シャケト場","en":"Lost Outpost"},"3":{"id":"3","ja-s":"トキシラズ","en-s":"Yard","ja":"トキシラズいぶし工房","en":"Salmonid Smokeyard"},"4":{"id":"4","ja-s":"ポラリス","en-s":"Ark","ja":"朽ちた箱舟 ポラリス","en":"Ruins of Ark Polaris"},"5":{"id":"5","ja-s":"黄金-シェケナダム","en-s":"Grizzco-Grounds","ja":"黄金-シェケナダム","en":"Grizzco-Spawning Grounds"},"6":{"id":"6","ja-s":"黄金-ドンブラコ","en-s":"Grizzco-Bay","ja":"黄金-難破船ドン･ブラコ","en":"Grizzco-Marooner's Bay"},"7":{"id":"7","ja-s":"黄金-シャケト場","en-s":"Grizzco-Outpost","ja":"黄金-海上集落シャケト場","en":"Grizzco-Lost Outpost"},"8":{"id":"8","ja-s":"黄金-トキシラズ","en-s":"Grizzco-Yard","ja":"黄金-トキシラズいぶし工房","en":"Grizzco-Salmonid Smokeyard"},"9":{"id":"9","ja-s":"黄金-ポラリス","en-s":"Grizzco-Ark","ja":"黄金-朽ちた箱舟 ポラリス","en":"Grizzco-Ruins of Ark Polaris"}};
const RECORD_DEFINE = {"0":{"id":"0","ja-s":"総合金（夜あり）","en-s":"One Shift","ja":"1戦で最高金いくら数","en":"Highest Golden Eggs in one shift"},"1":{"id":"1","ja-s":"総合金（昼のみ）","en-s":"One Shift (No Night)","ja":"1戦で最高金いくら数(夜なし)","en":"Highest Golden Eggs in one shift (All Normal Waves)"},"2":{"id":"2","ja-s":"1WAVE最高金","en-s":"One Wave","ja":"1waveで最高金いくら数","en":"Highest Golden Eggs in one wave"},"3":{"id":"3","ja-s":"個人金","en-s":"Princess in One Shift","ja":"姫サーモンで最高金いくら数","en":"Highest Golden Eggs obtained by a single player in one shift"},"4":{"id":"4","ja-s":"野良3総合金","en-s":"One Freelance Shift","ja":"1戦で野良3総合最高金いくら数","en":"Highest Golden Eggs in one Freelance shift"},"5":{"id":"5","ja-s":"野良3個人金","en-s":"Princess in One Freelance Shift","ja":"1戦で野良3個人最高金いくら数","en":"Highest Golden Eggs obtained by a single player in one Freelance shift"},"6":{"id":"6","ja-s":"野良2総合金","en-s":"One Twinlance Shift","ja":"1戦で野良2総合最高金いくら数","en":"Highest Golden Eggs in one Twinlance shift"},"7":{"id":"7","ja-s":"野良2個人金","en-s":"Princess in One Twinlance Shift","ja":"1戦で野良2個人最高金いくら数","en":"Highest Golden Eggs obtained by a single player in one Twinlance shift"},"8":{"id":"8","ja-s":"通常昼","en-s":"NT Normal","ja":"通常昼の最高金いくら数","en":"Highest Golden Eggs on a single Normal Tide Non-special Wave"},"9":{"id":"9","ja-s":"満潮昼","en-s":"HT Normal","ja":"満潮昼の最高金いくら数","en":"Highest Golden Eggs on a single High Tide Non-special Wave"},"10":{"id":"10","ja-s":"干潮昼","en-s":"LT Normal","ja":"干潮昼の最高金いくら数","en":"Highest Golden Eggs on a single Low Tide Non-special Wave"},"11":{"id":"11","ja-s":"通常ラッシュ","en-s":"NT Rush","ja":"通常ラッシュの最高金いくら数","en":""},"12":{"id":"12","ja-s":"満潮ラッシュ","en-s":"HT Rush","ja":"満潮ラッシュの最高金いくら数","en":""},"13":{"id":"13","ja-s":"通常霧","en-s":"NT Fog","ja":"通常霧の最高金いくら数","en":""},"14":{"id":"14","ja-s":"満潮霧","en-s":"HT Fog","ja":"満潮霧の最高金いくら数","en":""},"15":{"id":"15","ja-s":"干潮霧","en-s":"LT Fog","ja":"干潮霧の最高金いくら数","en":""},"16":{"id":"16","ja-s":"通常間欠泉","en-s":"NT Goldie Seeking","ja":"通常間欠泉の最高金いくら数","en":""},"17":{"id":"17","ja-s":"満潮間欠泉","en-s":"HT Goldie Seeking","ja":"満潮間欠泉の最高金いくら数","en":""},"18":{"id":"18","ja-s":"通常グリル","en-s":"NT Grillers","ja":"通常グリルの最高金いくら数","en":""},"19":{"id":"19","ja-s":"満潮グリル","en-s":"HT Grillers","ja":"満潮グリルの最高金いくら数","en":""},"20":{"id":"20","ja-s":"通常ハコビヤ","en-s":"NT Mothership","ja":"通常ハコビヤの最高金いくら数","en":""},"21":{"id":"21","ja-s":"満潮ハコビヤ","en-s":"HT Mothership","ja":"満潮ハコビヤの最高金いくら数","en":""},"22":{"id":"22","ja-s":"干潮ハコビヤ","en-s":"LT Mothership","ja":"干潮ハコビヤの最高金いくら数","en":""},"23":{"id":"23","ja-s":"干潮ドスコイ","en-s":"Cohock Charge","ja":"干潮ドスコイの最高金いくら数","en":""},"24":{"id":"24","ja-s":"総合赤","en-s":"(Power) One Shift","ja":"1戦で最高赤いくら数","en":"Most Power Eggs obtained in one shift"},"25":{"id":"25","ja-s":"個人赤","en-s":"(Power) Princess in One Shift","ja":"1戦で個人最高赤いくら数","en":"Most Power Eggs obtained by a single player in one shift"},"26":{"id":"26","ja-s":"野良3総合赤","en-s":"(Power) One Freelance Shift","ja":"1戦で野良3総合最高赤いくら数","en":"Most Power Eggs obtained in one Freelance shift"},"27":{"id":"27","ja-s":"野良3個人赤","en-s":"(Power) Princess in One Freelance Shift","ja":"1戦で野良3個人最高赤いくら数","en":"Most Power Eggs obtained by a single player in one Freelance shift"},"28":{"id":"28","ja-s":"野良2総合赤","en-s":"(Power) One Twinlance Shift","ja":"1戦で野良2総合最高赤いくら数","en":"Most Power Eggs obtained in one Twinlance shift"},"29":{"id":"29","ja-s":"昼","en-s":"Normal","ja":"1waveで最高金いくら数(夜なし)","en":"Highest Golden Eggs on a single non-special wave"},"30":{"id":"30","ja-s":"ラッシュ","en-s":"Rush","ja":"ヒカリバエの最高金いくら数","en":"Highest Golden Eggs in Rush"},"31":{"id":"31","ja-s":"霧","en-s":"Fog","ja":"霧の最高金いくら数","en":"Highest Golden Eggs in Fog"},"32":{"id":"32","ja-s":"間欠泉","en-s":"Goldie Seeking","ja":"間欠泉の最高金いくら数","en":"Highest Golden Eggs in Goldie Seeking"},"33":{"id":"33","ja-s":"グリル","en-s":"Grillers","ja":"グリルの最高金いくら数","en":"Highest Golden Eggs in Grillers"},"34":{"id":"34","ja-s":"ハコビヤ","en-s":"Mothership","ja":"ハコビヤの最高金いくら数","en":"Highest Golden Eggs in Mothership"},"35":{"id":"35","ja-s":"ドスコイ","en-s":"Cohock Charge","ja":"ドスコイの最高金いくら数","en":"Highest Golden Eggs in Cohock Charge"}};
const WEAPON_DEFINE = {"0":{"id":"0","ja":"ボールドマーカー"},"10":{"id":"10","ja":"わかばシューター"},"20":{"id":"20","ja":"シャープマーカー"},"30":{"id":"30","ja":"プロモデラーMG"},"40":{"id":"40","ja":"スプラシューター"},"50":{"id":"50","ja":".52ガロン"},"60":{"id":"60","ja":"N-ZAP85"},"70":{"id":"70","ja":"プライムシューター"},"80":{"id":"80","ja":".96ガロン"},"90":{"id":"90","ja":"ジェットスイーパー"},"200":{"id":"200","ja":"ノヴァブラスター"},"210":{"id":"210","ja":"ホットブラスター"},"220":{"id":"220","ja":"ロングブラスター"},"230":{"id":"230","ja":"クラッシュブラスター"},"240":{"id":"240","ja":"ラピッドブラスター"},"250":{"id":"250","ja":"Rブラスターエリート"},"300":{"id":"300","ja":"L3リールガン"},"310":{"id":"310","ja":"H3リールガン"},"400":{"id":"400","ja":"ボトルガイザー"},"1000":{"id":"1000","ja":"カーボンローラー"},"1010":{"id":"1010","ja":"スプラローラー"},"1020":{"id":"1020","ja":"ダイナモローラー"},"1030":{"id":"1030","ja":"ヴァリアブルローラー"},"1100":{"id":"1100","ja":"パブロ"},"1110":{"id":"1110","ja":"ホクサイ"},"2000":{"id":"2000","ja":"スクイックリンα"},"2010":{"id":"2010","ja":"スプラチャージャー"},"2020":{"id":"2020","ja":"スプラスコープ"},"2030":{"id":"2030","ja":"リッター4K"},"2040":{"id":"2040","ja":"4Kスコープ"},"2050":{"id":"2050","ja":"14式竹筒銃・甲"},"2060":{"id":"2060","ja":"ソイチューバー"},"3000":{"id":"3000","ja":"バケットスロッシャー"},"3010":{"id":"3010","ja":"ヒッセン"},"3020":{"id":"3020","ja":"スクリュースロッシャー"},"3030":{"id":"3030","ja":"オーバーフロッシャー"},"3040":{"id":"3040","ja":"エクスプロッシャー"},"4000":{"id":"4000","ja":"スプラスピナー"},"4010":{"id":"4010","ja":"バレルスピナー"},"4020":{"id":"4020","ja":"ハイドラント"},"4030":{"id":"4030","ja":"クーゲルシュライバー"},"4040":{"id":"4040","ja":"ノーチラス47"},"5000":{"id":"5000","ja":"スパッタリー"},"5010":{"id":"5010","ja":"スプラマニューバー"},"5020":{"id":"5020","ja":"ケルビン525"},"5030":{"id":"5030","ja":"デュアルスイーパー"},"5040":{"id":"5040","ja":"クアッドホッパーブラック"},"6000":{"id":"6000","ja":"パラシェルター"},"6010":{"id":"6010","ja":"キャンピングシェルター"},"6020":{"id":"6020","ja":"スパイガジェット"},"7000":{"id":"7000","ja":"クマサン印のブラスター"},"7010":{"id":"7010","ja":"クマサン印のシェルター"},"7020":{"id":"7020","ja":"クマサン印のチャージャー"},"7030":{"id":"7030","ja":"クマサン印のスロッシャー"},"7040":{"id":"7040","ja":"すべてのクマサン印のブキ"},"8000":{"id":"8000","ja":"緑？ (クマサン印のブラスター)"},"8010":{"id":"8010","ja":"緑？ (クマサン印のシェルター)"},"8020":{"id":"8020","ja":"緑？ (クマサン印のチャージャー)"},"8030":{"id":"8030","ja":"緑？ (クマサン印のスロッシャー)"},"-2":{"id":"-2","ja":"金？"},"-1":{"id":"-1","ja":"緑？"}};
const STAGE_COUNT = 5;
const STORAGE_KEY = 'salmon-run-records';
const IGNORE_RECORD_IDS = [2];
const POWER_EGGS_RECORD_IDS = [24, 25, 26, 27, 28];
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
const LANGS = {
	'log1': {
		'jp': '',
	},
	'log2': {
		'jp': '',
	},
	'log3': {
		'jp': '',
	},
	'log4': {
		'jp': '',
	},
	'log5': {
		'jp': '',
	},
	'log6': {
		'jp': '',
	},
};
let RECORDS;
let ROTATIONS;
let createdRecords;
const createdRecordsCache = {};
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
/** getLang(key)
 */
function getLang(key) {
	return LANGS[key][LANG_KEY];
}
/** getSheet(param)
 */
function getSheet(param) {
	return new Promise((resolve) => {
		const url = encodeURI(`${URL_BASE}?key=${param.key}&sheet=${param.sheet}&range=${param.range}`);
		const query = new google.visualization.Query(url);
		query.setRefreshable(false);
		query.send(function(response){
			const data = response.getDataTable();
			const lines = [];
			for (let y = 0; y < data.getNumberOfRows(); y++) {
				if (param.type === 'obj') {
					const obj = {};
					for (let x = 0; x < data.getNumberOfColumns(); x++) {
						const key = data.getColumnLabel(x);
						const value = data.getFormattedValue(y, x); 
						obj[key] = value;
					}
					lines.push(obj);
				} else {
					const arr = [];
					for (let x = 0; x < data.getNumberOfColumns(); x++) {
						const value = data.getFormattedValue(y, x); 
						arr.push(value);
					}
					lines.push(arr);
				}
			}
			param.callback(lines);
			resolve();
		});
	});
}
/** init()
 */
async function init() {
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
	const table = document.getElementById('record-table');
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
				table.classList.add(toggleClass);
			} else {
				table.classList.remove(toggleClass);
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
	//return;
	console.log('シートにアクセスしています…');
	/*
	await getSheet({
		key: '1DlpX4oVgGSV8aIKTaI4mRAZb5hIOL_2S5Wt0Ql5B5zU',
		sheet: '言語',
		range: 'B10:F20',
		type: 'obj',
		callback: (lines) => {
			lines.forEach((line) => {
				STAGE_DEFINE[line.id] = line;
			});
			console.log('定義を取得しました(1/3)<br>');
			console.log(JSON.stringify(STAGE_DEFINE));
		},
	});
	await getSheet({
		key: '1DlpX4oVgGSV8aIKTaI4mRAZb5hIOL_2S5Wt0Ql5B5zU',
		sheet: '言語',
		range: 'B23:F59',
		type: 'obj',
		callback: (lines) => {
			lines.forEach((line) => {
				RECORD_DEFINE[line.id] = line;
			});
			console.log('定義を取得しました(2/3)<br>');
			console.log(JSON.stringify(RECORD_DEFINE));
		},
	});
	await getSheet({
		key: '1DlpX4oVgGSV8aIKTaI4mRAZb5hIOL_2S5Wt0Ql5B5zU',
		sheet: '言語',
		range: 'B69:C130',
		type: 'obj',
		callback: (lines) => {
			lines.forEach((line) => {
				WEAPON_DEFINE[line.id] = line;
			});
			console.log('定義を取得しました(3/3)<br>');
			console.log(JSON.stringify(WEAPON_DEFINE));
		},
	});
	*/
	await getSheet({
		key: '1DlpX4oVgGSV8aIKTaI4mRAZb5hIOL_2S5Wt0Ql5B5zU',
		sheet: '【編集用】レコード',
		range: `A1:P${RECORD_NUM_MAX}`,
		type: 'obj',
		callback: (lines) => {
			RECORDS = lines;
			console.log('レコードを取得しました。');
		},
	});
	await getSheet({
		key: '1DlpX4oVgGSV8aIKTaI4mRAZb5hIOL_2S5Wt0Ql5B5zU',
		sheet: '【編集用】編成履歴',
		range: `A2:J${ROTATION_NUM_MAX}`,
		type: 'obj',
		callback: (lines) => {
			ROTATIONS = lines;
			console.log('編成履歴を取得しました。');
		},
	});
	console.log('テーブルを作成しています…');
	updateRecordTable(true);
	return;
}
/** updateRecordTable()
 */
function updateRecordTable(bool) {
	if (bool) {
		createdRecords = createRecords();
	}
	const tableData = createTableData(createdRecords);
	const table = document.getElementById('record-table');
	table.innerHTML = createTableHTML(tableData);
	const rotations = table.getElementsByClassName('rotation-images');
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
		/*
		tableData[0][x + 1] = `<p class="stage-${x}">${STAGE_DEFINE[x]['jp-s']}</p>`;
		*/
	}
	for (let y = 0; y < RECORD_COUNT; y++) {
		if (IGNORE_RECORD_IDS.indexOf(y) > -1) {
			continue;
		}
		tableData[y + 1] = [];
		tableData[y + 1][0] = RECORD_DEFINE[y][`${LANG_KEY}-s`];
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
/** createEggsHTML(rec)
 */
function createEggsHTML(rec) {
	const className = (POWER_EGGS_RECORD_IDS.indexOf(parseInt(rec['record-id'])) > -1) ? 'p-eggs' : 'eggs';
	let eggsHTML = `<p class="${className}"><span class="num">${rec.eggs}</span></p>`;
	return eggsHTML;
}
/** createMembersHTML(rec)
 */
function createMembersHTML(rec) {
	let membersHTML = rec['member-1'];
	if (rec['member-2']) membersHTML += ' ' + rec['member-2'];
	if (rec['member-3']) membersHTML += ' ' + rec['member-3'];
	if (rec['member-4']) membersHTML += ' ' + rec['member-4'];
	membersHTML = `<p class="members">${membersHTML}</p>`;
	return membersHTML;
}
/** createRotationHTML(rec)
 */
function createRotationHTML(rec) {
	let rotationHTML = '';
	const rotationId = parseInt(rec['rotation-id']);
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
	if (rec.url) {
		const urls = rec.url.split(',');
		urls.forEach((url) => {
			const url2 = url.split('//')[1];
			if (url2) {
				const domain = url2.split('/')[0];
				let type = LINK_TYPES[domain] || 'chain';
				if (url.indexOf('?type=video') > -1) {
					type = 'video';
				}
				linksHTML += `<a href="${url}" target="_blank"><img src="./assets/img/link-${type}.png"></a>`;
			}
		});
	}
	linksHTML = `<p class="links">${linksHTML}</p>`;
	return linksHTML;
}
/** createRecords()
 */
function createRecords() {
	const records = {};
	const checked = {
		'rotation-normal': document.getElementById('rotation-normal').checked,
		'rotation-green-mystery-one': document.getElementById('rotation-green-mystery-one').checked,
		'rotation-green-mystery-all': document.getElementById('rotation-green-mystery-all').checked,
		'rotation-golden-mystery': document.getElementById('rotation-golden-mystery').checked,
	};
	let cacheKey = '';
	['normal', 'green-mystery-one', 'green-mystery-all', 'golden-mystery'].forEach((key) => {
		cacheKey += (checked[`rotation-${key}`]) ? '1' : '0';
	});
	/*
	if (cacheKey in createdRecordsCache) {
		console.log('現在選択中の編成の組み合わせはレコードを生成済みです。');
		return createdRecordsCache[cacheKey];
	} else {
		console.log('選択した編成の組み合わせでレコードを生成しています…');
	}
	*/
	for (let i = 0; i < RECORDS.length; i++) {
		const rec = RECORDS[i];
		if ('ties' in rec) {
			delete rec.ties;
		}
		if (isNaN(parseInt(rec['stage-id'])) || isNaN(parseInt(rec['record-id'])) || isNaN(parseInt(rec['eggs']))) {
			break;
		}
		const rotationId = parseInt(rec['rotation-id']);
		const rotationKind = parseInt((!isNaN(rotationId)) ? ROTATIONS[rotationId - 1].kind : ROTATION_KIND_UNKNOWN);
		if (!checked['rotation-golden-mystery'] && rotationKind === ROTATION_KIND_GOLDEN_MYSTERY) {
			continue;
		}
		if (!checked['rotation-green-mystery-one'] && rotationKind === ROTATION_KIND_GREEN_MYSTERY_ONE) {
			continue;
		}
		if (!checked['rotation-green-mystery-all'] && rotationKind === ROTATION_KIND_GREEN_MYSTERY_ALL) {
			continue;
		}
		if (!checked['rotation-normal'] && (rotationKind === ROTATION_KIND_NORMAL || rotationKind === ROTATION_KIND_UNKNOWN)) {
			continue;
		}
		const stageId = parseInt(rec['stage-id']) % STAGE_COUNT;
		const recordId = rec['record-id'];
		const key = `${stageId}-${recordId}`;
		if (key in records) {
			const newEggs = parseInt(rec.eggs);
			const oldEggs = parseInt(records[key].eggs);
			if (newEggs > oldEggs) {
				records[key] = rec;
			} else if (newEggs === oldEggs) {
				if ('ties' in records[key]) {
					records[key].ties.push(rec);
				} else {
					records[key].ties = [rec];
				}
			}
		} else {
			records[key] = rec;
		}
	}
	createdRecordsCache[cacheKey] = records;
	return records;
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