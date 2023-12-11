export default function getNewBid(keywordRank, oldbid) {
    let betting = 10;
    if (oldbid > 1000) {
        betting = 100;
    } else if (oldbid > 400) {
        betting = 50;
    }

    if (keywordRank > 3)
        return oldbid + betting;
    if (keywordRank < 3)
        return Math.max(oldbid - betting, 70);
    return oldbid;
}
