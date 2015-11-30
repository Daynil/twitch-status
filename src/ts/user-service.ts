import { Http, HTTP_PROVIDERS } from 'angular2/http';
import { Observable } from 'angular2/angular2';
import { Injectable } from 'angular2/core';

export class TwitchUser {
	iconUrl: string;
	popularity: number;  // Stream view count, for sorting
	
	isLive: boolean;
	description: string;
	descriptionFull: string;
	viewers: number;
	previewUrl: string;
	
	constructor(public name: string, public channelUrl: string) { }
}

@Injectable()
export class UserService {
	baseUrl = 'https://api.twitch.tv/kraken/';
	
	twitchUserList: TwitchUser[] = [];
	bufferUserList: TwitchUser[] = [];
	filteredUserList: TwitchUser[] = [];
	liveFilter: string = "All";
	twitchIcon = 'http://www-cdn.jtvnw.net/images/xarth/footer_glitch.png';
	
	constructor (public http: Http) {
		// Add FCC suggested coding streamers
		this.findChannel('freecodecamp');
		this.findChannel('medrybw');
		this.findChannel('terakilobyte');
		this.findChannel('habathcx');
		this.findChannel('robotcaleb');
		this.findChannel('thomasballinger');
		this.findChannel('noobs2ninjas');
		this.findChannel('beohoff');
	}
	
	filtering(filterText: string) {
		let currUserList;
		switch (this.liveFilter) {
			case "All":
				currUserList = this.twitchUserList;
				break;
			case "Live":
				currUserList = this.twitchUserList.filter( user => {return user.isLive} );
				break;
			case "Offline":
				currUserList = this.twitchUserList.filter( user => {return !user.isLive} );
				break;
		}
		if (filterText.length === 0) this.filteredUserList = currUserList;
		else {
			this.filteredUserList = currUserList.filter(
				user => {
					let regText = "";
					filterText.toLowerCase().split("").map( letter => regText += ".*" + letter );
					let filterRegex = new RegExp(regText, "ig");
					return filterRegex.test(user.name);
				}
			);
		}
	}
	
	filterLive(type: string) {
		switch (type) {
			case "All":
				this.liveFilter = "All";
				break;
			case "Live":
				this.liveFilter = "Live";
				break;
			case "Offline":
				this.liveFilter = "Offline";
				break;
			default:
				break;
		}
		this.filtering("");
	}
	
	removeDupes(array: any[]): any[] {
		return array.filter( (item, currPos) => { return array.indexOf(item) == currPos; } );
	}
	
	getChannels(query: string, resultLimit: string): Observable<any> {
		return this.http.get( `${this.baseUrl}search/channels?q=${query}&limit=${resultLimit}` )
						.map(res => res.json());
	}
	
	getLiveStreamInfo(channelName: string): Observable<any> {
		return this.http.get( `${this.baseUrl}streams/${channelName}` )
						.map(res => res.json());
	}
	
	isUniqueUser(userName: string) {
		let isUnique = true;
		this.twitchUserList.map(
			user => {
				if (user.name.toLowerCase() == userName.toLowerCase()) isUnique = false;
			}
		);
		return isUnique;
	}
	
	setDescription(channel: TwitchUser, description: string) {
		if (description.length > 20) {
			channel.description =  description.substring(0, 21) + '...';
			channel.descriptionFull = description;
		}
		else channel.description = channel.descriptionFull = description;
	}
	
	findChannel(channelName: string) {
		this.getChannels(channelName, '1')
			.subscribe( 
				channelInfo => {
					if (!channelInfo.channels[0]) {
						console.log("no results");
						return;
					};
					let baseObject = channelInfo.channels[0];
					if (baseObject.display_name.toLowerCase() != channelName.toLowerCase()) {
						console.log("result not equal to requested channel");
						return;
					} else if (!this.isUniqueUser(baseObject.display_name)) { // Ignore duplicate requests	
						console.log("duplicate request");
						return;
					} 
					let resultChannel = new TwitchUser(baseObject.display_name, baseObject.url);
					if (baseObject.logo) resultChannel.iconUrl = baseObject.logo;
					else resultChannel.iconUrl = this.twitchIcon;
					resultChannel.popularity = baseObject.views;
					this.getLiveStreamInfo(resultChannel.name.toLowerCase())
						.subscribe(
							streamInfo => {
								resultChannel.isLive = (streamInfo.stream) ? true : false;
								if (resultChannel.isLive) {
									this.setDescription(resultChannel, streamInfo.stream.channel.status);
									resultChannel.viewers = streamInfo.stream.viewers;
									if (streamInfo.preview) resultChannel.previewUrl = streamInfo.preview.small;
								}
								this.twitchUserList.push(resultChannel);
								this.filteredUserList.push(resultChannel);	
								console.log(this.twitchUserList);
							},
							err => this.handleError(err)
						);
				},
				err => this.handleError(err)
			);
	}
	
	getCoding(amount: string) {
		// If we already have a buffer list, add new items to display list until requested amount
		if (this.bufferUserList.length > 50) {
			let counter = 1;
			this.bufferUserList.map( 
				user => {
					if (counter <= parseInt(amount)) {
						if (this.twitchUserList.indexOf(user) < 0) {
							this.twitchUserList.push(user);
							this.filteredUserList.push(user);
							counter++;
						}
					}
				}
			);
			return;
		}
		// Get maximum available results from twitch first time to store as a buffer but display only requested amount
		let initialLength = this.twitchUserList.length;
		this.getChannels('programming', '100')
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
										this.setDescription(userChannel, streamInfo.stream.channel.status);
										userChannel.viewers = streamInfo.stream.viewers;
										if (streamInfo.preview) userChannel.previewUrl = streamInfo.preview.small;
									}
									this.bufferUserList.push(userChannel);
									let amountAdded = this.twitchUserList.length - initialLength;
									if (amountAdded < parseInt(amount)) {
										this.twitchUserList.push(userChannel);
										this.filteredUserList.push(userChannel);
									}
								},
								err => this.handleError(err)
							);
					});
				},
				err => this.handleError(err)
			);
	}
	
	clearStreams() {
		this.twitchUserList = [];
		this.bufferUserList = [];
		this.filteredUserList = [];
	}
	
	handleError(error) {
		console.log('Some problem, yo: ' + error);
	}
}