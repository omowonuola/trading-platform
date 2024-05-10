TypeScript Trading Platform Project


API

- REST API With TypeScript and Fastify
- Folder Structure

## 1. Getting started
## Project goals

Implement a trading platform where sellers can post and update Deals and buyers can retrieve them. When a Deal is posted to the platform, a new deal alert should also be sent to all the buyers who are authorised to see the seller’s Deals.

### 1.1 Requirements

Before starting, make sure you have these components on your local machine:

- An up-to-date release of [NodeJS](https://nodejs.org/) and NPM

### 1.2 Project configuration

Start by cloning this project on your local machine.

``` sh
git clone https://github.com/omowonuola/trading-platform.git
npm install to install dependencies
NOTE: The main branch is the updated branch for the codebase

RUN WITH SERVER(npm)

The next step will be to install all the dependencies of the project.

```sh
use npm install for the server dependencies installation
```

For a standard development configuration, you can leave the default values for PORT, which has the default value of 3000.

### 1.3 Launch and discover with NPM

You are now ready to launch the NestJS application using the command below.

```sh

# Launch the development server with npm command

npx prisma migrate dev --name init(prisma migration)

npm run dev

```

## 2. Design Decisions

```sh

The design decisions were implemented to create a trading application that is scalable, secure, and efficient. Using the model that helps to accommodate a large number of deal records, the application efficiently implemented a trading platform where sellers can post and update deals and buyers can retrieve them. When a deal is posted to the platform, a new deal alert is sent to all the buyers who are authorised to see the seller’s Deals.

```sh

```

## 3. Default NPM commands

The NPM commands below are already included with this template and can be used to quickly run, build and test the project.

```sh
# Start the application using npm NodeJS in development
npm run dev (use this to start the application locally)

# Run the project' UNIT TESTS
npm test(use this to start the unit testing locally)
```

```
