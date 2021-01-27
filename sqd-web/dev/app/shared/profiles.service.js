(function () {
        'use strict';
        angular
            .module('sqd')
            .provider('profiles', profilesProvider);

        profilesProvider.$inject = [];

        function profilesProvider() {

            var api;

             profilesService.$inject = ['$q', 'stores', 'resources', 'files', 'exceptions', '$rootScope'];

            var provider = {

                setApi: setApi,
                $get: profilesService


            };

            return provider;


            ////////////////////////////////////////

            function setApi(url) {

                api = url;

            }




            /**
         * @ngdoc service
         * @name sqd.service:profiles
         * @param {object} $q Angular promise service
         * @param {object} stores Service used to interface with the html5 local storage
         * @param {object} resources Service to communicate with backend resources
         * @param {object} files Service to upload images to the backend
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read, update
         *
         * @description
         * This is a service that is returned as part of profilesProvider. Used to retrieve and update a user's profile
         */

            function profilesService($q, stores, resources, files, exceptions, $rootScope) {

                var service = {

                    read: read,
                    update: update

                };

                return service;



                ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name read
         * @methodOf  sqd.service:profiles
         * @param {string=} username Username of user. If not present then all locally stored profiles are returned
         * @param {object=} options If presented with the key "refresh" set to true then the requested profile/s will be locally updated from the server data
         * @returns {promise} Resolves to an object with keys: avatar, location, bio and name if profile was successfully read, otherwise the promise is rejected.
         *
         * @description Retrives the public profile for a specific user or all profiles stored locally.
         * @example
         * <pre>profiles.read('joblogs')</pre>
         *
         */

                function read(username,options) {


                     var options = options!==undefined ? options : {},
                         refresh = options.refresh,
                         silent = options.silent!==undefined ? options.silent : false;

                    if(refresh){


                     return  stores.read('profiles',username).then(refreshProfiles).catch(exceptions.create('Problem reading all profiles',{silent:silent}));


                    }
                    else{

                    return stores.read('profiles',username).catch(fetchProfile).catch(exceptions.create('Problem reading profile',{silent:silent}));
                    }


                    ////////////////////////////////////////


                    function fetchProfile(){

                    return resources.read('profile', api, username).then(processResponse);

                        //////////////////////

                        function processResponse(data) {

                        stores.create('profiles', username, data);


                        return $q.when(data);



                    }
                    }

                    function refreshProfiles(data){


                        var usernames = username ? [username] : Object.keys(data),
                            proms = [];

                        if (usernames.length!=0){

                        angular.forEach(usernames, function(username,index){

                            proms.push(resources.read('profile', api, username));

                        });


                   return $q.all(proms).then(postProcess);
                        }

                        else{return $q.when()}

                        ///////////////////////

                        function postProcess(data){

                            var profiles = {};


                            angular.forEach(data, function(profile,index){

                                 stores.update('profiles', usernames[index], profile);
                                profiles[usernames[index]] = profile;

                            });

                            return $q.when(profiles);


                        }


                    }



                    }







                        /**
         * @ngdoc method
         * @name update
         * @methodOf  sqd.service:profiles
         * @param {string} username Username
         * @param {object} profile Data entries that the user wants to update, e.g. bio, avatar, location, etc...
        * @returns {promise} Resolves to an object with keys: avatar, location, bio and name if profile was successfully read, otherwise the promise is rejected.
        *
         * @description Updates the public profile of a speciic user (need to be the user in question to do this)
         * @example
         * <pre>profiles.read('joblogs',{bio:'Me me Me', location:'London'})</pre>
         *
         */


                function update(username,profile,options) {

                    var deferred = $q.defer(),
                        options = options!==undefined ? options : {},
                        silent = options.silent!==undefined ? options.silent : false;

                    processAvatar(profile).then(updateProfile).catch(exceptions.create('Problem updating your profile', {toBeRejected:{promise:deferred},silent:silent}));


                    return deferred.promise;


                    ////////////////////////////////////////


                    function processAvatar(profile) {

                        var hasAvatar = profile.avatar ? true : false;

                        var data = [];

                        if (hasAvatar) {
                            return extractAvatarFromProfile(profile).then(uploadAvatar).then(insertAvatarLinkIntoProfile);
                        } else {
                            return $q.when(profile);
                        }


                        ////////////////////////////////////////

                        function extractAvatarFromProfile(profile) {


                            data.push({
                                data: profile.avatar,
                                label: 'avatar'
                            });


                            return $q.when(data);

                        }

                        function uploadAvatar(data) {

                            return files.create(data);

                        }

                        function insertAvatarLinkIntoProfile(uploaded) {

                            for (var i = 0; i < uploaded.length; i++) {
                                profile[data[i].label]= uploaded[i].url;
                            }

                            return $q.when(profile);


                        }




                    }


                    function updateProfile(profile) {

                        return resources.update('profile', api, username, profile).then(postProcess);

                        ////////////////////////////////////////

                        function postProcess(response) {
                           
                return            stores.update('profiles',username,response).then(function(){
                            deferred.resolve(response); $rootScope.$broadcast('profileUpdated');
                            });

                                            }





                    }






                }



            }
        }



})();
