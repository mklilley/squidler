(function () {
    'use strict';
    angular
        .module('camera')
        .factory('draw', draw);

    draw.$inject = ['$rootScope', 'Kinetic'];

    /**
     * @ngdoc service
     * @name camera.service:draw
     * @param {object} $rootScope, Angular rootScope service
     * @param {object} Kinetic Kinetic.js wrapped in angular service
     * @returns {object} Service object exposing methods - start, stop, undo
     *
     * @description
     * This is a service used to draw on an kineticjs image
     */


    function draw($rootScope,Kinetic) {


        var service = {

            start: start,
            stop: stop,
            undo: undo

        };
        
        var backup;

        return service;



        ////////////////////////////////////////

        /**
         * @ngdoc method
         * @name start 
         * @methodOf  camera.service:draw
         * @param {object} stage Kinetic.js staage object where the image layer is
         * @param {object} layers Contains layers that have kinetic.js objects on them, a key named "drawing" must be present whose value must be a kinetic.js layer
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object, a key named "lines" must be present whose value must be an array of kinetic.js lines
         * @param {object} colour The key of this object named "value" must be the colour of the line that is to be drawn 
         * 
         * @description Creates the events listeners that watch for user interaction with the image then draw those onto the image
         * 
         */

        function start(stage, layers, objects, colour) {

            var layer,
                lines,
                image;

            if (layers.drawing) {

                layer = layers.drawing;
                lines = objects.lines;

            } else {

                layer = new Kinetic.Layer();
                layers.drawing = layer;
                stage.add(layer);
                lines = [];
                objects.lines = lines;


            }
            
            backup = layers.drawing.toJSON();

            


            image = objects.image;

            // Makes sure that when you touch the image it creates a new line each time and doesnt join to old ones
            image.on("mousedown touchstart", startDrawing)

            // While your finger is down this makes sure all the points are connected together as one line
            image.on('mousemove touchmove', continueDrawing)

            // Makes sure that if you finish your drawing with your finger off the image that it finishes that particular line
            stage.getContent().addEventListener('mouseup', finishOffImage, false);
            stage.getContent().addEventListener('touchend', finishOffImage, false);



            return



            ////////////////////////////////////////

            function startDrawing() {

                var touchPos = stage.getPointerPosition();
                var x = touchPos.x;
                var y = touchPos.y;
                var temp = new Kinetic.Line({
                    points: [x, y],
                    stroke: colour.value,
                    strokeWidth: 4,
                    lineCap: 'round',
                    lineJoin: 'round'
                });
                image.drawOn = true;
                lines.push(temp);

                layer.add(lines[lines.length - 1]);


            }

            function continueDrawing() {
                if (image.drawOn) {
                    var touchPos = stage.getPointerPosition();
                    var x = touchPos.x;
                    var y = touchPos.y;

                    lines[lines.length - 1].points(lines[lines.length - 1].points().concat([x, y]));
                    //console.log(myLine[myLine.length - 1].points());


                    layer.draw();
                }
            }

            function finishOffImage(evt) {
                image.drawOn = false;
                $rootScope.$apply();
            }





        }








        /**
         * @ngdoc method
         * @name stop 
         * @methodOf  camera.service:draw
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object, a key named "image" must be present whose value must be a kinetic.js image
         * 
         * @description Removes the event listeners from a kineticjs image so that the imge no longer responds to touch/click.  Essentially this turns drawing mode off
         * 
         */
        function stop(objects) {

            objects.image.off("mousedown touchstart mousemove touchmove");

            return

        }




        /**
         * @ngdoc method
         * @name undo 
         * @methodOf camera.service:draw
         *@param {object} stage Kinetic.js stage object where the drawing layer is
         * @param {object} layers Contains layers that have kinetic.js objects on them, a key named "drawing" must be present whose value must be a kinetic.js layer
         * @param {object} objects Contains objects that have been drawn onto the various layers defined in the layers object, a key named "lines" must be present whose value must be an array of kinetic.js lines
         * @param {bool} all Boolean to determine whether to undo all the line or just the previous one 
         * 
         * @description Undoes lines that have been drawn.
         * 
         */
        function undo(stage, layers, objects, all) {
            
            all = all ? all : false;

            var layer = layers.drawing,
                lines = objects.lines;



            if (lines.length) {
                if(all){
                    layer.destroy();
                    delete layers.drawing;
                    delete objects.lines;
                    
                    var layerDraw = Kinetic.Node.create(backup);

                    objects.lines = [];
                    angular.forEach(layerDraw.children, function (line, key) {

                        objects.lines.push(line);

                    });


                    layers.drawing = layerDraw;

                    stage.add(layerDraw);

                    layerDraw.draw();
                }
                else{
                lines.pop().destroy();
                    layer.draw();
                }
                


            }



        }





    }









})();