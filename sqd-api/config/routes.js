exports['default'] = {
  routes: function(api){
    return {


      post: [
        { path: '/:apiVersion/auth/login', action: 'authLogin'},
        { path: '/:apiVersion/auth/logout/:username', action: 'authLogout'},
        { path: '/:apiVersion/auth/logout', action: 'authLogout'},
        { path: '/:apiVersion/auth/verify', action: 'authVerify'},
        { path: '/:apiVersion/squidle/create', action: 'squidleCreate'},
        { path: '/:apiVersion/squidle/update/:short', action: 'squidleUpdate'},
        { path: '/:apiVersion/squidle/solve/:short', action: 'squidleSolve'},
        { path: '/:apiVersion/squidle/delete/:short', action: 'squidleDelete'},
        { path: '/:apiVersion/user/username/create', action: 'userUsernameCreate'},
        { path: '/:apiVersion/user/username/update/:username', action: 'userUsernameUpdate'},
        { path: '/:apiVersion/user/delete/:username', action: 'userDelete'},
        { path: '/:apiVersion/user/ban/:username', action: 'UserBan'},
        { path: '/:apiVersion/user/credits/create', action: 'userCreditsCreate'},
        { path: '/:apiVersion/user/reward/delete/:transaction', action: 'userRewardDelete'},
        { path: '/:apiVersion/user/receipt/delete/:id', action: 'userReceiptDelete'},
        { path: '/:apiVersion/user/profile/update/:username', action: 'userProfileUpdate'},
        { path: '/:apiVersion/user/history/delete/:short', action: 'userHistoryDelete'},
        { path: '/:apiVersion/file/create', action: 'fileCreate'},
        { path: '/:apiVersion/file/delete/:file', action: 'fileDelete'},
        { path: '/:apiVersion/file/update/:file', action: 'fileUpdate'},
        { path: '/:apiVersion/search/create', action: 'searchCreate'},
        { path: '/:apiVersion/shorten/create', action: 'shortenCreate'},
        { path: '/:apiVersion/support/create', action: 'supportCreate'},
        { path: '/:apiVersion/util/worker/cleanold', action: 'workerCleanOld'},
        { path: '/:apiVersion/util/worker/failed/delete', action: 'workerFailedDeleteAll'},
        { path: '/:apiVersion/util/task/stop/:task', action: 'taskStop'},
        { path: '/:apiVersion/util/task/start/:task', action: 'taskStart'},
        { path: '/:apiVersion/util/flush', action: 'flush'},
        { path: '/:apiVersion/util/redis/:model/:method/by/:byKey/:byValue/', action: 'redisAction'},
        { path: '/:apiVersion/stats/delete/:name', action: 'statsDelete'},
        { path: '/:apiVersion/info/create', action: 'infoCreate'},
        { path: '/:apiVersion/info/update/:name', action: 'infoUpdate'},
        { path: '/:apiVersion/info/delete/:name', action: 'infoDelete'}


      ],

      get: [
        { path: '/:apiVersion/auth/verify/:token', action: 'authVerifyRedirect'},
        { path: '/:apiVersion/squidle/:short', action: 'squidleGet'},
        { path: '/:apiVersion/squidle/updatable/:short', action: 'squidleUpdatable'},
        { path: '/:apiVersion/squidle/hint/:short', action: 'squidleHintGet'},
        { path: '/:apiVersion/squidle/stats/:short', action: 'squidleStatsGet'},
        { path: '/:apiVersion/user/username/exists/:username', action: 'userUsernameExists'},
        { path: '/:apiVersion/user/email/exists/:email', action: 'userEmailExists'},
        { path: '/:apiVersion/user/username', action: 'userUsernameGet'},
        { path: '/:apiVersion/user/profile/:username', action: 'userProfileGet'},
        { path: '/:apiVersion/user/history/:username', action: 'userHistoryGet'},
        { path: '/:apiVersion/user/credits/:username', action: 'userCreditsGet'},
        { path: '/:apiVersion/user/receipts/:username', action: 'userReceiptsGet'},
        { path: '/:apiVersion/reward/vungle/:platform', action: 'rewardVungle'},
        { path: '/:apiVersion/reward/info', action: 'rewardInfo'},
        { path: '/:apiVersion/credits/info', action: 'creditsInfo'},
        { path: '/:apiVersion/file/:file', action: 'fileGet'},
        { path: '/:apiVersion/util/worker/failed', action: 'workerFailedGet'},
        { path: '/:apiVersion/test', action: 'testRun'},
        { path: '/:apiVersion/util/hash/:email', action: 'hashEmail'},
        { path: '/:apiVersion/stats', action: 'getStats'},
        { path: '/:apiVersion/stats/agg/:model', action: 'getAgg'},
        { path: '/:apiVersion/util/system', action: 'getSystemInfo'},
        { path: '/:apiVersion/home/:uri', action: 'homeGet', matchTrailingPathParts: true},
        { path: '/:apiVersion/info/:name', action: 'infoGet'},
        { path: '/:apiVersion/message/:username', action: 'messageGet'}
      ]


    };
  }
};
