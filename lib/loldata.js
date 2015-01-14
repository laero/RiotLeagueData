var https = require('https');

(function () {
	'use strict';

	var RiotData =  {},
					apiKey,
					region = 'na',
					riotHost = 'api.pvp.net',
					riotPath = '/api/lol';

	var Endpoints = {
		champion: '/v1.2/champion',
		game: '/v1.3/game/by-summoner',
		league: {
			summoner:'/v2.5/league/by-summoner',
			team: '/v2.5/league/by-team',
			challenger: '/v2.5/league/challenger'
		},
		status: '/shards',
		match: '/v2.2/match',
		matchHistory: '/v2.2/matchhistory',
		stats: '/v1.3/stats/by-summoner',
		summoner: '/v1.4/summoner',
		team: '/v2.3/team/by-summoner',


		// NOTE: static-data endpoints are functions, so they must be invoked.
		staticData: {
			champion: function() {
				return '/static-data' + '/' + region + '/v1.2/champion';
			},
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

	/*
	 * utility functions
	 */

	var buildEndpoint = function(inputPath) {
		var options = {
			host: riotHost,
			path: riotPath + '/' + region + inputPath + apiKey,
			method: 'GET'
		};
		return options;
	};

	var buildStaticEndpoint = function(inputPath) {
		var options = {
			host: riotHost,
			path: riotPath + inputPath + apiKey,
			method: 'GET'
		};
		return options;
	};

	var buildQueryParameters = function(queryParameters) {
		var params = '';
		for (var qp in queryParameters) {
			if (queryParameters.hasOwnProperty(qp)) {
				params += qp + "=" + queryParameters[qp] + '&';
			}
		}
		return params;
	};

	/*
	 * champion endpoint
	 */
	RiotData.getChampions = function(free, callback) {
		var	options,
			paramFreeToPlay = '';
		if (free) {
			paramFreeToPlay = 'freeToPlay=true&';
		}
		options = buildEndpoint(Endpoints.champion + '?' + paramFreeToPlay);
		requestData(options, callback);
	};

	RiotData.getChampionById = function(id, callback) {
		var	options;

		options = buildEndpoint(Endpoints.champion + '/' + id + '?');
		requestData(options, callback);
	};

	/*
	 * summoner endpoint
	 */
	RiotData.getRecentGamesBySummonerId = function(id, callback) {
		var	options;

		options = buildEndpoint(Endpoints.game + '/' + id + '/recent' + '?');
		requestData(options, callback);
	};

	/*
	 * league endpoint
	 */
	RiotData.getLeagueBySummonerId = function(id, callback) {
		var	options;

		options = buildEndpoint(Endpoints.league.summoner + '/' + id + '?');
		requestData(options, callback);
	};

	RiotData.getLeagueEntryBySummonerId = function(id, callback) {
		var	options;

		options = buildEndpoint(Endpoints.league.summoner + '/' + id + '/entry' + '?');
		requestData(options, callback);
	};

	RiotData.getLeagueByTeamId = function(id, callback) {
		var	options;

		options = buildEndpoint(Endpoints.league.team + '/' + id + '?');
		requestData(options, callback);
	};

	RiotData.getLeagueEntryByTeamId = function(id, callback) {
		var	options;

		options = buildEndpoint(Endpoints.league.team + '/' + id + '/entry' + '?');
		requestData(options, callback);
	};

	RiotData.getLeagueChallenger = function(type, callback) {
		var	options;

		options = buildEndpoint(Endpoints.league.challenger + '?type=' + type + '&');
		requestData(options, callback);
	};

	/*
	 * lol-static-data endpoint
	 */
	RiotData.getStaticChampions = function(queryParams, callback) {
		var	options;
		if (arguments.length === 1 && typeof queryParams === 'function') {
			callback = arguments[0];
			queryParams = {};
		}
		options = buildStaticEndpoint(Endpoints.staticData.champion() + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	/*
	 * lol-status endpoint
	 */

	/*
	 * match endpoint
	 */

	/*
	 * match-history endpoint
	 */

	/*
	 * stats endpoint
	 */

	/*
	 * summoner endpoint
	 */

	/*
	 * team endpoint
	 */
	module.exports = RiotData;

}());