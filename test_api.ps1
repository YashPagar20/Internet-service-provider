$ErrorActionPreference = "Stop"

echo "1. Registering Admin User..."
$registerBody = @{
    username = "admin"
    password = "adminpassword"
    role = "ADMIN"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    echo "Response: $registerResponse"
} catch {
    echo "Registration failed or user already exists: $($_.Exception.Message)"
}

echo "`n2. Logging in..."
$loginBody = @{
    username = "admin"
    password = "adminpassword"
} | ConvertTo-Json

try {
    $tokenResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $tokenResponse.token
    echo "Login Successful! Token received."
} catch {
    echo "Login failed: $($_.Exception.Message)"
    exit
}

echo "`n3. Accessing Protected Resource (Get All Customers)..."
try {
    $headers = @{ Authorization = "Bearer $token" }
    $customers = Invoke-RestMethod -Uri "http://localhost:8080/api/customers" -Method Get -Headers $headers
    echo "Success! Customers retrieved: $($customers.Count)"
} catch {
    echo "Failed to access protected resource: $($_.Exception.Message)"
}
