/*
jsPsych plugin that records audio clips time locked to pictures in the same trial

Customized by Anne Vogt

Based on a previous versions of an audio record plugin by Guila Bovolenta and Mara Haslan
Based on Recorder.js by Matt Diamond
*/
/*
License (MIT)
Copyright © 2013 Matt Diamond
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial portions of
the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.
*/

jsPsych.plugins["picnaming-voice-record-wav"] = (function () {

  var plugin = {};

     jsPsych.pluginAPI.registerPreload('image-button-response','stimulus', 'image');



    // ================ PLUGIN INFO ===========

  plugin.info = {
    name: "picnaming-voice-record-wav",
    description: "",
    parameters: {
	stimulus: {
        type: jsPsych.plugins.parameterType.IMAGE,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The image to be displayed'
      },
      prompt: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Prompt',
        default: '',
        description: 'Any content here will be displayed on screen - can be HTML.'
      },
	  stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: -1,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: -1,
        description: 'The duration of recording.'
      },
      stim_num: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimulus number',
        default: 'test',
        description: 'Identifier number for trial stimulus'
      }
    }
  }


    ///// ============== RUN TRIAL =============== ////

  plugin.trial = function(display_element, trial) {


   // ------ VISUAL FEATURES ------ //
   var new_html = '<img src="'+trial.stimulus+'" id="jspsych-picnaming-voice-record-wav-stimulus"></img>';



   // show prompt if there is one
   if (trial.prompt !== "") {
      display_element.innerHTML = trial.prompt;
   }

	// add prompt
    new_html += trial.prompt;

    // draw
    display_element.innerHTML = new_html;


   // ------ SOUND RECORDER ----- //

  var WORKER_PATH = 'custom-plugins/recorderWorker.js';

  var Recorder = function(source, cfg){
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    var numChannels = config.numChannels || 2;
    this.context = source.context;
    this.node = (this.context.createScriptProcessor ||
                 this.context.createJavaScriptNode).call(this.context,
                 bufferLen, numChannels, numChannels);

    var worker = new Worker(config.workerPath || WORKER_PATH);


    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate,
        numChannels: numChannels,
		maxRecordTime: config.maxRecordTime
		}
    });
    var recording = false,
      currCallback;

    this.node.onaudioprocess = function(e){
      if (!recording) return;
      var buffer = [];
      for (var channel = 0; channel < numChannels; channel++){
          buffer.push(e.inputBuffer.getChannelData(channel));
      }


      worker.postMessage({
        command: 'record',
        buffer: buffer
      });
    }

    this.configure = function(cfg){
      for (var prop in cfg){
        if (cfg.hasOwnProperty(prop)){
          config[prop] = cfg[prop];
        }
      }
    }

    this.record = function(){
      recording = true;
    }

    this.stop = function(){
      recording = false;
    }

    this.clear = function(){
      worker.postMessage({ command: 'clear' });
    }

    this.getBuffer = function(cb) {
      currCallback = cb || config.callback;
      worker.postMessage({ command: 'getBuffer' })
    }

    this.exportWAV = function(type){
      type = type || config.type || 'audio/wav';
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    }

    worker.onmessage = function(e){
      var blob = e.data;

	  var fileReader = new FileReader();

	 fileReader.onload = function(){
		//name of audio files can be determined here
		//properties of the stimuli presented in each trial which are part of the stimulus array can be put into the name, e.g. item number
		//subjectID can be any random number generated in the experiment workflow itself, we use the ResultID from JATOS in order to be able to trace which audio files came from which participant, see also the workflow documentation
		var nameOfFile = encodeURIComponent('Id_' + subjectID +'_'+(trial.object)+'_'+('000' + trial.stim_num).slice(-3));
		jatos.uploadResultFile(blob, nameOfFile+'.wav'); //after each trial the files are directly transferred to the experiment server, in this case interaction with JATOS

	  };

	  fileReader.readAsArrayBuffer(blob);
    }


    source.connect(this.node);
    this.node.connect(this.context.destination);
  };



  // --- Recorder functions --- //

  function startRecording() {
    recorder && recorder.record();
  }

  function stopRecording() {
    recorder && recorder.stop();
    createDownloadLink();
    recorder.clear();
  }

  function createDownloadLink() {
    recorder && recorder.exportWAV();
  }




    ////// ------- Execute trial ------ ///////



    // Create new recorder object
    var recorder;
    recorder = new Recorder(window.input, {
            numChannels: 1,
			maxRecordTime : trial.trial_duration
                 });

    // Start recording
    $("img").ready(startRecording);

    // Stop recording after a fixed time
   setTimeout(stopRecording,trial.trial_duration);




    // data saving
    var trial_data = {
	"stimulus": trial.stimulus,
      trial_duration: trial.trial_duration
    };

 //hide image if timing is set //if the picture is shown shorter than the trial duration this part is needed
    if (trial.stimulus_duration > 0) {
    jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-picnaming-voice-record-wav-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }


    // end trial if time limit is set
    if (trial.trial_duration > 0) {
      jsPsych.pluginAPI.setTimeout(function() {
        jsPsych.finishTrial(trial_data);
      }, trial.trial_duration);
    }

  };
  return plugin;
})();
