-- Database: gunmin_sql

-- DROP DATABASE IF EXISTS gunmin_sql;
	
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp'; -- se existir, não precisa criar a extensão

CREATE TYPE PARENTAL_RATING as ENUM('free', '7', '12', '14', '16', '18');
CREATE TYPE GAME_TYPE as ENUM('play_in', 'play_out');
CREATE TYPE REVIEW_QUALITY as ENUM('horrible', 'bad', 'ok', 'good', 'excellent');
CREATE TYPE REVIEW_USER_TYPE as ENUM('users', 'devs');
CREATE TYPE PLAN_PAYMENT_TYPE as ENUM('fixed_cost', 'on_demand');

CREATE TABLE IF NOT EXISTS "users" (
	id UUID DEFAULT uuid_generate_v4(),
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	'password' varchar(64) NOT NULL CHECK(length('password') >= 8),
	reviewRelevance decimal(10, 2) default 1.0,
	created_updated_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS "devs" (
	id UUID DEFAULT uuid_generate_v4(),
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	'password' varchar(64) NOT NULL CHECK(length('password') >= 8),
	reviewRelevance decimal(10, 2) default 2.0,
	created_updated_at timestamp DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS "admins" (
	id UUID DEFAULT uuid_generate_v4(),
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	'password' varchar(64) NOT NULL CHECK(length('password') >= 8),
	created_updated_at timestamp DEFAULT current_timestamp
);

CREATE TABLE IF NOT EXISTS "genres" (
	id UUID DEFAULT uuid_generate_v4(),
	'name' varchar(100) NOT NULL,
	slug varchar(100) NOT NULL,
	created_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS "games" (
	id UUID DEFAULT uuid_generate_v4(),
	'name' varchar(255) NOT NULL,
	description text NOT NULL CHECK(length('description') >= 30),
	banned boolean DEFAULT false,
	parental_rating PARENTAL_RATING DEFAULT 'free',
	'type' GAME_TYPE DEFAULT 'play_in',
	image_path text,
	dev_id uuid REFERENCES devs(id),
	created_updated_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS "banned_game" (
	game_id UUID REFERENCES games(id),
	admin_id UUID REFERENCES admins(id),
	reason text NOT NULL CHECK(length(reason) >= 30),
	created_updated_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(game_id, admin_id)
);

CREATE TABLE IF NOT EXISTS  "resource" (
	game_id UUID REFERENCES games(id),
	admin_id UUID REFERENCES admins(id),
	reason text NOT NULL CHECK(length(reason) >= 30),
	created_updated_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(game_id, admin_id)
);

CREATE TABLE IF NOT EXISTS "reviews" (
	game_id UUID REFERENCES games(id),
	user_id UUID,
	user_type REVIEW_USER_TYPE,
	review_quality REVIEW_USER_TYPE,
	description text,
	primary key(game_id, user_id)
);

ALTER TABLE reviews ADD CONSTRAINT fk_review_users FOREIGN KEY (user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE reviews ADD CONSTRAINT fk_review_devs FOREIGN KEY (user_id) REFERENCES devs(id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE IF NOT EXISTS "likes" (
	game_id UUID REFERENCES games(id),
	user_id UUID,
	to_user_id UUID,
	user_type REVIEW_USER_TYPE,
	positive boolean,
	primary key(game_id, user_id, to_user_id)
);

ALTER TABLE likes ADD CONSTRAINT fk_likes_users FOREIGN KEY (user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE likes ADD CONSTRAINT fk_likes_devs FOREIGN KEY (user_id) REFERENCES devs(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE likes ADD CONSTRAINT fk_likes_to_users FOREIGN KEY (to_user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE likes ADD CONSTRAINT fk_likes_to_devs FOREIGN KEY (to_user_id) REFERENCES devs(id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE IF NOT EXISTS "games_genres" (
	game_id UUID REFERENCES games(id),
	genre_id UUID REFERENCES genres(id),
	primary key(game_id, genre_id)
);

CREATE TABLE IF NOT EXISTS "plans" (
	plan_id UUID DEFAULT uuid_generate_v4(),
	'payment_type' PLAN_PAYMENT_TYPE NOT NULL,
	cost DECIMAL(10, 2),
	storage DECIMAL(10, 16),
	games_limit int,
	'name' varchar(50),
	primary key(plan_id)
);

CREATE TABLE IF NOT EXISTS "games_played" (
	game_id UUID REFERENCES games(id),
	user_id UUID,
	user_type REVIEW_USER_TYPE,
	time_played BIGINT,
);

ALTER TABLE games_played ADD CONSTRAINT fk_games_played_users FOREIGN KEY (user_id) REFERENCES users(id) DEFERRABLE INITIALLY DEFERRED;
ALTER TABLE games_played ADD CONSTRAINT fk_games_played_devs FOREIGN KEY (user_id) REFERENCES devs(id) DEFERRABLE INITIALLY DEFERRED;