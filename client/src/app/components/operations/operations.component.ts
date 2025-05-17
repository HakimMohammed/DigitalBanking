import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {AccountService} from '../../core/services/accounts/account.service';
import {MessageService, PrimeTemplate} from 'primeng/api';
import {catchError, of, tap} from 'rxjs';
import {Transaction} from '../../models/interfaces/transaction.interface';
import {Card} from 'primeng/card';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Button, ButtonDirective} from 'primeng/button';
import {Dialog} from 'primeng/dialog';
import { RadioButton } from 'primeng/radiobutton';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-operations',
  imports: [
    Card,
    IconField,
    InputIcon,
    InputText,
    PrimeTemplate,
    ReactiveFormsModule,
    TableModule,
    Toast,
    Button,
    Dialog,
    RadioButton,
    ButtonDirective,
    NgIf,
  ],
  templateUrl: './operations.component.html',
  styleUrl: './operations.component.css',
  standalone: true,
  providers: [MessageService]
})
export class OperationsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private service: AccountService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  operations!: Array<Transaction>;
  loading: boolean = true;
  accountId!: string;
  visible: boolean = false;

  operationForm!: FormGroup;

  initOperationDialog() {
    this.operationForm = this.fb.group({
      type: ['DEBIT', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01)]],
      description: ['', Validators.required],
      destinationAccountId: ['']
    });
  }

  showDialog() {
    this.visible = true;
    this.operationForm.reset();
  }

  get isTransfer() {
    return this.operationForm?.get('type')?.value === 'TRANSFER';
  }

  loadOperations() {
    this.service.getAccountOperations(this.accountId)
      .pipe(
        tap((data: any) => {
          this.operations = data;
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

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('accountId');
      this.accountId = id ?? "";
      this.loadOperations();
    });
    this.initOperationDialog();
  }

  handleSubmit() {
    if (this.operationForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Validation Error', detail: 'Please fill all required fields correctly.' });
      return;
    }

    const { type, amount, description, destinationAccountId } = this.operationForm.value;

    let request$;

    if (type === 'DEBIT') {
      request$ = this.service.debit({accountId: this.accountId, amount, description });
    } else if (type === 'CREDIT') {
      request$ = this.service.credit({accountId: this.accountId, amount, description });
    } else if (type === 'TRANSFER') {
      if (!destinationAccountId) {
        this.messageService.add({ severity: 'warn', summary: 'Validation Error', detail: 'Destination account is required for transfer.' });
        return;
      }
      request$ = this.service.transfer({
        sourceAccountId: this.accountId,
        destinationAccountId,
        amount,
        description
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Invalid Operation', detail: 'Unsupported operation type.' });
      return;
    }

    request$.pipe(
      tap(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `${type} operation completed successfully.` });
        this.visible = false;
        this.loadOperations(); // refresh data
        this.operationForm.reset({ type: 'DEBIT' });
      }),
      catchError((error) => {
        console.error('Operation error:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: `Failed to perform ${type} operation.` });
        return of(null);
      })
    ).subscribe();
  }


}
