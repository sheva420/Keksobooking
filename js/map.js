'use strict';

//Вспомогательные функции
//Определение случайного числа в заданом интервале
var getRandomNumber = function (min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min)
};

//Случайный элемент
var getRandomElement = function (array) {
	return array[Math.floor(array.length * Math.random())]
};

//Изменение длины массива
var getArray = function (array) {
	var n = getRandomNumber(1, array.length);
	return array.slice(array.splice(n))
};

var data = {
	'titles': ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'],
	'types': ['palace', 'flat', 'house', 'bungalo'],
	'times': ['12:00', '13:00', '14:00'],
	'features': ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'],
	'photos': ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg']
};

//Создание объявления
var createOffer = function () {
	var array = [];

	for (var i = 1; i <= 8; i++) {
		var location = {
			'x': getRandomNumber(130, 630),
			//разобраться с коррдинатами Х
			'y': getRandomNumber(130, 630)
		};

		array.push({
			'author': {
				'avatar': 'img/avatars/user0' + i + '.png'
			},

			'offer': {
				'title': data.titles[i],
				'address': location.x + ', ' + location.y,
				'price': getRandomNumber(1000, 1000000),
				'type': getRandomElement(data.types),
				'rooms': getRandomNumber(1, 5),
				'guests': getRandomNumber(1, 3),
				'checkin': getRandomElement(data.times),
				'checkout': getRandomElement(data.times),
				'features': getArray(data.features),
				'description': '',
				'photos': data.photos
				//photos перемешать!
			},

			'location': {
				'x': location.x,
				'y': location.y
			}
		})
	}

	return array;
};

var offers = createOffer();

//Отображение карты
document.querySelector('.map').classList.remove('map--faded');

//Создание пинов с аватарами пользователей
var createPins = function (object) {
	var pinTamplate = document.querySelector('#map__tamplate').content.querySelector('.map__pin');

	var pinElement = pinTamplate.cloneNode(true);
	var pinAvatar = pinElement.querySelector('.map__pin img');

	pinElement.style = 'left: ' + object.location.x + 'px; top: ' + object.location.y + 'px';
	pinAvatar.src = object.author.avatar;
	pinAvatar.alt = object.offer.title;

	return pinElement;
};

//Отрисовка пинов
var renderPins = function (array) {
	var mapPinsList = document.querySelector('.map__pins');

	for (var i = 0; i < array.length; i++) {
		mapPinsList.appendChild(createPins(array[i]));
	}
};

renderPins(offers);

//Определение типа жилья
var getType = function (element, object) {
	if (object.offer.type == 'palace') {
		element.innerText = 'Дворец'
	} else if (object.offer.type == 'flat') {
		element.innerText = 'Квартира'
	} else if (object.offer.type == 'house') {
		element.innerText = 'Дом'
	} else if (object.offer.type == 'bungalo') {
		element.innerText = 'Бунгало'
	}
};

//Добавление фотографий в объявление
var getPhotos = function (array) {
	var photosList = document.querySelector('.popup__pictures');

	photosList.innerHTML = '';

	array.forEach(function (item) {
		var liEl = document.createElement('li');
		var imgEl = document.createElement('img');
		imgEl.src = item;
		imgEl.width = 42;
		imgEl.height = 42;
		liEl.style = 'margin-right: 5px';
		liEl.appendChild(imgEl);
		photosList.appendChild(liEl.cloneNode(true));
	});
};

//Добавление списка удобств в объяление
var getFeatures = function (array) {
	var featuresList = document.querySelector('.popup__features');
	
	featuresList.innerHTML = '';

	array.forEach(function(item) {
		var featureElement = document.createElement('li');
		featureElement.setAttribute('class', 'feature feature--' + item);
		featuresList.appendChild(featureElement);
	});
};

//Отрисовка карточки с объявлением
var renderCard = function () {
	var cardTamplate = document.querySelector('#map__tamplate').content.querySelector('.map__card');
	var card = document.createElement('div');
	var cardContainer = document.querySelector('.map__filters-container');
	var element = cardTamplate.cloneNode(true);

	card.appendChild(element);
	cardContainer.before(card);
};

renderCard();

//Заполнение карточки с объявлением
var createCard = function (object) {
	var cardTitle = document.querySelector('.popup__title');
	var cardAddress = document.querySelector('.popup__text--address');
	var cardPrice = document.querySelector('.popup__price');
	var cardType = document.querySelector('.popup__type');
	var cardCapacity = document.querySelector('.popup__text--capacity');
	var cardTime = document.querySelector('.popup__text--time');
	var cardFeatures = document.querySelector('.popup__features');
	var cardDescription = document.querySelector('.popup__description');
	var cardPhotos = document.querySelector('.popup__pictures');
	var cardAvatar = document.querySelector('.popup__avatar');

	cardTitle.innerText = object.offer.title;
	cardAddress.innerText = object.offer.address;
	cardPrice.innerText = object.offer.price + '₽/ночь';
	getType(cardType, object);
	cardCapacity.innerText = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей.';
	cardTime.innerText = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
	cardFeatures = getFeatures(offers[0].offer.features);
	cardDescription.innerText = object.offer.description;
	cardPhotos = getPhotos(offers[0].offer.photos)
	cardAvatar.src = object.author.avatar;
};

createCard(offers[0]);