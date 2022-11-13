const { getBIP44AddressKeyDeriver } = require('@metamask/key-tree');
const { deriveBIP44AddressKey } = require('@metamask/key-tree');

let PRIVATE_KEY;

async function getFees() {
  let response = await fetch('https://www.etherchain.org/api/gasPriceOracle');
  return response.text();
}

module.exports.onRpcRequest = async ({originString, requestObject}) => {
  console.log('Inside$$');
  switch (requestObject.method) {
    case 'hello':
      const fees = await getFees();
      const result = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `Hello, ${originString}!`,
            description: 'Gas Price',
            textAreaContent: 'Current fee estimates ' + fees,
          },
        ],
      });

    case 'world':
      const rawBip44Entropy = await wallet.request({
        method: 'snap_getBip44Entropy_60',
      });

      PRIVATE_KEY = await deriveBIP44AddressKey(rawBip44Entropy, {
        account: 0,
        change: 0,
        address_index: 0,
      })

      console.log("PRIVATE_KEY: ", PRIVATE_KEY);
      console.log("private_key: ", PRIVATE_KEY.privateKey);
      console.log("Address: ", PRIVATE_KEY.address);

      // await wallet.request({
      //   method: 'snap_notify',
      //   params: [
      //     {
      //       type: 'native',
      //       message: `Private Key Exported`,
      //     },
      //   ],
      // });

      // await wallet.request({
      //   method: 'snap_manageState',
      //   params: ['update', {PrivateKey: PRIVATE_KEY.privateKey}],
      // });
      
      // const data = await wallet.request({
      //   method: 'snap_manageState',
      //   params: ['get'],
      // });
      
      // console.log('here ', data);

      const res = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: `User Keys`,
            description: '',
            textAreaContent: `${PRIVATE_KEY.privateKey}`
          },
        ],
      });

      console.log(res);
      if(res == true){
        console.log('Inside True');
        console.log(PRIVATE_KEY.privateKey);
        return PRIVATE_KEY.privateKey;
      }
      else {
        console.log('Inside False');
      }
      // if(result == true) {
      //   return PRIVATE_KEY.privateKey;
      // }
      // else {
      //   return "User rejected the request";
      // }

    default:
      throw new Error('Method not found.');
  }
};
