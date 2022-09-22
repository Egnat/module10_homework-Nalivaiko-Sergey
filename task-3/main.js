/*Эта итоговая практика потребует от вас комбинации алгоритмов решения как актуального модуля,
 так и ранее изученных тем (инструменты работы в браузере).

Задание 3.

Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».

При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.

Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:
Добавить в чат механизм отправки гео-локации:
При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести ссылку 
на https://www.openstreetmap.org/ с вашей гео-локацией. 
Сообщение, которое отправит обратно эхо-сервер, не выводить.*/

// Создаем объект вебсокет
const websocket = new WebSocket('wss://echo-ws-service.herokuapp.com');

// Нахожу элементы и записываю в переменные для дальнейшего использования
const inputShowData = document.querySelector('.message');
const placeholder = 'Введите текст сообщения';
const btnSend = document.querySelector('.btn-message');
const btnGeo = document.querySelector('.btn-geo');
const text_window = document.querySelector('.text_window');
const mapLink = document.querySelector('#map-link');

// Поведение объектa websocket
websocket.onopen = function(event) {
  console.log("CONNECT");
};

websocket.onerror = function(event) {
  console.log(event.data);
};

websocket.onmessage = function(event) {
  addMessage(event.data, 'flex-start');
  console.log(event.data);

// Функция для добавления сообщений в чат, ответ эхо-сервера
function addMessage(message, place='flex-start') {
  let serverResponse = `<p class='message-window' style='background-color: #891f1f; color: #fff; margin-top: 14px; margin-bottom: 16px; 
  margin-left: 10px; align-self: ${place}'>${message}</p>`;
  let chat = text_window.innerHTML;
  text_window.innerHTML = chat + serverResponse;
  }
}; 

// Функция для добавления сообщений в чат, запрос
function addMessage(message, place='flex-end') {
  let myMessage = `<p class='message-window' style='background-color: #000; color: #fff; margin-top: 14px; margin-right: 10px; 
  margin-bottom: 16px; align-self: ${place}'>${message}</p>`;
  let chat = text_window.innerHTML;
  text_window.innerHTML = chat + myMessage;
}

//Обработчик на кнопке отправки сообщения
btnSend.addEventListener('click', () => {
  let message = inputShowData.value;
    websocket.send(message);
    addMessage(message);
  inputShowData.value = ('');
});

//Поведение при определении геолокация:
//1 Функция, выводящая текст об ошибке
const error = () => {
  text_window.textContent = "Локация не определена";
   //const error = "Локация не определена";
     //addMessage(error);
};

//2 Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
  console.log("position", position);
  const latitude = position.coords.latitude; // Получаю широту
  const longitude = position.coords.longitude; // Получаю долготу
  mapLink.href = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
  text_window.textContent = `Широта: ${latitude} °, Долгота: ${longitude} °`; // Выводим их в блок text_window
  mapLink.textContent = 'Ссылка на карту';

  // Добавляю и вывожу ссылку в чат
  let addLink = `<a href='${mapLink.href}' target='_blank'>Ссылка на карту</a>`;
  let chat = text_window.innerHTML;
  text_window.innerHTML = chat + addLink;
};

// Обработчик на кнопке геопозиции
btnGeo.addEventListener('click', () => {
  mapLink.href = (''); // Зачищаю у map-link если клик происходит в первый раз
  mapLink.textContent = (''); // Зачищаем у map-link если клик происходит в первый раз
  // Работа с API геолокации, проверка на поддержку браузера пользователя в получении геолокации
  // Проверяем наличие объекта. Есть - ок. 
  if ('geolocation' in navigator) {
    text_window.textContent = 'Определение местоположения…'; // Выводится в блок text_window
    navigator.geolocation.getCurrentPosition(success, error); // Обращение единичное к геолокации методом, 
    //он принимает два параметра(callbacks) success, error(не обязательный) и есть еще options(не обязательный)
    //alert('ok');
  } else {
    alert('not good');
    console.log("Геолокация не доступна"); // Нет - не ок. Выводится в блок text_window
  }
});

// Прерывaется соединения с сервером
websocket.onclose = function(event) {
  alert(`Соединение закрыто чисто`);
  console.log("CLOSE");
};