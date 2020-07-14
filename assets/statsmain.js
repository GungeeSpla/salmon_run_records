//'use strict';
google.load('visualization', '1');
const URL_BASE = 'http://spreadsheets.google.com/tq';
const SHEET_KEY = '17NzDT1-M-p5fC9jKrTTQrufF_HqrYZGLya-sHHOO2bE';
const IGNORE_ROTATION_IDS = [488];
const STAGE_NAMES = [
	'シェケナダム',
	'難破船ドン・ブラコ',
	'海上集落シャケト場',
	'トキシラズいぶし工房',
	'朽ちた箱舟 ポラリス',
];
const WEAPON_TYPE_NAMES = [
	'通常編成',
	'一緑ランダム編成',
	'全緑ランダム編成',
	'金ランダム編成',
];
const RECORD_KEYS = [
	'総合',
	'干潮昼',
	'干潮ドスコイ',
	'干潮霧',
	'',
	'',
	'干潮ハコビヤ',
	'',
	'通常昼',
	'',
	'通常霧',
	'通常間欠泉',
	'通常グリル',
	'通常ハコビヤ',
	'通常ラッシュ',
	'満潮昼',
	'',
	'満潮霧',
	'満潮間欠泉',
	'満潮グリル',
	'満潮ハコビヤ',
	'満潮ラッシュ',
];
const RECORD_KEYS_2 = [
	'総合',
	'通常昼',
	'満潮昼',
	'干潮昼',
	'通常ラッシュ',
	'満潮ラッシュ',
	'通常霧',
	'満潮霧',
	'干潮霧',
	'通常間欠泉',
	'満潮間欠泉',
	'通常グリル',
	'満潮グリル',
	'通常ハコビヤ',
	'満潮ハコビヤ',
	'干潮ハコビヤ',
	'干潮ドスコイ',
];
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
let RECORDS;
const statsRecords = {};
async function init() {
	await getSheet({
		key: SHEET_KEY,
		sheet: 'Salmon Stats Records',
		range: 'A1:BY184',
		type: 'obj',
		callback: (lines) => {
			RECORDS = lines;
		},
	});
	RECORDS.forEach((record) => {
		const id = parseInt(record['ID']);
		if (IGNORE_ROTATION_IDS.indexOf(id) > -1) {
			return;
		}
		const stage = record['ステージ'];
		const weaponType = record['編成種別'];
		const stageWeaponType = `${stage} ${weaponType}`;
		if (!(stageWeaponType in statsRecords)) {
			statsRecords[stageWeaponType] = {};
		}
		RECORD_KEYS.forEach((key1) => {
			if (!key1) {
				return;
			}
			['(金)', '(赤)'].forEach((key2) => {
				const key = key1 + key2;
				const num = record[key];
				if (num && num > -1) {
					const url = record[`${key}URL`];
					if (!(key in statsRecords[stageWeaponType])) {
						statsRecords[stageWeaponType][key] = {
							num: -1,
							url: '',
						};
					}
					if (num > statsRecords[stageWeaponType][key].num) {
						statsRecords[stageWeaponType][key].num = num;
						statsRecords[stageWeaponType][key].url = url;
					}
				}
			});
		});
	});
	document.querySelector('.loading').remove();
	const content = document.querySelector('.content');
	/*
	STAGE_NAMES.forEach((stageName) => {
		const h3 = document.createElement('h3');
		h3.textContent = stageName;
		content.appendChild(h3);
		WEAPON_TYPE_NAMES.forEach((weaponTypeName) => {
			const statsRecordsKey = `${stageName} ${weaponTypeName}`;
			if (!(statsRecordsKey in statsRecords)) {
				return;
			}
			const record = statsRecords[statsRecordsKey];
			const div = document.createElement('div');
			let html = '';
			html += `<h4>${stageName} x ${weaponTypeName}</h4>`;
			html += '<p>3-Wave Total Record</p>';
			html += `<p><a href="${record['総合(金)'].url}"><span class="golden-egg">${record['総合(金)'].num}</span></a> / <a href="${record['総合(赤)'].url}"><span class="power-egg">${record['総合(赤)'].num}</span></a></p>`;
			const tdNum = 7;
			html += '<table class="stats"><thead><tr><th>-</th><th>ドスコイ大量発生</th><th>霧</th><th>キンシャケ探し</th><th>グリル発進</th><th>ハコビヤ襲来</th><th>ラッシュ</th></tr></thead><tbody>';
			RECORD_KEYS.forEach((key, i) => {
				if (i === 0) {
					return;
				}
				if ((i - 1) % tdNum === 0) {
					html += '<tr>';
				}
				const key1 = key + '(金)';
				const key2 = key + '(赤)';
				if (key && record[key1].num && record[key2].num > -1) {
					html += `<td><a href="${record[key1].url}"><span class="golden-egg">${record[key1].num}</span></a> / <a href="${record[key2].url}"><span class="power-egg">${record[key2].num}</span></a></td>`;
				} else {
					html += '<td></td>';
				}
				if ((i - 1) % tdNum === tdNum - 1) {
					html += '</tr>';
				}
			});
			html += '</tbody></table>';
			div.innerHTML = html;
			content.appendChild(div);
		});
	});
	*/
	WEAPON_TYPE_NAMES.forEach((weaponTypeName) => {
		const h3 = document.createElement('h3');
		h3.textContent = `${weaponTypeName}`;
		content.appendChild(h3);
		const div = document.createElement('div');
		let html = '<table class="stats-b"><thead><tr><th></th><th>シェケナダム</th><th>難破船ドン・ブラコ</th><th>海上集落シャケト場</th><th>トキシラズいぶし工房</th><th>朽ちた箱舟 ポラリス</th></tr></thead><tbody>';
		RECORD_KEYS_2.forEach((key) => {
			STAGE_NAMES.forEach((stageName, i) => {
				if (i === 0) {
					html += `<tr><th>${key}</th>`;
				}
				const statsRecordsKey = `${stageName} ${weaponTypeName}`;
				if (statsRecordsKey in statsRecords) {
					const record = statsRecords[statsRecordsKey];
					const key1 = key + '(金)';
					const key2 = key + '(赤)';
					if (key1 in record) {
						const rec1 = record[key1];
						const rec2 = record[key2];
						html += `<td><a href="${rec1.url}"><span class="golden-egg">${rec1.num}</span></a> / <a href="${rec2.url}"><span class="power-egg">${rec2.num}</span></a></td>`;
					} else {
						html += `<td></td>`;
					}
				} else {
					html += `<td></td>`;
				}
				if (i === STAGE_NAMES.length - 1) {
					html += '</tr>';
				}
			});
		});
		div.innerHTML = html;
		content.appendChild(div);
	});
	return;
}