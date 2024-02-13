const { PORT = 5001 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

const listener = () => console.log(`Listening on Port ${PORT}!`);

knex.migrate
  .latest()
  .then((migrations) => {
      console.log("migrations", migrations);
  })
  .then(() => {
      return knex.seed.run();
  })
  .then((seeds) => {
      console.log('seeds', seeds);
  })
  .then(() => {
      app.listen(PORT, listener);
  })
  .catch(console.error);
