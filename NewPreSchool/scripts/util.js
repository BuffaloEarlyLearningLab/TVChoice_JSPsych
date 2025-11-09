
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