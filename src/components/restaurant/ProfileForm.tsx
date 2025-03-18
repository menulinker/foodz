
import React from "react";

interface RestaurantProfileFormProps {
  name: string;
  cuisine: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const ProfileForm = ({
  name,
  cuisine,
  description,
  address,
  phone,
  email,
  website,
  onInputChange
}: RestaurantProfileFormProps) => {
  return (
    <>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Restaurant Name*
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="cuisine" className="block text-sm font-medium mb-2">
              Cuisine Type
            </label>
            <input
              id="cuisine"
              name="cuisine"
              type="text"
              value={cuisine}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
              placeholder="e.g. Italian, Mexican, Chinese"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
              rows={4}
              placeholder="Describe your restaurant..."
            />
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t">
        <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="address" className="block text-sm font-medium mb-2">
              Address
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={address}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-2">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={phone}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
            />
          </div>
          
          <div>
            <label htmlFor="website" className="block text-sm font-medium mb-2">
              Website (Optional)
            </label>
            <input
              id="website"
              name="website"
              type="url"
              value={website}
              onChange={onInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-foodz-500"
              placeholder="https://example.com"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileForm;
