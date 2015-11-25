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
    function TwitchUser(name, iconUrl, channelUrl) {
        this.name = name;
        this.iconUrl = iconUrl;
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
        this.getProgrammingChannels('medrybw', '1')
            .subscribe(function (channelInfo) {
            var baseObject = channelInfo.channels[0];
            var alwaysLive = new TwitchUser(baseObject.display_name, baseObject.logo, baseObject.url);
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
                console.log(_this.twitchUserList);
            }, function (err) { return _this.handleError(err); });
        }, function (err) { return _this.handleError(err); });
    }
    UserService.prototype.getTwitch = function () {
    };
    UserService.prototype.getProgrammingChannels = function (query, resultLimit) {
        return this.http.get(this.baseUrl + "search/channels?q=" + query + "&limit=" + resultLimit)
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.getLiveStreamInfo = function (channelName) {
        return this.http.get(this.baseUrl + "streams/" + channelName)
            .map(function (res) { return res.json(); });
    };
    UserService.prototype.getFullList = function () {
        var _this = this;
        this.getProgrammingChannels('programming', '100')
            .subscribe(function (channelList) {
            console.log(channelList);
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
