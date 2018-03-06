import { Component } from '@angular/core';
import { Web3Service } from './util/web3.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  hasWeb3Provider = false;
  showWeb3Alert = false;

  constructor(private web3Service: Web3Service) {
    web3Service.web3ProviderObservable.subscribe(success => {
      this.hasWeb3Provider = success;
      this.showWeb3Alert = !success;
    });
  }
}
