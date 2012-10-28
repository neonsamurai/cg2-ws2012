/*
 * JavaScript / Canvas teaching framwork
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de
 *
 * Module: html_controller
 *
 * Defines callback functions for communicating with various
 * HTML elements on the page, e.g. buttons and parameter fields.
 *
 */

/* requireJS module definition */
define(
    ["jquery", "straight_line", "circle", "param_curve", "bezier_curve"], 
    (function($, StraightLine, Circle, ParametricCurve, BezierCurve) 
        {"use strict";

        /*
         * define callback functions to react to changes in the HTML page
         * and provide them with a closure defining context and scene
         */
        var HtmlController = function(context, scene, sceneController) {

                // generate random X coordinate within the canvas
                var randomX = function() {
                        return Math.floor(Math.random() * (context.canvas.width - 10)) + 5;
                };

                // generate random Y coordinate within the canvas
                var randomY = function() {
                        return Math.floor(Math.random() * (context.canvas.height - 10)) + 5;
                };

                // generate random color in hex notation
                var randomColor = function() {

                        // convert a byte (0...255) to a 2-digit hex string
                        var toHex2 = function(byte) {
                                var s = byte.toString(16);
                                // convert to hex string
                                if (s.length == 1)
                                        s = "0" + s;
                                // pad with leading 0
                                return s;
                        };

                        var r = Math.floor(Math.random() * 25.9) * 10;
                        var g = Math.floor(Math.random() * 25.9) * 10;
                        var b = Math.floor(Math.random() * 25.9) * 10;

                        // convert to hex notation
                        return "#" + toHex2(r) + toHex2(g) + toHex2(b);
                };

                /*
                 * event handler for "new line button".
                 */
                $("#btnNewLine").click((function() {

                        // create the actual line and add it to the scene
                        var style = {
                                width : Math.floor(Math.random() * 3) + 1,
                                color : randomColor()
                        };

                        var line = new StraightLine([randomX(), randomY()], [randomX(), randomY()], style);
                        scene.addObjects([line]);

                        // deselect all objects, then select the newly created object
                        sceneController.deselect();
                        sceneController.select(line);
                        // this will also redraw

                }));

                $("#btnNewCircle").click((function() {
                        var style = {
                                width : Math.floor(Math.random() * 3) + 1,
                                color : randomColor()
                        };

                        var circle = new Circle([randomX(), randomY()], randomX() / 4 + 15, style)
                        scene.addObjects([circle]);

                        sceneController.deselect();
                        sceneController.select(circle);
                }));
                $("#btnNewCurve").click((function() {
                        var style = {
                                width : Math.floor(Math.random() * 3) + 1,
                                color : randomColor()
                        };
                        
                		try {
                        	var t = 1;                			
                			var errorString = "The given x(t) is not a correct function.";
                			parseInt(eval($("#xt").val()));
                			errorString = "The given y(t) is not a correct function.";
                			parseInt(eval($("#yt").val()));                			
                		} catch(err) {
                    		alert(errorString);
                			return;
                		}
                		
						var curve =	 new ParametricCurve(
                        parseInt($("#tmin").val()), parseInt($("#tmax").val()), 
                        $("#xt").val(), $("#yt").val(), parseInt($("#segments").val()));
                        
	                    scene.addObjects([curve]);

    	                sceneController.deselect();
        	            sceneController.select(curve);

	
                }));
                var updateFunctionsInput = function() {
                        var obj = sceneController.getSelectedObject();
                        if (obj.xt) {
                            $("#xt").val(obj.xt);
                            $("#yt").val(obj.yt);
                        }
                }
                $("#btnNewBezierCurve").click((function(){
                        var style = {
                            width : Math.floor(Math.random() * 3) + 1,
                            color: randomColor()
                        };
                        var bezCurve = new BezierCurve(
                            [randomX(), randomY()], [randomX(), randomY()], [randomX(), randomY()], [randomX(), randomY()], 
                            parseInt($("#segments").val()));

                        scene.addObjects([bezCurve]);

                        sceneController.deselect();
                        sceneController.select(bezCurve);
                }));
                $("#xt").change((function(){
                        var obj = sceneController.getSelectedObject();
                        obj.xt = $("#xt").val();
                        scene.draw(context);
                }));
                $("#yt").change((function(){
                        var obj = sceneController.getSelectedObject();
                        obj.yt = $("#yt").val();
                        scene.draw(context);
                }));
                $("#tmin").change((function(){
                        var obj = sceneController.getSelectedObject();
                        obj.tmin = parseInt($("#tmin").val());
                        scene.draw(context);
                }));
                $("#tmax").change((function(){
                        var obj = sceneController.getSelectedObject();
                        obj.tmax = parseInt($("#tmax").val());
                        scene.draw(context);
                }));
                var updateTMinMaxInput = function() {
                    var obj = sceneController.getSelectedObject(); 
                    if (obj.tmin) {
                    	$("#tmin").val(obj.tmin);
                    	$("#tmax").val(obj.tmax);
                    }
                }
                $("#segments").change((function(){
                        var obj = sceneController.getSelectedObject();
                        obj.segments = parseInt($("#segments").val());
                        scene.draw(context);
                }));
                var updateSegmentsInput = function() {
                    var obj = sceneController.getSelectedObject();
                    $("#segments").val(obj.segments);
                }
                $("#colorPicker").change((function() {
                        console.log($("#colorPicker").val());

                        var obj = sceneController.getSelectedObject();
                        obj.lineStyle.color = $("#colorPicker").val();
                        //obj.draggers.draggerStyle.color = $("#colorPicker").val();
                        console.log(this);
                        //this.lineStyle.color = obj.lineStyle.color;
                        scene.draw(context);
                }));
                var updateColorpicker = function() {
                        var obj = sceneController.getSelectedObject();
                        $('#colorPicker').val(obj.lineStyle.color);
                };
                $("#lineWidth").change((function() {
                        var obj = sceneController.getSelectedObject();
                        obj.lineStyle.width = $("#lineWidth").val();
                        scene.draw(context);
                }));
                var updateLineWidthInput = function() {
                        var obj = sceneController.getSelectedObject();
                        $("#lineWidth").val(obj.lineStyle.width);
                };
                $("#radius").change((function() {
                        var obj = sceneController.getSelectedObject();
                        obj.r = parseInt($("#radius").val());
                        scene.draw(context);
                }));
                $("#tickmarks").change((function() {
                        var obj = sceneController.getSelectedObject();
                        obj.tickmarks = !obj.tickmarks;
						scene.draw(context);
                }));
                var updateTickMarksInput = function () {
                	var obj = sceneController.getSelectedObject();
                	$("#tickmarks").attr('checked',obj.tickmarks);        	
                }
                var updateRadiusInput = function() {
                        var obj = sceneController.getSelectedObject();

                        if (obj.r) {
                                $("#radiusDiv").show();

                                $("#radius").val(obj.r);
                        } else {
                                $("#radiusDiv").hide();
                        }
                        scene.draw(context);
                }
                
                var updateInputFields = function() {
                        updateColorpicker();
                        updateLineWidthInput();
                        updateRadiusInput();
                        updateSegmentsInput();
                        updateTickMarksInput();
                        updateFunctionsInput();
                        updateTMinMaxInput();
                }

                sceneController.onSelection(updateInputFields);
                sceneController.onObjChange(updateInputFields);
        };

        // return the constructor function
        return HtmlController;

}));
// require

