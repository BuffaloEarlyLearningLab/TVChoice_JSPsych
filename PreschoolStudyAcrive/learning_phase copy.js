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
            image: 'components/pictures/coodle.jpg',
            audioFiles: [
                'components/audio_files/F1_coodle_1_ar.wav',
                'components/audio_files/F2_coodle_1_bs.wav',
                'components/audio_files/F3_coodle_2_ml.wav',
                'components/audio_files/F4_coodle_1_wa.wav',
                'components/audio_files/M1_coodle_1_dv.wav',
                'components/audio_files/M2_coodle_1_tj.wav',
                'components/audio_files/M3_coodle_2_jl.wav',
                'components/audio_files/M4_coodle_2_kg.wav'
            ]
        },
        {
            image: 'components/pictures/gasser.jpg',
            audioFiles: [
                'components/audio_files/F1_gasser_2_ar.wav',
                'components/audio_files/F2_gasser_3_bs.wav',
                'components/audio_files/F3_gasser_1_ml.wav',
				'components/audio_files/F4_gasser_1_wa.wav',
                'components/audio_files/M1_gasser_1_dv.wav',
                'components/audio_files/M2_gasser_1_tj.wav',
                'components/audio_files/M3_gasser_3_jl.wav',
                'components/audio_files/M4_gasser_3_kg.wav'
            ]
        },
        {
            image: 'components/pictures/bosa.jpg',
            audioFiles: [
                'components/audio_files/F1_bosa_2_ar.wav',
                'components/audio_files/F2_bosa_1_bs.wav',
                'components/audio_files/F3_bosa_1_ml.wav',
                'components/audio_files/F4_bosa_2_wa.wav',
                'components/audio_files/M1_bosa_2_dv.wav',
                'components/audio_files/M2_bosa_3_tj.wav',
                'components/audio_files/M3_bosa_1_jl.wav',
                'components/audio_files/M4_bosa_3_kg.wav'
            ]
        },
        {
            image: 'components/pictures/blicket.jpg',
            audioFiles: [
                'components/audio_files/F1_blicket_1_ar.wav',
                'components/audio_files/F2_blicket_3_bs.wav',
                'components/audio_files/F3_blicket_3_ml.wav',
                'components/audio_files/F4_blicket_1_wa.wav',
                'components/audio_files/M1_blicket_1_dv.wav',
                'components/audio_files/M2_blicket_3_tj.wav',
                'components/audio_files/M3_blicket_2_jl.wav',
                'components/audio_files/M4_blicket_3_kg.wav'
            ]
        },
        {
            image: 'components/pictures/kita.jpg',
            audioFiles: [
                'components/audio_files/F1_kita_1_ar.wav',
                'components/audio_files/F2_kita_2_bs.wav',
                'components/audio_files/F3_kita_2_ml.wav',
                'components/audio_files/F4_kita_3_wa.wav',
                'components/audio_files/M1_kita_1_dv.wav',
                'components/audio_files/M2_kita_2_tj.wav',
                'components/audio_files/M3_kita_3_jl.wav',
                'components/audio_files/M4_kita_3_kg.wav'
            ]
        },
        {
            image: 'components/pictures/toma.jpg',
            audioFiles: [
                'components/audio_files/F1_toma_3_ar.wav',
                'components/audio_files/F2_toma_2_bs.wav',
                'components/audio_files/F3_toma_2_ml.wav',
                'components/audio_files/F4_toma_1_wa.wav',
                'components/audio_files/M1_toma_1_dv.wav',
                'components/audio_files/M2_toma_3_tj.wav',
                'components/audio_files/M3_toma_3_jl.wav',
                'components/audio_files/M4_toma_3_kg.wav'
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
                html += '<div id = "speaker" class="speakers">';
    
                speakerImages.forEach(function(spImage, spIndex) {
                    html += `<img id="speaker_${spIndex}" class="speaker" src="${spImage}" alt="Speaker ${spIndex + 1}" onclick="window.playAudio('${audioFiles[spIndex]}', ${spIndex}, updateSelectionCounter)">`;
                });

				var html_image =  '<div id = "image", class="image">';
    
                html+= '</div>';
                html_image += `<div class="center-image"><img src="${centralImage}" alt="Central Image"></div>`;
                html_image += '</div>';
    
                return selectionCounterHTML + html + html_image;
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

        var speakerIcons = document.getElementById('speaker');
        var speakerImg = document.getElementById(`speaker_${speakerIndex}`);
        if (speakerImg) {
            speakerImg.classList.add('active-speaker');
			acceptClicks = false
        };

		var audio = new Audio(audioFile);
		setTimeout(function(){
			speakerIcons.style.visibility = "hidden";
			acceptClicks = false
		}, 500);

		setTimeout(function() {
			audio.play(
				acceptClicks = false
			)
		}, 1000);

        audio.onended = function() {
            if (speakerImg) {
                setTimeout(function() {
                    speakerImg.classList.remove('active-speaker');
                    speakerIcons.style.visibility = "visible";
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
            if (totalSelectionCount >= 48) {
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