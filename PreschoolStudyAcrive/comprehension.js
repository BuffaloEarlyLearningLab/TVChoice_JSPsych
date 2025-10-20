document.addEventListener('DOMContentLoaded', function() {
    // References to HTML elements that will be interacted with
    const startBtn = document.getElementById('startBtn');
    const instructionsDiv = document.getElementById('instructionsDiv');
    const imagesContainer = document.getElementById('imagesContainer');
    const audio = document.getElementById('labelAudio');
    // Retrieve the participant ID stored in the browser's localStorage (generated in learning_phase.js)
    //let participantId = localStorage.getItem('participantId');

	var jsPsychInstance = initJsPsych({
		on_trial_start: function() {
			var id = jatos.urlQueryParameters.id;
			console.log(id);
			jsPsychInstance.data.addProperties({id: id});
			jatos.studySessionData.id = id;
		},
        override_safe_mode: true,
		on_close: () => jatos.endStudy(jsPsychInstance.data.get().json()),
      	on_finish: () => jatos.endStudy(jsPsychInstance.data.get().json())
    });

    let images = [
        { src: 'components/pictures/coodle.jpg', label: 'coodle'},
        { src: 'components/pictures/gasser.jpg', label: 'gasser' },
        { src: 'components/pictures/bosa.jpg', label: 'bosa'},
        { src: 'components/pictures/blicket.jpg', label: 'blicket' },
        { src: 'components/pictures/kita.jpg', label: 'kita'},
        { src: 'components/pictures/toma.jpg', label: 'toma' }
    ];

    let audioFiles = [
        {src: 'components/audio_files/F5_touch_coodle_mr.wav', label: 'coodle'},
        {src: 'components/audio_files/M5_find_coodle_sp.wav', label: 'coodle'},
        {src: 'components/audio_files/F5_click_gasser_mr.wav', label: 'gasser'},
        {src: 'components/audio_files/M5_find_gasser_sp.wav', label: 'gasser'},
        {src: 'components/audio_files/F5_click_bosa_mr.wav',label: 'bosa'},
        {src: 'components/audio_files/M5_touch_bosa_sp.wav', label: 'bosa'},
        {src: 'components/audio_files/F5_find_blicket_mr.wav', label: 'blicket'},
        {src: 'components/audio_files/M5_touch_blicket_sp.wav', label: 'blicket'},
        {src: 'components/audio_files/F5_touch_kita_mr.wav', label: 'kita'},
        {src: 'components/audio_files/M5_find_kita_sp.wav', label: 'kita'},
        {src: 'components/audio_files/F5_find_toma_mr.wav', label: 'toma'},
        {src: 'components/audio_files/M5_click_toma_sp.wav', label: 'toma'}
    ];

    // Index to track which audio file is currently being played
    let currentAudioIndex = 0;

    // Boolean to control if images can be clicked or not
    let isClickable = true;

    // Event listener to start the experiment when the start button is clicked
    startBtn.addEventListener('click', function() {
        startExperiment();
    });

    // Shuffling function described below
    function shuffleArray(array) {
        let shuffled = [];
        let previousLabel = "";

        while (array.length > 0) {
            let randomIndex = Math.floor(Math.random() * array.length);
            let item = array[randomIndex];

            // Avoids consecutive items with the same label to ensure pseudo random order
            if (item.label === previousLabel && array.length > 1) {

                continue;
            }

            shuffled.push(item);
            previousLabel = item.label;
            array.splice(randomIndex, 1);
        }

        return shuffled;
    }

    // Starts the experiment: hides instructions and displays images
    function startExperiment() {
        instructionsDiv.style.display = 'none';
        imagesContainer.style.display = 'grid';
        imagesContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        imagesContainer.style.gap = '50px';
        loadImages();
        audioFiles = shuffleArray([...audioFiles]);
        setTimeout(playAudioFile, 3000); 
    }

    // Loads and displays images in the DOM
    function loadImages() {
        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.src;
            imgElement.alt = image.label;
            imgElement.style.width = '100%';
            imgElement.style.height = '250px';
            imgElement.style.objectFit = 'contain';
            imgElement.classList.add('clickable-image');
            imgElement.style.border = '5px solid transparent';
            imgElement.addEventListener('click', handleImageClick);
            imagesContainer.appendChild(imgElement);
        });
    }

    // Plays the current audio file and allows clicks after it ends
    function playAudioFile() {
        if (currentAudioIndex < audioFiles.length) {
            audio.src = audioFiles[currentAudioIndex].src;
            audio.play();
            audio.onended = function() {
                setClickability(true);
            };
        } else {
            console.log("Audio trials completed.");
        }
    }

    // Handles clicks on images by sending the selected response to the XAMPP server
    function handleImageClick(event) {
        if (!isClickable) return; // Ignore clicks if not currently clickable
        
        // Identify the selected label and the label of the current audio
        const selectedLabel = event.target.alt;
        const audioLabel = audioFiles[currentAudioIndex].label;
        const trialNumber = currentAudioIndex + 1;
		const subjectID = jatos.studyResultId;
        
         // HighlightS the selected image
        event.target.style.border = '5px solid yellow';
        setClickability(false); // Disable further clicks until the next audio is played
    
        // Send the participant's response to the server
        const xhr = new XMLHttpRequest();
        xhr.open('POST', '../record_response.php', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                console.log('Response recorded: ' + this.responseText);
            }
        };
        //console.log(`Sending participantId: ${sona_id}`);
        //xhr.send(`participantId=${encodeURIComponent(sona_is)}&trialNumber=${trialNumber}&audioLabel=${encodeURIComponent(audioLabel)}&selectedLabel=${encodeURIComponent(selectedLabel)}`);
		var resultData = {"id": jatos.studySessionData.id, "selected": selectedLabel, "audio": audioLabel, "trial_number": trialNumber};
		jatos.appendResultData(resultData);

        // Reset image border and proceed to next audio after a delay
        setTimeout(() => {
            event.target.style.border = '5px solid transparent';
        }, 350);  // Change Border visiblity here - currently set for 350 milliseconds
    
        setTimeout(() => {
            if (currentAudioIndex < audioFiles.length - 1) {
                currentAudioIndex++;
                playAudioFile();
            } else {
                console.log("Experiment completed. Redirecting...");
                //redirectToConclusionPage();
				//jatos.startNextComponent();
				jatos.endStudy();
            }
        }, 2000);
    }
    
    function redirectToConclusionPage() {
        window.location.href = 'survey.html';
    }

    // Enables or disables clickability for all images
    function setClickability(state) {
        isClickable = state;
        const allImages = document.querySelectorAll('.clickable-image');
        allImages.forEach(img => {
            img.style.pointerEvents = state ? 'auto' : 'none';
        });
    }

	jatos.onLoad(function() {
		subjectID = jatos.studyResultId;
		jsPsychInstance.run(timeline);
	});
});