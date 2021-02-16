/** STORAGE_KEY
 * localStorageに保存する際に使用するキー
 */
var STORAGE_KEY = 'salmon-run-records';

/** NAVIGATOR_LANG
 * navigatorの言語
 */
var NAVIGATOR_LANG = navigator.language || navigator.userLanguage || 'ja';

/** LOCATION_QUERIES
 * locationのクエリパラメータ
 */
var LOCATION_QUERIES = getQueries();

/** LANG_KEY
 * locationのクエリパラメータもしくはnavigatorから言語を日本語か英語のどちらかひとつに決定
 */
var LANG_KEY = (LOCATION_QUERIES.lang === 'ja') ? 'ja' : (LOCATION_QUERIES.lang === 'en') ? 'en' : (NAVIGATOR_LANG.indexOf('ja') > -1) ? 'ja' : 'en';

/** STAGE_COUNT
 * ステージの数
 */
var STAGE_COUNT = 5;

/** RECORD_ORDER
 * 表示する記録カテゴリのリスト
 */
var RECORD_ORDER = [
	0, 1, 3, 29, 4, 5, 6, 7, 8, 9, 10,
	11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
	21, 22, 23, 24, 25, 26, 27, 28,
];

/** DEFAULT_SAVEDATA
 * デフォルトのセーブデータ
 */
var DEFAULT_SAVEDATA = {
	'display-item-eggs': true,
	'display-item-links': true,
	'display-item-members': true,
	'display-item-rotation': true,
	'display-item-ties': true,
	'radio-stage-0': false,
	'radio-stage-1': false,
	'radio-stage-2': false,
	'radio-stage-3': false,
	'radio-stage-4': false,
	'radio-stage-all': true,
	'rotation-golden-mystery': false,
	'rotation-green-mystery-all': false,
	'rotation-green-mystery-one': false,
	'rotation-normal': true
};

/** POWER_EGGS_RECORD_IDS
 * 赤イクラ記録の種目IDたち
 * これに該当する種目は、イクラの前に赤イクラアイコンを付ける
 */
var POWER_EGGS_RECORD_IDS = [24, 25, 26, 27, 28];

/** FQDN_ICON_TYPES
 * リンクのドメインごとに表示する画像を決める
 */
var FQDN_ICON_TYPES = {
	'cdn.discordapp.com': 'image',
	'ibb.co': 'image',
	'imgur.com': 'image',
	'pbs.twimg.com': 'image',
	'ton.twitter.com': 'image',
	'reddit.com': 'image',
	'media.discordapp.net': 'image',
	'salmon-stats.yuki.games': 'chain',
	'twitter.com': 'twitter',
	'clips.twitch.tv': 'twitch',
	'twitch.tv': 'twitch',
	'openrec.tv': 'openrec',
	'youtube.com': 'video',
	'youtu.be': 'video',
	'nicovideo.jp': 'niconico',
};

/**
 * 何回もアクセスすることになるであろうDOM要素への参照
 */
var $recordTable;
var $forSave;
var srrManager;

/** DOMContentLoaded
 */
window.addEventListener('DOMContentLoaded', function() {
	console.log('Event: DOMContentLoaded');

	// レコードテーブル要素を取得
	$recordTable = document.getElementById('record-table');
	$forSave = document.getElementsByClassName('for-save');

	// localStorageから設定を読み込む
	loadStorage();

	// 各DOM要素にイベントを設定したり初期値を設定したりする
	initializeDOMElements();
});

/** load
 */
