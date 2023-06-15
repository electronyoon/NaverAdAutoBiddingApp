import axios from 'axios';
// import dotenv from 'dotenv';
// dotenv.config();

// for test
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
dotenv.config({
    path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
});

import AdAuthorizations from '../util/AdAuthorizations.js';
const token = await AdAuthorizations.token();
const config = {
    headers: {
        Authorization: `Bearer ${token}`,
        Referer: process.env.REFERER
    },
    timeout: 3000
}
const getMyRankWithNaver = async (keyword) => {
    let trial = 3;
    while (trial > 1) {
        try {
            // const pcUrl = `https://manage.searchad.naver.com/api/ncc/keywords/preview?keyword=${encodeURIComponent(keyword)}&regionalCode=11185106&channelAlias=naver.search.pc.pl`;
            // await new Promise(resolve => setTimeout(resolve, 100));
            // const pcResponse = await axios.get(pcUrl, config);
            // const pcRank = JSON.parse(pcResponse.data).findIndex(obj => obj.headline === process.env.AD_TARGET_TITLE) + 1;
            
            const mobileUrl = `https://manage.searchad.naver.com/api/ncc/keywords/preview?keyword=${encodeURIComponent(keyword)}&regionalCode=11185106&channelAlias=mnaver.tab.m.all`;
            await new Promise(resolve => setTimeout(resolve, 100));
            const mobileResponse = await axios.get(mobileUrl, config);
            const mobileRank = JSON.parse(mobileResponse.data).findIndex(obj => obj.headline === process.env.AD_TARGET_TITLE) + 1;
            if (mobileRank === 0)
                console.log(JSON.stringify(mobileResponse.data,null,2));
    
            // return Math.max(pcRank, mobileRank);
            return mobileRank;
        } catch (error) {
            console.error(`Error: 1초 뒤 한번 더 시도합니다(${trial-1}/3) ${error.response.data}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            trial--;
        }
    }
    return -1;
};

export default getMyRankWithNaver;