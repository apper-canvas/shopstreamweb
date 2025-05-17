import React, { useState } from 'react';
import { getIcon } from '../utils/iconUtils';

const ChevronDownIcon = getIcon('ChevronDown');
const ChevronUpIcon = getIcon('ChevronUp');

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div className="border-b border-gray-200 py-4 dark:border-gray-700">
      <button
        className="flex w-full items-center justify-between text-left font-semibold focus:outline-none"
        onClick={onClick}
      >
        <span className="text-lg">{question}</span>
        <span className="ml-6 flex-shrink-0">
          {isOpen ? <ChevronUpIcon size={20} /> : <ChevronDownIcon size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className="mt-2 text-gray-600 dark:text-gray-300">
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ = () => {
  const [openItems, setOpenItems] = useState([0]); // First item open by default

  const toggleItem = (index) => {
    if (openItems.includes(index)) {
      setOpenItems(openItems.filter(item => item !== index));
    } else {
      setOpenItems([...openItems, index]);
    }
  };

  const faqItems = [
    {
      question: "How do I place an order?",
      answer: (
        <div>
          <p>Placing an order on ShopStream is easy:</p>
          <ol className="ml-6 mt-2 list-decimal">
            <li>Browse our products and add items to your cart</li>
            <li>Click on the cart icon to review your order</li>
            <li>Proceed to checkout and enter your shipping information</li>
            <li>Select your preferred payment method</li>
            <li>Review your order and click "Place Order"</li>
          </ol>
          <p className="mt-2">You'll receive an order confirmation email with all the details.</p>
        </div>
      )
    },
    {
      question: "What payment methods do you accept?",
      answer: (
        <p>
          We accept all major credit cards (Visa, MasterCard, American Express, Discover), 
          PayPal, and Apple Pay. For select countries, we also offer payment options like 
          bank transfers and cash on delivery.
        </p>
      )
    },
    {
      question: "How can I track my order?",
      answer: (
        <p>
          You can track your order by visiting the "Track Order" page in the main navigation 
          and entering your order number and email address. Alternatively, you can log into 
          your account and view your order history, where you'll find tracking information 
          for all your orders.
        </p>
      )
    },
    {
      question: "What is your return policy?",
      answer: (
        <p>
          We offer a 30-day return policy for most items. Products must be in their original 
          condition and packaging. Some products, like personalized items or intimate apparel, 
          may not be eligible for return. Please visit our <a href="/return-policy" className="text-primary hover:underline">Return Policy</a> page 
          for complete details.
        </p>
      )
    },
    {
      question: "How long will shipping take?",
      answer: (
        <div>
          <p>Shipping times vary depending on your location and the shipping method selected:</p>
          <ul className="ml-6 mt-2 list-disc">
            <li>Standard Shipping: 3-7 business days</li>
            <li>Expedited Shipping: 2-3 business days</li>
            <li>Express Shipping: 1-2 business days</li>
          </ul>
          <p className="mt-2">
            International shipping may take 7-14 business days depending on the destination country. 
            For more details, please visit our <a href="/shipping-info" className="text-primary hover:underline">Shipping Information</a> page.
          </p>
        </div>
      )
    },
    {
      question: "Do you ship internationally?",
      answer: (
        <p>
          Yes, we ship to most countries worldwide. International shipping rates and delivery 
          times vary by location. Please note that international orders may be subject to import 
          duties and taxes, which are the responsibility of the recipient.
        </p>
      )
    },
    {
      question: "How do I create an account?",
      answer: (
        <p>
          You can create an account by clicking on the "Login" link in the top navigation and 
          selecting "Register". Fill in your details, including your name, email address, and 
          password. Once registered, you can manage your orders, save addresses, and enjoy a 
          faster checkout process.
        </p>
      )
    },
    {
      question: "How can I contact customer support?",
      answer: (
        <p>
          You can reach our customer support team through our <a href="/contact" className="text-primary hover:underline">Contact Us</a> page. 
          We're available Monday through Friday, 9am to 5pm EST. You can also email us at 
          support@shopstream.com or call us at 1-800-SHOP-NOW.
        </p>
      )
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Frequently Asked Questions</h1>
      <div className="max-w-3xl">
        {faqItems.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} isOpen={openItems.includes(index)} onClick={() => toggleItem(index)} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;