import React from 'react';
import { getIcon } from '../utils/iconUtils';

const TruckIcon = getIcon('Truck');
const ClockIcon = getIcon('Clock');
const GlobeIcon = getIcon('Globe');
const PackageIcon = getIcon('Package');

const ShippingInfo = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Shipping Information</h1>
      
      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md dark:bg-surface-800">
          <TruckIcon size={40} className="mb-4 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Fast Delivery</h3>
          <p className="text-gray-600 dark:text-gray-300">Most orders ship within 1-2 business days</p>
        </div>
        
        <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md dark:bg-surface-800">
          <GlobeIcon size={40} className="mb-4 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Global Shipping</h3>
          <p className="text-gray-600 dark:text-gray-300">We ship to over 100 countries worldwide</p>
        </div>
        
        <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md dark:bg-surface-800">
          <PackageIcon size={40} className="mb-4 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Order Tracking</h3>
          <p className="text-gray-600 dark:text-gray-300">Track your package every step of the way</p>
        </div>
        
        <div className="flex flex-col items-center rounded-lg bg-white p-6 text-center shadow-md dark:bg-surface-800">
          <ClockIcon size={40} className="mb-4 text-primary" />
          <h3 className="mb-2 text-lg font-semibold">Delivery Options</h3>
          <p className="text-gray-600 dark:text-gray-300">Choose from standard, expedited, or express shipping</p>
        </div>
      </div>
      
      <div className="prose max-w-none dark:prose-invert lg:prose-xl">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Shipping Methods & Delivery Times</h2>
        
        <div className="mb-8 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-surface-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Shipping Method</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Estimated Delivery</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-surface-800">
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">Standard Shipping</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">3-7 business days</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">$5.99 (Free on orders over $50)</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">Expedited Shipping</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">2-3 business days</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">$10.99</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">Express Shipping</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">1-2 business days</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">$19.99</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-white">International Shipping</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">7-14 business days</td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">Varies by country</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p className="mb-4">
          Please note that delivery times are estimates and can vary based on location, customs 
          processing for international orders, and other factors outside our control.
        </p>
        
        <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-800 dark:text-white">International Shipping</h2>
        <p className="mb-4">
          We ship to most countries worldwide. International shipping rates vary depending on destination, 
          package weight, and value. Please note that international orders may be subject to import duties 
          and taxes, which are the responsibility of the recipient.
        </p>
        
        <h3 className="mb-2 mt-4 text-xl font-semibold">Customs & Import Duties</h3>
        <p className="mb-4">
          When ordering from ShopStream for delivery outside the United States, you may be subject to 
          import duties and taxes, which are levied once a shipment reaches your country. Additional 
          charges for customs clearance must be paid by you; we have no control over these charges and 
          cannot predict what they may be. Customs policies vary widely from country to country; you 
          should contact your local customs office for further information.
        </p>
        
        <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-800 dark:text-white">Order Processing</h2>
        <p className="mb-4">
          Most orders are processed within 1-2 business days after payment confirmation. During high-volume 
          periods such as holidays, processing times may be slightly longer. You will receive a shipping 
          confirmation email with tracking information once your order ships.
        </p>
        
        <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-800 dark:text-white">Tracking Your Order</h2>
        <p className="mb-4">
          You can track your order at any time by:
        </p>
        <ul className="mb-4 list-disc pl-8">
          <li>Using the tracking link in your shipping confirmation email</li>
          <li>Logging into your account and viewing your order history</li>
          <li>Visiting our <a href="/track-order" className="text-primary hover:underline">Order Tracking</a> page and entering your order details</li>
        </ul>
        
        <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-800 dark:text-white">Shipping Restrictions</h2>
        <p className="mb-4">
          Some items cannot be shipped to certain locations due to local regulations or logistical 
          constraints. If we are unable to ship a product to your location, we will notify you promptly 
          and provide options for resolution.
        </p>
        
        <h2 className="mb-4 mt-8 text-2xl font-bold text-gray-800 dark:text-white">Questions About Shipping?</h2>
        <p className="mb-4">
          If you have any questions about shipping, delivery times, or tracking, please contact our 
          customer service team through our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page.
        </p>
      </div>
    </div>
  );
};

export default ShippingInfo;