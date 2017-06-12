var EVENT_TYPES = [
	'LISTENING',
	'ERROR',
	'UPSTREAM_ERROR',
	'CONNECTED',
	'UPSTREAM_CONNECTED',
	'DATA',
	'UPSTREAM_DATA',
	'DISCONNECTED',
	'UPSTREAM_DISCONNECTED'
];

var socket = window.io();
var logContainerEl = document.getElementById('logs');

socket.on('app-event', function onEvent(e) {
	var date = new Date();
	var pEl = document.createElement('p');
	
	pEl.classList.add('EVENT_'+e.type);
	pEl.dataset.type = e.type;
	
	window.addSpan(pEl, window.timestamp(date), {classes: ['date'], title: date.toISOString()});
	window.addSpacer(pEl);
	
	if(e.payload.client) {
		var formattedClient = window.formatSource(e.payload.client);
		pEl.dataset.client = formattedClient;
		window.addSpan(pEl, formattedClient, {classes: ['client']});
		window.addSpacer(pEl);
	}
	
	window.addSpan(pEl, e.type, {classes: ['type']});
	
	if(e.payload.data !== null && e.payload.data !== undefined) {
		window.addSpacer(pEl);
		window.addSpan(pEl, (e.payload.data.truncated ? '[TRUNCATED]' : '')+e.payload.data.text, {classes: ['data']});
	}

	logContainerEl.insertBefore(pEl, logContainerEl.firstChild);
});

var checkboxFilterContainerEl = document.getElementById('checkbox-filters');
var filterContainerEl = document.getElementById('filters');

EVENT_TYPES.forEach(function(event_type) {
	var checkboxEl = document.createElement('input');
	checkboxEl.setAttribute('type', 'checkbox');
	checkboxEl.setAttribute('id', 'CHECKBOX_FILTER_EVENT_'+event_type);
	checkboxEl.setAttribute('checked', true);
	checkboxFilterContainerEl.appendChild(checkboxEl);
	
	var checkboxLabelEl = document.createElement('label');
	checkboxLabelEl.setAttribute('for', 'CHECKBOX_FILTER_EVENT_'+event_type);
	checkboxLabelEl.appendChild(document.createTextNode(event_type));
	
	checkboxFilterContainerEl.appendChild(checkboxLabelEl);
	window.addSpacer(checkboxFilterContainerEl);
	
	checkboxEl.addEventListener('change', window.generateFilterCSS.bind(window, EVENT_TYPES));
});

document.getElementById('filter-view-toggle').addEventListener('click', function() {
	filterContainerEl.classList.toggle('hide');
});

document.getElementById('filter-export-filtered').addEventListener('click', window.makeExport.bind(window, true, EVENT_TYPES));
document.getElementById('filter-export-all').addEventListener('click', window.makeExport.bind(window, false, EVENT_TYPES));
document.getElementById('filter-clear').addEventListener('click', window.clearLogs);

document.getElementById('socket-filter-input').addEventListener('input', window.generateFilterCSS.bind(window, EVENT_TYPES));
document.getElementById('socket-filter-input').addEventListener('change', window.generateFilterCSS.bind(window, EVENT_TYPES));