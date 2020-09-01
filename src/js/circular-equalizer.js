function CircularEqualizer(){
    /*
        Define the ID of your visualization. This is used to apply
        visualizations to songs, playlists, and default. It is a JSON
        key so make sure you use `_`
    */
    this.id = 'circular_equalizer';

    /*
        Define a clean name for your visualization.
    */
    this.name = 'Circular Equalizer';

    /*
        Initialize the container. This will get set to the element passed in
        when you start the visualization.
    */
    this.container = '';

    /*
        Define any settings that your visualization will need. This is JSON so
        make sure it's clearly defined and standards are followed. These should be
        able to be overwritten by the user when they pass in their preferences.
    */
    this.preferences = {
        barWidth:2,
        barHeight:2,
        barSpacing:5,
        barColor:'#ffffff',
        shadowColor:'#ffffff',
        shadowBlur:10,
    };

    /*
        Initialize the analyser for the visualization. This will be set when the
        visualization is started.
    */
    this.analyser = '';

    this.frequencyData = [];
    this.canvas = null;
    this.canvasCtx = null;
    this.gradient = null;

    /*
        Returns the ID of the visualization. Do not overwrite this, this is necessary
        for registering the visualization.
    */
    this.getID = function(){
        return this.id;
    };

    /*
        Returns the name of the visualization.
    */
    this.getName = function(){
        return this.name;
    };

    /*
        Merge the user defined preferences with the preferences for the visualization.
    */
    this.setPreferences = function( userPreferences ){
        for( var key in this.preferences ){
            if( userPreferences[ key ] != undefined) {
                this.preferences[key] = userPreferences[key];
            }
        }
    };

    /*
        Start the visualization. Do not over write this. This is how the visualization
        gets kicked into gear. The element passed in is the container element where you
        will insert canvas' or whatever works.
    */
    this.startVisualization = function( element ){
        this.analyser = Amplitude.getAnalyser();

        this.container = element;

        /*
            Your code here
        */
        window.cont = this.container;
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;

        this.container.appendChild(this.canvas);

        this.canvasCtx = this.canvas.getContext('2d');
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        this.gradient = this.canvasCtx.createLinearGradient(0, 0, 0, 400);
        this.gradient.addColorStop(0, this.preferences.barColor);
        this.gradient.addColorStop(1, 'orange');

        this.canvasCtx.fillStyle = this.gradient;
        this.canvasCtx.shadowBlur = this.preferences.shadowBlur;
        this.canvasCtx.shadowColor = this.preferences.shadowColor;


        requestAnimationFrame(this.renderFrame.bind(this));
    };

    /*
        Stop the visualization. Do not over write this. This gets called when the
        visualization is stopped so there's no infinite loops in memory. You should
        clear all animation frames and all timed callbacks here.

        This will clear the container as well so when the visualization starts again
        it can be different than before if needed.
    */
    this.stopVisualization = function(){
        this.container.innerHTML = '';
        window.cancelAnimationFrame( this.renderFrame.bind(this) );
    };

    this.renderFrame = function () {
        requestAnimationFrame(this.renderFrame.bind(this));
        this.analyser.getByteFrequencyData(this.frequencyData);
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        var cx = this.canvas.width / 2,
            cy = this.canvas.height / 2,
            radius = cx - 27,
            maxBarNum = Math.floor((radius * 2 * Math.PI) / (this.preferences.barWidth + this.preferences.barSpacing)),
            slicedPercent = Math.floor((maxBarNum * 25) / 100),
            barNum = maxBarNum - slicedPercent,
            freqJump = Math.floor(this.frequencyData.length / maxBarNum);

        for (var i = 0; i < barNum; i++) {
            var amplitude = this.frequencyData[i * freqJump];
            var alfa = (i * 2 * Math.PI ) / maxBarNum + Math.PI;
            var beta = (3 * 45 - this.preferences.barWidth) * Math.PI / 180;
            var x = 0;
            var y = radius - (amplitude / 12 - this.preferences.barHeight);
            var w = this.preferences.barWidth;
            var h = amplitude / 6 + this.preferences.barHeight;

            this.canvasCtx.save();
            this.canvasCtx.translate(cx, cy);
            this.canvasCtx.rotate(alfa - beta);
            this.canvasCtx.fillRect(x, y, w, h);
            this.canvasCtx.restore();
        }
    };
}