import { Client } from 'pg';
import AWS from 'aws-sdk';
AWS.config.update({ region: 'ap-southeast-2' });

async function main(): Promise<void> {
  let password: string = '';
  const signer = new (AWS as any).RDS.Signer({ region: 'ap-southeast-2', hostname: 'database-1.cluster-cti6quksmsj5.ap-southeast-2.rds.amazonaws.com', port: 5432, username: 'postgres' });
  password = signer.getAuthToken({});

  const client = new Client({
    host: 'some host',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    const res = await client.query('SELECT version()');
    console.log(res.rows[0].version);
  } catch (error) {
    console.error('Database error:', error);
    throw error;
  } finally {
    await client.end();
  }
}
main().catch(console.error);