exports['default'] = {
    file: function(api){
        var FileConfig = {
            REDIS_PREFIX: "file",
            BASE: process.env.SQD_FILE_BASE,
            PATH: process.env.SQD_FILE_PATH,
            MONGO_CONNECT: process.env.SQD_MONGO_CONNECT,
            INF_TIME_SEC:4607280000,
            INF_DATE: new Date("2117-01-01"),
            UPDATE_ROUTE:process.env.SQD_FILE_IP + "/api/1/file/update/",
            DELETE_ROUTE:process.env.SQD_FILE_IP + "/api/1/file/delete/"
        };
        return FileConfig;
    }
};
