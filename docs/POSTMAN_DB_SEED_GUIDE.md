# Postman ile Canli Veri Seed Rehberi (DB Doldurma)

Bu dokuman ile Postman kullanarak backend API uzerinden veritabani icini doldurabilirsin.
Amac: kategori, musteri, urun, sepet (order + order-item), siparis, yorum verilerini hizli sekilde olusturmak.

## 1) On Kosullar

- Backend calisiyor olmali: `http://localhost:8080`
- Context path aktif: `/api`
- Base URL: `http://localhost:8080/api`
- JSON gonderimi icin Header:
  - `Content-Type: application/json`
- Korumali endpointler icin Header:
  - `Authorization: Bearer <TOKEN>`

Not:
- `POST /auth/register`, `POST /auth/login`, `POST /user/save` acik endpoint.
- Diger endpointlerin cogu token ister.

## 2) Postman Environment Degiskenleri

Postman'da bir Environment olusturup su degiskenleri ekle:

- `baseUrl` = `http://localhost:8080/api`
- `token` = (bos)
- `customerEmail` = `musteri1@site.com`
- `customerPassword` = `Musteri1!`
- `adminEmail` = `admin1@site.com`
- `adminPassword` = `Admin123!`

### Gecici Token (Hizli Baslangic)

Asagidaki token backend'deki mevcut token algoritmasina gore `admin1@site.com` icin uretilmistir:

- `token` = `YWRtaW4xQHNpdGUuY29tOjE3NzYxNjI2ODEyNTI6MTc3NjI0OTA4MTI1Mg==.W8rPckhQrhrmLt+xBvX+rQwrZht3MDNOEb/Q9QM3VTs=`
- Gecerlilik (UTC): `2026-04-15 10:31:21`

Onemli:
- Eger backend'te `JWT_SECRET` ortami degisti ise bu token calismayabilir.
- Bu durumda `POST {{baseUrl}}/auth/login` istegini calistirip yeni token al.

## 3) Akis Sirasi (Onemli)

1. Musteri kaydi olustur (`/auth/register`)
2. Admin adayi olustur (`/auth/register`)
3. Login ol ve token al (`/auth/login`)
4. Kategoriler olustur (`/categories`)
5. Urunler olustur (`/products`)
6. Siparis/sepet olustur (`/orders`)
7. Sepet urunleri ekle (`/order-items`)
8. Yorum ekle (`/reviews`)

## 4) Hazir Requestler

## 4.1 Musteri Kayit

- Method: `POST`
- URL: `{{baseUrl}}/auth/register`
- Auth: Yok

```json
{
  "userEmail": "{{customerEmail}}",
  "userPassword": "{{customerPassword}}",
  "userFullName": "Ali Veli",
  "userPhoneNumber": "05551234567"
}
```

## 4.2 Admin Adayi Kayit

- Method: `POST`
- URL: `{{baseUrl}}/auth/register`
- Auth: Yok

```json
{
  "userEmail": "{{adminEmail}}",
  "userPassword": "{{adminPassword}}",
  "userFullName": "Sistem Admin",
  "userPhoneNumber": "05559876543"
}
```

Onemli:
- Bu endpoint yeni kullaniciyi `USER` rolu ile olusturur.
- Gercek `ADMIN` yapmak icin kayit sonrasi DB'de role update gerekir (asagida SQL var).

## 4.3 Login (Token Alma)

- Method: `POST`
- URL: `{{baseUrl}}/auth/login`
- Auth: Yok

```json
{
  "loginEmail": "{{adminEmail}}",
  "loginPassword": "{{adminPassword}}"
}
```

### Postman Tests Script (token otomatik kayit)

Bu scripti login request'inin Tests sekmesine koy:

```javascript
const jsonData = pm.response.json();
if (jsonData && jsonData.token) {
  pm.environment.set("token", jsonData.token);
}
```

## 4.4 Kategori Ekle

- Method: `POST`
- URL: `{{baseUrl}}/categories`
- Header: `Authorization: Bearer {{token}}`

```json
{
  "categoryName": "Elektronik",
  "categoryDescription": "Elektronik urunler"
}
```

Ikinci kategori:

```json
{
  "categoryName": "Aksesuar",
  "categoryDescription": "Aksesuar urunleri"
}
```

