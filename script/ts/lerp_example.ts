
var test_text2 = new Animator2.AnimatedText(canv, "L", "inear ", "int", "ERP", "olation");
test_text2.get_word(0).set("fill", color_accent);
test_text2.get_word(3).set("fill", color_accent);
//console.log(test_text.get_word(0));
test_text2.set("fill", "white");
test_text2.set("text-anchor", "middle");
test_text2.set("dominant-baseline", "middle");
test_text2.instantiate("100", "50");

var lerp_french = new Animator2.AnimatedText(canv, "Interpolation linéaire");
lerp_french.set("fill", "white");
lerp_french.set("text-anchor", "middle");
lerp_french.set("dominant-baseline", "middle");
lerp_french.set("opacity", "0");
lerp_french.instantiate("100", "50");

//var animtest1 = new Animator2.SimpleAnimation(test_text, "fill", ["red", "blue", "#ff00ff"], 10);
var group_display_lerp = new Animator2.AnimationStep([
    new Animator2.SimpleAnimation(test_text2.get_word(1), "display", ["none", "inline"], 2),
    new Animator2.SimpleAnimation(test_text2.get_word(1), "display", ["none", "inline"], 2),
    new Animator2.SimpleAnimation(test_text2.get_word(2), "display", ["none", "inline"], 5),
    new Animator2.SimpleAnimation(test_text2.get_word(4), "display", ["none", "inline"], 5)
]);

var group_lerp_translate = new Animator2.AnimationStep([
    new Animator2.SimpleAnimation(test_text2, "y", ["0", "-10"], 1),
    new Animator2.SimpleAnimation(test_text2, "opacity", ["1", "0"], 1),
    new Animator2.SimpleAnimation(lerp_french, "opacity", ["0", "1"], 1),
    new Animator2.SimpleAnimation(lerp_french, "y", ["10", "0"], 1),
]);

var main = new Animator2.AnimationQueue(
    group_display_lerp,
    group_lerp_translate
)