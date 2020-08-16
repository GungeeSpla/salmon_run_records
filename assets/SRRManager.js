'use strict';

(() => {
	
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
	const SHOULD_GET_WORDS = false;

	// ステージの単語定義
	const STAGE_WORDS = {"0":{"id":"0","ja":"シェケナダム","en":"Spawning Grounds"},"1":{"id":"1","ja":"難破船ドン･ブラコ","en":"Marooner's Bay"},"2":{"id":"2","ja":"海上集落シャケト場","en":"Lost Outpost"},"3":{"id":"3","ja":"トキシラズいぶし工房","en":"Salmonid Smokeyard"},"4":{"id":"4","ja":"朽ちた箱舟 ポラリス","en":"Ruins of Ark Polaris"}};

	// 種目の単語定義
	const EVENT_WORDS = {"0":{"id":"0","ja":"総合金","en":"Total Golden Eggs"},"1":{"id":"1","ja":"総合金（昼のみ）","en":"Total Golden Eggs (No Night)"},"2":{"id":"2","ja":"1WAVE最高金","en":"1-Wave Golden Eggs"},"3":{"id":"3","ja":"個人金","en":"Single Player Golden Eggs"},"4":{"id":"4","ja":"野良3総合金","en":"Total Golden Eggs in Freelance"},"5":{"id":"5","ja":"野良3個人金","en":"Single Player Golden Eggs in Freelance"},"6":{"id":"6","ja":"野良2総合金","en":"Total Golden Eggs in Twinlance"},"7":{"id":"7","ja":"野良2個人金","en":"Single Player Golden Eggs in Twinlance"},"8":{"id":"8","ja":"通常昼","en":"NT Normal"},"9":{"id":"9","ja":"満潮昼","en":"HT Normal"},"10":{"id":"10","ja":"干潮昼","en":"LT Normal"},"11":{"id":"11","ja":"通常ラッシュ","en":"NT Rush"},"12":{"id":"12","ja":"満潮ラッシュ","en":"HT Rush"},"13":{"id":"13","ja":"通常霧","en":"NT Fog"},"14":{"id":"14","ja":"満潮霧","en":"HT Fog"},"15":{"id":"15","ja":"干潮霧","en":"LT Fog"},"16":{"id":"16","ja":"通常間欠泉","en":"NT Goldie Seeking"},"17":{"id":"17","ja":"満潮間欠泉","en":"HT Goldie Seeking"},"18":{"id":"18","ja":"通常グリル","en":"NT Grillers"},"19":{"id":"19","ja":"満潮グリル","en":"HT Grillers"},"20":{"id":"20","ja":"通常ハコビヤ","en":"NT Mothership"},"21":{"id":"21","ja":"満潮ハコビヤ","en":"HT Mothership"},"22":{"id":"22","ja":"干潮ハコビヤ","en":"LT Mothership"},"23":{"id":"23","ja":"干潮ドスコイ","en":"Cohock Charge"},"24":{"id":"24","ja":"総合赤","en":"Total Power Eggs"},"25":{"id":"25","ja":"個人赤","en":"Single Player Power Eggs"},"26":{"id":"26","ja":"野良3総合赤","en":"Total Power Eggs in Freelance"},"27":{"id":"27","ja":"野良3個人赤","en":"Single Player Power Eggs in Freelance"},"28":{"id":"28","ja":"野良2総合赤","en":"Total Power Eggs in Twinlance"},"29":{"id":"29","ja":"個人金（昼のみ）","en":"Single Player Golden Eggs (No Night)"}};

	// ブキの単語定義
	const WEAPON_WORDS = {"0":{"id":"0","ja":"ボールドマーカー","en":"Sploosh-o-matic"},"10":{"id":"10","ja":"わかばシューター","en":"Splattershot Jr."},"20":{"id":"20","ja":"シャープマーカー","en":"Splash-o-matic"},"30":{"id":"30","ja":"プロモデラーMG","en":"Aerospray"},"40":{"id":"40","ja":"スプラシューター","en":"Splattershot"},"50":{"id":"50","ja":".52ガロン","en":".52 Gal"},"60":{"id":"60","ja":"N-ZAP85","en":"N-ZAP '85"},"70":{"id":"70","ja":"プライムシューター","en":"Splattershot Pro"},"80":{"id":"80","ja":".96ガロン","en":".96 Gal"},"90":{"id":"90","ja":"ジェットスイーパー","en":"Jet Squelcher"},"200":{"id":"200","ja":"ノヴァブラスター","en":"Luna Blaster"},"210":{"id":"210","ja":"ホットブラスター","en":"Blaster"},"220":{"id":"220","ja":"ロングブラスター","en":"Range Blaster"},"230":{"id":"230","ja":"クラッシュブラスター","en":"Clash Blaster"},"240":{"id":"240","ja":"ラピッドブラスター","en":"Rapid Blaster"},"250":{"id":"250","ja":"Rブラスターエリート","en":"Rapid Blaster Pro"},"300":{"id":"300","ja":"L3リールガン","en":"L-3 Nozzlenose"},"310":{"id":"310","ja":"H3リールガン","en":"H-3 Nozzlenose"},"400":{"id":"400","ja":"ボトルガイザー","en":"Squeezer"},"1000":{"id":"1000","ja":"カーボンローラー","en":"Carbon Roller"},"1010":{"id":"1010","ja":"スプラローラー","en":"Splat Roller"},"1020":{"id":"1020","ja":"ダイナモローラー","en":"Dynamo Roller"},"1030":{"id":"1030","ja":"ヴァリアブルローラー","en":"Flingza Roller"},"1100":{"id":"1100","ja":"パブロ","en":"Inkbrush"},"1110":{"id":"1110","ja":"ホクサイ","en":"Octobrush"},"2000":{"id":"2000","ja":"スクイックリンα","en":"Squiffer"},"2010":{"id":"2010","ja":"スプラチャージャー","en":"Splat Charger"},"2020":{"id":"2020","ja":"スプラスコープ","en":"Splatterscope"},"2030":{"id":"2030","ja":"リッター4K","en":"E-liter 4K"},"2040":{"id":"2040","ja":"4Kスコープ","en":"E-liter 4K Scope"},"2050":{"id":"2050","ja":"14式竹筒銃・甲","en":"Bamboozler 14"},"2060":{"id":"2060","ja":"ソイチューバー","en":"Goo Tuber"},"3000":{"id":"3000","ja":"バケットスロッシャー","en":"Slosher"},"3010":{"id":"3010","ja":"ヒッセン","en":"Tri-Slosher"},"3020":{"id":"3020","ja":"スクリュースロッシャー","en":"Sloshing Machine"},"3030":{"id":"3030","ja":"オーバーフロッシャー","en":"Bloblobber"},"3040":{"id":"3040","ja":"エクスプロッシャー","en":"Explosher"},"4000":{"id":"4000","ja":"スプラスピナー","en":"Mini Splatling"},"4010":{"id":"4010","ja":"バレルスピナー","en":"Heavy Splatling"},"4020":{"id":"4020","ja":"ハイドラント","en":"Hydra Splatling"},"4030":{"id":"4030","ja":"クーゲルシュライバー","en":"Ballpoint Splatling"},"4040":{"id":"4040","ja":"ノーチラス47","en":"Nautilus 47"},"5000":{"id":"5000","ja":"スパッタリー","en":"Dapple Dualies"},"5010":{"id":"5010","ja":"スプラマニューバー","en":"Splat Dualies"},"5020":{"id":"5020","ja":"ケルビン525","en":"Glooga Dualies"},"5030":{"id":"5030","ja":"デュアルスイーパー","en":"Dualie Squelchers"},"5040":{"id":"5040","ja":"クアッドホッパーブラック","en":"Tetra Dualies"},"6000":{"id":"6000","ja":"パラシェルター","en":"Splat Brella"},"6010":{"id":"6010","ja":"キャンピングシェルター","en":"Tenta Brella"},"6020":{"id":"6020","ja":"スパイガジェット","en":"Undercover Brella"},"7000":{"id":"7000","ja":"クマサン印のブラスター","en":"Grizzco Blaster"},"7010":{"id":"7010","ja":"クマサン印のシェルター","en":"Grizzco Brella"},"7020":{"id":"7020","ja":"クマサン印のチャージャー","en":"Grizzco Charger"},"7030":{"id":"7030","ja":"クマサン印のスロッシャー","en":"Grizzco Slosher"},"7040":{"id":"7040","ja":"すべてのクマサン印のブキ","en":"All Grizzco Weapons"},"8000":{"id":"8000","ja":"緑？ (クマサン印のブラスター)","en":"Green-? (Grizzco Blaster)"},"8010":{"id":"8010","ja":"緑？ (クマサン印のシェルター)","en":"Green-? (Grizzco Brella)"},"8020":{"id":"8020","ja":"緑？ (クマサン印のチャージャー)","en":"Green-? (Grizzco Charger)"},"8030":{"id":"8030","ja":"緑？ (クマサン印のスロッシャー)","en":"Green-? (Grizzco Slosher)"},"-2":{"id":"-2","ja":"金？","en":"Golden-?"},"-1":{"id":"-1","ja":"緑？","en":"Green-?"}};

	// 「その種目とセットで更新確認をすべき種目」たち
	// たとえば「野良3総合赤の記録が、総合赤の記録をも塗り替えていやしないか？」とチェックをするためのもの
	const UPDATE_TOGETHER = {
		'26': 24,
		'27': 25,
		'28': 24,
	};

	// 通常編成、一緑編成、全緑編成、黄金編成、編成不明のIDたち
	const ROTATION_KIND_NORMAL = 0;
	const ROTATION_KIND_GREEN_MYSTERY_ONE = 1;
	const ROTATION_KIND_GREEN_MYSTERY_ALL = 2;
	const ROTATION_KIND_GOLDEN_MYSTERY = 3;
	const ROTATION_KIND_UNKNOWN = 4;

	// CSVファイルを読み込むべき？ スプレッドシートに不具合がある場合trueにする
	const SHOULD_USE_CSV = false;

	// CSVファイルのバージョン キャッシュ対策
	const CSV_VERSION = 1;

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
	
	/** SRRManager()
	 */
	const SRRManager = function() {
		this.rotations = [];
		this.rowRecords = [];
		Object.defineProperty(this, 'STAGE_WORDS', { get: function() { return STAGE_WORDS; } });
		Object.defineProperty(this, 'EVENT_WORDS', { get: function() { return EVENT_WORDS; } });
		Object.defineProperty(this, 'WEAPON_WORDS', { get: function() { return WEAPON_WORDS; } });
		return this;
	};
	
	/** .getRecords()
	 */
	SRRManager.prototype.getRecords = function(_rotationType) {

		const records = {};

		const rotationType = Object.assign({
			'rotation-normal': false,
			'rotation-green-mystery-one': false,
			'rotation-green-mystery-all': false,
			'rotation-golden-mystery': false,
		}, _rotationType);

		for (let i = 0; i < this.rowRecords.length; i++) {
			const rec = this.rowRecords[i];

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
	};
	
	/** .init()
	 */
	SRRManager.prototype.init = async function() {
		console.log('スプレッドシートにアクセスしています…');
		
		// getCSV or getSheet
		const get = (SHOULD_USE_CSV) ? getCSV : getSheet;

		// 単語設定を読み込みにいく
		if (SHOULD_GET_WORDS) {
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
				console.log('▼ レコードの数と編成履歴の数を取得しました。');
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
			range: `A1:J${recordCount + 1}`,
			array: this.rowRecords,
			callback: (lines) => {
				console.log('▼ レコードを取得しました。%o', lines);
				//console.log(JSON.stringify(lines));
			},
		});

		// 編成履歴を取得する
		await get({
			key: SHEET_KEY,
			sheet: 'Rotations',
			range: `A2:J${rotationCount + 2}`,
			array: this.rotations,
			callback: (lines) => {
				console.log('▼ 編成履歴を取得しました。%o', lines);
				//console.log(JSON.stringify(lines));
			},
		});
		
		return this;
	};
	window.SRRManager = SRRManager;
})();
