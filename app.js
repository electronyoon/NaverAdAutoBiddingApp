import isAdEligible from './APIs/isAdEligible.js';
if (!isAdEligible) {
    console.log('Abort: Campaign is not eligible.');
    process.exit();
}
console.log(`Bidding starting from: ${new Date().toISOString().replace(/T/, '-').replace(/\..+/, '')}`);

// function getNewBidByRounding(keywordRank, oldbid) {
//     if (keywordRank > 2)
//         return Math.floor(oldbid / 100) * 100 + 100;
//     if (keywordRank < 2)
//         return Math.max(Math.floor(oldbid / 100) * 100 - 100, 70);
//     return oldbid;
// }
function getNewBid(keywordRank, oldbid) {
    let betting;
    if (oldbid > 1000) {
        betting = 100;
    } else if (oldbid > 400) {
        betting = 50;
    } else {
        betting = 20;
    }

    if (keywordRank > 2)
        return oldbid + betting;
    if (keywordRank < 2)
        return Math.max(oldbid - betting, 70);
    return oldbid;
}


import getCurrentKeywords from './APIs/getCurrentKeywords.js';
const keywords = await getCurrentKeywords();
import getMyRank from './APIs/getMyRank.js';
import putBid from './APIs/putBid.js';
for (const keyword of keywords.filter(obj => obj.inspectStatus === 'APPROVED')) {

    const keywordRank = await getMyRank(keyword.keyword);
    const oldbid = keyword.bidAmt;
    const newbid = getNewBid(keywordRank, oldbid);

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
        continue
    }
    if (oldbid < newbid)
        console.log(`keyword: ${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} --> ${newbid}, raising↗↗↗`);
    if (oldbid > newbid)
        console.log(`keyword: ${keyword.keyword}, rank: ${keywordRank}, bidAmt: ${oldbid} --> ${newbid}, lowering↘↘↘`);
    
    // bidding
    keyword.bidAmt = newbid;
    await putBid([keyword]);

}