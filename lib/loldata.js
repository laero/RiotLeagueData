var https = require('https');

(function () {
	'use strict';

	var RiotData =  {},
					apiKey,
					region = 'na',
					riotHost = 'api.pvp.net',
					riotPath = '/api/lol/';
	            
	var Endpoints = {
						champion: '/v1.2/champion',
						game: '/v1.3/game/by-summoner',
						league: '/v2.5/league/by-summoner',
						status: '/shards',
						match: '/v2.2/match',
						matchHistory: '/v2.2/matchhistory',
						stats: '/v1.3/stats/by-summoner',
						summoner: '/v1.4/summoner',
						team: '/v2.3/team/by-summoner',
	                
						staticData: {
							staticEndpoint: '/static-data',
							champion: '/v1.2/champion',
							item: '/v1.2/item',
							languages: '/v1.2/languages',
							mastery: '/v1.2/mastery',
							realm: '/v1.2/realm',
							rune: '/v1.2/rune',
							summonerSpell: '/v1.2/summoner-spell',
							versions: '/v1.2/versions'
						}
					};

	RiotData.initialize = function (key, inputRegion) {
		apiKey = 'api_key=' + key;
		if (inputRegion) {
			region = inputRegion;
		}
		riotHost = region + '.' + riotHost;
	};

	var requestData = function(options, callback) {
		console.log('Starting req');
		var getRequest = https.request(options, function(response) {
			var data = '';
			console.log('status: ', response.statusCode);
			console.log(data);
			// console.log('headers: ', response.headers);
			// console.log(response);

			response.on('data', function (chunk) {
				console.log('Data chunk recieved.');
				data += chunk;
			});

			response.on('end', function () {
				console.log('All chunks recieved.');
				// console.log(data);
				callback(null, data);
			});

			response.on('error', function() {
				console.log('Error in getRequest occured.');
				callback(error);
			});

		});
		getRequest.end();
		getRequest.on('error', function(error) {
			callback(error);
			console.log('Error in requestData occured.');
			console.error(error);
		});
	};

	RiotData.buildEndpoint = function(inputPath) {
		var options = {
			host: riotHost,
			path: riotPath + region + inputPath + apiKey,
			method: 'GET'
		};
		return options;
	};

	RiotData.getChampions = function(free, callback) {
		var	options,
			paramFreeToPlay = '';
		if (free) {
			paramFreeToPlay = 'freeToPlay=true&';
		}
		options = RiotData.buildEndpoint(Endpoints.champion + '?' + paramFreeToPlay);
		requestData(options, callback);
	};

	RiotData.getChampionById = function(id, callback) {
		var	options;

		options = RiotData.buildEndpoint(Endpoints.champion + '/' + id + '?');
		console.log(options.host + options.path);
		requestData(options, callback);
	};

	module.exports = RiotData;

}());