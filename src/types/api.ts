export type User = {
  _id: string;
  googleId: string;
  email: string;
  displayName: string;
  photoUrl: string;
  isAdmin: boolean;
  isApproved: boolean;
  status: 'pending' | 'approved' | 'denied';
  assignedStoreIds: string[];
  assignedStores: Store[];
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  baseName: string;
  size: 'small' | 'large';
  ingredients: string[];
  image: string;
  price: number;
  isActive: boolean;
  sortOrder: number;
};

export type Store = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  isActive: boolean;
  pickupAddress: string;
  pickupNotes: string;
  mapLocation?: {
    lat: number;
    lng: number;
  };
  markupAmount: number;
  availableProductIds: string[];
  options: Record<string, unknown>;
};

export type Config = {
  _id?: string;
  singletonKey?: string;
  deliveryDays: number[];
  lastOrderTime: string;
  businessTimeZone?: string;
  orderThanksMessage: string;
  contactEmail: string;
  orderNotificationEmails: string[];
  signupNotificationEmails: string[];
};

export type OrderStatus = 'pending' | 'confirmed' | 'ready' | 'completed' | 'cancelled';

export type OrderLineItem = {
  productId:
    | string
    | Product
    | {
        _id: string;
        name: string;
      };
  quantity: number;
  basePrice: number;
  markupAmount: number;
  finalUnitPrice: number;
  lineTotal: number;
};

export type Order = {
  _id: string;
  userId:
    | string
    | User
    | {
        _id: string;
        displayName: string;
        email: string;
      };
  storeId:
    | string
    | Store
    | {
        _id: string;
        name: string;
      };
  fulfillmentDate: string;
  status: OrderStatus;
  deleted: boolean;
  lineItems: OrderLineItem[];
  notes: string;
  totals: {
    subtotal: number;
    markupTotal: number;
    total: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};
