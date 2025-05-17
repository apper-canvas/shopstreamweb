import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Privacy Policy</h1>
      <div className="prose max-w-none dark:prose-invert lg:prose-xl">
        <p className="mb-4">
          At ShopStream, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you visit our website.
        </p>
        
        <h2 className="mt-8 text-xl font-semibold">Information We Collect</h2>
        <p className="mb-4">
          We collect information that you provide directly to us when you:
        </p>
        <ul className="mb-4 list-inside list-disc">
          <li>Register for an account</li>
          <li>Make a purchase</li>
          <li>Sign up for our newsletter</li>
          <li>Contact our customer service</li>
          <li>Participate in surveys or contests</li>
        </ul>
        <p className="mb-4">
          This information may include your name, email address, mailing address, phone number, 
          credit card information, and other details about yourself.
        </p>
        
        <h2 className="mt-8 text-xl font-semibold">Automatically Collected Information</h2>
        <p className="mb-4">
          When you access our website, we may automatically collect certain information about your 
          device, including information about your web browser, IP address, time zone, and some 
          of the cookies that are installed on your device.
        </p>
        <p className="mb-4">
          Additionally, as you browse the site, we collect information about the individual web pages 
          that you view, what websites or search terms referred you to our site, and information about 
          how you interact with the site.
        </p>
        
        <h2 className="mt-8 text-xl font-semibold">How We Use Your Information</h2>
        <p className="mb-4">
          We use the information we collect to:
        </p>
        <ul className="mb-4 list-inside list-disc">
          <li>Process and fulfill your orders</li>
          <li>Send you order confirmations and updates</li>
          <li>Respond to your comments and questions</li>
          <li>Send you marketing communications</li>
          <li>Improve our website and customer service</li>
          <li>Comply with legal obligations</li>
          <li>Detect and prevent fraud</li>
        </ul>
        
        <h2 className="mt-8 text-xl font-semibold">Sharing Your Information</h2>
        <p className="mb-4">
          We may share your personal information with:
        </p>
        <ul className="mb-4 list-inside list-disc">
          <li>Service providers who perform services on our behalf</li>
          <li>Business partners with whom we jointly offer products or services</li>
          <li>Law enforcement or other third parties when required by law</li>
        </ul>
        
        <h2 className="mt-8 text-xl font-semibold">Your Rights</h2>
        <p className="mb-4">
          Depending on your location, you may have certain rights regarding your personal information, 
          including:
        </p>
        <ul className="mb-4 list-inside list-disc">
          <li>The right to access and receive a copy of your personal information</li>
          <li>The right to rectify or update your personal information</li>
          <li>The right to delete your personal information</li>
          <li>The right to restrict or object to our processing of your personal information</li>
          <li>The right to data portability</li>
        </ul>
        
        <h2 className="mt-8 text-xl font-semibold">Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update this privacy policy from time to time in order to reflect changes to our 
          practices or for other operational, legal, or regulatory reasons. We will notify you of 
          any changes by posting the new policy on this page.
        </p>
        
        <p className="mt-8 italic">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;