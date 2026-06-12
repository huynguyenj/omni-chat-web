export type PaycheckInvoiceStatus = 'Completed' | 'Pending' | 'Cancelled' | 'Refunded' | 'PendingRefund';
export type PaycheckInvoiceMethod = 'BankTransfer'| 'Cash';

export interface Paycheck {
  id: string;
  customerId: string;
  startedDate: string;
  endedDate: string;
  total: number;
  invoiceStatus: PaycheckInvoiceStatus;
  invoiceMethod: PaycheckInvoiceMethod;
  completedDate: string;
  createAt: string;
  isDeleted: boolean;
  paidAmount: number;
  deductedAmount: number;
  invoiceCode: number;
}

type OrderItems = {
   productName: string
   imageUrl: string
   quantity: number
   singlePrice: number
   totalPrice: number
}

export interface PaycheckDetail {
  id: string;
  customerId: string;
  invoiceId: string;
  name: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  deliveryStatus: string;
  code: string;
  driverId: string;
  deliveriedDate: string;
  orderItems: OrderItems[]
}

export interface InvoiceType extends Paycheck {
   customerEmail: string
   customerName: string
   customerPhoneNumber: string
   customerAddress: string
}

export type PaycheckTransactionType = 'Credit' | 'Debit';

export interface PaycheckTransaction {
  id: string;
  amount: number;
  createDate: string;
  transactionType: PaycheckTransactionType;
  paymentStatus: string
  invoiceId: string
}

export interface PaycheckTransactionSummary {
  id: string
  amount: number;
  totalDebt: number;
  netAmount: number;
  customerTransactions: PaycheckTransaction[];
}
