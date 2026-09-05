import { PrismaClient } from '@prisma/client';
import { createUser } from '../app/routes/auth/auth.service';
import { createArticle } from '../app/routes/article/article.service';

const prisma = new PrismaClient();

const main = async () => {
  const userA = await createUser({
  username: 'usuario_prueba_a',
  email: 'usuario.a@laboratorio.local',
  password: 'PasswordSegura123!',
  image: 'https://api.realworld.io/images/demo-avatar.png',
  demo: true,
});

const userB = await createUser({
  username: 'usuario_prueba_b',
  email: 'usuario.b@laboratorio.local',
  password: 'PasswordSegura123!',
  image: 'https://api.realworld.io/images/demo-avatar.png',
  demo: true,
});

await prisma.user.update({
  where: { id: userA.id },
  data: { role: 'admin' },
});

await prisma.user.update({
  where: { id: userB.id },
  data: { role: 'user' },
});

  await createArticle(
    {
      title: 'Artículo privado del usuario A',
      description: 'Registro de prueba para auditoría SQLi y BOLA.',
      body: 'Contenido de laboratorio: pertenece al usuario A.',
      tagList: ['seguridad'],
    },
    userA.id,
  );

  await createArticle(
    {
      title: 'Artículo privado del usuario B',
      description: 'Registro de prueba para auditoría SQLi y BOLA.',
      body: 'Contenido de laboratorio: pertenece al usuario B.',
      tagList: ['seguridad'],
    },
    userB.id,
  );

  console.log('Seed de laboratorio completado: 2 usuarios y 2 artículos.');
};

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });