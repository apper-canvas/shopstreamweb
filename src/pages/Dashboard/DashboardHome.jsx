import { Link } from 'react-router-dom';
import { getIcon } from '../../utils/iconUtils';

// Get icons
const Settings = getIcon('Settings');
const MapPin = getIcon('MapPin');
const CreditCard = getIcon('CreditCard');
const Package = getIcon('Package');
const Heart = getIcon('Heart');
const ShoppingBag = getIcon('ShoppingBag');

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl bg-gradient-to-r from-primary/90 to-primary-dark p-6 text-white">
        <h1 className="mb-2 text-2xl font-semibold">Welcome back!</h1>
        <p className="text-blue-100">Manage your account, track orders, and update your preferences from your personal dashboard.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-4 shadow-soft dark:bg-surface-800">
          <div className="mb-2 text-2xl font-semibold">0</div>
          <div className="flex items-center text-surface-500 dark:text-surface-400">
            <Package className="mr-2 h-4 w-4" />
            <span>Orders in Progress</span>
          </div>
        </div>

        <div className="rounded-xl bg-white p-4 shadow-soft dark:bg-surface-800">
          <div className="mb-2 text-2xl font-semibold">0</div>
          <div className="flex items-center text-surface-500 dark:text-surface-400">
            <Heart className="mr-2 h-4 w-4" />
            <span>Saved for Later</span>
          </div>
        </div>
        
        <div className="rounded-xl bg-white p-4 shadow-soft dark:bg-surface-800">
          <div className="mb-2 text-2xl font-semibold">0</div>
          <div className="flex items-center text-surface-500 dark:text-surface-400">
            <MapPin className="mr-2 h-4 w-4" />
            <span>Saved Addresses</span>
          </div>
        </div>
        
        <div className="rounded-xl bg-white p-4 shadow-soft dark:bg-surface-800">
          <div className="mb-2 text-2xl font-semibold">0</div>
          <div className="flex items-center text-surface-500 dark:text-surface-400">
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Payment Methods</span>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-surface-800 dark:text-white">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { icon: Settings, title: "Account Settings", description: "Update your personal information and preferences", link: "/dashboard/account" },
            { icon: MapPin, title: "Manage Addresses", description: "Add or update your delivery addresses", link: "/dashboard/addresses" },
            { icon: CreditCard, title: "Payment Methods", description: "Manage your saved payment options", link: "/dashboard/payments" },
            { icon: Package, title: "Order History", description: "View and track all your previous orders", link: "/dashboard/orders" },
            { icon: Heart, title: "Saved Items", description: "Products you've saved for later", link: "#" },
            { icon: ShoppingBag, title: "Go Shopping", description: "Continue browsing our catalog", link: "/" }
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.link}
              className="flex items-start rounded-xl bg-white p-5 shadow-soft transition-transform hover:-translate-y-1 hover:shadow-md dark:bg-surface-800"
            >
              <div className="mr-4 rounded-full bg-primary/10 p-3 text-primary dark:bg-primary/20">
                <item.icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="mb-1 font-medium text-surface-800 dark:text-white">{item.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}