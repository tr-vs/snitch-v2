
const { stringify } = require('querystring');
const fetch = require('node-fetch');


async function bruh() {
    const params = stringify({
        method: 'user.getrecenttracks',
        user: 'm1styy',
        api_key: 'b97a0987d8be2614dae53778e3240bfd',
        format: 'json',
        limit: 1,
    });
    // eslint-disable-next-line no-unused-vars
    const result = await fetch(`https://ws.audioscrobbler.com/2.0/?${params}`).then(r=> r.json());
    console.log(result);
}
bruh();