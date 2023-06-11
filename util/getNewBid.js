export default function getNewBid(keywordRank, oldbid) {
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