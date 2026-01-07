//##############################################################################################################
// Informant Intro
//#######################################################

const AUDIO_INTRO_PEOPLE = 'assets/Experimenter voice recordings/informant_intro/exp_2_people_jb.wav';
const AUDIO_INTRO_KID = 'assets/Experimenter voice recordings/informant_intro/exp_child_jb.wav';
const AUDIO_INTRO_GROWNUP = 'assets/Experimenter voice recordings/informant_intro/exp_adult_jb.wav';
const OBJECT_INTRO = 'assets/Experimenter voice recordings/familiarization_phase/exp_intro_toy_tool_jb.wav';
const AUDIO_INTRO_TOOL = 'assets/Experimenter voice recordings/familiarization_phase/exp_tool_intro.wav';
const AUDIO_INTRO_TOY = 'assets/Experimenter voice recordings/familiarization_phase/exp_toy_intro.wav';



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
function object_intro() {
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    order_info = {
        "toy": {
            "audio_path": AUDIO_INTRO_TOY,
            "element_id": "toy_choice",
        },
        "tool": {
            "audio_path": AUDIO_INTRO_TOOL,
            "element_id": "tool_choice",
        }
    }

    if (Math.random() < 0.5) {
        first = "toy";
        last = "tool";
    }
    else {
        last = "toy";
        first = "tool";
    }


    var aud_info_object = new Audio(OBJECT_INTRO);
    var audio1 = new Audio(order_info[first]["audio_path"]);
    var audio2 = new Audio(order_info[last]["audio_path"]);
    aud_info_object.play();

    aud_info_object.onended = async function () {
        await sleep(1500);
        highlight(order_info[first]["element_id"], { scale: 1.4, duration: 2000, hold: 7000 });
        audio1.play();

    };

    audio1.onended = async function () {
        await sleep(1500);
        audio2.play();
        highlight(order_info[last]["element_id"], { scale: 1.4, duration: 2000, hold: 7000 });
    };

    audio2.onended = async function () {
        const trialData = { "object_intro_audio_order": first + "_then_" + last }
        jsPsych.finishTrial(trialData);
    }
}


function Informant_intro_people() {
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    order_info = {
        "adult": {
            "audio_path": AUDIO_INTRO_GROWNUP,
            "element_id": "adult_choice",
        },
        "child": {
            "audio_path": AUDIO_INTRO_KID,
            "element_id": "child_choice",
        }
    }

    if (Math.random() < 0.5) {
        first = "adult";
        last = "child";
    }
    else {
        last = "adult";
        first = "child";
    }


    var aud_info_intro_people = new Audio(AUDIO_INTRO_PEOPLE);
    var audio1 = new Audio(order_info[first]["audio_path"]);
    var audio2 = new Audio(order_info[last]["audio_path"]);
    aud_info_intro_people.play();

    aud_info_intro_people.onended = async function () {
        await sleep(1500);
        highlight(order_info[first]["element_id"], { scale: 1.4, duration: 2000, hold: 2000 });
        audio1.play();

    };

    audio1.onended = async function () {
        await sleep(1500);
        audio2.play();
        highlight(order_info[last]["element_id"], { scale: 1.4, duration: 2000, hold: 2000 });
    };

    audio2.onended = async function () {
        const trialData = { "informant_intro_audio_order": first + "_then_" + last }
        jsPsych.finishTrial(trialData);
    }
}

function comp_check_load_object(object_audio_path) {
    const sleep = ms => new Promise(res => setTimeout(res, ms));
    const toyEl = document.getElementById('toy_choice');
    const toolEl = document.getElementById('tool_choice');

    // Initially disable clicks & style while audio plays
    function disableChoices() {
        [toyEl, toolEl].forEach(el => {
            el.style.pointerEvents = 'none';
            el.style.cursor = 'not-allowed';
            el.style.opacity = 0.6;
        });

    }
    function enableChoices() {
        [toyEl, toolEl].forEach(el => {
            el.style.pointerEvents = '';
            el.style.cursor = 'pointer';
            el.style.opacity = 1;
        });
    }



    let finished = false;

    async function chooseAndFinish(choiceId) {
        if (finished) return;
        finished = true;
        // visual feedback
        [toyEl, toolEl].forEach(el => el.style.outline = '');
        const chosenEl = document.getElementById(choiceId);
        if (chosenEl) {
            chosenEl.style.boxShadow = '0 0 15px 5px gold';
            chosenEl.style.borderRadius = '8px';
        }

        // cleanup listeners
        cleanup();
        await sleep(1000);

        // trial data and finish
        const trialData = { object_choice: choiceId, object_audio: object_audio_path };
        //console.log(trialData)

        jsPsych.finishTrial(trialData);
    }

    function toyClickHandler() { chooseAndFinish('toy_choice'); }
    function toolClickHandler() { chooseAndFinish('tool_choice'); }

    toyEl.addEventListener('click', toyClickHandler);
    toolEl.addEventListener('click', toolClickHandler);

    function cleanup() {
        toyEl.removeEventListener('click', toyClickHandler);
        toolEl.removeEventListener('click', toolClickHandler);
    }

    var aud_comprehension_check = new Audio(object_audio_path);

    async function playAudio() {
        aud_comprehension_check.play();
        aud_comprehension_check.onended = async function () {
            enableChoices();
            await sleep(500); // max wait time for response
        }

    }

    playAudio();

}


