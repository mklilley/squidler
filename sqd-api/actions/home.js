
'use strict';

var size = require('request-image-size');



exports.homeGet = {
    name:                   'homeGet',
    description:            'I get a the home page and add the appropriate meta tags (debug)',
    blockedConnectionTypes: [],
    outputExample:          {},
    matchExtensionMimeType: false,
    version:                1.0,
    toDocument:             true,
    middleware:             [],

    inputs: {
        uri : {
            required:true,
            validator: ['api.validator.string']
        },
        username: {
            required: false,
            validator: ['api.validator.username'],
            formatter: ['api.formatter.removeWhiteSpace']
        }
    },

    run: function(api, data, next) {

        let img = "https://squidler.com/img/logo_OG.png";
        let title = "Squidler";
        let description = "Turns messaging into a game";
        let dimensions = {width:1280,height:760};

        let username;
        if(data.isAdmin){
            username =  data.params.username ? data.params.username : data.authUser.username;
        }
        else{
            username =  data.authUser.username;
        }

        api.squidle.get(data.params.uri.split('/').pop(), username)
            .then(squidle => {
                title = squidle.challenge.text;
                description = squidle.op + " created this Squidle - solve it to get the prize";
                if(squidle.challenge.photo){
                    img = squidle.challenge.photo;
                    var options = {
                        url: img,
                        headers: {
                            'User-Agent': 'request-image-size'
                        }
                    };

                    size(options, function(err, dim, length) {
                        dimensions = dim;
                        constructHomePage()
                    });

                }
                else if(squidle.challenge.video){
                    let YouTubeId = squidle.challenge.video.split("/").pop();
                    img = "https://img.youtube.com/vi/" + YouTubeId + "/0.jpg";

                    var options = {
                        url: img,
                        headers: {
                            'User-Agent': 'request-image-size'
                        }
                    };

                    size(options, function(err, dim, length) {
                        dimensions = dim;
                        constructHomePage()
                    });
                }
                else{
                    constructHomePage();
                }

            })
            .catch(error => {
                constructHomePage()
            });

        function constructHomePage() {

            let index = `<!DOCTYPE html>
<html class="full" prefix="og: http://ogp.me/ns#">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width">
     <meta http-equiv="Content-Security-Policy" content="default-src 'self' http://*.squidler.com http://squidler.com https://squidler.com https://*.squidler.com https://www.googleapis.com  gap:  https://ssl.gstatic.com http://*.youtube.com https://*.youtube.com; img-src * ; style-src 'self' 'unsafe-inline';">

      <base href="/">

      <meta name="apple-mobile-web-app-capable" content="yes" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@sqdlvl8" />

      <meta name="twitter:app:id:iphone" content="1133896864" />
      <meta name="twitter:app:name:iphone" content="Squidler" />
      <meta name="twitter:app:url:iphone" content="squidler:/${data.params.uri}" />

      <meta name="twitter:app:id:googleplay" content="com.squidler" />
      <meta name="twitter:app:name:googleplay" content="Squidler" />
      <meta name="twitter:app:url:googleplay" content="https://squidler.com${data.params.uri}" />


      <meta property="fb:app_id" content="680756422028814"/>
      <meta property="og:title" content="${title}" />
      <meta property="og:site_name" content="Squidler" />
      <meta property="og:description" content="${description}" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://squidler.com${data.params.uri}" />
      <meta property="og:image" content="${img}" />
      <meta property="og:image:width" content="${dimensions.width}" />
      <meta property="og:image:height" content="${dimensions.height}" />
      
      <meta name="twitter:title" content="${title}" />
      <meta name="twitter:description" content="${description}" />
      <meta name="twitter:image" content="${img}" />



      <meta property="al:android:package" content="com.squidler"/>
      <meta property="al:android:app_name" content="Squidler"/>
      <meta property="al:android:url" content="https://squidler.com${data.params.uri}"/>

      <meta property="al:ios:url" content="squidler:/${data.params.uri}"/>
      <meta property="al:ios:app_store_id" content="1133896864" />
      <meta property="al:ios:app_name" content="Squidler" />




    <title>Squidler</title>

      <link rel="shortcut icon" href="img/favicon.ico">




      <link href="lib/animate.css" rel="stylesheet">
      <link href="css/ionic.app.css" rel="stylesheet">


    <script src="lib/ionic/js/ionic.bundle.js"></script>

      <script type="text/javascript" src="js/templates.js"></script>


    <script src="lib/ngStorage.js"></script>



<script src="lib/roundProgress.js"></script>
      <script src="lib/ionic-cache-src.js"></script>

         <script src="lib/ng-cordova.js"></script>



    <!-- your app's js -->
    <script src="js/production.js"></script>
  </head>

  <body ng-app="sqd" ng-strict-di ng-controller="SqdController as sqd" class="full">


    <ion-nav-view name="app" ></ion-nav-view>

    <noscript>
        <div class="background sqd-welcome full text-center">
            <div class="white no-padding slider-slide">
        <div class="row row-center full">

            <div class="col">

                <h3 class="no-margin">Welcome to Squidler!</h3>
                <div class="logo-container padding">
                    <img src="img/logo_orange.svg" class="logo">
                </div>


                Looks like JavaScript is disabled on your browser :-(  Please enable it and come back.


            </div>

        </div>
            </div>


        </div>
    </noscript>



</body>
</html>`;

            var buf = Buffer.from(index, 'utf-8');

            let fileBuff = new BufferStream(buf);
            //data.connection.rawConnection.responseHeaders.push(['Expires', file.expiresAt.toUTCString()]);
            api.servers.servers[data.connection.type].sendFile(data.connection, null, fileBuff, 'text/html', buf.byteLength);
            data.toRender = false;
            next();


    }

    }
};
