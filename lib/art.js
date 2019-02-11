const emoji = require('node-emoji');

/* 
  TODO
  - Add themes that can be swapped
  - Allow custom emojis
  - Coin art!
*/

const headsArt = emoji.get('grinning');
const tailsArt = emoji.get('peach');

module.exports = { headsArt, tailsArt };
