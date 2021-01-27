(function () {
'use strict';
    angular
            .module('help')
            .controller('HelpController',HelpController)

    HelpController.$inject = ['$scope', '$ionicModal', '$ionicLoading', '$ionicPopup', 'emails'];


    function HelpController($scope, $ionicModal, $ionicLoading, $ionicPopup, emails){
        
        var self = this;
        
        self.question = {
        name:"",
            email:"",
            message:""
        };
        
        self.FAQs = [
            {
                question:" After I have locked my Squidle I get a URL, what is it for?",
                answer:"This is used to share your Squidle with your friends, click on this URL and it will take you to your Squidle"
            },
          {
                question:"I have created a Squidle but how do i send it to a friend?",
                answer:"Squidler allows you to send a Squidle via your favourite messaging platform.  Just copy and paste the Squidle link into your preferred app, e.g. email, whatsapp, sms and off you go"
            },

            {  question:" Can I share a Squidle with lots of people?",
                answer:"Absolutely! Just copy and paste the Squidle link into your preferred app, e.g. Twitter, reddit"
            },
                      {
                question:"Who can see my Squidle?",
                answer:"A Squidle is something anyone can see if they have the Squidle link, but only those who can solve it can get the prize."
            },
                                  {
                question:"Can I attach things other than images, animations and YouTube videos?",
                answer:"Not right now, but we are working really hard to add more functionality"
            },
            {
                question:"What kind of links can I use to attach an image or animation?",
                answer:"Any links ending in .jpg, .png, .jpeg, .gif or .gifv will work.  You can also use links to imgur e.g. imgur.com/gallery/H5Xw4dh"
            },
            {question:"Can I change the lifetime of my Squidle?",
            answer:"Yes you can - go to the share screen to change this. The defult is 21 hours, but can be as short as 5 mins and as long as 85 hours."},
            {question:"Can I make my Squidle harder?",
                answer:"Yes you can - go to the share screen and turn off hangman mode to remove the placeholders for the answer. "},
                        {question:"Can I delete a Squidle?",
                answer:"Yes - swipe or tap and hold on a Squidle to show the delte button. Deleting a Squidle that you own deltes it from our servers so people can no longer attempt your Squidle. If you don't own the Squidle then deleting simply removes it from your phone and removes all records of you viewing it from our servers."}



        ];
        
        self.toggleFAQ = toggleFAQ;
        self.isFAQShown = isFAQShown;
        self.submitQuestion = submitQuestion
        
        activate();
        
        
        
        ////////////////////////////////////////
        
        function activate(){
                          
        $ionicModal.fromTemplateUrl('app/components/help/askQuestionModal.html', {
            scope: $scope
        }).then(function (modal) {
            self.askQuestion = modal;
        });
                            

   
                            
        }
        
        function toggleFAQ(FAQ) {
    if (self.isFAQShown(FAQ)) {
      self.shownFAQ = null;
    } else {
      self.shownFAQ = FAQ;
    }
  }
  function isFAQShown(FAQ) {
    return self.shownFAQ === FAQ;
  }
        
        function submitQuestion(){
            
            if(self.helpForm.$valid){
                
            $ionicLoading.show();
            emails.create(self.question).then(function(){
                $ionicLoading.hide();
                self.askQuestion.hide();
                self.askQuestion.remove();
                activate();
            });
                
            }
            
            else{
             $ionicPopup.alert({
     title: "Incomplete help form",
                 okType: "button-assertive"
   });
            }
            
        
        }


    }




})();