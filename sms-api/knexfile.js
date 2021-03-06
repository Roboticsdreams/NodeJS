module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://postgres:postgres@localhost/webstore',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/development'
    }
  },
  test: {
    client: 'pg',
    connection: 'postgres://postgres:postgres@localhost/test_webstore',
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/test'
    }
  },
  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/production'
    }
  },
};
