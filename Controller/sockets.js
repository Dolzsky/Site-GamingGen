/*
 * Version Alpha 1.0.0
 * Date de modification 24/06/2016
 *
 * Socket.js
 *  Gère toute les communications dynamique
 * 
 * Conçu par l'équipe de Gaming Gen :
 *  - Jérémy Young      <darkterra01@gmail.com>
 */

'use strict';

let socketio			= require('socket.io');
let check					= require('check-types');

module.exports.listen = function(server, sessionMiddleware, ServerEvent, colors) {
    let io							= socketio.listen(server);
    let printerClientId	= "";
    let printerCookId		= "";
    let toogleLive			= false; // TODO A déplacer
    
    // Configuration de Socket.IO pour pouvoir avoir accès au sessions
		io.use(function(socket, next) {
			sessionMiddleware(socket.request, socket.request.res, next);
		});
		
		
		ServerEvent.on('isMailExistResult', function(data, socket) {
			socket.emit('isMailExist', data);
			console.log('EmitClient: isMailExistResult');
		});
		
		ServerEvent.on('isPseudoExistResult', function(data, socket) {
			socket.emit('isPseudoExist', data);
			console.log('EmitClient: isPseudoExistResult');
		});
		
		ServerEvent.on('OrderSaved', function(data, socket) {
			// console.log(printerClientId);
			// console.log(printerCookId);
			if (check.nonEmptyString(printerClientId)) {
				io.to(printerClientId).emit('generate&printPDF', data);
				// socket.emit('generate&printPDF', data);
				console.log('EmitClient: generate&printPDF');
			}
			if (check.nonEmptyString(printerCookId)) {
				io.to(printerCookId).emit('generate&printPDF', data);
				// socket.emit('generate&printPDF', data);
				console.log('EmitCook: generate&printPDF');
			}
		});
		
		ServerEvent.on('ArticleSaved', function(data, socket) {
			io.sockets.emit('NewArticle', data);
		});
		
		ServerEvent.on('AllOrdersFound', function(data, socket) {
			socket.emit('AllOrders', data);
			console.log('EmitClient: AllOrders');
		});
		
		ServerEvent.on('RePrintOrderFind', function(data) {
			if (check.nonEmptyString(printerClientId) && data != null) {
				io.to(printerClientId).emit('generate&printPDF', data);
				console.log('EmitClient: generate&printPDF');
			}
		});
		
		ServerEvent.on('ClientPrinterPrintedDone', function(data) {
			io.sockets.emit('ClientPrinterPrintedDone', data);
		});
		
		/***********************************************************************************
		*														Initialisation des variables												   *
		***********************************************************************************/
    // Ouverture de la socket
    io.sockets.on('connection', function (socket) {
  	
  	console.log('Client Connecté');
  	
  	
  	socket.on('isMailExist', function(data) {
  		ServerEvent.emit('isMailExist', data, socket);
  	});
  	
  	socket.on('isPseudoExist', function(data) {
  		ServerEvent.emit('isPseudoExist', data, socket);
  	});
  	
  	socket.on('IamTheClientPrinter', function() {
  		if (check.emptyString(printerClientId)) {
    		printerClientId = socket.id;
  			console.log('Printer Client Found');
  			console.log(socket.id);
  		}
  	});
  	
  	socket.on('IamTheCookPrinter', function() {
  		if (check.emptyString(printerCookId)) {
    		printerCookId = socket.id;
  			console.log('Printer Cook Found');
  			console.log(socket.id);
  		}
  	});
  	
  	
  	
  	socket.on('saveConf', function(data) {
  		ServerEvent.emit('saveConf', data);
			console.log('Emit: saveConf');
  	});
  	
  	
  	
  	socket.on('saveMenuSnack', function(data) {
  		ServerEvent.emit('saveMenuSnack', data);
			console.log('Emit: saveMenuSnack');
  	});
  	
  	
  	socket.on('RePrintPDF', function(data) {
  		ServerEvent.emit('RePrintPDF', data, socket);
  	});
  	
  	socket.on('generatePDF', function(data) {
  		console.log('Reception order Client');
  		ServerEvent.emit('saveOrder', data, socket);
			console.log('Emit: saveOrder');
  	});
  	
  	socket.on('saveArticle', function(data) {
  		console.log('Reception article Client');
  		ServerEvent.emit('saveArticle', data, socket);
			console.log('Emit: saveArticle');
  	});
  	
  	socket.on('getAllOrders', function() {
  		ServerEvent.emit('findAllOrders', socket);
			console.log('Emit: findAllOrders');
  	});
  	
  	socket.on('ClientPrinterPrinted', function(number) {
  		ServerEvent.emit('ClientPrinterPrinted', number);
			console.log('Emit: ClientPrinterPrinted');
  	});
  	
  	socket.on('getToogleLive', function() {
  		socket.emit('getToogleLive', toogleLive);
  	});
  	
  	socket.on('toogleLive', function() {
  		toogleLive = !toogleLive;
  		console.log(toogleLive);
  		io.sockets.emit('toogleLive', toogleLive);
  	});
		
		// ----------------------- Décompte uniquement des User Connecté ----------------------- //
		socket.on('disconnect', function(){
			console.log('Client Disconnect');
				if (check.nonEmptyString(printerClientId) && socket.id == printerClientId) {
					printerClientId = "";
					console.log('We lost the Client Printer');
				}
				if (check.nonEmptyString(printerCookId) && socket.id == printerCookId) {
					printerCookId = "";
					console.log('We lost the Cook Printer');
				}
		});
	});
};

/***********************************************************************************
*												Différentes possibilité d'émissions											   *
***********************************************************************************/
/*
// send to current request socket client
socket.emit('message', "this is a test");

// sending to all clients, include sender
io.sockets.emit('message', "this is a test");

// sending to all clients except sender
socket.broadcast.emit('message', "this is a test");

// sending to all clients in 'game' room(channel) except sender
socket.broadcast.to('game').emit('message', 'nice game');

// sending to all clients in 'game' room(channel), include sender
io.sockets.in('game').emit('message', 'cool game');

// sending to individual socketid
io.sockets.socket(socketid).emit('message', 'for your eyes only');
*/