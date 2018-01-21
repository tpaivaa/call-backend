module.exports = {
	ok: {'200': 'OK'},
	nok: {'500': 'internal Severe Error'},
	action: {
		allow: { 'action': 'allow' },
		deny: { 'action': 'deny' },
		continue: { 'action': {'name': 'Continue'} },
		hangup:{ 'action': {'name': 'Hangup'} },
	}
};