const Scry = require('./index');
const s = new Scry();

s.cards().then(x => console.log(x))
