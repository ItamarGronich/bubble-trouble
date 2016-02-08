var physics = (function () {
/*============================================
             physics rules
==============================================*/
    var ratio = 100,
        gravityConst = 9.8 * ratio; // second number is pixel to meter tario and can be tampered with for different results


    /**
     * function to calculate the initial vertical speed for objects depending on their mass.
     *
     * @param size {Number} - the mass of the current object. should be a small integer
     *        staring at 1.
     *
     * @returns {number} - The initial vertical speed
     */
    function initialVerticalSpeed(size){
        var mass = size / 2,
            moment = Math.log(size) + 2;
        if(!mass) {throw new TypeError('mass argument missing')}
        return moment * ratio;
    }

    function initialHorizontalSpeed(size) {
        var speed = Math.min(Math.log(size), 4) * ratio;
        console.log(speed);
        return speed;
    }

    /**
     * function that expresses a high resolution DOM time stamp
     * in seconds rather than milliseconds.
     *
     * @param DOMHighResTimeStamp
     * @returns {number} seconds that have passed from start of animation.
     */
    function seconds(DOMHighResTimeStamp){
        return DOMHighResTimeStamp / 1000;
    }

    /**
     * a simple function that takes a number and returns
     * a square of that number
     * @param n {number}
     * @returns {number}
     */
    function square(n) {
        return n * n;
    }

    /**
     * function that calculates the vertical distance a gravity
     * dependant object should travel from his current position
     *
     * the function is correspondent to the Calculation of
     * distance with constant acceleration formula in basic
     * mechanical  physics :
     *
     * S = V(i)t + 1/2at^2
     *
     * @param initialSpeed - {Number} the speed (vertical) the object is
     *        currently traveling on.
     *
     * @param DOMHighResTimeStamp  - {DOMHighResTimeStamp}
     *        timeStamp generated by the window.requestAnimationFrame();.
     *
     * @returns {number} the vertical distance a gravity dependant
     *          object should travel from his current position
     */
    function verticalDistance(initialSpeed, DOMHighResTimeStamp) {
        var time = seconds(DOMHighResTimeStamp);
        return ( initialSpeed  * time ) + ( (square(time) * gravityConst ) / 2 );
    }

    /**
     * function that calculates the horizontal distance traveled
     * by an object with constant horizontal speed from his
     * current position.
     *
     * The function is correspondent to the Calculation of
     * distance with constant speed formula in basic
     * mechanical  physics :
     *
     * S = vt
     *
     * @param initialSpeed - {Number} the speed (horizontal) the object is
     *        currently traveling on.
     *
     * @param DOMHighResTimeStamp  - {DOMHighResTimeStamp}
     *        timeStamp generated by the window.requestAnimationFrame();.
     *
     * @returns {number} the horizontal speed an object
     *          should travel from his current position.
     */
    function horizontalDistance(initialSpeed, DOMHighResTimeStamp){
        var time = seconds(DOMHighResTimeStamp);
        return  initialSpeed  * time;
    }

    return {
        verticalDistance: verticalDistance,
        horizontalDistance: horizontalDistance,
        initialVerticalSpeed: initialVerticalSpeed,
        initialHorizontalSpeed : initialHorizontalSpeed
    }


})();