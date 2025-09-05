const mysql = require('mysql2/promise');

async function debugDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'DEFAULT_DB'
  });

  try {
    console.log('=== FILMOVI ===');
    const [movies] = await connection.execute(`
      SELECT id, naziv, opis, zanr, godinaIzdanja, trajanje, 
             LENGTH(cover_image) as cover_size,
             CASE 
               WHEN cover_image IS NULL THEN 'NULL'
               WHEN LENGTH(cover_image) = 0 THEN 'EMPTY'
               ELSE 'HAS_DATA'
             END as cover_status
      FROM movies 
      ORDER BY id
    `);
    
    movies.forEach(movie => {
      console.log(`ID: ${movie.id}`);
      console.log(`Naziv: ${movie.naziv}`);
      console.log(`Opis: ${movie.opis?.substring(0, 50) || 'N/A'}...`);
      console.log(`Žanr: ${movie.zanr || 'N/A'}`);
      console.log(`Godina: ${movie.godinaIzdanja || 'N/A'}`);
      console.log(`Trajanje: ${movie.trajanje || 'N/A'}`);
      console.log(`Cover image: ${movie.cover_status} (${movie.cover_size || 0} bytes)`);
      console.log('---');
    });

    console.log('\n=== SERIJE ===');
    const [series] = await connection.execute(`
      SELECT id, naziv, opis, zanr, godinaIzdanja, brojSezona,
             LENGTH(cover_image) as cover_size,
             CASE 
               WHEN cover_image IS NULL THEN 'NULL'
               WHEN LENGTH(cover_image) = 0 THEN 'EMPTY'
               ELSE 'HAS_DATA'
             END as cover_status
      FROM series 
      ORDER BY id
    `);
    
    series.forEach(s => {
      console.log(`ID: ${s.id}`);
      console.log(`Naziv: ${s.naziv}`);
      console.log(`Opis: ${s.opis?.substring(0, 50) || 'N/A'}...`);
      console.log(`Žanr: ${s.zanr || 'N/A'}`);
      console.log(`Godina: ${s.godinaIzdanja || 'N/A'}`);
      console.log(`Sezone: ${s.brojSezona || 'N/A'}`);
      console.log(`Cover image: ${s.cover_status} (${s.cover_size || 0} bytes)`);
      console.log('---');
    });

  } catch (error) {
    console.error('Greška:', error);
  } finally {
    await connection.end();
  }
}

debugDatabase();
