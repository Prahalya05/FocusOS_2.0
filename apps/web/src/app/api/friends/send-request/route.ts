import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { friendEmail, friendName, senderName, senderEmail } = await request.json()

    if (!friendEmail || !friendName || !senderName || !senderEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey || resendApiKey === 're_placeholder_key_for_build') {
      // Return success but log that email wasn't sent
      console.log('Resend not configured - skipping email for friend request')
      return NextResponse.json({ 
        success: true, 
        message: 'Friend request processed successfully (email service not configured)',
        data: null
      })
    }

    // Import Resend only when needed
    const { Resend } = await import('resend')
    const resend = new Resend(resendApiKey)

    // Send friend request email
    const { data, error } = await resend.emails.send({
      from: 'FocusOS <noreply@yourdomain.com>',
      to: [friendEmail],
      subject: `${senderName} wants to be your friend on FocusOS!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">FocusOS Friend Request</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Stay focused together!</p>
          </div>
          
          <div style="padding: 40px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Hello ${friendName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              <strong>${senderName}</strong> (${senderEmail}) wants to connect with you on FocusOS!
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              FocusOS is a productivity platform that helps you stay focused and achieve your goals. 
              When you accept this friend request, you'll be able to:
            </p>
            
            <ul style="color: #666; line-height: 1.6; margin-bottom: 25px; padding-left: 20px;">
              <li>Share tasks and goals</li>
              <li>Track progress together</li>
              <li>Stay motivated as a team</li>
              <li>Celebrate achievements</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/friends/accept?email=${encodeURIComponent(friendEmail)}&sender=${encodeURIComponent(senderEmail)}" 
                 style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Accept Friend Request
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              If you don't want to accept this request, you can simply ignore this email.
            </p>
          </div>
          
          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0; font-size: 14px;">
              © 2024 FocusOS. All rights reserved.
            </p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Friend request email sent successfully',
      data 
    })

  } catch (error) {
    console.error('Send friend request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
