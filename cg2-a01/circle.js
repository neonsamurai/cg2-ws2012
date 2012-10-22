
/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], (function(Util, vec2, Scene, PointDragger) {"use strict";

        var Circle = function(centerPoint, radius, lineStyle) {
                this.lineStyle = lineStyle || {
                        width : "2",
                        color : "#0000FF"
                };

                this.cp = centerPoint || [0, 0];
                this.r = radius || 10;

                console.log("creating circle at [" + this.cp[0] + ","+this.cp[1]+" with radius " + this.r)
        };

        Circle.prototype.draw = function(context) {
                context.beginPath();
                context.arc(this.cp[0], this.cp[1], this.r, 0, 2 * Math.PI);

                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                context.stroke();
        }

        Circle.prototype.isHit = function(context, p) {
                var t = vec2.projectPointOnCircle(p, this.cp, this.r);
                //console.log(this.lineStyle.width/2)
                return (t < 0.0 + this.lineStyle.width / 2 + 2 && t > 0.0 + -this.lineStyle.width / 2 - 2);
                //return true
        }

        Circle.prototype.createDraggers = function() {
                var draggerStyle = {
                        radius : 4,
                        color : this.lineStyle.color,
                        width : 0,
                        fill : true
                };
                var draggers = [];

                var _circle = this;
                var getCp = function() {
                        return _circle.cp;
                };
                var setCp = function(dragEvent) {
                        _circle.cp = dragEvent.position;
                };
                var getRp = function(){
                        return [_circle.cp[0],_circle.cp[1]+_circle.r];
                };
                var setRp = function(dragEvent){
                        var distanceVector = vec2.sub(dragEvent.position,_circle.cp);
                        _circle.r = vec2.length(distanceVector);
                }
                draggers.push (new PointDragger (getCp, setCp, draggerStyle));
                draggers.push (new PointDragger(getRp,setRp,draggerStyle));
                return draggers;

        };
        return Circle;
}));
