// $(function () {
//   const speakerDevices = document.getElementById('speaker-devices');
//   const ringtoneDevices = document.getElementById('ringtone-devices');
//   const outputVolumeBar = document.getElementById('output-volume');
//   const inputVolumeBar = document.getElementById('input-volume');
//   const volumeIndicators = document.getElementById('volume-indicators');
//   const callButton = document.getElementById('button-call');
//   const outgoingCallHangupButton = document.getElementById(
//     'button-hangup-outgoing'
//   );
//   const callControlsDiv = document.getElementById('call-controls');
//   const audioSelectionDiv = document.getElementById('output-selection');
//   const getAudioDevicesButton = document.getElementById('get-devices');
//   const logDiv = document.getElementById('log');
//   const incomingCallDiv = document.getElementById('incoming-call');
//   const incomingCallHangupButton = document.getElementById(
//     'button-hangup-incoming'
//   );
//   const incomingCallAcceptButton = document.getElementById(
//     'button-accept-incoming'
//   );
//   const incomingCallRejectButton = document.getElementById(
//     'button-reject-incoming'
//   );
//   const phoneNumberInput = document.getElementById('phone-number');
//   const incomingPhoneNumberEl = document.getElementById('incoming-number');
//   const startupButton = document.getElementById('startup-button');

//   // --- Variables y funciones para el temporizador ---
//   let timerInterval;
//   let seconds = 0;
//   const callTimerEl = document.getElementById('call-timer');

//   function formatTime(totalSeconds) {
//     const minutes = Math.floor(totalSeconds / 60);
//     const remainingSeconds = totalSeconds % 60;
//     const formattedMinutes = String(minutes).padStart(2, '0');
//     const formattedSeconds = String(remainingSeconds).padStart(2, '0');
//     return `${formattedMinutes}:${formattedSeconds}`;
//   }

//   function startTimer() {
//     seconds = 0;
//     callTimerEl.textContent = formatTime(seconds);
//     callTimerEl.classList.remove('hide');
//     timerInterval = setInterval(() => {
//       seconds++;
//       callTimerEl.textContent = formatTime(seconds);
//     }, 1000);
//   }

//   function stopTimer() {
//     clearInterval(timerInterval);
//     const finalTime = formatTime(seconds);
//     log(`Duración de la llamada: ${finalTime}`); // <-- Agrega la duración al registro
//     callTimerEl.textContent = '00:00';
//     callTimerEl.classList.add('hide');
//     seconds = 0;
//   }
//   // --- Fin del código del temporizador ---

//   let device;
//   let accessToken;

//   // AUDIO CONTROLS
//   function updateDevices(selectEl, selectedDevices) {
//     selectEl.innerHTML = '';

//     device.audio.availableOutputDevices.forEach(function (device, id) {
//       let isActive = selectedDevices.size === 0 && id === 'default';
//       selectedDevices.forEach(function (device) {
//         if (device.deviceId === id) {
//           isActive = true;
//         }
//       });

//       const option = document.createElement('option');
//       option.label = device.label;
//       option.setAttribute('data-id', id);
//       if (isActive) {
//         option.setAttribute('selected', 'selected');
//       }
//       selectEl.appendChild(option);
//     });
//   }

//   function updateAllAudioDevices() {
//     if (device) {
//       updateDevices(speakerDevices, device.audio.speakerDevices.get());
//       updateDevices(ringtoneDevices, device.audio.ringtoneDevices.get());
//     }
//   }

//   async function getAudioDevices() {
//     await navigator.mediaDevices.getUserMedia({ audio: true });
//     updateAllAudioDevices.bind(device);
//   }

//   function updateOutputDevice() {
//     const selectedDevices = Array.from(speakerDevices.children)
//       .filter((node) => node.selected)
//       .map((node) => node.getAttribute('data-id'));

//     device.audio.speakerDevices.set(selectedDevices);
//   }

//   function updateRingtoneDevice() {
//     const selectedDevices = Array.from(ringtoneDevices.children)
//       .filter((node) => node.selected)
//       .map((node) => node.getAttribute('data-id'));

//     device.audio.ringtoneDevices.set(selectedDevices);
//   }

//   function bindVolumeIndicators(call) {
//     call.on('volume', function (inputVolume, outputVolume) {
//       let inputColor = 'red';
//       if (inputVolume < 0.5) {
//         inputColor = 'green';
//       } else if (inputVolume < 0.75) {
//         inputColor = 'yellow';
//       }

