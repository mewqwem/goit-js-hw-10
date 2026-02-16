import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
//! declaretions
const submitBtn = document.querySelector('.submit-btn');
const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);

  const data = Object.fromEntries(formData.entries());
  const delay = Number(data.delay);
  const state = data.state;

  createPromise(delay, state)
    .then(({ delay }) => {
      iziToast.show({
        title: '',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
        backgroundColor: '#59a10d',
        titleColor: '#fff',
        messageColor: '#fff',
        close: false,
      });
    })
    .catch(({ delay }) => {
      iziToast.show({
        title: '',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
        backgroundColor: '#ef4040',
        titleColor: '#fff',
        messageColor: '#fff',
      });
    });
});

function createPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve({ delay, state });
      } else {
        reject({ delay, state });
      }
    }, delay);
  });
}
