var request = require('request');
var async = require('async');

module.exports = {
	
	FlickrApi:  function(req, res) {
		flickrKeyword = req.params.parameterflickrtags;
		flickrKeywordArray = flickrKeyword.split(',,');
		tags = flickrKeywordArray[0];
		page = 1;
		if(flickrKeywordArray[1] == null)
			keyword = "";
		else
			keyword = flickrKeywordArray[1];

		var data = {
				"photos": {"photo": [], "pages": 0}
			};

		var regEx = /\d+\s+\w+\s+(?:st(?:\.|reet)?|ave(?:\.|nue)?|lane|ln(?:\.)?|parade|mall(?:\.)?|ter(?:\.|race)?|tce(?:\.)?|throughway|trwy(?:\.)?|track|trail|view|way(?:\.)?|path|row(?:\.)?|passage|psge(?:\.)?|plaza|plz(?:\.)?|road(?:s)?|rd(?:\.)?|pass(?:\.)?|pl(?:\.|ace)?|heights|hts(?:\.)?|alley|aly(?:\.)?|est(?:\.|ate)?|bouevard|blvd(?:\.)?|close|cres(?:\.)?|crescent|dr(?:\.|ive)?)/i;
		var pagesProcessed = 0;
		error = false;
		//while(!error){
			var url = 'https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=5eded44188320998948b9966f4d49e50&text=' + keyword + '&tags=' + tags + '&tag_mode=all&accuracy=1&extras=description&per_page=500&page=' + page + '&format=json&nojsoncallback=1';
			var calls = [];
			calls.push(function(callback){
				request(url, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						var info = JSON.parse(body);
						
						data.photos.pages = info.photos.pages;
						// for(var i = 0; i < info.photos.photo.length; i++){
						// 	if(regEx.test(info.photos.photo[i].title)){
						// 		data.photos.photo.push(info.photos.photo[i]);
						// 	}
						// }
					}
					callback(error, info.photos.pages);
				});
			});
			async.parallel(calls, function( err, result){
				var requests = [];
				var jsonArray = [];
				fpage=1;
				for(page=1; page<=result; page++){
					
					requests.push(function(callback){
						var pageloaded=1;
						
						// for(page=1; page<=result; page++){
							console.log(fpage + "//" + result);
							purl = 'https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=5eded44188320998948b9966f4d49e50&text=' + keyword + '&tags=' + tags + '&tag_mode=all&accuracy=1&extras=description&per_page=500&page=' + fpage + '&format=json&nojsoncallback=1';
							//console.log(purl);
							request(purl, function (error, response, body) {

								if (!error && response.statusCode == 200) {
									var info = JSON.parse(body);
									console.log("Loading page: " + info.photos.page);
									data.photos.pages = info.photos.pages;
									for(var i = 0; i < info.photos.photo.length; i++){
										if(regEx.test(info.photos.photo[i].title)){
											jsonArray.push(info.photos.photo[i]);
											console.log("Valid :" + jsonArray.length);
										}
									}
								}
								// if (pageloaded == result) {
								// 	pageloaded=1;
									
								// };
								//console.log(pageloaded + "/" + result );
								pageloaded++;
								callback(error, jsonArray);
							});

							fpage++;

						// }
						
					});
				}
				console.log("Total JsonData"+jsonArray.length);
					
				async.parallel(requests, function( err, result){
					console.log("Final");
					data.photos.photo = jsonArray;
					res.send(data);
					jsonArray = [];
				});
			});
			page++;
			if (page>data.photos.pages){
				error = true;
			}
	},

	FourSquareApi: function (req,res){
		addresskeyword = req.params.foursquareparameter;
		addressKeywordArray = addresskeyword.split(',');

		keyword = addressKeywordArray[0];
		latitude = addressKeywordArray[1];
		longitude = addressKeywordArray[2];
		var url = "https://api.foursquare.com/v2/venues/search"
		+"?client_id=52KOEIWDJ4YOKCHNNJT54B2YATEYFOPUTT40LTAJUHUNQ0FE"
		+"&client_secret=XFVWU1Q4ST2SLDHGWDMSFXUBWR4O0VW2AQHI4A0TUZHEAJL2"
		+"&v=20150920"
		+"&ll=" + latitude + "," + longitude
		+"&query=" + keyword;

   		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var info = JSON.parse(body);
				res.send(info);
			}
		}); 
	},
	
	FourSquareApiByID: function (req,res){
		idkeyword = req.params.foursquareidparameter;
		var url = "https://api.foursquare.com/v2/venues/"
		+ idkeyword
		+"?client_id=52KOEIWDJ4YOKCHNNJT54B2YATEYFOPUTT40LTAJUHUNQ0FE"
		+"&client_secret=XFVWU1Q4ST2SLDHGWDMSFXUBWR4O0VW2AQHI4A0TUZHEAJL2"
		+"&v=20150920"
   		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var info = JSON.parse(body);
				res.send(info);
			}
		}); 
	} 
};
