import {Component, View, bootstrap} from 'angular2/angular2';
import {HTTP_PROVIDERS} from 'angular2/http'
import {UserService} from './user-service'

// Annotation section
@Component({
  selector: 'twitch-status',
  viewBindings: [UserService]
})
@View({
  templateUrl: '../html/twitch-status.html',
  styleUrls: ['../css/twitch-status.css']
})
// Component controller
class TwitchStatus {
  name: string;
  quote: string;
  twitchResult: string;
  
  constructor(public userService: UserService) {
    this.name = 'Alice!';
  }
  
  getTwitch() {
	  this.userService.getTwitch();
  }
  	
}

bootstrap(TwitchStatus, [HTTP_PROVIDERS]);
