import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

//! DECLARATIONS
const startBtn = document.querySelector('#timer-start-btn');
let userSelectedDate = null;
let timerId = null;

//! refs
const refs = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
  input: document.querySelector('#datetime-picker'),
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    if (selectedDates[0] < new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future!',
        position: 'topRight',
        backgroundColor: '#ef4040',
        titleColor: '#fff',
        messageColor: '#fff',
        iconColor: '#fff',
        color: '#fff',
      });
      startBtn.classList.add('disabled');
      return;
    }
    startBtn.classList.remove('disabled');

    userSelectedDate = selectedDates[0];

    console.log(selectedDates[0]);
  },
};

flatpickr('#datetime-picker', options);

//! functions
function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
function pad(value) {
  return String(value).padStart(2, '0');
}
function resetTimerInterface({ days, hours, minutes, seconds }) {
  refs.days.textContent = pad(days);
  refs.hours.textContent = pad(hours);
  refs.minutes.textContent = pad(minutes);
  refs.seconds.textContent = pad(seconds);
}

//! listeners
startBtn.addEventListener('click', () => {
  const tick = () => {
    const currentTime = new Date();
    const deltaTime = userSelectedDate - currentTime;

    startBtn.classList.add('disabled');
    refs.input.classList.add('disabled');

    if (deltaTime <= 0) {
      clearInterval(timerId);
      resetTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({
        title: 'Success',
        message: 'Timer has finished!',
        position: 'topRight',
      });
      return;
    }

    const time = convertMs(deltaTime);
    resetTimerInterface(time);
  };

  tick();

  timerId = setInterval(tick, 1000);
});
