(function(P, H){

    var footer    = document.body.querySelector('#footer'),
        leftWall  = document.body.querySelector('#leftWall'),
        rightWall = document.body.querySelector('#rightWall'),
        topWall   = document.body.querySelector('#topWall'),
        bubbles      = document.body.querySelectorAll('.bubbles'),
        px        = 'px';

    function animateXY(bubble, initialVerticalSpeed, horizontalSpeed, moment){
        var bubbleStats = bubble.getBoundingClientRect(),
            start    = null;

        if ( moment && moment === 'right' ) {
            horizontalSpeed = Math.abs(horizontalSpeed) || Math.abs(P.initialHorizontalSpeed());
        } else if ( moment && moment === 'left' ) {
            horizontalSpeed = ( -Math.abs(horizontalSpeed) ) || ( -Math.abs(P.initialHorizontalSpeed()) );
        } else if ( moment && typeof moment !== 'string') {
            throw new TypeError('moment argument must be a string of either "left" or "right".')
        }

        function calculatePos(time){
            return [
                ( bubbleStats.left + P.horizontalDistance(horizontalSpeed, time) ),
                ( bubbleStats.top  + P.verticalDistance(initialVerticalSpeed, time) )
            ]
        }

        function step(HRTimeStamp){
            if (!start) { start = HRTimeStamp; }
            var time = HRTimeStamp - start,
                position = calculatePos(time),
                x = position[0],
                y = position[1];

            bubble.style.top = y + px;
            bubble.style.left = x + px;


            if (
                !H.isCollide(bubble, footer) &&
                !H.isCollide(bubble, leftWall) &&
                !H.isCollide(bubble, rightWall) &&
                !H.isCollide(bubble, topWall)
            ) {
                window.requestAnimationFrame(step);
            } else if ( H.isCollide(bubble, footer )) {
                bubble.style.top = y - 5 + px;
                animateXY(bubble, -P.initialVerticalSpeed((bubble.clientHeight)), horizontalSpeed);
            } else if ( H.isCollide(bubble, leftWall) ){
                bubble.style.left = leftWall.clientWidth + 5 + px;
                animateXY(bubble, 0, horizontalSpeed, 'right');
            } else if ( H.isCollide(bubble, rightWall) ){
                bubble.style.left = (rightWall.offsetLeft - bubble.clientWidth) - 5 + px;
                animateXY(bubble, 0, horizontalSpeed, 'left');
            } else if ( H.isCollide(bubble, topWall)  ) {
                bubble.style.top = y + 5 + px;
                animateXY(bubble, 0, horizontalSpeed);
            }

        }

        window.requestAnimationFrame(step);
    }

    function decideMoment(el){
        if ( el.offsetLeft > ((Math.max(document.documentElement.clientWidth, window.innerWidth || 0)) / 2 )) {
            return 'left';
        } else {
            return 'right'
        }
    }

    for (var i = 0; i < bubbles.length; i ++) {
        bubbles[i].onclick = function() {
            animateXY(this, -P.initialVerticalSpeed((this.clientHeight)), P.initialHorizontalSpeed(this.clientHeight), decideMoment(this));
        };
    }



}(physics, helper));