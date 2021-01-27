(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('squidles', squidlesProvider);

    squidlesProvider.$inject = [];

    function squidlesProvider() {

        var api;

     squidlesService.$inject = ['$q', '$rootScope', 'resources', 'files','stores', 'profiles', 'exceptions', 'credits'];

        var provider = {

            setApi: setApi,
            $get: squidlesService


        };

        return provider;



        ////////////////////////////////////////


        function setApi(url) {

            api = url;

        }



             /**
         * @ngdoc service
         * @name sqd.service:squidles
         * @param {object} $q Angular promise service
         * @param {object} $rootScope Angular rootScope service
         * @param {object} resources Service to communicate with backend resources
         * @param {object} files Service used to upload image files to the backend
         * @param {object} stores Service used to interface with the html5 local storage
         * @param {object} profiles Service used to retrieve and update a user's profile
         * @param {object} exceptions Service to catch a failed promise
         * @param {object} credits Service to update users credits after a hint has been received
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of squidlesProvider. Used to create, read and updates squidles
         */

        function squidlesService($q, $rootScope, resources, files, stores, profiles, exceptions, credits) {

            var service = {

                create: create,
                read: read,
                update: update,
                remove: remove,
                updatable: updatable,
                getHint:   getHint

            };

            return service;

            ////////////////////////////////////////


             /**
         * @ngdoc method
         * @name create
         * @methodOf sqd.service:squidles
         * @param {object} squidle Object containing all the squidle data. Main keys: challenge, prize, answer. Sub keys: text photo, video.  Each Sub key must have at least a value key. Answer can only have a text key (see backend api for more details)
         *
         * @returns {promise} Resolves to an object that contains all the original squidle data in adition to the following keys: short, op, expiresAt (see backend squidles api for more details), if the squidle is successfully created, otherwise the promise is rejected. Note, photo values must either be urls from the web or base64 dataURIs which will be converted to jpeg and uploaded to the squidler server
         *
         * @description Creates a squidle
         * @example
         * <pre>squidles.create(
       challenge: {
           text: {
               value: 'What is my favourite colour'
           },
           photo: {
               value: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
               uploaded: true
           }
       },
       prize: {
           text: {
               value: 'When everyone in the office has a cough'
           },
           video: {
               value: 'https://youtu.be/IVFHyZSXKMw'
           }
       },
       answer: {
           text: {
               value: 'blue',
               hint: '••••'
           }
       })</pre>
         *
         *
         */

            function create(squidle,options) {

                var deferred = $q.defer(),
                    options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false;

                $q.all([processAnswer(squidle), processFiles(squidle)]).then(createSquidle).catch(exceptions.create('Problem creating your Squidle',{toBeRejected:{promise:deferred},silent:silent}));

                return deferred.promise;

                ////////////////////////////////////////

                function processAnswer(squidle){

                    var A = squidle.answer.text.value.toLowerCase().trim();

                    // dots
                    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2022");

                    // box
                    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2610");

                    // Underscore
                     //var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u005F ");

                    // Underscore
                   //var H = A.replace(/\S/gi, "\u005F ");



                    //A = A.replace(/ /g, "").toLowerCase();


                    squidle.answer.text.value = A;
                    //squidle.answer.text.hint = H;



                    return $q.when(squidle);
                }

                function processFiles(squidle) {

                       var hasFiles = ((squidle.prize.photo || {}).uploaded) || ((squidle.challenge.photo || {}).uploaded);

                    var data = [];

                    if(hasFiles){return extractFilesFromSquidle(squidle).then(uploadFiles).then(insertFileLinkIntoSquidle);}

                    else{return $q.when(squidle);}


                    ////////////////////////////////////////

                    function extractFilesFromSquidle(squidle) {


                        if ((squidle.prize.photo || {}).uploaded) {
                            data.push({
                                data: squidle.prize.photo.value,
                                label: 'prize'
                            });
                        }

                        if ((squidle.challenge.photo || {}).uploaded) {
                            data.push({
                                data: squidle.challenge.photo.value,
                                label: 'challenge'
                            });
                        }

                        return $q.when(data)

                    }

                    function uploadFiles(data){

                        return files.create(data);

                    }

                    function insertFileLinkIntoSquidle(uploaded){

                            for (var i=0; i<uploaded.length; i++){

                            squidle[data[i].label].photo.value = uploaded[i].url;
                            }
                       return $q.when(squidle);

                    }




                }

                function createSquidle(squidle){

                    squidle = squidle.constructor === Array ? squidle[0] : squidle;

                    return resources.create('squidle',api,squidle).then(postProcess);

                    ////////////////////////////////////////

                    function postProcess(squidle){

                        var id = squidle.short,
                            username = squidle.op;

                        delete squidle.prize;

                        squidle.sent = true;
                        squidle.stats = {};

                        stores.remove('preview', 'squidle');
                        stores.create('preview', 'squidle', {});

                        stores.remove('tempSquidle', 'prize');
                        stores.create('tempSquidle', 'prize', {text: ""});
                        stores.remove('tempSquidle', 'challenge');
                        stores.create('tempSquidle', 'challenge', {text: ""});
                        stores.remove('tempSquidle', 'answer');
                        stores.create('tempSquidle', 'answer', {text: ""});

                         return profiles.read(squidle.op).then(function(opProfile){

                                squidle.op = username;

                             angular.forEach(squidle.challenge,function(value,key){
                                 squidle.challenge[key] = {value:value};
                             });
                             angular.forEach(squidle.prize,function(value,key){
                                 squidle.prize[key] = {value:value};
                             });

                             squidle.answer = {text:{value: squidle.answer}};

                                stores.create('squidles', id, squidle);


                                deferred.resolve(squidle);


                            });



                      /*  stores.create('squidles', id, squidle);

                        deferred.resolve(squidle);

                        return $q.when(squidle);*/

                    }


                }









            }

                         /**
         * @ngdoc method
         * @name read
         * @methodOf sqd.service:squidles
         * @param {object=} squidle Must contain the key "short", i.e. the id of the squidle to be read.  If "guess" key is also present the a request will be made to retrive the prize of the squidle. If no squidle is presented then all stored squidles will be returned
         *
         *
         * @returns {promise} Resolves to an object that contains the following keys: challenge, answer (only the hints), short, op, expiresAt.  If a guess is provided and is correct the object contains a prize and short keys. If the squidle cannot be read or the answer provided is incorrect the promise is rejected. (see backend squidles api for more details). If no squidle is presented then all stored squidles will be returnd as an object whose keys are the shortlink
         * @example
         * <pre>squidles.read({short:'VJ08tg6', guess:'blue'})</pre>
         *
         *
         */


            function read(squidle,options) {


                var deferred = $q.defer(),
                    options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false;

                if(squidle){

                if(squidle.guess){processGuess(squidle).then(tryToGetPrize).catch(exceptions.create('Problem getting your prize',{toBeRejected:{promise:deferred},silent:silent}));}

                else{getSquidle(squidle).catch(exceptions.create('Problem getting your Squidle',{toBeRejected:{promise:deferred},silent:silent}));}
                }
                else{

                    getAllSquidles().catch(exceptions.create('Problem getting your Squidles',{toBeRejected:{promise:deferred},silent:silent}));
                }

                return deferred.promise;

                ////////////////////////////////////////

                function processGuess(squidle){
                   // squidle.guess =  squidle.guess.toLowerCase().replace(/ /g, '');
                    squidle.guess =  squidle.guess.toLowerCase().trim();

                    return $q.when(squidle);
                }

                function tryToGetPrize(squidle) {

                    return resources.action('solve','squidle', api, squidle.short, {guess: squidle.guess}).then(postProcess,wrongAnswer);

                    ////////////////////////////////////////

                    function postProcess(squidle) {

                        var id = squidle.short;

                        angular.forEach(squidle.prize,function(value,key){
                            squidle.prize[key] = {value:value};
                        });

                        stores.update('squidles', id, squidle);

                        deferred.resolve(squidle);

                        return $q.when(squidle);

                    }

                    function wrongAnswer(response){

                           if(response.details.status == 403){

                        deferred.resolve(response);
                        return $q.when();
                        }
                        else{
                            if(response.details.status === 404){
                                response.details.data.error = "Sorry, this Squidle was deleted by its creator";
                            }
                            deferred.reject(response);
                            return $q.reject(response);
                        }
                    }


                }

                function getAllSquidles(){

                    return stores.read('squidles').then(function(squidles){

                        deferred.resolve(squidles);

                        return $q.when(squidles);

                    });


                }




                function getSquidle(squidle){


                    var id = squidle.short;

                    if(id){
                    return stores.read('squidles', id).then(useStoredSquidle,getNewSquidle);}
                    else{
                    return $q.reject('No squidle id presented')
                    }


                    ////////////////////////////////////////

                    function useStoredSquidle(squidle){

                        deferred.resolve(squidle);

                        return $q.when(squidle);

                    }

                    function getNewSquidle(){
                        return resources.read('squidle', api, id).then(postProcess).then(getProfileData);

                        ////////////////////////////////////////


                    function postProcess(squidle){

                        angular.forEach(squidle.challenge,function(value,key){
                            squidle.challenge[key] = {value:value};
                        });
                        angular.forEach(squidle.prize,function(value,key){
                            squidle.prize[key] = {value:value};
                        });

                        squidle.answer = {text:{value: squidle.answer}};


                        return stores.read("auth","username").then(function(username){
                            squidle.sent = squidle.op == username;
                            return $q.when(squidle);
                        });

                    }

                        function getProfileData(squidle){

                            return profiles.read(squidle.op).then(function(opProfile){

                                var id = squidle.short;

                                squidle.stats = {};

                                stores.create('squidles', id, squidle);

                                deferred.resolve(squidle);


                            });


                        }


                    }


                }






            }


             /**
         * @ngdoc method
         * @name update
         * @methodOf sqd.service:squidles
         * @param {object} squidle Object containing the squidle data to be updated. This must include a "short" key to identify the squidle to be updated. To update hint an "answer" and "hintOn" key must be present, hintOn = true sets hints to be consistent with  answer.text.value, hintsOn=false removes the hint altogether. To update expiry an "expiresAt" key must be present with sub keys: interval (e.g. 'hour', 'day', 'week') and units (integer)
          * @param {string} field Name of the part of the squidle to be updated, currently only 'expiry' or 'hint'
         *
         * @returns {promise} Resolves to an object that contains the following keys: challenge, answer, short, op, expiresAt, if the squidle was updated successfuly, oterwise the promise is rejected. (see backend squidles api for more details)
         *
         * @description Updates a Squidle
         * @example
         * <pre>squidles.update({
         * short:VJ08tg6,
         *hintsOn:true,
         *answer:{
         *text:{
         *value:'blue',
         *hint:••••}}})</pre>
         *
         *
         */



            function update(squidle,field,options) {

                var options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false;

                switch (field.toLowerCase()) {
                case 'expiry':
                   return processExpiry(squidle).then(updateSquidle).catch(exceptions.create('Problem updating your Squidle',{silent:silent}));
                    break;
                case 'hint':
                   return processHint(squidle).then(updateSquidle).catch(exceptions.create('Problem updating your Squidle',{silent:silent}));
                    break;
                default:
                    break;
                }


                ////////////////////////////////////////

                function processExpiry(squidle){

                    var interval = squidle.expiresAt.interval,
                        units = squidle.expiresAt.units;

                    squidle.expiresAt = createTimeStamp(interval, units);


                    return $q.when(squidle);

                ////////////////////////////////////////

                    function createTimeStamp(interval, units) {
                        var d = new Date();

                        switch (interval.toLowerCase()) {
                        case 'minute':
                            d.setTime(d.getTime() + units * 60000);
                            d = Math.floor(d.getTime()/1000);
                            break;
                        default:
                            break;
                        }

                        return d
                    }


                }

               function processHint(squidle){


                   squidle.hintsOn = squidle.hintsOn ? 1 : 0;

                //     var A = squidle.answer.text.value.trim().replace(/ /g, "").toLowerCase();
                //     // dots
                //    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2022");
                   //
                //    //box
                //    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2610");
                   //
                //    // Underscore
                //    //var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u005F ");
                   //
                //    // Underscore
                //    var H = A.replace(/\S/gi, "\u005F ");
                   //
                   //
                //    if (squidle.hintsOn){
                   //
                //     squidle.answer = {text:{
                //     value:A,
                //         hint:H
                //     }};
                //            }
                   //
                //            else{
                   //
                //    squidle.answer = {text:{
                //     value:A,
                //         hint:""
                //     }};
                //            }



                           return $q.when(squidle);




                }


                function updateSquidle(squidle){



                    var id = squidle.short;
                    delete squidle.short;


                     return resources.update('squidle',api,id,squidle).then(postProcess).then(updateCredits);

                    ////////////////////////////////////////

                    function postProcess(squidle){

                        delete squidle.prize;
                        angular.forEach(squidle.challenge,function(value,key){
                            squidle.challenge[key] = {value:value};
                        });

                        squidle.answer = {text:{value: squidle.answer}};

                       return  stores.update('squidles',id,squidle)


                    }

                    function updateCredits(){

                        return credits.read({refresh:true});


                    }
                }



            }


                         /**
         * @ngdoc method
         * @name remove
         * @methodOf sqd.service:squidles
         * @param {object} squidle Must contain the key "short",  i.e. the id of the squidle to be removed and a the key "sent" indicating whether the user sent this squidle or received it.
         *
         * @returns {promise} Resolves if squidle was successfully removed and rejects otherwise
         *
         * @description Removes a squidle. If you are the OP then it removes it from the server entirely, otherwise it just removes it from your history on the device and the server
         * @example
         * <pre>squidles.remove({short:'VJ08tg6',sent:true})</pre>
         *
         *
         */


            function remove(squidle,options){

                var options = options!==undefined ? options : {},
                    silent = options.silent!==undefined ? options.silent : false,
                  id = squidle.id,
                    sent = squidle.sent;
                    if(id){

                        if(sent)
                            {
                                return resources.destroy('squidle',api,id).then(removeFromPhone).catch(exceptions.create('Problem removing your Squidle',{silent:silent}));
                            }
                            else{
                                return removeFromPhone();
                            }



                    }
                    else{

                    return $q.reject('No squidle id presented')
                    }



                ////////////////////////////////////////


                function removeFromPhone(){


                    return stores.remove('squidles', id)

                }



            }


                 /**
                  * @ngdoc method
                  * @name updatable
                  * @methodOf sqd.service:squidles
                  * @param {string} short Short link for the squidle you want to check on
                  *
                  * @returns {promise} Resolves to true if the squidle can be updated, otherwise it resolves to false
                  *
                  * @description Checkes to see if a squidle can be updated be the OP. If someone has already seen the squidle then further updates are blocked
                  * @example
                  * <pre>squidles.updatable('VJ08tg6')</pre>
                  *
                  *
                  */


                 function updatable(short,options){

                    var deferred = $q.defer(),
                        options = options!==undefined ? options : {},
                        silent = options.silent!==undefined ? options.silent : false;

                     resources.read('squidle',api + "/updatable",short).then(postProcess).catch(exceptions.create('Problem reading update status of your Squidle',{toBeRejected:{promise:deferred},silent:silent}));

                     return deferred.promise;

                     ////////////////////////////////////////

                     function postProcess(response){

                         stores.update('squidles',short,response);
                         deferred.resolve(response.updatable);
                         return $q.when();

                     }



                 }


                 /**
                  * @ngdoc method
                  * @name getHint
                  * @methodOf sqd.service:squidles
                  * @param {string} short Short link for the squidle you want to get a hint on
                  *
                  * @returns {promise} Resolves if a hint was successfully received otherwise it rejects
                  *
                  * @description Gets a hint for a Squidle and updates the locally stored squidle data accordingly
                  * @example
                  * <pre>squidles.getHint('VJ08tg6')</pre>
                  *
                  *
                  */

                 function getHint(short,options){

                     var options = options!==undefined ? options : {},
                         silent = options.silent!==undefined ? options.silent : false;

                     return resources.read('squidle',api + "/hint",short).then(postProcess).then(updateCredits).catch(exceptions.create('Problem getting a hint for this Squidle',{silent:silent}));

                     ////////////////////////////////////////

                     function postProcess(response){

                         response.answer = {text:{value: response.answer}};

                         stores.update('squidles',short,response).then(function(){

                             return $q.when(response);
                         });


                     }

                     function updateCredits(){

                         return credits.read({refresh:true});

                     }

                 }




        }



    }









})();
