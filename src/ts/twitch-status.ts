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
  
  getCoding(amount) {
	  let amountText = amount.value;
	  if (!amountText || /\D/.test(amountText)) return;
	  this.userService.getCoding(amountText);
	  amount.value = '';
  }
  
  getStream(channelName) {
	  let channelNameText = channelName.value;
	  if (!channelNameText) return;
	  this.userService.findChannel(channelNameText);
	  channelName.value = '';
  }
  
  filtering(filterText: string) {
	  this.userService.filtering(filterText);
  }
  
  liveFilter(type: string) {
	  this.userService.filterLive(type);
  }
  
  clearStreams() {
	  this.userService.clearStreams();
  }
  	
}

bootstrap(TwitchStatus, [HTTP_PROVIDERS])
	.then(
		success => console.log(success),
		error => console.log(error)
	);
