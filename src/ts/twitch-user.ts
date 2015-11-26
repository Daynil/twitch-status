import { Component, View } from 'angular2/angular2';

// Annotation section
@Component({
	selector: 'twitch-user',
	inputs: ['name', 'iconurl', 'channelurl', 'popularity', 
	'islive', 'description', 'viewers', 'previewurl']
})
@View({
	templateUrl: '../html/twitch-user.html',
	styleUrls: ['../css/twitch-user.css']
})
// Component controller
export class TwitchUser {
	// Not Live Dependent
	name: string;
	iconurl: string;
	channelurl: string;
	popularity: number;
	
	// Live Dependent
	islive: boolean;
	description: string;
	viewers: number;
	previewurl: string;
	
	constructor() {
		
	}
	
	setLiveIcon() {
		return {
			"live": this.islive,
			"offline": !this.islive
		}
	}
}