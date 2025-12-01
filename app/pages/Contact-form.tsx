"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import Lottie from "lottie-react"

export function ContactForm() {
  const [formData, setFormData] = useState({
    subject: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    message: "",
    notifications: false,
  })

  const formDataRef = useRef<typeof formData | null>(null)

  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState<null | boolean>(null)
  const [error, setError] = useState<string | null>(null)
  const [warning, setWarning] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})

  // Lottie icon above the title
  const [iconAnim, setIconAnim] = useState<any>(null)
  const [starsAnim, setStarsAnim] = useState<any>(null)
  useEffect(() => {
    let isMounted = true
    fetch('/animation-json/email.json')
      .then((res) => res.json())
      .then((data) => { if (isMounted) setIconAnim(data) })
      .catch(() => {})
    fetch('/animation-json/stars.json')
      .then((res) => res.json())
      .then((data) => { if (isMounted) setStarsAnim(data) })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  // Refs for focusing the first invalid field
  const subjectRef = useRef<HTMLSelectElement | null>(null)
  const firstNameRef = useRef<HTMLInputElement | null>(null)
  const lastNameRef = useRef<HTMLInputElement | null>(null)
  const phoneRef = useRef<HTMLInputElement | null>(null)
  const emailRef = useRef<HTMLInputElement | null>(null)
  const messageRef = useRef<HTMLTextAreaElement | null>(null)

  const validateField = (name: string, value: string) => {
    const errors: {[key: string]: string} = {}
    
    switch (name) {
      case 'subject':
        if (!value.trim()) errors.subject = 'נא לבחור נושא'
        break
      case 'firstName':
        if (!value.trim()) errors.firstName = 'נא למלא שם פרטי'
        else if (value.trim().length < 2) errors.firstName = 'שם פרטי חייב להכיל לפחות 2 תווים'
        break
      case 'lastName':
        if (!value.trim()) errors.lastName = 'נא למלא שם משפחה'
        else if (value.trim().length < 2) errors.lastName = 'שם משפחה חייב להכיל לפחות 2 תווים'
        break
      case 'phone':
        if (!value.trim()) errors.phone = 'נא למלא מספר טלפון'
        else if (!/^0\d{1,2}-?\d{7}$|^05\d-?\d{7}$/.test(value.replace(/\s/g, ''))) {
          errors.phone = 'נא למלא מספר טלפון תקין'
        }
        break
      case 'email':
        if (!value.trim()) errors.email = 'נא למלא כתובת אימייל'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'נא למלא כתובת אימייל תקינה'
        }
        break
      case 'message':
        if (!value.trim()) errors.message = 'נא למלא הודעה'
        else if (value.trim().length < 10) errors.message = 'ההודעה חייבת להכיל לפחות 10 תווים'
        break
    }
    
    return errors
  }

  const validateForm = () => {
    const errors: {[key: string]: string} = {}
    
    Object.keys(formData).forEach(key => {
      if (key !== 'notifications') {
        const fieldErrors = validateField(key, formData[key as keyof typeof formData] as string)
        Object.assign(errors, fieldErrors)
      }
    })
    
    setValidationErrors(errors)

    // Focus the first invalid field for accessibility
    if (errors.subject && subjectRef.current) subjectRef.current.focus()
    else if (errors.firstName && firstNameRef.current) firstNameRef.current.focus()
    else if (errors.lastName && lastNameRef.current) lastNameRef.current.focus()
    else if (errors.phone && phoneRef.current) phoneRef.current.focus()
    else if (errors.email && emailRef.current) emailRef.current.focus()
    else if (errors.message && messageRef.current) messageRef.current.focus()

    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSent(null)
    setError(null)
    setWarning(null)
    setValidationErrors({})
    
    // Validate form before submission
    if (!validateForm()) {
      setSubmitting(false)
      return
    }
    
    // Save current form data for WhatsApp sending after success
    formDataRef.current = formData

    try {
      console.log('Submitting form data:', formData)
      
      const results = { email: false, whatsapp: false, errors: [] as string[] }
      
      // 1. Send email via FormSubmit (client-side - required by FormSubmit)
      try {
        const formSubmitData = new FormData()
        formSubmitData.append('name', `${formData.firstName} ${formData.lastName}`)
        formSubmitData.append('email', formData.email)
        formSubmitData.append('phone', formData.phone)
        formSubmitData.append('message', `נושא: ${formData.subject}\n\n${formData.message}`)
        formSubmitData.append('_subject', formData.subject ? `פנייה מהאתר: ${formData.subject}` : 'פנייה חדשה מהאתר')
        formSubmitData.append('_replyto', formData.email)
        formSubmitData.append('_captcha', 'false')
        
        const emailResponse = await fetch('https://formsubmit.co/ajax/keflatet@gmail.com', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
          },
          body: formSubmitData,
        })
        
        const emailData = await emailResponse.json()
        console.log('FormSubmit response:', emailData)
        
        if (emailData.success === 'true' || emailData.success === true) {
          results.email = true
        } else {
          // FormSubmit returns success:false when email needs verification
          console.log('FormSubmit did not confirm success:', emailData.message)
          // Don't add to errors if WhatsApp works - email will work after verification
        }
      } catch (emailErr: any) {
        console.error('FormSubmit error:', emailErr)
        results.errors.push(`שליחת אימייל נכשלה: ${emailErr.message}`)
      }
      
      // 2. Send WhatsApp via server API
      try {
        const whatsappRes = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ ...formData, skipEmail: true }),
        })
        const whatsappData = await whatsappRes.json()
        console.log('WhatsApp API response:', whatsappData)
        if (whatsappData.ok || whatsappData.whatsapp) {
          results.whatsapp = true
        }
      } catch (whatsappErr: any) {
        console.error('WhatsApp error:', whatsappErr)
      }

      console.log('Final results:', results)

      if (!results.email && !results.whatsapp) {
        throw new Error('שליחה נכשלה בכל הערוצים')
      }

      if (results.errors.length > 0) {
        setWarning('שליחה הצליחה חלקית')
      }
      setSent(true)
      
      // Reset form on success
      setFormData({
        subject: "",
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        message: "",
        notifications: false,
      })
    } catch (err: any) {
      console.error('Form submission error:', err)
      setSent(false)
      setError(err?.message || 'שליחה נכשלה, אנא נסו שוב')
    } finally {
      setSubmitting(false)
    }
  }

  const sendToWhatsApp = () => {
    if (!formDataRef.current) return

    const data = formDataRef.current

    const message = `
פנייה חדשה מהאתר
נושא: ${data.subject}
שם פרטי: ${data.firstName}
שם משפחה: ${data.lastName}
טלפון: ${data.phone}
אימייל: ${data.email}
הודעה: ${data.message}
    `.trim()

    const phoneNumber = '972532217895'
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

    if (typeof window !== 'undefined') {
      window.open(url, '_blank')
    }
  }

  return (
    <>
      <style jsx>{`
        select {
          background-color: #fdf6ed !important;
        }
        select:focus {
          background-color: #fdf6ed !important;
        }
        select option {
          background-color: #fdf6ed !important;
        }
      `}</style>
      <form onSubmit={handleSubmit} className="space-y-6 overflow-visible">
      <div className="text-center mb-8">
        {iconAnim && (
          <div className="flex justify-center mb-2">
            <Lottie animationData={iconAnim} loop autoplay style={{ width: 64, height: 64 }} />
          </div>
        )}
        <h2 className="text-xl font-semibold font-staff text-gray-700">נשמח לדבר</h2>
      </div>

      {sent === true && (
        <div className="text-center">
          <p className="text-green-600">הטופס נשלח בהצלחה!</p>
          {warning && (
            <p className="text-yellow-600 text-sm mt-1">{warning}</p>
          )}
          <div className="mt-4 flex justify-center">
            <Button
              type="button"
              onClick={sendToWhatsApp}
              className="bg-[#25D366] hover:bg-[#1ebe5d] text-white px-8 py-2 rounded-full text-base font-medium font-staff cursor-pointer"
            >
              שלח/י גם בוואטסאפ
            </Button>
          </div>
        </div>
      )}
      {sent === false && error && (
        <p className="text-center text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Subject Dropdown */}
        <div className="relative z-50">
          <label htmlFor="subject" className="sr-only">נושא</label>
          <select 
            id="subject"
            ref={subjectRef}
            className={`w-full px-3 py-2 border rounded-md text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${validationErrors.subject ? 'border-red-500' : 'border-gray-300'}`}
            style={{ backgroundColor: '#fdf6ed' }}
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            dir="rtl"
            aria-invalid={Boolean(validationErrors.subject)}
            aria-describedby={validationErrors.subject ? 'subject-error' : undefined}
          >
            <option value="" style={{ backgroundColor: '#fdf6ed' }} className="text-gray-900">בחר נושא</option>
            <option value="donation" style={{ backgroundColor: '#fdf6ed' }} className="text-gray-900">תרומה</option>
            <option value="jobs" style={{ backgroundColor: '#fdf6ed' }} className="text-gray-900">דרושים</option>
            <option value="about" style={{ backgroundColor: '#fdf6ed' }} className="text-gray-900">על העמותה</option>
            <option value="other" style={{ backgroundColor: '#fdf6ed' }} className="text-gray-900">כל נושא אחר</option>
          </select>
          {validationErrors.subject && (
            <p id="subject-error" role="alert" aria-live="polite" className="text-red-500 text-sm mt-1 text-right">{validationErrors.subject}</p>
          )}
        </div>

        {/* First Name - Mobile first, Desktop second */}
        <div className="order-2 md:order-1">
          <label htmlFor="firstName" className="sr-only">שם פרטי</label>
          <Input
            id="firstName"
            ref={firstNameRef}
            type="text"
            placeholder="שם פרטי"
            className={`text-right ${validationErrors.firstName ? 'border-red-500' : ''}`}
            style={{ backgroundColor: '#fdf6ed' }}
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            aria-invalid={Boolean(validationErrors.firstName)}
            aria-describedby={validationErrors.firstName ? 'firstName-error' : undefined}
          />
          {validationErrors.firstName && (
            <p id="firstName-error" role="alert" aria-live="polite" className="text-red-500 text-sm mt-1 text-right">{validationErrors.firstName}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Last Name - Mobile second, Desktop first */}
        <div className="order-1 md:order-2">
          <label htmlFor="lastName" className="sr-only">שם משפחה</label>
          <Input
            id="lastName"
            ref={lastNameRef}
            type="text"
            placeholder="שם משפחה"
            className={`text-right ${validationErrors.lastName ? 'border-red-500' : ''}`}
            style={{ backgroundColor: '#fdf6ed' }}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            aria-invalid={Boolean(validationErrors.lastName)}
            aria-describedby={validationErrors.lastName ? 'lastName-error' : undefined}
          />
          {validationErrors.lastName && (
            <p id="lastName-error" role="alert" aria-live="polite" className="text-red-500 text-sm mt-1 text-right">{validationErrors.lastName}</p>
          )}
        </div>

        {/* Phone - Mobile third, Desktop second */}
        <div className="order-2 md:order-1">
          <label htmlFor="phone" className="sr-only">מס' נייד</label>
          <Input
            id="phone"
            ref={phoneRef}
            type="tel"
            placeholder="מס' נייד"
            className={`text-right ${validationErrors.phone ? 'border-red-500' : ''}`}
            style={{ backgroundColor: '#fdf6ed' }}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            aria-invalid={Boolean(validationErrors.phone)}
            aria-describedby={validationErrors.phone ? 'phone-error' : undefined}
          />
          {validationErrors.phone && (
            <p id="phone-error" role="alert" aria-live="polite" className="text-red-500 text-sm mt-1 text-right">{validationErrors.phone}</p>
          )}
        </div>
      </div>

      {/* Email - Mobile fourth */}
      <div>
        <label htmlFor="email" className="sr-only">אימייל</label>
        <Input
          id="email"
          ref={emailRef}
          type="email"
          placeholder="אימייל"
          className={`text-right ${validationErrors.email ? 'border-red-500' : ''}`}
          style={{ backgroundColor: '#fdf6ed' }}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          aria-invalid={Boolean(validationErrors.email)}
          aria-describedby={validationErrors.email ? 'email-error' : undefined}
        />
        {validationErrors.email && (
          <p id="email-error" role="alert" aria-live="polite" className="text-red-500 text-sm mt-1 text-right">{validationErrors.email}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="sr-only">הודעה</label>
        <Textarea
          id="message"
          ref={messageRef}
          placeholder="אני מעוניין ב..."
          className={`text-right min-h-[120px] resize-none ${validationErrors.message ? 'border-red-500' : ''}`}
          style={{ backgroundColor: '#fdf6ed' }}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          aria-invalid={Boolean(validationErrors.message)}
          aria-describedby={validationErrors.message ? 'message-error' : undefined}
        />
        {validationErrors.message && (
          <p id="message-error" role="alert" aria-live="polite" className="text-red-500 text-sm mt-1 text-right">{validationErrors.message}</p>
        )}
      </div>

      {/* Stars icon above Submit */}
      {starsAnim && (
        <div className="flex justify-center">
          <Lottie animationData={starsAnim} loop autoplay style={{ width: 72, height: 72 }} />
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center pt-4">
        <Button
          type="submit"
          disabled={submitting}
          className="bg-[#f4a282] hover:bg-[#ec8d66] disabled:opacity-70 disabled:cursor-not-allowed text-white px-12 py-3 rounded-full text-lg font-medium font-staff cursor-pointer"
        >
          {submitting ? 'שולח…' : 'שליחה'}
        </Button>
      </div>
    </form>
    </>
  )
}
