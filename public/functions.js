function formatSource(source) {
	var addr = source.family !== 'IPv4' ? '['+source.address+']' : source.address;
	return addr+':'+source.port;
}

function pad(n) {
	if(n < 10) {
		return "0"+n;
	}
	return String(n);
}

function timestamp(date) {
	return date.getFullYear()+'-'+pad(date.getMonth()+1)+'-'+pad(date.getDate())+' '+pad(date.getHours())+':'+pad(date.getMinutes())+':'+pad(date.getSeconds());
}

function addSpan(parentEl, textContent, opts) {
	var spanEl = document.createElement('span');
	var textNode = document.createTextNode(textContent);
	spanEl.appendChild(textNode);
	
	if(opts) {
		if(opts.classes && opts.classes.length) {
			var i = opts.classes.length;
			while(i--) {
				spanEl.classList.add(opts.classes[i]);
			}
		}
		if(opts.title) {
			spanEl.setAttribute('title', opts.title);
		}
	}
	
	parentEl.appendChild(spanEl);
	
	return spanEl;
}

function addSpacer(parentEl) {
	parentEl.appendChild(document.createTextNode(" \u00A0 "));
}

function getCurrentFilters(event_types) {
	var filters = {
		client: null,
		types: {}
	};
	
	event_types.forEach(function(event_type) {
		var checkboxEl = document.getElementById('CHECKBOX_FILTER_EVENT_'+event_type);
		filters.types[event_type] = checkboxEl ? checkboxEl.checked : true;
	});
	
	var inputEl = document.getElementById('socket-filter-input');
	
	if(inputEl && inputEl.value) {
		filters.client = inputEl.value;
	}
	
	return filters;
}

function generateFilterCSS(event_types) {
	var styleEl = document.getElementById('filters-inline-style');
	
	if(!styleEl) {
		styleEl = document.createElement('style');
		styleEl.setAttribute('id', 'filters-inline-style');
		document.head.appendChild(styleEl);
	}
	
	var css = '';
	var filters = getCurrentFilters(event_types);
	
	for(var event_type in filters.types) {
		if(!filters.types[event_type]) {
			css += '#logs > p.EVENT_'+event_type+' { display: none; }';
		}
	}
	
	if(filters.client) {
		css += '#logs > p:not([data-client*="'+window.cssEscape(filters.client).output+'"]) { display: none; }';
 	}
	
	styleEl.textContent = css;
}

function browserBlobDownload(fileName, blob) {
	if(window.navigator.msSaveBlob) {
		return window.navigator.msSaveBlob(blob, fileName);
	}
	
	var url = window.URL.createObjectURL(blob);
	var anchorEl = document.createElement('a');
	anchorEl.href = url;
	anchorEl.setAttribute("download", fileName);
	anchorEl.style.display = 'none';
	document.body.appendChild(anchorEl);
	setTimeout(function() {
		anchorEl.click();
		document.body.removeChild(anchorEl);
		setTimeout(function() {
		    window.URL.revokeObjectURL(url);
		    url = undefined;
		}, 250);
		anchorEl = undefined;
	}, 100);
}

function makeExport(filtered, event_types) {
	var date = new Date();
	
	var pEls = document.querySelectorAll('#logs > p');
	var pEl;
	var pElsLength = pEls.length;
	var parts = [];
	
	var filters = filtered ? getCurrentFilters(event_types) : null;
	
	for(var i = 0; i < pElsLength; i++) {
		pEl = pEls[i];
		
		if(filters) {
			if(!filters.types[pEl.dataset.type]) {
				continue;
			}
			if(filters.client && pEl.dataset.client.indexOf(filters.client) === -1) {
				continue;
			}
		}
		
		parts.push(pEls[i].textContent+"\r\n");
	}
	
	var blob = new window.Blob(parts, {type: 'application/octet-stream'});
	parts = [];
	
	browserBlobDownload(
		'tcp-'+timestamp(date).replace('/[^\d-]/','_')+'.log',
		blob	
	);
}

function clearLogs() {
	document.getElementById('logs').innerHTML = '';
}