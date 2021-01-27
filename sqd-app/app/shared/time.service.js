(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('time', time);

    time.$inject = [];
    
     /**
         * @ngdoc service
         * @name sqd.service:time
         * @returns {object} Service object exposing methods - hourMinSec, remaining
         *
         * @description
         * This is a service used to process time information relating to the squidle expiry the aid in the creation of a countdown
         */



    function time() {


        var service = {

            hourMinSec: hourMinSec,
            remaining: remaining

        };

        return service;

        


        ////////////////////////////////////////
                        /**
         * @ngdoc method
         * @name hourMinSec 
         * @methodOf  sqd.service:time
         * @param {integer} timeSecs Some number of seconds
         * @returns {object} Key "string" gives something of the form 22h 23m 6s. Key array gives something of the form [22,23,6]
         * 
         * @description Takes seconds and returns hours mins seconds
         * @example
         * <pre>time.hourMinSec(45632)</pre>
         * 
         */

        function hourMinSec(timeSecs) {
            
            
         var hours = (timeSecs/60>>0)/60>>0,       
             H = hours==0 ? ""  : hours+"h ";
            
         var mins = (timeSecs/60>>0)%60,
             M = mins ==0 ? ""  : mins+"m " ;

        var secs = (timeSecs||0) % 60,
            S = secs ==0 ? ""  : secs+"s ";
                        
                        return {
                            string: H + M + S,
                            array: [hours,mins,secs]
                        }
                        
        }
        
                                /**
         * @ngdoc method
         * @name remaining 
         * @methodOf  sqd.service:time
         * @param {obj} expires_at time/date object with keys 'date', 'timezone_type', 'timezone'
         * @returns {int} Seconds remaining
         * 
         * @description Calculates the number of seconds remaining before the squidle expires
         * @example
         * <pre>time.remaining({"date":"2015-12-04 21:27:40","timezone_type":3,"timezone":"UTC"})</pre>
         * 
         */
        

        
        function remaining(expires_at){
            
             var arr = expires_at.split(/[- :]/),
   exp_date = new Date(Date.UTC(arr[0], arr[1]-1, arr[2], arr[3], arr[4], arr[5]));
            
            var timeRemaining = Math.round((exp_date-Date.now())/1000);
            
            return timeRemaining
            
        }
    




    }









})();