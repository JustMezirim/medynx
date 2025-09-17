"use client"

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            
            <div className="flex items-center space-x-3 -mt-20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/logo/medynx.png" 
                alt="Medynx Logo"
                className="w-60 h-auto"
              />
            </div>
            <p className="text-gray-400 -mt-15">Making healthcare accessible and simple for everyone.</p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Doctor Consultation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Appointments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Health Records
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Emergency Care
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-white transition-colors">
                  Lab Tests
                </a>
              </li> */}
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Mental Health
                </a>
              </li>
              {/* <li>
                <a href="#" className="hover:text-white transition-colors">
                  Prescription Delivery
                </a>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Medynx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer