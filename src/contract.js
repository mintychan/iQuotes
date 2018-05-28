'use strict';

var QuoteEntry = function (text) {
  if (text) {
    var o = JSON.parse(text);
    this.uuid = o.uuid;
    this.author = o.author;
    this.quote = o.quote;
  } else {
    this.uuid = '';
    this.author = '';
    this.quote = '';    
  }
};

QuoteEntry.prototype = {
  toString: function () {
    return JSON.stringify(this);
  }
};

var QuoteContract = function () {
  LocalContractStorage.defineMapProperty(this, "arrayMap");

  LocalContractStorage.defineProperty(this, "size");

  LocalContractStorage.defineMapProperty(this, "dataMap", {
    parse: function (text) {
      return new QuoteEntry(text);
    },
    stringify: function (o) {
      return o.toString();
    }
  });
};

QuoteContract.prototype = {
  init: function () {
    this.size = 0;
  },

  len:function(){
    return this.size;
  },

  save: function (uuid, author, quote) {
    var quoteEntry = new QuoteEntry();
    quoteEntry.uuid = uuid;
    quoteEntry.author = author || '';
    quoteEntry.quote = quote || '';

    var index = this.size;

    this.arrayMap.set(index, uuid);
    this.dataMap.set(uuid, quoteEntry);
    this.size += 1;
  },

  get: function (uuid = '') {
    uuid = uuid.trim();
    if ( uuid === "" ) {
      throw new Error("empty uuid")
    }
    return this.dataMap.get(uuid);
  },

  forEach: function(limit="300", offset="0"){
    limit = parseInt(limit);
    offset = parseInt(offset);
    if(offset>this.size){
       throw new Error("offset is not valid");
    }
    var number = offset+limit;
    if(number > this.size){
      number = this.size;
    }
    var result  = [];
    for(var i=offset;i<number;i++){
        var key = this.arrayMap.get(i);
        var object = this.dataMap.get(key);
        result.push(object);
    }
    return result;
  }
};

module.exports = QuoteContract;