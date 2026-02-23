/**
 * Manage admin accounts: change password for existing admin, create new admin.
 *
 * Usage:
 *   # Change primary admin (admin@egpghana.org) password:
 *   ADMIN_EMAIL=admin@egpghana.org ADMIN_PASSWORD=YourNewPassword npx tsx scripts/manage-admins.ts
 *
 *   # Create a new admin:
 *   NEW_ADMIN_EMAIL=second@egpghana.org NEW_ADMIN_NAME="Second Admin" NEW_ADMIN_PASSWORD=SecurePass123 npx tsx scripts/manage-admins.ts
 *
 *   # Do both:
 *   ADMIN_PASSWORD=NewPass1 NEW_ADMIN_EMAIL=other@egpghana.org NEW_ADMIN_NAME="Other Admin" NEW_ADMIN_PASSWORD=NewPass2 npx tsx scripts/manage-admins.ts
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@egpghana.org';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const NEW_ADMIN_EMAIL = process.env.NEW_ADMIN_EMAIL;
const NEW_ADMIN_NAME = process.env.NEW_ADMIN_NAME || 'Admin';
const NEW_ADMIN_PASSWORD = process.env.NEW_ADMIN_PASSWORD;

async function main() {
    console.log('🔐 Admin account management\n');

    let didSomething = false;

    // 1. Update existing admin password if ADMIN_PASSWORD is set
    if (ADMIN_PASSWORD) {
        const existing = await prisma.user.findUnique({ where: { email: ADMIN_EMAIL } });
        if (existing) {
            const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await prisma.user.update({
                where: { email: ADMIN_EMAIL },
                data: { password: hashed },
            });
            console.log(`✅ Updated password for ${ADMIN_EMAIL}`);
            didSomething = true;
        } else {
            // Create if doesn't exist
            const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
            await prisma.user.create({
                data: {
                    email: ADMIN_EMAIL,
                    name: 'EGP Admin',
                    password: hashed,
                    role: 'admin',
                    active: true,
                },
            });
            console.log(`✅ Created admin ${ADMIN_EMAIL}`);
            didSomething = true;
        }
    }

    // 2. Create new admin if NEW_ADMIN_* vars are set
    if (NEW_ADMIN_EMAIL && NEW_ADMIN_PASSWORD) {
        const existing = await prisma.user.findUnique({ where: { email: NEW_ADMIN_EMAIL } });
        if (existing) {
            const hashed = await bcrypt.hash(NEW_ADMIN_PASSWORD, 10);
            await prisma.user.update({
                where: { email: NEW_ADMIN_EMAIL },
                data: { password: hashed, role: 'admin', active: true, name: NEW_ADMIN_NAME },
            });
            console.log(`✅ Updated existing user ${NEW_ADMIN_EMAIL} to admin`);
        } else {
            const hashed = await bcrypt.hash(NEW_ADMIN_PASSWORD, 10);
            await prisma.user.create({
                data: {
                    email: NEW_ADMIN_EMAIL,
                    name: NEW_ADMIN_NAME,
                    password: hashed,
                    role: 'admin',
                    active: true,
                },
            });
            console.log(`✅ Created new admin: ${NEW_ADMIN_EMAIL} (${NEW_ADMIN_NAME})`);
        }
        didSomething = true;
    }

    if (!didSomething) {
        console.log('No action taken. Set environment variables:');
        console.log('  ADMIN_PASSWORD=...        - Change password for admin@egpghana.org');
        console.log('  NEW_ADMIN_EMAIL=...       - Create/update another admin');
        console.log('  NEW_ADMIN_NAME=...        - Name for new admin');
        console.log('  NEW_ADMIN_PASSWORD=...    - Password for new admin');
        console.log('\nExample:');
        console.log('  ADMIN_PASSWORD=MyNewPass NEW_ADMIN_EMAIL=editor@egpghana.org NEW_ADMIN_NAME="Editor" NEW_ADMIN_PASSWORD=EditorPass npx tsx scripts/manage-admins.ts');
    }
}

main()
    .catch((e) => {
        console.error('❌ Error:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
