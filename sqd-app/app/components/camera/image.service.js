(function () {
    'use strict';
    angular
        .module('camera')
        .factory('image', image);

    image.$inject = ['$q', 'Kinetic', 'EXIF', 'exceptions'];

    /**
     * @ngdoc service
     * @name camera.service:image
     * @param {object} $q Angular promise service
     * @param {object} Kinetic Kinetic.js wrapped in angular service
     * @param {object} EXIF EXIF.js wrapped in angular service
     * @param {object} exceptions Service to catch a failed promise
     * @returns {object} Service object exposing methods - load, render, save, discardChanges
     *
     * @description
     * This is a service used to deal with the non-UI specific parts of the camera service (i.e. not drawing or cropping)
     */


    function image($q, Kinetic, EXIF, exceptions) {


        var service = {

            load: load,
            render: render,
            save: save,
            discardChanges: discardChanges

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name load 
         * @methodOf  camera.service:image
         * @param {string} dataURI dataURI of an image (can also be a url from the web in principle)
         * @returns {promise} Resolves to an object with keys image, aspect, orientation, width, height -  if url was successfully loaded, otherwise the promise is rejected
         * 
         * @description Create an image object from a dataURI and extracts some useful information about it. Takes into account strange orientation problems with images takes with an iphone
         * @example
         * <pre>image.load('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')</pre>
         * 
         */

        function load(dataURI) {

            var deferred = $q.defer(),
                image = new Image();

            //Important, onload must come before src.
            image.onload = onload;
            image.onerror = function () {
                exceptions.create('Error loading image', deferred)('Error in image.load');
            };
            image.src = dataURI;


            return deferred.promise;


            ////////////////////////////////////////

            function onload() {

                var orientation,
                    aspect,
                    width,
                    height;

                EXIF.getData(this, function () {

                    // This might look strange but it has to do with the fact that iphones do strange things (iphone has orientation = 6 for potrait)
                    orientation = EXIF.getTag(this, "Orientation");
                    if (typeof orientation !== 'undefined' && orientation == 6) {
                        width = this.height;
                        height = this.width;
                    } else {
                        width = this.width;
                        height = this.height;
                    }


                    aspect = width / height;

                    deferred.resolve({
                        image: image,
                        aspect: aspect,
                        orientation: orientation,
                        width: width,
                        height: height
                    });

                });



            }





        }



        /**
         * @ngdoc method
         * @name render 
         * @methodOf  camera.service:image
         * @param {object} stage Kinetic.js stage object where the image layer will be created
         * @param {object} layers Contains layers that have kinetic.js objects on them. A new "image" layer will be added to this "layers" object
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object, a new "image" object will be added to this "objects" object, which is a kinetic image with some extra properties added to take into account strange things iphone does with portrait images
         * @param {object} image JSON object containing keys image, aspect, orientation, width, height, where image is a javascript image object. This is what is returned from the "image.load" method
         * 
         * @description Renders a loaded image onto a kinetic layer and onto a given kinetic stage
         */
        function render(stage, layers, objects, image) {

            layers.image = new Kinetic.Layer();
            stage.add(layers.image);

            var layer = layers.image,
                aspectStage = stage.getWidth() / stage.getHeight(),
                w,
                h,
                xpos,
                ypos,
                img;

            if (image.aspect / aspectStage < 1) {
                w = image.aspect / aspectStage * stage.getWidth();
                h = w / image.aspect;
            } else {
                w = stage.getWidth();
                h = w / image.aspect;

            }

            xpos = (stage.getWidth() - w) / 2;
            ypos = (stage.getHeight() - h) / 2;


            if (image.orientation != 6) {
                // normal image
                img = new Kinetic.Image({
                    x: (stage.getWidth() - w) / 2,
                    y: (stage.getHeight() - h) / 2,
                    image: image.image,
                    width: w,
                    height: h,
                    name: 'image',
                });
            } else {
                img = new Kinetic.Image({
                    // iphone portrait image. n.b we'll need to not only rotate the image but shift it so that we have the correctly positioned rotation axis
                    x: stage.getWidth() / 2,
                    y: stage.getHeight() / 2,
                    image: image.image,
                    width: h,
                    height: w,
                    name: 'image',
                    offset: {
                        x: h / 2,
                        y: w / 2
                    }
                });

                img.rotate(90);

            }

            // We add some extra properties to the kinetic image object due to the fact that we might have one of these strange iphone portrait photos.  e.g. kinetic width will actually be the photos real height and the position of the image will be its original position before we rotated it.  We need the position as it is seen on screen for when we start to do cropping.
            img.xpos = (stage.getWidth() - w) / 2;
            img.ypos = (stage.getHeight() - h) / 2;
            img.width = w;
            img.height = h;
            img.aspect = image.aspect;




            layer.add(img);

            layer.draw();

            objects.image = img;

            return




        }


        /**
         * @ngdoc method
         * @name save 
         * @methodOf  camera.service:image
         * @param {object} stage Kinetic.js stage object where the layers live
         * @param {object} layers Contains layers that have kinetic.js objects on them.
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object
         * @returns {promise} Resolves to an object with keys image (a dataURI), saved (a backup object containing crop information and drawings to be used if we make additional changes and want to revert back to this version) -  if the image was successfully loaded, otherwise the promise is rejected.
         * 
         * @description Saves the image and anything that has been drawn on top of it as a dataURI. Creates a backup of the current state of the image so that we can revert back if desired
         * 
         */
        function save(stage, layers, objects) {

            var deferred = $q.defer(),
                image = objects.image;

            // The reason we don't just take a JSON copy of the image layer is that Im not sure whether the extra properties we previously attached to the kinetic image (because of iphone orientaiton issues) wil survive
            var saved = {
                crops: {
                    pos: image.position(),
                    size: image.size(),
                    crop: image.crop(),
                    offset: image.offset()
                }

            };
            

            if (layers.drawing) {
                saved.drawing = {};
                saved.drawing = layers.drawing.toJSON();

            }

            stage.toImage({
                mimeType: "image/jpeg",
                quality: 0.9,
                x: image.xpos,
                y: image.ypos,
                width: image.width,
                height: image.height,
                callback: function (savedImage) {

                    deferred.resolve({
                        image: savedImage.src,
                        saved: saved
                    })

                }
            });

            return deferred.promise

        }



        /**
         * @ngdoc method
         * @name discardChanges 
         * @methodOf  camera.service:image
         * @param {object} stage Kinetic.js stage object where the layers live
         * @param {object} layers Contains layers that have kinetic.js objects on them.
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object
         * @param {object} saved object containing information about drawings and crops made before the image was last saved. These stage will be reverted back to this state
         * 
         * @description Discards any changes that have been made since the image was last saved
         * 
         */
        function discardChanges(stage, layers, objects, saved) {

            var image = objects.image,
                layerDraw,
                layerImage;
            
            /* layers.image.destroy();
            
            layerImage= Kinetic.Node.create(saved.crops);
            stage.add(layerImage);
            layers.image = layerImage;*/

            image.position(saved.crops.pos);
            image.size(saved.crops.size);
            image.crop(saved.crops.crop);
            image.offset(saved.crops.offset);

            layers.image.draw();

            if (layers.drawing) {


                layers.drawing.destroy();

                if (saved.drawing) {

                    layerDraw = Kinetic.Node.create(saved.drawing);

                    objects.lines = [];
                    angular.forEach(layerDraw.children, function (line, key) {

                        objects.lines.push(line);

                    });


                    layers.drawing = layerDraw;

                    stage.add(layerDraw);

                    layerDraw.draw();
                }

            }

            return

        }









    }









})();