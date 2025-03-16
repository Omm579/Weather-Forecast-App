$(function() {
	if (!String.prototype.replaceAll) {
		String.prototype.replaceAll = function(str, newStr) {
			return this.replace(new RegExp(str, 'g'), newStr);
		}
	}

	const translateToCelsius = temp => Math.round(temp - 273.15);
	const isUndefined = prop => prop === undefined ? '--' : prop;
	const translateTommHg = pressure => (+pressure / 1.33322).toFixed(2);

	const searchInput = $('#search');
	const backgroundImage = $('#background');
	let timer, putData, isAnimated = false;

	const gifs = [
		'https://dl.dropbox.com/s/g5w8plbt793q54t/clouds.gif',
		'https://dl.dropbox.com/s/13ah9mvt4x65yrd/overcast.gif',
		'https://dl.dropbox.com/s/tqvkvy0764j7whz/clear.gif',
		'https://dl.dropbox.com/s/aqmpcy2yen2r76l/rain.gif',
		'https://dl.dropbox.com/s/y2yl1m8vf9jnclp/shower.gif',
		'https://dl.dropbox.com/s/a1rte50qzb9hrl7/thunderstorm_night.gif',
		'https://dl.dropbox.com/s/xz0tiglipdhbpot/snow_night.gif',
		'https://dl.dropbox.com/s/i39qcl58dyqnbu2/fog_night.gif',
		'https://dl.dropbox.com/s/a067lxoks5rfb38/tornado.gif',
		'https://dl.dropbox.com/s/56rleimgzx4wdtn/ash.gif',
		'https://dl.dropbox.com/s/4l10hqs0olr1rnf/squall.gif',
		'https://dl.dropbox.com/s/wricr7kzey10mkz/sand.gif',
		'https://dl.dropbox.com/s/2zq7iwgo3ja0adu/dust.gif',
		'https://dl.dropbox.com/s/xf6jcuac6mftx81/drizzle.gif',
		'https://dl.dropbox.com/s/syiwj1vdquwx6bh/clouds_night.gif',
		'https://dl.dropbox.com/s/qgw1jsphjoug631/fog.gif',
		'https://dl.dropbox.com/s/1j4y4yb98icdqjl/clear_night.gif',
		'https://dl.dropbox.com/s/3vyagrftk3xxmc8/overcast_night.gif',
		'https://dl.dropbox.com/s/bbukf51cyowhqmx/drizzle_night.gif',
		'https://dl.dropbox.com/s/exjmlzjxlcdjuk3/rain_night.gif',
		'https://dl.dropbox.com/s/3aj6a3ulv7xzn67/shower_night.gif',
		'https://dl.dropbox.com/s/lkdc8pwje40qeya/thunderstorm.gif',
		'https://dl.dropbox.com/s/v0xfb60w3d7za68/squall_night.gif',
		'https://dl.dropbox.com/s/x44q8r1wd43099y/snow.gif',
	];

	const elements = [
		$('#city'),
		$('#lon'),
		$('#lat'),
		$('#pressure'),
		$('#humidity'),
		$('#tempNow'),
		$('#main'),
		$('#description'),
		$('#min-temp'),
		$('#feels-like'),
		$('#max-temp'),
		$('#clouds-info'),
		$('#wind-speed'),
		$('#wind-gust'),
		$('#wind-direction-deg'),
		$('#visibility'),
		$('#sunrise-info'),
		$('#sunset-info'),
	];

	const weatherIconUrls = [
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/d8h5orcqxp3bbyx/cloud.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/dtoaxj2a36vd7xv/cloudy.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/36vtvi9k14oiy0a/fog.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/djcsj3zvqds7e79/rainy.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/vojkuxkisqkgfrr/snowy.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/48uw4q5wwlu7u57/storm.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/vmg2ji85bb9l32e/sun.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/ypz0h9i6h9iybdu/tornado.png',
		//Icon made by Freepik from www.flaticon.com
		'https://dl.dropbox.com/s/d2jvqzz45byh7ei/volcano.png',
		//Icon made by Freepik from www.flaticon.com
		'https://dl.dropbox.com/s/zmk8l5l5waf4kxa/sand%20%26%20dust.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/pfr8bjapd11dj38/windy.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/mpan3m17gy1wmuo/clear_night.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/cmm4ddcxkhvjns7/cloud_night.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/4yd6fa8ql5v99ec/cloudy_night.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/quzc6ydryv2qg7b/rain_night.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/3qlivniiec07qdn/snow_night.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/51c6i3rzf0gnsfp/storm_night.png',
		//Icon made by iconixar from www.flaticon.com
		'https://dl.dropbox.com/s/9j6zaxfvuy3jiba/windy_night.png',
	];

	const weatherIcon = $('<img id="weather-icon"/>');

	const getWeather = async city => {
		weatherIcon[0].src = '';
		isAnimated = true;

		const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=d86fa358a80e6dfd27f16993aed89607`);

		if (!response.ok) {
			console.clear();
			swal("Oops!", `An error has occurred. Such city wasn't found.\nPlease write the correct city name you are looking for.`, 'error');
			isAnimated = false;
			return;
		}

		const json = await response.json();

		const sunrise = new Date(json.sys.sunrise * 1000);
		const sunset = new Date(json.sys.sunset * 1000);

		let sunriseHoursUTC = sunrise.getUTCHours();
		let sunriseMinutesUTC = sunrise.getUTCMinutes();

		let sunsetHoursUTC = sunset.getUTCHours();
		let sunsetMinutesUTC = sunset.getUTCMinutes();

		const sunriseMinutesUTCBeforeCorrect = sunriseMinutesUTC;
		const sunsetMinutesUTCBeforeCorrect = sunsetMinutesUTC;

		let timezone = json.timezone / 3600;

		timezone = timezone < 0 ? 24 + timezone : timezone;

		sunriseMinutesUTC = timezone > 0 && timezone.toString().includes('.5') ? sunriseMinutesUTC + 30 : sunriseMinutesUTC;
		sunsetMinutesUTC = timezone > 0 && timezone.toString().includes('.5') ? sunsetMinutesUTC + 30 : sunsetMinutesUTC;

		sunriseMinutesUTC = timezone > 0 && timezone.toString().includes('.75') ? sunriseMinutesUTC + 45 : sunriseMinutesUTC;
		sunsetMinutesUTC = timezone > 0 && timezone.toString().includes('.75') ? sunsetMinutesUTC + 45 : sunsetMinutesUTC;

		sunriseMinutesUTC = sunriseMinutesUTC >= 60 ? sunriseMinutesUTC - 60 : sunriseMinutesUTC;
		sunsetMinutesUTC = sunsetMinutesUTC >= 60 ? sunsetMinutesUTC - 60 : sunsetMinutesUTC;

		let sunriseTime = sunriseHoursUTC + timezone;
		let sunsetTime = sunsetHoursUTC + timezone;

		if (timezone.toString().includes('.5') || timezone.toString().includes('.75')) {
			sunriseTime = Math.trunc(sunriseTime);
			sunsetTime = Math.trunc(sunsetTime);
		}

		if (sunriseMinutesUTCBeforeCorrect > 30 && timezone.toString().includes('.5') ||
			sunriseMinutesUTCBeforeCorrect > 30 && timezone.toString().includes('.75')) {
			sunriseTime = Math.trunc(sunriseTime) + 1;
			sunsetTime = Math.trunc(sunsetTime) + 1;
		}

		const now = new Date();
		let hoursNow = now.getUTCHours() + timezone;
		const minutesNow = now.getUTCMinutes();

		hoursNow = hoursNow >= 24 ? hoursNow - 24 : hoursNow;

		sunriseTime = sunriseTime >= 24 ? sunriseTime - 24 : sunriseTime;
		sunsetTime = sunsetTime >= 24 ? sunsetTime - 24 : sunsetTime;
		sunriseTime = sunriseTime < 10 ? '0' + sunriseTime : sunriseTime;
		sunriseTime = sunriseTime > 24 && sunriseTime <= 33 ? '0' + sunriseTime : sunriseTime;

		sunriseMinutesUTC = sunriseMinutesUTC < 10 ? '0' + sunriseMinutesUTC : sunriseMinutesUTC;
		sunsetMinutesUTC = sunsetMinutesUTC < 10 ? '0' + sunsetMinutesUTC : sunsetMinutesUTC;

		function insertComma(num) {
			if (isNaN(+num)) return;
			return num.toString().split('.').join(',');
		}

		const lon = insertComma(json.coord.lon);
		const lat = insertComma(json.coord.lat);

		const tempNow = translateToCelsius(json.main.temp);
		const minTemp = translateToCelsius(json.main.temp_min);
		const maxTemp = translateToCelsius(json.main.temp_max);
		const feelsLike = translateToCelsius(json.main.feels_like);
		const weather = json.weather[0];
		const pressure = insertComma(translateTommHg(json.main.pressure));
		const wind = insertComma(json.wind.speed);
		const gust = insertComma(json.wind.gust);
		const visibility = insertComma(+(json.visibility / 1000).toFixed(2));

		const country = json.sys.country;

		const topWrapper = $('.top-wrapper');
		const min_temp = $('#min-temp');
		const feels_like = $('#feels-like');
		const max_temp = $('#max-temp');
		const windSpeed = $('#wind-speed');
		const windGust = $('#wind-gust');
		const windDirection = $('#wind-direction-deg');

		putData = () => {
			topWrapper.css('background', `transparent`);
			min_temp.css('background', `transparent`);
			feels_like.css('background', `transparent`);
			max_temp.css('background', `transparent`);
			windSpeed.css('background', `transparent`);
			windGust.css('background', `transparent`);
			windDirection.css('background', `transparent`);

			elements[0].html(isUndefined(`${json.name}, ${isUndefined(country)} ${weatherIcon[0].outerHTML}`));
			elements[1].text(`Longitude ${isUndefined(lon)}`);
			elements[2].text(`Latitude ${isUndefined(lat)}`);
			elements[3].text(`Pressure ${isUndefined(pressure)}`);
			elements[4].text(`Humidity ${isUndefined(json.main.humidity)}%`);
			elements[5].text(`${isUndefined(tempNow)}°C`);
			elements[6].text(`${isUndefined(weather.main)}`);
			elements[7].text(`${isUndefined(weather.description)}`);
			elements[8].text(`Min ${isUndefined(minTemp)} °C`);
			elements[9].text(`Feels like ${isUndefined(feelsLike)} °C`);
			elements[10].text(`Max ${isUndefined(maxTemp)} °C`);
			elements[11].text(`Cloudiness ${isUndefined(json.clouds.all)}%`);
			elements[12].text(`Wind ${isUndefined(wind)} m/s`);
			elements[13].text(`Gust ${isUndefined(gust)} m/s`);
			elements[14].text(`Direction ${isUndefined(json.wind.deg)}°`);
			elements[15].text(`Visibility ${isUndefined(visibility)} km`);
			elements[16].text(`Sunrise ${isUndefined(sunriseTime)}:${sunriseMinutesUTC}`);
			elements[17].text(`Sunset ${isUndefined(sunsetTime)}:${sunsetMinutesUTC}`);

			searchInput.val(elements[0][0].textContent);
			return;
		};

		if (hoursNow > sunsetTime || hoursNow < sunriseTime) {
			weatherIcon[0].src = weather.main.includes('Cloud') ? weatherIconUrls[12] :
				weather.main.includes('Clear') ? weatherIconUrls[11] :
				weather.description.includes('rain') || weather.main.includes('Drizzle') || weather.description.includes('shower rain') ? weatherIconUrls[14] :
				weather.description.includes('overcast') ? weatherIconUrls[13] :
				weather.main.includes('Snow') || weather.description.includes('snow') ? weatherIconUrls[15] :
				weather.main.includes('Squall') ? weatherIconUrls[17] :
				weather.description.includes('thunderstorm') ? weatherIconUrls[16] :
				weather.main.includes('Haze') || weather.main.includes('Smoke') || weather.main.includes('Fog') || weather.main.includes('Mist') ? weatherIconUrls[2] : ''

			backgroundImage.attr('src',
				weather.main.includes('Cloud') ? gifs[14] :
				weather.main.includes('Clear') ? gifs[16] :
				weather.description.includes('shower rain') ? gifs[20] :
				weather.description.includes('overcast') ? gifs[17] :
				weather.main.includes('Drizzle') ? gifs[18] :
				weather.description.includes('rain') ? gifs[19] :
				weather.main.includes('Snow') || weather.description.includes('snow') ? gifs[6] :
				weather.main.includes('Squall') ? gifs[22] :
				weather.description.includes('thunderstorm') ? gifs[5] :
				weather.main.includes('Haze') || weather.main.includes('Smoke') || weather.main.includes('Fog') || weather.main.includes('Mist') ? gifs[7] : ''
			);
		} else {
			weatherIcon[0].src = weather.description.includes('overcast') ? weatherIconUrls[0] :
				weather.main.includes('Cloud') ? weatherIconUrls[1] :
				weather.main.includes('Clear') ? weatherIconUrls[6] :
				weather.description.includes('rain') || weather.description.includes('shower rain') || weather.main.includes('Drizzle') ? weatherIconUrls[3] :
				weather.description.includes('thunderstorm') ? weatherIconUrls[5] :
				weather.main.includes('Snow') || weather.description.includes('snow') ? weatherIconUrls[4] :
				weather.main.includes('Haze') || weather.main.includes('Smoke') || weather.main.includes('Fog') || weather.main.includes('Mist') ? weatherIconUrls[2] :
				weather.main.includes('Tornado') ? weatherIconUrls[7] :
				weather.main.includes('Ash') ? weatherIconUrls[8] :
				weather.main.includes('Squall') ? weatherIconUrls[10] :
				weather.main.includes('Sand') || weather.main.includes('Dust') ? weatherIconUrls[9] : ''

			backgroundImage.attr('src',
				weather.main.includes('Cloud') ? gifs[0] :
				weather.description.includes('overcast') ? gifs[1] :
				weather.main.includes('Clear') ? gifs[2] :
				weather.description.includes('shower rain') ? gifs[4] :
				weather.description.includes('rain') ? gifs[3] :
				weather.description.includes('thunderstorm') ? gifs[21] :
				weather.main.includes('Snow') || weather.description.includes('snow') ? gifs[23] :
				weather.main.includes('Haze') || weather.main.includes('Smoke') || weather.main.includes('Fog') || weather.main.includes('Mist') ? gifs[15] :
				weather.main.includes('Tornado') ? gifs[8] :
				weather.main.includes('Ash') ? gifs[9] :
				weather.main.includes('Squall') ? gifs[10] :
				weather.main.includes('Sand') ? gifs[11] :
				weather.main.includes('Dust') ? gifs[12] :
				weather.main.includes('Drizzle') ? gifs[13] : ''
			);
		}

		let i = 0,
			j = 200,
			k;

		timer = setInterval(() => {
			for (const el of elements) {
				el.text('');
			}

			j === 300 || j === 200 ? k = j : null;

			if (k === 300) {
				topWrapper.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				min_temp.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				feels_like.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				max_temp.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				windSpeed.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				windGust.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				windDirection.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				i--;
				j--;
			}

			if (k === 200) {
				topWrapper.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				min_temp.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				feels_like.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				max_temp.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				windSpeed.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				windGust.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				windDirection.css('background', `linear-gradient(-270deg, #424242 ${i}%, #d2d2d2 ${j}%)`);
				i++;
				j++;
			}

		}, 10);

	};

	const handleInputSearch = () => {
		const emptyValue = !searchInput.val().length;
		const currentCityName = elements[0][0].textContent.toUpperCase().replaceAll(' ', '').split(',').join('');
		const searchingCityName = searchInput.val().toUpperCase().replaceAll(' ', '').split(',').join('');

		const samePlace = currentCityName === searchingCityName;
		if (isAnimated || emptyValue || samePlace) return;
		getWeather(searchInput.val());
	};

	const handleKeyPress = e => {
		const code = e.originalEvent.code;
		const key = e.originalEvent.key;

		if (code === 'Enter' || key === 'Enter') handleInputSearch();
	};

	$('#button').on('click', handleInputSearch);
	searchInput.on('keypress', handleKeyPress);

	backgroundImage.on('load', function() {
		isAnimated = false;
		clearInterval(timer);
		setTimeout(() => {
			putData();
		}, 25);
	});

	setTimeout(getWeather, 0, 'Moscow');
});
