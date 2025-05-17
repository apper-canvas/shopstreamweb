import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getIcon } from '../../utils/iconUtils';
import { useProducts } from '../../contexts/ProductContext';
import Chart from 'react-apexcharts';

// Get icons
const Package = getIcon('Package');
const Users = getIcon('Users');
const ShoppingBag = getIcon('ShoppingBag');
const DollarSign = getIcon('DollarSign');
const TrendingUp = getIcon('TrendingUp');
const TrendingDown = getIcon('TrendingDown');
const AlertCircle = getIcon('AlertCircle');

export default function AdminDashboard() {
  const { products } = useProducts();
  const [lowStockProducts, setLowStockProducts] = useState([]);
  
  useEffect(() => {
    // Find products with low inventory (less than 10)
    if (products) {
      setLowStockProducts(products.filter(product => product.inventory < 10));
    }
  }, [products]);

  // Sample data for statistics
  const stats = [
    {
      title: 'Total Products',
      value: products?.length || 0,
      icon: Package,
      trend: 8.2,
      trendUp: true,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Customers',
      value: 1245,
      icon: Users,
      trend: 12.5,
      trendUp: true,
      color: 'bg-purple-500'
    },
    {
      title: 'Orders This Month',
      value: 348,
      icon: ShoppingBag,
      trend: 3.8,
      trendUp: false,
      color: 'bg-amber-500'
    },
    {
      title: 'Revenue This Month',
      value: '$32,580',
      icon: DollarSign,
      trend: 7.4,
      trendUp: true,
      color: 'bg-green-500'
    }
  ];

  // Chart options for sales overview
  const salesChartOptions = {
    chart: {
      type: 'area',
      fontFamily: 'Inter, sans-serif',
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 2 },
    colors: ['#3b82f6'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3
      }
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { style: { colors: '#64748b' } }
    },
    yaxis: { labels: { style: { colors: '#64748b' } } },
    tooltip: { theme: 'dark' }
  };
  
  const salesChartSeries = [
    {
      name: 'Monthly Sales',
      data: [4500, 5200, 4800, 5900, 6500, 7200, 8100, 9000, 8600, 9200, 10100, 11500]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-800 dark:text-white">Admin Dashboard</h1>
        <Link to="/admin/products/new" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
          Add New Product
        </Link>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div key={index} className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-surface-500 dark:text-surface-400">{stat.title}</p>
                <h3 className="mt-2 text-3xl font-bold text-surface-800 dark:text-white">{stat.value}</h3>
              </div>
              <div className={`rounded-full ${stat.color} p-3 text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {stat.trendUp ? <TrendingUp className="mr-1 h-4 w-4 text-green-500" /> : <TrendingDown className="mr-1 h-4 w-4 text-red-500" />}
              <span className={stat.trendUp ? 'text-green-500' : 'text-red-500'}>{stat.trend}% {stat.trendUp ? 'increase' : 'decrease'}</span>
              <span className="ml-1.5 text-surface-500 dark:text-surface-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart */}
      <div className="rounded-xl bg-white p-6 shadow-soft dark:bg-surface-800">
        <h2 className="mb-4 text-lg font-semibold text-surface-800 dark:text-white">Sales Overview</h2>
        <Chart options={salesChartOptions} series={salesChartSeries} type="area" height={350} />
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-xl bg-red-50 p-6 dark:bg-red-900/20">
          <div className="mb-4 flex items-center text-red-600 dark:text-red-400">
            <AlertCircle className="mr-2 h-5 w-5" />
            <h2 className="text-lg font-semibold">Low Stock Alert</h2>
          </div>
          <p className="mb-3 text-surface-700 dark:text-surface-300">The following products are running low on inventory:</p>
          <div className="space-y-2">
            {lowStockProducts.map(product => (
              <Link key={product.id} to={`/admin/products/edit/${product.id}`} className="block rounded bg-white p-3 shadow-sm hover:bg-surface-50 dark:bg-surface-800 dark:hover:bg-surface-700">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-surface-800 dark:text-white">{product.name}</span>
                  <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    Only {product.inventory} left
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <Link to="/admin/products" className="mt-4 inline-block text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light">
            View all products →
          </Link>
        </div>
      )}
    </div>
  );
}