import axios from 'axios';
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
        Authorization: `Bearer ${token}`
    },
    timeout: 10000,
    // proxy: {
    //     protocol: 'http',
    //     host: '127.0.0.1',
    //     port: 8080,
    // }
}
const getMyRankWithNaver = async (keyword) => {
    let trial = 3;
    while (trial > 1) {
        try {
            const pcUrl = `https://manage.searchad.naver.com/api/ncc/keywords/preview?keyword=${encodeURIComponent(keyword)}&regionalCode=11185106&channelAlias=naver.search.pc.pl`;
            const pcResponse = await axios.get(pcUrl, config);
            // const pcRank = JSON.parse(pcResponse.data).findIndex(obj => obj.headline === process.env.AD_TARGET_TITLE) + 1;
            const pcRank = pcResponse.data.findIndex(obj => obj.headline === process.env.AD_TARGET_TITLE);
            
            const mobileUrl = `https://manage.searchad.naver.com/api/ncc/keywords/preview?keyword=${encodeURIComponent(keyword)}&regionalCode=11185106&channelAlias=mnaver.tab.m.all`;
            const mobileResponse = await axios.get(mobileUrl, config);
            // const mobileRank = JSON.parse(mobileResponse.data).findIndex(obj => obj.headline === process.env.AD_TARGET_TITLE) + 1;
            const mobileRank = mobileResponse.data.findIndex(obj => obj.headline === process.env.AD_TARGET_TITLE);

            if (pcRank < 0)
                return mobileRank;
            if (mobileRank < 0)
                return pcRank;
            // return Math.max(pcRank, mobileRank);
            return mobileRank;
        } catch (error) {
            console.error(`"${keyword}" Error: 3초 뒤 한번 더 시도합니다(${trial-1}/3) ${error.response}`);
            await new Promise(resolve => setTimeout(resolve, 3000));
            trial--;
        }
    }
    throw new Error(`"Keyword is not found:: ${keyword}" Error: 3회 시도 중 모두 실패했습니다.`);
};

export default getMyRankWithNaver;