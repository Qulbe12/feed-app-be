import bcrypt from "bcrypt";
import Account from "../Models/user.model";
import mongoose from "mongoose";


export async function seedAdminUser() {
    try {
        // Check if an admin user already exists
        const existingAdmin = await Account.findOne({ email: 'Amjad@desolint.com' });

        // If admin user doesn't exist, create one
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('123456abc', 10); // Hash the password
            await Account.create({
                name: 'Admin',
                email: 'Amjad@desolint.com',
                password: hashedPassword
            });
            console.log('Admin user seeded successfully');
        } else {
            console.log('Admin user already exists');
        }

        // Disconnect from MongoDB
        // await mongoose.disconnect();
    } catch (error) {
        console.error('Error seeding admin user:', error);
    }
}