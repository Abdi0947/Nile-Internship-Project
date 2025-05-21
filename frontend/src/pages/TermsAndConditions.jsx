import React from 'react';
import { motion } from 'framer-motion';
import { useDarkMode } from '../context/DarkModeContext';
import AuthNavbar from '../components/AuthNavbar';

const TermsAndConditions = () => {
  const { darkMode } = useDarkMode();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      <AuthNavbar />
      
      <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="prose prose-lg max-w-none"
        >
          <motion.h1 
            variants={itemVariants}
            className={`text-3xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}
          >
            Terms and Conditions
          </motion.h1>

          <motion.div variants={itemVariants} className="space-y-8">
            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                1. Acceptance of Terms
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                By accessing and using SchoolSmart Management System, you agree to be bound by these Terms and Conditions. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                2. User Accounts
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Users must provide accurate and complete information when creating an account. 
                You are responsible for maintaining the confidentiality of your account credentials 
                and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                3. Privacy and Data Protection
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We are committed to protecting your privacy. Our data collection and usage practices 
                are outlined in our Privacy Policy. By using our services, you consent to such 
                processing and you warrant that all data provided by you is accurate.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                4. User Responsibilities
              </h2>
              <ul className={`list-disc pl-6 space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <li>Maintain accurate and up-to-date information</li>
                <li>Use the system in accordance with applicable laws</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Report any security breaches or suspicious activities</li>
                <li>Not share account credentials with others</li>
              </ul>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                5. Intellectual Property
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                All content, features, and functionality of the SchoolSmart Management System are 
                owned by us and are protected by international copyright, trademark, and other 
                intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                6. Limitation of Liability
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                SchoolSmart shall not be liable for any indirect, incidental, special, consequential, 
                or punitive damages resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                7. Changes to Terms
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                We reserve the right to modify these terms at any time. We will notify users of any 
                material changes via email or through the platform. Continued use of the service 
                after such modifications constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className={`text-2xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                8. Contact Information
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                For any questions regarding these Terms and Conditions, please contact us through our 
                Telegram channel: <a 
                  href="https://t.me/abi_la" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  @abi_la
                </a>
              </p>
            </section>
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className={`mt-12 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions; 