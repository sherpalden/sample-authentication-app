const router =  require('express').Router();

//swagger docs routes
const yaml = require('yamljs');
const swaggerUi = require('swagger-ui-express');
const swagOpt = {
  // explorer: true,
  swaggerOptions: {
    validatorUrl: null,
    // urls: [
    //   {
    //     url: 'http://localhost:5000/api-docs/userAPI.yaml',
    //     name: 'Spec1'
    //   },
    // ]
  }
};
const userAPI = yaml.load('./api-docs/userAPI.yaml');
router.use('/', swaggerUi.serve, swaggerUi.setup(userAPI, swagOpt));

module.exports = router;