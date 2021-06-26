![](packages/kappa-consumer/src/assets/images/logo.png)

<p align="center">
 
  <h1 align="center">MR NOMAD</h1>

  <p align="center">
  MR Nomad is your ultimate one-stop solution into becoming a gentleman: a man of refreshing candor who is known for his well-made scent statements.
<br/>
<br/>
MR Nomad was conceived in honour of the modern men who look and feel their very best.
<br/>
<br/>
We believe that becoming a gentleman is a journey rather than a destination. And we’ve resolved to accompany all aspiring gentlemen to be their constant companion.
  </p>
</p>

<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <br/>
  
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
     <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
     <li><a href="#tech-stack">Tech Stack</a></li>
        <li><a href="#3rd-party-inegration">Tools and Integration<a></li>
    <li><a href="#resources">Resources</a></li>
    <li><a href="#developers">Developers</a></li>

  </ol>
</details>

## About The Project

<br/>

`Mr Nomad is an ecommerce platform which can be customized by utilizing an Admin Panel. <br/> The responsive nature of Kappa allows customers to shop from any and every device they own, with ease. <br/> A dedicated Admin Panel comes in handy for inventory management and to control the platform’s look and feel. <br/> It is equipped with the ability to create personal accounts that enables customers to have a profile section of their own, which also allows them to save a product to their cart, and shop anytime they find suitable. `

## Features

<br/>

**Authentication** - using email & password with forgot password.
<br/>
**Search** - Help users to search products, by title & description.<br/>
**Filters** - Filter products according Price, size, category etc. <br/>
**Cart** - Bag to put all items you are willing to purchase <br/>
**Payment Method** - Pay using Paypal & Cash On Delivery <br/>
**Manage Profile** - Update Address, Account Details <br/>
**Priority Products** Select which products needs to be appear on priority to users <br/>

### ADMIN Features

**Manage Products** Add/Update/Delete Products from Admin Dashboard <br/>
**Manage Orders** Add/Update Orders from Admin Dashboard <br/>
**Manage Categories** Add/Update Categories from Admin Dashboard <br/>
<br/>

## Live Link

Consumer App Link: [MR NOMAD]()

Admin App Link: [Contact US]()

<!-- GETTING STARTED -->

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.

- npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repos backend & frontend
   ```sh
   https://github.com/pesto-students/n2-kappa-backend-kappa.git
   ```
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
2. Install NPM packages in both

   ```sh
   npm install
   ```

3. Add the `.env` file in the root for backend app.

   NODE_ENV=production
   </br>
   APP_NAME="APP SERVER"
   </br>
   APP_DOMAIN=''
   </br>
   PORT=5000
   </br>
   APP_PORT=5001
   </br>
   CLIENT_URL=''
   </br>
   APP_SECRET=''
   </br>
   DATABASE_CLOUD=''
   </br>
   DATABASE_LOCAL=''
   </br>
   SENDGRID_API_KEY=''
   </br>
   APP_HOST_EMAIL='' </br>
   AWS_BUCKET_NAME=""</br>
   AWS_BUCKET_REGION=""</br>
   AWS_ACCESS_KEY=""</br>
   AWS_SECRET_KEY=""
   </br>
   JWT_COOKIE_EXPIRE=30 </br>
   PAYPAL_CLIENT_ID=''

4. Run the backend server

```sh
npm run dev
```

5. Run the frontend app

```sh
npm run start
```

### Tech Stack

- [React.js](https://reactjs.org/)
- [Redux](https://redux.js.org/)
- [Node.js](https://nodejs.org/en/)
- [MongoDB](https://www.mongodb.com/)

### 3rd Party Inegration

- [PayPal](https://developer.paypal.com/home)
- [AWS S3](https://aws.amazon.com/)

### Tools

- [Netlify](https://www.netlify.com/)
- [Adobe XD](https://www.adobe.com/products/xd.html)
- [Draw.io](https://app.diagrams.net/)
- [Trello](https://trello.com/)
- [DigitalOcean](https://cloud.digitalocean.com/projects)
- [Github](https://github.com/)

### For Security

<br/>

1. <b>Helmet</b> - Helmet. js is a useful Node. js module that helps you secure HTTP headers returned by your Express apps. HTTP headers are an important part of the HTTP protocol, but are generally transparent from the end-user perspective.
   <br/>
   <br/>
2. <b>Sanitize</b> - HTTP request isn't only about making sure that the data is in the right format, but also that it is free of noise and sanitizes inputs against query selector injection attacks.
   <br/>
   <br/>

3. <b>XXS</b> - Sanitize untrusted HTML (to prevent XSS) with a configuration specified by a Whitelist. sanitize any data in req.body, req.query, and req.params.

  <br/>

#### Source Code Repo

    This one is the Migrated Repo, for more info about PR, commits refer below links

- [Frontend Source Repo](https://github.com/amanajmani/kappa-web/)

- [Backend Source Repo](https://github.com/dipanshuraz/kappa-backend/)

## Resources

- [Design Files]()
- [PRD]()
- [High Level Design](https://drive.google.com/file/d/1V3scaK84cyghzRfraft4ELtlWIMqx-Bh/view?usp=sharing)

## Developers

- [Deepanshu Prajapati](https://github.com/dipanshuraz)
- [Aman Ajmani](https://github.com/amanajmani)
