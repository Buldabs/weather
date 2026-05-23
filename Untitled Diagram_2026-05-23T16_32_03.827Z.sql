CREATE TABLE IF NOT EXISTS "favorite_cities" (
	"id" SERIAL NOT NULL,
	"city_name" VARCHAR(100),
	"country" VARCHAR(100),
	"temp_c" DECIMAL(5,1),
	"added_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);


CREATE INDEX "favorite_cities_index_0"
ON "favorite_cities" ();

CREATE TABLE IF NOT EXISTS "search_history" (
	"id" SERIAL NOT NULL,
	"city_name" VARCHAR(100),
	"searched_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY("id")
);


CREATE INDEX "search_history_index_0"
ON "search_history" ();