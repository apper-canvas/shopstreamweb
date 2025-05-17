import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const MapPinIcon = getIcon('MapPin');
const PhoneIcon = getIcon('Phone');
const MailIcon = getIcon('Mail');
const FacebookIcon = getIcon('Facebook');
const TwitterIcon = getIcon('Twitter');
const InstagramIcon = getIcon('Instagram');
const LinkedinIcon = getIcon('Linkedin');

export default function About() {
  // Team members data
  const teamMembers = [
    {
      name: "Sarah Johnson",
      role: "CEO & Founder",
      image: "https://burst.shopifycdn.com/photos/woman-in-pink-professional.jpg",
      bio: "Led the company from startup to market leader in just 5 years."
    },
    {
      name: "Michael Chen",
      role: "CTO",
      image: "https://burst.shopifycdn.com/photos/man-working-at-home.jpg",
      bio: "Tech visionary with over 15 years of e-commerce experience."
    },
    {
      name: "Emily Rodriguez",
      role: "Design Director",
      image: "https://burst.shopifycdn.com/photos/businesswoman-smiles-in-office.jpg",
      bio: "Award-winning designer who leads our product innovation team."
    },
    {
      name: "David Williams",
      role: "Head of Customer Experience",
      image: "https://burst.shopifycdn.com/photos/business-man-smiling.jpg",
      bio: "Passionate about creating exceptional customer journeys."
    }
  ];
  
  // Company values
  const values = [
    {
      title: "Quality First",
      description: "We never compromise on the quality of our products and services."
    },
    {
      title: "Customer Centricity",
      description: "Everything we do is focused on providing exceptional customer experiences."
    },
    {
      title: "Innovation",
      description: "We're constantly exploring new ways to improve and evolve."
    },
    {
      title: "Sustainability",
      description: "We're committed to environmentally responsible business practices."
    }
  ];

  return (
    <div className="min-h-screen bg-surface-50 transition-colors dark:bg-surface-900">
      <main className="container mx-auto px-4 py-8">
        {/* Hero section */}
        <section className="mb-16">
          <motion.div
            className="rounded-xl bg-primary bg-gradient-to-br from-primary to-primary-dark p-8 text-white md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">About ShopStream</h1>
            <p className="mb-6 max-w-3xl text-lg text-blue-100">
              Founded in 2018, ShopStream has grown from a small startup to one of the leading e-commerce platforms. 
              Our mission is to provide customers with high-quality products at competitive prices while delivering 
              an exceptional shopping experience.
            </p>
          </motion.div>
        </section>
        
        {/* Our Story section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-surface-800 dark:text-white">Our Story</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="mb-4 text-surface-700 dark:text-surface-300">
                ShopStream began with a simple idea: to create an online shopping experience that combines 
                the convenience of digital commerce with the personal touch of a neighborhood store.
              </p>
              <p className="mb-4 text-surface-700 dark:text-surface-300">
                Our founder, Sarah Johnson, recognized that many online shoppers felt disconnected from their 
                purchases and missed the guidance and expertise traditionally provided in physical retail. 
                This insight led to the development of ShopStream's unique approach to e-commerce.
              </p>
              <p className="text-surface-700 dark:text-surface-300">
                Today, ShopStream serves over 2 million customers worldwide and partners with more than 500 brands. 
                We continue to innovate and expand, always staying true to our core values and commitment to excellence.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden">
              <img 
                src="https://burst.shopifycdn.com/photos/brick-commercial-space.jpg" 
                alt="ShopStream headquarters" 
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>
        
        {/* Our Values section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-surface-800 dark:text-white">Our Values</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                className="rounded-lg bg-white p-6 shadow-soft dark:bg-surface-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <h3 className="mb-3 text-xl font-semibold text-primary">{value.title}</h3>
                <p className="text-surface-600 dark:text-surface-400">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Team section */}
        <section className="mb-16">
          <h2 className="mb-8 text-3xl font-bold text-surface-800 dark:text-white">Our Team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="overflow-hidden rounded-lg bg-white shadow-soft dark:bg-surface-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.3 }}
              >
                <img src={member.image} alt={member.name} className="h-64 w-full object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-surface-800 dark:text-white">{member.name}</h3>
                  <p className="mb-2 text-primary">{member.role}</p>
                  <p className="text-sm text-surface-600 dark:text-surface-400">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Contact section */}
        <section>
          <h2 className="mb-8 text-3xl font-bold text-surface-800 dark:text-white">Contact Us</h2>
          <div className="grid gap-8 rounded-lg bg-white p-6 shadow-soft dark:bg-surface-800 md:grid-cols-2">
            <div>
              <p className="mb-6 text-surface-700 dark:text-surface-300">
                Have questions or feedback? We'd love to hear from you! Our customer support team is available
                7 days a week to assist you with any inquiries.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPinIcon className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-surface-700 dark:text-surface-300">
                    123 Commerce Street, Suite 500<br />
                    San Francisco, CA 94103
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <PhoneIcon className="h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-surface-700 dark:text-surface-300">(800) 123-4567</p>
                </div>
                <div className="flex items-center gap-3">
                  <MailIcon className="h-5 w-5 flex-shrink-0 text-primary" />
                  <p className="text-surface-700 dark:text-surface-300">support@shopstream.com</p>
                </div>
              </div>
              <div className="mt-6 flex gap-4">
                <a href="#" className="text-surface-500 hover:text-primary dark:text-surface-400"><FacebookIcon className="h-6 w-6" /></a>
                <a href="#" className="text-surface-500 hover:text-primary dark:text-surface-400"><TwitterIcon className="h-6 w-6" /></a>
                <a href="#" className="text-surface-500 hover:text-primary dark:text-surface-400"><InstagramIcon className="h-6 w-6" /></a>
                <a href="#" className="text-surface-500 hover:text-primary dark:text-surface-400"><LinkedinIcon className="h-6 w-6" /></a>
              </div>
            </div>
            <div>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="mt-1 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-surface-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="mt-1 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-surface-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-surface-700 dark:text-surface-300">Message</label>
                  <textarea 
                    id="message" 
                    rows="4" 
                    className="mt-1 w-full rounded-lg border border-surface-300 bg-white px-3 py-2 text-surface-800 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-surface-600 dark:bg-surface-700 dark:text-white"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary-dark"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}