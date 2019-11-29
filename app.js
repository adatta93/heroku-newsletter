const express = require('express');
const bp = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bp.urlencoded({
  extended: true
}));
app.use(express.static("public"));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/signup.html');
});

app.post('/', (req, res) => {
  let fName = req.body.fName;
  let lName = req.body.lName;
  let email = req.body.email;
  console.log(fName, lName, email);
  let data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fName,
        LNAME: lName
      }
    }]
  };
  axios({
      method: 'post',
      url: process.env.MAIL_URL + 'lists/' + process.env.LIST_ID,
      headers: {
        'Authorization': 'anik ' + process.env.MAIL_API_KEY
      },
      data: JSON.stringify(data)
    })
    .then(function(response) {
      console.log('Success', response);
      console.log('Success Data', response.data.new_members);
      console.log('Success Err Data', response.data.errors);
      if (response.data.error_count > 0) {
        res.sendFile(__dirname + '/failure.html');
      } else {
        res.sendFile(__dirname + '/success.html');
      }
    })
    .catch(function(error) {
      console.log('Err', error);
      res.sendFile(__dirname + '/failure.html');
    });
});

app.listen(process.env.PORT || 3000, () => console.log('Server is running at 3000'));
