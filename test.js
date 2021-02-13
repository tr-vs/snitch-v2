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
	const request = ['https://ws.audioscrobbler.com/2.0/?method=album.getinfo&artist=2Pac&album=Me%20Against%20the%20World&username=chopstix_&api_key=b97a0987d8be2614dae53778e3240bfd&format=json&limit=1']
	const data2 = await Promise.all(request.map(u => fetch(u).then(resp => resp.json())));
	console.log(data2);
}
bruh();