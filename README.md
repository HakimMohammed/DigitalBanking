# Digital Banking Application

A full-stack digital banking application with Spring Boot backend, Angular frontend, and JWT-based authentication.

## Overview

This application provides a comprehensive digital banking system with the following features:
- Customer management (create, read, update, delete)
- Bank account management (current accounts with overdraft, savings accounts with interest)
- Transaction processing (credit, debit, transfer)
- Transaction history viewing with pagination
- Secure authentication and authorization with JWT tokens

## Technologies Used

### Backend
- **Java 17**
- **Spring Boot 3.4.5**
- **Spring Data JPA** - For database access and ORM
- **Spring Security** - For authentication and authorization with OAuth2 and JWT
- **MySQL** - Database
- **Lombok** - For reducing boilerplate code
- **Swagger/OpenAPI** - For API documentation

### Frontend
- **Angular 19.2.0** - Frontend framework
- **PrimeNG 19.1.2** - UI component library
- **TailwindCSS 4.1.6** - CSS framework
- **JWT-decode** - For handling JWT tokens

## Architecture

### Backend Architecture

The Spring Boot backend follows a layered architecture:
- **Controllers**: REST API endpoints
- **Services**: Business logic implementation
- **Repositories**: Data access layer
- **DTOs**: Data Transfer Objects for API communication
- **Entities**: JPA entities representing the data model
- **Exceptions**: Custom exception classes

### Entity Model
- **Customer**: Represents bank customers with personal information
- **BankAccount**: Abstract base class for all bank accounts
  - **CurrentAccount**: Checking account with overdraft facility
  - **SavingAccount**: Savings account with interest rate
- **Transaction**: Records of financial operations on accounts

### Frontend Architecture
The Angular frontend follows a modular architecture:
- **Components**: UI components for different features
- **Services**: Handle data fetching and business logic
- **Interceptors**: Handle HTTP requests/responses (including authentication)
- **Guards**: Protect routes based on authentication status
- **Models**: TypeScript interfaces representing data structures

## Security Implementation

The application uses Spring Security with OAuth2 and JWT tokens:

### Backend Security
- **JWT-based Authentication**: Uses Spring Security OAuth2 Resource Server
- **Role-based Authorization**: Different endpoints require different roles
- **Method-level Security**: Uses @PreAuthorize annotations for fine-grained access control
- **Password Encryption**: Uses BCrypt for password hashing

### Frontend Security
- **JWT Token Storage**: Securely stores tokens in localStorage
- **HTTP Interceptor**: Automatically adds JWT token to outgoing requests
- **Role-based UI**: Shows/hides UI elements based on user roles
- **Route Guards**: Prevents unauthorized access to protected routes

## Setup and Installation

### Prerequisites
- Java 17 or higher
- Node.js and npm/pnpm
- MySQL

### Backend Setup
1. Clone the repository
2. Navigate to the server directory
3. Configure the database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/E-BANK?createDatabaseIfNotExist=true
   spring.datasource.username=root
   spring.datasource.password=root
   ```
4. Build and run the Spring Boot application:
   ```
   mvn clean install
   mvn spring-boot:run
   ```
   The backend will start on port 8085 by default.

### Frontend Setup
1. Navigate to the client directory
2. Install dependencies:
   ```
   pnpm install
   ```
3. Start the development server:
   ```
   pnpm start
   ```
   The frontend will start on port 4200 by default.

## API Documentation

The API documentation is available via Swagger UI at:
```
http://localhost:8085/swagger-ui.html
```

## Main Features

### Customer Management
- View all customers
- Add new customers
- Update existing customers
- Delete customers

### Account Management
- View account details
- Create new accounts (current or savings)
- View account balance

### Transaction Management
- Perform credit operations
- Perform debit operations
- Transfer between accounts
- View transaction history with pagination
