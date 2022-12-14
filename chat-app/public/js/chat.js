const socket = io();

//Elements
const $messageForm = document.querySelector('#message-form');
const $messageFormInput = $messageForm.querySelector('input');
const $messageFormButton = $messageForm.querySelector('button');
const $sendLocationButton = document.querySelector('#send-location');
const $messages = document.querySelector('#messages');
const $sidebar = document.querySelector('#sidebar');

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML;
const locationTemplate = document.querySelector('#location-template').innerHTML;
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

//Options

const {username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true});

const autoscroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('HH:mm')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('locationMessage', (location) => {
    const html = Mustache.render(locationTemplate, {
        username: location.username,
        locationMessage: location.text,
        createdAt: moment(location.createdAt).format('HH:mm')
    });
    $messages.insertAdjacentHTML('beforeend', html);
    autoscroll();
});

socket.on('roomData', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    });
    $sidebar.innerHTML = html;
});

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    $messageFormButton.disabled = true; //Deshabilitar boton hasta que se envie el msg

    let message = e.target.elements.message.value;
    socket.emit('sendMessage', message, (err) => {
         //Habilitar boton
        $messageFormButton.disabled = false;
        $messageFormInput.value = '';
        $messageFormInput.focus();

        if(err) return console.log(err);
        console.log('Message delivered');
    });
});

document.querySelector('#send-location').addEventListener('click', () => {
    $sendLocationButton.disabled = true;
    if(!navigator.geolocation){
        return alert('Geolocation is not supporterd by your browser')
    }

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position);
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.disabled = false;
            console.log('Location shared');
        });
    });
});

socket.emit('join', {username, room}, (err) => {
    if(err) {
        alert(err);
        location.href = '/';
    }
})