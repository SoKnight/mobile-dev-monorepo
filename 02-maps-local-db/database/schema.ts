import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { LatLng } from "react-native-maps";

export const mapMarkers = sqliteTable('map_markers', {
    // `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL
    id: integer('id').primaryKey({ autoIncrement: true }),

    // `location` TEXT NOT NULL DEFAULT '{"latitude":0,"longitude":0}'
    location: text('location', { mode: 'json' })
        .$type<LatLng>()
        .notNull()
        .$defaultFn((): LatLng => ({ latitude: 0, longitude: 0 })),

    // `title` TEXT
    title: text('title', { mode: 'text' }),

    // `description` TEXT
    description: text('description', { mode: 'text' }),

    // `created_at` INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    created_at: integer('created_at', { mode: 'timestamp' })
        .$type<Date>()
        .notNull()
        .$defaultFn((): Date => new Date()),

    // `updated_at` INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP) ON UPDATE (CURRENT_TIMESTAMP)
    updated_at: integer('updated_at', { mode: 'timestamp' })
        .$type<Date>()
        .notNull()
        .$defaultFn((): Date => new Date())
        .$onUpdateFn((): Date => new Date()),
});

export const mapMarkerImages = sqliteTable('map_marker_images', {
    // `id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL
    id: integer('id').primaryKey({ autoIncrement: true }),

    // `marker_id` INTEGER NOT NULL REFERENCES map_markers(id) ON DELETE CASCADE
    markerId: integer('marker_id')
        .notNull()
        .references(() => mapMarkers.id, { onDelete: 'cascade' }),

    // `url` TEXT
    url: text('url').notNull(),

    // `created_at` INTEGER NOT NULL DEFAULT (CURRENT_TIMESTAMP)
    created_at: integer('created_at', { mode: 'timestamp' })
        .$type<Date>()
        .notNull()
        .$defaultFn((): Date => new Date()),
});