document.addEventListener('DOMContentLoaded', function() {
    // Generate a participant ID based on the timestamp and stores it in local storage for use in later scripts
    //let participantId = `Participant_${new Date().getTime()}`;
    //localStorage.setItem('sona_id', sona_id);
    document.getElementById('selection-counter').style.display = 'block';
	
	
    var jsPsychInstance = initJsPsych({
		on_trial_start: function() {
			var id = jatos.urlQueryParameters.id;
			console.log(id);
			jsPsychInstance.data.addProperties({id: id});
			jatos.studySessionData.id = id;
		},
        override_safe_mode: true
    });

    // Define the paths for speaker images to be used in the experiment
    var speakerImages = [
        'components/icons/Picture1.jpg',
        'components/icons/Picture2.jpg',
        'components/icons/Picture3.jpg',
        'components/icons/Picture4.jpg',
        'components/icons/Picture5.jpg',
        'components/icons/Picture6.jpg',
        'components/icons/Picture7.jpg',
        'components/icons/Picture8.jpg',
    ];

    var centralImageData = [
        {
            image: 'components/pictures/ball.jpg',
            audioFiles: [
                'components/audio_files/F1_ball_3_ar.wav',
                'components/audio_files/F2_ball_1_bs.wav',
                'components/audio_files/F3_ball_3_ml.wav',
                'components/audio_files/F4_ball_2_wa.wav',
                'components/audio_files/M1_ball_3_dv.wav',
                'components/audio_files/M2_ball_2_tj.wav',
                'components/audio_files/M3_ball_2_jl.wav',
                'components/audio_files/M4_ball_1_kg.wav'
            ]
        },
        {
            image: 'components/pictures/apple.jpg',
            audioFiles: [
                'components/audio_files/F1_apple_1_ar.wav',
                'components/audio_files/F2_apple_1_bs.wav',
                'components/audio_files/F3_apple_2_ml.wav',
				'components/audio_files/F4_apple_2_wa.wav',
                'components/audio_files/M1_apple_1_dv.wav',
                'components/audio_files/M2_apple_1_tj.wav',
                'components/audio_files/M3_apple_1_jl.wav',
                'components/audio_files/M4_apple_1_kg.wav'
            ]
        },
    ];

	var full_design = jsPsychInstance.randomization.repeat(centralImageData, 1);
	

    var timeline = [];
    var totalSelectionCount = 0; // Counter for the total number of selections made
    var selectionCount = 0; // Counter for selections in the current trial

    // Creates a trial where participants can select a speaker after the audio clip
    function createSpeakerSelectionTrial(centralImage, audioFiles, trialIndex) {
        return {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                // similar to familiarization.js code where we generated HTML content
                var selectionCounterHTML = `<div id='selection-counter' class='selection-counter'>Selections: ${selectionCount}</div>`;
    
                var html = '<div class="container">';
                html += '<div class="speakers">';
    
                speakerImages.forEach(function(spImage, spIndex) {
                    html += `<img id="speaker_${spIndex}" class="speaker" src="${spImage}" alt="Speaker ${spIndex + 1}" onclick="window.playAudio('${audioFiles[spIndex]}', ${spIndex}, updateSelectionCounter)">`;
                });
    
                html += '</div>';
                html += `<div class="center-image"><img src="${centralImage}" alt="Central Image"></div>`;
                html += '</div>';
    
                return selectionCounterHTML + html;
            },
            choices: "NO_KEYS",
            on_load: function() {
                // Resetting the selection count when the trial loads
                selectionCount = 0;
            }
        };
    }

    // Flag to control click interactions, mainly to prevent double selections
    var acceptClicks = true;

    // Function to update the selection counter display
    window.updateSelectionCounter = function() {
        var counterElement = document.getElementById('selection-counter');
        if (counterElement) {
            counterElement.textContent = `Selections: ${selectionCount}`;
        }
    };
    
    // Function to handle audio playback and selection logging
    window.playAudio = function(audioFile, speakerIndex) {
        if (!acceptClicks) return; // Ignoring clicks if not accepting clicks

        document.querySelectorAll('.speaker').forEach(function(elem) {
            elem.classList.remove('active-speaker');
        }); 

        selectionCount++;
        totalSelectionCount++;
        updateSelectionCounter();
		
		//jsPsychInstance.data.addProperties({sona_id: jatos.studySessionData.sona_id, selected: audioFile, speaker: speakerIndex, count: selectionCount});
		var resultData = {"id": jatos.studySessionData.id, "selected": audioFile, "speaker": speakerIndex, "count": selectionCount}
		//var resultData = jsPsychInstance.data.get().json();
		//jatos.appendResultData(JSON.stringify(resultData) + ",");
		jatos.appendResultData(resultData);

        //sendSelectionData(audioFile, speakerIndex);

        var audio = new Audio(audioFile);
        audio.play(
			acceptClicks=false
		);

        var speakerImg = document.getElementById(`speaker_${speakerIndex}`);
        if (speakerImg) {
            speakerImg.classList.add('active-speaker');
        }

        audio.onended = function() {
            if (speakerImg) {
                setTimeout(function() {
                    speakerImg.classList.remove('active-speaker');
					acceptClicks = true;;
                }, 1500); // syrchronised - don't change!
            }

            if (selectionCount % 8 === 0) {
                acceptClicks = false; // Disabling clicks during the delay
                setTimeout(function() {
                    proceedToNextImage();
                    acceptClicks = true; // Re-enabling clicks after the delay
                }, 1300); // synchronised with above delay! - don't change
            } else {
                proceedToNextImage();
            }
        };

        function proceedToNextImage() {
            if (totalSelectionCount >= 16) {
                //window.location.href = 'test_phase.html';
				jatos.startNextComponent();
            } else {
                if (selectionCount >= 8) {
                    selectionCount = 0;
                    jsPsychInstance.nextTrial();
                }
            }
        }
    };

    // ppopulates timeline with trials based on the centralImageData
    full_design.forEach(function(data, index) {
        timeline.push(createSpeakerSelectionTrial(data.image, data.audioFiles));
    });
    
	jatos.onLoad(function() {
		subjectID = jatos.studyResultId;
		jsPsychInstance.run(timeline);
	});
  
});