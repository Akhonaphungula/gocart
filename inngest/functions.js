import {inngest} from './client'
import prisma from '@/lib/prisma'

// Inngest Function to save user data to a database
export const syncUserCreation = inngest.createFunction(
    {id: "sync-user-create"},
    {event: "clerk/user.created"},
    async ({event}) => {
        const {data} = event;

       /* await prisma.user.create({
            data: {
                id:data.id,
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
            }
        })*/
        // Use optional chaining to avoid undefined errors
    const email = data.email_addresses?.[0]?.email_address ?? null;

    const user = await prisma.user.create({
      data: {
        id: data.id,
        email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
    });
    console.log("User created in Neon:", user);
    return user;
    }
);

//Inngest Function to update user data in database
export const syncUserUpdation = inngest.createFunction(
    {id: "sync-user-update"},
    {event: "clerk/user.updated"},
    async ({event}) => {
        const {data} = event;
        const email = data.email_addresses?.[0]?.email_address ?? null;

         // Use upsert instead of update (safe if user doesn’t exist)
    const user = await prisma.user.upsert({
      where: { id: data.id },
      update: {
        email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
      create: {
        id: data.id,
        email,
        name: `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim(),
        image: data.image_url ?? null,
      },
    });

    console.log("User updated in Neon:", user);
    return user;

        /*await prisma.user.update({
            where:{id: data.id,},
             data: {
                email: data.email_addresses[0].email_address,
                name: `${data.first_name} ${data.last_name}`,
                image: data.image_url,
            }
        })*/

    }
);

//Inngest Function to delete user data from database
export const syncUserDeletion = inngest.createFunction(
    {id: "sync-user-delete"},
    {event: "clerk/user.deleted"},
    async ({event}) => {
        const {data} = event;

    // deleteMany is safer, won’t throw if user not found
    const deleted = await prisma.user.deleteMany({
      where: { id: data.id },
    });

    console.log("User deleted in Neon:", deleted);
    return deleted;



       /* await prisma.user.delete({
            where:{id: data.id,}
        })*/
    }
);