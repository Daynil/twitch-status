import { Http, HTTP_PROVIDERS } from 'angular2/http';
import { Observable } from 'angular2/angular2';
import { Injectable } from 'angular2/core';

export class TwitchUser {
	popularity: number;  // Stream view count, for sorting
	
	isLive: boolean;
	description: string;
	viewers: number;
	previewUrl: string;
	
	constructor(public name: string, public iconUrl: string, public channelUrl: string) { }
}

@Injectable()
export class UserService {
	baseUrl = 'https://api.twitch.tv/kraken/';
	
	twitchUserList: TwitchUser[] = [];
	aUser: string;
	
	constructor (public http: Http) {
		this.getProgrammingChannels('medrybw', '1')
			.subscribe( 
				channelInfo => {
					let baseObject = channelInfo.channels[0];
					let alwaysLive = new TwitchUser(baseObject.display_name, baseObject.logo, baseObject.url);
					alwaysLive.popularity = baseObject.views;
					this.getLiveStreamInfo(alwaysLive.name.toLowerCase())
						.subscribe(
							streamInfo => {
								alwaysLive.isLive = (streamInfo.stream) ? true : false;
								if (alwaysLive.isLive) {
									alwaysLive.description = streamInfo.stream.channel.status;
									alwaysLive.viewers = streamInfo.stream.viewers;
									if (streamInfo.preview) alwaysLive.previewUrl = streamInfo.preview.small;
								}
								this.twitchUserList.push(alwaysLive);
								console.log(this.twitchUserList);
							},
							err => this.handleError(err)
						);
				},
				err => this.handleError(err)
			);
	 }
	
	getTwitch() {
		
	}
	
	getProgrammingChannels(query: string, resultLimit: string): Observable<any> {
		return this.http.get( `${this.baseUrl}search/channels?q=${query}&limit=${resultLimit}` )
						.map(res => res.json());
	}
	
	getLiveStreamInfo(channelName: string): Observable<any> {
		return this.http.get( `${this.baseUrl}streams/${channelName}` )
						.map(res => res.json());
	}
	
	getFullList() {
		this.getProgrammingChannels('programming', '100')
			.subscribe (
				channelList => {
					console.log(channelList);
				},
				err => this.handleError(err)
			);
	}
	
	handleError(error) {
		console.log('Some problem, yo: ' + error);
	}
}