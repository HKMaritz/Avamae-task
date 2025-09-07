import React, { useState } from "react"
import Navbar from "../components/Navbar"
import ImgContact from "../assets/Img_Contact.png"
import IconSubmit from "../assets/Icon_Submit.svg"
import IconValid from "../assets/Icon_Valid.svg"
import "./contact.css"

export default function Contact() {
  const [showPhone2, setShowPhone2] = useState(false)
  const [showAddress, setShowAddress] = useState(false)
  const [sent, setSent] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone1: '',
    phone2: '',
    message: '',
    addr1: '',
    addr2: '',
    city: '',
    state: '',
    postcode: '',
    country: ''
  })
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    // Full name validation - required
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required."
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Full name must be at least 2 characters."
    } else if (formData.name.trim().length > 80) {
      newErrors.name = "Full name must be less than 80 characters."
    }
    
    // Email validation - required + pattern
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required."
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Please enter a valid email address."
    }
    
    // Phone validation (optional but must be valid if present)
    const phoneRegex = /^[\+]?[0-9\(\)\s\-]{10,}$/
    if (formData.phone1.trim() && !phoneRegex.test(formData.phone1)) {
      newErrors.phone1 = "Please enter a valid phone number."
    }
    if (formData.phone2.trim() && !phoneRegex.test(formData.phone2)) {
      newErrors.phone2 = "Please enter a valid phone number."
    }
    
    // Message validation - required
    if (!formData.message.trim()) {
      newErrors.message = "Message is required."
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters."
    }
    
    // Address validation - required if bIncludeAddressDetails is true
    if (showAddress) {
      if (!formData.addr1.trim()) {
        newErrors.addr1 = "Address Line 1 is required when including address details."
      }
      if (!formData.city.trim()) {
        newErrors.city = "City/Town is required when including address details."
      }
      if (!formData.postcode.trim()) {
        newErrors.postcode = "Postcode is required when including address details."
      }
      if (!formData.country.trim()) {
        newErrors.country = "Country is required when including address details."
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function onSubmit(e) {
    e.preventDefault()
    if (validateForm()) {
      submitContactForm()
    }
  }

  const submitContactForm = async () => {
    try {
      // Build payload according to API specification
      const payload = {
        fullName: formData.name,
        emailAddress: formData.email,
        phoneNumbers: [formData.phone1, formData.phone2].filter(Boolean),
        message: formData.message,
        bIncludeAddressDetails: showAddress,
        addressDetails: showAddress ? {
          addressLine1: formData.addr1,
          addressLine2: formData.addr2 || "",
          cityTown: formData.city,
          stateCounty: formData.state || "",
          postcode: formData.postcode || "",
          country: formData.country
        } : null
      }

      const response = await fetch('/api/v1/contact-us/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        
        // Handle validation errors
        if (response.status === 400 && errorData.errors) {
          const newErrors = {}
          errorData.errors.forEach(error => {
            const fieldName = error.fieldName?.toLowerCase()
            // Map API field names to form field names
            const fieldMap = {
              'fullname': 'name',
              'emailaddress': 'email',
              'phonenumbers': 'phone1',
              'addressline1': 'addr1',
              'addressline2': 'addr2',
              'citytown': 'city',
              'statecounty': 'state',
              'postcode': 'postcode',
              'country': 'country'
            }
            const mappedField = fieldMap[fieldName] || fieldName
            if (mappedField) {
              newErrors[mappedField] = error.messageCode || error.message || 'Invalid field'
            }
          })
          setErrors(newErrors)
          return
        }
        
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      // Success
      setSent(true)
      
    } catch (error) {
      console.error('Contact form submission failed:', error)
      // Show general error - you might want to add an error state here
      setErrors({ general: 'Failed to send message. Please try again later.' })
    }
  }

  const isFormValid = formData.name.trim().length >= 2 && 
                     formData.email.trim() && 
                     formData.message.trim() &&
                     (!showAddress || (formData.addr1.trim() && formData.city.trim() && formData.country.trim()))

  return (
    <>
      <Navbar />
      <main id="contact" className="contact">
        <div className="container grid">
          {/* Left: form or success */}
          <section className="formCol">
            <h1>Contact us</h1>
            <p className="subhead">
              Fusce efficitur eu purus ac posuere nean imperdiet risus dolor,
              nec accumsan velit ornare sit amet.
            </p>

            {sent ? (
              <div className="successCard" role="status" aria-live="polite">
                <div className="tick" aria-hidden="true">
                  <img src={IconValid} alt="" />
                </div>
                <div className="successTitle">YOUR MESSAGE HAS BEEN SENT</div>
                <div className="successNote">We will be in contact with you within 24 hours.</div>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate>
                {/* General error display */}
                {errors.general && (
                  <div style={{
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    color: '#dc2626',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '16px',
                    fontSize: '14px'
                  }}>
                    {errors.general}
                  </div>
                )}
                
                <div className="row two">
                  <div className={`field ${errors.name ? 'error' : ''}`}>
                    <label htmlFor="name">Full name</label>
                    <input 
                      id="name" 
                      name="name" 
                      autoComplete="name"
                      value={formData.name}
                      onChange={handleChange}
                      aria-invalid={errors.name ? 'true' : 'false'}
                      aria-describedby={errors.name ? 'name-error' : undefined}
                    />
                    {errors.name && <div id="name-error" className="errorTxt">{errors.name}</div>}
                  </div>
                  <div className={`field ${errors.email ? 'error' : ''}`}>
                    <label htmlFor="email">Email address</label>
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && <div id="email-error" className="errorTxt">{errors.email}</div>}
                  </div>
                </div>

                <div className="row one">
                  <div className={`field ${errors.phone1 ? 'error' : ''}`}>
                    <label htmlFor="phone1">Phone number 01 - optional</label>
                    <input 
                      id="phone1" 
                      name="phone1"
                      value={formData.phone1}
                      onChange={handleChange}
                      aria-invalid={errors.phone1 ? 'true' : 'false'}
                      aria-describedby={errors.phone1 ? 'phone1-error' : undefined}
                    />
                    {errors.phone1 && <div id="phone1-error" className="errorTxt">{errors.phone1}</div>}
                  </div>
                </div>

                {showPhone2 && (
                  <div className="row one">
                    <div className={`field ${errors.phone2 ? 'error' : ''}`}>
                      <label htmlFor="phone2">Phone number 02 - optional</label>
                      <input 
                        id="phone2" 
                        name="phone2"
                        value={formData.phone2}
                        onChange={handleChange}
                        aria-invalid={errors.phone2 ? 'true' : 'false'}
                        aria-describedby={errors.phone2 ? 'phone2-error' : undefined}
                      />
                      {errors.phone2 && <div id="phone2-error" className="errorTxt">{errors.phone2}</div>}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  className="btn ghost full"
                  onClick={() => setShowPhone2(true)}
                  disabled={showPhone2}
                >
                  Add new phone number
                </button>

                <div className="row one msgRow">
                  <div className={`field ${errors.message ? 'error' : ''}`}>
                    <div className="labelLine">
                      <label htmlFor="message">Message</label>
                      <span className="help">Maximum text length is 1000 characters</span>
                    </div>
                    <textarea 
                      id="message" 
                      name="message" 
                      rows={6} 
                      maxLength={1000}
                      value={formData.message}
                      onChange={handleChange}
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={errors.message ? 'message-error' : undefined}
                    />
                    {errors.message && <div id="message-error" className="errorTxt">{errors.message}</div>}
                  </div>
                </div>

                <div className="row one checkbox">
                  <label className="check">
                    <input
                      type="checkbox"
                      checked={showAddress}
                      onChange={e => setShowAddress(e.target.checked)}
                    />
                    <span>Add address details</span>
                  </label>
                </div>

                {showAddress && (
                  <>
                    <div className="row two">
                      <div className={`field ${errors.addr1 ? 'error' : ''}`}>
                        <label htmlFor="addr1">Address line 1</label>
                        <input 
                          id="addr1" 
                          name="addr1" 
                          autoComplete="address-line1"
                          value={formData.addr1}
                          onChange={handleChange}
                          aria-invalid={errors.addr1 ? 'true' : 'false'}
                          aria-describedby={errors.addr1 ? 'addr1-error' : undefined}
                        />
                        {errors.addr1 && <div id="addr1-error" className="errorTxt">{errors.addr1}</div>}
                      </div>
                      <div className="field">
                        <label htmlFor="addr2">Address line 2 - optional</label>
                        <input 
                          id="addr2" 
                          name="addr2" 
                          autoComplete="address-line2"
                          value={formData.addr2}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="row four">
                      <div className={`field ${errors.city ? 'error' : ''}`}>
                        <label htmlFor="city">City/Town</label>
                        <input 
                          id="city" 
                          name="city" 
                          autoComplete="address-level2"
                          value={formData.city}
                          onChange={handleChange}
                          aria-invalid={errors.city ? 'true' : 'false'}
                          aria-describedby={errors.city ? 'city-error' : undefined}
                        />
                        {errors.city && <div id="city-error" className="errorTxt">{errors.city}</div>}
                      </div>
                      <div className="field">
                        <label htmlFor="state">State/County</label>
                        <input 
                          id="state" 
                          name="state" 
                          autoComplete="address-level1"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="postcode">Postcode</label>
                        <input 
                          id="postcode" 
                          name="postcode" 
                          autoComplete="postal-code"
                          value={formData.postcode}
                          onChange={handleChange}
                        />
                      </div>
                      <div className={`field ${errors.country ? 'error' : ''}`}>
                        <label htmlFor="country">Country</label>
                        <input 
                          id="country" 
                          name="country" 
                          autoComplete="country-name"
                          value={formData.country}
                          onChange={handleChange}
                          aria-invalid={errors.country ? 'true' : 'false'}
                          aria-describedby={errors.country ? 'country-error' : undefined}
                        />
                        {errors.country && <div id="country-error" className="errorTxt">{errors.country}</div>}
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" className="btn primary withIcon" disabled={!isFormValid}>
                  <img src={IconSubmit} alt="" aria-hidden="true" />
                  Submit
                </button>
              </form>
            )}
          </section>

          {/* Right: decorative image */}
          <aside className="artCol" aria-hidden>
            <img src={ImgContact} alt="" />
          </aside>
        </div>
      </main>
    </>
  )
}
