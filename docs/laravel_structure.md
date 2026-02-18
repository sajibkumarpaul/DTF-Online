
# Laravel Backend Architecture (DTF SaaS)

## 1. Directory Structure
- `app/Models`: User, Product, Order, Design, Wallet, Transaction.
- `app/Http/Controllers/API`: AuthController, BuilderController, OrderController, WalletController, AdminController.
- `app/Services`: PricingService, DTFService, PaymentService (bKash/SSL).
- `app/Policies`: OrderPolicy, WalletPolicy.

## 2. API Route Logic (Example)
```php
Route::group(['middleware' => 'auth:sanctum'], function() {
    // Shared
    Route::get('/profile', [UserController::class, 'profile']);

    // Reseller
    Route::group(['middleware' => 'role:reseller'], function() {
        Route::post('/links/create', [ResellerController::class, 'createLink']);
        Route::get('/wallet', [WalletController::class, 'getSummary']);
        Route::post('/withdraw', [WalletController::class, 'requestWithdraw']);
    });

    // Admin
    Route::group(['middleware' => 'role:admin'], function() {
        Route::patch('/orders/{id}/status', [AdminController::class, 'updateOrderStatus']);
        Route::get('/reports/finance', [AdminController::class, 'getRevenue']);
        Route::post('/config/pricing', [AdminController::class, 'updateDTFRate']);
    });
});
```

## 3. Order Lifecycle Logic
1. **Order Placed:** Validate inputs, check inventory.
2. **Payment:** Trigger bKash/SSLCommerz redirect.
3. **Webhook:** Verify payment, change status to `processing`.
4. **Reseller Credit:** If `order_type == reseller_link`, calculate `profit = selling_price - base_cost`.
5. **Wallet Update:** Create `wallet_transaction` (pending).
6. **Delivery:** Once courier API returns `delivered`, set transaction status to `completed` and update `wallet.balance`.

## 4. Scalability Improvements
- **Image Processing:** Move image conversions and thumbnail generation to Laravel Queues (Redis/SQS).
- **Blob Storage:** Use AWS S3 or DigitalOcean Spaces for original design files.
- **Caching:** Use Redis for apparel pricing and DTF rates to reduce DB load.
- **PDF Generation:** Use `snappy` or `dompdf` to generate packing slips and print-ready files automatically.
