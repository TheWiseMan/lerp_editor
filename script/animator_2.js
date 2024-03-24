"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Animator2;
(function (Animator2) {
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
    const LINEAR = new KeySpline(0, 0, 0, 0);
    const EASE_IN_OUT = new KeySpline(1, 0, 0, 1);
    const QUAD_ACCELERATION = new KeySpline(1, 0, 1, 0);
    const QUAD_DECELERATION = new KeySpline(0, 1, 0, 1);
    Animator2.EASING = {
        LINEAR,
        EASE_IN_OUT,
        QUAD_ACCELERATION,
        QUAD_DECELERATION
    };
    /**
     * A dataclass that wraps the constants used by the other classes
     */
    class Animator {
    }
    Animator.svg_ns = "http://www.w3.org/2000/svg";
    class AnimationCanvas extends SVGSVGElement {
    }
    class Animation {
        constructor(element) {
            this.animated_element = null;
            this.animated_element = element;
        }
        static create(element) {
            return new this(element);
        }
        play(canv) {
            return __awaiter(this, void 0, void 0, function* () {
                return new Promise((resolve) => { });
            });
        }
        pause() { }
    }
    Animator2.Animation = Animation;
    class SimpleAnimation extends Animation {
        constructor(element, attributename, values, duration, anim = Animator2.EASING.EASE_IN_OUT, freeze = true) {
            super(element);
            this.duration = 0;
            this.attribute_name = "";
            this.values = [];
            this.freeze = true;
            this.duration = duration;
            this.attribute_name = attributename;
            this.values = values;
            this.freeze = freeze;
            this.animate_element = document.createElementNS(Animator.svg_ns, "animate");
            //this.element.setAttribute("begin", this.start);
            this.animate_element.setAttribute("attributeName", this.attribute_name);
            this.animate_element.setAttribute("dur", this.duration.toString() + "s");
            this.animate_element.setAttribute("values", this.values.join(";"));
            this.animate_element.setAttribute("fill", "freeze");
            this.animate_element.setAttribute("calcMode", "spline");
            this.animate_element.setAttribute("keySplines", anim.get(this.values.length - 1));
            //this.animate_element.setAttribute("repeatCount", "indefinite");
        }
        play(canv) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                console.log((_a = this.animated_element) === null || _a === void 0 ? void 0 : _a.canvas.getCurrentTime());
                //this.animate_element.beginElementAt(0);
                if (this.animated_element != null) {
                    if (this.animated_element.html_root == null) {
                        return;
                    }
                    if (this.animated_element.html_root.contains(this.animate_element)) {
                        return;
                    }
                    this.animated_element.html_root.appendChild(this.animate_element);
                    /*this.animate_element.beginElement();*/
                    this.animate_element.setAttribute("begin", ((_c = (_b = this.animated_element) === null || _b === void 0 ? void 0 : _b.canvas.getCurrentTime()) !== null && _c !== void 0 ? _c : 0).toString() + "s");
                }
                return new Promise((resolve) => {
                    setTimeout(() => {
                        //this.animate_element.remove();
                        resolve("animation finished");
                    }, this.duration * 1000);
                });
            });
        }
    }
    Animator2.SimpleAnimation = SimpleAnimation;
    class AnimationStep extends Animation {
        constructor(sync, async = []) {
            super(null);
            this.synchronous_animations = [];
            this.asynchronous_animations = [];
            this.synchronous_animations = sync;
            this.asynchronous_animations = async;
        }
        play(canvas) {
            return __awaiter(this, void 0, void 0, function* () {
                this.asynchronous_animations.forEach((async_anim) => {
                    async_anim.play(canvas);
                });
                var promises = this.synchronous_animations.map((value) => { return value.play(canvas); });
                var results = yield Promise.all(promises);
                console.log("finished");
                return results;
            });
        }
    }
    Animator2.AnimationStep = AnimationStep;
    /**
     * Principle of the animation queue :
     * each step consists of two arrays :
     *  - the synchronous array
     *  - the asyjnchronous array
     * all the animations in the synchronous array must be finished before the next step, the ones in the asynchronous array are started, but their end is not waited for
     * An animation queue can be used as an animation
     */
    class AnimationQueue extends Animation {
        constructor(...groups) {
            super(null);
            this.animation_groups = [];
            this.animation_groups = groups;
        }
        play(canvas) {
            return __awaiter(this, void 0, void 0, function* () {
                for (let index = 0; index < this.animation_groups.length; index++) {
                    const anim_group = this.animation_groups[index];
                    yield anim_group.play(canvas);
                }
            });
        }
    }
    Animator2.AnimationQueue = AnimationQueue;
    class AnimationDelay extends Animation {
        constructor(time) {
            super(null);
            this.time_ms = 0;
            this.time_ms = time;
        }
        play(canvas) {
            return __awaiter(this, void 0, void 0, function* () {
                yield new Promise(resolve => setTimeout(resolve, this.time_ms));
            });
        }
    }
    Animator2.AnimationDelay = AnimationDelay;
    /**
     * A wrapper class that correlates to the 'symbol' svg tag
     */
    class Animated {
        constructor(canvas) {
            this.id = "animated-" + (Animated._last_id++).toString();
            this.attributes = {};
            this.html_symbol = null;
            this.html_root = null;
            Animated._last_id++;
            this.canvas = canvas;
        }
        update() {
            console.log("updated : ", this.html_symbol);
            if (this.html_symbol === null) {
                this.html_symbol = this.canvas.appendChild(this.get_symbol());
                return;
            }
            var new_element = this.get_symbol();
            this.html_symbol.replaceWith(new_element);
            this.html_symbol = new_element;
        }
        get_symbol() {
            var t = document.createElementNS(Animator.svg_ns, "symbol");
            t.setAttributeNS(Animator.svg_ns, "id", this.id);
            this.html_root = t;
            return t;
        }
        apply_attributes(element) {
            for (const attribute_name in this.attributes) {
                if (Object.prototype.hasOwnProperty.call(this.attributes, attribute_name)) {
                    const attribute_value = this.attributes[attribute_name];
                    element.setAttribute(attribute_name, attribute_value);
                }
            }
            return element;
        }
        instantiate(x, y) {
            this.update();
            var new_use = document.createElementNS(Animator.svg_ns, "use");
            new_use.setAttribute("href", '#' + this.id);
            new_use.setAttribute("x", x);
            new_use.setAttribute("y", y);
            return this.canvas.appendChild(new_use);
        }
        set(attr, value) {
            this.attributes[attr] = value;
            return this;
            //this.update();
        }
    }
    Animated._last_id = 0;
    Animator2.Animated = Animated;
    class AnimatedSymbol extends Animated {
    }
    Animator2.AnimatedSymbol = AnimatedSymbol;
    // Text animations
    /**
     * A simple wrappêr that allows for independent animation of single letters and words in the text
     */
    class AnimatedText extends Animated {
        constructor(canvas, ...text) {
            super(canvas);
            this.textcontent = "";
            this.words = [];
            this.textcontent = text.join("");
            text.forEach((word) => {
                this.words.push(new AnimatedTextWord(canvas, word));
            });
        }
        get_symbol() {
            var parent = super.get_symbol();
            var t = document.createElementNS(Animator.svg_ns, "text");
            t.setAttributeNS(Animator.svg_ns, "x", "0");
            t.setAttributeNS(Animator.svg_ns, "y", "0");
            t.id = this.id;
            this.words.forEach((word) => {
                t.appendChild(word.get_symbol());
            });
            this.apply_attributes(t);
            parent.appendChild(t);
            parent.id = "";
            this.html_root = t;
            return parent;
        }
        get_word(n) {
            return this.words[n];
        }
    }
    Animator2.AnimatedText = AnimatedText;
    class AnimatedTextWord extends Animated {
        constructor(canvas, text) {
            super(canvas);
            this.textcontent = "";
            this.words = [];
            this.textcontent = text;
        }
        get_symbol() {
            var t = document.createElementNS(Animator.svg_ns, "tspan");
            t.id = this.id;
            t.innerHTML = this.textcontent;
            this.apply_attributes(t);
            this.html_root = t;
            return t;
        }
    }
    class TextWriteAnimation extends Animation {
    }
    class AnimatedCircle extends Animated {
        constructor(canvas) {
            super(canvas);
        }
        get_symbol() {
            var parent = super.get_symbol();
            var t = document.createElementNS(Animator.svg_ns, "circle");
            t.setAttributeNS(Animator.svg_ns, "x", "0");
            t.setAttributeNS(Animator.svg_ns, "y", "0");
            t.id = this.id;
            this.apply_attributes(t);
            parent.appendChild(t);
            parent.id = "";
            this.html_root = t;
            return parent;
        }
    }
    Animator2.AnimatedCircle = AnimatedCircle;
    class AnimatedPath extends Animated {
        constructor(canvas, path) {
            super(canvas);
            this.path = "";
            this.path = path;
        }
        get_symbol() {
            var parent = super.get_symbol();
            var t = document.createElementNS(Animator.svg_ns, "path");
            t.setAttributeNS(null, "d", this.path);
            t.id = this.id;
            this.apply_attributes(t);
            parent.appendChild(t);
            parent.id = "";
            this.html_root = t;
            return parent;
        }
        instantiate(x, y) {
            this.update();
            var new_use = document.createElementNS(Animator.svg_ns, "use");
            new_use.setAttribute("href", '#' + this.id);
            new_use.setAttribute("x", x);
            new_use.setAttribute("y", y);
            return this.canvas.appendChild(new_use);
        }
    }
    Animator2.AnimatedPath = AnimatedPath;
})(Animator2 || (Animator2 = {}));
const color_accent = "#e08700";
var canv = document.getElementById("svg-canvas");
var main;
document.onkeyup = (e) => {
    if (e.key == "f") {
        canv.requestFullscreen();
    }
};
/*document.oncontextmenu = (e)=>{
    canv.requestFullscreen();
    e.preventDefault();
}*/
document.body.onkeydown = (e) => {
    console.log(e);
    if (e.key == " ") {
        canv.animationsPaused() ? canv.unpauseAnimations() : canv.pauseAnimations();
    }
    if (e.key == "Backspace") {
        canv.setCurrentTime(0);
        main.play(canv);
    }
};
