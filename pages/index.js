import React, { Component } from 'react';
import { Card, Button } from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';

class JourneyIndex extends Component {
  static async getInitialProps() {
    const journeys = await factory.methods.getDeployedCampaigns().call();

    return { journeys };
  }

  renderJourneys() {
    const items = this.props.journeys.map(address => {
      return {
        header: address,
        description:  (
          <Link route={`/journeys/${address}`}>
            <a>View Journey</a>
          </Link>
        ),
        fluid: true
      };
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
    <Layout>
      <div>
        <h3>Available Journeys!</h3>

      <Link route="/journeys/new">
        <a>
         <Button
            floated="right"
            content="Creat Journey"
            icon="add circle"
            primary
          />
        </a>
      </Link>
        {this.renderJourneys()}
      </div>
    </Layout>
    );
  }
}

export default JourneyIndex;
