const jsPsych = initJsPsych({
  on_finish: () => jsPsych.data.displayData(),
});

fetch("test_order.json")
  .then(response => response.json())
  .then(order_data => {
    const test_orders = [order_data.test_order_1, order_data.test_order_2];
    const selected_order = jsPsych.randomization.sampleWithoutReplacement(test_orders, 1)[0];

    const all_images = selected_order.flatMap(t => [
      `img/${t.left_image}.png`,
      `img/${t.center_image}.png`,
      `img/${t.right_image}.png`,
    ]);
    const all_audio = [...new Set(selected_order.map(t => `audio/${t.question_soundfile}`))];

    const preload = {
      type: jsPsychPreload,
      images: all_images,
      audio: all_audio,
    };

    const test_trials = selected_order.map(trial => ({
      type: jsPsychHtmlButtonResponse,
      stimulus: `
        <p><strong>Listen carefully!</strong></p>
        <audio src="audio/${trial.question_soundfile}" autoplay></audio>
        <div style="display:flex; justify-content:center; gap:50px; margin-top:30px;">
          <img src="img/${trial.left_image}.png" width="200px">
          <img src="img/${trial.center_image}.png" width="200px">
          <img src="img/${trial.right_image}.png" width="200px">
        </div>
      `,
      choices: ["Select Left", "Select Center", "Select Right"],
      data: {
        trial_number: trial.trial_number,
        target: trial.target,
        question_speaker: trial.question_speaker,
        soundfile: trial.question_soundfile,
        left_label: trial.left,
        center_label: trial.center,
        right_label: trial.right,
      },
      on_finish: data => {
        const response_map = ["left", "center", "right"];
        const chosen_side = response_map[data.response];
        const trial_info = selected_order.find(t => t.trial_number === data.trial_number);
        const chosen_label = trial_info[chosen_side];
        data.chosen_label = chosen_label;
        data.correct = chosen_label === trial_info.target;
      },
    }));

    const welcome = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p>Welcome! Press start when you're ready to begin.</p>",
      choices: ["Start"],
    };

    const goodbye = {
      type: jsPsychHtmlButtonResponse,
      stimulus: "<p>All done! Thank you for participating.</p>",
      choices: ["Finish"],
    };

    jsPsych.run([preload, welcome, ...test_trials, goodbye]);
  })
  .catch(err => console.error("Error loading JSON:", err));
