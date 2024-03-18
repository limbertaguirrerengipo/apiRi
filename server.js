const  express = require("express");
const bodyParser = require('body-parser');
const env = process.env.NODE_ENV || 'development';
const appConfig = require('./src/config/app.json')[env];
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const port = 4004;
const app = express();
const cors = require('cors');
const basicAuth = require('express-basic-auth');
const fs = require('fs')

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.raw({ extended: true, limit: '50mb' }));
app.use(express.json());

console.log('env: ', env);
if (env == 'development'){
    const specs = swaggerJsDoc(require('./src/config/swagger.json'));
    specs.servers = [{url: appConfig.serverConfigurations.url}];
    app.use('/api-docs', 
    swaggerUi.serve,
    swaggerUi.setup(specs, {explorer: true}))
}


/*app.get('/', (request, response) => {
    response.send({
        message: 'Node.js and Express REST API'}
    );
});*/
app.use('/static', express.static(__dirname + '/public'));
appConfig.apiVersions.forEach((version) => {
    const routeDirectory = `./src/routes/${version}`;
    const fileList = fs.readdirSync(routeDirectory);
    console.log('fileList: ', fileList);
    fileList.forEach(file => {
        if(appConfig.activarBasicAuth){
            app.use(basicAuth({
                users: appConfig.authorizedUsers
            }));
            app.use(`/${version}`, require(routeDirectory + '/' + file));
        }else{
            app.use(`/${version}`, require(routeDirectory + '/' + file));  
        }
        //app.use(`/${version}`, require(routeDirectory + '/' + file));
    });
});

app.listen(port, (error) => {
    if (error) return console.log(`Error: ${error}`);
        console.log(`app listening on port ${port}`);
});
