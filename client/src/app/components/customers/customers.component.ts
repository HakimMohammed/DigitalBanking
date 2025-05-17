import {Component, OnInit} from '@angular/core';
import {catchError, of, tap} from 'rxjs';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {ButtonModule} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputTextModule} from 'primeng/inputtext';
import {Dialog} from 'primeng/dialog';

import {Customer} from '../../models/interfaces/customer.interface';
import {CustomerService} from '../../core/services/customer.service';

import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Ripple} from 'primeng/ripple';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf} from '@angular/common';
import {AuthService} from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrl: './customers.component.css',
  standalone: true,
  imports: [CardModule, TableModule, ButtonModule, ToastModule, IconField, InputIcon, InputTextModule, Dialog, FormsModule, ReactiveFormsModule, Ripple, RouterLink, NgIf],
  providers: [MessageService]
})
export class CustomersComponent implements OnInit {
  customers! : Array<Customer>;
  loading: boolean = true;

  isAddVisible : boolean = false;

  showDialog() {
    this.isAddVisible = true;
  }

  displayAddDialog = false;
  addForm!: FormGroup;

  displayEditDialog = false;
  editForm!: FormGroup;
  selectedCustomer!: Customer;

  displayDeleteDialog = false;


  constructor(private customerService: CustomerService, private messageService: MessageService, private fb : FormBuilder, protected authService: AuthService) {}

  loadCustomers() {
    this.customerService.getCustomers()
      .pipe(
        tap((data: any) => {
          this.customers = data;
          this.loading = false;
        }),
        catchError((error) => {
          console.log('Error fetching customers:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching customers'});
          this.loading = false;
          return of([]);
        })
      )
      .subscribe();
  }

  initAddForm() {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    })
  }

  addCustomer() {
    this.displayAddDialog = true;
    this.addForm.reset(); // Reset form when dialog opens
  }

  initEditForm() {
    this.editForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  editCustomer(customer: any) {
    this.displayEditDialog = true;
    this.editForm.patchValue({
      name: customer.name,
      email: customer.email,
    });
    this.selectedCustomer = customer; // save for update logic
  }

  deleteCustomer(customer: any) {
    this.displayDeleteDialog = true;
    this.selectedCustomer = customer;
  }

  ngOnInit() {
    this.loadCustomers();
    this.initAddForm();
    this.initEditForm();
  }

  onCreateSubmit() {
    if (this.addForm.valid) {
      const newCustomer: Customer = this.addForm.value;

      this.customerService.createCustomer(newCustomer).subscribe({
        next: (createdCustomer) => {
          this.messageService.add({ severity: 'success', summary: 'Customer added' });
          this.loadCustomers();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Failed to add customer' });
        }
      });

      this.displayAddDialog = false;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Invalid form', detail: 'Please fill in all required fields' });
    }
  }

  onEditSubmit() {
    if (this.editForm.valid) {
      const updatedCustomer = {
        ...this.selectedCustomer,
        ...this.editForm.value,
      };

      this.customerService.editCustomer(updatedCustomer).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Customer updated' });
          this.loadCustomers();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Failed to update customer' });
        }
      })
      this.displayEditDialog = false;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Invalid form', detail: 'Please fill in all required fields' });
    }
  }

  onDeleteSubmit() {
    this.customerService.deleteCustomer(this.selectedCustomer.id).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Customer deleted' });
        this.loadCustomers();
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Failed to delete customer' });
      }
    })
    this.displayDeleteDialog = false;
  }

}
