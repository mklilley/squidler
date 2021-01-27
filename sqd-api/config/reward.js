exports['default'] = {
    reward: function(api){
        var ReewardConfig = {
            SECRET: {
                vungle:{
                    ios: process.env.SQD_VUNGLE_SECRET_IOS,
                    android: process.env.SQD_VUNGLE_SECRET_ANDROID
                }
            },
            REDIS_PREFIX: "reward",
            MIN_TIME_DIFF : -1000 * 60 * 60,
            MAX_TIME_DIFF : 1000 * 60 * 60 * 24 * 3,
            CREDITS : parseInt(process.env.SQD_CREDITS_REWARD)
        };
        return ReewardConfig;
    }
};
