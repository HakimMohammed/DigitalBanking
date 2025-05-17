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
import {ReactiveFormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {Toast} from 'primeng/toast';
import {Button} from 'primeng/button';
import {Dialog} from 'primeng/dialog';

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
    private messageService: MessageService
  ) {}

  operations!: Array<Transaction>;
  loading: boolean = true;
  accountId!: string;
  visible: boolean = false;

  showDialog() {
    this.visible = true;
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
  }

}
