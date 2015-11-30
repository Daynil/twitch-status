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
        var _this = this;
        this.http = http;
        this.baseUrl = 'https://api.twitch.tv/kraken/';
        this.twitchUserList = [];
        this.filteredUserList = [];
        this.liveFilter = "All";
        this.twitchIcon = 'http://www-cdn.jtvnw.net/images/xarth/footer_glitch.png';
        this.getChannels('medrybw', '1')
            .subscribe(function (channelInfo) {
            var baseObject = channelInfo.channels[0];
            var alwaysLive = new TwitchUser(baseObject.display_name, baseObject.url);
            alwaysLive.iconUrl = baseObject.logo;
            alwaysLive.popularity = baseObject.views;
            _this.getLiveStreamInfo(alwaysLive.name.toLowerCase())
                .subscribe(function (streamInfo) {
                alwaysLive.isLive = (streamInfo.stream) ? true : false;
                if (alwaysLive.isLive) {
                    alwaysLive.description = streamInfo.stream.channel.status;
                    alwaysLive.viewers = streamInfo.stream.viewers;
                    if (streamInfo.preview)
                        alwaysLive.previewUrl = streamInfo.preview.small;
                }
                _this.twitchUserList.push(alwaysLive);
                _this.filteredUserList.push(alwaysLive);
                console.log(_this.twitchUserList);
            }, function (err) { return _this.handleError(err); });
        }, function (err) { return _this.handleError(err); });
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
    };
    UserService.prototype.removeDupes = function (array) {
        return array.filter(function (item, currPos) { return array.indexOf(item) == currPos; });
    };
    UserService.prototype.getTwitch = function () {
        if (this.twitchUserList.length < 10)
            this.getAllProgramming();
        else
            console.log(this.twitchUserList);
    };
    UserService.prototype.getChannels = function (query, resultLimit) {
        return this.http.get(this.baseUrl + "search/channels?q=" + query + "&limit=" + resultLimit)
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.getLiveStreamInfo = function (channelName) {
        return this.http.get(this.baseUrl + "streams/" + channelName)
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.getAllProgramming = function () {
        var _this = this;
        this.getChannels('programming', '15')
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
                        userChannel.description = streamInfo.stream.channel.status;
                        userChannel.viewers = streamInfo.stream.viewers;
                        if (streamInfo.preview)
                            userChannel.previewUrl = streamInfo.preview.small;
                    }
                    _this.twitchUserList.push(userChannel);
                    _this.filteredUserList.push(userChannel);
                }, function (err) { return _this.handleError(err); });
            });
        }, function (err) { return _this.handleError(err); });
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
