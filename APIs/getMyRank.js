import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

// for test
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// dotenv.config({
//     path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env'),
// });

const RAYOBYTE_API_KEY = process.env.RAYOBYTE_API_KEY;

const proxyUrl = `https://api.scrapingrobot.com/?token=${RAYOBYTE_API_KEY}&url=`;
const pcUrl = 'https://ad.search.naver.com/search.naver?where=ad&query=';
const mobileUrl = 'https://m.ad.search.naver.com/search.naver?sm=&where=m_expd&query=';

const getMyRank = async (queryKeyword) => {
    const AD_TARGET_URL = process.env.AD_TARGET_URL;
    try {
        // console.log(`reaching for pc proxy...url: ${proxyUrl}${pcUrl}${encodeURIComponent(queryKeyword)}`);
        const pcResponse = await axios.get(`${proxyUrl}${pcUrl}${encodeURIComponent(queryKeyword)}`);
        let $ = cheerio.load(pcResponse.data.result);
        const pcElements = $('.url');
        const pcRanks = pcElements.map((_, element) => {
            return element.children[0].data;
        }).get();
        const pcRank = pcRanks.indexOf(AD_TARGET_URL);
        // if (pcRank !== -1) {
        //     console.log(`pc rank found. keyword: ${queryKeyword}, rank: ${pcRank}`);
        // } else {
        //     console.error(`pc rank not found! keyword: ${queryKeyword}, rank: ${pcRank}`);
        // }

        // console.log(`reaching for mobile proxy...url: ${proxyUrl}${pcUrl}${encodeURIComponent(queryKeyword)}`);
        const mobileResponse = await axios.get(`${proxyUrl}${mobileUrl}${encodeURIComponent(queryKeyword)}`);
        $ = cheerio.load(mobileResponse.data.result);
        const mobileElements = $('.url_link');
        const mobileRanks = mobileElements.map((_, element) => {
            return element.children[0].data;
        }).get();
        const mobileRank = mobileRanks.indexOf(AD_TARGET_URL);
        // if (mobileRank !== -1) {
        //     console.log(`mobile rank found. keyword: ${queryKeyword}, rank: ${mobileRank}`);
        // } else {
        //     console.error(`mobile rank not found! keyword: ${queryKeyword}, rank: ${mobileRank}`);
        // }

        return Math.max(pcRank, mobileRank);
    } catch (error) {
        console.error('Error:', error);
        return -1;
    }
};

export default getMyRank;