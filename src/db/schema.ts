import {
	bigint,
	boolean,
	date,
	foreignKey,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	TableWithColumns,
} from 'drizzle-orm/pg-core';

type TableWithColumns<T> = T & { [K: string]: any; };
import { env } from '@/env';
import { relations } from 'drizzle-orm';

export const subscriptionPlanEnum = pgEnum('tgcloud_subscription_plan', ['ANNUAL', 'MONTHLY']);

export const usersTable = pgTable<{
	id: string;
	name: string;
	email: string;
	imageUrl: string | null;
	channelUsername: string | null;
	channelId: string | null;
	accessHash: string | null;
	channelTitle: string | null;
	hasPublicTgChannel: boolean;
	isSubscribedToPro: boolean;
	subscriptionDate: Date | null;
	plan: 'ANNUAL' | 'MONTHLY';
	emailVerified: boolean;
	image: string | null;
	createdAt: string;
}>(
	'usersTable',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		email: text('email').notNull().unique(),
		imageUrl: text('imageUrl'),
		channelUsername: text('channelName').unique(),
		channelId: text('channelId').unique(),
		accessHash: text('accessHash'),
		channelTitle: text('channelTitle'),
		hasPublicTgChannel: boolean('hasPublicChannel'),
		isSubscribedToPro: boolean('is_subscribed_to_pro').default(false),
		subscriptionDate: date('subscription_date'),
		plan: subscriptionPlanEnum('tgcloud_subscription_plan'),
		emailVerified: boolean('emailVerified'),
		image: text('image'),
		createdAt: timestamp('createdAt', { mode: 'string' }).$defaultFn(() =>
			new Date().toDateString()
		),
		updatedAt: timestamp('updatedAt', { mode: 'string' }).$defaultFn(() =>
			new Date().toDateString()
		)
	},
	(table) => ({
		emailIdx: uniqueIndex('email_idx').on(table.email)
	})
);

export const usersRelations = relations(usersTable, ({ many }: { many: (table: TableWithColumns<any>) => any }) => ({
	botTokens: many(botTokens)
}));

export const botTokens = pgTable<{
	id: string;
	userId: string;
	botToken: string;
	expiresAt: Date | null;
	ipAddress: string | null;
	token: string | null;
	userAgent: string | null;
	createdAt: string;
	updatedAt: string;
}>('botTokens', {
	id: text('id').primaryKey(),
	token: text('token').notNull().default(env.NEXT_PUBLIC_BOT_TOKEN),
	userId: text('userId')
		.notNull()
		.references(() => usersTable.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	rateLimitedUntil: timestamp('rateLimitedUntil'),
	createdAt: timestamp('createdAt', { mode: 'string' }).$defaultFn(() => new Date().toDateString()),
	updatedAt: timestamp('updatedAt', { mode: 'string' }).$defaultFn(() => new Date().toDateString())
});

export const botTokenRelations = relations(botTokens, ({ one }: { one: (table: TableWithColumns<any>) => any }) => ({
	user: one(usersTable, {
		fields: [botTokens.userId],
		references: [usersTable.id]
	})
}));

export const session = pgTable(
	'session',
	{
		id: text('id').primaryKey(),
		expiresAt: date('expiresAt'),
		ipAddress: text('ipAddress'),
		token: text('token'),
		userAgent: text('userAgent'),
		userId: text('userId'),
		createdAt: text('createdAt'),
		updatedAt: text('updatedAt')
	},
	(table) => ({
		fkUserId: foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.id]
		}).onDelete('cascade')
	})
);

