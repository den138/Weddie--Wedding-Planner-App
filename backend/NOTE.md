# Git command

```Text
git pull origin master
git add .
git commit -m "Commit message"
git push origin master
```

# Typescript project template

- [ ] make new directory

```Text
mkdir WSP004
```

- [ ] copy markdown file

```Text
cp ../WSP003/NOTE.md .
```

- [ ] init npm / init yarn

```Text
npm init -y
OR
yarn init -y
```

**remark:** `-y` ans yes to all questions

- [ ] install packages for TS project

```Text
npm install ts-node typescript @types/node ts-node-dev
OR
yarn add ts-node typescript @types/node ts-node-dev
```

**remark:** there should be 3 files, namely node_modules, package-lock.json, and package.json

- [ ] create 4 files: `tsconfig.json`, `index.js`, `app.ts` and `.gitignore`

```Text
touch tsconfig.json index.js app.ts .gitignore
```

- [ ] configure `.gitignore`

```Text
node_modules
.DS_Store
.env
```

- [ ] configure `tsconfig.json`, `package.json`, `index.js` and `app.ts`

`tsconfig.json`:

```JSON
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "lib": ["es6", "dom"],
        "sourceMap": true,
        "allowJs": true,
        "jsx": "react",
        "esModuleInterop":true,
        "moduleResolution": "node",
        "noImplicitReturns": true,
        "noImplicitThis": true,
        "noImplicitAny": true,
        "strictNullChecks": true,
        "suppressImplicitAnyIndexErrors": true,
        "noUnusedLocals": true
    },
    "exclude": [
        "node_modules",
        "build",
        "scripts",
        "index.js"
    ]
}
```

`package.json`:

```JSON
"scripts":{
    "start": "node index.js",
    "dev": "ts-node-dev app.ts",
    "test": "echo \"Error: no test specified\" && exit 1"
},

OR

"scripts":{
    "start": "ts-node app.ts",
    "dev": "ts-node-dev app.ts",
    "test": "jest"
  },

```

`index.js`:

```Javascript
require('ts-node/register');
require('./app');

```

`app.ts`:

```Typescript
console.log('hello, world!');
```

## Express Template

- [ ] install related packages

```Text
npm install express @types/express
OR
yarn add express @types/express
```

- [ ] configure `app.ts`

```Typescript
import express from "express";

const app = express();

const PORT = 8080;

app.listen(PORT, () => {
    console.log(`[info] listening to port ${PORT}`);
})
```

## Express-session Template

- [ ] install related packages

```Text
npm install express-session @types/express-session
OR
yarn add express-session @types/express-session
```

- [ ] configure `app.ts`

```Typescript
import expressSession from 'express-session';
const app = express();

app.use(expressSession({
    secret: 'Tecky Academy teaches typescript',
    resave:true,
    saveUninitialized:true
}));
```

## Other packages

- [ ] install related packages

```Text
npm install jsonfile @types/jsonfile
npm install multer @types/multer
npm install socket.io
npm install pg @types/pg dotenv
npm install bcryptjs @types/bcryptjs

OR

yarn add jsonfile @types/jsonfile
yarn add multer @types/multer
yarn add socket.io
yarn add pg @types/pg dotenv
yarn add bcryptjs @types/bcryptjs
yarn add --dev jest ts-jest @types/jest
yarn add knex @types/knex
```

## Compile

```Text
node index.js
npx ts-node app.ts
npm run dev

OR

yarn start
yarn test
```

## Jest

```Text
yarn ts-jest config:init
yarn test

yarn knex migrate:latest --env test
yarn knex seed:run --env test
```

## Knex

- [ ] create 2 files: `.env`, `.env.example`, `app.ts` and `.gitignore`

```Text
touch .env .env.example
```

- [ ] configure `.env`

```Text
DB_NAME={database-name}
DB_USERNAME=malowong
DB_PASSWORD=malowong
```

```Text
yarn knex init -x ts
yarn knex --env production <any-command>
yarn knex migrate:make create-memos
yarn knex migrate:latest
yarn knex migrate:up
yarn knex migrate:down
yarn knex seed:make -x ts create-all-tables
yarn knex seed:run
```

`knexfile.ts`:

```Typescript
import dotenv from 'dotenv';
dotenv.config();

...

    connection: {
      database: process.env.DB_NAME,
      user:     process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD
    },
```

# SQL command

```Text
psql -U <user> -W -d <database_name>
```

```SQL

-- having your keyword in ALL UPPERCASE is a good habit

CREATE DATABASE <database_name>;

-- list database
\l

-- view table list of relation
\d

-- change database
\c <database_name>;

CREATE TABLE <table_name> (
    <column_name> <type> <constraint>
);

-- view table data
SELECT * FROM <table_name>;

INSERT INFO <table_name> (name, level, data_of_birth) VALUES ('Peter', 25, '1995-05-15');

CREATE TABLE Students(
    id SERIAL primary key,
    name VARCHAR(255) not null,
    level INTEGER not null,
    date_of_birth date
)
```

# Python command

```Text
python3 -m venv {environment-name}
source {environment-name}/bin/activate
pip install --upgrade pip
pip list
deactivate
```
