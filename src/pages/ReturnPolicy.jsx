import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Return & Refund Policy</h1>
      <div className="prose max-w-none dark:prose-invert lg:prose-xl">
        <p className="mb-4">
          At ShopStream, we want you to be completely satisfied with your purchase. If you're not 
          entirely happy with your order, we're here to help.
        </p>
        
        <h2 className="mt-8 text-xl font-semibold">Return Policy</h2>
        <p className="mb-4">
          You may return most new, unopened items within 30 days of delivery for a full refund. 
          We'll also pay the return shipping costs if the return is a result of our error (you 
          received an incorrect or defective item, etc.).
        </p>
        <p className="mb-4">
          You should expect to receive your refund within four weeks of giving your package to 
          the return shipper, however, in many cases you will receive a refund more quickly. This 
          time period includes the transit time for us to receive your return from the shipper 
          (5 to 10 business days), the time it takes us to process your return once we receive it 
          (3 to 5 business days), and the time it takes your bank to process our refund request 
          (5 to 10 business days).
        </p>
        <p className="mb-4">
          If you need to return an item, please <a href="/contact" className="text-primary hover:underline">Contact Us</a> with 
          your order number and details about the product you would like to return. We will provide 
          you with a Return Merchandise Authorization (RMA) number and instructions for how to return 
          your product.
        </p>
        
        <h2 className="mt-8 text-xl font-semibold">Return Process</h2>
        <ol className="mb-4 list-decimal pl-8">
          <li>Contact our customer service team for a Return Merchandise Authorization (RMA) number</li>
          <li>Package your return securely with the original packaging, if possible</li>
          <li>Include your RMA number and order information inside the package</li>
          <li>Ship the package to the address provided in your RMA instructions</li>
          <li>Keep your shipping receipt and tracking information until your return is processed</li>
        </ol>
        
        <h2 className="mt-8 text-xl font-semibold">Refunds</h2>
        <p className="mb-4">
          Once your return is received and inspected, we will send you an email to notify you that 
          we have received your returned item. We will also notify you of the approval or rejection 
          of your refund.
        </p>
        <p className="mb-4">
          If you are approved, then your refund will be processed, and a credit will automatically 
          be applied to your credit card or original method of payment, within a certain amount of days.
        </p>
        
        <h3 className="mt-4 text-lg font-semibold">Late or Missing Refunds</h3>
        <p className="mb-4">
          If you haven't received a refund yet, first check your bank account again. Then contact your 
          credit card company, it may take some time before your refund is officially posted. Next, 
          contact your bank. There is often some processing time before a refund is posted. If you've 
          done all of this and you still have not received your refund yet, please contact us at 
          returns@shopstream.com.
        </p>
        
        <h2 className="mt-8 text-xl font-semibold">Exchanges</h2>
        <p className="mb-4">
          We only replace items if they are defective or damaged. If you need to exchange it for the 
          same item, send us an email at returns@shopstream.com and send your item to the address provided.
        </p>
        
        <h2 className="mt-8 text-xl font-semibold">Non-Returnable Items</h2>
        <p className="mb-4">
          Several types of goods are exempt from being returned. Non-returnable items include:
        </p>
        <ul className="mb-4 list-disc pl-8">
          <li>Gift cards</li>
          <li>Downloadable software products</li>
          <li>Personal care items that have been opened</li>
          <li>Perishable goods such as food, flowers, newspapers or magazines</li>
          <li>Intimate or sanitary goods, hazardous materials, or flammable liquids or gases</li>
          <li>Items that are personalized or custom-made to your specifications</li>
        </ul>
        
        <h2 className="mt-8 text-xl font-semibold">Damaged Items</h2>
        <p className="mb-4">
          If you receive a damaged item, please notify us immediately at support@shopstream.com. 
          Include photos of the damaged items and packaging to help us resolve your issue as quickly 
          as possible.
        </p>
        
        <h2 className="mt-8 text-xl font-semibold">Questions</h2>
        <p className="mb-4">
          If you have any questions about our Return & Refund Policy, please contact us at 
          returns@shopstream.com or through our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page.
        </p>
        
        <p className="mt-8 italic">Last updated: {new Date().toLocaleDateString()}</p>
      </div>
    </div>
  );
};

export default ReturnPolicy;