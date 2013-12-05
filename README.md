module
======

Very simple module loader/dependency handler

Examples:

some-module1.js:
```javascript
Module.define(function() {

  return {
    someFuncFromSomeModule1 : function() {
      ...
    }
  }

})
```

some-module2.js:
```javascript
Module.define('some-module1.js', function(someModule) {

  return {
    someFuncFromSomeModule2 : function() {
      someModule.someFuncFromSomeModule1();
    }
  }

})
```

main.js
```javascript
Module.load('some-module2', function(someModule) {
  someModule.someFuncFromSomeModule2();
})
```
