(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('files', filesProvider);

    filesProvider.$inject = [];

    function filesProvider() {

        var api;
        
         filesService.$inject = ['$q', 'resources', 'exceptions'];

        var provider = {

            setApi: setApi,
            $get: filesService


        };

        return provider;



        ////////////////////////////////////////


        function setApi(url) {

            api = url;

        }


       
        
                /**
         * @ngdoc service
         * @name sqd.service:files
         * @param {object} $q Angular promise service
         * @param {object} resources Service to communicate with backend resources
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - create
         *
         * @description
         * This is a service that is returned as part of filesProvider. Used to upload image files to the backend
         */

        function filesService($q, resources, exceptions) {

            var service = {

                create: create

            };

            return service;

            ////////////////////////////////////////
            
            
         /**
         * @ngdoc method
         * @name create 
         * @methodOf  sqd.service:files
         * @param {array} files e.g. [{data: dataURI}]
         * @returns {promise} Resolves to an array of objects  -e.g  [{url:'http://squidler.com/api/v1/files/xCvqk8wPnD5KbAlsAwQJ7z.jpeg}] -  if the files was successfully uploaded, otherwise the promise is rejected
         * 
         * @description Takes an array of dataURI objects, turns them into blobs and creates an jpeg file on the backend 
         * @example
         * <pre>files.create([data:'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'])</pre>
         * 
         */

            function create(files) {

                var deferred = $q.defer();

                processFiles(files).then(uploadFiles).catch(exceptions.create('Problem processing your files', deferred, 'files.create error'));

                return deferred.promise;

                ////////////////////////////////////////

                function processFiles(files) {

                    for (var i = 0; i < files.length; i++) {

                        files[i].data = dataURItoBlob(files[i].data);
                    }

                    return $q.when(files);

                    ////////////////////////////////////////

                    function dataURItoBlob(dataURI) {
                        var binary = atob(dataURI.split(',')[1]),
                            array = [];
                        for (var i = 0; i < binary.length; i++) {
                            array.push(binary.charCodeAt(i));
                        }
                        return new Blob([new Uint8Array(array)], {
                            type: 'image/jpeg'
                        });
                    }


                }

                function uploadFiles(files) {

                    var proms = [];


                    for (var i = 0; i < files.length; i++) {

                        proms.push(resources.create('file', api, files[i].data, {formData:true}));
                    }

                    return $q.all(proms).then(postProcess);

                    ////////////////////////////////////////

                    function postProcess(files) {
                        deferred.resolve(files);

                        return $q.when(files);

                    }





                }





            }









        }



    }









})();