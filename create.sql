-- Database: test_3

	
SELECT * FROM pg_extension WHERE extname = 'uuid-ossp'; -- se existir, não precisa criar a extensão
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE PARENTAL_RATING as ENUM('free', '7', '12', '14', '16', '18');
CREATE TYPE GAME_TYPE as ENUM('play_in', 'play_out');
CREATE TYPE REVIEW_QUALITY as ENUM('horrible', 'bad', 'ok', 'good', 'excellent');
CREATE TYPE REVIEW_USER_TYPE as ENUM('users', 'devs');
CREATE TYPE PLAN_PAYMENT_TYPE as ENUM('Monthly', 'Annual');

CREATE TABLE IF NOT EXISTS "users" (
	id UUID DEFAULT uuid_generate_v4(),
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(64) NOT NULL CHECK(length("password") >= 8),
	reviewRelevance decimal(10, 4) default 1.0,
	created_updated_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS "biling_address" (
	id UUID DEFAULT uuid_generate_v4(),
	"road" varchar(255) NOT NULL,
	"number" int NOT NULL,
	"complement" varchar(100),
	city varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	country varchar(100) NOT NULL,
	primary key(id) 
);


CREATE TABLE IF NOT EXISTS "devs" (
	id UUID DEFAULT uuid_generate_v4(),
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	cpf varchar(11),
	cnpj varchar(14),
	"password" varchar(64) NOT NULL CHECK(length("password") >= 8),
	reviewRelevance decimal(10, 2) default 2.0,
	created_updated_at timestamp DEFAULT current_timestamp,
	biling_address_id UUID REFERENCES biling_address(id),
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS "admins" (
	id UUID DEFAULT uuid_generate_v4(),
	username varchar(255) NOT NULL,
	email varchar(255) NOT NULL,
	"password" varchar(64) NOT NULL CHECK(length("password") >= 8),
	created_updated_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS "genres" (
	id UUID DEFAULT uuid_generate_v4(),
	"name" varchar(100) NOT NULL,
	slug varchar(100) NOT NULL,
	created_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS "games" (
	id UUID DEFAULT uuid_generate_v4(),
	"name" varchar(255) NOT NULL,
	description text NOT NULL CHECK(length("description") >= 30),
	banned boolean DEFAULT false,
	parental_rating PARENTAL_RATING DEFAULT 'free',
	"type" GAME_TYPE DEFAULT 'play_in',
	image_path text,
	dev_id uuid REFERENCES devs(id),
	created_updated_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(id)
);

CREATE TABLE IF NOT EXISTS "banned_game" (
	game_id UUID REFERENCES games(id) ON DELETE CASCADE,
	admin_id UUID REFERENCES admins(id),
	reason text NOT NULL CHECK(length(reason) >= 30),
	created_updated_at timestamp DEFAULT current_timestamp,
	PRIMARY KEY(game_id, admin_id)
);

CREATE TABLE IF NOT EXISTS  "resource" (
	game_id UUID REFERENCES games(id) ON DELETE CASCADE,
	admin_id UUID REFERENCES admins(id),
	accepted boolean DEFAULT false,
	created_updated_at timestamp DEFAULT current_timestamp,
	reason text NOT NULL CHECK(length(reason) >= 30),
	PRIMARY KEY(game_id, admin_id)
);

CREATE TABLE IF NOT EXISTS "reviews" (
	game_id UUID REFERENCES games(id) ON DELETE CASCADE,
	user_id UUID,
	user_type REVIEW_USER_TYPE NOT NULL,
	review_quality REVIEW_QUALITY,
	description text,
	created_at timestamp DEFAULT current_timestamp,
	primary key(game_id, user_id)
);

CREATE TABLE IF NOT EXISTS "likes" (
	game_id UUID REFERENCES games(id) ON DELETE CASCADE,
	user_id UUID,
	to_user_id UUID,
	user_type REVIEW_USER_TYPE NOT NULL,
	positive boolean,
	primary key(game_id, user_id, to_user_id)
);


CREATE TABLE IF NOT EXISTS "games_genres" (
	game_id UUID REFERENCES games(id) ON DELETE CASCADE,
	genre_id UUID REFERENCES genres(id) ON DELETE CASCADE,
	primary key(game_id, genre_id)
);

CREATE TABLE IF NOT EXISTS "plans" (
	plan_id UUID DEFAULT uuid_generate_v4(),
	"payment_type" PLAN_PAYMENT_TYPE NOT NULL,
	cost DECIMAL(10, 2),
	storage DECIMAL(10, 2),
	games_limit int,
	"name" varchar(50),
	primary key(plan_id)
);

ALTER TABLE devs ADD COLUMN plan_id UUID REFERENCES plans(plan_id);

CREATE TABLE IF NOT EXISTS "games_played" (
	game_id UUID REFERENCES games(id),
	user_id UUID,
	user_type REVIEW_USER_TYPE NOT NULL,
	time_played BIGINT,
	last_played_at timestamp DEFAULT current_timestamp,
	primary key(game_id, user_id)
);


CREATE TABLE IF NOT EXISTS profile_images (
    profile_image_id UUID DEFAULT uuid_generate_v4(),
    user_id UUID,
	user_type REVIEW_USER_TYPE NOT NULL,
    image_url TEXT NOT NULL,
    PRIMARY KEY (profile_image_id)
);


CREATE OR REPLACE FUNCTION update_game_banned_status()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE games
  SET banned = true
  WHERE id = NEW.game_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_game_banned_status
AFTER INSERT ON banned_game
FOR EACH ROW
EXECUTE FUNCTION update_game_banned_status();


CREATE OR REPLACE FUNCTION delete_user_profile_images()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM profile_images
    WHERE user_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_user_profile_images
BEFORE DELETE ON users
FOR EACH ROW
EXECUTE FUNCTION delete_user_profile_images();

CREATE OR REPLACE FUNCTION delete_dev_profile_images()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM profile_images
    WHERE user_id = OLD.id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_dev_profile_images
BEFORE DELETE ON devs
FOR EACH ROW
EXECUTE FUNCTION delete_dev_profile_images();

CREATE OR REPLACE FUNCTION increase_review_relevance()
	RETURNS TRIGGER AS $$
	BEGIN
		IF NEW.positive = true and NEW.user_type = 'users' THEN
			UPDATE users
			SET reviewRelevance = reviewRelevance + 0.01
			WHERE id = NEW.to_user_id;
		END IF;
		IF NEW.positive = true and NEW.user_type = 'devs' THEN
			UPDATE devs
			SET reviewRelevance = reviewRelevance + 0.01
			WHERE id = NEW.to_user_id;
		END IF;
		IF NEW.positive = false and NEW.user_type = 'users' THEN
			UPDATE users
			SET reviewRelevance = reviewRelevance - 0.004
			WHERE id = NEW.to_user_id;
		END IF;
		IF NEW.positive = false and NEW.user_type = 'devs' THEN
			UPDATE devs
			SET reviewRelevance = reviewRelevance - 0.004
			WHERE id = NEW.to_user_id;
		END IF;
		RETURN NEW;
	END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER like_increase_review_relevance
AFTER INSERT ON likes
FOR EACH ROW
EXECUTE FUNCTION increase_review_relevance();


CREATE OR REPLACE FUNCTION update_game_banned()
    RETURNS TRIGGER AS $$
BEGIN
    IF NEW.accepted = true THEN
        UPDATE games
        SET banned = false
        WHERE id = NEW.game_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_game_banned_trigger
AFTER UPDATE ON resource
FOR EACH ROW
WHEN (OLD.accepted IS DISTINCT FROM NEW.accepted AND NEW.accepted = true)
EXECUTE FUNCTION update_game_banned();
