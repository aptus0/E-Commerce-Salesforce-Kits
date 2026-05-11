# Architecture

CommercePulse 360 Kit is designed as a clean starter kit, not only a demo.

## High-Level Flow

```mermaid
sequenceDiagram
    participant U as Admin User
    participant R as React Admin Panel
    participant B as Node.js Backend API
    participant S as Salesforce Org

    U->>R: Opens dashboard
    R->>B: GET /api/dashboard/summary
    B->>S: SOQL aggregate queries
    S-->>B: Products, orders, customers, sync logs
    B-->>R: Dashboard summary DTO
    R-->>U: Business metrics
```

## Why React does not call Salesforce directly

Salesforce credentials must never be exposed in the browser. The backend protects credentials, centralizes security, handles retries, logs sync failures, and controls how Salesforce data is shaped for the frontend.

## Layers

```text
frontend/
  components/
  pages/
  services/
  types/

backend/
  controllers/
  services/
  repositories/
  salesforce/
  middleware/
  config/
```

## Backend Design

The backend uses a repository interface:

```text
ICommerceRepository
        |
        |-- MockCommerceRepository
        |-- SalesforceCommerceRepository
```

This allows the project to run in two modes:

| Mode | Purpose |
|---|---|
| Mock mode | Run the UI and API without Salesforce |
| Salesforce mode | Connect to a real Salesforce org |

## Object Model

```mermaid
erDiagram
    Customer_Profile__c ||--o{ Commerce_Order__c : places
    Commerce_Order__c ||--o{ Order_Item__c : contains
    Product__c ||--o{ Order_Item__c : sold_as
    Commerce_Order__c ||--o{ Return_Request__c : may_have
    Campaign_Performance__c ||--o{ Commerce_Order__c : influences
    Sync_Log__c }o--|| Commerce_Order__c : records
```
