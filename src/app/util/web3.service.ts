import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { default as contract } from 'truffle-contract';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare let window: any;

function getWindow(): any {
  return window;
}

@Injectable()
export class Web3Service {
  accountsPollInterval: number;
  private web3: Web3;
  public ready = false;
  public MetaCoin: any;
  
  private _accountsObservable = new BehaviorSubject<string[]>([]);
  private _web3ProviderObservable = new BehaviorSubject<boolean>(false);
  
  private get accounts() { return this._accountsObservable.value };
  public get accountsObservable() { return this._accountsObservable.asObservable(); }
  public get web3ProviderObservable() { return this._web3ProviderObservable.asObservable(); }

  constructor() {
    getWindow().addEventListener('load', (event) => {
      this.bootstrapWeb3();
    });
  }

  public bootstrapWeb3() {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      // Use Mist/MetaMask's provider
      this.web3 = new Web3(window.web3.currentProvider);
      this._web3ProviderObservable.next(true);
    } else {
      console.log('No web3? You should consider trying MetaMask!');

      // Hack to provide backwards compatibility for Truffle, which uses web3js 0.20.x
      Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
      this._web3ProviderObservable.next(false);
    }
    
    this.refreshAccounts();
  }

  public async artifactsToContract(artifacts) {
    if (!this.web3) {
      const delay = new Promise(resolve => setTimeout(resolve, 100));
      await delay;
      return await this.artifactsToContract(artifacts);
    }

    const contractAbstraction = contract(artifacts);
    contractAbstraction.setProvider(this.web3.currentProvider);
    return contractAbstraction;

  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      console.log('Refreshing accounts');
      if (err != null) {
        console.warn('There was an error fetching your accounts.');
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length === 0) {
        console.warn('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        return;
      }

      if (!this.accounts || this.accounts.length !== accs.length || this.accounts[0] !== accs[0]) {
        console.log('Observed new accounts');
        this._accountsObservable.next(accs)
      }

      this.ready = true;
    });
  }
}
