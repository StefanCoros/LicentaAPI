const express = require("express");
const router = express.Router();

// users
{
  const usersRouter = require("./routes/users");
  router.use("/users", usersRouter);
}

// swagger ui
{
  // const bodyParser = require("body-parser");
  const swaggerUi = require("swagger-ui-express");
  const swaggerUiRouter = require("./routes/swagger-ui");

  router.use("/", swaggerUi.serve, swaggerUiRouter);
}

module.exports = router;
