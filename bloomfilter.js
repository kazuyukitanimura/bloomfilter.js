var murmurhash3 = require('./murmurhash-js/murmurhash3_gc');

function BloomFilter(m, k){
  this.m = m;
  this.k = k;
  var buckets = this.buckets = [];
  var n = Math.ceil(m / k);
  for(var i = n; i--;){
    buckets[i] = 0;
  }
}

BloomFilter.prototype.locations = function(v){
  var m = this.m;
  var r = [];
  for(var i = this.k; i--;){
    r[i] = murmurhash3(v, i) % m;
  }
  return r;
};

BloomFilter.prototype.add = function(v){
  var l = this.locations(v);
  var k = this.k;
  var b;
  var buckets = this.buckets;
  for(var i = this.k; i--;){
    b = l[i];
    buckets[Math.floor(b / k)] |= 1 << (b % k)
  }
};

BloomFilter.prototype.test = function(v){
  var l = this.locations(v);
  var k = this.k;
  var b;
  var buckets = this.buckets;
  for(var i = this.k; i--;){
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
