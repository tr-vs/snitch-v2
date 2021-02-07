const { stringify } = require('querystring');
const fetch = require('node-fetch');
async function bruh() {
	const params3 = stringify({
		user: 'eggxoll',
		api_key: 'b97a0987d8be2614dae53778e3240bfd',
		method: 'user.getrecenttracks',
		limit: 1,
		format: 'json',

	});
	const autocorrect = await fetch(`https://ws.audioscrobbler.com/2.0/?${params3}`).then(r => r.json());
	console.log(autocorrect.recenttracks.track);
}
bruh();