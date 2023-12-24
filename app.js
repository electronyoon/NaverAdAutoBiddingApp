import isAdEligible from './APIs/isAdEligible.js';
if (!isAdEligible) {
    console.log('Abort: Campaign is not eligible.');
    process.exit();
}


import getCurrentKeywords from './APIs/getCurrentKeywords.js';
const keywords = await getCurrentKeywords();
const approvedKeywords = keywords.filter(obj => obj.inspectStatus === 'APPROVED')
import getNewBid from './util/getNewBid.js';
// import isKeywordPopular from './APIs/isKeywordPopular.js';
// import getMyRank from './APIs/getMyRank.js';
// import getMyRankWithProxy from './APIs/getMyRankWithProxy.js';
import getMyRankWithNaver from './APIs/getMyRankWithNaver.js';
import putBid from './APIs/putBid.js';
import getBidLimit from './util/getBidLimit.js';


const curHour = new Date().getHours();
if (curHour < 8 || curHour > 22) {
    console.log(`Not working Hour::::: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}, maintain current session...\n\n`);
    await getMyRankWithNaver(approvedKeywords[0].keyword);  // for holding session
    process.exit();
}


console.log(`Bidding starting from::::: ${new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '')}`);
for (const keyword of approvedKeywords) {
    const keywordRank = await getMyRankWithNaver(keyword.keyword);
    const oldbid = keyword.bidAmt;
    let newbid = getNewBid(keywordRank, oldbid);
    // if not found, upranking until appearing
    if (keywordRank === 0)
        newbid = getNewBid(4, oldbid);

    // emailing
    if (keywordRank === -1) {
        console.warn(`Administrator should check. Keyword is not found:: keyword-->${keyword.keyword}`);
        continue;
    }
    if (newbid > 3000) {
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