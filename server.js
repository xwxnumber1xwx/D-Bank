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


/* serves main page */
app.get("/", function (req, res) {
    res.sendfile('index.html')
});

/* API get house list */
app.get("/api/real_estate", function(req, res) {
    const DB = 'real_estates';
    const COLLECTION = 'real_estates_catalog';
    const query = { price: { $lte : +req.query.credit_limit }};
    mongoConnect(URL, query, DB, COLLECTION, res);

})

app.get('/api/mainframe/:id', function(req, res) {
    const result = {
        CUSTREADOperationResponse: {
            ws_cust_rec: {
                cust_code: "21018",
                cust_catg: "C"
            }
        }
    }
    res.status(200).send(JSON.stringify(result));
})

/* API get user info */
app.post("/api/user_info", function (req, res) {
    const DB = 'catalog';
    const COLLECTION = 'customer-catalog';
    const query = { cust_catag: req.body.query };
    console.log('connecting, req, res', req, res);
    /* Connect to Mongo DB */
    mongoConnect(URL, query, DB, COLLECTION, res)
});

function mongoConnect(url, query, db, coll, response) {
    const client = new MongoClient(url, { useNewUrlParser: true });
    client.connect(err => {
        console.log('connect, err', err);
        if (!err) {
            const collection = client.db(db).collection(coll);
            console.log('collection', collection);
            // perform actions on the collection object
            collection.find(query).limit(3).toArray(function (err, result) {
                if (!err) {
                    client.close();
                    response.status(200).send(result);
                } else {
                    response.status(500).send({error: 'Connection to MongoDB failed'});
                }

            });
            //res.send(JSON.stringify(collection));
        } else {
            response.status(500).send({error: 'Connection to MongoDB failed'});
        }

    });
}

/* serves all the static files */
app.get(/^(.+)$/, function (req, res) {
    res.sendfile(__dirname + req.params[0]);
});

var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Listening on " + port);
});