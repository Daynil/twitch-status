var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
    switch (arguments.length) {
        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
    }
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var http_1 = require('angular2/http');
var core_1 = require('angular2/core');
var TwitchUser = (function () {
    function TwitchUser(name, channelUrl) {
        this.name = name;
        this.channelUrl = channelUrl;
    }
    return TwitchUser;
})();
exports.TwitchUser = TwitchUser;
var UserService = (function () {
    function UserService(http) {
        this.http = http;
        this.baseUrl = 'https://api.twitch.tv/kraken/';
        this.twitchUserList = [];
        this.bufferUserList = [];
        this.filteredUserList = [];
        this.liveFilter = "All";
        this.twitchIcon = 'http://www-cdn.jtvnw.net/images/xarth/footer_glitch.png';
        // Add FCC suggested coding streamers
        this.findChannel('freecodecamp');
        this.findChannel('medrybw');
        this.findChannel('terakilobyte');
        this.findChannel('habathcx');
        this.findChannel('robotcaleb');
        this.findChannel('thomasballinger');
        this.findChannel('noobs2ninjas');
        this.findChannel('beohoff');
    }
    UserService.prototype.filtering = function (filterText) {
        var currUserList;
        switch (this.liveFilter) {
            case "All":
                currUserList = this.twitchUserList;
                break;
            case "Live":
                currUserList = this.twitchUserList.filter(function (user) { return user.isLive; });
                break;
            case "Offline":
                currUserList = this.twitchUserList.filter(function (user) { return !user.isLive; });
                break;
        }
        if (filterText.length === 0)
            this.filteredUserList = currUserList;
        else {
            this.filteredUserList = currUserList.filter(function (user) {
                var regText = "";
                filterText.toLowerCase().split("").map(function (letter) { return regText += ".*" + letter; });
                var filterRegex = new RegExp(regText, "ig");
                return filterRegex.test(user.name);
            });
        }
    };
    UserService.prototype.filterLive = function (type) {
        switch (type) {
            case "All":
                this.liveFilter = "All";
                break;
            case "Live":
                this.liveFilter = "Live";
                break;
            case "Offline":
                this.liveFilter = "Offline";
                break;
            default:
                break;
        }
        this.filtering("");
    };
    UserService.prototype.removeDupes = function (array) {
        return array.filter(function (item, currPos) { return array.indexOf(item) == currPos; });
    };
    UserService.prototype.getChannels = function (query, resultLimit) {
        return this.http.get(this.baseUrl + "search/channels?q=" + query + "&limit=" + resultLimit)
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.getLiveStreamInfo = function (channelName) {
        return this.http.get(this.baseUrl + "streams/" + channelName)
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.isUniqueUser = function (userName) {
        var isUnique = true;
        this.twitchUserList.map(function (user) {
            if (user.name.toLowerCase() == userName.toLowerCase())
                isUnique = false;
        });
        return isUnique;
    };
    UserService.prototype.setDescription = function (channel, description) {
        if (description.length > 20) {
            channel.description = description.substring(0, 21) + '...';
            channel.descriptionFull = description;
        }
        else
            channel.description = channel.descriptionFull = description;
    };
    UserService.prototype.findChannel = function (channelName) {
        var _this = this;
        this.getChannels(channelName, '1')
            .subscribe(function (channelInfo) {
            if (!channelInfo.channels[0]) {
                console.log("no results");
                return;
            }
            ;
            var baseObject = channelInfo.channels[0];
            if (baseObject.display_name.toLowerCase() != channelName.toLowerCase()) {
                console.log("result not equal to requested channel");
                return;
            }
            else if (!_this.isUniqueUser(baseObject.display_name)) {
                console.log("duplicate request");
                return;
            }
            var resultChannel = new TwitchUser(baseObject.display_name, baseObject.url);
            if (baseObject.logo)
                resultChannel.iconUrl = baseObject.logo;
            else
                resultChannel.iconUrl = _this.twitchIcon;
            resultChannel.popularity = baseObject.views;
            _this.getLiveStreamInfo(resultChannel.name.toLowerCase())
                .subscribe(function (streamInfo) {
                resultChannel.isLive = (streamInfo.stream) ? true : false;
                if (resultChannel.isLive) {
                    _this.setDescription(resultChannel, streamInfo.stream.channel.status);
                    resultChannel.viewers = streamInfo.stream.viewers;
                    if (streamInfo.preview)
                        resultChannel.previewUrl = streamInfo.preview.small;
                }
                _this.twitchUserList.push(resultChannel);
                _this.filteredUserList.push(resultChannel);
                console.log(_this.twitchUserList);
            }, function (err) { return _this.handleError(err); });
        }, function (err) { return _this.handleError(err); });
    };
    UserService.prototype.getCoding = function (amount) {
        var _this = this;
        // If we already have a buffer list, add new items to display list until requested amount
        if (this.bufferUserList.length > 50) {
            var counter = 1;
            this.bufferUserList.map(function (user) {
                if (counter <= parseInt(amount)) {
                    if (_this.twitchUserList.indexOf(user) < 0) {
                        _this.twitchUserList.push(user);
                        _this.filteredUserList.push(user);
                        counter++;
                    }
                }
            });
            return;
        }
        // Get maximum available results from twitch first time to store as a buffer but display only requested amount
        var initialLength = this.twitchUserList.length;
        this.getChannels('programming', '100')
            .subscribe(function (channelList) {
            var channelArray = channelList.channels;
            channelArray.map(function (channel) {
                var userChannel = new TwitchUser(channel.display_name, channel.url);
                if (channel.logo)
                    userChannel.iconUrl = channel.logo;
                else
                    userChannel.iconUrl = _this.twitchIcon;
                userChannel.popularity = channel.views;
                _this.getLiveStreamInfo(userChannel.name.toLowerCase())
                    .subscribe(function (streamInfo) {
                    userChannel.isLive = (streamInfo.stream) ? true : false;
                    if (userChannel.isLive) {
                        _this.setDescription(userChannel, streamInfo.stream.channel.status);
                        userChannel.viewers = streamInfo.stream.viewers;
                        if (streamInfo.preview)
                            userChannel.previewUrl = streamInfo.preview.small;
                    }
                    _this.bufferUserList.push(userChannel);
                    var amountAdded = _this.twitchUserList.length - initialLength;
                    if (amountAdded < parseInt(amount)) {
                        _this.twitchUserList.push(userChannel);
                        _this.filteredUserList.push(userChannel);
                    }
                }, function (err) { return _this.handleError(err); });
            });
        }, function (err) { return _this.handleError(err); });
    };
    UserService.prototype.clearStreams = function () {
        this.twitchUserList = [];
        this.bufferUserList = [];
        this.filteredUserList = [];
    };
    UserService.prototype.handleError = function (error) {
        console.log('Some problem, yo: ' + error);
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
})();
exports.UserService = UserService;

//# sourceMappingURL=user-service.js.map
