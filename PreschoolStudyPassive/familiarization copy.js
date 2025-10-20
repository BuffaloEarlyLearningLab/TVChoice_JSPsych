document.addEventListener('DOMContentLoaded', function() {
    // Generate a participant ID based on the timestamp and stores it in local storage for use in later scripts
    //let participantId = `Participant_${new Date().getTime()}`;
    //localStorage.setItem('sona_id', sona_id);

	fetch('preschool_fam_trials.json')
        .then(response => response.json())
        .then(data => {
			//const order = localStorage.getItem("order")
            const order = localStorage.getItem("order")
            console.log("Order retrieved from sessionStorage:", order);

            // Access trials based on the stored 'order' from localStorage
            const trials = data[order];
			console.log(trials.length)

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
        'ball': {
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
        'apple': {
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

		const expectedSpeaker = trials[currentTrialIndex].speaker;
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
		var resultData = {"id": jatos.studySessionData.id, "order": jatos.studySessionData.order, "selected": audioFile, "speaker": speakerIndex, "count": selectionCount}
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
		// audio.play().catch(error => {
		// 	console.error("Audio playback error: ", error);
		// 	//acceptClicks = false
		// });

		// var audio = new Audio(audioFile);
		// setTimeout(function(){
		// 	speakerIcons.style.visibility = "hidden";
		// 	acceptClicks = false
		// }, 500);
		
		// setTimeout(function() {
		// 	audio.play(
		// 		acceptClicks = false
		// 	)
		// }, 1000);

		audio.onended = function() {
            if (speakerImg) {
                setTimeout(function() {
					speakerImg.classList.remove('active-speaker');
					speakerIcons.style.visibility = "visible";
					acceptClicks = true;;
					proceedToNextImage();
                }, 1500); // syrchronised - don't change!
            } else {
				proceedToNextImage();
			}
		};

		setTimeout(function () {
			acceptClicks = true;
		}, 2000)

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
					