function comp_check_load(informant_audio_path) {
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

    }
    function enableChoices() {
        [adultEl, childEl].forEach(el => {
            el.style.pointerEvents = '';
            el.style.cursor = 'pointer';
            el.style.opacity = 1;
        });
    }



    let finished = false;

    async function chooseAndFinish(choiceId) {
        if (finished) return;
        finished = true;
        // visual feedback
        [adultEl, childEl].forEach(el => el.style.outline = '');
        const chosenEl = document.getElementById(choiceId);
        if (chosenEl) {
            chosenEl.style.boxShadow = '0 0 15px 5px gold';
            chosenEl.style.borderRadius = '8px';
        }

        // cleanup listeners
        cleanup();
        await sleep(1000);

        // trial data and finish
        const trialData = { informant_choice: choiceId, informant_audio: informant_audio_path };
        //console.log(trialData)

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
        record_data: false,
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
        trial_duration: duration,
        record_data: false,
    };
}


/***************************************************************
* Helper: selection screen (for user choice)
***************************************************************/
function createSelectionTrial(trial, seq_type, imgPath, order) {
    return {
        type: jsPsychHtmlButtonResponse,
        stimulus: knowledge_screen_html_template(imgPath, informant_order),
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
                    jsPsych.finishTrial(
                        {
                            trial: trial.trial_number,
                            object: trial.obj_name,
                            object_type: trial.type,
                            seq_type: seq_type,
                            selection: choice,
                            "audio_order": order[0] + "_then_" + order[1],
                        });
                }, 500);
            }

            child.addEventListener('click', () => select('child'));
            adult.addEventListener('click', () => select('adult'));
        }
    };
}

const knowledge_screen_html_template = (
    imgPath,
    informant_order,
    highlightChild = false,
    highlightAdult = false,
    child_opacity = 1,
    adult_opacity = 1,
) => {
    const childClass = highlightChild ? 'highlight' : '';
    const adultClass = highlightAdult ? 'highlight' : '';
    const CHILD_IMAGE = "assets/img/child_informant.png";
    const ADULT_IMAGE = "assets/img/adult_informant.png";
    var first_tag = `<img src="${ADULT_IMAGE}" id="adult-informant" class="${adultClass}" style="max-width:60%;opacity:${adult_opacity};"></img>`;
    var second_tag = `<img src="${CHILD_IMAGE}" id="child-informant" class="${childClass}" style="max-width:60%;opacity:${child_opacity};"></img>`;

    if (informant_order === true) {
        //console.log("child first");
        first_tag = `<img src="${CHILD_IMAGE}" id="child-informant" class="${childClass}" style="max-width:60%;opacity:${child_opacity};"></img>`;
        second_tag = `<img src="${ADULT_IMAGE}" id="adult-informant" class="${adultClass}" style="max-width:60%;opacity:${adult_opacity};"></img>`;
    }
    return `
            <div id="triangle-container">
                <div style="text-align:center; width: 35%;" >
                    <img id="object-small"  src="assets/img/${imgPath}" >
                </div>
                <div id="choose-container" >
                    <div style="text-align:center">
                        ${first_tag}
                    </div>
                    <div style="text-align:center">
                        ${second_tag}
                    </div>    
                </div>    
            </div>`;
};