//       inputVolumeBar.style.width = `${Math.floor(inputVolume * 300)}px`;
//       inputVolumeBar.style.background = inputColor;

//       let outputColor = 'red';
//       if (outputVolume < 0.5) {
//         outputColor = 'green';
//       } else if (outputVolume < 0.75) {
//         outputColor = 'yellow';
//       }

//       outputVolumeBar.style.width = `${Math.floor(outputVolume * 300)}px`;
//       outputVolumeBar.style.background = outputColor;
//     });
//   }

//   // MISC USER INTERFACE
//   function log(message) {
//     logDiv.innerHTML += `<p class="log-entry">&gt;&nbsp; ${message} </p>`;
//     logDiv.scrollTop = logDiv.scrollHeight;
//   }

//   function setClientNameUI(clientName) {
//     const div = document.getElementById('client-name');
//     div.innerHTML = `Usuario conectado: <strong>${clientName}</strong>`;
//   }

//   function resetIncomingCallUI() {
//     incomingPhoneNumberEl.innerHTML = '';
//     incomingCallAcceptButton.classList.remove('hide');
//     incomingCallRejectButton.classList.remove('hide');
//     incomingCallHangupButton.classList.add('hide');
//     incomingCallDiv.classList.add('hide');
//   }

//   function updateUIAcceptedOutgoingCall(call) {
//     log('Llamada en curso ...');
//     callButton.disabled = true;
//     outgoingCallHangupButton.classList.remove('hide');
//     volumeIndicators.classList.remove('hide');
//     bindVolumeIndicators(call);
//     startTimer(); // <-- Inicia el temporizador aquí
//   }

//   function updateUIDisconnectedOutgoingCall() {
//     log('Llamada desconectada.');
//     callButton.disabled = false;
//     outgoingCallHangupButton.classList.add('hide');
//     volumeIndicators.classList.add('hide');
//     stopTimer(); // <-- Detiene el temporizador y registra la duración
//   }

//   function rejectIncomingCall(call) {
//     call.reject();
//     log('Llamada entrante rechazada');
//     resetIncomingCallUI();
//   }

//   function hangupIncomingCall(call) {
//     call.disconnect();
//     log('Colgando llamada entrante');
//     resetIncomingCallUI();
//   }

//   function handleDisconnectedIncomingCall() {
//     log('Llamada entrante finalizada.');
//     resetIncomingCallUI();
//     stopTimer(); // <-- Detiene el temporizador y registra la duración
//   }

//   function handleAcceptedIncomingCall(call) {
//     log('Llamada entrante aceptada.');
//     incomingCallAcceptButton.classList.add('hide');
//     incomingCallRejectButton.classList.add('hide');
//     incomingCallHangupButton.classList.remove('hide');
//     bindVolumeIndicators(call);
//     startTimer(); // <-- Inicia el temporizador aquí
//   }

//   function handleIncomingCall(call) {
//     log(`Llamada entrante desde ${call.parameters.From}`);
//     incomingCallDiv.classList.remove('hide');
//     incomingPhoneNumberEl.innerHTML = call.parameters.From;

//     incomingCallAcceptButton.onclick = () => {
//       call.accept();
//     };

//     incomingCallRejectButton.onclick = () => {
//       rejectIncomingCall(call);
//     };

//     incomingCallHangupButton.onclick = () => {
//       hangupIncomingCall(call);
//     };

//     call.on('accept', handleAcceptedIncomingCall); // <-- Escucha el evento 'accept'
//     call.on('cancel', handleDisconnectedIncomingCall);
//     call.on('disconnect', handleDisconnectedIncomingCall);
//     call.on('reject', handleDisconnectedIncomingCall);
//   }

//   async function makeOutgoingCall() {
//     const params = {
//       To: phoneNumberInput.value,
//     };

//     if (device) {
//       log(`Intentando llamar a ${params.To} ...`);

//       const call = await device.connect({ params });

//       call.on('accept', updateUIAcceptedOutgoingCall);
//       call.on('disconnect', updateUIDisconnectedOutgoingCall);
//       call.on('cancel', updateUIDisconnectedOutgoingCall);
//       call.on('reject', updateUIDisconnectedOutgoingCall);

//       outgoingCallHangupButton.onclick = () => {
//         log('Colgando ...');
//         call.disconnect();
//       };
//     } else {
//       log('No se pudo hacer la llamada.');
//     }
//   }

