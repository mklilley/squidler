exports['default'] = {
    user: function(api){
        var UserConfig = {
            REDIS_PREFIX: "user",
            INITIAL_CREDITS:parseInt(process.env.SQD_INITIAL_CREDITS)
        };
        return UserConfig;
    }
};
