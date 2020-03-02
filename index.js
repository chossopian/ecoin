const fetch = require('node-fetch');
const readlineSync = require('readline-sync');
const cheerio = require('cheerio');

const functionName = () => new Promise((resolve, reject) => {

    fetch('https://uinames.com/api/?region=indonesia', { 
        method: 'GET'
    })
    .then(res => res.json())
    .then(result => {
        resolve(result);
    })
    .catch(err => reject(err))
});

const getCookieDaftarPage = () => new Promise((resolve, reject) => {
    fetch(`https://ecoinofficial.org/referral/cq8whg7`, {
        method: 'GET'
    })
    .then(res => {
        const cookie = res.headers.raw()['set-cookie'];
        resolve(cookie)
    })
    .catch(err => reject(err))
});

const daftar = (cfduid, referralCookie, connectSid, firstName, lastName, email) => new Promise((resolve, reject) => {
    fetch(`https://ecoinofficial.org/users/signup`, {
        method: 'POST',
        headers: {
    'Connection': 'keep-alive',
    'Cache-Control': 'max-age=0',
    'Origin': 'https://ecoinofficial.org',
    'Upgrade-Insecure-Requests': '1',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36',
    'Sec-Fetch-Dest': 'document',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Referer': 'https://ecoinofficial.org/signup',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cookie': `${cfduid}; ${referralCookie}; referral_code=cq8whg; ${connectSid}; returning=1; view=cq8whg; __asc=52f022f417090860dd2f7da363e; __auc=52f022f417090860dd2f7da363e; _ga=GA1.2.286671921.1582972671; _gid=GA1.2.271656498.1582972671; _gat_gtag_UA_140907374_1=1`
        },
        body: `firstName=${firstName}&lastName=${lastName}&username=${email}&password=aabbcc123&confirmPassword=aabbcc123&agree=on`
    })
    .then(res => res.text())
    .then(result => {
        const $ = cheerio.load(result);
        const resText = $('<div class="alert alert-danger" role="alert">Verification email sent!</div>').text('[+] Daftar Berhasil!');
        resolve(resText)
    })
    .catch(err => reject(err))
});

(async () => {
    const email = await readlineSync.question('Email: ');
    const name =  await functionName();
    const getFirstName = `${name.name}`;
    const getLastName = `${name.surname}`;
    const cookieLoginPage = await getCookieDaftarPage();
    const getCfduid = cookieLoginPage[0].split(';')[0];
    const getReferralCookie = cookieLoginPage[1].split(';')[0];
    const getConnectSid = cookieLoginPage[3].split(';')[0];
    const daftars = await daftar(getCfduid, getReferralCookie, getConnectSid, getFirstName, getLastName, email)
    // console.log(daftars, '[+] Berhasil daftar!', function (err) {
    //     if (err) throw err;
    //     console.log('[!] Gagal daftar!');
    // });
    console.log(daftars)
})();