"use strict";
function new_center_text(...text) {
    var temp = new Animator2.AnimatedText(canv, ...text);
    temp.set("fill", "white");
    temp.set("text-anchor", "middle");
    temp.set("dominant-baseline", "middle");
    temp.set("opacity", "0");
    temp.instantiate("100", "50");
    return temp;
}
// 1. Apprentissage automatique / Machine Learning
{
    var text_machine_learning_fr = new Animator2.AnimatedText(canv, "Apprentissage automatique");
    var text_machine_learning_en = new Animator2.AnimatedText(canv, "Machine Learning");
    text_machine_learning_fr.set("fill", "white");
    text_machine_learning_fr.set("text-anchor", "middle");
    text_machine_learning_fr.set("dominant-baseline", "middle");
    text_machine_learning_fr.instantiate("100", "50");
    text_machine_learning_en.set("fill", "white");
    text_machine_learning_en.set("text-anchor", "middle");
    text_machine_learning_en.set("dominant-baseline", "middle");
    text_machine_learning_en.set("opacity", "0");
    text_machine_learning_en.instantiate("100", "50");
    var group_1_1 = new Animator2.AnimationStep([
        new Animator2.SimpleAnimation(text_machine_learning_fr, "y", ["0", "-10"], 1),
        new Animator2.SimpleAnimation(text_machine_learning_fr, "opacity", ["1", "0"], 1),
        new Animator2.SimpleAnimation(text_machine_learning_en, "opacity", ["0", "1"], 1),
        new Animator2.SimpleAnimation(text_machine_learning_en, "y", ["10", "0"], 1),
    ]);
    var group_1_2 = new Animator2.AnimationStep([
        new Animator2.SimpleAnimation(text_machine_learning_en, "opacity", ["1", "0"], 1),
    ]);
}
// 2. Classification / Régression
{
    var text_classification = new Animator2.AnimatedText(canv, "Classification");
    text_classification.set("fill", "white");
    text_classification.set("text-anchor", "middle");
    text_classification.set("dominant-baseline", "middle");
    text_classification.set("opacity", "0");
    text_classification.instantiate("100", "50");
    var text_regression = new_center_text("Regression");
    var group_2_1 = new Animator2.AnimationStep([
        new Animator2.SimpleAnimation(text_classification, "opacity", ["0", "1"], 1),
    ]);
    var group_2_2 = new Animator2.AnimationStep([
        new Animator2.SimpleAnimation(text_classification, "y", ["0", "-15"], 1),
        new Animator2.SimpleAnimation(text_regression, "opacity", ["0", "1"], 1),
    ]);
    var group_2_3 = new Animator2.AnimationStep([
        new Animator2.SimpleAnimation(text_classification, "font-size", ["1em", "0.5em"], 1),
        new Animator2.SimpleAnimation(text_classification, "x", ["0", "-50"], 1),
        new Animator2.SimpleAnimation(text_regression, "font-size", ["1em", "0.5em"], 1),
        new Animator2.SimpleAnimation(text_regression, "x", ["0", "50"], 1),
        new Animator2.SimpleAnimation(text_classification, "y", ["-15", "0"], 1),
    ]);
    var dot_left_queue = [
        //new Animator2.SimpleAnimation(text_regression, "y", ["0", "-35"], 1),
        new Animator2.SimpleAnimation(text_classification, "y", ["0", "-40"], 1),
    ];
    function new_small_dot(x, y, r = 1) {
        var circ1 = new Animator2.AnimatedCircle(canv);
        circ1.set("fill", "white");
        circ1.set("r", r.toString());
        circ1.set("targetx", x.toString());
        circ1.set("targety", y.toString());
        circ1.set("opacity", "0");
        circ1.instantiate(x.toString(), "0");
        circ1.update();
        return circ1;
    }
    var _group_2_6 = [ // disseapear;
    ];
    var dots_left = [];
    var dots_left_group_1 = [];
    var dots_left_group_2 = [];
    var dots_left_group_3 = [];
    var dots_left_group_4 = [];
    for (let i = 0; i < 20; i++) {
        var dot = new_small_dot(Math.random() * 60 + 20, Math.random() * 60 + 20);
        dots_left.push(dot);
        if (i < 5) {
            dots_left_group_1.push(new Animator2.SimpleAnimation(dot, "fill", ["white", "red"], 1));
        }
        else if (i < 10) {
            dots_left_group_2.push(new Animator2.SimpleAnimation(dot, "fill", ["white", "cyan"], 1));
        }
        else if (i < 15) {
            dots_left_group_3.push(new Animator2.SimpleAnimation(dot, "fill", ["white", "orange"], 1));
        }
        else {
            dots_left_group_4.push(new Animator2.SimpleAnimation(dot, "fill", ["white", "green"], 1));
        }
        dot_left_queue.push(new Animator2.AnimationStep([
            new Animator2.SimpleAnimation(dot, "cy", ["100", dot.attributes["targety"]], 0.2),
            new Animator2.SimpleAnimation(dot, "opacity", ["0", "1"], 0.1)
        ]));
        _group_2_6.push(new Animator2.SimpleAnimation(dot, "opacity", ["1", "0"], 1));
    }
    /*for (let i = 0; i < dots_left.length; i++) {
        const element = dots_left[i];
    }*/
    var group_2_4 = new Animator2.AnimationQueue(new Animator2.AnimationQueue(...dot_left_queue), new Animator2.AnimationStep(dots_left_group_1), new Animator2.AnimationStep(dots_left_group_2), new Animator2.AnimationStep(dots_left_group_3), new Animator2.AnimationStep(dots_left_group_4));
    var dot_right = [];
    var dots_right_queue = [];
    var fitted_curve = new Animator2.AnimatedPath(canv, "M 0 0 C 20 -40, 40 -40, 60 0");
    //fitted_curve.set("d", "C 20 80, 40 80, 50 60");
    fitted_curve.set("stroke", "grey");
    fitted_curve.set("fill", "none");
    fitted_curve.set("stroke-width", "0.2");
    fitted_curve.set("opacity", "0");
    fitted_curve.instantiate("120", "70");
    for (let i = 0; i < 20; i++) {
        var x = Math.random() - 0.5;
        var dot = new_small_dot(x * 60 + 150, x * x * 120 + 40, 0.5);
        dot.set("cy", x * x * 60 + 20);
        dot_right.push(dot);
        dots_right_queue.push(new Animator2.AnimationStep([
            new Animator2.SimpleAnimation(dot, "cy", ["100", dot.attributes["targety"]], 0.2),
            new Animator2.SimpleAnimation(dot, "opacity", ["0", "1"], 0.1)
        ]));
        _group_2_6.push(new Animator2.SimpleAnimation(dot, "opacity", ["1", "0"], 1));
    }
    var group_2_5 = new Animator2.AnimationQueue(new Animator2.SimpleAnimation(text_regression, "y", ["0", "-40"], 1), new Animator2.AnimationQueue(...dots_right_queue), new Animator2.SimpleAnimation(fitted_curve, "opacity", ["0", "1"], 1));
    _group_2_6.push(new Animator2.SimpleAnimation(fitted_curve, "opacity", ["1", "0"], 1));
    _group_2_6.push(new Animator2.SimpleAnimation(text_classification, "opacity", ["1", "0"], 1));
    _group_2_6.push(new Animator2.SimpleAnimation(text_regression, "opacity", ["1", "0"], 1));
    var group_2_6 = new Animator2.AnimationStep(_group_2_6);
}
// 3. 
var main = new Animator2.AnimationQueue(group_1_1, group_1_2, group_2_1, group_2_2, group_2_3, group_2_4, group_2_5, new Animator2.AnimationDelay(2000), group_2_6);
