import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { friendEmail, friendName, senderEmail, senderName } = await request.json()

    if (!friendEmail || !friendName || !senderEmail || !senderName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey || resendApiKey === 're_placeholder_key_for_build') {
      // Return success but log that email wasn't sent
      console.log('Resend not configured - skipping email for friend request acceptance')
      return NextResponse.json({ 
        success: true, 
        message: 'Friend request accepted successfully (email service not configured)',
        data: null
      })
    }

    // Import Resend only when needed
    const { Resend } = await import('resend')
    const resend = new Resend(resendApiKey)

    // Send acceptance confirmation email to the original sender
    const { data, error } = await resend.emails.send({
      from: 'FocusOS <noreply@yourdomain.com>',
      to: [senderEmail],
      subject: `${friendName} accepted your friend request on FocusOS!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">🎉 Friend Request Accepted!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">You're now connected on FocusOS!</p>
          </div>
          
          <div style="padding: 40px; background: #f8f9fa;">
            <h2 style="color: #333; margin-bottom: 20px;">Great news, ${senderName}!</h2>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              <strong>${friendName}</strong> has accepted your friend request on FocusOS!
            </p>
            
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              You can now start collaborating and staying motivated together. Here's what you can do:
            </p>
            
            <ul style="color: #666; line-height: 1.6; margin-bottom: 25px; padding-left: 20px;">
              <li>Create shared tasks and goals</li>
              <li>Track each other's progress</li>
              <li>Send motivational messages</li>
              <li>Celebrate achievements together</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/friends" 
                 style="background: #28a745; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                Go to Friends
              </a>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Start your productivity journey together!
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
        { error: 'Failed to send acceptance email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Friend request accepted successfully',
      data 
    })

  } catch (error) {
    console.error('Accept friend request error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
