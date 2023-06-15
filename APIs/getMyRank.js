import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
dotenv.config();

const AD_TARGET_URL = process.env.AD_TARGET_URL;
// const pcUrl = 'https://ad.search.naver.com/search.naver?where=ad&query=';
const mobileUrl = 'https://m.ad.search.naver.com/search.naver?sm=&where=m_expd&query=';

const getMyRank = async (queryKeyword) => {
    try {
        // const pcResponse = await axios.get(`${pcUrl}${encodeURIComponent(queryKeyword)}`, { timeout: 10000 });
        // let $ = cheerio.load(pcResponse.data);
        // const pcElements = $('.url');
        // const pcRanks = pcElements.map((_, element) => {
        //     return element.children[0].data;
        // }).get();
        // const pcRank = pcRanks.indexOf(AD_TARGET_URL);

        const mobileResponse = await axios.get(`${mobileUrl}${encodeURIComponent(queryKeyword)}`, { timeout: 10000 });
        $ = cheerio.load(mobileResponse.data);
        const mobileElements = $('.url_link');
        const mobileRanks = mobileElements.map((_, element) => {
            return element.children[0].data;
        }).get();
        const mobileRank = mobileRanks.indexOf(AD_TARGET_URL);

        // return Math.max(pcRank, mobileRank);
        return mobileRank;
    } catch (error) {
        console.error('Error:', error);
        return -1;
    }
};

export default getMyRank;