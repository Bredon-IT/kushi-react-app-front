import React from 'react';
import { Shield, Award, Users, Target, Eye, Heart } from 'lucide-react';

const About: React.FC = () => {
  const teamMembers = [
    {
      name: 'Shashikala M',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'With over 3 years in the cleaning industry, Shashikala founded Kushi Services to revolutionize professional cleaning standards.'
    },
    {
      name: 'Abhlash Gowda',
      role: 'Operations Director',
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Abhlash Gowda ensures our operations run smoothly and maintains our high-quality service standards across all locations.'
    },
    {
      name: 'Usha T',
      role: 'Technical Manager',
      image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop',
      bio: 'Usha leads our technical team and ensures we use the latest cleaning technologies and eco-friendly solutions.'
    }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Trust & Reliability',
      description: 'We keep our promises and deliver services you can depend on every time. '
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for the highest standards, ensuring every detail reflects quality. '
    },
    {
      icon: Heart,
      title: 'Care & Compassion',
      description: 'We serve with empathy, putting the well-being of our customers at the center of everything we do.'
    },
    {
      icon: Users,
      title: 'Team Spirit',
      description: 'Together, we achieve more by supporting, respecting, and uplifting each other. '
    }
  ];

  return (
    <div className="py-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-red-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              About <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Kushi Hygiene</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We believe cleanliness builds comfort and trust.
              Our mission is to deliver reliable, eco-friendly, and affordable solutions for every home and business. 
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/4099350/pexels-photo-4099350.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                alt="Our team at work"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-600 leading-relaxed">
                Kushi Services began with a simple vision — to create cleaner, healthier, and more comfortable spaces for families and businesses.
                We started in 2015 as a small pest control service and have now grown into a trusted name, offering a wide range of professional solutions including deep cleaning, floor polishing, sump and tank cleaning, packers & movers, facility management, and more. 
              </p>
              <p className="text-gray-600 leading-relaxed">
                Behind this growth is our commitment to quality, eco-friendly practices, and customer satisfaction. 
                Every service we provide is backed by trained professionals, certified products, and a promise of transparency.
                Over the years, we have proudly served homes, apartments, villas, restaurants, offices, and prestigious projects, building long-lasting relationships with our clients. 
              </p>
               <p className="text-gray-600 leading-relaxed">
                At Kushi Services, we believe that every space deserves care and attention. 
                Our story is not just about cleaning — it’s about creating hygienic, safe, and welcoming environments where people can truly feel at ease. 
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-2xl border border-orange-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-lg">
                  <Target size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Kushi Services empowers lives and businesses by delivering all-in-one, premium solutions in pest control, deep cleaning, marble polishing, shifting, plumbing, electrical works, borewell care, pump servicing, facility management, and more—powered by trained professionals, global SOPs, and digital tools.
                We serve VIP clients, corporates, and communities with speed, privacy, safety, and trust—combining traditional service values with future-ready innovation.
                Our mission is to make lifestyle management seamless, sustainable, and globally recognized—while creating jobs, uplifting skills, and transforming standards of hygiene, comfort, and care across borders.
                We believe our employees are the foundation of our success—continuously investing in their growth, safety, and dignity to build a high-performance, people-first culture. 
                </p>
                
                <p> 50000+ Completed projects </p>
                <p> 47500+ Happy Customers  </p>
                <p> 10+ Years of Experience</p>  
                <p>50+ Professionals  </p>
             
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 p-8 rounded-2xl border border-red-200">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-3 rounded-lg">
                  <Eye size={24} className="text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600 leading-relaxed">
                To become the world’s most trusted, innovative, and complete lifestyle service brand— revolutionizing hygiene, relocation, facility management, and essential maintenance with eco-smart excellence, human touch, and global scalability.
                We aim to set a new global benchmark where every villa, business, or institution can hand over their space to Kushi— and experience stress-free, tech-enabled service across every need, under one brand.  
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Our <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Core Values</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
             Our values define who we are and guide every service we deliver.
             At Kushi Services, integrity, quality, and customer care are at the heart of everything we do. 
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 bg-white rounded-xl shadow-lg border border-orange-200 hover:shadow-xl transition-all transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Leadership Team</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to delivering exceptional cleaning services and customer satisfaction.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 text-center border border-orange-200 hover:shadow-lg transition-all"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-orange-600 font-semibold mb-4">{member.role}</p>
                <p className="text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;