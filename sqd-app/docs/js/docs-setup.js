NG_DOCS={
  "sections": {
    "api": "API Documentation"
  },
  "pages": [
    {
      "section": "api",
      "id": "camera.directive:camera",
      "shortName": "camera",
      "type": "directive",
      "moduleName": "camera",
      "shortDescription": "Creates an interfae to take photos and edit them",
      "keywords": "active allows api boolean called camera close closed creates currently daturi determine directive edit element function image interfae modal parent photos representing saved scope unique"
    },
    {
      "section": "api",
      "id": "camera.directive:kineticStage",
      "shortName": "kineticStage",
      "type": "directive",
      "moduleName": "camera",
      "shortDescription": "Creates a kinetic stage within this div, which is registered on the camera controller under the &quot;stage&quot; variable",
      "keywords": "api camera controller creates directive div kinetic registered stage variable"
    },
    {
      "section": "api",
      "id": "camera.service:crop",
      "shortName": "crop",
      "type": "service",
      "moduleName": "camera",
      "shortDescription": "This is a service used do crop an image through user interaction",
      "keywords": "$q angular api aspect backup camera cancel cancels catch copping crop current defined drawn exceptions exif exposing failed finish height image imgorig initialises interaction interface javascript js json kinetic layer layers load loaded method methods object objects orientation promise renders returned service staage stage start stored user width wrapped"
    },
    {
      "section": "api",
      "id": "camera.service:draw",
      "shortName": "draw",
      "type": "service",
      "moduleName": "camera",
      "shortDescription": "This is a service used to draw on an kineticjs image",
      "keywords": "$rootscope angular api array boolean camera colour creates defined determine draw drawing drawn essentially event events exposing image imge interaction js key kinetic kineticjs layer layers lines listeners longer method methods mode named object objects previous removes responds rootscope service staage stage start touch turns undo undoes user watch wrapped"
    },
    {
      "section": "api",
      "id": "camera.service:image",
      "shortName": "image",
      "type": "service",
      "moduleName": "camera",
      "shortDescription": "This is a service used to deal with the non-UI specific parts of the camera service (i.e. not drawing or cropping)",
      "keywords": "$q account additional angular api aspect backup camera catch changes create created creates crop cropping crops current data datauri deal defined desired discardchanges discards drawing drawings drawn exceptions exif exposing extra extracts failed height image images iphone javascript js json kinetic layer layers live load loaded method methods non-ui object objects orientation parts portrait principle problems promise properties r0lgodlhaqabaiaaaaaaap rejected render renders resolves returned revert reverted save saved saves service specific stage strange takes things top url version web width wrapped"
    },
    {
      "section": "api",
      "id": "sqd.directive:checkForLinks",
      "shortName": "checkForLinks",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "Applied to a sqd-input element with &quot;model&quot; attribute set to be an object. It scans the text input to check for links inside.  If it finds a link it will remove it from the text and the attachable content from the link will be added to the &quot;media&quot; key of the &quot;model&quot; object on the scope of the sqd-input. If there is no image or video data it will replace the link with a google shortlink.  Uses link.service",
      "keywords": "api applied attachable attribute check content data directive element finds google image input inside key link links media model object remove replace scans scope service set shortlink sqd sqd-input text video"
    },
    {
      "section": "api",
      "id": "sqd.directive:directiveIf",
      "shortName": "directiveIf",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "The &quot;directiveIf&quot; directive allows other directives",
      "keywords": "allows api attribute attributename controlled directive directive-if directiveif directives dynamically element evaluates expression false mydirective number object passed removed sqd"
    },
    {
      "section": "api",
      "id": "sqd.directive:fullScreenText",
      "shortName": "fullScreenText",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "Creates an interface to edit text in full screen mode",
      "keywords": "active api associated attached belongs boolean called case check-for-links checked content creates currently data determine directive edit element form full fullscreentext function hide hold input interface key links media modal mode object parents placeholder reference required scope screen specifies sqd sqd-required string text textarea true unique valid view"
    },
    {
      "section": "api",
      "id": "sqd.directive:noSpaces",
      "shortName": "noSpaces",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "Use on an input to stop people from being able to type a space",
      "keywords": "api directive input people space sqd type"
    },
    {
      "section": "api",
      "id": "sqd.directive:restrictMinMax",
      "shortName": "restrictMinMax",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "Use on number input with min and max attributes set. This directive will prevent users from using keyboard to write numbers outside the range.",
      "keywords": "api attributes directive input keyboard max min number numbers prevent range set sqd users write"
    },
    {
      "section": "api",
      "id": "sqd.directive:search",
      "shortName": "search",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "Creates an interfae to searach images from the internet",
      "keywords": "api arguments called creates directive element form funcion function handles hide image images img interfae internet link list modal object parent parents reference scope searach search select selected sqd takes thumb type unique url view"
    },
    {
      "section": "api",
      "id": "sqd.directive:sqdAvatar",
      "shortName": "sqdAvatar",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "",
      "keywords": "api avatar create directive evaluate hold image letter letterfrom letters profile sqd src text url variable"
    },
    {
      "section": "api",
      "id": "sqd.directive:sqdInput",
      "shortName": "sqdInput",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "Creates an input/textarea with some UI elements to allow the user to e.g. delete all text and also see if input is valid. Also allows the input to be scanned for attachable content from the web",
      "keywords": "allow allows angularjs api associated attachable attached attribute background belongs checked checkforlinks class colour content creates data delete depending directive element elements forbidden form greater holds html input inside invalid key length links maxlength media model ng-readonly nospaces note object placeholder required scanned selected set space sqd string text textarea true type typing ui user valid view web"
    },
    {
      "section": "api",
      "id": "sqd.directive:sqdNumber",
      "shortName": "sqdNumber",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "Creates an number input with arrows above and below to increment",
      "keywords": "api arrows changed creates directive disabled increment input max min model ng-model number size sqd step"
    },
    {
      "section": "api",
      "id": "sqd.directive:unique",
      "shortName": "unique",
      "type": "directive",
      "moduleName": "sqd",
      "shortDescription": "Username check. This creates an asyncValidator for the input which connects to the backend to check whether the text input matches an existing username.  If the username is already taken the validator will fail, i.e. Angular&#39;s formName.inputName.$errors object will be populated with a &quot;unique&quot; entry and formName.inputName.$invalid = true.  Use in conjunction with ngMessages",
      "keywords": "$errors $invalid angular api asyncvalidator backend check conjunction connects creates directive entry existing fail formname input inputname matches ngmessages object populated sqd text true unique username validator"
    },
    {
      "section": "api",
      "id": "sqd.service:emails",
      "shortName": "emails",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of emailsProvider. Used to send emails to the Squidler team",
      "keywords": "$q angular api asap backend catch communicate create data email emails emailsprovider exceptions exposing failed help jo message method methods object promise rejected resolves resources returned send sends service sqd squidler support team"
    },
    {
      "section": "api",
      "id": "sqd.service:exceptions",
      "shortName": "exceptions",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "Service used to catch any errors/exceptions that are produced in a prmomise chain and log the details out to both the console and to log variable on the rootScope",
      "keywords": "$ionicloading $ionicpopup $rootscope angular api app catch chain communicating console create creating data deferred details display error errors exposing fail function hide ionic loading log logging logs message method methods object pass popup prmomise problem produced promise promise_message rejected rejection rejects returns rootscope saves screen service silent sqd squidle squidles supplied true variable"
    },
    {
      "section": "api",
      "id": "sqd.service:files",
      "shortName": "files",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of filesProvider. Used to upload image files to the backend",
      "keywords": "$q angular api array backend blobs catch communicate create creates data datauri exceptions exposing failed file files filesprovider http image jpeg method methods object objects promise r0lgodlhaqabaiaaaaaaap rejected resolves resources returned service sqd takes turns upload uploaded"
    },
    {
      "section": "api",
      "id": "sqd.service:googleImages",
      "shortName": "googleImages",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of googleImagesProvider. Used to search google images",
      "keywords": "$http $q angular api aspect catch chicken exceptions exposing failed form google googleimagesprovider http images integer method methods nextpageindex object pagenum performed promise queries query read rejected resolves returned returns search searching second service set sqd time url"
    },
    {
      "section": "api",
      "id": "sqd.service:history",
      "shortName": "history",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of historyProvider. Used to retrieve a history of the Squidles that have either been created or viewed by the user",
      "keywords": "$q angular api array backend catch communicate created creating details entry exceptions exposing failed handle history historyprovider html5 interface key local method methods object objects options promise read refreshall refreshed resolves resources retrieve retrieves returned service sqd squidle squidles storage stores structure true user viewed"
    },
    {
      "section": "api",
      "id": "sqd.service:imgur",
      "shortName": "imgur",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service used to extract image imformation from an imgur link, e.g, thumbnail and full image links",
      "keywords": "$http $q angular api catch exceptions exposing extract extracts failed form full http image imformation imgur link links method methods object processed promise read rejected resolves service sqd string thumbnail type url"
    },
    {
      "section": "api",
      "id": "sqd.service:links",
      "shortName": "links",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service used to extract image or video imformation from a link contained within some input text",
      "keywords": "$http $q angular api catch contained data exceptions exposing extract extracted extracting failed form funny http image imformation imgur initial input inside key link method methods object omg piece processed processes produced promise provided read reads rejected replacing resolves service shortened shortening soooooo sqd string text type url video youtube"
    },
    {
      "section": "api",
      "id": "sqd.service:profiles",
      "shortName": "profiles",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of profilesProvider. Used to retrieve and update a user&#39;s profile",
      "keywords": "$q angular api avatar backend bio catch communicate data entries exceptions exposing failed files first_name github_username google_plus_username html5 images interface joblogs key last_name local locally location london method methods object options presented profile profiles profilesprovider promise public question read refresh rejected requested resolves resources retrieve retrives returned server service set specific speciic sqd storage stored stores true twitter_username update updated updates upload user username"
    },
    {
      "section": "api",
      "id": "sqd.service:resources",
      "shortName": "resources",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of resourcesProvider. Used to communicte with all squidler backend resources",
      "keywords": "$cordovanetwork $http $ionicplatform $q $timeout _method angular api avaiable backend catch code communicte config create created creates data described encoding exceptions exposing extra failed form history http identify ionic joblogs json key method methods minimum network ngcordova object options parameter params platform post primary prize profile promise read reading reads rejected requested resolves resource resources resourcesprovider response returned service set setwaittime specific sqd squidle squidler squidles takes time timeout uniquely update updated updates url wth"
    },
    {
      "section": "api",
      "id": "sqd.service:squidles",
      "shortName": "squidles",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of squidlesProvider. Used to create, read and updates squidles",
      "keywords": "$q $rootscope adition altogether angular answer api backend base64 blue catch challenge colour communicate consistent converted correct cough create created creates currently data datauris day details device entirely exceptions expires_at expiry exposing failed favourite field files guess hint hinton hints history hour html5 https identify image include incorrect indicating interface interval jpeg key local main method methods note object office op original oterwise photo presented prize profile profiles promise provided r0lgodlhaqabaiaaaaaaap read received rejected rejects remove removed removes request resolves resources retrieve retrive returnd returned rootscope server service sets short shortlink sqd squidle squidler squidles squidlesprovider storage stored stores successfuly text true units update updated updates upload uploaded urls user values video vj08tg6 web week"
    },
    {
      "section": "api",
      "id": "sqd.service:statistics",
      "shortName": "statistics",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of statisticsProvider. Used to retrieve a statistics information on a particular Squidle",
      "keywords": "$q angular api array backend communicate exposing f36sab6 html5 interface link local method methods object player players profile profiles promise public read resolves resources retrieve retrieves retrives returned service short specific sqd squidle statistics statisticsprovider stats storage stores summary user"
    },
    {
      "section": "api",
      "id": "sqd.service:stores",
      "shortName": "stores",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of storesProvider. Used to interface with the html5 local storage",
      "keywords": "$localstorage $q access angular api array catch change changed create created data deleted delted empty entire entries entry exceptions exist exposing failed fields form html5 ids image interface local method methods note object original party plural prize promise read reads rejected remove removed removes reset resolves returned save saved saves service specific sqd squidle squidles storage store stored storesprovider string strings tempsquidle third type unique update updated vj08tg6"
    },
    {
      "section": "api",
      "id": "sqd.service:subscriptions",
      "shortName": "subscriptions",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of subscriptionsProvider. Used to deal with creating a subscription or checking whether a user has subscribed through Google Play or the App Store.",
      "keywords": "$q angular api app back-end catch checking checks confirm create created creating deal exceptions exposing failed google html5 interface joblogs local method methods object play promise read rejected resolves returned sends service sqd squidler storage store stored stores subscirption subscribed subscription subscriptionsprovider user username valid verify"
    },
    {
      "section": "api",
      "id": "sqd.service:time",
      "shortName": "time",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service used to process time information relating to the squidle expiry the aid in the creation of a countdown",
      "keywords": "aid api array calculates countdown creation expires expires_at expiry exposing form hourminsec hours key method methods mins number object process relating remaining returns seconds service sqd squidle string takes time timesecs timezone timezone_type utc"
    },
    {
      "section": "api",
      "id": "sqd.service:users",
      "shortName": "users",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service that is returned as part of usersProvider. Used to create, read and update a user&#39;s account details. Users can only use this service on their own accounts",
      "keywords": "$q access account accounts angular api backend catch communicate create data details email exceptions exposing failed joblogs method methods object password private promise question read rejected resolves resources retrives returned service specific sqd update user username users usersprovider verified"
    },
    {
      "section": "api",
      "id": "sqd.service:youtube",
      "shortName": "youtube",
      "type": "service",
      "moduleName": "sqd",
      "shortDescription": "This is a service used to extract video imformation from a youtube link, e.g, thumbnail and full video links",
      "keywords": "$http $q angular api catch exceptions exposing extract extracts failed form full http https imformation link links method methods object processed promise read rejected resolves service sqd string thumbnail type url video youtube"
    },
    {
      "section": "api",
      "id": "squidles.directive:sqdPause",
      "shortName": "sqdPause",
      "type": "directive",
      "moduleName": "squidles",
      "shortDescription": "Allows an iframe to be programatically paused by broadcasting the event &#39;pause&#39; to the scope using  $scope.$broadcast(&#39;pause&#39;)",
      "keywords": "$broadcast $scope allows api broadcasting directive event iframe pause paused programatically scope squidles"
    }
  ],
  "apis": {
    "api": true
  },
  "__file": "_FAKE_DEST_/js/docs-setup.js",
  "__options": {
    "startPage": "/api",
    "scripts": [
      "js/angular.min.js",
      "js/angular-animate.min.js",
      "js/marked.js"
    ],
    "styles": [],
    "title": "API Documentation",
    "html5Mode": false,
    "editExample": true,
    "navTemplate": false,
    "navContent": "",
    "navTemplateData": {},
    "loadDefaults": {
      "angular": true,
      "angularAnimate": true,
      "marked": true
    }
  },
  "html5Mode": false,
  "editExample": true,
  "startPage": "/api",
  "scripts": [
    "js/angular.min.js",
    "js/angular-animate.min.js",
    "js/marked.js"
  ]
};