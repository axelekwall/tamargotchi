var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent =
  SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

var actions = ['sit', 'roll', 'dead', 'shake'];
var grammar =
  '#JSGF V1.0; grammar actions; public <action> = ' +
  actions.join(' | ') +
  ' ;';

var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
//recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

function onSceneLoaded() {
  const raycaster = document.querySelector('[ar-raycaster]');
  const cursor = document.querySelector('#cursor');
  raycaster.addEventListener('raycaster-intersection', event => {
    cursor.setAttribute('position', event.detail.intersections[0].point);
  });
}

document.body.onclick = function() {
  recognition.start();
  setFeedbackVisible(true);
  console.log('Ready to receive an action command.');
};

const setFeedbackVisible = bool => {
  const feedbackEl = document.getElementById('feedback');
  if (bool) {
    feedbackEl.classList.remove('hidden');
  } else {
    feedbackEl.classList.add('hidden');
  }
};

recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var action = String(event.results[last][0].transcript);

  console.log('action:' + action);

  if (action.includes('sit')) {
    newCommand('sitting');
  }
  if (action.includes('dead')) {
    newCommand('play_dead');
  }
  if (action.includes('roll')) {
    newCommand('rollover');
  }
  if (action.includes('shake')) {
    newCommand('shake');
  }
  console.log('Confidence: ' + event.results[0][0].confidence);
};

recognition.onspeechend = function() {
  recognition.stop();
  setFeedbackVisible(false);
};

const scene = document.querySelector('a-scene');
scene.addEventListener('loaded', onSceneLoaded);

const dogo = document.querySelector('#dogo');
dogo.addEventListener('animation-finished', function() {
  dogo.setAttribute('animation-mixer', 'clip: standing; loop: repeat');
});

function newCommand(action) {
  dogo.setAttribute('animation-mixer', 'clip: ' + action + '; loop: once');
}
