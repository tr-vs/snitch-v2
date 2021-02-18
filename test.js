const { stringify } = require('querystring');
const fetch = require('node-fetch');
async function bruh() {
	const params = stringify({
		term: 'masdfasdfasdfasdfasd23451235123od',
	});
	// eslint-disable-next-line no-unused-vars
	const result = await fetch(`https://api.urbandictionary.com/v0/define?${params}`).then(r=> r.json());
	console.log(result.list[0].definition);
}
bruh();