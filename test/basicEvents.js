var basicEvents = require('nodeunit').testCase;

/////helper///////
function setHelper (emitter, test, testName){
  var eventNames = [
    testName, 
    testName + '*', 
    testName + '.ns1', 
    testName + '.ns1.ns2', 
    testName + '.ns2.*'
  ];

  for (var i = 0; i < eventNames.length; i++) {
    emitter.on(eventNames[i], function () { 
        test.ok(true, eventNames[i] + 'has fired');
    });
  }

  return eventNames;
};

module.exports = basicEvents({

  setUp: function (callback) {
    var EventEmitter2;

    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    this.emitter = new EventEmitter2();
    callback();
  },

  tearDown: function (callback) {
    //clean up?
    callback();
  },

  '1. A listener should react to an event when the event is emitted.': function (test) {
    var emitter = this.emitter;

    emitter.on('test1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test1');

    test.expect(1);
    test.done();

  },
  '2. A listener should react with a parameter to an event when the event is emitted.': function (test) {
    var emitter = this.emitter;

    emitter.on('test2', function (event, value1) {
      test.ok(true, 'The event was raised');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
    });
    
    emitter.emit('test2', 1);

    test.expect(2);
    test.done();

  },  
  '3. A listener should react with multiple parameters to an event when the event is emitted.': function (test) {

    var emitter = this.emitter;

    emitter.on('test3', function (event, value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value2 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
      test.ok(typeof value3 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');            
    });

    emitter.emit('test3', 1, 2, 3);

    test.expect(5);
    test.done();

  },
  '4. A listener should react with multiple parameters to an event when the event name multiple times.': function (test) {

    var emitter = this.emitter;

    emitter.on('test4', function (event, value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
      test.ok(value1 === 1 || value1 === 4, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value2 === 2 || value2 === 5, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value3 === 3 || value3 === 6, 'The event was raised with the value `' + value1 + '`.');            
    });

    emitter.emit('test4', 1, 2, 3);
    emitter.emit('test4', 4, 5, 6);

    test.expect(10);
    test.done();

  },
  
  '5. An event can be namespaced.': function (test) {

    var emitter = this.emitter;

    emitter.on('test5.ns1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test5.ns1');

    test.expect(1);
    test.done();

  },
  '6. An event can be namespaced and accept values.': function (test) {

    var emitter = this.emitter;

    emitter.on('test6.ns1', function (event, value1) {
      test.ok(true, 'The event was raised');
      test.ok(typeof value1 !== 'undefined', 'The event was raised with the value `' + value1 + '`.');
    });

    emitter.emit('test6.ns1', 1);

    test.expect(2);
    test.done();    

  },
  '7. A namespaced event can be raised multiple times and accept values.': function (test) {

    var emitter = this.emitter;

     emitter.on('test7.ns1', function (event, value1, value2, value3) {
       test.ok(true, 'The event was raised');
       test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
       test.ok(value1 === 1 || value1 === 4, 'The event was raised with the value `' + value1 + '`.');
       test.ok(value2 === 2 || value2 === 5, 'The event was raised with the value `' + value2 + '`.');
       test.ok(value3 === 3 || value3 === 6, 'The event was raised with the value `' + value3 + '`.');            
     });

     emitter.emit('test7.ns1', 1, 2, 3);
     emitter.emit('test7.ns1', 4, 5, 6);

     test.expect(10);
     test.done();
  },    
  '8. A listener should support wild cards.': function (test) {

    var emitter = this.emitter;

    emitter.on('test8.*', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test8.ns1');

    test.expect(1);
    test.done();

  },
  '9. Emitting an event should support wildcards.': function (test) {

    var emitter = this.emitter;

    emitter.on('test9.ns1', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test9.*');

    test.expect(1);
    test.done();

  },
  '10. A listener should support complex wild cards.': function (test) {
    
    var emitter = this.emitter;

    emitter.on('test10.*.foo', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test10.ns1.foo');

    test.expect(1);
    test.done();    

  },
  '11. Emitting an event should support complex wildcards.': function (test) {

    var emitter = this.emitter;

    emitter.on('test11.ns1.foo', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test11.*.foo');

    test.expect(1);
    test.done();    

  },
  '12. Emitting an event should support complex wildcards multiple times, a valid listener should accept values.': function (test) {
    
    var emitter = this.emitter;

    emitter.on('test12.ns1.ns2', function (event, value1, value2, value3) {
      test.ok(true, 'The event was raised');
      test.ok(arguments.length === 4, 'The event was raised with the correct number of arguments');
      test.ok(value1 === 1 || value1 === 4, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value2 === 2 || value2 === 5, 'The event was raised with the value `' + value1 + '`.');
      test.ok(value3 === 3 || value3 === 6, 'The event was raised with the value `' + value1 + '`.');            
    });

    emitter.emit('test12.*.ns2', 1, 2, 3);
    emitter.emit('test12.*.ns2', 4, 5, 6);

    test.expect(10);
    test.done();
    
  },
  '13. List all the listeners for a particular event.': function(test) {

    var emitter = this.emitter;

    emitter.on('test13', function (event) {
      test.ok(true,'raised one');
    });

    emitter.on('test13', function (event) {
      test.ok(true,'raised two');
    });

    var listeners = emitter.listeners('test13');

    test.ok(listeners.length === 2, 'The event `test13` should have 2 listeners');
    test.expect(1);
    test.done();

  },
   '14. A listener should support total wild card.': function (test) {

    var emitter = this.emitter;

    emitter.on('*', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test14');
    emitter.emit('test14.ns1');
    emitter.emit('test14.ns1.ns2');

    test.expect(1);
    test.done();

  },

  '15. A listener should support complex total wild card.': function (test) {

    var emitter = this.emitter;

    emitter.on('*', function () {
      test.ok(true, 'The event was raised');
    });

    emitter.emit('test15.*');
    emitter.emit('test15.*.ns2')
    emitter.emit('*');

    test.expect(1);
    test.done();

  },
  '16. Should be able to fire with wildcard start.' : function (test) {
    var emitter = this.emitter;

    emitter.on('test16', function () {
      test.ok(true, 'The event test15 was raised');
    });
    emitter.on('test16.ns1', function () {
      test.ok(true, 'The event test15.ns1 was raised');
    });

    emitter.emit('*');
    emitter.emit('*.ns1');

    test.expect(2);
    test.done();
  },
  '17. Should fail if delimiter is used to start or end event name.' : function (test) {
    var emitter = this.emitter;

    //nothing should emit, so here is a all-listener
    emitter.on('*.*.*', function () {
      test.ok(false, 'an event was raised!');
    });
    emitter.on('*.*', function () {
      test.ok(false, 'an event was raised!');
    });
    emitter.on('*', function () {
      console.log(arguments);
      test.ok(false, 'an event was raised!');
    });

    try {
      emitter.on('.ns4', function () {
        test.ok(false, 'The event .ns4 was raised');
      });

      emitter.emit('.ns4');
    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }
    
    try {

      emitter.on('ns4.', function () {
        test.ok(false, 'The event .ns4 was raised');
      });

      emitter.emit('ns4.');
    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }

    try {

      emitter.on('.ns4', function () {
        test.ok(false, 'The event .ns4 was raised');
      });

      emitter.emit('ns4.');
    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }
    
    try {

      emitter.on('.ns4', function () {
        test.ok(false, 'The event .ns4 was raised');
      });

    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }
    
    try {

      emitter.emit('ns4.');

    }
    catch(ex) {
      test.ok(true, 'The event .ns4 was not raised');
    }

    try {
      emitter.emit('some..bad');
    }
    catch (ex) {
      test.ok(true, 'error was raised');
    }

    try {
      emitter.on('some..bad', function () {
        test.ok(false, 'a bad event was raised');
      });
    }
    catch (ex){
      test.ok(true,'error was raised');
    }

    test.expect(7);
    test.done();
  },

  '18. Should provide case sensitive option.' : function (test) {
    var emitter  = this.emitter;

    emitter.on('test18', function () {
      test.ok(false, 'The event test18 was raised');
    });
    emitter.on('test18.ns1', function () {
      test.ok(false, 'The event test18.ns1 was raised');
    });

    emitter.emit('Test18');

    test.expect(0);
    test.done();
  },

  '19. one emit should be able to fire on multiple namespaces.' : function (test) {
    var emitter  = this.emitter;

    emitter.on('test19.*', function () {
        test.ok(true, 'test19.* was raised');
    });
    emitter.on('test19.foo', function () {
        test.ok(true, 'test19.foo was raised');
    });

    emitter.emit('test19.foo');
    test.expect(2);
    test.done();
  },

  '20. should support case insensitivty (complex).' : function (test) {
    if(typeof require !== 'undefined') {
      EventEmitter2 = require('../lib/eventemitter2').EventEmitter2;
    }
    else {
      EventEmitter2 = window.EventEmitter2;
    }

    var emitter = new EventEmitter2({ eventCaseSensitive : false});

    emitter.on('test20', function () {
      test.ok(true, 'The event test18 was raised');
    });
    emitter.on('test20.ns1', function () {
      test.ok(true, 'The event test18.ns1 was raised');
    });
    emitter.on('*.ns1', function () {
      test.ok(true, 'The event *.ns1 was raised');
    });
   emitter.on('*.ns2', function () {
      test.ok(false, 'The event *.ns2 was raised');
    });

    emitter.emit('Test20');
    emitter.emit('TeSt20.nS1');

    test.expect(3);
    test.done();
  },

  '21. should be able to removeListeners' : function (test) {
    var emitter = this.emitter;

    emitter.on('test21', function () {
      test.ok(true, 'test21 raised');
    });
    emitter.on('test21.*', function () {
      test.ok(true, 'test21.* was raised');
    });
    emitter.on('test21.ns1', function () {
      test.ok(true, 'test21.ns1 was raised');
    });
    emitter.on('test21.ns1.ns2', function () {
      test.ok(true, 'test21.ns1 was raised');
    });

    emitter.emit('test21'); //1
    emitter.emit('test21.ns2'); //1
    emitter.emit('test21.ns1'); //2

    var listeners = emitter.listeners('test21');
    test.ok(listeners.length === 1, 'there should be 1 listener');

    emitter.removeListener('test21');
    listeners = emitter.listeners('test21');
    test.ok(!listeners, 'there should be 0 listener (empty array)');

    test.expect(6);
    test.done();
  },

  '22. should be able to remove all listeners' : function (test) {

    var emitter = this.emitter,
        addedEvents = setHelper(emitter, test, 'test22');

    emitter.emit('test22'); //1

    var listeners = emitter.listeners('test22');
    test.ok(listeners.length === 1, 'there should be at a listener'); //1

    emitter.removeAllListeners();

    for (var i = 0; i < addedEvents.length; i++) {
      listeners = emitter.listeners(addedEvents[i]);
      test.ok(listeners.length === 0, 'there shouldn\'t be at a listener');
    }

    test.expect(addedEvents.length + 2);
    test.done();
  },

  '23. should be able to listen on any event' : function (test) {

    var emitter = this.emitter,
        addedEvents = setHelper(emitter, test, 'test23'),
        someData = {
          key : 'hello',
          bar : 'foo',
          'baz' : 5
        };
        fn = function (tag, data) {
          if (tag !== 'addListener') {
            test.equals(tag, 'test23.ns5.ns5', 'emitted tag, and raised tag should match');
            test.equals(someData,data, 'data should be passed up');
            test.ok(true, 'something happened somewhere');
          }
        };

    emitter.onAny(fn);
    emitter.emit('test23.ns5.ns5', someData); //3
    emitter.unAny(fn);
    emitter.emit('test21'); //0
    emitter.onAny(fn);
    emitter.onAny(fn);
    emitter.emit('test23.ns5.ns5', someData); //6
    emitter.unAny();

    test.expect(9);
    test.done();

  },

  '24. should be able to fire once and done' : function (test) {
    var emitter = this.emitter,
        addedEvents = setHelper(emitter,test,'test24');
    
    emitter.once('test24once', function () {
        test.ok(true, 'fired once');
    });

    emitter.emit('test24');
    emitter.emit('test24once');
    emitter.emit('test24once');

    test.expect(2);
    test.done();
  },

  '25. should be able to fire many and done' : function (test) {

    var emitter = this.emitter,
        addedEvents = setHelper(emitter,test,'test25');
    
    emitter.many('test25many', 5, function () {
        test.ok(true, 'test25many pewpew');
    });

    emitter.emit('test25'); //1
    for (var i= 0; i < 5; i++) {
      emitter.emit('test25many'); //1
    }
    emitter.emit('test25many'); //0

    test.expect(6);
    test.done();
  },

  '26. should be able to list all onAny listeners' : function (test) {
    var emitter = this.emitter,
        addedEvents = setHelper(emitter, test, 'test26'),
        fn = function (tag) {
          if (tag !== 'addListener') {
            test.equals(tag, 'test26.ns5.ns5', 'emitted tag, and raised tag should match');
            test.ok(true, 'something happened somewhere');
          }
        };

    emitter.onAny(fn);
    emitter.emit('test26.ns5.ns5'); //2
    var listeners = emitter.listenersAny();
    test.equals(listeners.length, 1, 'should be one any listeners');

    emitter.unAny(fn);
    listeners = emitter.listenersAny();
    test.ok(listeners.length === 0, 'should be no any listeners');

    emitter.onAny(fn);
    emitter.onAny(fn);
    listeners = emitter.listenersAny();
    test.equals(listeners.length, 2, 'should be two any listeners');

    emitter.unAny();
    listeners = emitter.listenersAny();
    test.ok(listeners.length === 0, 'should be no any listeners');

    test.expect(6);
    test.done();
  },

});
