-- Proveri strukturu tabele movies
DESCRIBE movies;

-- Dodaj cover_image kolonu ako ne postoji
ALTER TABLE movies ADD COLUMN cover_image LONGTEXT;
