"use strict";
var Animator;
(function (Animator) {
    Animator.global_svg_ns = "http://www.w3.org/2000/svg";
    class KeySpline {
        constructor(x1, y1, x2, y2) {
            this.x1 = 0;
            this.y1 = 0;
            this.x2 = 0;
            this.y2 = 0;
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
        get(n) {
            var onestring = [this.x1, this.y1, this.x2, this.y2].join(" ");
            var s = new Array(n).fill(onestring).join(";");
            return s;
        }
    }
    Animator.LINEAR = new KeySpline(0, 0, 0, 0);
    Animator.EASE_IN_OUT = new KeySpline(1, 0, 0, 1);
    Animator.QUAD_ACCELERATION = new KeySpline(1, 0, 1, 0);
    Animator.QUAD_DECELERATION = new KeySpline(0, 1, 0, 1);
    class Animation {
        constructor() {
            this.id = Animation._id++;
            this.start = "0s";
            this.end = "";
            this.duration = "1s";
            this.fill = "freeze";
            this.repeat = 1;
            this.element = null;
        }
        add(parent = null) {
            this.element = document.createElementNS(Animator.global_svg_ns, "animate");
            //this.element.setAttribute("begin", this.start);
            this.element.id = "animation-" + this.id;
            this.element.setAttribute("end", this.end);
            this.element.setAttribute("dur", this.duration);
            this.element.setAttribute("fill", this.fill);
            this.element.setAttribute("repeatCount", this.repeat.toString());
            if (parent) {
                parent.appendChild(this.element);
            }
            return this.element;
        }
    }
    Animation._id = 0;
    class AnimatedObject {
        constructor(canvas = Animator.default_canvas) {
            this.x = 0;
            this.y = 0;
            this.scale = 1;
            this.rotation = 0;
            this.animations = [];
            this.svg_canvas = canvas;
        }
    }
    Animator.AnimatedObject = AnimatedObject;
    class Circle extends AnimatedObject {
        constructor(center_x, center_y, radius) {
            super();
            this.r = 0;
            this.element = null;
            this.x = center_x;
            this.y = center_y;
            this.r = radius;
            this.element = document.createElementNS(Animator.global_svg_ns, "circle");
        }
        draw() {
            if (!this.element) {
                return this;
            }
            this.element.setAttribute("r", this.r.toString());
            this.element.setAttribute("cx", this.x.toString());
            this.element.setAttribute("cy", this.y.toString());
            this.svg_canvas.appendChild(this.element);
            return this;
        }
    }
    Animator.Circle = Circle;
    class TransformAnimation extends Animation {
        constructor() {
            super(...arguments);
            this.type = "rotate";
        }
        add(parent = null) {
            this.element = document.createElementNS(Animator.global_svg_ns, "animateTransform");
            //this.element.setAttribute("begin", this.start);
            this.element.id = "animation-" + this.id;
            this.element.setAttribute("type", this.type);
            this.element.setAttribute("dur", this.duration);
            this.element.setAttribute("fill", this.fill);
            this.element.setAttribute("repeatCount", this.repeat.toString());
            if (parent) {
                parent.appendChild(this.element);
            }
            return this.element;
        }
    }
    Animator.TransformAnimation = TransformAnimation;
    class RotateAnimation extends TransformAnimation {
    }
    Animator.RotateAnimation = RotateAnimation;
    class TranslateLerpAnimation extends TransformAnimation {
    }
    Animator.TranslateLerpAnimation = TranslateLerpAnimation;
    class CircleAnimation extends Animation {
        constructor(elt) {
            super();
            this.element_circle = elt;
        }
    }
    class CircleRadiusLerpAnimation extends CircleAnimation {
        constructor(elt, radiuses = [], duration = "1s", anim = Animator.LINEAR) {
            super(elt);
            this.radiuses = [];
            this.duration = duration;
            elt.animations.push(this);
            this.element = this.add(elt.element);
            this.element.setAttribute("attributeName", "r");
            this.element.setAttribute("values", radiuses.join(";"));
            this.element.setAttribute("calcMode", "spline");
            this.element.setAttribute("keySplines", anim.get(radiuses.length - 1));
        }
    }
    Animator.CircleRadiusLerpAnimation = CircleRadiusLerpAnimation;
})(Animator || (Animator = {}));
var canvas = document.getElementById("svg-canvas");
if (canvas) {
    Animator.default_canvas = canvas;
    var test = new Animator.Circle(100, 50, 20).draw();
    var anim1 = new Animator.CircleRadiusLerpAnimation(test, [5, 15, 10], "1s", Animator.EASE_IN_OUT);
}
//Animator.AnimatedObject = document.getElementById("svg-canvas") ?? document.createElement("svg");
document.body.onkeydown = (e) => {
    console.log(e);
    if (e.key == " ") {
        canvas.animationsPaused() ? canvas.unpauseAnimations() : canvas.pauseAnimations();
    }
    if (e.key == "Backspace") {
        canvas.setCurrentTime(0);
    }
};
