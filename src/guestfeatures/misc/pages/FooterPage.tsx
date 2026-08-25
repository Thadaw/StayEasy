import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const pageData: Record<string, { title: string; content: string[] }> = {
  'help-center': {
    title: 'Help Center',
    content: [
      'Welcome to the ServeIQ Help Center. Find answers to common questions about booking, hosting, and managing your account.',
      'Browse our guides below or contact our support team for personalized assistance.',
      'Booking Help: Learn how to search, book, and manage your reservations step by step.',
      'Account Management: Update your profile, change passwords, and manage notification preferences.',
      'Payment Issues: Troubleshoot payment failures, understand invoices, and review transaction history.',
      'Property Listings: Get help creating, editing, and optimizing your property listings.',
    ],
  },
  'contact': {
    title: 'Contact Us',
    content: [
      'We are here to help. Reach out to our support team through any of the channels below.',
      'Email: support@serveiq.com — We respond within 24 hours.',
      'Phone: +1 (800) 555-SERVE — Available Monday to Friday, 9AM to 6PM EST.',
      'Live Chat: Available on our website and mobile app during business hours.',
      'Social Media: Follow us on Twitter, Facebook, and Instagram for updates and quick responses.',
    ],
  },
  'booking-help': {
    title: 'Booking Help',
    content: [
      'Need help with a booking? We have got you covered.',
      'How to Book: Search for properties, select dates, choose guests, and complete payment to confirm your reservation.',
      'Modifying a Booking: Go to your profile > Bookings to view and request changes to existing reservations.',
      'Cancellation: Review the cancellation policy on your booking details page. Free cancellation is available within the allowed window.',
      'Confirmation Issues: Check your email spam folder or contact support with your booking reference number.',
      'Group Bookings: For reservations with 5+ rooms, contact our group booking team for special rates.',
    ],
  },
  'cancellation-refund': {
    title: 'Cancellation & Refund',
    content: [
      'We understand plans change. Here is what you need to know about cancellations and refunds.',
      'Free Cancellation: Most bookings offer free cancellation up to 24-48 hours before check-in. Check your booking details for the exact policy.',
      'Late Cancellation: Cancellations made after the free window may incur a charge equal to the first night stay.',
      'No-Show: Guests who do not check in on the scheduled date will be charged the full booking amount.',
      'Refund Processing: Approved refunds are processed within 5-10 business days to the original payment method.',
      'Disputes: If you believe a charge was made in error, contact our support team with your booking reference.',
    ],
  },
  'payment-security': {
    title: 'Payment & Security',
    content: [
      'Your payment security is our top priority. We use industry-standard encryption to protect all transactions.',
      'Accepted Methods: We accept major credit cards (Visa, MasterCard, American Express), Khalti, eSewa, and bank transfers.',
      'Secure Processing: All payment data is encrypted using 256-bit SSL technology and processed through PCI-compliant gateways.',
      'Currency: Prices are displayed in USD by default. Currency conversion rates are provided by your bank.',
      'Invoices: Download invoices from your profile > Bookings > select a booking > Download Invoice.',
      'Refunds: Refunds are issued to the original payment method within 5-10 business days after approval.',
    ],
  },
  'safety': {
    title: 'Safety Information',
    content: [
      'Your safety matters to us. Here are guidelines to ensure a safe experience on ServeIQ.',
      'For Guests: Always verify the property details and host profile before booking. Read reviews from previous guests.',
      'Check-In: Confirm check-in instructions with your host 24 hours before arrival. Share your itinerary with a trusted contact.',
      'During Stay: Report any safety concerns to the host immediately. Emergency services can be reached at 911.',
      'Property Standards: All listed properties must meet our safety standards including fire safety, clean water, and secure locks.',
      'Travel Insurance: We recommend purchasing travel insurance for unexpected events like medical emergencies or trip cancellations.',
      'COVID-19: Check local health guidelines before traveling. Some properties may have additional cleaning protocols.',
    ],
  },
  'accessibility': {
    title: 'Accessibility',
    content: [
      'ServeIQ is committed to making travel accessible for everyone.',
      'Wheelchair Accessible Properties: Use the accessibility filter when searching to find properties with step-free access, wide doorways, and accessible bathrooms.',
      'Visual & Hearing Accommodations: Look for properties that offer visual alarms, TTY devices, and written communication options.',
      'Service Animals: All properties on ServeIQ welcome service animals as required by law.',
      'Website Accessibility: Our website follows WCAG 2.1 AA standards. Use keyboard navigation, screen readers, and zoom features as needed.',
      'Special Requests: Contact the host directly before booking to discuss specific accessibility needs.',
      'Feedback: Help us improve by sharing your accessibility experience at accessibility@serveiq.com.',
    ],
  },
  'destinations': {
    title: 'Popular Destinations',
    content: [
      'Explore trending travel destinations loved by our guests worldwide.',
      'Paris, France — The City of Light offers iconic landmarks, world-class cuisine, and charming neighborhoods.',
      'Tokyo, Japan — A perfect blend of ancient temples, cutting-edge technology, and incredible food scenes.',
      'New York City, USA — From Broadway shows to Central Park, the city that never sleeps has something for everyone.',
      'Bali, Indonesia — Tropical paradise with stunning beaches, vibrant culture, and affordable luxury stays.',
      'London, United Kingdom — Rich history, diverse culture, and world-renowned museums and galleries.',
      'Dubai, UAE — Futuristic architecture, luxury shopping, and desert adventures await.',
      'Search for properties in any destination to find unique stays at competitive prices.',
    ],
  },
  'hotels-stays': {
    title: 'Hotels & Stays',
    content: [
      'Discover a wide range of accommodations to suit every travel style and budget.',
      'Hotels: From budget-friendly rooms to luxury suites, find hotels in prime locations worldwide.',
      'Vacation Rentals: Enjoy the comfort of a home away from home with fully equipped apartments and houses.',
      'Unique Stays: Experience treehouses, villas, boutique hotels, and other one-of-a-kind properties.',
      'Extended Stays: Planning a longer trip? Look for monthly discounts on stays of 28+ nights.',
      'Filter by amenities: Pool, WiFi, kitchen, parking, pet-friendly, and more to find your perfect match.',
      'All properties are verified by our team to ensure quality and accuracy of listings.',
    ],
  },
  'offers': {
    title: 'Offers & Deals',
    content: [
      'Save big with exclusive offers and seasonal deals on ServeIQ.',
      'New User Discount: Get 10% off your first booking when you sign up for a new account.',
      'Early Bird Deals: Book 30+ days in advance and enjoy discounts of up to 20% on select properties.',
      'Long Stay Discounts: Staying 7+ nights? Many hosts offer weekly discounts automatically applied at checkout.',
      'Seasonal Promotions: Check our homepage for limited-time offers during holidays and special events.',
      'Referral Program: Invite friends to ServeIQ and both of you earn credits toward your next booking.',
      'Subscribe to our newsletter to be the first to know about new deals and exclusive offers.',
    ],
  },
  'nearby-stays': {
    title: 'Nearby Stays',
    content: [
      'Find great places to stay close to your current location or planned destination.',
      'Location Search: Use the search bar and enter your city, neighborhood, or landmark to find nearby properties.',
      'Map View: Switch to map view on the search results page to see property locations relative to points of interest.',
      'Distance Filters: Set your preferred distance radius to find stays within walking or driving distance.',
      'Popular Near-Me Categories: Airport proximity, downtown locations, beachfront properties, and ski resorts.',
      'Last-Minute Bookings: Need a place tonight? Filter for same-day availability to find last-minute deals.',
      'Local Experiences: Many hosts offer personalized recommendations for nearby restaurants, attractions, and activities.',
    ],
  },
  'hosting-guide': {
    title: 'Hosting Guide',
    content: [
      'Everything you need to know to become a successful host on ServeIQ.',
      'Getting Started: Create your listing with high-quality photos, accurate descriptions, and competitive pricing.',
      'Pricing Strategy: Research similar properties in your area. Consider seasonal demand, local events, and amenities.',
      'Guest Communication: Respond to inquiries within 2 hours. Clear check-in instructions reduce guest issues by 80%.',
      'Property Preparation: Ensure clean linens, stocked essentials, and a welcoming atmosphere for every guest.',
      'Superhost Status: Maintain high ratings, low cancellation rates, and fast responses to earn Superhost badges.',
      'Legal Considerations: Check local regulations regarding short-term rentals and obtain necessary permits.',
    ],
  },
  'host-resources': {
    title: 'Host Resources',
    content: [
      'Access tools and resources to optimize your hosting experience.',
      'Dashboard Analytics: Track your occupancy rates, revenue, and guest reviews in the host dashboard.',
      'Photography Guide: Learn how to take stunning property photos that attract more bookings.',
      'Pricing Tools: Use our dynamic pricing calculator to set competitive rates based on market data.',
      'Cleaning Checklists: Download printable cleaning checklists to maintain consistent property standards.',
      'Tax Information: Access guides on reporting rental income and understanding tax deductions for hosts.',
      'Community Forum: Connect with other hosts to share tips, advice, and best practices.',
    ],
  },
  'host-safety': {
    title: 'Host Safety',
    content: [
      'Your safety and property security are important to us.',
      'Guest Verification: All guests must verify their identity before booking. Review guest profiles and ratings.',
      'Security Deposits: Set a security deposit to protect against potential property damage.',
      'House Rules: Clearly communicate your house rules in the listing to set expectations before booking.',
      'Insurance: Consider host protection insurance to cover damages caused by guests during their stay.',
      'Emergency Contacts: Keep local emergency numbers handy and share them with your co-host if applicable.',
      'Property Inspections: Conduct regular inspections to identify and address maintenance issues promptly.',
    ],
  },
  'host-support': {
    title: 'Host Support',
    content: [
      'Get help with your hosting journey from our dedicated support team.',
      'Priority Support: Superhosts receive priority response times for all support inquiries.',
      'Listing Issues: Report problems with your listing visibility, pricing display, or booking calendar.',
      'Guest Disputes: Our mediation team can help resolve conflicts between hosts and guests fairly.',
      'Account Assistance: Help with account settings, payment setup, tax forms, and verification.',
      'Technical Issues: Report bugs or functionality problems through the host support portal.',
      'Contact: Email host-support@serveiq.com or call +1 (800) 555-HOST for immediate assistance.',
    ],
  },
  'about': {
    title: 'About ServeIQ',
    content: [
      'ServeIQ is a modern property management and booking platform designed for the hospitality industry.',
      'Our Mission: To connect travelers with unique stays while empowering hosts to grow their business.',
      'Founded in 2024, ServeIQ serves thousands of hosts and guests across multiple countries.',
      'What We Offer: Property listings, booking management, payment processing, channel management, and analytics.',
      'Our Values: Transparency, quality, innovation, and community drive everything we do.',
      'Team: A passionate group of hospitality and technology professionals dedicated to improving the travel experience.',
      'Join us in building the future of hospitality. Whether you are a guest or host, ServeIQ is for you.',
    ],
  },
  'features': {
    title: 'Features',
    content: [
      'Discover the powerful features that make ServeIQ the preferred platform for hosts and guests.',
      'Smart Calendar: Sync bookings across multiple platforms and prevent double-bookings automatically.',
      'Dynamic Pricing: AI-powered pricing recommendations based on demand, seasonality, and competitor analysis.',
      'Channel Manager: Connect to Airbnb, Booking.com, Vrbo, and other OTAs from a single dashboard.',
      'Guest Communication: Automated messages, templated responses, and multi-language support.',
      'Analytics Dashboard: Real-time insights into revenue, occupancy, guest demographics, and performance trends.',
      'Mobile App: Manage your properties, communicate with guests, and track bookings on the go.',
      'Payment Processing: Secure, hassle-free payments with support for multiple currencies and methods.',
    ],
  },
  'careers': {
    title: 'Careers',
    content: [
      'Join the ServeIQ team and help shape the future of hospitality technology.',
      'We are a fast-growing startup with a mission to revolutionize how people travel and host.',
      'Open Positions: Check our careers page for current openings in engineering, design, marketing, and operations.',
      'Culture: We value innovation, collaboration, diversity, and continuous learning.',
      'Benefits: Competitive salaries, health insurance, remote work options, and professional development budgets.',
      'Internships: We offer internship programs for students and recent graduates looking to gain industry experience.',
      'Apply: Send your resume and cover letter to careers@serveiq.com with the position title in the subject line.',
    ],
  },
  'privacy': {
    title: 'Privacy Policy',
    content: [
      'Last updated: January 2026',
      'At ServeIQ, we respect your privacy and are committed to protecting your personal data.',
      'Information We Collect: Account details (name, email, phone), payment information, booking history, and device data.',
      'How We Use Data: To process bookings, communicate with you, improve our services, and send marketing communications (with consent).',
      'Data Sharing: We share information with hosts (booking details), payment processors, and service providers as necessary.',
      'Cookies: We use cookies and similar technologies to enhance your experience and analyze usage patterns.',
      'Your Rights: Access, update, delete, or export your personal data at any time from your account settings.',
      'Security: We implement industry-standard security measures including encryption, access controls, and regular audits.',
      'Contact: For privacy-related inquiries, email privacy@serveiq.com.',
    ],
  },
  'terms': {
    title: 'Terms of Service',
    content: [
      'Last updated: January 2026',
      'These Terms of Service govern your use of the ServeIQ platform and services.',
      'Eligibility: You must be at least 18 years old and capable of entering a binding agreement to use ServeIQ.',
      'Account Responsibilities: You are responsible for maintaining the security of your account and all activities under it.',
      'Booking Terms: Bookings are agreements between guests and hosts. ServeIQ facilitates but is not a party to these agreements.',
      'Payments: All payments are processed through our secure payment system. Fees may apply for certain services.',
      'Prohibited Conduct: Fraud, spam, harassment, and listing虚假 properties are strictly prohibited.',
      'Termination: We reserve the right to suspend or terminate accounts that violate these terms.',
      'Disputes: Any disputes will be resolved through binding arbitration in accordance with applicable laws.',
    ],
  },
  'cancellation-policy': {
    title: 'Cancellation Policy',
    content: [
      'Last updated: January 2026',
      'Our cancellation policy ensures fairness for both guests and hosts.',
      'Flexible Policy: Full refund if cancelled at least 24 hours before check-in. First night charged for late cancellations.',
      'Moderate Policy: Full refund if cancelled at least 5 days before check-in. 50% refund for cancellations within 5 days.',
      'Strict Policy: 50% refund if cancelled at least 7 days before check-in. No refund for cancellations within 7 days.',
      'Non-Refundable: Discounted bookings that cannot be cancelled or refunded under any circumstances.',
      'Host-Set Policies: Individual hosts may set their own cancellation policies within the guidelines above.',
      'Extenuating Circumstances: Force majeure events (natural disasters, pandemics) may qualify for full refunds regardless of policy.',
    ],
  },
  'refund-policy': {
    title: 'Refund Policy',
    content: [
      'Last updated: January 2026',
      'We aim to make the refund process as smooth as possible.',
      'Eligibility: Refunds are issued based on the cancellation policy applicable to your booking.',
      'Processing Time: Approved refunds are processed within 5-10 business days to the original payment method.',
      'Partial Refunds: When applicable, partial refunds are calculated based on the number of nights stayed.',
      'Service Fees: Platform service fees are refundable if the booking is cancelled before check-in.',
      'Damage Claims: Security deposit refunds are processed within 14 days of check-out, minus any approved damage claims.',
      'Disputed Charges: If you believe a charge was made in error, contact support within 30 days with your booking reference.',
    ],
  },
  'cookie-policy': {
    title: 'Cookie Policy',
    content: [
      'Last updated: January 2026',
      'This policy explains how ServeIQ uses cookies and similar technologies.',
      'Essential Cookies: Required for basic functionality including authentication, security, and session management.',
      'Analytics Cookies: Help us understand how users interact with our platform to improve performance and user experience.',
      'Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness across platforms.',
      'Preference Cookies: Remember your settings such as language, currency, and display preferences.',
      'Third-Party Cookies: Some cookies are set by embedded content and analytics services from our partners.',
      'Managing Cookies: You can control cookie preferences through your browser settings or our cookie consent banner.',
      'By using ServeIQ, you consent to our use of cookies as described in this policy.',
    ],
  },
  'sitemap': {
    title: 'Sitemap',
    content: [
      'Find all pages and features available on the ServeIQ platform.',
      'Home: Landing page with featured properties, search bar, and promotional content.',
      'Search: Find properties by destination, dates, guests, and various filters.',
      'Property Details: View photos, amenities, pricing, reviews, and availability for any listed property.',
      'Booking: Complete reservations, manage bookings, and view booking history.',
      'Profile: Manage your account settings, preferences, favorites, and reviews.',
      'Host Dashboard: Manage listings, view analytics, handle bookings, and communicate with guests.',
      'Help Center: Find answers to common questions and access support resources.',
      'Legal: Review our Privacy Policy, Terms of Service, and other legal documents.',
    ],
  },
}

export default function FooterPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname.replace('/', '')
  const data = pageData[path] || { title: path.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), content: ['This page is under construction. Check back soon for updates.'] }

  return (
    <div className="min-h-screen bg-brand-secondary-surface py-16 px-4 font-jakarta">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm text-brand-text-secondary hover:text-brand-primary mb-8 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="bg-brand-surface rounded-2xl shadow-modal p-8 md:p-12">
          <h1 className="text-2xl md:text-3xl font-bold text-brand-heading mb-6">
            {data.title}
          </h1>
          <div className="space-y-4">
            {data.content.map((paragraph, i) => (
              <p key={i} className="text-brand-text-secondary leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-border">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
