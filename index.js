const fs = require('fs');
const fetch = require('node-fetch');
const colors = require("colors");
const readline = require("readline-sync");
const crypto = require('crypto');

const date = () => new Date().toLocaleTimeString({
    timeZone: "Asia/Jakarta",
});

class igDown {
    constructor(url) {
        this.url = url;
    }

    async download() {
        const generateHash = input => crypto.createHash("sha256").update(input).digest("hex")
        const ts = Date.now();
        const hashes = generateHash(this.url + ts + '0cb27340f1ca68be29fdc065a3c3fd0dc50852f24920ca842e507691547028e4')
        let url = 'https://fastdl.app/api/convert';

        let options = {
            method: 'POST',
            headers: {
                accept: 'application/json, text/plain, */*',
                'content-type': 'application/json',
                referer: 'https://fastdl.app/en',
            },
            body: `{"url":"${this.url}","ts":${ts},"_ts":1747212686654,"_tsc":0,"_s":"${hashes}"}`
        };

        const res = await fetch(url, options)
        const result = await res.json()
        return result
    }
}

const linkig = readline.question("[+] Link Instagram: ");

if (linkig) {
    const sneptik = new igDown(linkig);
    sneptik.download().then(downloadlink => {
        if (downloadlink?.url) {
            console.log(downloadlink)
            try {
                const type = downloadlink.url[0].ext
                if (type === 'mp4') {
                    const foldername = './temp/' + downloadlink.meta.username + '/videos'
                    if (!fs.existsSync(foldername)) {
                        fs.mkdirSync(foldername, { recursive: true });
                    }
                    fetch(downloadlink.url[0].url)
                        .then(response => response.buffer())
                        .then(buffer => {
                            console.log(`[+] [${date()}] ${colors.green(`Downloading videos Instagram from @${downloadlink.meta.username}`)}`);
                            fs.writeFileSync(`./${foldername}/${downloadlink.meta.shortcode}.mp4`, buffer);
                        })
                        .catch(error => {
                            console.log(`[+] [${date()}] ${colors.red(`Error fetching video content: ${error}`)}`);
                        });
                } else if (type === 'jpg') {
                    const foldername = './temp/' + downloadlink.meta.username + '/images'
                    if (!fs.existsSync(foldername)) {
                        fs.mkdirSync(foldername, { recursive: true });
                    }
                    fetch(downloadlink.url[0].url)
                        .then(response => response.buffer())
                        .then(buffer => {
                            console.log(`[+] [${date()}] ${colors.green(`Downloading images Instagram from @${downloadlink.meta.username}`)}`);
                            fs.writeFileSync(`./${foldername}/${downloadlink.meta.shortcode}.jpg`, buffer);
                        })
                        .catch(error => {
                            console.log(`[+] [${date()}] ${colors.red(`Error fetching images content: ${error}`)}`);
                        });
                } else {
                    console.log(`[+] [${date()}] ${colors.red(`Format extension tidak valid.`)}`);
                }
            } catch (error) {
                console.log(`[+] [${date()}] ${colors.red(`Error fetching content: ${error}`)}`);
            }
        } else {
            console.log(`[+] [${date()}] ${colors.red(`Vidio tidak tersedia atau private.`)}`);
        }
    })
} else {
    console.log(`[+] [${date()}] ${colors.red(`Masukkan link kamu dengan benar.`)}`);
}