# Dağıtım Rehberi

## Gereksinimler

- Java 11+
- Node.js 16+
- MySQL 8.0+
- Docker (isteğe bağlı)

## Ortam Ayarlaması

### 1. Veritabanı Kurulumu

```bash
# MySQL'de veritabanı ve tablo oluştur
mysql -u root -p < backend/src/main/resources/schema.sql
```

### 2. Backend Dağıtımı

```bash
cd backend

# Konfigürasyonu düzenle
# application.properties dosyasını ortamınıza göre güncelleyin

# Build et
mvn clean package

# Çalıştır
java -jar target/ecommerce-api-*.jar
```

### 3. Frontend Dağıtımı

```bash
cd frontend

# Bağımlılıkları yükle
npm install

# Production build
ng build --configuration production

# Sunucu üzerinde serve et
ng serve --prod
```

## Docker ile Dağıtım

### Backend Dockerfile

```dockerfile
FROM openjdk:11-jre-slim
COPY target/ecommerce-api-*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
EXPOSE 8080
```

### Frontend Dockerfile

```dockerfile
FROM node:16 AS build
WORKDIR /app
COPY . .
RUN npm install
RUN ng build --configuration production

FROM nginx:alpine
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
```

## Production Checklist

- [ ] Veritabanı yedeklemesi ayarlandı
- [ ] SSL/TLS sertifikaları kuruldu
- [ ] Environment variables ayarlandı
- [ ] Logging konfigüre edildi
- [ ] Monitoring ayarlandı
- [ ] Backup stratejisi hazırdır
- [ ] Performans testi yapıldı
- [ ] Güvenlik testleri yapıldı

## Sorun Giderme

### Backend Connection Error
- MySQL servisinin çalışıp çalışmadığını kontrol et
- `application.properties` içinde veritabanı URL'sini doğrula

### Frontend Build Error
- `npm cache clean --force` komutunu çalıştır
- `node_modules` klasörünü sil ve yeniden `npm install` yap

## Support

Sorunlarla karşılaştığınızda proje sahibine başvurun.
