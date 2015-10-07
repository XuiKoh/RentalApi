var request = require('request');

module.exports = {
	FlickrApi:  function(req, res) {
		flickrKeyword = req.params.parameterflickrtags;
		flickrKeywordArray = flickrKeyword.split(',,');
		tags = flickrKeywordArray[0];
		page = flickrKeywordArray[2];
		if(flickrKeywordArray[1] == null)
			keyword = "";
		else
			keyword = flickrKeywordArray[1];
		var url = 'https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=5eded44188320998948b9966f4d49e50&text='+ keyword 
		+'&tags='+ tags 
		+'&tag_mode=all&accuracy=1&extras=description&per_page=500&page='+ page +'&format=json&nojsoncallback=1';
		request(url, function(error, response, body) {
			if (!error && response.statusCode == 200) {
				var info = JSON.parse(body);
				res.send(info);
			}
		});
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
