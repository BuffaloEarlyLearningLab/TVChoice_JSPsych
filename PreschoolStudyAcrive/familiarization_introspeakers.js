document.addEventListener('DOMContentLoaded', function() {
    var jsPsychInstance = initJsPsych({
		on_trial_start: function() {
			var id = jatos.urlQueryParameters.id;
			console.log(id);
			jsPsychInstance.data.addProperties({id: id});
			jatos.studySessionData.id = id;
		},
        override_safe_mode: true
    });
    var timeline = [];

    // Array of speaker image file paths and corresponding audio file paths
    var speakers = [
        { image: 'components/icons/Picture1.jpg', audio: 'components/audio_files/F1_hi_nice2meet_ar.wav' },
        { image: 'components/icons/Picture2.jpg', audio: 'components/audio_files/F2_hi_nice2meet_bs.wav' },
        { image: 'components/icons/Picture3.jpg', audio: 'components/audio_files/F3_hi_nice2meet_ml.wav' },
        { image: 'components/icons/Picture4.jpg', audio: 'components/audio_files/F4_hi_nice2meet_wa.wav' },
        { image: 'components/icons/Picture5.jpg', audio: 'components/audio_files/M1_hi_nice2meet_dv.wav' },
        { image: 'components/icons/Picture6.jpg', audio: 'components/audio_files/M2_hi_nice2meet_tj.wav' },
        { image: 'components/icons/Picture7.jpg', audio: 'components/audio_files/M3_hi_nice2meet_jl.wav' },
        { image: 'components/icons/Picture8.jpg', audio: 'components/audio_files/M4_hi_nice2meet_kg.wav' }
    ];

    var indices = speakers.map((_, i) => i);

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // Shuffling the indices
    shuffleArray(indices);

    indices.forEach(function(index) {
        var speaker = speakers[index];
        // Trial for displaying speakers:
        var speaker_display_trial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                var html = '<div class="container">';
                html += '<div class="speakers">';

                speakers.forEach(function(sp, spIndex) {
                    html += `<img id="speaker_${spIndex}" class="speaker${spIndex === index ? ' active-speaker' : ''}" src="${sp.image}" alt="Speaker ${spIndex + 1}">`;
                });

                html += '</div>';
                html += '<div class="center-image"><img src="components/pictures/wave.jpg" alt="Wave"></div>';
                html += '</div>';

                return html;
            },
            choices: "NO_KEYS",
            on_load: function() {
                document.getElementById(`speaker_${index}`).addEventListener('click', function() {
					jsPsychInstance.nextTrial();
                });
			}
        };
        timeline.push(speaker_display_trial);

        var speaker_audio_trial = {
            type: jsPsychAudioKeyboardResponse,
            stimulus: speaker.audio,
            choices: "NO_KEYS",
            trial_ends_after_audio: true,
			on_finish: function() {
				//jsPsychInstance.data.addProperties({sona_id: jatos.studySessionData.sona_id, "selected": speaker.audio, "trial": index})
				var resultData = {"id": jatos.studySessionData.id, "selected": speaker.audio, "trial": index}
				//var resultData =  jsPsychInstance.data.get().csv();
				//var resultDataStr = JSON.stringify(resultData);
				jatos.appendResultData(resultData);
			}
        };
        timeline.push(speaker_audio_trial);
    
        var iti_trial = {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                var html = '<div class="container">';
                html += '<div class="speakers">';

                speakers.forEach(function(sp, spIndex) {
                    html += `<img class="speaker${spIndex === index ? ' active-speaker' : ''}" src="${sp.image}" alt="Speaker ${spIndex + 1}">`;
                });

                html += '</div>';
                html += '<div class="center-image"><img src="components/pictures/wave.jpg" alt="Wave"></div>';
                html += '</div>';
                return html;
            },
            choices: "NO_KEYS",
            trial_duration: 2000, // 2 seconds delay - Adjust delay here
        };
        timeline.push(iti_trial);
    });

    var redirect_trial = {
        type: jsPsychHtmlKeyboardResponse,
        stimulus: '<p>Redirecting to the next part of the experiment...</p>',
        choices: "NO_KEYS",
        trial_duration: 2000,
        on_finish: function() {
            jatos.startNextComponent();
        }
    };
    timeline.push(redirect_trial);

	jatos.onLoad(function() {
		subjectID = jatos.studyResultId;
		jsPsychInstance.run(timeline);
	});

});