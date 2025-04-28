package com.example.server.dto;

import com.example.server.enums.TransactionType;
import lombok.Data;

import java.util.Date;

@Data
public class TransactionDTO {
    private Long id;
    private Date transactionDate;
    private double amount;
    private TransactionType type;
    private String description;
}
