package com.example.server.service;

import com.example.server.dto.*;
import com.example.server.entities.*;
import com.example.server.enums.TransactionType;
import com.example.server.exceptions.BalanceNotSufficientException;
import com.example.server.exceptions.BankAccountNotFoundException;
import com.example.server.exceptions.CustomerNotFoundException;
import com.example.server.mappers.BankAccountMapperImpl;
import com.example.server.repositories.BankAccountRepository;
import com.example.server.repositories.CustomerRepository;
import com.example.server.repositories.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@AllArgsConstructor
@Slf4j
public class BankAccountServiceImpl implements BankAccountService {

    private BankAccountRepository bankAccountRepository;
    private CustomerRepository customerRepository;
    private TransactionRepository transactionRepository;
    private BankAccountMapperImpl dtoMapper;

    @Override
    public CustomerDTO saveCustomer(CustomerDTO customerDTO) {
        log.info("Saving new Customer");
        Customer customer=dtoMapper.toCustomer(customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return dtoMapper.fromCustomer(savedCustomer);
    }

    @Override
    public CurrentAccountDTO saveCurrentAccount(double initialBalance, double overDraft, Long customerId) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null)
            throw new CustomerNotFoundException("Customer not found");
        CurrentAccount currentAccount = new CurrentAccount();
        currentAccount.setId(UUID.randomUUID().toString());
        currentAccount.setCreatedAt(new Date());
        currentAccount.setCustomer(customer);
        currentAccount.setBalance(initialBalance);
        currentAccount.setOverDraft(overDraft);
        CurrentAccount savedAccount = bankAccountRepository.save(currentAccount);
        return dtoMapper.fromCurrentAccount(savedAccount);
    }

    @Override
    public SavingAccountDTO saveSavingAccount(double initialBalance, double interestRate, Long customerId) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId).orElse(null);
        if (customer == null)
            throw new CustomerNotFoundException("Customer not found");
        SavingAccount savingAccount = new SavingAccount();
        savingAccount.setId(UUID.randomUUID().toString());
        savingAccount.setCreatedAt(new Date());
        savingAccount.setCustomer(customer);
        savingAccount.setBalance(initialBalance);
        savingAccount.setInterestRate(interestRate);
        SavingAccount savedAccount = bankAccountRepository.save(savingAccount);
        return dtoMapper.fromSavingAccount(savedAccount);
    }

    @Override
    public List<CustomerDTO> listCustomers() {
        List<Customer> customers = customerRepository.findAll();
        return customers.stream().map(dtoMapper::fromCustomer).toList();
    }

    @Override
    public BankAccountDTO getBankAccount(String accountId) throws BankAccountNotFoundException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId).orElseThrow(() -> new BankAccountNotFoundException("Bank Account not found"));
        if (bankAccount instanceof SavingAccount savingAccount) {
            return dtoMapper.fromSavingAccount(savingAccount);
        } else {
            CurrentAccount currentAccount = (CurrentAccount) bankAccount;
            return dtoMapper.fromCurrentAccount(currentAccount);
        }
    }

    @Override
    public void debit(String accountId, double amount, String transactionDescription) throws BankAccountNotFoundException, BalanceNotSufficientException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId).orElseThrow(() -> new BankAccountNotFoundException("Bank Account not found"));
        if (bankAccount.getBalance() < amount )
            throw new BalanceNotSufficientException("Insufficient balance");
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription(transactionDescription);
        transaction.setType(TransactionType.DEBIT);
        transaction.setBankAccount(bankAccount);
        transaction.setTransactionDate(new Date());
        transactionRepository.save(transaction);
        bankAccount.setBalance(bankAccount.getBalance() - amount);
        bankAccountRepository.save(bankAccount);
    }

    @Override
    public void credit(String accountId, double amount, String transactionDescription) throws BankAccountNotFoundException {
        BankAccount bankAccount = bankAccountRepository.findById(accountId).orElseThrow(() -> new BankAccountNotFoundException("Bank Account not found"));
        Transaction transaction = new Transaction();
        transaction.setAmount(amount);
        transaction.setDescription(transactionDescription);
        transaction.setType(TransactionType.CREDIT);
        transaction.setBankAccount(bankAccount);
        transaction.setTransactionDate(new Date());
        transactionRepository.save(transaction);
        bankAccount.setBalance(bankAccount.getBalance() + amount);
        bankAccountRepository.save(bankAccount);
    }

    @Override
    public void transfer(String fromAccountId, String toAccountId, double amount) throws BankAccountNotFoundException, BalanceNotSufficientException {
        debit(fromAccountId, amount, "Transfer to " + toAccountId);
        credit(toAccountId, amount, "Transfer from " + fromAccountId);
    }

    @Override
    public List<BankAccountDTO> listBankAccounts() {
        List<BankAccount> bankAccounts = bankAccountRepository.findAll();
        List<BankAccountDTO> bankAccountDTOS = bankAccounts.stream().map(bankAccount -> {
            if (bankAccount instanceof SavingAccount) {
                SavingAccount savingAccount = (SavingAccount) bankAccount;
                return dtoMapper.fromSavingAccount( savingAccount);
            } else {
                CurrentAccount currentAccount = (CurrentAccount) bankAccount;
                return dtoMapper.fromCurrentAccount(currentAccount);
            }
        }).collect(Collectors.toList());
        return bankAccountDTOS;
    }

    @Override
    public CustomerDTO getCustomer(Long customerId) throws CustomerNotFoundException {
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new CustomerNotFoundException("Customer Not found"));
        return dtoMapper.fromCustomer(customer);
    }

    @Override
    public CustomerDTO updateCustomer(CustomerDTO customerDTO) {
        log.info("Saving new Customer");
        Customer customer=dtoMapper.toCustomer(customerDTO);
        Customer savedCustomer = customerRepository.save(customer);
        return dtoMapper.fromCustomer(savedCustomer);
    }

    @Override
    public void deleteCustomer(Long customerId) {
        customerRepository.deleteById(customerId);
    }

    @Override
    public List<TransactionDTO> getTransactions(String accountId) {
        List<Transaction> transactions = transactionRepository.findByBankAccountId(accountId);
        return transactions.stream().map(op->dtoMapper.fromTransaction(op)).collect(Collectors.toList());
    }

    @Override
    public AccountHistoryDTO getAccountHistory(String accountId, int page, int size) throws BankAccountNotFoundException {
        BankAccount bankAccount=bankAccountRepository.findById(accountId).orElse(null);
        if(bankAccount==null) throw new BankAccountNotFoundException("Account not Found");
        Page<Transaction> transactions = transactionRepository.findByBankAccountId(accountId, PageRequest.of(page, size));
        AccountHistoryDTO accountHistoryDTO=new AccountHistoryDTO();
        List<TransactionDTO> transactionsDTO = transactions.getContent().stream().map(op ->
                dtoMapper.fromTransaction(op)).collect(Collectors.toList());
        accountHistoryDTO.setTransactions(transactionsDTO);
        accountHistoryDTO.setAccountId(bankAccount.getId());
        accountHistoryDTO.setBalance(bankAccount.getBalance());
        accountHistoryDTO.setCurrentPage(page);
        accountHistoryDTO.setPageSize(size);
        accountHistoryDTO.setTotalPages(transactions.getTotalPages());
        return accountHistoryDTO;
    }
}
