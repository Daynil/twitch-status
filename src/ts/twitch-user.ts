import { Component, View } from 'angular2/angular2';

// Annotation section
@Component({
	selector: 'twitch-user',
	inputs: ['user']
})
@View({
	templateUrl: '../html/twitch-user.html',
	styleUrls: ['../css/twitch-user.css']
})
// Component controller
export class TwitchUser {
	user;
	
	constructor() {
		
	}
	
	setLiveIcon() {
		return {
			"live": this.user.isLive,
			"offline": !this.user.isLive
		}
	}
}