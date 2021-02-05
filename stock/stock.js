const mongoose = require('mongoose');

const StockSchema = mongoose.Schema({
    companyName:{
        type:String,
        required:false
    },
    symbol:{
        type:String,
        required:false
    },
    marketCap:{
        type:String,
        required:false
    },
    currentMarketPriceofStock:{
        type:String,
        required:false
    },
    stockPE:{
        type:String,
        required:false
    },
    dividendYield:{
        type:String,
        required:false
    },
    ROCE:{
        type:String,
        required:false
    },
    ROE:{
        type:String,
        required:false
    },
    debtToEquity:{
        type:String,
        required:false
    },
    EPS:{
        type:String,
        required:false
    },
    reserves:{
        type:String,
        required:false
    },
    debt:{
        type:String,
        required:false
    }
});

const Stock = module.exports = mongoose.model('Stock',StockSchema);