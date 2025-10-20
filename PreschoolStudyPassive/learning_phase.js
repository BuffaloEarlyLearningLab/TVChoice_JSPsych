document.addEventListener('DOMContentLoaded', function() {
    // Generate a participant ID based on the timestamp and stores it in local storage for use in later scripts
    //let participantId = `Participant_${new Date().getTime()}`;
    //localStorage.setItem('sona_id', sona_id);

	fetch('preschool_trials.json')
        .then(response => response.json())
        .then(data => {
			//const order = localStorage.getItem("order")
            const order = localStorage.getItem("order")
            console.log("Order retrieved from sessionStorage:", order);

            // Access trials based on the stored 'order' from localStorage
            const trials = data[order];

            if (!trials || trials.length === 0) {
                console.error('No trials found', identifier);
                return;
            }


    document.getElementById('selection-counter').style.display = 'block';
	
	
    var jsPsychInstance = initJsPsych({
		on_trial_start: function() {
			var id = jatos.urlQueryParameters.id;
			console.log(id);
			jsPsychInstance.data.addProperties({id: id});
			jatos.studySessionData.id = id;
			var order_file = jatos.urlQueryParameters.order;
			// console.log("Order received: " + order);
			jsPsychInstance.data.addProperties({order_file: order_file});
			jatos.studySessionData.order_file = order_file;
			var order = sessionStorage.getItem("order")
            // console.log("Order retrieved in learning_phase:", order);
            jsPsychInstance.data.addProperties({order: order});
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

    var centralImageData = {
        'coodle': {
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
        'gasser': {
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
        'bosa': {
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
        'blicket': {
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
        'kita': {
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
        'toma':{
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
        }
	};

	//var full_design = jsPsychInstance.randomization.repeat(centralImageData, 1);
	

    var timeline = [];
    var totalSelectionCount = 0; // Counter for the total number of selections made
    var selectionCount = 0; // Counter for selections in the current trial
	var currentTrialIndex = 0;
	var acceptClicks = true;

	const speakerMap = {
		'F1':0,
		'F2':1,
		"F3":2,
		'F4':3,
		'M1':4,
		'M2':5,
		'M3':6,
		'M4':7
	};

    // Creates a trial where participants can select a speaker after the audio clip
    function createSpeakerSelectionTrial(trial) {
		var centralImage = centralImageData[trial.word];

		if (!centralImage) {
			console.error('Central image not found for word:', trial.word);
            return;
		}

        return {
            type: jsPsychHtmlKeyboardResponse,
            stimulus: function() {
                // similar to familiarization.js code where we generated HTML content
                var selectionCounterHTML = `<div id='selection-counter' class='selection-counter'>Selections: ${selectionCount}</div>`;
    
                var html = '<div class="container">';
                html += '<div id = "speaker" class="speakers">';
    
                speakerImages.forEach(function(spImage, spIndex) {
                    html += `<img id="speaker_${spIndex}" class="speaker" src="${spImage}" alt="Speaker ${spIndex + 1}" onclick="window.playAudio('${centralImage.audioFiles[spIndex]}', ${spIndex}, '${trial.speaker}')">`;
                });

				var html_image = '<div id = "image", class = "image">';

    
                html += '</div>';
                html_image += `<div class="center-image"><img src="${centralImage.image}" alt="Central Image"></div>`;
                html_image += '</div>';
    
                return selectionCounterHTML + html + html_image;
            },
            choices: "NO_KEYS",
            on_load: function() {
                // Resetting the selection count when the trial loads
                selectionCount = 0;

				// highlight the expected speaker
				const expectedIndex = speakerMap[trial.speaker];
                const speakerImg = document.getElementById(`speaker_${expectedIndex}`);
                if (speakerImg) {
                    speakerImg.classList.add('active-speaker');
                }
            }
        };
    }

    // // Function to send the participant's selection data to the XAMPP server
    // function sendSelectionData(audioFile, currentTrialIndex) {

    //     // data about the current selection
    //     const participantId = localStorage.getItem('participantId');
    //     const objectOnScreen = document.querySelector('.center-image img').getAttribute('src');
    //     const filePlayed = audioFile;
    //     const trialIndex = selectionCount;
    //     const data = { participantId, trialIndex, objectOnScreen, filePlayed };
    
    //     // sends data to the server using a POST request and fetch API
    //     fetch('http://localhost:9000/jatos/shaun_version/', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
	// 			'Authorization': "Bearer jap_H5vmt266uxBApln8tgZnrUSBZGXGolUe7f808",
    //         },
    //         body: JSON.stringify(data)
    //     })
    //     .then(response => response.json())
    //     .then(data => console.log('Success:', data))
    //     .catch((error) => console.error('Error:', error));
    // }

	trials.forEach(function (trial, index) {
		timeline.push(createSpeakerSelectionTrial(trial));
	})

	jatos.onload(function () {
		jsPsychInstance.run(timeline)
	})

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
        if (!acceptClicks) {
			console.log("Clicks are disabled");
			return; // Ignoring clicks if not accepting clicks
		} 

		acceptClicks = false;

		const expectedSpeaker =  trials[currentTrialIndex].speaker;
		const expectedIndex = speakerMap[expectedSpeaker];
		if (speakerIndex != expectedIndex) {
			console.warn(`Expected ${expectedSpeaker}, but got ${speakerIndex}.`);
			acceptClicks = false;

			setTimeout(function () {
				acceptClicks = true;
			}, 50);

			return;
		}

		console.log(`Playing audio: ${audioFile} for speaker index: ${speakerIndex}`);

        document.querySelectorAll('.speaker').forEach(function(elem) {
            elem.classList.remove('active-speaker');
        });

        selectionCount++;
        totalSelectionCount++;
        updateSelectionCounter();
		
		//jsPsychInstance.data.addProperties({sona_id: jatos.studySessionData.sona_id, selected: audioFile, speaker: speakerIndex, count: selectionCount});
		var resultData = {"id": jatos.studySessionData.id,  "order_file": jatos.studySessionData.order_file, "selected": audioFile, "speaker": speakerIndex, "count": selectionCount}
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

		audio.onerror = function () {
			console.error(`Error loading audio file: ${audioFile}`);
		};
		//audio.play().catch(error => {
		//	console.error("Audio playback error: ", error);
		//	//acceptClicks = false
		//});

        //audio.play(
		//	acceptClicks = false
		//)//;

        var speakerImg = document.getElementById(`speaker_${speakerIndex}`);
        if (speakerImg) {
            speakerImg.classList.add('active-speaker');
        }

        audio.onended = function() {
            if (speakerImg) {
                setTimeout(function() {
                    speakerImg.classList.remove('active-speaker');
					speakerIcons.style.visibility = "visible";
					acceptClicks = true;;
					proceedToNextImage();
				}, 1500);
			} else {
				proceedToNextImage();
			}
		};

		setTimeout(function () {
			acceptClicks = true;
		}, 2000);

        //     if (selectionCount % 8 === 0) {
        //         acceptClicks = false; // Disabling clicks during the delay
        //         setTimeout(function() {
        //             proceedToNextImage();
        //             acceptClicks = true; // Re-enabling clicks after the delay
        //         }, 1300); // synchronised with above delay! - don't change
        //     } else {
        //         proceedToNextImage();
        //     }
        // };

        function proceedToNextImage() {
			currentTrialIndex++;

			if (currentTrialIndex >= trials.length) {
				jatos.startNextComponent();
			} else {
				if (selectionCount >= 8) {
					hideElementsDuringReload();
					selectionCount = 0;
					jsPsychInstance.nextTrial();
				}

				updateCentralImageAndAudio();
			}
		}

		function hideElementsDuringReload() {
			const centralImageElem = document.querySelector('.center-image img');
			centralImageElem.style.opacity = 0;
		}

		function updateCentralImageAndAudio() {
			document.querySelectorAll('.speaker').forEach(function (elem) {
				elem.classList.remove('active-speaker');
			});

			const currentTrials = trials[currentTrialIndex];
			const centralImage = centralImageData[currentTrials.word];

			if (centralImage) {
				const centralImageElem = document.querySelector('.center-image img');

				centralImageElem.src = centralImage.image;

				centralImageElem.onload = function () {
					centralImageElem.style.opacity = 1;
				}
			};

			setTimeout(function() {
				const nextExpectedSpeaker = trials[currentTrialIndex].speaker;
				const nextExpectedIndex = speakerMap[nextExpectedSpeaker];
				const nextSpeakerImg = document.getElementById(`speaker_${nextExpectedIndex}`);
				if (nextSpeakerImg) {
					nextSpeakerImg.classList.add('active-speaker');
				}

				const currentTrial = trials[currentTrialIndex];
				const centralImage = centralImageData[currentTrial.word];
				if (centralImage) {
					document.querySelector('.center-image img').src = centralImage.image;

					document.querySelectorAll('.speaker').forEach((speakerImg, spIndex) => {
						speakerImg.setAttribute('onclick', `window.playAudio('${centralImage.audioFiles[spIndex]}', ${spIndex}, '${currentTrial.speaker}')`);
					});
				} else {
					console.error('Central image not found for word:', currentTrial.word);
				}
			}, 500);
		}
	};
})

.catch(error => console.error('Error in loading JSON file', error));
});