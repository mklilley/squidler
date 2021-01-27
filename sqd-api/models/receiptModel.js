'use strict';

var Promise = require('bluebird');
var Request = require('request-promise');

var api = Api();
var Base = Model('Base');
var REDIS_PREFIX = Config('receipt.REDIS_PREFIX');
var redis = Redis();

var google = require('googleapis');
var stuff = require("../Squidler-google-stuff.json");
let key = stuff.private_key;
let email = stuff.client_email;
var jwtClient = new google.auth.JWT(email, null, key, ['https://www.googleapis.com/auth/androidpublisher'], null);
var androidpublisher;

jwtClient.authorize((err, tokens) => {
        if (err) {
            throw Error("Failed to authenticate the Google developer JWT for receipt validation");
        }
        androidpublisher = google.androidpublisher({auth:jwtClient,version:'v2'});
    });

var appleVerifyURL = "https://buy.itunes.apple.com/verifyReceipt";

var appleVerifyURL_TEST = "https://sandbox.itunes.apple.com/verifyReceipt";

var squidsBundle = Config('receipt.SQUIDS_BUNDLE');
var maxTimeDiff =  Config('receipt.MAX_TIME_DIFF');
var minTimeDiff =  Config('receipt.MIN_TIME_DIFF');



var clonable = {};

var modelSchema = {
    details:{
        type:'hash',
        enumerable:true,
        gettable:true,
        default:{}
    },
    username:{
        type:'string',
        enumerable:true,
        gettable:true,
        default:""
    },
    date:{
        type:'string',
        enumerable:true,
        gettable:true,
        default: (()=>{let date = new Date();
            date.setDate(date.getDate());
            return Math.floor(date.getTime()/1000);})
    },
    credits:{
        type:'string',
        enumerable:true,
        gettable:true,
        default:""
    }
};


class Receipt extends Base{

    constructor(data){

        super(modelSchema,data,{});


    }



}

Receipt.prototype.verify          = Promise.coroutine(verify);
Receipt.prototype.model    = Promise.coroutine(model);
Receipt.model    = Promise.coroutine(model);

    /////////////////////////////////////

function* model(){
    return  modelSchema
}

       function* verify(authUser) {

           let details = this.details;


               if(details.os==="android"){

                   let googleReceipt = JSON.parse(details.receipt);

                   var params = {packageName:googleReceipt.packageName,productId:googleReceipt.productId,token:googleReceipt.purchaseToken};


                    let response = yield Promise.promisify(androidpublisher.purchases.products.get)(params)
                       .catch(function(err) {
                           if(err.code===400){
                               throw new SqdError({message:"Sorry, this does not appear to be a valid purchase, please contact the Squidler Team",code:400});
                           }
                           else {
                               throw new SqdError({message:"Sorry, something went wrong validating your purchase with Google. Please try again.",code:500});
                           }

                       });

                   if(response.purchaseState===0 && response.consumptionState===1){
                       let now = new Date().getTime();

                       let timeDiff =  now - response.purchaseTimeMillis;
                       let isRecentPurchase = (timeDiff < maxTimeDiff && timeDiff > minTimeDiff);

                       if(isRecentPurchase){
                           return
                       }
                       else{
                           throw new SqdError({message:"Sorry, this does not appear to be a valid purchase, please contact the Squidler Team",code:400});
                       }

                   }
                   else{
                       throw new SqdError({message:"Sorry, this does not appear to be a valid purchase, please contact the Squidler Team",code:400});
                   }




               }

           else if(details.os==="ios"){

                   let options = {
                       method: 'POST',
                       uri: appleVerifyURL,
                       body: {"receipt-data":details.receipt},
                       json: true
                   };


                   let response = yield Request(options).catch(function(err) {
                               throw new SqdError({message:"Sorry, something went wrong validating your purchase with Apple. Please try again.",code:500});

                       });


                   if(response.status==0){
                       let now = new Date().getTime();
                       
                       let isFromSquidler = response.receipt.bundle_id ==="com.squidler" && response.receipt.app_item_id == 1133896864;
                       let isCorrectSquidlerProduct = response.receipt.in_app[0].product_id == "credits"+"_"+ squidsBundle;
                       let hasValidTrasactionId = response.receipt.in_app[0].transaction_id == details.transactionId;
                       let timeDiff =  now - response.receipt.in_app[0].purchase_date_ms;
                       let isRecentPurchase = (timeDiff < maxTimeDiff && timeDiff > minTimeDiff);

                       if(isFromSquidler && isCorrectSquidlerProduct && hasValidTrasactionId && isRecentPurchase){
                               return
                           }
                       else{
                               throw new SqdError({message:"Sorry, this does not appear to be a valid purchase, please contact the Squidler Team",code:400});
                           }
                   }
                   else{
                       throw new SqdError({message:"Sorry, this does not appear to be a valid purchase, please contact the Squidler Team",code:400});
                   }



               }
           else{
                   throw new SqdError({message:"Sorry, this does not appear to be a valid purchase, please contact the Squidler Team",code:400});
               }

       }






///////////////////////////////////////////////////////////////////

module.exports.model = Receipt;
