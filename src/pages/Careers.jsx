import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const BriefcaseIcon = getIcon('Briefcase');
const MapPinIcon = getIcon('MapPin');
const CalendarIcon = getIcon('Calendar');

const CareerCard = ({ title, department, location, type, postedDate, onClick }) => {
  return (
    <div 
      className="mb-4 cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-surface-800"
      onClick={onClick}
    >
      <h3 className="mb-2 text-xl font-semibold text-gray-800 dark:text-white">{title}</h3>
      <div className="mb-4 text-primary">{department}</div>
      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <MapPinIcon size={16} className="mr-2" />
          {location}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <BriefcaseIcon size={16} className="mr-2" />
          {type}
        </div>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <CalendarIcon size={16} className="mr-2" />
          Posted: {postedDate}
        </div>
      </div>
      <button className="rounded bg-primary px-4 py-2 text-white hover:bg-primary-dark">
        View Details
      </button>
    </div>
  );
};

const Careers = () => {
  const navigate = useNavigate();
  
  const openJobForm = (jobId) => {
    // Navigate to contact form with job ID
    navigate('/contact', { state: { subject: `Job Application: ${jobs.find(job => job.id === jobId).title}` } });
  };
  
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      postedDate: "June 15, 2023",
      description: "We're looking for a Senior Frontend Developer to join our engineering team and help build exceptional user experiences."
    },
    {
      id: 2,
      title: "UX/UI Designer",
      department: "Design",
      location: "New York, NY",
      type: "Full-time",
      postedDate: "July 2, 2023",
      description: "Join our design team to create intuitive and beautiful user interfaces for our e-commerce platform."
    },
    {
      id: 3,
      title: "Customer Support Specialist",
      department: "Customer Service",
      location: "Remote",
      type: "Full-time",
      postedDate: "July 10, 2023",
      description: "Help our customers have the best shopping experience by providing exceptional support."
    },
    {
      id: 4,
      title: "Marketing Coordinator",
      department: "Marketing",
      location: "Los Angeles, CA",
      type: "Full-time",
      postedDate: "July 18, 2023",
      description: "Join our marketing team to help promote our products and grow our customer base."
    },
    {
      id: 5,
      title: "Product Manager",
      department: "Product",
      location: "San Francisco, CA",
      type: "Full-time",
      postedDate: "August 1, 2023",
      description: "Drive the vision and strategy for our product offerings and lead cross-functional teams."
    }
  ];

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-white">Careers at ShopStream</h1>
      
      <div className="mb-10 rounded-lg bg-primary-light p-8 dark:bg-surface-800">
        <h2 className="mb-4 text-2xl font-bold text-gray-800 dark:text-white">Join Our Team</h2>
        <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
          At ShopStream, we're building the future of e-commerce. We're looking for passionate individuals 
          who are excited about creating exceptional shopping experiences and driving innovation.
        </p>
        <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-surface-700">
            <h3 className="mb-2 text-xl font-semibold">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We push boundaries and challenge conventions to create the best shopping experience.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-surface-700">
            <h3 className="mb-2 text-xl font-semibold">Growth</h3>
            <p className="text-gray-600 dark:text-gray-300">
              We provide opportunities for personal and professional development at every level.
            </p>
          </div>
          <div className="rounded-lg bg-white p-6 shadow-md dark:bg-surface-700">
            <h3 className="mb-2 text-xl font-semibold">Impact</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your work directly affects our customers and helps shape the future of our platform.
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="mb-6 text-2xl font-bold text-gray-800 dark:text-white">Open Positions</h2>
      <div>
        {jobs.map((job) => (
          <CareerCard key={job.id} {...job} onClick={() => openJobForm(job.id)} />
        ))}
      </div>
    </div>
  );
};

export default Careers;