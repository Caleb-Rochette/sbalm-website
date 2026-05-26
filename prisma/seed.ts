// CRM ONLY — run with: npx prisma db seed
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const DATABASE_URL = process.env.DATABASE_URL ?? `postgresql://${process.env.USER}@localhost:5432/sirboxalot_crm`;
const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email    = process.env.SEED_ADMIN_EMAIL    ?? "daryl@sirboxalotmovers.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "SirBox!CRM#2026";
  const name     = process.env.SEED_ADMIN_NAME     ?? "Daryl";

  // Admin user
  const hashed = await bcrypt.hash(password, 12);
  const admin = await prisma.user.upsert({
    where:  { email },
    update: { hashedPassword: hashed, name },
    create: { email, hashedPassword: hashed, name, role: "ADMIN" },
  });
  console.log(`✓ Admin user: ${admin.email}`);

  // Business settings
  await prisma.businessSettings.upsert({
    where:  { id: 1 },
    update: {},
    create: { id: 1, rate2ManCrew: 125, rate3ManCrew: 175, minimumHours: 2 },
  });
  console.log("✓ Business settings");

  // Employees
  const employees = await Promise.all([
    prisma.employee.upsert({ where: { id: "emp-1" }, update: {}, create: { id: "emp-1", firstName: "Marcus", lastName: "Johnson", role: "Lead Mover", phone: "214-555-0101", status: "ACTIVE", hireDate: new Date("2023-03-15") } }),
    prisma.employee.upsert({ where: { id: "emp-2" }, update: {}, create: { id: "emp-2", firstName: "Travis", lastName: "Williams", role: "Mover",      phone: "214-555-0102", status: "ACTIVE", hireDate: new Date("2023-06-01") } }),
    prisma.employee.upsert({ where: { id: "emp-3" }, update: {}, create: { id: "emp-3", firstName: "Devon",  lastName: "Carter",   role: "Mover",      phone: "214-555-0103", status: "ACTIVE", hireDate: new Date("2024-01-10") } }),
    prisma.employee.upsert({ where: { id: "emp-4" }, update: {}, create: { id: "emp-4", firstName: "James",  lastName: "Brooks",   role: "Driver",     phone: "214-555-0104", status: "ACTIVE", hireDate: new Date("2022-11-20") } }),
    prisma.employee.upsert({ where: { id: "emp-5" }, update: {}, create: { id: "emp-5", firstName: "Kevin",  lastName: "Mitchell", role: "Mover",      phone: "214-555-0105", status: "INACTIVE", hireDate: new Date("2023-08-05") } }),
  ]);
  console.log(`✓ ${employees.length} employees`);

  // Sample customers
  const c1 = await prisma.customer.upsert({
    where: { id: "cust-1" },
    update: {},
    create: {
      id: "cust-1", firstName: "Sarah", lastName: "Thompson",
      email: "sarah.thompson@email.com", phone: "972-555-2001",
      address: "1234 Elm St, Dallas, TX 75201",
      source: "WEBSITE_CHAT", status: "COMPLETED",
      notes: "Referred by neighbor. Very organized.",
    },
  });

  const c2 = await prisma.customer.upsert({
    where: { id: "cust-2" },
    update: {},
    create: {
      id: "cust-2", firstName: "Robert", lastName: "Garcia",
      email: "rgarcia@gmail.com", phone: "469-555-3002",
      address: "5678 Oak Ave, Plano, TX 75024",
      source: "GOOGLE", status: "BOOKED",
    },
  });

  const c3 = await prisma.customer.upsert({
    where: { id: "cust-3" },
    update: {},
    create: {
      id: "cust-3", firstName: "Jennifer", lastName: "Lee",
      phone: "214-555-4003",
      source: "PHONE_CALL", status: "LEAD",
      notes: "Interested in packing services. Moving end of month.",
    },
  });
  console.log("✓ 3 sample customers");

  // Job for Sarah (completed)
  const job1 = await prisma.job.upsert({
    where: { id: "job-1" },
    update: {},
    create: {
      id: "job-1", customerId: c1.id,
      jobDate: new Date("2026-05-10"), jobTime: "9:00 AM",
      crewSize: 3, serviceType: "BOTH",
      originAddress: "1234 Elm St, Dallas, TX 75201",
      destinationAddress: "9090 Maple Dr, Frisco, TX 75035",
      estimatedHours: 5, actualHours: 5.5,
      pricePerHour: 175, totalCharged: 962.50,
      status: "COMPLETED",
      notes: "3-bedroom house. Had extra boxes.",
    },
  });

  // Assign crew to job1
  await prisma.employeeJob.upsert({ where: { employeeId_jobId: { employeeId: "emp-1", jobId: job1.id } }, update: {}, create: { employeeId: "emp-1", jobId: job1.id } });
  await prisma.employeeJob.upsert({ where: { employeeId_jobId: { employeeId: "emp-2", jobId: job1.id } }, update: {}, create: { employeeId: "emp-2", jobId: job1.id } });
  await prisma.employeeJob.upsert({ where: { employeeId_jobId: { employeeId: "emp-4", jobId: job1.id } }, update: {}, create: { employeeId: "emp-4", jobId: job1.id } });

  // Job for Robert (upcoming)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);
  const job2 = await prisma.job.upsert({
    where: { id: "job-2" },
    update: {},
    create: {
      id: "job-2", customerId: c2.id,
      jobDate: nextWeek, jobTime: "8:00 AM",
      crewSize: 2, serviceType: "LOADING_UNLOADING",
      originAddress: "5678 Oak Ave, Plano, TX 75024",
      destinationAddress: "2233 Pine Rd, McKinney, TX 75070",
      estimatedHours: 4,
      pricePerHour: 125,
      status: "SCHEDULED",
    },
  });

  await prisma.employeeJob.upsert({ where: { employeeId_jobId: { employeeId: "emp-1", jobId: job2.id } }, update: {}, create: { employeeId: "emp-1", jobId: job2.id } });
  await prisma.employeeJob.upsert({ where: { employeeId_jobId: { employeeId: "emp-3", jobId: job2.id } }, update: {}, create: { employeeId: "emp-3", jobId: job2.id } });
  console.log("✓ 2 sample jobs");

  // Interactions
  await prisma.interaction.upsert({
    where: { id: "int-1" },
    update: {},
    create: {
      id: "int-1", customerId: c1.id, jobId: job1.id,
      type: "CALL", summary: "Confirmed job date and crew size. Customer asked about packing supplies.",
      createdById: admin.id,
      createdAt: new Date("2026-05-05"),
    },
  });

  await prisma.interaction.upsert({
    where: { id: "int-2" },
    update: {},
    create: {
      id: "int-2", customerId: c2.id,
      type: "CALL", summary: "Booked job for 2-man crew. Confirmed address and window.",
      createdById: admin.id,
      createdAt: new Date("2026-05-20"),
    },
  });

  await prisma.interaction.upsert({
    where: { id: "int-3" },
    update: {},
    create: {
      id: "int-3", customerId: c3.id,
      type: "TEXT", summary: "Jennifer texted asking about pricing for a 1BR. Sent quote via text.",
      createdById: admin.id,
    },
  });
  console.log("✓ 3 interactions");

  // Quote for Jennifer
  await prisma.quote.upsert({
    where: { id: "quote-1" },
    update: {},
    create: {
      id: "quote-1", customerId: c3.id,
      crewSize: 2, estimatedHours: 2, serviceType: "LOADING_UNLOADING",
      originAddress: "TBD", destinationAddress: "TBD",
      quotedPrice: 250, status: "SENT",
      notes: "1BR apartment. Minimum 2hr applies.",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });
  console.log("✓ 1 quote");

  console.log("\n✅ Seed complete!");
  console.log(`   Login: ${email}`);
  console.log(`   Password: ${password}`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
