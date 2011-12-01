var murmurhash3 = require('./murmurhash-js/murmurhash3_gc');

function BloomFilter(m, k){
  this.m = m;
  this.k = k;
  var buckets = this.buckets = [];
  for(var i = Math.ceil(m / 53); i--;){ // note that the precision of javascript is 53bits
    buckets[i] = 0;
  }
}

BloomFilter.prototype.add = function(v){
  var m = this.m;
  var b;
  var buckets = this.buckets;
  for(var i = this.k; i--;){
    b = murmurhash3(v, i) % m;
    buckets[Math.floor(b / 53)] |= 1 << (b % 53);
  }
};

BloomFilter.prototype.test = function(v){
  var m = this.m;
  var b;
  var buckets = this.buckets;
  for(var i = this.k; i--;){
    b = murmurhash3(v, i) % m;
    if((buckets[Math.floor(b / 53)] & (1 << (b % 53))) === 0){
      return false;
    }
  }
  return true;
};

if(typeof module !== "undefined"){
  module.exports = BloomFilter;
}
