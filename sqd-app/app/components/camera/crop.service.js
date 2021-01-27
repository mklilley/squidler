(function () {
    'use strict';
    angular
        .module('camera')
        .factory('crop', crop);

    crop.$inject = ['$q', 'Kinetic', 'exceptions'];

    /**
     * @ngdoc service
     * @name camera.service:crop
     * @param {object} $q Angular promise service
     * @param {object} Kinetic Kinetic.js wrapped in angular service
     * @param {object} EXIF EXIF.js wrapped in angular service
     * @param {object} exceptions Service to catch a failed promise
     * @returns {object} Service object exposing methods - start, finish, cancel
     *
     * @description
     * This is a service used do crop an image through user interaction
     */


    function crop($q, Kinetic, exceptions) {


        var service = {

            start: start,
            finish: finish,
            cancel: cancel

        };

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name start
         * @methodOf  camera.service:crop
         * @param {object} stage Kinetic.js staage object where the image layer is
         * @param {object} layers Contains layers that have kinetic.js objects on them
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object
         *
         * @description Initialises the copping interface
         */

        function start(stage, layers, objects) {

            var layer,
                image,
                w,
                h,
                xpos,
                ypos,
                aspectImage;

            // Create the layer that will hold all of the cropping objects
            layer = new Kinetic.Layer(),
                stage.add(layer);
            layers.crop = layer;


            image = objects.image;

            // This is using the real width and height of the image as is seen on screen, which is not necessarily the same as the width and height that the image has.  This is because we might have needed to rotate the image if it is a portrait photo coming fom iphone.
            w = image.width;
            h = image.height;

            xpos = image.xpos;
            ypos = image.ypos;
            aspectImage = image.aspect;


            createCroppingObjects();

            createEventListeners();


            layer.draw();




            ////////////////////////////////////////


            function createCroppingObjects() {

                var squareGroup,
                    square,
                    xSquare,
                    ySquare,
                    wSquare,
                    hSquare,
                    xCentre,
                    yCentre,
                    fadeLeft,
                    fadeTop,
                    fadeRight,
                    fadeBottom;

                //  These set up the correct dimensions to that when the cropping square is displayed it appears centred on the image at the largest possible size. While we dont need width and height because it is a square, we keep both in case we want to change this in the future
                wSquare = aspectImage > 1 ? h : w;
                hSquare = wSquare;
                xCentre = stage.getWidth() / 2;
                yCentre = stage.getHeight() / 2;
                xSquare = xCentre - wSquare / 2;
                ySquare = yCentre - hSquare / 2;

                 addFade(layer, {x: xpos, y: ypos}, {width: xSquare - xpos, height: h}, 'fadeLeft');
                addFade(layer, {x: xSquare, y: ypos}, {width: w - (xSquare - xpos), height: ySquare - ypos}, 'fadeTop');
                addFade(layer, {x: xSquare, y: ySquare + hSquare}, {width: w - (xSquare - xpos), height: h - hSquare - (ySquare - ypos)}, 'fadeBottom');
                addFade(layer, {x: xSquare + wSquare, y: ySquare}, {width: w - (xSquare - xpos) - wSquare, height: hSquare}, 'fadeRight');




                square = new Kinetic.Rect({
                    x: 0,
                    y: 0,
                    width: wSquare,
                    height: hSquare,
                    stroke: "white",
                    id: 'crop'
                });

                // The addition of a dragBoundFunc means that the cropping area will never leave the bounds of the image
                squareGroup = new Kinetic.Group({
                    x: xSquare,
                    y: ySquare,
                    draggable: true,
                    dragBoundFunc: function (pos) {
                        var newY = pos.y < ypos ? ypos : ((pos.y + square.getWidth()) > (ypos + h) ? ypos + h - square.getWidth() : pos.y);

                        var newX = pos.x < xpos ? xpos : ((pos.x + square.getWidth()) > (xpos + w) ? xpos + w - square.getWidth() : pos.x);


                        return {
                            x: newX,
                            y: newY
                        }
                    },
                    id: 'squareGroup'

                });

                squareGroup.add(square);

                addAnchor(squareGroup, 0, 0, 'topLeft');
                addAnchor(squareGroup, wSquare, 0, 'topRight');
                addAnchor(squareGroup, wSquare, wSquare, 'bottomRight');
                addAnchor(squareGroup, 0, wSquare, 'bottomLeft');

                layer.add(squareGroup);



                return


                ////////////////////////////////////////

                // This adds a semi transparrent black area on the iamge that helps to show which bit of the image will be lost after the crop
                function addFade(layer, pos, size, id) {

                    var fade = new Kinetic.Rect({
                        x: pos.x,
                        y: pos.y,
                        width: size.width,
                        height: size.height,
                        fill: "black",
                        opacity: 0.5,
                        id: id,
                        name:'fade',
                        draggable: false,
                        listening: false
                    });
                    layer.add(fade);

                    return
                }

                // This adds an anchor on a corner of the sqaure cropping area.  The user will be able to use these to resize the crop, once events are attached to them
                function addAnchor(group, x, y, id) {

                    var anchor = new Kinetic.Circle({
                        x: x,
                        y: y,
                        fill: '#ddd',
                        stroke:'#ddd',
                        strokeWidth:1,
                        radius: 15,
                        id: id,
                        name: 'anchor',
                        draggable: true,
                        dragBoundFunc: function (pos) {

  /*                          var squareWidth = square.getWidth();

                            var y = square.getAbsolutePosition().y;
                            var x  = square.getAbsolutePosition().x;


                        var newY = y < ypos ? ypos + gridPos.y*squareWidth : ((y + squareWidth) > (ypos + h) ? ypos + h - (squareWidth - gridPos.y)*squareWidth: pos.y);

                        var newX = x < xpos ? xpos + gridPos.x*squareWidth : ((x + squareWidth) > (xpos + w) ? xpos + w - (squareWidth - gridPos.x)*squareWidth: pos.x);*/



                        var newY = pos.y < ypos ? ypos : (pos.y > (ypos + h) ? ypos + h : pos.y);

                        var newX = pos.x < xpos ? xpos : (pos.x > (xpos + w) ? xpos + w : pos.x);


                        return {
                            x: newX,
                            y: newY
                        }
                    },
                        dragOnTop: false
                    });
                    group.add(anchor);

                    return
                }




            }



            function createEventListeners() {

                    var topLeft = stage.find('#topLeft')[0],
                        topRight = stage.find('#topRight')[0],
                        bottomRight = stage.find('#bottomRight')[0],
                        bottomLeft = stage.find('#bottomLeft')[0],
                        fadeLeft = stage.find('#fadeLeft')[0],
                        fadeTop = stage.find('#fadeTop')[0],
                        fadeBottom = stage.find('#fadeBottom')[0],
                        fadeRight = stage.find('#fadeRight')[0],
                        cropArea = stage.find('#crop')[0],
                        squareGroup = stage.find('#squareGroup')[0];


                createEventsForSquareGroup();

                createEventsForAnchors();

                 ///////////////////////////////////////////////////

                function createEventsForSquareGroup(){


                     // This makes sure that when we move the square around that the faded areas change shape and posititon to match
                    squareGroup.on('dragmove', updateFadedAreas);

                }

                function createEventsForAnchors() {

                    var anchors = stage.find('.anchor');


                    anchors.forEach(function (anchor) {

                        anchor.on('dragmove', function () {

                            //  When we move one of the anchors we want the other to move to keep it a square and to keep the square centred on where it started
                            updateAnchors(this);

                            // As we move the anchors the square needs to move and resize accordingly
                            updateCropArea();

                            // This makes sure that when we move the anchors the faded areas change shape and posititon to match
                            updateFadedAreas();


                        });
                        anchor.on('mousedown touchstart', function () {
                            // This is the stop the origin of the group accidently moving around when we adjust the anchors.  This is important when we come to readjust the origin of the cropping group upon ending the user interaction
                            squareGroup.setDraggable(false);
                        });
                        anchor.on('dragend', function () {

                            // When we have been moving the anchors the group origin has remained fixed and our coordinates have been relative to that.  When we stop the topLeft anchor is not going to be at the origin of the group (which is how we originally defined it), so we need to move the group origin and then adjust the coordiantes or all the anchors.
                            moveGroupOrigin();

                            // Once the origin has been re-adjusted we are free to drag the whole cropping area around
                            squareGroup.setDraggable(true);

                        });



                    });



                }






                // Formally this could be implemendted when we set up the objects in the beginning, but it feels a bit more transparent to have it explicitly in its own function.  I can't see that it will cause an obvious performance problem
                function updateFadedAreas() {

                    var width = topRight.x() - topLeft.x(),
                        height = bottomLeft.y() - topLeft.y();

                    // Remember when we need to refernce things relative to the top left corner of the image, so when we look at posititons we need to subtract the xpos or ypos to get what we want.  Also recall w is width of image and width is width of the cropping area, similarly for height
                    fadeLeft.setWidth(topLeft.getAbsolutePosition().x - xpos);

                    fadeTop.x(fadeLeft.x() + fadeLeft.getWidth());


                    fadeTop.setWidth(w - (topLeft.getAbsolutePosition().x - xpos));
                    fadeTop.setHeight(topLeft.getAbsolutePosition().y - ypos);

                    fadeBottom.x(topLeft.getAbsolutePosition().x);
                    fadeBottom.y(topLeft.getAbsolutePosition().y + height);
                    fadeBottom.setWidth(w - (topLeft.getAbsolutePosition().x - xpos));
                    fadeBottom.setHeight(h - (topLeft.getAbsolutePosition().y - ypos) - height);


                    fadeRight.x(topLeft.getAbsolutePosition().x + width);
                    fadeRight.y(topLeft.getAbsolutePosition().y);
                    fadeRight.setWidth(w - (topLeft.getAbsolutePosition().x + width - xpos));
                    fadeRight.setHeight(height);



                }








                function updateAnchors(activeAnchor) {

                    var group = activeAnchor.getParent();

                    var anchorX = activeAnchor.x();
                    var anchorY = activeAnchor.y();



                    switch (activeAnchor.id()) {

                        case 'topLeft':

                            var hor = topRight,
                                vert = bottomLeft,
                                opp = bottomRight,
                                sign = {
                                    x: 1.0,
                                    y: 1.0
                                };

                            break



                        case 'topRight':

                            var hor = topLeft,
                                vert = bottomRight,
                                opp = bottomLeft,
                                sign = {
                                    x: -1.0,
                                    y: 1.0
                                };


                            break;

                        case 'bottomRight':

                            var hor = bottomLeft,
                                vert = topRight,
                                opp = topLeft,
                                sign = {
                                    x: -1.0,
                                    y: -1.0
                                };


                            break;

                        case 'bottomLeft':

                            var hor = bottomRight,
                                vert = topLeft,
                                opp = topRight,
                                sign = {
                                    x: 1.0,
                                    y: -1.0
                                };





                            break;
                    }


                    //  When we move one of the anchors we want the other to move to keep it a square and to keep the square centred on where it started
                    moveOtherAnchors(hor, vert, opp, sign);



                    ///////////////////////////////////////////////////


                    function moveOtherAnchors(hor, vert, opp, sign) {

                        var distX = anchorX - vert.x();
                        var distY = anchorY - hor.y();
                        var oldX = vert.x();
                        var oldY = hor.y();
                        var side;
                        // Ensures that the anchors dont get so close they are on top of each other, i.e. sits minimum size of cropping region and stops the crop from inverting
                        if (sign.x * (hor.x() - anchorX) > 32 && sign.y * (vert.y() - anchorY) > 32) {

                            if (Math.abs(distX) >= Math.abs(distY)) {

                                hor.x(hor.x() - distX);
                                hor.y(anchorY);
                                side = sign.x * sign.y * (hor.x() - anchorX);
                                vert.x(anchorX);
                                vert.y(anchorY + side);


                            } else {
                                vert.x(anchorX);
                                vert.y(vert.y() - distY);
                                side = sign.x * sign.y * (vert.y() - anchorY);
                                hor.x(anchorX + side);
                                hor.y(anchorY);

                            }

                            opp.x(hor.x());
                            opp.y(vert.y());
                        } else {
                            activeAnchor.y(oldY);
                            activeAnchor.x(oldX);
                        }


                    }




                }

                // As we move the anchors the square needs to move and resize accordingly
                function updateCropArea() {

                    cropArea.setPosition(topLeft.getPosition());

                    var width = topRight.x() - topLeft.x();
                    var height = bottomLeft.y() - topLeft.y();

                    cropArea.setSize({
                        width: width,
                        height: height
                    });
                }


                // Puts the group origin back to be the same as he topLeft anchor.  In order not to have everything suddenly move around we need to adjust the anchor positions afterwards
                function moveGroupOrigin(){

                            var width = topRight.x() - topLeft.x(),
                                height = bottomLeft.y() - topLeft.y();

                        squareGroup.x(topLeft.getAbsolutePosition().x);
                        squareGroup.y(topLeft.getAbsolutePosition().y);

                            topRight.position({
                                x: width,
                                y: 0
                            });

                            bottomRight.position({
                                x: width,
                                y: height
                            });

                            bottomLeft.position({
                                x: 0,
                                y: height
                            });

                            topLeft.position({
                                x: 0,
                                y: 0
                            });

                            cropArea.position({
                                x: 0,
                                y: 0
                            });


                }









                }









            return









        }



        /**
         * @ngdoc method
         * @name finish
         * @methodOf  camera.service:crop
         * @param {object} stage Kinetic.js staage object where the image layer is
         * @param {object} layers Contains layers that have kinetic.js objects on them
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object
         * @param {object} imgOrig JSON object containing keys image, aspect, orientation, width, height, where image is a javascript image object. This is what is returned from the "image.load" method and stored as a backup
         *
         * @description Renders a loaded image onto a kinetic layer and onto a given kinetic stage
         *
         */
        function finish(stage, layers, objects, imgOrig) {

            // First get some information about the image, including whether or not the image has already been cropped by using the crop property
            var image = objects.image,
                xImage = image.x(),
                yImage = image.y(),
                wImage = image.getWidth(),
                hImage = image.getHeight(),
                xOffset = image.crop().x,
                yOffset = image.crop().y;

            // Now define "original" width and height, but by original we mean the image on screen before it is about to be cropped.  This is not the same as the image width and height unless this is the first crop.
            var wOrig = image.crop().width == 0 ? imgOrig.width : image.crop().width,
                hOrig = image.crop().height == 0 ? imgOrig.height : image.crop().height;

            // Next we get the information about the position and dimensions of the cropping area. note that althought the crop is a square we have kept some extra more general code in case we want to change our mind at some point in the future
            var cropArea = cropArea = stage.find('#crop')[0],
                topLeft = stage.find('#topLeft')[0],
                xCrop = topLeft.getAbsolutePosition().x,
                yCrop = topLeft.getAbsolutePosition().y,
                wCrop = cropArea.getWidth(),
                hCrop = cropArea.getHeight(),
                aspectCrop = wCrop / hCrop;


            // Now that we have extracted all the spatial information about the crop we dont need it anymore so we can destroy the layer
            layers.crop.destroy();


            var aspectStage = stage.getWidth() / stage.getHeight(),
                w,
                h;

            if (aspectCrop / aspectStage < 1) {
                w = aspectCrop / aspectStage * stage.getWidth();
                h = w / aspectCrop;
                if(layers.drawing){
                    // If we have lines on the drawing when we crop those lines are scaled up but in order to not see them outside of the boundary of the image we need to hide them by putting a black layer over the top
                    var hide1 = createDrawingMasks({x: 0, y: 0}, {width: (stage.getWidth() - w) / 2, height: stage.getHeight()}),
                        hide2 = createDrawingMasks({x: (stage.getWidth() - w) / 2 + w, y: 0}, {width: (stage.getWidth() - w) / 2, height: stage.getHeight() });
                }
            } else {
                w = stage.getWidth();
                h = w / aspectCrop;
                 if(layers.drawing){
                     var hide1 = createDrawingMasks({x: 0, y: 0}, {width: stage.getWidth(), height: (stage.getHeight() - h) / 2}),
                         hide2 = createDrawingMasks({x: 0, y: (stage.getHeight() - h) / 2 + h}, {width: stage.getWidth(), height: (stage.getHeight() - h) / 2 });
                }

            }

            // Now we know the new position and dimensions of our cropped image on the screen we need to update it
            image.xpos = (stage.getWidth() - w) / 2;
            image.ypos = (stage.getHeight() - h) / 2;
            image.width = w;
            image.height = h;



            // This is the bit that will actually do the cropping.  Orientation==6 is an iphone portrait photo which we has to be dealt with in a special way
            if (imgOrig.orientation != 6) {

                image.position({
                    x: (stage.getWidth() - w) / 2,
                    y: (stage.getHeight() - h) / 2
                });
                image.crop({
                    x: (xCrop - xImage) / wImage * wOrig + xOffset,
                    y: (yCrop - yImage) / hImage * hOrig + yOffset,
                    width: wCrop / wImage * wOrig,
                    height: hCrop / hImage * hOrig
                });
                image.size({
                    width: w,
                    height: h
                });

            }
            else {

                xImage = xImage - hImage / 2;
                yImage = yImage - wImage / 2;

                image.position({
                    x: stage.getWidth() / 2,
                    y: stage.getHeight() / 2
                });
                image.crop({
                    y: ((xImage + hImage) - (xCrop + wCrop)) / hImage * wOrig + yOffset,
                    x: (yCrop - yImage) / wImage * hOrig + xOffset,
                    height: wCrop / hImage * wOrig,
                    width: hCrop / wImage * hOrig
                });
                image.size({
                    width: h,
                    height: w
                });
                image.offset({
                    x: h / 2,
                    y: w / 2
                });

            }

             layers.image.draw();



            // Finally if we have any drawings on the image we have to scale the distances between the points on the lines so that the lines appear in the same place on the zoomed image
            if (layers.drawing) {
                var lines = objects.lines;

                for (var i = 0; i < lines.length; i++) {

                    var temp = lines[i].points();
                    for (var j = 0; j < temp.length - 1; j += 2) {
                        temp[j] = (temp[j] - xCrop) * w / wCrop + (stage.getWidth() - w) / 2;
                        temp[j + 1] = (temp[j + 1] - yCrop) * h / hCrop + (stage.getHeight() - h) / 2;

                    }
                    lines[i].points(temp);

                }

                layers.drawing.add(hide1);
                layers.drawing.add(hide2);
                layers.drawing.draw();


            }







            ///////////////////////////////////////////////////

        function createDrawingMasks(pos, size){

            var hide = new Kinetic.Rect({ // overlay
                    x: pos.x,
                    y: pos.y,
                    width: size.width,
                    height: size.height,
                    fill: "#212224",
                    opacity: 1,
                    /*dash: [10, 5],*/
                    draggable: false,
                    listening: false



            })
             return hide

         }




        }

                /**
         * @ngdoc method
         * @name cancel
         * @methodOf  camera.service:crop
         * @param {object} layers Contains layers that have kinetic.js objects on them
         *
         * @description Cancels the current crop
         *
         */
        function cancel(layers){

         layers.crop.destroy();

        }







    }

})();
