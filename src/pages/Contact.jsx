import React, { useState } from 'react';
import { getIcon } from '../utils/iconUtils';
import { toast } from 'react-toastify';

const PhoneIcon = getIcon('Phone');
const MailIcon = getIcon('Mail');
const MapPinIcon = getIcon('MapPin');

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Your message has been sent! We will contact you soon.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    }, 1000);
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Contact Us</h1>
      
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <div className="mb-6 rounded-lg bg-white p-6 shadow-md dark:bg-surface-800">
            <h2 className="mb-4 text-xl font-semibold">Get in Touch</h2>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              Have questions about our products or services? We're here to help! Fill out the form and we'll get back to you as soon as possible.
            </p>
            
            <div className="mb-4 flex items-center">
              <PhoneIcon className="mr-3 text-primary" size={20} />
              <span>+1 (800) SHOP-NOW</span>
            </div>
            
            <div className="mb-4 flex items-center">
              <MailIcon className="mr-3 text-primary" size={20} />
              <span>support@shopstream.com</span>
            </div>
            
            <div className="flex items-center">
              <MapPinIcon className="mr-3 text-primary" size={20} />
              <span>123 Commerce St, Shopping City, SC 12345</span>
            </div>
          </div>
          
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-surface-800">
            <h2 className="mb-4 text-xl font-semibold">Business Hours</h2>
            <p className="mb-2"><strong>Monday-Friday:</strong> 9:00 AM - 7:00 PM EST</p>
            <p className="mb-2"><strong>Saturday:</strong> 10:00 AM - 5:00 PM EST</p>
            <p><strong>Sunday:</strong> Closed</p>
          </div>
        </div>
        
        <div className="rounded-lg bg-white p-6 shadow-md dark:bg-surface-800">
          <h2 className="mb-4 text-xl font-semibold">Send us a Message</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="mb-2 block font-medium">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Your name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="mb-2 block font-medium">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="Your email"
              />
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="subject" className="mb-2 block font-medium">Subject</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors.subject ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="What is this about?"
              />
              {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
            </div>
            
            <div className="mb-4">
              <label htmlFor="message" className="mb-2 block font-medium">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                className={`w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary ${errors.message ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                placeholder="How can we help you?"
              ></textarea>
              {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-primary px-4 py-2 font-semibold text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-70"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;