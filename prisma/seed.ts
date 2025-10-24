// prisma/seed.ts:
import { PrismaClient, Prisma } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from "bcrypt";

const prisma = new PrismaClient().$extends(withAccelerate());

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Tim Redaksi MyCompany",
    email: "redaksi@mycompany.com",
    password: "password123",
    news: {
      create: [
        {
          title: "5 Tren Teknologi Web yang Akan Mendominasi di Tahun 2026",
          slug: "5-tren-teknologi-web-2026",
          content:
            "AI generatif, WebAssembly, dan komputasi edge akan mengubah cara kita membangun aplikasi. Mari kita bedah satu per satu bagaimana tren ini akan berdampak pada bisnis Anda di tahun-tahun mendatang. Ini adalah wawasan industri dari tim riset kami.",
          published: true,
        },
      ],
    },
  },
  {
    name: "Alice Hartono",
    email: "alice.hartono@mycompany.com",
    password: "password456",
    news: {
      create: [
        {
          title: "MyCompany Resmi Meluncurkan Layanan SaaS 'QuantumLeap'",
          slug: "mycompany-rilis-quantumleap",
          content:
            "Dengan bangga kami mengumumkan peluncuran <strong>QuantumLeap</strong>, platform analitik data berbasis AI terbaru kami. Ini adalah pencapaian besar bagi tim kami dan langkah maju untuk industri. Kunjungi halaman layanan kami untuk info lebih lanjut.",
          published: true,
        },
      ],
    },
  },
  {
    name: "Budi Santoso",
    email: "budi.santoso@mycompany.com",
    password: "password789",
    news: {
      create: [
        {
          title: "Studi Kasus: Transformasi Digital Sukses Bersama Klien XYZ",
          slug: "studi-kasus-klien-xyz",
          content:
            "Pelajari bagaimana kami membantu Klien XYZ (sektor ritel) merombak infrastruktur legacy mereka, mengimplementasikan arsitektur microservices, dan meningkatkan efisiensi operasional sebesar 45% hanya dalam 6 bulan.",
          published: true,
        },
        {
          title:
            "Deep Dive: Mengoptimalkan Performa React dengan Server Components",
          slug: "deep-dive-react-server-components",
          content:
            "[DRAFT INTERNAL] Artikel ini akan membahas arsitektur baru React dan perbandingannya dengan metode client-side rendering tradisional. Menunggu data benchmark dari proyek internal sebelum dipublikasi.",
          published: false,
        },
      ],
    },
  },
];

async function main() {
  console.log(`Mulai proses seeding ...`);

  const saltRounds = 10;

  for (const u of userData) {
    const plainPassword = u.password;

    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);

    const dataWithHashedPassword = {
      ...u,
      password: hashedPassword,
    };

    const user = await prisma.user.create({
      data: dataWithHashedPassword,
    });
    console.log(`Membuat user dengan id: ${user.id} (nama: ${user.name})`);
  }
  console.log(`Seeding selesai.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
