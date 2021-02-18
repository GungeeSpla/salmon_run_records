// ========================
// kanaToRoman.js
// ========================


/** wordToRoman
 */
window.wordToRoman = (function() {
	var wordMap = {
		'JKC_デンジャー': 'JKC_Danger',
		'あのにます': 'Anonymous',
		'あさ5はんTべたかい': 'Asa5han-Tabetakai',
		'アシックス': 'Asics',
		'アルク': 'alk',
		'イカスミP': 'Ikasumi-P',
		'いちごぱんつ': 'Ichigo-Pants',
		'うえきばちマン': 'Uekibachi-Man',
		'エキゾチックたぬき': 'Exotic-Tanuki',
		'えくれあ': 'Eclair',
		'おいしいさかな': 'Oishi-Sakana',
		'がずー': 'Gazooo',
		'カトレア': 'Cattleya',
		'かんぞうぽんこつ': 'Kanzo-Ponkotsu',
		'きつねそば': 'Kitsune-Soba',
		'くっきー': 'Cookie',
		'ケフィァ': 'Kefia',
		'コースヶ': 'Kosuke',
		'コジャケしゃん': 'Kojake-shan',
		'ごはんのおかず': 'Gohan-no-Okazu',
		'ゴリラおじさん': 'Gorilla-Ojisan',
		'サイドハンド': 'Sidehand',
		'シアロア': 'Shyaroa',
		'シア口ア': 'Shyaroa',
		'シナモロール': 'Cinnamoroll',
		'しゃちくくん/': 'Shachiku-kun',
		'シャノワール': 'Chatnoir',
		'すしやきにく': 'Sushi-Yakiniku',
		'すずらとぅーん': 'Suzulatoon',
		'ぜんぽうこうえんふん': 'Zempo-Koenfun',
		'そのへんのぽてと': 'Sonohen-no-Potato',
		'ゾルディオス': 'Zoldios',
		'タモニカ*゜': 'Tamnica*゜',
		'たろす': 'Taros',
		'ちゃんゴリラ': 'Chan-Gorilla',
		'ちゃんゆり': 'Chan-Yuri',
		'ちゅろす': 'Churros',
		'トムソン': 'Thomson',
		'ナイト': 'Knight',
		'ナトリウム/Kuli': 'Natrium/Kuli',
		'ななsummer': 'Nana-summer',
		'ニュートラル': 'Neutral',
		'バームⅡ': 'BamuⅡ',
		'はこびやJACK': 'Hakobiya-JACK',
		'パチモノせいじか': 'Pachimono-Seijika',
		'はっぱちゃん': 'Happa-chan',
		'はるとぅーん': 'Harutoon',
		'ひーす*': 'Heath*',
		'ぶぁーど': 'Bird',
		'フクイでってぃう': 'Fukui-Detteiu',
		'ホムニイホE↓ヨ': 'Yohoho',
		'ぽむぽむぷりん': 'Pompompurin',
		'ぽらにくP': 'Poraniku-P',
		'マー': 'Marty',
		'マウンテンデュー': 'Mountain-Dew',
		'マシュー': 'Matthew',
		'マシュー38歳': 'Matthew-38',
		'マンメンミ261ごう': 'Manmenmi-261',
		'ムッシュなのじ': 'Monsieur-Nanoji',
		'めぇめぇひつじ': 'Me-Me-Hitsuji',
		'メンタリティしのはら': 'Mentality-Shinohara',
		'モット': 'MoT',
		'ももさん(ピーチ)': 'Momosan',
		'ゆっくりオレンジゼリー': 'Yukkuri-Orange-Jelly',
		'リオでじゃねいろ': 'Rio-de-Janeiro',
		'れいわのローレル/': 'Reiwa-no-Laurel',
		'れん坊': 'Renbo',
		'ロア子(シアロア)': 'Shyaroa',
		'影': 'Kage',
		'河原夢乃': 'Kawahara-Yumeno',
		'希泉': 'Kisen',
		'君宮': 'Kimimiya',
		'高床': 'Takayuka',
		'高床式倉庫': 'Takayukashiki-Soko',
		'雑草': 'Zasso',
		'汐': 'sio',
		'汐-sio': 'sio',
		'珠': 'Tama',
		'小夜': 'Sayo',
		'松木涼': 'Matsuki-Ryo',
		'焼き鳥': 'Yakitori',
		'鐘月': 'Shogetsu',
		'吹雪': 'Fubuki',
		'大竹': 'Otake',
		'塗り専会長': 'Nurisen-Kaicho',
		'塗り専会長おひめ': 'Nurisen-Kaicho-Ohime',
		'南うい': 'Minami-Ui',
		'白角えす': 'Shiratsuno-Esu',
		'爆誕パンツたん': 'Bakutan-Pants-tan',
		'発条山場猫': 'Baneyamabaneko',
		'蜂酖': 'Hachitan',
		'夢乃': 'Kawahara-Yumeno'
	};

	/** isHanEisu(str)
	 * @see https://javascript.programmer-reference.com/js-check-hankaku-eisu/
	 */
	function isHanEisu(str) {
		str = (str == null) ? "" : str;
		if (str.match(/^[A-Za-z0-9]*$/)) {
			return true;
		} else {
			return false;
		}
	}

	/** wordToRoman(kana)
	 */
	return function(word) {
		var def = wordMap[word];
		if (def) {
			return def;
		}
		word = word.replace('！', '!');
		if (isHanEisu(word)) {
			return word;
		} else {
			var ret = window.kanaToRoman(word);
			if (word.charAt(0) !== ret.charAt(0)) {
				ret = ret.charAt(0).toUpperCase() + ret.slice(1);
			}
			return ret;
		}
	};
}());


