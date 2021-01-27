'use strict';

var Promise = require('bluebird');
var Request = require('request-promise');


var api  = Api();
var Squidle = Model('Squidle');
var User = Model('User');
var File = Model('File');
var Stats = Model('Stats');
var fileUpdateRoute = Config('file.UPDATE_ROUTE');
var fileDeleteRoute = Config('file.DELETE_ROUTE');
var BASE = Config('file.BASE');
var costPerHint = Config('squidle.costPerHint');


var SquidleController = {
    create        : Promise.coroutine(create),
    createWelcome : Promise.coroutine(createWelcome),
    get           : Promise.coroutine(get),
    getStats      : Promise.coroutine(getStats),
    update        : Promise.coroutine(update),
    destroy       : Promise.coroutine(destroy),
    solve         : Promise.coroutine(solve),
    updatable     : Promise.coroutine(updatable),
    getHint       : Promise.coroutine(getHint)
}

    /////////////////////////////////////

    function* create(data,username) {

        let squidle = new Squidle(data);
        squidle.short = yield Squidle.generateShort();
        squidle.hints = yield squidle.generateHints();
        squidle.op = username;
        squidle = yield squidle.save({exp:squidle.expiresAt});

        yield User.set({by:{username:username}, target:"sent", data: {[squidle.short]:squidle.expiresAt}  });

        let hint = squidle.answer.replace(/\S/gi, "\u005F ");

        yield Stats.set({by:{name:"squidle"}, target:"createdOn", data:{[endOfDaySec()]:1}, action:"incr"});
        yield Stats.set({by:{name:"squidle"}, target:"total", data:1, action:"incr"});

        return {
            short: squidle.short,
            challenge : squidle.challenge,
            prize : squidle.prize,
            answer : hint,
            op : squidle.op,
            expiresAt : squidle.expiresAt,
            hintsOn :  yield Squidle.getBit({by:{short:squidle.short}, target:"state", only:["hintsOn"]}),
            updatable: yield Squidle.getBit({by:{short:squidle.short}, target:"state", only:["updatable"]})
        } 
    }

    function* createWelcome(userToken) {
        let data = {
            challenge  : {text:"What colour is squid ink?",photo:"https://www.deepseanews.com/wp-content/uploads/2013/02/Hawaiian_bobtail_squid04.jpeg"},
            prize      : {text:"Well done! Now time to make a Squidle of your own.",photo:"https://i.giphy.com/pPDYTGwAQyXi8.gif"},
            answer     : "black"
        };
        let squidle = new Squidle(data);
        squidle.short = yield Squidle.generateShort();
        squidle.hints = yield squidle.generateHints();
        squidle.op = "SquidlerTeam";
        squidle = yield squidle.save({exp:squidle.expiresAt});

        if(userToken) {
            yield User.set({by: {token: userToken}, target: "recv", data: {[squidle.short]: squidle.expiresAt}});
        }
        else{
           yield squidle.proxy({short:'ImASquidle'});
        }

        return squidle
    }


    function* get(short,username) {

        let squidle = yield Squidle.get({by:{short:short}});

        if (username !== squidle.op ) {
            if(username !== "guest") {
                yield User.set({by: {username: username}, target: "recv", data: {[squidle.short]: squidle.expiresAt}});
            }

             yield Squidle.setBit({by:{short:short}, target:"state", zero:["updatable"]});

          }

        let charactersOn = yield Squidle.getBit({by:{short:squidle.short}, target:"state", only:["charactersOn"]});
        let user = yield User.get({by:{username:username}, only:["hints"]});
        let hint = charactersOn ? yield squidle.generateHintString((user.hints ||{})[squidle.short] || 0) : "";

        return {
            short: squidle.short,
            challenge : squidle.challenge,
            answer :  hint,
            op : squidle.op,
            expiresAt : squidle.expiresAt,
            hintsOn : yield Squidle.getBit({by:{short:short}, target:"state", only:["hintsOn"]})
        }
    }

    function* getStats(short) {

        let squidle = yield Squidle.get({by:{short:short}, only:["attemptedBy", "solvedBy"]});


        return {
            attemptedBy : squidle.attemptedBy || {},
            solvedBy : squidle.solvedBy || {}
        }

    }


    function* update(data,cost,username) {

        let squidle;


        if(data.expiresAt !== undefined){
            //We do this first set following by the setExpiry because the setExpiry requires the whole squidle be pulled before pushing again.  In that time someone might have received the squidle and so would have the old expiry. This prevents that
            yield Squidle.set({by:{short:data.short}, target:"expiresAt", data:data.expiresAt, exp:data.expiresAt});
            yield Squidle.setExpiry({by:{short:data.short}, at:data.expiresAt});
            yield User.set({by:{username:username}, target:"sent", data: {[data.short]:data.expiresAt} });

            let expiresAtMs = parseInt(data.expiresAt)*1000;
            let expiresAtDate = new Date(expiresAtMs);

            squidle = yield Squidle.get({by:{short:data.short}});

            //Although this update pulls data before pushing back and there is a chance that in the meantime someone has gone and pulled the Squidle they will get the old file which at the moment still exists on the system
            let  filesModified = false;
            let admin = yield User.get({by:{username:"admin"}, only:["token"]});
            for(let key of ["challenge","prize"]){
                if("photo" in squidle[key]){
                    let url = squidle[key].photo;
                    let isSquidlerFile = url.indexOf(BASE) !== -1;
                    if (isSquidlerFile) {
                        let start = url.lastIndexOf('/') + 1;
                        let end = url.lastIndexOf('.');
                        let filename = url.slice(start, end);

                        let fileExists = yield File.exists({by:{name: filename}});

                        if(fileExists) {
                            filesModified = true;

                            yield File.set({by:{name:filename}, target:"expiresAt", data:expiresAtDate});

                        }


                    }
                }
            }



        }

        else{
            if(data.hintsOn !== undefined){
                if(data.hintsOn===1){
                    yield Squidle.setBit({by:{short:data.short}, target:"state", one:["hintsOn"]});
                }
                else{
                    yield Squidle.setBit({by:{short:data.short}, target:"state", zero:["hintsOn"]});
                }

            }

            if(cost!==undefined){

                yield User.set({by:{username:username}, target:"credits", data:-cost, action:"incr"});

            }
            squidle = yield Squidle.get({by:{short:data.short}});
        }





             let charactersOn = yield Squidle.getBit({by:{short:data.short}, target:"state", only:["charactersOn"]});
              let hint = charactersOn ? yield squidle.generateHintString(0) : "";

            return {
                short: squidle.short,
                challenge : squidle.challenge,
                prize : squidle.prize,
                answer :  hint,
                op : squidle.op,
                expiresAt : squidle.expiresAt,
                hintsOn : yield Squidle.getBit({by:{short:data.short}, target:"state", only:["hintsOn"]}),
                updatable: yield Squidle.getBit({by:{short:data.short}, target:"state", only:["updatable"]})
            }


    }


    function* destroy(short,username) {

        yield User.destroy({by:{username:username}, only:[["sent",short]]});
        let admin = yield User.get({by:{username:"admin"}, only:["token"]});

        let squidle = yield Squidle.get({by:{short:short}, only:["challenge","prize"]});

        for(let key of ["challenge","prize"]){
            if("photo" in squidle[key]){
                let url = squidle[key].photo;
                let isSquidlerFile = url.indexOf(BASE) !== -1;
                if (isSquidlerFile) {
                    let start = url.lastIndexOf('/') + 1;
                    let end = url.lastIndexOf('.');
                    let filename = url.slice(start, end);

                    let fileExists = yield File.exists({by:{name: filename}});

                    if(fileExists) {

                        yield File.destroy({by:{name: filename}});
                    }


                }
            }
        }

        yield Squidle.destroy({by:{short:short}});

        return;

    }

    function* solve(short, guess, username) {

         let squidleExists = yield Squidle.exists({by:{short:short}});

         if(!squidleExists){
             yield User.destroy({by:{username:username}, only:[["recv",short]]});
             throw new SqdError({message:"Squidle.solve: Squidle with short = "+ short + " does not exist",code:404});
         }

      let squidle = yield Squidle.get({by:{short:short}, only:["short","answer","prize","expiresAt", "op"]});

        if(squidle.op !== username){
            yield Squidle.setBit({by:{short:squidle.short}, target:"state", zero:["updatable"]});
        }

        return yield squidle.solve(guess,username);
    }



    function* updatable(short) {

       return yield Squidle.getBit({by:{short:short}, target:"state", only:["updatable"]});

    }


    function* getHint(short, username){

        let squidle = yield Squidle.get({by:{short:short}, only:["answer","hints", "op", "short"]});

        if(squidle.op !== username) {
            yield Squidle.setBit({by: {short: squidle.short}, target: "state", zero: ["updatable"]});
        }

        let numberOfHints = yield User.set({by:{username:username}, target:"hints", data:{[squidle.short]:1}, action:"incr"});

        let hint = yield squidle.generateHintString(numberOfHints);

        yield User.set({by:{username:username}, target:"credits", data:-costPerHint, action:"incr"});


        return {answer:hint};

    }










///////////////////////////////////////////////////////////////////


module.exports.controller = SquidleController;
