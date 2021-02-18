// ========================
// SRRManager.js
// ========================


(function(google) {

	// Google Visualization APIの読み込み
	google.load('visualization', '1');

	// スプレッドシートにアクセスするためのベースURL
	var URL_BASE = 'https://docs.google.com/spreadsheets/d';

	// スプレッドシートのID
	var SHEET_KEY = '1v-OCTcqyj_mEgxityyfAWCfT2_2IueRrtsGItYPZCMU';

	// 「その種目とセットで更新確認をすべき種目」たち
	// たとえば「野良3総合赤の記録が、総合赤の記録をも塗り替えていやしないか？」とチェックをするためのもの
	var UPDATE_TOGETHER = {
		'26': 24,
		'27': 25,
		'28': 24,
	};

	// 通常編成、一緑編成、全緑編成、黄金編成、編成不明のIDたち
	var ROTATION_KIND_NORMAL = 0;
	var ROTATION_KIND_GREEN_MYSTERY_ONE = 1;
	var ROTATION_KIND_GREEN_MYSTERY_ALL = 2;
	var ROTATION_KIND_GOLDEN_MYSTERY = 3;
	var ROTATION_KIND_UNKNOWN = 4;

	// CSVファイルを読み込むべき？ スプレッドシートに不具合がある場合trueにする
	var SHOULD_USE_CSV = false;

	// CSVファイルのバージョン キャッシュ対策
	var CSV_VERSION = 1;

	// 単語定義
	var WORDS = {
		'stage-0': {
			'id': '0',
			'ja': 'シェケナダム',
			'en': 'Spawning Grounds'
		},
		'stage-1': {
			'id': '1',
			'ja': '難破船ドン･ブラコ',
			'en': 'Marooner\'s Bay'
		},
		'stage-2': {
			'id': '2',
			'ja': '海上集落シャケト場',
			'en': 'Lost Outpost'
		},
		'stage-3': {
			'id': '3',
			'ja': 'トキシラズいぶし工房',
			'en': 'Salmonid Smokeyard'
		},
		'stage-4': {
			'id': '4',
			'ja': '朽ちた箱舟 ポラリス',
			'en': 'Ruins of Ark Polaris'
		},
		'record-0': {
			'ja': '総合金',
			'en': 'Total Golden Eggs'
		},
		'record-1': {
			'ja': '総合金（昼のみ）',
			'en': 'Total Golden Eggs (No Night)'
		},
		'record-2': {
			'ja': '1WAVE最高金',
			'en': '1-Wave Golden Eggs'
		},
		'record-3': {
			'ja': '個人金',
			'en': 'Single Player Golden Eggs'
		},
		'record-4': {
			'ja': '野良3総合金',
			'en': 'Total Golden Eggs in Freelance'
		},
		'record-5': {
			'ja': '野良3個人金',
			'en': 'Single Player Golden Eggs in Freelance'
		},
		'record-6': {
			'ja': '野良2総合金',
			'en': 'Total Golden Eggs in Twinlance'
		},
		'record-7': {
			'ja': '野良2個人金',
			'en': 'Single Player Golden Eggs in Twinlance'
		},
		'record-8': {
			'ja': '通常昼',
			'en': 'NT Normal'
		},
		'record-9': {
			'id': '9',
			'ja': '満潮昼',
			'en': 'HT Normal'
		},
		'record-10': {
			'ja': '干潮昼',
			'en': 'LT Normal'
		},
		'record-11': {
			'ja': '通常ラッシュ',
			'en': 'NT Rush'
		},
		'record-12': {
			'ja': '満潮ラッシュ',
			'en': 'HT Rush'
		},
		'record-13': {
			'ja': '通常霧',
			'en': 'NT Fog'
		},
		'record-14': {
			'ja': '満潮霧',
			'en': 'HT Fog'
		},
		'record-15': {
			'ja': '干潮霧',
			'en': 'LT Fog'
		},
		'record-16': {
			'ja': '通常間欠泉',
			'en': 'NT Goldie Seeking'
		},
		'record-17': {
			'ja': '満潮間欠泉',
			'en': 'HT Goldie Seeking'
		},
		'record-18': {
			'ja': '通常グリル',
			'en': 'NT Grillers'
		},
		'record-19': {
			'ja': '満潮グリル',
			'en': 'HT Grillers'
		},
		'record-20': {
			'ja': '通常ハコビヤ',
			'en': 'NT Mothership'
		},
		'record-21': {
			'id': '21',
			'ja': '満潮ハコビヤ',
			'en': 'HT Mothership'
		},
		'record-22': {
			'ja': '干潮ハコビヤ',
			'en': 'LT Mothership'
		},
		'record-23': {
			'ja': '干潮ドスコイ',
			'en': 'Cohock Charge'
		},
		'record-24': {
			'ja': '総合赤',
			'en': 'Total Power Eggs'
		},
		'record-25': {
			'ja': '個人赤',
			'en': 'Single Player Power Eggs'
		},
		'record-26': {
			'ja': '野良3総合赤',
			'en': 'Total Power Eggs in Freelance'
		},
		'record-27': {
			'ja': '野良3個人赤',
			'en': 'Single Player Power Eggs in Freelance'
		},
		'record-28': {
			'ja': '野良2総合赤',
			'en': 'Total Power Eggs in Twinlance'
		},
		'record-29': {
			'ja': '個人金（昼のみ）',
			'en': 'Single Player Golden Eggs (No Night)'
		},
		'record-30': {
			'ja': '総合金（夜0～2）',
			'en': 'Total Golden Eggs (~2 Night)'
		},
		'record-31': {
			'ja': '総合金（夜0～1）',
			'en': 'Total Golden Eggs (~1 Night)'
		},
		'record-32': {
			'ja': '総合金（夜0～2）',
			'en': 'Total Golden Eggs (~2 Night)'
		},
		'record-33': {
			'ja': '総合金（夜0～1）',
			'en': 'Total Golden Eggs (~1 Night)'
		},
		'record-34': {
			'ja': '総合赤 (昼のみ)',
			'en': 'Total Power Eggs (No Night)'
		},
		'record-35': {
			'ja': '個人赤 (昼のみ)',
			'en': 'Single Player Power Eggs (No Night)'
		},
		'weapon-0': {
			'ja': 'ボールドマーカー',
			'en': 'Sploosh-o-matic'
		},
		'weapon-10': {
			'ja': 'わかばシューター',
			'en': 'Splattershot Jr.'
		},
		'weapon-20': {
			'id': '20',
			'ja': 'シャープマーカー',
			'en': 'Splash-o-matic'
		},
		'weapon-30': {
			'ja': 'プロモデラーMG',
			'en': 'Aerospray'
		},
		'weapon-40': {
			'ja': 'スプラシューター',
			'en': 'Splattershot'
		},
		'weapon-50': {
			'ja': '.52ガロン',
			'en': '.52 Gal'
		},
		'weapon-60': {
			'ja': 'N-ZAP85',
			'en': 'N-ZAP \'85'
		},
		'weapon-70': {
			'ja': 'プライムシューター',
			'en': 'Splattershot Pro'
		},
		'weapon-80': {
			'ja': '.96ガロン',
			'en': '.96 Gal'
		},
		'weapon-90': {
			'ja': 'ジェットスイーパー',
			'en': 'Jet Squelcher'
		},
		'weapon-200': {
			'ja': 'ノヴァブラスター',
			'en': 'Luna Blaster'
		},
		'weapon-210': {
			'ja': 'ホットブラスター',
			'en': 'Blaster'
		},
		'weapon-220': {
			'ja': 'ロングブラスター',
			'en': 'Range Blaster'
		},
		'weapon-230': {
			'ja': 'クラッシュブラスター',
			'en': 'Clash Blaster'
		},
		'weapon-240': {
			'ja': 'ラピッドブラスター',
			'en': 'Rapid Blaster'
		},
		'weapon-250': {
			'ja': 'Rブラスターエリート',
			'en': 'Rapid Blaster Pro'
		},
		'weapon-300': {
			'id': '300',
			'ja': 'L3リールガン',
			'en': 'L-3 Nozzlenose'
		},
		'weapon-310': {
			'ja': 'H3リールガン',
			'en': 'H-3 Nozzlenose'
		},
		'weapon-400': {
			'ja': 'ボトルガイザー',
			'en': 'Squeezer'
		},
		'weapon-1000': {
			'id': '1000',
			'ja': 'カーボンローラー',
			'en': 'Carbon Roller'
		},
		'weapon-1010': {
			'ja': 'スプラローラー',
			'en': 'Splat Roller'
		},
		'weapon-1020': {
			'ja': 'ダイナモローラー',
			'en': 'Dynamo Roller'
		},
		'weapon-1030': {
			'ja': 'ヴァリアブルローラー',
			'en': 'Flingza Roller'
		},
		'weapon-1100': {
			'ja': 'パブロ',
			'en': 'Inkbrush'
		},
		'weapon-1110': {
			'ja': 'ホクサイ',
			'en': 'Octobrush'
		},
		'weapon-2000': {
			'ja': 'スクイックリンα',
			'en': 'Squiffer'
		},
		'weapon-2010': {
			'ja': 'スプラチャージャー',
			'en': 'Splat Charger'
		},
		'weapon-2020': {
			'ja': 'スプラスコープ',
			'en': 'Splatterscope'
		},
		'weapon-2030': {
			'ja': 'リッター4K',
			'en': 'E-liter 4K'
		},
		'weapon-2040': {
			'ja': '4Kスコープ',
			'en': 'E-liter 4K Scope'
		},
		'weapon-2050': {
			'ja': '14式竹筒銃・甲',
			'en': 'Bamboozler 14'
		},
		'weapon-2060': {
			'ja': 'ソイチューバー',
			'en': 'Goo Tuber'
		},
		'weapon-3000': {
			'ja': 'バケットスロッシャー',
			'en': 'Slosher'
		},
		'weapon-3010': {
			'ja': 'ヒッセン',
			'en': 'Tri-Slosher'
		},
		'weapon-3020': {
			'ja': 'スクリュースロッシャー',
			'en': 'Sloshing Machine'
		},
		'weapon-3030': {
			'ja': 'オーバーフロッシャー',
			'en': 'Bloblobber'
		},
		'weapon-3040': {
			'ja': 'エクスプロッシャー',
			'en': 'Explosher'
		},
		'weapon-4000': {
			'ja': 'スプラスピナー',
			'en': 'Mini Splatling'
		},
		'weapon-4010': {
			'ja': 'バレルスピナー',
			'en': 'Heavy Splatling'
		},
		'weapon-4020': {
			'ja': 'ハイドラント',
			'en': 'Hydra Splatling'
		},
		'weapon-4030': {
			'ja': 'クーゲルシュライバー',
			'en': 'Ballpoint Splatling'
		},
		'weapon-4040': {
			'ja': 'ノーチラス47',
			'en': 'Nautilus 47'
		},
		'weapon-5000': {
			'ja': 'スパッタリー',
			'en': 'Dapple Dualies'
		},
		'weapon-5010': {
			'ja': 'スプラマニューバー',
			'en': 'Splat Dualies'
		},
		'weapon-5020': {
			'ja': 'ケルビン525',
			'en': 'Glooga Dualies'
		},
		'weapon-5030': {
			'id': '5030',
			'ja': 'デュアルスイーパー',
			'en': 'Dualie Squelchers'
		},
		'weapon-5040': {
			'ja': 'クアッドホッパーブラック',
			'en': 'Tetra Dualies'
		},
		'weapon-6000': {
			'ja': 'パラシェルター',
			'en': 'Splat Brella'
		},
		'weapon-6010': {
			'ja': 'キャンピングシェルター',
			'en': 'Tenta Brella'
		},
		'weapon-6020': {
			'ja': 'スパイガジェット',
			'en': 'Undercover Brella'
		},
		'weapon-7000': {
			'ja': 'クマサン印のブラスター',
			'en': 'Grizzco Blaster'
		},
		'weapon-7010': {
			'ja': 'クマサン印のシェルター',
			'en': 'Grizzco Brella'
		},
		'weapon-7020': {
			'ja': 'クマサン印のチャージャー',
			'en': 'Grizzco Charger'
		},
		'weapon-7030': {
			'ja': 'クマサン印のスロッシャー',
			'en': 'Grizzco Slosher'
		},
		'weapon-7040': {
			'id': '7040',
			'ja': 'すべてのクマサン印のブキ',
			'en': 'All Grizzco Weapons'
		},
		'weapon-8000': {
			'ja': '緑？ (クマサン印のブラスター)',
			'en': 'Green-? (Grizzco Blaster)'
		},
		'weapon-8010': {
			'ja': '緑？ (クマサン印のシェルター)',
			'en': 'Green-? (Grizzco Brella)'
		},
		'weapon-8020': {
			'ja': '緑？ (クマサン印のチャージャー)',
			'en': 'Green-? (Grizzco Charger)'
		},
		'weapon-8030': {
			'ja': '緑？ (クマサン印のスロッシャー)',
			'en': 'Green-? (Grizzco Slosher)'
		},
		'weapon--2': {
			'ja': '金？',
			'en': 'Golden-?'
		},
		'weapon--1': {
			'ja': '緑？',
			'en': 'Green-?'
		}
	};

	/** alphabet2int(str)
	 * A, B, C…といった文字列を1, 2, 3…のような数値に変換します。
	 * AA, AB, AC…は27, 28, 29…となります。
	 * @param {string} - アルファベットの文字列
	 * @return {number} - 変換結果
	 */
	function alphabet2int(str) {
		var charCodeA = 'a'.charCodeAt(0);
		var lower = str.toLowerCase();
		var sum = 0;
		for (var i = 0; i < lower.length; i++) {
			var a = lower[i];
			var b = a.charCodeAt(0) - charCodeA + 1;
			var c = b * Math.pow(26, i);
			sum += c;
		}
		return sum;
	}

	/** getSheet(opt)
	 * スプレッドシートのデータを取得するプロミスを返します。
	 * awaitを付けてこの関数を呼べば、データ取得の完了を待つことができます。
	 * @param opt.key {string} - スプレッドシートのID
	 * @param opt.sheet {string} - 参照するシート名
	 * @param opt.range {string} - 参照するセル範囲
	 * @param opt.array {array} - データを格納する配列
	 * @param callback {function} - コールバック
	 * @return {promise}
	 */
	function getSheet(opt, callback) {
		// 参考: https://builder.japan.zdnet.com/tool/20369905/3/
		var url = encodeURI(URL_BASE + '/' + opt.key + '/gviz/tq?sheet=' + opt.sheet + '&range=' + opt.range);
		var query = new google.visualization.Query(url);
		query.setRefreshable(false);
		query.send(function(response){
			var data = response.getDataTable();
			// 各行のオブジェクトデータを格納するための配列
			var lines = opt.array || [];
			// 参照範囲の2行目以降の各行について
			for (var y = 0; y < data.getNumberOfRows(); y++) {
				// この行のデータを格納するためのオブジェクト
				var obj = {};
				// 参照範囲の各列について
				for (var x = 0; x < data.getNumberOfColumns(); x++) {
					// 参照範囲目の1行目がラベルとして扱われるので
					// この列のラベルを取得してオブジェクトのキーとして使う
					var key = data.getColumnLabel(x);
					// このセルの値を取得
					var value = data.getFormattedValue(y, x); 
					// オブジェクトに格納
					obj[key] = value;
				}
				// 配列に格納
				lines.push(obj);
			}
			// コールパック
			if (callback) {
				callback(lines);
			}
		});
	}

	/** getCSV(opt)
	 * CSVファイルを取得するプロミスを返します。
	 * awaitを付けてこの関数を呼べば、データ取得の完了を待つことができます。
	 * @param opt.sheet {string} - 参照するシート名
	 * @param opt.range {string} - 参照するセル範囲
	 * @param opt.array {array} - データを格納する配列
	 * @param callback {function} - コールバック
	 * @return {promise}
	 */
	function getCSV(opt, callback) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', './assets/csv/For Salmon Run Records - ' + opt.sheet + '.csv?ver=' + CSV_VERSION, true);
		xhr.responseType = 'text';
		xhr.onreadystatechange = function (event) {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var data = xhr.responseText;
					var ranges = opt.range.split(':'); // ex) 'A2:E8'
					var startCell = ranges[0]; // 'A1'
					var startX = alphabet2int(startCell.replace(/[0-9]*/g, '')) - 1; // 0
					var startY = parseInt(startCell.replace(/[a-zA-Z]*/g, '')) - 1; // 1
					var endCell = ranges[1]; // 'E8'
					var endX = alphabet2int(endCell.replace(/[0-9]*/g, '')) - 1; // 4
					var endY = parseInt(endCell.replace(/[a-zA-Z]*/g, '')) - 1; // 7
					// CSVのテキストデータを改行で区切る
					var rows = data.split('\n');
					// そのうち1行目はラベルデータとして扱う
					var keys = rows[startY].split(',');
					for (var lx = 0; lx < keys.length; lx++) {
						keys[lx] = keys[lx].trim();
					}
					// 各行のオブジェクトデータを放り込んでいくための配列
					var lines = opt.array || [];
					// startY～endYにかけて各行を見ていく
					for (var y = startY + 1; y <= endY; y++) {
						var obj = {};
						// CSVとは各列のデータをカンマで区切ったテキストデータのこと。
						// 1行分の文字列に対して単純にsplit(',')メソッドを呼べばよいように思われるが、
						// 実際にはそれだとデータ内にカンマが含まれる場合に誤動作する！
						// そこで、データ内のカンマを:comma:に変換する
						// ex) 'A,B,C,"D1,D2",E' -> 'A,B,C,D1:comma:D2,E'
						// この行の文字をひとつひとつ見ていく
						var rowstr = '';
						var isQuote = false;
						for (var i = 0; i < rows[y].length; i++) {
							var c = rows[y][i];
							// ダブルクォートかどうかで場合分け
							if (c === '"') {
								// ダブルクォートならばクォートフラグを反転させる
								isQuote = !isQuote;
							} else {
								// ダブルクォートではないならば
								// クォートフラグが立っている状態でカンマに遭遇したら:comma:に変換する
								if (isQuote && c === ',') {
									c = ':comma:';
								}
								// この1文字をつなげていく
								rowstr += c;
							}
						}
						// こうして出来上がった文字列はsplit(',')で存分に区切ってよい！
						var row = rowstr.split(',');
						// startX～endXにかけて:comma:をカンマに変換しながら値をオブジェクトに放り込んでいく
						for (var x = startX; x <= endX; x++) {
							obj[keys[x]] = row[x].replace(/:comma:/g, ',');
						}
						// linesにオブジェクトを放り込む
						lines.push(obj);
					}
					// コールパック
					if (callback) {
						callback(lines);
					}
				}
			}
		};
		xhr.send(null);
	}

	/** SRRManager()
	 */
	var SRRManager = function() {
		this.rotations = [];
		this.rowRecords = [];
		this.WORDS = WORDS;
		Object.defineProperty(this, 'STAGE_WORDS', { get: function() { return STAGE_WORDS; } });
		Object.defineProperty(this, 'EVENT_WORDS', { get: function() { return EVENT_WORDS; } });
		Object.defineProperty(this, 'WEAPON_WORDS', { get: function() { return WEAPON_WORDS; } });
		return this;
	};

	/** .getRecordsOneCategory(_rotationType)
	 */
	SRRManager.prototype.getRecordsOneCategory = function(_rotationType, stageId, recordId) {

		// 最終的に表示するデータ
		var records = {};

		// オプションを初期値に統合
		var rotationType = Object.assign({
			'rotation-normal': false,
			'rotation-green-mystery-one': false,
			'rotation-green-mystery-all': false,
			'rotation-golden-mystery': false,
		}, _rotationType);

		var records = [];
		var oldScore = -1;
		for (var i = 0; i < this.rowRecords.length; i++) {
			var rec = this.rowRecords[i];

			// ステージID、レコードID、スコアのいずれかひとつでも数値に変換できなければこのレコードは無効
			// for文を抜けてしまっていい
			if (isNaN(parseInt(rec['stage id'])) || isNaN(parseInt(rec['record id'])) || isNaN(parseInt(rec.score))) {
				break;
			}

			// 編成種別を取得
			var rotationId = parseInt(rec['rotation id']);
			var rotationKind = parseInt((!isNaN(rotationId)) ?
				this.rotations[rotationId - 1].kind :
				ROTATION_KIND_UNKNOWN);

			// 金ランダム編成にチェックが入っておらず、このレコードが金ランダム編成のものならば、無視
			if (!rotationType['rotation-golden-mystery'] && rotationKind === ROTATION_KIND_GOLDEN_MYSTERY) {
				continue;
			}

			// 一緑ランダム編成にチェックが入っておらず、このレコードが一緑ランダム編成のものならば、無視
			if (!rotationType['rotation-green-mystery-one'] && rotationKind === ROTATION_KIND_GREEN_MYSTERY_ONE) {
				continue;
			}

			// 全緑ランダム編成にチェックが入っておらず、このレコードが全緑ランダム編成のものならば、無視
			if (!rotationType['rotation-green-mystery-all'] && rotationKind === ROTATION_KIND_GREEN_MYSTERY_ALL) {
				continue;
			}

			// 通常編成にチェックが入っておらず、このレコードが通常編成（あるいは編成不明）のものならば、無視
			if (!rotationType['rotation-normal'] && (rotationKind === ROTATION_KIND_NORMAL || rotationKind === ROTATION_KIND_UNKNOWN)) {
				continue;
			}

			if (stageId === parseInt(rec['stage id']) && recordId === parseInt(rec['record id'])) {
				var score = parseInt(rec.score);
				if (score >= oldScore) {
					records.push(rec);
					oldScore = score;
				}
			}
		}

		return records;
	};

	/** .getRecords(_rotationType)
	 * Spreadsheetから引っ張ってきた、過去すべての生のRecordオブジェクトが格納されている
	 * 配列(rowRecords)を使用して、実際にSalmon Run Recordsとして表示するテーブルデータを作成します。
	 * その際、4つの編成種別のうちチェックの入っていない編成種別は無視します。
	 * 
	 * @param _rotationType {Object} - どの編成種別を有効にするかの設定。 
	 *     たとえば、{ 'rotation-normal': true, 'rotation-green-mystery-one': true }
	 *
	 * @return {Object} - 'ステージID-レコードID'、たとえばダム-通常昼なら'0-8'、
	 *     ポラ-通常ハコビヤなら'4-20'、といったキーにRecordオブジェクトが格納されたオブジェクト。
	 *     格納されている各オブジェクトは、生のRecordオブジェクトにはなかった'ties'プロパティを持つ場合があります。
	 *     これはタイ記録であるRecordオブジェクトがすべて格納されている配列です。
	 */
	SRRManager.prototype.getRecords = function(_rotationType) {

		// 最終的に表示するデータ
		var records = {};

		// オプションを初期値に統合
		var rotationType = Object.assign({
			'rotation-normal': false,
			'rotation-green-mystery-one': false,
			'rotation-green-mystery-all': false,
			'rotation-golden-mystery': false,
		}, _rotationType);

		for (var i = 0; i < this.rowRecords.length; i++) {
			var rec = this.rowRecords[i];

			if ('ties' in rec) {
				delete rec.ties;
			}

			// ステージID、レコードID、スコアのいずれかひとつでも数値に変換できなければこのレコードは無効
			// for文を抜けてしまっていい
			if (isNaN(parseInt(rec['stage id'])) || isNaN(parseInt(rec['record id'])) || isNaN(parseInt(rec.score))) {
				break;
			}

			// 編成種別を取得
			var rotationId = parseInt(rec['rotation id']);
			var rotationKind = parseInt((!isNaN(rotationId)) ?
				this.rotations[rotationId - 1].kind :
				ROTATION_KIND_UNKNOWN);

			// 金ランダム編成にチェックが入っておらず、このレコードが金ランダム編成のものならば、無視
			if (!rotationType['rotation-golden-mystery'] &&
					rotationKind === ROTATION_KIND_GOLDEN_MYSTERY) {
				continue;
			}

			// 一緑ランダム編成にチェックが入っておらず、このレコードが一緑ランダム編成のものならば、無視
			if (!rotationType['rotation-green-mystery-one'] &&
					rotationKind === ROTATION_KIND_GREEN_MYSTERY_ONE) {
				continue;
			}

			// 全緑ランダム編成にチェックが入っておらず、このレコードが全緑ランダム編成のものならば、無視
			if (!rotationType['rotation-green-mystery-all'] &&
					rotationKind === ROTATION_KIND_GREEN_MYSTERY_ALL) {
				continue;
			}

			// 通常編成にチェックが入っておらず、このレコードが通常編成（あるいは編成不明）のものならば、無視
			if (!rotationType['rotation-normal'] &&
				 (rotationKind === ROTATION_KIND_NORMAL || rotationKind === ROTATION_KIND_UNKNOWN)) {
				continue;
			}

			// ステージID+レコードIDでキーを作成
			var stageId = rec['stage id'];
			var recordId = rec['record id'];
			var key1 = stageId + '-' + recordId;
			var keys = [key1];

			if (recordId in UPDATE_TOGETHER) {
				keys.push(stageId + '-' + UPDATE_TOGETHER[recordId]);
			}

			for (var j = 0; j < keys.length; j++) {
				var key = keys[j];
				// そのキーのプロパティがレコードデータにすでに存在するかどうか
				if (key in records) {
					// プロパティがレコードデータにすでに存在するならば
					// スコアを比較する
					var newEggs = parseInt(rec.score);
					var oldEggs = parseInt(records[key].score);
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
			}
		}
		return records;
	};

	/** .init()
	 */
	SRRManager.prototype.init = function(callback) {
		var self = this;
		console.log('スプレッドシートにアクセスしています…');

		// getCSV or getSheet
		var get = (SHOULD_USE_CSV) ? getCSV : getSheet;

		// レコードの数と編成履歴の数を取得する
		var rotationCount = 0;
		var recordCount = 0;
		get({
			key: SHEET_KEY,
			sheet: 'Count',
			range: 'A1:B2',
		}, function(lines) {
			console.log('▼ レコードの数と編成履歴の数を取得しました。');
			rotationCount = parseInt(lines[0]['rotation count']);
			recordCount = parseInt(lines[0]['record count']);
			console.log('　レコードの数: ' + recordCount + '件');
			console.log('　編成履歴の数: ' + rotationCount + '件');
			get({
				key: SHEET_KEY,
				sheet: 'Records',
				range: 'A1:J' + (recordCount + 1),
				array: self.rowRecords
			}, function(lines) {
				console.log('▼ レコードを取得しました。%o', lines);
				get({
					key: SHEET_KEY,
					sheet: 'Rotations',
					range: 'A2:J' + (rotationCount + 2),
					array: self.rotations
				}, function(lines) {
					console.log('▼ 編成履歴を取得しました。%o', lines);
					if (callback) {
						callback();
					}
				});
			});
		});
		return this;
	};
	window.SRRManager = SRRManager;
})(window.google);
