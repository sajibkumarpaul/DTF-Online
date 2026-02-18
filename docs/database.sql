
-- Print-On-Demand SaaS Database Schema (Bangladesh Context)

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password VARCHAR(255) NOT NULL,
    role ENUM('customer', 'reseller', 'admin') DEFAULT 'customer',
    status ENUM('active', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(100) NOT NULL, -- e.g., Drop Shoulder
    gsm VARCHAR(50), -- e.g., 180-200
    base_price DECIMAL(10, 2) NOT NULL,
    active_status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE designs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    front_image_url TEXT,
    back_image_url TEXT,
    front_canvas_json JSON,
    back_canvas_json JSON,
    front_height_inch DECIMAL(5, 2),
    back_height_inch DECIMAL(5, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    reseller_id INT NULL,
    order_type ENUM('direct', 'reseller_link', 'manual') NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_status ENUM('pending', 'paid', 'failed') DEFAULT 'pending',
    order_status ENUM('pending', 'processing', 'printed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    delivery_status ENUM('pending', 'shipped', 'delivered', 'returned') DEFAULT 'pending',
    shipping_address TEXT,
    payment_method ENUM('bkash', 'nagad', 'ssl', 'cod'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reseller_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    design_id INT,
    product_id INT NULL, -- NULL if only print
    quantity INT NOT NULL,
    unit_cost DECIMAL(10, 2),
    total_cost DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (design_id) REFERENCES designs(id)
);

CREATE TABLE reseller_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reseller_id INT,
    design_id INT,
    product_id INT,
    selling_price DECIMAL(10, 2),
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reseller_id) REFERENCES users(id)
);

CREATE TABLE wallets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reseller_id INT UNIQUE,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    FOREIGN KEY (reseller_id) REFERENCES users(id)
);

CREATE TABLE wallet_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wallet_id INT,
    order_id INT NULL,
    amount DECIMAL(12, 2),
    type ENUM('credit', 'debit'),
    status ENUM('pending', 'completed', 'rejected'),
    payment_channel VARCHAR(50), -- bKash, Nagad
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (wallet_id) REFERENCES wallets(id)
);
