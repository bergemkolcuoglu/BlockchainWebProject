import web3 from './web3';
import Journey from './build/Journey.json';

export default address => {
  return new web3.eth.Contract(JSON.parse(Journey.interface), address);
};
