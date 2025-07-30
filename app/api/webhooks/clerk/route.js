// app/api/webhooks/clerk/route.js
import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import User from '@/utils/models/User';
import { connectToDatabase } from "@/utils/db";

export async function POST(req) {
  const payload = await req.json();
  const headersList = await headers();
  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET || '');
  let evt;

  try {
    evt = wh.verify(JSON.stringify(payload), {
      'svix-id': headersList.get('svix-id'),
      'svix-timestamp': headersList.get('svix-timestamp'),
      'svix-signature': headersList.get('svix-signature'),
    });
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }
 await connectToDatabase();
  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = evt.data;
    try {
        await User.create({
            userID: id,
            primaryEmail: email_addresses[0]?.email_address || '',
            firstName: first_name || '',
            lastName: last_name || '',
          });
      return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
      console.error('Error saving user to database:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }
  else if(evt.type === "user.deleted"){
    const {id, deleted} = evt.data;
    try{
      await User.findOneAndDelete({
        userID:id
      })
    }catch(error){
      console.error('Error deleting user from database:', error);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true }, { status: 200 });
}