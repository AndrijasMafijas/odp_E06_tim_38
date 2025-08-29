-- Dodaj trivije za postojeće serije
INSERT INTO trivias (pitanje, odgovor, sadrzajId, tipSadrzaja)
VALUES 
  ('Ko je glavni lik u seriji Breaking Bad?', 'Walter White', 1, 'series'),
  ('U kom gradu se dešava radnja Stranger Things?', 'Hawkins', 2, 'series'),
  ('Koja serija ima 3 sezone?', 'Titanik', 3, 'series');

-- Dodaj trivije za postojeće filmove (ako već ne postoje)
INSERT INTO trivias (pitanje, odgovor, sadrzajId, tipSadrzaja)
VALUES 
  ('Ko je režirao film Inception?', 'Christopher Nolan', 1, 'movie'),
  ('Ko glumi glavnu ulogu u filmu The Godfather?', 'Marlon Brando', 2, 'movie'),
  ('U kojoj godini je snimljen Titanik?', '2001', 3, 'movie');