function play_object_intro(audioSrc) {
    const sleep = ms => new Promise(res => setTimeout(res, ms));

    var audio = new Audio("assets/Experimenter voice recordings/teaching_segment/" + audioSrc);

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
function build_common_sequence(trial, seq_type, imgPath, audioQuestion, audioChild, audioAdult, informant_order) {
    const seq = [];


    console.log("informant order: " + informant_order);
    // 1. Question audio (no highlights)
    seq.push(createAudioTrial(
        knowledge_screen_html_template(imgPath, informant_order, false, false),
        audioQuestion
    ));

    order = ["child", "adult"]
    if (Math.random() < 0.5) {
        order = ["adult", "child"]
    }

    order_info = {
        "child": {
            "audio_path": audioChild,
        },
        "adult": {
            "audio_path": audioAdult,
        }
    };



    //console.log(order)
    order.forEach((informant) => {

        // // 2. followup audio + highlight child icon
        seq.push(createAudioTrial(
            knowledge_screen_html_template(imgPath, informant_order, (informant === "child"), (informant === "adult")),
            order_info[informant]["audio_path"]
        ));

        // // 3. Keep highlight 1.5s
        seq.push(createPauseTrial(
            knowledge_screen_html_template(imgPath, informant_order, (informant === "child"), (informant === "adult")),
            1500
        ));
        // // 4. Remove highlight 0.5s
        seq.push(createPauseTrial(
            knowledge_screen_html_template(imgPath, informant_order, false, false),
            500
        ));
    });



    // 8. Choice trial
    seq.push(createSelectionTrial(trial, seq_type, imgPath, order, informant_order));

    return seq;
}



function teaching_image_html_template(imgPath) {
    return `
        <div id="topright">
            <img id="topright_holder" src="assets/img/child_informant.png" />
        </div>
          <div style="display:flex;justify-content:center">
            <img id="full-image" src="assets/img/${imgPath}">
          </div>`
}


/**
 * Create a 3-image test trial sequence.
 * Returns an array: [audioDisplayTrial, selectionTrial]
 * - audioDisplayTrial: shows images but is non-clickable while question audio plays
 * - selectionTrial: same layout but images are clickable; resolves selection
*/
function createTestTrial(trial) {
    // helper to build the stimulus HTML: center image on first row, left/right below
    const stimHtml = (clickable = false) => `
        <div id="triangle-container">
            <div style="text-align:center">
                <img id="center-choice" src="assets/img/${trial.center_image}.jpg" style="max-width:320px; width:100%; height:auto;" ${clickable ? '' : 'style="pointer-events:none;opacity:0.9;"'}>
            </div>
            <div id="choose-container" style="display:grid;grid-template-columns:1fr 1fr;gap:200px;margin-top:100px;">
                <div style="text-align:center">
                    <img id="left-choice" src="assets/img/${trial.left_image}.jpg" style="max-width:260px; width:100%; height:auto; ${clickable ? '' : 'pointer-events:none;opacity:0.9;'}">
                </div>
                <div style="text-align:center">
                    <img id="right-choice" src="assets/img/${trial.right_image}.jpg" style="max-width:260px; width:100%; height:auto; ${clickable ? '' : 'pointer-events:none;opacity:0.9;'}">
                </div>
            </div>
        </div>`;

    const audioSrc = `assets/${trial.question_soundfile}`;

    // 1) audio display trial — shows images but non-clickable; finishes when audio ends
    const audioDisplay = {
        type: jsPsychHtmlButtonResponse,
        stimulus: stimHtml(false),
        choices: [],
        record_data: false,
        on_load: () => {
            const audio = new Audio(audioSrc);
            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    // autoplay blocked: user gesture required — nothing to do here; audio may be started manually
                });
            }
            audio.onended = () => jsPsych.finishTrial();
        },
        //data: { trial_type: 'test_audio_display', trial_number: trial.trial_number, target: trial.target }
    };

    // 2) selection trial — same layout but images clickable; resolves selection
    const selectionTrial = {
        type: jsPsychHtmlButtonResponse,
        stimulus: stimHtml(true),
        choices: [],
        on_load: () => {
            const leftEl = document.getElementById('left-choice');
            const centerEl = document.getElementById('center-choice');
            const rightEl = document.getElementById('right-choice');

            let finished = false;
            function finishWith(choiceId, label) {
                if (finished) return;
                finished = true;
                // visual feedback
                [leftEl, centerEl, rightEl].forEach(el => el.style.outline = '');
                const chosen = document.getElementById(choiceId);
                if (chosen) {
                    chosen.style.boxShadow = '0px 0px 15px 15px gold';
                    chosen.style.borderRadius = '8px';
                }
                // cleanup
                leftEl && leftEl.removeEventListener('click', leftHandler);
                centerEl && centerEl.removeEventListener('click', centerHandler);
                rightEl && rightEl.removeEventListener('click', rightHandler);

                var locations = ["left", "right", "center"]
                var choice_location = "";
                var target_location = "";
                locations.forEach((location) => {
                    if (trial[location] == trial["target"]) target_location = location;
                    if (trial[location] == label) choice_location = location;
                })


                setTimeout(() => {
                    jsPsych.finishTrial(
                        {
                            trial_number: trial.trial_number,
                            target: trial.question_soundfile,
                            choice: label,
                            target_loc: target_location,
                            choice_loc: choice_location,
                        });
                }, 500);
                //jsPsych.finishTrial({ trial_type: 'test_choice', trial_number: trial.trial_number, target: trial.target, choice: label });
            }

            function leftHandler() { finishWith('left-choice', trial.left); }
            function centerHandler() { finishWith('center-choice', trial.center); }
            function rightHandler() { finishWith('right-choice', trial.right); }

            leftEl && leftEl.addEventListener('click', leftHandler);
            centerEl && centerEl.addEventListener('click', centerHandler);
            rightEl && rightEl.addEventListener('click', rightHandler);
        },
        //data: { trial_type: 'test_selection', trial_number: trial.trial_number, target: trial.target }
    };

    return [audioDisplay, selectionTrial];
}

