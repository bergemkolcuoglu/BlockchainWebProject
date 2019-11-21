import React, { Component } from 'react';
import { Card, Grid, Button } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import Journey from '../../ethereum/journey';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class JourneyShow extends Component {
  static async getInitialProps(props) {
    const journey = Journey(props.query.address);

    const summary = await journey.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: summary[1],
      requestsCount: summary[2],
      approversCount: summary[3],
      driver: summary[4],
      from: summary[5],
      to: summary[6],
      time: summary[7]
    };
  }

  renderCards() {
    const {
      balance,
      driver,
      minimumContribution,
      requestsCount,
      approversCount,
      from,
      to,
      time
    } = this.props;

    const items = [
      {
        header: driver,
        meta: 'Address of Driver',
        description:
          'The driver created this journey and can create requests to withdraw money',
        style: { overflowWrap: 'break-word' }
      },
      {
        header: from,
        meta: 'Arrival points of driver',
        description:
          'Arrival point is here'
      },
      {
        header: to,
        meta: 'Departure points of driver',
        description:
          'Departure point is here'
      },
      {
        header: time,
        meta: 'Time',
        description:
          'Departure time is 14.00.'
      },
      {
        header: minimumContribution,
        meta: 'Minimum Contribution (wei)',
        description:
          'You must contribute at least this much wei to become an passanger'
      },
      {
        header: requestsCount,
        meta: 'Number of Requests',
        description:
          'A request tries to withdraw money from the contract. Requests must be approved by passangers'
      },
      {
        header: approversCount,
        meta: 'Number of Passangers',
        description:
          'Number of people who have already paid to this journey'
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: 'Journey Balance (ether)',
        description:
          'The balance is how much money this journey has left to spend.'
      }
    ];

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Journey Show</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>{this.renderCards()}</Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/journeys/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default JourneyShow;
