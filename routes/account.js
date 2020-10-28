const router = require("express").Router();
const Account = require("../models/Account");

/**
 * Login and receive a JSONWebToken.
 * https://github.com/just1ngray/CSCI3428/wiki/HTTP-Endpoints#post-apiaccountlogin
 * @author Justin Gray (A00426753)
 */
router.post("/login", async (req, res) => {
  const email = String(req.body.username).toLowerCase();
  const password = req.body.password;

  const account = await Account.findOne({ email });

  // In a highly secure application, we should not confirm or
  // deny the existance of accounts by an email address.
  // But for this application it might be helpful to have more
  // detailed error messages.
  if (!account) return res.status(404).send("Account not found.");

  const isValidPassword = await account.isValidPassword(password);
  if (isValidPassword) {
    res.send({
      token: account.getAuthToken(),
      childType: account.childType,
    });
  } else {
    res.status(403).send("Wrong password.");
  }
});

/**
 * Change your account's name, email, or password.
 * https://github.com/just1ngray/CSCI3428/wiki/HTTP-Endpoints#put-apiaccountchange-credentialsaccount_id
 * @author Justin Gray (A00426753)
 */
router.put("/change-credentials/:account_id", async (req, res) => {
  const account_id = req.params.account_id;
  const currentPW = req.body.currentPW;

  // optionals
  const newEmail = req.body.newEmail;
  const newPW = req.body.newPW;
  const newName = req.body.newName;

  try {
    const account = await Account.findById(account_id);
    if (!account) return res.status(404).send("Account not found.");

    const isAuthed = await account.isValidPassword(currentPW);
    if (!isAuthed) return res.status(403).send("Wrong current password.");

    if (newPW !== undefined) account.password = newPW;
    if (newEmail !== undefined) account.email = newEmail;
    if (newName !== undefined) account.name = newName;

    account
      .save()
      .then((acc) => res.send(acc.getAuthToken()))
      .catch((err) => res.status(400).send(`Could not save. ${err.message}`));
  } catch {
    res.status(400).send(`${account_id} is not a valid Mongo ObjectID`);
  }
});

module.exports = router;
