exports['default'] = {
    receipt: function(api){
        var ReceiptConfig = {
            REDIS_PREFIX: "receipt",
            GOOGLE_JWT_KEY:process.env.SQD_GOOGLE_JWT_KEY,
            GOOGLE_JWT_EMAIL:process.env.SQD_GOOGLE_JWT_EMAIL,
            SQUIDS_BUNDLE:parseInt(process.env.SQD_SQUIDS_BUNDLE),
            MIN_TIME_DIFF : -1000 * 60 * 60,
            MAX_TIME_DIFF : 1000 * 60 * 60 * 24 * 3
        };
        return ReceiptConfig;
    }
};
