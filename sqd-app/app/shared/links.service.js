(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('links', links);

    links.$inject = ['$q', '$http', 'youtube', 'imgur', 'exceptions'];
    
     /**
         * @ngdoc service
         * @name sqd.service:links
         * @param {object} $q Angular promise service
         * @param {object} $http Angular http service
         * @param {object} youtube Service to extract video information from a youtube link
         * @param {object} imgur Service to extract image information from an imgur link
          * @param {object} exceptions Service to catch a failed promise
         * @returns {object} Service object exposing methods - read
         *
         * @description
         * This is a service used to extract image or video imformation from a link contained within some input text
         */



    function links($q, $http, youtube, imgur, exceptions) {


        var service = {

            read: read

        };

        return service;

        


        ////////////////////////////////////////
                        /**
         * @ngdoc method
         * @name read 
         * @methodOf  sqd.service:links
         * @param {string} text Any piece of text
         * @returns {promise} Resolves to an object of the form - {text: string, data: object}. Data is an object of the form {thumb: string, type: string, url: string} provided by a data service such as imgur or youtube (if no url in the text the data key is not produced). Text is a string that contains the initial input text, either without any url if data can be extracted from it, otherwise the url is shortened.  If a url contained within the text cannot be processed the promise is rejected
         * 
         * @description Reads some text and processes the first link inside it, either by shortening it or extracting it and replacing it with the image/video information contained within it.
         * @example
         * <pre>link.read('OMG this is soooooo funny http://imgur.com/gallery/whrgItd')</pre>
         * 
         */


        function read(text) {

            var deferred = $q.defer(),
                words = text.split(" "),
                linkCheck = ['http', 'www'],

              linkDataCheck = {
                    image: {
                        list:['.jpg', '.jpeg', '.png', '.gif', '.gifv'],
                    getData:function(url){
                        
                        var urlSplit = url.split("."),
                            ext = urlSplit.pop();
                        
                        if(ext=="gifv"){
                            urlSplit.push("gif");
                            url = urlSplit.join(".");
                            
                        }
                        
    
                           return $q.when({
                            thumb: url,
                            type: 'image',
                            url: url
                        });
                        }},
                    youtube: {
                        list:['youtube.com', 'youtu.be'],
                        getData: function(url){
                            return youtube.read(url);
                        }},
                    imgur: {
                        list: ['imgur'],
                        getData:function(url){
                            return imgur.read(url);
                        }}

                };



            hasLink(words).then(processLink, doNothing).catch(exceptions.create('Problem processing your link', deferred));


            return deferred.promise;


            ////////////////////////////////////////

            function hasLink(words) {

                for (var i = 0; i < words.length; i++) {


                    var bool = linkCheck.some(function (element) {

                        return words[i].toLowerCase().indexOf(element) != -1;

                    });

                    if (bool) {

                        return $q.when({
                            words: words,
                            link: words[i],
                            linkIndex: i
                        });

                    }

                }

                if (!bool) {
                    return $q.reject({
                        words: words
                    });
                }


            }

            function processLink(data) {

                return hasLinkData(data).then(getLinkData, shortenLink);

                ////////////////////////////////////////

                function hasLinkData(data) {

                    var link = data.link,
                        bool,
                        value;

                   for(var key in linkDataCheck) {
                       value = linkDataCheck[key].list;

                        for (var i = 0; i < value.length; i++) {

                       bool = link.toLowerCase().indexOf(value[i]) != -1;


                        if (bool) {

                            data.get = linkDataCheck[key].getData;

                            return $q.when(data);

                        }

                    }


};


                    if (!bool) {
                         return $q.reject(data);
                         }

                    return

                }

                function getLinkData(data) {

                    var words = data.words,
                        index = data.linkIndex;

                   return data.get(data.link).then(postProcess).catch(problemGettingData);


                    ////////////////////////////////////////

                    function postProcess(data) {

                        var text;

                        words[index] = '';

                        text = words.join(' ');

                        deferred.resolve({
                            text: text,
                            data: data
                        });

                        return $q.when({
                            text: text,
                            data: data
                        });


                    }
                    
                    function problemGettingData(error){
                        
                        var text = words.join(' ');
                        
                          deferred.reject({text:text});
                        
                        return $q.reject({text:text})
                    
                    
                    }




                }

                function shortenLink(data) {


                    var api = 'https://www.googleapis.com/urlshortener/v1/url',
                        auth = {key:'AIzaSyCZn1W6SMErAw0QBbSr8pWuI1G1O4r4YUo'},
                        url = {longUrl:data.link},
                        words = data.words,
                        index = data.linkIndex;

                   return  $http.post(api, url, {params: auth}).then(postProcess).catch(problemWithShortener);

                    ////////////////////////////////////////

                    function postProcess(response){
                        var text;

                        words[index] = response.data.id;

                        text = words.join(' ');

                        deferred.resolve({text:text});

                        return $q.when({text:text});


                    }
                    
                    function problemWithShortener(error){
                    
                        deferred.reject({text:text});
                        
                        exceptions.create('Problem with Google link shortener')(error);
                    }



                }

            }



            function doNothing(words) {

                var text = words.words.join(' ');

                deferred.resolve({text:text});

                return $q.when({text:text});

            }





        }







    }









})();