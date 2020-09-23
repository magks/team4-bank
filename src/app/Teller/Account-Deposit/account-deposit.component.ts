import { Component } from '@angular/core';
import { Transactions } from 'src/model/Transactions';
import {TransactionService} from 'src/service/transaction.service'
import {AccountService} from 'src/service/account.service'
import {Router, ActivatedRoute} from '@angular/router'
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {Account} from 'src/model/Account'

@Component({
  selector: 'app-Account-Deposit',
  templateUrl: './account-deposit.component.html',
  styleUrls: ['./account-deposit.component.css']
})

export class AccountDepositComponent 
{
  public form:FormGroup
  public account:Account

  ngOnInit()
{
  this.form = new FormGroup
  ({
    amount: new FormControl( "",  [Validators.required])
  })
}

public getNewBalance()
{
  return this.account.Balance + ( Number.isNaN(Number.parseInt(this.form.get('amount').value))? 0 : Number.parseInt(this.form.get('amount').value))
}
  constructor(private transactionService:TransactionService, private router:Router, private accountService:AccountService, private route:ActivatedRoute) 
  {
    this.inProgress(true)
    accountService.getAccount("Account ID" ,Number.parseInt(route.snapshot.paramMap.get('id'))).subscribe
    (
      (result) => {console.log(result); this.inProgress(false); this.account =  result[0]; },
      (error) => {console.log(error); this.inProgress(false); alert("could not get account"); router.navigateByUrl("/")}
    )
  }

  public transaction:Transactions

  public postTransaction() 
  {
    this.inProgress(true)
    this.transaction = new Transactions()
    this.transaction.Amount = this.form.get('amount').value
    this.transaction.Cust_Id = this.account.Cust_Id
    this.transaction.Source_Acct = this.account.Acct_Id
    console.log(this.transaction)

    this.transactionService.addTransaction(this.transaction).subscribe( 
      (success) => {console.log("success:" + success); this.inProgress(false); alert("The transaction has been posted successfully."); this.router.navigateByUrl('/') }, 
      (error) => {this.inProgress(false); alert("There was an error:\n" + JSON.stringify(error))} )
  }

  private inProgress(yesno:boolean) 
  {
    //update UI Here
  }
}