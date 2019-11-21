const routes = require('next-routes')();

routes
  .add('/journeys/new', '/campaigns/new')
  .add('/journeys/:address', '/campaigns/show')
  .add('/journeys/:address/requests', '/campaigns/requests/index')
  .add('/journeys/:address/requests/new', '/campaigns/requests/new');

module.exports = routes;
