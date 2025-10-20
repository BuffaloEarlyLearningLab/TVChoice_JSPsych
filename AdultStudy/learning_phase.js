document.addEventListener('DOMContentLoaded', function() {

    fetch('trials.json')
        .then(response => response.json())
        .then(data => {
            const urlParams = new URLSearchParams(window.location.search);
            const identifier = urlParams.get('study') || "2942";
            const trials = data[identifier];

            if (!trials || trials.length === 0) {
                console.error('No trials found', identifier);
                return;
            }


    
    document.getElementById('selection-counter').style.display = 'block';
	
	
    var jsPsychInstance = initJsPsych({
		on_trial_start: function() {
			var id = jatos.urlQueryParameters.id|| "default_id";
			console.log(id);
			jsPsychInstance.data.addProperties({id: id});
			jatos.studySessionData.id = id;
		},
        override_safe_mode: true
    });

    // Define the paths for speaker images to be used in the experiment
    var centralImageData = {
        'karve': {
            image: 'components/pictures/karve.jpg',
            audioFiles: [
                'components/audio_files/F1_karve.wav',
                'components/audio_files/F2_karve.wav',
                'components/audio_files/F3_karve.wav',
                'components/audio_files/F4_karve.wav',
                'components/audio_files/M1_karve.wav',
                'components/audio_files/M2_karve.wav',
                'components/audio_files/M3_karve.wav',
                'components/audio_files/M4_karve.wav'
            ]
        },
        'kiskis': {
            image: 'components/pictures/kiskis.jpg',
            audioFiles: [
                'components/audio_files/F1_kiskis.wav',
                'components/audio_files/F2_kiskis.wav',
                'components/audio_files/F3_kiskis.wav',
                'components/audio_files/F4_kiskis.wav',
                'components/audio_files/M1_kiskis.wav',
                'components/audio_files/M2_kiskis.wav',
                'components/audio_files/M3_kiskis.wav',
                'components/audio_files/M4_kiskis.wav'
            ]
        },
        'knyga': {
            image: 'components/pictures/knyga.jpg',
            audioFiles: [
                'components/audio_files/F1_knyga.wav',
                'components/audio_files/F2_knyga.wav',
                'components/audio_files/F3_knyga.wav',
                'components/audio_files/F4_knyga.wav',
                'components/audio_files/M1_knyga.wav',
                'components/audio_files/M2_knyga.wav',
                'components/audio_files/M3_knyga.wav',
                'components/audio_files/M4_knyga.wav'
            ]
        },
        'meska': {
            image: 'components/pictures/meska.jpg',
            audioFiles: [
                'components/audio_files/F1_meska.wav',
                'components/audio_files/F2_meska.wav',
                'components/audio_files/F3_meska.wav',
                'components/audio_files/F4_meska.wav',
                'components/audio_files/M1_meska.wav',
                'components/audio_files/M2_meska.wav',
                'components/audio_files/M3_meska.wav',
                'components/audio_files/M4_meska.wav'
            ]
        },
        'namas': {
            image: 'components/pictures/namas.jpg',
            audioFiles: [
                'components/audio_files/F1_namas.wav',
                'components/audio_files/F2_namas.wav',
                'components/audio_files/F3_namas.wav',
                'components/audio_files/F4_namas.wav',
                'components/audio_files/M1_namas.wav',
                'components/audio_files/M2_namas.wav',
                'components/audio_files/M3_namas.wav',
                'components/audio_files/M4_namas.wav'
            ]
        },
        'raktas': {
            image: 'components/pictures/raktas.jpg',
            audioFiles: [
                'components/audio_files/F1_raktas.wav',
                'components/audio_files/F2_raktas.wav',
                'components/audio_files/F3_raktas.wav',
                'components/audio_files/F4_raktas.wav',
                'components/audio_files/M1_raktas.wav',
                'components/audio_files/M2_raktas.wav',
                'components/audio_files/M3_raktas.wav',
                'components/audio_files/M4_raktas.wav'
            ]
        },
        'tigras': {
            image: 'components/pictures/tigras.jpg',
            audioFiles: [
                'components/audio_files/F1_tigras.wav',
                'components/audio_files/F2_tigras.wav',
                'components/audio_files/F3_tigras.wav',
                'components/audio_files/F4_tigras.wav',
                'components/audio_files/M1_tigras.wav',
                'components/audio_files/M2_tigras.wav',
                'components/audio_files/M3_tigras.wav',
                'components/audio_files/M4_tigras.wav'
            ]
        },
        'tortas': {
            image: 'components/pictures/tortas.jpg',
            audioFiles: [
                'components/audio_files/F1_tortas.wav',
                'components/audio_files/F2_tortas.wav',
                'components/audio_files/F3_tortas.wav',
                'components/audio_files/F4_tortas.wav',
                'components/audio_files/M1_tortas.wav',
                'components/audio_files/M2_tortas.wav',
                'components/audio_files/M3_tortas.wav',
                'components/audio_files/M4_tortas.wav'
            ]
        },
        'vista': {
            image: 'components/pictures/vista.jpg',
            audioFiles: [
                'components/audio_files/F1_vista.wav',
                'components/audio_files/F2_vista.wav',
                'components/audio_files/F3_vista.wav',
                'components/audio_files/F4_vista.wav',
                'components/audio_files/M1_vista.wav',
                'components/audio_files/M2_vista.wav',
                'components/audio_files/M3_vista.wav',
                'components/audio_files/M4_vista.wav'
            ]
        },
        'voras': {
            image: 'components/pictures/voras.jpg',
            audioFiles: [
                'components/audio_files/F1_voras.wav',
                'components/audio_files/F2_voras.wav',
                'components/audio_files/F3_voras.wav',
                'components/audio_files/F4_voras.wav',
                'components/audio_files/M1_voras.wav',
                'components/audio_files/M2_voras.wav',
                'components/audio_files/M3_voras.wav',
                'components/audio_files/M4_voras.wav'
            ]
        },
        'medis': {
            image: 'components/pictures/medis.jpg',
            audioFiles: [
                'components/audio_files/F1_medis.wav',
                'components/audio_files/F2_medis.wav',
                'components/audio_files/F3_medis.wav',
                'components/audio_files/F4_medis.wav',
                'components/audio_files/M1_medis.wav',
                'components/audio_files/M2_medis.wav',
                'components/audio_files/M3_medis.wav',
                'components/audio_files/M4_medis.wav'
            ]
        }
    };
    
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
    
    
	
    var acceptClicks = true;
    var timeline = [];
    var selectionCount = 0;
    var totalSelectionCount = 0;
    var currentTrialIndex = 0;

    const speakerMap = {
        'F1': 0,
        'F2': 1,
        'F3': 2,
        'F4': 3,
        'M1': 4,
        'M2': 5,
        'M3': 6,
        'M4': 7
    };


    function createSpeakerSelectionTrial(trial) {
        var centralImage = centralImageData[trial.word];

        if (!centralImage) {
            console.error('Central image not found for word:', trial.word);
            return;
        }

        return {
            type: jsPsychHtmlKeyboardResponse,  // Ensure this type is defined
            stimulus: function () {
                var selectionCounterHTML = `<div id='selection-counter' class='selection-counter'>Selections: ${selectionCount}</div>`;
                var html = '<div class="container"><div class="speakers">';
        
                speakerImages.forEach(function (spImage, spIndex) {
                    html += `<img id="speaker_${spIndex}" class="speaker" src="${spImage}" alt="Speaker ${spIndex + 1}" onclick="window.playAudio('${centralImage.audioFiles[spIndex]}', ${spIndex}, '${trial.speaker}')">`;
                });
        
                html += `</div><div class="center-image"><img src="${centralImage.image}" alt="Central Image"></div></div>`;
                return selectionCounterHTML + html;
            },
            choices: "NO_KEYS",
            on_load: function () {
                selectionCount = 0;
        
                // Highlight the expected speaker
                const expectedIndex = speakerMap[trial.speaker];
                const speakerImg = document.getElementById(`speaker_${expectedIndex}`);
                if (speakerImg) {
                    speakerImg.classList.add('active-speaker');
                }
            }
        };
    }

    trials.forEach(function (trial, index) {
        timeline.push(createSpeakerSelectionTrial(trial));
    });

    jatos.onLoad(function () {
        jsPsychInstance.run(timeline);
    });

    // Utility functions for handling selections
    window.updateSelectionCounter = function () {
        var counterElement = document.getElementById('selection-counter');
        if (counterElement) {
            counterElement.textContent = `Selections: ${selectionCount}`;
        }
    };

    window.playAudio = function (audioFile, speakerIndex) {
        if (!acceptClicks) {
            console.log("Clicks are disabled");
            return; // Ignore clicks if not accepting clicks
        }
    
        const expectedSpeaker = trials[currentTrialIndex].speaker;
        const expectedIndex = speakerMap[expectedSpeaker];
        if (speakerIndex !== expectedIndex) {
            console.warn(`Expected ${expectedSpeaker}, but got ${speakerIndex}.`);
            return; // Ignore wrong selections
        }
    
        console.log(`Playing audio: ${audioFile} for speaker index: ${speakerIndex}`);
    
        // Remove active-speaker class from all speakers
        document.querySelectorAll('.speaker').forEach(function (elem) {
            elem.classList.remove('active-speaker');
        });
    
        selectionCount++;
        totalSelectionCount++;
        updateSelectionCounter();
    
        var resultData = { "id": jatos.studySessionData.id, "selected": audioFile, "speaker": speakerIndex, "count": selectionCount };
        jatos.appendResultData(resultData);
    
        var audio = new Audio(audioFile);
        audio.onerror = function () {
            console.error(`Error loading audio file: ${audioFile}`);
        };
        audio.play().catch(error => {
            console.error("Audio playback error: ", error);
        });
    
        var speakerImg = document.getElementById(`speaker_${speakerIndex}`);
        if (speakerImg) {
            speakerImg.classList.add('active-speaker');
        }
    
        audio.onended = function () {
            if (speakerImg) {
                setTimeout(function () {
                    speakerImg.classList.remove('active-speaker');
                    proceedToNextImage(); // Proceed to the next image after the audio ends
                }, 100); // Reduced timeout for a quicker transition
            } else {
                proceedToNextImage(); // Proceed even if there's no speaker image
            }
        };
    

        function proceedToNextImage() {
            currentTrialIndex++;
        
            if (currentTrialIndex >= trials.length) {
                jatos.startNextComponent();
            } else {
                // Check if we need to reset the selection count and move to the next trial
                if (selectionCount >= 8) {
                    selectionCount = 0; // Reset selection count
                    jsPsychInstance.nextTrial(); // Proceed to the next trial
                }
        
                updateCentralImageAndAudio();
            }
        }
        
        function updateCentralImageAndAudio() {
            
            document.querySelectorAll('.speaker').forEach(function (elem) {
                elem.classList.remove('active-speaker');
            });
        
            
            const nextExpectedSpeaker = trials[currentTrialIndex].speaker;
            const nextExpectedIndex = speakerMap[nextExpectedSpeaker];
            const nextSpeakerImg = document.getElementById(`speaker_${nextExpectedIndex}`);
            if (nextSpeakerImg) {
                nextSpeakerImg.classList.add('active-speaker');
            }
        
            // Updating central image and audio files - bug#2
            const currentTrial = trials[currentTrialIndex];
            const centralImage = centralImageData[currentTrial.word];
            if (centralImage) {
                document.querySelector('.center-image img').src = centralImage.image;
        
                // Update the audio sources in the speaker elements
                document.querySelectorAll('.speaker').forEach((speakerImg, spIndex) => {
                    speakerImg.setAttribute('onclick', `window.playAudio('${centralImage.audioFiles[spIndex]}', ${spIndex}, '${currentTrial.speaker}')`);
                });
            } else {
                console.error('Central image not found for word:', currentTrial.word);
            }
        }  
    };
})
.catch(error => console.error('Error in loading JSON file', error));

});