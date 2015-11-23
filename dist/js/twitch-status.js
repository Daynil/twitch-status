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
var angular2_1 = require('angular2/angular2');
var http_1 = require('angular2/http');
var user_service_1 = require('./user-service');
// Annotation section
var TwitchStatus = (function () {
    function TwitchStatus(userService) {
        this.userService = userService;
        this.name = 'Alice!';
    }
    TwitchStatus.prototype.getTwitch = function () {
        this.userService.getTwitch();
    };
    TwitchStatus = __decorate([
        angular2_1.Component({
            selector: 'twitch-status',
            viewBindings: [user_service_1.UserService]
        }),
        angular2_1.View({
            templateUrl: '../html/twitch-status.html',
            styleUrls: ['../css/twitch-status.css']
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService])
    ], TwitchStatus);
    return TwitchStatus;
})();
angular2_1.bootstrap(TwitchStatus, [http_1.HTTP_PROVIDERS]);

//# sourceMappingURL=twitch-status.js.map
