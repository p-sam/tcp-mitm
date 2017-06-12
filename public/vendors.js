// https://mathiasbynens.be/notes/css-escapes
function cssEscape(string, escapeNonASCII) {
	// Based on `ucs2decode` from https://mths.be/punycode
	var firstChar = string.charAt(0);
	var output = '';
	var counter = 0;
	var length = string.length;
	var value;
	var character;
	var charCode;
	var surrogatePairCount = 0;
	var extraCharCode; // low surrogate

	while (counter < length) {
		character = string.charAt(counter++);
		charCode = character.charCodeAt();
		// if it’s a non-ASCII character and those need to be escaped
		if (escapeNonASCII && (charCode < 0x20 || charCode > 0x7E)) {
			if ((charCode & 0xF800) == 0xD800) {
				surrogatePairCount++;
				extraCharCode = string.charCodeAt(counter++);
				if ((charCode & 0xFC00) != 0xD800 || (extraCharCode & 0xFC00) != 0xDC00) {
					throw Error('UCS-2(decode): illegal sequence');
				}
				charCode = ((charCode & 0x3FF) << 10) + (extraCharCode & 0x3FF) + 0x10000;
			}
			value = '\\' + charCode.toString(16).toUpperCase() + ' ';
		} else {
			// `\r` is already tokenized away at this point by the HTML parser.
			// `:` can be escaped as `\:`, but that fails in IE < 8.
			if (/[\t\n\v\f:]/.test(character)) {
				value = '\\' + charCode.toString(16).toUpperCase() + ' ';
			} else if (/[ !"#$%&'()*+,./;<=>?@\[\\\]^`{|}~]/.test(character)) {
				value = '\\' + character;
			} else {
				value = character;
			}
		}
		output += value;
	}

	if (/^_/.test(output)) { // Prevent IE6 from ignoring the rule altogether.
		output = '\\_' + output.slice(1);
	}
	if (/^-[\d]/.test(output)) {
		output = '\\-' + output.slice(1);
	}
	if (/\d/.test(firstChar)) {
		output = '\\3' + firstChar + ' ' + output.slice(1);
	}

	return {
		'surrogatePairCount': surrogatePairCount,
		'output': output
	};
}