var murmurhash3 = require('./murmurhash-js/murmurhash3_gc');

function BloomFilter(m, k){
  this.m = m;
  this.k = k;
  var buckets = this.buckets = [];
  var n = Math.ceil(m / k);
  var i = -1;
  while (++i < n) buckets[i] = 0;
}

// See http://willwhim.wordpress.com/2011/09/03/producing-n-hash-functions-by-hashing-only-once/
BloomFilter.prototype.locations = function(v){
  var k = this.k;
  var m = this.m;
  var r = [];
  var a = murmurhash3(v, 0);
  var b = murmurhash3(v, 1);
  var i = -1;
  while (++i < k) r[i] = (a + b * i) % m;
  return r;
};

BloomFilter.prototype.add = function(v){
  var l = this.locations(v);
  var i = -1;
  var k = this.k;
  var buckets = this.buckets;
  while (++i < k) buckets[Math.floor(l[i] / k)] |= 1 << (l[i] % k)
};

BloomFilter.prototype.test = function(v){
  var l = this.locations(v);
  var n = l.length;
  var i = -1;
  var k = this.k;
  var b;
  var buckets = this.buckets;
  while (++i < n){
    b = l[i];
    if((buckets[Math.floor(b / k)] & (1 << (b % k))) === 0){
      return false;
    }
  }
  return true;
};

if(typeof module !== "undefined"){
  module.exports = BloomFilter;
}
