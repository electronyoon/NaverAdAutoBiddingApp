/* campaign eligibility */
import isAdEligible from './APIs/isAdEligible.js';
if (!isAdEligible) {
    console.log('Abort: Campaign is not eligible.\n\n');
    process.exit();
}


/* imports */
// import isKeywordPopular from './APIs/isKeywordPopular.js';
// import getMyRank from './APIs/getMyRank.js';
// import getMyRankWithProxy from './APIs/getMyRankWithProxy.js';
import getCurrentKeywords from './APIs/getCurrentKeywords.js';
import getMyRankWithNaver from './APIs/getMyRankWithNaver.js';
import putBid from './APIs/putBid.js';
import getNewBid from './util/getNewBid.js';
// import binarySearch from './util/binarySearch.js';
// import getBidLimit from './util/getBidLimit.js';
import dotenv from 'dotenv';
dotenv.config();
const keywords = await getCurrentKeywords();
const approvedKeywords = keywords.filter(obj => obj.inspectStatus === 'APPROVED');


/* working hour */
const curHour = new Date().getHours();
if (!(process.env.WORKING_HOUR_START < curHour < process.env.WORKING_HOUR_END)) {
    console.log(`Not working Hour::::: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}, maintain current session...\n\n`);
    await getMyRankWithNaver(approvedKeywords[0].keyword);  // for holding session
    process.exit();
}


/* main */
console.log(`Bidding starting from::::: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`);
for (const keyword of approvedKeywords) {
    
    let keywordRank;
    try {
        keywordRank = await getMyRankWithNaver(keyword.keyword);
    } catch (error) {
        console.error(error);
        continue;
    }
    
    const oldbid = keyword.bidAmt;
    let newbid
    if (keywordRank < 0) {  // if not found, assume it as underestimated
        newbid = getNewBid(3, oldbid);
    } else {
        newbid = getNewBid(keywordRank, oldbid);
    }

    // emailing
    if (newbid > process.env.BID_LIMIT) {
        console.warn(`Administrator should check. BidAmt has exceeded the limit:: newbid-->${newbid}`);
        continue;
    }

    // logging
    // const bidLimit = await getBidLimit(keyword.keyword);
    // if (bidLimit < newbid) {
    //     console.log(`${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} --X ${newbid} (exceeded limit: ${bidLimit})`);
    //     continue;
    // }
    if (oldbid === newbid) {
        console.log(`${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} === ${oldbid}`);
        continue;
    }
    if (oldbid < newbid)
        console.log(`${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} --> ${newbid}, raising↗↗↗`);
    if (oldbid > newbid)
        console.log(`${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} --> ${newbid}, lowering↘↘↘`);
    
    // bidding
    keyword.bidAmt = newbid;
    await putBid([keyword]);
}

console.log();
console.log();