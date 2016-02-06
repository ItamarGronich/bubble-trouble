/**
 * Underdash library module.
 *
 * use the underscore symbol ( '_' ) to use library methods.  e.g. - <code>_.shuffle();</code>
 * @type      {{removeDuplicates(), flatten, shuffle}}
 * @private  - <_.flatten>, <_.removeDuplicates> and <_.shuffle>
 */
var Underdash = function () {
    'use strict';

    /**
     * @module UTILS - Utilities module
     *                 has basic utility methods
     * @type {{flatten, shuffle, rd}}
     *
     * @API - UTILS.
     */

    var UTILS = function () {

        function flatten(arr, shallow) {
            /* this is the exit condition:
             * if every element in the array is not an array then return the array.
             * in other words if there are no sub-arrays in the master array return the master array.
             * */
            if (arr.every(function (e) {
                return !Array.isArray(e);
            })) {
                return arr;
            } else {
                var newArr = [];
                for (var i = 0; i < arr.length; i++) {
                    if (Array.isArray(arr[i])) {
                        for (var j = 0; j < arr[i].length; j++) {
                            newArr.push(arr[i][j]);
                        }
                    } else {
                        newArr.push(arr[i]);
                    }
                }
                if (!shallow) {
                    return flatten(newArr);
                }
            }
        }

        function removeDuplicates(arr) {
            var newObj = {},
                newArr = [];
            for (var i = 0; i < arr.length; i++) {
                newObj[arr[i]] = arr[i];
            }
            for (var key in newObj) {
                newArr.push(newObj[key]);
            }
            return newArr;
        }

        function shuffle(arr) {
            // Your code here
            for (var i = 0; i < arr.length; i++) {
                var randIndex = Math.round(Math.random() * (arr.length - 1)),
                    current = arr[i],
                    random = arr[randIndex];
                if (current !== random) {
                    arr[i] = random;
                    arr[randIndex] = current;
                }
            }
            return arr;
        }

        /*======================================
        * Object Oriented methods
        * =======================================*/

        function firstKey(obj) {
            var key = Object.keys(obj)[0];
            if (!key) {
                return -1;
            }
            return key;
        }

        function lastKey(obj) {
            var arr = Object.keys(obj),
                pos = arr.length - 1;
            if (pos > -1) {
                return arr[pos];
            } else {
                return -1;
            }
        }

        function values(obj) {
            var arr = [];
            for (var key in obj) {
                arr.push(obj[key]);
            }
            return arr;
        }

        return {
            flatten: flatten,
            shuffle: shuffle,
            rd: removeDuplicates,
            firstKey: firstKey,
            lastKey: lastKey,
            values: values
        };
    }();

    /**
     * @module Event Bus  - central event bus using a PUB/SUB architecture.
     *
     * @API :
     *      *@method on   - subscribe to event .adds an event listener with a callback function and a user
     *          @see on.
     *
     *      *@method off  - unsubscribe from event .removes event listener. provide type and callback / user
     *          @see off.
     *
     *      *@metohd emit - Publish event. emits the event. arguments by either type / type + user
     *          @see emit.
     *
     * @type {{BusEvent, on, off, emit, events}} <== all functions run in the module
     */
    var eventBus = function () {

        /**
         * @Object - the events object will hold all events and their listeners and handlers
         *
         * structure is events >
         *                  type1: >
         *                          [
         *
         *                          {user1 : callback},
         *                          {user2 : callback}
         *                          ....
         *
         *                          ]
         *                   type2: >
         *                          [
         *
         *                          {user1 : callback},
         *                          {user2 : callback}
         *                          ....
         *
         *                          ]
         *
         */
        var events = {};

        // error handler function. checks if the 'type' argument was specified correctly
        function ifNoType(type) {
            if (!type) {
                throw new Error('first argument: "type" missing.');
            }

            if (typeof type !== 'string') {
                throw new TypeError('"type" argument must be a string');
            }
        }

        /**
         * @constructor BusEvent constructor function.
         *
         *              Is used for constructing BusEvent objects to fire with
         *              dispatch
         * @param type      - a string containing the name of the desired event
         * @param options   - an Object containing desired customisable properties to set on event.
         * @prototype  {{getType, getTimeStamp, getTarget, setDetail, getDetail}}
         * @see getType
         * @see getTimeStamp
         * @see getTarget
         * @see getDetail
         * @see setDetail
         */
        function BusEvent(type, options) {

            ifNoType(type);

            if (options && typeof options !== 'object') {
                throw new TypeError('second argument - "options" - must be an object');
            }

            this.type = type;

            this.detail = null;

            this.target = null;

            this.timeStamp = Date.now();

            if (options !== null && typeof options === 'object') {
                for (var key in options) {
                    if (key === 'detail' && (typeof options.detail !== 'object' || options.detail === null)) {
                        throw new TypeError('details key in options must be an object');
                    }
                    this[key] = options[key];
                }
            }
        }

        BusEvent.prototype.getType = function () {
            return this.type;
        };
        BusEvent.prototype.getTimeStamp = function () {
            return this.timeStamp;
        };
        BusEvent.prototype.getTarget = function () {
            return this.target;
        };
        BusEvent.prototype.setDetail = function (key, value) {
            if (this.detail === null || typeof this.detail !== 'object') {
                this.detail = {};
            }

            if (!key || !value || typeof key !== 'string' || typeof value !== 'string') {
                throw new TypeError('setDetail must have two arguments, a key and a value. both must be strings');
            }
            this.detail[key] = value;
        };
        BusEvent.prototype.getDetail = function () {
            return this.detail;
        };

        /**
         * @method on - subscribe to event.
         *
         * @param type     - *Required* a sting with the name of the desired event to listen to
         * @param callback - *Required* a function to deploy once event is fired
         * @param user     - *Required* a string containing the name of the module
         */
        function on(type, callback, user) {

            ifNoType(type);

            if (!callback || typeof callback !== 'function') {
                throw new TypeError('callback isn\'t specified or is not a function');
            }

            if (!user) {
                throw new TypeError('user argument isn\'t specified or is not a truthy value');
            }

            var handlerObj = {};
            handlerObj[user] = callback;

            events[type] = events[type] || [];
            events[type].push(handlerObj);
        }

        /**
         * @method Unsubscribe - this method unsubscribes a single handler function, a full user
         *                       or a whole event depending on the arguments provided:
         *
         *                       @param circle === 'function'- if circle is a function then off(); removes only the
         *                                                     provided function from the listeners array
        *                                @param circle === 'string'  - if circle is a string then off(); removes all the
         *                                                     listeners that have the specified user
         *                                                     from the listeners array
        *                                @param all === true         - if all is a truthy value, off will remove entire event
         *                                                     from the events bank.
         *
         * @param type - Required! can only be a string
         * @param circle - can be one of the following:
         *                 *@type function - the callback function you wish to remove
         *
         *                 *@type string   - a string reprisenting the name of the user
         *                                   you wish to unsubscribe
         * @param all optional if is a true value then removes entire event from the event bank
         * @returns {number} the new legnth of the modified callback array
         */
        function off(type, circle, all) {
            var callback, user, arr;

            ifNoType(type);

            if (all) {
                delete events[type];
                return;
            }

            if (typeof circle === 'function') {
                callback = circle;
            } else if (typeof circle === 'string') {
                user = circle;
            } else {
                throw new TypeError('second argument must either be a user string stating the name of the listener module or a callback function');
            }

            if (!circle) {
                throw new TypeError('Both callback and user are missing. Must specify either one as the second argument.');
            }

            arr = events[type];
            for (var i = arr.length - 1; i >= 0; i--) {
                if (user) {
                    if (Object.keys(arr[i])[0] === user) {
                        arr.splice(i, 1);
                    }
                } else {
                    if (arr[i][Object.keys(arr[i])[0]] === callback) {
                        arr.splice(i, 1);
                    }
                }
            }

            return events[type].length;
        }

        /**
         * @method Publish - if no user specified fires all handlers under the event.
         *                   if user specified fires all handlers of the specified event
         *                   that can be associated with the specified user.
         * @param event - a BusEvent object. created with the BusEvent constructor.
         * @param user  - a string representing the user that it's handlers should be fired.
         */
        function emit(event, user) {

            if (!event) {
                throw new TypeError('event argument missing. must be a BusEvent object');
            }

            if (!(event instanceof BusEvent)) {
                throw new TypeError('event must be of type BusEvent object use BusEvent to construct such object.');
            }

            if (user && typeof user !== 'string') {
                throw new TypeError('user argument must be a string containing the module name');
            }

            var callbackArr = events[event.type];

            callbackArr.forEach(function (el) {
                if (user) {
                    if (el.hasOwnProperty(user)) {
                        el[user](event);
                    }
                } else {
                    el[Object.keys(el)[0]](event);
                }
            });
        }

        return {
            BusEvent: BusEvent,
            on: on,
            off: off,
            emit: emit,
            events: events
        };
    }();

    function promisify(cb, args) {
        var promise, resolveFn, rejectFn;

        if (!cb || cb && typeof cb !== 'function') {
            throw new TypeError('first argument "callback" is missing or it is not of function type');
        }

        if (!args || args && Array.isArray(args)) {
            throw new TypeError('second argument "args" is missing or it is not an array');
        }

        promise = new Promise(function (resolve, reject) {
            resolveFn = resolve;
            rejectFn = reject;
        });

        promise.resolve = resolveFn;
        promise.reject = rejectFn;

        cb.apply(promise, args);

        return promise;
    }

    /**==========================================================================
     *                              API
     *  =========================================================================
     * @returns library api methods.
     */
    return {
        rd: UTILS.rd,
        flatten: UTILS.flatten,
        shuffle: UTILS.shuffle,
        eventBus: eventBus,
        on: eventBus.on,
        off: eventBus.off,
        emit: eventBus.emit,
        BusEvent: eventBus.BusEvent,
        events: eventBus.events
    };
}();

var _ = Underdash;

//# sourceMappingURL=Underdash-compiled.js.map

//# sourceMappingURL=Underdash-compiled-compiled.js.map