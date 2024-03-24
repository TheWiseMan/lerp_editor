namespace Animator2 {
    export type SvgInHtml = HTMLElement & SVGSVGElement;

    class KeySpline {
        public x1 = 0;
        public y1 = 0;
        public x2 = 0;
        public y2 = 0;
        constructor(x1: number, y1: number, x2: number, y2: number) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
        }
        get(n: number) {
            var onestring = [this.x1, this.y1, this.x2, this.y2].join(" ");
            var s = new Array(n).fill(onestring).join(";");
            return s;
        }
    }
    const LINEAR = new KeySpline(0, 0, 0, 0);
    const EASE_IN_OUT = new KeySpline(1, 0, 0, 1);
    const QUAD_ACCELERATION = new KeySpline(1, 0, 1, 0);
    const QUAD_DECELERATION = new KeySpline(0, 1, 0, 1);
    export const EASING = {
        LINEAR,
        EASE_IN_OUT,
        QUAD_ACCELERATION,
        QUAD_DECELERATION
    }


    /**
     * A dataclass that wraps the constants used by the other classes
     */
    class Animator {
        public static svg_ns = "http://www.w3.org/2000/svg";
    }

    class AnimationCanvas extends SVGSVGElement {

    }
    export class Animation {
        public animated_element: Animated | null = null;
        constructor(element: Animated | null) {
            this.animated_element = element;
        }
        public static create(element: Animated | null) {
            return new this(element);
        }
        async play(canv: SvgInHtml): Promise<unknown> {
            return new Promise((resolve) => { });
        }
        pause() { }
    }

    export class SimpleAnimation extends Animation {
        duration = 0;
        attribute_name = "";
        values: any[] = [];
        animate_element: SVGAnimateElement;
        freeze = true;

        constructor(element: Animated, attributename: string, values: any[], duration: number, anim = EASING.EASE_IN_OUT,freeze=true) {
            super(element);
            this.duration = duration;
            this.attribute_name = attributename;
            this.values = values;
            this.freeze = freeze;
            this.animate_element = <SVGAnimateElement>document.createElementNS(Animator.svg_ns, "animate");
            //this.element.setAttribute("begin", this.start);
            this.animate_element.setAttribute("attributeName", this.attribute_name)
            this.animate_element.setAttribute("dur", this.duration.toString() + "s");
            this.animate_element.setAttribute("values", this.values.join(";"));
            this.animate_element.setAttribute("fill", "freeze");
            this.animate_element.setAttribute("calcMode", "spline");
            this.animate_element.setAttribute("keySplines", anim.get(this.values.length -1));
            //this.animate_element.setAttribute("repeatCount", "indefinite");
        }
        async play(canv: SvgInHtml) {
            console.log(this.animated_element?.canvas.getCurrentTime());
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
                this.animate_element.setAttribute("begin", (this.animated_element?.canvas.getCurrentTime() ?? 0).toString() + "s")
            }
            return new Promise((resolve) => {
                setTimeout(() => {
                    //this.animate_element.remove();
                    resolve("animation finished");
                }, this.duration * 1000);
            })
        }
    }

    export class AnimationStep extends Animation {
        synchronous_animations: Animation[] = [];
        asynchronous_animations: Animation[] = [];

        constructor(sync: Animation[], async: Animation[] = []) {
            super(null);
            this.synchronous_animations = sync;
            this.asynchronous_animations = async;
        }

        async play(canvas: SvgInHtml) {
            this.asynchronous_animations.forEach((async_anim: Animation) => {
                async_anim.play(canvas);
            })
            var promises = this.synchronous_animations.map((value) => { return value.play(canvas) });
            var results = await Promise.all(promises);

            console.log("finished");
            return results;
        }
    }

    /**
     * Principle of the animation queue :
     * each step consists of two arrays :
     *  - the synchronous array
     *  - the asyjnchronous array
     * all the animations in the synchronous array must be finished before the next step, the ones in the asynchronous array are started, but their end is not waited for
     * An animation queue can be used as an animation
     */
    export class AnimationQueue extends Animation {
        animation_groups:  Animation[] = [];
        constructor(...groups: Animation[]) {
            super(null);
            this.animation_groups = groups;
        }
        async play(canvas: SvgInHtml) {
            for (let index = 0; index < this.animation_groups.length; index++) {
                const anim_group = this.animation_groups[index];
                await anim_group.play(canvas);
            }
        }
    }

    export class AnimationDelay extends Animation {
        time_ms = 0;
        constructor(time : number) {
            super(null);
            this.time_ms = time;
            }
        async play(canvas: SvgInHtml) {
            await new Promise(resolve => setTimeout(resolve, this.time_ms));
        }
    }

    /**
     * A wrapper class that correlates to the 'symbol' svg tag
     */
    export class Animated {
        static _last_id = 0;
        public id = "animated-" + (Animated._last_id++).toString();
        public attributes: { [attrname: string]: any } = {};
        public html_symbol: Element | null = null;
        public html_root: Element | null = null;
        canvas: AnimationCanvas;
        constructor(canvas: AnimationCanvas) {
            Animated._last_id++;
            this.canvas = canvas;
        }

        public update() {
            console.log("updated : ", this.html_symbol);
            if (this.html_symbol === null) {
                this.html_symbol = this.canvas.appendChild(this.get_symbol());
                return;
            }
            var new_element = this.get_symbol();
            this.html_symbol.replaceWith(new_element);
            this.html_symbol = new_element;
        }
        public get_symbol(): Element {
            var t = <SVGSymbolElement>document.createElementNS(Animator.svg_ns, "symbol");
            t.setAttributeNS(Animator.svg_ns, "id", this.id);
            this.html_root = t;
            return t;
        }

        apply_attributes(element: Element) {
            for (const attribute_name in this.attributes) {
                if (Object.prototype.hasOwnProperty.call(this.attributes, attribute_name)) {
                    const attribute_value = this.attributes[attribute_name];
                    element.setAttribute(attribute_name, attribute_value);
                }
            }
            return element;
        }

        public instantiate(x: string, y: string) {
            this.update();
            var new_use = <SVGUseElement>document.createElementNS(Animator.svg_ns, "use");
            new_use.setAttribute("href", '#' + this.id);
            new_use.setAttribute("x", x);
            new_use.setAttribute("y", y);
            return this.canvas.appendChild(new_use);
        }

        public set(attr: string, value: any) {
            this.attributes[attr] = value;
            return this;
            //this.update();
        }
    }

    export class AnimatedSymbol extends Animated {
        
    }

    // Text animations

    /**
     * A simple wrappêr that allows for independent animation of single letters and words in the text
     */
    export class AnimatedText extends Animated {
        textcontent = "";
        words: AnimatedTextWord[] = [];
        constructor(canvas: AnimationCanvas, ...text: string[]) {
            super(canvas);
            this.textcontent = text.join("");
            text.forEach((word) => {
                this.words.push(new AnimatedTextWord(canvas, word));
            })
        }

        public get_symbol(): Element {
            var parent = super.get_symbol();
            var t = document.createElementNS(Animator.svg_ns, "text");
            t.setAttributeNS(Animator.svg_ns, "x", "0");
            t.setAttributeNS(Animator.svg_ns, "y", "0");
            t.id = this.id;
            this.words.forEach((word) => {
                t.appendChild(word.get_symbol())
            })
            this.apply_attributes(t);
            parent.appendChild(t);
            parent.id = "";
            this.html_root = t;
            return parent;
        }
        public get_word(n: number) {
            return this.words[n];
        }
    }

    class AnimatedTextWord extends Animated {
        textcontent = "";
        words: AnimatedTextWord[] = [];
        constructor(canvas: AnimationCanvas, text: string) {
            super(canvas);
            this.textcontent = text;
        }

        public get_symbol(): Element {
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


    export class AnimatedCircle  extends Animated {
        constructor(canvas: AnimationCanvas) {
            super(canvas);
        }

        public get_symbol(): Element {
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

    export class AnimatedPath  extends Animated {
        path = "";
        constructor(canvas: AnimationCanvas, path : string) {
            super(canvas);
            this.path = path;
        }

        public get_symbol(): Element {
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
        public instantiate(x: string, y: string) {
            this.update();
            var new_use = <SVGUseElement>document.createElementNS(Animator.svg_ns, "use");
            new_use.setAttribute("href", '#' + this.id);
            new_use.setAttribute("x", x);
            new_use.setAttribute("y", y);
            return this.canvas.appendChild(new_use);
        }
    }
}

const color_accent = "#e08700"


var canv = <Animator2.SvgInHtml>document.getElementById("svg-canvas");
var main : Animator2.AnimationQueue;


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
    console.log(e)
    if (e.key == " ") {
        canv.animationsPaused() ? canv.unpauseAnimations() : canv.pauseAnimations()
    }
    if (e.key == "Backspace") {
        canv.setCurrentTime(0);
        main.play(canv);
    }
}