exports['default'] = {
    squidle: function(api){
        var SquidleConfig = {
            REDIS_PREFIX: "squidle",
            costPerCharacter: parseInt(process.env.SQD_CREDITS_DISABLE_HINTS),
            costPerHint: parseInt(process.env.SQD_CREDITS_HINT),
            EXPIRY_HRS: parseInt(process.env.SQD_SQUIDLE_EXPIRY_HRS),
            EXPIRY_HRS_MAX:parseInt(process.env.SQD_SQUIDLE_EXPIRY_HRS_MAX)
        };
        return SquidleConfig;
    }
};
