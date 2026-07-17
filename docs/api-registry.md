# API Registry

## Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| POST | /api/auth/logout | User logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get user by ID |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

### Data
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/data | Get data list |
| POST | /api/data | Create data |
| PUT | /api/data/:id | Update data |
| DELETE | /api/data/:id | Delete data |

## Authentication

### Bearer Token
```http
Authorization: Bearer <token>
```

### API Key
```http
X-API-Key: <api-key>
```

## Rate Limits

| Tier | Requests/min | Requests/day |
|------|--------------|--------------|
| Free | 60 | 1000 |
| Pro | 300 | 10000 |
| Enterprise | 1000 | 100000 |

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

## Response Format

### Success
```json
{
  "success": true,
  "data": {},
  "message": "Success"
}
```

### Error
```json
{
  "success": false,
  "error": "Error message",
  "code": 400
}
```
