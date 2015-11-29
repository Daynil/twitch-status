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
  
  getTwitch() {
	  this.userService.getTwitch();
  }
  
  filtering(filterText: string) {
	  this.userService.filtering(filterText);
  }
  	
}

bootstrap(TwitchStatus, [HTTP_PROVIDERS])
	.then(
		success => console.log(success),
		error => console.log(error)
	);
