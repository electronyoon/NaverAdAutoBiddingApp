import isAdEligible from './APIs/isAdEligible.js';
if (!isAdEligible) {
    console.log('Abort: Campaign is not eligible.');
    process.exit();
}
console.log(`Bidding starting from::::: ${new Date().toISOString()}`);


import getCurrentKeywords from './APIs/getCurrentKeywords.js';
const keywords = await getCurrentKeywords();
const approvedKeywords = keywords.filter(obj => obj.inspectStatus === 'APPROVED')
import getNewBid from './util/getNewBid.js';
import isKeywordPopular from './APIs/isKeywordPopular.js';
import getMyRank from './APIs/getMyRank.js';
import getMyRankWithProxy from './APIs/getMyRankWithProxy.js';
import putBid from './APIs/putBid.js';

for (const keyword of approvedKeywords) {
    let keywordRank;
    const oldbid = keyword.bidAmt;
    const newbid = getNewBid(keywordRank, oldbid);
    
    const isPop = await isKeywordPopular(keyword.keyword);
    if (isPop) {
        keywordRank = await getMyRankWithProxy(keyword.keyword);
    } else {
        keywordRank = await getMyRank(keyword.keyword);
    }

    // emailing
    if (keywordRank < 0) {
        console.warn(`Administrator should check. Keyword is not found:: keyword-->${keyword.keyword}`);
        continue;
    }
    if (newbid > 7000) {
        console.warn(`Administrator should check. BidAmt has exceeded the limit:: newbid-->${newbid}`);
        continue;
    }

    // logging
    if (oldbid === newbid) {
        console.log(`keyword: ${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} === ${oldbid}`);
        continue;
    }
    if (oldbid < newbid)
        console.log(`keyword: ${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} --> ${newbid}, raising↗↗↗`);
    if (oldbid > newbid)
        console.log(`keyword: ${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} --> ${newbid}, lowering↘↘↘`);
    
    // bidding
    keyword.bidAmt = newbid;
    await putBid([keyword]);
}