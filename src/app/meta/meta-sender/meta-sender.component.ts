import { Component, OnInit, NgZone } from '@angular/core';
import { Web3Service } from '../../util/web3.service';
import metacoin_artifacts from '../../../../build/contracts/MetaCoin.json';

class Account {
  address: string;
  balance: number;

  constructor(address: string = '', balance?: number) {
    this.address = address;
    this.balance = balance;
  }
}

interface Status {
  message?: string;
  type?: 'success' | 'danger' | 'warning' | 'info';
}

class Transaction {
  receiver: string;
  amount: number;

  constructor(receiver?: string, amount?: number) {
    this.receiver = receiver;
    this.amount = amount;
  }
}

@Component({
  selector: 'app-meta-sender',
  templateUrl: './meta-sender.component.html',
  styleUrls: ['./meta-sender.component.scss']
})
export class MetaSenderComponent implements OnInit {
  accounts: string[];
  MetaCoin: any;
  account = new Account();
  transaction = new Transaction();
  status: Status = {};

  constructor(
    private web3Service: Web3Service,
    private _ngZone: NgZone
  ) { }

  ngOnInit(): void {
    this.web3Service.artifactsToContract(metacoin_artifacts)
      .then((MetaCoinAbstraction) => {
        this.MetaCoin = MetaCoinAbstraction;
        this.watchAccount();
        this.watchContractEvents();
      });
  }

  async watchContractEvents() {
    const meta = await this.MetaCoin.deployed();
    meta.Transfer().watch((err, result) => {
      if (err) {
        console.log(err);
        this.setStatus('danger', 'Transaction ended with errors: ' + err.message);
      } else {
        this._ngZone.run(() => {
          this.refreshBalance();
        });
      }
    });
  }

  watchAccount() {
    this.web3Service.accountsObservable.subscribe((accounts) => {
      if (accounts && accounts.length > 0) {
        this.accounts = accounts;
        this.account = new Account(accounts[0])
        this._ngZone.run(() => {
          this.refreshBalance();
        });
      }
    });
  }

  setStatus(type: 'success' | 'danger' | 'warning' | 'info', message: string) {
    this.status = {
      type: type,
      message: message
    }
  }

  async sendCoin() {
    if (!this.MetaCoin) {
      this.setStatus('danger', 'Metacoin is not loaded, unable to send transaction');
      return;
    }

    const amount = this.transaction.amount;
    const receiver = this.transaction.receiver;

    console.log('Sending ' + amount + ' MetaCoins to ' + receiver);
    this.setStatus('info', 'Initiating transaction... (please wait)');
    
    try {
      const deployedMetaCoin = await this.MetaCoin.deployed();
      const transaction = await deployedMetaCoin.sendCoin
        .sendTransaction(receiver, amount, { from: this.account.address });

      if (!transaction) {
        this.setStatus('danger', 'Transaction failed!');
      } else {
        this.setStatus('success', 'Transaction complete!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('danger', 'Error sending coin; see log.' );
    }
  }

  async refreshBalance() {
    console.log("refeshing account balance");
    try {
      if (!this.MetaCoin) {
        console.log("Waiting for MetaCoin contract");
        const delay = new Promise(resolve => setTimeout(resolve, 100));
        await delay;
        return this.refreshBalance();
      }
      const deployedMetaCoin = await this.MetaCoin.deployed();
      const metaCoinBalance = await deployedMetaCoin.getBalance.call(this.account.address);
      console.log('Found balance: ' + metaCoinBalance);
      this.account.balance = metaCoinBalance;
    } catch (e) {
      console.log(e);
      this.setStatus('danger', 'Error getting balance; see log.');
    }
  }

  changeAccount(address) {
    this.account = new Account(address);
    this.transaction = new Transaction();
    this.refreshBalance();
  }
}
