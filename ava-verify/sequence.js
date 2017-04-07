var arbitraryAssert = require("jsverify/lib/arbitraryAssert.js");
var arbitraryBless = require("jsverify/lib/arbitraryBless.js");
var generator = require("jsverify/lib/generator.js");
var random = require("jsverify/lib/random.js");
var show = require("jsverify/lib/show.js");
var shrink = require("jsverify/lib/shrink.js");
var utils = require("jsverify/lib/utils.js");

function sequence(gen) {
  var result = arbitraryBless(function (size) {
    var arrsize = random(0, size);
    var arr = new Array(arrsize);
    for (var i = 0; i < arrsize; i++) {
      arr[i] = gen(size);
    }
    return arr;
  });

  return utils.curried2(result, arguments);
}

module.exports = function arrayImpl(arb) {
  arb = utils.force(arb);

  arbitraryAssert(arb);

  return arbitraryBless({
    generator: sequence(arb.generator),
    shrink: shrink['array'](arb.shrink),
    show: show.array(arb.show),
  });
};
