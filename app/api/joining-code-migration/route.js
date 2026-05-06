import { connectToDatabase } from '@/utils/db';
import JoiningCode from '@/utils/models/JoiningCode';
import Timer from '@/utils/models/Timer';
import mongoose from 'mongoose';

export async function POST() {
  try {
    await connectToDatabase();
    console.log('Connected to database');

    // Find all timers with non-empty joiningCode
    const timers = await Timer.find({ joiningCode: { $ne: '' } });
    console.log(`Found ${timers.length} timers with joining codes`);

    let insertedCount = 0;

    for (const timer of timers) {
      const code = timer.joiningCode.toUpperCase();
      // Check if joining code already exists
      const existingCode = await JoiningCode.findOne({ code });
      if (!existingCode) {
        // Insert new joining code
        const newJoiningCode = new JoiningCode({
          userID: timer.ownerId,
          code,
          timerId: timer.id,
          isDeleted: timer.isDeleted,
        });
        await newJoiningCode.save();
        insertedCount++;
        console.log(`Inserted joining code: ${code} for timer: ${timer.id}`);
      } else {
        console.log(`Joining code ${code} already exists, skipping`);
      }
    }

    console.log(`Migration completed. Inserted ${insertedCount} new joining codes`);
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}