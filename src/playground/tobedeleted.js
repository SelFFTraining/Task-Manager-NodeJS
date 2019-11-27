const bcrypt = require('bcrypt');

async function test() {
    let data = 'Testing123'
    let hashValue = '$2b$08$6/GBY7vL8vxujEZW5FROMOYGt51T0pQu.8tmcfzpwoBH4bXM5Afta';
   console.log(await bcrypt.compare(data, hashValue))
}
test()


