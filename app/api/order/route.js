// import Razorpay from 'razorpay';
// import { NextRequest, NextResponse } from 'next/server';

// const razorpay = new Razorpay({
//  key_id: process.env.RZOR_KEY,
//  key_secret: process.env.RAZOR_SECRET,
// });

// export async function POST(request) {
//  const { amount, currency } = await request.json();

//  var options = {
//   amount: amount,
//   currency: currency,
//   receipt: 'rcp1',
//  };
//  const order = await razorpay.orders.create(options);
//  console.log(order);
//  return NextResponse.json({ orderId: order.id }, { status: 200 });
// }