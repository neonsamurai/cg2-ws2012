/* requireJS module definition */
define(["util", "vec2", "scene", "point_dragger", "tick_marks"], (function(Util, vec2, Scene, PointDragger, TickMarks) {"use strict";

        var ParametricCurve = function(tmin, tmax, xt, yt, segments, lineStyle) {
                this.lineStyle = lineStyle || {
                        width : "2",
                        color : "#0000FF"
                };

                this.x1 = 0;
                this.y1 = 0;
                this.x2 = 0;
                this.y2 = 0;
                this.t = tmin;
                this.tmin = tmin;
                this.tmax = tmax;
                this.xt = xt;
                this.yt = yt;
                this.segments = segments;
                this.pointList = [];

                console.log("creating curve with x(t) = " + this.xt + ", y(t) = " + this.yt + ", t/min = " + this.tmin + ", t/max = " + this.tmax + ", segments = " + this.segments);
        };

        ParametricCurve.prototype.draw = function(context) {
                context.beginPath();

                context.lineWidth = this.lineStyle.width;
                context.strokeStyle = this.lineStyle.color;

                var increment = (this.tmax - this.tmin) / this.segments;
                var t = this.tmin;
                this.pointList = [];
                
                for (var i = 0; i < this.segments; i++) {
                        this.x1 = parseInt(eval(this.xt));
                        this.y1 = parseInt(eval(this.yt));
                        this.pointList.push([this.x1, this.y1]);
                        t = t + increment;
                        this.x2 = parseInt(eval(this.xt));
                        this.y2 = parseInt(eval(this.yt));
                        context.moveTo(this.x1, this.y1);
                        context.lineTo(this.x2, this.y2);
                        context.stroke();
                };
                this.pointList.push([this.x2, this.y2]);

                var tm = new TickMarks(this);
                tm.draw(context);
                
        }

        ParametricCurve.prototype.isHit = function(context, p) {
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
                                        console.log("Curve: Hit");
                                        return true;
                                }
                                
                        }
                }
                console.log("Curve: Missed");
                return false;
        }

        ParametricCurve.prototype.createDraggers = function() {
                var draggers = [];
                return draggers;

        };
        return ParametricCurve;
}));