export const account = pgTable<{
	id: string;
	accountId: string;
	providerId: string;
	userId: string;
	accessToken: string | null;
	refreshToken: string | null;
	idToken: string | null;
	expiresAt: Date | null;
	password: string | null;
	createdAt: string;
	updatedAt: string;
	accessTokenExpiresAt: Date | null;
	refreshTokenExpiresAt: Date | null;
	scope: string | null;
}>(
	'account',
	{
		id: text('id').primaryKey(),
		accountId: text('accountId'),
		providerId: text('providerId'),
		userId: text('userId'),
		accessToken: text('accessToken'),
		refreshToken: text('refreshToken'),
		idToken: text('idToken'),
		expiresAt: date('expiresAt'),
		password: text('password'),
		createdAt: text('createdAt'),
		updatedAt: text('updatedAt'),
		accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
		refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
		scope: text('scope')
	},
	(table) => ({
		fkUserId: foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.id]
		}).onDelete('cascade')
	})
);

export const verification = pgTable('verification', {
	id: text('id').primaryKey(),
	identifier: text('identifier'),
	value: text('value'),
	expiresAt: date('expiresAt'),
	createdAt: date('createdAt'),
	updatedAt: date('updatedAt')
});

export const sharedFilesTable = pgTable(
	'sharedFiles',
	{
		id: text('id').primaryKey(),
		fileId: text('fileId'),
		userId: text('userId').notNull()
	},
	(table) => ({
		fkUserId: foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.id]
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	})
);

export const paymentsTable = pgTable(
	'paymentsTable',
	{
		id: text('id').primaryKey(),
		amount: text('amount').notNull(),
		currency: text('currency').notNull(),
		userId: text('userId').notNull(),
		tx_ref: text('tx_ref').notNull().unique(),
		customizationTitle: text('customizationTitle'),
		customizationDescription: text('customizationDescription'),
		customizationLogo: text('customizationLogo'),
		paymentDate: date('paymentDate').$defaultFn(() => new Date().toISOString()),
		isPaymentDONE: boolean('isPaymentDONE').default(false),
		plan: subscriptionPlanEnum('tgcloud_subscription_plan')
	},
	(table) => ({
		fkUserId: foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.id]
		})
			.onUpdate('cascade')
			.onDelete('cascade')
	})
);

export const folders = pgTable(
	'folders',
	{
		id: text('id').primaryKey(),
		name: text('name').notNull(),
		userId: text('userId').notNull(),
		parentId: text('parentId'),
		path: text('path').notNull(),
		createdAt: date('createdAt', { mode: 'string' }).$defaultFn(() => new Date().toDateString()),
		updatedAt: date('updatedAt', { mode: 'string' }).$defaultFn(() => new Date().toDateString())
	},
	(table) => ({
		userFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.id]
		})
			.onDelete('cascade')
			.onUpdate('cascade'),
		parentFk: foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id]
		})
			.onDelete('cascade')
			.onUpdate('cascade')
	})
);

export const userFiles = pgTable(
	'userFiles',
	{
		id: bigint('id', { mode: 'number' }).primaryKey(),
		userId: text('userId').notNull(),
		folderId: text('folderId'),
		fileName: text('filename').notNull(),
		mimeType: text('mimeType').notNull(),
		size: bigint('size', { mode: 'bigint' }).notNull(),
		url: text('fileUrl').notNull(),
		date: date('date', { mode: 'string' }).$defaultFn(() => new Date().toDateString()),
		fileTelegramId: text('fileTelegramId'),
		category: text('fileCategory'),
		createdAt: date('createdAt', { mode: 'string' }).$defaultFn(() => new Date().toDateString()),
		updatedAt: date('updatedAt', { mode: 'string' }).$defaultFn(() => new Date().toDateString())
	},
	(table) => ({
		userFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [usersTable.id]
		})
			.onDelete('cascade')
			.onUpdate('cascade'),
		folderFk: foreignKey({
			columns: [table.folderId],
			foreignColumns: [folders.id]
		})
			.onDelete('cascade')
			.onUpdate('cascade')
	})
);

export const supportTable = pgTable('supportTable', {
	id: bigint('id', { mode: 'number' }).primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull(),
	message: text('message').notNull(),
	date: date('date', { mode: 'string' }).$defaultFn(() => new Date().toDateString())
});
