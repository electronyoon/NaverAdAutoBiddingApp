import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

const RAYOBYTE_API_KEY = process.env.RAYOBYTE_API_KEY;
const AD_TARGET_URL = process.env.AD_TARGET_URL;
const proxyUrl = `https://api.scrapingrobot.com/?token=${RAYOBYTE_API_KEY}&url=`;
const pcUrl = 'https://ad.search.naver.com/search.naver?where=ad&query=';
const mobileUrl = 'https://m.ad.search.naver.com/search.naver?sm=&where=m_expd&query=';

const getMyRankWithProxy = async (queryKeyword) => {
    let $
    try {
        const pcResponse = await axios.get(`${proxyUrl}${pcUrl}${encodeURIComponent(queryKeyword)}`, { timeout: 10000 });
        $ = cheerio.load(pcResponse.data.result);
        const pcElements = $('.url');
        const pcRanks = pcElements.map((_, element) => {
            return element.children[0].data;
        }).get();
        const pcRank = pcRanks.indexOf(AD_TARGET_URL);

        const mobileResponse = await axios.get(`${proxyUrl}${mobileUrl}${encodeURIComponent(queryKeyword)}`, { timeout: 10000 });
        $ = cheerio.load(mobileResponse.data.result);
        const mobileElements = $('.url_link');
        const mobileRanks = mobileElements.map((_, element) => {
            return element.children[0].data;
        }).get();
        const mobileRank = mobileRanks.indexOf(AD_TARGET_URL);

        return Math.max(pcRank, mobileRank);
    } catch (error) {
        console.error('Error:', error);
        return -1;
    }
};

export default getMyRankWithProxy;