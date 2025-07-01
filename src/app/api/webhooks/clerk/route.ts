// src/app/api/webhooks/clerk/route.ts (version corrigée)
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { db, createUserFirstCity } from '@/lib/db';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export async function POST(req: Request) {
  if (!webhookSecret) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET');
  }

  // Récupérer les headers
  const headerPayload = await headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Récupérer le body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Créer une nouvelle instance Svix avec le secret
  const wh = new Webhook(webhookSecret);

  let evt: any;

  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Traiter l'événement
  const eventType = evt.type;
  console.log(`Webhook with an ID of ${body.data.id} and type of ${eventType}`);

  try {
    switch (eventType) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      default:
        console.log(`Unhandled event type: ${eventType}`);
    }
  } catch (error) {
    console.error(`Error handling ${eventType}:`, error);
    return new Response(`Error handling ${eventType}`, { status: 500 });
  }

  return NextResponse.json({ message: 'Success' });
}

async function handleUserCreated(userData: any) {
  const { id: clerkId, email_addresses, username, image_url } = userData;
  const email = email_addresses[0]?.email_address;

  if (!email || !username) {
    throw new Error('Missing required user data');
  }

  try {
    // Utiliser upsert pour éviter les erreurs de duplication
    const user = await db.user.upsert({
      where: { clerkId },
      update: {
        email,
        username,
        avatar: image_url || null,
        lastLogin: new Date(),
      },
      create: {
        clerkId,
        email,
        username,
        avatar: image_url || null,
      },
    });

    // Vérifier si le profil de jeu existe déjà
    const existingProfile = await db.gameProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingProfile) {
      // Créer le profil de jeu
      await db.gameProfile.create({
        data: {
          userId: user.id,
          totalPoints: 0,
          citiesCount: 1,
          rank: await getNextUserRank(),
          level: 1,
          experience: 0,
        },
      });

      // Créer la première cité uniquement pour les nouveaux utilisateurs
      const cityName = `${username}_Capital`;
      await createUserFirstCity(user.id, cityName);

      console.log(`New user created: ${user.id} with first city: ${cityName}`);
    } else {
      console.log(`User already exists: ${user.id} - profile updated`);
    }
  } catch (error) {
    console.error('Error creating/updating user:', error);
    throw error;
  }
}

async function handleUserUpdated(userData: any) {
  const { id: clerkId, email_addresses, username, image_url } = userData;
  const email = email_addresses[0]?.email_address;

  try {
    await db.user.update({
      where: { clerkId },
      data: {
        email,
        username,
        avatar: image_url || null,
        lastLogin: new Date(),
      },
    });

    console.log(`User updated: ${clerkId}`);
  } catch (error) {
    console.error('Error updating user:', error);
    // Ne pas relancer l'erreur pour les mises à jour
    // throw error;
  }
}

async function handleUserDeleted(userData: any) {
  const { id: clerkId } = userData;

  try {
    await db.user.delete({
      where: { clerkId },
    });

    console.log(`User deleted: ${clerkId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    // Ne pas relancer l'erreur si l'utilisateur n'existe pas
    // throw error;
  }
}

async function getNextUserRank(): Promise<number> {
  const userCount = await db.user.count();
  return userCount + 1;
}