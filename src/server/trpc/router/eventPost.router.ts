import { EventPost } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createEventPostSchema } from "../../../schema/eventPost.schema";
import { router, protectedProcedure, publicProcedure } from "../trpc";

export const eventPost = router({
  createPost: protectedProcedure
    .input(createEventPostSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const posts: EventPost = await ctx.prisma.eventPost.create({
          data: {
            ...input,
            author: {
              connect: {
                id: ctx.session?.user?.id,
              },
            },
          },
        });
        return posts;
      } catch (error: any) {
        if (!ctx.session?.user)
          throw new TRPCError({
            message: "Unauthorized to create",
            code: "FORBIDDEN",
          });
        return error;
      }
    }),
  deleteEvent: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(({ ctx, input: { id } }) => {
      return ctx.prisma.eventPost.delete({
        where: { id },
      });
    }),
  getMyEvent: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.eventPost.findMany({
      where: { authorId: ctx.session?.user?.id },
    });
  }),
  //TODO filter & pagination here
  getAll: publicProcedure
    .input(
      z.object({
        orderBy: z
          .object({
            date: z.union([z.literal("asc"), z.literal("desc")]).optional(),
            timeEnd: z.union([z.literal("asc"), z.literal("desc")]).optional(),
          })
          .optional(),
        cursor: z.string().nullish(),
        limit: z.number().min(1).max(100).default(5),
      })
    )
    .query(async ({ ctx, input }) => {
      const { orderBy, cursor, limit } = input;
      const events = await ctx.prisma.eventPost.findMany({
        take: limit + 1,
        orderBy,
        cursor: cursor ? { id: cursor } : undefined,
      });

      let nextCursor: typeof cursor | undefined = undefined;

      // freaking genius + 1 means you pop the next cursor
      if (events.length > limit) {
        const nextItem = events.pop() as typeof events[number];
        nextCursor = nextItem.id;
      }
      // TODO pagination & filter
      console.log({ nextCursor });

      return { events, nextCursor };
    }),
});
