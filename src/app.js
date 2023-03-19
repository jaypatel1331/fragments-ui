// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, postUser } from './api';

var user;

async function init() {
  // Get our UI elements
  const userSection = document.querySelector('#user');
  const loginBtn = document.querySelector('#login');
  const logoutBtn = document.querySelector('#logout');
  const newFragment = document.querySelector('#new-fragment');
  const content = document.querySelector('#new-fragment-title');
  const fragmentSection = document.querySelector('#fragment');
  const contentType = document.querySelector('#content-type');
  var viewFragmentsSection = document.querySelector("#viewFragments");
  const getFragmentBtn = document.querySelector("#getFragmentBtn");


    // Retrieve all fragments
    getFragmentBtn.onclick = () => {
      addFragmentToTable();
    };


  // Wire up event handlers to deal with login and logout.
  loginBtn.onclick = () => {
    // Sign-in via the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/advanced/q/platform/js/#identity-pool-federation
    Auth.federatedSignIn();
  };
  logoutBtn.onclick = () => {
    // Sign-out of the Amazon Cognito Hosted UI (requires redirects), see:
    // https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
    Auth.signOut();
  };
  
  // See if we're signed in (i.e., we'll have a `user` object)
  user = await getUser();

  // Do an authenticated request to the fragments API server and log the result
  getUserFragments(user);
  
  if (!user) {
    // Disable the Logout button
    logoutBtn.disabled = true;
    return;
  }
  else {
    // if we are signed in, trigger a get request
    addFragmentToTable();
  }

  // Log the user info for debugging purposes

  console.log({ user });

  // Update the UI to welcome the user
  userSection.hidden = false;

  //show the view fragments section
  viewFragmentsSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

  // Disable the Login button
  loginBtn.disabled = true;


  // show the new fragment form
  fragmentSection.hidden = false;

  

 // call the API to post a new fragment
 newFragment.onclick = () => {
  postUser(user, content.value, contentType.value);
};
}

// function to populate the table with fragments
function addFragmentToTable() {

  
  let fragmentHtml = "";
  let fragmentList = document.querySelector(".fragmentList");
  fragmentList.innerHTML = "";
  getUserFragments(user).then((data) => {
    if (data.length) {
      // Create the titles for each column and add to the table
      let header = document.createElement("tr");
      let headerOptions = [
        "ID",
        "Created",
        "Updated",
        "Type"
      ];
      for (let column of headerOptions) {
        let th = document.createElement("th");
        th.append(column);
        header.appendChild(th);
      }
      fragmentList.appendChild(header);

      for (let fragment of data) {
        let tr = document.createElement("tr");
        let id = document.createElement("td");
        let created = document.createElement("td");
        let updated = document.createElement("td");

        let type = document.createElement("td");

        id.append(fragment.id);
        created.append(fragment.created);
        updated.append(fragment.updated);
        type.append(fragment.type);
        tr.append(id, created, updated, type);

        fragmentList.appendChild(tr);
      }
    } else {
      let td = document.createElement("td");
      td.append("No fragments were found");

      fragmentList.append(td);
    }
  });
  fragmentList.html = fragmentHtml;
}

// Wait for the DOM to be ready, then start the app
addEventListener('DOMContentLoaded', init);