import { Component, OnInit } from '@angular/core';
import { CustomerService } from 'src/service/customer.service';
import { Customer } from 'src/model/Customer';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './customer-update.component.html',
  styleUrls: ['./customer-update.component.css'],
})
export class CustomerUpdateComponent implements OnInit {
  public form: FormGroup;
  public customer: Customer;
  public inProg:boolean

  constructor(
    private customerService: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      ssn: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      age: new FormControl('', [Validators.required, Validators.maxLength(3)]),
      address: new FormControl('', [Validators.required]),
    });
    this.form.disable();

    this.customerService
      .getCustomer(Number.parseInt(this.route.snapshot.paramMap.get('id')))
      .subscribe(
        (result) => {
          this.customer = result;
          this.form.get('ssn').setValue(this.customer.ssn);
          this.form.get('name').setValue(this.customer.name);
          this.form.get('age').setValue(this.customer.age);
          this.form.get('address').setValue(this.customer.address);
          this.form.enable();
        },
        (error) => {
          alert('Error finding customer: ' + JSON.stringify(error));
          this.form.enable();
        } //delete enable line after hooked up to data
      );
  }
  public postCustomer() {
    this.operationInProgress(true);

    this.customer = this.customer == null ? new Customer() : this.customer;
    this.customer.ssn = this.form.get('ssn').value;
    this.customer.name = this.form.get('name').value;
    this.customer.age = this.form.get('age').value;
    this.customer.address = this.form.get('address').value;
    console.log(JSON.stringify(this.customer));

    this.customerService.editCustomer(this.customer).subscribe(
      (response) => {
        console.log('response:' + response);
        this.operationInProgress(false);
        this.operationComplete(true, null);
        this.router.navigateByUrl('/Executive/Customer');
      },
      (error) => {
        console.log('error:' + error);
        this.operationInProgress(false);
        this.operationComplete(false, JSON.stringify(error));
      }
    );
  }

  private operationInProgress(yesno: boolean) 
  {
    this.inProg = yesno
  }

  private operationComplete(success: Boolean, message: string) {
    alert(
      'The Operation Was ' +
        (success ? '' : 'Not ') + 'Successful.'
        // +(message == null ? '' : '\nInfo: ' + message 
    );
  }
}
