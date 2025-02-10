import db from "../models/index.js";
import authconfig from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const User = db.user;
const Session = db.session;
const Op = db.Sequelize.Op;

import { google } from "googleapis";

const exports = {};

exports.login = async (req, res) => {
  try {
    console.log(req.body);
    const googleToken = req.body.credential;
    if (!googleToken) {
      return res.status(400).send({ message: "Missing Google token" });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    let googleUser;

    try {
      const ticket = await client.verifyIdToken({
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      googleUser = ticket.getPayload();
    } catch (error) {
      console.error("Google token verification failed:", error);
      return res.status(401).send({ message: "Invalid Google token" });
    }

    let { email, given_name: firstName, family_name: lastName } = googleUser;

    if ((!email || !firstName || !lastName) && req.body.accessToken) {
      try {
        const oauth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        oauth2Client.setCredentials({ access_token: req.body.accessToken });
        const oauth2 = google.oauth2({ auth: oauth2Client, version: "v2" });
        const { data } = await oauth2.userinfo.get();
        email = email || data.email;
        firstName = firstName || data.given_name;
        lastName = lastName || data.family_name;
      } catch (error) {
        console.error("Failed to retrieve user info:", error);
        return res
          .status(500)
          .send({ message: "Failed to retrieve user info" });
      }
    }

    if (!email) {
      return res.status(400).send({ message: "Unable to retrieve email" });
    }
    console.log(`User login attempt: ${email}`);

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({ fName: firstName, lName: lastName, email });
      console.log("User registered:", user.dataValues);
    } else {
      await user.update({ fName: firstName, lName: lastName });
      console.log("User details updated");
    }

    let session = await Session.findOne({
      where: { email, token: { [Op.ne]: "" } },
    });

    if (session && session.expirationDate < new Date()) {
      await session.update({ token: "" });
      session = null;
    }

    if (!session) {
      const token = jwt.sign({ id: email }, authconfig.secret, {
        expiresIn: 86400,
      });
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 1);

      session = await Session.create({
        token,
        email,
        userId: user.id,
        expirationDate,
      });
    }

    const userInfo = {
      email: user.email,
      fName: user.fName,
      lName: user.lName,
      userId: user.id,
      token: session.token,
    };
    console.log(userInfo);
    return res.send(userInfo);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).send({ message: "Internal server error" });
  }
};

exports.authorize = async (req, res) => {
  console.log("authorize client");
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    "postmessage",
  );

  console.log("authorize token");
  // Get access and refresh tokens (if access_type is offline)
  let { tokens } = await oauth2Client.getToken(req.body.code);
  oauth2Client.setCredentials(tokens);

  let user = {};
  console.log("findUser");

  await User.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((data) => {
      if (data != null) {
        user = data.dataValues;
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
      return;
    });
  console.log("user");
  console.log(user);
  user.refresh_token = tokens.refresh_token;
  let tempExpirationDate = new Date();
  tempExpirationDate.setDate(tempExpirationDate.getDate() + 100);
  user.expiration_date = tempExpirationDate;

  await User.update(user, { where: { id: user.id } })
    .then((num) => {
      if (num == 1) {
        console.log("updated user's google token stuff");
      } else {
        console.log(
          `Cannot update User with id=${user.id}. Maybe User was not found or req.body is empty!`,
        );
      }
      let userInfo = {
        refresh_token: user.refresh_token,
        expiration_date: user.expiration_date,
      };
      console.log(userInfo);
      res.send(userInfo);
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });

  console.log(tokens);
  console.log(oauth2Client);
};

exports.logout = async (req, res) => {
  console.log(req.body);
  if (req.body === null) {
    res.send({
      message: "User has already been successfully logged out!",
    });
    return;
  }

  // invalidate session -- delete token out of session table
  let session = {};

  await Session.findAll({ where: { token: req.body.token } })
    .then((data) => {
      if (data[0] !== undefined) session = data[0].dataValues;
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving sessions.",
      });
      return;
    });

  session.token = "";

  // session won't be null but the id will if no session was found
  if (session.id !== undefined) {
    Session.update(session, { where: { id: session.id } })
      .then((num) => {
        if (num == 1) {
          console.log("successfully logged out");
          res.send({
            message: "User has been successfully logged out!",
          });
        } else {
          console.log("failed");
          res.send({
            message: `Error logging out user.`,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send({
          message: "Error logging out user.",
        });
      });
  } else {
    console.log("already logged out");
    res.send({
      message: "User has already been successfully logged out!",
    });
  }
};

exports.validateToken = async (req, res) => {
  if (req.body.token === undefined || req.body.token === "") {
    res.status(401).send({
      message: "Token missing or invalid. Please provide a valid token.",
      isValid: false,
    });
    return;
  }

  // Check if the token exists in the session table
  let session = {};

  await Session.findOne({ where: { token: req.body.token } })
    .then((data) => {
      if (data !== null) {
        session = data.dataValues;
        if (session.expirationDate > Date.now()) {
          res.status(200).send({
            message: "Valid token.",
            isValid: true,
          });
        } else {
          res.status(401).send({
            message: "Token has expired.",
            isValid: false,
          });
        }
      } else {
        res.status(401).send({
          message: "Invalid token. Please provide a valid token.",
          isValid: false,
        });
      }
    })
    .catch(() => {
      res.status(500).send({
        message: "Error occurred while retrieving session.",
        isValid: false,
      });
    });
};

export default exports;
