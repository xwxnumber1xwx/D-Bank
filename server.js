var express = require("express");
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// MongoDb credentials
const URL = "mongodb+srv://ibmpod:XXuaRmIfm1pyKzky@d-bank-rv4np.mongodb.net/test?retryWrites=true&w=majority";
const DB = 'catalog';
const COLLECTION = 'customer-catalog';

/* serves main page */
app.get("/", function (req, res) {
    res.sendfile('index.html')
});

app.post("/api/user_info", function (req, res) {
    const query = { cust_catag: req.body.query };
    console.log('query', query);
    /* Connect to Mongo DB */
    const client = new MongoClient(URL, { useNewUrlParser: true });
    client.connect(err => {
        if (err) throw err;
        const collection = client.db(DB).collection(COLLECTION);
        // perform actions on the collection object
        console.log(collection);
        collection.find(query).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            client.close();
            res.send(JSON.stringify(result));
        });
        //res.send(JSON.stringify(collection));
    });
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    console.log('static file request : ' + req.params);
    res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Listening on " + port);
});