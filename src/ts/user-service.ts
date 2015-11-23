import {Http, HTTP_PROVIDERS} from 'angular2/http';
import {Injectable} from 'angular2/core';

export class TwitchUser {
	isLive: boolean;
	description: string;
	viewers: number;
	previewUrl: string;
	
	constructor(public name: string, public iconUrl: string, public channelUrl: string) { }
}

@Injectable()
export class UserService {
	twitchUserList: TwitchUser[];
	aUser: string;
	
	constructor (public http: Http) { }
	
	getTwitch() {
		this.http.get('https://api.twitch.tv/kraken/streams/esl_lol')
			.map(res => res.json())
			.subscribe(
				data => {
					this.aUser = data.stream.channel.name;
				},
				err => console.log('Some problem, yo: ' + err)
			);
	}
}