export default function getNewBid(keywordRank, oldbid) {
    let betting;
    // if (oldbid > 400) {
    //     betting = 50;
    // } else {
    //     betting = 10;
    // }
    betting = 10;

    if (keywordRank > 3)
        return oldbid + betting;
    if (keywordRank < 3)
        return Math.max(oldbid - betting, 70);
    return oldbid;
}