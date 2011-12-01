function BloomFilter(m, k){
  this.m = m;
  this.k = k;
  var buckets = this.buckets = [];
  var n = Math.ceil(m / k);
  var i = -1;
  while (++i < n) buckets[i] = 0;
}

// Fowler/Noll/Vo hashing.
function fnv_1a(v){
  var n = v.length;
  var a = 2166136261;
  var c;
  var i = -1;
  while (++i < n){
    c = v.charCodeAt(i);
    a ^= (c & 0xff00) >> 8;
    a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
    a &= 0xffffffff;
    a ^= c & 0xff;
    a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
    a &= 0xffffffff;
  }
  return a;
}

// One additional iteration of FNV, given a hash.
function fnv_1a_b(a){
  a += (a << 1) + (a << 4) + (a << 7) + (a << 8) + (a << 24);
  return a & 0xffffffff;
}

// See http://willwhim.wordpress.com/2011/09/03/producing-n-hash-functions-by-hashing-only-once/
BloomFilter.prototype.locations = function(v){
  var k = this.k;
  var m = this.m;
  var r = [];
  var a = fnv_1a(v);
  var b = fnv_1a_b(a);
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
