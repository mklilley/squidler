exports['default'] = {
    auth: function(api){
        var AuthConfig = {
            REDIS_PREFIX: "auth",
            SECRET: {
                salt: process.env.SQD_API_AUTH_HASH_SALT,
                iterations: process.env.SQD_API_AUTH_HASH_ITERATIONS,
                bytes: process.env.SQD_API_AUTH_HASH_BYTES,
                algo: process.env.SQD_API_AUTH_HASH_ALGO,
            },
        };
        return AuthConfig;
    }
};
