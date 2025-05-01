### Install [Docker](https://www.docker.com/) + basic set up

### Ensure you have [Intelliji](https://www.jetbrains.com/idea/download/?section=windows) ultimate version + gradlew (java 23)

### Create a .env file

```
.env
```

### Add the following to the .env file

```
DB_NAME=fcoder_db
DB_USERNAME=fcoder
DB_PASSWORD=fcoderpassword
PGADMIN_DEFAULT_EMAIL=fcoder@example.com
PGADMIN_DEFAULT_PASSWORD=fcoderpassword
SWAGGER_URL=http://localhost:8080/swagger-ui.html

ACCESS_TOKEN_KEY=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
REFRESH_TOKEN_KEY=bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb

MAIL_USERNAME=clbfcoder@gmail.com
MAIL_PASSWORD=fcoder_fcoderpassword
```

### Run the following command to start the application

```
docker compose -f compose.db.yaml --env-file .env -p fcoder up -d
```

### Open docker and run all container name "fcoder", then run "http://localhost:5050/login?next=/" and sign in with account in .env file

### Click to server (at the left corner) then register a server

- In column General - Name : fcoder
  then change to column Connection
- In column Connection

- Host name/ address : fcoder_postgres

- Port : 5432 - Maintenace : fcoder

- Username: fcoder

- Password : fcoderpass

  click "save password?"
  then click save

If u want to see the table click
fcoder -> schemas -> public -> tables

### At intelliji run icon db at the right sidebar, then click the icon "+" and find postgre with icon elephant -> exist popup

change

    - Name : fcoder@localhost

In tab general

    - Host : localhost

    - User : fcoder

    - password : fcoderpass

    - database : fcoder

Then click test connection,
if have a green tick -> run -> apply -> OK
else a red x so it wrong check a field again or call me (LTPPPP) in group chat to help u config

then click the icon reload near the icon "+" at begin to import sync database

If you want see the database lick the arrow down of "public"

### Run API

```
./gradlew clean build --refresh-dependencies
```

then run the project in intelliji

### Swagger UI

After run the project then enter this link to access swagger API

```
http://localhost:8080/api/v1/swagger-ui/index.html

```
