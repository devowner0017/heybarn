# heybarn dev environment and workflow

All local dev environment variables are stored in the .env.development file. Just copy them over into a .env file and start the server.

## Git CI/CD Process

heybarn has 2 main trunks and many feature branches.

1. Main/Master Trunk
   1. No developer ever works directly on the master trunk
   2. This is production, customer facing code, deployed live!
   3. Code is only ever merged in via pull requests from hotfix branches or the Release trunk
2. Release Trunk
   1. No developer ever works directly on the Release trunk
   2. The release Trunk is for UA Testing, PRE-Production
   3. Code is only ever merged in via pull requests from feature branches
3. Feature Branches
   1. These are branched from the release branch and worked on by developers
   2. These should be named something relevant to the code that is being developed
   3. These should be focused on one feature or aspect being developed

## Commits & Pull Requests

- Commits should be small, concise and descriptive
- Pull Requests should at the very least describe the changes enacted in the new code, but preferably include:
  - The feature being worked on
  - The problems being solved
  - The solutions enacted
  - Any knock-on issues or ToDos

## Linting & Testing

Sharetribe is pre rolled with Jest as the testing library, and heybarn continues to use Jest.

Heybarn also uses husky for pre-commit linting to ensure code formatting and precision. 
Ensure that you have installed Husky and it will run before every commit, ensuring the validity of your code.





# Sharetribe Flex Template for Web

[![CircleCI](https://circleci.com/gh/sharetribe/ftw-daily.svg?style=svg)](https://circleci.com/gh/sharetribe/ftw-daily)

This is a template web application for a Sharetribe Flex marketplace ready to be extended and
customized. It is based on an application bootstrapped with
[create-react-app](https://github.com/facebookincubator/create-react-app) with some additions,
namely server side rendering and a custom CSS setup.

> Note: We also have two more templates available:
> [FTW-hourly](https://github.com/sharetribe/ftw-hourly) and
> [FTW-product](https://github.com/sharetribe/ftw-product). FTW-hourly focuses on time-based booking
> processes. You can read more in the
> [Flex Docs article introducing FTW-hourly](https://www.sharetribe.com/docs/ftw-introduction/ftw-hourly/).
> FTW-product focuses on product marketplace with listing stock management. You can find more
> information in the
> [introduction to FTW-product Flex Docs](https://www.sharetribe.com/docs/ftw-introduction/ftw-product/).

## Quick start

If you just want to get the app running quickly to test it out, first install
[Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/), and follow along:

```sh
git clone git@github.com:sharetribe/ftw-daily.git      # clone this repository
cd ftw-daily/                                          # change to the cloned directory
yarn install                                                   # install dependencies
yarn run config                                                # add the mandatory env vars to your local config
yarn run dev                                                   # start the dev server, this will open a browser in localhost:3000
```

You can also follow along the
[Getting started with FTW](https://www.sharetribe.com/docs/tutorials/getting-started-with-ftw/)
tutorial in the [Flex Docs website](https://www.sharetribe.com/docs/).

For more information of the configuration, see the
[FTW Environment configuration variables](https://www.sharetribe.com/docs/references/ftw-env/)
reference in Flex Docs.

### For Windows users

Change `export` to `set` in the package.json file if you're using Windows/DOS. You need to do the
change to "dev" and "dev-sever" commands.

```
"dev": "yarn run config-check&&set NODE_ENV=development REACT_APP_DEV_API_SERVER_PORT=3500&&concurrently --kill-others \"yarn run dev-frontend\" \"yarn run dev-backend\""
```

```
"dev-server": "set NODE_ENV=development PORT=4000 REACT_APP_CANONICAL_ROOT_URL=http://localhost:4000&&yarn run build&&nodemon --watch server server/index.js"
```

We strongly recommend installing
[Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/about), if you are
developing on Windows. These templates are made for Unix-like web services which is the most common
environment type on host-services for web apps. Also, Flex Docs uses Unix-like commands in articles
instead of DOS commands.

## Getting started with your own customization

If you want to build your own Flex marketplace by customizing the template application, see the
[How to Customize FTW](https://www.sharetribe.com/docs/guides/how-to-customize-ftw/) guide in Flex
Docs.

## Deploying to Heroku

**Note:** Remember to fork the repository before deploying the application. Connecting your own
Github repository to Heroku will make manual deploys easier.

See the
[How to deploy FTW to production](https://www.sharetribe.com/docs/guides/how-to-deploy-ftw-to-production/)
guide in Flex Docs for more information.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Documentation

See the Flex Docs site: https://www.sharetribe.com/docs/

See also the [docs/](docs/) directory for some additional internal documentation.

## Get help – join Sharetribe Flex Developer Slack channel

If you have any questions about development, the best place to ask them is the Flex Developer Slack
channel at https://www.sharetribe.com/flex-slack

## License

This project is licensed under the terms of the Apache-2.0 license.

See [LICENSE](LICENSE)
