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
    console.log('connecting, req, res', req, res);
    /* Connect to Mongo DB */
    const client = new MongoClient(URL, { useNewUrlParser: true });
    client.connect(err => {
        console.log('connect, err', err);
        if (!err) {
            const collection = client.db(DB).collection(COLLECTION);
            console.log('collection', collection);
            // perform actions on the collection object
            collection.find(query).toArray(function (err, result) {
                if (!err) {
                    client.close();
                    res.status(200).send(result);
                } else {
                    res.status(500).send({error: 'Connection to MongoDB failed'});
                }

            });
            //res.send(JSON.stringify(collection));
        } else {
            res.status(500).send({error: 'Connection to MongoDB failed'});
        }

    });
});

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Listening on " + port);
});