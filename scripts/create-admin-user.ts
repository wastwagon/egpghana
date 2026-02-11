import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
    console.log('🔐 Creating/Updating Admin User...');

    try {
        const email = 'admin@egpghana.org';
        const password = 'EGP_Admin_2026!';
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.upsert({
            where: { email },
            update: {
                password: hashedPassword,
                role: 'admin',
                active: true,
            },
            create: {
                email,
                name: 'System Admin',
                password: hashedPassword,
                role: 'admin',
                active: true,
            },
        });

        console.log(`✅ Admin user created/updated: ${user.email}`);
        console.log(`🔑 Password: ${password}`);

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createAdminUser();
