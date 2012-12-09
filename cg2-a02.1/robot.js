/*
  *
 * Module main: CG2 Aufgabe 2 Teil 2, Winter 2012/2013
 * (C)opyright Hartmut Schirmacher, hschirmacher.beuth-hochschule.de 
 *
 */


/* 
 *  RequireJS alias/path configuration (http://requirejs.org/)
 */

requirejs.config({
    paths: {
    
        // jquery library
        "jquery": [
            // try content delivery network location first
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            //If the load via CDN fails, load locally
            '../lib/jquery-1.7.2.min'],
            
        // gl-matrix library
        "gl-matrix": "../lib/gl-matrix-1.3.7"

    }
});


/*
 * The function defined below is the "main" module,
 * it will be called once all prerequisites listed in the
 * define() statement are loaded.
 *
 */

/* requireJS module definition */
define(["jquery", "gl-matrix", "util", "webgl-debug", 
        "program", "shaders", "animation", "html_controller", "scene_node", 
        "models/triangle", "models/cube", "models/band"], 
       (function($, glmatrix, util, WebGLDebugUtils, 
                    Program, shaders, Animation, HtmlController, SceneNode,
                    Triangle, Cube, Band ) {

    "use strict";
    
    /*
     *  This function asks the HTML Canvas element to create
     *  a context object for WebGL rendering.
     *
     *  It also creates awrapper around it for debugging 
     *  purposes, using webgl-debug.js
     *
     */
    
    var makeWebGLContext = function(canvas_name) {
    
        // get the canvas element to be used for drawing
        var canvas=$("#"+canvas_name).get(0);
        if(!canvas) { 
            throw "HTML element with id '"+canvas_name + "' not found"; 
            return null;
        };

        // get WebGL rendering context for canvas element
        var options = {alpha: true, depth: true, antialias:true};
        var gl = canvas.getContext("webgl", options) || 
                 canvas.getContext("experimental-webgl", options);
        if(!gl) {
            throw "could not create WebGL rendering context";
        };
        
        // create a debugging wrapper of the context object
        var throwOnGLError = function(err, funcName, args) {
            throw WebGLDebugUtils.glEnumToString(err) + " was caused by call to: " + funcName;
        };
        var gl=WebGLDebugUtils.makeDebugContext(gl, throwOnGLError);
        
        return gl;
    };
    
    /*
     * main program, to be called once the document has loaded 
     * and the DOM has been constructed
     * 
     */

    $(document).ready( (function() {
    
        // catch errors for debugging purposes 
        try {

            console.log("document ready - starting!");
            
            // create WebGL context object for the named canvas object
            var gl = makeWebGLContext("drawing_area");
                                        
            // a simple scene is an object with a few objects and a draw() method
            var MyRobotScene = function(gl, transformation) {

                // store the WebGL rendering context 
                this.gl = gl;  
                
                // create WebGL program using constant red color
                var prog_red = new Program(gl, shaders.vs_NoColor(), 
                                            shaders.fs_ConstantColor([0.7,0.3,0.2,1]) );
                var prog_blue = new Program(gl, shaders.vs_NoColor(), 
                                            shaders.fs_ConstantColor([0.0,0.0,0.5,1]) );											
                var prog_black = new Program(gl, shaders.vs_NoColor(), 
                                             shaders.fs_ConstantColor([0.0,0.0,0.0,1]) );
											 
                // create WebGL program using per-vertex-color
                var prog_vertexColor = new Program(gl, shaders.vs_PerVertexColor(), 
                                                    shaders.fs_PerVertexColor() );
                                                    
                // please register all programs in this list
                this.programs = [prog_red, prog_blue, prog_black, prog_vertexColor];
                                                    
                // create some objects to be drawn
                var cube   = new Cube(gl);
                var band   = new Band(gl, { radius: 0.5, height: 1.0, segments: 50 } );
				var bandWireframe   = new Band(gl, { radius: 0.5, height: 1.0, segments: 50, asWireframe: true } );
                var triangle = new Triangle(gl);
                
                // dimensions
                var torsoSize 			= [0.6, 0.3, 1.2];
				var trackSize 			= [0.3, 0.2, 1.5];
				var lowerJointSize 		= [0.3, 0.2, 0.3];
				var middleJointSize		= [0.3, 0.25, 0.25];
				var upperJointSize 		= [0.2, 0.2, 0.2];
				var clawJointSize 		= [0.15, 0.15, 0.15];
				var upperArmBackSize   	= [0.1, 0.5, 0.1];
				var upperArmFrontSize	= [0.07, 0.5, 0.07];
				var lowerArmSize 		= [0.15,0.15,0.15];
				var middleArmBackSize 	= [0.15, 0.5, 0.15];
				var middleArmFrontSize 	= [0.1, 0.5, 0.1];
				var clawBackSize 		= [0.1, 0.15, 0.05];
                
				//skeletons
				var upperClawFront = new SceneNode("upperClawFront");
				mat4.translate(upperClawFront.transformation, [0,0.09,0.06]);
				mat4.rotate(upperClawFront.transformation, 0.7*(Math.PI/2), [1,0,0]);
				
				var lowerClawFront = new SceneNode("lowerClawFront");
				mat4.translate(lowerClawFront.transformation, [0,0.09,-0.06]);
				mat4.rotate(lowerClawFront.transformation, -0.7*(Math.PI/2), [1,0,0]);
				
				var lowerClawBack = new SceneNode("lowerClawBack", [lowerClawFront]);
				mat4.translate(lowerClawBack.transformation, [0,0.15,0]);
				
				var upperClawBack = new SceneNode("upperClawBack", [upperClawFront]);
				mat4.translate(upperClawBack.transformation, [0,0.15,0]);
								
				var lowerClawJoint = new SceneNode("lowerClawJoint", [lowerClawBack]);
				mat4.translate(lowerClawJoint.transformation, [0,0.3,0]);
				mat4.rotate(lowerClawJoint.transformation, 0.75*(Math.PI/2), [1,0,0]);
				
				var upperClawJoint = new SceneNode("upperClawJoint", [upperClawBack]);
				mat4.translate(upperClawJoint.transformation, [0,0.3,0]);
				
				var upperArmFront = new SceneNode("upperArmFront", [lowerClawJoint, upperClawJoint]);
				mat4.translate(upperArmFront.transformation, [0,0.25,0]);
				
				var upperArmBack = new SceneNode("upperArmBack", [upperArmFront]);
				mat4.translate(upperArmBack.transformation, [0,0.3,0]);
				
				var upperJoint = new SceneNode("upperJoint", [upperArmBack]);
				mat4.translate(upperJoint.transformation, [0,0.3,0]);
				mat4.rotate(upperJoint.transformation, 0.7*(Math.PI/2), [1,0,0]);
				
				var middleArmFront = new SceneNode("middleArmFront", [upperJoint]);
				mat4.translate(middleArmFront.transformation, [0,0.3,0]);
								
				var middleArmBack = new SceneNode("middleArmBack", [middleArmFront]);
				mat4.translate(middleArmBack.transformation, [0,0.3,0]);
				
				var middleJoint = new SceneNode("middleJoint", [middleArmBack]);
				mat4.translate(middleJoint.transformation, [0,0.15,0]);
				mat4.rotate(middleJoint.transformation, 0.5*(Math.PI/2), [1,0,0]);
				
				var lowerArm = new SceneNode("lowerArm", [middleJoint]);
				mat4.translate(lowerArm.transformation, [0,0.15,0]);

				var lowerJoint = new SceneNode("lowerJoint", [lowerArm]);
				mat4.translate(lowerJoint.transformation, [0,0.2,0]);
				
				var leftTrack = new SceneNode("leftTrack");
				mat4.translate(leftTrack.transformation, [0.45,-0.1,0]);
								
				var rightTrack = new SceneNode("rightTrack");
				mat4.translate(rightTrack.transformation, [-0.45,-0.1,0]);
				
				var torso = new SceneNode("torso", [leftTrack, rightTrack, lowerJoint]);
                
                // skins
                var torsoSkin = new SceneNode("torso skin", [cube], prog_vertexColor);
                mat4.scale(torsoSkin.transformation, torsoSize );
                mat4.rotate(torsoSkin.transformation, Math.PI/2, [1,0,0] );
				
				var trackSkin = new SceneNode("track skin", [band], prog_red);
				mat4.scale(trackSkin.transformation, trackSize);
				mat4.rotate(trackSkin.transformation, Math.PI/2, [1,0,0]);
				mat4.rotate(trackSkin.transformation, Math.PI/2, [0,0,1]);
				
				var trackWireframeSkin = new SceneNode("track skin", [bandWireframe], prog_black);
				mat4.scale(trackWireframeSkin.transformation, trackSize);
				mat4.rotate(trackWireframeSkin.transformation, Math.PI/2, [1,0,0]);
				mat4.rotate(trackWireframeSkin.transformation, Math.PI/2, [0,0,1]);
		
				var lowerJointSkin = new SceneNode("lowerJoint skin", [band], prog_red);
				mat4.scale(lowerJointSkin.transformation, lowerJointSize);
				
				var middleJointSkin = new SceneNode("middleJoint skin", [band], prog_red);
				mat4.scale(middleJointSkin.transformation, middleJointSize);
				mat4.rotate(middleJointSkin.transformation, Math.PI/2, [0,0,1]);
				
				var upperJointSkin = new SceneNode("middleJoint skin", [band], prog_red);
				mat4.scale(upperJointSkin.transformation, upperJointSize);
				mat4.rotate(upperJointSkin.transformation, Math.PI/2, [0,0,1]);

				var clawJointSkin = new SceneNode("clawJoint skin", [band], prog_red);
				mat4.scale(clawJointSkin.transformation, clawJointSize);
				mat4.rotate(clawJointSkin.transformation, Math.PI/2, [0,0,1]);				
				
				var upperArmBackSkin = new SceneNode("upperArmBack skin", [cube], prog_blue);
				mat4.scale(upperArmBackSkin.transformation, upperArmBackSize);
				
				var upperArmFrontSkin = new SceneNode("upperArmFront skin", [cube], prog_blue);
				mat4.scale(upperArmFrontSkin.transformation, upperArmFrontSize);
				
				var lowerArmSkin = new SceneNode("lowerArm skin", [cube], prog_blue);
				mat4.scale(lowerArmSkin.transformation, lowerArmSize);
				
				var middleArmBackSkin = new SceneNode("middleArmBack skin", [cube], prog_blue);
				mat4.scale(middleArmBackSkin.transformation, middleArmBackSize);
				
				var middleArmFrontSkin = new SceneNode("middleArmFront skin", [cube], prog_blue);
				mat4.scale(middleArmFrontSkin.transformation, middleArmFrontSize);
				
				var clawSkin = new SceneNode("claw skin", [cube], prog_blue);
				mat4.scale(clawSkin.transformation, clawBackSize);
								
                // connect skeleton + skin
                torso.addObjects([torsoSkin]);
				
				leftTrack.addObjects([trackSkin, trackWireframeSkin]);
				rightTrack.addObjects([trackSkin, trackWireframeSkin]);
				
				lowerJoint.addObjects([lowerJointSkin]);
				lowerArm.addObjects([lowerArmSkin]);
				
				middleJoint.addObjects([middleJointSkin]);
				middleArmBack.addObjects([middleArmBackSkin]);
				middleArmFront.addObjects([middleArmFrontSkin]);
				
				upperJoint.addObjects([upperJointSkin]);
				upperArmBack.addObjects([upperArmBackSkin]);
				upperArmFront.addObjects([upperArmFrontSkin]);
				
				lowerClawJoint.addObjects([clawJointSkin]);
				upperClawJoint.addObjects([clawJointSkin]);
				
				lowerClawBack.addObjects([clawSkin]);
				lowerClawFront.addObjects([clawSkin]);
				
				upperClawBack.addObjects([clawSkin]);
				upperClawFront.addObjects([clawSkin]);
				
                // an entire robot
                var robot1  = new SceneNode("robot1", [torso]);
                mat4.translate(robot1.transformation, [0,-0.5,0]);

                // the world - this node is needed in the draw() method below!
                this.world  = new SceneNode("world", [robot1], prog_red); 
				mat4.translate(this.world.transformation, [0,0,-1]);
	                
                // for the UI - this will be accessed directly by HtmlController
                this.drawOptions = {"Perspective": true};


                /*
                 *
                 * Method to rotate within a specified joint - called from HtmlController
                 *
                 */
                this.rotateJoint = function(joint, angle) {
                
                    window.console.log("rotating " + joint + " by " + angle + " degrees." );
                    
                    // degrees to radians
                    angle = angle*Math.PI/180;
                    
                    // manipulate the right matrix, depending on the name of the joint
                    switch(joint) {
                        case "worldY": 
                            mat4.rotate(this.world.transformation, angle, [0,1,0]);
                            break;
                        case "worldX": 
                            mat4.rotate(this.world.transformation, angle, [1,0,0]);
                            break;
						case "grip":
							mat4.rotate(lowerClawJoint.transformation, angle, [-1,0,0]);
							mat4.rotate(upperClawJoint.transformation, angle, [1,0,0]);
							break;
						case "clawMove":
							mat4.rotate(lowerClawJoint.transformation, angle, [1,0,0]);
							mat4.rotate(upperClawJoint.transformation, angle, [1,0,0]);
							break;						
						case "middleArmMove":
							mat4.rotate(middleJoint.transformation, angle, [1,0,0]);
							break;
						case "lowerArmMove":
							mat4.rotate(lowerJoint.transformation, angle, [0,1,0]);
							break;							
						case "upperArmMove":
							mat4.rotate(upperJoint.transformation, angle, [1,0,0]);						
							break;							
						case "middleArmStretch":
							mat4.translate(middleArmFront.transformation, [0,angle/2,0]);
							break;
						case "upperArmStretch":
							mat4.translate(upperArmFront.transformation, [0,angle/2,0]);
							break;							
                        default:
                            window.console.log("joint " + joint + " not implemented:");
                            break;
                    };
                    this.draw();
                }; // rotateJoint()
                
            }; // MyRobotScene constructor
            
            // the scene's draw method draws whatever the scene wants to draw
            MyRobotScene.prototype.draw = function() {
            
                // get aspect ratio of canvas
                var c = $("#drawing_area").get(0);
                var aspectRatio = c.width / c.height;
                
                // set camera's projection matrix in all programs
                var projection = this.drawOptions["Perspective"] ?
                                    mat4.perspective(45, aspectRatio, 0.01, 100) : 
                                    mat4.ortho(-aspectRatio, aspectRatio, -1,1, 0.01, 100);
                
                for(var i=0; i<this.programs.length; i++) {
                    var p = this.programs[i];
                    p.use();
                    p.setUniform("projectionMatrix", "mat4", projection);
                };
                                    
                // initial camera / initial model-view matrix
                var modelView = mat4.lookAt([0,0.5,3], [0,0,0], [0,1,0]);
                
                // shortcut
                var gl = this.gl;
                
                // clear color and depth buffers
                gl.clearColor(0.7, 0.7, 0.7, 1.0); 
                gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 
                
                // enable depth testing, keep fragments with smaller depth values
                gl.enable(gl.DEPTH_TEST); 
                gl.depthFunc(gl.LESS);  
                
                // start drawing at the world's root node
                this.world.draw(gl,this.prog_vertexColor, modelView);

            }; // MyRobotScene draw()
            
            // create scene and start drawing
            var scene = new MyRobotScene(gl);
            scene.draw();
            
            // create an animation: rotate some joints
            var animation = new Animation( (function(t,deltaT) {
            
                this.customSpeed = this.customSpeed || 1;
                
                // speed  times deltaT
                var speed = deltaT/1000*this.customSpeed;
                
                // rotate around Y with relative speed 3
                scene.rotateJoint("worldY", 3*speed);
				
				var x = (t/1000)%2;
				var y = (t/1000)%6;
				
				
				var moveDirection = 1;
				if (x < 1) {
					moveDirection = -1;
				}
				var rotateDirection = 1;
				if (y < 3) {
					rotateDirection = -1;
				}
				
				scene.rotateJoint("grip", 2*moveDirection);
				scene.rotateJoint("upperArmStretch", moveDirection*speed);
				scene.rotateJoint("middleArmStretch", moveDirection*speed);
				scene.rotateJoint("lowerArmMove", -5*speed);
				scene.rotateJoint("middleArmMove", moveDirection*speed);
				scene.rotateJoint("upperArmMove", moveDirection*0.5*speed);
				scene.rotateJoint("clawMove", rotateDirection*2*speed);
				
            
                // redraw
                scene.draw();
                
            }));
			
            
            // create HTML controller that handles all the interaction of
            // HTML elements with the scene and the animation
            var controller = new HtmlController(scene,animation); 
        
        // end of try block
        } catch(err) {
            if($("#error")) {
                $('#error').text(err.message || err);
                $('#error').css('display', 'block');
            };
            window.console.log("exception: " + (err.message || err));;
            throw err;
        };
        
        
    })); // $(document).ready()
    
    
})); // define module
        

