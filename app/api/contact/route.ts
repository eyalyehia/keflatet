import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// WhatsApp sender (Twilio or simulated)
async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  // Destination number: env > argument > default (client default: 0532217895 -> 972532217895)
  const whatsappPhone = (process.env.WHATSAPP_TO_NUMBER || phoneNumber || '972532217895').replace(/^\+/, '');
  
  // Check if Twilio credentials are available
  const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
  const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
  
  if (!twilioAccountSid || !twilioAuthToken) {
    // For testing purposes, log the message instead of actually sending
    console.log('WhatsApp message (simulated):', {
      to: whatsappPhone,
      message: message
    });
    return { sid: 'simulated_' + Date.now(), status: 'sent' };
  }

  // Real WhatsApp sending via Twilio
  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${Buffer.from(`${twilioAccountSid}:${twilioAuthToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      From: twilioWhatsAppNumber,
      To: `whatsapp:+${whatsappPhone}`,
      Body: message,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WhatsApp send failed: ${error}`);
  }

  return await response.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      subject = '',
      firstName = '',
      lastName = '',
      phone = '',
      email = '',
      message = '',
      notifications = false,
    } = body || {};

    // Server-side validation - mirrors client rules
    const fieldErrors: Record<string, string> = {};
    const trim = (s: string) => (typeof s === 'string' ? s.trim() : '');
    const subjectV = trim(subject);
    const firstV = trim(firstName);
    const lastV = trim(lastName);
    const phoneV = trim(phone).replace(/\s/g, '');
    const emailV = trim(email);
    const messageV = trim(message);

    if (!subjectV) fieldErrors.subject = 'נא לבחור נושא';
    if (!firstV) fieldErrors.firstName = 'נא למלא שם פרטי';
    else if (firstV.length < 2) fieldErrors.firstName = 'שם פרטי חייב להכיל לפחות 2 תווים';
    if (!lastV) fieldErrors.lastName = 'נא למלא שם משפחה';
    else if (lastV.length < 2) fieldErrors.lastName = 'שם משפחה חייב להכיל לפחות 2 תווים';
    if (!phoneV) fieldErrors.phone = 'נא למלא מספר טלפון';
    else if (!/^0\d{1,2}-?\d{7}$|^05\d-?\d{7}$/.test(phoneV)) fieldErrors.phone = 'נא למלא מספר טלפון תקין';
    if (!emailV) fieldErrors.email = 'נא למלא כתובת אימייל';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailV)) fieldErrors.email = 'נא למלא כתובת אימייל תקינה';
    if (!messageV) fieldErrors.message = 'נא למלא הודעה';
    else if (messageV.length < 10) fieldErrors.message = 'ההודעה חייבת להכיל לפחות 10 תווים';

    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { error: 'קיימות שגיאות בטופס', fieldErrors },
        { status: 400 }
      );
    }

    // Optional fallback: at least some contact is present (redundant after validation but kept defensive)
    if (!email && !phone) {
      return NextResponse.json({ error: 'נא למלא אימייל או טלפון ליצירת קשר' }, { status: 400 });
    }

    const results = { email: false, whatsapp: false, errors: [] as string[] };

    // Email sending - via FormSubmit on the server side
    try {
      const to = process.env.CONTACT_TO_EMAIL || 'orelbukris7777@gmail.com';
// 
      // FormSubmit expects specific field names and format
      const formSubmitData = {
        name: `${firstV} ${lastV}`,
        email: emailV,
        phone: phoneV,
        message: `נושא: ${subjectV}\n\n${messageV}`,
        _subject: subjectV ? `פנייה מהאתר: ${subjectV}` : 'פנייה חדשה מהאתר',
        _replyto: emailV,
        _captcha: 'false'
      };

      console.log('Sending to FormSubmit:', { to, data: formSubmitData });
// 
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formSubmitData),
      });

      const responseData = await response.json().catch(() => ({}));
      console.log('FormSubmit response:', { status: response.status, data: responseData });

      if (!response.ok) {
        throw new Error(responseData.message || responseData.error || 'FormSubmit email send failed');
      }

      // Check if FormSubmit returned success
      if (responseData.success === 'true' || responseData.success === true || response.status === 200) {
        results.email = true;
      } else {
        throw new Error('FormSubmit did not confirm success');
      }
    } catch (emailError: any) {
      console.error('Email sending failed:', emailError);
      results.errors.push(`שליחת אימייל נכשלה: ${emailError.message}`);
    }

    // WhatsApp sending
    try {
      const whatsappMessage = `
פנייה חדשה מהאתר:
נושא: ${subject || '-'}
שם: ${firstName} ${lastName}
טלפון: ${phone || '-'}
אימייל: ${email || '-'}
הודעה: ${message || '-'}
      `.trim();

      await sendWhatsAppMessage(process.env.WHATSAPP_TO_NUMBER || '972532217895', whatsappMessage);
      results.whatsapp = true;
    } catch (whatsappError: any) {
      console.error('WhatsApp sending failed:', whatsappError);
      results.errors.push(`שליחת WhatsApp נכשלה: ${whatsappError.message}`);
    }

    // Check if at least one method succeeded
    if (!results.email && !results.whatsapp) {
      return NextResponse.json({ 
        error: 'שליחה נכשלה בכל הערוצים', 
        details: results.errors 
      }, { status: 500 });
    }

    // Partial success - at least one method worked
    if (results.errors.length > 0) {
      return NextResponse.json({ 
        ok: true, 
        warning: 'שליחה הצליחה חלקית', 
        details: results,
        errors: results.errors 
      });
    }

    // Full success
    return NextResponse.json({ ok: true, details: results });
  } catch (err: any) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'שגיאה כללית בשליחה' }, { status: 500 });
  }
}
