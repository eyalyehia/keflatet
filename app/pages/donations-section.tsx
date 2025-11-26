"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Heart, Calendar, Gift, CreditCard, User, Mail, Phone, MessageSquare } from "lucide-react"
import Lottie from "lottie-react"

export default function DonationsSection() {
  const [donationType, setDonationType] = useState('monthly')
  const [customAmount, setCustomAmount] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("")
  const [donationAmount, setDonationAmount] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [birdAnim, setBirdAnim] = useState<any>(null)

  useEffect(() => {
    let isMounted = true
    fetch('/animation-json/bird.json')
      .then(res => res.json())
      .then(data => { if (isMounted) setBirdAnim(data) })
      .catch(() => {})
    return () => { isMounted = false }
  }, [])

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9\-\+\s\(\)]{9,15}$/
    return phoneRegex.test(phone)
  }

  const validateCreditCard = (cardNumber: string) => {
    const cleanNumber = cardNumber.replace(/\s/g, '')
    return cleanNumber.length >= 13 && cleanNumber.length <= 19 && /^\d+$/.test(cleanNumber)
  }

  const validateCVV = (cvv: string) => {
    return /^\d{3,4}$/.test(cvv)
  }

  const validateExpiryDate = (expiry: string) => {
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/
    return expiryRegex.test(expiry)
  }

  const handleFieldValidation = (fieldId: string, value: string, type: string) => {
    let errorMessage = ""
    
    switch (type) {
      case 'email':
        if (value && !validateEmail(value)) {
          errorMessage = "כתובת דוא״ל לא תקינה. אנא הזינו כתובת דוא״ל תקינה"
        }
        break
      case 'phone':
        if (value && !validatePhone(value)) {
          errorMessage = "מספר טלפון לא תקין. אנא הזינו מספר טלפון תקין"
        }
        break
      case 'creditCard':
        if (value && !validateCreditCard(value)) {
          errorMessage = "מספר כרטיס אשראי לא תקין. אנא הזינו מספר כרטיס תקין"
        }
        break
      case 'cvv':
        if (value && !validateCVV(value)) {
          errorMessage = "קוד אבטחה לא תקין. אנא הזינו 3-4 ספרות"
        }
        break
      case 'expiry':
        if (value && !validateExpiryDate(value)) {
          errorMessage = "תאריך תוקף לא תקין. אנא הזינו בפורמט MM/YY"
        }
        break
    }

    setValidationErrors(prev => ({
      ...prev,
      [fieldId]: errorMessage
    }))
  }

  const handleSubmit = () => {
    if (!termsAccepted) {
      alert("יש לאשר את תקנון האתר על מנת להמשיך")
      return
    }

    // Check if donation amount is selected
    if (!donationAmount || donationAmount === "0") {
      alert("אנא בחרו סכום תרומה")
      return
    }

    // Validate required fields based on selected payment method
    const missingFields: string[] = []
    
    if (selectedPayment === 'credit') {
      const cardNumber = (document.getElementById('cardNumber') as HTMLInputElement)?.value
      const expiryDate = (document.getElementById('expiryDate') as HTMLInputElement)?.value
      const cvv = (document.getElementById('cvv') as HTMLInputElement)?.value
      const cardHolder = (document.getElementById('cardHolder') as HTMLInputElement)?.value
      const email = (document.getElementById('email') as HTMLInputElement)?.value
      const phone = (document.getElementById('phone') as HTMLInputElement)?.value

      if (!cardNumber) missingFields.push("מספר כרטיס אשראי")
      if (!expiryDate) missingFields.push("תאריך תוקף")
      if (!cvv) missingFields.push("קוד אבטחה")
      if (!cardHolder) missingFields.push("שם מחזיק הכרטיס")
      if (!email) missingFields.push("דוא״ל")
      if (!phone) missingFields.push("טלפון")
    } else if (selectedPayment === 'shekel') {
      const cardNumberShekel = (document.getElementById('cardNumberShekel') as HTMLInputElement)?.value
      const validityShekel = (document.getElementById('validityShekel') as HTMLInputElement)?.value
      const shekelFullName = (document.getElementById('shekelFullName') as HTMLInputElement)?.value
      const shekelEmail = (document.getElementById('shekelEmail') as HTMLInputElement)?.value
      const shekelPhone = (document.getElementById('shekelPhone') as HTMLInputElement)?.value
      const dayOfMonthShekel = (document.getElementById('dayOfMonthShekel') as HTMLInputElement)?.value

      if (!cardNumberShekel) missingFields.push("מספר כרטיס אשראי")
      if (!validityShekel) missingFields.push("תאריך תוקף")
      if (!shekelFullName) missingFields.push("שם מלא")
      if (!shekelEmail) missingFields.push("דוא״ל")
      if (!shekelPhone) missingFields.push("טלפון")
      if (!dayOfMonthShekel) missingFields.push("יום גביה בחודש")
    } else if (selectedPayment === 'bit') {
      const bitFullName = (document.getElementById('bitFullName') as HTMLInputElement)?.value
      const bitEmail = (document.getElementById('bitEmail') as HTMLInputElement)?.value
      const bitPhone = (document.getElementById('bitPhone') as HTMLInputElement)?.value

      if (!bitFullName) missingFields.push("שם מלא")
      if (!bitEmail) missingFields.push("דוא״ל")
      if (!bitPhone) missingFields.push("טלפון")
    } else {
      // Original fields validation
      const firstName = (document.getElementById('firstName') as HTMLInputElement)?.value
      const lastName = (document.getElementById('lastName') as HTMLInputElement)?.value
      const email = (document.getElementById('email') as HTMLInputElement)?.value
      const phone = (document.getElementById('phone') as HTMLInputElement)?.value

      if (!firstName) missingFields.push("שם פרטי")
      if (!lastName) missingFields.push("שם משפחה")
      if (!email) missingFields.push("דוא״ל")
      if (!phone) missingFields.push("טלפון")
    }

    if (missingFields.length > 0) {
      alert(`אנא מלאו את השדות הבאים: ${missingFields.join(', ')}`)
      return
    }

    // Check for validation errors
    const hasErrors = Object.values(validationErrors).some(error => error !== "")
    if (hasErrors) {
      alert("אנא תקנו את השגיאות בטופס לפני המשך")
      return
    }

    // Continue with form submission logic
    console.log('כפתור תרומה נלחץ - כל הוולידציות עברו')
  }

  const ValidationError = ({ fieldId }: { fieldId: string }) => (
    validationErrors[fieldId] ? (
      <p className="text-red-500 text-sm mt-1">{validationErrors[fieldId]}</p>
    ) : null
  )

  const donationOptions = [
    {
      id: "monthly",
      title: "תרומה חודשית",
      description: "תרומה קבועה המאפשרת תכנון ארוך טווח",
      icon: Calendar,
      amounts: [50, 100, 200, 500],
    },
    {
      id: "basket",
      title: "סל לתרומה",
      description: "חבילת תרומה מיוחדת עם מוצרים נבחרים",
      icon: Gift,
      amounts: [150, 300, 600, 1000],
    },
    {
      id: "onetime",
      title: "תרומה חד-פעמית",
      description: "תרומה בסכום לבחירתכם",
      icon: CreditCard,
      amounts: [100, 250, 500, 1000],
    },
  ]

  const renderCreditCardFields = () => (
    <motion.div
      className="flex flex-wrap gap-6 pt-6 border-t border-gray-200 justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <div className="space-y-2">
        <label htmlFor="cardNumber" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <CreditCard className="ml-2 w-4 h-4" />
          מספר כרטיס אשראי <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="cardNumber"
          type="text"
          placeholder="0000 0000 0000 0000"
          required
          pattern="[0-9\s]{13,19}"
          className="border-2 border-black focus:border-[#9dd0bf] w-60 px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="מספר כרטיס אשראי - שדה חובה"
          maxLength={19}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            let value = target.value.replace(/\D/g, '');
            value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
            target.value = value;
          }}
          onBlur={(e) => handleFieldValidation('cardNumber', e.target.value, 'creditCard')}
          onChange={(e) => {
            if (validationErrors['cardNumber']) {
              handleFieldValidation('cardNumber', e.target.value, 'creditCard')
            }
          }}
        />
        <ValidationError fieldId="cardNumber" />
      </div>

      <div className="space-y-2">
        <label htmlFor="expiryDate" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <Calendar className="ml-2 w-4 h-4" />
          תוקף <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="expiryDate"
          type="text"
          placeholder="MM/YY"
          required
          pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
          className="border-2 border-black focus:border-[#9dd0bf] w-32 px-3 py-2 rounded-md text-center bg-[#fdf6ed]"
          aria-label="תאריך תוקף - שדה חובה"
          maxLength={5}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            let value = target.value.replace(/\D/g, '');
            if (value.length >= 2) {
              value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            target.value = value;
          }}
          onBlur={(e) => handleFieldValidation('expiryDate', e.target.value, 'expiry')}
          onChange={(e) => {
            if (validationErrors['expiryDate']) {
              handleFieldValidation('expiryDate', e.target.value, 'expiry')
            }
          }}
        />
        <ValidationError fieldId="expiryDate" />
      </div>

      <div className="space-y-2">
        <label htmlFor="cvv" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <span className="ml-2 w-4 h-4 flex items-center justify-center bg-gray-200 rounded text-xs font-bold">
            CVV
          </span>
          קוד אבטחה <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="cvv"
          type="text"
          placeholder="123"
          required
          pattern="[0-9]{3,4}"
          className="border-2 border-black focus:border-[#9dd0bf] w-24 px-3 py-2 rounded-md text-center bg-[#fdf6ed]"
          aria-label="קוד אבטחה - שדה חובה"
          maxLength={4}
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            target.value = target.value.replace(/\D/g, '');
          }}
          onBlur={(e) => handleFieldValidation('cvv', e.target.value, 'cvv')}
          onChange={(e) => {
            if (validationErrors['cvv']) {
              handleFieldValidation('cvv', e.target.value, 'cvv')
            }
          }}
        />
        <ValidationError fieldId="cvv" />
      </div>

      <div className="space-y-2 w-full max-w-md">
        <label htmlFor="cardHolder" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <User className="ml-2 w-4 h-4" />
          שם למחזיק הכרטיס <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="cardHolder"
          type="text"
          placeholder="כפי שמופיע על הכרטיס"
          required
          className="border-2 border-black focus:border-[#9dd0bf] w-full px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="שם מחזיק הכרטיס - שדה חובה"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="installments" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <CreditCard className="ml-2 w-4 h-4" />
          מספר תשלומים
        </label>
        <select
          id="installments"
          className="border-2 border-black focus:border-[#9dd0bf] w-40 px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="בחירת מספר תשלומים"
        >
          <option value="1">תשלום אחד</option>
          <option value="2">2 תשלומים</option>
          <option value="3">3 תשלומים</option>
          <option value="4">4 תשלומים</option>
          <option value="5">5 תשלומים</option>
          <option value="6">6 תשלומים</option>
          <option value="12">12 תשלומים</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <Mail className="ml-2 w-4 h-4" />
          <span className="text-red-500">*</span>
          דוא״ל:
        </label>
        <input
          id="email"
          type="email"
          required
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          className="border-2 border-black focus:border-[#9dd0bf] w-64 px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="כתובת דוא״ל - שדה חובה"
          placeholder="example@email.com"
          onBlur={(e) => handleFieldValidation('email', e.target.value, 'email')}
          onChange={(e) => {
            if (validationErrors['email']) {
              handleFieldValidation('email', e.target.value, 'email')
            }
          }}
        />
        <ValidationError fieldId="email" />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <Phone className="ml-2 w-4 h-4" />
          <span className="text-red-500">*</span>
          טלפון:
        </label>
        <input
          id="phone"
          type="tel"
          required
          pattern="[0-9\-\+\s\(\)]{9,15}"
          className="border-2 border-black focus:border-[#9dd0bf] w-48 px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="מספר טלפון - שדה חובה"
          placeholder="050-1234567"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            let value = target.value.replace(/[^0-9\-\+\s\(\)]/g, '');
            target.value = value;
          }}
          onBlur={(e) => handleFieldValidation('phone', e.target.value, 'phone')}
          onChange={(e) => {
            if (validationErrors['phone']) {
              handleFieldValidation('phone', e.target.value, 'phone')
            }
          }}
        />
        <ValidationError fieldId="phone" />
      </div>

      <div className="space-y-2 w-full max-w-md">
        <label htmlFor="comments" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <MessageSquare className="ml-2 w-4 h-4" />
          הערות
        </label>
        <textarea
          id="comments"
          rows={3}
          className="border-2 border-black focus:border-[#9dd0bf] resize-none w-full px-3 py-2 rounded-md bg-[#fdf6ed]"
          placeholder="הערות או הקדשה מיוחדת (אופציונלי)"
          aria-label="הערות או הקדשה - שדה אופציונלי"
        />
      </div>
    </motion.div>
  )

  const renderShekelFields = () => (
    <motion.div
      className="space-y-8 pt-6 border-t border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      {/* First Row - Amount and Day */}
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="space-y-2">
          <label htmlFor="monthlyAmountShekel" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <span className="text-red-500 ml-1">*</span>
            סכום לחיוב בכל חודש:
          </label>
          <div className="flex items-center gap-2">
            <input
              id="monthlyAmountShekel"
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="400"
              required
              className="border-2 border-black focus:border-[#9dd0bf] w-40 px-3 py-2 rounded-md text-center font-bold text-lg bg-[#fdf6ed]"
              aria-label="סכום חיוב חודשי - שדה חובה"
            />
            <span className="text-gray-500 font-medium">₪</span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="fixedAmountShekel" className="flex items-center text-lg font-medium font-staff text-gray-700">
            מספר תשלומים לחיוב:
          </label>
          <div className="flex items-center justify-center h-[42px] px-4 bg-gray-50 border-2 border-gray-300 rounded-md">
            <span className="text-gray-600 font-medium">ללא הגבלה</span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="dayOfMonthShekel" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <span className="text-red-500 ml-1">*</span>
            יום גביה בכל חודש:
          </label>
          <input
            id="dayOfMonthShekel"
            type="number"
            min="1"
            max="31"
            placeholder="1"
            required
            className="border-2 border-black focus:border-[#9dd0bf] w-32 px-3 py-2 rounded-md text-center font-medium bg-[#fdf6ed]"
            aria-label="יום בחודש לגביה - שדה חובה"
          />
        </div>
      </div>

      {/* Second Row - Card Details */}
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="space-y-2">
          <label htmlFor="cardNumberShekel" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <CreditCard className="ml-2 w-4 h-4" />
            <span className="text-red-500 ml-1">*</span>
            מספר כרטיס אשראי:
          </label>
          <input
            id="cardNumberShekel"
            type="text"
            required
            pattern="[0-9\s]{13,19}"
            className="border-2 border-black focus:border-[#9dd0bf] w-64 px-3 py-2 rounded-md font-medium bg-[#fdf6ed]"
            aria-label="מספר כרטיס אשראי - שדה חובה"
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              let value = target.value.replace(/\D/g, '');
              value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
              target.value = value;
            }}
            onBlur={(e) => handleFieldValidation('cardNumberShekel', e.target.value, 'creditCard')}
            onChange={(e) => {
              if (validationErrors['cardNumberShekel']) {
                handleFieldValidation('cardNumberShekel', e.target.value, 'creditCard')
              }
            }}
          />
          <ValidationError fieldId="cardNumberShekel" />
        </div>

        <div className="space-y-2">
          <label htmlFor="validityShekel" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <Calendar className="ml-2 w-4 h-4" />
            <span className="text-red-500 ml-1">*</span>
            תוקף:
          </label>
          <input
            id="validityShekel"
            type="text"
            placeholder="MM/YY"
            required
            pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
            className="border-2 border-black focus:border-[#9dd0bf] w-32 px-3 py-2 rounded-md text-center font-medium bg-[#fdf6ed]"
            aria-label="תוקף כרטיס - שדה חובה"
            maxLength={5}
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              let value = target.value.replace(/\D/g, '');
              if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
              }
              target.value = value;
            }}
            onBlur={(e) => handleFieldValidation('validityShekel', e.target.value, 'expiry')}
            onChange={(e) => {
              if (validationErrors['validityShekel']) {
                handleFieldValidation('validityShekel', e.target.value, 'expiry')
              }
            }}
          />
          <ValidationError fieldId="validityShekel" />
        </div>

        <div className="space-y-2">
          <label htmlFor="installmentsShekel" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <span className="ml-2 w-4 h-4 flex items-center justify-center bg-gray-200 rounded text-xs font-bold">
              CVV
            </span>
            קוד אבטחה:
          </label>
          <input
            id="installmentsShekel"
            type="text"
            maxLength={4}
            pattern="[0-9]{3,4}"
            className="border-2 border-black focus:border-[#9dd0bf] w-24 px-3 py-2 rounded-md text-center font-medium bg-[#fdf6ed]"
            aria-label="קוד אבטחה"
            placeholder="123"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              target.value = target.value.replace(/\D/g, '');
            }}
            onBlur={(e) => handleFieldValidation('installmentsShekel', e.target.value, 'cvv')}
            onChange={(e) => {
              if (validationErrors['installmentsShekel']) {
                handleFieldValidation('installmentsShekel', e.target.value, 'cvv')
              }
            }}
          />
          <ValidationError fieldId="installmentsShekel" />
        </div>
      </div>

      {/* Third Row - Personal Details */}
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="space-y-2">
          <label htmlFor="shekelFullName" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <User className="ml-2 w-4 h-4" />
            <span className="text-red-500 ml-1">*</span>
            שם מלא:
          </label>
          <input
            id="shekelFullName"
            type="text"
            required
            className="border-2 border-black focus:border-[#9dd0bf] w-64 px-3 py-2 rounded-md font-medium bg-[#fdf6ed]"
            aria-label="שם מלא - שדה חובה"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="shekelEmail" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <Mail className="ml-2 w-4 h-4" />
            <span className="text-red-500 ml-1">*</span>
            דוא״ל:
          </label>
          <input
            id="shekelEmail"
            type="email"
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            className="border-2 border-black focus:border-[#9dd0bf] w-64 px-3 py-2 rounded-md font-medium bg-[#fdf6ed]"
            aria-label="כתובת דוא״ל - שדה חובה"
            placeholder="example@email.com"
            onBlur={(e) => handleFieldValidation('shekelEmail', e.target.value, 'email')}
            onChange={(e) => {
              if (validationErrors['shekelEmail']) {
                handleFieldValidation('shekelEmail', e.target.value, 'email')
              }
            }}
          />
          <ValidationError fieldId="shekelEmail" />
        </div>

        <div className="space-y-2">
          <label htmlFor="shekelPhone" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <Phone className="ml-2 w-4 h-4" />
            <span className="text-red-500 ml-1">*</span>
            טלפון:
          </label>
          <input
            id="shekelPhone"
            type="tel"
            required
            pattern="[0-9\-\+\s\(\)]{9,15}"
            className="border-2 border-black focus:border-[#9dd0bf] w-48 px-3 py-2 rounded-md font-medium bg-[#fdf6ed]"
            aria-label="מספר טלפון - שדה חובה"
            placeholder="050-1234567"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              let value = target.value.replace(/[^0-9\-\+\s\(\)]/g, '');
              target.value = value;
            }}
            onBlur={(e) => handleFieldValidation('shekelPhone', e.target.value, 'phone')}
            onChange={(e) => {
              if (validationErrors['shekelPhone']) {
                handleFieldValidation('shekelPhone', e.target.value, 'phone')
              }
            }}
          />
          <ValidationError fieldId="shekelPhone" />
        </div>
      </div>

      <div className="text-center">
        <button className="w-full max-w-md bg-[#5fb3a3] hover:bg-[#4a9d8e] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300">
          שמירת הוראת קבע
        </button>
        <p className="mt-2 text-sm text-gray-600">זה הו"ק אשראי</p>
      </div>
    </motion.div>
  )

  const renderBitFields = () => (
    <motion.div
      className="space-y-8 pt-6 border-t border-gray-200"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      {/* First Row - Amount */}
      <div className="flex justify-center">
        <div className="space-y-2">
          <label htmlFor="bitAmount" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <span className="text-red-500 ml-1">*</span>
            סכום לתרומה:
          </label>
          <input
            id="bitAmount"
            type="number"
            value={donationAmount}
            onChange={(e) => setDonationAmount(e.target.value)}
            placeholder="400"
            required
            className="border-2 border-black focus:border-[#9dd0bf] w-40 px-3 py-2 rounded-md text-center font-bold text-lg bg-[#fdf6ed]"
            aria-label="סכום לתרומה - שדה חובה"
          />
        </div>
      </div>

      {/* Second Row - Personal Details */}
      <div className="flex flex-wrap gap-6 justify-center">
        <div className="space-y-2">
          <label htmlFor="bitFullName" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <User className="ml-2 w-4 h-4" />
            <span className="text-red-500 ml-1">*</span>
            שם מלא:
          </label>
          <input
            id="bitFullName"
            type="text"
            required
            className="border-2 border-black focus:border-[#9dd0bf] w-64 px-3 py-2 rounded-md font-medium bg-[#fdf6ed]"
            aria-label="שם מלא - שדה חובה"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bitEmail" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <Mail className="ml-2 w-4 h-4" />
            <span className="text-red-500 ml-1">*</span>
            דוא״ל:
          </label>
          <input
            id="bitEmail"
            type="email"
            required
            pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            className="border-2 border-black focus:border-[#9dd0bf] w-64 px-3 py-2 rounded-md font-medium bg-[#fdf6ed]"
            aria-label="כתובת דוא״ל - שדה חובה"
            placeholder="example@email.com"
            onBlur={(e) => handleFieldValidation('bitEmail', e.target.value, 'email')}
            onChange={(e) => {
              if (validationErrors['bitEmail']) {
                handleFieldValidation('bitEmail', e.target.value, 'email')
              }
            }}
          />
          <ValidationError fieldId="bitEmail" />
        </div>

        <div className="space-y-2">
          <label htmlFor="bitPhone" className="flex items-center text-lg font-medium font-staff text-gray-700">
            <Phone className="ml-2 w-4 h-4" />
            <span className="text-red-500 ml-1">*</span>
            טלפון:
          </label>
          <input
            id="bitPhone"
            type="tel"
            required
            pattern="[0-9\-\+\s\(\)]{9,15}"
            className="border-2 border-black focus:border-[#9dd0bf] w-48 px-3 py-2 rounded-md font-medium bg-[#fdf6ed]"
            aria-label="מספר טלפון - שדה חובה"
            placeholder="050-1234567"
            onInput={(e) => {
              const target = e.target as HTMLInputElement;
              let value = target.value.replace(/[^0-9\-\+\s\(\)]/g, '');
              target.value = value;
            }}
            onBlur={(e) => handleFieldValidation('bitPhone', e.target.value, 'phone')}
            onChange={(e) => {
              if (validationErrors['bitPhone']) {
                handleFieldValidation('bitPhone', e.target.value, 'phone')
              }
            }}
          />
          <ValidationError fieldId="bitPhone" />
        </div>
      </div>

      <div className="text-center">
        <button className="w-full max-w-md bg-[#5fb3a3] hover:bg-[#4a9d8e] text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-300">
          תיוב תשלום באמצעות BIT
        </button>
      </div>
    </motion.div>
  )

  const renderOriginalFields = () => (
    <motion.div
      className="flex flex-wrap gap-6 pt-6 border-t border-gray-200 justify-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <div className="space-y-2">
        <label htmlFor="firstName" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <User className="ml-2 w-4 h-4" />
          שם פרטי <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="firstName"
          required
          className="border-2 border-black focus:border-[#9dd0bf] w-40 px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="שם פרטי - שדה חובה"
          maxLength={20}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="lastName" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <User className="ml-2 w-4 h-4" />
          שם משפחה <span className="text-red-500 ml-1">*</span>
        </label>
        <input
          id="lastName"
          required
          className="border-2 border-black focus:border-[#9dd0bf] w-40 px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="שם משפחה - שדה חובה"
          maxLength={20}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <Mail className="ml-2 w-4 h-4" />
          <span className="text-red-500">*</span>
          דוא״ל:
        </label>
        <input
          id="email"
          type="email"
          required
          pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
          className="border-2 border-black focus:border-[#9dd0bf] w-64 px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="כתובת דוא״ל - שדה חובה"
          placeholder="example@email.com"
          onBlur={(e) => handleFieldValidation('emailOriginal', e.target.value, 'email')}
          onChange={(e) => {
            if (validationErrors['emailOriginal']) {
              handleFieldValidation('emailOriginal', e.target.value, 'email')
            }
          }}
        />
        <ValidationError fieldId="emailOriginal" />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <Phone className="ml-2 w-4 h-4" />
          <span className="text-red-500">*</span>
          טלפון:
        </label>
        <input
          id="phone"
          type="tel"
          required
          pattern="[0-9\-\+\s\(\)]{9,15}"
          className="border-2 border-black focus:border-[#9dd0bf] w-48 px-3 py-2 rounded-md bg-[#fdf6ed]"
          aria-label="מספר טלפון - שדה חובה"
          placeholder="050-1234567"
          onInput={(e) => {
            const target = e.target as HTMLInputElement;
            let value = target.value.replace(/[^0-9\-\+\s\(\)]/g, '');
            target.value = value;
          }}
          onBlur={(e) => handleFieldValidation('phoneOriginal', e.target.value, 'phone')}
          onChange={(e) => {
            if (validationErrors['phoneOriginal']) {
              handleFieldValidation('phoneOriginal', e.target.value, 'phone')
            }
          }}
        />
        <ValidationError fieldId="phoneOriginal" />
      </div>

      <div className="space-y-2 w-full max-w-md">
        <label htmlFor="comments" className="flex items-center text-lg font-medium font-staff text-gray-700">
          <MessageSquare className="ml-2 w-4 h-4" />
          הערות
        </label>
        <textarea
          id="comments"
          rows={3}
          className="border-2 border-black focus:border-[#9dd0bf] resize-none w-full px-3 py-2 rounded-md bg-[#fdf6ed]"
          placeholder="הערות או הקדשה מיוחדת (אופציונלי)"
          aria-label="הערות או הקדשה - שדה אופציונלי"
        />
      </div>
    </motion.div>
  )

  return (
    <motion.section
      id="תרומה"
      className="px-4 pt-16 pb-16 mb-24"
      dir="rtl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="mx-auto max-w-4xl">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="border-0 shadow-xl backdrop-blur-sm bg-[#f2f2e8] rounded-lg">
            <div className="pb-2 pt-6 px-6">
              <h2 className="text-3xl font-bold tracking-tighter text-[#2a2b26] font-staff mb-2 text-center">הצטרפו אלינו לעשות שינוי</h2>
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex items-center justify-center"
                >
                  {birdAnim && (
                    <Lottie
                      animationData={birdAnim}
                      loop
                      autoplay
                      style={{ width: 80, height: 80 }}
                    />
                  )}
                </motion.div>
              </div>
              <div className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 text-center mb-4">
                <p className="mb-2">
                  התרומה שלכם מאפשרת לנו להמשיך בפעילותנו החשובה.
                </p>
                {/* <p>
                  <span className="font-semibold font-staff text-[#f5a383]">רק שם ושם משפחה נדרשים</span> - כל השדות האחרים הם
                  אופציונליים לנוחותכם.
                </p> */}
              </div>
            </div>

            <div className="space-y-8 px-6 pb-6">
              {/* Payment Options */}
              <motion.div
                className="flex flex-col sm:flex-row justify-center items-center gap-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {/* Credit Card Payment */}
                <motion.button
                  onClick={() => {
                    setSelectedPayment('credit');
                    console.log('מעבר לתרומה בכרטיס אשראי');
                  }}
                  className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-black transition-all duration-300 shadow-md hover:shadow-lg w-full max-w-xs h-16 sm:flex-1 sm:min-w-0 cursor-pointer ${
                    selectedPayment === 'credit' 
                      ? 'bg-[#f4a282] hover:bg-[#f4a282]/90' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center flex-1">
                    <div className="text-sm font-bold text-black font-staff">חיוב בודד / תשלומים</div>
                    <div className="text-xs text-gray-600">באמצעות אשראי</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 bg-[#FFD700] rounded-lg flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8H4V6H20V8ZM20 18H4V12H20V18ZM6 15H8V17H6V15ZM10 15H14V17H10V15Z"/>
                    </svg>
                  </div>
                </motion.button>

                {/* Israeli Shekel Payment */}
                <motion.button
                  onClick={() => {
                    setSelectedPayment('shekel');
                    console.log('מעבר לתרומה בח״פ ישראלי');
                  }}
                  className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-black transition-all duration-300 shadow-md hover:shadow-lg w-full max-w-xs h-16 sm:flex-1 sm:min-w-0 cursor-pointer ${
                    selectedPayment === 'shekel' 
                      ? 'bg-[#f4a282] hover:bg-[#f4a282]/90' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center flex-1">
                    <div className="text-sm font-bold text-black font-staff">הו"ק אשראי</div>
                    <div className="text-xs text-gray-600">ללא תפיסת מסגרת</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 bg-[#FFD700] rounded-lg flex-shrink-0">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9ZM19 9H14V4H19V9ZM7 7H12V9H7V7ZM7 11H17V13H7V11ZM7 15H17V17H7V15Z"/>
                    </svg>
                  </div>
                </motion.button>

                {/* Bit Payment */}
                <motion.button
                  onClick={() => {
                    setSelectedPayment('bit');
                    console.log('מעבר לתרומה דרך ביט');
                  }}
                  className={`flex items-center justify-center gap-3 px-4 py-3 rounded-xl border-2 border-black transition-all duration-300 shadow-md hover:shadow-lg w-full max-w-xs h-16 sm:flex-1 sm:min-w-0 cursor-pointer ${
                    selectedPayment === 'bit' 
                      ? 'bg-[#f4a282] hover:bg-[#f4a282]/90' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-center flex-1">
                    <div className="text-sm font-bold text-black font-staff">Bit ביט</div>
                  </div>
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img 
                      src="/pictures/bit.png" 
                      alt="Bit" 
                      className="w-full h-full object-cover rounded"
                    />
                  </div>
                </motion.button>
              </motion.div>

              {/* Amount Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold font-staff text-center text-gray-800" style={{ marginBottom: '20px' }}>בחרו סכום לתרומה (₪)</h3>
                <motion.div
                  className="grid grid-cols-2 gap-4 sm:flex sm:flex-wrap sm:justify-center sm:items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                  style={{ gap: '20px' }}
                >
                  {[50, 100, 200, 500].map((amount, index) => (
                    <motion.div
                      key={amount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, delay: 0.9 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex justify-center"
                    >
                      <button
                        className={`h-12 w-full sm:w-auto text-lg font-semibold font-staff transition-all duration-300 cursor-pointer px-6 py-2 rounded-md ${
                          customAmount === amount.toString()
                            ? "bg-gradient-to-r from-[#f5a383] to-[#9dd0bf] text-white border-0"
                            : "border-2 border-black hover:border-[#f5a383] hover:bg-[#f5a383]/10 bg-[#fdf6ed]"
                        }`}
                        onClick={() => {
                          const amountStr = amount.toString();
                          setCustomAmount(amountStr);
                          setDonationAmount(amountStr);
                        }}
                      >
                        {amount}₪
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
                <div className="flex justify-center items-center space-x-reverse">
                  <label htmlFor="custom-amount" className="text-base font-bold font-staff text-gray-800">
                    או הזינו סכום אחר:
                  </label>
                  <input
                    id="custom-amount"
                    type="number"
                    placeholder="סכום בש״ח"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setDonationAmount(e.target.value);
                    }}
                    className="max-w-32 text-center border-2 focus:border-[#9dd0bf] font-bold text-base bg-[#fdf6ed] px-3 py-2 rounded-md"
                    style={{ marginRight: '15px' }}
                  />
                </div>
              </div>

              {/* Dynamic Form Fields based on payment selection */}
              {selectedPayment === 'credit' && renderCreditCardFields()}
              {selectedPayment === 'shekel' && renderShekelFields()}
              {selectedPayment === 'bit' && renderBitFields()}
              {!selectedPayment && renderOriginalFields()}

              {/* Terms and Conditions Checkbox */}
              <div className="w-full text-center mt-6 mb-4">
                <label className="flex items-center justify-center gap-2 text-base text-gray-700">
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="w-4 h-4 text-[#9dd0bf] border-2 border-gray-300 rounded focus:ring-[#9dd0bf]"
                  />
                  <a href="/website-terms" target="_blank" className="text-blue-600 underline cursor-pointer hover:text-blue-800">
                    אני מסכים לתקנון האתר
                  </a>
                </label>
              </div>

              {/* CTA Button */}
              <motion.div
                className="pt-2 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.95 }}
                  className="cursor-pointer"
                >
                  <button
                    className="w-full md:w-auto px-12 py-4 text-xl font-bold font-staff bg-gradient-to-r from-[#f5a383] to-[#9dd0bf] text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-pointer rounded-lg"
                    aria-label="לחצו כאן לביצוע התרומה"
                    onClick={() => {
                      try {
                        const el = typeof document !== 'undefined' ? document.getElementById('תרומה') : null;
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        } else if (typeof window !== 'undefined') {
                          window.location.href = '/#תרומה';
                        }
                      } catch {}
                    }}
                  >
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="inline-flex items-center"
                    >
                      <Heart className="ml-2 w-6 h-6" />
                      הצטרפו לנתינה
                    </motion.div>
                  </button>
                </motion.div>
                <p className="mt-3 text-sm text-gray-500">התרומה מאובטחת ומוגנת בהצפנה מתקדמת</p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}