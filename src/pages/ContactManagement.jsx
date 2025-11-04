import React, { useState, useEffect } from 'react'
import {
  FiSave,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiFacebook,
  FiTwitter,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiMessageCircle,
  FiInfo,
  FiTarget,
  FiEye,
  FiEdit2,
  FiTrash2
} from 'react-icons/fi'
import { getContactForAdmin, createContact, updateContact, deleteContact } from '../lib/api'
import toast from 'react-hot-toast'

const ContactManagement = () => {
  const [contact, setContact] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    businessHours: '',
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: '',
      whatsapp: ''
    },
    about: '',
    mission: '',
    vision: ''
  })

  useEffect(() => {
    fetchContact()
  }, [])

  const fetchContact = async () => {
    try {
      setLoading(true)
      const response = await getContactForAdmin()
      if (response.data) {
        setContact(response.data)
        setFormData({
          phone: response.data.phone || '',
          email: response.data.email || '',
          address: {
            street: response.data.address?.street || '',
            city: response.data.address?.city || '',
            state: response.data.address?.state || '',
            zipCode: response.data.address?.zipCode || '',
            country: response.data.address?.country || ''
          },
          businessHours: response.data.businessHours || '',
          socialMedia: {
            facebook: response.data.socialMedia?.facebook || '',
            twitter: response.data.socialMedia?.twitter || '',
            instagram: response.data.socialMedia?.instagram || '',
            linkedin: response.data.socialMedia?.linkedin || '',
            youtube: response.data.socialMedia?.youtube || '',
            whatsapp: response.data.socialMedia?.whatsapp || ''
          },
          about: response.data.about || '',
          mission: response.data.mission || '',
          vision: response.data.vision || ''
        })
      }
    } catch (error) {
      console.error('Error fetching contact:', error)
      toast.error('Failed to load contact information')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleSave = async () => {
    // Basic validation
    if (!formData.email && !formData.phone) {
      toast.error('Please provide at least an email or phone number')
      return
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setSaving(true)
    try {
      const contactData = {
        ...formData,
        // Remove empty strings
        phone: formData.phone || undefined,
        email: formData.email || undefined,
        businessHours: formData.businessHours || undefined,
        about: formData.about || undefined,
        mission: formData.mission || undefined,
        vision: formData.vision || undefined,
        address: {
          street: formData.address.street || undefined,
          city: formData.address.city || undefined,
          state: formData.address.state || undefined,
          zipCode: formData.address.zipCode || undefined,
          country: formData.address.country || undefined
        },
        socialMedia: {
          facebook: formData.socialMedia.facebook || undefined,
          twitter: formData.socialMedia.twitter || undefined,
          instagram: formData.socialMedia.instagram || undefined,
          linkedin: formData.socialMedia.linkedin || undefined,
          youtube: formData.socialMedia.youtube || undefined,
          whatsapp: formData.socialMedia.whatsapp || undefined
        }
      }

      if (contact) {
        await updateContact(contactData)
        toast.success('Contact information updated successfully')
      } else {
        await createContact(contactData)
        toast.success('Contact information created successfully')
      }

      setIsEditing(false)
      fetchContact() // Refresh data
    } catch (error) {
      console.error('Error saving contact:', error)
      toast.error(error.message || 'Failed to save contact information')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete all contact information? This action cannot be undone.')) {
      return
    }

    try {
      await deleteContact()
      toast.success('Contact information deleted successfully')
      setContact(null)
      setFormData({
        phone: '',
        email: '',
        address: {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        businessHours: '',
        socialMedia: {
          facebook: '',
          twitter: '',
          instagram: '',
          linkedin: '',
          youtube: '',
          whatsapp: ''
        },
        about: '',
        mission: '',
        vision: ''
      })
      setIsEditing(false)
    } catch (error) {
      console.error('Error deleting contact:', error)
      toast.error('Failed to delete contact information')
    }
  }

  const socialMediaIcons = {
    facebook: FiFacebook,
    twitter: FiTwitter,
    instagram: FiInstagram,
    linkedin: FiLinkedin,
    youtube: FiYoutube,
    whatsapp: FiMessageCircle
  }

  const socialMediaLabels = {
    facebook: 'Facebook',
    twitter: 'Twitter',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    youtube: 'YouTube',
    whatsapp: 'WhatsApp'
  }

  if (loading) {
    return (
      <div className="p-8 max-md:p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-md:p-4 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Contact Management</h1>
          <p className="text-gray-600 mt-1">Manage contact information and social media links</p>
        </div>
        <div className="flex gap-3">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FiEdit2 className="w-4 h-4" />
              {contact ? 'Edit' : 'Add'} Contact Info
            </button>
          ) : (
            <>
              <button
                onClick={() => {
                  setIsEditing(false)
                  fetchContact() // Reset form
                }}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          )}
          {contact && !isEditing && (
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FiTrash2 className="w-4 h-4" />
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Contact Information Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Contact Details */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiPhone className="w-5 h-5" />
            Contact Details
          </h2>

          <div className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="+91-9876543210"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {contact?.phone || 'Not provided'}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="contact@bookstore.com"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {contact?.email || 'Not provided'}
                </p>
              )}
            </div>

            {/* Business Hours */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiClock className="w-4 h-4" />
                Business Hours
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.businessHours}
                  onChange={(e) => handleInputChange('businessHours', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Mon-Sat: 9AM-9PM, Sun: 10AM-6PM"
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                  {contact?.businessHours || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FiMapPin className="w-5 h-5" />
            Address
          </h2>

          <div className="space-y-4">
            {isEditing ? (
              <>
                <input
                  type="text"
                  value={formData.address.street}
                  onChange={(e) => handleInputChange('address.street', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Street Address"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => handleInputChange('address.city', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="City"
                  />
                  <input
                    type="text"
                    value={formData.address.state}
                    onChange={(e) => handleInputChange('address.state', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="State"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={formData.address.zipCode}
                    onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="ZIP Code"
                  />
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => handleInputChange('address.country', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Country"
                  />
                </div>
              </>
            ) : (
              <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[120px]">
                {contact?.address ? (
                  <div>
                    {contact.address.street && <p>{contact.address.street}</p>}
                    {(contact.address.city || contact.address.state) && (
                      <p>{[contact.address.city, contact.address.state].filter(Boolean).join(', ')}</p>
                    )}
                    {(contact.address.zipCode || contact.address.country) && (
                      <p>{[contact.address.zipCode, contact.address.country].filter(Boolean).join(', ')}</p>
                    )}
                  </div>
                ) : (
                  'Not provided'
                )}
              </div>
            )}
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Social Media Links</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(socialMediaIcons).map(([key, Icon]) => (
              <div key={key}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Icon className="w-4 h-4" />
                  {socialMediaLabels[key]}
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={formData.socialMedia[key]}
                    onChange={(e) => handleInputChange(`socialMedia.${key}`, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder={`https://${key}.com/bookstore`}
                  />
                ) : (
                  <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                    {contact?.socialMedia?.[key] ? (
                      <a
                        href={contact.socialMedia[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        {contact.socialMedia[key]}
                      </a>
                    ) : (
                      'Not provided'
                    )}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* About, Mission, Vision */}
        <div className="bg-white rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Company Information</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* About */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <FiInfo className="w-4 h-4" />
                About
              </label>
              {isEditing ? (
                <textarea
                  value={formData.about}
                  onChange={(e) => handleInputChange('about', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Brief description about your company..."
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[100px]">
                  {contact?.about || 'Not provided'}
                </p>
              )}
            </div>

            {/* Mission */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiTarget className="w-4 h-4" />
                Mission
              </label>
              {isEditing ? (
                <textarea
                  value={formData.mission}
                  onChange={(e) => handleInputChange('mission', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Your company's mission statement..."
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[100px]">
                  {contact?.mission || 'Not provided'}
                </p>
              )}
            </div>

            {/* Vision */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FiEye className="w-4 h-4" />
                Vision
              </label>
              {isEditing ? (
                <textarea
                  value={formData.vision}
                  onChange={(e) => handleInputChange('vision', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  placeholder="Your company's vision statement..."
                />
              ) : (
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded-lg min-h-[100px]">
                  {contact?.vision || 'Not provided'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      {contact && (
        <div className="mt-8 bg-white rounded-2xl p-6 shadow-sm">
          <div className="text-sm text-gray-600">
            <p>Last updated by: <span className="font-medium">{contact.updatedBy?.fullName || 'Unknown'}</span></p>
            <p>Last updated: <span className="font-medium">{new Date(contact.updatedAt).toLocaleString()}</span></p>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactManagement