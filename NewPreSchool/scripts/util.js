
function highlight(id, options = {}) {
    const scale = options.scale ?? 1.25;
    const duration = options.duration ?? 300;
    const hold = options.hold ?? 500;

    const el = document.getElementById(id);
    if (el) {
        el.style.opacity = 1;
        el.style.transition = `transform $5000ms ease`;
        el.style.transformOrigin = el.style.transformOrigin || '50% 50%';
        el.classList.add('highlight-scale');
        setTimeout(() => {
            el.classList.remove('highlight-scale');
        }, hold + duration + 100);
    }
}

function Informant_intro_people() {
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    var aud_info_intro_people = new Audio('assets/Experimenter voice recordings/Informant_intro_people.m4a');
    var aud_info_intro_kid = new Audio('assets/Experimenter voice recordings/Informant_intro_kid.m4a');
    var aud_info_intro_grownup = new Audio('assets/Experimenter voice recordings/Informant_intro_grownup.m4a');
    aud_info_intro_people.play();

    aud_info_intro_people.onended = async function () {
        await sleep(1500);
        highlight('child_informant', { scale: 1.4, duration: 2000, hold: 2000 });
        aud_info_intro_kid.play();

    };

    aud_info_intro_kid.onended = async function () {
        await sleep(1500);
        aud_info_intro_grownup.play();
        highlight('adult_informant', { scale: 1.4, duration: 2000, hold: 2000 });
    };

    aud_info_intro_grownup.onended = async function () {
        jsPsych.finishTrial();
    }
}

function comp_check_load(informant, informant_audio_path) {
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const adultEl = document.getElementById('adult_choice');
    const childEl = document.getElementById('child_choice');

    // Initially disable clicks & style while audio plays
    function disableChoices() {
        [adultEl, childEl].forEach(el => {
            el.style.pointerEvents = 'none';
            el.style.cursor = 'not-allowed';
            el.style.opacity = 0.6;
        });
        overlay.style.display = '';
    }
    function enableChoices() {
        [adultEl, childEl].forEach(el => {
            el.style.pointerEvents = '';
            el.style.cursor = 'pointer';
            el.style.opacity = 1;
        });
        overlay.style.display = 'none';
    }

    disableChoices

    let finished = false;

    async function chooseAndFinish(choiceId) {
        if (finished) return;
        finished = true;
        // visual feedback
        [adultEl, childEl].forEach(el => el.style.outline = '');
        const chosenEl = document.getElementById(choiceId);
        if (chosenEl) chosenEl.style.outline = '6px solid rgba(50,115,220,0.45)';

        // cleanup listeners
        cleanup();
        await sleep(1000);

        // trial data and finish
        const trialData = { informant_choice: choiceId, timestamp: Date.now() };


        jsPsych.finishTrial(trialData);
    }

    function adultClickHandler() { chooseAndFinish('adult_choice'); }
    function childClickHandler() { chooseAndFinish('child_choice'); }

    adultEl.addEventListener('click', adultClickHandler);
    childEl.addEventListener('click', childClickHandler);

    function cleanup() {
        adultEl.removeEventListener('click', adultClickHandler);
        childEl.removeEventListener('click', childClickHandler);
    }

    var aud_comprehension_check = new Audio(informant_audio_path);

    async function playAudio() {
        aud_comprehension_check.play();
        aud_comprehension_check.onended = async function () {
            enableChoices();
            await sleep(500); // max wait time for response
        }

    }

    playAudio();

}

