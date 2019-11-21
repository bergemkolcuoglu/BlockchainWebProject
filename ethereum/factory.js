import web3 from './web3';
import JourneyFactory from './build/JourneyFactory.json';

const instance = new web3.eth.Contract(
  JSON.parse(JourneyFactory.interface),
  '0x064F9b82B86846Ca7388f4d3aEbb803B04b099fE'
);

export default instance;
