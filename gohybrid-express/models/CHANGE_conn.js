const pgp = require("pg-promise")({
   query: e => {
      console.log("QUERY:", e.query);
   }
});

const options = {
   host: "", // change to your host, ex. localhost
   database: "", // change to your postgreSQL database
   user: "" // change to database user
};

const db = pgp(options);

module.exports = db;