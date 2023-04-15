// src/app.js

import { Auth, getUser } from './auth';
import { getUserFragments, postUser, putFragment, deleteFragment, getFragmentById, getFragmentMetadataById } from './api';

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
  const fileUpload = document.querySelector('#file');
  var viewFragmentsSection = document.querySelector("#viewFragments");
  const getFragmentBtn = document.querySelector("#getFragmentBtn");

// update fragment query selector
  const updateFragmentSection = document.querySelector("#update-fragment");
  const updateContent = document.querySelector("#update-fragment-title");
  const updateContentType = document.querySelector("#update-content-type");
  const updateFileUpload = document.querySelector("#update-file");
  const updateFragmentId = document.querySelector("#update-fragment-id");
  const updateFragmentBtn = document.querySelector("#updateFragmentBtn");

 // get by id fragment query selector
 const getByIdFragmentSection = document.querySelector("#getById-fragment");
  const getByIdFragmentId = document.querySelector("#Get-By-fragment-id");
  const getByIdFragmentBtn = document.querySelector("#GetByIdFragmentBtn");
  const getByIdFragmentMetadataBtn = document.querySelector("#GetByIdFragmentMetadataBtn");
  const infoData = document.querySelector("#my_div");


  // delete fragment query selector
  const deleteFragmentSection = document.querySelector("#delete-fragment");
  const deleteFragmentId = document.querySelector("#delete-fragment-id");
  const deleteFragmentBtn = document.querySelector("#deleteFragmentBtn");


  // show the error message content selector
  const error1 = document.querySelector("#error1");
  const error2 = document.querySelector("#error2");
  const error3 = document.querySelector("#error3");
  const error4 = document.querySelector("#error4");
  const error5 = document.querySelector("#error5");
  const errorDeleteID = document.querySelector("#error-delete-id");
  const errorGetByIdID = document.querySelector("#error-get-by-id");

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

//show the update fragment section
updateFragmentSection.hidden = false;


//show the delete fragment section
deleteFragmentSection.hidden = false;

// show the get by id fragment section
getByIdFragmentSection.hidden = false;

// Disable the Login button
  loginBtn.disabled = true;


  // show the new fragment form
  fragmentSection.hidden = false;

  // Show the user's username
  userSection.querySelector('.username').innerText = user.username;

 // call the API to post a new fragment
 newFragment.onclick = () => {

  if(contentType.value == "image/jpeg" || contentType.value == "image/png" || contentType.value == "image/webp") {

    if(fileUpload.value === ""){
      error2.hidden = false;
      error1.hidden = true;
    }else{
    postUser(user, fileUpload.value, contentType.value);
    }

  }else if (contentType.value == "text/plain" || contentType.value == "text/html" 
  || contentType.value == "text/markdown" || contentType.value == "text/plain; charset=utf-8" 
  || contentType.value == "application/json"){
    if(content.value === ""){
      error1.hidden = false;
      error2.hidden = true;
    }else{
      postUser(user, content.value, contentType.value);
    }
  }
};

// call the API to update a fragment
updateFragmentBtn.onclick = () => {
  if(updateFragmentId.value === ""){
    error3.hidden = false;
    error4.hidden = true;
    error5.hidden = true;
  }
    else {
      if(updateContentType.value == "image/jpeg" || updateContentType.value == "image/png" || updateContentType.value == "image/webp") {

        if(updateFileUpload.value === ""){
          error5.hidden = false;
          error4.hidden = true;
          error3.hidden = true;
        }else{
        putFragment(user,  updateFragmentId.value, updateContentType.value, updateFileUpload.value);
      }
    }else if (updateContentType.value == "text/plain" || updateContentType.value == "text/html" 
      || updateContentType.value == "text/markdown" || updateContentType.value == "text/plain; charset=utf-8" 
      || updateContentType.value == "application/json"){
        if(updateContent.value === ""){
          error4.hidden = false;
          error3.hidden = true;
          error5.hidden = true;
        }else{
        putFragment(user,  updateFragmentId.value, updateContentType.value, updateContent.value);
        }
      }
    }
};

// call the API to delete a fragment
deleteFragmentBtn.onclick = () => {
  if(deleteFragmentId.value === ""){
    errorDeleteID.hidden = false;
  }else{
    deleteFragment(user, deleteFragmentId.value);
  }

};


// call the API to get a fragment by id
getByIdFragmentBtn.onclick = async () => {
  if(getByIdFragmentId.value === ""){
    errorGetByIdID.hidden = false;
  }else{
    var res = await getFragmentById(user, getByIdFragmentId.value);
  //   if(res[0].includes("application/json")){
  //     infoData.innerHTML = JSON.stringify(res[1]);
  //   }else{
  //   infoData.innerHTML = res;
  // }
  infoData.innerHTML = res;

}
};

// call api to get a fragment by id
GetByIdFragmentMetadataBtn.onclick = async () => {
  if(getByIdFragmentId.value === ""){
    errorGetByIdID.hidden = false;
  }else{
    var res = await getFragmentMetadataById(user, getByIdFragmentId.value);
    const metadata = JSON.stringify(res);
    infoData.innerHTML = metadata;
  }
};

};

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