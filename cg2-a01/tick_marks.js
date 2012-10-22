define(["util", "vec2", "scene"], (function(Util, vec2, Scene) {"use strict";

        //TODO: hook up event listener for checkbox!
        var TickMarks = function(obj) {
                this.pointList = obj.pointList;
                this.obj = obj;
                
                console.log("creating tick marks for object " + obj); 
            };

        TickMarks.prototype.draw = function(context) {
                context.beginPath();

                context.lineWidth = 1;
                context.strokeStyle = this.obj.lineStyle.color;

                for (var i = 0; i < this.pointList.length -2; i++) {
                		var v1 = vec2.sub(this.pointList[i+1],this.pointList[i]);
                		var v2 = vec2.sub(this.pointList[i+2],this.pointList[i+1]);
                        var dv = vec2.mult(vec2.add(v1,v2),0.5);
                        var x = dv[0];
                        var y = dv[1];
                        var nv = [-y,x];
                        nv = vec2.mult(nv, (1 / vec2.length(nv)));

                        var u = vec2.add(this.pointList[i+1], vec2.mult(nv,-5));
                        var v = vec2.add(this.pointList[i+1], vec2.mult(nv,5));

                        console.log("drawing from "+ u + " to " + v);

                        context.moveTo(u[0],u[1]);
                        context.lineTo(v[0],v[1]);

                };
                context.stroke();
        }

        return TickMarks;
}));