-- Ažuriranje podataka za filmove

-- Ažuriranje Titanica sa potpunim podacima
UPDATE movies 
SET 
  naziv = 'Titanic',
  opis = 'Romantična drama o tragičnoj sudbini luksuznog broda Titanic iz 1912. godine. Priča o ljubavi između Jacka i Rose koja prebrođava klasne razlike.',
  zanr = 'Drama, Romantični',
  trajanje = 194,
  godinaIzdanja = 1997
WHERE naziv LIKE '%Titanic%';

-- Proveri da li Godfather postoji kao film (ne serija)
SELECT id, naziv, opis, zanr FROM movies WHERE naziv LIKE '%Godfather%';

-- Ako je Godfather pogrešno u serije tabeli, prebaci ga u movies
-- (Ovo pokreni samo ako je potrebno)
-- INSERT INTO movies (naziv, opis, zanr, trajanje, godinaIzdanja, cover_image)
-- SELECT naziv, opis, zanr, 175, 1972, cover_image 
-- FROM series WHERE naziv LIKE '%Godfather%';

-- DELETE FROM series WHERE naziv LIKE '%Godfather%';

-- Proveri sve filmove
SELECT id, naziv, opis, zanr, godinaIzdanja, LENGTH(cover_image) as cover_image_size FROM movies;

-- Proveri sve serije
SELECT id, naziv, opis, zanr, godinaIzdanja, LENGTH(cover_image) as cover_image_size FROM series;
