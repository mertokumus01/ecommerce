$ErrorActionPreference = 'Stop'

$baseUrl = 'http://localhost:8080/api'

# Function tanımlamaları
function Post-Json {
    param(
        [string]$Url,
        [hashtable]$Body,
        [hashtable]$Headers = @{}
    )
    Invoke-RestMethod -Method Post -Uri $Url -Headers $Headers -ContentType 'application/json' -Body ($Body | ConvertTo-Json -Depth 10)
}

function Get-Json {
    param(
        [string]$Url,
        [hashtable]$Headers = @{}
    )
    Invoke-RestMethod -Method Get -Uri $Url -Headers $Headers
}

function Put-Json {
    param(
        [string]$Url,
        [hashtable]$Body,
        [hashtable]$Headers = @{}
    )
    Invoke-RestMethod -Method Put -Uri $Url -Headers $Headers -ContentType 'application/json' -Body ($Body | ConvertTo-Json -Depth 10)
}

# Admin1 user'ını ADMIN role ile create et
try {
    $admin1 = @{ 
        userEmail = 'admin1@site.com'
        userPassword = 'Admin123!'
        userFullName = 'Admin User'
        userPhoneNumber = '05551234567'
        userRole = 'ADMIN'
    }
    Post-Json -Url "$baseUrl/auth/register" -Body $admin1 | Out-Null
    Write-Host 'Admin1 user created with ADMIN role'
} catch {
    # User zaten varsa, ignore et
    Write-Host 'Admin1 user might already exist'
}

$token = 'YWRtaW4xQHNpdGUuY29tOjE3NzYxNjI2ODEyNTI6MTc3NjI0OTA4MTI1Mg==.W8rPckhQrhrmLt+xBvX+rQwrZht3MDNOEb/Q9QM3VTs='
$authHeader = @{ Authorization = "Bearer $token" }
}

$report = [ordered]@{}

try {
    $null = Get-Json -Url "$baseUrl/categories" -Headers $authHeader
    $report.token = 'valid'
} catch {
    throw "Token gecersiz veya backend ulasilamiyor: $($_.Exception.Message)"
}

$categories = @(
    @{ categoryName = 'Elektronik'; categoryDescription = 'Elektronik urunler' },
    @{ categoryName = 'Aksesuar'; categoryDescription = 'Aksesuar urunleri' },
    @{ categoryName = 'Ev ve Yasam'; categoryDescription = 'Ev urunleri' }
)

foreach ($cat in $categories) {
    try {
        $null = Post-Json -Url "$baseUrl/categories" -Body $cat -Headers $authHeader
    } catch {
        # duplicate olabilir, devam
    }
}

$catList = Get-Json -Url "$baseUrl/categories" -Headers $authHeader
$categoryIds = @()
foreach ($c in $catList) {
    if ($c.categoryId) {
        $categoryIds += [int64]$c.categoryId
    }
}
$categoryIds = $categoryIds | Select-Object -Unique

if ($categoryIds.Count -eq 0) {
    throw 'Kategori olusturulamadi veya okunamadi.'
}

$report.category_count = $categoryIds.Count

$cat1 = $categoryIds[0]
$cat2 = if ($categoryIds.Count -gt 1) { $categoryIds[1] } else { $cat1 }

$products = @(
    @{ productName = 'Kablosuz Kulaklik'; productDescription = 'ANC destekli premium kulaklik'; productPrice = 2999; productStock = 50; categoryId = $cat1 },
    @{ productName = 'Mekanik Klavye'; productDescription = 'RGB, hot-swap mekanik klavye'; productPrice = 2499; productStock = 30; categoryId = $cat2 },
    @{ productName = 'USB-C Hub'; productDescription = 'Coklu port donusturucu'; productPrice = 899; productStock = 70; categoryId = $cat2 }
)

foreach ($p in $products) {
    try {
        $null = Post-Json -Url "$baseUrl/products" -Body $p -Headers $authHeader
    } catch {
        # duplicate olabilir, devam
    }
}

$productList = Get-Json -Url "$baseUrl/products" -Headers $authHeader
$productIds = @()
foreach ($p in $productList) {
    if ($p.productId) {
        $productIds += [int64]$p.productId
    }
}
$productIds = $productIds | Select-Object -Unique

if ($productIds.Count -eq 0) {
    throw 'Urun olusturulamadi veya okunamadi.'
}

$report.product_count = $productIds.Count

$orderId = $null
$validUserId = $null

foreach ($uid in 1..25) {
    try {
        $order = Post-Json -Url "$baseUrl/orders" -Body @{ orderTotalAmount = 3898; orderStatus = 'CART'; userId = $uid } -Headers $authHeader
        if ($order.orderId) {
            $orderId = [int64]$order.orderId
            $validUserId = $uid
            break
        }
    } catch {
        # user id yoksa bir sonrakini dene
    }
}

if (-not $orderId) {
    $report.status = 'partial_no_valid_user'
    $report.message = 'Kategori ve urunler olustu; order icin gecerli userId bulunamadi.'
    Write-Output ('SEED_REPORT=' + ($report | ConvertTo-Json -Compress))
    exit 0
}

$report.order_id = $orderId
$report.user_id = $validUserId

try {
    $null = Post-Json -Url "$baseUrl/order-items" -Body @{ orderItemQuantity = 1; orderItemPrice = 2999; orderId = $orderId; productId = $productIds[0] } -Headers $authHeader
} catch {}

try {
    $null = Post-Json -Url "$baseUrl/order-items" -Body @{ orderItemQuantity = 1; orderItemPrice = 899; orderId = $orderId; productId = $productIds[-1] } -Headers $authHeader
} catch {}

try {
    $null = Put-Json -Url "$baseUrl/orders/$orderId" -Body @{ orderTotalAmount = 3898; orderStatus = 'CONFIRMED'; userId = $validUserId } -Headers $authHeader
    $report.order_update = 'ok'
} catch {
    $report.order_update = 'failed'
}

try {
    $null = Post-Json -Url "$baseUrl/reviews" -Body @{ reviewRating = 5; reviewComment = 'Seed yorum'; productId = $productIds[0]; userId = $validUserId } -Headers $authHeader
    $report.review = 'ok'
} catch {
    $report.review = 'failed'
}

$report.status = 'seed_completed'
Write-Output ('SEED_REPORT=' + ($report | ConvertTo-Json -Compress))
