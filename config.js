const initialDifficulty = 3;
const minerRate =  1000;
const GenesisData = {
    timestamp :1,
    lastHash : '-------',
    hash : 'hash-one',
    difficulty: initialDifficulty,
    nonce: 0,
    data:[]
};
module.exports = {GenesisData, minerRate, initialDifficulty};