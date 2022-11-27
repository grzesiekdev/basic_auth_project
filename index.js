// ładujemy moduł 'express'
const express = require("express");

// ładujemy moduł 'path'
var path = require('path');

// przygotowujemy do uruchomienia server node
const app = express();

// funkcja służąca do uwierzytelnienia usera. przyjmuje 3 parametry:
// req: request(wraz z nagłówkami) pobrany z serwera
// res: response, odpowiedź kierowana do użytkownika
// next: funkcja służąca do wykonywania konkretnej akcji po zakończeniu działania danego middleware (np zwracanie użytkownikowi kodu 401)
function authentication(req, res, next) {

    // pobranie nagłówków
	var authheader = req.headers.authorization;
	console.log(req.headers);

    // jeżeli nagłówki nie wskazują na to że nie mamy poświadczeń, to zwróć kod 401
	if (!authheader) {
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = 401;
		return next(err)
	}

    // pobierz dane od użytkownika (login, hasło)
	var auth = new Buffer.from(authheader.split(' ')[1],
	'base64').toString().split(':');
	var user = auth[0];
	var pass = auth[1];

    // sprawdź czy login i hasło są poprawne
	if (user == '' && pass == '') {

		// przejdź dalej jeśli dane są poprawne
		next();
	} else {
        // jeśli dane nie są poprawne, to zwróć kod 401
		var err = new Error('You are not authenticated!');
		res.setHeader('WWW-Authenticate', 'Basic');
		err.status = 401;
		return next(err);
	}

}

// uruchom sprawdzanie poświadczeń
app.use(authentication)

// wyświetl zawartość katalogu public/
app.use(express.static(path.join(__dirname, 'public')));

// uruchamiamy serwer pod portem 3000 więc na lokalnej maszynie dostępny będzie pod adresem 127.0.0.1:3000
app.listen((3000), () => {
	console.log("Server is Running");
})