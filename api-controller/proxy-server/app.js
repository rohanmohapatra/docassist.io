const express = require('express');
var cors = require('cors');
const proxy = require('http-proxy-middleware');

// Config
const { routes } = require('./config.json');

const app = express();
app.use(cors());
for (route of routes) {
     console.log(route.route, route.address);
    app.use(route.route,
        proxy({
            target: route.address,
            pathRewrite: (path, req) => {
                return path.split('/').slice(3).join('/')+'/'; // Could use replace, but take care of the leading '/'
            }
        })
    );
}

app.listen(5000, () => {
    console.log('Proxy listening on port 5000');
});