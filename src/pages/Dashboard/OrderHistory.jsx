import { useState } from 'react';
import { getIcon } from '../../utils/iconUtils';

// Get icons
const ShoppingBag = getIcon('ShoppingBag');
const Search = getIcon('Search');
const ChevronRight = getIcon('ChevronRight');
const Calendar = getIcon('Calendar');
const CheckCircle = getIcon('CheckCircle');
const Truck = getIcon('Truck');
const Package = getIcon('Package');
const Clock = getIcon('Clock');

export default function OrderHistory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const orders = [
    {
      id: 'ORD-5432112',
      date: '2023-11-15',
      status: 'delivered',
      total: 129.99,
      items: [
        { name: 'Wireless Headphones', quantity: 1, price: 99.99 },
        { name: 'USB-C Cable', quantity: 1, price: 12.99 },
        { name: 'Phone Case', quantity: 1, price: 17.99 }
      ]
    },
    {
      id: 'ORD-7865321',
      date: '2023-12-01',
      status: 'shipped',
      total: 249.99,
      trackingNumber: 'TRK-9876543',
      estimatedDelivery: '2023-12-05',
      items: [
        { name: 'Smart Watch', quantity: 1, price: 199.99 },
        { name: 'Watch Band', quantity: 2, price: 24.99 }
      ]
    },
    {
      id: 'ORD-9825631',
      date: '2023-12-10',
      status: 'processing',
      total: 59.99,
      items: [
        { name: 'Wireless Charger', quantity: 1, price: 39.99 },
        { name: 'Screen Protector', quantity: 1, price: 19.99 }
      ]
    }
  ];
  
  const filteredOrders = orders.filter(order => {
    // Filter by status
    if (statusFilter !== 'all' && order.status !== statusFilter) {
      return false;
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      return (
        order.id.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    return true;
  });
  
  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Helper function to get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return {
          bg: 'bg-green-100 dark:bg-green-900/30',
          text: 'text-green-700 dark:text-green-400',
          icon: CheckCircle
        };
      case 'shipped':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/30',
          text: 'text-blue-700 dark:text-blue-400',
          icon: Truck
        };
      case 'processing':
        return {
          bg: 'bg-yellow-100 dark:bg-yellow-900/30',
          text: 'text-yellow-700 dark:text-yellow-400',
          icon: Package
        };
      case 'pending':
        return {
          bg: 'bg-purple-100 dark:bg-purple-900/30',
          text: 'text-purple-700 dark:text-purple-400',
          icon: Clock
        };
      default:
        return {
          bg: 'bg-surface-100 dark:bg-surface-700',
          text: 'text-surface-700 dark:text-surface-300',
          icon: ShoppingBag
        };
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-surface-800 dark:text-white">Order History</h1>
      
      {/* Filters and search */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setStatusFilter('all')} 
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              statusFilter === 'all' ? 'bg-primary text-white' : 'bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600'
            }`}
          >
            All
          </button>
          {['processing', 'shipped', 'delivered'].map(status => (
            <button 
              key={status}
              onClick={() => setStatusFilter(status)} 
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                statusFilter === status ? 'bg-primary text-white' : 'bg-surface-100 text-surface-700 hover:bg-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        
        <div className="relative">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-surface-300 bg-white pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-white md:w-64"
          />
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-surface-400" />
        </div>
      </div>
      
      {/* Orders list */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-soft dark:bg-surface-800">
            <p className="text-surface-600 dark:text-surface-400">No orders found matching your criteria.</p>
          </div>
        ) : (
          filteredOrders.map(order => {
            const statusBadge = getStatusBadge(order.status);
            const StatusIcon = statusBadge.icon;
            
            return (
              <div key={order.id} className="rounded-xl bg-white p-5 shadow-soft dark:bg-surface-800">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-surface-200 pb-4 dark:border-surface-700">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-surface-800 dark:text-white">{order.id}</h3>
                      <span className={`flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge.bg} ${statusBadge.text}`}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center text-sm text-surface-500 dark:text-surface-400">
                      <Calendar className="mr-1 h-4 w-4" />
                      {formatDate(order.date)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-surface-500 dark:text-surface-400">Total Amount</p>
                    <p className="text-lg font-medium text-surface-800 dark:text-white">${order.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mb-3 space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <span className="text-surface-800 dark:text-white">{item.name}</span>
                        <span className="ml-2 text-surface-500 dark:text-surface-400">x{item.quantity}</span>
                      </div>
                      <span className="font-medium text-surface-800 dark:text-white">${item.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                {order.status === 'shipped' && (
                  <div className="mb-3 rounded-lg bg-surface-100 p-3 text-sm dark:bg-surface-700">
                    <p className="flex items-center text-surface-700 dark:text-surface-300">
                      <Truck className="mr-2 h-4 w-4" />
                      <span>Tracking: <span className="font-medium">{order.trackingNumber}</span></span>
                    </p>
                    <p className="mt-1 text-surface-600 dark:text-surface-400">
                      Estimated delivery: {formatDate(order.estimatedDelivery)}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button className="flex items-center text-sm font-medium text-primary hover:text-primary-dark">
                    View Order Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}