# DocuCrypt

DocuCrypt is a privacy application to encrypt text before saving it to Google docs.

> :warning: **In Development**: This code is currently in early development.

## Requirements
* :whale: Docker :whale:
    * docker
    * docker-compose

On Windows and Mac, you get both if you install the [docker installer](https://docs.docker.com/get-docker/). On Linux, you may already have either or both installed. If not you can follow the instructions in the link. If you're on Linux, you can probably figure it ou.

## To run locally

Clone the repository, cd into the directory, and run using docker-compose:

```bash
git clone https://github.com/jesserobles/docucrypt.git
cd docucrypt
docker-compose up -d
```


Wait a few minutes while the dependencies are installed and stuff is built :hourglass_flowing_sand:. The first time you run it may take about 10 minutes before the app is ready. You can check to see if the app is upp and running by running `docker logs docucrypt_front-end_1`, and when it's ready the output will show:
```bash
  App running at:
  - Local:   http://localhost:8080/ 

  It seems you are running Vue CLI inside a container.
  Access the dev server via http://localhost:<your container's external mapped port>/

  Note that the development build is not optimized.
  To create a production build, run yarn build.
```

Use your browser to navigate to [http://localhost:8080](http://localhost:8080) (replace `8080` with whatever port you set `FRONTEND_PORT` to).

## To stop containers
From within the docucrypt folder, run the following:
```bash
docker-compose down
```

#### Optional
Create a file named `.env`, using `example.env` as a starting point. This file will contain environment variable such as ports and credentials for the docker containers. Make any changes you want to that file. For example, if you want to run the front end on a different port (default port is `8080`), change the `FRONTEND_PORT` variable. Note that the `.env` file is listed in the `.gitignore` so sensitive information will not be pushed to git.
```bash
cp example.env .env
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
