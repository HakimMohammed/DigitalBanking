import {Component, OnInit} from '@angular/core';
import {CardModule} from 'primeng/card';
import {TableModule} from 'primeng/table';
import {Button} from 'primeng/button';
import {ToastModule} from 'primeng/toast';
import {IconField} from 'primeng/iconfield';
import {InputIcon} from 'primeng/inputicon';
import {InputText} from 'primeng/inputtext';
import {MessageService} from 'primeng/api';
import {Account} from '../../models/interfaces/account.interface';
import {AccountService} from '../../core/services/accounts/account.service';
import {catchError, of, tap} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css',
  standalone: true,
  imports: [CardModule, TableModule, ToastModule, IconField, InputIcon, InputText, NgIf, RouterLink],
  providers: [MessageService]
})

export class AccountsComponent implements OnInit {

    constructor(
      private accountService: AccountService,
      private messageService: MessageService,
      private route: ActivatedRoute
    ) {
    }

    accounts!: Array<Account>;
    loading: boolean = true;
    customerId?: string;

  loadAccounts() {
    this.accountService.getAccounts()
      .pipe(
        tap((data: Account[]) => {
          if (this.customerId) {
            this.accounts = data.filter(account => account.customer?.id.toString() === this.customerId);
          } else {
            this.accounts = data;
          }
          this.loading = false;
        }),
        catchError((error) => {
          console.error('Error fetching accounts:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error fetching accounts' });
          this.loading = false;
          return of([]);
        })
      )
      .subscribe();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('customerId');
      this.customerId = id ?? undefined;
      this.loadAccounts();
    });
  }

}
