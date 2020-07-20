const https = require('https');

const get = (url, headers) => new Promise((resolve, reject) => {
    const callback = (res) => {
        res.on('data', d => resolve({data: d, statusCode: res.statusCode})); res.on('error', e => reject(e));
    };
    if(headers) https.get(url, {headers}, callback);
    else https.get(url, callback);
});

url = 'https://api.github.com/users/cliff76';
const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'nodeJS'
};
get(url,headers).then(({data, statusCode}) => {
    console.log('Response code: ' + statusCode);
    console.log(data.toString());
}).catch(e => {
    console.error('HTTPS Error:', data)
});

exports.https = https;
exports.get = get;