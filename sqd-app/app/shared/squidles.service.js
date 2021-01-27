(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('squidles', squidlesProvider);

    squidlesProvider.$inject = [];

    function squidlesProvider() {

        var api;
        
     squidlesService.$inject = ['$q', '$rootScope', 'resources', 'files','stores', 'profiles', 'exceptions'];

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
         * @returns {object} Service object exposing methods - create, read, update
         *
         * @description
         * This is a service that is returned as part of squidlesProvider. Used to create, read and updates squidles
         */

        function squidlesService($q, $rootScope, resources, files, stores, profiles, exceptions) {

            var service = {

                create: create,
                read: read,
                update: update,
                remove: remove

            };

            return service;

            ////////////////////////////////////////
            
            
             /**
         * @ngdoc method
         * @name create 
         * @methodOf sqd.service:squidles
         * @param {object} squidle Object containing all the squidle data. Main keys: challenge, prize, answer. Sub keys: text photo, video.  Each Sub key must have at least a value key. Answer can only have a text key (see backend api for more details)
         *
         * @returns {promise} Resolves to an object that contains all the original squidle data in adition to the following keys: short, op, expires_at (see backend squidles api for more details), if the squidle is successfully created, otherwise the promise is rejected. Note, photo values must either be urls from the web or base64 dataURIs which will be converted to jpeg and uploaded to the squidler server
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

            function create(squidle) {

                var deferred = $q.defer();

                $q.all([processAnswer(squidle), processFiles(squidle)]).then(createSquidle).catch(exceptions.create('Problem creating your Squidle',deferred));

                return deferred.promise;

                ////////////////////////////////////////

                function processAnswer(squidle){

                    var A = squidle.answer.text.value.trim()
                    
                    // dots
                    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2022");
                    
                    // box
                    // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2610");
                    
                    // Underscore
                     var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u005F ");
                    
                    // Underscore
                   var H = A.replace(/\S/gi, "\u005F ");
                    

                    
                    A = A.replace(/ /g, "").toLowerCase();


                    squidle.answer.text.value = A;
                    squidle.answer.text.hint = H;



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

          stores.remove('preview','squidle');                     stores.create('preview','squidle',{});
                        
                  stores.remove('tempSquidle','prize');
                  stores.create('tempSquidle','prize',{text:""});
                        stores.remove('tempSquidle','challenge');
        stores.create('tempSquidle','challenge',{text:""});
                        stores.remove('tempSquidle','answer');
        stores.create('tempSquidle','answer',{text:""});
                        
                         return profiles.read(squidle.op).then(function(opProfile){
      
                                squidle.op = username;
                        
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
         * @returns {promise} Resolves to an object that contains the following keys: challenge, answer (only the hints), short, op, expires_at.  If a guess is provided and is correct the object contains a prize and short keys. If the squidle cannot be read or the answer provided is incorrect the promise is rejected. (see backend squidles api for more details). If no squidle is presented then all stored squidles will be returnd as an object whose keys are the shortlink
         * @example
         * <pre>squidles.read({short:'VJ08tg6', guess:'blue'})</pre>
         *
         * 
         */


            function read(squidle) {

                
                var deferred = $q.defer();
                
                if(squidle){

                if(squidle.guess){processGuess(squidle).then(tryToGetPrize).catch(exceptions.create('Problem getting your prize',deferred));}

                else{getSquidle(squidle).catch(exceptions.create('Problem getting your Squidle',deferred));}
                }
                else{
                    
                    getAllSquidles().catch(exceptions.create('Problem getting your Squidles',deferred));
                }

                return deferred.promise;

                ////////////////////////////////////////

                function processGuess(squidle){
                    squidle.guess =  squidle.guess.toLowerCase().replace(/ /g, '');

                    return $q.when(squidle);
                }

                function tryToGetPrize(squidle) {

                    return resources.read('squidle', api, squidle.short, {answer: squidle.guess}).then(postProcess,wrongAnswer);

                    ////////////////////////////////////////

                    function postProcess(squidle) {

                        var id = squidle.short;

                        stores.update('squidles', id, squidle);

                        deferred.resolve(squidle);

                        return $q.when(squidle);

                    }
                    
                    function wrongAnswer(response){
                        
                        if(response.message=="Wrong answer"){
                    
                        deferred.resolve(response);
                        return $q.when();
                        }
                        else{
                            
                        deferred.reject();
                        return $q.when();
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


                    var id = squidle.short,
                            sent = squidle.sent ? squidle.sent : false;
                    
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
                        
                        
                         squidle.sent = sent;
                        
                        return $q.when(squidle);

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
         * @param {object} squidle Object containing the squidle data to be updated. This must include a "short" key to identify the squidle to be updated. To update hint an "answer" and "hintOn" key must be present, hintOn = true sets hints to be consistent with  answer.text.value, hintOn=false removes the hint altogether. To update expiry an "expires_at" key must be present with sub keys: interval (e.g. 'hour', 'day', 'week') and units (integer)
          * @param {string} field Name of the part of the squidle to be updated, currently only 'expiry' or 'hint'
         *
         * @returns {promise} Resolves to an object that contains the following keys: challenge, answer, short, op, expires_at, if the squidle was updated successfuly, oterwise the promise is rejected. (see backend squidles api for more details)
         * 
         * @description Updates a Squidle
         * @example
         * <pre>squidles.update({
         * short:VJ08tg6, 
         *hintOn:true, 
         *answer:{
         *text:{
         *value:'blue',
         *hint:••••}}})</pre>
         *
         * 
         */



            function update(squidle,field) {

                var deferred = $q.defer();

                switch (field.toLowerCase()) {
                case 'expiry':
                    processExpiry(squidle).then(updateSquidle).catch(exceptions.create('Problem updating your Squidle',deferred));
                    break;
                case 'hint':
                    processAnswer(squidle).then(updateSquidle).catch(exceptions.create('Problem updating your Squidle',deferred));
                    break;
                default:
                    break;
                }

                return deferred.promise;

                ////////////////////////////////////////

                function processExpiry(squidle){

                    var interval = squidle.expires_at.interval,
                        units = squidle.expires_at.units;

                    squidle.expires_at = createDate(interval, units);


                    return $q.when(squidle);

                ////////////////////////////////////////

                    function createDate(interval, units) {
                        var d = new Date();
                   
                        switch (interval.toLowerCase()) {
                        case 'year':
                            d.setFullYear(d.getFullYear() + units);
                            d = d.toISOString();
                            break;
                        case 'quarter':
                            d.setMonth(d.getMonth() + 3 * units);
                            d.toISOString();
                            break;
                        case 'month':
                            d.setMonth(d.getMonth() + units);
                            d = d.toISOString();
                            break;
                        case 'week':
                            d.setDate(d.getDate() + 7 * units);
                            d = d.toISOString();
                            break;
                        case 'day':
                            d.setDate(d.getDate() + units);
                            d = d.toISOString();
                            break;
                        case 'hour':
                            d.setTime(d.getTime() + units * 3600000);
                            d = d.toISOString();
                            break;
                        case 'minute':
                            d.setTime(d.getTime() + units * 60000);
                            d = d.toISOString();
                            break;
                        case 'second':
                            d.setTime(d.getTime() + units * 1000);
                            d = d.toISOString();
                            break

                        case 'none':
                            d.setFullYear(d.getFullYear() + units);
                            d = d.toISOString();
                            break

                        case 'once':
                            d = "once";
                            break

                        default:
                            d = undefined;
                            break;
                        }

                        return d
                    }


                }
                
               function processAnswer(squidle){
                   
               
                           
                       
                                               var A = squidle.answer.text.value.trim().replace(/ /g, "").toLowerCase();
                    // dots
                   // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2022");
                   
                   //box
                   // var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u2610");
                   
                   // Underscore
                   //var H = A.replace(/[a-zA-Z0-9áéíÍóÓäÁëÉöÓúÚàèììùåÅÄÖ]/g, "\u005F ");
                   
                   // Underscore
                   var H = A.replace(/\S/gi, "\u005F ");


                   if (squidle.hintOn){

                    squidle.answer = {text:{
                    value:A,
                        hint:H
                    }};
                           }
                           
                           else{
                               
                   squidle.answer = {text:{
                    value:A,
                        hint:""
                    }};
                           }
                           
                           

                           return $q.when(squidle);
                           







                    
                }


                function updateSquidle(squidle){



                    var id = squidle.short;
                    delete squidle.short;
                    delete squidle.hintOn;
                    

                     return resources.update('squidle',api,id,squidle).then(postProcess);

                    ////////////////////////////////////////

                    function postProcess(squidle){
                        
                        delete squidle.prize;

                        stores.update('squidles',id,squidle)
  deferred.resolve(squidle);
                        return $q.when(squidle);

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
            
            
            function remove(squidle){
                
                var deferred = $q.defer(),    
                  id = squidle.id,
                    sent = squidle.sent;
                    if(id){
                        
                         
                        return removeFromServer(id,sent).then(removeFromPhone);                        

                        
                    }
                    else{

                    return $q.reject('No squidle id presented')
                    }
                
                
                
                deferred.resolve();
                
                return deferred.promise;

                ////////////////////////////////////////
                
                function removeFromServer(id,sent){
                
                    
                    return $q.when(id);
                    
                    
                }
                
                function removeFromPhone(id){
                    

                    return stores.remove('squidles', id)
                    
                }
                
                
                
            }




        }



    }









})();