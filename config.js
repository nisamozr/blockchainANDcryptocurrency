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
const startingBalance = 1000;

const reward_input ={
    address : 'authorzed rewarde'
}
const miningReward = 50
module.exports = {GenesisData, minerRate, initialDifficulty,startingBalance, reward_input, miningReward};