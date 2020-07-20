const https = require('https');
const fs = require('fs');

//To be included in a shallow API
const get = (url, headers) => new Promise((resolve, reject) => {
    const callback = (res) => {
        res.on('data', d => resolve({data: d, statusCode: res.statusCode})); res.on('error', e => reject(e));
    };
    if(headers) https.get(url, {headers}, callback);
    else https.get(url, callback);
});

const writeFile = (fd, data) => {
    return new Promise((resolve, reject) => {
        fs.write(fd, data, (err, numBytes) => { err ? reject(err) : resolve(numBytes) });
    });
};

const usingFile = (f) => {
    const resolveFile = () => new Promise((resolve, reject) => {
        fs.open(f, 'w+',(err, fd) => err ? reject(err) : resolve(fd) );
    });
    return {
        resolveFile,
        write: (data) => { return resolveFile().then(fd => writeFile(fd, data))}
    };
};
//To be included in a shallow API

const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'nodeJS'
};
get('https://api.github.com/users/cliff76',headers).then(result => usingFile('./githubResponse.txt').write(result.data)).catch(e => {
    console.error('API Error:', e)
});
