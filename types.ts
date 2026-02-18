
export enum UserRole {
  CUSTOMER = 'customer',
  RESELLER = 'reseller',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: 'active' | 'suspended';
  walletBalance: number;
}

export interface Product {
  id: string;
  type: string;
  gsm: string;
  basePrice: number;
  activeStatus: boolean;
}

export interface DesignData {
  id: string;
  frontImage?: string;
  backImage?: string;
  frontCanvasData?: any;
  backCanvasData?: any;
  frontHeightInch: number;
  backHeightInch: number;
  frontWidthInch: number;
  backWidthInch: number;
}

export interface CartItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  color?: string;
  size?: string;
  isOnlyPrint: boolean;
  frontCanvas?: string;
  backCanvas?: string;
  stats: {
    frontW: number;
    frontH: number;
    backW: number;
    backH: number;
  };
}

export interface Order {
  id: string;
  userId: string;
  resellerId?: string;
  orderType: 'direct' | 'reseller_link' | 'manual';
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  orderStatus: 'pending' | 'processing' | 'printed' | 'shipped' | 'delivered' | 'cancelled';
  deliveryStatus: 'in_transit' | 'delivered' | 'returned';
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  resellerId: string;
  orderId?: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}