async function loadData(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status} ${response.statusText}`);
        const data = await response.json();
        console.log('Loaded', filePath, data);
        return data;
    } catch (error) {
        console.error('Error loading data:', filePath, error);
        return null; // or throw error if you prefer to abort
    }
}


String.prototype.format = function () {
    const args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined'
            ? args[number]
            : match;
    });
};

/***************************************************************
 * Helper: Play audio trial with custom stimulus HTML, wait for end
 ***************************************************************/
function createAudioTrial(stimulusHtml, audioSrc) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: stimulusHtml,
        choices: [],
        on_load: () => {
            const audio = new Audio(audioSrc);
            audio.play();
            audio.onended = () => jsPsych.finishTrial();
        }
    };
}

/***************************************************************
 * Helper: Pause trial for given ms
 ***************************************************************/
function createPauseTrial(stimulusHtml, duration) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: stimulusHtml,
        choices: [],
        trial_duration: duration
    };
}


/***************************************************************
* Helper: selection screen (for user choice)
***************************************************************/
function createSelectionTrial(objName, stage, imgPath) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: knowledge_screen_html_template(imgPath),
        choices: [],
        on_load: () => {
            const child = document.getElementById('child-informant');
            const adult = document.getElementById('adult-informant');
            let selected = null;

            function select(choice) {
                if (selected) return;
                selected = choice;
                if (choice === 'child') {
                    child.classList.add('selected');
                    adult.classList.remove('selected');
                } else {
                    adult.classList.add('selected');
                    child.classList.remove('selected');
                }
                setTimeout(() => {
                    jsPsych.finishTrial({ stage: stage, selection: choice });
                }, 500);
            }

            child.addEventListener('click', () => select('child'));
            adult.addEventListener('click', () => select('adult'));
        }
    };
}

const knowledge_screen_html_template = (imgPath, highlightChild = false, highlightAdult = false) => {
    const childClass = highlightChild ? 'highlight' : '';
    const adultClass = highlightAdult ? 'highlight' : '';
    const CHILD_IMAGE = "assets/img/child_informant.png";
    const ADULT_IMAGE = "assets/img/adult_informant.png";
    return `
            <div id="triangle-container">
            <img id="object-small"  src="assets/img/${imgPath}" >
            <img src="${CHILD_IMAGE}" id="child-informant" class="${childClass}">
            <img src="${ADULT_IMAGE}" id="adult-informant" class="${adultClass}">
            </div>`;
};


function knowledgeAttributionSequence(objName, imgPath) {


    const AUDIO_KNOWLEDGE_QUESTION = "assets/Experimenter voice recordings/Knowledge_attribution_question.m4a";
    const AUDIO_KNOWLEDGE_CHILD = "assets/Experimenter voice recordings/Knowledge_attribution_child.m4a";
    const AUDIO_KNOWLEDGE_ADULT = "assets/Experimenter voice recordings/Knowledge_attribution_adult.m4a";

    // timeline.push(createAudioTrial(
    //     knowledge_screen_html_template(imgPath),
    //     AUDIO_KNOWLEDGE_QUESTION
    // ));

    // timeline.push(createAudioTrial(
    //     knowledge_screen_html_template(imgPath),
    //     AUDIO_KNOWLEDGE_CHILD
    // ));

    // timeline.push(createPauseTrial(
    //     knowledge_screen_html_template(imgPath, highlightChild = true, highlightAdult = false),
    //     1500
    // ));

    return [
        // 1. Question audio
        createAudioTrial(
            knowledge_screen_html_template(imgPath),
            AUDIO_KNOWLEDGE_QUESTION
        ),

        // 2. Child followup audio + highlight child icon
        createAudioTrial(
            knowledge_screen_html_template(imgPath),
            AUDIO_KNOWLEDGE_CHILD
        ),

        // 3. Keep highlight 1.5s
        createPauseTrial(
            knowledge_screen_html_template(imgPath, highlightChild = true, highlightAdult = false),
            1500
        ),

        // 4. Remove highlight 0.5s
        createPauseTrial(
            knowledge_screen_html_template(imgPath),
            500
        ),

        // 5. Adult followup audio + highlight adult icon
        createAudioTrial(
            knowledge_screen_html_template(imgPath, highlightChild = false, highlightAdult = true),
            AUDIO_KNOWLEDGE_ADULT
        ),

        // 6. Keep highlight 1.5s
        createPauseTrial(
            knowledge_screen_html_template(imgPath, highlightChild = false, highlightAdult = true),
            1500
        ),

        // 7. Remove highlight 0.5s
        createPauseTrial(
            knowledge_screen_html_template(imgPath),
            500
        ),

        // 8. Choice trial
        createSelectionTrial(objName, "knowledge", imgPath)
    ];
}


function play_object_intro(audioSrc) {
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    var audio = new Audio("assets/Experimenter voice recordings/" + audioSrc);

    var promise = audio.play();
    if (promise !== undefined) {
        promise.then(_ => {
            // Autoplay started!
        }).catch(error => {
            // Autoplay was prevented.
            // Show a "Play" button so that user can start playback.
        });
    }
    audio.onended = async function () {
        jsPsych.finishTrial();
    }
}

/**
 * Build the knowledge-attribution trial sequence for one object.
 * Returns an ARRAY of trials so callers can either push(...seq) or
 * timeline = timeline.concat(seq).
 *
 * @param {string} objName - name/id for the object (used in selection trial data)
 * @param {string} imgPath - path to the object image to display
 * @param {string} audioQuestion - audio file for the question
 * @param {string} audioChild - audio file for the child follow-up
 * @param {string} audioAdult - audio file for the adult follow-up
 */
function build_common_sequence(objName, seq_type, imgPath, audioQuestion, audioChild, audioAdult) {
    const seq = [];

    // 1. Question audio (no highlights)
    seq.push(createAudioTrial(
        knowledge_screen_html_template(imgPath, false, false),
        audioQuestion
    ));

    // 2. Child followup audio + highlight child icon
    seq.push(createAudioTrial(
        knowledge_screen_html_template(imgPath, true, false),
        audioChild
    ));

    // 3. Keep highlight 1.5s
    seq.push(createPauseTrial(
        knowledge_screen_html_template(imgPath, true, false),
        1500
    ));

    // 4. Remove highlight 0.5s
    seq.push(createPauseTrial(
        knowledge_screen_html_template(imgPath, false, false),
        500
    ));

    // 5. Adult followup audio + highlight adult icon
    seq.push(createAudioTrial(
        knowledge_screen_html_template(imgPath, false, true),
        audioAdult
    ));

    // 6. Keep highlight 1.5s
    seq.push(createPauseTrial(
        knowledge_screen_html_template(imgPath, false, true),
        1500
    ));

    // 7. Remove highlight 0.5s
    seq.push(createPauseTrial(
        knowledge_screen_html_template(imgPath, false, false),
        500
    ));

    // 8. Choice trial
    seq.push(createSelectionTrial(objName, seq_type, imgPath));

    return seq;
}


/***************************************************************
 * Helper: repeat-name trial (fixed audio file for all objects as of now)
 ***************************************************************/
function createRepeatNameTrial(trial, imgPath, lastChoice) {
    const seq = [];

    const selectedInformant = lastChoice === "child" ? "child" : "adult";
    const teachingAudio = selectedInformant === "child" ? trial.sound_file_child : trial.sound_file_adult;
    const teaching_audio = `assets/Experimenter voice recordings/${teachingAudio}`;


    repeat_html_template = () => `
          <div style="display:flex;justify-content:center">
            <div>Can you help me say the name of the object?</div>
            </br>
            <div>${trial.obj_name}</div>
          </div>`
    const audioPath = `assets/Experimenter voice recordings/Name_of_object.m4a`;

    seq.push(createAudioTrial(repeat_html_template(imgPath), audioPath))
    seq.push(createAudioTrial(repeat_html_template(imgPath), teaching_audio))
    seq.push({
        type: jsPsychHtmlButtonResponse,
        stimulus: repeat_html_template(imgPath),
        choices: ["Next"],
        data: () => {
            return {
                trial_type: "teaching_audio",
                obj_name: trial.objName,
                selected_informant: lastChoice
            };
        }
    })
    return seq;
}

function teachingTrial(trial, imgPath, lastChoice) {

    const selectedInformant = lastChoice === "child" ? "child" : "adult";
    const teachingAudio = selectedInformant === "child" ? trial.sound_file_child : trial.sound_file_adult;
    const audioPath = `assets/Experimenter voice recordings/${teachingAudio}`;
    const seq = [];


    teaching_image_html_template = (imgPath) => `
          <div style="display:flex;justify-content:center">
            <img id="full-image" style="max-width:60%" src="assets/img/${imgPath}">
          </div>`

    seq.push(createAudioTrial(teaching_image_html_template(imgPath), audioPath))

    return seq;
}