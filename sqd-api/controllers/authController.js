'use strict';

var Promise = require('bluebird');

var api  = Api();
var User = Model('User');
var Auth = Model('Auth');
var Stats = Model('Stats');
var ttl = parseInt(process.env.SQD_API_USER_TTL) || 3600;
var SECRET_SALT = Config('auth.SECRET.salt');
var enqueue = Promise.promisify(api.tasks.enqueue);


var AuthController = {
    login: Promise.coroutine(login),
    logout: Promise.coroutine(logout),
    verify: Promise.coroutine(verify)
}
    /////////////////////////////////////
    function* login(email){

        let hash = Hash(email);

        let userExists = yield User.exists({by:{email:hash}});

        if(userExists){
            let user = yield User.get({by:{email:hash}});
            yield user.generateToken();
            yield user.save();

            if(user.id < 0){
                let exp =  Math.floor(Date.now() /1000)+ttl;
                yield User.setExpiry({by:{email:hash}, at:exp});
            }

            yield enqueue("sendLoginEmail", {email: email, token: user.token}, 'default')
                .catch((err)=> {
                throw new SqdError({message: "Problem sending your one-time login", code: 500});
            });
        }
        else{
            let exp =  Math.floor(Date.now() /1000)+ttl;
            let tempUser = new User({email:hash});
            yield tempUser.generateToken();
            yield tempUser.save({exp:exp, temp:true});
            yield enqueue("sendLoginEmail", {email: email, token: tempUser.token}, 'default')
                .catch((err)=> {
                    throw new SqdError({message: "Problem sending your one-time login", code: 500});
                });
            return;
        }


    }


    function* verify(token){

        let user = yield User.get({by:{token:token}});
        
        if(user.id < 0){
            yield User.destroy({by:{token:token}});
            let permUser = new User({email:user.email});
            yield permUser.generateToken();
            yield permUser.save();
            yield api.squidle.createWelcome(permUser.token);
            yield Stats.set({by:{name:"user"}, target:"createdOn", data:{[endOfDaySec()]:1}, action:"incr"});
            yield Stats.set({by:{name:"user"}, target:"total", data:1, action:"incr"});
            return permUser.token;
        }
        else{
            yield user.generateToken();
            yield user.save();
            return user.token;
        }


    }


    function* logout(username,token){
        
        if(username !==undefined){
            yield User.destroy({by:{username:username}, only:["token"]});
            return {message:"User with username = " + username + " has been logged out."};
        }
        else{
            if(token !==undefined){
               let auth =  yield Auth.exists({by:{token:token}});
                if(auth){
                    yield User.logoutAll();
                    yield Auth.destroy({by:{token:token}});
                    return {message:"ALL users have been logged out"};
                }
                else{
                    return Promise.reject("Unable to logout all users: token provided not valid");
                }

            }
            else{
                let exp = Math.floor(Date.now() /1000)+60;
                let auth = new Auth();
                yield auth.generateToken();
                yield auth.save({exp:exp});
                return {message:"You are trying to logout ALL users - If you are sure you want to do this then resubmit your request with the attached authorisation token", token: auth.token};
            }
        }
        
    }






///////////////////////////////////////////////////////////////////


module.exports.controller = AuthController;
