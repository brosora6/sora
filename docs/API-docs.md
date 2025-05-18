# Restaurant API Documentation

## Base URL
`/api`

## Authentication
The API uses Laravel's authentication system with session-based authentication for customers. Protected routes require a valid customer session.

## Endpoints

### Public Endpoints

#### Get All Menus
```http
GET /menus
```

Returns a list of all active menu items.

**Response**
```json
[
  {
    "id": 1,
    "name": "Paket 1",
    "price": 15000,
    "desc": "Paket hemat dengan nasi, ayam goreng, lalapan segar, dan es teh",
    "gambar": "menu-photos/example.jpg",
    "stok": 50,
    "status": "active",
    "category": {
      "id": 1,
      "name": "Paket Ayam",
      "slug": "paket-ayam"
    }
  }
]
```

#### Get Single Menu
```http
GET /menus/{menu}
```

Returns details of a specific menu item.

**Response**
```json
{
  "id": 1,
  "name": "Paket 1",
  "price": 15000,
  "desc": "Paket hemat dengan nasi, ayam goreng, lalapan segar, dan es teh",
  "gambar": "menu-photos/example.jpg",
  "stok": 50,
  "status": "active",
  "category": {
    "id": 1,
    "name": "Paket Ayam",
    "slug": "paket-ayam"
  }
}
```

#### Categories
```http
GET /categories
POST /categories
GET /categories/{category}
PUT /categories/{category}
DELETE /categories/{category}
```

Full CRUD operations for menu categories.

### Protected Endpoints
All endpoints below require customer authentication.

#### User Information
```http
GET /user
```

Returns the authenticated customer's information.

#### Cart Operations

##### Get Cart Items
```http
GET /carts
```

Returns all items in the customer's cart.

**Response**
```json
[
  {
    "id": 1,
    "menu": {
      "id": 1,
      "name": "Paket 1",
      "price": 15000,
      "gambar": "menu-photos/example.jpg"
    },
    "quantity": 2,
    "price": 30000
  }
]
```

##### Add to Cart
```http
POST /carts
```

Add a new item to the cart.

**Request Body**
```json
{
  "menu_id": 1,
  "quantity": 2
}
```

**Response**
```json
{
  "message": "Item added to cart successfully.",
  "cart": {
    "id": 1,
    "menu": {
      "id": 1,
      "name": "Paket 1",
      "price": 15000
    },
    "quantity": 2,
    "price": 30000
  }
}
```

##### Update Cart Item
```http
POST /carts/{cart}
```

Update the quantity of a cart item.

**Request Body**
```json
{
  "quantity": 3
}
```

##### Remove from Cart
```http
DELETE /carts/{cart}
```

Remove an item from the cart.

#### Reservations
```http
GET /reservations
POST /reservations
GET /reservations/{reservation}
PUT /reservations/{reservation}
DELETE /reservations/{reservation}
```

Full CRUD operations for table reservations.

#### Payment Operations

##### Get Payment History
```http
GET /payments
```

Returns the customer's payment history.

##### Create Payment
```http
POST /payments
```

Create a new payment for cart items.

##### Get Payment Details
```http
GET /payments/{payment}
```

Returns details of a specific payment.

## Error Responses

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "message": "Error message here",
  "errors": {
    "field": ["Error details"]
  }
}
```

Common status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Server Error

## Data Models

### Menu
```json
{
  "id": "integer",
  "name": "string",
  "price": "integer",
  "desc": "string",
  "gambar": "string",
  "stok": "integer",
  "status": "enum(active,inactive)",
  "total_purchased": "integer",
  "is_recommended": "boolean",
  "category_id": "integer"
}
```

### Cart
```json
{
  "id": "integer",
  "pelanggan_id": "integer",
  "menu_id": "integer",
  "quantity": "integer",
  "price": "integer",
  "payment_id": "integer|null"
}
```

### Category
```json
{
  "id": "integer",
  "name": "string",
  "slug": "string",
  "description": "string|null"
}
```

## Notes
- All prices are in Indonesian Rupiah (IDR)
- Image paths are relative to the storage directory
- Protected routes require a valid customer session
- Stock is automatically managed when adding/removing items from cart
- Menu items can be marked as recommended based on purchase count
