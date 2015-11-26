import { Http, HTTP_PROVIDERS } from 'angular2/http';
import { Observable } from 'angular2/angular2';
import { Injectable } from 'angular2/core';

export class TwitchUser {
	iconUrl: string;
	popularity: number;  // Stream view count, for sorting
	
	isLive: boolean;
	description: string;
	viewers: number;
	previewUrl: string;
	
	constructor(public name: string, public channelUrl: string) { }
}

@Injectable()
export class UserService {
	baseUrl = 'https://api.twitch.tv/kraken/';
	
	twitchUserList: TwitchUser[] = [];
	twitchIcon = 'http://www-cdn.jtvnw.net/images/xarth/footer_glitch.png';
	
	constructor (public http: Http) {
		this.getChannels('medrybw', '1')
			.subscribe( 
				channelInfo => {
					let baseObject = channelInfo.channels[0];
					let alwaysLive = new TwitchUser(baseObject.display_name, baseObject.url);
					alwaysLive.iconUrl = baseObject.logo;
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
		if (this.twitchUserList.length < 10) this.getAllProgramming();
		else console.log(this.twitchUserList);
	}
	
	getChannels(query: string, resultLimit: string): Observable<any> {
		return this.http.get( `${this.baseUrl}search/channels?q=${query}&limit=${resultLimit}` )
						.map(res => res.json());
	}
	
	getLiveStreamInfo(channelName: string): Observable<any> {
		return this.http.get( `${this.baseUrl}streams/${channelName}` )
						.map(res => res.json());
	}
	
	getAllProgramming() {
		this.getChannels('programming', '15')
			.subscribe (
				channelList => {
					let channelArray: any[] = channelList.channels;
					channelArray.map( channel => {
						let userChannel = new TwitchUser(channel.display_name, channel.url);
						if (channel.logo) userChannel.iconUrl = channel.logo;
						else userChannel.iconUrl = this.twitchIcon;
						userChannel.popularity = channel.views;
						this.getLiveStreamInfo(userChannel.name.toLowerCase())
							.subscribe(
								streamInfo => {
									userChannel.isLive = (streamInfo.stream) ? true : false;
									if (userChannel.isLive) {
										userChannel.description = streamInfo.stream.channel.status;
										userChannel.viewers = streamInfo.stream.viewers;
										if (streamInfo.preview) userChannel.previewUrl = streamInfo.preview.small;
									}
									this.twitchUserList.push(userChannel);
								},
								err => this.handleError(err)
							);
					});
				},
				err => this.handleError(err)
			);
	}
	
	handleError(error) {
		console.log('Some problem, yo: ' + error);
	}
}