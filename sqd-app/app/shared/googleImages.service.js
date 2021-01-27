(function () {
    'use strict';
    angular
        .module('sqd')
        .provider('googleImages', googleImagesProvider);

    googleImagesProvider.$inject = [];

    function googleImagesProvider() {

        var cred,
            api;
        
        googleImagesService.$inject = ['$q', '$http', 'exceptions'];

        var provider = {

            setAuthCred: setAuthCred,
            setApi: setApi,
            $get: googleImagesService


        };

        return provider;


        ////////////////////////////////////////

        function setAuthCred(data) {

            cred = data;

        }

        function setApi(url) {

            api = url;

        }



        
            /**
         * @ngdoc service
         * @name sqd.service:googleImages
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service that is returned as part of googleImagesProvider. Used to search google images
         */

        function googleImagesService($q, $http, exceptions) {

            var service = {

                read: read

            };

            return service;



            ////////////////////////////////////////


        /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:googleImages
         * @param {string} query What you are searching google images for
         * @param {integer} pageNum Which set of 10 results to show (1 = first set of 10, 2 = second set of 10)
         * @returns {promise} Resolves to an object of the form - {results: [{thumb:string, url:string, aspect:number}], nextPageIndex: integer} -  if search was successfully performed, otherwise the promise is rejected.
         * 
         * @description Queries google images and returns 10 results at a time 
         * @example
         * <pre>googleImages.read('chicken',1)</pre>
         * 
         */

            function read(query, pageNum) {
              

                var deferred = $q.defer(),
                    data;

                data = {
                    key: cred.key,
                    cx: cred.cx,
                    q: query,
                    searchType: "image"
                }

                if (pageNum) {
                    data.start = pageNum;
                };

                $http.get(api, {params: data}).then(processResponse).catch(exceptions.create('Problem with Google Images', deferred, 'googleImages.read error'));


                return deferred.promise;

                ////////////////////////////////////////

                function processResponse(response) {

                    var list = response.data.items,
                        nextPageIndex = response.data.queries.nextPage[0].startIndex,
                        results = [];

                  list.forEach(function (element, index) {

                      results[index] = {
                        thumb: element.image.thumbnailLink,
                        url: element.link,
                        aspect: element.image.width / element.image.height
                    };

                    });


                    deferred.resolve({
                        results: results,
                        nextPageIndex: nextPageIndex

                    });

                    return $q.when({
                        results: results,
                        nextPageIndex: nextPageIndex

                    });



                }





            }





        }



    }



})();