/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "tick_marks"], (function(Util, vec2, Scene, PointDragger, TickMarks) {"use strict";

        var BezierCurve = function(p0, p1 ,p2 ,p3, segments, lineStyle) {
                this.lineStyle = lineStyle || {
                        width : "2",
                        color : "#0000FF"
                };

                this.p0 = p0;
                this.p1 = p1;
                this.p2 = p2;
                this.p3 = p3;

                this.t = tmin;
                this.tmin = 0;
                this.tmax = 1;
                
                this.segments = segments;

                this.pointList = [];
                this.tickmarks = false;
                
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
                
                

                // draw curve then with Casteljau
                var increment = (this.tmax - this.tmin) / this.segments;
                var t = this.tmin;

                var a0, a1, a2, b0, b1, c = [0,0];

                context.moveTo(this.p0[0], this.p0[1]);
                this.pointList = [];
                
                this.pointList.push([this.p0[0],this.p0[1]]);
                this.pointList.push([this.p1[0],this.p1[1]]);
                this.pointList.push([this.p2[0],this.p2[1]]);
                this.pointList.push([this.p3[0],this.p3[1]]);
                this.pointList.push([this.p0[0],this.p0[1]]);

                // try adaptive subdivision using: http://www.antigrain.com/research/adaptive_bezier/index.html
                for (var i = 0; i < this.segments; i++) {
                        // step 1
                        a0 = vec2.add(vec2.mult(this.p0, 1-t),vec2.mult(this.p1, t));
                        a1 = vec2.add(vec2.mult(this.p1, 1-t),vec2.mult(this.p2, t));
                        a2 = vec2.add(vec2.mult(this.p2, 1-t),vec2.mult(this.p3, t));

                        // step 2
                        b0 = vec2.add(vec2.mult(a0, 1-t),vec2.mult(a1, t));
                        b1 = vec2.add(vec2.mult(a1, 1-t),vec2.mult(a2, t));

                        // step 3
                        c = vec2.add(vec2.mult(b0, 1-t),vec2.mult(b1, t));
                        
                        // draw line segment
                        context.lineTo(c[0],c[1]);
                        context.moveTo(c[0],c[1]);
                        this.pointList.push([c[0],c[1]]);
                        t += increment;

                };
                context.lineTo(this.p3[0],this.p3[1]);
                this.pointList.push([this.p3[0],this.p3[1]]);
                context.stroke();
                
				if (this.tickmarks) {
					var tm = new TickMarks(this);
                	tm.draw(context);
				}
                
        }

        BezierCurve.prototype.isHit = function(context, p) {
                var t = 0;
                for (var i = 0; i < this.pointList.length - 1; i++) {
                        t = vec2.projectPointOnLine(p, this.pointList[i], this.pointList[i + 1])
                        console.log(p);
                        console.log(this.pointList[i]);
                        console.log(this.pointList[i + 1]);
                        console.log(t);
                        if (t >= 0 && t <= 1) {
                                // coordinates of the projected point
                                var pos = vec2.add(this.pointList[i], vec2.mult(vec2.sub(this.pointList[i + 1], this.pointList[i]), t));

                                // distance of the point from the line
                                var d = vec2.length(vec2.sub(pos, p));

                                // allow 2 pixels extra "sensitivity"
                                if (d <= (this.lineStyle.width / 2) + 2){
                                        console.log("Bezier Curve: Hit");
                                        return true;
                                }
                                
                        }
                }
                console.log("Bezier Curve: Missed");
                return false;
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
