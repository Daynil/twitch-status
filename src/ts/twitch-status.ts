import {Component, View, CORE_DIRECTIVES, bootstrap} from 'angular2/angular2';
import {HTTP_PROVIDERS} from 'angular2/http'
import {UserService} from './user-service'
import {TwitchUser} from './twitch-user'

// Annotation section
@Component({
  selector: 'twitch-status',
  viewBindings: [UserService]
})
@View({
  templateUrl: '../html/twitch-status.html',
  styleUrls: ['../css/twitch-status.css'],
  directives: [CORE_DIRECTIVES, TwitchUser]
})
// Component controller
class TwitchStatus {
  name: string;
  quote: string;
  twitchResult: string;
  
  constructor(public userService: UserService) {
	  
  }
  
  getCoding(amount: string) {
	  if (!amount || /\D/.test(amount)) return;
	  this.userService.getCoding(amount);
  }
  
  filtering(filterText: string) {
	  this.userService.filtering(filterText);
  }
  
  liveFilter(type: string) {
	  this.userService.filterLive(type);
  }
  	
}

bootstrap(TwitchStatus, [HTTP_PROVIDERS])
	.then(
		success => console.log(success),
		error => console.log(error)
	);
