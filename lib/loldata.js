var https = require('https');

(function () {
	'use strict';

	var RiotData =  {},
					apiKey,
					region = 'na',
					riotHost = 'api.pvp.net',
					riotPath = '/api/lol',
					shardHost = 'status.leagueoflegends.com';

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
		// NOTE: summoner, static-data, and team endpoints are functions, so they must be invoked.
		summoner: {
			byNames: function(names) {
				return '/v1.4/summoner/by-name/' + names;
			},
			byIds: function(ids) {
				return '/v1.4/summoner/' + ids;
			},
			masteries: function(ids) {
				return '/v1.4/summoner/' + ids + '/masteries';
			},
			name: function(ids) {
				return '/v1.4/summoner/' + ids + '/name';
			},
			runes: function(ids) {
				return '/v1.4/summoner/' + ids + '/runes';
			}
		},
		staticData: {
			champion: function() {
				return '/static-data' + '/' + region + '/v1.2/champion';
			},
			item: function() {
				return '/static-data' + '/' + region + '/v1.2/item';
			},
			languages: function() {
				return '/static-data' + '/' + region + '/v1.2/languages';
			},
			mastery: function() {
				return '/static-data' + '/' + region + '/v1.2/mastery';
			},
			realm: function() {
				return '/static-data' + '/' + region + '/v1.2/realm';
			},
			rune: function() {
				return '/static-data' + '/' + region + '/v1.2/rune';
			},
			summonerSpell: function() {
				return '/static-data' + '/' + region + '/v1.2/summoner-spell';
			},
			versions: function() {
				return '/static-data' + '/' + region + '/v1.2/versions';
			}
		},
		team: {
			bySummoner: function(ids) {
				return '/v2.4/team/by-summoner/' + ids;
			},
			byTeam: function(ids) {
				return '/v2.4/team/' + ids;
			}
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
		console.log('URI: ' + options.host + options.path);
		return options;
	};

	var buildStaticEndpoint = function(inputPath) {
		var options = {
			host: riotHost,
			path: riotPath + inputPath + apiKey,
			method: 'GET'
		};
		console.log('URI: ' + options.host + options.path);
		return options;
	};

	var buildShardEndpoint = function(inputPath) {
		var options = {
			host: shardHost,
			path: inputPath,
			method: 'GET'
		};
		console.log('URI: ' + options.host + options.path);
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
			queryParams = {};
			callback = arguments[0];
		}
		console.log('running cod.e.');
		options = buildStaticEndpoint(Endpoints.staticData.champion() + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticChampionById = function(id, queryParams, callback) {
		var	options;
		if (arguments.length === 2 && typeof queryParams === 'function') {
			queryParams = {};
			id = arguments[0];
			callback = arguments[1];
		}
		options = buildStaticEndpoint(Endpoints.staticData.champion() + '/' + id + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticItems = function(queryParams, callback)
	{
		var	options;
		if (arguments.length === 1 && typeof queryParams === 'function') {
			queryParams = {};
			callback = arguments[0];
		}
		options = buildStaticEndpoint(Endpoints.staticData.item() + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticItemById = function(id, queryParams, callback) {
		var	options;
		if (arguments.length === 2 && typeof queryParams === 'function') {
			queryParams = {};
			id = arguments[0];
			callback = arguments[1];
		}
		options = buildStaticEndpoint(Endpoints.staticData.item() + '/' + id + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticLanguages = function(callback)
	{
		var	options;

		options = buildStaticEndpoint(Endpoints.staticData.languages() + '?');
		requestData(options,callback);
	};

	RiotData.getStaticMasteries = function(queryParams, callback)
	{
		var	options;
		if (arguments.length === 1 && typeof queryParams === 'function') {
			queryParams = {};
			callback = arguments[0];
		}
		options = buildStaticEndpoint(Endpoints.staticData.mastery() + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticMasteryById = function(id, queryParams, callback) {
		var	options;
		if (arguments.length === 2 && typeof queryParams === 'function') {
			queryParams = {};
			id = arguments[0];
			callback = arguments[1];
		}
		options = buildStaticEndpoint(Endpoints.staticData.mastery() + '/' + id + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticRealms = function(callback)
	{
		var	options;

		options = buildStaticEndpoint(Endpoints.staticData.realm() + '?');
		requestData(options,callback);
	};

	RiotData.getStaticRunes = function(queryParams, callback)
	{
		var	options;
		if (arguments.length === 1 && typeof queryParams === 'function') {
			queryParams = {};
			callback = arguments[0];
		}
		options = buildStaticEndpoint(Endpoints.staticData.rune() + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticRuneById = function(id, queryParams, callback) {
		var	options;
		if (arguments.length === 2 && typeof queryParams === 'function') {
			queryParams = {};
			id = arguments[0];
			callback = arguments[1];
		}
		options = buildStaticEndpoint(Endpoints.staticData.rune() + '/' + id + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticSummonerSpells = function(queryParams, callback)
	{
		var	options;
		if (arguments.length === 1 && typeof queryParams === 'function') {
			queryParams = {};
			callback = arguments[0];
		}
		options = buildStaticEndpoint(Endpoints.staticData.summonerSpell() + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticSummonerSpellById = function(id, queryParams, callback) {
		var	options;
		if (arguments.length === 2 && typeof queryParams === 'function') {
			queryParams = {};
			id = arguments[0];
			callback = arguments[1];
		}
		options = buildStaticEndpoint(Endpoints.staticData.summonerSpell() + '/' + id + '?' + buildQueryParameters(queryParams));
		requestData(options,callback);
	};

	RiotData.getStaticVersions = function(callback)
	{
		var	options;

		options = buildStaticEndpoint(Endpoints.staticData.versions() + '?');
		requestData(options,callback);
	};

	/*
	 * lol-status endpoint
	 */
	RiotData.getStatus = function(callback)
	{
		var	options;

		options = buildShardEndpoint(Endpoints.status);
		requestData(options,callback);
	};

	RiotData.getStatusByRegion = function(inputRegion, callback)
	{
		var options;

		options = buildShardEndpoint(Endpoints.status + '/' + inputRegion);
		requestData(options,callback);
	};

	/*
	 * match endpoint
	 */

	RiotData.getMatchById = function(id, includeTimeline, callback) {
		var	options;
		if (arguments.length === 2 && typeof includeTimeline === 'function') {
			includeTimeline = false;
			callback = arguments[1];
		}
		options = buildEndpoint(Endpoints.match + '/' + id + '?' + 'includeTimeline=' + includeTimeline + '&');
		requestData(options, callback);
	};

	/*
	 * match-history endpoint
	 */

	RiotData.getMatchHistoryById = function(id, queryParams, callback) {
		var	options;
		if (arguments.length === 2 && typeof queryParams === 'function') {
			queryParams = {};
			callback = arguments[1];
		}
		options = buildEndpoint(Endpoints.match + '/' + id + '?' + buildQueryParameters(queryParams));
		requestData(options, callback);
	};

	/*
	 * stats endpoint
	 */

	RiotData.getStatsById = function(id, queryParams, callback) {
		var	options;
		if (arguments.length === 2 && typeof queryParams === 'function') {
			queryParams = {};
			callback = arguments[1];
		}
		options = buildEndpoint(Endpoints.stats + '/' + id + '/ranked?' + buildQueryParameters(queryParams));
		requestData(options, callback);
	};

	RiotData.getStatsSummaryById = function(id, queryParams, callback) {
		var	options;
		if (arguments.length === 2 && typeof queryParams === 'function') {
			queryParams = {};
			callback = arguments[1];
		}
		options = buildEndpoint(Endpoints.stats + '/' + id + '/summary?' + buildQueryParameters(queryParams));
		requestData(options, callback);
	};

	/*
	 * summoner endpoint
	 */

	RiotData.getSummonerByNames = function(names, callback) {
		var	options;

		options = buildEndpoint(Endpoints.summoner.byNames(names) + '?');
		requestData(options, callback);
	};

	RiotData.getSummonerByIds = function(ids, callback) {
		var	options;

		options = buildEndpoint(Endpoints.summoner.byIds(ids) + '?');
		requestData(options, callback);
	};

	RiotData.getSummonerMasteries = function(ids, callback) {
		var	options;

		options = buildEndpoint(Endpoints.summoner.masteries(ids) + '?');
		requestData(options, callback);
	};

	RiotData.getSummonerNamesByIds = function(ids, callback) {
		var	options;

		options = buildEndpoint(Endpoints.summoner.name(ids) + '?');
		requestData(options, callback);
	};

	RiotData.getSummonerRunes = function(ids, callback) {
		var	options;

		options = buildEndpoint(Endpoints.summoner.runes(ids) + '?');
		requestData(options, callback);
	};

	/*
	 * team endpoint
	 */

 	RiotData.getTeamBySummonerIds = function(ids, callback) {
		var	options;

		options = buildEndpoint(Endpoints.team.bySummoner(ids) + '?');
		requestData(options, callback);
	};

 	RiotData.getTeamByTeamIds = function(ids, callback) {
		var	options;

		options = buildEndpoint(Endpoints.team.byTeam(ids) + '?');
		requestData(options, callback);
	};

	module.exports = RiotData;

}());



