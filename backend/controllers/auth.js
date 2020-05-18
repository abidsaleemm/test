const { pick, assign, get } = require("lodash");
const bcrypt = require("bcrypt");
const { User, createValidate, updateValidate } = require("../models/user");
const {
  notFound,
  invalidCredential,
  serverError,
  userAlreadyRegistered,
  badRequest,
  Roles
} = require("../constants");

async function login(req, res, next) {
  try {
    const { email = "", password = "" } = req.body || {};
    if (!req.body.email) {
      return res.status(badRequest.code).send("Email is empty.");
    } else if (req.body.password.length < 8) {
      return res
        .status(badRequest.code)
        .send("Password should be at least 8 letters.");
    }

    const user = await User.findOne({ email: req.body.email })
      .select(
        "_id password email firstName lastName role preferredWorkingHours"
      )
      .exec();
    if (!user) {
      return res
        .status(notFound.code)
        .send(
          `${notFound.message} Please check your email and password again. They do not match.`
        );
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = user.getAuthToken();
      res.json({
        info: pick(user, [
          "_id",
          "firstName",
          "lastName",
          "email",
          "role",
          user.role < Roles.ADMIN ? "preferredWorkingHours" : ""
        ]),
        token
      });
    } else {
      res.status(invalidCredential.code).send(invalidCredential.message);
    }
  } catch (error) {
    res.status(serverError.code).send(serverError.message);
    next(error);
  }
}

async function signUp(req, res, next) {
  try {
    const { error } = createValidate(req.body);
    if (error)
      return res
        .status(400)
        .send(get(error, "details.0.message", "Something went wrong."));

    let user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(userAlreadyRegistered.code)
        .send(userAlreadyRegistered.message);

    user = new User(
      pick(req.body, ["firstName", "lastName", "email", "password"])
    );
    const newUser = await user.save();
    res.send({
      user: pick(newUser, [
        "firstName",
        "lastName",
        "email",
        "_id",
        "preferredWorkingHours"
      ])
    });
  } catch (error) {
    res.status(serverError.code).send(serverError.message);
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const { error } = updateValidate(req.body);
    if (error)
      return res
        .status(400)
        .send(get(error, "details.0.message", "Something went wrong."));

    const user = await User.findOne({ _id: req.user._id });
    assign(user, req.body, { role: get(req.user, "role", 0) });
    const updatedUser = await user.save();
    const token = updatedUser.getAuthToken();
    res.json({
      info: pick(updatedUser, [
        "_id",
        "firstName",
        "lastName",
        "email",
        "role",
        req.user.role < Roles.ADMIN ? "preferredWorkingHours" : ""
      ]),
      token
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  login,
  signUp,
  updateProfile
};