Kategori listesi:

- Method: `GET`
- URL: `{{baseUrl}}/categories`

## 4.5 Urun Ekle

- Method: `POST`
- URL: `{{baseUrl}}/products`
- Header: `Authorization: Bearer {{token}}`

Ornek 1 (`categoryId` degerini senin DB'deki kategori ID'sine gore ver):

```json
{
  "productName": "Kablosuz Kulaklik",
  "productDescription": "ANC destekli premium kulaklik",
  "productPrice": 2999,
  "productStock": 50,
  "categoryId": 1
}
```

Ornek 2:

```json
{
  "productName": "Mekanik Klavye",
  "productDescription": "RGB, hot-swap mekanik klavye",
  "productPrice": 2499,
  "productStock": 30,
  "categoryId": 1
}
```

Urun listesi:

- Method: `GET`
- URL: `{{baseUrl}}/products`

## 4.6 Sepet / Siparis Mantigi

Projedeki "sepet" dogrudan ayri bir entity degil.
Sepeti asagidaki sekilde modelleyebilirsin:

- `orders` kaydi ac (`orderStatus`: `CART` veya `PENDING`)
- `order-items` ile urun satirlari ekle

### 4.6.1 Sepet (Order) Olustur

- Method: `POST`
- URL: `{{baseUrl}}/orders`
- Header: `Authorization: Bearer {{token}}`

```json
{
  "orderTotalAmount": 5498,
  "orderStatus": "CART",
  "userId": 1
}
```

### 4.6.2 Sepete Urun Ekle (Order Item)

- Method: `POST`
- URL: `{{baseUrl}}/order-items`
- Header: `Authorization: Bearer {{token}}`

```json
{
  "orderItemQuantity": 1,
  "orderItemPrice": 2999,
  "orderId": 1,
  "productId": 1
}
```

Ikinci satir:

```json
{
  "orderItemQuantity": 1,
  "orderItemPrice": 2499,
  "orderId": 1,
  "productId": 2
}
```

## 4.7 Siparisi Tamamla

Sepeti siparise cevirmek icin:

- Method: `PUT`
- URL: `{{baseUrl}}/orders/1`
- Header: `Authorization: Bearer {{token}}`

```json
{
  "orderTotalAmount": 5498,
  "orderStatus": "CONFIRMED",
  "userId": 1
}
```

## 4.8 Yorum Ekle

- Method: `POST`
- URL: `{{baseUrl}}/reviews`
- Header: `Authorization: Bearer {{token}}`

```json
{
  "reviewRating": 5,
  "reviewComment": "Cok iyi urun, tavsiye ederim.",
  "productId": 1,
  "userId": 1
}
```

## 5) Admin Rolunu Gercekten Acmak (DB UPDATE Gerekir)

Su an API ile dogrudan `ADMIN` rol set eden endpoint yok.
Asagidaki SQL ile admin adayini admin yapabilirsin:

```sql
UPDATE users
SET user_role = 'ADMIN'
WHERE user_email = 'admin1@site.com';
COMMIT;
```

## 6) Hizli Dogrulama Endpointleri

Asagidakileri calistirip verilerin olustugunu kontrol et:

- `GET {{baseUrl}}/categories`
- `GET {{baseUrl}}/products`
- `GET {{baseUrl}}/orders`
- `GET {{baseUrl}}/order-items`
- `GET {{baseUrl}}/reviews`

Hepsinde `Authorization: Bearer {{token}}` kullan.

## 7) Sik Yapilan Hatalar

- 401 Unauthorized:
  - Token yok/yanlis, login requestini tekrar calistir.
- 400 Validation Error:
  - Sifre kuralina uy (`min 8`, buyuk harf, rakam, ozel karakter).
- 500 Product/Category baglantisi:
  - `categoryId`, `productId`, `orderId`, `userId` degerleri DB'de var olmali.

## 8) Postman Collection Onerisi

Collection klasorleri:

1. `01-Auth`
2. `02-Categories`
3. `03-Products`
4. `04-Orders`
5. `05-OrderItems`
6. `06-Reviews`

Bu sirayla run ettiginde DB hizli sekilde dolar ve uygulama canliya yakin veri ile calisir.
