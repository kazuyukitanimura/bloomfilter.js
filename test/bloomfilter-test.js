var BloomFilter = require("../bloomfilter");

var vows = require("vows");
var assert = require("assert");

var suite = vows.describe("bloomfilter");

var nTests = 256;
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
var keys = [];

/**
 * Initializing the keys
 */
for(var i=nTests; i--;){
  keys[i] = chars.charAt(i / 62 / 62 % 62) + chars.charAt(i / 62 % 62) + chars.charAt(i % 62);
}

suite.addBatch({
  "bloom filter": {
    "basic": function() {
      var f = new BloomFilter(2000, 4);
      for(var i=nTests/2; i--;){
        f.add(keys[i]);
        assert.equal(f.test(keys[i           ]),  true);
        assert.equal(f.test(keys[i + nTests/2]), false);
      }
    },
    "basic uint32": function() {
      var f = new BloomFilter(1000, 4);
      var n1 = "\u100";
      var n2 = "\u101";
      var n3 = "\u103";
      f.add(n1);
      assert.equal(f.test(n1),  true);
      assert.equal(f.test(n2), false);
      assert.equal(f.test(n3), false);
    }
  }
});

suite.export(module);