//   function addDeviceListeners(device) {
//     device.on('registered', function () {
//       log('Twilio.Device listo para hacer y recibir llamadas.');
//       callControlsDiv.classList.remove('hide');
//     });

//     device.on('error', function (error) {
//       log(`Twilio.Device Error: ${error.message}`);
//     });

//     device.on('incoming', handleIncomingCall);

//     device.audio.on('deviceChange', updateAllAudioDevices.bind(device));

//     if (device.audio.isOutputSelectionSupported) {
//       audioSelectionDiv.classList.remove('hide');
//     }
//   }

//   function initializeDevice() {
//     logDiv.classList.remove('hide');
//     log('Inicializando dispositivo');
//     device = new Twilio.Device(accessToken, {
//       debug: true,
//       answerOnBridge: true,
//       codecPreferences: ['opus', 'pcmu'],
//     });

//     addDeviceListeners(device);
//     device.register();
//   }

//   async function startupClient() {
//     log('Solicitando Token de Acceso...');
//     try {
//       const { token, identity } = await $.getJSON(
//         'https://quickstart-voice-javascript-sdk-8916-dev.twil.io/voice-token'
//       );
//       log('Token obtenido.');
//       accessToken = token;
//       setClientNameUI(identity);

//       initializeDevice();
//     } catch (err) {
//       console.log(err);
//       log('Ocurrió un error. Revisa la consola del navegador para más información.');
//     }
//   }
//   startupButton.addEventListener('click', startupClient);

//   // Event Listeners
//   callButton.onclick = (e) => {
//     e.preventDefault();
//     makeOutgoingCall();
//   };
//   getAudioDevicesButton.onclick = getAudioDevices;
//   speakerDevices.addEventListener('change', updateOutputDevice);
//   ringtoneDevices.addEventListener('change', updateRingtoneDevice);
// });







