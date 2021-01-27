(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('youtube', youtube);

    youtube.$inject = ['$q', '$http', 'exceptions'];

    /**
         * @ngdoc service
         * @name sqd.service:youtube
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service used to extract video imformation from a youtube link, e.g, thumbnail and full video links
         */

    function youtube($q, $http, exceptions) {


        var service = {

            read: read

        };

        return service;



        ////////////////////////////////////////

           /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:youtube
         * @param {string} url Url of Youtube video
         * @returns {promise} Resolves to an object of the form - {thumb: string, type: 'video', url: string} -  if url was successfully processed, otherwise the promise is rejected
         * 
         * @description Extracts video information from an Youtube link 
         * @example
         * <pre>imgur.read('https://www.youtube.com/watch?v=VfCeIKseyYA')</pre>
         * 
         */

        function read(url) {

             var deferred = $q.defer();


          extractIdFromUrl(url).then(getData).catch(exceptions.create('Problem processing your YouTube link',deferred,'youtube.read error'));

            return deferred.promise;


            ////////////////////////////////////////

            function extractIdFromUrl(url){

                var id,
                    QIndex;

                id = url.indexOf('youtube.com') != -1 ? getParameterByName('v', url) :  url.slice(url.lastIndexOf('/') + 1, url.length);

                QIndex = id.indexOf('?');

                id = QIndex != -1 ? id.slice(0, QIndex) : id;

                return id!="" ? $q.when(id) : $q.reject('Empty YouTube id');


                }

            function getParameterByName(name, text){

                name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

                var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                    results = regex.exec(text);

                return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));

            }

            function getData(id){

                var thumb = "http://img.youtube.com/vi/" + id + "/default.jpg",
                    url = "http://www.youtube.com/embed/" + id;

                deferred.resolve({
                            thumb: thumb,
                            type: 'video',
                            url: url
                        });

                      return $q.when({
                            thumb: thumb,
                            type: 'video',
                            url: url
                        });


            }









        }







    }









})();