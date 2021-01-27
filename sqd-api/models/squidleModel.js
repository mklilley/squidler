'use strict';

var Promise = require('bluebird');
var crypto = require('crypto');
var base62 = require('base-x')('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
var randomBytes = Promise.promisify(crypto.randomBytes);

var api = Api();
var Base = Model('Base');
var REDIS_PREFIX = Config('squidle.REDIS_PREFIX');
var defaultExpiryHrs = Config('squidle.EXPIRY_HRS');
var redis = Redis();

var clonable = {};

var modelSchema = {
    short: {
        type:'string',
        searchable:{caseSensitive:true},
        enumerable:true,
        gettable:true,
        default:undefined
    },
    challenge: {
        type:'hash',
        enumerable:true,
        gettable:true,
        default:{}
    },
    prize: {
        type:'hash',
        enumerable:true,
        gettable:true,
        default:{}
    },
    answer: {
        type:'string',
        enumerable:true,
        gettable:true,
        default:''
    },
    attemptedBy:{
        type:'oset',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    solvedBy:{
        type:'oset',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    op:{
        type:'string',
        enumerable:true,
        gettable:true,
        default:''
    },
    state:{
        type:'bitmap',
        enumerable:true,
        gettable:false,
        offset: {updatable: 0, hintsOn: 1, charactersOn: 2},
        default: ["updatable","hintsOn","charactersOn"]
    },
    hints: {
        type:'list',
        enumerable:true,
        gettable:true,
        default:undefined
    },
    expiresAt:{
        type:'string',
        enumerable:true,
        gettable:true,
        default: ()=>{let date = new Date();
            date.setHours(date.getHours() + defaultExpiryHrs);
            return Math.floor(date.getTime()/1000);
        }
    }

};


class Squidle extends Base {


    constructor(data) {


        super(modelSchema,data,{});


    }



}

    Squidle.prototype.solve    = Promise.coroutine(solve);
    Squidle.prototype.generateHints   = Promise.coroutine(generateHints);
    Squidle.prototype.generateHintString   = Promise.coroutine(generateHintString);
    Squidle.prototype.proxy   = Promise.coroutine(proxy);
    Squidle.generateShort      = Promise.coroutine(generateShort);
    Squidle.model               =  Promise.coroutine(model);
    Squidle.prototype.model    = Promise.coroutine(model);
    Squidle.model    = Promise.coroutine(model);



    /////////////////////////////////////

    function* model(){
    return  modelSchema;
    }

    function* solve(guess,username) {


        let correct = this.answer.replace(/ /g, "") === guess.replace(/ /g, "");

        let numSolves = yield redis.zscore(REDIS_PREFIX + ":{" + this.id + "}:solvedBy", username);

        if(this.op !== username && numSolves == null){
            yield Squidle.set({by:{short:this.short}, target:"attemptedBy", data:{[username]:1}, action:"incr", exp:this.expiresAt});
        }


        if(correct){
            if(this.op !== username && numSolves == null){
                let nowMs = new Date().getTime();
              yield Squidle.set({by:{short:this.short}, target:"solvedBy", data:{[username]:nowMs}, exp:this.expiresAt});
            }

            return {short: this.short, prize : this.prize};
        }
        else{
            throw new SqdError({message:"Squidle.solve: Wrong answer",code:403});
        }


    }

    function* generateShort(){
        let bytes = yield randomBytes(16);
        let short = base62.encode(bytes);

        let squidleExists = yield Squidle.exists({by:{short:short}});

        if(squidleExists){
            return yield Promise.coroutine(generateShort)();
        }
        else{
            return short;
        }

    }



    function* generateHints(){

        let answer = this.answer;
        let charactersIndex = [];
        let spacesIndex = [];


        let i=-1;
        while(1){
            i = answer.indexOf(" ",i+1);
            if(i!=-1) {
                spacesIndex.push(i);
            }
            else{
                break;
            }
        }
        for (let j=0; j< answer.length; j++){
            if(spacesIndex.indexOf(j)==-1) {
                charactersIndex.push(j);
            }
        }


        // http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

        function shuffleArray(array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        }

        shuffleArray(charactersIndex);


       return charactersIndex



    }

    function* generateHintString(numberOfHints){

        let answer = this.answer;

        let hint = answer.replace(/\S/gi, "\u005F");

        for(let j=0; j<numberOfHints; j++){
            let i = parseInt(this.hints[j]);
            hint = hint.substr(0, i) + answer[i] + hint.substr(i + 1);
        }
        
            hint = hint.split('').join(' ');



       return hint;


    }

    function* proxy({short = "", expires=true}){

        yield redis.set(REDIS_PREFIX + ":getBy:short:{" + short + "}",this.id);

        if(expires){
            yield redis.expireat(REDIS_PREFIX  + ":getBy:short:{" + short + "}", this.expiresAt);
        }

        return;

    }















///////////////////////////////////////////////////////////////////

module.exports.model = Squidle;
