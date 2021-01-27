'use strict';

var Promise = require('bluebird');
var Request = require('request-promise');


var api = Api();
var uri = Config('shorten.uri');


var ShortenController = {
    shorten: Promise.coroutine(shorten)
}

/////////////////////////////////////

function* shorten(url) {


    let options = {
        uri: uri,
        qs: {url:url}
    };
    let response;


    response = yield Request(options).catch(function(error){});

    response = response ? response : url;

    return {
        shortURL : response
    }


}




///////////////////////////////////////////////////////////////////


module.exports.controller = ShortenController;