window.addEventListener('load', function() {
	console.log('Event: load');

	// スプレッドシートにアクセス
	srrManager = new window.SRRManager();
	srrManager.init(function() {
		console.log('テーブルを作成しています…');
		updateRecordTable();
		console.log('テーブルを作成しました。');
	});
});


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
	document.getElementById('modal').addEventListener('click', function() {
		document.getElementById('modal').classList.add('hidden');
	});

	// モーダルウィンドウ中の要素をクリックしても上のイベントが呼ばれないようにする
	document.getElementById('modal-rotation').addEventListener('click', function(e) {
		e.stopPropagation();
	});

	// 言語設定が英語なら翻訳対象のDOM要素をすべて翻訳する
	if (LANG_KEY === 'en') {
		var $transElements = document.getElementsByClassName('for-translation');
		Array.prototype.forEach.call($transElements, function($elm) {
			var txt = $elm.getAttribute('en-text');
			$elm.textContent = txt;
		});
	}

	// 値が変更されたときレコードテーブルを更新しなければならないような
	// <input>要素すべてにイベントを仕込む
	var $inputs = document.getElementsByClassName('for-update-table');
	Array.prototype.forEach.call($inputs, function($input) {
		$input.addEventListener('change', function() {
			updateRecordTable();
			console.log('テーブルを更新しました。');
		});
	});

	// 値が変更されたときレコードテーブルのクラスを付け替えなければならないような
	// <input>要素すべてにイベントを仕込む
	var $inputs2 = document.getElementsByClassName('for-update-table-class');
	Array.prototype.forEach.call($inputs2, function($input) {
		var toggleClass = $input.getAttribute('toggle-class');
		var update = function() {
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
	var $saveInputs = $forSave;
	Array.prototype.forEach.call($saveInputs, function($input) {
		$input.addEventListener('change', function() {
			saveStorage();
		});
	});
}


/** updateRecordTable()
 * レコードテーブルを更新します。
 */
function updateRecordTable() {
	// 生レコードデータを整理する
	var orgnizedRecords = getOrgnizedRecords();
	// テーブルHTML配列を作成する
	var tableHTMLArray = createTableHTMLArray(orgnizedRecords);
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
	var $rotations = $recordTable.getElementsByClassName('rotation-images');
	Array.prototype.forEach.call($rotations, function($rotation) {
		$rotation.addEventListener('click', function() {
			var id = $rotation.getAttribute('rotation-id');
			var rot = srrManager.rotations[id - 1];
			var modal = document.getElementById('modal');
			modal.classList.remove('hidden');
			var weapons = modal.getElementsByClassName('weapon-image');
			weapons[0].setAttribute('src', './assets/img/weapon/'+rot.w1+'.png');
			weapons[1].setAttribute('src', './assets/img/weapon/'+rot.w2+'.png');
			weapons[2].setAttribute('src', './assets/img/weapon/'+rot.w3+'.png');
			weapons[3].setAttribute('src', './assets/img/weapon/'+rot.w4+'.png');
			if (rot.rare) {
				weapons[4].setAttribute('style', '');
				weapons[4].setAttribute('src', './assets/img/weapon/'+rot.rare+'.png');
			} else {
				weapons[4].setAttribute('style', 'display: none;');
			}
			var stageId = parseInt(rot.stage) - 1;
			modal.querySelector('.rotation-stage img').setAttribute('src', './assets/img/stage/'+stageId+'.png');
			modal.querySelector('.rotation-stage p').textContent = srrManager.WORDS['stage-' + stageId][LANG_KEY];
			var startStr = unixToString(parseInt(rot.start), true);
			var endStr = unixToString(parseInt(rot.end), false);
			var nth = '['+getNthString(parseInt(rot.num))+']';
			var timeStr = nth+' '+startStr+' - '+endStr;
			modal.querySelector('h5').textContent = timeStr;
		});
	});
}


/** getQueries(url)
 */
function getQueries(url) {
	var urlStr = String(url || window.location);
	var queryStr = urlStr.slice(urlStr.indexOf('?') + 1);
	var queries = {};
	if (!queryStr) {
		return queries;
	}
	queryStr.split('&').forEach(function(queryStr) {
		var queryArr = queryStr.split('=');
		queries[queryArr[0]] = queryArr[1];
	});
	return queries;
}

/** saveStorage()
 * localStorageにセーブします。
 */
function saveStorage() {
	var saveDataObj = {};
	Array.prototype.forEach.call($forSave, function($input) {
		var key = $input.getAttribute('id');
		if (key) {
			saveDataObj[key] = $input.checked;
		}
	});
	var saveDataJSON = JSON.stringify(saveDataObj);
	localStorage.setItem(STORAGE_KEY, saveDataJSON);
}


/** loadStorage()
 * localStorageからロードします。
 */
function loadStorage() {
	// デフォルトのセーブデータ
	var defaultSaveDataObj = Object.assign({}, DEFAULT_SAVEDATA);
	// localStorageから取り出した文字列
	var saveDataJSON = localStorage.getItem(STORAGE_KEY) || '{}';
	// デフォルトのセーブデータにlocalStorageのデータをマージする
	var saveDataObj = Object.assign(defaultSaveDataObj, JSON.parse(saveDataJSON));
	// いったんすべての$forSaveのチェックを外し
	Array.prototype.forEach.call($forSave, function($input) {
		$input.checked = false;
	});
	// チェックを入れる必要があるものは入れ直す
	Array.prototype.forEach.call($forSave, function($input) {
		var key = $input.getAttribute('id');
		if (saveDataObj[key]) {
			$input.checked = true;
		}
	});
}


/** clearStorage()
 * localStorageをクリアします。
 */
function clearStorage() {
	localStorage.removeItem(STORAGE_KEY);
}


/** getOrgnizedRecords()
 * 数千行分ある生レコードをすべてチェックして、各種目の最高記録を整理し、
 * その結果をオブジェクトとして取得します。
 * @return {object} 各種目の最高記録レコードが詰め込まれたオブジェクト
 */
function getOrgnizedRecords() {

	// 編成種別のチェック状況
	var checked = {
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
		return '第'+num+'回';
	}
	switch (num) {
		case 1:
			return '1st';
		case 2:
			return '2nd';
		case 3:
			return '3rd';
		default:
			return num+'th';
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
	var date = new Date(unix * 1000);
	var Y = date.getFullYear();
	var M = date.getMonth() + 1;
	var D = date.getDate();
	var m = ('00' + date.getMinutes()).slice(-2);
	var MS = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	][M - 1];
	var h = date.getHours();
	var ampm;
	if (LANG_KEY === 'ja') {
		if (isEnabledYear) {
			return Y+'年'+M+'月'+D+'日 '+h+':'+m;
		} else {
			return M+'月'+D+'日 '+h+':'+m;
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
			return getNthString(D)+' '+MS+' '+Y+' '+h+':'+m+' '+ampm;
		} else {
			return getNthString(D)+' '+MS+' '+h+':'+m+' '+ampm;
		}
	}
}


/** getScoreHTML(rec)
 */
function getScoreHTML(rec) {
	var className = (POWER_EGGS_RECORD_IDS.indexOf(parseInt(rec['record id'])) > -1) ? 'p-eggs' : 'eggs';
	var eggsHTML = '<p class="'+className+'"><span class="num">'+rec.score+'</span></p>';
	return eggsHTML;
}


/** getMembersHTML(rec)
 */
function getMembersHTML(rec) {
	var membersHTML = rec['member 1'];
	if (rec['member 2']) membersHTML += ' ' + rec['member 2'];
	if (rec['member 3']) membersHTML += ' ' + rec['member 3'];
	if (rec['member 4']) membersHTML += ' ' + rec['member 4'];
	membersHTML = '<p class="members">'+membersHTML+'</p>';
	return membersHTML;
}


/** getRotationHTML(rec)
 */
function getRotationHTML(rec) {
	var rotationHTML = '';
	var rotationId = parseInt(rec['rotation id']);
	if (!isNaN(rotationId)) {
		var rot = srrManager.rotations[rotationId - 1];
		var w1 = '<li><img src="./assets/img/weapon/'+rot.w1+'.png" title=""></li>';
		var w2 = '<li><img src="./assets/img/weapon/'+rot.w2+'.png" title=""></li>';
		var w3 = '<li><img src="./assets/img/weapon/'+rot.w3+'.png" title=""></li>';
		var w4 = '<li><img src="./assets/img/weapon/'+rot.w4+'.png" title=""></li>';
		var w5 = (rot.rare) ? '<li><img src="./assets/img/weapon/'+rot.rare+'.png"></li>' : '';
		rotationHTML = '<ul class="rotation-images" rotation-id="'+rotationId+'">'+w1+w2+w3+w4+w5+'</ul>';
	}
	return rotationHTML;
}


/** getLinksHTML(rec)
 */
function getLinksHTML(rec) {
	if (rec.links) {
		var linksHTML = '';
		// 生レコードのlinks列のデータをカンマで区切って配列にします
		// 基本的にありえないので考慮していないが、URL自体にカンマが含まれているとそこで区切られてしまいバグる
		// ex) https://example,co.jp, https://example,ne.jp のような場合
		var urls = rec.links.split(',');
		urls.forEach(function(item) {
			// スペースなどをトリムする
			var url = item.trim();
			if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1) { 
				// 「//」の後を取得する
				var url2 = url.split('//')[1];
				if (url2) {
					// FQDN部分を取得する
					var fqdn = url2.split('/')[0].replace('www.', '');
					// クエリパラメータを取得する
					var queries = getQueries(url);
					// アイコンタイプを決定する
					var type = queries.type || FQDN_ICON_TYPES[fqdn] || 'chain';
					// プレイヤー
					var title = '';
					if (queries.player) {
						if (type === 'twivideo') {
							if (LANG_KEY === 'ja') {
								title = 'プレイ動画付きツイート - ' + queries.player + '視点';
							} else {
								title = 'Tweet with play video - ' + queries.player + '\'s POV';
							}
						} else {
							if (LANG_KEY === 'ja') {
								title = 'プレイ動画 - ' + queries.player + '視点';
							} else {
								title = 'Play video - ' + queries.player + '\'s POV';
							}
						}
					} else if (type === 'twitter') {
						var arr = url.split('/');
						var step = 0;
						for (var i = 0; i < arr.length; i++) {
							if (step === 1) {
								if (LANG_KEY === 'ja') {
									title = '@' + arr[i] + ' さんのツイート';
								} else {
									title = 'Tweet by @' + arr[i];
								}
								step++;
							} else if (step === 2) {
								step++;
							} else if (step === 3) {
								var timestamp = parseInt(arr[i]);
								for (let i = 0; i < 22; i += 1) {
									timestamp /= 2;
								}
								// UNIX時刻(ミリ秒)
								var milli_unix = Math.floor(timestamp) + 1288834974657;
								// UNIX時刻
								var unix = Math.floor(milli_unix / 1000);
								var str = unixToString(unix, true);
								title += ' (' + str + ')';
								break;
							} else if (arr[i] === 'twitter.com') {
								step++;
							}
						}
					}
					if (type !== 'none') {
						linksHTML += '<a href="'+encodeURI(url)+'" title="'+title+'" target="_blank"><img src="./assets/img/link-'+type+'.png"></a>';
					}
				}
			}
		});
		return '<p class="links">'+linksHTML+'</p>';
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
	var tableHTMLArray = [['']];

	// チェックが入っているステージのラジオボタンを特定する
	var visibleStage;
	var $radios = document.getElementsByName('visible-stage');
	Array.prototype.forEach.call($radios, function($radio) {
		if ($radio.checked) {
			visibleStage = $radio.getAttribute('value');
		}
	});

	// ステージ画像とステージ名の行を作る
	for (var hx = 0; hx < STAGE_COUNT; hx++) {
		// 無視すべきステージはスキップする
		if (visibleStage.indexOf('' + hx) < 0) {
			continue;
		}
		var stage = '<img src="./assets/img/stage/'+hx+'.png">';
		tableHTMLArray[0][hx + 1] = stage+'<p>'+srrManager.WORDS['stage-' + hx][LANG_KEY]+'</p>';
	}

	// 各行（各種目）について
	for (var y = 0; y < RECORD_ORDER.length; y++) {
		var n = RECORD_ORDER[y];
		tableHTMLArray[y + 1] = [];
		// 左端ヘッダーには種目名を入れる
		tableHTMLArray[y + 1][0] = srrManager.WORDS['record-' + n][LANG_KEY];
		// 各ステージについて
		for (var x = 0; x < STAGE_COUNT; x++) {
			// 無視すべきステージはスキップする
			if (visibleStage.indexOf('' + x) < 0) {
				continue;
			}
			var rec = organizedRecords[x+'-'+n];
			if (!rec) {
				tableHTMLArray[y + 1][x + 1] = '';
				continue;
			}
			var html = '';
			html += getScoreHTML(rec);
			html += getMembersHTML(rec);
			html += getRotationHTML(rec);
			html += getLinksHTML(rec);
			if ('ties' in rec) {
				html += '<div class="ties">';
				for (var i = 0; i < rec.ties.length; i++) {
					var tie = rec.ties[i];
					html += getMembersHTML(tie);
					html += getRotationHTML(tie);
					html += getLinksHTML(tie);
				}
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
	var html = '';
	tableHTMLArray.forEach(function(tr, y) {
		if (y === 0) {
			html += '<thead><tr>';
			tr.forEach(function(td, x) {
				html += '<th>'+td+'</th>';
			});
			html += '</tr></thead>';
		} else {
			html += '<tr>';
			tr.forEach(function(td, x) {
				if (x === 0) {
					html += '<th>'+td+'</th>';
				} else {
					html += '<td>'+td+'</td>';
				}
			});
			html += '</tr>';
		}
	});
	return html;
}
