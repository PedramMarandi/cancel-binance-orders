var express = require('express')
const Binance = require('node-binance-api');
const fs = require('fs');

var app = express();

const binance = new Binance().options({
    APIKEY: '',
    APISECRET: ''
});

async function cancelOpenOrders() {
    const pairs = await loadPairs();
    for(const pair of pairs) {
        try { 
            await binance.futuresCancelAll(pair);
        } catch(e) {
            console.log(`Error whilst cancelling orders for pair ${pair}`)
            console.log(e);
        }
    }
}

async function loadPairs() {
    const path = './pairs.csv';
    try {
        const pairs = await fs.readFileSync(path)?.toString().split('\n');
        if(!pairs?.length) {
            throw new Error(`No pair in ${path} file.`)
        }
        return pairs;
    } catch(e) {
        console.error("Error Reading pairs: ")
        console.log(e);
    }
}

const port = process.env.PORT || 4020;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
app.post('/cancel-orders', async function (req, res) {
    await cancelOpenOrders();
});

