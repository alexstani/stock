var express = require('express');
var router = express.Router();

const Stock = require('./stock');

router.get('/stock',(req,res,next)=>{
    Stock.find(function(err,stock){
        res.json(stock)
    })
});

router.get('/stock/:name',(req,res,next)=>{
    Stock.find({companyName:req.params.name},function(err,stock){
        res.json(stock)
    })
});


router.get('/stocks/:symbol',(req,res,next)=>{
    Stock.find({symbol:req.params.symbol},function(err,stock){
        res.json(stock)
    })
});

router.post('/stock',(req,res,next)=>{
    const newStock = new Stock({
        companyName:req.body.companyName,
        symbol:req.body.symbol,
        marketCap:req.body.marketCap,
        currentMarketPriceofStock:req.body.currentMarketPriceofStock,
        stockPE:req.body.stockPE,
        dividendYield:req.body.dividendYield,
        ROCE:req.body.ROCE,
        ROE:req.body.ROE,
        debtToEquity:req.body.debtToEquity,
        EPS:req.body.EPS,
        reserves:req.body.reserves,
        debt:req.body.debt
    });
    newStock.save((err,stock)=>{
        if(err){
            res.json({msg:"failed to added"})
        }else{
            res.json({msg:"added successfully"})
        }
    })
});

router.put('/stock/:id',(req,res,next)=>{
    Stock.findByIdAndUpdate(req.params.id,req.body,function(err,post){
        if(err){
            res.json(err)
        }else{
            res.json(post)
        }
    })
});

router.delete('/stock/:id',(req,res,next)=>{
    Stock.remove({_id:req.params.id},function(err,result){
        if(err){
            res.json(err)
        }else{
            res.json(result)
        }
    })
});

module.exports = router;