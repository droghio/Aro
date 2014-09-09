(function() {
  
//
// John Drogo
// Aro Base
//
// Version 0.0.1a
;
  var Test;

  Test = (function() {
    function Test(name) {
      this.name = name;
    }

    Test.prototype.name = function() {
      return console.log("My name is " + this.name + ".");
    };

    return Test;

  })();

}).call(this);
