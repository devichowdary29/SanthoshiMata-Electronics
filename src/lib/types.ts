export interface Product {
    id: string;
    name: string;
    brand: string;
    screen_size: string;
    display_type: string;
    price: number;
    emi_available: boolean;
    specs: string;
    warranty_info: string;
    stock_status: 'available' | 'out_of_stock' | 'limited';
    image_url: string;
    created_at: string;
    is_archived?: boolean;
}

export interface Enquiry {
    id: string;
    product_id: string;
    name: string;
    phone: string;
    message: string;
    created_at: string;
}

export interface Review {
    id: string;
    name: string;
    rating: number;
    message: string;
    photo_url: string | null;
    created_at: string;
}

export interface Banner {
    id: string;
    image_url: string;
    title: string;
    subtitle: string;
    active: boolean;
    created_at: string;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    address: string;
    notes: string | null;
    total_amount: number;
    payment_method: 'upi' | 'cash';
    payment_proof_url: string | null;
    order_status: 'pending_verification' | 'confirmed' | 'rejected' | 'shipped' | 'delivered';
    created_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    quantity: number;
    price: number;
    products?: Product;
}


export interface OrderWithItems extends Order {
    order_items: OrderItem[];
}

export type ServiceType = 'wall_mount' | 'demo' | 'repair';
export type ServiceStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export interface ServiceRequest {
    id: string;
    user_id: string;
    full_name: string;
    phone: string;
    address: string;
    service_type: ServiceType;
    description: string | null;
    preferred_date: string;
    time_slot: string;
    status: ServiceStatus;
    technician_name: string | null;
    image_url: string | null;
    created_at: string;
}
