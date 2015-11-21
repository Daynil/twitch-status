import {Component, View, bootstrap} from 'angular2/angular2';

// Annotation section
@Component({
  selector: 'twitch-status'
})
@View({
  templateUrl: '../html/twitch-status.html',
  styleUrls: ['../css/twitch-status.css']
})
// Component controller
class TwitchStatus {
  name: string;
  constructor() {
    this.name = 'Alice!';
  }
}

bootstrap(TwitchStatus);
