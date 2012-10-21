/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger"], (function(Util, vec2, Scene, PointDragger) {"use strict";

        var BezierCurve = function(p0, p1 ,p2 ,p3 ,tmin,tmax, segments, lineStyle) {
                this.lineStyle = lineStyle || {
                        width : "2",
                        color : "#0000FF"
                };

                this.p0 = p0;
                this.p1 = p1;
                this.p2 = p2;
                this.p3 = p3;

                this.t = tmin;
                this.tmin = tmin;
                this.tmax = tmax;
                
                this.segments = segments;
                
                console.log("creating bezier curve with p0 = " + this.p0 + ", p1 = " + this.p1 + ", p2 = " + this.p2 + ", p3 = " + this.p3 + ", t/min = " + this.tmin + ", t/max = " + this.tmax + ", segments = " + this.segments); };

        BezierCurve.prototype.draw = function(context) {
                context.beginPath();

                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                // draw polygon first
                context.moveTo(this.p0[0],this.p0[1]);
                context.lineTo(this.p1[0],this.p1[1]);
                context.moveTo(this.p1[0],this.p1[1]);
                context.lineTo(this.p2[0],this.p2[1]);
                context.moveTo(this.p2[0],this.p2[1]);
                context.lineTo(this.p3[0],this.p3[1]);
                context.moveTo(this.p3[0],this.p3[1]);
                context.stroke();

                // draw curves then
                

        }

        BezierCurve.prototype.isHit = function(context, p) {
                pass;
        }

        BezierCurve.prototype.createDraggers = function() {
                var draggerStyle = { radius:4, color: this.lineStyle.color, width:0, fill:true }
                var draggers = [];

                // create closure and callbacks for dragger
                var _line = this;
                var getP0 = function() { return _line.p0; };
                var getP1 = function() { return _line.p1; };
                var getP2 = function() { return _line.p2; };
                var getP3 = function() { return _line.p3; };
                var setP0 = function(dragEvent) { _line.p0 = dragEvent.position; };
                var setP1 = function(dragEvent) { _line.p1 = dragEvent.position; };
                var setP2 = function(dragEvent) { _line.p2 = dragEvent.position; };
                var setP3 = function(dragEvent) { _line.p3 = dragEvent.position; };
                draggers.push( new PointDragger(getP0, setP0, draggerStyle) );
                draggers.push( new PointDragger(getP1, setP1, draggerStyle) );
                draggers.push( new PointDragger(getP2, setP2, draggerStyle) );
                draggers.push( new PointDragger(getP3, setP3, draggerStyle) );
        
        return draggers;

};
        return BezierCurve;
}));