$(function () {
  const speakerDevices = document.getElementById('speaker-devices');
  const ringtoneDevices = document.getElementById('ringtone-devices');
  const outputVolumeBar = document.getElementById('output-volume');
  const inputVolumeBar = document.getElementById('input-volume');
  const volumeIndicators = document.getElementById('volume-indicators');
  const callButton = document.getElementById('button-call');
  const outgoingCallHangupButton = document.getElementById(
    'button-hangup-outgoing'
  );
  const callControlsDiv = document.getElementById('call-controls');
  const audioSelectionDiv = document.getElementById('output-selection');
  const getAudioDevicesButton = document.getElementById('get-devices');
  const logDiv = document.getElementById('log');
  const incomingCallDiv = document.getElementById('incoming-call');
  const incomingCallHangupButton = document.getElementById(
    'button-hangup-incoming'
  );
  const incomingCallAcceptButton = document.getElementById(
    'button-accept-incoming'
  );
  const incomingCallRejectButton = document.getElementById(
    'button-reject-incoming'
  );
  const phoneNumberInput = document.getElementById('phone-number');
  const incomingPhoneNumberEl = document.getElementById('incoming-number');
  const startupButton = document.getElementById('startup-button');

  // Nuevos elementos agregados en el HTML
  const fetchHistoryButton = document.getElementById('button-fetch-history');
  const callHistoryLogDiv = document.getElementById('call-history-log');

  // --- Variables y funciones para el temporizador ---
  let timerInterval;
  let seconds = 0;
  const callTimerEl = document.getElementById('call-timer');

  function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  function startTimer() {
    seconds = 0;
    callTimerEl.textContent = formatTime(seconds);
    callTimerEl.classList.remove('hide');
    timerInterval = setInterval(() => {
      seconds++;
      callTimerEl.textContent = formatTime(seconds);
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    const finalTime = formatTime(seconds);
    log(`Duración de la llamada: ${finalTime}`);
    callTimerEl.textContent = '00:00';
    callTimerEl.classList.add('hide');
    seconds = 0;
  }
  // --- Fin del código del temporizador ---

  let device;
  let accessToken;

  // AUDIO CONTROLS
  function updateDevices(selectEl, selectedDevices) {
    selectEl.innerHTML = '';

    device.audio.availableOutputDevices.forEach(function (device, id) {
      let isActive = selectedDevices.size === 0 && id === 'default';
      selectedDevices.forEach(function (device) {
        if (device.deviceId === id) {
          isActive = true;
        }
      });

      const option = document.createElement('option');
      option.label = device.label;
      option.setAttribute('data-id', id);
      if (isActive) {
        option.setAttribute('selected', 'selected');
      }
      selectEl.appendChild(option);
    });
  }

  function updateAllAudioDevices() {
    if (device) {
      updateDevices(speakerDevices, device.audio.speakerDevices.get());
      updateDevices(ringtoneDevices, device.audio.ringtoneDevices.get());
    }
  }

  async function getAudioDevices() {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    updateAllAudioDevices.bind(device);
  }

  function updateOutputDevice() {
    const selectedDevices = Array.from(speakerDevices.children)
      .filter((node) => node.selected)
      .map((node) => node.getAttribute('data-id'));

    device.audio.speakerDevices.set(selectedDevices);
  }

  function updateRingtoneDevice() {
    const selectedDevices = Array.from(ringtoneDevices.children)
      .filter((node) => node.selected)
      .map((node) => node.getAttribute('data-id'));

    device.audio.ringtoneDevices.set(selectedDevices);
  }

  function bindVolumeIndicators(call) {
    call.on('volume', function (inputVolume, outputVolume) {
      let inputColor = 'red';
      if (inputVolume < 0.5) {
        inputColor = 'green';
      } else if (inputVolume < 0.75) {
        inputColor = 'yellow';
      }

      inputVolumeBar.style.width = `${Math.floor(inputVolume * 300)}px`;
      inputVolumeBar.style.background = inputColor;

      let outputColor = 'red';
      if (outputVolume < 0.5) {
        outputColor = 'green';
      } else if (outputVolume < 0.75) {
        outputColor = 'yellow';
      }

      outputVolumeBar.style.width = `${Math.floor(outputVolume * 300)}px`;
      outputVolumeBar.style.background = outputColor;
    });
  }

  // MISC USER INTERFACE
  function log(message) {
    logDiv.innerHTML += `<p class="log-entry">&gt;&nbsp; ${message} </p>`;
    logDiv.scrollTop = logDiv.scrollHeight;
  }

  function setClientNameUI(clientName) {
    const div = document.getElementById('client-name');
    div.innerHTML = `Usuario conectado: <strong>${clientName}</strong>`;
  }

  function resetIncomingCallUI() {
    incomingPhoneNumberEl.innerHTML = '';
    incomingCallAcceptButton.classList.remove('hide');
    incomingCallRejectButton.classList.remove('hide');
    incomingCallHangupButton.classList.add('hide');
    incomingCallDiv.classList.add('hide');
  }

  function updateUIAcceptedOutgoingCall(call) {
    log('Llamada en curso ...');
    callButton.disabled = true;
    outgoingCallHangupButton.classList.remove('hide');
    volumeIndicators.classList.remove('hide');
    bindVolumeIndicators(call);
    startTimer(); // <-- Inicia el temporizador aquí
  }

  function updateUIDisconnectedOutgoingCall() {
    log('Llamada desconectada.');
    callButton.disabled = false;
    outgoingCallHangupButton.classList.add('hide');
    volumeIndicators.classList.add('hide');
    stopTimer(); // <-- Detiene el temporizador y registra la duración
  }

  function rejectIncomingCall(call) {
    call.reject();
    log('Llamada entrante rechazada');
    resetIncomingCallUI();
  }

  function hangupIncomingCall(call) {
    call.disconnect();
    log('Colgando llamada entrante');
    resetIncomingCallUI();
  }

  function handleDisconnectedIncomingCall() {
    log('Llamada entrante finalizada.');
    resetIncomingCallUI();
    stopTimer(); // <-- Detiene el temporizador y registra la duración
  }

  function handleAcceptedIncomingCall(call) {
    log('Llamada entrante aceptada.');
    incomingCallAcceptButton.classList.add('hide');
    incomingCallRejectButton.classList.add('hide');
    incomingCallHangupButton.classList.remove('hide');
    bindVolumeIndicators(call);
    startTimer(); // <-- Inicia el temporizador aquí
  }

  function handleIncomingCall(call) {
    log(`Llamada entrante desde ${call.parameters.From}`);
    incomingCallDiv.classList.remove('hide');
    incomingPhoneNumberEl.innerHTML = call.parameters.From;

    incomingCallAcceptButton.onclick = () => {
      call.accept();
    };

    incomingCallRejectButton.onclick = () => {
      rejectIncomingCall(call);
    };

    incomingCallHangupButton.onclick = () => {
      hangupIncomingCall(call);
    };

    call.on('accept', handleAcceptedIncomingCall); // <-- Escucha el evento 'accept'
    call.on('cancel', handleDisconnectedIncomingCall);
    call.on('disconnect', handleDisconnectedIncomingCall);
    call.on('reject', handleDisconnectedIncomingCall);
  }

  async function makeOutgoingCall() {
    const params = {
      To: phoneNumberInput.value,
    };

    if (device) {
      log(`Intentando llamar a ${params.To} ...`);
      const call = await device.connect({ params });

      call.on('accept', updateUIAcceptedOutgoingCall);
      call.on('disconnect', updateUIDisconnectedOutgoingCall);
      call.on('cancel', updateUIDisconnectedOutgoingCall);
      call.on('reject', updateUIDisconnectedOutgoingCall);

      outgoingCallHangupButton.onclick = () => {
        log('Colgando ...');
        call.disconnect();
      };
    } else {
      log('No se pudo hacer la llamada.');
    }
  }

  function addDeviceListeners(device) {
    device.on('registered', function () {
      log('Twilio.Device listo para hacer y recibir llamadas.');
      callControlsDiv.classList.remove('hide');
    });

    device.on('error', function (error) {
      log(`Twilio.Device Error: ${error.message}`);
    });

    device.on('incoming', handleIncomingCall);

    device.audio.on('deviceChange', updateAllAudioDevices.bind(device));

    if (device.audio.isOutputSelectionSupported) {
      audioSelectionDiv.classList.remove('hide');
    }
  }

  function initializeDevice() {
    logDiv.classList.remove('hide');
    log('Inicializando dispositivo');
    device = new Twilio.Device(accessToken, {
      debug: true,
      answerOnBridge: true,
      codecPreferences: ['opus', 'pcmu'],
    });

    addDeviceListeners(device);
    device.register();
  }

  async function startupClient() {
    log('Solicitando Token de Acceso...');
    try {
      const { token, identity } = await $.getJSON(
        'https://voice-twilio-8416-dev.twil.io/voice-token'
      );
      log('Token obtenido.');
      accessToken = token;
      setClientNameUI(identity);

      initializeDevice();
    } catch (err) {
      console.log(err);
      log('Ocurrió un error. Revisa la consola del navegador para más información.');
    }
  }
  startupButton.addEventListener('click', startupClient);

  // Event Listeners
  callButton.onclick = (e) => {
    e.preventDefault();
    makeOutgoingCall();
  };
  getAudioDevicesButton.onclick = getAudioDevices;
  speakerDevices.addEventListener('change', updateOutputDevice);
  ringtoneDevices.addEventListener('change', updateRingtoneDevice);

  // NUEVA FUNCIONALIDAD: Obtener y mostrar el historial de llamadas
  function fetchCallHistory() {
    log('Solicitando historial de llamadas...');
    callHistoryLogDiv.innerHTML = ''; // Limpia el historial anterior

    $.getJSON('https://voice-twilio-8416-dev.twil.io/call-history')
      .done(function(history) {
        if (history.length > 0) {
          log(`Historial de llamadas obtenido. Mostrando ${history.length} registros.`);
          let historyHTML = '<table><thead><tr><th>Destino</th><th>Duración</th><th>Fecha</th></tr></thead><tbody>';
          history.forEach(call => {
            const callDate = new Date(call.date).toLocaleString('es-CO');
            const callDuration = `${call.duration} seg`;
            historyHTML += `
              <tr>
                <td>${call.to}</td>
                <td>${callDuration}</td>
                <td>${callDate}</td>
              </tr>
            `;
          });
          historyHTML += '</tbody></table>';
          callHistoryLogDiv.innerHTML = historyHTML;
        } else {
          log('No se encontraron llamadas en el historial reciente.');
          callHistoryLogDiv.innerHTML = '<p>No hay llamadas para mostrar.</p>';
        }
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        log('Ocurrió un error al obtener el historial de llamadas. Revisa la consola.');
        callHistoryLogDiv.innerHTML = '<p>Error al cargar el historial.</p>';
        console.error('Error de solicitud:', textStatus, errorThrown);
        console.error('Respuesta del servidor:', jqXHR.responseText);
      });
  }

  fetchHistoryButton.addEventListener('click', fetchCallHistory);
});