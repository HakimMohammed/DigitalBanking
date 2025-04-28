package com.example.server.repositories;

import com.example.server.entities.Transaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByBankAccountId(String bankAccountId);
    Page<Transaction> findByBankAccountId(String bankAccountId, Pageable pageable);
}
