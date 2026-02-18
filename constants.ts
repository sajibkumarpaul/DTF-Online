
export const DTF_PRICE_PER_METER = 380; // Editable by admin
export const INCH_TO_METER = 39.37;
export const MAX_PRINT_WIDTH_INCH = 11.7; // A3 width
export const MAX_PRINT_HEIGHT_INCH = 16.5; // A3 height

export const APPAREL_DATA = [
  { id: '1', type: 'Regular', gsm: '160-170', basePrice: 115 },
  { id: '2', type: 'Regular Rib', gsm: '130-140', basePrice: 145 },
  { id: '3', type: 'Drop Shoulder', gsm: '180-200', basePrice: 170 },
  { id: '4', type: 'Drop Shoulder', gsm: '220+', basePrice: 190 },
  { id: '5', type: 'Interlock', gsm: '250-270', basePrice: 170 },
];

export const APPAREL_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1A1A1A' },
  { name: 'Navy Blue', hex: '#1e293b' },
  { name: 'Maroon', hex: '#450a0a' },
  { name: 'Red', hex: '#ef4444' },
  { name: 'Royal Blue', hex: '#2563eb' },
  { name: 'Heather Grey', hex: '#cbd5e1' },
];

export const APPAREL_SIZES = ['M', 'L', 'XL', 'XXL'];

// Using high-quality white t-shirt mockups for the Multiply blend effect
export const APPAREL_MOCKUPS = {
  front: 'https://images.printify.com/5c5c009d6634c400085a5385?s=1024&v=1',
  back: 'https://images.printify.com/5c5c00ab6634c4000c1445b2?s=1024&v=1'
};

export const PAYMENT_METHODS = [
  { id: 'bkash', name: 'bKash', logo: 'https://seeklogo.com/images/B/bkash-logo-FBB258B90F-seeklogo.com.png' },
  { id: 'nagad', name: 'Nagad', logo: 'https://seeklogo.com/images/N/nagad-logo-7A70CC6604-seeklogo.com.png' },
  { id: 'ssl', name: 'SSLCommerz', logo: 'https://www.sslcommerz.com/wp-content/uploads/2019/11/footer_logo.png' },
  { id: 'cod', name: 'Cash on Delivery', logo: '' },
];
