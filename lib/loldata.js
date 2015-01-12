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
			var data;
			console.log('status: ', response.statusCode);
			// console.log('headers: ', response.headers);
			// console.log(response);

			response.on('data', function (chunk) {
				console.log('Data chunk recieved.');
				data += chunk;
			});

			response.on('end', function (d) {
				console.log('All chunks recieved.');
				console.log(data);
			});

			response.on('error', function() {
				console.log('');
			});

		});
		getRequest.end();
		getRequest.on('error', function(error) {
			callback(error);
			console.log('Error has occured.');
			console.error(error);
		});
	};

	RiotData.getChampions = function(free, callback) {
		var ParamFreeToPlay = '';
		if (free) {
			ParamFreeToPlay = 'freeToPlay=true&';
		}
		var options = {
			host: riotHost,
			path: riotPath + region + Endpoints.champion + '?' + ParamFreeToPlay + apiKey,
			method: 'GET'
		};

		requestData(options, callback);
	};

	module.exports = RiotData;

}());