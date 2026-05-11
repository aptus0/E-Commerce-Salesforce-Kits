# Backend

Node.js + Express + TypeScript API gateway.

## Run

```bash
cp .env.example .env
npm install
npm run dev
```

## Modes

### Mock Mode

```env
USE_MOCK_DATA=true
```

### Salesforce Mode

```env
USE_MOCK_DATA=false
```

Before Salesforce mode, create objects described in:

```text
../docs/salesforce-object-setup.md
```

You can authenticate in three ways:

```env
SALESFORCE_AUTH_ALIAS=your-sf-cli-alias
```

or

```env
SALESFORCE_USERNAME=your_salesforce_username
SALESFORCE_PASSWORD=your_salesforce_password
SALESFORCE_SECURITY_TOKEN=your_security_token
```