/** kanaToRoman
 * @see https://shanabrian.com/web/javascript/kana-to-roman.php
 */
window.kanaToRoman = (function() {
	/** romanMap
	 * 変換マップ
	 */
	var romanMap = {
		'あ' : 'a',
		'い' : 'i',
		'う' : 'u',
		'え' : 'e',
		'お' : 'o',
		'か' : 'ka',
		'き' : 'ki',
		'く' : 'ku',
		'け' : 'ke',
		'こ' : 'ko',
		'さ' : 'sa',
		'し' : { hepburn : 'shi', kunrei : 'si' },
		'す' : 'su',
		'せ' : 'se',
		'そ' : 'so',
		'た' : 'ta',
		'ち' : { hepburn : 'chi', kunrei : 'ti' },
		'つ' : { hepburn : 'tsu', kunrei : 'tu' },
		'て' : 'te',
		'と' : 'to',
		'な' : 'na',
		'に' : 'ni',
		'ぬ' : 'nu',
		'ね' : 'ne',
		'の' : 'no',
		'は' : 'ha',
		'ひ' : 'hi',
		'ふ' : { hepburn : 'fu', kunrei : 'hu' },
		'へ' : 'he',
		'ほ' : 'ho',
		'ま' : 'ma',
		'み' : 'mi',
		'む' : 'mu',
		'め' : 'me',
		'も' : 'mo',
		'や' : 'ya',
		'ゆ' : 'yu',
		'よ' : 'yo',
		'ら' : 'ra',
		'り' : 'ri',
		'る' : 'ru',
		'れ' : 're',
		'ろ' : 'ro',
		'わ' : 'wa',
		'ゐ' : 'wi',
		'ゑ' : 'we',
		'を' : { hepburn : 'o', kunrei : 'wo' },
		'ん' : 'n',
		'が' : 'ga',
		'ぎ' : 'gi',
		'ぐ' : 'gu',
		'げ' : 'ge',
		'ご' : 'go',
		'ざ' : 'za',
		'じ' : { hepburn : 'ji', kunrei : 'zi' },
		'ず' : 'zu',
		'ぜ' : 'ze',
		'ぞ' : 'zo',
		'だ' : 'da',
		'ぢ' : { hepburn : 'ji', kunrei : 'di' },
		'づ' : { hepburn : 'zu', kunrei : 'du' },
		'で' : 'de',
		'ど' : 'do',
		'ば' : 'ba',
		'び' : 'bi',
		'ぶ' : 'bu',
		'べ' : 'be',
		'ぼ' : 'bo',
		'ぱ' : 'pa',
		'ぴ' : 'pi',
		'ぷ' : 'pu',
		'ぺ' : 'pe',
		'ぽ' : 'po',
		'きゃ' : 'kya',
		'きぃ' : 'kyi',
		'きゅ' : 'kyu',
		'きぇ' : 'kye',
		'きょ' : 'kyo',
		'くぁ' : 'qa',
		'くぃ' : 'qi',
		'くぇ' : 'qe',
		'くぉ' : 'qo',
		'くゃ' : 'qya',
		'くゅ' : 'qyu',
		'くょ' : 'qyo',
		'しゃ' : { hepburn : 'sha', kunrei : 'sya' },
		'しぃ' : 'syi',
		'しゅ' : { hepburn : 'shu', kunrei : 'syu' },
		'しぇ' : 'sye',
		'しょ' : { hepburn : 'sho', kunrei : 'syo' },
		'ちゃ' : { hepburn : 'cha', kunrei : 'tya' },
		'ちぃ' : { hepburn : 'chi', kunrei : 'tii' },
		'ちゅ' : { hepburn : 'chu', kunrei : 'tyu' },
		'ちぇ' : { hepburn : 'che', kunrei : 'tye' },
		'ちょ' : { hepburn : 'cho', kunrei : 'tyo' },
		'てゃ' : 'tha',
		'てぃ' : 'thi',
		'てゅ' : 'thu',
		'てぇ' : 'the',
		'てょ' : 'tho',
		'ひゃ' : 'hya',
		'ひぃ' : 'hyi',
		'ひゅ' : 'hyu',
		'ひぇ' : 'hye',
		'ひょ' : 'hyo',
		'ふぁ' : 'fa',
		'ふぃ' : 'fi',
		'ふぇ' : 'fe',
		'ふぉ' : 'fo',
		'みゃ' : 'mya',
		'みぃ' : 'myi',
		'みゅ' : 'myu',
		'みぇ' : 'mye',
		'みょ' : 'myo',
		'ヴぁ' : 'va',
		'ヴぃ' : 'vi',
		'ヴぇ' : 've',
		'ヴぉ' : 'vo',
		'ぎゃ' : 'gya',
		'ぎぃ' : 'gyi',
		'ぎゅ' : 'gyu',
		'ぎぇ' : 'gye',
		'ぎょ' : 'gyo',
		'じゃ' : { hepburn : 'ja', kunrei : 'zya' },
		'じぃ' : 'zyi',
		'じゅ' : { hepburn : 'ju', kunrei : 'zyu' },
		'じぇ' : 'zye',
		'じょ' : { hepburn : 'jo', kunrei : 'zyo' },
		'ぢゃ' : { hepburn : 'dya', kunrei : 'zya' },
		'ぢぃ' : 'dyi',
		'ぢゅ' : { hepburn : 'dyu', kunrei : 'zya' },
		'ぢぇ' : 'dye',
		'ぢょ' : { hepburn : 'dyo', kunrei : 'zya' },
		'びゃ' : 'bya',
		'びぃ' : 'byi',
		'びゅ' : 'byu',
		'びぇ' : 'bye',
		'びょ' : 'byo',
		'ぴゃ' : 'pya',
		'ぴぃ' : 'pyi',
		'ぴゅ' : 'pyu',
		'ぴぇ' : 'pye',
		'ぴょ' : 'pyo',
		'りゃ' : 'rya',
		'りゅ' : 'ryu',
		'りょ' : 'ryo',
		'にゃ' : 'nya',
		'にゅ' : 'nyu',
		'にょ' : 'nyo',
		'ぁ' : 'xa',
		'ぃ' : 'xi',
		'ぅ' : 'xu',
		'ぇ' : 'xe',
		'ぉ' : 'xo',
		'ゃ' : 'xya',
		'ゅ' : 'xyu',
		'ょ' : 'xyo',
		'っ' : 'xtu',
		'ヴ' : 'vu',
		'ー' : '-',
		'、' : ', ',
		'，' : ', ',
		'。' : '.'
	};

	/** latins
	 * 長音のラテン文字
	 */
	var latins = {
		hepburn : {
			'a' : 257,
			'i' : 299,
			'u' : 363,
			'e' : 275,
			'o' : 333
		},
		kunrei : {
			'a' : 226,
			'i' : 238,
			'u' : 251,
			'e' : 234,
			'o' : 244
		}
	};

	/** toHiragana(kana)
	 * カタカナからひらがなへ変換
	 * @param {string} kana 元とおなるカタカナ
	 * @return {string} ひらがなへ変換された文字列
	 */
	var toHiragana = function(kana) {
		return kana.replace(/[\u30a1-\u30f6]/g, function(match) {
			return String.fromCharCode(match.charCodeAt(0) - 0x60);
		});
	};

	/** getRoman(kana)
	 * ひらがなから対応するローマ字を取得
	 * @param {string} kana 元となるひらがな
	 * @return {string} 見つかった場合は対応するローマ字、見つからなかったら元のひらがなを返す
	 */
	var getRoman = function(kana, type) {
		var roman = romanMap[toHiragana(kana)];
		if (roman) {
			if (typeof roman === 'string') {
				return roman;
			} else if (type === 'hepburn') {
				return roman.hepburn;
			} else if (type === 'kunrei') {
				return roman.kunrei;
			}
		} else {
			return kana;
		}
	};

	/** kanaToRoman(targetStr, type, options)
	 * ひらがなまたはカタカナからローマ字へ変換
	 * @param {string} targetStr ローマ字へ変換する文字列（変換元の文字列）
	 * @param {"hepburn"|"kunrei"} [type="hepburn"] ローマ字の種類
	 * @param {Object} [options] その他各種オプション
	 *						   {boolean} [options.bmp=true] ... "ん"（n）の次がb.m.pの場合にnからmへ変換するかどうか
	 *						   {"latin"|"hyphen"} [options.longSound="latin"] ... 長音の表し方
	 * @return {string} ローマ字へ変換された文字列を返す
	 */
	return function(targetStr, type, options) {
		if (typeof targetStr !== 'string' && typeof targetStr !== 'number') {
			throw '変換する対象が文字列ではありません。';
		}

		if (typeof type !== 'string' || !type.match(/^(hepburn|kunrei)$/)) type = 'hepburn';

		if (!options) options = {};
		if (typeof options.kana !== 'string') options.kana = 'all';
		if (!options.kana.match(/^(all|hiragana|katakana)$/)) options.kana = 'all';
		if (typeof options.bmp !== 'boolean') options.bmp = true;
		if (typeof options.longSound !== 'string') options.longSound = 'latin';
		if (!options.longSound.match(/^(latin|hyphen)$/)) options.longSound = 'latin';

		targetStr = targetStr.replace(/ー/g, '');

		var remStr = String(targetStr), result = '', slStr, roman, lastStr;

		/** splice()
		 * 残りの文字列から1文字を切り抜く
		 * @return {string} 切り抜いた1つの文字列を返す
		 */
		var splice = function() {
			var oneChar = remStr.slice(0, 1);
			remStr = remStr.slice(1);
			return oneChar;
		};

		/** isSmallChar()
		 * 残りの文字列の最初が小文字か判定
		 * @return {boolean} 小文字の場合はtrue、そうでない場合はfalseを返す
		 */
		var isSmallChar = function() {
			return !!remStr.slice(0, 1).match(/^[ぁぃぅぇぉゃゅょァィゥェォャュョ]$/);
		};

		while (remStr) {
			slStr = splice();

			if (slStr.match(/^(っ|ッ)$/)) {
				slStr = splice();
				if (isSmallChar()) slStr += splice();

				roman = getRoman(slStr, type);
				roman = (roman !== slStr ? roman.slice(0, 1) : '') + roman;
			} else {
				if (isSmallChar()) slStr += splice();

				roman = getRoman(slStr, type);
			}

			var nextRoman = window.kanaToRoman(remStr.slice(0, 1));
			if (roman === 'n') {
				if (nextRoman.match(/^[aiueo]$/)) {
					if (type === 'hepburn') {
						roman += '-';
					} else {
						roman += '\'';
					}
				} else if (options.bmp && nextRoman.match(/^[bmp]/) && type === 'hepburn') {
					roman = 'm';
				}
			} else if (roman === '-') {
				lastStr = result.match(/[aiueo]$/);
				if (lastStr && options.longSound === 'latin') {
					result = result.slice(0, -1);
					roman = String.fromCharCode(latins[type][lastStr[0]]);
				}
			}

			result += roman;
		}

		return result;
	};
}());