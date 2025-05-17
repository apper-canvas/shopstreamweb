import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Terms of Service</h1>
      <div className="prose max-w-none dark:prose-invert lg:prose-xl">
        <p className="mb-4">
          Welcome to ShopStream. These terms and conditions outline the rules and regulations for 
          the use of our website.
        </p>

        <h2 className="mt-8 text-xl font-semibold">1. Acceptance of Terms</h2>
        <p className="mb-4">
          By accessing this website, you accept these terms and conditions in full. If you disagree 
          with these terms and conditions or any part of these terms and conditions, you must not 
          use this website.
        </p>

        <h2 className="mt-8 text-xl font-semibold">2. License to Use Website</h2>
        <p className="mb-4">
          Unless otherwise stated, ShopStream and/or its licensors own the intellectual property 
          rights in the website and material on the website. Subject to the license below, all these 
          intellectual property rights are reserved.
        </p>
        <p className="mb-4">
          You may view, download for caching purposes only, and print pages from the website for your 
          own personal use, subject to the restrictions set out below and elsewhere in these terms 
          and conditions.
        </p>

        <h2 className="mt-8 text-xl font-semibold">3. Account Registration</h2>
        <p className="mb-4">
          To use certain features of the website, you may be required to register for an account. 
          You agree to provide accurate, current, and complete information during the registration 
          process and to update such information to keep it accurate, current, and complete.
        </p>

        <h2 className="mt-8 text-xl font-semibold">4. Purchase and Payment</h2>
        <p className="mb-4">
          When you make a purchase through our website, you agree to provide a valid payment method. 
          By providing your payment information, you represent and warrant that you are authorized to 
          use the designated payment method.
        </p>

        <h2 className="mt-8 text-xl font-semibold">5. Shipping and Delivery</h2>
        <p className="mb-4">
          We will make every effort to deliver products within the estimated delivery times; however, 
          we cannot guarantee specific delivery dates. Delivery times may vary depending on your location 
          and other factors beyond our control.
        </p>

        <h2 className="mt-8 text-xl font-semibold">6. Returns and Refunds</h2>
        <p className="mb-4">
          Our return and refund policy is outlined separately on our Return Policy page. By making a 
          purchase on our website, you agree to the terms of our return and refund policy.
        </p>

        <h2 className="mt-8 text-xl font-semibold">7. Limitation of Liability</h2>
        <p className="mb-4">
          ShopStream will not be liable to you in relation to the contents of, or use of, or otherwise 
          in connection with, this website for any indirect, special or consequential loss; or for any 
          business losses, loss of revenue, income, profits or anticipated savings, loss of contracts 
          or business relationships, loss of reputation or goodwill, or loss or corruption of information 
          or data.
        </p>

        <h2 className="mt-8 text-xl font-semibold">8. Changes to Terms</h2>
        <p className="mb-4">
          ShopStream reserves the right to modify these terms from time to time at our sole discretion. 
          Therefore, you should review these pages periodically. When we change the Terms in a material 
          manner, we will notify you that material changes have been made to the Terms.
        </p>

        <p className="mt-8 italic">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default TermsOfService;