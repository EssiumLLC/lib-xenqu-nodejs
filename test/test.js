const Xenqu = require('../dist');
const dotenv = require('dotenv');

dotenv.config();

const sub = process.env.XENQU_SUPER_ADMIN_SUBSCRIBER;
const cid = process.env.XENQU_CLIENT_ID
const cpk = process.env.XENQU_PRIVATE_KEY;
const cs = process.env.XENQU_CLIENT_SECRET;
const aid = process.env.XENQU_APP_ID;
const sp = process.env.XENQU_SITE_PROFILE;
const base_url = "https://stage.xenqu.com/api"

Xenqu.XenquAPIBoot(base_url, aid, sp).then(res => {
  // console.log(res);
});

const test_pk = new Xenqu.default(cid, cs, cpk, sub, base_url)

test_pk.init().then(res => {
  console.log("✅ Xenqu API Initialized");
  test_pk.account.getUserInfo().then(res => {
    console.log("✅ User Info");
  }).catch(err => {
    console.log("❌ User Info", err);
    process.exit(1);
  })
}).catch(err => {
  console.log("❌ Xenqu API Initialized (Unable to init using private key)");
  console.log(err);
  process.exit(1);
});
