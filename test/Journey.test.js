const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());
 require('events').EventEmitter.defaultMaxListeners = 30;

const compiledFactory = require('../ethereum/build/JourneyFactory.json');
const compiledJourney = require('../ethereum/build/Journey.json');

let accounts;
let factory;
let journeyAddress;
let journey;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: '1000000' });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1000000'
  });

  [journeyAddress] = await factory.methods.getDeployedCampaigns().call();
  journey = await new web3.eth.Contract(
    JSON.parse(compiledJourney.interface),
    journeyAddress
  );
});

describe('Journeys', () => {
  it('deploys a factory and a journey', () => {
    assert.ok(factory.options.address);
    assert.ok(journey.options.address);
  });

  it('bergem caller as the journey driver', async () => {
    const driver = await journey.methods.manager().call();
    assert.equal(accounts[0], driver);
  });

  it('allows people to contribute money and bergem them as approvers', async () => {
    await journey.methods.contribute().send({
      value: '200',
      from: accounts[1]
    });
    const isContributor = await journey.methods.approvers(accounts[1]).call();
    assert(isContributor);
  });

  it('requires a minimum contribution', async () => {
    try {
      await journey.methods.contribute().send({
        value: '5',
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it('allows a passangers to make a payment request', async () => {
    await journey.methods
      .createRequest('Buy gas', '100', accounts[1])
      .send({
        from: accounts[0],
        gas: '1000000'
      });
    const request = await journey.methods.requests(0).call();

    assert.equal('Buy gas', request.description);
  });

  it('processes requests', async () => {
    await journey.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await journey.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000' });

    await journey.methods.approveRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    await journey.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });

    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
