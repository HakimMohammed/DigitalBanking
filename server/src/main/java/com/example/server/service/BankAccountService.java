package com.example.server.service;

import com.example.server.dto.*;
import com.example.server.exceptions.BalanceNotSufficientException;
import com.example.server.exceptions.BankAccountNotFoundException;
import com.example.server.exceptions.CustomerNotFoundException;

import java.util.List;

public interface BankAccountService {
    CustomerDTO saveCustomer(CustomerDTO customerDTO);
    CurrentAccountDTO saveCurrentAccount(double initialBalance, double overDraft, Long customerId) throws CustomerNotFoundException;
    SavingAccountDTO saveSavingAccount(double initialBalance, double interestRate, Long customerId) throws CustomerNotFoundException;

    List<CustomerDTO> listCustomers();
    BankAccountDTO getBankAccount(String accountId) throws BankAccountNotFoundException;

    void debit(String accountId, double amount, String transactionDescription) throws BankAccountNotFoundException , BalanceNotSufficientException;
    void credit(String accountId, double amount, String transactionDescription) throws BankAccountNotFoundException;
    void transfer(String fromAccountId, String toAccountId, double amount) throws BankAccountNotFoundException, BalanceNotSufficientException;

    List<BankAccountDTO> listBankAccounts();
    CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException;
    CustomerDTO updateCustomer(CustomerDTO customerDTO);
    void deleteCustomer(Long customerId);
    List<TransactionDTO> getTransactions(String accountId);
    AccountHistoryDTO getAccountHistory(String accountId, int page, int size) throws BankAccountNotFoundException;

}
