# Digital Banking Application

A comprehensive digital banking system that allows management of customers, bank accounts (current and savings), and financial transactions.

## Overview

This application provides a RESTful API for a digital banking system with the following features:
- CustomerInterface management (create, read, update, delete)
- Bank account management (current accounts with overdraft, savings accounts with interest)
- Transaction processing (credit, debit, transfer)
- Transaction history viewing with pagination

## Technologies Used

- **Java 17**
- **Spring Boot 3.4.5**
- **Spring Data JPA** - For database access and ORM
- **MySQL** - Database
- **Lombok** - For reducing boilerplate code
- **Swagger/OpenAPI** - For API documentation

## Project Structure

### Entity Model

- **CustomerInterface**: Represents bank customers with personal information
- **BankAccount**: Abstract base class for all bank accounts
    - **CurrentAccount**: Checking account with overdraft facility
    - **SavingAccount**: Savings account with interest rate
- **Transaction**: Records of financial operations on accounts

### Architecture

The application follows a layered architecture:
- **Controllers**: REST API endpoints
- **Services**: Business logic implementation
- **Repositories**: Data access layer
- **DTOs**: Data Transfer Objects for API communication
- **Entities**: JPA entities representing the data model
- **Exceptions**: Custom exception classes

## Setup and Installation

### Prerequisites

- Java 17 or higher
- Maven
- MySQL

### Database Configuration

The application is configured to connect to a MySQL database. You can modify the database settings in `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/E-BANK?createDatabaseIfNotExist=true
spring.datasource.username=root
spring.datasource.password=root
```

### Building and Running

1. Clone the repository
2. Navigate to the project directory
3. Build the project:
   ```
   mvn clean install
   ```
4. Run the application:
   ```
   mvn spring-boot:run
   ```

The application will start on port 8085 by default (configurable in `application.properties`).

## API Documentation

The API documentation is available via Swagger UI at:
```
http://localhost:8085/swagger-ui.html
```

API docs are also available at:
```
http://localhost:8085/docs
```

### Main API Endpoints

#### CustomerInterface Management
- `GET /customers` - List all customers
- `GET /customers/{id}` - Get a specific customer
- `POST /customers` - Create a new customer
- `PUT /customers/{customerId}` - Update a customer
- `DELETE /customers/{id}` - Delete a customer

#### AccountInterface Management
- `GET /accounts` - List all bank accounts
- `GET /accounts/{accountId}` - Get a specific account

#### Transaction Management
- `GET /accounts/{accountId}/operations` - Get all transactions for an account
- `GET /accounts/{accountId}/pageOperations` - Get paginated transaction history

## Data Initialization

The application includes a CommandLineRunner that initializes the database with sample data on startup:
- Creates sample customers
- Creates current and savings accounts for each customer
- Performs sample transactions on each account

## License

[Include license information here]

## Contributors

[Include contributor information here]
