(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('imgur', imgur);

    imgur.$inject = ['$q', '$http', 'exceptions'];
    
     /**
         * @ngdoc service
         * @name sqd.service:imgur
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service used to extract image imformation from an imgur link, e.g, thumbnail and full image links
         */


    function imgur($q, $http, exceptions) {


        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

                /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:imgur
         * @param {string} url Url of Imgur page
         * @returns {promise} Resolves to an object of the form - {thumb: string, type: 'image', url: string} -  if url was successfully processed, otherwise the promise is rejected
         * 
         * @description Extracts image information from an Imgur link 
         * @example
         * <pre>youtube.read('http://imgur.com/gallery/whrgItd')</pre>
         * 
         */

        function read(url) {

             var deferred = $q.defer();


            extractIdFromUrl(url).then(getData).catch(exceptions.create('Problem processing your Imgur link',deferred,'imgur.read error'));

            return deferred.promise;


            ////////////////////////////////////////


            function extractIdFromUrl(url){

                var id;

                id = url.indexOf('#') != -1 ? url.slice(url.lastIndexOf('#') + 1, url.length) :  url.slice(url.lastIndexOf('/') + 1, url.length);

                return id!="" ? $q.when(id) : $q.reject('Empty Imgur id');


                }


            function getData(id){

                var thumb,
                    url;

                if(id.length >= 7){

                 thumb = "http://i.imgur.com/" + id + "t.jpg";
                  url ="http://i.imgur.com/" + id + ".jpg";

                 deferred.resolve({
                            thumb: thumb,
                            type: 'image',
                            url: url
                        });

                 return $q.when({
                            thumb: thumb,
                            type: 'image',
                            url: url
                        });
                }
                else{
                return $q.reject('Gallery id detected: you need to use a link to a single image')
                }


// IN ORDER TO ACCESS THE DETAILS OF AN IMGUR GALLERY TO PULL THE FIRST IMAGE ONLY WE NEED TO HAVE AN IMGUR ACCOUNT AND THEN PAY //
/*                  return $http.get("http://i.imgur.com/gallery/" + id + ".json").success(function (response){

                       id = "album_images" in response.data.image ? response.data.image.album_images.images[0].hash : response.data.image.hash;

                      thumb = "http://i.imgur.com/" + id + "t.jpg";
                      url ="http://i.imgur.com/" + id + ".jpg";

                      deferred.resolve({
                            thumb: thumb,
                            type: 'image',
                            url: url
                        });


                   }).catch(exceptions.create('Server communication error at Imgur'));*/


            }





        }







    }









})();