# API Endpoints

## Base URL
```
http://localhost:8080/api
```

## Authentication
Token-based authentication (JWT)

## Endpoints

### Users (Kullanıcılar)

#### Kullanıcı Oluştur
```
POST /users/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
}
```

#### Giriş Yap
```
POST /users/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "password123"
}

Response:
{
    "token": "jwt_token_here",
    "user": { ... }
}
```

### Products (Ürünler)

#### Tüm Ürünleri Listele
```
GET /products
```

#### Ürün Detayını Getir
```
GET /products/{id}
```

#### Ürün Oluştur (Admin)
```
POST /products
Content-Type: application/json
Authorization: Bearer <token>

{
    "name": "Product Name",
    "description": "Product Description",
    "price": 29.99,
    "quantity": 100
}
```

### Orders (Siparişler)

#### Sipariş Oluştur
```
POST /orders
Content-Type: application/json
Authorization: Bearer <token>

{
    "items": [
        { "productId": 1, "quantity": 2 },
        { "productId": 2, "quantity": 1 }
    ]
}
```

#### Siparişleri Listele
```
GET /orders
Authorization: Bearer <token>
```

#### Sipariş Detayını Getir
```
GET /orders/{id}
Authorization: Bearer <token>
```

## Status Codes

- `200` - Başarılı
- `201` - Oluşturuldu
- `400` - Hatalı İstek
- `401` - Yetkisiz
- `404` - Bulunamadı
- `500` - Sunucu Hatası
