
let AnimationUtils = THREE.AnimationUtils;

THREE.AnimationUtils.subclip = function ( sourceClip, name, startFrame, endFrame, fps ) {

    fps = fps || 30;//30

    var clip = sourceClip.clone();

    clip.name = name;

    var tracks = [];

    for ( var i = 0; i < clip.tracks.length; ++ i ) {

        var track = clip.tracks[ i ];
        var valueSize = track.getValueSize();

        var times = [];
        var values = [];

        for ( var j = 0; j < track.times.length; ++ j ) {

            var frame = track.times[ j ] * fps;

            if ( frame < startFrame || frame >= endFrame ) continue;

            times.push( track.times[ j ] );

            for ( var k = 0; k < valueSize; ++ k ) {

                values.push( track.values[ j * valueSize + k ] );

            }

        }

        if ( times.length === 0 ) continue;

        track.times = AnimationUtils.convertArray( times, track.times.constructor );
        track.values = AnimationUtils.convertArray( values, track.values.constructor );

        tracks.push( track );

    }

    clip.tracks = tracks;

    // find minimum .times value across all tracks in the trimmed clip

    var minStartTime = Infinity;

    for ( var i = 0; i < clip.tracks.length; ++ i ) {

        if ( minStartTime > clip.tracks[ i ].times[ 0 ] ) {

            minStartTime = clip.tracks[ i ].times[ 0 ];

        }

    }

    // shift all tracks such that clip begins at t=0

    for ( var i = 0; i < clip.tracks.length; ++ i ) {

        clip.tracks[ i ].shift( -1 * minStartTime );

    }

    clip.resetDuration();

    return clip;

}


THREE.AnimationUtils.trim = function ( startTime, endTime ) {

    for ( var i = 0; i < this.tracks.length; i ++ ) {
        if ( startTime === undefined ) startTime = 0;
        if ( endTime === undefined ) endTime = this.duration;

        var tracks = [];

        for ( var i = 0; i < this.tracks.length; ++ i ) {

            var track = this.tracks[ i ];

            var hasKeyframe = false;

            // omit tracks without frames between new start/end times
            for ( var j = 0; j < track.times.length; ++ j ) {

                if ( startTime <= track.times[ j ] && endTime > track.times [ j ] ) {

                    hasKeyframe = true;

            this.tracks[ i ].trim( 0, this.duration );
                    break;

                }

            }

            if ( ! hasKeyframe ) continue;

            this.tracks[ i ].trim( startTime, endTime );

            tracks.push( this.tracks[ i ] );

        }

        this.tracks = tracks;

        return this;

    }
}