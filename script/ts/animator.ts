namespace Animator {
    export type SvgInHtml = HTMLElement & SVGSVGElement;
    export var default_canvas : SvgInHtml;
    export var global_svg_ns = "http://www.w3.org/2000/svg";


    class KeySpline {
        public x1 = 0;
        public y1 = 0;
        public x2 = 0;
        public y2 = 0;
        constructor(x1 : number, y1 : number, x2 : number, y2 : number) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
        get(n : number) {
            var onestring = [this.x1, this.y1, this.x2, this.y2].join(" ");
            var s = new Array(n).fill(onestring).join(";");
            return s;
        }
    }
    export const LINEAR = new KeySpline(0,0,0,0);
    export const EASE_IN_OUT = new KeySpline(1,0,0,1);
    export const QUAD_ACCELERATION = new KeySpline(1,0,1,0);
    export const QUAD_DECELERATION = new KeySpline(0,1,0,1);

    class Animation {
        public static _id = 0;
        public id : number = Animation._id++;
        public start = "0s";
        public end = "";
        public duration = "1s";
        public fill = "freeze";
        public repeat = 1;
        public element : Element | null = null;
        public add(parent : Element | null = null) : Element {
            this.element = document.createElementNS(global_svg_ns, "animate");
            //this.element.setAttribute("begin", this.start);
            this.element.id = "animation-" + this.id;
            this.element.setAttribute("end", this.end)
            this.element.setAttribute("dur", this.duration);
            this.element.setAttribute("fill", this.fill);
            this.element.setAttribute("repeatCount", this.repeat.toString())
            if (parent) {
                parent.appendChild(this.element);
            }
            return this.element;
        }
    }
    export class AnimatedObject {
        public x = 0;
        public y = 0;
        public scale = 1;
        public rotation = 0;
        public svg_canvas : SvgInHtml;
        public animations : Animation[] = [];
        public constructor(canvas = default_canvas) {
            this.svg_canvas = canvas;
        }
    }
    export class Circle extends AnimatedObject {
        public r = 0;
        public element : Element | null = null;
        constructor(center_x : number, center_y : number, radius : number) {
            super();
            this.x = center_x;
            this.y = center_y;
            this.r = radius;
            this.element = document.createElementNS(global_svg_ns, "circle");
        }
        draw() : Circle {
            if (!this.element) {
                return this;
            }
            this.element.setAttribute("r", this.r.toString());
            this.element.setAttribute("cx", this.x.toString())
            this.element.setAttribute("cy", this.y.toString())
            this.svg_canvas.appendChild(this.element);
            return this;
        }
    }

    export class TransformAnimation extends Animation {
        public type = "rotate";
        public add(parent : Element | null = null) : Element {
            this.element = document.createElementNS(global_svg_ns, "animateTransform");
            //this.element.setAttribute("begin", this.start);
            this.element.id = "animation-" + this.id;
            this.element.setAttribute("type", this.type);
            this.element.setAttribute("dur", this.duration);
            this.element.setAttribute("fill", this.fill);
            this.element.setAttribute("repeatCount", this.repeat.toString())
            if (parent) {
                parent.appendChild(this.element);
            }
            return this.element;
        }
    }
    export class RotateAnimation extends TransformAnimation {

    }
    export class TranslateLerpAnimation extends TransformAnimation {
        
    }
    class CircleAnimation extends Animation {
        public element_circle : Circle;
        constructor(elt : Circle) {
            super();
            this.element_circle = elt;
        }

    }
    export class CircleRadiusLerpAnimation extends CircleAnimation {
        public radiuses = [];
        constructor(elt : Circle, radiuses : number[] = [], duration = "1s", anim = LINEAR) {
            super(elt);
            this.duration = duration
            elt.animations.push(this);
            this.element = this.add(elt.element);
            this.element.setAttribute("attributeName", "r");
            this.element.setAttribute("values", radiuses.join(";"));
            this.element.setAttribute("calcMode", "spline");
            this.element.setAttribute("keySplines", anim.get(radiuses.length -1));
        }
    }
}
var canvas = <Animator.SvgInHtml>document.getElementById("svg-canvas");
if (canvas) {
    Animator.default_canvas = canvas;
    var test = new Animator.Circle(100,50,20).draw();
    var anim1 = new Animator.CircleRadiusLerpAnimation(test, [5,15,10], "1s", Animator.EASE_IN_OUT);
}
//Animator.AnimatedObject = document.getElementById("svg-canvas") ?? document.createElement("svg");
document.body.onkeydown= (e)=> {
    console.log(e)
    if (e.key == " ") {
        canvas.animationsPaused() ? canvas.unpauseAnimations() : canvas.pauseAnimations()
    }
    if (e.key == "Backspace") {
        canvas.setCurrentTime(0);
    }
}