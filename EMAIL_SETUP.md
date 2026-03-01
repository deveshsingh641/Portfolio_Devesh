# Email Configuration Guide

## Problem
Emails from the contact form and bug report feature are not reaching your inbox. This guide will help you set up email delivery.

## Solution

Your portfolio supports two email services:

### Option 1: EmailJS (Recommended)

1. **Create an EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account

2. **Get Your Credentials**
   - Go to Account Settings → API Keys
   - Copy your **Public Key**
   - Create an Email Service (Gmail, Outlook, etc.)
   - Copy your **Service ID**
   - Create an Email Template (see below)
   - Copy your **Template ID**

3. **Create an Email Template**
   - Go to Email Templates
   - Click "Create New Template"
   - Use a template name like "Portfolio Contact Form"
   - In the template editor, use these variables:
   
   ```
   From: {{from_email}}
   Name: {{from_name}}
   Type: {{report_type}} (for bug reports)
   
   Message:
   {{message}}
   
   Reply-To: {{reply_to}}
   ```

4. **Configure Your Portfolio**
   - Create a `.env.local` file in your project root (copy from `.env.local.example`)
   - Add these values:
   ```
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_RECEIVE_EMAIL=your_email@gmail.com
   ```

5. **Test It**
   - Restart your development server
   - Go to the contact form and submit a test message
   - Check your email

### Option 2: Formspree (Alternative)

1. **Create a Formspree Account**
   - Go to https://formspree.io/
   - Sign up and create a new form for your portfolio

2. **Get Your Form Endpoint**
   - Copy the form endpoint URL

3. **Configure Your Portfolio**
   - Create a `.env.local` file in your project root
   - Add:
   ```
   VITE_FORMSPREE_ENDPOINT=https://formspree.io/f/your_form_id
   ```

## Debugging Tips

If emails still aren't arriving:

1. **Check Browser Console**
   - Open DevTools (F12)
   - Submit the form
   - Look for messages like "✅ Email sent successfully" or error messages

2. **Verify Credentials**
   - Make sure you copied the exact values from EmailJS
   - No extra spaces or quotes

3. **Check Email Service Settings (EmailJS)**
   - Verify your email service is connected
   - Check authorized sender addresses
   - Ensure your email provider isn't blocking SendGrid/EmailJS

4. **Check Email Filters**
   - Emails might be going to spam/junk folder
   - Whitelist devesh-singh@formspree.io or your EmailJS domain in your email provider

5. **Environment Variables Not Loading**
   - If using Node.js dev server, restart it after creating `.env.local`
   - Make sure `.env.local` is in the project root, not in src/

## Template Variable Reference

For the EmailJS template, these variables are available:

| Variable | Description | From |
|----------|-------------|------|
| `{{from_name}}` | Sender's name or subject | Contact form / Bug report |
| `{{from_email}}` | Sender's email address | Contact form |
| `{{message}}` | Message body | Contact form |
| `{{reply_to}}` | For setting reply-to address | Contact form |
| `{{report_type}}` | "bug" or "feature" | Bug report only |
| `{{to_email}}` | Your receiving email | Portfolio (system) |

## Security Notes

- Never commit `.env.local` to version control (it's in .gitignore by default)
- Your Public Key is safe to expose (it's public)
- Keep Service ID and Template ID private
- Use environment variables for all sensitive data

## Still Having Issues?

1. Ensure the template variable names in EmailJS exactly match what the code sends
2. Try Option 2 (Formspree) as a simpler alternative
3. Check the browser console for specific error messages
4. Verify your email provider allows emails from EmailJS/Formspree
