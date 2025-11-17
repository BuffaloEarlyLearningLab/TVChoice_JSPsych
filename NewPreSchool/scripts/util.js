
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