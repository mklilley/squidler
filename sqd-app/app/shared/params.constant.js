(function () {
    'use strict';
    angular
        .module('sqd')
        .factory('params', params);
    
    function params(){
    
    
        var constants = {
            
            menu:menu,
            create:create,
            welcome:welcome,
            squidles: squidles,
            walkthroughs: walkthroughs
        
        }
        
        return constants
        
        
        ////////////////////////////////////////
        
        
        function menu(){
        
        var items = [{sref:"main.squidles",
         title: "Squidles"},
        {sref: "main.account",
         title: "Profile"},
        {sref: "main.help",
         title: "Help and Support"},
                     {sref: "main.settings",
         title: "Settings"}
                    ];
            
            
            
            return {
                items:items
            }
        
        }
        
        
        
        function create(){
        
        var nextText = {
            prize: "Next",
            challenge: "Next",
            answer: "Lock"
        };
            
            var panelText = {
                prize: "Choose what to send",
                challenge: "Lock it with a question",
                answer: "Your answer is the key"
            };
            
            var placeholderText = {
                prize: "Text and links go here",
                challenge:"Question goes here. You can also add links to content",
                answer:"Let's not make it too easy for them, muhahahaha!"
            };
            

            
            return {
                nextText: nextText,
                panelText: panelText,
                placeholderText:placeholderText
            }
        
        }
        
        
        function welcome(){
        
        var logos = ["img/logo_orange.svg", "img/logo_red.svg","img/logo_yellow.svg"];
            
            return {
            logos: logos
            }
        
        }
        
        function squidles(){
            
             var defaultAvatar = "img/avatar.jpg";
            
            return {
            defaultAvatar: defaultAvatar
            }
            
            
        }
        
        function walkthroughs(){
            
         var create = "You can paste a link to an image, animation or video - the content will be attached (jpg/png/imgur/gif/gifv/YouTube)";
            
            var squidles = "We've sent you a Squidle. It is locked (you haven't solved it yet) and it will expire in 24 hours. Tap to view, hold or swipe to share or see Squidle stats.";
            
            
                        return {
                squidles:squidles,
                            create:create
            }
            
        }
        
        

        
        
        
        
    }
    
    
    
    
    
    


})();


