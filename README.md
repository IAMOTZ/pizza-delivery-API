# Pizza Delivery API 
A Restful JSON API for a typical pizza-delivery company.
This project is written with NodeJS alone(without any NPM package).

## Features
- Anybody can create an account
- Registered Users can log in
- Authorized Users can log out
- Authorized users can edit their account
- Authorized users can delete their account
- Authorized users can get pizza menu
- Authorized users can create pizza order
- Email notification for every pizza order
- Stripe Integration to charge credit cards

## API Endpoints
### Ping
----  
#### `POST /ping`
* **Description:** An endpoint to know if the server is still alive or not.
* **Success Response:**
  * **Code:** `200` 
  * **Content:** `{ message: 'I am Alive' }`
 
* **Error Response:**
  * If the server is not alive, the request won't be successful.
  
### Users
----
#### `POST /users`
* **Description:** An endpoint to create a new user.
* **Data Params**
   `name=[string]`
   `email=[string]`
   `streetAddress=[string]`
   `password=[string]`
* **Success Response:**
  * **Code:** `201 `
  * **Content:** `{ message: <success message>, user: <user details> }`
* **Error Response:**
  * **Code:** `400(validation error)`
  * **Content:** `{ error : <error message> }`

#### `PUT /users`
* **Description:** An endpoint to edit an existing user
* **Headers**
  `token=[string]`
* **Data Params**
   `name=[string](optional)`
   `streetAddress=[string](optional)`
   `password=[string](optional)`
* **Success Response:**
  * **Code:** `200 `
  * **Content:** `{ message: <success message>, user: <edited user details> }`
* **Error Response:**
  * **Code:** `400(valildation error)` | `401(unauthorised)` | `404(user not found)`
  * **Content:** `{ error : <error message> }`

#### `DELETE /users/delete`
* **Description:** An endpoint to delete an existing user
* **Headers**
  `token=[string]`
* **Success Response:**
  * **Code:** `200 `
  * **Content:** `{ message: <success message> }`
* **Error Response:**
  * **Code:** `401(unauthorised)` | `404(user not found)`
  * **Content:** `{ error : <error message> }`

### Authentication
----  
#### `POST /login`
* **Description:** An endpoint to login(create a token)
* **Data Params**
   `email=[string]`
   `password=[string]`
* **Success Response:**
  * **Code:** `200 `
  * **Content:** `{ message: <success message>, token: <auth token> }`
* **Error Response:**
  * **Code:** `400(valildation error)`
  * **Content:** `{ error : <error message> }`

#### `POST /logout`
* **Description:** An endpoint to logout(destroy a token)
* **Headers**
  `token=[string]`
* **Success Response:**
  * **Code:** `204`
  * **Content:** `{}`
* **Error Response:**
  * **Code:** `400(valildation error)`
  * **Content:** `{ error : <error message> }`

### Orders
----  
#### `GET /menuItems`
* **Description:** An endpoint to get the orderables(pizza menu)
* **Headers**
  `token=[string]`
* **Success Response:**
  * **Code:** `200 `
  * **Content:** `{ message: <success message>, menuItems: <the pizza menu> }`
* **Error Response:**
  * **Code:** `401(unauthorised)`
  * **Content:** `{ error : <error message> }`

#### `POST /order`
* **Description:** An endpoint to create an order
* **Headers**
  `token=[string]`
* **Data Params**
   `items=[array]`(IDs of menu items to order)
   `cardToken=[string]`(this can be left out to avoid actual charging of credit card)
* **Success Response:**
  * **Code:** `200 `
  * **Content:** `{ message: <success message> }`
  * **Others:** 
    The creator of the order should receive an email notification.
    The credit card identified with the `cardToken` should be debited.
* **Error Response:**
  * **Code:** `401(unauthorised)` | `400(valildation error)`
  * **Content:** `{ error : <error message> }`

## How to set it up
If you would like to set up the project locally and play-around/contribute to the project, follow the instructions below:
#### Prerequisites:
- [Git](https://git-scm.com/)
- [Node](https://nodejs.org/)
> This app was built with Node version 8.11.1, so ensure you have something similar.
#### Installation:
- Clone the repository `git clone https://github.com/IAMOTZ/pizza-delivery-API.git`
- Change into the root directory of the project
- create a `config.js` file to provide all the needed configuration as specified in `config.example.js`
- Use `node ./index.js` to start the app. Default port is `7000`

## How this program came to be?
I like to include this section in most of my personal projects/programs. It reminds me(and inform you) of what made me built the project. 
This project is one of the assignments given in the [NodeJS Master Class Course](https://pirple.thinkific.com/courses/the-nodejs-master-class#cst-v2-section-ad04065c69) I am currently taking.
