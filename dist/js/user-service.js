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
        this.http = http;
    }
    UserService.prototype.getTwitch = function () {
        var _this = this;
        this.http.get('https://api.twitch.tv/kraken/streams/esl_lol')
            .map(function (res) { return res.json(); })
            .subscribe(function (data) {
            _this.aUser = data.stream.channel.name;
        }, function (err) { return console.log('Some problem, yo: ' + err); });
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
})();
exports.UserService = UserService;

//# sourceMappingURL=user-service.js.map
